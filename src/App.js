import Map from './MapBox.js'
import PlaneCounter from './components/PlaneCounter.js'
import { useState, useEffect } from 'react'
import './App.css'

const App = () => {
  useEffect(() => {})
  const [mousePosition, setMousePosition] = useState({
    lat: 0,
    lng: 0,
    height: 0,
  })
  return (
    <>
      <Map
        style={{ height: '100%' }}
        setMousePosition={setMousePosition}
      />
      {/* <div style={{ position: 'absolute', backgroundColor: "red", fontFamily: 'Arial' }}>
        <PlaneCounter planeCount={planeCount} setPlaneCount={setPlaneCount} />
      </div> */}

      <div className="clicked-coord-label">
        <p>{`${mousePosition.lng.toFixed(5)},
            ${mousePosition.lat.toFixed(5)}`}</p>
      </div>
    </>
  )
}

export default App
