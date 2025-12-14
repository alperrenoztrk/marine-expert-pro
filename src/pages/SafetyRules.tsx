import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Scale, Shield, Flame, LifeBuoy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const safetyRules = [
  {
    title: "SOLAS Bölüm II-2 - Yangın Güvenliği",
    icon: Flame,
    rules: [
      "Yangın algılama ve alarm sistemleri zorunludur.",
      "Yangın söndürme sistemleri (FFA) eksiksiz olmalıdır.",
      "Yangın kapıları ve bölmeleri düzenli kontrol edilmelidir.",
      "Yangın planları görünür yerlerde asılı olmalıdır.",
      "Yangın söndürücüler düzenli bakımdan geçirilmelidir."
    ]
  },
  {
    title: "LSA Kodu - Can Kurtarma Donanımları",
    icon: LifeBuoy,
    rules: [
      "Can salları ve filikalar düzenli servis edilmelidir.",
      "Can yelekleri tüm personel için mevcut olmalıdır.",
      "EPIRB ve SART cihazları çalışır durumda olmalıdır.",
      "Acil durum pozisyon işaretleri (EPIRB) kayıtlı olmalıdır.",
      "Immersion suit ve thermal protective aid yeterli sayıda olmalıdır."
    ]
  },
  {
    title: "ISM Kodu",
    icon: Shield,
    rules: [
      "DOC (Document of Compliance) şirket için geçerli olmalıdır.",
      "SMC (Safety Management Certificate) gemi için geçerli olmalıdır.",
      "DPA (Designated Person Ashore) atanmış olmalıdır.",
      "Acil durum prosedürleri dokümante edilmelidir.",
      "İç denetimler yıllık olarak yapılmalıdır."
    ]
  },
  {
    title: "ISPS Kodu - Güvenlik",
    icon: Scale,
    rules: [
      "ISSC (International Ship Security Certificate) geçerli olmalıdır.",
      "SSP (Ship Security Plan) onaylı ve uygulanıyor olmalıdır.",
      "SSO (Ship Security Officer) atanmış olmalıdır.",
      "Güvenlik tatbikatları düzenli yapılmalıdır.",
      "Erişim kontrolleri ve ziyaretçi kayıtları tutulmalıdır."
    ]
  }
];

export default function SafetyRulesPage() {
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
            Emniyet Kuralları
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
            Emniyet Kuralları
          </h1>
          <p className="text-muted-foreground mt-2">
            SOLAS, LSA, FFA ve ulusal otorite gereklilikleri
          </p>
        </div>

        <div className="grid gap-6">
          {safetyRules.map((section, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <section.icon className="h-5 w-5 text-rose-600" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.rules.map((rule, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-rose-500 mt-1">▸</span>
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
