/**
 * 负责从 MCP Server 的配置文件中加载所有的 MCP Server
 */
import { readFile } from "fs/promises"
import path from "path"

export async function loadConfig() {
	const configPath = path.resolve(process.cwd(), ".mcpconfig.json")
	const raw = await readFile(configPath, "utf-8")

	if (!raw) throw new Error(".mcpconfig.json 文件缺失")

	const config = JSON.parse(raw)

	return config
}
