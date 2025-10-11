import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Anchor, Waves, Wind, LifeBuoy, Ruler, Wrench, BookOpen } from "lucide-react";

export default function SeamanshipTopicButtons() {
  const topics = [
    { to: "/seamanship/topics#anchoring", icon: <Anchor className="h-4 w-4" />, label: "Demirleme" },
    { to: "/seamanship/topics#mooring", icon: <Waves className="h-4 w-4" />, label: "Halat ve Bağlama" },
    { to: "/seamanship/topics#heavy-weather", icon: <Wind className="h-4 w-4" />, label: "Fırtına Manevraları" },
    { to: "/seamanship/topics#lifesaving", icon: <LifeBuoy className="h-4 w-4" />, label: "Can Kurtarma (MOB)" },
    { to: "/seamanship/topics#deck-maintenance", icon: <Ruler className="h-4 w-4" />, label: "Güverte İşleri" },
    { to: "/seamanship/topics#watchkeeping", icon: <Wrench className="h-4 w-4" />, label: "Günlük Operasyonlar" },
  ];

  return (
    <MobileLayout>
      <div className="space-y-6 max-w-3xl mx-auto" data-no-translate>
        <div className="flex items-center justify-between">
          <Link to="/seamanship-menu">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Gemicilik
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Konu Anlatımı
          </div>
        </div>

        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Anchor className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold">Gemicilik Konu Anlatımı</h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Ana başlıkları seçerek ilgili konuya geçin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {topics.map((it) => (
            <Link key={it.label} to={it.to}>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                {it.icon}
                {it.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
