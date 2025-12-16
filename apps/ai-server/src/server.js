import { Server } from "@modelcontextprotocol/sdk/server"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import {
	ListResourcesRequestSchema,
	ListResourceTemplatesRequestSchema,
	ReadResourceRequestSchema
} from "@modelcontextprotocol/sdk/types.js"
import chokidar from "chokidar"
import fs from "fs"
import path from "path"
import { bannerPhoneResource } from "./resources/bananaPhoneResource.js"
import { bookResource } from "./resources/bookResource.js"
import { createFileTool } from "./tools/createFileTool.js"
import { getWetherTool } from "./tools/getWetherTool.js"
import { sumTool } from "./tools/sumTool.js"
import {
	getMimeType,
	getWatchDir,
	readBananaPhoneInfo,
	readBinaryFile,
	readCodeFile
} from "./utils/index.js"

const server = new McpServer({
	name: "mcp-server",
	version: "1.0.0",
	description: "一个MCP服务器"
})

server.registerPrompt(
	"总结代码",
	{
		description: "生成代码总结的prompt模板",
		arguments: [
			{
				name: "code",
				description: "需要总结的代码",
				required: false
			},
			{
				name: "language",
				description: "代码对应的编程语言",
				required: false
			}
		]
	},
	async (request) => {
		const args = request.arguments || {} // 拿到对应的参数
		const { code, language } = args

		// 因为 inspector 调试工具不支持传参，这里我们给一个默认值
		const codeContent =
			code ||
			`
    function calculateTotal(items) {
      let total = 0;
      for (const item of items) {
        total += item.price * item.quantity;
      }
      return total;
    `

		const codeLanguage = language || "javascript"

		return {
			messages: [
				{
					role: "user",
					content: {
						type: "text",
						text: `
              请帮我总结以下${codeLanguage}代码的功能和主要逻辑：
                \`\`\`${codeLanguage.toLowerCase()}
                ${codeContent}
                \`\`\`

                请用中文回答，包括：
                1. 代码的主要功能
                2. 关键的逻辑流程  
                3. 使用的主要技术或库
                4. 可能的改进建议

                ${!code ? "\n*注意：由于未提供代码参数，这里使用了示例代码进行演示。*" : ""}
            `
					}
				}
			]
		}
	}
)

server.registerPrompt(
	"生成测试的提示词模板", // 第一个参数：提示词模板的名称
	{
		// 第二个参数：配置对象
		description: "为指定函数生成测试用例的prompt模板",
		arguments: [
			{
				name: "function_name",
				description: "要测试的函数名称",
				required: false
			},
			{
				name: "function_code",
				description: "函数的完整代码",
				required: false
			},
			{
				name: "test_framework",
				description: "使用的测试框架 (例如: Jest, Mocha, Vitest)",
				required: false
			}
		]
	},
	async (request) => {
		// 第三个参数：处理函数
		const args = request.arguments || {}
		const { function_name, function_code, test_framework } = args

		// 提供默认值
		const functionName = function_name || "calculateTotal"
		const functionCode =
			function_code ||
			`function calculateTotal(items) {
  if (!Array.isArray(items)) {
    throw new Error('参数必须是数组');
  }
  
  let total = 0;
  for (const item of items) {
    if (!item.price || !item.quantity) {
      throw new Error('每个商品必须有价格和数量');
    }
    total += item.price * item.quantity;
  }
  return total;
}`
		const testFramework = test_framework || "Jest"

		return {
			messages: [
				{
					role: "user",
					content: {
						type: "text",
						text: `请为以下函数生成${testFramework}测试用例：

函数名：${functionName}

函数代码：
\`\`\`javascript
${functionCode}
\`\`\`

请生成包括以下场景的测试用例：
1. 正常情况的测试
2. 边界情况的测试
3. 错误情况的测试
4. 输入验证的测试

请用中文注释说明每个测试用例的目的。

${
	!function_name && !function_code
		? "\n*注意：由于未提供函数参数，这里使用了示例函数进行演示。*"
		: ""
}`
					}
				}
			]
		}
	}
)

server.registerResource(...bannerPhoneResource)
server.registerResource(...bookResource)

// 注册工具（每个工具独立维护在各自文件）
server.registerTool(...sumTool)
server.registerTool(...createFileTool)
server.registerTool(...getWetherTool)

// 创建一个 stdio 传输层
const transport = new StdioServerTransport()

// 连接 transport
server.connect(transport)
