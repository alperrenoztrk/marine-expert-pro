import { useState, useEffect } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3 } from "lucide-react";
import { CalculationLayout } from "@/components/layout/CalculationLayout";
import { CalculationCard } from "@/components/ui/calculation-card";
import { FormulaCard } from "@/components/ui/formula-card";
import containerShip from "@/assets/maritime/container-ship-aerial.jpg";

const DraftSurveyDensity = () => {
  const [seawaterDensity, setSeawaterDensity] = useState("");
  const [standardDensity, setStandardDensity] = useState("1.025");
  const [displacement, setDisplacement] = useState("");
  const [correction, setCorrection] = useState<number | null>(null);

  // Load saved values from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('draft-survey-density');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.seawaterDensity) setSeawaterDensity(data.seawaterDensity);
        if (data.standardDensity) setStandardDensity(data.standardDensity);
        if (data.displacement) setDisplacement(data.displacement);
      }
    } catch (error) {
      console.error("Error loading saved density inputs:", error);
    }
  }, []);

  // Save inputs to localStorage
  useEffect(() => {
    try {
      const data = { seawaterDensity, standardDensity, displacement };
      localStorage.setItem('draft-survey-density', JSON.stringify(data));
    } catch (error) {
      console.error("Error saving density inputs:", error);
    }
  }, [seawaterDensity, standardDensity, displacement]);

  const calculateDensityCorrection = () => {
    const density = parseFloat(seawaterDensity);
    const standard = parseFloat(standardDensity);
    const disp = parseFloat(displacement);

    if (density && standard && disp) {
      const correctionValue = disp * ((density - standard) / standard);
      setCorrection(correctionValue);
    }
  };

  return (
    <CalculationLayout
      title="Yoğunluk Düzeltmesi"
      description="Deniz suyu yoğunluk etkisi hesaplama"
      icon={BarChart3}
      hero={{
        title: "Draft Survey",
        description: "Yoğunluk kaynaklı deplasman düzeltmesi",
        imageSrc: containerShip,
        imageAlt: "Container ship aerial view",
      }}
      back={{ fallbackTo: "/draft-survey" }}
      maxWidthClassName="max-w-6xl"
      rightRail={
        <FormulaCard
          title="Formül"
          sections={[
            {
              title: "🌊 Yoğunluk Düzeltmesi",
              accent: "teal",
              lines: [{ formula: "Düzeltme = Deplasman × ((ρ - ρ₀) / ρ₀)" }],
            },
          ]}
          symbolsNote={
            <>
              ρ: gerçek su yoğunluğu, ρ₀: standart yoğunluk (genelde 1.025 t/m³)
            </>
          }
        />
      }
      below={
        <CalculationCard>
          <CardHeader>
            <CardTitle>Yoğunluk Düzeltmesi Hakkında</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Deniz suyunun yoğunluğu coğrafi konuma, sıcaklığa ve tuzluluk oranına göre değişir.
              Bu hesaplama, geminin farklı yoğunluktaki sularda nasıl davranacağını belirlemek için kullanılır.
            </p>
          </CardContent>
        </CalculationCard>
      }
    >
      <CalculationCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Yoğunluk Düzeltme Hesaplama
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seawater-density">Deniz Suyu Yoğunluğu (t/m³)</Label>
              <Input
                id="seawater-density"
                type="number"
                step="0.001"
                value={seawaterDensity}
                onChange={(e) => setSeawaterDensity(e.target.value)}
                placeholder=""
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="standard-density">Standart Yoğunluk (t/m³)</Label>
              <Input
                id="standard-density"
                type="number"
                step="0.001"
                value={standardDensity}
                onChange={(e) => setStandardDensity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displacement">Deplasman (ton)</Label>
              <Input
                id="displacement"
                type="number"
                step="0.1"
                value={displacement}
                onChange={(e) => setDisplacement(e.target.value)}
                placeholder=""
              />
            </div>
          </div>

          <Button onClick={calculateDensityCorrection} className="w-full">
            Yoğunluk Düzeltmesini Hesapla
          </Button>

          {correction !== null && (
            <div className="mt-4 rounded-lg border border-sky-200/50 dark:border-sky-500/20 bg-sky-50/70 dark:bg-sky-900/15 p-4">
              <h3 className="text-lg font-semibold">Hesaplama Sonucu</h3>
              <div className="space-y-2 mt-2">
                <p className="text-lg font-semibold">
                  Yoğunluk Düzeltmesi: <span className="text-sky-700 dark:text-sky-300">{correction.toFixed(2)} ton</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {correction > 0 ? "Pozitif düzeltme (ekleme)" : "Negatif düzeltme (çıkarma)"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </CalculationCard>
    </CalculationLayout>
  );
};

export default DraftSurveyDensity;