import "dotenv/config"
import { HumanMessage } from "@langchain/core/messages"
import { END, MemorySaver, START, StateGraph } from "@langchain/langgraph"

import readline from "readline-sync"
import { SUMMARY_THRESHOLD } from "./config.ts"
import { model } from "./model.ts"
import { Schema, type TState } from "./state.ts"
import { summarizeNode } from "./summarizeNode.ts"

// 用户系统
const users = {
	aaa: { password: "111", thread_id: "thread-aaa" },
	bbb: { password: "222", thread_id: "thread-bbb" }
}

// 聊天的节点
async function chatNode(state: TState): Promise<Partial<TState>> {
	const res = await model.invoke(state.messages)

	return {
		messages: [...state.messages, res]
	}
}

const checkpointer = new MemorySaver()

// 图
const graph = new StateGraph(Schema)
	.addNode("chatNode", chatNode)
	.addNode("summarizeNode", summarizeNode)
	.addEdge(START, "chatNode")
	.addConditionalEdges("chatNode", (state: TState) => {
		if (state.messages.length > SUMMARY_THRESHOLD) return "summarizeNode"
		return END
	})
	.addEdge("summarizeNode", END)
	.compile({ checkpointer })

async function main() {
	while (true) {
		console.log("\n--- 登录 ---")
		const username = readline.question("请输入用户名：")
		const password = readline.question("请输入密码：", {
			hideEchoBack: true
		})

		const user = users[username]
		if (!user || user.password !== password) {
			console.log("登录失败☹️")
			continue
		}

		// 登录成功
		console.log(`✅ 登录成功，当前用户：${username}`)
		console.log("输入 /switch 可切换用户\n")

		const config = {
			configurable: {
				thread_id: user.thread_id // 这个非常重要，这个保证了不同的用户拥有不同的state
			}
		}

		// 处理用户的对话
		while (true) {
			const input = readline.question(`${username}>`)
			if (input === "/switch") {
				console.log("切换用户中...")
				break
			}

			// 这里获取到的最新的状态
			// messages里面是包含了所有的信息的
			// stateSnapshot ->
			// { values: { messages: [HumanMessage("hello"), AIMessage("hi")] }, config: { thread_id: "thread-aaa" }, ... }
			const stateSnapshot = await graph.getState(config)
			const currentMessages = stateSnapshot.values.messages || []

			const result = await graph.invoke(
				{
					// 之前的状态 + 这一次用户的输入
					messages: [...currentMessages, new HumanMessage(input)]
				},
				config
			)

			const aiMesg = result.messages.at(-1)
			console.log(aiMesg?.content)
		}
	}
}

await main()
