import Slider from '@mui/material/Slider'
import './PlaneCounter.css'
const PlaneCounter = ({ planeCount, setPlaneCount }) => {
  const marks = [
    {
      value: 0,
      label: '',
    },
    {
      value: 1,
      label: '',
    },
    {
      value: 2,

      label: '',
    },
    {
      value: 3,

      label: '',
    },
    {
      value: 4,
      label: '',
    },
    {
      value: 5,
      label: '',
    },
    {
      value: 6,
      label: '',
    },
    {
      value: 7,
      label: '',
    },
    {
      value: 8,
      label: '',
    },
    {
      value: 9,
      label: '',
    },
    {
      value: 10,
      label: '',
    },
    {
      value: 11,
      label: '',
    },
    {
      value: 12,
      label: '',
    },
  ]

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
