import { StringOutputParser } from "@langchain/core/output_parsers"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { getChatGPT } from "../model.ts"
import { SUMMARY_PROMPT, SYSTEM_PROMPT } from "../prompt.ts"
import type { TArticle } from "../state.ts"

export async function summaryNode(state: TArticle): Promise<Partial<TArticle>> {
	if (!state.topic) throw new Error("未指定文章主题！")
	if (!state.title) throw new Error("文章标题缺失！")
	if (!state.content) throw new Error("文章正文内容缺失！")

	const { topic, title, content } = state

	const pt = ChatPromptTemplate.fromMessages([
		["system", SYSTEM_PROMPT],
		["human", SUMMARY_PROMPT]
	])

	const model = getChatGPT()

	const chain = pt.pipe(model).pipe(new StringOutputParser())

	const summary = await chain.invoke({
		topic,
		title,
		content
	})

	console.log(`文章摘要已经生成，共：${summary.length} 字`)

	return {
		summary
	}
}
