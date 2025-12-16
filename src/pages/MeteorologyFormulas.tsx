import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sigma, Wind, Waves, Thermometer, CloudRain } from "lucide-react";

const meteorologyFormulas = [
  {
    title: "Gerçek Rüzgâr Hızı",
    icon: Wind,
    formula: "V⃗t = V⃗a + V⃗g  ⇒  |Vt| = √(Va² + Vg² + 2·Va·Vg·cos(θ))",
    variables: [
      "Va: Görünür (apparent) rüzgâr hızı",
      "Vg: Gemi hızı",
      "θ: Va vektörü ile gemi hız vektörü arasındaki açı"
    ],
    note: "Not: Tanımlar vektörel olmalı. Eğer θ ‘göreli rüzgârın geldiği yön’ gibi farklı bir referansa göre ölçülürse işaret değişebilir; en güvenlisi V⃗t = V⃗a + V⃗g vektör bağıntısını kullanmaktır."
  },
  {
    title: "Hava Yoğunluğu",
    icon: Thermometer,
    formula: "ρ = P / (R · T)",
    variables: [
      "ρ: Hava yoğunluğu (kg/m³)",
      "P: Atmosfer basıncı (Pa)",
      "R: Özgül gaz sabiti = 287 J/kg·K",
      "T: Mutlak sıcaklık (Kelvin)"
    ],
    note: "Standart koşullarda (15°C, 1013.25 hPa) ρ ≈ 1.225 kg/m³"
  },
  {
    title: "Derin Su Dalgaboyu",
    icon: Waves,
    formula: "L = (g · T²) / (2π)",
    variables: [
      "L: Dalgaboyu (m)",
      "g: Yerçekimi ivmesi = 9.81 m/s²",
      "T: Dalga periyodu (s)",
      "π ≈ 3.14159"
    ],
    note: "Derin su: Derinlik > L/2"
  },
  {
    title: "Dalga Hızı (Derin Su)",
    icon: Waves,
    formula: "C = L / T = (g · T) / (2π) ≈ 1.56 · T",
    variables: [
      "C: Dalga hızı (m/s)",
      "L: Dalgaboyu (m)",
      "T: Dalga periyodu (s)"
    ],
    note: "Knot cinsinden: C (kn) ≈ 3.03 · T"
  },
  {
    title: "Beaufort Rüzgâr Hızı",
    icon: Wind,
    formula: "V = 0.836 · B^1.5",
    variables: [
      "V: Rüzgâr hızı (m/s)",
      "B: Beaufort sayısı (0-12)"
    ],
    note: "Yaklaşık formül. Beaufort 8 (Gale) ≈ 34-40 knot"
  },
  {
    title: "Çiğ Noktası Sıcaklığı",
    icon: CloudRain,
    formula: "Td ≈ T - ((100 - RH) / 5)",
    variables: [
      "Td: Çiğ noktası sıcaklığı (°C)",
      "T: Hava sıcaklığı (°C)",
      "RH: Bağıl nem (%)"
    ],
    note: "Basit yaklaşım formülü. Sis riski: T - Td < 2.5°C"
  },
  {
    title: "Deniz Seviyesine İndirgenmiş Basınç",
    icon: Thermometer,
    formula: "P₀ = P · e^( (g·h) / (R·T̄) )",
    variables: [
      "P₀: Deniz seviyesi basıncı",
      "P: Ölçülen basınç",
      "h: Yükseklik (m)",
      "T̄: Ortalama sıcaklık (K)"
    ],
    note: "Yaklaşık: Her 8 m yükseklik için 1 hPa düşüş"
  }
];

export default function MeteorologyFormulasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-end">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Sigma className="h-4 w-4" />
            Meteoroloji Formülleri
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Meteoroloji Formülleri
          </h1>
          <p className="text-muted-foreground mt-2">
            Rüzgâr, dalga ve atmosfer denklemleri
          </p>
        </div>

        <div className="grid gap-6">
          {meteorologyFormulas.map((formula, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <formula.icon className="h-5 w-5 text-sky-600" />
                  {formula.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <pre className="font-mono text-lg text-center">{formula.formula}</pre>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Değişkenler:</p>
                  <ul className="space-y-1">
                    {formula.variables.map((variable, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-sky-500 mt-1">•</span>
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
