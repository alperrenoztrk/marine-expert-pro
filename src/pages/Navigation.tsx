import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Calculator, Sigma, FileText, Globe, Ship, Compass, Clock, Navigation2, Target, Eye, Anchor, Ruler, Waves, Sun, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const calcItems = [
  { id: "gc", title: "Büyük Daire (Great Circle)", subtitle: "En kısa rota ve ilk kerteriz", icon: Globe },
  { id: "rhumb", title: "Rhumb Line (Mercator)", subtitle: "Sabit kerterizli rota", icon: Ship },
  { id: "plane", title: "Plane Sailing", subtitle: "dLat, Dep, mesafe ve kurs", icon: Navigation2 },
  { id: "eta", title: "Zaman ve ETA", subtitle: "Süre ve varış zamanı", icon: Clock },
  { id: "current", title: "Akıntı Üçgeni (CTS)", subtitle: "Steer course ve SOG", icon: Waves },
  { id: "compass", title: "Pusula Dönüşümleri", subtitle: "Var, Dev, toplam hata", icon: Compass },
  { id: "cpa", title: "CPA / TCPA", subtitle: "En yakın yaklaşma analizi", icon: Target },
  { id: "sight", title: "Sight Reduction", subtitle: "Hc ve azimut", icon: Eye },
  { id: "bearings", title: "Kerteriz Hesaplamaları", subtitle: "Doubling/Four/Seven point", icon: Anchor },
  { id: "distance", title: "Mesafe Hesaplamaları", subtitle: "Ufuk, radar, ışık", icon: Ruler },
  { id: "tides", title: "Gelgit Hesaplamaları", subtitle: "Twelfths kuralı yükseklik", icon: Waves },
  { id: "turning", title: "Dönüş Hesaplamaları", subtitle: "Advance, transfer, ROT", icon: Navigation2 },
  { id: "weather", title: "Hava Durumu", subtitle: "Rüzgar, dalga, leeway", icon: Sun },
  { id: "celestial", title: "Göksel Navigasyon", subtitle: "Meridian, amplitude, sunrise", icon: Sun },
  { id: "emergency", title: "Acil Durum", subtitle: "Square/Sector search", icon: AlertTriangle },
];

const Navigation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
            <span data-translatable>Seyir Hesaplamaları</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Mesafe, hız, rota, konum ve zaman hesaplamalarınızı yapın
          </p>
          <div className="flex items-center justify-center gap-2">
            <Link to="/navigation/formulas">
              <Button variant="secondary" size="sm" className="gap-2">
                <Sigma className="h-4 w-4" />
                Formüller
              </Button>
            </Link>
            <Link to="/navigation/topics">
              <Button variant="default" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                Konu Anlatımı
              </Button>
            </Link>
          </div>
        </div>

        {/* Per-calculation links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {calcItems.map((item, index) => (
            <IconButton
              key={item.id}
              to={`/navigation/calc/${item.id}`}
              icon={item.icon}
              label={item.title}
              description={item.subtitle}
              variant="primary"
              animationDelay={index * 50}
            />
          ))}
        </div>

        {/* Info */}
        <div className="text-center text-sm text-muted-foreground">
          Her hesaplama artık ayrı bir sayfada açılır
        </div>
      </div>
    </div>
  );
};

export default Navigation;