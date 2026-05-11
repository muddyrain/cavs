const path = require("path");
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { textSplitter, markdownSplitter } = require("./splitter.js");
const { NomicEmbeddings } = require("./embed.js");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");

const loaderMap = {
  ".pdf": (path) => new PDFLoader(path, { splitPages: true }),
  ".txt": (path) => new TextLoader(path),
};

const splitterMap = {
  ".pdf": textSplitter,
  ".txt": textSplitter,
  ".md": markdownSplitter,
};

async function ragHandler(file) {
  // 提取文件的后缀名
  const ext = path.extname(file.originalname).toLowerCase();

  // 使用 loader 加载已经上传的文档
  const docs = await loaderMap[ext](file.path).load();

  // 做一个文本切割
  const splittedDocs = await splitterMap[ext].splitDocuments(docs);

  // 做嵌入操作，然后存储到向量库（内存版）
  const embeddings = new NomicEmbeddings(5);

  // 创建内存向量库
  const vectorstore = new MemoryVectorStore(embeddings);

  // 将分割后的文档传递给内存向量库，内存向量库会自动做嵌入操作
  await vectorstore.addDocuments(splittedDocs);

  return vectorstore; // 对外暴露内存向量库
}

module.exports = {
  ragHandler,
};
