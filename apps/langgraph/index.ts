import type { BaseMessage } from "@langchain/core/messages"
import { HumanMessage } from "@langchain/core/messages"
import {
	ChatPromptTemplate,
	MessagesPlaceholder,
	SystemMessagePromptTemplate
} from "@langchain/core/prompts"
import { END, START, StateGraph } from "@langchain/langgraph"
import { ChatOllama } from "@langchain/ollama"
import readlineSync from "readline-sync"
import * as z from "zod"

// 1. 定义一个状态的Scheme
// {messages: [{}, {}, {}], llmCalls: 2}
const Schema = z.object({
	messages: z.array(z.custom<BaseMessage>()), // 存储消息对象的数组
	llmCalls: z.number().optional()
})

// 根据这个Schema就可以产生一个ts类型
type TState = z.infer<typeof Schema>

// 2. 创建模型
const model = new ChatOllama({
	model: "llama3",
	temperature: 0.5
})

// 3. 创建提示词
const pt = ChatPromptTemplate.fromMessages([
	SystemMessagePromptTemplate.fromTemplate(
		"你是一个健谈的中文 AI 助手，请结合上下文尽可能详细地使用中文回答用户问题。"
	),
	new MessagesPlaceholder("messages")
])

// 4. 形成链条
const chain = pt.pipe(model)

// 5. 创建节点（函数）
async function llmNode(state: TState) {
	const result = await chain.invoke({
		messages: state.messages
	})

	// 更新状态
	return {
		messages: [...state.messages, result],
		llmCalls: (state.llmCalls ?? 0) + 1
	}
}

// 6. 构建图
const graph = new StateGraph(Schema)
	.addNode("llm", llmNode)
	.addEdge(START, "llm")
	.addEdge("llm", END)
// 有了图实例对象之后，需要对这个图进行编译
const app = graph.compile()

// 7. 运行对话
async function main() {
	let messages: BaseMessage[] = [] // 本次的消息数组，存储消息的
	let llmCalls = 0 // 记录模型交互次数

	console.log("聊天机器人已启动，输入 exit 退出。\n")

	while (true) {
		const input = readlineSync.question("你：") // 接受用户的输入
		if (input === "exit") break

		// 先将用户的输入推入到 messages 数组里面
		messages = [...messages, new HumanMessage(input)]
		const result = await app.invoke({
			messages,
			llmCalls
		})

		// 本地数据更新
		messages = result.messages
		llmCalls = result.llmCalls ?? 0

		// 获取最后一条消息
		const last = result.messages[result.messages.length - 1]
		console.log("智能体：", last.content, "\n")
	}

	// 代码来到这里，说明对话结束
	console.log(`结束对话，总共调用 LLM 次数：${llmCalls}`)
}
main()
