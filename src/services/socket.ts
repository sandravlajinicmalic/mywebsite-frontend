import { io, type Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

let socket: Socket | null = null

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: Infinity,
      timeout: 20000,
      forceNew: false,
      autoConnect: true,
      withCredentials: false,
      upgrade: true,
      rememberUpgrade: false
    })
  }
  return socket
}

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export default getSocket

