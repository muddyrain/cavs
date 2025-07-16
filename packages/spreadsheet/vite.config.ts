import { resolve } from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  const isProd = mode === 'production';

  return {
    plugins: [
      react(),
      tailwindcss(),
      cssInjectedByJsPlugin(),
      dts({
        tsconfigPath: "./tsconfig.build.json"
      })
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    build: {
      lib: {
        entry: './src/index.ts',
        name: 'index',
        formats: isDev ? ["es"] : ["es", "umd", "cjs"], // 开发时只构建 ES 模块
        fileName: (format) => `index.${format}.js`,
      },
      cssCodeSplit: false,
      minify: isProd, // 只在生产环境压缩
      sourcemap: isDev, // 只在开发环境生成 sourcemap
      rollupOptions: {
        external: ['react', 'react-dom'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      },
    }
  }
})
