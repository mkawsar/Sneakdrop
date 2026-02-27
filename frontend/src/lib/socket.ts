import { io } from 'socket.io-client'

// In dev, Vite proxies /socket.io to backend; use same origin so proxy works
export const socket = io(window.location.origin, {
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  autoConnect: true,
})
