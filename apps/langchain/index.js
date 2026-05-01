// import { TextLoader } from "@langchain/classic/document_loaders/fs/text"
// import { RecursiveCharacterTextSplitter } from "@langchain/classic/text_splitter"

// const loader = new TextLoader("data/long.txt")

// const result = await loader.load()

// const splitter = new RecursiveCharacterTextSplitter({
// 	chunkSize: 200,
// 	chunkOverlap: 50
// })

// const splitResult = await splitter.splitDocuments(result)

// console.log(splitResult)

// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"

// const loader = new PDFLoader("data/novel.pdf", {
// 	splitPages: false
// })

// const result = await loader.load()

// console.log(result)

import { DirectoryLoader } from "@langchain/classic/document_loaders/fs/directory"
import { TextLoader } from "@langchain/classic/document_loaders/fs/text"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"

const loader = new DirectoryLoader("./data", {
	".pdf": (path) => new PDFLoader(path, { splitPages: false }),
	".txt": (path) => new TextLoader(path)
})

const result = await loader.load()
console.log(result)
