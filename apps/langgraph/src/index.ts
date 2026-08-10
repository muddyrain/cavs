// 快速上手示例
import { END, MemorySaver, START, StateGraph } from "@langchain/langgraph"
import { z } from "zod/v4"

// 定义状态结构
const State = z.object({
	foo: z.string().optional(),
	bar: z.string().optional()
})

// type TState = z.infer<typeof State>;

// 创建checkpointer：checkpoint存储器
const checkpointer = new MemorySaver()

// 构建图
const graph = new StateGraph(State)
	.addNode("nodeA", () => {
		console.log("正在执行节点A")
		return { foo: "foo" }
	})
	.addNode("nodeB", () => {
		console.log("正在执行节点B")
		return { bar: "bar" }
	})
	.addEdge(START, "nodeA")
	.addEdge("nodeA", "nodeB")
	.addEdge("nodeB", END)
	.compile({
		checkpointer // 将检查点存储器和图绑定到一起了，回头图产生的检查点就会存储到绑定的checkpointer里面
	})

async function main() {
	const config = {
		configurable: {
			thread_id: "user_001"
		}
	}

	await graph.invoke({}, config)

	// 查看最新的checkpoint
	const snapshot = await graph.getState(config)

	console.log(snapshot)
}
main()
