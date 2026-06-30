import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    //  vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  esbuild: mode === 'production' ? { drop: ['console', 'debugger'] } : {},
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (
            /node_modules\/(vue|vue-router|pinia|pinia-plugin-persistedstate|vue-i18n)\//.test(id)
          ) {
            return 'vue'
          }

          if (/node_modules\/(primevue|@primeuix)\//.test(id)) return 'primevue'
          if (/node_modules\/(chart\.js|vue3-apexcharts|apexcharts)\//.test(id)) return 'charts'
          if (/node_modules\/(xlsx|jspdf|html2canvas|file-saver|jszip)\//.test(id)) {
            return 'documents'
          }
          if (/node_modules\/quill\//.test(id)) return 'editor'
          if (/node_modules\/lottie-web\//.test(id)) return 'animation'
          if (/node_modules\/@stomp\/stompjs\//.test(id)) return 'realtime'
        },
      },
    },
  },
}))
