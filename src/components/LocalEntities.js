import { Layer, Source } from "react-map-gl";
import entityData from "../assets/entities.json";

const LocalEntities = () => {
  const polygonLayer = {
    id: "park-boundary",
    type: "fill",
    source: "national-park",
    paint: {
      "fill-color": "gray",
      "fill-opacity": 0.4,
    },
    filter: ["==", "$type", "Polygon"],
  };

  const pointLayer = {
    id: "park-volcanoes",
    type: "circle",
    source: "national-park",
    paint: {
      "circle-radius": 6,
      "circle-color": "#B42222",
    },
    filter: ["==", "$type", "Point"],
  };

  return (
    <Source id="national-park" type="geojson" data={entityData}>
      <Layer {...polygonLayer} />
      <Layer {...pointLayer} />
    </Source>
  );
};

export default LocalEntities;
