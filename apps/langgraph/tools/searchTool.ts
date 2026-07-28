// 搜素工具

import { tool } from "@langchain/core/tools"
import { z } from "zod"

// 工具方法参数 schema
const schema = z.object({
	query: z.string().describe("搜索的关键字")
})

export type searchInput = z.infer<typeof schema>

const func = async ({ query }: searchInput): Promise<string> => {
	console.log(`正在调用工具 [search] 进行搜索，搜索的关键词为：${query}`)

	// SerpAPI
	const baseUrl = "https://serpapi.com/search.json"
	const apiKey = process.env.SERPER_API_KEY

	if (!apiKey) throw new Error("缺少Serp Api Key")

	// 构建url的查询参数
	const params = new URLSearchParams({
		engine: "google",
		q: query,
		api_key: apiKey,
		gl: "cn",
		hl: "zh-cn"
	})

	try {
		const response = await fetch(`${baseUrl}?${params.toString()}`)
		if (!response.ok) throw new Error(`搜索失败，状态码为${response.status}`)
		const json = await response.json()
		if (json.organic_results && json.organic_results.length > 0) {
			// 说明这一次搜索是有效的
			return json.organic_results[0].result
		}
		return "没有搜索到相关结果"
	} catch (err) {
		console.error("Search工具出现错误，错误信息为：", err)
		return "搜索错误"
	}
}

const search = tool(func, {
	name: "search",
	description: "根据关键词，在互联网上检索相关的信息",
	schema
})

export default search
