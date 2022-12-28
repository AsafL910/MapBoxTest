import { useMap, Source, Layer } from "react-map-gl";
import { useState, useEffect, useRef } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const mockDataClient = new W3CWebSocket("ws://localhost:7001/mock");

const WatchDogLayer = () => {
  const { current: currMap } = useMap();
  const [isMonitoringMockData, setIsMonitoringMockData] = useState(false);
  const isMonitoringRef = useRef();
  const wdSocket = new W3CWebSocket("ws://localhost:8000/wd");

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

  useEffect(() => {
    currMap.loadImage(
      require("../../assets/mockPlane.png"),
      function (error, image) {
        if (error) throw error;
        currMap.addImage("mockPlane", image);
      }
    );
    const fetchForMockData = () => {
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
        }
        console.log(`recieved mock data: ${mockData.CallSign}`);

        wdSocket?.send(JSON.stringify(mockData));
        mockDataClient.onclose = () => {};
      };
    };
    setTimeout(fetchForMockData, 1000);
  }, []);

  return (
    <>
      <Source id="mockData" type="geojson" data={mockDataSource}>
        <Layer {...mockDataLayer} />
      </Source>
    </>
  );
};

export default WatchDogLayer;
