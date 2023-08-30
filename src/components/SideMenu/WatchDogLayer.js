import { useMap, Source, Layer } from "react-map-gl";
import { useState, useEffect, useRef } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const WatchDogLayer = () => {
  const { current: currMap } = useMap();
  const wdSocketRef = useRef();
  const mockSocketRef = useRef();

  const WD_URL = "ws://localhost:8000/wd";
  const MOCK_URL ="ws://localhost:7001/mock";

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

  const onMessageMock = (message) => {
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

      if (wdSocketRef.current && wdSocketRef.current.readyState === wdSocketRef.current.OPEN) {
        wdSocketRef.current.send(JSON.stringify(mockData));
      } 
  };

  useEffect(() => {
    const fetchForMockData = () => {
      const newMockSocket = new W3CWebSocket(MOCK_URL);
      newMockSocket.onmessage = onMessageMock
      const reconnectMock = (event) => {
        if (event.type === "error") {
          event.preventDefault();
        }
        const timer = setTimeout(()=>{
            const reconnectedWebSocket = new W3CWebSocket(MOCK_URL);
            reconnectedWebSocket.onmessage = onMessageMock
            reconnectedWebSocket.onclose = reconnectMock
            reconnectedWebSocket.onerror = reconnectMock
            mockSocketRef.current = reconnectedWebSocket;
        }, 1000)
        return () => clearTimeout(timer);
      }
      newMockSocket.onclose = reconnectMock
      newMockSocket.onerror = reconnectMock
      mockSocketRef.current = newMockSocket;
    };

    const connectToWd = () => {
      const newWdSocket = new W3CWebSocket(WD_URL);
      const reconnectWd = (event) => {
        event.preventDefault();
        const timer = setTimeout(()=>{
            const reconnectedWebSocket = new W3CWebSocket(WD_URL);
            wdSocketRef.current = reconnectedWebSocket;
        },1000);
        return () => clearTimeout(timer);
      }
      newWdSocket.onclose = reconnectWd
      newWdSocket.onerror = reconnectWd
      wdSocketRef.current = newWdSocket;
    };
    connectToWd()
    fetchForMockData();
    return ()=> {
      wdSocketRef.current.close();
      mockSocketRef.current.close()
    }
  }, []);

  useEffect(()=>{
    currMap.loadImage(
      require("../../assets/mockPlane.png"),
      function (error, image) {
        if (error) throw error;
        if (!currMap.hasImage("mockPlane")) {
          currMap.addImage("mockPlane", image);
        }
      }
    );
  }, [currMap])

  return (
      <Source id="mockData" type="geojson" data={mockDataSource}>
        <Layer {...mockDataLayer} />
      </Source>
  );
};

export default WatchDogLayer;
