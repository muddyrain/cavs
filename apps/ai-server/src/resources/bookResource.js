import { readResource } from "../utils/readResource.js"

export const bookResource = [
	"书籍图片", // 资源的名称
	"pics://books", // 资源URI
	{
		title: "书籍图片",
		description: "一张有很多书籍的图片",
		mimeType: "image/jpeg"
	},
	async (uri) => {
		console.error("uri>>>", uri)
		const content = await readResource("src/assets", "books.jpeg", true)
		return {
			contents: [
				{
					uri: uri.href,
					name: "书籍图片",
					blob: content
				}
			]
		}
	}
]
