import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { bannerPhoneResource } from "./resources/bananaPhoneResource.js"
import { bookResource } from "./resources/bookResource.js"
import { createFileTool } from "./tools/createFileTool.js"
import { getWetherTool } from "./tools/getWetherTool.js"
import { sumTool } from "./tools/sumTool.js"
import { readResource } from "./utils/readResource.js"

const server = new McpServer({
	name: "wether-mcp-server",
	version: "1.0.0",
	description: "一个MCP服务器"
})

server.registerResource(...bannerPhoneResource)
server.registerResource(...bookResource)

// 注册工具（每个工具独立维护在各自文件）
server.registerTool(...sumTool)
server.registerTool(...createFileTool)
server.registerTool(...getWetherTool)

// 创建一个 stdio 传输层
const transport = new StdioServerTransport()

// 连接 transport
server.connect(transport)
