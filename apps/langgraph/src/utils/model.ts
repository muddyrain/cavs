import "dotenv/config"
import { ChatOpenAI } from "@langchain/openai"

console.log("process.env.OPENAI_API_KEY", process.env.OPENAI_API_KEY)
export const model = new ChatOpenAI({
	model: "gpt-5.6-luna",
	temperature: 0.7,
	configuration: {
		baseURL: "https://api.amux.ai/v1",
		apiKey: process.env.OPENAI_API_KEY
	}
})
