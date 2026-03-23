import { FewShotPromptTemplate, PromptTemplate } from "@langchain/core/prompts"

const examples = [
	{ comment: "这个产品真不错，用得很顺手！", sentiment: "正面" },
	{ comment: "完全失望，质量太差了。", sentiment: "负面" },
	{ comment: "快递到了。", sentiment: "中性" }
]

// 每个示例的模板
const examplePt = PromptTemplate.fromTemplate("评论：{comment} → 情感：{sentiment}")

const pt = new FewShotPromptTemplate({
	examples, // 示例的数组
	examplePrompt: examplePt, // 示例的模板
	suffix: "评论：{comment} → 情感： ",
	inputVariables: ["comment"]
})

const result = await pt.format({
	comment: "外观还行，性能一般般"
})
console.log(result)
