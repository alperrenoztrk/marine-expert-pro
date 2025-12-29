import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sigma, Flame, Droplets, Wind } from "lucide-react";

const safetyFormulas = [
  {
    title: "Köpük Çözeltisi Miktarı",
    icon: Droplets,
    formula: "Q = Uygulama Hızı × Alan × Süre",
    variables: [
      "Q: Gerekli köpük miktarı (litre)",
      "Uygulama Hızı: 6.5 L/m²/dk (makine dairesi)",
      "Uygulama Hızı: 4.0 L/m²/dk (güverte)",
      "Alan: Korunan alan (m²)",
      "Süre: Uygulama süresi (dk)"
    ],
    note: "SOLAS ve FSS Code'a göre minimum uygulama süreleri belirlenmiştir."
  },
  {
    title: "CO₂ Miktarı",
    icon: Wind,
    formula: "M = 1.5 × V × (ρ_gas / ρ_liq)",
    variables: [
      "M: Gerekli CO₂ miktarı (kg)",
      "V: Korunan hacim (m³)",
      "ρ_gas ≈ 1.84 kg/m³ (20°C'de)",
      "ρ_liq ≈ 770 kg/m³ (15°C'de)"
    ],
    note: "Pratik: Makine dairesi için hacmin %40'ı × 1.5 kg/m³"
  },
  {
    title: "Su Sisi Debisi",
    icon: Droplets,
    formula: "Q = K × √P",
    variables: [
      "Q: Debi (L/dk)",
      "K: Nozzle faktörü",
      "P: Basınç (bar)"
    ],
    note: "K değeri nozzle tipine göre üretici kataloglarından alınır."
  },
  {
    title: "Yangın Suyu Kapasitesi",
    icon: Flame,
    formula: "Kapasite = Q × t × n",
    variables: [
      "Q: Her bir hidrant debisi (m³/h)",
      "t: Minimum çalışma süresi (saat)",
      "n: Eşzamanlı çalışan hidrant sayısı"
    ],
    note: "SOLAS II-2 gerekliliklerine göre hesaplanır."
  },
  {
    title: "Kaçış Süresi Hesabı",
    icon: Wind,
    formula: "t = L / v",
    variables: [
      "t: Kaçış süresi (dakika)",
      "L: Kaçış yolu uzunluğu (m)",
      "v: Yürüyüş hızı (tipik 1.2 m/s)"
    ],
    note: "Engelli personel için hız düşürülerek hesaplanmalıdır."
  },
  {
    title: "Risk Matrisi Skoru",
    icon: Flame,
    formula: "Risk = Olasılık × Şiddet",
    variables: [
      "Olasılık: 1-5 (Nadir - Çok Sık)",
      "Şiddet: 1-5 (Önemsiz - Felaket)",
      "Risk Skoru: 1-25"
    ],
    note: "15+ = Yüksek Risk, 8-14 = Orta Risk, 1-7 = Düşük Risk"
  }
];

export default function SafetyFormulasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
<div className="text-sm text-muted-foreground flex items-center gap-2">
            <Sigma className="h-4 w-4" />
            Emniyet Formülleri
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
            Emniyet Formülleri
          </h1>
          <p className="text-muted-foreground mt-2">
            Yangın söndürme, köpük ve CO₂ miktar hesapları
          </p>
        </div>

        <div className="grid gap-6">
          {safetyFormulas.map((formula, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <formula.icon className="h-5 w-5 text-rose-600" />
                  {formula.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <pre className="font-mono text-sm sm:text-lg text-left whitespace-pre-wrap break-words leading-relaxed">
                    {formula.formula}
                  </pre>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Değişkenler:</p>
                  <ul className="space-y-1">
                    {formula.variables.map((variable, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-rose-500 mt-1">•</span>
                        {variable}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground italic">{formula.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
