import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Link } from "react-router-dom";
import { ArrowLeft, Anchor, Waves, Wind, LifeBuoy, Ruler, Wrench, Ship } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="space-y-6 max-w-5xl mx-auto px-6 py-10" data-no-translate>
          <div className="flex items-center justify-between mb-8">
            <Link to="/seamanship-menu">
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-white/50 dark:hover:bg-slate-900/40">
                <ArrowLeft className="h-4 w-4" />
                Gemicilik
              </Button>
            </Link>
          </div>

          <div className="text-center space-y-3 mb-6">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              Gemicilik Konu Anlatımı
            </h1>
            <p className="text-sm text-muted-foreground">
              Ana başlıkları seçerek ilgili konuya geçin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((item, index) => (
              <IconButton
                key={item.label}
                to={item.to}
                icon={item.icon}
                label={item.label}
                variant="primary"
                animationDelay={index * 80}
              />
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
