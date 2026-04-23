import { AIMessage, HumanMessage } from "@langchain/core/messages"
import {
	ChatPromptTemplate,
	HumanMessagePromptTemplate,
	MessagesPlaceholder,
	SystemMessagePromptTemplate
} from "@langchain/core/prompts"

const pt = ChatPromptTemplate.fromMessages([
	SystemMessagePromptTemplate.fromTemplate("你是一个乐于助人的助手"),
	new MessagesPlaceholder("history"),
	HumanMessagePromptTemplate.fromTemplate("用户的问题是：{question}")
])

const res = await pt.invoke({
	question: "你好",
	history: [new HumanMessage("今天天气怎么样？"), new AIMessage("今天天气非常晴朗")]
})

console.log(res)
