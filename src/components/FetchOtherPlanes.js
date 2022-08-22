import { Layer, Source, useMap } from "react-map-gl";
import { useEffect, useState } from "react";
import ConnectingAirportsIcon from "@mui/icons-material/ConnectingAirports";

const FetchOtherPlanes = ({ planeCount, isFetchingAllPlanes }) => {
  const [refreshIntervalId, setRefreshIntervalId] = useState();
  const { current: currMap } = useMap();
  const [otherPlanesData, setOtherPlanesData] = useState({
    type: "FeatureCollection",
    features: [],
  });

  const otherPlanesLayer = {
    id: "otherPlanes",
    type: "symbol",
    source: "otherPlanesData",
    layout: {
      "icon-image": "selfDataIcon",
      "icon-size": 0.075,
      "icon-allow-overlap": true,
      "icon-rotation-alignment": "map",
      "icon-rotate": ["get", "trueTrack"],
    },
    minzoom: 6,
  };
  useEffect(() => {
    currMap.loadImage(require("../assets/Plane2.png"), function (error, image) {
      if (error) throw error;
      currMap.addImage("selfDataIcon", image);

      currMap.on("click", "otherPlanes", (e) =>
        alert(e.features[0].properties.callSign)
      );
      currMap.on(
        "mouseenter",
        "otherPlanes",
        () => (currMap.getCanvas().style.cursor = "pointer")
      );
      currMap.on(
        "mouseleave",
        "otherPlanes",
        () => (currMap.getCanvas().style.cursor = "")
      );
    });
  }, []);

  const fetchForOtherPlanes = async (isFetchingAllPlanes, planeCount) => {
    clearInterval(refreshIntervalId);

    const intervalId = setInterval(async () => {
      const data = await (
        await fetch(
          `http://localhost:5000/multi-position/${
            isFetchingAllPlanes ? "" : planeCount
          }`
        )
      ).json();
      const parsedData = data.map((plane) => {
        return {
          type: "Feature",
          properties: {
            callSign: plane.callSign,
            trueTrack: plane.trueTrack,
          },
          geometry: {
            type: "Point",
            coordinates: [plane.position.longitude, plane.position.latitude],
          },
        };
      });

      setOtherPlanesData({
        type: "FeatureCollection",
        features: [...parsedData],
      });
    }, 100);

    setRefreshIntervalId(intervalId);
  };

  return (
    <>
      <div
        onClick={() => {
          fetchForOtherPlanes(isFetchingAllPlanes, planeCount);
        }}
        className={`icon-frame${
          planeCount > 0 || isFetchingAllPlanes ? "" : " disabled"
        }`}
      >
        <ConnectingAirportsIcon fontSize="large" alt="f" />
      </div>
      <Source id="otherPlanesData" type="geojson" data={otherPlanesData}>
        <Layer {...otherPlanesLayer} />
      </Source>
    </>
  );
};

export default FetchOtherPlanes;
