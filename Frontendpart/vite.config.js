import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "https://videotube-rmvp.onrender.com",
    },
  },
  plugins: [react(), tailwindcss()],
});
