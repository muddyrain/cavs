import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import { resolve } from "path"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		watch: {
			ignored: ["!**/node_modules/**", "!**/packages/**/dist/**"]
		}
	},
	resolve: {
		alias: {
			"@/": resolve(__dirname, "./src")
		}
	},
	optimizeDeps: {
		exclude: ["@cavs/editor"]
	}
})
