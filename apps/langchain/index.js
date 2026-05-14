import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import {
	ChatPromptTemplate,
	HumanMessagePromptTemplate,
	MessagesPlaceholder,
	SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/ollama";
import readlineSync from "readline-sync";

// 1. 模型
const model = new ChatOllama({
	model: "llama3",
	temperature: 0.7,
});

// 2. 提示词
const pt = ChatPromptTemplate.fromMessages([
	SystemMessagePromptTemplate.fromTemplate(
		"你是一个健谈的中文 AI 助手，请结合上下文尽可能详细地使用中文回答用户问题。"
	), // 系统提示词
	new MessagesPlaceholder("history"), // 会话的历史记录，一开始是一个占位符
	HumanMessagePromptTemplate.fromTemplate("{input}"), // 用户输入的内容
]);

// 3. 存储会话历史
const history = new InMemoryChatMessageHistory();

// 4. 创建一个chain
const chain = pt.pipe(model);

async function chatLoop() {
	console.log("开始会话，输入内容后回车；输入 /clear 清空历史，/exit 退出。");

	while (true) {
		const input = readlineSync.question("用户：").trim();
		if (!input) continue;

		if (input === "/exit") {
			console.log("拜拜");
			break;
		}

		if (input === "/clear") {
			await history.clear();
			console.log("历史记录已清空");
			continue;
		}

		let fullRes = ""; // 记录完整的信息
		try {
			const values = {
				input, // 用户本次的输入
				history: await history.getMessages(), // 获取之前会话记录
			};
			const stream = await chain.stream(values);
			process.stdout.write("助理：");
			for await (const chunk of stream) {
				// @ts-ignore
				process.stdout.write(chunk.content);
				fullRes += chunk.content;
			}
			console.log("\n");
		} catch (err) {
			console.error("调用大模型失败☹️", err);
		}

		// 将本轮会话记录到历史里面
		await history.addMessage(new HumanMessage(input));
		await history.addMessage(new AIMessage(fullRes));
	}
}
chatLoop();
