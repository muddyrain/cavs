const LLM_ENDPOINT = process.env.LLM_ENDPOINT
const LLM_MODEL = process.env.LLM_MODEL
const LLM_TIMEOUT_MS = process.env.LLM_TIMEOUT_MS
const LLM_KEY = process.env.LLM_KEY

// 做一个优化 ， 封装一个 带超时机制的 fetch 方法
async function fetchWithTimeout(url, options, timeout = LLM_TIMEOUT_MS) {
	const controller = new AbortController()
	const timeoutId = setTimeout(() => {
		controller.abort()
	}, timeout)
	try {
		const response = await fetch(url, {
			...options,
			signal: controller.signal
		})
		clearTimeout(timeoutId)
		return response
	} catch (error) {
		clearTimeout(timeoutId)
		if (error.name === "AbortError") {
			throw new Error("请求超时")
		}
	}
}

async function callLLM({ messages, stream = false, callback }) {
	const response = await fetchWithTimeout(LLM_ENDPOINT, {
		method: "POST",
		headers: { "Content-Type": "application/json", Authorization: `Bearer ${LLM_KEY}` },
		body: JSON.stringify({
			model: LLM_MODEL,
			messages,
			stream
		})
	})
	if (!response.ok) {
		throw new Error(`LLM请求失败，状态码：${response.status} ${response.statusText}`)
	}

	if (!stream) {
		const data = await response.json()
		return data.choices?.[0]?.message?.content || ""
	}

	const reader = response.body.getReader()

	const decoder = new TextDecoder("utf-8")

	let fullResponse = ""
	while (true) {
		const { done, value } = await reader.read()
		if (done) break
		// 将新数据添加到缓冲区
		const chunk = decoder.decode(value, { stream: true })
		// 按行分割处理
		const lines = chunk.split("\n").filter((line) => line.trim())
		for (const line of lines) {
			const trimmedLine = line.trim()
			if (!line.startsWith("data: ")) continue

			// 跳过空行
			if (!trimmedLine) continue

			// 处理 SSE 数据行
			if (trimmedLine.startsWith("data: ")) {
				const dataContent = trimmedLine.slice(6) // 移除 "data: " 前缀

				// 检查是否为结束标记
				if (dataContent === "[DONE]") {
					break
				}
				try {
					const data = JSON.parse(dataContent)

					// 提取内容
					const content = data.choices?.[0]?.delta?.content
					if (content) {
						fullResponse += content
						if (callback) {
							callback(content)
						}
					}
					// 检查是否完成
					if (data.choices?.[0]?.finish_reason === "stop") {
						break
					}
				} catch (error) {
					console.error("解析SSE数据出错:", error.message, "原始数据:", dataContent)
				}
			}
		}
	}

	return fullResponse
}

module.exports = {
	callLLM: (messages) => callLLM({ messages }),
	callLLMStream: (messages, callback) => callLLM({ messages, stream: true, callback })
}
