import { createContext, useContext, useEffect, useState } from "react";

type Density = "comfortable" | "compact";

type DensityProviderProps = {
  children: React.ReactNode;
  defaultDensity?: Density;
  storageKey?: string;
};

type DensityProviderState = {
  density: Density;
  setDensity: (density: Density) => void;
  toggleDensity: () => void;
};

const initialState: DensityProviderState = {
  density: "comfortable",
  setDensity: () => null,
  toggleDensity: () => null,
};

const DensityProviderContext = createContext<DensityProviderState>(initialState);

export function DensityProvider({
  children,
  defaultDensity = "comfortable",
  storageKey = "maritime-ui-density",
  ...props
}: DensityProviderProps) {
  const [density, setDensityState] = useState<Density>(
    () => (localStorage.getItem(storageKey) as Density) || defaultDensity
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("density-compact");
    if (density === "compact") {
      root.classList.add("density-compact");
    }
  }, [density]);

  const setDensity = (d: Density) => {
    localStorage.setItem(storageKey, d);
    setDensityState(d);
  };

  const toggleDensity = () => {
    setDensity(density === "compact" ? "comfortable" : "compact");
  };

  const value: DensityProviderState = {
    density,
    setDensity,
    toggleDensity,
  };

  return (
    <DensityProviderContext.Provider {...props} value={value}>
      {children}
    </DensityProviderContext.Provider>
  );
}

export const useDensity = () => {
  const context = useContext(DensityProviderContext);
  if (context === undefined)
    throw new Error("useDensity must be used within a DensityProvider");
  return context;
};

