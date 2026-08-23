import { z } from "zod/v4"

// 工具调用的结构
const ToolCallSchema = z.object({
	name: z.string().describe("工具的名称"),
	args: z.record(z.string(), z.any()).describe("工具的参数对象，键值对的形式"),
	id: z.string().optional().describe("工具调用的id"),
	type: z.string().optional().describe("工具调用的类型")
})

// 一条消息的结构
export const MessageSchema = z.object({
	role: z.enum(["user", "assistant", "tool"]).describe("角色"),
	content: z.string().describe("消息的具体文本内容"),
	tool_calls: z
		.array(ToolCallSchema)
		.optional()
		.describe("工具调用的列表，列表里面每一个对象的结构符合ToolCallSchema"),
	tool_call_id: z.string().optional().describe("工具调用的id"),
	name: z.string().optional().describe("工具名称，用于标识哪个工具返回了结果")
})

// 根据message消息结构生成的ts类型
export type T_Message = z.infer<typeof MessageSchema>

// 整张图的结构
export const StateSchema = z.object({
	messages: z
		.array(MessageSchema)
		.describe("消息数组，数组里面的每一项是一个对象，对象结构符合MessageSchema"),
	applicantName: z.string().nullable().optional().describe("申请人名称"),
	reviewContent: z.string().nullable().optional().describe("审核内容"),
	__interrupt__: z.any().optional() // 显式定义中断字段
})

// 根据图的结构生成ts类型
export type T_State = z.infer<typeof StateSchema>
