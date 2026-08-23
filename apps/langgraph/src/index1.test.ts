import { END, MemorySaver, START, StateGraph } from "@langchain/langgraph"
import { expect, test } from "vitest"
import { z } from "zod/v4"

// 图的状态
const State = z.object({
	my_key: z.string()
})

// 这是一个工厂函数，调用之后返回一个 graph 的实例
const createGraph = () => {
	return new StateGraph(State)
		.addNode("node1", () => {
			return { my_key: "node1节点信息" }
		})

		.addNode("node2", () => {
			return { my_key: "node2节点信息" }
		})
		.addEdge(START, "node1")
		.addEdge("node1", "node2")
		.addEdge("node2", END)
}

test("基本测试，针对整张图做一个测试", async () => {
	// 测试核心
	// 1. 执行  2. 给出预期 3. 查看执行的结果是否符合预期

	// 1. 创建图的实例
	const builder = createGraph()

	const checkpointer = new MemorySaver()

	const graph = builder.compile({ checkpointer })

	// 2. 执行整张图
	const result = await graph.invoke(
		{
			my_key: "初始值"
		},
		{
			configurable: {
				thread_id: "1"
			}
		}
	)

	// 3. 断言
	expect(result.my_key).toBe("node2节点信息")
})
