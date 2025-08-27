import alias from "@rollup/plugin-alias"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import { resolve } from "path"
import { defineConfig, mergeConfig, UserConfig, UserConfigFnObject } from "vite"

// https://vite.dev/config/
export const getConfig = (userConfig: UserConfig | UserConfigFnObject = {}) => {
	const baseConfig: UserConfig = {
		root: process.cwd(),
		plugins: [react(), tailwindcss()],
		resolve: {
			alias: {
				"@/": resolve(process.cwd(), "./src")
			}
		},
		build: {
			emptyOutDir: false,
			rollupOptions: {
				plugins: [
					alias({
						entries: [
							{
								find: /^@\/(.*)/,
								replacement: resolve(process.cwd(), "./src/$1")
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
