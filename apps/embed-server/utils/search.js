const { vectorstoreMap } = require("../utils/storeMap.js");

const MAX_RETRIEVAL_RESULTS = 3;
const SIMILARITY_THRESHOLD = 0.4;

async function storeRetrieval(query) {
  console.log("vectorstoreMap>>>", vectorstoreMap);
  try {
    // TODO：并发执行所有向量库的检索
    
  } catch (error) {
    console.error("检索过程出错:", error);
    return [];
  }
}

module.exports = {
  storeRetrieval,
};
