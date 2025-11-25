const express = require("express")
const router = express.Router()

// 要支持上下文，背后的原理非常简单：
// 拿一个数组来存储会话的历史记录，之后每一次会将历史会话记录一同发给大模型
const conversations = [] // 该数组存储会话记录
/**
 * conversations = [
 *  {role: "user", content: "你是谁"},
 *  {role: "assistant", content: "大模型的回复"},
 * ]
 */

// 注意，需要是一个post请求
router.post("/ask", async (req, res) => {
	// 拿到用户的问题
	const question = req.body.question || ""

	// 接下来需要将用户问题放入到提示词模板
	// const prompt = `
	//   你是一个中文智能助手，请使用简体中文回答用户的问题。
	// 	你的回答应简洁明了，直接切中要点。
	//   问题：${question}
	// `

	// 每一次 prompt 会将历史会话带过去
	const prompt = [
		"你是一个中文智能助手，请使用中文回答用户的问题。",
		// 历史记录
		...conversations.map((item) => `${item.role === "user" ? "用户" : "助手"}：${item.content}`),
		`用户的问题：${question}`
	].join("\n")

	const response = await fetch("http://localhost:11434/api/generate", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			model: "llama3",
			prompt,
			stream: true // 是否开启流式
		})
	})

	res.setHeader("Content-Type", "text/event-stream;charset=utf-8")
	// 禁止缓存 确保客户端每次都能获取到最新数据
	res.setHeader("Cache-Control", "no-cache")

	const reader = response.body.getReader()

	const decoder = new TextDecoder("utf-8")

	let fullResponse = ""

	while (true) {
		const { done, value } = await reader.read()
		if (done) break
		// 将数据块转换为字符串
		const chunk = decoder.decode(value, {
			stream: true
		})
		const lines = chunk.split("\n").filter((line) => line.trim())
		/**
		 * lines =['{"response":"..."}', '{"response":"..."}']
		 */
		for (const line of lines) {
			try {
				const data = JSON.parse(line) // data = { response : '...'}
				if (data.response) {
					fullResponse += data.response // 拼接完整回答
					// 发送到客户端
					res.write(data.response)
				}
			} catch (error) {
				console.error("解析数据出错:", error.message)
			}
		}
	}

	conversations.push({ role: "user", content: question })
	conversations.push({ role: "assistant", content: fullResponse })

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
