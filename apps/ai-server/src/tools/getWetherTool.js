import { z } from "zod"
import { getWeather } from "../utils/weatherHandler.js"

export const getWetherTool = [
	"getWether",
	{
		title: "查询天气",
		description: "查询指定城市和日期的天气情况",
		inputSchema: {
			city: z.string().describe("城市名，例如：成都、上海、北京"),
			date: z.string().describe("日期的描述，例如 今天、明天、2025-7-20")
		}
	},
	async ({ city, date }) => {
		// 具体工具的执行逻辑
		try {
			const result = await getWeather({ city, date })
			return {
				content: [
					{
						type: "text",
						text: result
					}
				]
			}
		} catch (err) {
			console.error(err)
			return {
				content: [
					{
						type: "text",
						text: err.message
					}
				]
			}
		}
	}
]
