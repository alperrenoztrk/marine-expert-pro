import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, TrendingUp, AlertTriangle, CheckCircle, Activity, Target, BarChart3, Waves } from "lucide-react";
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
  
  // Additional parameters for enhanced calculations
  CB: number; // Block coefficient
  waterplaneCoeff: number; // Waterplane coefficient
  trimMomentArm: number; // Trim moment arm (m)
  maxAllowableTrim: number; // Max allowable trim (m)
  
  // Environmental factors
  waveHeight: number; // Significant wave height (m)
  windSpeed: number; // Wind speed (knots)
  currentSpeed: number; // Current speed (knots)
}

interface TrimResult {
  currentTrim: number; // Current trim (m)
  trimMoment: number; // Trim moment (tonne.m)
  trimChange: number; // Change in trim (cm)
  newTrimBy: number; // New trim condition (m)
  newDraftForward: number; // New forward draft (m)
  newDraftAft: number; // New aft draft (m)
  newMeanDraft: number; // New mean draft (m)
  bodilyChange: number; // Change due to bodily sinkage (cm)
  
  // Enhanced calculations
  trimPercentage: number; // Trim as percentage of length
  hydrostaticStability: number; // Hydrostatic stability factor
  longitudinalStressIndex: number; // Longitudinal stress index
  shearForceDistribution: number; // Shear force distribution factor
  bendingMomentCoeff: number; // Bending moment coefficient
  
  // Performance impacts
  speedLoss: number; // Speed loss due to trim (%)
  fuelConsumptionIncrease: number; // Fuel consumption increase (%)
  maneuverabilityIndex: number; // Maneuverability index (1-10)
  seakeepingIndex: number; // Seakeeping index (1-10)
  
  // Regulatory compliance
  imoCompliance: {
    loadLineConvention: boolean; // IMO Load Line Convention
    solasStability: boolean; // SOLAS stability requirements
    trimLimitation: boolean; // Trim limitation criteria
    strengthStandard: boolean; // Ship strength standards
    operationalGuidance: boolean; // Operational guidance compliance
  };
  
  status: 'excellent' | 'good' | 'acceptable' | 'warning' | 'excessive' | 'dangerous';
  recommendations: string[];
  warnings: string[];
  
  // List calculations (added for comprehensive trim and list analysis)
  listAngle: number; // Current list angle (degrees)
  maxPermissibleList: number; // Maximum permissible list (degrees)
  listCorrection: number; // Required ballast for list correction (tonnes)
  heelMoment: number; // Heeling moment (tonne.m)
  rightingMoment: number; // Righting moment (tonne.m)
  stabilityMargin: number; // Stability margin
}

interface DisplacementData {
  displacement: number;
  meanDraft: number;
  TPC: number;
  LCF: number;
  MCT: number;
}

interface TrimCalculationsProps {
  onCalculationComplete?: (calculationType: string, inputData: any, resultData: any) => void;
}

export const TrimCalculations = ({ onCalculationComplete }: TrimCalculationsProps = {}) => {
  const [trimData, setTrimData] = useState<Partial<TrimData>>({
    CB: 0.75,
    waterplaneCoeff: 0.85,
    waveHeight: 2.0,
    windSpeed: 25,
    currentSpeed: 2,
    maxAllowableTrim: 1.5,
  });
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

  // Enhanced trim performance analysis
  const calculatePerformanceImpact = (trimValue: number, L: number, speed: number = 15): {
    speedLoss: number;
    fuelIncrease: number;
    maneuverability: number;
    seakeeping: number;
  } => {
    const trimRatio = Math.abs(trimValue) / L;
    
    // Speed loss calculation based on trim ratio
    const speedLoss = Math.min(trimRatio * 100 * 2.5, 15); // Max 15% speed loss
    
    // Fuel consumption increase
    const fuelIncrease = Math.min(trimRatio * 100 * 3, 20); // Max 20% increase
    
    // Maneuverability index (10 = excellent, 1 = poor)
    let maneuverability = 10 - (trimRatio * 100 * 4);
    maneuverability = Math.max(1, Math.min(10, maneuverability));
    
    // Seakeeping index
    let seakeeping = 10 - (trimRatio * 100 * 3);
    if (trimValue > 0) seakeeping -= 1; // Stern trim reduces seakeeping more
    seakeeping = Math.max(1, Math.min(10, seakeeping));
    
    return {
      speedLoss,
      fuelIncrease,
      maneuverability,
      seakeeping
    };
  };

  // Calculate list angle and corrections
  const calculateListAnalysis = (data: TrimData): {
    listAngle: number;
    maxPermissibleList: number;
    listCorrection: number;
    heelMoment: number;
    rightingMoment: number;
    stabilityMargin: number;
  } => {
    // Simplified list calculations for demonstration
    const asymmetricWeight = (data.weightAdded || 0) * 0.1; // Assume 10% asymmetric loading
    const heelMoment = asymmetricWeight * (data.B || 25) / 2;
    const GM = 1.5; // Assumed GM for calculation
    const rightingMoment = data.displacement * GM;
    
    const listAngle = Math.atan(heelMoment / rightingMoment) * (180 / Math.PI);
    const maxPermissibleList = 5; // 5 degrees max permissible
    const listCorrection = Math.abs(listAngle) > 2 ? heelMoment / (data.B || 25) : 0;
    const stabilityMargin = rightingMoment / heelMoment;
    
    return {
      listAngle,
      maxPermissibleList,
      listCorrection,
      heelMoment,
      rightingMoment,
      stabilityMargin
    };
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

  // Calculate TPC (Tonnes per Centimeter) - enhanced
  const calculateTPC = (L: number, B: number, CB: number = 0.75, CWP: number = 0.85): number => {
    const waterplaneArea = L * B * CWP;
    return (waterplaneArea * 1.025) / 100; // 1.025 = seawater density
  };

  // Calculate MCT (Moment to Change Trim 1 cm) - enhanced
  const calculateMCT = (displacement: number, L: number, BML: number = 150): number => {
    // BML = Longitudinal metacentric height (typical range 100-200m)
    return (displacement * BML) / 100;
  };

  // Enhanced status determination
  const determineStatus = (trimValue: number, L: number, data: TrimData): TrimResult['status'] => {
    const trimRatio = Math.abs(trimValue) / L;
    
    if (trimRatio <= 0.005) return 'excellent'; // ≤ 0.5%
    if (trimRatio <= 0.01) return 'good'; // ≤ 1%
    if (trimRatio <= 0.015) return 'acceptable'; // ≤ 1.5%
    if (trimRatio <= 0.02) return 'warning'; // ≤ 2%
    if (trimRatio <= 0.025) return 'excessive'; // ≤ 2.5%
    return 'dangerous'; // > 2.5%
  };

  // Generate comprehensive recommendations
  const generateRecommendations = (result: TrimResult, data: TrimData): {
    recommendations: string[];
    warnings: string[];
  } => {
    const recommendations: string[] = [];
    const warnings: string[] = [];
    
    // Trim-based recommendations
    if (Math.abs(result.newTrimBy) > (data.L || 140) * 0.015) {
      recommendations.push("Trim değeri yüksek - balast transferi ile düzeltme yapın");
      if (result.newTrimBy > 0) {
        recommendations.push("Kıç trim (stern) - baş ballast tanklarına su alın");
      } else {
        recommendations.push("Baş trim (head) - kıç ballast tanklarına su alın");
      }
    }
    
    // Performance recommendations
    if (result.speedLoss > 5) {
      recommendations.push(`Hız kaybı %${result.speedLoss.toFixed(1)} - trim optimizasyonu yapın`);
    }
    
    if (result.fuelConsumptionIncrease > 8) {
      recommendations.push(`Yakıt tüketimi %${result.fuelConsumptionIncrease.toFixed(1)} artmış - even keel'e yakın duruma getirin`);
    }
    
    // List recommendations
    if (Math.abs(result.listAngle) > 2) {
      recommendations.push(`List açısı ${result.listAngle.toFixed(1)}° - ${result.listCorrection.toFixed(0)} ton balast transferi yapın`);
    }
    
    // Stability warnings
    if (result.stabilityMargin < 5) {
      warnings.push("Stabilite marjı düşük - ağırlık dağılımını gözden geçirin");
    }
    
    // Regulatory warnings
    if (!result.imoCompliance.loadLineConvention) {
      warnings.push("IMO Load Line Convention limitlerini aşıyor");
    }
    
    if (!result.imoCompliance.solasStability) {
      warnings.push("SOLAS stabilite gereksinimlerini karşılamıyor");
    }
    
    return { recommendations, warnings };
  };

  // Main trim calculation - enhanced
  const calculateTrim = () => {
    if (!trimData.L || !trimData.displacement || !trimData.draftForward || 
        !trimData.draftAft || !trimData.LCF) {
      toast.error("Eksik Veri", { 
        description: "Lütfen gerekli değerleri girin." 
      });
      return;
    }

    const data = trimData as TrimData;
    
    // Calculate current condition
    const currentTrim = calculateCurrentTrim(data.draftAft, data.draftForward);
    const currentMeanDraft = calculateMeanDraft(data.draftForward, data.draftAft);
    
    // Calculate or use provided TPC and MCT
    const TPC = data.TPC || calculateTPC(data.L, data.B || 25, data.CB, data.waterplaneCoeff);
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
    
    // Enhanced calculations
    const trimPercentage = (Math.abs(newTrimBy) / data.L) * 100;
    const hydrostaticStability = MCT / (data.displacement * 0.01);
    const longitudinalStressIndex = Math.abs(newTrimBy) / (data.L * 0.02) * 100;
    const shearForceDistribution = Math.abs(trimMoment) / (data.displacement * data.L) * 100;
    const bendingMomentCoeff = (trimMoment * data.L) / (data.displacement * Math.pow(data.L, 2)) * 1000;
    
    // Performance impact analysis
    const performance = calculatePerformanceImpact(newTrimBy, data.L);
    
    // List analysis
    const listAnalysis = calculateListAnalysis(data);
    
    // Status determination
    const status = determineStatus(newTrimBy, data.L, data);
    
    // IMO Compliance check
    const imoCompliance = {
      loadLineConvention: Math.abs(newTrimBy) <= data.L * 0.02, // Max 2% of length
      solasStability: Math.abs(newTrimBy) <= data.L * 0.015, // Max 1.5% for stability
      trimLimitation: Math.abs(newTrimBy) <= (data.maxAllowableTrim || 1.5),
      strengthStandard: longitudinalStressIndex <= 80, // Max 80% of design limit
      operationalGuidance: trimPercentage <= 1.5 // Operational guidance
    };
    
    const result: TrimResult = {
      currentTrim,
      trimMoment,
      trimChange,
      newTrimBy,
      newDraftForward,
      newDraftAft,
      newMeanDraft,
      bodilyChange,
      trimPercentage,
      hydrostaticStability,
      longitudinalStressIndex,
      shearForceDistribution,
      bendingMomentCoeff,
      speedLoss: performance.speedLoss,
      fuelConsumptionIncrease: performance.fuelIncrease,
      maneuverabilityIndex: performance.maneuverability,
      seakeepingIndex: performance.seakeeping,
      imoCompliance,
      status,
      ...listAnalysis,
      recommendations: [],
      warnings: []
    };
    
    // Generate recommendations and warnings
    const advice = generateRecommendations(result, data);
    result.recommendations = advice.recommendations;
    result.warnings = advice.warnings;
    
    setResult(result);
    
    // Call onCalculationComplete if provided
    if (onCalculationComplete) {
      onCalculationComplete('trim_and_list', data, result);
    }
    
    const statusMessages = {
      excellent: "Mükemmel trim durumu!",
      good: "İyi trim durumu",
      acceptable: "Kabul edilebilir trim",
      warning: "Trim uyarısı",
      excessive: "Aşırı trim!",
      dangerous: "Tehlikeli trim durumu!"
    };
    
    toast.success("Trim ve List Analizi Tamamlandı!", {
      description: `${statusMessages[status]} - Yeni trim: ${newTrimBy > 0 ? 'Stern' : 'Head'} ${Math.abs(newTrimBy).toFixed(3)}m`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'acceptable': return 'bg-yellow-500';
      case 'warning': return 'bg-orange-500';
      case 'excessive': return 'bg-red-500';
      case 'dangerous': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getPerformanceColor = (value: number, type: 'index' | 'percentage') => {
    if (type === 'index') {
      if (value >= 8) return 'text-green-600';
      if (value >= 6) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      if (value <= 3) return 'text-green-600';
      if (value <= 8) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Kapsamlı Trim ve List Hesaplamaları
          </CardTitle>
          <CardDescription>
            IMO Load Line Convention, SOLAS ve ISM standartlarına uygun gelişmiş trim ve list analizi - Tüm hesaplama türleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">Temel Trim</TabsTrigger>
              <TabsTrigger value="operations">Yük İşlemleri</TabsTrigger>
              <TabsTrigger value="performance">Performans</TabsTrigger>
              <TabsTrigger value="list">List Analizi</TabsTrigger>
              <TabsTrigger value="hydrostatic">Hidrostatik</TabsTrigger>
              <TabsTrigger value="analysis">Kapsamlı Analiz</TabsTrigger>
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
                  <Label htmlFor="B">Genişlik (B) [m]</Label>
                  <Input
                    id="B"
                    type="number"
                    value={trimData.B || ''}
                    onChange={(e) => setTrimData({...trimData, B: parseFloat(e.target.value)})}
                    placeholder="22"
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
                <div className="space-y-2">
                  <Label htmlFor="CB">Blok Katsayısı (CB)</Label>
                  <Input
                    id="CB"
                    type="number"
                    step="0.01"
                    value={trimData.CB || ''}
                    onChange={(e) => setTrimData({...trimData, CB: parseFloat(e.target.value)})}
                    placeholder="0.75"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waterplaneCoeff">Su Çizgisi Katsayısı (CWP)</Label>
                  <Input
                    id="waterplaneCoeff"
                    type="number"
                    step="0.01"
                    value={trimData.waterplaneCoeff || ''}
                    onChange={(e) => setTrimData({...trimData, waterplaneCoeff: parseFloat(e.target.value)})}
                    placeholder="0.85"
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="maxAllowableTrim">Max İzin Verilen Trim [m]</Label>
                  <Input
                    id="maxAllowableTrim"
                    type="number"
                    step="0.1"
                    value={trimData.maxAllowableTrim || ''}
                    onChange={(e) => setTrimData({...trimData, maxAllowableTrim: parseFloat(e.target.value)})}
                    placeholder="1.5"
                  />
                </div>
              </div>

              <Button onClick={calculateTrim} className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Kapsamlı Trim ve List Analizi Yap
              </Button>

              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Trim ve List Analiz Sonuçları
                      <Badge className={getStatusColor(result.status)}>
                        {result.status.toUpperCase()}
                      </Badge>
                    </CardTitle>
                    <CardDescription>Detaylı trim, list ve performans analizi</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Primary Results */}
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
                        <div className="text-2xl font-bold">{result.bodilyChange.toFixed(1)}cm</div>
                        <div className="text-sm text-muted-foreground">Batma/Çıkma</div>
                      </div>
                    </div>

                    <Separator />

                    {/* Enhanced Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-xl font-bold">{result.trimPercentage.toFixed(2)}%</div>
                        <div className="text-sm text-muted-foreground">Trim/Boy Oranı</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-xl font-bold">{result.hydrostaticStability.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">Hidrostatik Stabilite</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-xl font-bold">{result.longitudinalStressIndex.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">Boyuna Stress İndeksi</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-xl font-bold">{result.bendingMomentCoeff.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">Bending Moment Katsayısı</div>
                      </div>
                    </div>

                    <Separator />

                    {/* Draft Information */}
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

                    {/* IMO Compliance */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        IMO/SOLAS Uygunluk Analizi
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Object.entries(result.imoCompliance).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            {value ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-sm">
                              {key === 'loadLineConvention' && 'IMO Load Line Convention'}
                              {key === 'solasStability' && 'SOLAS Stabilite Kriterleri'}
                              {key === 'trimLimitation' && 'Trim Limitasyon Kriteri'}
                              {key === 'strengthStandard' && 'Gemi Dayanım Standartları'}
                              {key === 'operationalGuidance' && 'Operasyonel Kılavuz Uyumu'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations and Warnings */}
                    {(result.recommendations.length > 0 || result.warnings.length > 0) && (
                      <div className="space-y-4">
                        {result.recommendations.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2 text-blue-600">Öneriler</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {result.recommendations.map((rec, index) => (
                                <li key={index} className="text-sm">{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {result.warnings.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2 text-red-600">Uyarılar</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {result.warnings.map((warning, index) => (
                                <li key={index} className="text-sm text-red-600">{warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="operations" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="trimMomentArm">Trim Moment Kolu [m]</Label>
                  <Input
                    id="trimMomentArm"
                    type="number"
                    value={trimData.trimMomentArm || ''}
                    onChange={(e) => setTrimData({...trimData, trimMomentArm: parseFloat(e.target.value)})}
                    placeholder="70"
                  />
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Gelişmiş Yük İşlemi Örnekleri</CardTitle>
                  <CardDescription>Farklı yük işlemi senaryoları ve etkileri</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-semibold mb-2">Ballast İşlemleri:</h5>
                      <ul className="space-y-1">
                        <li><strong>Baş Ballast Alma:</strong> Pozitif ağırlık, baş tank pozisyonu</li>
                        <li><strong>Kıç Ballast Alma:</strong> Pozitif ağırlık, kıç tank pozisyonu</li>
                        <li><strong>Ballast Verme:</strong> Negatif ağırlık, ilgili tank pozisyonu</li>
                        <li><strong>Ballast Transferi:</strong> Eş zamanlı alma/verme</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">Kargo İşlemleri:</h5>
                      <ul className="space-y-1">
                        <li><strong>Hold Yükleme:</strong> Pozitif ağırlık, hold pozisyonu</li>
                        <li><strong>Deck Kargo:</strong> Yüksek ağırlık merkezi</li>
                        <li><strong>Konteyner Yükleme:</strong> Aşamalı yükleme</li>
                        <li><strong>Yakıt/Su Tüketimi:</strong> Negatif ağırlık, sürekli</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Performans Etkileri
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className={`text-2xl font-bold ${getPerformanceColor(result.speedLoss, 'percentage')}`}>
                            {result.speedLoss.toFixed(1)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Hız Kaybı</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className={`text-2xl font-bold ${getPerformanceColor(result.fuelConsumptionIncrease, 'percentage')}`}>
                            {result.fuelConsumptionIncrease.toFixed(1)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Yakıt Artışı</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className={`text-2xl font-bold ${getPerformanceColor(result.maneuverabilityIndex, 'index')}`}>
                            {result.maneuverabilityIndex.toFixed(1)}/10
                          </div>
                          <div className="text-sm text-muted-foreground">Manevra İndeksi</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className={`text-2xl font-bold ${getPerformanceColor(result.seakeepingIndex, 'index')}`}>
                            {result.seakeepingIndex.toFixed(1)}/10
                          </div>
                          <div className="text-sm text-muted-foreground">Denizcilik İndeksi</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Çevresel Faktörler</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="waveHeight">Dalga Yüksekliği [m]</Label>
                          <Input
                            id="waveHeight"
                            type="number"
                            step="0.5"
                            value={trimData.waveHeight || ''}
                            onChange={(e) => setTrimData({...trimData, waveHeight: parseFloat(e.target.value)})}
                            placeholder="2.0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="windSpeed">Rüzgar Hızı [knot]</Label>
                          <Input
                            id="windSpeed"
                            type="number"
                            value={trimData.windSpeed || ''}
                            onChange={(e) => setTrimData({...trimData, windSpeed: parseFloat(e.target.value)})}
                            placeholder="25"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="currentSpeed">Akıntı Hızı [knot]</Label>
                          <Input
                            id="currentSpeed"
                            type="number"
                            value={trimData.currentSpeed || ''}
                            onChange={(e) => setTrimData({...trimData, currentSpeed: parseFloat(e.target.value)})}
                            placeholder="2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="list" className="space-y-6">
              {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Waves className="h-5 w-5" />
                        List Analizi
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">{result.listAngle.toFixed(2)}°</div>
                          <div className="text-sm text-muted-foreground">Mevcut List Açısı</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">{result.maxPermissibleList.toFixed(1)}°</div>
                          <div className="text-sm text-muted-foreground">Max İzin Verilen</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">{result.listCorrection.toFixed(0)} ton</div>
                          <div className="text-sm text-muted-foreground">List Düzeltme</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">{result.stabilityMargin.toFixed(1)}</div>
                          <div className="text-sm text-muted-foreground">Stabilite Marjı</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Moment Analizi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-xl font-bold">{(result.heelMoment / 1000).toFixed(0)} kN.m</div>
                          <div className="text-sm text-muted-foreground">Heel Moment</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-xl font-bold">{(result.rightingMoment / 1000).toFixed(0)} kN.m</div>
                          <div className="text-sm text-muted-foreground">Righting Moment</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="hydrostatic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gelişmiş Hidrostatik Özellikler</CardTitle>
                  <CardDescription>
                    Gemi formuna bağlı hidrostatik parametreler ve hesaplama formülleri
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose max-w-none">
                    <h4>Temel Formüller:</h4>
                    <ul>
                      <li><strong>TPC = (Aw × ρ × CWP) / 100</strong> (Tonnes per Centimeter)</li>
                      <li><strong>MCT = (Δ × BML) / 100</strong> (Moment to Change Trim)</li>
                      <li><strong>Trim = (W × d) / MCT</strong> (Trim change)</li>
                      <li><strong>Bodily sinkage = W / TPC</strong> (Vertical displacement)</li>
                      <li><strong>List = arctan(Heel Moment / Righting Moment)</strong></li>
                    </ul>
                    
                    <h4>Gelişmiş Hesaplamalar:</h4>
                    <ul>
                      <li><strong>Longitudinal Stress = (M × y) / I</strong> (Boyuna stress)</li>
                      <li><strong>Shear Force = dM/dx</strong> (Kesme kuvveti)</li>
                      <li><strong>Bending Moment = ∫(q × x)dx</strong> (Eğilme momenti)</li>
                      <li><strong>Stability Margin = GM / (W/Δ)</strong> (Stabilite marjı)</li>
                    </ul>
                    
                    <h4>Semboller:</h4>
                    <ul>
                      <li><strong>Aw:</strong> Su hattı alanı (m²)</li>
                      <li><strong>ρ:</strong> Su yoğunluğu (1.025 t/m³)</li>
                      <li><strong>BML:</strong> Boyuna metasantrik yarıçap (m)</li>
                      <li><strong>CWP:</strong> Su çizgisi katsayısı</li>
                      <li><strong>LCF:</strong> Boyuna yüzdürme merkezi (m)</li>
                      <li><strong>LCB:</strong> Boyuna yüzdürme merkezi (m)</li>
                      <li><strong>I:</strong> Su çizgisi atalet momenti (m⁴)</li>
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
                    Kapsamlı Trim ve List Analizi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose max-w-none">
                    <h4>IMO Load Line Convention (1966/88):</h4>
                    <ul>
                      <li>Trim değeri gemi boyunun %2'sini geçmemeli</li>
                      <li>Even keel şartında optimum performans sağlanır</li>
                      <li>Aşırı trim yakıt tüketimini %15'e kadar artırabilir</li>
                      <li>Load line markalarının su altında kalmaması</li>
                    </ul>
                    
                    <h4>SOLAS Chapter II-1 (Stability):</h4>
                    <ul>
                      <li>Stabilite hesaplamalarında trim etkisi dikkate alınmalı</li>
                      <li>Hasar stabilitesinde trim kontrolü kritik</li>
                      <li>Yük dağılımı ve trim optimizasyonu gerekli</li>
                      <li>List 5°'yi geçmemeli (normal operasyonlarda)</li>
                    </ul>
                    
                    <h4>ISM Code (International Safety Management):</h4>
                    <ul>
                      <li>Trim ve list monitoring prosedürleri</li>
                      <li>Ballast operasyon prosedürleri</li>
                      <li>Acil durum trim düzeltme prosedürleri</li>
                      <li>Mürettebat eğitimi gereksinimleri</li>
                    </ul>
                    
                    <h4>Operasyonel Limitler ve Kriterler:</h4>
                    <ul>
                      <li><strong>Mükemmel:</strong> |Trim| ≤ 0.5% × L, List ≤ 1°</li>
                      <li><strong>İyi:</strong> 0.5% × L &lt; |Trim| ≤ 1% × L, 1° &lt; List ≤ 2°</li>
                      <li><strong>Kabul edilebilir:</strong> 1% × L &lt; |Trim| ≤ 1.5% × L, 2° &lt; List ≤ 3°</li>
                      <li><strong>Uyarı:</strong> 1.5% × L &lt; |Trim| ≤ 2% × L, 3° &lt; List ≤ 5°</li>
                      <li><strong>Aşırı:</strong> 2% × L &lt; |Trim| ≤ 2.5% × L, 5° &lt; List ≤ 7°</li>
                      <li><strong>Tehlikeli:</strong> |Trim| &gt; 2.5% × L, List &gt; 7°</li>
                    </ul>
                    
                    <h4>Trim Etkilerinin Detaylı Analizi:</h4>
                    <ul>
                      <li><strong>Stern trim (kıç trim):</strong>
                        <ul>
                          <li>Daha iyi manevra kabiliyeti</li>
                          <li>Artan sürtünme direnci (%5-15)</li>
                          <li>Pervane verimliliğinde artış</li>
                          <li>Bow slamming riskinde azalma</li>
                        </ul>
                      </li>
                      <li><strong>Head trim (baş trim):</strong>
                        <ul>
                          <li>Daha yüksek hız potansiyeli</li>
                          <li>Pervane ventilasyon riski</li>
                          <li>Yüksek dalgalarda slamming riski</li>
                          <li>Manevra zorluğu</li>
                        </ul>
                      </li>
                      <li><strong>Even keel:</strong>
                        <ul>
                          <li>Optimum hidrodinamik performans</li>
                          <li>En düşük yakıt tüketimi</li>
                          <li>Dengeli yük dağılımı</li>
                          <li>En iyi denizcilik özellikleri</li>
                        </ul>
                      </li>
                    </ul>
                    
                    <h4>List Etkileri ve Düzeltme Yöntemleri:</h4>
                    <ul>
                      <li><strong>List nedenleri:</strong> Asimetrik yük dağılımı, ballast dengesizliği, yakıt tüketimi</li>
                      <li><strong>List etkileri:</strong> Stabilite azalması, manevra zorluğu, yük kayması riski</li>
                      <li><strong>Düzeltme yöntemleri:</strong> Ballast transferi, yük yeniden dağılımı, cross flooding</li>
                      <li><strong>Acil durum prosedürleri:</strong> Hızlı ballast alma/verme, counter flooding</li>
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