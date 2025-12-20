import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Anchor } from "lucide-react";
import { CalculationLayout } from "@/components/layout/CalculationLayout";
import { CalculationCard } from "@/components/ui/calculation-card";
import lighthouse from "@/assets/maritime/lighthouse.jpg";

const DraftSurveyPort = () => {
  const [portName, setPortName] = useState("");
  const [tideLevel, setTideLevel] = useState("");
  const [waterDensity, setWaterDensity] = useState("");
  const [dockingFees, setDockingFees] = useState("");
  const [calculation, setCalculation] = useState<any>(null);

  const calculatePortEffects = () => {
    const tide = parseFloat(tideLevel);
    const density = parseFloat(waterDensity);
    const fees = parseFloat(dockingFees);

    if (tide && density) {
      const result = {
        tideEffect: tide * 100, // cm cinsinden etki
        densityEffect: (density - 1.025) * 1000, // kg/m3 farkı
        totalCost: fees || 0
      };
      setCalculation(result);
    }
  };

  return (
    <CalculationLayout
      title="Port Hesabı"
      description="Liman özel hesaplamaları"
      icon={Anchor}
      hero={{
        title: "Draft Survey",
        description: "Liman koşullarının draft ve maliyete etkisi",
        imageSrc: lighthouse,
        imageAlt: "Lighthouse at dusk",
      }}
      maxWidthClassName="max-w-6xl"
      below={
        <CalculationCard>
          <CardHeader>
            <CardTitle>Liman Hesaplamaları Hakkında</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Her limanın kendine özgü koşulları vardır. Gelgit seviyeleri, su yoğunluğu,
              liman ücretleri ve yerel düzenlemeler draft survey hesaplamalarını etkiler.
            </p>
          </CardContent>
        </CalculationCard>
      }
    >
      <CalculationCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Anchor className="h-5 w-5" />
            Liman Bilgileri ve Hesaplama
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="port-name">Liman Adı</Label>
              <Select value={portName} onValueChange={setPortName}>
                <SelectTrigger>
                  <SelectValue placeholder="Liman seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="istanbul">İstanbul</SelectItem>
                  <SelectItem value="izmir">İzmir</SelectItem>
                  <SelectItem value="mersin">Mersin</SelectItem>
                  <SelectItem value="trabzon">Trabzon</SelectItem>
                  <SelectItem value="samsun">Samsun</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tide-level">Gelgit Seviyesi (m)</Label>
              <Input
                id="tide-level"
                type="number"
                step="0.1"
                value={tideLevel}
                onChange={(e) => setTideLevel(e.target.value)}
                placeholder="0.5"
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
                placeholder="1.025"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="docking-fees">Liman Ücreti ($)</Label>
              <Input
                id="docking-fees"
                type="number"
                step="0.01"
                value={dockingFees}
                onChange={(e) => setDockingFees(e.target.value)}
                placeholder="5000"
              />
            </div>
          </div>

          <Button onClick={calculatePortEffects} className="w-full">
            Liman Etkilerini Hesapla
          </Button>

          {calculation && (
            <div className="mt-4 rounded-lg border border-sky-200/50 dark:border-sky-500/20 bg-sky-50/70 dark:bg-sky-900/15 p-4">
              <h3 className="text-lg font-semibold">Hesaplama Sonuçları</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div className="text-center p-4 bg-background/50 rounded-lg border border-white/10">
                  <p className="text-sm text-muted-foreground">Gelgit Etkisi</p>
                  <p className="text-lg font-semibold">{calculation.tideEffect.toFixed(1)} cm</p>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg border border-white/10">
                  <p className="text-sm text-muted-foreground">Yoğunluk Farkı</p>
                  <p className="text-lg font-semibold">{calculation.densityEffect.toFixed(1)} kg/m³</p>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg border border-white/10">
                  <p className="text-sm text-muted-foreground">Toplam Ücret</p>
                  <p className="text-lg font-semibold">${calculation.totalCost.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </CalculationCard>
    </CalculationLayout>
  );
};

export default DraftSurveyPort;