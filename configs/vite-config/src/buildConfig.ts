import path from "path"
import { UserConfig } from "vite"

const isExternal = (id: string) =>
	!id.startsWith(".") && !path.isAbsolute(id) && !id.startsWith("@/")
export const buildConfig = (mode: string): UserConfig["build"] => {
	const isDev = mode === "development"
	return {
		lib: {
			cssFileName: "index",
			entry: "./src/index.tsx"
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
