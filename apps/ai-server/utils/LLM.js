const LLM_ENDPOINT = process.env.LLM_ENDPOINT
const LLM_MODEL = process.env.LLM_MODEL
const LLM_TIMEOUT_MS = process.env.LLM_TIMEOUT_MS

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

async function callLLM({ prompt, stream = false, callback }) {
	const response = await fetchWithTimeout(LLM_ENDPOINT, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			model: LLM_MODEL,
			prompt,
			stream
		})
	})
	if (!response.ok) {
		throw new Error(`LLM请求失败，状态码：${response.status} ${response.statusText}`)
	}

	if (!stream) {
		const data = await response.json()
		return data.response
	}

	const reader = response.body.getReader()

	const decoder = new TextDecoder("utf-8")

	let fullResponse = ""

	while (true) {
		const { done, value } = await reader.read()
		if (done) break
		const chunk = decoder.decode(value, {
			stream: true
		})
		const lines = chunk.split("\n").filter((line) => line.trim())
		for (const line of lines) {
			try {
				const data = JSON.parse(line)
				if (data.response) {
					fullResponse += data.response
					if (callback) {
						callback(data.response)
					}
				}
			} catch (error) {
				console.error("解析数据出错:", error.message)
			}
		}
	}

	return fullResponse
}

module.exports = {
	callLLM: (prompt) => callLLM({ prompt }),
	callLLMStream: ({ prompt, callback }) => callLLM({ prompt, stream: true, callback })
}
