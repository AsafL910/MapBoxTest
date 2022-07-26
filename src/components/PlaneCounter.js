import Slider from '@mui/material/Slider'
import './PlaneCounter.css'
const PlaneCounter = ({ planeCount, setPlaneCount }) => {
  const calculateValue = (value) => {
    return 2 ** value
  }

  return (
    <Slider
      className="slider"
      orientation="vertical"
      aria-label="Planes count"
      defaultValue={0}
      onChange={(e) => setPlaneCount(calculateValue(e.target.value))}
      valueLabelDisplay="auto"
      step={1}
      scale={calculateValue}
      max={12}
    />
  )
}

export default PlaneCounter
