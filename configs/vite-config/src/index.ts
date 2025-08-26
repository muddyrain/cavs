import alias from "@rollup/plugin-alias"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import { resolve } from "path"
import { defineConfig, mergeConfig, UserConfig, UserConfigFnObject } from "vite"

export const buildConfig = (mode: string): UserConfig["build"] => {
	const isDev = mode === "development"
	const isProd = mode === "production"
	return {
		lib: {
			entry: resolve(process.cwd(), "./src/index.ts"),
			name: "index",
			formats: isDev ? ["es"] : ["es", "umd", "cjs"],
			fileName: (format) => `index.${format}.js`
		},
		cssCodeSplit: false,
		minify: isProd,
		sourcemap: isDev,
		rollupOptions: {
			external: ["react", "react-dom"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM"
				},
				// 关键：确保导出模式为命名导出
				exports: "named"
			}
		}
	}
}

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
