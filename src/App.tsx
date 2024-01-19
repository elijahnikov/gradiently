import { useState } from 'react'
import './App.css'
import { ColorWheel } from './component/ColorWheel'

function App() {
  const [gradient, setGradient] = useState<string>('')
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <ColorWheel
          gradientType="linear"
          radius={100}
          pickers={3}
          direction="left"
          onChange={setGradient}
        />
      </div>
    </div>
  )
}

export default App
