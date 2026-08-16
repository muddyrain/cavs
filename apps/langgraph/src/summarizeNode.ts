// 这是图里面的一个节点：用于对对话进行压缩总结的

import { AIMessage } from "@langchain/core/messages"
import { KEEP_LAST_N_MESSAGES } from "./config.ts"
import { model } from "./model.ts"
import type { TState } from "./state.ts"

export async function summarizeNode(state: TState): Promise<Partial<TState>> {
	console.log("📝 正在对早期对话进行总结...")
	// 拿出需要被总结的旧消息
	const messagesToSummarize = state.messages.slice(0, state.messages.length - KEEP_LAST_N_MESSAGES)

	// 构造总结 Prompt
	const summaryPrompt = `
  请将以下对话内容总结成一段简短的中文摘要，
  保留关键信息和上下文，不要逐条列举：

   ${messagesToSummarize.map((m) => `${m.type}: ${m.content}`).join("\n")}
  `

	// 调用大模型得到摘要结果
	const summaryResponse = await model.invoke(summaryPrompt)

	const summaryContent =
		typeof summaryResponse.content === "string"
			? summaryResponse.content
			: JSON.stringify(summaryResponse.content)

	// 输出总结后的内容
	console.log("\n" + "=".repeat(50))
	console.log("🧹 触发历史消息总结 (Summarization)")
	console.log(`📝 摘要内容: ${summaryContent}`)
	console.log("=".repeat(50) + "\n")

	// 这个相当于就是一条信息
	const summaryMessage = new AIMessage(`【对话摘要】${summaryContent}`)

	// 上面的这一条 AIMessage 就需要去替换原来对话历史里面对应条数的对话
	const newMessages = [summaryMessage, ...state.messages.slice(-KEEP_LAST_N_MESSAGES)]

	return {
		messages: newMessages
	}
}
