import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Anchor, Waves, Wind, Shield, AlertTriangle, Activity, Ship, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";

export const StabilityCalculations = () => {
  const navigate = useNavigate();

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
    <div className="space-y-6">
      {calculationMenuItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            onClick={() => navigate(item.path)}
            className="block rounded-2xl border border-blue-200 p-6 bg-white transition-all duration-300 shadow-lg cursor-pointer"
          >
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <Icon className="w-12 h-12 text-blue-600" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <span className="text-2xl font-bold text-blue-600">{item.label}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
