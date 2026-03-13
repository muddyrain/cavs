import { Ollama } from "@langchain/ollama"

// 创建 Ollama 模型实例
const model = new Ollama({
	model: "llama3"
})

const prompt = "你是一位中文智能助手，请你用中文回答 AI 对人类文明的影响？"

// 调用模型生成回答
const res = await model.stream(prompt)

// 实时读取输出内容
for await (const chunk of res) {
	process.stdout.write(chunk)
}
