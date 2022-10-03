import { useMap, Source, Layer } from "react-map-gl";
import { useState, useEffect, useRef } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import SideMenuBtn from "./SideMenuBtn";

const MonitorBtn = () => {
  const { current: currMap } = useMap();
  const [isMonitoringMockData, setIsMonitoringMockData] = useState(false);
  const isMonitoringRef = useRef();

  isMonitoringRef.current = isMonitoringMockData;

  const [mockDataSource, setMockDataSource] = useState({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [],
    },
    properties: {},
  });

  const mockDataLayer = {
    id: "mockData",
    type: "symbol",
    source: "mockData",
    layout: {
      "icon-allow-overlap": true,
      "icon-rotation-alignment": "map",
      "icon-rotate": ["get", "trueTrack"],
      "icon-image": "mockPlane",
      "icon-size": 0.03,
    },
  };

  useEffect(()=>{
    currMap.loadImage(
      require("../../assets/mockPlane.png"),
      function (error, image) {
        if (error) throw error;
        currMap.addImage("mockPlane", image);
      }
    );
    fetchForMockData();
  },[])

  const fetchForMockData = () => {
      const mockDataClient = new W3CWebSocket("ws://localhost:7000/mockData");
      mockDataClient.onmessage = (message) => {
        
        const mockData = JSON.parse(message.data);
        if (!isMonitoringRef.current) {
        setMockDataSource({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [
              mockData.Position.Longitude,
              mockData.Position.Latitude,
            ],
          },
          properties: {
            callSign: mockData.CallSign,
            trueTrack: mockData.TrueTrack,
          },
        });
      };
        console.log(`recieved mock data for ${mockData.CallSign}`);
        //TODO: Send POST request or Socket message to WD
        mockDataClient.send(JSON.stringify(mockData));
      

      mockDataClient.onclose = () => {
        setTimeout(fetchForMockData, 1000);
      };
    }
  };

  return (
    <>
      <Source id="mockData" type="geojson" data={mockDataSource}>
        <Layer {...mockDataLayer} />
      </Source>
      <SideMenuBtn
        onClick={() => setIsMonitoringMockData((oldValue) => !oldValue)}
        Icon={MonitorHeartIcon}
        className={isMonitoringMockData && " disabled"}
      />
    </>
  );
};

export default MonitorBtn;

