import calcTool from "./calcTool.ts";
import timeTool from "./timeTool.ts";
import weatherTool from "./weatherTool.ts";
import search from "./searchTool.ts";

const tools = [calcTool, timeTool, weatherTool, search];

export type ToolList = typeof tools;

export default tools;
