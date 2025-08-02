import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Ship, TrendingUp, Target } from "lucide-react";
import { toast } from "sonner";

interface TrimListData {
  // Ship Parameters
  L: number; // Length overall (m)
  B: number; // Breadth (m)
  T: number; // Draft (m)
  displacement: number; // Displacement (tonnes)
  GML: number; // Longitudinal metacentric height (m)
  
  // Draft Parameters
  draftForward: number; // Forward draft (m)
  draftAft: number; // Aft draft (m)
  draftMid: number; // Mid draft (m)
  
  // Trim Parameters
  weightAdded: number; // Weight to be added/removed (tonnes)
  weightLCG: number; // Longitudinal position of weight from AP (m)
  
  // List Parameters
  listWeight: number; // List weight (tonnes)
  listDistance: number; // List distance (m)
  transverseG: number; // Transverse center of gravity (m)
  
  // Tank Parameters
  tankLength: number; // Tank length (m)
  tankBreadth: number; // Tank breadth (m)
  tankHeight: number; // Tank height (m)
  fillRatio: number; // Tank fill ratio (0-1)
  
  // Water Parameters
  waterDensity: number; // Water density (t/m³)
}

interface TrimListResult {
  // Trim Calculations
  trimAngle: number; // θ = arctan((T_a - T_f) / L)
  mct: number; // MCT = (Δ × GM_L × B²) / (12 × L)
  trimChange: number; // ΔT = (W × d) / MCT
  
  // Draft Survey Calculations
  meanDraft: number; // T_mean = (T_f + 4×T_m + T_a) / 6
  displacement: number; // Δ = V × ρ_sw
  tpc: number; // TPC = (A_wp × ρ_sw) / 100
  
  // Bonjean Curves
  underwaterVolume: number; // V = ∫ A(x) dx
  lcb: number; // LCB = ∫ x × A(x) dx / V
  moment: number; // M = ∫ x² × A(x) dx
  
  // Sounding Tables
  tankVolumeRect: number; // V = L × B × h
  tankVolumeCyl: number; // V = π × r² × h
  trimCorrection: number; // ΔV = A × tan(θ) × l
  
  // List Calculations
  listAngle: number; // φ = arctan(W × d / (Δ × GM))
  listMoment: number; // M_list = W × d
  
  status: 'excellent' | 'good' | 'acceptable' | 'poor' | 'dangerous';
  recommendations: string[];
}

export const TrimListCalculations = () => {
  
  const [trimListData, setTrimListData] = useState<Partial<TrimListData>>({
    waterDensity: 1.025,
    tankLength: 20,
    tankBreadth: 15,
    tankHeight: 8,
    fillRatio: 0.5
  });
  const [result, setResult] = useState<TrimListResult | null>(null);
  const [activeTab, setActiveTab] = useState("trim");

  // Trim Angle Calculation - θ = arctan((T_a - T_f) / L)
  const calculateTrimAngle = (data: TrimListData): number => {
    return Math.atan((data.draftAft - data.draftForward) / data.L) * (180 / Math.PI);
  };

  // MCT Calculation - MCT = (Δ × GM_L × B²) / (12 × L)
  const calculateMCT = (data: TrimListData): number => {
    return (data.displacement * data.GML * Math.pow(data.B, 2)) / (12 * data.L);
  };

  // Trim Change Calculation - ΔT = (W × d) / MCT
  const calculateTrimChange = (data: TrimListData): number => {
    const mct = calculateMCT(data);
    return (data.weightAdded * data.weightLCG) / mct;
  };

  // Mean Draft Calculation - T_mean = (T_f + 4×T_m + T_a) / 6
  const calculateMeanDraft = (data: TrimListData): number => {
    return (data.draftForward + 4 * data.draftMid + data.draftAft) / 6;
  };

  // Displacement Calculation - Δ = V × ρ_sw
  const calculateDisplacement = (data: TrimListData): number => {
    const underwaterVolume = data.L * data.B * data.T * 0.75; // Simplified volume calculation
    return underwaterVolume * data.waterDensity;
  };

  // TPC Calculation - TPC = (A_wp × ρ_sw) / 100
  const calculateTPC = (data: TrimListData): number => {
    const waterplaneArea = data.L * data.B * 0.85; // Simplified waterplane area
    return (waterplaneArea * data.waterDensity) / 100;
  };

  // Underwater Volume - V = ∫ A(x) dx (simplified)
  const calculateUnderwaterVolume = (data: TrimListData): number => {
    return data.L * data.B * data.T * 0.75; // Simplified calculation
  };

  // LCB Calculation - LCB = ∫ x × A(x) dx / V (simplified)
  const calculateLCB = (data: TrimListData): number => {
    return data.L / 2; // Simplified center of buoyancy
  };

  // Moment Calculation - M = ∫ x² × A(x) dx (simplified)
  const calculateMoment = (data: TrimListData): number => {
    return data.L * data.B * data.T * 0.75 * (data.L / 2); // Simplified moment
  };

  // Tank Volume (Rectangular) - V = L × B × h
  const calculateTankVolumeRect = (data: TrimListData): number => {
    return data.tankLength * data.tankBreadth * data.tankHeight;
  };

  // Tank Volume (Cylindrical) - V = π × r² × h
  const calculateTankVolumeCyl = (data: TrimListData): number => {
    const radius = data.tankBreadth / 2;
    return Math.PI * Math.pow(radius, 2) * data.tankHeight;
  };

  // Trim Correction - ΔV = A × tan(θ) × l
  const calculateTrimCorrection = (data: TrimListData): number => {
    const trimAngle = calculateTrimAngle(data);
    const trimAngleRad = trimAngle * Math.PI / 180;
    const area = data.tankLength * data.tankBreadth;
    return area * Math.tan(trimAngleRad) * data.tankHeight;
  };

  // List Angle Calculation - φ = arctan(W × d / (Δ × GM))
  const calculateListAngle = (data: TrimListData): number => {
    const GM = 1.0; // Simplified GM value
    return Math.atan((data.listWeight * data.listDistance) / (data.displacement * GM)) * (180 / Math.PI);
  };

  // List Moment Calculation - M_list = W × d
  const calculateListMoment = (data: TrimListData): number => {
    return data.listWeight * data.listDistance;
  };

  // Main Calculation
  const calculateTrimList = () => {
    if (!trimListData.L || !trimListData.B || !trimListData.T || !trimListData.displacement || 
        !trimListData.GML || !trimListData.draftForward || !trimListData.draftAft || !trimListData.draftMid) {
      toast.error("Lütfen tüm gerekli değerleri girin.");
      return;
    }

    const data = trimListData as TrimListData;
    
    // Calculate all parameters
    const trimAngle = calculateTrimAngle(data);
    const mct = calculateMCT(data);
    const trimChange = calculateTrimChange(data);
    const meanDraft = calculateMeanDraft(data);
    const displacement = calculateDisplacement(data);
    const tpc = calculateTPC(data);
    const underwaterVolume = calculateUnderwaterVolume(data);
    const lcb = calculateLCB(data);
    const moment = calculateMoment(data);
    const tankVolumeRect = calculateTankVolumeRect(data);
    const tankVolumeCyl = calculateTankVolumeCyl(data);
    const trimCorrection = calculateTrimCorrection(data);
    const listAngle = calculateListAngle(data);
    const listMoment = calculateListMoment(data);
    
    // Status determination
    let status: TrimListResult['status'] = 'acceptable';
    let recommendations: string[] = [];
    
    if (Math.abs(trimAngle) > 3) {
      status = 'poor';
      recommendations.push("Trim açısı fazla - yük dağılımını kontrol edin");
    }
    if (Math.abs(listAngle) > 5) {
      status = 'poor';
      recommendations.push("List açısı fazla - enine yük dengesini kontrol edin");
    }
    if (Math.abs(trimAngle) > 5) {
      status = 'dangerous';
      recommendations.push("ACİL: Trim açısı çok fazla - güvenlik riski!");
    }
    if (Math.abs(listAngle) > 10) {
      status = 'dangerous';
      recommendations.push("ACİL: List açısı çok fazla - güvenlik riski!");
    }
    if (Math.abs(trimAngle) <= 1 && Math.abs(listAngle) <= 2) {
      status = 'excellent';
      recommendations.push("Mükemmel trim ve list durumu");
    }
    if (Math.abs(trimAngle) <= 2 && Math.abs(listAngle) <= 3) {
      status = 'good';
      recommendations.push("İyi trim ve list durumu");
    }

    const result: TrimListResult = {
      trimAngle,
      mct,
      trimChange,
      meanDraft,
      displacement,
      tpc,
      underwaterVolume,
      lcb,
      moment,
      tankVolumeRect,
      tankVolumeCyl,
      trimCorrection,
      listAngle,
      listMoment,
      status,
      recommendations
    };
    
    setResult(result);
    
    toast.success(`Trim ve List Analizi Tamamlandı! Trim: ${trimAngle.toFixed(2)}° - List: ${listAngle.toFixed(2)}°`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'acceptable': return 'bg-yellow-500';
      case 'poor': return 'bg-orange-500';
      case 'dangerous': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ship className="h-6 w-6" />
            Trim ve List Hesaplamaları
          </CardTitle>
          <CardDescription>
            Gemi duruşu, trim açısı ve list düzeltme hesaplamaları
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="trim">Trim Hesaplamaları</TabsTrigger>
              <TabsTrigger value="list">List Hesaplamaları</TabsTrigger>
              <TabsTrigger value="tanks">Tank Hesaplamaları</TabsTrigger>
            </TabsList>

            <TabsContent value="trim" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length">Gemi Boyu (L) [m]</Label>
                  <Input
                    id="length"
                    type="number"
                    value={trimListData.L || ''}
                    onChange={(e) => setTrimListData({...trimListData, L: parseFloat(e.target.value)})}
                    placeholder="150"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breadth">Genişlik (B) [m]</Label>
                  <Input
                    id="breadth"
                    type="number"
                    value={trimListData.B || ''}
                    onChange={(e) => setTrimListData({...trimListData, B: parseFloat(e.target.value)})}
                    placeholder="25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="draft">Ortalama Su Çekimi (T) [m]</Label>
                  <Input
                    id="draft"
                    type="number"
                    value={trimListData.T || ''}
                    onChange={(e) => setTrimListData({...trimListData, T: parseFloat(e.target.value)})}
                    placeholder="8.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displacement">Deplasman [ton]</Label>
                  <Input
                    id="displacement"
                    type="number"
                    value={trimListData.displacement || ''}
                    onChange={(e) => setTrimListData({...trimListData, displacement: parseFloat(e.target.value)})}
                    placeholder="25000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="GML">GM_L [m]</Label>
                  <Input
                    id="GML"
                    type="number"
                    step="0.01"
                    value={trimListData.GML || ''}
                    onChange={(e) => setTrimListData({...trimListData, GML: parseFloat(e.target.value)})}
                    placeholder="150"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="draftForward">Baş Draft (T_f) [m]</Label>
                  <Input
                    id="draftForward"
                    type="number"
                    step="0.01"
                    value={trimListData.draftForward || ''}
                    onChange={(e) => setTrimListData({...trimListData, draftForward: parseFloat(e.target.value)})}
                    placeholder="7.50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="draftMid">Orta Draft (T_m) [m]</Label>
                  <Input
                    id="draftMid"
                    type="number"
                    step="0.01"
                    value={trimListData.draftMid || ''}
                    onChange={(e) => setTrimListData({...trimListData, draftMid: parseFloat(e.target.value)})}
                    placeholder="8.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="draftAft">Kıç Draft (T_a) [m]</Label>
                  <Input
                    id="draftAft"
                    type="number"
                    step="0.01"
                    value={trimListData.draftAft || ''}
                    onChange={(e) => setTrimListData({...trimListData, draftAft: parseFloat(e.target.value)})}
                    placeholder="8.20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weightAdded">Eklenen Ağırlık (W) [ton]</Label>
                  <Input
                    id="weightAdded"
                    type="number"
                    step="0.1"
                    value={trimListData.weightAdded || ''}
                    onChange={(e) => setTrimListData({...trimListData, weightAdded: parseFloat(e.target.value)})}
                    placeholder="500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weightLCG">Ağırlık Mesafesi (d) [m]</Label>
                  <Input
                    id="weightLCG"
                    type="number"
                    step="0.1"
                    value={trimListData.weightLCG || ''}
                    onChange={(e) => setTrimListData({...trimListData, weightLCG: parseFloat(e.target.value)})}
                    placeholder="45"
                  />
                </div>
              </div>

              <Button onClick={calculateTrimList} className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Trim ve List Analizi
              </Button>

              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Trim Hesaplama Sonuçları
                      <Badge className={getStatusColor(result.status)}>
                        {result.status.toUpperCase()}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold">{result.trimAngle.toFixed(2)}°</div>
                        <div className="text-sm text-muted-foreground">Trim Açısı</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold">{result.mct.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">MCT [ton.m/cm]</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold">{result.trimChange.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">Trim Değişimi [cm]</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold">{result.meanDraft.toFixed(2)}m</div>
                        <div className="text-sm text-muted-foreground">Ortalama Draft</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-indigo-50 rounded-lg">
                        <div className="text-2xl font-bold">{result.displacement.toFixed(0)}</div>
                        <div className="text-sm text-muted-foreground">Deplasman [ton]</div>
                      </div>
                      <div className="text-center p-3 bg-cyan-50 rounded-lg">
                        <div className="text-2xl font-bold">{result.tpc.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">TPC [ton/cm]</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold">{result.underwaterVolume.toFixed(0)}</div>
                        <div className="text-sm text-muted-foreground">Su Altı Hacim [m³]</div>
                      </div>
                    </div>

                    {result.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Öneriler & Uyarılar</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {result.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm">{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="list" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="listWeight">List Ağırlığı W [ton]</Label>
                  <Input
                    id="listWeight"
                    type="number"
                    step="0.1"
                    value={trimListData.listWeight || ''}
                    onChange={(e) => setTrimListData({...trimListData, listWeight: parseFloat(e.target.value)})}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="listDistance">List Mesafesi d [m]</Label>
                  <Input
                    id="listDistance"
                    type="number"
                    step="0.01"
                    value={trimListData.listDistance || ''}
                    onChange={(e) => setTrimListData({...trimListData, listDistance: parseFloat(e.target.value)})}
                    placeholder="2.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transverseG">Enine Ağırlık Merkezi TG [m]</Label>
                  <Input
                    id="transverseG"
                    type="number"
                    step="0.01"
                    value={trimListData.transverseG || ''}
                    onChange={(e) => setTrimListData({...trimListData, transverseG: parseFloat(e.target.value)})}
                    placeholder="0.5"
                  />
                </div>
              </div>

              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      List Hesaplama Sonuçları
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold">{result.listAngle.toFixed(2)}°</div>
                        <div className="text-sm text-muted-foreground">List Açısı</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold">{result.listMoment.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">List Moment [ton.m]</div>
                      </div>
                      <div className="text-center p-3 bg-indigo-50 rounded-lg">
                        <div className="text-2xl font-bold">{result.lcb.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">LCB [m]</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="tanks" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tankLength">Tank Boyu (L) [m]</Label>
                  <Input
                    id="tankLength"
                    type="number"
                    value={trimListData.tankLength || ''}
                    onChange={(e) => setTrimListData({...trimListData, tankLength: parseFloat(e.target.value)})}
                    placeholder="20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tankBreadth">Tank Genişliği (B) [m]</Label>
                  <Input
                    id="tankBreadth"
                    type="number"
                    value={trimListData.tankBreadth || ''}
                    onChange={(e) => setTrimListData({...trimListData, tankBreadth: parseFloat(e.target.value)})}
                    placeholder="15"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tankHeight">Tank Yüksekliği (h) [m]</Label>
                  <Input
                    id="tankHeight"
                    type="number"
                    value={trimListData.tankHeight || ''}
                    onChange={(e) => setTrimListData({...trimListData, tankHeight: parseFloat(e.target.value)})}
                    placeholder="8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fillRatio">Doluluk Oranı</Label>
                  <Input
                    id="fillRatio"
                    type="number"
                    step="0.1"
                    max="1"
                    min="0"
                    value={trimListData.fillRatio || ''}
                    onChange={(e) => setTrimListData({...trimListData, fillRatio: parseFloat(e.target.value)})}
                    placeholder="0.5"
                  />
                </div>
              </div>

              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Tank Hesaplama Sonuçları
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold">{result.tankVolumeRect.toFixed(0)}</div>
                        <div className="text-sm text-muted-foreground">Dikdörtgen Tank Hacmi [m³]</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold">{result.tankVolumeCyl.toFixed(0)}</div>
                        <div className="text-sm text-muted-foreground">Silindirik Tank Hacmi [m³]</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold">{result.trimCorrection.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">Trim Düzeltmesi [m³]</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};