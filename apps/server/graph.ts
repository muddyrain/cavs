import { ChatOllama } from "@langchain/ollama"

// 负责生成笑话的模型
export const jokeModel = new ChatOllama({
	model: "llama3",
	tags: ["joke"],
	streaming: true
})

// 负责生成诗歌的模型
export const poemModel = new ChatOllama({
	model: "llama3",
	tags: ["poem"],
	streaming: true
})
