import { createContext, useState } from "react";

export const SimpleModeContext = createContext(null);

export function SimpleModeProvider({ children }) {
  const [simpleMode, setSimpleMode] = useState(false);

  const toggleSimpleMode = () => {
    setSimpleMode(prevState => !prevState);
  };

  return <SimpleModeContext.Provider value={{ simpleMode, toggleSimpleMode }}>{children}</SimpleModeContext.Provider>;
}
