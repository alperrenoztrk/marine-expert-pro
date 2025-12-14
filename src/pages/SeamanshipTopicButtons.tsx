import React from 'react';
import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Link } from "react-router-dom";
import { ArrowLeft, Anchor, Waves, Wind, LifeBuoy, Ruler, Wrench, BookOpen, Ship } from "lucide-react";

export default function SeamanshipTopicButtons() {
  const topics = [
    { to: "/seamanship/topics#anchoring", icon: Anchor, label: "Demirleme" },
    { to: "/seamanship/topics#mooring", icon: Waves, label: "Halat ve Bağlama" },
    { to: "/seamanship/topics#heavy-weather", icon: Wind, label: "Fırtına Manevraları" },
    { to: "/seamanship/topics#lifesaving", icon: LifeBuoy, label: "Can Kurtarma (MOB)" },
    { to: "/seamanship/topics#deck-maintenance", icon: Ruler, label: "Güverte İşleri" },
    { to: "/seamanship/topics#watchkeeping", icon: Wrench, label: "Günlük Operasyonlar" },
    { to: "/seamanship/topics#pilot-ladder", icon: Ship, label: "Pilot Çarmıhı" },
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
              <IconButton key={it.label} to={it.to} icon={it.icon} label={it.label} variant="emerald" />
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
