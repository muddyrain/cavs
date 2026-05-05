import { Document } from "@langchain/classic/document"
import { LLMChainExtractor } from "@langchain/classic/retrievers/document_compressors/chain_extract"
import { ChatOllama } from "@langchain/ollama"

const llm = new ChatOllama({
	model: "llama3",
	temperature: 0.7
})


const extractor = LLMChainExtractor.fromLLM(llm)

const docs = [
	new Document({
		pageContent: `孔乙己走到酒店，说“要一碟茴香豆”。茴香豆常作为下酒小菜，价格便宜，常见于短衣帮和穿长衫的顾客点酒时。`,
	}),
	new Document({
		pageContent: `另一个段落：今天的天气很好，阳光明媚。`,
	}),
	new Document({
		pageContent: `游泳池边上，游过一群小黄鸭`,
	}),
	new Document({
		pageContent: `茴香豆可以拿来泡茶，上次我就看到有一个大婶儿拿茴香豆来泡茶`,
	}),
];

const query = "茴香豆的作用"

const res = await extractor.compressDocuments(docs, query)

console.log(res)