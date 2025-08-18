import { getConfig } from "@cavs/vite-config"
import { UserConfig } from "vite"
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js"
import dts from "vite-plugin-dts"

// https://vite.dev/config/
const config = getConfig(() => {
	return {
		plugins: [
			cssInjectedByJsPlugin(),
			dts({
				include: ["src/**/*.ts", "src/**/*.tsx"],
				exclude: ["src/**/*.test.tsx", "src/**/*.stories.tsx"],
				rollupTypes: false,
				copyDtsFiles: true,
				insertTypesEntry: true,
				entryRoot: "./src",
				tsconfigPath: "./tsconfig.build.json"
			})
		],
		build: {
			lib: {
				entry: "./src/index.ts",
				name: "index",
				formats: ["es", "umd", "cjs"],
				fileName: (format) => `index.${format}.js`
			},
			cssCodeSplit: false,
			minify: true,
			sourcemap: true,
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
