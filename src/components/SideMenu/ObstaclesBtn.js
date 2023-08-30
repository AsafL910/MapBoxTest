import { Source, Layer, useMap } from "react-map-gl";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";
import { useEffect, useState } from "react";
import SideMenuBtn from "./SideMenuBtn";

const ObstaclesBtn = () => {
  const { current: currMap } = useMap();
  const [showObstacles, setShowObstacles] = useState(true);
  const [obstacleData, setObstaclesData] = useState({
    type: "FeatureCollection",
    features: [],
  });
  const obstaclesLayer = {
    id: "obstacleData",
    type: "symbol",
    source: "obstacleData",
    layout: {
      "icon-allow-overlap": true,
      "icon-image": "mapMarker",
      "icon-size": 0.065,
      "icon-anchor": "bottom",
    },
  };

  useEffect(() => {
    currMap.loadImage(
      require("../../assets/red-obstacle.png"),
      function (error, image) {
        if (error) throw error;
        currMap.addImage("mapMarker", image);
      }
    );
  }, []);

  const fetchForObstacles = async () => {

    if (showObstacles)
    {
      const data = await (
        await fetch(`http://localhost:5000/obstacles/${1000}`)
    ).json();
    const parsedData = data.map((a) => {
      return {
        type: "Feature",
        properties: {
          callSign: a.name,
          description: a.description,
          heightMeters: a.heightMeters,
        },
        geometry: {
          type: "Point",
          coordinates: [a.position.longitude, a.position.latitude],
        },
      };
    });
    setObstaclesData({
      type: "FeatureCollection",
      features: [...parsedData],
    });
    }
    else
    {
      setObstaclesData({
        type: "FeatureCollection",
        features: [],
      });
    }
    setShowObstacles(!showObstacles);
    
  };
  return (
    <>
    <SideMenuBtn onClick={fetchForObstacles} Icon={CrisisAlertIcon} className={showObstacles && " disabled"}/>
      <Source id="obstacleData" type="geojson" data={obstacleData}>
        <Layer {...obstaclesLayer} />
      </Source>
    </>
  );
};

export default ObstaclesBtn;
