const { vectorstoreMap } = require("../utils/storeMap.js");

const MAX_RETRIEVAL_RESULTS = 3; // 取多少个相关文档
const SIMILARITY_THRESHOLD = 0.6; // 相似度阀值

/**
 * 对用户的问题做一个相似度的搜索
 * @param {*} query 用户原始的问题，例如 "你知道大象吗？"、"介绍一下香蕉手机"
 * @returns
 */
async function storeRetrieval(query) {
  console.log("vectorstoreMap>>>", vectorstoreMap);
  /**
   * map => {
   *  fileId1: {vectorstore1, fileInfo1},
   *  fileId2: {vectorstore2, fileInfo2}
   * }
   */
  try {
    /**
     * [
     *  ['fileId1', {vectorstore1, fileInfo1}],
     *  ['fileId2', {vectorstore2, fileInfo2}]
     * ]
     */
    const allResults = await Promise.all(
      Array.from(vectorstoreMap.entries()).map(async ([fileId, data]) => {
        try {
          // 拿到该文件所对应的向量库
          const docs = await data.vectorstore.similaritySearchWithScore(
            query,
            MAX_RETRIEVAL_RESULTS
          );

          console.log("搜索出来的docs>>>", docs);

          // 对搜索出来的文档进行一个过滤
          return docs
            .filter(([_, score]) => {
              const shouldKeep = score >= SIMILARITY_THRESHOLD; // 是否保留当前搜索到的文档
              console.log(
                `查询: "${query}", 相似度: ${score.toFixed(
                  3
                )}, 阈值: ${SIMILARITY_THRESHOLD}, 保留: ${shouldKeep}`
              );
              return shouldKeep;
            })
            .map(([doc, score]) => ({
              ...doc,
              similarity: score,
              sourceFile: data.fileInfo.originalName,
              fileId,
            }))
            .flat();
        } catch (error) {
          console.error(`检索文件 ${fileId} 时出错:`, error);
          return [];
        }
      })
    );

    // 合并所有的结果
    return allResults
      .flat()
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, MAX_RETRIEVAL_RESULTS);
  } catch (error) {
    console.error("检索过程出错:", error);
    return [];
  }
}

module.exports = {
  storeRetrieval,
};
