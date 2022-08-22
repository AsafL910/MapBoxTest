import { useEffect } from "react";
import { useMap } from "react-map-gl";
import MapIcon from "@mui/icons-material/Map";

const PitchBtn = ({ pitch, setPitch }) => {
  const { current: currMap } = useMap();

  useEffect(() => {}, []);
  return (
    <div onClick={() => setPitch(pitch != 0 ? 0 : 40)} className="icon-frame">
      <MapIcon fontSize="large" alt="f" />
    </div>
  );
};

export default PitchBtn;
