import { ChatOpenAI } from "@langchain/openai"
import { createAgent } from "langchain"
import tools from "../tools/index.ts"

export type ChatModel = ChatOpenAI

export type Agent = ReturnType<typeof createAgent>

const model: ChatModel = new ChatOpenAI({
	model: "gpt-5.4-mini",
	temperature: 0,
	configuration: { baseURL: "https://api.amux.ai/v1" }
})

// 基于模型创建智能体
const agent: Agent = createAgent({
	model,
	tools,
	systemPrompt: "你是一个聪明的AI智能机器人"
})

export default agent
