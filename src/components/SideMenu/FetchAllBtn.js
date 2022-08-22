import LoopIcon from "@mui/icons-material/Loop";
import SideMenuBtn from "./SideMenuBtn";

const FetchAllBtn = ({ isFetchingAllPlanes, onClick }) => {
  return (
    <SideMenuBtn
      onClick={onClick}
      className={isFetchingAllPlanes && "disabled"}
      Icon={LoopIcon}
    />
  );
};

export default FetchAllBtn;
