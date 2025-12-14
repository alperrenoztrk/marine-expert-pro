import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sigma, Anchor, Wind, Ship } from "lucide-react";
import { useNavigate } from "react-router-dom";

const seamanshipFormulas = [
  {
    title: "Palamar Çalışma Yükü",
    icon: Anchor,
    formula: "Çalışma Yükü (kN) = (SWL × Güvenlik Katsayısı) / 1000",
    variables: [
      "SWL: Safe Working Load (kg)",
      "Güvenlik Katsayısı: 0.55 - 0.60 (standart)"
    ],
    note: "MBL (Minimum Breaking Load) = SWL / 0.55 yaklaşık değeri kullanılabilir."
  },
  {
    title: "Rüzgâr Kuvveti",
    icon: Wind,
    formula: "F = 0.613 × Cd × A × V²",
    variables: [
      "F: Kuvvet (N)",
      "Cd: Sürtünme katsayısı (tipik 1.0-1.3)",
      "A: Rüzgâra maruz cephe alanı (m²)",
      "V: Rüzgâr hızı (m/s)"
    ],
    note: "kN için sonucu 1000'e bölün."
  },
  {
    title: "Zincir Katenary Eğimi",
    icon: Ship,
    formula: "T = W × sinh(s / a)",
    variables: [
      "T: Zincir gerilimi",
      "W: Birim uzunluk ağırlığı (kg/m)",
      "s: Yatay mesafe",
      "a: Katenary parametresi"
    ],
    note: "Katenary analizi karmaşık hesap gerektirir; pratik için tablolar kullanılır."
  },
  {
    title: "Demir Tutma Kuvveti",
    icon: Anchor,
    formula: "Holding Power = Demir Ağırlığı × Tutma Katsayısı",
    variables: [
      "Demir Ağırlığı: kg",
      "Tutma Katsayısı: 2-12 (zemin tipine göre)"
    ],
    note: "Çamur: 2-4, Kum: 5-8, Kil: 6-12"
  },
  {
    title: "Römorkör Bollard Pull",
    icon: Ship,
    formula: "Gerekli BP = (Δ × V²) / K",
    variables: [
      "Δ: Gemi deplasmanı (ton)",
      "V: İstenen hız (knot)",
      "K: Katsayı (yaklaşık 1000-1500)"
    ],
    note: "Gerçek hesaplar direnci de içermelidir."
  },
  {
    title: "Scope Ratio",
    icon: Anchor,
    formula: "Scope = Zincir Uzunluğu / Su Derinliği",
    variables: [
      "Normal koşullar: 5:1 - 7:1",
      "Fırtına koşulları: 10:1 veya daha fazla"
    ],
    note: "Daha uzun scope = daha iyi tutma kuvveti"
  }
];

export default function SeamanshipFormulasPage() {
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
            <Sigma className="h-4 w-4" />
            Gemicilik Formülleri
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
            Gemicilik Formülleri
          </h1>
          <p className="text-muted-foreground mt-2">
            Mooring, catenary ve rüzgâr yükü eşitlikleri
          </p>
        </div>

        <div className="grid gap-6">
          {seamanshipFormulas.map((formula, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <formula.icon className="h-5 w-5 text-emerald-600" />
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
                        <span className="text-emerald-500 mt-1">•</span>
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
