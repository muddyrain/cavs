import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import { resolve } from "path"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src")
		}
	},
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:7001",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, "") // 去掉 /api 前缀
			}
		}
	}
})
