import { callDeepseek } from "./LLM.js"

/**
 *
 * @param {*} input 用户输入的问题，是一个字符串
 * @param {*} messages 会话历史，是一个数组
 * @param {*} tools 工具箱，也是一个数组
 * @param {*} mcp mcp client 实例对象
 */
export async function processQuery(input, messages, tools, mcp) {
	// 将用户的问题以及工具箱发给 LLM，由 LLM 来判断是否需要调用工具
	try {
		messages.push({
			role: "user",
			content: input
		})

		const message = await callDeepseek(messages, tools)

		// 将这一次的回复加入到历史会话中
		messages.push(message)

		// 查看大模型的回复是否有需要调用工具的标识
		// deepseek 的标识为 tool_calls
		if (message.tool_calls) {
			// 说明要调用工具
			// 执行工具的调用
			for (const call of message.tool_calls) {
				const args = JSON.parse(call.function.arguments)
				const result = await mcp.callTool({
					name: call.function.name,
					arguments: args
				})
				messages.push({
					role: "tool", // 代表这一个会话是一个工具调用的结果
					tool_call_id: call.id,
					content:
						typeof result.content === "string" ? result.content : JSON.stringify(result.content)
				})
			}
			// 代码来到这里后，说明所有的工具已经调用过了，并且调用的结果放到 messages 会话历史里面
			const final = await callDeepseek(messages, tools)
			messages.push(final)
			return final.content
		}

		// 代码来到这里，说明不需要调用工具
		// 那就正常回答问题
		return message.content
	} catch (err) {
		console.error(`处理消息时出错，错误信息为：${err.message}`)
	}
}
