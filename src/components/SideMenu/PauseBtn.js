import PauseIcon from "@mui/icons-material/Pause";
import SideMenuBtn from "./SideMenuBtn";

const PauseBtn = () => {
  return (
    <SideMenuBtn
      onClick={()=>{alert("Paused!")}}
      Icon={PauseIcon}
    />
  );
};

export default PauseBtn;
