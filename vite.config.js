import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'lucide-react': 'lucide-react/dist/esm/lucide-react.js',
    },
  },
  optimizeDeps: {
    include: [
      'axios',
      'react-markdown',
      'remark-gfm',
      'framer-motion',
    ],
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
 