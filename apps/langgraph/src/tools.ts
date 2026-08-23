// 工具

import { tool } from "@langchain/core/tools"
import { interrupt } from "@langchain/langgraph"
import { z } from "zod/v4"

// 工具参数的结构
export const createApprovalFormSchema = z.object({
	applicant: z.string().describe("申请人的姓名"),
	amount: z.number().describe("申请的审批金额"),
	reason: z.string().describe("申请的理由")
})

export type T_createApprovalFormSchema = z.infer<typeof createApprovalFormSchema>

const func = async ({ applicant, amount, reason }: T_createApprovalFormSchema) => {
	// 需要产生一个中断，需要用户来输入amount以及reason
	// 这里产生中断，逻辑就会跳回到主逻辑
	// 主逻辑如何恢复图的执行 new Command({ resume : "xxxx"})
	// 外界如果用户输入的是 y -> new Command({ resume: { action: "approve", amount: val.amount } })
	// m -> new Command({ resume: { action: "approve", amount: Number(newAmount) })
	// n -> new Command({ resume: { action: "reject" } })
	// 根据用户不同的输入，回头重新回到图的时候，带过来的信息是不一样的
	const response = interrupt({
		action: "create_form",
		applicant, // 申请人姓名
		amount, // 申请金额
		reason, // 申请理由
		message: "是否批准创建该审批单？（可选择批准或修改金额/理由）"
	})

	// 根据 response 上面的不同信息，做不同的处理
	if (response.action === "approve") {
		// 说明是批准或者修改
		const finalAmount = response.amount // 首先拿到获批的金额

		// 再次中断，询问审批理由
		const finalReason = interrupt("请输入审批理由")

		console.log(
			"调用了 [createApprovalForm] 工具，成功创建了一张审批单：",
			applicant, // 申请人
			finalAmount, // 最终获审批的金额
			finalReason // 审批理由
		)

		return `审批单创建成功（申请人：${applicant}，金额：${finalAmount}，理由：${finalReason}）`
	}

	// 代码来到这里，说明是拒绝
	return "审批单已被主管取消创建。"
}

// 该工具就是创建审批单的工具
// 该工具会涉及到中断
// 而且会中断两次
// 1. 向外界询问是否创建审批单
// 2. 向外界询问审批单的理由
export const createApprovalForm = tool(func, {
	name: "createApprovalForm",
	description: "用户想创建审批单时，调用该工具",
	schema: createApprovalFormSchema
})
