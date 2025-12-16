import { Server } from "@modelcontextprotocol/sdk/server"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import {
	ListResourcesRequestSchema,
	ListResourceTemplatesRequestSchema,
	ReadResourceRequestSchema
} from "@modelcontextprotocol/sdk/types.js"
import chokidar from "chokidar"
import fs from "fs"
import path from "path"
import { bannerPhoneResource } from "./resources/bananaPhoneResource.js"
import { bookResource } from "./resources/bookResource.js"
import { createFileTool } from "./tools/createFileTool.js"
import { getWetherTool } from "./tools/getWetherTool.js"
import { sumTool } from "./tools/sumTool.js"
import {
	getMimeType,
	getWatchDir,
	readBananaPhoneInfo,
	readBinaryFile,
	readCodeFile
} from "./utils/index.js"

// const server = new McpServer({
// 	name: "wether-mcp-server",
// 	version: "1.0.0",
// 	description: "一个MCP服务器"
// })

// server.registerResource(...bannerPhoneResource)
// server.registerResource(...bookResource)

// // 注册工具（每个工具独立维护在各自文件）
// server.registerTool(...sumTool)
// server.registerTool(...createFileTool)
// server.registerTool(...getWetherTool)

const server = new Server(
	{
		name: "resources-server",
		version: "0.1.0",
		description: "提供资源的MCP服务器"
	},
	{
		capabilities: {
			resources: {}
		}
	}
)

// 罗列资源列表
server.setRequestHandler(ListResourcesRequestSchema, async () => {
	// 每次罗列资源的时候，都需要读取一下 assets 目录，看一下有哪些资源
	// 而不能写死，因为资源目录里面的资源有可能增加或者删除

	const watchDir = getWatchDir()
	const resources = [] // 存储最终所有的资源

	try {
		// 读取目录
		const files = fs.readdirSync(watchDir) // ["1.txt", "2.txt", ....]
		// 组装资源对象
		for (const file of files) {
			const filePath = path.join(watchDir, file)
			const stat = fs.statSync(filePath) // 该方法是查看一个资源的状态

			if (stat.isFile()) {
				// 如果进入此分支，说明当前的这个资源是一个文件资源
				resources.push({
					uri: `file://${filePath}`,
					name: file,
					mimeType: getMimeType(file),
					desciption: `文件: ${file}`
				})
			}
		}
	} catch (err) {
		console.error(`读取资源目录时出错: ${err.message}`)
	}

	return {
		resources
	}
})

// 读取具体的资源
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
	const { uri } = request.params
	console.error("uri>>>", uri) // 例如：file:///Users/jie/Desktop/demo/src/assets/1.txt

	const filePath = uri.replace("file://", "") // -> /Users/jie/Desktop/demo/src/assets/1.txt

	try {
		const content = fs.readFileSync(filePath, "utf8")
		const filename = path.basename(filePath)

		return {
			contents: [
				{
					uri,
					mimeType: getMimeType(filename),
					text: content
				}
			]
		}
	} catch (err) {
		console.error(`读取文件失败: ${err.message}`)
	}
})

// 向客户端发送通知
function sendNotification() {
	server.notification({
		method: "notifications/resources/list_changed",
		params: {}
	})
}

// 初始化一个监听器
function initWatcher() {
	// 获取监听的目录
	const watchDir = getWatchDir()

	// 创建一个监听器
	const watcher = chokidar.watch(watchDir, {
		ignored: /(^|[/\\])\../, // 忽略隐藏文件
		persistent: true, // 持久监听
		ignoreInitial: true // 忽略初始扫描，在启动监听器的时候，第一次添加监听文件不会触发 add 一类的事件
	})

	watcher
		.on("add", () => {
			// 向客户端发送通知
			sendNotification()
		})
		.on("unlink", () => {
			// 向客户端发送通知
			sendNotification()
		})
}

// 创建一个 stdio 传输层
const transport = new StdioServerTransport()

// 连接 transport
server.connect(transport)

initWatcher()
