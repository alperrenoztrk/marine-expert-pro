import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Anchor, LifeBuoy, Ruler, Wind, Waves, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SeamanshipMenu() {
  const items = [
    { to: "/empty-page", icon: <Anchor className="h-4 w-4" />, label: "Demirleme" },
    { to: "/empty-page", icon: <Waves className="h-4 w-4" />, label: "Halat ve Bağlama" },
    { to: "/empty-page", icon: <Wind className="h-4 w-4" />, label: "Fırtına Manevraları" },
    { to: "/empty-page", icon: <LifeBuoy className="h-4 w-4" />, label: "Can Kurtarma (MOB)" },
    { to: "/empty-page", icon: <Ruler className="h-4 w-4" />, label: "Güverte İşleri" },
    { to: "/empty-page", icon: <Wrench className="h-4 w-4" />, label: "Günlük Operasyonlar" },
  ];

  return (
    <div key="seamanship-menu-v1" className="relative min-h-screen overflow-hidden" data-no-translate>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-dark via-primary to-primary-light" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Link to="/calculations">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Geri
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-5xl font-bold text-blue-700 dark:text-blue-400 drop-shadow-sm text-center">Gemicilik</h1>
        </div>

        <div className="space-y-6">
          {items.map((it) => (
            <Link
              key={it.label}
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

