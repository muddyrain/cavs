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
				insertTypesEntry: true,
				outDir: ["dist/types"]
			})
		],
		build: buildConfig(mode)
	} as UserConfig
})
export default config
