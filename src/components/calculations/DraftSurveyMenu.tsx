import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Ship, 
  Waves, 
  Calculator, 
  Scale, 
  Anchor, 
  BarChart3,
  FileText,
  Gauge
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DraftSurveyMenu = () => {
  const navigate = useNavigate();

  const draftCalculations = [
    {
      title: "Standart Draft Survey",
      description: "Genel kargo draft hesaplaması",
      icon: Ship,
      path: "/draft-survey-standard",
      color: "bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900"
    },
    {
      title: "Bunker Ölçümü",
      description: "Yakıt tonajı hesaplama",
      icon: Gauge,
      path: "/draft-survey-bunker",
      color: "bg-orange-50 dark:bg-orange-950 hover:bg-orange-100 dark:hover:bg-orange-900"
    },
    {
      title: "Balast Hesabı",
      description: "Balast suyu draft etkisi",
      icon: Waves,
      path: "/draft-survey-ballast",
      color: "bg-cyan-50 dark:bg-cyan-950 hover:bg-cyan-100 dark:hover:bg-cyan-900"
    },
    {
      title: "Yoğunluk Düzeltmesi",
      description: "Deniz suyu yoğunluk etkisi",
      icon: BarChart3,
      path: "/draft-survey-density",
      color: "bg-purple-50 dark:bg-purple-950 hover:bg-purple-100 dark:hover:bg-purple-900"
    },
    {
      title: "Port Hesabı",
      description: "Liman özel hesaplamaları",
      icon: Anchor,
      path: "/draft-survey-port",
      color: "bg-amber-50 dark:bg-amber-950 hover:bg-amber-100 dark:hover:bg-amber-900"
    },
    {
      title: "Analiz & Rapor",
      description: "Sonuç analizi ve raporlama",
      icon: FileText,
      path: "/draft-survey-analysis",
      color: "bg-rose-50 dark:bg-rose-950 hover:bg-rose-100 dark:hover:bg-rose-900"
    },
    {
      title: "Hesap Makinesi",
      description: "Hızlı draft hesaplamaları",
      icon: Calculator,
      path: "/draft-survey-calculator",
      color: "bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900"
    }
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Draft Survey Hesaplamaları</h1>
          <p className="text-muted-foreground">Gemi draft ölçümü ve kargo hesaplama araçları</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {draftCalculations.map((calc, index) => {
          const IconComponent = calc.icon;
          return (
            <Card 
              key={index} 
              className={`${calc.color} border-0 transition-all duration-200 hover:scale-105 cursor-pointer`}
              onClick={() => navigate(calc.path)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-background/50">
                    <IconComponent className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-foreground">
                      {calc.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">
                  {calc.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ship className="h-5 w-5" />
            Draft Survey Hakkında
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Draft survey, geminin kargo yükleme/boşaltma öncesi ve sonrası draft ölçümlerini 
            karşılaştırarak kargo tonajını hesaplama yöntemidir. Bu hesaplamalar ISGOTT 
            standartlarına uygun olarak yapılmaktadır.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DraftSurveyMenu;