const express = require("express")
const router = express.Router()
const { getWeather } = require("../utils/weatherHandler")
const { translate } = require("../utils/translateHandler")
const { buildAnswerPrompt, buildFunctionCallPrompt } = require("../utils/promptTemplates")
const { callLLM, callLLMStream } = require("../utils/LLM")

// 要支持上下文，背后的原理非常简单：
// 拿一个数组来存储会话的历史记录，之后每一次会将历史会话记录一同发给大模型
const conversations = [] // 该数组存储会话记录
/**
 * conversations = [
 *  {role: "user", content: "你是谁"},
 *  {role: "assistant", content: "大模型的回复"},
 * ]
 */
const toolMap = {
	getWeather,
	translate
}
// 注意，需要是一个post请求
router.post("/ask", async (req, res) => {
	// 拿到用户的问题
	const question = req.body.question || ""

	res.setHeader("Content-Type", "text/event-stream;charset=utf-8")
	// 禁止缓存 确保客户端每次都能获取到最新数据
	res.setHeader("Cache-Control", "no-cache")

	let finalResponse = ""

	const functionCallPromt = buildFunctionCallPrompt(question)
	const functionCallResult = await callLLM(functionCallPromt)

	console.log("functionCallResult", functionCallResult)
	if (functionCallResult.trim() === "无函数调用") {
		// 直接回答用户问题
		const promt = [
			"你是一个中文智能助手，具有工具调用能力。请严格使用中文回复用户的问题：",
			`用户的问题是：${question}`
		].join("\n")
		const answerPrompt = await callLLMStream(promt, (chunk) => {
			res.write(`${chunk}\n\n`)
		})
		finalResponse = answerPrompt
	} else {
		// 需要调用函数
		try {
			const toolCalls = JSON.parse(functionCallResult)

			const toolResults = []

			for (const tool of toolCalls) {
				const { function: functionName, args } = tool
				if (toolMap[functionName]) {
					try {
						const toolResult = await toolMap[functionName](args)
						toolResults.push({
							function: functionName,
							result: toolResult,
							args
						})
					} catch (error) {
						console.error("调用工具出错:", error.message)
						toolResults.push({
							function: functionName,
							result: `调用工具时出错：${error.message}`,
							args
						})
					}
				} else {
					console.error("未知的工具：", functionName)
					toolResults.push({
						function: functionName,
						result: `未知的工具：${functionName}`,
						args
					})
				}
			}
			const answerPromt = buildAnswerPrompt(question, toolResults)
			console.log("answerPromt", answerPromt)
			const answerPrompt = await callLLMStream(answerPromt, (chunk) => {
				res.write(`${chunk}\n`)
			})
			finalResponse = answerPrompt
		} catch (error) {
			console.error("解析函数调用结果出错:", error.message)
		}
	}

	conversations.push({ role: "user", content: question })
	conversations.push({ role: "assistant", content: finalResponse })
	// 限制对话长度，保留最近的20轮对话
	if (conversations.length > 40) {
		conversations.splice(0, conversations.length - 40)
	}
	res.end()
})

// 用户看到会话的历史记录
router.get("/history", (req, res) => {
	res.json({ conversations })
})

// 清除对话历史
router.post("/clear", (req, res) => {
	conversations.length = 0
	res.json({ message: "对话历史已清除。" })
})

module.exports = router
