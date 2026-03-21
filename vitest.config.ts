import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@main": resolve(__dirname, "./src/main"),
      "@plugins": resolve(__dirname, "./src/renderer-plugins"),
      "@preload": resolve(__dirname, "./src/preload"),
      "@renderer": resolve(__dirname, "./src/renderer/src"),
      "@shared": resolve(__dirname, "./src/shared"),
      "@translations": resolve(__dirname, "./src/translations"),
      "~": resolve(__dirname, "."),
    },
  },
  test: {
    environment: "node",
  },
});
