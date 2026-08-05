import { END, getWriter, START, StateGraph } from "@langchain/langgraph"
import cors from "cors"
import express from "express"
import { z } from "zod/v4"

const app = express()
app.use(cors())

// 整张图的状态
const StateSchema = z.object({
	rawData: z.array(z.number()).optional().describe("原始数据"),
	cleanedData: z.array(z.number()).optional().describe("清洗后的熟悉"),
	analysis: z
		.object({
			mean: z.number().describe("平均值"),
			max: z.number().describe("最小值")
		})
		.optional()
		.describe("分析结果"),
	report: z.string().optional().describe("报告")
})
type TState = z.infer<typeof StateSchema>

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// 1. 拉取数据
async function fetchData() {
	const writer = getWriter()

	if (!writer) return

	writer({ stage: "fetchData", progress: 10, msg: "开始拉取数据..." })
	await sleep(3000)

	writer({ stage: "fetchData", progress: 30, msg: "数据获取中..." })
	await sleep(3000)

	writer({ stage: "fetchData", progress: 50, msg: "数据拉取过半..." })
	await sleep(4000)

	// 生成10个随机数
	const data = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100 + 1))

	writer({
		stage: "fetchData",
		progress: 100,
		msg: "数据已经拉取完成",
		rawData: data
	})

	return {
		rawData: data
	}
}

// 2. 数据清洗
async function preprocess(state: TState) {
	const writer = getWriter()

	if (!writer) return

	writer({ stage: "preprocess", msg: "开始清洗数据..." })
	await sleep(5000)

	// 做一个清洗：一个简单过滤
	const cleaned = (state.rawData ?? []).filter((n) => n > 30)

	// 向前端推送一个消息
	writer({
		stage: "preprocess",
		msg: `筛选掉小于等于 30 的数值，剩余 ${cleaned.length} 项`,
		cleanedData: cleaned // 推送筛选后的数据
	})

	return {
		cleanedData: cleaned
	}
}

// 3. 针对清洗后的数据做一个分析
async function analyze(state: TState) {
	const writer = getWriter()

	if (!writer) return

	writer({ stage: "analyze", msg: "开始计算统计结果..." })
	await sleep(5000)

	const arr = state.cleanedData // 拿到清洗后的数据

	if (!arr) return

	const mean = arr.reduce((a, b) => a + b, 0) / arr.length // 平均值
	const max = Math.max(...arr) // 最大值

	// 向前端推送分析结果
	writer({
		stage: "analyze",
		msg: "分析完成",
		partial: { mean, max }
	})

	// 更细图的状态
	return { analysis: { mean, max } }
}

// 4. 根据分析结果生成报告
async function generateReport(state: TState) {
	const writer = getWriter()

	if (!writer) return

	writer({ stage: "report", msg: "正在生成最终报告..." })
	await sleep(3000)

	if (!state.cleanedData) return
	if (!state.analysis) return

	const report = `有效数据 ${state.cleanedData.length} 条，max=${
		state.analysis.max
	}，mean=${state.analysis.mean.toFixed(2)}。`

	// 向前端推送报告
	writer({ stage: "report", msg: "报告生成完成", finalReport: report })

	// 更新图的状态
	return { report }
}

// 5. 构建图
const graph = new StateGraph(StateSchema)
	.addNode("fetchData", fetchData)
	.addNode("preprocess", preprocess)
	.addNode("analyze", analyze)
	.addNode("generateReport", generateReport)
	.addEdge(START, "fetchData")
	.addEdge("fetchData", "preprocess")
	.addEdge("preprocess", "analyze")
	.addEdge("analyze", "generateReport")
	.addEdge("generateReport", END)
	.compile()

// 6. 构建一个后端接口
app.get("/run", async (req, res) => {
	// 和前端建立SSE连接
	res.writeHead(200, {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		Connection: "keep-alive"
	})

	const stream = await (graph as any).stream({}, { streamMode: "custom" })

	for await (const item of stream) {
		// 一点一点向前端推送
		res.write(`data: ${JSON.stringify(item)}\n\n`)
	}

	res.end()
})

app.listen(3001, () => {
	console.log("服务器已经启动，监听3001端口...")
})
