import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, AlertTriangle, Flame } from "lucide-react";

export default function SafetyMenu() {
  const items = [
    { to: "/safety", icon: <Shield className="h-4 w-4" />, label: "Risk Değerlendirme" },
    { to: "/safety", icon: <AlertTriangle className="h-4 w-4" />, label: "Acil Durum" },
    { to: "/safety", icon: <Flame className="h-4 w-4" />, label: "Yangın" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        {/* Back button */}
        <div className="mb-8">
          <Link to="/calculations">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Geri
            </Button>
          </Link>
        </div>

        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-5xl font-bold text-blue-600 text-center">Güvenlik Hesaplamaları</h1>
        </div>

        {/* Menu items */}
        <div className="space-y-6">
          {items.map((it) => (
            <Link
              key={it.label}
              to={it.to}
              className="block rounded-2xl border border-blue-200 p-6 bg-white transition-all duration-300 shadow-lg"
            >
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  {React.cloneElement(it.icon as React.ReactElement, { className: "w-12 h-12 text-blue-600", strokeWidth: 1.5 })}
                </div>
                <div className="flex-1">
                  <span className="text-2xl font-bold text-blue-600">{it.label}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
