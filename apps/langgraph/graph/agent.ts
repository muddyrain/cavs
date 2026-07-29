import { END, START, StateGraph } from "@langchain/langgraph"
import fs from "fs"
import type { TArticle } from "../state.ts"
import { Schema } from "../state.ts"
import { contentNode } from "./content_node.ts"
import { imageNode } from "./image_node.ts"
import { summaryNode } from "./summary_node.ts"
import { titleNode } from "./title_node.ts"

export function buildGraph() {
	// 构建图
	return (
		new StateGraph(Schema)
			// 添加任务节点
			.addNode("title_node", titleNode)
			.addNode("image_node", imageNode)
			.addNode("summary_node", summaryNode)
			.addNode("content_node", contentNode)
			// 添加边
			.addEdge(START, "title_node")
			.addEdge("title_node", "content_node")
			.addEdge("content_node", "summary_node")
			.addEdge("summary_node", "image_node")
			.addEdge("image_node", END)
			.compile()
	)
}

export async function writeArticle(agent: any, topic: string) {
	// 初始状态
	const initState: TArticle = {
		topic,
		title: "",
		content: "",
		summary: "",
		image_path: ""
	}
	console.log(`智能编辑已经开始撰写文章，文章的主题为：${topic}`)
	return await agent.invoke(initState)
}

// 创建md文件
export function dumpMarkdown(state: TArticle) {
	const { title, content, image_path } = state
	const filename = `./${title}.md`

	let mdContent = `# ${title}\n\n`
	mdContent += `${content}\n\n`
	mdContent += `![${title}](${image_path})\n\n`

	// 写入
	fs.writeFileSync(filename, mdContent)
	console.log(`文章已经生成完毕，保存至：${filename} 位置`)
}
