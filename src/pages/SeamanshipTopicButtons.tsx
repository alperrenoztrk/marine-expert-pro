import React from 'react';
import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Anchor, Waves, Wind, LifeBuoy, Ruler, Wrench, BookOpen, Ship } from "lucide-react";

export default function SeamanshipTopicButtons() {
  const topics = [
    { to: "/seamanship/topics#anchoring", icon: <Anchor className="h-4 w-4" />, label: "Demirleme" },
    { to: "/seamanship/topics#mooring", icon: <Waves className="h-4 w-4" />, label: "Halat ve Bağlama" },
    { to: "/seamanship/topics#heavy-weather", icon: <Wind className="h-4 w-4" />, label: "Fırtına Manevraları" },
    { to: "/seamanship/topics#lifesaving", icon: <LifeBuoy className="h-4 w-4" />, label: "Can Kurtarma (MOB)" },
    { to: "/seamanship/topics#deck-maintenance", icon: <Ruler className="h-4 w-4" />, label: "Güverte İşleri" },
    { to: "/seamanship/topics#watchkeeping", icon: <Wrench className="h-4 w-4" />, label: "Günlük Operasyonlar" },
    { to: "/seamanship/topics#pilot-ladder", icon: <Ship className="h-4 w-4" />, label: "Pilot Çarmıhı" },
  ];

  return (
    <MobileLayout>
      <div className="min-h-screen bg-white">
        <div className="space-y-6 max-w-5xl mx-auto px-6 py-10" data-no-translate>
          <div className="flex items-center justify-between mb-8">
            <Link to="/seamanship-menu">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Gemicilik
              </Button>
            </Link>
          </div>

          <div className="text-center space-y-3 mb-6">
            <h1 className="text-5xl font-bold text-blue-600">Gemicilik Konu Anlatımı</h1>
            <p className="text-sm text-gray-600">
              Ana başlıkları seçerek ilgili konuya geçin.
            </p>
          </div>

          <div className="space-y-6">
            {topics.map((it) => (
              <Link key={it.label} to={it.to}>
                <div className="block rounded-2xl border border-blue-200 p-6 bg-white transition-all duration-300 shadow-lg">
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      {React.cloneElement(it.icon as React.ReactElement, { className: "w-12 h-12 text-blue-600", strokeWidth: 1.5 })}
                    </div>
                    <div className="flex-1">
                      <span className="text-2xl font-bold text-blue-600">{it.label}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
