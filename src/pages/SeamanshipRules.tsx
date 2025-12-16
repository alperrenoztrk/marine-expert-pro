import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Scale, Shield, FileText, Anchor } from "lucide-react";

const seamanshipRules = [
  {
    title: "COLREG Kısım B - Manevra Kuralları",
    icon: Anchor,
    rules: [
      "Kural 5: Her zaman uygun gözcülük yapılmalıdır.",
      "Kural 6: Güvenli hız ile seyredilmelidir.",
      "Kural 7: Çatışma riski doğru değerlendirilmelidir.",
      "Kural 8: Çatışmadan kaçınma eylemi zamanında ve belirgin olmalıdır.",
      "Kural 15-17: Yol hakkı ve manevra yükümlülükleri net uygulanmalıdır."
    ]
  },
  {
    title: "ISM Kodu",
    icon: FileText,
    rules: [
      "Safety Management System (SMS) uygulanmalıdır.",
      "Operasyonel risk değerlendirmesi zorunludur.",
      "Tüm operasyonlar dokümante edilmelidir.",
      "Near-miss raporlama sistemi aktif olmalıdır.",
      "Düzenli iç denetimler yapılmalıdır."
    ]
  },
  {
    title: "ISPS Kodu",
    icon: Shield,
    rules: [
      "Güvenlik seviyeleri (1, 2, 3) takip edilmelidir.",
      "Ship Security Plan (SSP) hazır olmalıdır.",
      "Güverte erişim kontrolleri uygulanmalıdır.",
      "Ziyaretçi ve yük kontrolleri yapılmalıdır.",
      "Declaration of Security (DOS) gerektiğinde düzenlenmelidir."
    ]
  },
  {
    title: "Liman ve Terminal Talimatları",
    icon: Scale,
    rules: [
      "Port Information Book kontrol edilmelidir.",
      "Yerel pilotaj ve römorkaj gereklilikleri uygulanmalıdır.",
      "Terminal prosedürleri ve güvenlik kuralları takip edilmelidir.",
      "VTS raporlama gereklilikleri yerine getirilmelidir.",
      "Çevresel kısıtlamalar dikkate alınmalıdır."
    ]
  }
];

export default function SeamanshipRulesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
<div className="text-sm text-muted-foreground flex items-center gap-2">
            <Scale className="h-4 w-4" />
            Gemicilik Kuralları
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
            Gemicilik Kuralları
          </h1>
          <p className="text-muted-foreground mt-2">
            COLREG, ISM, ISPS ve liman talimatları
          </p>
        </div>

        <div className="grid gap-6">
          {seamanshipRules.map((section, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <section.icon className="h-5 w-5 text-emerald-600" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.rules.map((rule, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">▸</span>
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
