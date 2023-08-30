import { Layer, Source, useMap } from "react-map-gl";
import { useEffect, useRef, useState } from "react";
import ConnectingAirportsIcon from "@mui/icons-material/ConnectingAirports";
import SideMenuBtn from "./SideMenuBtn";
import { Snackbar } from "@mui/material";

const FetchOtherPlanes = ({ planeCount, isFetchingAllPlanes }) => {
  const isFetchingAllPlanesRef = useRef();
  isFetchingAllPlanesRef.current = isFetchingAllPlanes;
  const { current: currMap } = useMap();
  const planeCountRef = useRef();
  planeCountRef.current = planeCount;
  const [otherPlanesData, setOtherPlanesData] = useState({
    type: "FeatureCollection",
    features: [],
  });
  const otherPlanesDataRef = useRef();
  otherPlanesDataRef.current = otherPlanesData;
  const [isPlaneClicked, setIsPlaneClicked] = useState(false);
  const [lastPlaneClicked, setLastPlaneClicked] = useState(null);
  const [isFetching, setIsFetching] = useState(false)

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
    currMap.loadImage(require("../../assets/Plane2.png"), function (error, image) {
      if (error) throw error;
      currMap.addImage("selfDataIcon", image);

      currMap.on("click", "otherPlanes", (e) =>{
      setLastPlaneClicked(e.features[0].properties.callSign);
      setIsPlaneClicked(true);
    });
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

  const fetchForOtherPlanes = async () => {
      while(true) {
      const data = await (
        await fetch(
          `http://localhost:5000/multi-position/${
            isFetchingAllPlanesRef.current  ? "" : planeCountRef.current
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
    }

  };

  return (
    <>
      <Snackbar open={isPlaneClicked} onClose={()=>{setIsPlaneClicked(false);}} message={lastPlaneClicked} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}/>
      <SideMenuBtn
        onClick={() => {
          fetchForOtherPlanes();
        }}
        Icon={ConnectingAirportsIcon}
        className={planeCount <= 0 && !isFetchingAllPlanes && " disabled"}
      />
      <Source id="otherPlanesData" type="geojson" data={otherPlanesDataRef.current}>
        <Layer {...otherPlanesLayer} />
      </Source>
    </>
  );
};

export default FetchOtherPlanes;
