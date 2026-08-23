import "dotenv/config"
import { Command } from "@langchain/langgraph"
import readline from "readline-sync"
import { config, graph } from "./agent.ts"

async function main() {
	console.clear()
	console.log("=== LangGraph 中断特性演示项目 ===")
	console.log("演示目标：\n1. 获取中断值\n2. 编辑图状态\n3. 工具内中断 \n4. 验证用户输入\n")

	// 类型
	type GraphInput = Parameters<typeof graph.invoke>[0]

	// 初始状态
	let input: GraphInput = {
		messages: [
			{
				role: "user",
				content: "我想创建一个 8000 元的审批单。"
			}
		]
	}

	while (true) {
		// 1. 执行一次图
		const state = await graph.invoke(input, config)

		// 2. 拿到中断
		const interrupts = state.__interrupt__

		// 3. 判断中断
		if (!interrupts || interrupts.length === 0) {
			// 没有中断了，说明整个流程执行完毕了
			console.log("\n=== 流程执行结束 ===\n")
			// 将消息数组的最后一条消息给用户看
			console.log("最终结果：", state.messages.at(-1)?.content)
			break
		}

		// 如果代码来到这里，说明有中断
		// 接下来我们就根据不同的中断，做不同的处理
		const currentInterrupt = interrupts[0] // 取出来一个中断
		// 该中断的值大概为：
		// currentInterrupt 示例值（工具中断）：
		// {
		//   id: "interrupt_123",
		//   value: {
		//     action: "create_form",
		//     applicant: "张三",
		//     amount: 8000,
		//     reason: "项目经费",
		//     message: "是否批准创建该审批单？（可选择批准或修改金额/理由）"
		//   }
		// }
		// currentInterrupt 示例值（字符串中断）：
		// {
		//   id: "interrupt_456",
		//   value: "请输入你的姓名"
		// }

		const val = currentInterrupt.value

		console.log("\n------------------------------------------------\n")
		console.log(`[系统提醒] 检测到中断！中断 ID: ${currentInterrupt.id}\n`)

		// 根据不同的中断类型，做不同的事情
		if (typeof val === "string" && (val.includes("请输入你的姓名") || val.includes("重新输入"))) {
			// 来自validate节点的姓名的中断
			console.log(`提示信息: ${val}`)
			// 接收用户姓名的输入
			const name = readline.question("你的回答: ")
			// 恢复图的执行
			input = new Command({ resume: name })
		} else if (val?.action === "create_form") {
			// 来自于工具中的第一次中断
			console.log(`工具调用请求确认: ${val.message}`)
			console.log(`详情: 申请人=${val.applicant}, 金额=${val.amount}`)

			// 接收用户的输入：y、n、m
			const choice = readline.question("是否批准？(y=批准 / n=拒绝 / m=修改金额): ")

			if (choice === "y") {
				input = new Command({
					resume: {
						action: "approve", // 外界确认通过
						amount: val.amount // 金额就是当前的金额
					}
				})
			} else if (choice === "m") {
				// 修改金额在主逻辑就修改了
				// 先让用户输入新的金额
				const newAmount = readline.question("请输入新金额: ")
				input = new Command({
					resume: {
						action: "approve", // 外界确认通过
						amount: Number(newAmount) // 金额对应的是新的金额
					}
				})
			} else {
				input = new Command({ resume: { action: "reject" } })
			}
		} else if (typeof val === "string" && val.includes("请输入审批理由")) {
			// 来自于工具的第二次中断
			console.log(`\n[系统] 金额的审批已通过，${val}`)
			const reason = readline.question("接下来需要审批理由: ")
			input = new Command({
				resume: reason
			})
		} else {
			// 来自于review节点的最终中断
			console.log("最终审核")
			console.log("这是AI助手生成的信息：", val?.originalContent)
			console.log(val?.message)
			// 接收用户的输入
			// 让用户在参考了AI助手生成的意见后，输入最终的决策
			const answer = readline.question("请输入回复以恢复流程: ")
			input = new Command({
				resume: answer
			})
		}
	}
}
main()
