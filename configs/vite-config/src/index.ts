import alias from "@rollup/plugin-alias"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import { resolve } from "path"
import { defineConfig, mergeConfig, UserConfig, UserConfigFnObject } from "vite"

// https://vite.dev/config/
export const getConfig = (
	userConfig: UserConfig | UserConfigFnObject = {},
	rootDir: string = process.cwd()
) => {
	const baseConfig: UserConfig = {
		root: rootDir,
		plugins: [react(), tailwindcss()],
		resolve: {
			alias: {
				"@/": resolve(rootDir, "./src")
			}
		},
		build: {
			rollupOptions: {
				plugins: [
					alias({
						entries: [
							{
								find: /^@\/(.*)/,
								replacement: resolve(rootDir, "./src/$1")
							}
						]
					})
				]
			}
		}
	}
	return defineConfig((configEnv) =>
		mergeConfig(baseConfig, typeof userConfig === "function" ? userConfig(configEnv) : userConfig)
	)
}

export { buildConfig } from "./buildConfig.js"
