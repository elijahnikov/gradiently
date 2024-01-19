import './App.css'
import { ColorWheel } from './component/ColorWheel'

function App() {
  // const [count, setCount] = useState(0)
  // const [test, setTest] = useState<Record<string, Point>>({})
  return (
    <div>
      <div style={{ display: 'flex' }}>
        {/* <div className="card"> */}
        {/* <ColorWheel via radius={100} onChange={(data) => console.log(data)} /> */}
        <ColorWheel via radius={100} onChange={(data) => console.log(data)} />
      </div>
    </div>
  )
}

export default App
