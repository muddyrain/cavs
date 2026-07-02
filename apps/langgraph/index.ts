import type { BaseMessage } from "@langchain/core/messages"
import { ChatOllama } from "@langchain/ollama"
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
