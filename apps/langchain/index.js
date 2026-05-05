import { TextLoader } from "@langchain/classic/document_loaders/fs/text"
import { RecursiveCharacterTextSplitter } from "@langchain/classic/text_splitter"
import { NomicEmbeddings } from "./utils/embed.js"

const loader = new TextLoader("data/kong.txt")

const docs = await loader.load()

const splitter = new RecursiveCharacterTextSplitter({
	chunkSize: 64,
	chunkOverlap: 0
})

const splittedDocs = await splitter.splitDocuments(docs)

const texts = splittedDocs.map(doc => doc.pageContent)

const embeddings = new NomicEmbeddings(5)


const result = await embeddings.embedDocuments(texts)

console.log(result);