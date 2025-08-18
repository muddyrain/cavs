import { app, shell } from "electron"
import fs from "fs"
import path from "path"

const startMenuPaths = [
	path.join(process.env.APPDATA || "", "Microsoft\\Windows\\Start Menu\\Programs"),
	path.join(process.env.USERPROFILE || "", "Desktop") // 可选：扫描桌面
]

type Shortcut = {
	name: string
	path: string
	icon: string
}

const iconCache = new Map<string, string>()

async function getShortcuts(dir: string): Promise<Shortcut[]> {
	const results: Shortcut[] = []
	console.log(dir)
	if (!fs.existsSync(dir)) return results
	const list = fs
		.readdirSync(dir)
		.filter(
			(file) =>
				file.endsWith(".lnk") ||
				file.endsWith(".url") ||
				fs.statSync(path.join(dir, file)).isDirectory()
		)
	console.log(list)
	const promises = list.map(async (file) => {
		const filePath = path.join(dir, file)
		const stat = fs.statSync(filePath)
		if (stat && stat.isDirectory()) {
			return await getShortcuts(filePath)
		} else if (file.endsWith(".lnk") || file.endsWith(".url")) {
			try {
				const lnk = shell.readShortcutLink(filePath)
				let icon = ""
				if (iconCache.has(lnk.target)) {
					icon = iconCache.get(lnk.target) || ""
				} else {
					const _fileIcon = await app.getFileIcon(lnk.target)
					icon = _fileIcon.toDataURL() || ""
				}
				return [
					{
						name: path.basename(file, ".lnk"),
						path: filePath,
						icon
					}
				]
			} catch {
				return [
					{
						name: path.basename(file, ".lnk"),
						path: filePath,
						icon: ""
					}
				]
			}
		}
		return []
	})

	const nestedResults = await Promise.all(promises)
	// 扁平化数组
	return nestedResults.flat()
}

export function getAllShortcuts(): Promise<{ name: string; path: string; icon: string }[]> {
	let all: { name: string; path: string; icon: string }[] = []
	const promises = startMenuPaths.map((dir) => getShortcuts(dir))
	return Promise.all(promises).then((results) => {
		all = results.flat()
		return all
	})
}
