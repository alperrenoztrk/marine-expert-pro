import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Brain, Ruler, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { HydrostaticCalculations } from "@/services/hydrostaticCalculations";
import type { ShipGeometry } from "@/types/hydrostatic";

export default function StabilityAssistantPage(){
  const navigate = useNavigate();
  const { toast } = useToast();

  // TPC helper
  const [tpcAwp, setTpcAwp] = useState<string>("");
  const [tpcRho, setTpcRho] = useState<string>("1.025");
  const [tpcResult, setTpcResult] = useState<number | null>(null);

  // Regulation advisor
  const [shipType, setShipType] = useState<string>("Cargo");
  const [geo, setGeo] = useState<ShipGeometry>({
    length: 100,
    breadth: 20,
    depth: 10,
    draft: 6,
    blockCoefficient: 0.7,
    waterplaneCoefficient: 0.8,
    midshipCoefficient: 0.9,
    prismaticCoefficient: 0.65,
    verticalPrismaticCoefficient: 0.75
  });
  const [kg, setKg] = useState<string>("5.0");
  const [imo, setImo] = useState<any | null>(null);

  const handleTPC = () => {
    const awp = parseFloat(tpcAwp);
    const rho = parseFloat(tpcRho);
    if (isNaN(awp) || isNaN(rho)) { toast({ title: 'Hata', description: 'Geçerli Awp ve yoğunluk girin', variant: 'destructive' }); return; }
    const tpc = (awp * rho) / 100;
    setTpcResult(tpc);
    toast({ title: 'TPC Hesaplandı', description: `TPC ≈ ${tpc.toFixed(2)} ton/cm` });
  };

  const handleIMOCheck = () => {
    const kgNum = parseFloat(kg);
    if (isNaN(kgNum)) { toast({ title: 'Hata', description: 'Geçerli KG girin', variant: 'destructive' }); return; }
    const analysis = HydrostaticCalculations.performStabilityAnalysis(geo, kgNum, [], []);
    setImo(analysis.imoCriteria);
    const ok = analysis.imoCriteria?.compliance;
    toast({ title: 'IMO Kontrol', description: ok? 'Uygun' : 'Uygun değil', variant: ok? 'default':'destructive' });
  };

  const tipsByShip: Record<string, string[]> = {
    Cargo: [
      'GM başlangıç ≥ 0.15 m tavsiye edilir (geminize göre kontrol edin).',
      '0–30° alan ≥ 0.055 mrad, 0–40° alan ≥ 0.09 mrad, max GZ ≥ 0.20 m.',
      'Downflooding açısını ve güverte kenarı açısını not edin.'
    ],
    Passenger: [
      'SOLAS yolcu gemisi kriterleri ve hasar stabilitesi gerekliliklerini kontrol edin.',
      'Acil durum ve tahliye koşullarında GM/alan gereklilikleri daha katıdır.',
    ],
    Tanker: [
      'IMDG/IBC koduna göre kısmi dolu tanklarda FSC önemli; KG ve GM’yi düzeltin.',
      'Hasar senaryolarında residual GM ve downflooding kontrolü yapın.'
    ],
    RoRo: [
      'Açık güverte yükleri ve rüzgar sapması için weather criterion kritik.',
      'Yük dağılımından kaynaklı TCG/LCG etkilerini kontrol edin.'
    ]
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Button variant="ghost" size="sm" className="gap-2" onClick={()=> navigate(-1)}>
        <ArrowLeft className="h-4 w-4" /> Geri Dön
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5" /> Stabilite Asistanı</CardTitle>
          <CardDescription>Hesaplama rehberi ve regülasyon uygunluk kontrolü</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* TPC Helper */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Ruler className="h-4 w-4" /> TPC Rehberi</h3>
            <p className="text-sm text-muted-foreground mb-3">Formül: TPC = Awp × ρ / 100. Awp: su hattı alanı (m²), ρ: su yoğunluğu (ton/m³).</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              <div>
                <Label>Awp (m²)</Label>
                <Input value={tpcAwp} onChange={(e)=> setTpcAwp(e.target.value)} placeholder="2500" />
              </div>
              <div>
                <Label>Yoğunluk ρ (ton/m³)</Label>
                <Input value={tpcRho} onChange={(e)=> setTpcRho(e.target.value)} placeholder="1.025" />
              </div>
              <Button onClick={handleTPC}>Hesapla</Button>
              {tpcResult !== null && (
                <div className="p-2 rounded bg-muted text-sm">TPC ≈ <span className="font-mono">{tpcResult.toFixed(2)}</span> ton/cm</div>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-2">İpucu: Draft artışı (cm) ≈ Yük (ton) / TPC</div>
          </div>

          <Separator />

          {/* Regulation Advisor */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Shield className="h-4 w-4" /> Regülasyon Danışmanı</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div>
                <Label>Gemi Türü</Label>
                <Select onValueChange={(v)=> setShipType(v)} defaultValue={shipType}>
                  <SelectTrigger><SelectValue placeholder="Gemi Türü" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cargo">Yük Gemisi</SelectItem>
                    <SelectItem value="Passenger">Yolcu Gemisi</SelectItem>
                    <SelectItem value="Tanker">Tanker</SelectItem>
                    <SelectItem value="RoRo">Ro-Ro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>KG (m)</Label>
                <Input value={kg} onChange={(e)=> setKg(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm mb-2">
              <div><Label>L (m)</Label><Input value={geo.length} onChange={(e)=> setGeo({...geo, length: parseFloat(e.target.value)})} /></div>
              <div><Label>B (m)</Label><Input value={geo.breadth} onChange={(e)=> setGeo({...geo, breadth: parseFloat(e.target.value)})} /></div>
              <div><Label>D (m)</Label><Input value={geo.depth} onChange={(e)=> setGeo({...geo, depth: parseFloat(e.target.value)})} /></div>
              <div><Label>T (m)</Label><Input value={geo.draft} onChange={(e)=> setGeo({...geo, draft: parseFloat(e.target.value)})} /></div>
              <div><Label>Cb</Label><Input value={geo.blockCoefficient} onChange={(e)=> setGeo({...geo, blockCoefficient: parseFloat(e.target.value)})} /></div>
              <div><Label>Cwp</Label><Input value={geo.waterplaneCoefficient} onChange={(e)=> setGeo({...geo, waterplaneCoefficient: parseFloat(e.target.value)})} /></div>
            </div>
            <Button onClick={handleIMOCheck}>IMO Uygunluk Kontrolü</Button>

            {imo && (
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm bg-muted p-3 rounded">
                <div>Alan (0–30°): <span className={imo.area0to30>=0.055? 'text-green-600':'text-red-600'}>{imo.area0to30.toFixed(3)} mrad</span></div>
                <div>Alan (0–40°): <span className={imo.area0to40>=0.09? 'text-green-600':'text-red-600'}>{imo.area0to40.toFixed(3)} mrad</span></div>
                <div>Max GZ: <span className={imo.maxGz>=0.20? 'text-green-600':'text-red-600'}>{imo.maxGz.toFixed(3)} m</span></div>
                <div>Başlangıç GM: <span className={imo.initialGM>=0.15? 'text-green-600':'text-red-600'}>{imo.initialGM.toFixed(3)} m</span></div>
                <div>Weather Criterion: <span className={imo.weatherCriterion? 'text-green-600':'text-red-600'}>{imo.weatherCriterion? 'Sağlandı':'Sağlanmadı'}</span></div>
                <div>Uygunluk: <span className={imo.compliance? 'text-green-600':'text-red-600'}>{imo.compliance? 'Uygun':'Değil'}</span></div>
              </div>
            )}

            <div className="mt-3 p-3 rounded bg-blue-50 dark:bg-gray-800 text-xs">
              <div className="font-semibold mb-1">{shipType} için öneriler</div>
              <ul className="list-disc pl-5 space-y-1">
                {(tipsByShip[shipType] || tipsByShip['Cargo']).map((t, i)=> (<li key={i}>{t}</li>))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}