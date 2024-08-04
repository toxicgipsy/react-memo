import { useContext } from "react";
import { SimpleModeContext } from "../SimpleModeContext";

export const useSimpleModeContext = () => {
  return useContext(SimpleModeContext);
};
