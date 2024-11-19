import { useState } from 'react'
import './App.css'
import DateTime from './Clock'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>Sleep Tracker</h1>
      <DateTime></DateTime>
    </div>
  )
}

export default App
