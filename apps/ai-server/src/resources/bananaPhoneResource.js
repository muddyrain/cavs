import { readResource } from "../utils/readResource.js"

export const bannerPhoneResource = [
	"香蕉手机",
	"bannanaphone://info",
	{
		title: "香蕉手机信息",
		description: "香蕉手机的产品信息和介绍",
		mimeType: "text/plain"
	},
	async (uri) => {
		console.error("请求香蕉手机信息，URI:", uri.href)
		const content = await readResource("src/assets", "banana-phone.txt", false)
		return {
			contents: [
				{
					uri: uri.href,
					name: "香蕉手机信息",
					text: content
				}
			]
		}
	}
]
