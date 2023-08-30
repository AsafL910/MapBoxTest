import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useEffect } from "react";
import { useMap } from "react-map-gl";

const DrawBar = () => {
  const { current: currMap } = useMap();

  useEffect(() => {
    var draw = new MapboxDraw();

    currMap.addControl(draw, "top-left");

    const entityCreated = (e) => {
      var data = draw.getAll();
      if (data.features.length > 0) {
        console.log(JSON.stringify(data.features));
      }
    };
    currMap.on("draw.create", entityCreated);
    currMap.on("draw.update", () => console.log("draw.update"));
    currMap.on("draw.delete", () => console.log("draw.delete"));
  }, []);

  return <></>;
};

export default DrawBar;
