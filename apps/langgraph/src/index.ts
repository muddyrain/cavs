import "dotenv/config"
import { runDemoMode } from "./run/demo.ts"
import { runInteractiveMode } from "./run/interactive.ts"

function main() {
	// 读取控制台的参数
	const args = process.argv.slice(2)
	if (args.includes("--demo")) runDemoMode()
	else runInteractiveMode()
}
main()
