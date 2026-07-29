// 图片节点

import * as fs from "fs"
import type { TArticle } from "../state.ts"

/**
 *
 * @param url 图片的下载地址
 * @param filePath 图片的保存地址
 */
async function downloadImage(url: string, filePath: string) {
	const response = await fetch(url)

	if (!response.ok) throw new Error("下载图片失败")
	const buffer = await response.arrayBuffer() // 拿到一个图片流
	fs.writeFileSync(filePath, Buffer.from(buffer))
}

export async function imageNode(state: TArticle): Promise<Partial<TArticle>> {
	if (!state.summary) throw new Error("没有生成文章的摘要，无法生成图片")
	const summary = state.summary

	try {
		const apiKey = process.env.IMAGE_API_KEY
		if (!apiKey) throw new Error("IMAGE_API_KEY未设置，无法生成图片！")

		const response = await fetch("https://api.siliconflow.cn/v1/images/generations", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "Kwai-Kolors/Kolors", // openai提供的一个专门生成图片的模型
				prompt: summary,
				batch_size: 1,
				num_inference_steps: 20,
				guidance_scale: 7.5,
				image_size: "1024x1024"
			})
		})
		if (!response.ok) {
			// 如果进入此分支，说明这一次生成图片的请求有问题
			const errorText = await response.text()
			throw new Error(`OpenAI 生成图片的请求发生错误，错误信息为：${errorText}`)
		}

		// 如果代码来到这里，说明这一次请求是没有问题
		/**
		 * {
		 *  created: 12372173712,
		 *  images: [
		 *      {
		 *         url: "https://...", // 生成的图片的临时链接
		 *      }
		 *   ]
		 * }
		 */
		const pic = await response.json()

		if (!pic.images || pic.images.length === 0 || !pic.images[0].url) {
			throw new Error("生成图片失败")
		}

		// 代码来到这里，说明返回的响应是有图片的链接
		const imageUrl = pic.images[0].url
		console.log(`文章插图生成成功，对应的地址为：${imageUrl}`)

		// 接下来我们需要将这个临时地址的图片赶紧下载下来
		const imagePath = `./${state.title}.png`

		await downloadImage(imageUrl, imagePath) // 进行图片的下载
		console.log(`文章插图已经下载完毕，保存在：${imagePath} 路径下`)
		return {
			image_path: imagePath
		}
	} catch (err: any) {
		console.error("生成图片出错，错误信息为：", err.message || err)
		throw err
	}
}
