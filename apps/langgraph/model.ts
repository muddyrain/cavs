import "dotenv/config"
import { ChatOpenAI } from "@langchain/openai"

export function getChatGPT(): ChatOpenAI {
	return new ChatOpenAI({
		model: "gpt-5.4-mini",
		temperature: 0,
		configuration: { baseURL: "https://api.amux.ai/v1" }
	})
}
