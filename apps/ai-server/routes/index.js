const express = require("express")
const router = express.Router()
const { callLLM } = require("../utils/LLM")
const { getWeather } = require("../utils/weatherHandler.js")
const { translate } = require("../utils/translateHandler.js")
const toolList = require("../utils/tools")
const { loadCachedEmbeddings, searchByEmbedding } = require("../utils/rag.js")
// 要支持上下文，背后的原理非常简单：
// 拿一个数组来存储会话的历史记录，之后每一次会将历史会话记录一同发给大模型
const conversations = [] // 该数组存储会话记录
// 工具函数映射表
const toolsMap = {
	getWeather,
	translate
}

// 分数的阀值：用于判断用户当前的问题是否和外挂知识库相关
const RELEVANCE_THRESHOLD = 0.59
// 注意，需要是一个post请求
router.post("/ask", async (req, res) => {
	// 做一个外挂知识库的准备，拿到外挂知识库所对应的向量数据
	const embeddedDocs = await loadCachedEmbeddings()

	// 拿到用户的问题
	const question = req.body.question || ""

	// 需要将用户的问题放到向量数据库里面进行搜索
	const relevantDocs = await searchByEmbedding(question, embeddedDocs)

	// 注意：不是每一次都需要将外挂知识库的内容交给大模型

	res.setHeader("Content-Type", "text/event-stream;charset=utf-8")
	// 禁止缓存 确保客户端每次都能获取到最新数据
	res.setHeader("Cache-Control", "no-cache")

	let userMessage = question
	// 首先需要大模型来判断是否需要调用工具

	// 接下来需要对应用户的问题进行一个评判
	// 看一下用户的问题是否和外挂知识库的内容相关
	// 目前，每一个块儿都有一个得分，所有的块儿的得分大于阀值，说明相关
	const allDocsRelevant =
		relevantDocs.length > 0 && relevantDocs.every((doc) => doc.score > RELEVANCE_THRESHOLD)

	if (allDocsRelevant) {
		// 说明用户这一次的问题，是和外挂知识库的内容相关的
		// 需要将外挂知识库中搜索到的内容一起给大模型
		console.log(`✅ 知识库相关 - 所有文档得分都超过阈值 ${RELEVANCE_THRESHOLD}`)
		console.log(`   文档得分: [${relevantDocs.map((doc) => doc.score.toFixed(3)).join(", ")}]`)

		// 将相关的知识库内容添加到用户问题中
		const relevantContent = relevantDocs
			.filter((doc) => doc.score > RELEVANCE_THRESHOLD)
			.map((doc) => doc.content)
			.join("\n\n")

		userMessage = `参考以下资料回答问题：
		
  ${relevantContent}			
  
  问题：${question}`
	} else {
		// 说明和外挂知识库的内容无关，正常回答即可
		const failedDocs = relevantDocs.filter((doc) => doc.score <= RELEVANCE_THRESHOLD)
		console.log(`❌ 知识库不相关 - 有${failedDocs.length}个文档得分不足`)
		console.log(`   文档得分: [${relevantDocs.map((doc) => doc.score.toFixed(3)).join(", ")}]`)
		console.log(`   阈值要求: ${RELEVANCE_THRESHOLD}`)
	}

	const messages = [...conversations, { role: "user", content: userMessage }]

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
