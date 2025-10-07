import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, FileText, Ship, AlertTriangle } from "lucide-react";

export default function SOLASMenu() {
  const items = [
    { to: "/solas/regulations", icon: <FileText className="h-4 w-4" />, label: "SOLAS Düzenlemeleri" },
    { to: "/solas/certificates", icon: <Shield className="h-4 w-4" />, label: "Sertifikalar" },
    { to: "/solas/ship-requirements", icon: <Ship className="h-4 w-4" />, label: "Gemi Gereksinimleri" },
    { to: "/solas/safety-equipment", icon: <AlertTriangle className="h-4 w-4" />, label: "Güvenlik Ekipmanları" },
  ];

  return (
    <div key="solas-menu-v1" className="relative min-h-screen overflow-hidden" data-no-translate>
      {/* Background to match the main menu styling */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-dark via-primary to-primary-light" />

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
          <h1 className="text-5xl font-bold text-blue-700 dark:text-blue-400 drop-shadow-sm text-center">SOLAS</h1>
          <p className="text-center text-lg text-blue-600 dark:text-blue-300 mt-2">Safety of Life at Sea</p>
        </div>

        {/* Menu items in card style */}
        <div className="space-y-6">
          {items.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              className="block rounded-2xl border border-white/30 p-6 bg-white/10 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  {React.cloneElement(it.icon as React.ReactElement, { className: "w-12 h-12 text-blue-700 drop-shadow-lg", strokeWidth: 1.5 })}
                </div>
                <div className="flex-1">
                  <span className="text-2xl font-bold text-blue-700 drop-shadow-sm">{it.label}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
