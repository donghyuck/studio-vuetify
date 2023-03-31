// Plugins
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
// import eslint from "vite-plugin-eslint";
import { checker } from 'vite-plugin-checker';

// Utilities
import { fileURLToPath, URL } from "node:url";
import { defineConfig, splitVendorChunkPlugin } from "vite";
// import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin#image-loading
        transformAssetUrls,
      },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
    // eslint({
    //   include: ['src/**/*.ts', 'src/**/*.vue', 'src/*.ts', 'src/*.vue'],
    // }),
    // vite-plugin-checker
    // https://github.com/fi3ework/vite-plugin-checker
    checker({
      typescript: true,
      // usgin Volar checker only vue 3.
      //vueTsc: true,
      eslint: {
        lintCommand:
         "eslint . --fix --cache --cache-location ./node_modules/.vite/vite-plugin-eslint", // for example, lint .ts & .tsx
      },
      // stylelint: { 
      //   lintCommand: 'stylelint ./src/**/*.{css,vue}',
      // },
    }),
    splitVendorChunkPlugin()
  ],
  define: { "process.env": {} },
  resolve: {
    alias: {
      // '@': path.resolve(__dirname, 'src'),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "~": fileURLToPath(new URL("./node_modules", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    port: 3000,
  },
});
