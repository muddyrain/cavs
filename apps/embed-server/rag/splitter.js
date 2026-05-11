const {
  RecursiveCharacterTextSplitter,
  MarkdownTextSplitter,
} = require("langchain/text_splitter");

// 文本分割器
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1024,
  chunkOverlap: 200,
  separators: ["\n\n", "\n", " ", ""],
});

// markdown分割器
const markdownSplitter = new MarkdownTextSplitter({
  chunkSize: 1800,
  chunkOverlap: 180,
});

module.exports = {
  textSplitter,
  markdownSplitter,
};
