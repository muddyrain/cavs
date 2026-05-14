const express = require("express");
const { docChatChain, freeChatChain } = require("../LLM/chain.js");
const router = express.Router();

router.post("/chat", async function (req, res) {
  // 接收用户输入的问题，例如："你知道大象吗？"
  const query = req.body.query || "";

  console.log("query>>>", query);

  // 建立一个流式传输的 HTTP 通道（不缓存、不关闭连接、不被 Nginx 卡住）
  res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  if (typeof res.flushHeaders === "function") res.flushHeaders(); // 立刻把响应头发给前端，让前端准备好接收流式数据

  try {
    // 请求嵌入服务器，进行相关文档的检索
    let retrievalResults = [];
    try {
      const retrievalResultsResponse = await fetch(
        "http://localhost:7008/query",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        }
      );
      retrievalResults = (await retrievalResultsResponse.json()).data;
    } catch (err) {
      console.error("检索服务异常：", err);
    }

    // 需要判断检索结果是否是空数组
    const hasDocs = retrievalResults.length > 0;
    // 需要从相关文档中取出上下文
    const context = hasDocs
      ? retrievalResults.map((item) => item.pageContent).join("\n")
      : "";

    // 根据是否有文档选择不同的链条
    const stream = hasDocs
      ? await docChatChain.stream({
        context,
        question: query,
      })
      : await freeChatChain.stream({
        question: query,
      });

    // 增加一个前缀
    let prefix = "";
    if (hasDocs) {
      prefix = `【根据已有文档回答问题：${query}】\n\n`;
    } else {
      prefix = `【自由回答问题：${query}】\n\n`;
    }
    // 先把前缀输出
    res.write(JSON.stringify({ response: prefix }) + "\n");

    // 然后输出大模型回答的答案
    for await (const chunk of stream) {
      if (chunk) res.write(JSON.stringify({ response: chunk }) + "\n");
    }
    res.end();
  } catch (err) {
    console.error("服务端处理异常：", err);
    res.end();
  }
});

module.exports = router;
