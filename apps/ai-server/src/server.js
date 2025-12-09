import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import fs from "fs"
import { z } from "zod"

const server = new McpServer({
	name: "my mcp server",
	version: "1.0.0"
})

// 注册一个工具
server.registerTool(
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
)

server.registerTool(
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
)

// 创建一个 stdio 传输层
const transport = new StdioServerTransport()

// 连接 transport
server.connect(transport)
