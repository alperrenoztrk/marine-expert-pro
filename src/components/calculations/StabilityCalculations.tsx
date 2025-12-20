import { CalculationGrid, type CalculationGridItem } from "@/components/ui/calculation-grid";
import { Anchor, Waves, Wind, Shield, AlertTriangle, Activity } from "lucide-react";
import React from "react";

export const StabilityCalculations = () => {
  const calculationMenuItems: CalculationGridItem[] = [
    { id: "grain", title: "Tahıl Hesabı", icon: Anchor, to: "/stability/grain-calculation" },
    { id: "gz-curve", title: "GZ Eğrisi ve Stabilite Kolu", icon: Activity, to: "/stability/gz-curve" },
    { id: "free-surface", title: "Free Surface Effect", icon: Waves, to: "/stability/free-surface" },
    { id: "wind-weather", title: "Wind and Weather Stability", icon: Wind, to: "/stability/wind-weather" },
    { id: "imo-criteria", title: "IMO Stability Criteria", icon: Shield, to: "/stability/imo-criteria" },
    { id: "shear-bending", title: "Shear Force & Bending Moment", icon: AlertTriangle, to: "/stability/shearing-bending" },
  ];

  return (
    <CalculationGrid items={calculationMenuItems} />
  );
};
