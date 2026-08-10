import "dotenv/config"
import { END, MemorySaver, START, StateGraph } from "@langchain/langgraph"
import { ChatOpenAI } from "@langchain/openai"
import readline from "readline-sync"
import { z } from "zod/v4"

// checkpoint类型
type CheckpointState = {
	values: TState
	next: string[]
	config: {
		configurable?: {
			checkpoint_id?: string
			thread_id?: string
		}
	}
}

const Schema = z.object({
	topic: z.string().optional().describe("笑话的主题"),
	joke: z.string().optional().describe("生成的笑话的内容")
})

type TState = z.infer<typeof Schema>

const model = new ChatOpenAI({
	model: "gpt-5.6-terra",
	temperature: 0.5,
	configuration: {
		baseURL: "https://api.amux.ai/v1"
	}
})

// 节点1: 生成主题
async function generateTopic(): Promise<Partial<TState>> {
	console.log("正在运行节点1:生成一个主题")

	const res = await model.invoke(
		"请给我一个有趣的笑话主题，只返回一个简短的中文词汇，不要有任何标点或其他文字。"
	)

	return {
		topic: res.content as string
	}
}

// 节点2: 根据主题生成笑话
async function writeJoke(state: TState): Promise<Partial<TState>> {
	console.log("正在运行节点2:根据主题生成笑话")

	if (!state.topic) throw new Error("没有笑话主题，无法生成笑话")

	const res = await model.invoke(`请根据这个主题写一个简短的中文笑话: ${state.topic}`)

	return {
		joke: res.content as string
	}
}

const checkpointer = new MemorySaver()

// 构建图
const graph = new StateGraph(Schema)
	.addNode("generateTopic", generateTopic)
	.addNode("writeJoke", writeJoke)
	.addEdge(START, "generateTopic")
	.addEdge("generateTopic", "writeJoke")
	.addEdge("writeJoke", END)
	.compile({
		checkpointer
	})

async function main() {
	// 定义一下配置 thread_id
	const config = {
		configurable: {
			thread_id: "demo" + Date.now()
		}
	}
	console.log("\n=================================")
	console.log("🚀 开始运行时间旅行")
	console.log("=================================\n")
	console.log(`Thread ID: ${config.configurable.thread_id}\n`)

	// 1. 完整运行一次图
	console.log(">>> 第一次运行 (生成主题 -> 生成笑话)...")
	const result = await graph.invoke({}, config)
	console.log("result>>>", result)

	// 2. 获取检查点历史
	const history: CheckpointState[] = []
	for await (const cp of graph.getStateHistory(config)) {
		history.push(cp)
	}

	// 3. 需要从检查点历史里面找到回溯点
	const targetCheckpoint = history.find(
		(c) => Array.isArray(c.next) && c.next.includes("writeJoke")
	)

	if (!targetCheckpoint) throw new Error("没有找到回溯的checkpoint")

	const currentTopic = targetCheckpoint.values.topic

	// 4. 告知用户当前的主题是什么，并且询问是否需要改变
	console.log("\n---------------------------------")
	console.log("👀 历史回溯点检测")
	console.log("---------------------------------")
	console.log(`在生成笑话之前，AI 确定的主题是: "${currentTopic}"`)
	console.log("\n您现在有机会进行「时间旅行」！")
	console.log("1. ⏳ 保持现状 (继续生成原主题的笑话)")
	console.log("2. ⏱️ 修改过去 (修改主题，让 AI 重新生成笑话)")

	const choice = readline.question("\n请输入您的选择 (1 或 2):")

	if (choice.trim() === "2") {
		// 要修改主题
		const newTopic = readline.question("请输入新的主题 (例如: 猫, 程序员, 披萨): ")
		console.log(`\n🔄 正在执行时间旅行... 将主题修改为: "${newTopic}"`)

		// 关键的一步：需要修改图的状态
		const newConfig = await graph.updateState(targetCheckpoint.config, {
			topic: newTopic
		})
		console.log("✅ 状态已修改，正在从修改点继续执行 Graph...")

		const result = await graph.invoke(null, newConfig)
		console.log("\n=================================")
		console.log("🎉 时间旅行成功！最终结果：")
		console.log("=================================")
		console.log(`最终主题: ${result.topic}`)
		console.log(`生成的笑话: ${result.joke}`)
	} else {
		// 不修改主题，拿到最后一个检查点的状态
		const finalState = await graph.getState(config)
		console.log("\n=================================")
		console.log("✅ 流程结束 (未修改)")
		console.log("=================================")
		console.log(`最终主题: ${finalState.values.topic}`)
		console.log(`生成的笑话: ${finalState.values.joke}`)
	}
}

await main()
