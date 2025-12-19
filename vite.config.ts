import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

const __dirname = import.meta.dirname

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: 'src',
  publicDir: '../public',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        download: resolve(__dirname, 'src/download.html'),
        'download-image': resolve(__dirname, 'src/download-image.html'),
        'download-video': resolve(__dirname, 'src/download-video.html'),
        'download-audio': resolve(__dirname, 'src/download-audio.html'),
        'download-markdown': resolve(__dirname, 'src/download-markdown.html'),
        'download-code': resolve(__dirname, 'src/download-code.html'),
        '404': resolve(__dirname, 'src/404.html'),
      },
    },
  },
})
