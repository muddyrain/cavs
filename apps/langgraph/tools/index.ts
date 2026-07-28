import calcTool from "./calcTool.ts"
import search from "./searchTool.ts"
import timeTool from "./timeTool.ts"
import weatherTool from "./weatherTool.ts"

const tools = [calcTool, timeTool, weatherTool, search]

export type ToolList = typeof tools

export default tools
