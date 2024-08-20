import { createContext, useState } from "react";

export const EpiphanyContext = createContext(null);

export const EpiphanyProvider = ({ children }) => {
  // Стейт для определения пользовался ли пользователь прозрением
  const [isEpiphany, setIsEpiphany] = useState(false);

  return <EpiphanyContext.Provider value={{ isEpiphany, setIsEpiphany }}>{children}</EpiphanyContext.Provider>;
};
