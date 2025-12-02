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

async function callLLM(messages, tools = null, callback) {
	const requestBody = {
		model: LLM_MODEL,
		messages,
		stream: true
	}
	if (tools) {
		requestBody.tools = tools
	}
	const response = await fetchWithTimeout(LLM_ENDPOINT, {
		method: "POST",
		headers: { "Content-Type": "application/json", Authorization: `Bearer ${LLM_KEY}` },
		body: JSON.stringify(requestBody)
	})
	if (!response.ok) {
		throw new Error(`LLM请求失败，状态码：${response.status} ${response.statusText}`)
	}

	const reader = response.body.getReader()
	const decoder = new TextDecoder("utf-8")

	let fullResponse = "" // 用于存储模型这一次的完整回复
	let toolCalls = [] // 该数组用于存储要调用的工具
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
					// jsonStr = '{"choices":[{"delta":{"content":"你好，"}}]}'
					// jsonStr = '{"choices":[{"delta":{"tool_calls":[{"index":0,"id":"abc","function":{"name":"getWeather","arguments":"{\\"city\\":\\"北"}}]}}]}'
					const data = JSON.parse(dataContent)
					const delta = data.choices?.[0]?.delta
					if (delta) {
						if (delta.content) {
							// 进入此分支，说明模型返回的是文本内容
							fullResponse += delta.content
							callback?.(delta.content)
						}
						if (delta.tool_calls) {
							// 进入此分支，说明模型返回的是工具调用
							// 这里面核心就是要将需要调用的工具添加到 toolCalls 数组里面
							// 大模型返回的 tool_calls 是一个数组，因为可能涉及到调用多个工具
							for (const toolCall of delta.tool_calls) {
								const existingCall = toolCalls.find((call) => call.index === toolCall.index)
								if (existingCall) {
									// 说明已经存在
									// 这个分支需要合并参数
									if (toolCall.function?.name) {
										existingCall.function.name = toolCall.function.name
									}
									if (toolCall.function?.arguments) {
										existingCall.function.arguments += toolCall.function.arguments
									}
								} else {
									// 说明是新的工具调用，存储一个新的
									// 当前的 toolCall = { index: 0, id: 'abc', function: { name: 'getWeather', arguments: '{"city":"北' } }
									// toolCall = { index: 0, id: 'abc', function: { name: 'getWeather', arguments: '{"city":"京' } }
									// 工具名是完整的，但是参数并不完整，因为是流式返回的
									toolCalls.push({
										index: toolCall.index,
										id: toolCall.id,
										type: "function",
										function: {
											name: toolCall.function?.name,
											arguments: toolCall.function?.arguments
										}
									})
								}
							}
						}
					}
				} catch (error) {
					console.error("解析SSE数据出错:", error.message, "原始数据:", dataContent)
				}
			}
		}
	}

	// 如果需要调用工具，返回一个对象{content, tool_calls}
	// 其中 tool_calls记录了要调用哪些工具
	if (toolCalls.length > 0) {
		return { content: fullResponse, tool_calls: toolCalls }
	}

	return fullResponse
}

module.exports = {
	callLLM
}
