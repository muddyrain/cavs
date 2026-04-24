import { chain } from "./chain.js"
import { withTimeout } from "./withTimeout.js"

/**
 *
 * @param {*} topic 要处理的主题内容：闭包、原型链
 * @param {*} label 标记是第几个任务：1/5、2/5
 * @param {*} timeoutMs 超时时间
 */
export async function steamExplain(topic, label, timeoutMs) {
	const controller = new AbortController()
	const { signal } = controller
	const start = Date.now()
	process.stdout.write(`\n[${label}] 开始：${topic}\n`)
	const task = (async () => {
		// 与大模型进行交互
		const res = await chain.stream({
			topic,
			signal
		})
		for await (const chunk of res) {
			process.stdout.write(chunk)
		}

		process.stdout.write(`\n[${label}] 完成：${topic}，耗时：${Date.now() - start}ms\n`)
	})()

	// 将这个任务封装成一个支持超时的任务
	return withTimeout(task, timeoutMs, () => {
		controller.abort()
	})
}
