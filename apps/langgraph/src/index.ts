// 演示子图的输出
import { START, StateGraph } from "@langchain/langgraph"
import { z } from "zod/v4"

// 定义子图状态
const SubState = z.object({
	foo: z.string(),
	bar: z.string()
})

// 构建子图
const subgraph = new StateGraph(SubState)
	.addNode("subgraphNode1", () => ({ bar: "bar" })) // 更新bar的值
	.addNode("subgraphNode2", (state) => ({ foo: state.foo + state.bar })) // 更新foo的值
	.addEdge(START, "subgraphNode1")
	.addEdge("subgraphNode1", "subgraphNode2")
	.compile()

// 定义父图的状态
const ParentState = z.object({
	foo: z.string(),
	bar: z.string()
})

const graph = new StateGraph(ParentState)
	.addNode("node1", (state) => ({ foo: "hi! " + state.foo })) // 对foo字段进行更新
	.addNode("node2", subgraph) // 子图节点
	.addEdge(START, "node1")
	.addEdge("node1", "node2")
	.compile()

async function main() {
	const stream = await graph.stream(
		{ foo: "这是一个测试" },
		{
			streamMode: "updates",
			subgraphs: true
		}
	)

	for await (const item of stream) {
		console.log("updates流输出的每一项")
		console.log(item)
		console.log("---------------------")
	}
}
main()
