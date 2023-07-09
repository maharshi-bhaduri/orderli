import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "",
  root: "./app_consumer",
  build: {
    outDir: "./dist/",
  },
  css: {
    postcss: "./app_consumer/postcss.config.js",
  },
});
