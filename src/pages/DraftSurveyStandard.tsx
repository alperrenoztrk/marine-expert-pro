import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Ship, Calculator, Scale, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DraftSurveyStandard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [inputs, setInputs] = useState({
    lengthBP: "",
    breadth: "",
    depth: "",
    forwardDraft: "",
    midshipDraft: "",
    aftDraft: "",
    density: "1.025",
    ballast: "",
    fuel: "",
    freshWater: "",
    stores: ""
  });

  const [result, setResult] = useState<{
    meanDraft: number;
    displacement: number;
    deadweight: number;
    cargoWeight: number;
  } | null>(null);

  const calculate = () => {
    const { lengthBP, breadth, forwardDraft, midshipDraft, aftDraft, density, ballast, fuel, freshWater, stores } = inputs;
    
    if (!lengthBP || !breadth || !forwardDraft || !midshipDraft || !aftDraft) {
      toast({ title: "Hata", description: "Lütfen tüm gerekli alanları doldurun", variant: "destructive" });
      return;
    }

    const L = parseFloat(lengthBP);
    const B = parseFloat(breadth);
    const Tf = parseFloat(forwardDraft);
    const Tm = parseFloat(midshipDraft);
    const Ta = parseFloat(aftDraft);
    const rho = parseFloat(density);
    
    // Ortalama draft hesaplama (6 ordinat kuralı)
    const meanDraft = (Tf + 4*Tm + Ta) / 6;
    
    // Deplasman hesaplama (basitleştirilmiş)
    const displacement = L * B * meanDraft * 0.7 * rho;
    
    // Çıkarımlar
    const deductions = (parseFloat(ballast || "0") + parseFloat(fuel || "0") + 
                      parseFloat(freshWater || "0") + parseFloat(stores || "0"));
    
    const deadweight = displacement - 2000; // Varsayılan lightweight
    const cargoWeight = deadweight - deductions;

    setResult({
      meanDraft,
      displacement,
      deadweight,
      cargoWeight
    });

    toast({ title: "Hesaplama Tamamlandı", description: "Draft survey sonuçları hesaplandı" });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Standart Draft Survey</h1>
          <p className="text-muted-foreground">Genel kargo draft hesaplaması</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ship className="h-5 w-5" />
            Gemi Özellikleri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="lengthBP">Length BP (m)</Label>
              <Input
                id="lengthBP"
                type="number"
                value={inputs.lengthBP}
                onChange={(e) => setInputs(prev => ({ ...prev, lengthBP: e.target.value }))}
                placeholder="Dikmeler arası uzunluk"
              />
            </div>
            <div>
              <Label htmlFor="breadth">Genişlik (m)</Label>
              <Input
                id="breadth"
                type="number"
                value={inputs.breadth}
                onChange={(e) => setInputs(prev => ({ ...prev, breadth: e.target.value }))}
                placeholder="Moulded genişlik"
              />
            </div>
            <div>
              <Label htmlFor="density">Su Yoğunluğu (ton/m³)</Label>
              <Input
                id="density"
                type="number"
                value={inputs.density}
                onChange={(e) => setInputs(prev => ({ ...prev, density: e.target.value }))}
                placeholder="1.025"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Draft Okumaları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="forwardDraft">Baş Draft (m)</Label>
              <Input
                id="forwardDraft"
                type="number"
                step="0.01"
                value={inputs.forwardDraft}
                onChange={(e) => setInputs(prev => ({ ...prev, forwardDraft: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="midshipDraft">Orta Draft (m)</Label>
              <Input
                id="midshipDraft"
                type="number"
                step="0.01"
                value={inputs.midshipDraft}
                onChange={(e) => setInputs(prev => ({ ...prev, midshipDraft: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="aftDraft">Kıç Draft (m)</Label>
              <Input
                id="aftDraft"
                type="number"
                step="0.01"
                value={inputs.aftDraft}
                onChange={(e) => setInputs(prev => ({ ...prev, aftDraft: e.target.value }))}
                placeholder="0.00"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Çıkarımlar (ton)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="ballast">Balast Suyu</Label>
              <Input
                id="ballast"
                type="number"
                value={inputs.ballast}
                onChange={(e) => setInputs(prev => ({ ...prev, ballast: e.target.value }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="fuel">Yakıt</Label>
              <Input
                id="fuel"
                type="number"
                value={inputs.fuel}
                onChange={(e) => setInputs(prev => ({ ...prev, fuel: e.target.value }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="freshWater">Tatlı Su</Label>
              <Input
                id="freshWater"
                type="number"
                value={inputs.freshWater}
                onChange={(e) => setInputs(prev => ({ ...prev, freshWater: e.target.value }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="stores">Erzak/Yedek</Label>
              <Input
                id="stores"
                type="number"
                value={inputs.stores}
                onChange={(e) => setInputs(prev => ({ ...prev, stores: e.target.value }))}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={calculate} className="w-full" size="lg">
        <Calculator className="h-4 w-4 mr-2" />
        Hesapla
      </Button>

      {result && (
        <Card className="bg-green-50 dark:bg-green-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Hesaplama Sonuçları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p><strong>Ortalama su çekimi:</strong> {result.meanDraft.toFixed(3)} m</p>
                <p><strong>Deplasman:</strong> {result.displacement.toFixed(2)} ton</p>
              </div>
              <div className="space-y-2">
                <p><strong>Deadweight:</strong> {result.deadweight.toFixed(2)} ton</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  <strong>Kargo Ağırlığı:</strong> {result.cargoWeight.toFixed(2)} ton
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}