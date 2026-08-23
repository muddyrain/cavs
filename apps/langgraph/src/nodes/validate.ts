import { interrupt } from "@langchain/langgraph"
import type { T_State } from "../state.ts"

// 该节点主要用于验证用户输入的名称是否合规
export async function validateNode(state: T_State): Promise<Partial<T_State>> {
	let name = state.applicantName // 拿到状态里面的申请人名称

	// 第一次的弹出语句
	let prompt = "请输入你的姓名"

	// 验证用户的输入，只要用户的输入不合规，就产生中断，回到主逻辑

	while (!name || name.trim().length < 4) {
		// 只要进入此循环，说明名称不符合要求
		// 执行中断，代码去到外界
		// answer就是拿到外界用户输入的名称
		const answer = interrupt(prompt)

		if (typeof answer === "string" && answer.length >= 4) {
			// 如果进入此分支，说明用户的输入是符合要求的
			name = answer
		} else {
			prompt = `“${answer}”不像是有效的姓名，请重新输入（至少长度大于等于4）：`
		}
	}

	// 如果代码来到这里，用户输入的姓名是合规的
	return {
		applicantName: name
	}
}
