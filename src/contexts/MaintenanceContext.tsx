import React, { createContext, useContext, useState } from 'react';

interface MaintenanceContextType {
  isMaintenance: boolean;
  setMaintenance: (status: boolean) => void;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(
  undefined,
);

export const MaintenanceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isMaintenance, setIsMaintenance] = useState(false);

  return (
    <MaintenanceContext.Provider
      value={{ isMaintenance, setMaintenance: setIsMaintenance }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (!context) throw new Error('MaintenanceProvider 안에서 사용해야 합니다.');
  return context;
};
