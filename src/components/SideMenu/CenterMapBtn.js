import AdjustIcon from "@mui/icons-material/Adjust";
import { useEffect } from "react";
import { useMap } from "react-map-gl";
import SideMenuBtn from "./SideMenuBtn";

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
    <SideMenuBtn
      onClick={() => {
        setIsCenter(!isCenter);
      }}
      className={isCenter && " disabled"}
      Icon={AdjustIcon}
    />
  );
};

export default CenterMapBtn;
