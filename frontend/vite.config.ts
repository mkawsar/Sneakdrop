import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const API_URL = env.VITE_API_URL ?? 'http://localhost:8001'

  return {
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
  } as any
})
