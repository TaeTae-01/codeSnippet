// vite.config.js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const srcPath = path.resolve(__dirname, "src");
  const directories = fs
    .readdirSync(srcPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const alias = directories.reduce(
    (acc, dir) => ({
      ...acc,
      [`@${dir}`]: path.resolve(srcPath, dir),
    }),
    { "@": srcPath }
  );

  return {
    plugins: [react({ fastRefresh: true })],
    resolve: { alias },
    server: {
      port: 3000,
      open: true,
      host: true,
      cors: true,
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL || "http://localhost:8080",
          changeOrigin: true,
          secure: false,
          rewrite: (p) => p.replace(/^\/api/, ""),
        },
      },
    },
    build: {
      outDir: "dist",
      sourcemap: mode !== "production",
      minify: "terser",
      cssCodeSplit: true,
      chunkSizeWarningLimit: 500,
      terserOptions: {
        compress: {
          /* eslint-disable camelcase */
          drop_console: mode === "production",
          drop_debugger: mode === "production",
          pure_funcs: mode === "production" ? ["console.log"] : [],
          /* eslint-enable camelcase */
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react")) return "vendor-react";
              if (id.includes("axios")) return "vendor-axios";
              return "vendor";
            }
          },
          assetFileNames: (assetInfo) => {
            let extType = assetInfo.name.split(".").at(1);
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = "img";
            }
            return `assets/${extType}/[name]-[hash][extname]`;
          },
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
        },
      },
    },
    envPrefix: "VITE_",
    css: {
      devSourcemap: true,
      modules: { localsConvention: "camelCase" },
    },
    optimizeDeps: { include: ["react", "react-dom", "axios"] },
    assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.svg"],
  };
});
