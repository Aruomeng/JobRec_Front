import {fileURLToPath, URL} from 'node:url';
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import commonjs from '@originjs/vite-plugin-commonjs'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    server: {
        port: 8089,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
                secure: false // 允许不安全的 HTTP 请求
            },
            '/kpi': {
                target: 'http://localhost:8090/',
                changeOrigin: true,
                secure: false // 允许不安全的 HTTP 请求
            }
        }
    }
});