import { useMap, Source, Layer } from "react-map-gl";
import { useState, useEffect } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";

const MonitorBtn = () => {
  const { current: currMap } = useMap();
  const [isMonitoringMockData, setIsMonitoringMockData] = useState(false);
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

  useEffect(() => {
    currMap.loadImage(
      require("../assets/mockPlane.png"),
      function (error, image) {
        if (error) throw error;
        currMap.addImage("mockPlane", image);
      }
    );
    fetchForMockData();
  }, []);

  const fetchForMockData = async () => {
    if (!isMonitoringMockData) {
      const mockDataClient = new W3CWebSocket("ws://localhost:4000/mockData");
      const wdCliend = new W3CWebSocket("ws://localhost:4000/wd");
      mockDataClient.onmessage = (message) => {
        const mockData = JSON.parse(message.data);
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
        console.log(`recieved mock data for ${mockData.CallSign}`);
        //TODO: Send POST request or Socket message to WD
        wdCliend.send(JSON.stringify(mockData));
      };

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
      <div
        onClick={() => setIsMonitoringMockData(!isMonitoringMockData)}
        className={`icon-frame${isMonitoringMockData ? " disabled" : ""}`}
      >
        <MonitorHeartIcon fontSize="large" alt="f" />
      </div>
    </>
  );
};

export default MonitorBtn;

// mapRef.current.setLayoutProperty(
//     'mockData',
//     'visibility',
//     isMonitoringMockData ?'visible' :'none'
//     )
