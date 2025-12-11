import { z } from "zod"

export const sumTool = [
	"sum", // 工具名称
	{
		title: "两数求和",
		description: "得到两个数的和",
		inputSchema: {
			a: z.number().describe("第一个数"),
			b: z.number().describe("第二个数")
		}
	},
	({ a, b }) => {
		// 正常的工具（函数）的逻辑
		return {
			content: [
				{
					type: "text",
					text: `两个数的和为${a + b}`
				}
			]
		}
	}
]
