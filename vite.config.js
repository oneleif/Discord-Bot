import { defineConfig } from "vite";

export default defineConfig({
  build: {
    manifest: true,
    minify: true,

    rollupOptions: {
      input: "src/main.ts",
      output: {
        entryFileNames: "main.js",
      },
    },
  },
});
