import { runWithConcurrency } from "./concurrency.js"
import { MAX_CONCURRENCY, TIMEOUT_MS, TOPICS } from "./config.js"
import { steamExplain } from "./steamExplain.js"

async function main() {
	await runWithConcurrency(
		TOPICS,
		async (topic, idx) => {
			const label = `Topic ${idx + 1}: ${TOPICS.length}`
			// 该方法时执行单个任务
			try {
				await steamExplain(topic, label, TIMEOUT_MS)
			} catch (error) {
				console.log(`\n[${label}] 失败：${topic}，错误信息：${error.message}`)
			}
		},
		MAX_CONCURRENCY
	)
}

main()
