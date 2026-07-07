// 节点只需返回“要更新的那一小块”，不用把整份 state 再抄一遍。
import { END, START, StateGraph } from "@langchain/langgraph"
import * as z from "zod"

const Schema = z.object({
	count: z.number(),
	logs: z.array(z.string()),
	status: z.string().optional()
})

// 基于这个Schema生成一个ts类型
type TState = z.infer<typeof Schema>

// 节点1
async function node1() {
	return {
		count: 1
	}
}

// 节点2
async function node2(state: TState) {
	return {
		logs: [`第一条log，count=${state.count}`]
	}
}

// 节点3
async function node3() {
	return {
		status: "完成"
	}
}

// 节点4
async function node4() {
	return {
		count: 2
	}
}

// 节点5
async function node5(state: TState) {
	return {
		logs: [`第二条log，count=${state.count}`]
	}
}

// 构建图
const app = new StateGraph(Schema)
	.addNode("node1", node1)
	.addNode("node2", node2)
	.addNode("node3", node3)
	.addNode("node4", node4)
	.addNode("node5", node5)
	.addEdge(START, "node1")
	.addEdge("node1", "node2")
	.addEdge("node2", "node3")
	.addEdge("node3", "node4")
	.addEdge("node4", "node5")
	.addEdge("node5", END)
	.compile()

const result = await app.invoke({
	count: 0,
	logs: []
})

console.log(result)
// { count: 1, logs: [ '第一条log，count=1' ], status: '完成' }
