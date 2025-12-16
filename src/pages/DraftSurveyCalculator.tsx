import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator } from "lucide-react";
import { CalculationLayout } from "@/components/layout/CalculationLayout";
import { CalculationCard } from "@/components/ui/calculation-card";
import { FormulaCard } from "@/components/ui/formula-card";
import cargoShip from "@/assets/maritime/cargo-ship-ocean.jpg";

const DraftSurveyCalculator = () => {
  
  // Draft değişimi hesaplama
  const [initialDraft, setInitialDraft] = useState("");
  const [finalDraft, setFinalDraft] = useState("");
  const [tpc, setTpc] = useState("");
  const [draftResult, setDraftResult] = useState<number | null>(null);

  // Trim hesaplama
  const [forwardDraft, setForwardDraft] = useState("");
  const [aftDraft, setAftDraft] = useState("");
  const [lpp, setLpp] = useState("");
  const [trimResult, setTrimResult] = useState<number | null>(null);

  // Deplasman hesaplama
  const [meanDraft, setMeanDraft] = useState("");
  const [waterDensity, setWaterDensity] = useState("1.025");
  const [displacement, setDisplacement] = useState("");
  const [displacementResult, setDisplacementResult] = useState<number | null>(null);

  const calculateDraftChange = () => {
    const initial = parseFloat(initialDraft);
    const final = parseFloat(finalDraft);
    const tpcValue = parseFloat(tpc);

    if (initial && final && tpcValue) {
      const change = (final - initial) * tpcValue;
      setDraftResult(change);
    }
  };

  const calculateTrim = () => {
    const forward = parseFloat(forwardDraft);
    const aft = parseFloat(aftDraft);
    const length = parseFloat(lpp);

    if (forward && aft && length) {
      const trim = ((aft - forward) / length) * 100;
      setTrimResult(trim);
    }
  };

  const calculateDisplacement = () => {
    const draft = parseFloat(meanDraft);
    const density = parseFloat(waterDensity);
    const disp = parseFloat(displacement);

    if (draft && density && disp) {
      const correctedDisp = disp * (density / 1.025);
      setDisplacementResult(correctedDisp);
    }
  };

  return (
    <CalculationLayout
      title="Hesap Makinesi"
      description="Hızlı draft hesaplamaları"
      icon={Calculator}
      hero={{
        title: "Draft Survey",
        description: "Su çekimi, trim ve deplasman için hızlı araçlar",
        imageSrc: cargoShip,
        imageAlt: "Cargo ship at sea",
      }}
      maxWidthClassName="max-w-6xl"
      rightRail={
        <FormulaCard
          title="Hızlı Formüller"
          sections={[
            {
              title: "📏 Su Çekimi Değişimi",
              accent: "blue",
              lines: [{ formula: "Ağırlık Değişimi = (Son - İlk) × TPC" }],
            },
            {
              title: "⚖️ Trim",
              accent: "teal",
              lines: [{ formula: "Trim % = (Kıç - Baş) / LPP × 100" }],
            },
            {
              title: "🌊 Deplasman Düzeltmesi",
              accent: "purple",
              lines: [{ formula: "Düzeltilmiş = Deplasman × (Gerçek Yoğunluk / 1.025)" }],
            },
          ]}
        />
      }
    >
      <CalculationCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Su çekimi hesaplama araçları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="draft-change" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="draft-change">Su çekimi değişimi</TabsTrigger>
              <TabsTrigger value="trim">Trim Hesaplama</TabsTrigger>
              <TabsTrigger value="displacement">Deplasman</TabsTrigger>
            </TabsList>

            <TabsContent value="draft-change" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="initial-draft">İlk Su Çekimi (m)</Label>
                  <Input
                    id="initial-draft"
                    type="number"
                    step="0.01"
                    value={initialDraft}
                    onChange={(e) => setInitialDraft(e.target.value)}
                    placeholder="8.50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="final-draft">Son Su Çekimi (m)</Label>
                  <Input
                    id="final-draft"
                    type="number"
                    step="0.01"
                    value={finalDraft}
                    onChange={(e) => setFinalDraft(e.target.value)}
                    placeholder="10.20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tpc">TPC (ton/cm)</Label>
                  <Input
                    id="tpc"
                    type="number"
                    step="0.1"
                    value={tpc}
                    onChange={(e) => setTpc(e.target.value)}
                    placeholder="25.5"
                  />
                </div>
              </div>
              
              <Button onClick={calculateDraftChange} className="w-full">
                Su çekimi değişimini hesapla
              </Button>

              {draftResult !== null && (
                <div className="text-center p-4 bg-secondary/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Ağırlık Değişimi</p>
                  <p className="text-xl font-semibold">{draftResult.toFixed(2)} ton</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="trim" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="forward-draft">Baş Su Çekimi (m)</Label>
                  <Input
                    id="forward-draft"
                    type="number"
                    step="0.01"
                    value={forwardDraft}
                    onChange={(e) => setForwardDraft(e.target.value)}
                    placeholder="9.20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aft-draft">Kıç Su Çekimi (m)</Label>
                  <Input
                    id="aft-draft"
                    type="number"
                    step="0.01"
                    value={aftDraft}
                    onChange={(e) => setAftDraft(e.target.value)}
                    placeholder="9.80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lpp">LPP (m)</Label>
                  <Input
                    id="lpp"
                    type="number"
                    step="0.1"
                    value={lpp}
                    onChange={(e) => setLpp(e.target.value)}
                    placeholder="180"
                  />
                </div>
              </div>
              
              <Button onClick={calculateTrim} className="w-full">
                Trim Hesapla
              </Button>

              {trimResult !== null && (
                <div className="text-center p-4 bg-secondary/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Trim Oranı</p>
                  <p className="text-xl font-semibold">{trimResult.toFixed(3)}%</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {trimResult > 0 ? "Kıç Trim" : "Baş Trim"}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="displacement" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mean-draft">Ortalama Su Çekimi (m)</Label>
                  <Input
                    id="mean-draft"
                    type="number"
                    step="0.01"
                    value={meanDraft}
                    onChange={(e) => setMeanDraft(e.target.value)}
                    placeholder="9.50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="water-density">Su Yoğunluğu (t/m³)</Label>
                  <Input
                    id="water-density"
                    type="number"
                    step="0.001"
                    value={waterDensity}
                    onChange={(e) => setWaterDensity(e.target.value)}
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
                    placeholder="22000"
                  />
                </div>
              </div>
              
              <Button onClick={calculateDisplacement} className="w-full">
                Düzeltilmiş Deplasman Hesapla
              </Button>

              {displacementResult !== null && (
                <div className="text-center p-4 bg-secondary/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Düzeltilmiş Deplasman</p>
                  <p className="text-xl font-semibold">{displacementResult.toFixed(2)} ton</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </CalculationCard>
    </CalculationLayout>
  );
};

export default DraftSurveyCalculator;