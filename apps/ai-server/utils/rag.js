const fs = require("fs")
const pdfParse = require("pdf-parse")
const { getEmbedding } = require("./LLM.js")

// 该 JSON 文件存储转换后的向量数据
// 在企业开发中，是将转换结果存储到向量数据库
const EMBEDDING_PATH = "./embeddings.json"

/**
 * 将外挂知识库生成对应的向量
 */
async function generateEmbeddings() {
	// 1. 加载外挂知识库
	const buffer = fs.readFileSync("./香蕉手机参数配置.pdf")
	const data = await pdfParse(buffer)
	// 2. 接下来需要对文档进行一个切割
	const paragraphs = data.text
		.split(/\n\s*\n/)
		.map((text, idx) => ({
			id: `chunk-${idx}`,
			content: text.trim()
		}))
		.filter((p) => p.content.length > 20)
	// 3. 将每一块转换为向量
	const withEmbedding = [] // 存储最终转为向量的结果
	for (const p of paragraphs) {
		const embedding = await getEmbedding(p.content)
		withEmbedding.push({
			...p,
			embedding
		})
	}

	// 4. 存储到向量数据库
	// 我们这个案例是直接写入到 embeddings.json 文件里面
	fs.writeFileSync(EMBEDDING_PATH, JSON.stringify(withEmbedding, null, 2), "utf8")

	console.log(`生成了 ${withEmbedding.length} 条段落嵌入，并已缓存到 ${EMBEDDING_PATH}`)

	return withEmbedding
}

// 加载已经生成好的向量数据内容
async function loadCachedEmbeddings() {
	if (fs.existsSync(EMBEDDING_PATH)) {
		// 说明之前外挂知识库已经生成过对应的向量数据
		// 直接读取即可
		const raw = fs.readFileSync(EMBEDDING_PATH, "utf8")
		return JSON.parse(raw)
	} else {
		// 说明外挂的知识库还没有生成对应的向量数据
		return await generateEmbeddings()
	}
}
loadCachedEmbeddings()
