import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Scale, FileText, Shield, CloudSun } from "lucide-react";
import { useNavigate } from "react-router-dom";

const meteorologyRules = [
  {
    title: "SOLAS V/34 - Voyage Planning",
    icon: FileText,
    rules: [
      "Seyir planı hazırlanırken güncel meteorolojik veri kullanılmalıdır.",
      "Hava tahminleri ve routing önerileri dikkate alınmalıdır.",
      "Şiddetli hava koşulları için alternatif rotalar planlanmalıdır.",
      "Meteorolojik veriler ve tahminler voyage plan dosyasında saklanmalıdır."
    ]
  },
  {
    title: "IMO Weather Routing Guidelines",
    icon: CloudSun,
    rules: [
      "Şiddetli hava beklenen rotalarda kaçınma planı şarttır.",
      "Weather routing servisleri kullanılmalıdır.",
      "Rota seçiminde yük güvenliği ve yakıt ekonomisi dengelenmelidir.",
      "500 nm kuralı: Tropik siklon 500 nm içindeyse rota değişikliği değerlendirilmelidir."
    ]
  },
  {
    title: "STCW VIII/2 - Watchkeeping",
    icon: Shield,
    rules: [
      "Köprüüstü vardiya zabitleri meteorolojik veriyi sürekli değerlendirmelidir.",
      "Hava değişiklikleri vardiya defterine kaydedilmelidir.",
      "Kaptana hava koşulları hakkında düzenli bilgi verilmelidir.",
      "Görüş mesafesi azaldığında uygun önlemler alınmalıdır."
    ]
  },
  {
    title: "WMO Denizcilik Servisleri",
    icon: Scale,
    rules: [
      "NAVTEX uyarıları takip edilmelidir.",
      "Gale warnings ve storm warnings ciddiye alınmalıdır.",
      "Meteorolojik NAVAREA bildirileri kontrol edilmelidir.",
      "Synoptic haritalar ve analiz grafikleri yorumlanmalıdır."
    ]
  }
];

export default function MeteorologyRulesPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/calculations");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="gap-2" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
            Geri Dön
          </Button>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Scale className="h-4 w-4" />
            Meteoroloji Kuralları
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Meteoroloji Kuralları
          </h1>
          <p className="text-muted-foreground mt-2">
            SOLAS V/34, STCW VIII/2 ve WMO prosedürleri
          </p>
        </div>

        <div className="grid gap-6">
          {meteorologyRules.map((section, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <section.icon className="h-5 w-5 text-sky-600" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.rules.map((rule, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-sky-500 mt-1">▸</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
