import { Ollama, OllamaEmbeddings } from "@langchain/ollama"
import cosineSimilarity from "cosine-similarity"

const model = new Ollama({
	model: "llama3",
	stream: true
})

// 负责将文本转换为向量的模型
const embedder = new OllamaEmbeddings({
	model: "nomic-embed-text"
})

const cache = [] // 用于做缓存的，存储的是一个一个对象

async function callLLM(inputText, threshold = 0.7) {
	// 1. 首先需要将用户的问题转换为向量
	const queryEmbedding = await embedder.embedQuery(inputText)

	// 2. 做一个比较
	// 当前用户问题的向量和缓存里面的每一项做比较
	for (const item of cache) {
		const score = cosineSimilarity(queryEmbedding, item.embedding)
		if (score >= threshold) {
			console.log("命中了缓存", score)
			// 说明命中缓存了，直接走缓存的答案
			process.stdout.write(item.response)
			return // 一定要结束，提前结束该方法
		}
	}

	// 3. 如果代码来到这儿，没命中缓存
	let fullRes = ""
	const stream = await model.stream(inputText)
	for await (const chunk of stream) {
		process.stdout.write(chunk)
		fullRes += chunk
	}

	// 4. 存储到缓存里面
	cache.push({
		input: inputText, // 用户原始的提示词
		embedding: queryEmbedding, // 提示词对应的向量
		response: fullRes // 模型给的回复
	})
}

const q1 = "请你使用中文介绍一下大象这种动物"
const q2 = "你可以使用中文介绍一下斑马这种动物吗？"

await callLLM(q1)
console.log("\n\n")
await callLLM(q2)
