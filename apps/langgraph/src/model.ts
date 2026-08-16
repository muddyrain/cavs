import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai"
import "dotenv/config"

export const model = new ChatOpenAI({
	model: "gpt-5.6-luna",
	temperature: 0.5,
	configuration: {
		baseURL: "https://api.amux.ai/v1"
	}
})

export const embeddings = new OpenAIEmbeddings({
	model: "Qwen/Qwen3-VL-Embedding-8B",
	apiKey: process.env.SILICONFLOW_API_KEY,
	configuration: {
		baseURL: "https://api.siliconflow.cn/v1"
	}
})
