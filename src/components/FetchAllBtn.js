import LoopIcon from "@mui/icons-material/Loop";

const FetchAllBtn = ({ isFetchingAllPlanes, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`icon-frame${isFetchingAllPlanes ? " disabled" : ""}`}
    >
      <LoopIcon fontSize="large" alt="f" />
    </div>
  );
};

export default FetchAllBtn;
