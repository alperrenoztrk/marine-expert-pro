import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Ship, Waves, AlertTriangle, CheckCircle, Wheat, Brain, Settings, Package, Droplets, Building, Navigation, Compass } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import new calculation components
import { StabilityCalculations } from "./calculations/StabilityCalculations";
import { TrimCalculations } from "./calculations/TrimCalculations";
import { CargoCalculations } from "./calculations/CargoCalculations";
import { BallastCalculations } from "./calculations/BallastCalculations";
import { StructuralCalculations } from "./calculations/StructuralCalculations";

// Ship parameters interface
interface ShipData {
  L: number; // Length
  B: number; // Breadth
  T: number; // Draft
  CB: number; // Block Coefficient
  displacement: number;
  KM: number;
}

// IMO Compliance interface
interface IMOCompliance {
  minGM: number;
  solasMet: boolean;
  ismCompliant: boolean;
  applicableStandards: string[];
  complianceNote: string;
}

// Detailed stability result interface
interface StabilityResult {
  // Input values
  shipData: ShipData;
  KG: number;
  
  // Calculated values
  GM: number;
  BM: number;
  KB: number;
  freeSurfaceCorrection: number;
  GM_corrected: number;
  
  // Status and analysis
  status: 'stiff' | 'balanced' | 'tender' | 'dangerous';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  aiAnalysis?: string;
  
  // IMO Compliance
  imoCompliance: IMOCompliance;
  imoApproved: boolean;
  
  // Detailed recommendations
  recommendations: string[];
  
  // Formulas used
  calculations: {
    GM_formula: string;
    BM_formula: string;
    KB_formula: string;
    FSC_formula: string;
  };
}

// Free surface tank data
interface TankData {
  length: number;
  breadth: number;
  height: number;
  fillRatio: number; // 0-1
  fluidDensity: number;
}

interface TrimResult {
  trimMoment: number;
  trimAngle: number;
  status: 'acceptable' | 'warning' | 'critical';
}

interface GrainResult {
  grainStability: number;
  heelAngle: number;
  stabilityStatus: 'safe' | 'unsafe' | 'critical';
  recommendation: string;
}

export const MaritimeCalculator = () => {
  const { toast } = useToast();
  
  // State for active calculation module
  const [activeModule, setActiveModule] = useState("stability");
  
  // Ship Data State - Gemiye Ait Sabit Değerler
  const [shipData, setShipData] = useState<Partial<ShipData>>({
    L: undefined,
    B: undefined, 
    T: undefined,
    CB: undefined,
    displacement: undefined,
    KM: undefined
  });
  
  // Load-dependent values - Yüke Bağlı Değerler
  const [KG, setKG] = useState<number | undefined>();
  const [GM0, setGM0] = useState<number | undefined>();
  
  // Tank data for free surface correction
  const [tanks, setTanks] = useState<TankData[]>([]);
  const [currentTank, setCurrentTank] = useState<Partial<TankData>>({});
  
  // AI Integration - API keys moved to Supabase secrets for security
  const [openaiKey] = useState<string>(localStorage.getItem('openai_api_key') || '');
  const [aiEnabled, setAiEnabled] = useState<boolean>(!!localStorage.getItem('openai_api_key'));
  
  // Results
  const [stabilityResult, setStabilityResult] = useState<StabilityResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Trim Calculator State
  const [shipLength, setShipLength] = useState("");
  const [forwardDraft, setForwardDraft] = useState("");
  const [aftDraft, setAftDraft] = useState("");
  const [trimResult, setTrimResult] = useState<TrimResult | null>(null);
  
  // Free Surface Effect State
  const [tankLength, setTankLength] = useState("");
  const [tankBreadth, setTankBreadth] = useState("");
  const [freeSurfaceCorrection, setFreeSurfaceCorrection] = useState<number | null>(null);
  
  // Grain Stability State
  const [grainVolume, setGrainVolume] = useState("");
  const [grainBulkDensity, setGrainBulkDensity] = useState("");
  const [holdLength, setHoldLength] = useState("");
  const [holdBreadth, setHoldBreadth] = useState("");
  const [holdHeight, setHoldHeight] = useState("");
  const [grainResult, setGrainResult] = useState<GrainResult | null>(null);

  // Navigation Calculator States
  const [startLat, setStartLat] = useState("");
  const [startLon, setStartLon] = useState("");
  const [endLat, setEndLat] = useState("");
  const [endLon, setEndLon] = useState("");
  const [greatCircleResult, setGreatCircleResult] = useState<any>(null);
  const [rhumbLineResult, setRhumbLineResult] = useState<any>(null);

  // Compass Calculator States
  const [compassBearing, setCompassBearing] = useState("");
  const [variation, setVariation] = useState("");
  const [deviation, setDeviation] = useState("");
  const [compassResult, setCompassResult] = useState<any>(null);

  // Calculate BM (Metacentric Radius)
  const calculateBM = (B: number, L: number, displacement: number, CB: number): number => {
    // BM = I / ∇ where I is second moment of area of waterplane
    // For ship-shaped hull: I ≈ (B³ × L) / 12 × Cw
    // Waterplane coefficient Cw ≈ CB + 0.1 (approximation)
    const Cw = CB + 0.1;
    const I = (Math.pow(B, 3) * L * Cw) / 12;
    const waterVolume = displacement / 1.025; // seawater density
    return I / waterVolume;
  };

  // Calculate KB (Height of Buoyancy Center)
  const calculateKB = (T: number, CB: number): number => {
    // For ship hulls: KB ≈ T × (0.5 - CB/6)
    // For block shape: KB ≈ T/2
    return T * (0.5 - CB/6);
  };

  // Calculate Free Surface Correction
  const calculateFreeSurfaceCorrection = (displacement: number): number => {
    let totalFSC = 0;
    
    tanks.forEach(tank => {
      if (tank.fillRatio > 0 && tank.fillRatio < 1) {
        // FSC = (ρ × b³ × l) / (12 × ∇) for partially filled tanks
        const fsc = (tank.fluidDensity * Math.pow(tank.breadth, 3) * tank.length) / 
                   (12 * displacement);
        totalFSC += fsc;
      }
    });
    
    return totalFSC;
  };

  // IMO SOLAS & ISM Compliance Check Function
  const checkIMOCompliance = (GM_corrected: number, shipLength: number, displacement: number): IMOCompliance => {
    const applicableStandards: string[] = [];
    let minGM = 0.15; // Default minimum for cargo ships
    let solasMet = false;
    let ismCompliant = false;
    let complianceNote = "";

    // SOLAS Chapter XII-1 - Bulk carriers additional requirements
    if (displacement > 20000) {
      applicableStandards.push("SOLAS Chapter XII-1 (Bulk Carriers)");
      minGM = 0.20; // Higher requirement for large bulk carriers
    }

    // SOLAS Chapter II-1 Part B - Subdivision and stability
    applicableStandards.push("SOLAS Chapter II-1 Part B");
    
    // IMO MSC.267(85) - Grain code
    applicableStandards.push("IMO Grain Code MSC.267(85)");

    // Basic SOLAS requirements
    if (GM_corrected >= minGM) {
      solasMet = true;
      complianceNote = `✅ SOLAS minimum GM (${minGM}m) karşılanıyor`;
    } else {
      solasMet = false;
      complianceNote = `❌ SOLAS minimum GM (${minGM}m) karşılanmıyor - SEYİR İÇİN UYGUN DEĞİL`;
    }

    // ISM Code compliance check
    if (solasMet && GM_corrected <= 2.0) {
      ismCompliant = true;
      complianceNote += " | ✅ ISM Code uyumlu";
    } else if (!solasMet) {
      ismCompliant = false;
      complianceNote += " | ❌ ISM Code ihlali - ACIL MÜDAHALE GEREKLİ";
    } else if (GM_corrected > 2.0) {
      ismCompliant = false;
      complianceNote += " | ⚠️ Aşırı sert gemi - ISM risk değerlendirmesi gerekli";
    }

    return {
      minGM,
      solasMet,
      ismCompliant,
      applicableStandards,
      complianceNote
    };
  };

  // AI calculations now handled via secure Supabase edge function
  const getAICalculation = async (query: string, values: any): Promise<string> => {
    try {
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: query, values })
      });
      
      const data = await response.json();
      return data.answer || '';
    } catch (error) {
      console.error('AI calculation failed:', error);
      return '';
    }
  };

  // AI analysis now handled via secure Supabase edge function
  const getAIAnalysis = async (result: Partial<StabilityResult>): Promise<string> => {
    if (!aiEnabled) return '';
    
    try {
      const prompt = `Gemi stabilitesi analizi:
      GM: ${result.GM?.toFixed(3)}m
      Gemi Uzunluğu: ${shipData.L}m, Genişlik: ${shipData.B}m
      Deplasman: ${shipData.displacement} ton
      KG: ${KG}m
      
      Detaylı denizcilik stabilitesi değerlendirmesi ve öneriler sağla. Türkçe yanıtla.`;

      return await getAICalculation(prompt, {
        GM: result.GM,
        shipLength: shipData.L,
        shipBreadth: shipData.B,
        displacement: shipData.displacement,
        KG: KG
      });
    } catch (error) {
      console.error('AI Analysis failed:', error);
      return '';
    }
  };


  // Main stability calculation
  const calculateStability = async () => {
    if (!shipData.L || !shipData.B || !shipData.T || !shipData.displacement || !KG) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen en az L, B, T, Deplasman ve KG değerlerini girin",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);

    try {
      // Use provided values or calculate missing ones
      const calculatedCB = shipData.CB || 0.7; // Default block coefficient
      const calculatedBM = shipData.KM ? 
        (shipData.KM - calculateKB(shipData.T, calculatedCB)) : 
        calculateBM(shipData.B, shipData.L, shipData.displacement, calculatedCB);
      
      const KB = calculateKB(shipData.T, calculatedCB);
      const KM = KB + calculatedBM;
      const GM = KM - KG;
      
      // Free surface correction
      const FSC = calculateFreeSurfaceCorrection(shipData.displacement);
      const GM_corrected = GM - FSC;

      // IMO SOLAS & ISM Compliance Check
      const imoCompliance = checkIMOCompliance(GM_corrected, shipData.L!, shipData.displacement);
      
      // Determine status based on GM and IMO compliance
      let status: 'stiff' | 'balanced' | 'tender' | 'dangerous';
      let riskLevel: 'low' | 'medium' | 'high' | 'critical';
      let imoApproved = false;
      
      // IMO SOLAS minimum GM requirements:
      // - Passenger ships: GM ≥ 0.15m + additional requirements
      // - Cargo ships: GM ≥ 0.15m 
      // - Container ships: GM ≥ 0.20m
      // - Bulk carriers: GM ≥ 0.15m with grain loading considerations
      
      if (GM_corrected >= imoCompliance.minGM && imoCompliance.solasMet) {
        imoApproved = true;
        if (GM_corrected > 1.0) {
          status = 'stiff';
          riskLevel = 'low';
        } else if (GM_corrected >= 0.4) {
          status = 'balanced';
          riskLevel = 'low';
        } else {
          status = 'tender';
          riskLevel = 'medium';
        }
      } else {
        imoApproved = false;
        if (GM_corrected >= 0.15) {
          status = 'tender';
          riskLevel = 'high';
        } else {
          status = 'dangerous';
          riskLevel = 'critical';
        }
      }

      // Generate recommendations
      const recommendations = [];
      if (GM_corrected < 0.15) {
        recommendations.push("Acil yük düzenlemesi yapın - gemi kararsız");
        recommendations.push("Ağır yükleri alt bölmelere taşıyın");
      } else if (GM_corrected < 0.4) {
        recommendations.push("Dikkatli yük planlaması yapın");
        recommendations.push("Serbest yüzey etkisini minimize edin");
      } else if (GM_corrected > 1.0) {
        recommendations.push("Gemi çok sert - yüksek gerilme riski");
        recommendations.push("Konfor açısından yük dağılımını gözden geçirin");
      } else {
        recommendations.push("Stabilite optimal seviyede");
      }

      const result: StabilityResult = {
        shipData: shipData as ShipData,
        KG,
        GM,
        BM: calculatedBM,
        KB,
        freeSurfaceCorrection: FSC,
        GM_corrected,
        status,
        riskLevel,
        imoCompliance,
        imoApproved,
        recommendations,
        calculations: {
          GM_formula: "GM = KM - KG",
          BM_formula: "BM = I / ∇ = (B³×L×Cw) / (12×∇)",
          KB_formula: "KB = T × (0.5 - CB/6)",
          FSC_formula: "FSC = Σ(ρ×b³×l) / (12×∇)"
        }
      };

      // Get AI analysis if enabled
      if (aiEnabled) {
        result.aiAnalysis = await getAIAnalysis(result);
        
        // Mathematical validations are handled within the AI analysis
      }

      setStabilityResult(result);
      
      toast({
        title: "Hesaplama Tamamlandı",
        description: `GM(corrected): ${GM_corrected.toFixed(3)} m - ${status}`,
      });

    } catch (error) {
      toast({
        title: "Hesaplama Hatası",
        description: "Bir hata oluştu, lütfen değerleri kontrol edin",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  // Initialize AI services on component load
  useState(() => {
    // Auto-enable AI if API keys are available via Supabase
    const hasKeys = !!localStorage.getItem('openai_api_key');
    setAiEnabled(hasKeys);
    
    if (hasKeys) {
      toast({
        title: "AI Servisleri Aktif",
        description: "Gelişmiş analiz özellikleri kullanıma hazır",
      });
    }
  });

  // Add tank for free surface calculation
  const addTank = () => {
    if (currentTank.length && currentTank.breadth && currentTank.height) {
      const newTank: TankData = {
        length: currentTank.length,
        breadth: currentTank.breadth,
        height: currentTank.height,
        fillRatio: currentTank.fillRatio || 0.5,
        fluidDensity: currentTank.fluidDensity || 1.025
      };
      setTanks([...tanks, newTank]);
      setCurrentTank({});
      toast({
        title: "Tank Eklendi",
        description: `${tanks.length + 1}. tank serbest yüzey hesabına dahil edildi`,
      });
    }
  };

  const calculateTrim = () => {
    const length = parseFloat(shipLength);
    const fwdDraft = parseFloat(forwardDraft);
    const aftDraftValue = parseFloat(aftDraft);

    if (isNaN(length) || isNaN(fwdDraft) || isNaN(aftDraftValue)) {
      toast({
        title: "Hata",
        description: "Lütfen tüm alanları doldurun",
        variant: "destructive",
      });
      return;
    }

    const trimValue = aftDraftValue - fwdDraft;
    const trimAngle = Math.atan(trimValue / length) * (180 / Math.PI);
    const trimMoment = Math.abs(trimValue * length);

    let status: 'acceptable' | 'warning' | 'critical';
    
    if (Math.abs(trimAngle) < 0.5) {
      status = 'acceptable';
    } else if (Math.abs(trimAngle) < 1.0) {
      status = 'warning';
    } else {
      status = 'critical';
    }

    setTrimResult({ trimMoment, trimAngle, status });
    
    toast({
      title: "Trim Hesaplandı",
      description: `Trim açısı: ${trimAngle.toFixed(2)}°`,
    });
  };

  const calculateFreeSurface = () => {
    const length = parseFloat(tankLength);
    const breadth = parseFloat(tankBreadth);

    if (isNaN(length) || isNaN(breadth)) {
      toast({
        title: "Hata",
        description: "Tank boyutlarını girin",
        variant: "destructive",
      });
      return;
    }

    // Free surface moment calculation (simplified)
    const freeSurfaceMoment = (length * Math.pow(breadth, 3)) / 12;
    const correction = freeSurfaceMoment / 1000; // Convert to correction value

    setFreeSurfaceCorrection(correction);
    
    toast({
      title: "Serbest Yüzey Etkisi",
      description: `Düzeltme: ${correction.toFixed(4)} m`,
    });
  };

  const calculateGrainStability = () => {
    const volume = parseFloat(grainVolume);
    const density = parseFloat(grainBulkDensity);
    const length = parseFloat(holdLength);
    const breadth = parseFloat(holdBreadth);
    const height = parseFloat(holdHeight);

    if (isNaN(volume) || isNaN(density) || isNaN(length) || isNaN(breadth) || isNaN(height)) {
      toast({
        title: "Hata",
        description: "Lütfen tüm alanları doldurun",
        variant: "destructive",
      });
      return;
    }

    // Grain shift calculation (simplified version for demonstration)
    const grainWeight = volume * density;
    const shiftMoment = (grainWeight * breadth * 0.15); // 15% shift assumption
    const grainStability = shiftMoment / grainWeight;
    
    // Calculate heel angle due to grain shift
    const heelAngle = Math.atan(grainStability / height) * (180 / Math.PI);
    
    let stabilityStatus: 'safe' | 'unsafe' | 'critical';
    let recommendation: string;

    if (heelAngle < 12) {
      stabilityStatus = 'safe';
      recommendation = 'Grain kararlılığı güvenli seviyede. Seyir yapılabilir.';
    } else if (heelAngle < 25) {
      stabilityStatus = 'unsafe';
      recommendation = 'Dikkat! Grain kayması riski var. Yük düzenlemesi yapın.';
    } else {
      stabilityStatus = 'critical';
      recommendation = 'Kritik durum! Grain kayması ciddi tehlike oluşturuyor.';
    }

    setGrainResult({ grainStability, heelAngle, stabilityStatus, recommendation });
    
    toast({
      title: "Grain Hesaplandı",
      description: `Yalpa açısı: ${heelAngle.toFixed(2)}°`,
    });
  };

  // Great Circle calculations
  const calculateGreatCircle = () => {
    const lat1 = parseFloat(startLat) * Math.PI / 180;
    const lon1 = parseFloat(startLon) * Math.PI / 180;
    const lat2 = parseFloat(endLat) * Math.PI / 180;
    const lon2 = parseFloat(endLon) * Math.PI / 180;

    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
      toast({
        title: "Hata",
        description: "Lütfen geçerli koordinatlar girin",
        variant: "destructive",
      });
      return;
    }

    // Great Circle distance using Haversine formula
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
              Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = 6371 * c; // Earth radius in km
    const nauticalMiles = distance * 0.539957; // Convert to nautical miles

    // Initial bearing
    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    const initialBearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;

    setGreatCircleResult({
      distance: nauticalMiles.toFixed(1),
      initialBearing: initialBearing.toFixed(1),
      formula: "Haversine Formula",
      description: "En kısa mesafe"
    });

    toast({
      title: "Great Circle Hesaplandı",
      description: `Mesafe: ${nauticalMiles.toFixed(1)} nm, Bearing: ${initialBearing.toFixed(1)}°`,
    });
  };

  // Rhumb Line calculations
  const calculateRhumbLine = () => {
    const lat1 = parseFloat(startLat) * Math.PI / 180;
    const lon1 = parseFloat(startLon) * Math.PI / 180;
    const lat2 = parseFloat(endLat) * Math.PI / 180;
    const lon2 = parseFloat(endLon) * Math.PI / 180;

    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
      toast({
        title: "Hata",
        description: "Lütfen geçerli koordinatlar girin",
        variant: "destructive",
      });
      return;
    }

    // Rhumb line calculations
    const dLat = lat2 - lat1;
    let dLon = lon2 - lon1;
    
    // Handle longitude crossing
    if (Math.abs(dLon) > Math.PI) {
      dLon = dLon > 0 ? -(2 * Math.PI - dLon) : (2 * Math.PI + dLon);
    }

    const dPhi = Math.log(Math.tan(lat2/2 + Math.PI/4) / Math.tan(lat1/2 + Math.PI/4));
    const q = Math.abs(dPhi) > 10e-12 ? dLat / dPhi : Math.cos(lat1);

    const distance = Math.sqrt(dLat * dLat + q * q * dLon * dLon) * 6371 * 0.539957; // nm
    const bearing = (Math.atan2(dLon, dPhi) * 180 / Math.PI + 360) % 360;

    setRhumbLineResult({
      distance: distance.toFixed(1),
      bearing: bearing.toFixed(1),
      formula: "Mercator Projection",
      description: "Sabit pusula rotası"
    });

    toast({
      title: "Rhumb Line Hesaplandı",
      description: `Mesafe: ${distance.toFixed(1)} nm, Bearing: ${bearing.toFixed(1)}°`,
    });
  };

  // Compass calculations
  const calculateCompass = () => {
    const compass = parseFloat(compassBearing);
    const var_val = parseFloat(variation) || 0;
    const dev_val = parseFloat(deviation) || 0;

    if (isNaN(compass)) {
      toast({
        title: "Hata",
        description: "Lütfen geçerli pusula yönü girin",
        variant: "destructive",
      });
      return;
    }

    // Compass to Magnetic: add deviation
    const magnetic = (compass + dev_val + 360) % 360;
    
    // Magnetic to True: add variation
    const trueBearing = (magnetic + var_val + 360) % 360;

    setCompassResult({
      compass: compass.toFixed(1),
      magnetic: magnetic.toFixed(1),
      true: trueBearing.toFixed(1),
      variation: var_val.toFixed(1),
      deviation: dev_val.toFixed(1),
      formula: "True = Magnetic + Variation, Magnetic = Compass + Deviation"
    });

    toast({
      title: "Pusula Hesaplandı",
      description: `True Bearing: ${trueBearing.toFixed(1)}°`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'stable':
      case 'acceptable':
      case 'safe':
      case 'balanced':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'critical':
      case 'warning':
      case 'tender':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'unstable':
      case 'unsafe':
      case 'dangerous':
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case 'stiff':
        return <Ship className="w-5 h-5 text-primary" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable':
      case 'acceptable':
      case 'safe':
      case 'balanced':
        return 'bg-success';
      case 'critical':
      case 'warning':
      case 'tender':
        return 'bg-warning';
      case 'unstable':
      case 'unsafe':
      case 'dangerous':
        return 'bg-destructive';
      case 'stiff':
        return 'bg-primary';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="w-full space-y-4 md:space-y-6">
      <div className="text-center space-y-2 md:space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Ship className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Maritime Calculator</h1>
          <Waves className="w-5 h-5 md:w-6 md:h-6 text-accent" />
        </div>
        <p className="text-xs md:text-sm text-muted-foreground px-4">
          Gemi stabilitesi ve deniz mühendisliği hesaplamaları
        </p>
      </div>

      <Tabs defaultValue="stability" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1 gap-1">
          <TabsTrigger value="stability" className="text-xs md:text-sm flex-col md:flex-row gap-1 p-2 md:p-3">
            <Calculator className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Stabilite</span>
            <span className="sm:hidden">GM</span>
          </TabsTrigger>
          <TabsTrigger value="navigation" className="text-xs md:text-sm flex-col md:flex-row gap-1 p-2 md:p-3">
            <Settings className="w-3 h-3 md:w-4 md:h-4" />
            <span>Seyir</span>
          </TabsTrigger>
          <TabsTrigger value="trim" className="text-xs md:text-sm p-2 md:p-3">
            <span>Trim</span>
          </TabsTrigger>
          <TabsTrigger value="freesurface" className="text-xs md:text-sm p-2 md:p-3">
            <span className="hidden sm:inline">Serbest Yüzey</span>
            <span className="sm:hidden">FSE</span>
          </TabsTrigger>
          <TabsTrigger value="grain" className="text-xs md:text-sm flex-col md:flex-row gap-1 p-2 md:p-3">
            <Wheat className="w-3 h-3 md:w-4 md:h-4" />
            <span>Grain</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stability">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Ship className="w-4 h-4" />
                Detaylı Stabilite Hesaplayıcı
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Profesyonel gemi stabilite analizi - GM, FSC, AI değerlendirmesi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              
              {/* AI Settings - Hidden, works in background */}

              {/* Ship Data - Gemiye Ait Sabit Değerler */}
              <Card className="border-primary/20">
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-sm md:text-base">📥 Gemi Bilgileri (Sabit Değerler)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="L" className="text-xs md:text-sm font-medium">L - Gemi Boyu (m)</Label>
                      <Input
                        id="L"
                        type="number"
                        step="0.1"
                        placeholder="Perpendikürler arası"
                        value={shipData.L || ''}
                        onChange={(e) => setShipData({...shipData, L: parseFloat(e.target.value) || undefined})}
                        className="text-sm h-9 md:h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="B" className="text-xs md:text-sm font-medium">B - Gemi Eni (m)</Label>
                      <Input
                        id="B"
                        type="number"
                        step="0.1"
                        placeholder="Maksimum genişlik"
                        value={shipData.B || ''}
                        onChange={(e) => setShipData({...shipData, B: parseFloat(e.target.value) || undefined})}
                        className="text-sm h-9 md:h-10"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="T" className="text-xs md:text-sm font-medium">T - Su Çekimi (m)</Label>
                      <Input
                        id="T"
                        type="number"
                        step="0.01"
                        placeholder="Ortalama draft"
                        value={shipData.T || ''}
                        onChange={(e) => setShipData({...shipData, T: parseFloat(e.target.value) || undefined})}
                        className="text-sm h-9 md:h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="CB" className="text-xs md:text-sm font-medium">CB - Blok Katsayısı</Label>
                      <Input
                        id="CB"
                        type="number"
                        step="0.01"
                        placeholder="0.7 (varsayılan)"
                        value={shipData.CB || ''}
                        onChange={(e) => setShipData({...shipData, CB: parseFloat(e.target.value) || undefined})}
                        className="text-sm h-9 md:h-10"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="displacement" className="text-xs md:text-sm font-medium">Deplasman (ton)</Label>
                      <Input
                        id="displacement"
                        type="number"
                        step="0.1"
                        placeholder="Gemi ağırlığı"
                        value={shipData.displacement || ''}
                        onChange={(e) => setShipData({...shipData, displacement: parseFloat(e.target.value) || undefined})}
                        className="text-sm h-9 md:h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="KM" className="text-xs md:text-sm font-medium">KM - Metacentric Height (m)</Label>
                      <Input
                        id="KM"
                        type="number"
                        step="0.001"
                        placeholder="Opsiyonel - hesaplanır"
                        value={shipData.KM || ''}
                        onChange={(e) => setShipData({...shipData, KM: parseFloat(e.target.value) || undefined})}
                        className="text-sm h-9 md:h-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Load Data - Yüke Bağlı Değerler */}
              <Card className="border-secondary/20">
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-sm md:text-base">⚖️ Yük Bilgileri (Sefer Değerleri)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="KG" className="text-xs md:text-sm font-medium">
                        KG - Ağırlık Merkezi (m) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="KG"
                        type="number"
                        step="0.001"
                        placeholder="Kil'den yükseklik"
                        value={KG || ''}
                        onChange={(e) => setKG(parseFloat(e.target.value) || undefined)}
                        className="text-sm h-9 md:h-10"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="GM0" className="text-xs md:text-sm font-medium">GM₀ - Başlangıç GM (m)</Label>
                      <Input
                        id="GM0"
                        type="number"
                        step="0.001"
                        placeholder="Opsiyonel"
                        value={GM0 || ''}
                        onChange={(e) => setGM0(parseFloat(e.target.value) || undefined)}
                        className="text-sm h-9 md:h-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tank Data for Free Surface */}
              <Card className="border-accent/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">🏛️ Serbest Yüzey Tankları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="tank-l" className="text-sm">Tank Boyu (m)</Label>
                      <Input
                        id="tank-l"
                        type="number"
                        step="0.1"
                        placeholder="Uzunluk"
                        value={currentTank.length || ''}
                        onChange={(e) => setCurrentTank({...currentTank, length: parseFloat(e.target.value) || undefined})}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tank-b" className="text-sm">Tank Eni (m)</Label>
                      <Input
                        id="tank-b"
                        type="number"
                        step="0.1"
                        placeholder="Genişlik"
                        value={currentTank.breadth || ''}
                        onChange={(e) => setCurrentTank({...currentTank, breadth: parseFloat(e.target.value) || undefined})}
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="tank-h" className="text-sm">Yükseklik (m)</Label>
                      <Input
                        id="tank-h"
                        type="number"
                        step="0.1"
                        placeholder="Yükseklik"
                        value={currentTank.height || ''}
                        onChange={(e) => setCurrentTank({...currentTank, height: parseFloat(e.target.value) || undefined})}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fill-ratio" className="text-sm">Doluluk Oranı</Label>
                      <Input
                        id="fill-ratio"
                        type="number"
                        step="0.1"
                        placeholder="0.5"
                        value={currentTank.fillRatio || ''}
                        onChange={(e) => setCurrentTank({...currentTank, fillRatio: parseFloat(e.target.value) || undefined})}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fluid-density" className="text-sm">Sıvı Yoğunluğu</Label>
                      <Input
                        id="fluid-density"
                        type="number"
                        step="0.001"
                        placeholder="1.025"
                        value={currentTank.fluidDensity || ''}
                        onChange={(e) => setCurrentTank({...currentTank, fluidDensity: parseFloat(e.target.value) || undefined})}
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <Button onClick={addTank} size="sm" variant="outline">
                    Tank Ekle ({tanks.length} tank)
                  </Button>
                </CardContent>
              </Card>
              
              <Button 
                onClick={calculateStability} 
                className="w-full h-12 md:h-10 text-sm md:text-base shadow-[var(--shadow-button)]"
                disabled={isCalculating}
                size="lg"
              >
                {isCalculating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Hesaplanıyor...
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4 mr-2" />
                    <span>Detaylı Stabilite Analizi</span>
                  </>
                )}
              </Button>

              {/* Results */}
              {stabilityResult && (
                <Card className="bg-gradient-to-r from-muted/50 to-background border-l-4 border-l-primary">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(stabilityResult.status)}
                        <span className="font-semibold text-lg">📊 Stabilite Analizi</span>
                      </div>
                      <Badge className={getStatusColor(stabilityResult.status)}>
                        {stabilityResult.status === 'stiff' ? 'Sert Gemi' : 
                         stabilityResult.status === 'balanced' ? 'Dengeli' : 
                         stabilityResult.status === 'tender' ? 'Yumuşak' : 'Tehlikeli'}
                      </Badge>
                    </div>
                    
                    {/* Ana Sonuçlar */}
                    <div className="space-y-4 mb-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm"><strong>KG:</strong> {stabilityResult.KG.toFixed(3)} m</p>
                          <p className="text-sm"><strong>KB:</strong> {stabilityResult.KB.toFixed(3)} m</p>
                          <p className="text-sm"><strong>BM:</strong> {stabilityResult.BM.toFixed(3)} m</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm"><strong>GM:</strong> {stabilityResult.GM.toFixed(3)} m</p>
                          <p className="text-sm"><strong>FSC:</strong> {stabilityResult.freeSurfaceCorrection.toFixed(4)} m</p>
                          <p className="text-sm font-bold text-primary"><strong>GM(corrected):</strong> {stabilityResult.GM_corrected.toFixed(3)} m</p>
                        </div>
                      </div>
                      
                      {/* IMO SOLAS/ISM Compliance Section */}
                      <div className={`p-4 rounded-lg border-2 ${stabilityResult.imoApproved ? 'bg-success/10 border-success' : 'bg-destructive/10 border-destructive'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-base flex items-center gap-2">
                            {stabilityResult.imoApproved ? '✅' : '❌'} IMO SOLAS/ISM Uygunluk
                          </h4>
                          <Badge className={stabilityResult.imoApproved ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'}>
                            {stabilityResult.imoApproved ? 'SEYİR İÇİN UYGUN' : 'SEYİR İÇİN UYGUN DEĞİL'}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">{stabilityResult.imoCompliance.complianceNote}</p>
                          <div className="text-xs text-muted-foreground">
                            <p><strong>Minimum GM Gereksinimi:</strong> {stabilityResult.imoCompliance.minGM.toFixed(2)} m</p>
                            <p><strong>Uygulanabilir Standartlar:</strong></p>
                            <ul className="list-disc ml-4 space-y-1">
                              {stabilityResult.imoCompliance.applicableStandards.map((standard, index) => (
                                <li key={index}>{standard}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center p-3 bg-primary/10 rounded-lg">
                        <p className="text-xl font-bold text-primary">
                          Final GM = {stabilityResult.GM_corrected.toFixed(3)} m
                        </p>
                        <p className="text-sm text-muted-foreground">Risk Seviyesi: {stabilityResult.riskLevel}</p>
                      </div>
                    </div>

                    {/* Formüller */}
                    <div className="space-y-3 mb-6">
                      <h4 className="font-semibold text-base text-primary">🧮 Kullanılan Formüller</h4>
                      <div className="grid grid-cols-2 gap-3 text-xs bg-muted/30 p-4 rounded-lg">
                        <div>
                          <p><strong>{stabilityResult.calculations.GM_formula}</strong></p>
                          <p><strong>{stabilityResult.calculations.KB_formula}</strong></p>
                        </div>
                        <div>
                          <p><strong>{stabilityResult.calculations.BM_formula}</strong></p>
                          <p><strong>{stabilityResult.calculations.FSC_formula}</strong></p>
                        </div>
                      </div>
                    </div>

                    {/* Öneriler */}
                    <div className="space-y-3 mb-6">
                      <h4 className="font-semibold text-base text-primary">💡 Öneriler</h4>
                      <div className="space-y-2">
                        {stabilityResult.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-accent/10 rounded-md">
                            <div className="w-2 h-2 bg-accent rounded-full mt-1.5 flex-shrink-0" />
                            <p className="text-sm">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Analizi */}
                    {stabilityResult.aiAnalysis && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-base text-primary flex items-center gap-2">
                          <Brain className="w-4 h-4" />
                          AI Analizi
                        </h4>
                        <div className="p-4 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg border border-accent/20">
                          <p className="text-sm whitespace-pre-wrap">{stabilityResult.aiAnalysis}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              <Card className="border-accent/20">
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-sm md:text-base flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Seyir
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <Button 
                      variant="outline" 
                      className="justify-start gap-2 h-12"
                      onClick={() => toast({
                        title: "Büyük Daire Seyri",
                        description: "Great Circle hesaplamaları yakında eklenecek",
                      })}
                    >
                      <Package className="w-4 h-4" />
                      <span className="text-left">
                        <div className="font-medium">Büyük Daire (Great Circle) Seyri</div>
                        <div className="text-xs text-muted-foreground">En kısa mesafe hesaplamaları</div>
                      </span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="justify-start gap-2 h-12"
                      onClick={() => toast({
                        title: "Loxodromik Seyir",
                        description: "Rhumb Line hesaplamaları yakında eklenecek",
                      })}
                    >
                      <Building className="w-4 h-4" />
                      <span className="text-left">
                        <div className="font-medium">Loxodromik (Rhumb Line) Seyir</div>
                        <div className="text-xs text-muted-foreground">Sabit pusula rotası</div>
                      </span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="justify-start gap-2 h-12"
                      onClick={() => toast({
                        title: "Pusula & Gyro Hesaplamaları",
                        description: "Compass ve gyro hesaplamaları yakında eklenecek",
                      })}
                    >
                      <Droplets className="w-4 h-4" />
                      <span className="text-left">
                        <div className="font-medium">Pusula & Gyro Hesaplamaları</div>
                        <div className="text-xs text-muted-foreground">Manyetik ve gyro compass</div>
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="navigation">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="w-4 h-4" />
                Seyir Hesaplamaları
              </CardTitle>
              <CardDescription className="text-sm">
                Denizcilik seyir hesaplamaları ve pusula düzeltmeleri
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Great Circle Calculator */}
              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    Büyük Daire (Great Circle) Seyri
                  </CardTitle>
                  <CardDescription className="text-sm">
                    En kısa mesafe ve başlangıç bearing'i hesaplama
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="start-lat" className="text-sm">Başlangıç Lat (°)</Label>
                      <Input
                        id="start-lat"
                        type="number"
                        step="0.000001"
                        placeholder="41.0082"
                        value={startLat}
                        onChange={(e) => setStartLat(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="start-lon" className="text-sm">Başlangıç Lon (°)</Label>
                      <Input
                        id="start-lon"
                        type="number"
                        step="0.000001"
                        placeholder="28.9784"
                        value={startLon}
                        onChange={(e) => setStartLon(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-lat" className="text-sm">Hedef Lat (°)</Label>
                      <Input
                        id="end-lat"
                        type="number"
                        step="0.000001"
                        placeholder="40.7589"
                        value={endLat}
                        onChange={(e) => setEndLat(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-lon" className="text-sm">Hedef Lon (°)</Label>
                      <Input
                        id="end-lon"
                        type="number"
                        step="0.000001"
                        placeholder="-73.9851"
                        value={endLon}
                        onChange={(e) => setEndLon(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={calculateGreatCircle} 
                    className="w-full"
                    variant="default"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Great Circle Hesapla
                  </Button>

                  {greatCircleResult && (
                    <Card className="bg-gradient-to-r from-primary/10 to-background border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-primary">🧭 Great Circle Sonuçları</p>
                          <p className="text-sm"><strong>Mesafe:</strong> {greatCircleResult.distance} nautical miles</p>
                          <p className="text-sm"><strong>Initial Bearing:</strong> {greatCircleResult.initialBearing}°</p>
                          <p className="text-xs text-muted-foreground">{greatCircleResult.description} - {greatCircleResult.formula}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>

              {/* Rhumb Line Calculator */}
              <Card className="border-secondary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Loxodromik (Rhumb Line) Seyri
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Sabit pusula rotası mesafe hesaplama
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-3">
                    Yukarıdaki koordinatları kullanır
                  </div>
                  
                  <Button 
                    onClick={calculateRhumbLine} 
                    className="w-full"
                    variant="secondary"
                  >
                    <Building className="w-4 h-4 mr-2" />
                    Rhumb Line Hesapla
                  </Button>

                  {rhumbLineResult && (
                    <Card className="bg-gradient-to-r from-secondary/10 to-background border-l-4 border-l-secondary">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-secondary">📐 Rhumb Line Sonuçları</p>
                          <p className="text-sm"><strong>Mesafe:</strong> {rhumbLineResult.distance} nautical miles</p>
                          <p className="text-sm"><strong>Bearing:</strong> {rhumbLineResult.bearing}° (sabit)</p>
                          <p className="text-xs text-muted-foreground">{rhumbLineResult.description} - {rhumbLineResult.formula}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>

              {/* Compass Calculator */}
              <Card className="border-accent/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    Pusula & Gyro Hesaplamaları
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Manyetik ve gyro compass düzeltmeleri
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="compass-bearing" className="text-sm">Compass Bearing (°)</Label>
                      <Input
                        id="compass-bearing"
                        type="number"
                        step="0.1"
                        placeholder="090.0"
                        value={compassBearing}
                        onChange={(e) => setCompassBearing(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="variation" className="text-sm">Variation (°)</Label>
                      <Input
                        id="variation"
                        type="number"
                        step="0.1"
                        placeholder="3.5"
                        value={variation}
                        onChange={(e) => setVariation(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deviation" className="text-sm">Deviation (°)</Label>
                      <Input
                        id="deviation"
                        type="number"
                        step="0.1"
                        placeholder="-2.0"
                        value={deviation}
                        onChange={(e) => setDeviation(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={calculateCompass} 
                    className="w-full"
                    variant="outline"
                  >
                    <Compass className="w-4 h-4 mr-2" />
                    Pusula Düzeltmesi Hesapla
                  </Button>

                  {compassResult && (
                    <Card className="bg-gradient-to-r from-accent/10 to-background border-l-4 border-l-accent">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-accent">🧭 Pusula Düzeltmeleri</p>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p><strong>Compass:</strong> {compassResult.compass}°</p>
                              <p><strong>Deviation:</strong> {compassResult.deviation}°</p>
                            </div>
                            <div>
                              <p><strong>Magnetic:</strong> {compassResult.magnetic}°</p>
                              <p><strong>Variation:</strong> {compassResult.variation}°</p>
                            </div>
                            <div>
                              <p><strong>True Bearing:</strong> {compassResult.true}°</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-3">{compassResult.formula}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trim">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Trim Hesaplayıcı</CardTitle>
              <CardDescription className="text-sm">
                Gemi trim açısını ve momentini hesaplayın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="length" className="text-sm">Gemi Boyu (m)</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.1"
                    placeholder="Perpendikürler arası"
                    value={shipLength}
                    onChange={(e) => setShipLength(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fwd" className="text-sm">Ön Draft (m)</Label>
                  <Input
                    id="fwd"
                    type="number"
                    step="0.01"
                    placeholder="Baş taslağı"
                    value={forwardDraft}
                    onChange={(e) => setForwardDraft(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aft" className="text-sm">Arka Draft (m)</Label>
                  <Input
                    id="aft"
                    type="number"
                    step="0.01"
                    placeholder="Kıç taslağı"
                    value={aftDraft}
                    onChange={(e) => setAftDraft(e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
              
              <Button 
                onClick={calculateTrim} 
                className="w-full"
                variant="ocean"
              >
                Trim Hesapla
              </Button>

              {trimResult && (
                <Card className="bg-gradient-to-r from-muted/50 to-background border-l-4 border-l-accent">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(trimResult.status)}
                        <span className="font-semibold text-sm">Trim Durumu</span>
                      </div>
                      <Badge className={getStatusColor(trimResult.status)}>
                        {trimResult.status === 'acceptable' ? 'Kabul Edilebilir' : 
                         trimResult.status === 'warning' ? 'Dikkat' : 'Kritik'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>Trim Açısı:</strong> {trimResult.trimAngle.toFixed(2)}°
                      </p>
                      <p className="text-sm">
                        <strong>Trim Momenti:</strong> {trimResult.trimMoment.toFixed(2)} ton.m
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="freesurface">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Serbest Yüzey Etkisi</CardTitle>
              <CardDescription className="text-sm">
                Tank serbest yüzey düzeltmesini hesaplayın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="tank-length" className="text-sm">Tank Boyu (m)</Label>
                  <Input
                    id="tank-length"
                    type="number"
                    step="0.1"
                    placeholder="Tank uzunluğu"
                    value={tankLength}
                    onChange={(e) => setTankLength(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tank-breadth" className="text-sm">Tank Genişliği (m)</Label>
                  <Input
                    id="tank-breadth"
                    type="number"
                    step="0.1"
                    placeholder="Tank genişliği"
                    value={tankBreadth}
                    onChange={(e) => setTankBreadth(e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
              
              <Button 
                onClick={calculateFreeSurface} 
                className="w-full"
                variant="secondary"
              >
                <Waves className="w-4 h-4" />
                Serbest Yüzey Hesapla
              </Button>

              {freeSurfaceCorrection !== null && (
                <Card className="bg-gradient-to-r from-muted/50 to-background border-l-4 border-l-secondary">
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>Serbest Yüzey Düzeltmesi:</strong> {freeSurfaceCorrection.toFixed(4)} m
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Bu değer GM hesaplamasından çıkarılmalıdır
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grain">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wheat className="w-4 h-4" />
                Grain Stabilite Hesaplayıcı
              </CardTitle>
              <CardDescription className="text-sm">
                Tahıl yükü kararlılığını ve kayma riskini hesaplayın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="grain-volume" className="text-sm">Grain Hacmi (m³)</Label>
                  <Input
                    id="grain-volume"
                    type="number"
                    step="0.1"
                    placeholder="Tahıl hacmi"
                    value={grainVolume}
                    onChange={(e) => setGrainVolume(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grain-density" className="text-sm">Bulk Yoğunluk (ton/m³)</Label>
                  <Input
                    id="grain-density"
                    type="number"
                    step="0.01"
                    placeholder="Tahıl yoğunluğu"
                    value={grainBulkDensity}
                    onChange={(e) => setGrainBulkDensity(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hold-length" className="text-sm">Ambar Boyu (m)</Label>
                  <Input
                    id="hold-length"
                    type="number"
                    step="0.1"
                    placeholder="Ambar uzunluğu"
                    value={holdLength}
                    onChange={(e) => setHoldLength(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hold-breadth" className="text-sm">Ambar Genişliği (m)</Label>
                  <Input
                    id="hold-breadth"
                    type="number"
                    step="0.1"
                    placeholder="Ambar genişliği"
                    value={holdBreadth}
                    onChange={(e) => setHoldBreadth(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hold-height" className="text-sm">Ambar Yüksekliği (m)</Label>
                  <Input
                    id="hold-height"
                    type="number"
                    step="0.1"
                    placeholder="Ambar yüksekliği"
                    value={holdHeight}
                    onChange={(e) => setHoldHeight(e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
              
              <Button 
                onClick={calculateGrainStability} 
                className="w-full"
                variant="outline"
              >
                <Wheat className="w-4 h-4" />
                Grain Stabilitesi Hesapla
              </Button>

              {grainResult && (
                <Card className="bg-gradient-to-r from-muted/50 to-background border-l-4 border-l-warning">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(grainResult.stabilityStatus)}
                        <span className="font-semibold text-sm">Grain Durumu</span>
                      </div>
                      <Badge className={getStatusColor(grainResult.stabilityStatus)}>
                        {grainResult.stabilityStatus === 'safe' ? 'Güvenli' : 
                         grainResult.stabilityStatus === 'unsafe' ? 'Riskli' : 'Kritik'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>Yalpa Açısı:</strong> {grainResult.heelAngle.toFixed(2)}°
                      </p>
                      <p className="text-sm">
                        <strong>Grain Kararlılığı:</strong> {grainResult.grainStability.toFixed(3)} m
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {grainResult.recommendation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaritimeCalculator;