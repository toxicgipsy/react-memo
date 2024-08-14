import { createContext, useState } from "react";

export const LeaderBoardContext = createContext(null);

export function LeaderBoardProvider({ children }) {
  const [leaderList, setLeaderList] = useState([]);

  return <LeaderBoardContext.Provider value={{ leaderList, setLeaderList }}>{children}</LeaderBoardContext.Provider>;
}
