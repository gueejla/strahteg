import { useState, useEffect } from 'react'

export function ApiMessage() {
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/hello')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setMessage(data.message)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch message')
      } finally {
        setLoading(false)
      }
    }

    fetchMessage()
  }, [])

  if (loading) return <p>Loading message...</p>
  if (error) return <p className="text-red-500">Error: {error}</p>
  return <p>Message from API: {message}</p>
} 