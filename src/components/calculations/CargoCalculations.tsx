import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Package, Truck, AlertTriangle, CheckCircle, Wheat } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CargoData {
  // Ship particulars
  lightDisplacement: number; // Light ship displacement (tonnes)
  deadweight: number; // Deadweight capacity (tonnes)
  grossTonnage: number; // GT
  netTonnage: number; // NT
  
  // Cargo details
  cargoWeight: number; // Cargo weight (tonnes)
  cargoVolume: number; // Cargo volume (m³)
  stowageFactor: number; // Stowage factor (m³/tonne)
  
  // Hold data
  holdLength: number; // Hold length (m)
  holdBreadth: number; // Hold breadth (m)
  holdHeight: number; // Hold height (m)
  
  // Positions
  cargoLCG: number; // Cargo LCG from AP (m)
  cargoTCG: number; // Cargo TCG from CL (m)
  cargoVCG: number; // Cargo VCG from baseline (m)
}

interface DraftSurveyData {
  // Before loading
  draftForeBefore: number;
  draftMidBefore: number;
  draftAftBefore: number;
  
  // After loading
  draftForeAfter: number;
  draftMidAfter: number;
  draftAftAfter: number;
  
  // Corrections
  densityCorrection: number;
  trimCorrection: number;
  deformationCorrection: number;
}

interface CargoResult {
  loadedDisplacement: number;
  cargoCapacity: number;
  utilizationPercentage: number;
  stowageEfficiency: number;
  brokenStowage: number;
  
  // Stability effects
  newKG: number;
  newLCG: number;
  stabilityStatus: 'good' | 'acceptable' | 'poor';
  
  // Load planning
  recommendedSequence: string[];
  securityForces: {
    longitudinal: number;
    transverse: number;
    vertical: number;
  };
  
  recommendations: string[];
}

interface GrainStabilityData {
  grainType: string;
  angle_of_repose: number; // degrees
  volumetricWeight: number; // tonnes/m³
  shifting_moment: number; // tonne.m
  filled_volume: number; // m³
  void_spaces: number; // m³
}

export const CargoCalculations = () => {
  const { toast } = useToast();
  
  
  const [cargoData, setCargoData] = useState<Partial<CargoData>>({});
  const [draftSurvey, setDraftSurvey] = useState<Partial<DraftSurveyData>>({});
  const [grainData, setGrainData] = useState<Partial<GrainStabilityData>>({});
  const [result, setResult] = useState<CargoResult | null>(null);
  const [activeTab, setActiveTab] = useState("loading");

  // Calculate deadweight utilization
  const calculateDWT = (cargoWeight: number, deadweight: number): number => {
    return (cargoWeight / deadweight) * 100;
  };

  // Calculate stowage factor
  const calculateStowageFactor = (volume: number, weight: number): number => {
    return volume / weight; // m³/tonne
  };

  // Calculate broken stowage (unusable space)
  const calculateBrokenStowage = (cargoVolume: number, holdVolume: number): number => {
    return ((holdVolume - cargoVolume) / holdVolume) * 100;
  };

  // Calculate new center of gravity after loading
  const calculateNewCG = (
    lightDisp: number,
    lightKG: number,
    cargoWeight: number,
    cargoVCG: number
  ): number => {
    const totalWeight = lightDisp + cargoWeight;
    return (lightDisp * lightKG + cargoWeight * cargoVCG) / totalWeight;
  };

  // Cargo securing force calculation - CSS Code requirements
  const calculateSecuringForces = (cargoWeight: number) => {
    // CSS Code - accelerations for general cargo
    const longitudinalAcc = 0.3; // 0.3g fore/aft
    const transverseAcc = 0.5; // 0.5g port/starboard  
    const verticalAcc = 1.0; // 1.0g upward

    return {
      longitudinal: cargoWeight * longitudinalAcc * 9.81, // kN
      transverse: cargoWeight * transverseAcc * 9.81, // kN
      vertical: cargoWeight * verticalAcc * 9.81 // kN
    };
  };

  // Draft survey calculation
  const calculateDraftSurvey = (survey: DraftSurveyData, TPC: number = 25): number => {
    // Calculate mean drafts
    const meanDraftBefore = (survey.draftForeBefore + survey.draftMidBefore + survey.draftAftBefore) / 3;
    const meanDraftAfter = (survey.draftForeAfter + survey.draftMidAfter + survey.draftAftAfter) / 3;
    
    // Draft change
    const draftChange = meanDraftAfter - meanDraftBefore;
    
    // Apply corrections
    const correctedDraftChange = draftChange + 
      survey.densityCorrection + 
      survey.trimCorrection + 
      survey.deformationCorrection;
    
    // Calculate cargo weight
    return correctedDraftChange * TPC; // tonnes
  };

  // Grain stability calculation - IMO Grain Code
  const calculateGrainStability = (data: GrainStabilityData) => {
    // Shifting moment calculation
    const grainSurface = data.filled_volume / (data.volumetricWeight * 1000); // m²
    const shiftingMoment = grainSurface * Math.tan(data.angle_of_repose * Math.PI / 180) * 0.5;
    
    // Heeling moment due to grain shift
    const heelAngle = Math.atan(shiftingMoment / (data.volumetricWeight * 9.81));
    
    return {
      shiftingMoment,
      heelAngle: heelAngle * 180 / Math.PI,
      stabilityLoss: shiftingMoment * 0.1 // Simplified
    };
  };

  // Main cargo calculation
  const calculateCargo = () => {
    if (!cargoData.deadweight || !cargoData.cargoWeight) {
      toast({
        title: "Eksik Veri",
        description: "Lütfen gerekli değerleri girin.",
        variant: "destructive"
      });
      return;
    }

    const data = cargoData as CargoData;
    
    // Basic calculations
    const loadedDisplacement = (data.lightDisplacement || 5000) + data.cargoWeight;
    const utilizationPercentage = calculateDWT(data.cargoWeight, data.deadweight);
    
    // Volume calculations
    const stowageEfficiency = data.cargoVolume ? 
      (data.cargoWeight / data.cargoVolume) : 
      (1 / (data.stowageFactor || 1.5));
    
    const holdVolume = (data.holdLength || 30) * (data.holdBreadth || 20) * (data.holdHeight || 12);
    const brokenStowage = data.cargoVolume ? 
      calculateBrokenStowage(data.cargoVolume, holdVolume) : 15;
    
    // Center of gravity calculations
    const newKG = calculateNewCG(
      data.lightDisplacement || 5000,
      8.5, // Assumed light ship KG
      data.cargoWeight,
      data.cargoVCG || 6.0
    );
    
    const newLCG = ((data.lightDisplacement || 5000) * 70 + data.cargoWeight * (data.cargoLCG || 70)) / 
      loadedDisplacement;
    
    // Stability status
    let stabilityStatus: CargoResult['stabilityStatus'] = 'good';
    if (newKG > 9.5) stabilityStatus = 'poor';
    else if (newKG > 8.8) stabilityStatus = 'acceptable';
    
    // Securing forces
    const securityForces = calculateSecuringForces(data.cargoWeight);
    
    // Loading sequence recommendations
    const recommendedSequence = [
      "1. Düşük ağırlık merkezli yüklerden başla",
      "2. Ağır yükleri hold tabanına yerleştir", 
      "3. Stabiliteli kontrol et",
      "4. Trim dengeyi koru",
      "5. Securing işlemlerini tamamla"
    ];
    
    // Recommendations
    const recommendations: string[] = [];
    if (utilizationPercentage < 85) {
      recommendations.push("DWT kullanımı düşük - daha fazla yük alabilirsiniz");
    }
    if (brokenStowage > 20) {
      recommendations.push("Broken stowage yüksek - yük düzenini optimize edin");
    }
    if (stabilityStatus === 'poor') {
      recommendations.push("Stabilite riski - yük dağılımını yeniden düzenleyin");
    }
    if (securityForces.transverse > data.cargoWeight * 1000) {
      recommendations.push("Güçlendirme sistemlerini kontrol edin");
    }
    
    const result: CargoResult = {
      loadedDisplacement,
      cargoCapacity: data.deadweight,
      utilizationPercentage,
      stowageEfficiency,
      brokenStowage,
      newKG,
      newLCG,
      stabilityStatus,
      recommendedSequence,
      securityForces,
      recommendations
    };
    
    setResult(result);
    
    toast({
      title: "Kargo Hesaplandı",
      description: `DWT Kullanımı: ${utilizationPercentage.toFixed(1)}%`,
      variant: stabilityStatus === 'poor' ? "destructive" : "default"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'acceptable': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            Yükleme ve Boşaltma Hesaplamaları
          </CardTitle>
          <CardDescription>
            IMO CSS Code, IMDG Code ve SOLAS Chapter VII standartlarına uygun kargo analizi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="loading">Yükleme</TabsTrigger>
              <TabsTrigger value="survey">Draft Survey</TabsTrigger>
              <TabsTrigger value="grain">Tahıl Stabilitesi</TabsTrigger>
              <TabsTrigger value="securing">Güçlendirme</TabsTrigger>
              <TabsTrigger value="planning">Planlama</TabsTrigger>
            </TabsList>

            <TabsContent value="loading" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deadweight">Deadweight [ton]</Label>
                  <Input
                    id="deadweight"
                    type="number"
                    value={cargoData.deadweight || ''}
                    onChange={(e) => setCargoData({...cargoData, deadweight: parseFloat(e.target.value)})}
                    placeholder="15000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargoWeight">Kargo Ağırlığı [ton]</Label>
                  <Input
                    id="cargoWeight"
                    type="number"
                    value={cargoData.cargoWeight || ''}
                    onChange={(e) => setCargoData({...cargoData, cargoWeight: parseFloat(e.target.value)})}
                    placeholder="12000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lightDisplacement">Light Ship [ton]</Label>
                  <Input
                    id="lightDisplacement"
                    type="number"
                    value={cargoData.lightDisplacement || ''}
                    onChange={(e) => setCargoData({...cargoData, lightDisplacement: parseFloat(e.target.value)})}
                    placeholder="5000"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cargoVolume">Kargo Hacmi [m³]</Label>
                  <Input
                    id="cargoVolume"
                    type="number"
                    value={cargoData.cargoVolume || ''}
                    onChange={(e) => setCargoData({...cargoData, cargoVolume: parseFloat(e.target.value)})}
                    placeholder="18000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stowageFactor">Stowage Factor [m³/ton]</Label>
                  <Input
                    id="stowageFactor"
                    type="number"
                    step="0.1"
                    value={cargoData.stowageFactor || ''}
                    onChange={(e) => setCargoData({...cargoData, stowageFactor: parseFloat(e.target.value)})}
                    placeholder="1.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grossTonnage">Gross Tonnage</Label>
                  <Input
                    id="grossTonnage"
                    type="number"
                    value={cargoData.grossTonnage || ''}
                    onChange={(e) => setCargoData({...cargoData, grossTonnage: parseFloat(e.target.value)})}
                    placeholder="8500"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cargoLCG">Kargo LCG (Kıçtan) [m]</Label>
                  <Input
                    id="cargoLCG"
                    type="number"
                    value={cargoData.cargoLCG || ''}
                    onChange={(e) => setCargoData({...cargoData, cargoLCG: parseFloat(e.target.value)})}
                    placeholder="70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargoTCG">Kargo TCG (CL'den) [m]</Label>
                  <Input
                    id="cargoTCG"
                    type="number"
                    value={cargoData.cargoTCG || ''}
                    onChange={(e) => setCargoData({...cargoData, cargoTCG: parseFloat(e.target.value)})}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargoVCG">Kargo VCG (Baseline'dan) [m]</Label>
                  <Input
                    id="cargoVCG"
                    type="number"
                    value={cargoData.cargoVCG || ''}
                    onChange={(e) => setCargoData({...cargoData, cargoVCG: parseFloat(e.target.value)})}
                    placeholder="6.0"
                  />
                </div>
              </div>

              <Button onClick={calculateCargo} className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Kargo Hesapla
              </Button>

              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Kargo Sonuçları
                      <Badge className={getStatusColor(result.stabilityStatus)}>
                        {result.stabilityStatus.toUpperCase()}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{result.utilizationPercentage.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">DWT Kullanımı</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{result.loadedDisplacement.toFixed(0)}</div>
                        <div className="text-sm text-muted-foreground">Yüklü Deplasman (ton)</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{result.brokenStowage.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">Broken Stowage</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{result.newKG.toFixed(2)}m</div>
                        <div className="text-sm text-muted-foreground">Yeni KG</div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2">Güçlendirme Kuvvetleri (CSS Code)</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-2 bg-muted rounded">
                          <div className="font-bold">{(result.securityForces.longitudinal/1000).toFixed(0)} kN</div>
                          <div className="text-xs">Boyuna</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <div className="font-bold">{(result.securityForces.transverse/1000).toFixed(0)} kN</div>
                          <div className="text-xs">Enine</div>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <div className="font-bold">{(result.securityForces.vertical/1000).toFixed(0)} kN</div>
                          <div className="text-xs">Dikey</div>
                        </div>
                      </div>
                    </div>

                    {result.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Öneriler</h4>
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

            <TabsContent value="survey" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Draft Survey Hesaplaması</CardTitle>
                  <CardDescription>
                    Yükleme öncesi ve sonrası draft ölçümleri
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Yükleme Öncesi</h4>
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <Input placeholder="Baş" type="number" step="0.01" />
                          <Input placeholder="Orta" type="number" step="0.01" />
                          <Input placeholder="Kıç" type="number" step="0.01" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Yükleme Sonrası</h4>
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <Input placeholder="Baş" type="number" step="0.01" />
                          <Input placeholder="Orta" type="number" step="0.01" />
                          <Input placeholder="Kıç" type="number" step="0.01" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Düzeltmeler</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Yoğunluk Düzeltmesi</Label>
                        <Input type="number" step="0.001" placeholder="0.015" />
                      </div>
                      <div className="space-y-2">
                        <Label>Trim Düzeltmesi</Label>
                        <Input type="number" step="0.001" placeholder="0.008" />
                      </div>
                      <div className="space-y-2">
                        <Label>Deformasyon Düzeltmesi</Label>
                        <Input type="number" step="0.001" placeholder="0.005" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="grain" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wheat className="h-5 w-5" />
                    Tahıl Stabilitesi
                  </CardTitle>
                  <CardDescription>
                    IMO Grain Code uygun hesaplamalar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tahıl Türü</Label>
                      <Input 
                        value={grainData.grainType || ''}
                        onChange={(e) => setGrainData({...grainData, grainType: e.target.value})}
                        placeholder="Buğday, Mısır, Soya vb."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Angle of Repose [°]</Label>
                      <Input 
                        type="number"
                        value={grainData.angle_of_repose || ''}
                        onChange={(e) => setGrainData({...grainData, angle_of_repose: parseFloat(e.target.value)})}
                        placeholder="25"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Volumetrik Ağırlık [t/m³]</Label>
                      <Input 
                        type="number"
                        step="0.01"
                        value={grainData.volumetricWeight || ''}
                        onChange={(e) => setGrainData({...grainData, volumetricWeight: parseFloat(e.target.value)})}
                        placeholder="0.75"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Dolu Hacim [m³]</Label>
                      <Input 
                        type="number"
                        value={grainData.filled_volume || ''}
                        onChange={(e) => setGrainData({...grainData, filled_volume: parseFloat(e.target.value)})}
                        placeholder="5000"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-lg">
                    <h4 className="font-semibold text-amber-800 mb-2">IMO Grain Code Kriterleri</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Tahıl kayması hesabı zorunlu</li>
                      <li>• Shifting board veya trimming gerekli</li>
                      <li>• Heeling moment kontrolü</li>
                      <li>• Stabilite kitapçığında özel prosedür</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="securing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kargo Güçlendirme Sistemleri</CardTitle>
                  <CardDescription>CSS Code standartlarına uygun güçlendirme</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose max-w-none">
                    <h4>CSS Code Accelerations:</h4>
                    <ul>
                      <li><strong>Longitudinal:</strong> 0.3g (fore/aft direction)</li>
                      <li><strong>Transverse:</strong> 0.5g (port/starboard)</li>
                      <li><strong>Vertical:</strong> 1.0g (upward direction)</li>
                    </ul>
                    
                    <h4>Güçlendirme Ekipmanları:</h4>
                    <ul>
                      <li><strong>Lashing points:</strong> SWL ≥ 1000 kg</li>
                      <li><strong>Turnbuckles:</strong> Adjustable tension</li>
                      <li><strong>Wire ropes:</strong> Stainless steel preferred</li>
                      <li><strong>Chain lashings:</strong> Heavy cargo securing</li>
                    </ul>
                    
                    <h4>Konteyner Güçlendirme:</h4>
                    <ul>
                      <li><strong>Twist locks:</strong> Corner fittings</li>
                      <li><strong>Bridge fittings:</strong> Container guides</li>
                      <li><strong>Lashing rods:</strong> Turnbuckle connections</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="planning" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Yükleme Planlaması
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result && (
                    <div>
                      <h4 className="font-semibold mb-3">Önerilen Yükleme Sırası</h4>
                      <div className="space-y-2">
                        {result.recommendedSequence.map((step, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-muted rounded">
                            <Badge variant="outline">{index + 1}</Badge>
                            <span className="text-sm">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="prose max-w-none">
                    <h4>Yükleme İlkeleri:</h4>
                    <ul>
                      <li><strong>Bottom heavy:</strong> Ağır yükler altta</li>
                      <li><strong>Even distribution:</strong> Dengeli dağılım</li>
                      <li><strong>Stability first:</strong> Önce stabilite</li>
                      <li><strong>Trim optimization:</strong> Trim dengesi</li>
                      <li><strong>Access consideration:</strong> Erişim kolaylığı</li>
                    </ul>
                    
                    <h4>IMDG Code Uygunluk:</h4>
                    <ul>
                      <li>Tehlikeli madde segregasyonu</li>
                      <li>Ventilation requirements</li>
                      <li>Temperature monitoring</li>
                      <li>Emergency procedures</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};