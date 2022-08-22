import maplibregl from "maplibre-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Map, {
  ScaleControl,
  NavigationControl,
  FullscreenControl,
} from "react-map-gl";

import { useState, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import "./MapBox.css";
import PlaneCounter from "./components/PlaneCounter";

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import FetchSelfData from "./components/FetchSelfData";
import FetchOtherPlanes from "./components/FetchOtherPlanes";
import ObstaclesBtn from "./components/ObstaclesBtn";
import MonitorBtn from "./components/MonitorBtn";
import FpsCounter from "./components/FpsCounter";
import CenterMapBtn from "./components/CenterMapBtn";
import MousePosition from "./components/MousePosition";
import DrawBar from "./components/DrawBar";
import LocalEntities from "./components/LocalEntities";
import FetchAllBtn from "./components/FetchAllBtn";
import PitchBtn from "./components/PitchBtn";

const MapBox = () => {
  const [isfetchingAllPlanes, setIsFetchingAllPlanes] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: 35,
    latitude: 32,
    zoom: 9,
    pitch: 0,
  });
  const [isCentered, setIsCentered] = useState(false);
  const [planeCount, setPlaneCount] = useState(0);
  const mapRef = useRef();

  // {
  //   key: "center",
  //   icon: <AdjustIcon fontSize="large" />,
  //   onClick: () => (isCenter.current = !isCenter.current),
  //   des: "Center Plane",
  //   enable: !isCenter.current //&& isFetchingSelfData,
  // },

  return (
    <div className="map-win">
      <Map
        ref={mapRef}
        mapLib={maplibregl}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ position: "absolute", height: "100%", width: "100vw" }}
        mapStyle="http://localhost:3650/api/maps/israel_1/style.json"
      >
        <div className="left-side-bar">
          <LocalEntities />
          <FetchSelfData
            isCenter={isCentered}
            center={(lat, lon, zoom, pitch, rot) => {
              setViewState({
                longitude: lon,
                latitude: lat,
                zoom: zoom,
                pitch: pitch,
                bearing: rot,
              });
            }}
          />
          <FetchOtherPlanes
            planeCount={planeCount}
            isFetchingAllPlanes={isfetchingAllPlanes}
          />
          <ObstaclesBtn />
          <MonitorBtn />
          <PitchBtn
            pitch={viewState.pitch}
            setPitch={(value) => {
              setViewState({ ...viewState, pitch: value });
            }}
          />
          <CenterMapBtn
            isCenter={isCentered}
            setIsCenter={(value) => setIsCentered(value)}
          />
          <FetchAllBtn
            isFetchingAllPlanes={isfetchingAllPlanes}
            onClick={() => {
              setIsFetchingAllPlanes(!isfetchingAllPlanes);
            }}
          />
        </div>
        <div className="right-side-bar">
          <PlaneCounter
            planeCount={planeCount}
            setPlaneCount={setPlaneCount}
            isfetchingAllPlanes={isfetchingAllPlanes}
          />
        </div>
        <FpsCounter />
        <MousePosition />
        <DrawBar />
        <ScaleControl />
        <NavigationControl position="top-left" />
        <FullscreenControl />
      </Map>
    </div>
  );
};

export default MapBox;
