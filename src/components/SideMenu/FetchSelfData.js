import { useMap, Source, Layer } from "react-map-gl";
import { useEffect, useState } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import SideMenuBtn from "./SideMenuBtn";

const FetchSelfData = ({ center, isCenter }) => {
  const { current: currMap } = useMap();
  const [isFetchingSelfData, setIsFetchingSelfData] = useState(false);
  const [selfDataSource, setSelfDataSource] = useState({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [32, 35],
    },
    properties: {},
  });

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
  }, []);

  const fetchForSelfData = async (isCenter) => {
    if (!isFetchingSelfData) {
      setIsFetchingSelfData(true);

      const selfDataClient = new W3CWebSocket(
        "ws://localhost:4000/selfPosition"
      );
      selfDataClient.onopen = () => {
        console.log("Client Connected to SelfData!");
      };
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
        if (isCenter) {
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

  return (
    <>
      <SideMenuBtn
        onClick={() => fetchForSelfData(isCenter)}
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
