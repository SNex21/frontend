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
    historyApiFallback: true, // Добавлено для обработки маршрутов на стороне клиента
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
