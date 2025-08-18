import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Anchor } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DraftSurveyPort = () => {
  const navigate = useNavigate();
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
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Geri Dön
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Port Hesabı</h1>
          <p className="text-muted-foreground">Liman özel hesaplamaları</p>
        </div>
      </div>

      <Card>
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
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Hesaplama Sonuçları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-secondary/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Gelgit Etkisi</p>
                    <p className="text-lg font-semibold">{calculation.tideEffect.toFixed(1)} cm</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Yoğunluk Farkı</p>
                    <p className="text-lg font-semibold">{calculation.densityEffect.toFixed(1)} kg/m³</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Toplam Ücret</p>
                    <p className="text-lg font-semibold">${calculation.totalCost.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liman Hesaplamaları Hakkında</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Her limanın kendine özgü koşulları vardır. Gelgit seviyeleri, su yoğunluğu, 
            liman ücretleri ve yerel düzenlemeler draft survey hesaplamalarını etkiler.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DraftSurveyPort;