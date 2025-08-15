import { getConfig } from "@cavs/vite-config"
import { UserConfig } from "vite"
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js"
import dts from "vite-plugin-dts"

// https://vite.dev/config/
const config = getConfig(({ mode }) => {
	const isDev = mode === "development"
	const isProd = mode === "production"
	return {
		plugins: [
			cssInjectedByJsPlugin(),
			dts({
				tsconfigPath: "./tsconfig.build.json"
			})
		],
		build: {
			lib: {
				entry: "./src/index.ts",
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
					}
				}
			}
		}
	} as UserConfig
})
export default config
