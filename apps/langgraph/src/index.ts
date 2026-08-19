import { END, MemorySaver, START, StateGraph } from "@langchain/langgraph"
import readline from "readline-sync"
import { z } from "zod/v4"

const StateSchema = z.object({
	action: z.string().optional().describe("要执行的行为"),
	to: z.email().optional().describe("要对哪一个对象执行这个行为"),
	content: z.string().optional().describe("该行为对应的具体内容")
})

type State = z.infer<typeof StateSchema>

// 1. 解析用户意图节点
async function parseInput(): Promise<State> {
	return {
		action: "send_email", // 意图：发邮件
		to: "test@example.com", // 收件人
		content: "Hello, this is a test email" // 邮件内容
	}
}

// 2. 准备即将执行的操作
async function prepareAction(state: State): Promise<State> {
	console.log("\n【准备执行的操作】")
	console.log({
		action: state.action,
		to: state.to,
		content: state.content
	})
	return state
}

// 3. 执行具体的操作
async function executeAction(state: State): Promise<State> {
	console.log("\n🚨 正在执行真实操作！")
	console.log(`邮件已发送给 ${state.to}`)
	return state
}

const checkpointer = new MemorySaver()

// 4. 编排图
const graph = new StateGraph(StateSchema)
	.addNode("parseInput", parseInput)
	.addNode("prepareAction", prepareAction)
	.addNode("executeAction", executeAction)
	.addEdge(START, "parseInput")
	.addEdge("parseInput", "prepareAction")
	.addEdge("prepareAction", "executeAction")
	.addEdge("executeAction", END)
	.compile({
		checkpointer,
		interruptBefore: ["executeAction"] // 在具体执行动作之前，需要中断
	})

async function main() {
	const config = {
		configurable: {
			thread_id: "static-interrupt-demo"
		}
	}

	// 执行整个图
	console.log("\n=== 第一次执行：跑到静态断点 ===")
	await graph.invoke({}, config)

	// 第一次执行的时候，跑到静态断点，就会从图里面出来，回到主逻辑
	console.log("\n流程已在 executeAction 前暂停")
	const input = readline.question("是否确认执行真实操作？(y / n): ")

	if (input.toLowerCase() !== "y") {
		console.log("\n❌ 操作已取消，流程结束")
		return
	}

	// 说明用户输入的是 y 或者 Y
	console.log("\n✅ 已确认，继续执行流程")
	// 恢复图的执行，会从中断的节点开始执行
	// 1. 第一个参数传递null：因为这一次是从中断点开始执行，null表示使用checkpointer保存的状态继续
	// 2. 第二个参数config
	await graph.invoke(null, config)
}

main()
