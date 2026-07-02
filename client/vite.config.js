import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During development, proxy /api calls to the Express server on :3001
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
