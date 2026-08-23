import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai"
import "dotenv/config"
import { createApprovalForm } from "./tools.ts"

export const model = new ChatOpenAI({
	model: "gpt-5.6-terra",
	temperature: 0,
	configuration: {
		baseURL: "https://api.shuaiapi.com/v1"
	}
})

export const modelWithTool = model.bindTools([createApprovalForm])

export const embeddings = new OpenAIEmbeddings({
	model: "Qwen/Qwen3-VL-Embedding-8B",
	apiKey: process.env.SILICONFLOW_API_KEY,
	configuration: {
		baseURL: "https://api.siliconflow.cn/v1"
	}
})
