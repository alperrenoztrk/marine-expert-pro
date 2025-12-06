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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {calculationMenuItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            onClick={() => navigate(item.path)}
            className="group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm border border-white/60 p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 hover:bg-white cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-indigo-500/0 to-blue-600/0 group-hover:from-blue-500/5 group-hover:via-indigo-500/5 group-hover:to-blue-600/5 transition-all duration-500" />
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all duration-500" />
            
            <div className="relative flex items-center gap-6">
              <div className="flex-shrink-0 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-all duration-500" />
                <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Icon className="w-10 h-10 text-white" strokeWidth={2} />
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300">
                  {item.label}
                </h2>
              </div>

              <div className="flex-shrink-0 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </div>
        );
      })}
    </div>
  );
};
