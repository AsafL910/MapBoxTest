import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useState, useEffect, useRef } from "react";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYmFydWNoZ2luemJ1cmciLCJhIjoiY2trMTFja3FoMG4wOTJ2cnJnZzU5bDc2NSJ9.K3acyuJruEbTLgDD5KrC2A";

const MapBox = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  return (
    <div>
      <div ref={mapContainer} className="map-container" style={{height: "1440px"}} />
    </div>
    );
};

export default MapBox;