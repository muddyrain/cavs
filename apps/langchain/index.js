// import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio"

// const loader = new CheerioWebBaseLoader("https://tech.meituan.com/", {
// 	selector: "h2" // 只提取网页中的 <h2> 元素
// })

// const result = await loader.load()

// console.log(result)

import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio"
import { SerpAPILoader } from "@langchain/community/document_loaders/web/serpapi"

const apiKey = "552686f6fd4a757b971f4caf26c5b519a47b482502ce5d3e37acfe45cd5fccf2"

const q = "什么是Copilot？"

const loader = new SerpAPILoader({
	q,
	apiKey
})

const result = await loader.load()

const jsonResult = JSON.parse(result[1].pageContent)

const link = jsonResult.link

// console.log(link)

const webLoader = new CheerioWebBaseLoader(link)

const webContent = await webLoader.load()

console.log(webContent)
