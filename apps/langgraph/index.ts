import { END, START, StateGraph } from "@langchain/langgraph"
import { registry } from "@langchain/langgraph/zod"
import { z } from "zod"

// 1. 定义Schema
const Schema = z.object({
	a: z.string().optional(),
	b: z.string().optional(),
	c: z.string().optional(),
	t0: z.number().optional(), // 记录时间
	// 日志的记录
	logs: z.array(z.string()).register(registry, {
		reducer: {
			fn: (oldVal, newVal) => oldVal.concat(newVal)
		},
		default: () => [] as string[]
	})
})

// 简单 sleep，模拟不同耗时
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// 统一格式化时间戳（相对 A 节点开始）
const fmt = (t0?: number) => `${t0 !== undefined ? Date.now() - t0 : 0}ms`

const graph = new StateGraph(Schema)
	.addNode("A", () => {
		console.log("运行A节点")
		return {
			a: "A节点执行后的结果",
			t0: Date.now(),
			logs: ["【A节点】开始(+0ms)", "【A节点】结束(+0ms)"]
		}
	})
	.addNode("B", async (state) => {
		console.log("运行B节点")
		const start = fmt(state.t0) // 得到一个相对于A节点的时间
		await sleep(2500)
		return {
			b: "b节点执行后的结果",
			logs: [`【B节点】开始(+${start})`, `【B节点】结束(+${fmt(state.t0)})`]
		}
	})
	.addNode("C", async (state) => {
		console.log("运行C节点")
		const start = fmt(state.t0) // 得到一个相对于A节点的时间
		await sleep(1000)
		return {
			c: "c节点执行后的结果",
			logs: [`【C节点】开始(+${start})`, `【C节点】结束(+${fmt(state.t0)})`]
		}
	})
	.addNode("D", async (state) => {
		console.log("运行D节点")
		const summary = `D节点已运行，b=${state.b ?? "none"}，c=${state.c ?? "none"}`
		return {
			logs: [`${summary}`, `【D节点】结束(+${fmt(state.t0)})`, `整个流程结束`]
		}
	})
	.addEdge(START, "A")
	.addEdge("A", "B")
	.addEdge("A", "C")
	.addEdge("B", "D")
	.addEdge("C", "D")
	.addEdge("D", END)
	.compile()
const result = await graph.invoke({})
console.log(result)
