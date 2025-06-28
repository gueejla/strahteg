import { useState, useEffect } from 'react'
import { ApiMessage } from './components/ApiMessage'

function App() {
  const [timestamp, setTimestamp] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          strahteg implementation coming soon!
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Current time: <span className="font-mono text-indigo-600">{timestamp.toLocaleTimeString()}</span>
        </p>
        <div className="border-t pt-6">
          <ApiMessage />
        </div>
      </div>
    </div>
  )
}

export default App
