import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react(), basicSsl()],
  server: {
    host: true,
    fs: {
      strict: false, // Убедитесь, что Vite может читать файлы за пределами root
    },
    // Добавляем fallback через middleware для 404 на SPA
    middlewareMode: true,
    watch: {
      usePolling: true,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          fm: ["framer-motion"],
          des: ["@repo/ui"],
          ico: ["@repo/ui/emojis"],
          ph: ["posthog-js", "posthog-js/react"],
        },
      },
    },
  },
});
