/**
 *
 * @param {*} promise 原始 Promise
 * @param {*} timeoutMs 超时时间
 * @param {*} onAbort 超时后要做什么
 */
export function withTimeout(promise, timeoutMs, onAbort) {
	let timer = null // 存储定时器

	return new Promise((resolve, reject) => {
		timer = setTimeout(() => {
			try {
				onAbort && onAbort()
			} catch (error) {
				console.error("onAbort超时处理失败:", error)
			}
		}, timeoutMs)

		// 监听原始 Promise 的任务
		promise.then(
			(v) => {
				clearTimeout(timer)
				resolve(v)
			},
			(e) => {
				clearTimeout(timer)
				reject(e)
			}
		)
	})
}
