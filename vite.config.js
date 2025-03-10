import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'  // не получилось чет настроить на проекте, пока скип, мб позже сделаю



export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    port: 1337,
    open: true,
    strictPort: true,
    cors: true,
  }
})
