import type { BaseMessageLike } from "@langchain/core/messages"
import { END, START, StateGraph } from "@langchain/langgraph"
import agent from "./agent.ts"
import type { State } from "./state.ts"
import Schema from "./state.ts"

// 创建一个节点
const llmNode = async (state: State): Promise<State> => {
	const messages = state.messages as BaseMessageLike[]

	// 拿到和模型的交互结果
	const result = await agent.invoke({
		messages
	})
	const newMessages = [...messages, result] as BaseMessageLike[]

	// 返回新的状态
	return {
		messages: newMessages,
		llmCalls: (state.llmCalls ?? 0) + 1
	}
}

// 构建图
const graph = new StateGraph(Schema)
	.addNode("llmNode", llmNode)
	.addEdge(START, "llmNode")
	.addEdge("llmNode", END)
	.compile()

export default graph
