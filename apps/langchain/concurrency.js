/**
 * @param {*} items 要处理的任务列表
 * @param {*} worker 处理单个任务的异步函数
 * @param {*} maxConcurrency 最大并发数
 */
export async function runWithConcurrency(items, worker, maxConcurrency) {
	let i = 0 // 指向当前处理的任务
	// 用于存储工人干活的promise
	const workers = []

	// 启动工人开始干活
	// 调用一次，就会启动一个工人干活
	async function spawn() {
		while (i < items.length) {
			// 只要在这个 while 里面 ，就说明当前还有任务
			const idx = i++
			await worker(items[idx], idx)
		}
		// 推出 while ，说明任务已经被领完了
	}
	// 可以将最大并发数，看作是N个worker同时工作
	// 计算有几个worker
	// 1. 工人数不能超过总的任务数
	// 2. 至少要有一个worker
	const n = Math.max(1, Math.min(maxConcurrency, items.length))

	for (let i = 0; i < n; i++) {
		workers.push(spawn())
	}

	// 等待所有工人完成
	await Promise.allSettled(workers)
}
