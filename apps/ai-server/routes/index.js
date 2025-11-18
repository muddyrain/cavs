const express = require("express")
const router = express.Router()

// 注意，需要是一个post请求
router.post("/ask", async (req, res) => {
	// 拿到用户的问题
	const question = req.body.question || ""

	// 接下来需要将用户问题放入到提示词模板
	const prompt = `
    你是一个中文智能助手，请使用简体中文回答用户的问题。
		你的回答应简洁明了，直接切中要点。
    问题：${question}
  `

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
					// 发送到客户端
					res.write(data.response)
				}
			} catch (error) {
				console.error("解析数据出错:", error.message)
			}
		}
	}
})

module.exports = router
