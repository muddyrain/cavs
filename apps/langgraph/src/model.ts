import { ChatOpenAI } from "@langchain/openai"

export const model = new ChatOpenAI({
	model: "gpt-5.6-luna",
	temperature: 0.5,
	configuration: {
		baseURL: "https://api.amux.ai/v1"
	}
})
