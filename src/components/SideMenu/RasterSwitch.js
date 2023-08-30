import { Switch } from "@mui/material";
import { Source, Layer } from "react-map-gl";

const RasterSwitch = ({ checked, onChange }) => {
  return (
    <>
      <Switch checked={checked} onChange={onChange} />
      {checked && (
        <Source
          type="raster"
          tiles={["http://localhost:3650/api/maps/israel_2/{z}/{x}/{y}.png"]}
        >
          <Layer id="a" type="raster" />
        </Source>
      )}
    </>
  );
};

export default RasterSwitch;
