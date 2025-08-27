import { resolve } from "path"
import { UserConfig } from "vite"

export const buildConfig = (mode: string): UserConfig["build"] => {
	const isDev = mode === "development"
	const isProd = mode === "production"
	return {
		lib: {
			cssFileName: "index",
			entry: resolve(process.cwd(), "./src/index.ts")
		},
		cssCodeSplit: false,
		minify: isProd,
		target: "es2015",
		sourcemap: isDev,
		rollupOptions: {
			external: ["react", "react-dom"],
			output: [
				{
					format: "es",
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
