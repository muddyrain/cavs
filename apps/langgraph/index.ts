import { mainGraph } from "./mainGraph.ts"

async function main() {
	// 模拟数据
	const input = {
		userName: "张三",
		idCardImage: "path/idcard.jpg",
		selfImage: "path/selfie.jpg"
	}

	const result = await mainGraph.invoke(input)

	console.log("\n=== 最终结果 ===")
	console.log(result)
}
main()
