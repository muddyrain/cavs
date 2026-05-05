import { TextLoader } from "@langchain/classic/document_loaders/fs/text"
import { ContextualCompressionRetriever } from "@langchain/classic/retrievers/contextual_compression"
import { LLMChainExtractor } from "@langchain/classic/retrievers/document_compressors/chain_extract"
import { MultiQueryRetriever } from "@langchain/classic/retrievers/multi_query"
import { ScoreThresholdRetriever } from "@langchain/classic/retrievers/score_threshold"
import { RecursiveCharacterTextSplitter } from "@langchain/classic/text_splitter"
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory"
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

// const retriever = store.asRetriever(2)

// const res = await retriever.invoke("茴香豆是做什么用的？")

// console.log('压缩前', res);


const r = ScoreThresholdRetriever.fromVectorStore(store, {
	minSimilarityScore: 0.75
})

const res = await r.invoke("茴香豆是做什么用的？")

console.log(res);