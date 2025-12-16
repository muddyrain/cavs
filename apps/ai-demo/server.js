import { watch } from "chokidar"
import express from "express"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

const clients = new Set() // 存储所有的客户端连接
app.use(express.static(join(__dirname, "public")))

app.get("/mcp", (req, res) => {
	res.setHeader("Content-Type", "text/event-stream")
	res.setHeader("Cache-Control", "no-cache")
	res.setHeader("Connection", "keep-alive")

	// 假设现在客户端连接过来，那么这里就给客户端推送一个消息
	res.write("event:connected\n") // 事件名
	res.write("data:你已经连接上SSE服务器\n\n") // 推送的数据

	clients.add(res)

	// 在客户端断开连接的时候，会触发 close 事件
	req.on("close", () => {
		clients.delete(res)
	})
})

// 监听目录
const watcher = watch(join(__dirname, "watched"), {
	persistent: true,
	ignoreInitial: true
})

// 需要在目录发生变化的时候，通知所有的客户端
watcher.on("all", (event, path) => {
	// 将监听到的变化的信息，通知所有的客户端

	// 1. 组装要发送给客户端的信息
	const payload = JSON.stringify({
		event, // 当前资源发生变化 1. 新增 add  2. 删除 unlink  3. 修改 change
		path, // 文件的路径
		time: new Date().toLocaleString()
	})

	// 2. 通知所有的客户端
	for (const client of clients) {
		client.write(`event: resource_changed\n`)
		client.write(`data: ${payload}\n\n`)
	}

	console.log(`【发生了变更】${event} -> ${path}`)
})

app.listen(3000, () => {
	console.log(`服务器已启动, 监听3000端口`)
})
