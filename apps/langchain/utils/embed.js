import { Embeddings } from "@langchain/core/embeddings"
import pLimit from "p-limit";

export class NomicEmbeddings extends Embeddings {
	constructor(concurrency = 3) {
		super()
		this.model = "Qwen/Qwen3-VL-Embedding-8B"
		this.apiUrl = "https://api.siliconflow.cn/v1/embeddings"
		this.apiKey = process.env.SILICONFLOW_API_KEY || process.env.OPENAI_API_KEY
		this.concurrency = concurrency
		this.limit = pLimit(concurrency)
	}

	/**
	 * 内部方法，调用硅基流动嵌入 API
	 * @param {string} text 单个文本
	 */
	async #fetchEmbedding(text) {
		const res = await fetch(this.apiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${this.apiKey}`,
			},
			body: JSON.stringify({
				model: this.model,
				input: text
			})
		})
		if (!res.ok) {
			const errText = await res.text().catch(() => "")
			throw new Error(`嵌入操作失败: ${res.status} ${errText}`)
		}
		const data = await res.json()
		return data.data[0].embedding
	}

	/**
	 * 对单个文本做嵌入操作
	 * @param {*} text
	 */
	async embedQuery(text) {
		return await this.#fetchEmbedding(text)
	}

	/**
	 * 对一组文本做嵌入操作
	 * @param {*} documents
	 */
	async embedDocuments(documents) {
		return Promise.all(documents.map((text) => this.limit(() => this.#fetchEmbedding(text))))
	}
}
