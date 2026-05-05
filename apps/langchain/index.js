import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { NomicEmbeddings } from "./utils/embed.js";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "@langchain/classic/text_splitter";

const loader = new TextLoader("data/kong.txt");

const docs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
	chunkSize: 64,
	chunkOverlap: 0,
});

const splittedDocs = await splitter.splitDocuments(docs);

const embeddings = new NomicEmbeddings(4);

const store = new MemoryVectorStore(embeddings);

await store.addDocuments(splittedDocs);


// 创建一个检索器，现在仓库已经有值了
const retriever = store.asRetriever({
	k: 2,
	searchType: "mmr",
	searchKwargs: { fetchK: 20, lambda: 0.5 },
	filter: (doc) => doc.metadata?.source?.endsWith("data/kong.txt"),
	tags: ["demo", "kong"],
	metadata: { lesson: "RAG-intro" },
	// verbose: true,
});

const res = await retriever.invoke("茴香豆是做什么用的");

console.log(res);