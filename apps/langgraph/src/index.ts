import "dotenv/config"
import { BaseMessage, HumanMessage } from "@langchain/core/messages"
import { END, InMemoryStore, MemorySaver, START, StateGraph } from "@langchain/langgraph"
import { ChatOpenAI } from "@langchain/openai"
import readline from "readline-sync"
import { z } from "zod"
import { embeddings, model } from "./model.ts"

// 图的状态结构，里面只有一项，消息
const StateSchema = z.object({
	messages: z.array(z.custom<BaseMessage>())
})

// 根据Schema生成对应的ts类型
type TState = z.infer<typeof StateSchema>

const store = new InMemoryStore({
	index: {
		embeddings: embeddings,
		dims: 1024
	}
}) // 做长期记忆
const checkpointer = new MemorySaver() // 做短期记忆

// 节点函数 - 聊天
async function chatNode(state: TState, config: any): Promise<Partial<TState>> {
	// 1. 从长期记忆里面获取信息
	// 2. 和大模型进行交流 - 会把长期记忆的信息带过去
	// 3. 判断新的这一轮会话，有没有信息需要存入到长期记忆里面
	const userId = config.configurable.userId
	const namespace = ["user_profile", userId]

	// 取出长期记忆
	// 记忆里面如果有东西：
	/**
   * [
      {
        key: "xxxx",  
        value: {
          data: "我叫张三。"  // 记忆内容
        }
      },
      {
        key: "xxxx",  
        value: {
          data: "我喜欢编程。"  // 另一条记忆内容
        }
      }
    ]
   * 
   */
	// 将当前用户的输入和长期记忆的向量做一个匹配，找出匹配度最高的3条
	const lastMsg = state.messages.at(-1)

	const lastUserMsg = typeof lastMsg?.content === "string" ? lastMsg.content : ""

	// 这里在进行搜索的时候，不再是精确匹配，而是根据向量相似度来进行匹配
	const memories = await store.search(namespace, {
		query: lastUserMsg,
		limit: 3
	})

	// console.log("memories>>>", memories);
	// 取出记忆的内容，组装成一个字符串
	// "我叫张三。\n 我喜欢编程。"
	const memoryText = memories?.map((m) => m.value.data).join("\n") || ""
	// console.log("memoryText>>>", memoryText);
	// 提示词
	const systemPrompt = `
你是一个持续与用户聊天的助手。
以下是你已知的用户长期信息（如果有）：
${memoryText || "（暂无）"}
`

	// 和大模型进行交流
	const response = await model.invoke([
		{ role: "system", content: systemPrompt }, // 系统设定
		...state.messages
	])

	// 需要判断是否有存储到长期记忆里面的必要
	if (shouldSaveToMemory(lastUserMsg)) {
		// 如果进入此分支，说明要做长期记忆
		// 需要做一个信息的提取
		const memory = extractMemory(lastUserMsg)
		if (memory) {
			// 提取到信息了，存
			await store.put(namespace, crypto.randomUUID(), {
				data: memory
			})
			console.log("🧠 [长期记忆已保存]:", memory)
			console.log("memories>>>", memories)
		}
	}

	return {
		messages: [...state.messages, response]
	}
}

function shouldSaveToMemory(text: string): boolean {
	// 定义一组关键字，如果用户说的话包含这些关键词，就认为是个人信息
	const keywords = ["我是", "我叫", "我在", "我的工作", "我喜欢", "记住"]
	return keywords.some((k) => text.includes(k))
}

function extractMemory(text: string): string | null {
	if (text.includes("我叫")) {
		return text
	}
	if (text.includes("我是")) {
		return text
	}
	if (text.includes("我喜欢")) {
		return text
	}
	if (text.includes("我的工作是")) {
		return text
	}
	return null
}

const graph = new StateGraph(StateSchema)
	.addNode("chatNode", chatNode)
	.addEdge(START, "chatNode")
	.addEdge("chatNode", END)
	.compile({
		checkpointer, // 注入短期记忆检查点
		store // 注入长期记忆存储
	})

async function main() {
	const config = {
		configurable: {
			userId: "bill",
			thread_id: "bill-chat"
		}
	}

	let state: TState = {
		messages: []
	}

	console.log("🤖 聊天开始（Ctrl+C 退出）")

	while (true) {
		// 获取用户在终端的输入
		const input = readline.question("\n你：")

		// 将用户的输入封装成 HumanMessage 对象，加入到本地状态
		state.messages.push(new HumanMessage(input))

		const result = await graph.invoke(state, config)

		// console.log("result>>>", result);

		const aiMsg = result.messages.at(-1)

		console.log("\nAI:", aiMsg?.content)

		state = result // 更新本地状态
	}
}

main()
