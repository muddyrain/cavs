import dotenv from "dotenv"
import OpenAI from "openai"
import readlineSync from "readline-sync"

dotenv.config()

// 实例化模型
const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
})

// 和模型进行交互
async function askLLM(messages) {
	const res = await client.chat.completions.create({
		model: "gpt-4o",
		messages // 聊天记录
	})
	// 向外部返回模型的输出结果
	return res.choices[0].message.content.trim()
}

// 入口函数
async function main() {
	console.log("=== 智能迭代示例开始 ===")

	// 1. 用户输入初始的提示词
	const userPrompt = readlineSync.question("请输入您的初始提示词：\n>")

	// 2. 审查者就需要对初始的提示词进行审查
	const reviewerMsg = [
		{
			role: "system",
			content: "你是一个提示词审查者。请对用户的提示词进行 1~5 分打分，并写出改进意见。"
		},
		{
			role: "user",
			content: `当前的提示词为：${userPrompt}`
		}
	]

	// 得到审查结果
	const review = await askLLM(reviewerMsg)
	console.log("\n[审查者反馈]")
	console.log(review)

	// 3. 提问者根据审查者的意见向用户提问
	const askerMsg = [
		{
			role: "system",
			content:
				"你是一个提示词提问者。请根据以下审查意见，向用户提出 2~3 个澄清问题，以帮助改进提示词。"
		},
		{
			role: "user",
			content: review
		}
	]

	// 得到向用户提问的问题
	const askQuestions = await askLLM(askerMsg)
	console.log("\n[提问者的问题]")
	console.log(askQuestions)

	// 4. 用户需要回答这些问题
	const userAnswers = readlineSync.question("\n请回答以上问题：\n> ")

	// 5. 进行一个信息汇总，将汇总后的信息交给提示词生成者
	const generatorMsg = [
		{
			role: "system",
			content:
				"你是提示词生成者。请基于原始提示词、审查意见和用户的补充回答，生成一个改进后的提示词。"
		},
		{ role: "user", content: `原始提示词：${userPrompt}` },
		{ role: "user", content: `审查意见：${review}` },
		{ role: "user", content: `用户回答：${userAnswers}` }
	]

	const newPrompt = await askLLM(generatorMsg)
	console.log("\n[新生成的提示词]")
	console.log(newPrompt)

	console.log("\n=== 智能迭代示例结束 ===")
}

main().catch((err) => console.error(err))
