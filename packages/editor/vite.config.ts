import { buildConfig, getConfig } from "@cavs/vite-config"
import { UserConfig } from "vite"
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js"
import dts from "vite-plugin-dts"

// https://vite.dev/config/
const config = getConfig(({ mode }) => {
	return {
		plugins: [
			cssInjectedByJsPlugin(),
			dts({
				tsconfigPath: "./tsconfig.build.json",
				// 确保类型声明正确生成
				insertTypesEntry: true
			})
		],
		build: buildConfig(mode)
	} as UserConfig
})
export default config
