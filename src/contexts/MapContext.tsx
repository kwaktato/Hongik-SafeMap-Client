import React, { createContext, useContext, useState } from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface MapContextType {
  lastCenter: Location | null;
  setLastCenter: (location: Location) => void;
  lastLevel: number;
  setLastLevel: (level: number) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const [lastCenter, setLastCenter] = useState<Location | null>(null);
  const [lastLevel, setLastLevel] = useState<number>(3);

  return (
    <MapContext.Provider
      value={{ lastCenter, setLastCenter, lastLevel, setLastLevel }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};
