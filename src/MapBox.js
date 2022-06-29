import maplibregl from "maplibre-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import "maplibre-gl/dist/maplibre-gl.css";
import "./map.css";
import markerImage from "./Map/images/map-marker-icon.png";
import selfDataImage from "./Map/images/Plane1.png";
import otherPlanesImage from "./Map/images/Plane2.png";

const Map = ({ onAddPlane, setMousePosition, otherPlaneCount }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lat, setLat] = useState(32);
  const [lng, setLng] = useState(35);
  const [zoom, setZoom] = useState(9);
  const [isFetchingSelfData, setIsFetchingSelfData] = useState(false);
  const [refreshIntervalId, setRefreshIntervalId] = useState();

  useEffect(() => {
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "http://localhost:3650/api/maps/israel/style.json",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("load", () => map.current.resize());

    map.current.on("mousemove", (e) => {
      setMousePosition({ lng: e.lngLat.lng, lat: e.lngLat.lat });
    });

    map.current.loadImage(markerImage, function (error, image) {
      if (error) throw error;
      map.current.addImage("marker", image);

      map.current.addSource("selfData", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [lat, lng],
          },
          properties: {},
        },
      });
      map.current.addLayer({
        id: "selfData",
        type: "symbol",
        source: "selfData",
        layout: {
          "icon-image": "marker",
          "icon-size": 0.03,
        },
      });
    });

    map.current.loadImage(selfDataImage, function (error, image) {
      if (error) throw error;
      map.current.addImage("selfDataIcon", image);

      map.current.addSource("otherPlanesData", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
      map.current.addLayer({
        id: "otherPlanes",
        type: "symbol",
        source: "otherPlanesData",
        layout: {
          "icon-image": "selfDataIcon",
          "icon-size": 0.1,
          "icon-overlap": "always",
          "icon-rotation-alignment": "map",
        },
      });
    });
  }, []);

  const fetchForSelfData = async () => {
    if (!isFetchingSelfData) {
      setIsFetchingSelfData(true);
      setInterval(async () => {
        const data = await (
          await fetch("https://localhost:5001/self-position")
        ).json();
        map.current.getSource("selfData").setData({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [data.position.latitude, data.position.longitude],
          },
          properties: {
            callSign: data.callSign,
          },
        });
      }, 100);
    }
  };

  const fetchForOtherPlanes = async () => {
    clearInterval(refreshIntervalId);

    const intervalId = setInterval(async () => {
      const data = await (
        await fetch(`https://localhost:5001/multi-position/${otherPlaneCount}`)
      ).json();
      const parsedData = data.map((a) => {
        return {
          type: "Feature",
          properties: {
            callSign: a.callSign,
          },
          geometry: {
            type: "Point",
            coordinates: [a.position.latitude, a.position.longitude],
          },
        };
      });

      map.current.getSource("otherPlanesData").setData({
        type: "FeatureCollection",
        features: [...parsedData],
      });
    }, 100);

    setRefreshIntervalId(intervalId);
  };

  return (
    <>
      <Button onClick={fetchForOtherPlanes}>FETCH ALL</Button>
      {!isFetchingSelfData && (
        <Button onClick={fetchForSelfData}>Fetch SelfData</Button>
      )}
      <div ref={mapContainer} className="map-container" />
    </>
  );
};

export default Map;
