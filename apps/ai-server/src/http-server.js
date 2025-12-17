import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import { randomUUID } from "crypto"
import express from "express"
import { createMCPServer } from "./mcp-server.js"
import { setCommonHeaders } from "./utils/index.js"

const app = express() // 创建 express 服务器

// 存储所有的连接
// 键：sessionId
// 值：sessionId 对应的连接
const transports = {}

// 添加JSON解析中间件
app.use(express.json())

app.get("/mcp", (req, res) => {
	setCommonHeaders(res)
	// 代表当前的 GET 方法请求不被允许
	// 服务器支持的方法是 POST 方法，而不是当前请求的方法
	res.status(405).set("Allow", "POST").send("当前服务器不支持GET方法，仅支持POST方法")
})

app.post("/mcp", async (req, res) => {
	setCommonHeaders(res)
	// 处理当前的这一次请求
	try {
		const body = req.body // 拿到请求体
		const method = body?.method // 拿到这一次请求体里面的方法 initialize、tools/call、tools/list
		const sessionId = req.headers["mcp-session-id"] // 当前这一次连接的 sessionId
		const transport = sessionId && transports[sessionId] // 拿到 sessionId 对应的连接

		if (!transport && method === "initialize") {
			// 进入此分支，说明当前这一次请求是一个初始化请求
			// 创建一个新的 StreamableHTTP 类型的连接
			const newTransport = new StreamableHTTPServerTransport({
				sessionIdGenerator: () => randomUUID() // 为每个连接生成唯一会话ID
			})

			// 为当前的连接绑定一个 close 事件
			// 会在客户端关闭连接的时候触发
			newTransport.onclose = () => {
				// 需要做清理工作
				if (newTransport.sessionId) {
					delete transports[newTransport.sessionId]
				}
			}

			// 为当前的这个新连接，创建 MCP Server
			const mcpServer = createMCPServer()
			await mcpServer.connect(newTransport)

			// 根据具体的方法，连接 MCP Server 去做处理
			// 如果是初始化请求，还会生成 sessionId
			await newTransport.handleRequest(req, res, body) // 调用该方法处理这一次的请求

			if (newTransport.sessionId) {
				// 进行一个存储
				transports[newTransport.sessionId] = newTransport
			}

			return
		}

		// 没有进入上面的分支，说明是非初始化请求
		if (transport) {
			// 说明连接是存在
			await transport.handleRequest(req, res, body)
			return
		}

		// 没有 transport（没有连接），又不是做初始化
		res.status(400).json({
			error: "非法的请求",
			message: "非法的 SessionId 或者非初始化操作"
		})
	} catch (err) {
		console.error(`出错了，对应信息${err.message}`)
	}
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`MCP Server 运行在 http://localhost:${PORT}/mcp`)
})
