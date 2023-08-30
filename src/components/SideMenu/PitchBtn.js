import MapIcon from "@mui/icons-material/Map";
import SideMenuBtn from "./SideMenuBtn";

const PitchBtn = ({ pitch, setPitch }) => {
  return (
    <SideMenuBtn onClick={() => setPitch(pitch != 0 ? 0 : 40)} Icon={MapIcon} />
  );
};

export default PitchBtn;
