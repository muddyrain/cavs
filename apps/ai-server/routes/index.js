const express = require("express")
const router = express.Router()
const { callLLM } = require("../utils/LLM")
const { getWeather } = require("../utils/weatherHandler.js")
const { translate } = require("../utils/translateHandler.js")
const toolList = require("../utils/tools")
// 要支持上下文，背后的原理非常简单：
// 拿一个数组来存储会话的历史记录，之后每一次会将历史会话记录一同发给大模型
const conversations = [] // 该数组存储会话记录
// 工具函数映射表
const toolsMap = {
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

	const messages = [...conversations, { role: "user", content: question }]

	try {
		const response = await callLLM(messages, toolList, (chunk) => {
			res.write(`${JSON.stringify({ response: chunk })}\n`)
		})
		if (response.tool_calls) {
			// 进入此分支，说明要调用工具
			const toolResults = [] // 存储工具调用的结果
			for (const toolCall of response.tool_calls) {
				try {
					// 挨着挨着去调用每一个工具
					const functionName = toolCall.function.name
					const args = JSON.parse(toolCall.function.arguments)
					if (toolsMap[functionName]) {
						const result = await toolsMap[functionName](args)
						toolResults.push({
							tool_call_id: toolCall.id,
							role: "tool",
							content: result
						})
					} else {
						// 说明 toolMaps 不存在当前要调用的工具
						toolResults.push({
							tool_call_id: toolCall.id,
							role: "tool",
							content: `未知工具${functionName}`
						})
					}
				} catch (err) {
					console.error("工具调用失败☹️", err)
					toolResults.push({
						tool_call_id: toolCall.id,
						role: "tool",
						content: `工具调用失败☹️${err.message}`
					})
				}
			}

			// 代码来到这里，说明工具调用的环节结束了
			messages.push(
				{
					role: "assistant",
					content: response.content,
					tool_calls: response.tool_calls
				},
				...toolResults // 加入了工具调用的结果
			)

			const finalResponse = await callLLM(messages, toolList, (chunk) => {
				res.write(`${JSON.stringify({ response: chunk })}\n`)
			})

			conversations.push(
				{ role: "user", content: question }, // 原始的问题
				// 大模型判断需要调用工具的回复
				{
					role: "assistant",
					content: response.content,
					tool_calls: response.tool_calls
				},
				// 工具调用的结果
				// 之所以要将工具调用的结果也放入到会话历史里面，是为了之后大模型能够看到之前调用工具的历史
				...toolResults,
				{ role: "assistant", content: finalResponse }
			)
		} else {
			// 不需要调用工具
			// 直接记录这一次的会话
			conversations.push(
				{ role: "user", content: question },
				{ role: "assistant", content: response }
			)
		}
		if (conversations.length > 20) conversations.splice(0, conversations.length - 20)
	} catch (error) {
		console.error("LLM调用失败☹️", error)
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
