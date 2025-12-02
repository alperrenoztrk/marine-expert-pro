import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SelectedLocation = {
  latitude: number;
  longitude: number;
  locationLabel: string;
} | null;

type LocationContextType = {
  selectedLocation: SelectedLocation;
  setSelectedLocation: (location: SelectedLocation) => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocationState] = useState<SelectedLocation>(() => {
    // localStorage'dan başlangıç değerini al
    try {
      const stored = localStorage.getItem('selectedLocation');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setSelectedLocation = (location: SelectedLocation) => {
    setSelectedLocationState(location);
    // localStorage'a kaydet
    if (location) {
      localStorage.setItem('selectedLocation', JSON.stringify(location));
    } else {
      localStorage.removeItem('selectedLocation');
    }
  };

  return (
    <LocationContext.Provider value={{ selectedLocation, setSelectedLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
