import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const API_URL = process.env.VITE_API_URL ?? 'http://localhost:3001'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: API_URL, changeOrigin: true },
      '/socket.io': { target: API_URL, ws: true },
    },
  },
})
