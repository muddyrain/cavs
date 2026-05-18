import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
	ChatPromptTemplate,
	HumanMessagePromptTemplate,
	MessagesPlaceholder,
	SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatOllama } from "@langchain/ollama";

// 1. 模板
const pt = ChatPromptTemplate.fromMessages([
	SystemMessagePromptTemplate.fromTemplate(
		"你是一个健谈的中文 AI 助手，请结合上下文尽可能详细地使用中文回答用户问题。"
	), // 系统提示词
	new MessagesPlaceholder("history"), // 历史记录的占位符
	HumanMessagePromptTemplate.fromTemplate("{input}"), // 用户的输入
]);

// 2. 模型
const model = new ChatOllama({
	model: "llama3",
	temperature: 0.7,
});

// 3. 解析器
const parser = new StringOutputParser();


const store = new Map() // 为每一个 session 指定一个 chatMessageHistory 实例对象

const withHistoryChain = new RunnableWithMessageHistory({
	runnable: pt.pipe(model).pipe(parser),
	getMessageHistory: (sessionId) => {
		if (!store.has(sessionId)) {
			store.set(sessionId, new InMemoryChatMessageHistory());
		}
		return store.get(sessionId);
	},
	inputMessagesKey: "input",
	historyMessagesKey: "history"
})


const cfg = {
	configurable: { sessionId: "zhangsan-sessions" }
}

await withHistoryChain.invoke(
	{
		input: "你知道大象吗？",
	},
	cfg
);

const res = await withHistoryChain.invoke(
	{
		input: "刚才我们聊了啥？",
	},
	cfg
);
console.log(res);
