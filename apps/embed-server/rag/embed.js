try { require("dotenv").config(); } catch (_) { }
const { runWithConcurrency } = require("../utils/utils.js");
const { Embeddings } = require("@langchain/core/embeddings");

class SiliconFlowEmbeddings extends Embeddings {
  constructor(concurrency = 3) {
    super();
    this.model = "Qwen/Qwen3-VL-Embedding-8B";
    this.apiUrl = "https://api.siliconflow.cn/v1/embeddings";
    this.apiKey = process.env.SILICONFLOW_API_KEY || process.env.OPENAI_API_KEY;
    this.concurrency = concurrency;
  }

  /**
   * 内部方法，调用硅基流动嵌入 API
   * @param {string|string[]} input 要做嵌入的文本内容
   * @returns {Promise<number[][]>}
   */
  async #fetchEmbedding(input) {
    const res = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ model: this.model, input }),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`嵌入操作失败: ${res.status} ${errText}`);
    }
    const data = await res.json();
    return data.data.map((item) => item.embedding);
  }

  async embedQuery(text) {
    const [embedding] = await this.#fetchEmbedding(text);
    return embedding;
  }

  async embedDocuments(texts) {
    const results = Array.from({ length: texts.length });

    await runWithConcurrency(
      texts,
      async (text, idx) => {
        try {
          const [embedding] = await this.#fetchEmbedding(text);
          results[idx] = embedding;
        } catch (e) {
          results[idx] = e;
        }
      },
      this.concurrency
    );

    return results;
  }
}

module.exports = {
  NomicEmbeddings: SiliconFlowEmbeddings,
  SiliconFlowEmbeddings,
};
