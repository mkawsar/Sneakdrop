import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const API_URL = process.env.VITE_API_URL ?? 'http://localhost:3001'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
  server: {
    proxy: {
      '/api': { target: API_URL, changeOrigin: true },
      '/socket.io': { target: API_URL, ws: true },
    },
  },
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- test option is from Vitest; Vite's types don't include it
} as any)
