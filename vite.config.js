import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "./" : "/",
  plugins: [react(), cloudflare()],
  cacheDir: "node_modules/.vite-cache",
  optimizeDeps: {
    include: [
      "react",
      "react-dom/client",
      "three",
      "three/examples/jsm/loaders/GLTFLoader.js",
      "gsap",
      "gsap/ScrollTrigger",
      "@phosphor-icons/react",
    ],
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three", "three/examples/jsm/loaders/GLTFLoader.js"],
          motion: ["gsap", "gsap/ScrollTrigger"],
          react: ["react", "react-dom/client"],
          icons: ["@phosphor-icons/react"],
        },
      },
    },
  },
  server: {
    host: "127.0.0.1",
    fs: {
      strict: true,
      allow: ["."],
    },
  },
}));