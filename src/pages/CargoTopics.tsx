import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Package, Anchor, Gauge, FileCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const cargoTopics = [
  {
    title: "Draft Survey Temelleri",
    icon: Gauge,
    content: [
      "Draft survey, geminin yükleme/boşaltma öncesi ve sonrası draft ölçümlerine dayalı kargo miktarının belirlenmesi işlemidir.",
      "Baş (Forward), orta (Midship) ve kıç (Aft) draft ölçümleri alınarak ortalama draft hesaplanır.",
      "TPC (Tons Per Centimeter) değeri ile deplasman değişimi hesaplanarak yük miktarı belirlenir."
    ]
  },
  {
    title: "Yoğunluk Düzeltmeleri",
    icon: Anchor,
    content: [
      "Deniz suyu yoğunluğu standart 1.025 t/m³'ten farklı olduğunda düzeltme yapılmalıdır.",
      "Δ_düzeltilmiş = Δ_okunan × (ρ_gerçek / 1.025)",
      "Hidrometreyle alınan yoğunluk ölçümleri sıcaklık düzeltmesi gerektirebilir."
    ]
  },
  {
    title: "Trim Düzeltmeleri",
    icon: Package,
    content: [
      "Gemide trim varken ortalama draft doğrudan kullanılamaz.",
      "LCF (Longitudinal Center of Flotation) konumuna göre düzeltme yapılır.",
      "Birinci ve ikinci trim düzeltmeleri sırasıyla uygulanır."
    ]
  },
  {
    title: "Yükleme Planlaması",
    icon: FileCheck,
    content: [
      "Yük dağılımı trim, stabilite ve yapısal limitleri gözetmelidir.",
      "Allowable GM değerleri aşılmamalıdır.",
      "Shear force ve bending moment limitleri kontrol edilmelidir."
    ]
  }
];

export default function CargoTopicsPage() {
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
            <BookOpen className="h-4 w-4" />
            Kargo & Operasyon
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
            Kargo & Operasyon Konu Anlatımı
          </h1>
          <p className="text-muted-foreground mt-2">
            Draft survey, yükleme planı ve operasyonel akış
          </p>
        </div>

        <div className="grid gap-6">
          {cargoTopics.map((topic, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <topic.icon className="h-5 w-5 text-amber-600" />
                  {topic.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {topic.content.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      {item}
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
