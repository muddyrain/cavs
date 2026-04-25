import { StringOutputParser } from "@langchain/core/output_parsers"
import { PromptTemplate } from "@langchain/core/prompts"
import { RunnableLambda, RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables"
import { ChatOllama } from "@langchain/ollama"

// 记录日志
const logFun = new RunnablePassthrough({
	func: async (input) => {
		console.log("用户提出的问题:", input.query)
		return input
	}
})

// 注入 用户id
const injector = RunnablePassthrough.assign({
	userId: async () => "user-123"
})

// 提示词模板
const pt = PromptTemplate.fromTemplate(
	"请使用中文帮用户 {userId} 解释以下概念：{query},回答问题时以亲爱的{userId}称呼他。"
)

// 模型
const model = new ChatOllama({ model: "llama3", temperature: 0.7 })

// 输出解析器
const parser = new StringOutputParser()

// 构建完整的流水线
const chain = RunnableSequence.from([logFun, injector, pt, model, parser])

const res = await chain.stream({
	query: "什么是量子计算？"
})

for await (const chunk of res) {
	process.stdout.write(chunk)
}
