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

	// 首先需要大模型来判断是否需要调用工具
	const functionCallPrompt = buildFunctionCallPrompt(question)

	const conversationsList = [...conversations, { role: "user", content: functionCallPrompt }]

	const functionCallResult = await callLLM(conversationsList)

	// functionCallResult 会有两种情况
	// 1. 无函数调用
	// 2. [{"function": "translate", "args": { "input": "我今天很开心" }}]

	let finalResponse = "" // 存储最终的回复，因为每一次回复需要更新到历史会话里面

	if (functionCallResult.trim() === "无函数调用") {
		const prompt = [...conversations, { role: "user", content: question }]

		finalResponse = await callLLMStream(prompt, (chunk) => {
			res.write(`${JSON.stringify({ response: chunk })}\n`)
		})
	} else {
		// 进入此分支，说明需要调用工具
		try {
			const toolCalls = JSON.parse(functionCallResult) // [{"function": "translate", "args": { "input": "我今天很开心" }}]

			const toolsResult = [] // 存储工具调用的结果
			for (const tool of toolCalls) {
				const { function: functionName, args } = tool
				if (toolsMap[functionName]) {
					// 如果有这个工具，那就调用
					try {
						const result = await toolsMap[functionName](args) // 调用工具
						toolsResult.push({
							function: functionName,
							args,
							result
						})
					} catch (err) {
						console.error(`${functionName}工具调用失败☹️`, err)
						toolsResult.push({
							function: functionName,
							args,
							result: `工具调用失败☹️：${err.message}`
						})
					}
				} else {
					// 进入此分支，说明不存在这个工具
					console.error(`${functionName}工具不存在`)
					toolsResult.push({
						function: functionName,
						args,
						result: `未知工具☹️`
					})
				}
			}

			// 出了上面的 for 循环后，toolsResult 里面就存储了调用工具的结果
			// 接下来还是需要构建一个提示词
			const answerPrompt = buildAnswerPrompt(question, toolsResult)

			const prompt = [...conversations, { role: "user", content: answerPrompt }]

			finalResponse = await callLLMStream(prompt, (chunk) => {
				res.write(`${JSON.stringify({ response: chunk })}\n`)
			})
		} catch (err) {
			console.error(`解析工具的JSON失败☹️：${err}`)
		}
	}

	// 将这一次的答案记录到历史会话里面
	conversations.push(
		{ role: "user", content: question },
		{ role: "assistant", content: finalResponse }
	)

	if (conversations.length > 20) conversations.splice(0, conversations.length - 20)

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
