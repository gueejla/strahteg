import { useState, useEffect } from 'react'
import { ApiMessage } from './components/ApiMessage'
import './App.css'

function App() {
  const [timestamp, setTimestamp] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <h2>strahteg implementation coming soon!</h2>
      <p>Current time: {timestamp.toLocaleTimeString()}</p>
      <ApiMessage />
    </>
  )
}

export default App
