import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Scale, AlertTriangle, FileText, Ship } from "lucide-react";

const cargoRules = [
  {
    title: "IMSBC Kodu",
    icon: FileText,
    rules: [
      "Transportable Moisture Limit (TML) ve Flow Moisture Point (FMP) kontrolleri zorunludur.",
      "Kargo sınıflandırması (A, B, C grupları) doğru yapılmalıdır.",
      "Özel taşıma şartları ve tehlikeli özellikler dikkate alınmalıdır.",
      "Shipper's Declaration ve sertifikalar eksiksiz olmalıdır."
    ]
  },
  {
    title: "International Grain Code",
    icon: Ship,
    rules: [
      "Grain Stability: GM ≥ 0.30 m (düzeltilmiş)",
      "Heeling angle ≤ 12° (statik)",
      "GZ eğrisi altındaki alan ≥ 0.075 m·rad",
      "Serbest yüzey düzeltmeleri uygulanmalıdır."
    ]
  },
  {
    title: "ISGOTT & Terminal Prosedürleri",
    icon: AlertTriangle,
    rules: [
      "Gaz ölçümleri manifold açılmadan önce yapılmalıdır.",
      "Sıcak iş izinleri terminal koordinasyonuyla verilmelidir.",
      "Manifold bağlantıları ve güvenlik ekipmanları kontrol edilmelidir.",
      "Emergency shutdown prosedürleri hazır olmalıdır."
    ]
  },
  {
    title: "SOLAS Gereklilikleri",
    icon: Scale,
    rules: [
      "VGM (Verified Gross Mass) konteyner yüklemelerinde zorunludur.",
      "Cargo Securing Manual gereklilikleri karşılanmalıdır.",
      "Stability booklet limitleri aşılmamalıdır.",
      "Dangerous goods deklarasyonları eksiksiz olmalıdır."
    ]
  }
];

export default function CargoRulesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
<div className="text-sm text-muted-foreground flex items-center gap-2">
            <Scale className="h-4 w-4" />
            Kargo Kuralları
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
            Kargo & Operasyon Kuralları
          </h1>
          <p className="text-muted-foreground mt-2">
            IMSBC, Grain Rules ve terminal prosedürleri
          </p>
        </div>

        <div className="grid gap-6">
          {cargoRules.map((section, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <section.icon className="h-5 w-5 text-amber-600" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.rules.map((rule, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-amber-500 mt-1">▸</span>
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
