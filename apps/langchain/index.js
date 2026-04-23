import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate, 
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";

// 定义一个聊天 prompt 模版
const chatPrompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate("你是一个乐于助人的助手"),
  HumanMessagePromptTemplate.fromTemplate("请把以下句子翻译成英文：{text}"),
]);

// 渲染成消息数组
const messages = await chatPrompt.formatMessages({ text: "你好" });

console.log(messages);