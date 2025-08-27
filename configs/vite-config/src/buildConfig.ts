import { resolve } from "path"
import { UserConfig } from "vite"

export const buildConfig = (mode: string): UserConfig["build"] => {
	const isDev = mode === "development"
	return {
		lib: {
			cssFileName: "index",
			entry: resolve(process.cwd(), "./src/index.ts")
		},
		cssCodeSplit: false,
		minify: "esbuild",
		target: isDev ? "esnext" : "es2015",
		sourcemap: isDev,
		rollupOptions: {
			external: ["react", "react-dom"],
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
