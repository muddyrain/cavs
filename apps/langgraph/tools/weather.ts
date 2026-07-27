import { tool } from "@langchain/core/tools"
import { z } from "zod/v4"

// 工具方法 参数的schema

const schema = z.object({
	location: z.string().min(1).describe("城市名称，例如北京、上海、广州"),
	unit: z.enum(["celsius", "fahrenheit"]).default("celsius").describe("温度单位")
})

export type WeatherInput = z.infer<typeof schema>

const func = ({ location, unit }: WeatherInput): string => {
	const weather_info = {
		temperature: "22",
		unit,
		location,
		forecast: ["晴朗☀️", "微风"]
	}
	return JSON.stringify(weather_info)
}

const weather = tool(func, {
	name: "weather", // 工具的名称
	description: "查询指定城市当前天气。返回 JSON 字符串，包含温度、单位与简短描述。", // 工具的描述
	schema
})

export default weather
