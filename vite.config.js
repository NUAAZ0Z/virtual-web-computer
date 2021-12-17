import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        viteCompression({
            algorithm: 'brotliCompress',
            ext: 'br',
            filter: '/\.(js|mjs|json|css|html|jpg|jpeg|png|webp|svg)$/i',
        }),
    ],
    build: {
        minify: 'terser',
        terserOptions: {
            compress: {
                //生产环境时移除console
                drop_console: true,
                drop_debugger: true,
            },
        },
    },
})
