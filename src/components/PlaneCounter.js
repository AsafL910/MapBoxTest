import { useState } from 'react'

const PlaneCounter = ({planeCount, setPlaneCount}) => {
    return (
    <>
        <h2>Plane Count: {planeCount}</h2>
        <input value={planeCount} onChange={(e)=> {setPlaneCount(e.target.value)}}/>
    </>
  )
}

export default PlaneCounter
