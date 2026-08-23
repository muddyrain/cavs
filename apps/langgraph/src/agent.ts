import { END, MemorySaver, START, StateGraph } from "@langchain/langgraph"
import { llmCall } from "./nodes/llmCall.ts"
import { reviewNode } from "./nodes/review.ts"
import { validateNode } from "./nodes/validate.ts"
import { StateSchema } from "./state.ts"

const checkpointer = new MemorySaver()

export const graph = new StateGraph(StateSchema)
	// 添加节点
	.addNode("validateNode", validateNode)
	.addNode("reviewNode", reviewNode)
	.addNode("llmCall", llmCall)
	// 添加边
	.addEdge(START, "validateNode")
	.addEdge("validateNode", "llmCall")
	.addEdge("llmCall", "reviewNode")
	.addEdge("reviewNode", END)
	.compile({
		checkpointer
	})

export const config = {
	configurable: {
		thread_id: "demo-thread"
	}
}
