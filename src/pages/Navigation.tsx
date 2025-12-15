import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, Calculator, Sigma, FileText } from "lucide-react";
import { Link } from "react-router-dom";

type CalcItem = { id: string; title: string; subtitle?: string };

const calcItems: CalcItem[] = [
  { id: "gc", title: "Büyük Daire (Great Circle)", subtitle: "En kısa rota ve ilk kerteriz" },
  { id: "rhumb", title: "Rhumb Line (Mercator)", subtitle: "Sabit kerterizli rota" },
  { id: "plane", title: "Plane Sailing", subtitle: "dLat, Dep, mesafe ve kurs" },
  { id: "eta", title: "Zaman ve ETA", subtitle: "Süre ve varış zamanı" },
  { id: "current", title: "Akıntı Üçgeni (CTS)", subtitle: "Steer course ve SOG" },
  { id: "compass", title: "Pusula Dönüşümleri", subtitle: "Var, Dev, toplam hata" },
  { id: "cpa", title: "CPA / TCPA", subtitle: "En yakın yaklaşma analizi" },
  { id: "sight", title: "Sight Reduction", subtitle: "Hc ve azimut" },
  { id: "bearings", title: "Kerteriz Hesaplamaları", subtitle: "Doubling/Four/Seven point" },
  { id: "distance", title: "Mesafe Hesaplamaları", subtitle: "Ufuk, radar, ışık" },
  { id: "tides", title: "Gelgit Hesaplamaları", subtitle: "Twelfths kuralı yükseklik" },
  { id: "turning", title: "Dönüş Hesaplamaları", subtitle: "Advance, transfer, ROT" },
  { id: "weather", title: "Hava Durumu", subtitle: "Rüzgar, dalga, leeway" },
  { id: "celestial", title: "Göksel Navigasyon", subtitle: "Meridian, amplitude, sunrise" },
  { id: "emergency", title: "Acil Durum", subtitle: "Square/Sector search" },
];

const Navigation = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-primary">
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
        <div className="space-y-6">
          {calcItems.map((it) => (
            <Link key={it.id} to={`/navigation/calc/${it.id}`}>
              <div className="block rounded-2xl border border-border p-6 bg-card transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0">
                    <Calculator className="w-12 h-12 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <span className="text-2xl font-bold text-primary">{it.title}</span>
                    {it.subtitle && (
                      <p className="text-sm text-muted-foreground mt-1">{it.subtitle}</p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
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