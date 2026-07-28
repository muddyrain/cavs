import "dotenv/config"
import { buildGraph, dumpMarkdown, writeArticle } from "./graph/agent.ts"

// 入口文件
async function main() {
	// 1. 构造agent
	const agent = buildGraph()

	// 2. 写文章：agent、主题
	const finalState = await writeArticle(agent, "typescript用go语言换芯")

	// 3. 将文章导出为markdown格式
	dumpMarkdown(finalState)
}

main()
