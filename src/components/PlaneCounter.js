import Slider from '@mui/material/Slider'
const PlaneCounter = ({ planeCount, setPlaneCount, isfetchingAllPlanes }) => {
  const calculateValue = (value) => {
    return 2 ** value
  }

  return (
    <Slider
      disabled={isfetchingAllPlanes}
      className="slider"
      orientation="vertical"
      aria-label="Planes count"
      defaultValue={0}
      onChange={(e) => setPlaneCount(calculateValue(e.target.value))}
      valueLabelDisplay="auto"
      step={1}
      scale={calculateValue}
      max={15}
    />
  )
}

export default PlaneCounter
