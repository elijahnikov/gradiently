import './App.css'
import { ColorWheel } from './component/ColorWheel'

function App() {
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <ColorWheel via radius={100} onChange={() => {}} />
      </div>
    </div>
  )
}

export default App
