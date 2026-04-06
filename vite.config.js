import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        talks: resolve(__dirname, 'src/talks/index.html'),
        book: resolve(__dirname, 'src/book/index.html'),
        about: resolve(__dirname, 'src/about/index.html'),
      }
    }
  },
  appType: 'mpa',
  server: {
    open: true
  }
})
