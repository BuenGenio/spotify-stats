import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000
  },
  base: './', // Use relative paths for mobile app compatibility
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})



