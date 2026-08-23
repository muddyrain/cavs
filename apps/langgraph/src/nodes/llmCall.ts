import { modelWithTool } from "../model.ts"
import type { T_Message, T_State } from "../state.ts"
import { createApprovalForm, createApprovalFormSchema } from "../tools.ts"

export async function llmCall(state: T_State): Promise<Partial<T_State>> {
	// 首先构建一个消息列表
	const messagesWithContext = [
		{
			role: "system",
			content: `当前正在为员工 ${state.applicantName} 处理流程。当用户表达想要创建/发起/申请审批单时，必须调用 createApprovalForm 工具，参数缺失时也要调用并把已知信息填入（缺失字段可用空字符串或 0 占位）。`
		},
		...state.messages
	]

	// 1. 第一次调用大模型：让大模型判断是否要调用工具
	const aiMessage = await modelWithTool.invoke(messagesWithContext)
	// 拿到的结果，里面会包含调用什么工具，但是具体的调用工具这个步骤，需要我们自己去做
	// aiMessage 示例值（调用工具时）：
	// {
	//   content: "",
	//   tool_calls: [
	//     {
	//       name: "create_approval_form",
	//       args: { applicant: "张三", amount: 1000, reason: "项目经费" },
	//       id: "call_abc123"
	//     }
	//   ]
	// }
	// aiMessage 示例值（闲聊时）：
	// {
	//   content: "好的，我会帮您处理这个请求。",
	//   tool_calls: []
	// }

	// 拿出content部分
	const content =
		typeof aiMessage.content === "string" ? aiMessage.content : JSON.stringify(aiMessage.content)

	// 组装一条ai的扁平化信息
	const aiPlainMessage: T_Message = {
		role: "assistant" as const,
		content,
		tool_calls: aiMessage.tool_calls
	}

	const toolCalls = aiMessage.tool_calls ?? []
	// 需要根据tool_calls来查看是否需要调用工具

	// 如果进入此分支，说明不需要调用工具
	if (toolCalls.length === 0) return { messages: [...state.messages, aiPlainMessage] }

	// 代码走到这里，说明是要调用工具
	// 需要取出所有的工具
	// 但是我们这里做一个简化，只取出第一个工具来调用，因为我们只有一个工具
	const firstCall = toolCalls[0]

	// 通过zod去验证参数结构，保证得到的参数能够安全的传递给工具
	const args = createApprovalFormSchema.parse(firstCall.args)

	// 调用工具
	const toolResult = await createApprovalForm.invoke(args)
	// 工具调用的结果示例：
	// 1. "审批单创建成功（申请人：张三，金额：800，理由：项目经费不足，已调整金额）"
	// 2. "审批单已被主管取消创建。"

	// 构建一个工具调用的信息
	const toolMessage: T_Message = {
		role: "tool" as const,
		content: toolResult,
		tool_call_id: firstCall.id,
		name: firstCall.name
	}

	// 2. 再次调用大模型
	// 把工具调用结果给他
	const finalAiMessage = await modelWithTool.invoke([
		...state.messages,
		aiPlainMessage, // 模型让你去调用工具那条信息
		toolMessage, // 你已经调用了工具了，拿到的工具结果
		{
			role: "system",
			content:
				"请注意：主管在审批过程中可能修改了金额或要求补充了理由。请严格按照工具返回的最终结果（tool message 中的内容）向员工进行总结反馈，不要使用初始申请的过期数据。"
		}
	])
	// finalAiMessage 示例值：
	// {
	//   content: "您的审批单已成功创建，金额为800元，理由是项目经费不足，已调整金额。",
	//   tool_calls: undefined
	// }

	// 将这条消息也需要放入到messages里面
	const finalAiPlainMessage: T_Message = {
		role: "assistant" as const,
		content: finalAiMessage.content as string
	}

	return {
		messages: [
			...state.messages,
			aiPlainMessage, // 模型让你去调用工具那条信息
			toolMessage, // 你已经调用了工具了，拿到的工具结果
			finalAiPlainMessage // 模型根据工具调用结果，最终产生的回复信息
		]
	}
}
