import { mainGraph } from "./mainGraph.ts"

async function main() {
	const input = {
		orderId: "A10101",
		ip: "10.1.10.10",
		amount: 6000
	}

	const result = await mainGraph.invoke(input)

	console.log("\n=====最终结果=======")
	console.log(result)
}
main()
