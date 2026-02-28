import { io } from 'socket.io-client'

function getSocketUrl(): string {
  const url = import.meta.env.VITE_API_URL
  if (typeof url === 'string' && url.trim()) {
    const base = url.trim().replace(/\/$/, '')
    return base.startsWith('http') ? base : `https://${base}`
  }
  return window.location.origin
}

export const socket = io(getSocketUrl(), {
  path: '/socket.io',
  transports: ['polling', 'websocket'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  timeout: 20000,
})
