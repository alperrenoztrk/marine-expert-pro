import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, BarChart3, Calculator, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DraftSurveyComparative() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [inputs, setInputs] = useState({
    survey1: {
      name: "İlk Ölçüm",
      forward: "",
      midship: "",
      aft: "",
      date: ""
    },
    survey2: {
      name: "İkinci Ölçüm",
      forward: "",
      midship: "",
      aft: "",
      date: ""
    },
    survey3: {
      name: "Üçüncü Ölçüm",
      forward: "",
      midship: "",
      aft: "",
      date: ""
    },
    vesselParticulars: {
      tpc: "",
      density: "1.025"
    }
  });

  const [result, setResult] = useState<{
    surveys: Array<{
      name: string;
      meanDraft: number;
      displacement: number;
      trimByHead: number;
    }>;
    comparisons: Array<{
      from: string;
      to: string;
      draftChange: number;
      displacementChange: number;
      trend: string;
    }>;
  } | null>(null);

  const calculate = () => {
    const { survey1, survey2, survey3, vesselParticulars } = inputs;
    const tpc = parseFloat(vesselParticulars.tpc);
    
    if (!tpc) {
      toast({ title: "Hata", description: "TPC değerini girin", variant: "destructive" });
      return;
    }

    const surveys = [survey1, survey2, survey3].filter(survey => 
      survey.forward && survey.midship && survey.aft
    );

    if (surveys.length < 2) {
      toast({ title: "Hata", description: "En az 2 ölçüm değeri girin", variant: "destructive" });
      return;
    }

    // Her ölçüm için hesaplamalar
    const surveyResults = surveys.map(survey => {
      const meanDraft = (parseFloat(survey.forward) + 4*parseFloat(survey.midship) + parseFloat(survey.aft)) / 6;
      const displacement = meanDraft * 100 * tpc;
      const trimByHead = parseFloat(survey.forward) - parseFloat(survey.aft);
      
      return {
        name: survey.name,
        meanDraft,
        displacement,
        trimByHead
      };
    });

    // Karşılaştırmalar
    const comparisons = [];
    for (let i = 1; i < surveyResults.length; i++) {
      const prev = surveyResults[i-1];
      const current = surveyResults[i];
      const draftChange = current.meanDraft - prev.meanDraft;
      const displacementChange = current.displacement - prev.displacement;
      
      let trend = "Sabit";
      if (draftChange > 0.05) trend = "Artış";
      else if (draftChange < -0.05) trend = "Azalış";
      
      comparisons.push({
        from: prev.name,
        to: current.name,
        draftChange,
        displacementChange,
        trend
      });
    }

    setResult({
      surveys: surveyResults,
      comparisons
    });

    toast({ title: "Hesaplama Tamamlandı", description: "Karşılaştırmalı analiz yapıldı" });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Karşılaştırmalı Analiz</h1>
          <p className="text-muted-foreground">Birden fazla draft ölçümü karşılaştırması</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gemi Özellikleri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tpc">TPC (ton/cm)</Label>
              <Input
                id="tpc"
                type="number"
                step="0.01"
                value={inputs.vesselParticulars.tpc}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  vesselParticulars: { ...prev.vesselParticulars, tpc: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="density">Su Yoğunluğu (ton/m³)</Label>
              <Input
                id="density"
                type="number"
                step="0.001"
                value={inputs.vesselParticulars.density}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  vesselParticulars: { ...prev.vesselParticulars, density: e.target.value }
                }))}
                placeholder="1.025"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Survey 1 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600 dark:text-blue-400">İlk Ölçüm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="survey1-name">Ölçüm Adı</Label>
              <Input
                id="survey1-name"
                value={inputs.survey1.name}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  survey1: { ...prev.survey1, name: e.target.value }
                }))}
                placeholder="İlk Ölçüm"
              />
            </div>
            <div>
              <Label htmlFor="survey1-forward">Baş Draft (m)</Label>
              <Input
                id="survey1-forward"
                type="number"
                step="0.01"
                value={inputs.survey1.forward}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  survey1: { ...prev.survey1, forward: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="survey1-midship">Orta Draft (m)</Label>
              <Input
                id="survey1-midship"
                type="number"
                step="0.01"
                value={inputs.survey1.midship}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  survey1: { ...prev.survey1, midship: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="survey1-aft">Kıç Draft (m)</Label>
              <Input
                id="survey1-aft"
                type="number"
                step="0.01"
                value={inputs.survey1.aft}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  survey1: { ...prev.survey1, aft: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Survey 2 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600 dark:text-green-400">İkinci Ölçüm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="survey2-name">Ölçüm Adı</Label>
              <Input
                id="survey2-name"
                value={inputs.survey2.name}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  survey2: { ...prev.survey2, name: e.target.value }
                }))}
                placeholder="İkinci Ölçüm"
              />
            </div>
            <div>
              <Label htmlFor="survey2-forward">Baş Draft (m)</Label>
              <Input
                id="survey2-forward"
                type="number"
                step="0.01"
                value={inputs.survey2.forward}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  survey2: { ...prev.survey2, forward: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="survey2-midship">Orta Draft (m)</Label>
              <Input
                id="survey2-midship"
                type="number"
                step="0.01"
                value={inputs.survey2.midship}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  survey2: { ...prev.survey2, midship: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="survey2-aft">Kıç Draft (m)</Label>
              <Input
                id="survey2-aft"
                type="number"
                step="0.01"
                value={inputs.survey2.aft}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  survey2: { ...prev.survey2, aft: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Survey 3 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600 dark:text-orange-400">Üçüncü Ölçüm (İsteğe Bağlı)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="survey3-name">Ölçüm Adı</Label>
              <Input
                id="survey3-name"
                value={inputs.survey3.name}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  survey3: { ...prev.survey3, name: e.target.value }
                }))}
                placeholder="Üçüncü Ölçüm"
              />
            </div>
            <div>
              <Label htmlFor="survey3-forward">Baş Draft (m)</Label>
              <Input
                id="survey3-forward"
                type="number"
                step="0.01"
                value={inputs.survey3.forward}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  survey3: { ...prev.survey3, forward: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="survey3-midship">Orta Draft (m)</Label>
              <Input
                id="survey3-midship"
                type="number"
                step="0.01"
                value={inputs.survey3.midship}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  survey3: { ...prev.survey3, midship: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="survey3-aft">Kıç Draft (m)</Label>
              <Input
                id="survey3-aft"
                type="number"
                step="0.01"
                value={inputs.survey3.aft}
                onChange={(e) => setInputs(prev => ({ 
                  ...prev, 
                  survey3: { ...prev.survey3, aft: e.target.value }
                }))}
                placeholder="0.00"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={calculate} className="w-full" size="lg">
        <Calculator className="h-4 w-4 mr-2" />
        Karşılaştırmalı Analiz Yap
      </Button>

      {result && (
        <div className="space-y-6">
          <Card className="bg-indigo-50 dark:bg-indigo-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Ölçüm Sonuçları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.surveys.map((survey, index) => (
                  <div key={index} className="p-3 bg-white dark:bg-gray-600 rounded">
                    <h4 className="font-semibold">{survey.name}</h4>
                    <p><strong>Ortalama su çekimi:</strong> {survey.meanDraft.toFixed(3)} m</p>
                    <p><strong>Deplasman:</strong> {survey.displacement.toFixed(2)} ton</p>
                    <p><strong>Trim:</strong> {survey.trimByHead.toFixed(3)} m {survey.trimByHead >= 0 ? "(Baş trim)" : "(Kıç trim)"}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Karşılaştırma Sonuçları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.comparisons.map((comparison, index) => (
                <div key={index} className="p-3 bg-white dark:bg-gray-600 rounded">
                  <h4 className="font-semibold">{comparison.from} → {comparison.to}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <p><strong>Su çekimi değişimi:</strong> {comparison.draftChange.toFixed(3)} m</p>
                    <p><strong>Deplasman Değişimi:</strong> {comparison.displacementChange.toFixed(2)} ton</p>
                    <p><strong>Trend:</strong> 
                      <span className={`ml-1 ${
                        comparison.trend === 'Artış' ? 'text-green-600 dark:text-green-400' :
                        comparison.trend === 'Azalış' ? 'text-red-600 dark:text-red-400' :
                        'text-gray-600 dark:text-gray-400'
                      }`}>
                        {comparison.trend}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}