import { interrupt } from "@langchain/langgraph"
import type { T_State } from "../state.ts"

export async function reviewNode(state: T_State): Promise<Partial<T_State>> {
	// 取出消息列表的最后一条消息
	const lastMessage = state.messages.at(-1)

	if (lastMessage?.role !== "assistant") return {}

	// 代码来到这里，说明当前最后一条消息就是 assistant
	const result = interrupt({
		action: "human_review", // 用户做最终确认
		originalContent: lastMessage.content, // 其实就是大模型最终生成的那条消息
		message: "请审阅上面由AI助手生成的回复信息"
	})

	// 涉及到的是用户编辑图的状态
	return {
		messages: [
			...state.messages.slice(0, -1), // 保留原本信息数组中从第一条到倒数第二条
			// 因为最后一条我们要修改
			{
				...lastMessage,
				content: result
			}
		],
		reviewContent: result
	}
}
