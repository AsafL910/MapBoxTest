import Map from "./MapBox.js"
import PlaneCounter from "./components/PlaneCounter.js";
import { useState } from "react";

const App = () => {

  const [mousePosition, setMousePosition] = useState({lat: 0, lng: 0, height: 0})
  const [planeCount, setPlaneCount] = useState(0);
  return (
    <>
    <Map onAddPlane={()=> console.log("Added Plane")} setMousePosition={setMousePosition} otherPlaneCount={planeCount}/>
    <div style={{position: "absolute", fontFamily: "Arial"}}>
      <PlaneCounter planeCount={planeCount} setPlaneCount={setPlaneCount}/>
      <h3>{`lng: ${ mousePosition.lng},
            lat: ${mousePosition.lat}`}</h3>
    </div>
    </>
  );
}

export default App;
