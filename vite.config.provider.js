import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  root: './app_provider',
  emptyOutDir: true,
  build: {
    outDir: './dist/',
  },
  css: {
    postcss: './app_provider/postcss.config.js',
  },
})
