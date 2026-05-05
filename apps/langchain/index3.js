import { TextLoader } from "@langchain/classic/document_loaders/fs/text"
import { ContextualCompressionRetriever } from "@langchain/classic/retrievers/contextual_compression"
import { LLMChainExtractor } from "@langchain/classic/retrievers/document_compressors/chain_extract"
import { MultiQueryRetriever } from "@langchain/classic/retrievers/multi_query"
import { RecursiveCharacterTextSplitter } from "@langchain/classic/text_splitter"
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory"
import { ChatOllama } from "@langchain/ollama"
import { NomicEmbeddings } from "./utils/embed.js"

const loader = new TextLoader("data/kong.txt")


const docs = await loader.load()

const splitter = new RecursiveCharacterTextSplitter({
	chunkSize: 64,
	chunkOverlap: 0
})


const splittedDocs = await splitter.splitDocuments(docs)

const embeddings = new NomicEmbeddings(3)

const store = new MemoryVectorStore(embeddings)

await store.addDocuments(splittedDocs)

const retriever = store.asRetriever(2)

const res = await retriever.invoke("茴香豆是做什么用的？")

console.log('压缩前', res);

const llm = new ChatOllama({
	model: "llama3",
	temperature: 0.7
})

const r = new ContextualCompressionRetriever({
	baseRetriever: retriever,
	baseCompressor: LLMChainExtractor.fromLLM(llm)
})

const res2 = await r.invoke("茴香豆是做什么用的？")

console.log('压缩后', res2);