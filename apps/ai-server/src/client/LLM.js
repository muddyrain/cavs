/**
 * 负责和大模型进行交互
 */
import dotenv from "dotenv"

dotenv.config()
const DEEPSEEK_API_KEY = "sk-0cfbfd61fca84dfe9827b99d8b173e53"

/**
 *
 * @param {*} messages 会话历史
 * @param {*} tools 工具箱
 */
export async function callDeepseek(messages, tools) {
	const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${DEEPSEEK_API_KEY}`
		},
		body: JSON.stringify({
			model: "deepseek-chat",
			messages, // 会话历史
			tools // 工具箱
		})
	})

	const json = await res.json()
	return json.choices[0].message
}
