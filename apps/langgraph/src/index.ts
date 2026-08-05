import { END, getWriter, START, StateGraph } from "@langchain/langgraph"
import { z } from "zod"

// 状态Schema
const StateSchema = z.object({
	result: z.string().optional()
})

// type State = z.infer<typeof StateSchema>;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// 任务节点
async function longTask() {
	const writer = getWriter()
	if (!writer) return
	// 书写自定义的数据
	writer({ step: 1, message: "正在准备中..." })
	await sleep(3000)

	writer({ step: 2, message: "正在处理中..." })

	await sleep(3000)

	writer({ step: 3, message: "快要完成了..." })

	await sleep(3000)

	// 更新状态
	return {
		result: "任务完成"
	}
}

// 构建图
const graph = new StateGraph(StateSchema)
	.addNode("longTask", longTask)
	.addEdge(START, "longTask")
	.addEdge("longTask", END)
	.compile()

async function main() {
	console.log("===== custom 流式输出 =====\n")

	let input = {}

	const stream = await graph.stream(input, {
		streamMode: "custom"
	})
	for await (const item of stream) {
		console.log("custom自定义流每一次的输出")
		console.log(item)
		console.log("---------------------")
	}

	console.log("\n===== 执行结束 =====")
}

main()
