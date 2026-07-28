import { BaseMessage, HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages"
import { getChatGPT } from "../model.ts"
import { CONTENT_PROMPT, SYSTEM_PROMPT } from "../prompt.ts"
import type { TArticle } from "../state.ts"
import tools from "../tools/index.ts"

export async function contentNode(state: TArticle): Promise<Partial<TArticle>> {
	if (!state.topic) throw new Error("没有指定文章的主题")
	if (!state.title) throw new Error("文章标题缺失！")

	const { topic, title } = state

	const systemContent = SYSTEM_PROMPT.replace("{topic}", topic)
	const userContent = CONTENT_PROMPT.replace("{title}", title)

	// 组件消息数组
	const messages: BaseMessage[] = [new SystemMessage(systemContent), new HumanMessage(userContent)]

	const model = getChatGPT()
	const modelWithTools = model.bindTools(tools) // 带工具的模型

	// ReAct循环模式的体现
	// 1. 思考：模型思考接下来需要做什么
	// 2. 决策：进行具体行动

	while (true) {
		const reply = await modelWithTools.invoke(messages)
		messages.push(reply)

		// 接下来就需要对 reply 进行一个判断，reply 的形态决定了是否退出当前的循环
		/**
		 * reply是一个对象：
		 * 情况一：模型给你的回复是调用工具
		 * {
		 *  content: "",
		 *  tool_calls: [
		 *      {name: "search", args: {query: "..."}, id: "call_xxx"}
		 *  ]
		 * }
		 * 情况二：模型生成了最终的答复
		 * {
		 *  content: "文章具体的内容.....",
		 *  tool_calls: []
		 * }
		 */

		if (!reply.tool_calls || reply.tool_calls.length === 0) {
			// 说明此时是情况二，不需要调用工具，模型已经生成了文章的完整内容
			// 此节点可以结束了，可以进入下一个节点
			const content = reply.content as string
			console.log(`文章的正文部分已经生成完毕，共 ${content.length} 字`)
			return { content }
		}

		// 如果没有进入上面的 if，那么就调用工具
		/**
		 * tool_calls: [
		 *      {name: "search", args: {query: "..."}, id: "call_xxx", description: "xxxxx"},
		 *      {name: "calc", args: {a: "...", b: "xxx"}, id: "call_xxx", description: "xxxxx"},
		 *  ]
		 */
		for (const toolCall of reply.tool_calls) {
			// 从当前的工具箱里面去寻找对应的工具
			const selectedTool = tools.find((tool) => tool.name === toolCall.name)
			if (selectedTool) {
				// 从工具箱找到了相应的工具
				// 既然找到了，那么就执行工具
				const toolResult = await (selectedTool as any).invoke(toolCall.args)
				console.log(`[${toolCall.name}] 工具调用已经完成，工具调用结果为：${toolResult}`)
				messages.push(
					new ToolMessage({
						content: toolResult,
						tool_call_id: toolCall.id!,
						name: toolCall.name
					})
				)
			} else {
				console.warn(`没有找到名为${toolCall.name}的工具`)
			}
		}
	}
}
