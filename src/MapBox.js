import maplibregl from "maplibre-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Map, {
  ScaleControl,
  NavigationControl,
  FullscreenControl,
} from "react-map-gl";

import { useState, useRef, useEffect } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import "./MapBox.css";
import PlaneCounter from "./components/PlaneCounter";

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import FetchSelfData from "./components/SideMenu/FetchSelfData";
import FetchOtherPlanes from "./components/SideMenu/FetchOtherPlanes";
import ObstaclesBtn from "./components/SideMenu/ObstaclesBtn";
import MonitorBtn from "./components/SideMenu/WatchDogLayer";
import FpsCounter from "./components/Controls/FpsCounter";
import CenterMapBtn from "./components/SideMenu/CenterMapBtn";
import MousePosition from "./components/MousePosition";
import DrawBar from "./components/Controls/DrawBar";
import LocalEntities from "./components/LocalEntities";
import PauseBtn from "./components/SideMenu/PauseBtn";
import PitchBtn from "./components/SideMenu/PitchBtn";
import RasterSwitch from "./components/SideMenu/RasterSwitch";

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
  const [isRaster, setIsRaster] = useState(window.localStorage.getItem("map") === "raster");
  const [mapStyle, setMapStyle] = useState(null);
  const mapRef = useRef();

  useEffect(()=>{
    window.localStorage.setItem("map", isRaster ? "raster" : "vector")
    setMapStyle(isRaster
      ? Map.defaultProps.mapStyle
      : "http://localhost:3650/api/maps/israel_2/style.json")
  },[isRaster]);

  return (
    <div className="map-win">
      <Map
        ref={mapRef}
        mapLib={maplibregl}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ position: "absolute", height: "100%", width: "100vw" }}
        mapStyle={mapStyle && mapStyle}
      >
        <div className="left-side-bar">
          {/* <LocalEntities /> */}
          <RasterSwitch
            checked={isRaster}
            onChange={() => {
            setIsRaster(!isRaster)
            window.location.reload()
          }}
          />
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
          <PauseBtn
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
        {/* <DrawBar /> */}
        <ScaleControl />
        <NavigationControl position="top-left" />
        <FullscreenControl />
      </Map>
    </div>
  );
};

export default MapBox;
