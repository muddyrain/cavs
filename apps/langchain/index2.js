import { HumanMessage } from "@langchain/core/messages"
import { ChatOllama } from "@langchain/ollama"

const chatModel = new ChatOllama({
	model: "llama3",
	temperature: 0.7
})

const response = await chatModel.invoke([new HumanMessage("用中文给我讲一个笑话")])

console.log(response)
