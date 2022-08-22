import AdjustIcon from "@mui/icons-material/Adjust";
import { useEffect } from "react";
import { useMap } from "react-map-gl";

const CenterMapBtn = ({ isCenter, setIsCenter }) => {
  const { current: currMap } = useMap();

  useEffect(() => {
    currMap.on("drag", () => {
      setIsCenter(false);
    });

    currMap.on("mousedown", () => {
      setIsCenter(false);
    });

    currMap.on("wheel", () => {
      setIsCenter(false);
    });
  }, []);
  return (
    <div
      onClick={() => {
        setIsCenter(!isCenter);
      }}
      className={`icon-frame${isCenter ? " disabled" : ""}`}
    >
      <AdjustIcon fontSize="large" alt="f" />
    </div>
  );
};

export default CenterMapBtn;
