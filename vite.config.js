import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        copilot: resolve(__dirname, 'blog-ai-copilot.html'),
        imtex: resolve(__dirname, 'blog-imtex-lessons.html'),
        manufacturing: resolve(__dirname, 'blog-ai-manufacturing.html'),
      },
    },
  },
})
