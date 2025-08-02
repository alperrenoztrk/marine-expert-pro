import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Ship, TrendingUp, Target, Waves, AlertTriangle, CheckCircle, Anchor } from "lucide-react";
import { toast } from "sonner";

interface StabilityData {
  // 🎯 Temel Stabilite Formülleri
  KM: number; // Metacentric height from keel [m]
  KG: number; // Center of gravity height [m]
  KB: number; // Center of buoyancy height [m]
  BM: number; // Metacentric radius [m]
  T: number; // Draft [m]
  B: number; // Breadth [m]
  L: number; // Length [m]
  CB: number; // Block coefficient
  CWP: number; // Waterplane coefficient
  delta: number; // Displacement [ton]
  
  // 🌊 GZ Eğrisi ve Stabilite Kolu
  phi: number; // Heel angle [°]
  gz_small: number; // GZ for small angles [m]
  gz_large: number; // GZ for large angles [m]
  g: number; // Gravitational acceleration [m/s²]
  
  // 🔄 Free Surface Effect
  Ixx: number; // Moment of inertia [m⁴]
  rho_fluid: number; // Fluid density [t/m³]
  L_tank: number; // Tank length [m]
  B_tank: number; // Tank breadth [m]
  h_tank: number; // Tank height [m]
  
  // 🌪️ Wind and Weather Stability
  P_wind: number; // Wind pressure [N/m²]
  A_wind: number; // Wind area [m²]
  h_wind: number; // Wind height [m]
  wind_moment: number; // Wind moment [kN.m]
  
  // 📊 IMO Stability Criteria
  area_0to30: number; // Area 0-30° [m.rad]
  area_0to40: number; // Area 0-40° [m.rad]
  area_30to40: number; // Area 30-40° [m.rad]
  gz_max: number; // Maximum GZ [m]
  phi_max_gz: number; // Angle of max GZ [°]
  
  // 🚨 Critical Angles
  LCG: number; // Longitudinal center of gravity [m]
  LCB: number; // Longitudinal center of buoyancy [m]
  phi_list: number; // Angle of list [°]
  phi_loll: number; // Angle of loll [°]
  phi_vanishing: number; // Vanishing angle [°]
  phi_deck: number; // Deck edge angle [°]
  
  // 🛡️ Damage Stability
  V_compartment: number; // Compartment volume [m³]
  permeability: number; // Permeability factor
  KG_flooded: number; // KG of flooded compartment [m]
  delta_flooded: number; // Displacement of flooded water [ton]
  M_flooded: number; // Flooding moment [ton.m]
  
  // 🎯 Additional Parameters
  rho_sw: number; // Seawater density [t/m³]
  I_waterplane: number; // Waterplane moment of inertia [m⁴]
  volume_displacement: number; // Volume displacement [m³]
}

interface StabilityResults {
  // 🎯 Temel Stabilite Formülleri
  GM: number; // [m]
  GM_corrected: number; // [m]
  KM_calculated: number; // [m]
  KB_calculated: number; // [m]
  BM_calculated: number; // [m]
  
  // 🌊 GZ Eğrisi ve Stabilite Kolu
  GZ_small: number; // [m]
  GZ_large: number; // [m]
  righting_moment: number; // [kN.m]
  dynamic_stability: number; // [m.rad]
  area_under_curve: number; // [m.rad]
  
  // 🔄 Free Surface Effect
  FSC: number; // [m]
  FSC_total: number; // [m]
  Ixx_calculated: number; // [m⁴]
  
  // 🌪️ Wind and Weather Stability
  wind_heel_angle: number; // [°]
  wind_moment_calculated: number; // [kN.m]
  weather_criterion: boolean;
  
  // 📊 IMO Stability Criteria
  imo_compliance: {
    area_0to30: boolean;
    area_0to40: boolean;
    area_30to40: boolean;
    gz_max: boolean;
    initial_gm: boolean;
    weather_criterion: boolean;
  };
  
  // 🚨 Critical Angles
  angle_of_list: number; // [°]
  angle_of_loll: number; // [°]
  vanishing_angle: number; // [°]
  deck_edge_angle: number; // [°]
  
  // 🛡️ Damage Stability
  flooded_volume: number; // [m³]
  KG_new: number; // [m]
  delta_new: number; // [ton]
  GM_residual: number; // [m]
  heel_angle: number; // [°]
  
  // 🎯 Additional Results
  stability_status: 'excellent' | 'good' | 'acceptable' | 'poor' | 'dangerous';
  recommendations: string[];
  calculations: {
    stability_index: number; // [%]
    safety_margin: number; // [%]
    compliance_score: number; // [%]
  };
}

export const StabilityCalculations = () => {
  const [data, setData] = useState<Partial<StabilityData>>({
    // Default values
    rho_sw: 1.025, // Seawater density [t/m³]
    rho_fluid: 1.025, // Fluid density [t/m³]
    g: 9.81, // Gravitational acceleration [m/s²]
    CB: 0.75, // Block coefficient
    CWP: 0.85, // Waterplane coefficient
    permeability: 0.85, // Permeability factor
    phi: 15, // Default heel angle [°]
  });
  const [results, setResults] = useState<Partial<StabilityResults>>({});
  const [activeTab, setActiveTab] = useState("basic");

  // 🎯 Temel Stabilite Formülleri
  const calculateGM = () => {
    if (!data.KM || !data.KG) {
      toast.error("Lütfen KM ve KG değerlerini girin.");
      return;
    }
    
    const GM = data.KM - data.KG;
    const GM_corrected = GM - (results.FSC_total || 0);
    
    // Determine stability status
    let stabilityStatus: StabilityResults['stability_status'] = 'excellent';
    let recommendations: string[] = [];
    
    if (GM_corrected >= 0.5 && GM_corrected <= 1.5) {
      stabilityStatus = 'excellent';
      recommendations.push("Mükemmel stabilite durumu");
    } else if (GM_corrected >= 0.15 && GM_corrected < 0.5) {
      stabilityStatus = 'good';
      recommendations.push("İyi stabilite durumu");
    } else if (GM_corrected >= 0.05 && GM_corrected < 0.15) {
      stabilityStatus = 'acceptable';
      recommendations.push("Kabul edilebilir stabilite");
    } else if (GM_corrected >= 0 && GM_corrected < 0.05) {
      stabilityStatus = 'poor';
      recommendations.push("Zayıf stabilite - dikkat!");
    } else {
      stabilityStatus = 'dangerous';
      recommendations.push("ACİL: Negatif GM - güvenlik riski!");
    }
    
    setResults(prev => ({ 
      ...prev, 
      GM,
      GM_corrected,
      stability_status: stabilityStatus,
      recommendations
    }));
    
    toast.success(`GM: ${GM.toFixed(3)}m - GM_corrected: ${GM_corrected.toFixed(3)}m`);
  };

  const calculateKM = () => {
    if (!data.KB || !data.BM) {
      toast.error("Lütfen KB ve BM değerlerini girin.");
      return;
    }
    
    const KM = data.KB + data.BM;
    
    setResults(prev => ({ 
      ...prev, 
      KM_calculated: KM
    }));
    
    toast.success(`KM: ${KM.toFixed(3)}m`);
  };

  const calculateKB = () => {
    if (!data.T || !data.CB || !data.CWP) {
      toast.error("Lütfen T, CB ve CWP değerlerini girin.");
      return;
    }
    
    const KB = data.T * (0.5 - (1/12) * (1 - data.CWP/data.CB));
    
    setResults(prev => ({ 
      ...prev, 
      KB_calculated: KB
    }));
    
    toast.success(`KB: ${KB.toFixed(3)}m`);
  };

  const calculateBM = () => {
    if (!data.L || !data.B || !data.delta) {
      toast.error("Lütfen L, B ve Δ değerlerini girin.");
      return;
    }
    
    const I_waterplane = (data.L * Math.pow(data.B, 3)) / 12;
    const volume_displacement = data.delta / (data.rho_sw || 1.025);
    const BM = I_waterplane / volume_displacement;
    
    setResults(prev => ({ 
      ...prev, 
      BM_calculated: BM,
      I_waterplane,
      volume_displacement
    }));
    
    toast.success(`BM: ${BM.toFixed(3)}m - I_waterplane: ${I_waterplane.toFixed(1)}m⁴`);
  };

  // 🌊 GZ Eğrisi ve Stabilite Kolu
  const calculateGZ = () => {
    if (!data.phi || !results.GM_corrected || !data.KM || !data.KG) {
      toast.error("Lütfen φ değerini girin ve önce GM hesaplayın.");
      return;
    }
    
    const phiRad = (data.phi * Math.PI) / 180;
    const GZ_small = results.GM_corrected * Math.sin(phiRad);
    const GZ_large = (data.KM - data.KG) * Math.sin(phiRad);
    const righting_moment = GZ_small * (data.delta || 25000) * (data.g || 9.81) / 1000; // kN.m
    
    setResults(prev => ({ 
      ...prev, 
      GZ_small,
      GZ_large,
      righting_moment
    }));
    
    toast.success(`GZ (küçük açılar): ${GZ_small.toFixed(3)}m - Righting Moment: ${righting_moment.toFixed(1)} kN.m`);
  };

  const calculateDynamicStability = () => {
    if (!data.phi || !results.GZ_small) {
      toast.error("Lütfen φ değerini girin ve önce GZ hesaplayın.");
      return;
    }
    
    // Simplified dynamic stability calculation
    const dynamic_stability = results.GZ_small * data.phi * (Math.PI / 180);
    const area_under_curve = dynamic_stability;
    
    setResults(prev => ({ 
      ...prev, 
      dynamic_stability,
      area_under_curve
    }));
    
    toast.success(`Dinamik Stabilite: ${dynamic_stability.toFixed(3)} m.rad`);
  };

  // 🔄 Free Surface Effect
  const calculateFSC = () => {
    if (!data.L_tank || !data.B_tank || !data.rho_fluid || !data.delta) {
      toast.error("Lütfen tank boyutları, ρ_fluid ve Δ değerlerini girin.");
      return;
    }
    
    const Ixx = (data.L_tank * Math.pow(data.B_tank, 3)) / 12;
    const FSC = (Ixx * data.rho_fluid) / data.delta;
    const FSC_total = FSC; // Simplified - could be sum of multiple tanks
    
    setResults(prev => ({ 
      ...prev, 
      FSC,
      FSC_total,
      Ixx_calculated: Ixx
    }));
    
    toast.success(`FSC: ${FSC.toFixed(3)}m - Ixx: ${Ixx.toFixed(1)}m⁴`);
  };

  // 🌪️ Wind and Weather Stability
  const calculateWindStability = () => {
    if (!data.P_wind || !data.A_wind || !data.h_wind || !data.delta || results.GM_corrected) {
      toast.error("Lütfen rüzgar parametrelerini girin ve önce GM hesaplayın.");
      return;
    }
    
    const wind_moment = (data.P_wind * data.A_wind * data.h_wind) / 1000; // kN.m
    const righting_moment = (data.delta || 25000) * (results.GM_corrected || 1.0) * (data.g || 9.81) / 1000; // kN.m
    const wind_heel_angle = Math.atan(wind_moment / righting_moment) * (180 / Math.PI);
    const weather_criterion = wind_heel_angle <= 15; // Simplified criterion
    
    setResults(prev => ({ 
      ...prev, 
      wind_heel_angle,
      wind_moment_calculated: wind_moment,
      weather_criterion
    }));
    
    toast.success(`Rüzgar Yatma Açısı: ${wind_heel_angle.toFixed(2)}° - Hava Kriteri: ${weather_criterion ? 'Uygun' : 'Uygun Değil'}`);
  };

  // 📊 IMO Stability Criteria
  const calculateIMOCompliance = () => {
    if (!results.area_0to30 || !results.area_0to40 || !results.area_30to40 || !results.GZ_small || results.GM_corrected === undefined) {
      toast.error("Lütfen önce GZ ve alan hesaplamalarını yapın.");
      return;
    }
    
    const imo_compliance = {
      area_0to30: results.area_0to30 >= 3.151,
      area_0to40: results.area_0to40 >= 5.157,
      area_30to40: results.area_30to40 >= 1.719,
      gz_max: results.GZ_small >= 0.20,
      initial_gm: results.GM_corrected >= 0.15,
      weather_criterion: results.weather_criterion || false
    };
    
    const compliance_score = Object.values(imo_compliance).filter(Boolean).length / 6 * 100;
    
    setResults(prev => ({ 
      ...prev, 
      imo_compliance,
      calculations: {
        ...prev.calculations,
        compliance_score
      }
    }));
    
    toast.success(`IMO Uygunluk Skoru: ${compliance_score.toFixed(1)}%`);
  };

  // 🚨 Critical Angles
  const calculateCriticalAngles = () => {
    if (!data.LCG || !data.LCB || results.GM_corrected === undefined || !data.BM) {
      toast.error("Lütfen LCG, LCB, GM ve BM değerlerini girin.");
      return;
    }
    
    const angle_of_list = Math.atan((data.LCG - data.LCB) / results.GM_corrected) * (180 / Math.PI);
    const angle_of_loll = results.GM_corrected < 0 ? Math.acos(-results.GM_corrected / data.BM) * (180 / Math.PI) : 0;
    const vanishing_angle = 90; // Simplified
    const deck_edge_angle = Math.atan((data.T || 8) / ((data.B || 25) / 2)) * (180 / Math.PI);
    
    setResults(prev => ({ 
      ...prev, 
      angle_of_list,
      angle_of_loll,
      vanishing_angle,
      deck_edge_angle
    }));
    
    toast.success(`List Açısı: ${angle_of_list.toFixed(2)}° - Loll Açısı: ${angle_of_loll.toFixed(2)}°`);
  };

  // 🛡️ Damage Stability
  const calculateDamageStability = () => {
    if (!data.V_compartment || !data.permeability || !data.KG_flooded || !data.delta_flooded || !data.M_flooded || data.delta) {
      toast.error("Lütfen hasar parametrelerini girin.");
      return;
    }
    
    const flooded_volume = data.V_compartment * data.permeability;
    const delta_new = data.delta + data.delta_flooded;
    const KG_new = ((data.KG || 8) * data.delta + data.KG_flooded * data.delta_flooded) / delta_new;
    const GM_residual = (data.KM || 10) - KG_new;
    const heel_angle = Math.atan(data.M_flooded / (delta_new * GM_residual)) * (180 / Math.PI);
    
    setResults(prev => ({ 
      ...prev, 
      flooded_volume,
      delta_new,
      KG_new,
      GM_residual,
      heel_angle
    }));
    
    toast.success(`Hasar Sonrası GM: ${GM_residual.toFixed(3)}m - Yatma Açısı: ${heel_angle.toFixed(2)}°`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Anchor className="h-6 w-6" />
            Stabilite Hesaplamaları
          </CardTitle>
          <CardDescription>
            IMO, SOLAS ve IS Code standartlarına uygun kapsamlı stabilite analizi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">🎯 Temel</TabsTrigger>
              <TabsTrigger value="gz">🌊 GZ</TabsTrigger>
              <TabsTrigger value="fsc">🔄 FSC</TabsTrigger>
              <TabsTrigger value="wind">🌪️ Rüzgar</TabsTrigger>
              <TabsTrigger value="imo">📊 IMO</TabsTrigger>
              <TabsTrigger value="damage">🛡️ Hasar</TabsTrigger>
            </TabsList>

            {/* 🎯 Temel Stabilite Formülleri */}
            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      GM (Metacentric Height): GM = KM - KG
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="KM">KM [m]</Label>
                        <Input
                          id="KM"
                          type="number"
                          step="0.01"
                          value={data.KM || ''}
                          onChange={(e) => setData({...data, KM: parseFloat(e.target.value)})}
                          placeholder="10.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="KG">KG [m]</Label>
                        <Input
                          id="KG"
                          type="number"
                          step="0.01"
                          value={data.KG || ''}
                          onChange={(e) => setData({...data, KG: parseFloat(e.target.value)})}
                          placeholder="8.0"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateGM} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      GM Hesapla
                    </Button>
                    {results.GM !== undefined && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.GM.toFixed(3)} m</div>
                        <div className="text-sm text-muted-foreground">GM</div>
                        {results.GM_corrected !== undefined && (
                          <div className="text-lg font-semibold mt-1">{results.GM_corrected.toFixed(3)} m</div>
                        )}
                        <Badge className={`mt-2 ${
                          results.stability_status === 'excellent' ? 'bg-green-500' :
                          results.stability_status === 'good' ? 'bg-blue-500' :
                          results.stability_status === 'acceptable' ? 'bg-yellow-500' :
                          results.stability_status === 'poor' ? 'bg-orange-500' : 'bg-red-500'
                        }`}>
                          {results.stability_status?.toUpperCase()}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      KM: KM = KB + BM
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="KB">KB [m]</Label>
                        <Input
                          id="KB"
                          type="number"
                          step="0.01"
                          value={data.KB || ''}
                          onChange={(e) => setData({...data, KB: parseFloat(e.target.value)})}
                          placeholder="4.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="BM">BM [m]</Label>
                        <Input
                          id="BM"
                          type="number"
                          step="0.01"
                          value={data.BM || ''}
                          onChange={(e) => setData({...data, BM: parseFloat(e.target.value)})}
                          placeholder="6.0"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateKM} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      KM Hesapla
                    </Button>
                    {results.KM_calculated !== undefined && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.KM_calculated.toFixed(3)} m</div>
                        <div className="text-sm text-muted-foreground">KM</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Waves className="h-5 w-5" />
                      KB: KB = T × (0.5 - (1/12) × (1 - CWP/CB))
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="T">T [m]</Label>
                        <Input
                          id="T"
                          type="number"
                          step="0.01"
                          value={data.T || ''}
                          onChange={(e) => setData({...data, T: parseFloat(e.target.value)})}
                          placeholder="8.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="CB">CB</Label>
                        <Input
                          id="CB"
                          type="number"
                          step="0.01"
                          value={data.CB || ''}
                          onChange={(e) => setData({...data, CB: parseFloat(e.target.value)})}
                          placeholder="0.75"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="CWP">CWP</Label>
                        <Input
                          id="CWP"
                          type="number"
                          step="0.01"
                          value={data.CWP || ''}
                          onChange={(e) => setData({...data, CWP: parseFloat(e.target.value)})}
                          placeholder="0.85"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateKB} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      KB Hesapla
                    </Button>
                    {results.KB_calculated !== undefined && (
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.KB_calculated.toFixed(3)} m</div>
                        <div className="text-sm text-muted-foreground">KB</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      BM: BM = I_waterplane / ∇
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="L">L [m]</Label>
                        <Input
                          id="L"
                          type="number"
                          value={data.L || ''}
                          onChange={(e) => setData({...data, L: parseFloat(e.target.value)})}
                          placeholder="150"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="B">B [m]</Label>
                        <Input
                          id="B"
                          type="number"
                          value={data.B || ''}
                          onChange={(e) => setData({...data, B: parseFloat(e.target.value)})}
                          placeholder="25"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="delta">Δ [ton]</Label>
                        <Input
                          id="delta"
                          type="number"
                          value={data.delta || ''}
                          onChange={(e) => setData({...data, delta: parseFloat(e.target.value)})}
                          placeholder="25000"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateBM} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      BM Hesapla
                    </Button>
                    {results.BM_calculated !== undefined && (
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.BM_calculated.toFixed(3)} m</div>
                        <div className="text-sm text-muted-foreground">BM</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 🌊 GZ Eğrisi ve Stabilite Kolu */}
            <TabsContent value="gz" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      GZ (Righting Arm): GZ = GM × sin(φ)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phi">φ (Heel Angle) [°]</Label>
                      <Input
                        id="phi"
                        type="number"
                        step="0.1"
                        value={data.phi || ''}
                        onChange={(e) => setData({...data, phi: parseFloat(e.target.value)})}
                        placeholder="15"
                      />
                    </div>
                    <Button onClick={calculateGZ} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      GZ Hesapla
                    </Button>
                    {results.GZ_small !== undefined && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.GZ_small.toFixed(3)} m</div>
                        <div className="text-sm text-muted-foreground">GZ (Küçük açılar)</div>
                        {results.righting_moment !== undefined && (
                          <div className="text-lg font-semibold mt-1">{results.righting_moment.toFixed(1)} kN.m</div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Waves className="h-5 w-5" />
                      Dynamic Stability: ∫GZ dφ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={calculateDynamicStability} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Dinamik Stabilite Hesapla
                    </Button>
                    {results.dynamic_stability !== undefined && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.dynamic_stability.toFixed(3)} m.rad</div>
                        <div className="text-sm text-muted-foreground">Dinamik Stabilite</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 🔄 Free Surface Effect */}
            <TabsContent value="fsc" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      FSC: FSC = (Ixx × ρ_fluid) / Δ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="L_tank">L_tank [m]</Label>
                        <Input
                          id="L_tank"
                          type="number"
                          value={data.L_tank || ''}
                          onChange={(e) => setData({...data, L_tank: parseFloat(e.target.value)})}
                          placeholder="20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="B_tank">B_tank [m]</Label>
                        <Input
                          id="B_tank"
                          type="number"
                          value={data.B_tank || ''}
                          onChange={(e) => setData({...data, B_tank: parseFloat(e.target.value)})}
                          placeholder="15"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rho_fluid">ρ_fluid [t/m³]</Label>
                        <Input
                          id="rho_fluid"
                          type="number"
                          step="0.001"
                          value={data.rho_fluid || ''}
                          onChange={(e) => setData({...data, rho_fluid: parseFloat(e.target.value)})}
                          placeholder="1.025"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="delta_fsc">Δ [ton]</Label>
                        <Input
                          id="delta_fsc"
                          type="number"
                          value={data.delta || ''}
                          onChange={(e) => setData({...data, delta: parseFloat(e.target.value)})}
                          placeholder="25000"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateFSC} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      FSC Hesapla
                    </Button>
                    {results.FSC !== undefined && (
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.FSC.toFixed(3)} m</div>
                        <div className="text-sm text-muted-foreground">FSC</div>
                        {results.Ixx_calculated !== undefined && (
                          <div className="text-lg font-semibold mt-1">{results.Ixx_calculated.toFixed(1)} m⁴</div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 🌪️ Wind and Weather Stability */}
            <TabsContent value="wind" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Wind Heel Angle: φ_wind = arctan(Wind_Moment / Righting_Moment)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="P_wind">P_wind [N/m²]</Label>
                        <Input
                          id="P_wind"
                          type="number"
                          value={data.P_wind || ''}
                          onChange={(e) => setData({...data, P_wind: parseFloat(e.target.value)})}
                          placeholder="504"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="A_wind">A_wind [m²]</Label>
                        <Input
                          id="A_wind"
                          type="number"
                          value={data.A_wind || ''}
                          onChange={(e) => setData({...data, A_wind: parseFloat(e.target.value)})}
                          placeholder="1000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="h_wind">h_wind [m]</Label>
                        <Input
                          id="h_wind"
                          type="number"
                          value={data.h_wind || ''}
                          onChange={(e) => setData({...data, h_wind: parseFloat(e.target.value)})}
                          placeholder="15"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateWindStability} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Rüzgar Stabilitesi Hesapla
                    </Button>
                    {results.wind_heel_angle !== undefined && (
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.wind_heel_angle.toFixed(2)}°</div>
                        <div className="text-sm text-muted-foreground">Rüzgar Yatma Açısı</div>
                        <Badge className={`mt-2 ${results.weather_criterion ? 'bg-green-500' : 'bg-red-500'}`}>
                          {results.weather_criterion ? 'UYGUN' : 'UYGUN DEĞİL'}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 📊 IMO Stability Criteria */}
            <TabsContent value="imo" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      IMO Stability Criteria
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={calculateIMOCompliance} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      IMO Uygunluk Kontrolü
                    </Button>
                    {results.imo_compliance && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 gap-2">
                          {Object.entries(results.imo_compliance).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2 p-2 rounded">
                              {value ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              )}
                              <span className="text-sm">
                                {key === 'area_0to30' && 'Area 0-30° ≥ 3.151 m.rad'}
                                {key === 'area_0to40' && 'Area 0-40° ≥ 5.157 m.rad'}
                                {key === 'area_30to40' && 'Area 30-40° ≥ 1.719 m.rad'}
                                {key === 'gz_max' && 'GZ_max ≥ 0.20 m at φ ≥ 30°'}
                                {key === 'initial_gm' && 'Initial GM ≥ 0.15 m'}
                                {key === 'weather_criterion' && 'Weather Criterion'}
                              </span>
                            </div>
                          ))}
                        </div>
                        {results.calculations?.compliance_score !== undefined && (
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold">{results.calculations.compliance_score.toFixed(1)}%</div>
                            <div className="text-sm text-muted-foreground">IMO Uygunluk Skoru</div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 🛡️ Damage Stability */}
            <TabsContent value="damage" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Damage Stability
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="V_compartment">V_compartment [m³]</Label>
                        <Input
                          id="V_compartment"
                          type="number"
                          value={data.V_compartment || ''}
                          onChange={(e) => setData({...data, V_compartment: parseFloat(e.target.value)})}
                          placeholder="500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="permeability">Permeability</Label>
                        <Input
                          id="permeability"
                          type="number"
                          step="0.01"
                          value={data.permeability || ''}
                          onChange={(e) => setData({...data, permeability: parseFloat(e.target.value)})}
                          placeholder="0.85"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="KG_flooded">KG_flooded [m]</Label>
                        <Input
                          id="KG_flooded"
                          type="number"
                          step="0.01"
                          value={data.KG_flooded || ''}
                          onChange={(e) => setData({...data, KG_flooded: parseFloat(e.target.value)})}
                          placeholder="4.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="delta_flooded">Δ_flooded [ton]</Label>
                        <Input
                          id="delta_flooded"
                          type="number"
                          value={data.delta_flooded || ''}
                          onChange={(e) => setData({...data, delta_flooded: parseFloat(e.target.value)})}
                          placeholder="425"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateDamageStability} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Hasar Stabilitesi Hesapla
                    </Button>
                    {results.GM_residual !== undefined && (
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.GM_residual.toFixed(3)} m</div>
                        <div className="text-sm text-muted-foreground">Residual GM</div>
                        {results.heel_angle !== undefined && (
                          <div className="text-lg font-semibold mt-1">{results.heel_angle.toFixed(2)}°</div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};