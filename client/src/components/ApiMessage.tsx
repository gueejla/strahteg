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

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Loading message...</span>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-700 font-medium">Error: {error}</p>
      </div>
    )
  }
  
  return (
    <div className="bg-green-50 border border-green-200 rounded-md p-4">
      <p className="text-green-700 font-medium">Message from API: {message}</p>
    </div>
  )
} 