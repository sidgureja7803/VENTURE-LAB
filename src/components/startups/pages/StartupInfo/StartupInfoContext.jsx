import React, { createContext, useContext, useState } from "react";

const StartupInfoContext = createContext();

export const useStartupInfo = () => useContext(StartupInfoContext);

export const StartupInfoProvider = ({ children }) => {
  const [startupInfo, setStartupInfo] = useState(null);

  return (
    <StartupInfoContext.Provider value={{ startupInfo, setStartupInfo }}>
      {children}
    </StartupInfoContext.Provider>
  );
};