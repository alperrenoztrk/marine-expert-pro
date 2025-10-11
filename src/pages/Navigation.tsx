import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, Calculator, Sigma, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";

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
          <div className="min-h-screen bg-white dark:bg-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Back Button */}
        <div className="flex items-center gap-3">
          <BackButton />
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Compass className="h-12 w-12 text-blue-600 dark:text-blue-400 nature-icon" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent nature-title">
              <span data-translatable>Seyir Hesaplamaları</span>
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {calcItems.map((it) => (
            <Link key={it.id} to={`/navigation/calc/${it.id}`} className="group">
              <Card className="transition hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calculator className="h-4 w-4 text-blue-600" /> {it.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {it.subtitle}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Her hesaplama artık ayrı bir sayfada açılır
        </div>
      </div>
    </div>
  );
};

export default Navigation;