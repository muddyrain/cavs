import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { createFileTool } from "./tools/createFileTool.js"
import { getWetherTool } from "./tools/getWetherTool.js"
import { sumTool } from "./tools/sumTool.js"

const server = new McpServer({
	name: "wether-mcp-server",
	version: "1.0.0",
	description: "一个MCP服务器"
})

// 注册工具（每个工具独立维护在各自文件）
server.registerTool(...sumTool)
server.registerTool(...createFileTool)
server.registerTool(...getWetherTool)

// 创建一个 stdio 传输层
const transport = new StdioServerTransport()

// 连接 transport
server.connect(transport)
