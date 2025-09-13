import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

// Connects to the API server's socket.io endpoint
export function useSocket() {
  const [connected, setConnected] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '')
    const s = io(base, { transports: ['websocket'] })
    socketRef.current = s
    setSocket(s)

    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)

    s.on('connect', onConnect)
    s.on('disconnect', onDisconnect)

    return () => {
      s.off('connect', onConnect)
      s.off('disconnect', onDisconnect)
      s.close()
      socketRef.current = null
      setSocket(null)
    }
  }, [])

  return { socket, connected }
}