import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Anchor, Waves, Wind, Shield, AlertTriangle, Activity, Ship, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {calculationMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="outline"
              className="h-auto py-6 px-6 justify-between gap-3 group hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={() => navigate(item.path)}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-6 w-6 shrink-0" />
                <span className="text-sm font-medium text-left">{item.label}</span>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Button>
          );
        })}
      </div>
    </div>
  );
};
