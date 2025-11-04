import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
      "@": path.resolve(__dirname, "./src/ui"),
    },
  },
  define: {
    // Define process.env for libraries that expect it (like next-auth)
    "process.env": JSON.stringify({
      NODE_ENV: process.env.NODE_ENV || "development",
      // Add any other process.env vars that need to be available in the browser
      // Note: Only expose variables that are safe for client-side code
    }),
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
