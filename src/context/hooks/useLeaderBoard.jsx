import { useContext } from "react";
import { LeaderBoardContext } from "../LeaderBoardContext";

export const useLeaderBoardContext = () => {
  return useContext(LeaderBoardContext);
};
