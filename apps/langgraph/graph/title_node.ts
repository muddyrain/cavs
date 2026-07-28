import { StringOutputParser } from "@langchain/core/output_parsers"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { getChatGPT } from "../model.ts"
import { SYSTEM_PROMPT, TITLE_PROMPT } from "../prompt.ts"
import type { TArticle } from "../state.ts"

export async function titleNode(state: TArticle): Promise<Partial<TArticle>> {
	if (!state.topic) throw new Error("没有指定文章的主题")
	const topic = state.topic

	const pt = ChatPromptTemplate.fromMessages([
		{ role: "system", content: SYSTEM_PROMPT },
		{ role: "user", content: TITLE_PROMPT }
	])

	const model = getChatGPT()

	const chain = pt.pipe(model).pipe(new StringOutputParser())

	const title = await chain.invoke({ topic })

	console.log(`文章标题已经生成完毕，生成的标题为：${title}`)

	return { title }
}
