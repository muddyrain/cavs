import fs from "fs"
import path from "path"

/**
 *
 * @param {*} filepath 文件的路径
 * @param {*} filename 文件的名称
 * @param {*} isBinary 是否是二进制数据
 */
export async function readResource(filepath, filename, isBinary) {
	try {
		const filePath = path.join(process.cwd(), filepath, filename)
		let content = null // 存储最终读取到的资源
		if (isBinary) {
			// 说明是二进制数据
			const buffer = fs.readFileSync(filePath)
			// 需要将二进制数据转换为base64编码
			content = buffer.toString("base64")
		} else {
			// 非二进制数据
			content = fs.readFileSync(filePath, "utf8")
		}
		return content
	} catch (err) {
		return `读取资源失败☹️：${err.message}`
	}
}
