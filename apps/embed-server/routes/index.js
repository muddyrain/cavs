const express = require("express");
const router = express.Router();
const { upload } = require("../utils/uploadSettings.js");
const { ragHandler } = require("../rag/index.js");
const { vectorstoreMap } = require("../utils/storeMap.js");
const { storeRetrieval } = require("../utils/search.js");

// 文件上传相关操作
router.post("/upload", upload.single("file"), async function (req, res) {
  // 使用文件名作为唯一标识
  const fileId = req.file.filename;
  // 该文件对应的完整信息
  const fileInfo = {
    originalName: req.file.originalname,
    filename: req.file.filename,
    path: req.file.path,
    uploadTime: new Date(),
  };

  // 对上传后的文件做嵌入操作，并存储至内存向量库
  const vectorstore = await ragHandler(req.file);

  // 这里需要做一个 map 映射
  // 键：文件
  // 值：该文件对应的向量库
  vectorstoreMap.set(fileId, {
    vectorstore, // 该文件对应的向量库
    fileInfo, // 该文件对应的相关信息
  });

  res.json({
    success: true,
    fileId,
    message: `文件 ${fileInfo.originalName} 处理完成`,
  });
});

router.post("/query", async function (req, res) {
  // 搜索用户原始的问题
});

module.exports = router;
