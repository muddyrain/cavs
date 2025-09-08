import { existsSync } from "fs"
import path from "path"
import { UserConfig } from "vite"

const isExternal = (id: string) =>
	!id.startsWith(".") && !path.isAbsolute(id) && !id.startsWith("@/")
// 检查文件是否存在
const getEntryFile = () => {
	const possibleEntries = [
		path.resolve(process.cwd(), "./src/index.ts"),
		path.resolve(process.cwd(), "./src/index.tsx")
	]

	for (const entry of possibleEntries) {
		if (existsSync(entry)) {
			return entry
		}
	}

	throw new Error("未找到入口文件，请检查 src/index.ts 或 src/index.tsx 是否存在")
}

export const buildConfig = (mode: string): UserConfig["build"] => {
	const isDev = mode === "development"
	return {
		lib: {
			cssFileName: "index",
			entry: getEntryFile()
		},
		cssCodeSplit: false,
		minify: false,
		target: "es2015",
		sourcemap: isDev,
		emptyOutDir: false,
		rollupOptions: {
			external: isExternal,
			preserveEntrySignatures: "strict",
			preserveSymlinks: true,
			shimMissingExports: true,
			output: [
				{
					format: "esm",
					dir: "dist/es",
					interop: "auto",
					minifyInternalExports: false,
					esModule: true,
					exports: "named",
					chunkFileNames: "[name]-[hash].js",
					entryFileNames: "[name].js"
				},
				{
					format: "cjs",
					dir: "dist/lib",
					interop: "auto",
					minifyInternalExports: false,
					esModule: true,
					exports: "named",
					chunkFileNames: "[name]-[hash].js",
					entryFileNames: "[name].js"
				}
			]
		}
	}
}
