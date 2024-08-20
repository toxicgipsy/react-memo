import { useContext } from "react";
import { EpiphanyContext } from "../EpiphanyContext";

export const useEpiphanyContext = () => {
  return useContext(EpiphanyContext);
};
