import { StringOutputParser } from "@langchain/core/output_parsers"
import { PromptTemplate } from "@langchain/core/prompts"
import { ChatOllama } from "@langchain/ollama"
import { MODEL, TEMPERATURE } from "./config.js"

// 创建模块：提示词模块、模型模块、解析器模块

// 1. 创建提示词
const pt = PromptTemplate.fromTemplate("请严格使用中文解释以下什么是：{topic}")

// 2. 创建模型
const model = new ChatOllama({
	model: MODEL,
	temperature: TEMPERATURE
})

// 3. 创建解析器
const parser = new StringOutputParser()

// 4. 将上面的3个模块 连接起来 ：pipe
export const chain = pt.pipe(model).pipe(parser)
