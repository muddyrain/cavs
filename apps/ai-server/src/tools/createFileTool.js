import fs from "fs"
import { z } from "zod"

export const createFileTool = [
	"createFile",
	{
		title: "创建文件",
		description: "在指定目录下创建一个文件",
		inputSchema: {
			filename: z.string().describe("文件名"),
			content: z.string().describe("文件内容")
		}
	},
	({ filename, content }) => {
		try {
			fs.writeFileSync(filename, content)
			return {
				content: [
					{
						type: "text",
						text: `文件创建成功！`
					}
				]
			}
		} catch (err) {
			return {
				content: [
					{
						type: "text",
						text: err.message || "文件创建失败！"
					}
				]
			}
		}
	}
]
