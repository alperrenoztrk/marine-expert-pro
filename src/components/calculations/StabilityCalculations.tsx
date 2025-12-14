import { IconButton } from "@/components/ui/icon-button";
import { Anchor, Waves, Wind, Shield, AlertTriangle, Activity, Ship } from "lucide-react";
import React from "react";

export const StabilityCalculations = () => {
  const calculationMenuItems = [
    { id: "grain", label: "Tahıl Hesabı", icon: Anchor, path: "/stability/grain-calculation" },
    { id: "gz-curve", label: "GZ Eğrisi ve Stabilite Kolu", icon: Activity, path: "/stability/gz-curve" },
    { id: "free-surface", label: "Free Surface Effect", icon: Waves, path: "/stability/free-surface" },
    { id: "wind-weather", label: "Wind and Weather Stability", icon: Wind, path: "/stability/wind-weather" },
    { id: "imo-criteria", label: "IMO Stability Criteria", icon: Shield, path: "/stability/imo-criteria" },
    { id: "shear-bending", label: "Shear Force & Bending Moment", icon: AlertTriangle, path: "/stability/shearing-bending" },
    { id: "damage", label: "Damage Stability", icon: Ship, path: "/stability/damage" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {calculationMenuItems.map((item, index) => (
        <IconButton
          key={item.id}
          to={item.path}
          icon={item.icon}
          label={item.label}
          variant="primary"
          animationDelay={index * 100}
        />
      ))}
    </div>
  );
};
