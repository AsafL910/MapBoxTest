import { useMap, Source, Layer } from "react-map-gl";
import { useEffect, useState, useRef } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import SideMenuBtn from "./SideMenuBtn";


const FetchSelfData = ({ center, isCenter }) => {
  const { current: currMap } = useMap();
  const [isFetchingSelfData, setIsFetchingSelfData] = useState(false);
  const isCenterRef = useRef();
  const [selfDataSource, setSelfDataSource] = useState({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [],
    },
    properties: {},
  });

  isCenterRef.current = isCenter;

  const selfDataLayer = {
    id: "selfData",
    type: "symbol",
    url: "../assets/pngegg.png",
    source: "selfData",
    layout: {
      "icon-allow-overlap": true,
      "icon-rotation-alignment": "map",
      "icon-rotate": ["get", "trueTrack"],
      "icon-image": "selfPlane",
      "icon-size": 0.1,
    },
  };

  useEffect(() => {
    currMap.loadImage(require("../../assets/Plane2.png"), function (error, image) {
      if (error) throw error;
      currMap.addImage("selfPlane", image);
    });
  }, [currMap]);

  
  const fetchForSelfData = () => {
    const selfDataClient = new W3CWebSocket(
      "ws://localhost:7000/real"
    );
    if (!isFetchingSelfData) {
      setIsFetchingSelfData(true);

      selfDataClient.onmessage = (message) => {
        const data = JSON.parse(message.data);
        setSelfDataSource({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [data.Position.Longitude, data.Position.Latitude],
          },
          properties: {
            callSign: data.CallSign,
            trueTrack: data.TrueTrack,
          },
        });
        if (isCenterRef.current) {
          center(
            data.Position.Latitude,
            data.Position.Longitude,
            9,
            0,
            data.TrueTrack
          );
        }
      };
      selfDataClient.onclose = () => {
        setTimeout(fetchForSelfData, 1000);
      };
    }
  };

  useEffect(()=>{
    fetchForSelfData();
  },[])
  return (
    <>
      <SideMenuBtn
        onClick={fetchForSelfData}
        Icon={AirplanemodeActiveIcon}
        className={isFetchingSelfData && "disabled"}
      />
      <Source id="selfData" type="geojson" data={selfDataSource}>
        <Layer {...selfDataLayer} />
      </Source>
    </>
  );
};

export default FetchSelfData;
