import "dotenv/config"
import { BaseMessage, HumanMessage } from "@langchain/core/messages"
import { END, MemorySaver, MessagesZodMeta, START, StateGraph } from "@langchain/langgraph"
import { registry } from "@langchain/langgraph/zod"
import { ChatOpenAI } from "@langchain/openai"
import { MongoClient } from "mongodb"
import readline from "readline-sync"
import { z } from "zod/v4"
import { MongoSaver } from "./MongoSaver.ts"

// 用户系统
const users = {
	aaa: { password: "111", thread_id: "thread-aaa" },
	bbb: { password: "222", thread_id: "thread-bbb" }
}

const Schema = z.object({
	messages: z.array(z.custom<BaseMessage>()).register(registry, {
		...MessagesZodMeta,
		default: () => []
	})
})

type TState = z.infer<typeof Schema>

const model = new ChatOpenAI({
	model: "gpt-5.6-luna",
	temperature: 0.5,
	configuration: {
		baseURL: "https://api.amux.ai/v1"
	}
})

// 聊天的节点
async function chatNode(state: TState): Promise<Partial<TState>> {
	const res = await model.invoke(state.messages)

	return {
		messages: [res]
	}
}

// const checkpointer = new MemorySaver()
// 切换成自定义的mongodb的checkpointer
const client = new MongoClient("mongodb://localhost:27017")
await client.connect()
const db = client.db("graphmongodb")
const collection = db.collection("checkpoints")
const checkpointer = new MongoSaver(collection)

// 图
const graph = new StateGraph(Schema)
	.addNode("chatNode", chatNode)
	.addEdge(START, "chatNode")
	.addEdge("chatNode", END)
	.compile({ checkpointer })

async function main() {
	while (true) {
		console.log("\n--- 登录 ---")
		const username = readline.question("请输入用户名：")
		const password = readline.question("请输入密码：", {
			hideEchoBack: true
		})

		const user = users[username]
		if (!user || user.password !== password) {
			console.log("登录失败☹️")
			continue
		}

		// 登录成功
		console.log(`✅ 登录成功，当前用户：${username}`)
		console.log("输入 /switch 可切换用户\n")

		const config = {
			configurable: {
				thread_id: user.thread_id // 这个非常重要，这个保证了不同的用户拥有不同的state
			}
		}

		// 处理用户的对话
		while (true) {
			const input = readline.question(`${username}>`)
			if (input === "/switch") {
				console.log("切换用户中...")
				break
			}

			// 这里只需要传入当前这一轮的输入消息
			const result = await graph.invoke(
				{
					messages: [new HumanMessage(input)]
				},
				config
			)

			// 返回的结果就是完整的状态
			const aiMsg = result.messages.at(-1)

			console.log(`AI> ${aiMsg?.content}`)
		}
	}
}

await main()
