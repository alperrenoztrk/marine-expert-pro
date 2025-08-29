import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Ship, TrendingUp, Plus, X, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LongitudinalInputs {
  // Ship geometry
  length: number;
  breadth: number;
  draft: number;
  displacement: number;
  
  // Stability parameters
  il: number; // Longitudinal moment of inertia of waterplane area
  kg: number; // Vertical center of gravity
  lcf: number; // Longitudinal center of flotation from aft
  
  // Initial drafts
  initialDraftForward: number;
  initialDraftAft: number;
  
  // Trim moments
  moments: Array<{
    weight: number;
    distance: number;
    description: string;
  }>;
}

interface LongitudinalResults {
  gml: number; // GM_L
  bml: number; // BM_L  
  mct1cm: number; // MCT 1cm
  totalTrimMoment: number;
  trimChange: number; // cm, + by stern, - by head
  distribution: {
    aftChange: number; // cm
    forwardChange: number; // cm
  };
  newDrafts: {
    forward: number; // m
    aft: number; // m
    mean: number; // m
  };
}

export const LongitudinalStabilityCalculations = () => {
  const [inputs, setInputs] = useState<LongitudinalInputs>({
    length: 180,
    breadth: 30,
    draft: 10,
    displacement: 40500,
    il: 1458000, // Typical I_L for this size
    kg: 12,
    lcf: 90, // ~L/2
    initialDraftForward: 10,
    initialDraftAft: 10,
    moments: [
      { weight: 500, distance: 15, description: "Kargo yüklemesi" }
    ]
  });

  const [results, setResults] = useState<LongitudinalResults | null>(null);
  const [activeTab, setActiveTab] = useState("gml");
  const resultsTopRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Ensure the results section is visible after changing tabs
    // This addresses UX where users might not notice tab changes below the fold
    resultsTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Calculate results whenever inputs change
  useEffect(() => {
    calculateResults();
  }, [inputs]);

  const calculateResults = () => {
    try {
      // Calculate displacement volume (m³)
      const volume = inputs.displacement / 1.025; // Assuming seawater density 1.025 t/m³
      
      // Calculate BM_L = I_L / ∇
      const bml = inputs.il / volume;
      
      // Calculate GM_L = BM_L - BG (assuming B is at waterline, so BG = KG - KB)
      // For simplification, assume KB ≈ draft/2
      const kb = inputs.draft / 2;
      const bg = inputs.kg - kb;
      const gml = bml - bg;
      
      // Calculate MCT 1cm = (Δ × GM_L) / (100 × L_BP)
      const mct1cm = (inputs.displacement * gml) / (100 * inputs.length);
      
      // Calculate total trim moment
      const totalTrimMoment = inputs.moments.reduce((sum, moment) => {
        return sum + (moment.weight * moment.distance);
      }, 0);
      
      // Calculate trim change in cm
      const trimChange = mct1cm !== 0 ? totalTrimMoment / mct1cm : 0;
      
      // Calculate distribution about LCF
      const aftDistance = inputs.lcf;
      const forwardDistance = inputs.length - inputs.lcf;
      const aftChange = Math.abs(trimChange) * (aftDistance / inputs.length);
      const forwardChange = Math.abs(trimChange) * (forwardDistance / inputs.length);
      
      // Apply signs (positive trim = by stern)
      const signedAftChange = trimChange >= 0 ? aftChange : -aftChange;
      const signedForwardChange = trimChange >= 0 ? -forwardChange : forwardChange;
      
      // Calculate new drafts
      const newAft = inputs.initialDraftAft + signedAftChange / 100;
      const newForward = inputs.initialDraftForward + signedForwardChange / 100;
      const newMean = (newAft + newForward) / 2;
      
      setResults({
        gml,
        bml,
        mct1cm,
        totalTrimMoment,
        trimChange,
        distribution: {
          aftChange: signedAftChange,
          forwardChange: signedForwardChange
        },
        newDrafts: {
          forward: newForward,
          aft: newAft,
          mean: newMean
        }
      });
    } catch (error) {
      console.error("Calculation error:", error);
      setResults(null);
    }
  };

  const updateInput = (field: keyof LongitudinalInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const addMoment = () => {
    setInputs(prev => ({
      ...prev,
      moments: [...prev.moments, { weight: 0, distance: 0, description: "" }]
    }));
  };

  const updateMoment = (index: number, field: keyof typeof inputs.moments[0], value: string | number) => {
    setInputs(prev => ({
      ...prev,
      moments: prev.moments.map((moment, i) => 
        i === index ? { ...moment, [field]: value } : moment
      )
    }));
  };

  const removeMoment = (index: number) => {
    setInputs(prev => ({
      ...prev,
      moments: prev.moments.filter((_, i) => i !== index)
    }));
  };

  const formatNumber = (value: number, decimals: number = 2) => {
    return value.toFixed(decimals);
  };

  const getTrimStatus = (trimChange: number) => {
    const abs = Math.abs(trimChange);
    if (abs < 50) return { color: "bg-green-500", text: "İyi" };
    if (abs < 100) return { color: "bg-yellow-500", text: "Kabul Edilebilir" };
    if (abs < 200) return { color: "bg-orange-500", text: "Dikkat" };
    return { color: "bg-red-500", text: "Kritik" };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Ship className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Boyuna Stabilite Hesaplamaları</h2>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="gml">GM_L</TabsTrigger>
          <TabsTrigger value="mct">MCT 1cm</TabsTrigger>
          <TabsTrigger value="trim">Trim Değişimi</TabsTrigger>
          <TabsTrigger value="distribution">Dağılım</TabsTrigger>
          <TabsTrigger value="drafts">Yeni Draftlar</TabsTrigger>
          <TabsTrigger value="summary">Özet</TabsTrigger>
        </TabsList>

        {/* Ship Parameters */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Gemi Parametreleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="length">Uzunluk (L_BP) [m]</Label>
                <Input
                  id="length"
                  type="number"
                  value={inputs.length}
                  onChange={(e) => updateInput('length', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="breadth">Genişlik (B) [m]</Label>
                <Input
                  id="breadth"
                  type="number"
                  value={inputs.breadth}
                  onChange={(e) => updateInput('breadth', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="draft">Draft (T) [m]</Label>
                <Input
                  id="draft"
                  type="number"
                  value={inputs.draft}
                  onChange={(e) => updateInput('draft', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="displacement">Deplasman (Δ) [ton]</Label>
                <Input
                  id="displacement"
                  type="number"
                  value={inputs.displacement}
                  onChange={(e) => updateInput('displacement', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="il">I_L [m⁴]</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        id="il"
                        type="number"
                        value={inputs.il}
                        onChange={(e) => updateInput('il', parseFloat(e.target.value) || 0)}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Su hattı alanının boyuna atalet momenti</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div>
                <Label htmlFor="kg">KG [m]</Label>
                <Input
                  id="kg"
                  type="number"
                  value={inputs.kg}
                  onChange={(e) => updateInput('kg', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="lcf">LCF (kıçtan) [m]</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        id="lcf"
                        type="number"
                        value={inputs.lcf}
                        onChange={(e) => updateInput('lcf', parseFloat(e.target.value) || 0)}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Yüzdürme merkezinin kıç dikmeye mesafesi</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Initial Drafts */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Başlangıç Draftları</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="initialDraftForward">Baş Draft [m]</Label>
                <Input
                  id="initialDraftForward"
                  type="number"
                  value={inputs.initialDraftForward}
                  onChange={(e) => updateInput('initialDraftForward', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="initialDraftAft">Kıç Draft [m]</Label>
                <Input
                  id="initialDraftAft"
                  type="number"
                  value={inputs.initialDraftAft}
                  onChange={(e) => updateInput('initialDraftAft', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trim Moments */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Trim Momentleri
              <Button onClick={addMoment} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Ekle
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inputs.moments.map((moment, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <Input
                      placeholder="Açıklama"
                      value={moment.description}
                      onChange={(e) => updateMoment(index, 'description', e.target.value)}
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      placeholder="Ağırlık (ton)"
                      value={moment.weight}
                      onChange={(e) => updateMoment(index, 'weight', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      placeholder="Mesafe (m)"
                      value={moment.distance}
                      onChange={(e) => updateMoment(index, 'distance', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="w-20 text-sm text-muted-foreground">
                    {formatNumber(moment.weight * moment.distance)} t·m
                  </div>
                  {inputs.moments.length > 1 && (
                    <Button
                      onClick={() => removeMoment(index)}
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Anchor to scroll results into view when tabs change */}
        <div ref={resultsTopRef} />

        {/* Results Tabs */}
        <TabsContent value="gml">
          <Card>
            <CardHeader>
              <CardTitle>Boyuna Metasantr Yüksekliği (GM_L)</CardTitle>
              <CardDescription>
                GM_L = BM_L - BG hesabı
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results && (
                <div className="space-y-4">
                  <div className="font-mono text-sm bg-muted p-3 rounded">
                    <div className="font-semibold mb-2">Formül:</div>
                    <div>GM_L = BM_L - BG</div>
                    <div>BM_L = I_L / ∇</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Su altı hacmi (∇):</span>
                        <span>{formatNumber(inputs.displacement / 1.025)} m³</span>
                      </div>
                      <div className="flex justify-between">
                        <span>BM_L = I_L / ∇:</span>
                        <span>{formatNumber(results.bml)} m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>KB (≈ T/2):</span>
                        <span>{formatNumber(inputs.draft / 2)} m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>BG = KG - KB:</span>
                        <span>{formatNumber(inputs.kg - inputs.draft / 2)} m</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>GM_L:</span>
                        <Badge variant={results.gml > 100 ? "default" : results.gml > 50 ? "secondary" : "destructive"}>
                          {formatNumber(results.gml)} m
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {results.gml > 100 ? "Çok yüksek stabilite" : 
                         results.gml > 50 ? "İyi stabilite" : 
                         results.gml > 20 ? "Kabul edilebilir" : "Düşük stabilite"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mct">
          <Card>
            <CardHeader>
              <CardTitle>MCT 1cm (Moment to Change Trim by 1cm)</CardTitle>
              <CardDescription>
                Trimi 1 cm değiştirmek için gerekli moment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results && (
                <div className="space-y-4">
                  <div className="font-mono text-sm bg-muted p-3 rounded">
                    <div className="font-semibold mb-2">Formül:</div>
                    <div>MCT 1cm = (Δ × GM_L) / (100 × L_BP)</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Deplasman (Δ):</span>
                        <span>{formatNumber(inputs.displacement)} ton</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GM_L:</span>
                        <span>{formatNumber(results.gml)} m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>L_BP:</span>
                        <span>{formatNumber(inputs.length)} m</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>MCT 1cm:</span>
                        <Badge variant="outline">
                          {formatNumber(results.mct1cm)} t·m/cm
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        1 cm trim değişimi için gerekli moment
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trim">
          <Card>
            <CardHeader>
              <CardTitle>Trim Değişimi</CardTitle>
              <CardDescription>
                Toplam trim momentinden kaynaklanan trim değişimi
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results && (
                <div className="space-y-4">
                  <div className="font-mono text-sm bg-muted p-3 rounded">
                    <div className="font-semibold mb-2">Formül:</div>
                    <div>Trim Değişimi = Toplam Trim Momenti / MCT 1cm</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Toplam Trim Momenti:</span>
                        <span>{formatNumber(results.totalTrimMoment)} t·m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>MCT 1cm:</span>
                        <span>{formatNumber(results.mct1cm)} t·m/cm</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Trim Değişimi:</span>
                        <Badge className={getTrimStatus(results.trimChange).color}>
                          {formatNumber(results.trimChange)} cm {results.trimChange > 0 ? "(kıçtan)" : "(baştan)"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Durum: {getTrimStatus(results.trimChange).text}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Trim Dağılımı</CardTitle>
              <CardDescription>
                Trim değişiminin baş ve kıç draftlara dağılımı
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results && (
                <div className="space-y-4">
                  <div className="font-mono text-sm bg-muted p-3 rounded">
                    <div className="font-semibold mb-2">Formül:</div>
                    <div>Dağılım LCF konumuna göre orantılıdır</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>LCF kıçtan mesafe:</span>
                        <span>{formatNumber(inputs.lcf)} m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>LCF baştan mesafe:</span>
                        <span>{formatNumber(inputs.length - inputs.lcf)} m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Toplam trim:</span>
                        <span>{formatNumber(results.trimChange)} cm</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Kıç draft değişimi:</span>
                        <Badge variant={results.distribution.aftChange > 0 ? "destructive" : "default"}>
                          {formatNumber(results.distribution.aftChange, 1)} cm
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Baş draft değişimi:</span>
                        <Badge variant={results.distribution.forwardChange > 0 ? "destructive" : "default"}>
                          {formatNumber(results.distribution.forwardChange, 1)} cm
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts">
          <Card>
            <CardHeader>
              <CardTitle>Yeni Draftlar</CardTitle>
              <CardDescription>
                Trim değişimi sonrası yeni draft değerleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Başlangıç Draftları</h4>
                      <div className="flex justify-between">
                        <span>Baş draft:</span>
                        <span>{formatNumber(inputs.initialDraftForward, 2)} m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kıç draft:</span>
                        <span>{formatNumber(inputs.initialDraftAft, 2)} m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ortalama draft:</span>
                        <span>{formatNumber((inputs.initialDraftForward + inputs.initialDraftAft) / 2, 2)} m</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Yeni Draftlar</h4>
                      <div className="flex justify-between items-center">
                        <span>Baş draft:</span>
                        <Badge variant="outline">
                          {formatNumber(results.newDrafts.forward, 2)} m
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Kıç draft:</span>
                        <Badge variant="outline">
                          {formatNumber(results.newDrafts.aft, 2)} m
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Ortalama draft:</span>
                        <Badge variant="default">
                          {formatNumber(results.newDrafts.mean, 2)} m
                        </Badge>
                      </div>
                    </div>
                  </div>

                  
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Trim Durumu</h4>
                    <p className="text-sm">
                      Mevcut trim: {formatNumber(results.newDrafts.aft - results.newDrafts.forward, 2)} m 
                      {(results.newDrafts.aft - results.newDrafts.forward) > 0 ? " (kıçtan)" : " (baştan)"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Hesaplama Özeti
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{formatNumber(results.gml)}</div>
                      <div className="text-sm text-muted-foreground">GM_L (m)</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{formatNumber(results.mct1cm)}</div>
                      <div className="text-sm text-muted-foreground">MCT 1cm (t·m/cm)</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{formatNumber(results.trimChange)}</div>
                      <div className="text-sm text-muted-foreground">Trim Değişimi (cm)</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{formatNumber(results.totalTrimMoment)}</div>
                      <div className="text-sm text-muted-foreground">Toplam Moment (t·m)</div>
                    </div>
                  </div>

                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">Değerlendirme</h4>
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>Boyuna Stabilite:</span>
                        <Badge variant={results.gml > 100 ? "default" : results.gml > 50 ? "secondary" : "destructive"}>
                          {results.gml > 100 ? "Çok İyi" : results.gml > 50 ? "İyi" : "Zayıf"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>Trim Durumu:</span>
                        <Badge className={getTrimStatus(results.trimChange).color}>
                          {getTrimStatus(results.trimChange).text}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>Operasyonel Durum:</span>
                        <Badge variant={Math.abs(results.trimChange) < 100 ? "default" : "destructive"}>
                          {Math.abs(results.trimChange) < 100 ? "Operasyonel" : "Dikkat Gerekli"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};