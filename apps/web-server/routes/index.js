const express = require("express");
const { docChatChain, freeChatChain } = require("../LLM/chain.js");
const router = express.Router();

router.post("/chat", async function (req, res) {
  const query = req.body.query || "";

  // 建立一个流式传输的 HTTP 通道（不缓存、不关闭连接、不被 Nginx 卡住）
  res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  if (typeof res.flushHeaders === "function") res.flushHeaders(); // 立刻把响应头发给前端，让前端准备好接收流式数据

  try {
    // TODO：检索相关文档
    
  } catch (err) {
    console.error("服务端处理异常：", err);
    res.end();
  }
});

module.exports = router;
