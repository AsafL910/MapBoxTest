import { useMap } from "react-map-gl";
import { useEffect } from "react";
import { FPSControl } from "mapbox-gl-fps/lib/MapboxFPS.min";

const FpsCounter = () => {
  const { current: currMap } = useMap();
  useEffect(() => {
    const fpsControl = new FPSControl();
    currMap.addControl(fpsControl, "top-right");
  }, []);
  return <></>;
};

export default FpsCounter;
