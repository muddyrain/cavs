import { TextLoader } from "@langchain/classic/document_loaders/fs/text"
import { RecursiveCharacterTextSplitter } from "@langchain/classic/text_splitter"

const loader = new TextLoader("data/test.js")

const docs = await loader.load()

const splitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
	chunkSize: 320,
	chunkOverlap: 0
})

const result = await splitter.splitDocuments(docs)

console.log(result)
