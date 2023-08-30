import { useEffect, useState } from "react";
import { useMap } from "react-map-gl";
import "./MousePosition.css";

const MousePosition = () => {
  const { current: currMap } = useMap();
  const [mousePosition, setMousePosition] = useState({
    lat: 0,
    lng: 0,
    height: 0,
  });

  useEffect(() => {
    currMap.on("mousemove", (e) =>
      setMousePosition({ lng: e.lngLat.lng, lat: e.lngLat.lat })
    );
  }, []);

  return (
    <div className="clicked-coord-label">
      <p>{`${mousePosition.lng.toFixed(5)},
        ${mousePosition.lat.toFixed(5)}`}</p>
    </div>
  );
};

export default MousePosition;
