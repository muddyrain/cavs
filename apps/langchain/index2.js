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

// 3. 创建一个chain
const chain = pt.pipe(model).pipe(new StringOutputParser());

const store = new Map(); // 为每一个会话指定一个 chatMessageHistory 对象
const withHistoryChain = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: (sessionId) => {
    if (!store.get(sessionId)) store.set(sessionId, new InMemoryChatMessageHistory());
    return store.get(sessionId);
  },
  inputMessagesKey: "input",
  historyMessagesKey: "history",
});

const cfg = {
  configurable: {
    sessionId: "zhangsan",
  },
};

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
      const { sessionId } = cfg.configurable;
      store.set(sessionId, new InMemoryChatMessageHistory());
      console.log("历史记录已清空");
      continue;
    }

    try {
      const stream = await withHistoryChain.stream({ input }, cfg);
      process.stdout.write("助理：");
      for await (const chunk of stream) {
        process.stdout.write(chunk);
      }
      console.log("\n");
    } catch (err) {
      console.error("调用大模型失败☹️", err);
    }
  }
}
chatLoop();
