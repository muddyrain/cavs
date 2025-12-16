import fs from "fs"
import path from "path"

/**
 *
 * @returns 返回监听的目录
 * 这个例子中返回的是 src/assets 目录
 */
export function getWatchDir() {
	const dir = path.join(process.cwd(), "src", "assets")
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true })
	}
	return dir
}

// 获取具体的 mimetype
export function getMimeType(filename) {
	const ext = path.extname(filename).toLowerCase()

	// 创建一个 mimeType 的映射对象
	const mimeTypes = {
		".txt": "text/plain",
		".md": "text/markdown",
		".js": "text/javascript",
		".json": "application/json",
		".html": "text/html",
		".css": "text/css",
		".xml": "application/xml"
	}

	return mimeTypes[ext] || "text/plain"
}

export async function readBananaPhoneInfo(filepath, filename) {
	try {
		const filePath = path.join(process.cwd(), filepath, filename)
		const content = fs.readFileSync(filePath, "utf8")
		return content
	} catch (error) {
		return `读取香蕉手机信息失败: ${error.message}`
	}
}

export async function readCodeFile(filename) {
	try {
		const filePath = path.join(process.cwd(), "src/code", filename)
		const content = fs.readFileSync(filePath, "utf8")
		return content
	} catch (error) {
		return `读取代码文件失败: ${error.message}`
	}
}

export async function readBinaryFile(filepath, filename) {
	try {
		const filePath = path.join(process.cwd(), filepath, filename)
		const buffer = fs.readFileSync(filePath)
		// 将二进制数据转换为base64编码
		const base64Data = buffer.toString("base64")
		return base64Data
	} catch (error) {
		throw new Error(`读取二进制文件失败: ${error.message}`)
	}
}

export async function getCodeFilesList() {
	try {
		const codeDir = path.join(process.cwd(), "src/code")
		const files = fs.readdirSync(codeDir)
		return files.filter((file) => file.endsWith(".js"))
	} catch (error) {
		console.error(error, "getCodeFilesList error")
		return []
	}
}
