import { END, START, StateGraph } from "@langchain/langgraph"
import { ChatOpenAI } from "@langchain/openai"
import readlineSync from "readline-sync"
import { z } from "zod/v4"
import "dotenv/config"
import { model } from "./model.ts"

// 图的状态
const Schema = z.object({
	subject: z.string().default("").describe("邮件主题"),
	message: z.string().default("").describe("邮件内容"),
	feedback: z.string().default("").describe("反馈")
})

// 根据Schema生成的ts类型
type TState = z.infer<typeof Schema>

// 节点：1. 写邮件的节点  2. 用户审查节点  3. 发送邮件
async function writeEmail(state: TState) {
	console.log("AI: 正在生成/修改邮件内容...")

	// 提示词
	const lines: string[] = [
		"你是一个专业的中文邮件撰写助手。",
		"请用自然、礼貌、简洁的中文撰写邮件正文。",
		"只输出邮件正文内容本身，不要输出额外的解释说明。"
	]

	if (!state.message || !state.feedback) {
		// 说明是初次生成邮件内容，当前只有主题
		lines.push(`邮件主题：${state.subject}`)
		lines.push("请根据以上主题撰写第一版邮件正文。")
	} else if (state.feedback !== "approve") {
		// 说明有修改意见，需要根据上一版的正文 + 用户的反馈意见来进行修改
		lines.push("下面是上一版邮件正文：")
		lines.push(state.message)
		lines.push("下面是用户给出的修改意见：")
		lines.push(state.feedback)
		lines.push(
			"请严格根据修改意见，在保留合理内容的前提下，重写一封新的邮件正文，只输出修改后的完整邮件内容。"
		)
	}

	const pt = lines.join("\n")

	const result = await model.invoke(pt)

	const content =
		typeof result.content === "string" ? result.content : JSON.stringify(result.content)

	return {
		message: content
	}
}

async function humanReview(state: TState) {
	// 先将模型生成的邮件内容显示出来
	console.log("\n===== 当前 AI 生成的邮件内容 =====\n")
	console.log(state.message)
	console.log("\n系统: 等待人类审核...\n")

	const input = readlineSync.question("是否发送？请输入 'approve' 表示发送，或输入你的修改意见：")

	console.log(`\n\n用户的反馈为：${input}`)

	return {
		feedback: input
	}
}

function sendEmail(state: TState) {
	console.log("\n===== 模拟发送邮件 =====")
	const to = "demo@example.com"
	console.log(`收件人: ${to}`)
	console.log(`主题: ${state.subject}`)
	console.log("正文:\n")
	console.log(state.message)
	console.log("\n[模拟] 邮件已发送！")
	return {}
}

// 构建图
const graph = new StateGraph(Schema)
	.addNode("writeEmail", writeEmail)
	.addNode("humanReview", humanReview)
	.addNode("sendEmail", sendEmail)
	.addEdge(START, "writeEmail")
	.addEdge("writeEmail", "humanReview")
	.addConditionalEdges("humanReview", (state: TState) => {
		if (state.feedback === "approve") return "sendEmail"
		return "writeEmail"
	})
	.addEdge("sendEmail", END)
	.compile()

async function main() {
	const subject = readlineSync.question("请输入邮件的主题：")

	console.log("\n===== 开始：大模型根据主题生成邮件，并支持多次人工修改 =====\n")

	const stream = await graph.stream({ subject })

	for await (const _e of stream) {
	}

	console.log("\n===== 流程结束 =====")
}

main()
