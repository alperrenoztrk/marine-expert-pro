import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Anchor, LifeBuoy, Ruler, Wind, Waves, Wrench, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SeamanshipMenu() {
  const subItems = [
    { to: "/seamanship/topics#anchoring", icon: <Anchor className="h-4 w-4" />, label: "Demirleme" },
    { to: "/seamanship/topics#mooring", icon: <Waves className="h-4 w-4" />, label: "Halat ve Bağlama" },
    { to: "/seamanship/topics#heavy-weather", icon: <Wind className="h-4 w-4" />, label: "Fırtına Manevraları" },
    { to: "/seamanship/topics#lifesaving", icon: <LifeBuoy className="h-4 w-4" />, label: "Can Kurtarma (MOB)" },
    { to: "/seamanship/topics#deck-maintenance", icon: <Ruler className="h-4 w-4" />, label: "Güverte İşleri" },
    { to: "/seamanship/topics#watchkeeping", icon: <Wrench className="h-4 w-4" />, label: "Günlük Operasyonlar" },
    { to: "/seamanship/knots", icon: <Waves className="h-4 w-4" />, label: "Gemici Bağları (Animasyon)" },
  ];

  return (
    <div key="seamanship-menu-v2" className="relative min-h-screen overflow-hidden bg-white" data-no-translate>
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
          <h1 className="text-5xl font-bold text-blue-600 text-center">Gemicilik</h1>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-blue-200 p-6 bg-white transition-all duration-300 shadow-lg">
            <Link to="/seamanship/topics-menu" className="block">
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0">
                    <BookOpen className="w-12 h-12 text-blue-600" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-2xl font-bold text-blue-600">Konu Anlatımı</span>
                    <div className="text-xs text-gray-500">Gemicilik konularının tamamı bu bölümde</div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

