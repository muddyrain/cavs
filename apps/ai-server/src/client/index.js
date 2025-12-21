import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"
import readline from "readline/promises"
import { loadConfig } from "./loadServer.js"
import { processQuery } from "./process.js"

const { server } = await loadConfig() // ./mcp-server.js
// 去做一个连接
// 首先需要有一个 MCP Client
const mcp = new Client({
	name: "mcp-client",
	version: "0.1.0"
})
// 接下来该做连接了，需要有一个连接通道
const transport = new StdioClientTransport({
	command: "node", // 启动 MCP 服务器的命令
	args: [server] // node ./mcp-server.js
})
mcp.connect(transport) // MCP客户端去连接 MCP Server

// 获取 MCP Server 上面所有的工具
const toolsResult = await mcp.listTools() // tools/list
const tools = toolsResult.tools.map((t) => ({
	type: "function",
	function: {
		name: t.name,
		description: t.description,
		parameters: t.inputSchema
	}
}))

let messages = [] // 存储所有的聊天记录

// 接下来需要启动一个控制台的聊天
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})
console.log(`MCP Client已经成功启动，输入 quit 退出聊天，输入 clear 清除聊天历史`)

function clearMessages() {
	messages = []
}

while (true) {
	const input = await rl.question("请输入您的问题：") // 用户输入的问题

	if (input.toLocaleLowerCase() === "quit") break
	if (input.toLocaleLowerCase() === "clear") {
		clearMessages()
		console.log("聊天记录已经全部清除")
		continue
	}

	// 代码来到这里，那么就正常的处理用户的问题
	const output = await processQuery(input, messages, tools, mcp)
	console.log(output) // 在终端显示处理后的结果
	console.log("\n\n")
}

await mcp.close() // 关闭客户端
rl.close // 关闭终端
process.exit(0) // 关闭进程
