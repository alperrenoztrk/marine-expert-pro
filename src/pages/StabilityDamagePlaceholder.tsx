import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { ShipGeometry, CompartmentAnalysis } from "@/types/hydrostatic";
import { HydrostaticCalculations } from "@/services/hydrostaticCalculations";

export default function StabilityDamagePlaceholder() {
  const navigate = useNavigate();
  
  // Temel ve İleri mod seçimi
  const [basicMode, setBasicMode] = useState<boolean>(true);
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  
  const [geometry, setGeometry] = useState<ShipGeometry>({
    length: 180,
    breadth: 30,
    depth: 18,
    draft: 10,
    blockCoefficient: 0.75,
    waterplaneCoefficient: 0.85,
    midshipCoefficient: 0.98,
    prismaticCoefficient: 0.77,
    verticalPrismaticCoefficient: 0.75,
  });

  const [kg, setKg] = useState<number>(12);
  const [compartments, setCompartments] = useState<CompartmentAnalysis[]>([
    { compartment: 'No.1', floodedVolume: 500, newKG: 0.2, residualGM: 0, downfloodingAngle: 0 },
  ]);

  const [result, setResult] = useState<ReturnType<typeof HydrostaticCalculations.calculateDamageStability> | null>(null);

  const handleChange = (key: keyof ShipGeometry) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setGeometry((prev) => ({ ...prev, [key]: isNaN(value) ? 0 : value }));
  };

  const handleCompChange = (index: number, key: keyof CompartmentAnalysis) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = key === 'compartment' ? e.target.value : parseFloat(e.target.value);
    setCompartments((prev) => prev.map((c, i) => i === index ? { ...c, [key]: typeof value === 'number' && isNaN(value) ? 0 : value } as any : c));
  };

  const addCompartment = () => setCompartments((prev) => [...prev, { compartment: `No.${prev.length + 1}`, floodedVolume: 300, newKG: 0.15, residualGM: 0, downfloodingAngle: 0 }]);

  const handleCalculate = () => {
    const res = HydrostaticCalculations.calculateDamageStability(geometry, kg, compartments);
    setResult(res);
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/stability')}>
        <ArrowLeft className="h-4 w-4" />
        Geri Dön
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Hasarlı Stabilite</CardTitle>
          {/* Mod Seçimi */}
          <div className="flex gap-2 mt-4">
            <Button
              variant={basicMode ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setBasicMode(true);
                setAdvancedMode(false);
              }}
            >
              Temel
            </Button>
            <Button
              variant={advancedMode ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setAdvancedMode(true);
                setBasicMode(false);
              }}
            >
              İleri
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Temel Mod - Sadece gerekli alanlar */}
          {basicMode && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <Label>Uzunluk LBP (m)</Label>
                <Input type="number" value={geometry.length} onChange={handleChange('length')} />
              </div>
              <div>
                <Label>Genişlik B (m)</Label>
                <Input type="number" value={geometry.breadth} onChange={handleChange('breadth')} />
              </div>
              <div>
                <Label>Draft T (m)</Label>
                <Input type="number" value={geometry.draft} onChange={handleChange('draft')} />
              </div>
              <div>
                <Label>Cb</Label>
                <Input type="number" step="0.01" value={geometry.blockCoefficient} onChange={handleChange('blockCoefficient')} />
              </div>
              <div>
                <Label>KG (m)</Label>
                <Input type="number" step="0.01" value={kg} onChange={(e) => setKg(parseFloat(e.target.value))} />
              </div>
            </div>
          )}

          {/* İleri Mod - Tüm alanlar */}
          {advancedMode && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <Label>Uzunluk LBP (m)</Label>
                <Input type="number" value={geometry.length} onChange={handleChange('length')} />
              </div>
              <div>
                <Label>Genişlik B (m)</Label>
                <Input type="number" value={geometry.breadth} onChange={handleChange('breadth')} />
              </div>
              <div>
                <Label>Derinlik D (m)</Label>
                <Input type="number" value={geometry.depth} onChange={handleChange('depth')} />
              </div>
              <div>
                <Label>Draft T (m)</Label>
                <Input type="number" value={geometry.draft} onChange={handleChange('draft')} />
              </div>
              <div>
                <Label>Cb</Label>
                <Input type="number" step="0.01" value={geometry.blockCoefficient} onChange={handleChange('blockCoefficient')} />
              </div>
              <div>
                <Label>Cwp</Label>
                <Input type="number" step="0.01" value={geometry.waterplaneCoefficient} onChange={handleChange('waterplaneCoefficient')} />
              </div>
              <div>
                <Label>Cm</Label>
                <Input type="number" step="0.01" value={geometry.midshipCoefficient} onChange={handleChange('midshipCoefficient')} />
              </div>
              <div>
                <Label>Cp</Label>
                <Input type="number" step="0.01" value={geometry.prismaticCoefficient} onChange={handleChange('prismaticCoefficient')} />
              </div>
              <div>
                <Label>Cvp</Label>
                <Input type="number" step="0.01" value={geometry.verticalPrismaticCoefficient} onChange={handleChange('verticalPrismaticCoefficient')} />
              </div>
              <div>
                <Label>KG (m)</Label>
                <Input type="number" step="0.01" value={kg} onChange={(e) => setKg(parseFloat(e.target.value))} />
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Hasarlı Bölmeler</div>
              <Button variant="outline" size="sm" onClick={addCompartment}>Bölme Ekle</Button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {compartments.map((c, i) => (
                <div key={i} className="grid grid-cols-2 sm:grid-cols-5 gap-2 border rounded-md p-3">
                  <div>
                    <Label>Ad</Label>
                    <Input value={c.compartment} onChange={handleCompChange(i, 'compartment')} />
                  </div>
                  <div>
                    <Label>Taşkın Hacim (m³)</Label>
                    <Input type="number" value={c.floodedVolume} onChange={handleCompChange(i, 'floodedVolume')} />
                  </div>
                  <div>
                    <Label>Yeni KG (m)</Label>
                    <Input type="number" step="0.01" value={c.newKG} onChange={handleCompChange(i, 'newKG')} />
                  </div>
                  <div>
                    <Label>Rezidüel GM (m)</Label>
                    <Input type="number" step="0.01" value={c.residualGM} onChange={handleCompChange(i, 'residualGM')} />
                  </div>
                  <div>
                    <Label>Downflooding Açı (°)</Label>
                    <Input type="number" step="0.1" value={c.downfloodingAngle} onChange={handleCompChange(i, 'downfloodingAngle')} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="primary" onClick={handleCalculate}>Hesapla</Button>
            <Button variant="ghost" onClick={() => setResult(null)}>Temizle</Button>
          </div>

          {result && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">Taşkın Hacim</div>
                <div className="text-xl font-semibold">{result.floodedVolume.toFixed(0)} m³</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">Yeni KG</div>
                <div className="text-xl font-semibold">{result.newKG.toFixed(2)} m</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">Rezidüel GM</div>
                <div className="text-xl font-semibold">{result.residualGM.toFixed(2)} m</div>
              </div>
              <div className="rounded-md border p-3 sm:col-span-3">
                <div className="text-xs text-muted-foreground">Downflooding Açı / Equalized Açı</div>
                <div className="text-xl font-semibold">{result.downfloodingAngle.toFixed(1)}° / {result.equalizedAngle.toFixed(1)}°</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}