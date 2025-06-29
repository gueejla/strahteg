import { useState, useEffect, useRef } from 'react'

interface WebSocketMessage {
  type: 'connection' | 'echo' | 'broadcast' | 'error' | 'custom' | 'pong';
  data?: unknown;
  message?: string;
  timestamp: string;
}

export function ApiMessage() {
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting')
  const [lastMessage, setLastMessage] = useState<string>('')
  const [error, setError] = useState<string>('')
  const wsRef = useRef<WebSocket | null>(null)
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const connectWebSocket = () => {
    try {
      // Connect to WebSocket server on the same port as the HTTP server
      const ws = new WebSocket('ws://localhost:3001')
      wsRef.current = ws
      
      ws.onopen = () => {
        console.log('WebSocket connected')
        setConnectionStatus('connected')
        setError('')
        
        // Start heartbeat to keep connection alive
        heartbeatIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'ping',
              timestamp: new Date().toISOString()
            }))
          }
        }, 30000) // Send ping every 30 seconds
      }
      
      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          console.log('Received WebSocket message:', message)
          
          if (message.type === 'connection') {
            setLastMessage(`Connected: ${message.message}`)
          } else if (message.type === 'echo') {
            setLastMessage(`Echo received: ${JSON.stringify(message.data)}`)
          } else if (message.type === 'broadcast') {
            setLastMessage(`Broadcast: ${JSON.stringify(message.data)}`)
          } else if (message.type === 'pong') {
            // Server responded to our ping, connection is alive
            console.log('Received pong from server')
          } else {
            setLastMessage(`Message: ${message.message || JSON.stringify(message.data)}`)
          }
        } catch {
          setLastMessage(`Raw message: ${event.data}`)
        }
      }
      
      ws.onclose = (event) => {
        console.log('WebSocket disconnected', event.code, event.reason)
        setConnectionStatus('disconnected')
        
        // Clear heartbeat interval
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current)
          heartbeatIntervalRef.current = null
        }
      }
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setConnectionStatus('error')
        setError('Failed to connect to WebSocket server')
      }
      
    } catch (err) {
      setConnectionStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to create WebSocket connection')
    }
  }

  useEffect(() => {
    // Wait until the page is fully loaded before connecting
    if (document.readyState === 'complete') {
      connectWebSocket()
    } else {
      window.addEventListener('load', connectWebSocket)
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && wsRef.current?.readyState === WebSocket.CLOSED) {
        console.log('Page became visible, reconnecting...')
        setConnectionStatus('connecting')
        connectWebSocket()
      }
    }

    // Keep connection alive when page becomes visible
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup function
    return () => {
      // Clear heartbeat interval
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current)
      }
      
      // Close WebSocket connection
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting')
      }
      
      window.removeEventListener('load', connectWebSocket)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-600'
      case 'connecting':
        return 'text-yellow-600'
      case 'disconnected':
        return 'text-gray-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusBg = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-50 border-green-200'
      case 'connecting':
        return 'bg-yellow-50 border-yellow-200'
      case 'disconnected':
        return 'bg-gray-50 border-gray-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className={`border rounded-md p-4 ${getStatusBg()}`}>
      <h3 className="font-medium mb-2">WebSocket Connection Test</h3>
      
      <div className="flex items-center mb-3">
        <div className={`w-3 h-3 rounded-full mr-2 ${
          connectionStatus === 'connected' ? 'bg-green-500' :
          connectionStatus === 'connecting' ? 'bg-yellow-500' :
          connectionStatus === 'error' ? 'bg-red-500' : 'bg-gray-500'
        }`}></div>
        <span className={`font-medium ${getStatusColor()}`}>
          Status: {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
        </span>
      </div>
      
      {error && (
        <div className="mb-3">
          <p className="text-red-700 text-sm">Error: {error}</p>
        </div>
      )}
      
      {lastMessage && (
        <div className="mb-3">
          <p className="text-gray-700 text-sm">
            <span className="font-medium">Last message:</span> {lastMessage}
          </p>
        </div>
      )}
      
      <p className="text-xs text-gray-500">
        Connecting to: ws://localhost:3001
      </p>
    </div>
  )
} 