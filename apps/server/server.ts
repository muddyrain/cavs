import "dotenv/config"
import { ChatOllama } from "@langchain/ollama"
import cors from "cors"
import express from "express"
import { jokeModel, poemModel } from "./graph.ts"

const app = express()
app.use(cors())

async function streamModelTokens(
	res: express.Response,
	topic: string,
	model: ChatOllama,
	kind: "joke" | "poem"
) {
	// 该方法很简单，请求模型，拿到模型的回复，返回给前端

	// 提示词
	const prompt =
		kind === "joke" ? `使用中文写一个关于${topic}的笑话` : `使用中文写一个关于${topic}的诗歌`

	const events = await model.streamEvents([{ role: "human", content: prompt }], {
		version: "v2"
	})

	for await (const event of events) {
		// 遍历事件流，对特定的事件类型做处理
		if (event.event === "on_chat_model_stream") {
			const token = event.data.chunk?.content
			// 说明当前触发的事件，能够拿到对应的token
			// 将这个token交给前端
			if (token) {
				res.write(
					`data: ${JSON.stringify({
						msg: { content: token },
						metadata: { tags: event.tags }
					})}\n\n`
				)
			}
		}
	}
}

app.get("/stream-messages", async (req, res) => {
	// 设置SSE响应头
	// res.writeHead(200, {
	//   "Content-Type": "text/event-stream",
	//   "Cache-Control": "no-cache",
	//   Connection: "keep-alive",
	// });

	res.setHeader("Content-Type", "text/event-stream")
	res.setHeader("Cache-Control", "no-cache")
	res.setHeader("Connection", "keep-alive")

	const topic = req.query.topic || "小狗"

	// 接下来就是两个模型各自开始工具

	try {
		await Promise.all([
			streamModelTokens(res, topic as string, jokeModel, "joke"),
			streamModelTokens(res, topic as string, poemModel, "poem")
		])

		res.write("event: end\ndata: done\n\n")
	} catch (err) {
		console.error("服务端报错，错误为：", err)
	} finally {
		res.end()
	}
})

app.listen(3002, () => console.log("服务器已启动，监听3002端口..."))
