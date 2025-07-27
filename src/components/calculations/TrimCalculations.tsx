import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, TrendingUp, AlertTriangle, CheckCircle, Activity } from "lucide-react";
import { toast } from "sonner";

interface TrimData {
  // Ship Parameters
  L: number; // Length between perpendiculars (m)
  B: number; // Breadth (m)
  displacement: number; // Current displacement (tonnes)
  LCF: number; // Longitudinal Center of Flotation from AP (m)
  MCT: number; // Moment to Change Trim 1 cm (tonne.m/cm)
  TPC: number; // Tonnes per Centimeter immersion
  
  // Current condition
  draftForward: number; // Forward draft (m)
  draftAft: number; // Aft draft (m)
  
  // Weight operations
  weightAdded: number; // Weight to be added/removed (tonnes)
  weightLCG: number; // Longitudinal position of weight from AP (m)
}

interface TrimResult {
  currentTrim: number; // Current trim (m)
  trimMoment: number; // Trim moment (tonne.m)
  trimChange: number; // Change in trim (cm)
  newTrimBy: number; // New trim condition (m)
  newDraftForward: number; // New forward draft (m)
  newDraftAft: number; // New aft draft (m)
  newMeanDraft: number; // New mean draft (m)
  bodydenChange: number; // Change due to bodily sinkage (cm)
  status: 'acceptable' | 'warning' | 'excessive';
  recommendations: string[];
}

interface DisplacementData {
  displacement: number;
  meanDraft: number;
  TPC: number;
  LCF: number;
  MCT: number;
}

export const TrimCalculations = () => {
  
  
  const [trimData, setTrimData] = useState<Partial<TrimData>>({});
  const [result, setResult] = useState<TrimResult | null>(null);
  const [activeTab, setActiveTab] = useState("basic");

  // Calculate current trim
  const calculateCurrentTrim = (draftAft: number, draftForward: number): number => {
    return draftAft - draftForward; // Positive = trim by stern
  };

  // Calculate mean draft
  const calculateMeanDraft = (draftForward: number, draftAft: number): number => {
    return (draftForward + draftAft) / 2;
  };

  // Calculate trim moment
  const calculateTrimMoment = (weight: number, distance: number, LCF: number): number => {
    return weight * (distance - LCF);
  };

  // Calculate change in trim due to weight addition/removal
  const calculateTrimChange = (trimMoment: number, MCT: number): number => {
    return trimMoment / MCT; // Result in cm
  };

  // Calculate bodily sinkage/rise
  const calculateBodilyChange = (weight: number, TPC: number): number => {
    return weight / TPC; // Result in cm
  };

  // Calculate new drafts after weight operation
  const calculateNewDrafts = (
    currentDraftF: number,
    currentDraftA: number,
    bodilyChange: number,
    trimChange: number,
    L: number,
    LCF: number
  ) => {
    const bodilyChangeM = bodilyChange / 100; // Convert to meters
    const trimChangeM = trimChange / 100; // Convert to meters
    
    // New mean draft
    const newMeanDraft = calculateMeanDraft(currentDraftF, currentDraftA) + bodilyChangeM;
    
    // Trim moment lever arms
    const leverAft = (L / 2) - LCF;
    const leverForward = (L / 2) + LCF;
    
    // New drafts
    const newDraftAft = newMeanDraft + (trimChangeM * leverAft / L);
    const newDraftForward = newMeanDraft - (trimChangeM * leverForward / L);
    
    return {
      newDraftForward,
      newDraftAft,
      newMeanDraft
    };
  };

  // Calculate TPC (Tonnes per Centimeter) - simplified
  const calculateTPC = (L: number, B: number, CB: number = 0.75): number => {
    const waterplaneArea = L * B * CB * 0.85; // 0.85 = waterplane coefficient (typical)
    return (waterplaneArea * 1.025) / 100; // 1.025 = seawater density
  };

  // Calculate MCT (Moment to Change Trim 1 cm)
  const calculateMCT = (displacement: number, GML: number): number => {
    // GML = Longitudinal metacentric height (typically 100-200m for cargo ships)
    const GML_estimated = displacement * 0.008; // Simplified estimation
    return (displacement * GML_estimated) / 100;
  };

  // Main trim calculation
  const calculateTrim = () => {
    if (!trimData.L || !trimData.displacement || !trimData.draftForward || 
        !trimData.draftAft || !trimData.LCF) {
      toast({
        title: "Eksik Veri",
        description: "Lütfen gerekli değerleri girin.",
        variant: "destructive"
      });
      return;
    }

    const data = trimData as TrimData;
    
    // Calculate current condition
    const currentTrim = calculateCurrentTrim(data.draftAft, data.draftForward);
    const currentMeanDraft = calculateMeanDraft(data.draftForward, data.draftAft);
    
    // Calculate or use provided TPC and MCT
    const TPC = data.TPC || calculateTPC(data.L, data.B || 25);
    const MCT = data.MCT || calculateMCT(data.displacement, data.L);
    
    // Weight operation calculations
    const weightAdded = data.weightAdded || 0;
    const weightLCG = data.weightLCG || data.LCF;
    
    const trimMoment = calculateTrimMoment(weightAdded, weightLCG, data.LCF);
    const trimChange = calculateTrimChange(trimMoment, MCT);
    const bodilyChange = calculateBodilyChange(weightAdded, TPC);
    
    // Calculate new drafts
    const { newDraftForward, newDraftAft, newMeanDraft } = calculateNewDrafts(
      data.draftForward,
      data.draftAft,
      bodilyChange,
      trimChange,
      data.L,
      data.LCF
    );
    
    const newTrimBy = newDraftAft - newDraftForward;
    
    // Status determination
    let status: TrimResult['status'] = 'acceptable';
    if (Math.abs(newTrimBy) > data.L * 0.015) status = 'excessive'; // > 1.5% of L
    else if (Math.abs(newTrimBy) > data.L * 0.01) status = 'warning'; // > 1% of L
    
    // Recommendations
    const recommendations: string[] = [];
    if (Math.abs(newTrimBy) > data.L * 0.01) {
      recommendations.push("Trim değeri yüksek - balast transferi yapın");
    }
    if (newTrimBy > 0) {
      recommendations.push("Kıç trim (by stern) - baş bölgeye balast alın");
    } else if (newTrimBy < 0) {
      recommendations.push("Baş trim (by head) - kıç bölgeye balast alın");
    }
    if (newMeanDraft > currentMeanDraft + 0.5) {
      recommendations.push("Draft artışı yüksek - yük düzeni kontrol edin");
    }
    
    const result: TrimResult = {
      currentTrim,
      trimMoment,
      trimChange,
      newTrimBy,
      newDraftForward,
      newDraftAft,
      newMeanDraft,
      bodydenChange: bodilyChange,
      status,
      recommendations
    };
    
    setResult(result);
    
    toast({
      title: "Trim Hesaplandı",
      description: `Yeni trim: ${newTrimBy > 0 ? 'Stern' : 'Head'} ${Math.abs(newTrimBy).toFixed(3)}m`,
      variant: status === 'excessive' ? "destructive" : "default"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'acceptable': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'excessive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Trim ve Denge Hesaplamaları
          </CardTitle>
          <CardDescription>
            IMO Load Line Convention ve SOLAS standartlarına uygun trim analizi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Temel Trim</TabsTrigger>
              <TabsTrigger value="operations">Yük İşlemleri</TabsTrigger>
              <TabsTrigger value="hydrostatic">Hidrostatik</TabsTrigger>
              <TabsTrigger value="analysis">Analiz</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="L">Dikmeler Arası Boy (L) [m]</Label>
                  <Input
                    id="L"
                    type="number"
                    value={trimData.L || ''}
                    onChange={(e) => setTrimData({...trimData, L: parseFloat(e.target.value)})}
                    placeholder="140"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displacement">Deplasman [ton]</Label>
                  <Input
                    id="displacement"
                    type="number"
                    value={trimData.displacement || ''}
                    onChange={(e) => setTrimData({...trimData, displacement: parseFloat(e.target.value)})}
                    placeholder="15000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="LCF">LCF (Kıçtan) [m]</Label>
                  <Input
                    id="LCF"
                    type="number"
                    value={trimData.LCF || ''}
                    onChange={(e) => setTrimData({...trimData, LCF: parseFloat(e.target.value)})}
                    placeholder="68"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="draftForward">Baş Draft [m]</Label>
                  <Input
                    id="draftForward"
                    type="number"
                    step="0.01"
                    value={trimData.draftForward || ''}
                    onChange={(e) => setTrimData({...trimData, draftForward: parseFloat(e.target.value)})}
                    placeholder="7.50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="draftAft">Kıç Draft [m]</Label>
                  <Input
                    id="draftAft"
                    type="number"
                    step="0.01"
                    value={trimData.draftAft || ''}
                    onChange={(e) => setTrimData({...trimData, draftAft: parseFloat(e.target.value)})}
                    placeholder="7.80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="TPC">TPC [ton/cm]</Label>
                  <Input
                    id="TPC"
                    type="number"
                    step="0.1"
                    value={trimData.TPC || ''}
                    onChange={(e) => setTrimData({...trimData, TPC: parseFloat(e.target.value)})}
                    placeholder="25.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="MCT">MCT [ton.m/cm]</Label>
                  <Input
                    id="MCT"
                    type="number"
                    value={trimData.MCT || ''}
                    onChange={(e) => setTrimData({...trimData, MCT: parseFloat(e.target.value)})}
                    placeholder="180"
                  />
                </div>
              </div>

              <Button onClick={calculateTrim} className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Trim Hesapla
              </Button>

              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Trim Sonuçları
                      <Badge className={getStatusColor(result.status)}>
                        {result.status.toUpperCase()}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">
                          {result.currentTrim > 0 ? '+' : ''}{result.currentTrim.toFixed(3)}m
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Mevcut Trim {result.currentTrim > 0 ? '(Stern)' : '(Head)'}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">
                          {result.newTrimBy > 0 ? '+' : ''}{result.newTrimBy.toFixed(3)}m
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Yeni Trim {result.newTrimBy > 0 ? '(Stern)' : '(Head)'}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{result.trimChange.toFixed(1)}cm</div>
                        <div className="text-sm text-muted-foreground">Trim Değişimi</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{result.bodydenChange.toFixed(1)}cm</div>
                        <div className="text-sm text-muted-foreground">Batma/Çıkma</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold">{result.newDraftForward.toFixed(3)}m</div>
                        <div className="text-sm text-muted-foreground">Yeni Baş Draft</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold">{result.newMeanDraft.toFixed(3)}m</div>
                        <div className="text-sm text-muted-foreground">Yeni Ortalama Draft</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold">{result.newDraftAft.toFixed(3)}m</div>
                        <div className="text-sm text-muted-foreground">Yeni Kıç Draft</div>
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

            <TabsContent value="operations" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weightAdded">Eklenen/Çıkarılan Ağırlık [ton]</Label>
                  <Input
                    id="weightAdded"
                    type="number"
                    value={trimData.weightAdded || ''}
                    onChange={(e) => setTrimData({...trimData, weightAdded: parseFloat(e.target.value)})}
                    placeholder="500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weightLCG">Ağırlık Pozisyonu (Kıçtan) [m]</Label>
                  <Input
                    id="weightLCG"
                    type="number"
                    value={trimData.weightLCG || ''}
                    onChange={(e) => setTrimData({...trimData, weightLCG: parseFloat(e.target.value)})}
                    placeholder="45"
                  />
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Yük İşlemi Örnekleri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm">
                    <strong>Balast Alma:</strong> Pozitif ağırlık, tank pozisyonu
                  </div>
                  <div className="text-sm">
                    <strong>Balast Verme:</strong> Negatif ağırlık
                  </div>
                  <div className="text-sm">
                    <strong>Kargo Yükleme:</strong> Pozitif ağırlık, hold pozisyonu
                  </div>
                  <div className="text-sm">
                    <strong>Yakıt Tüketimi:</strong> Negatif ağırlık, tank pozisyonu
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hydrostatic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hidrostatik Özellikler</CardTitle>
                  <CardDescription>
                    Gemi formuna bağlı hidrostatik parametreler
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose max-w-none">
                    <h4>Temel Formüller:</h4>
                    <ul>
                      <li><strong>TPC = (Aw × ρ) / 100</strong> (Tonnes per Centimeter)</li>
                      <li><strong>MCT = (Δ × GML) / 100</strong> (Moment to Change Trim)</li>
                      <li><strong>Trim = (W × d) / MCT</strong> (Trim change)</li>
                      <li><strong>Bodily sinkage = W / TPC</strong> (Vertical displacement)</li>
                    </ul>
                    
                    <h4>Semboller:</h4>
                    <ul>
                      <li><strong>Aw:</strong> Su hattı alanı (m²)</li>
                      <li><strong>ρ:</strong> Su yoğunluğu (1.025 t/m³)</li>
                      <li><strong>GML:</strong> Boyuna metasantrik yükseklik (m)</li>
                      <li><strong>LCF:</strong> Boyuna yüzdürme merkezi (m)</li>
                      <li><strong>LCB:</strong> Boyuna yüzdürme merkezi (m)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Trim Analizi ve Regülasyonlar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose max-w-none">
                    <h4>IMO Load Line Convention:</h4>
                    <ul>
                      <li>Trim değeri gemi boyunun %2'sini geçmemeli</li>
                      <li>Even keel şartında optimum performans</li>
                      <li>Aşırı trim yakıt tüketimini artırır</li>
                    </ul>
                    
                    <h4>SOLAS Chapter II-1:</h4>
                    <ul>
                      <li>Stabilite hesaplamalarında trim etkisi</li>
                      <li>Hasar stabilitesinde trim kontrolü</li>
                      <li>Yük dağılımı ve trim optimizasyonu</li>
                    </ul>
                    
                    <h4>Operasyonel Limitler:</h4>
                    <ul>
                      <li><strong>Kabul edilebilir:</strong> |Trim| ≤ 1% × L</li>
                      <li><strong>Uyarı:</strong> 1% × L &lt; |Trim| ≤ 1.5% × L</li>
                      <li><strong>Aşırı:</strong> |Trim| &gt; 1.5% × L</li>
                    </ul>
                    
                    <h4>Trim Etkileri:</h4>
                    <ul>
                      <li><strong>Stern trim:</strong> Daha iyi manevra, artan direnç</li>
                      <li><strong>Head trim:</strong> Daha hızlı, pervane ventilasiyon riski</li>
                      <li><strong>Even keel:</strong> Optimum hidrodinamik performans</li>
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