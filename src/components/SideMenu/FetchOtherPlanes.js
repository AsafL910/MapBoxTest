import { Layer, Source, useMap } from "react-map-gl";
import { useEffect, useRef, useState } from "react";
import ConnectingAirportsIcon from "@mui/icons-material/ConnectingAirports";
import SideMenuBtn from "./SideMenuBtn";
import { w3cwebsocket as W3CWebSocket } from "websocket";
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
  const websocketRef = useRef(null)

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

      currMap.on("click", "otherPlanes", (e) =>
      {
        setLastPlaneClicked(e.features[0].properties.callSign);
        setIsPlaneClicked(true);
      }
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

  useEffect(()=>{
    const initConnection = () => {
      const planesDataClient = new W3CWebSocket(
        "ws://localhost:2000/other-planes"
      );
      planesDataClient.onopen = () => {
        console.log("Client Connected to position provider!");
      };
      planesDataClient.onmessage = (message) => {
        const data = JSON.parse(message.data);
        console.log("recieved update")
        const parsedData = data.map((plane) => {
          return {
            type: "Feature",
            properties: {
              callSign: plane.CallSign,
              trueTrack: plane.TrueTrack,
            },
            geometry: {
              type: "Point",
              coordinates: [plane.Position.Longitude, plane.Position.Latitude],
            },
          };
        });
  
        setOtherPlanesData({
          type: "FeatureCollection",
          features: [...parsedData],
        });
    }
    planesDataClient.onerror = (error) => {
      console.log(error)
    }

    planesDataClient.onclose = (message) => {
      console.log("Connection ended")
      initConnection()
    }

    websocketRef.current = planesDataClient;
    }

    initConnection()

    return () => {
      websocketRef.current.close();
    }
  },[])

  return (
    <>
    <Snackbar open={isPlaneClicked} onClose={()=>{setIsPlaneClicked(false);}} message={lastPlaneClicked}/>
      <SideMenuBtn
        onClick={() => {
          websocketRef.current?.send(JSON.stringify(planeCountRef.current))
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
