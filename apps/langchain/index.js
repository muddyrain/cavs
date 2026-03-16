import {
	ChatPromptTemplate,
	HumanMessagePromptTemplate,
	SystemMessagePromptTemplate
} from "@langchain/core/prompts"
import { ChatOllama } from "@langchain/ollama"

const model = new ChatOllama({
	model: "llama3",
	temperature: 0.7,
	stream: true
})

// 创建多角色的提示词模板

// 1. 创建系统提示词
const sysPrompt = SystemMessagePromptTemplate.fromTemplate(
	"你是一个翻译助理 ,请将用户输入的内容由{input_language}直接翻译为{output_language}."
)

// 2. 创建用户提示词
const humanPrompt = HumanMessagePromptTemplate.fromTemplate("{text}")

// 3. 合成提示词
const chatPrompt = ChatPromptTemplate.fromMessages([sysPrompt, humanPrompt])

// 4. 填充变量
const messages = await chatPrompt.formatMessages({
	input_language: "中文",
	output_language: "英语",
	text: "我是邱顺蒙，你是谁，我是超级大反派！"
})

const res = await model.stream(messages)

for await (const chunk of res) {
	process.stdout.write(chunk.content)
}
