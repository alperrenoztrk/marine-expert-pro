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
  Q_cross: number; // Cross flooding rate [m³/min]
  h_vent: number; // Vent height [m]
  t_cross: number; // Cross flooding time [min]
  
  // 🌾 Grain Stability
  M_grain: number; // Grain shift moment [ton.m]
  phi_grain: number; // Grain heel angle [°]
  SF_grain: number; // Grain safety factor
  
  // 🔬 Advanced Stability
  k: number; // Radius of gyration [m]
  T_roll: number; // Rolling period [s]
  T_natural: number; // Natural period [s]
  E_heel: number; // Energy to heel [m.rad]
  SI: number; // Stability index [%]
  SM: number; // Safety margin [%]
  T_wave: number; // Wave period [s]
  stability_range: number; // Stability range [°]
  stability_quality: number; // Stability quality factor
  
  // 📈 GZ Curve Generation
  reduction_factor: number; // Deck edge reduction factor
  
  // 🎯 Additional Parameters
  rho_sw: number; // Seawater density [t/m³]
  I_waterplane: number; // Waterplane moment of inertia [m⁴]
  volume_displacement: number; // Volume displacement [m³]
  weights: number[]; // Array of weights [ton]
  heights: number[]; // Array of heights [m]
  tanks: Array<{L: number, B: number, rho: number}>; // Tank information
  
  // 🌪️ Wind and Weather Stability - Additional
  righting_moment: number; // Righting moment [kN.m]
  
  // 🛡️ Damage Stability - Additional
  KG_old: number; // Original KG [m]
  delta_old: number; // Original displacement [ton]
  KM_new: number; // New KM after flooding [m]
  
  // 🌾 Grain Stability - Additional
  phi_allowable: number; // Allowable heel angle [°]
  GM_standard: number; // Standard GM [m]
  GM_min: number; // Minimum GM [m]
  
  // 📈 GZ Curve Generation - Additional
  phi_max: number; // Maximum angle for energy calculation [°]
  gz_reduced: number; // Reduced GZ after deck edge immersion [m]
  
  // 🚢 Doğrultucu Moment - Additional
  H: number; // Height of vessel [m]
  heel_angle: number; // Heel angle for righting moment [°]
  draft_calculated: number; // Calculated draft [m]
  GM_calculated: number; // Calculated GM for righting moment [m]
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
  area_0to30: number; // Area 0-30° [m.rad]
  area_0to40: number; // Area 0-40° [m.rad]
  area_30to40: number; // Area 30-40° [m.rad]
  KG_calculated: number; // Calculated KG [m]
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
  t_cross: number; // [min]
  phi_eq: number; // [°]
  phi_down: number; // [°]
  survival_factor: number; // [%]
  
  // 🌾 Grain Stability
  M_grain_calculated: number; // [ton.m]
  phi_grain_calculated: number; // [°]
  SF_grain_calculated: number;
  grain_compliance: boolean;
  
  // 🔬 Advanced Stability
  T_roll_calculated: number; // [s]
  T_natural_calculated: number; // [s]
  E_heel_calculated: number; // [m.rad]
  SI_calculated: number; // [%]
  SM_calculated: number; // [%]
  resonance_check: boolean;
  stability_range_calculated: number; // [°]
  stability_quality_calculated: number;
  
  // 📈 GZ Curve Generation
  gz_curve_points: Array<{angle: number, gz: number}>;
  phi_max_gz_calculated: number; // [°]
  gz_max_calculated: number; // [m]
  gz_reduced_calculated: number; // [m]
  area_calculated: number; // [m.rad]
  dynamic_stability_calculated: number; // [m.rad]
  righting_moment_calculated: number; // [kN.m]
  
  // 🎯 Additional Results
  stability_status: 'excellent' | 'good' | 'acceptable' | 'poor' | 'dangerous';
  recommendations: string[];
  calculations: {
    stability_index: number; // [%]
    safety_margin: number; // [%]
    compliance_score: number; // [%]
  };
  
  // 🌪️ Wind and Weather Stability - Additional Results
  area_30to40_calculated: number; // [m.rad]
  area_30to40_compliance: boolean;
  
  // 🛡️ Damage Stability - Additional Results
  KG_old_calculated: number; // [m]
  delta_old_calculated: number; // [ton]
  KM_new_calculated: number; // [m]
  
  // 🌾 Grain Stability - Additional Results
  phi_allowable_calculated: number; // [°]
  grain_stability_criterion: boolean;
  
  // 🔬 Advanced Stability - Additional Results
  GM_standard_calculated: number; // [m]
  GM_min_calculated: number; // [m]
  
  // 🚢 Doğrultucu Moment - Additional Results
  draft_calculated: number; // [m]
  GM_calculated: number; // [m]
  righting_moment_special: number; // [ton.m]
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

  const calculateKG = () => {
    if (!data.weights || !data.heights) {
      toast.error("Lütfen ağırlık ve yükseklik değerlerini girin.");
      return;
    }
    
    // KG = Σ(Wi × zi) / ΣWi
    const totalWeight = data.weights.reduce((sum, weight) => sum + weight, 0);
    const weightedSum = data.weights.reduce((sum, weight, index) => 
      sum + (weight * data.heights[index]), 0);
    const KG = weightedSum / totalWeight;
    
    setResults(prev => ({ 
      ...prev, 
      KG_calculated: KG
    }));
    
    toast.success(`KG: ${KG.toFixed(3)}m`);
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
  const calculateArea0to30 = () => {
    if (!results.GM_corrected || !data.phi) {
      toast.error("Lütfen önce GM hesaplayın ve φ değerini girin.");
      return;
    }
    
    // Simplified area calculation for 0-30°
    const area_0to30 = results.GM_corrected * 30 * (Math.PI / 180) * 0.5; // Simplified trapezoidal rule
    
    setResults(prev => ({ 
      ...prev, 
      area_0to30
    }));
    
    toast.success(`Area 0-30°: ${area_0to30.toFixed(3)} m.rad`);
  };

  const calculateArea0to40 = () => {
    if (!results.GM_corrected || !data.phi) {
      toast.error("Lütfen önce GM hesaplayın ve φ değerini girin.");
      return;
    }
    
    // Simplified area calculation for 0-40°
    const area_0to40 = results.GM_corrected * 40 * (Math.PI / 180) * 0.5; // Simplified trapezoidal rule
    
    setResults(prev => ({ 
      ...prev, 
      area_0to40
    }));
    
    toast.success(`Area 0-40°: ${area_0to40.toFixed(3)} m.rad`);
  };

  const calculateArea30to40 = () => {
    if (!results.area_0to30 || !results.area_0to40) {
      toast.error("Lütfen önce Area 0-30° ve Area 0-40° hesaplayın.");
      return;
    }
    
    const area_30to40 = results.area_0to40 - results.area_0to30;
    
    setResults(prev => ({ 
      ...prev, 
      area_30to40,
      area_30to40_calculated: area_30to40,
      area_30to40_compliance: area_30to40 >= 1.719
    }));
    
    toast.success(`Area 30-40°: ${area_30to40.toFixed(3)} m.rad - ${area_30to40 >= 1.719 ? 'UYGUN' : 'UYGUN DEĞİL'}`);
  };

  const calculateIMOCompliance = () => {
    if (!results.area_0to30 || !results.area_0to40 || !results.area_30to40 || !results.GZ_small || results.GM_corrected === undefined) {
      toast.error("Lütfen önce tüm area hesaplamalarını ve GZ hesaplayın.");
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
    
    // Cross flooding calculations
    const Q_cross = data.Q_cross || 50; // Default 50 m³/min
    const t_cross = data.V_compartment / Q_cross;
    const phi_eq = heel_angle * (1 - Math.exp(-1)); // Simplified equalization
    const phi_down = Math.atan(((data.h_vent || 15) - (data.T || 8)) / ((data.B || 25) / 2)) * (180 / Math.PI);
    const survival_factor = (GM_residual / (results.GM_corrected || 1.0)) * 100;
    
    setResults(prev => ({ 
      ...prev, 
      flooded_volume,
      delta_new,
      KG_new,
      GM_residual,
      heel_angle,
      t_cross,
      phi_eq,
      phi_down,
      survival_factor
    }));
    
    toast.success(`Hasar Sonrası GM: ${GM_residual.toFixed(3)}m - Yatma Açısı: ${heel_angle.toFixed(2)}° - Cross Flooding: ${t_cross.toFixed(1)} min`);
  };

  // 🌾 Grain Stability
  const calculateGrainStability = () => {
    if (!data.delta || results.GM_corrected === undefined || !data.B) {
      toast.error("Lütfen Δ, GM ve B değerlerini girin.");
      return;
    }
    
    const M_grain = data.delta * 0.05 * (data.B / 2);
    const phi_grain = Math.atan(M_grain / (data.delta * results.GM_corrected)) * (180 / Math.PI);
    const SF_grain = 12 / phi_grain;
    const grain_compliance = phi_grain <= 12;
    
    setResults(prev => ({ 
      ...prev, 
      M_grain_calculated: M_grain,
      phi_grain_calculated: phi_grain,
      SF_grain_calculated: SF_grain,
      grain_compliance
    }));
    
    toast.success(`Tahıl Yatma Açısı: ${phi_grain.toFixed(2)}° - Güvenlik Faktörü: ${SF_grain.toFixed(2)}`);
  };

  // 🔬 Advanced Stability
  const calculateAdvancedStability = () => {
    if (!results.GM_corrected || !data.k || !data.B) {
      toast.error("Lütfen GM, k (radius of gyration) ve B değerlerini girin.");
      return;
    }
    
    const k = data.k || data.B * 0.4; // Default radius of gyration
    const T_roll = 2 * Math.PI * Math.sqrt(Math.pow(k, 2) / ((data.g || 9.81) * results.GM_corrected));
    const T_natural = 2 * Math.PI * Math.sqrt(Math.pow(k, 2) / ((data.g || 9.81) * results.GM_corrected));
    const E_heel = results.GZ_small * (data.phi || 15) * (Math.PI / 180); // Simplified energy calculation
    const SI = (results.GM_corrected / 1.0) * 100; // Standard GM = 1.0m
    const SM = ((results.GM_corrected - 0.15) / 0.15) * 100; // Minimum GM = 0.15m
    const T_wave = data.T_wave || 8; // Default wave period
    const resonance_check = Math.abs(T_wave / T_roll - 1) < 0.2; // Resonance check
    const stability_range = 90 - (results.angle_of_list || 0); // Simplified range
    const stability_quality = results.area_0to30 / (results.GM_corrected * 30 * Math.PI / 180);
    
    setResults(prev => ({ 
      ...prev, 
      T_roll_calculated: T_roll,
      T_natural_calculated: T_natural,
      E_heel_calculated: E_heel,
      SI_calculated: SI,
      SM_calculated: SM,
      resonance_check,
      stability_range_calculated: stability_range,
      stability_quality_calculated: stability_quality
    }));
    
    toast.success(`Yalpalama Periyodu: ${T_roll.toFixed(1)}s - Stabilite İndeksi: ${SI.toFixed(1)}%`);
  };

  // 📈 GZ Curve Generation
  const calculateGZCurve = () => {
    if (!results.GM_corrected || !data.KM || !data.KG) {
      toast.error("Lütfen GM, KM ve KG değerlerini girin.");
      return;
    }
    
    const gz_curve_points = [];
    let gz_max = 0;
    let phi_max_gz = 0;
    
    for (let angle = 0; angle <= 90; angle += 5) {
      const angleRad = (angle * Math.PI) / 180;
      let gz: number;
      
      if (angle <= 15) {
        // Small angle approximation
        gz = results.GM_corrected * Math.sin(angleRad);
      } else {
        // Large angle calculation
        gz = (data.KM - data.KG) * Math.sin(angleRad);
        
        // Deck edge immersion effect (simplified)
        const deck_edge_angle = Math.atan((data.T || 8) / ((data.B || 25) / 2)) * (180 / Math.PI);
        if (angle > deck_edge_angle) {
          const reduction_factor = Math.pow((angle - deck_edge_angle) / 90, 2) * 0.3;
          gz = gz * (1 - reduction_factor);
        }
      }
      
      gz_curve_points.push({ angle, gz });
      
      if (gz > gz_max) {
        gz_max = gz;
        phi_max_gz = angle;
      }
    }
    
    setResults(prev => ({ 
      ...prev, 
      gz_curve_points,
      gz_max_calculated: gz_max,
      phi_max_gz_calculated: phi_max_gz
    }));
    
    toast.success(`GZ Eğrisi Oluşturuldu - Max GZ: ${gz_max.toFixed(3)}m @ ${phi_max_gz}°`);
  };

  // 🔄 Total FSC Calculation
  const calculateTotalFSC = () => {
    if (!data.tanks || !data.delta) {
      toast.error("Lütfen tank bilgilerini ve Δ değerini girin.");
      return;
    }
    
    // FSC_total = Σ(Ixx_i × ρ_i) / Δ
    let totalFSC = 0;
    data.tanks.forEach(tank => {
      const Ixx = (tank.L * Math.pow(tank.B, 3)) / 12;
      const fsc = (Ixx * tank.rho) / data.delta;
      totalFSC += fsc;
    });
    
    setResults(prev => ({ 
      ...prev, 
      FSC_total: totalFSC
    }));
    
    toast.success(`Total FSC: ${totalFSC.toFixed(3)}m`);
  };

  // 🌪️ Weather Criterion
  const calculateWeatherCriterion = () => {
    if (!results.wind_heel_angle) {
      toast.error("Lütfen önce Wind Heel Angle hesaplayın.");
      return;
    }
    
    const phi_steady = results.wind_heel_angle * 1.5;
    const weather_criterion = phi_steady <= 25; // Simplified criterion
    
    setResults(prev => ({ 
      ...prev, 
      weather_criterion
    }));
    
    toast.success(`Weather Criterion: ${phi_steady.toFixed(2)}° - ${weather_criterion ? 'UYGUN' : 'UYGUN DEĞİL'}`);
  };

  // 📊 Range of Stability
  const calculateStabilityRange = () => {
    if (!results.vanishing_angle || !results.angle_of_list) {
      toast.error("Lütfen önce Critical Angles hesaplayın.");
      return;
    }
    
    const stability_range = results.vanishing_angle - Math.abs(results.angle_of_list);
    const range_compliance = stability_range >= 60;
    
    setResults(prev => ({ 
      ...prev, 
      stability_range_calculated: stability_range
    }));
    
    toast.success(`Stability Range: ${stability_range.toFixed(1)}° - ${range_compliance ? 'UYGUN' : 'UYGUN DEĞİL'}`);
  };

  // 🚨 Vanishing Angle
  const calculateVanishingAngle = () => {
    if (!results.gz_curve_points) {
      toast.error("Lütfen önce GZ Curve hesaplayın.");
      return;
    }
    
    // Find angle where GZ = 0
    let vanishing_angle = 90; // Default
    for (let i = 0; i < results.gz_curve_points.length - 1; i++) {
      if (results.gz_curve_points[i].gz > 0 && results.gz_curve_points[i + 1].gz <= 0) {
        vanishing_angle = results.gz_curve_points[i].angle;
        break;
      }
    }
    
    setResults(prev => ({ 
      ...prev, 
      vanishing_angle
    }));
    
    toast.success(`Vanishing Angle: ${vanishing_angle.toFixed(1)}°`);
  };

  // 🛡️ Cross Flooding Time
  const calculateCrossFloodingTime = () => {
    if (!data.V_compartment || !data.Q_cross) {
      toast.error("Lütfen V_compartment ve Q_cross değerlerini girin.");
      return;
    }
    
    const t_cross = data.V_compartment / data.Q_cross; // minutes
    
    setResults(prev => ({ 
      ...prev, 
      t_cross
    }));
    
    toast.success(`Cross Flooding Time: ${t_cross.toFixed(1)} min`);
  };

  // 🌪️ Area Requirement 30-40°
  const calculateAreaRequirement = () => {
    if (!results.area_30to40_calculated) {
      toast.error("Lütfen önce Area 30-40° hesaplayın.");
      return;
    }
    
    const area_requirement = results.area_30to40_calculated >= 1.719;
    
    setResults(prev => ({ 
      ...prev, 
      area_30to40_compliance: area_requirement
    }));
    
    toast.success(`Area Requirement 30-40°: ${results.area_30to40_calculated.toFixed(3)} m.rad - ${area_requirement ? 'UYGUN' : 'UYGUN DEĞİL'}`);
  };

  // 🛡️ Downflooding Angle
  const calculateDownfloodingAngle = () => {
    if (!data.h_vent || !data.T || !data.B) {
      toast.error("Lütfen h_vent, T ve B değerlerini girin.");
      return;
    }
    
    // φ_down = arctan((h_vent - T) / (B/2))
    const phi_down = Math.atan((data.h_vent - data.T) / (data.B / 2)) * (180 / Math.PI);
    
    setResults(prev => ({ 
      ...prev, 
      phi_down
    }));
    
    toast.success(`Downflooding Angle: ${phi_down.toFixed(2)}°`);
  };

  // 🛡️ Equalized Angle
  const calculateEqualizedAngle = () => {
    if (!results.heel_angle || !results.t_cross) {
      toast.error("Lütfen önce Heel Angle ve Cross Flooding Time hesaplayın.");
      return;
    }
    
    // φ_eq = φ_heel × (1 - e^(-t/t_cross))
    const phi_eq = results.heel_angle * (1 - Math.exp(-1)); // Simplified with t = t_cross
    
    setResults(prev => ({ 
      ...prev, 
      phi_eq
    }));
    
    toast.success(`Equalized Angle: ${phi_eq.toFixed(2)}°`);
  };

  // 🌾 Grain Allowable Heel
  const calculateGrainAllowableHeel = () => {
    if (!data.delta || !data.B || !results.GM_corrected) {
      toast.error("Lütfen Δ, B ve GM değerlerini girin.");
      return;
    }
    
    // φ_allowable = arctan(M_grain / (Δ × GM))
    const M_grain = data.delta * 0.05 * (data.B / 2);
    const phi_allowable = Math.atan(M_grain / (data.delta * results.GM_corrected)) * (180 / Math.PI);
    const grain_stability_criterion = phi_allowable <= 12;
    
    setResults(prev => ({ 
      ...prev, 
      phi_allowable_calculated: phi_allowable,
      grain_stability_criterion
    }));
    
    toast.success(`Grain Allowable Heel: ${phi_allowable.toFixed(2)}° - ${grain_stability_criterion ? 'UYGUN' : 'UYGUN DEĞİL'}`);
  };

  // 🔬 Energy to Heel
  const calculateEnergyToHeel = () => {
    if (!results.GZ_small || !data.phi_max) {
      toast.error("Lütfen önce GZ hesaplayın ve φ_max değerini girin.");
      return;
    }
    
    // E_heel = ∫GZ dφ (0 to φ_max)
    const phi_max_rad = (data.phi_max * Math.PI) / 180;
    const E_heel = results.GZ_small * phi_max_rad; // Simplified integration
    
    setResults(prev => ({ 
      ...prev, 
      E_heel_calculated: E_heel
    }));
    
    toast.success(`Energy to Heel: ${E_heel.toFixed(3)} m.rad`);
  };

  // 🔬 GM Standard and Min
  const calculateGMStandards = () => {
    if (!results.GM_corrected) {
      toast.error("Lütfen önce GM hesaplayın.");
      return;
    }
    
    const GM_standard = 1.0; // Standard GM value
    const GM_min = 0.15; // Minimum GM value
    const SI = (results.GM_corrected / GM_standard) * 100;
    const SM = ((results.GM_corrected - GM_min) / GM_min) * 100;
    
    setResults(prev => ({ 
      ...prev, 
      GM_standard_calculated: GM_standard,
      GM_min_calculated: GM_min,
      SI_calculated: SI,
      SM_calculated: SM
    }));
    
    toast.success(`GM Standard: ${GM_standard}m - GM Min: ${GM_min}m - SI: ${SI.toFixed(1)}% - SM: ${SM.toFixed(1)}%`);
  };

  // 📈 GZ Curve Analysis
  const calculateGZCurveAnalysis = () => {
    if (!results.gz_curve_points || !results.gz_max_calculated) {
      toast.error("Lütfen önce GZ Curve hesaplayın.");
      return;
    }
    
    // Calculate area under curve
    let area = 0;
    for (let i = 0; i < results.gz_curve_points.length - 1; i++) {
      const dphi = (results.gz_curve_points[i + 1].angle - results.gz_curve_points[i].angle) * (Math.PI / 180);
      const gz_avg = (results.gz_curve_points[i].gz + results.gz_curve_points[i + 1].gz) / 2;
      area += gz_avg * dphi;
    }
    
    // Calculate dynamic stability
    const dynamic_stability = area;
    
    // Calculate righting moment
    const righting_moment = results.gz_max_calculated * (data.delta || 25000) * (data.g || 9.81) / 1000;
    
    setResults(prev => ({ 
      ...prev, 
      area_calculated: area,
      dynamic_stability_calculated: dynamic_stability,
      righting_moment_calculated: righting_moment
    }));
    
    toast.success(`GZ Curve Analysis - Area: ${area.toFixed(3)} m.rad - Dynamic Stability: ${dynamic_stability.toFixed(3)} m.rad - Righting Moment: ${righting_moment.toFixed(1)} kN.m`);
  };

  // 🚢 Doğrultucu Moment Hesaplama
  const calculateRightingMoment = () => {
    if (!data.L || !data.B || !data.H || !data.delta || !data.heel_angle) {
      toast.error("Lütfen L, B, H, Δ ve yatma açısı değerlerini girin.");
      return;
    }
    
    // 1. Draft hesaplama (A = L × B × d × density)
    const density = data.rho_sw || 1.025; // t/m³
    const draft = data.delta / (data.L * data.B * density);
    
    // 2. BM hesaplama (BM = B² / (12 × d))
    const BM = Math.pow(data.B, 2) / (12 * draft);
    
    // 3. KB hesaplama (KB = d / 2)
    const KB = draft / 2;
    
    // 4. KM hesaplama (KM = BM + KB)
    const KM = BM + KB;
    
    // 5. KG hesaplama (KG = H / 2)
    const KG = data.H / 2;
    
    // 6. GM hesaplama (GM = KM - KG)
    const GM = KM - KG;
    
    // 7. Doğrultucu Moment = Δ × GM × tan(φ)
    const heel_angle_rad = (data.heel_angle * Math.PI) / 180;
    const righting_moment = data.delta * GM * Math.tan(heel_angle_rad);
    
    setResults(prev => ({ 
      ...prev, 
      draft_calculated: draft,
      BM_calculated: BM,
      KB_calculated: KB,
      KM_calculated: KM,
      KG_calculated: KG,
      GM_calculated: GM,
      righting_moment_special: righting_moment
    }));
    
    toast.success(`Doğrultucu Moment: ${righting_moment.toFixed(1)} ton.m - GM: ${GM.toFixed(3)}m - Draft: ${draft.toFixed(3)}m`);
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
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="basic">🎯 Temel</TabsTrigger>
              <TabsTrigger value="gz">🌊 GZ</TabsTrigger>
              <TabsTrigger value="fsc">🔄 FSC</TabsTrigger>
              <TabsTrigger value="wind">🌪️ Rüzgar</TabsTrigger>
              <TabsTrigger value="imo">📊 IMO</TabsTrigger>
              <TabsTrigger value="damage">🛡️ Hasar</TabsTrigger>
              <TabsTrigger value="grain">🌾 Tahıl</TabsTrigger>
              <TabsTrigger value="advanced">🔬 Gelişmiş</TabsTrigger>
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

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      KG: KG = Σ(Wi × zi) / ΣWi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="weights">Ağırlıklar [ton] (virgülle ayırın)</Label>
                      <Input
                        id="weights"
                        type="text"
                        value={data.weights?.join(', ') || ''}
                        onChange={(e) => setData({...data, weights: e.target.value.split(',').map(w => parseFloat(w.trim()))})}
                        placeholder="1000, 2000, 1500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="heights">Yükseklikler [m] (virgülle ayırın)</Label>
                      <Input
                        id="heights"
                        type="text"
                        value={data.heights?.join(', ') || ''}
                        onChange={(e) => setData({...data, heights: e.target.value.split(',').map(h => parseFloat(h.trim()))})}
                        placeholder="5, 8, 12"
                      />
                    </div>
                    <Button onClick={calculateKG} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      KG Hesapla
                    </Button>
                    {results.KG_calculated !== undefined && (
                      <div className="text-center p-3 bg-indigo-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.KG_calculated.toFixed(3)} m</div>
                        <div className="text-sm text-muted-foreground">KG</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ship className="h-5 w-5" />
                      Doğrultucu Moment: Δ × GM × tan(φ)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="L_righting">L [m]</Label>
                        <Input
                          id="L_righting"
                          type="number"
                          value={data.L || ''}
                          onChange={(e) => setData({...data, L: parseFloat(e.target.value)})}
                          placeholder="30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="B_righting">B [m]</Label>
                        <Input
                          id="B_righting"
                          type="number"
                          value={data.B || ''}
                          onChange={(e) => setData({...data, B: parseFloat(e.target.value)})}
                          placeholder="8"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="H_righting">H [m]</Label>
                        <Input
                          id="H_righting"
                          type="number"
                          value={data.H || ''}
                          onChange={(e) => setData({...data, H: parseFloat(e.target.value)})}
                          placeholder="4"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="delta_righting">Δ [ton]</Label>
                        <Input
                          id="delta_righting"
                          type="number"
                          value={data.delta || ''}
                          onChange={(e) => setData({...data, delta: parseFloat(e.target.value)})}
                          placeholder="587"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="heel_angle">Yatma Açısı [°]</Label>
                        <Input
                          id="heel_angle"
                          type="number"
                          step="0.1"
                          value={data.heel_angle || ''}
                          onChange={(e) => setData({...data, heel_angle: parseFloat(e.target.value)})}
                          placeholder="5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rho_sw_righting">ρ_sw [t/m³]</Label>
                        <Input
                          id="rho_sw_righting"
                          type="number"
                          step="0.001"
                          value={data.rho_sw || ''}
                          onChange={(e) => setData({...data, rho_sw: parseFloat(e.target.value)})}
                          placeholder="1.025"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateRightingMoment} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Doğrultucu Moment Hesapla
                    </Button>
                    {results.righting_moment_special !== undefined && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.righting_moment_special.toFixed(1)} ton.m</div>
                        <div className="text-sm text-muted-foreground">Doğrultucu Moment</div>
                        {results.GM_calculated !== undefined && (
                          <div className="text-lg font-semibold mt-1">GM: {results.GM_calculated.toFixed(3)} m</div>
                        )}
                        {results.draft_calculated !== undefined && (
                          <div className="text-lg font-semibold mt-1">Draft: {results.draft_calculated.toFixed(3)} m</div>
                        )}
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

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Total FSC: FSC_total = Σ(Ixx_i × ρ_i) / Δ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tanks">Tank Bilgileri (JSON format)</Label>
                      <Input
                        id="tanks"
                        type="text"
                        value={JSON.stringify(data.tanks || [])}
                        onChange={(e) => {
                          try {
                            const tanks = JSON.parse(e.target.value);
                            setData({...data, tanks});
                          } catch (error) {
                            // Invalid JSON, ignore
                          }
                        }}
                        placeholder='[{"L": 20, "B": 15, "rho": 1.025}]'
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="delta_total">Δ [ton]</Label>
                      <Input
                        id="delta_total"
                        type="number"
                        value={data.delta || ''}
                        onChange={(e) => setData({...data, delta: parseFloat(e.target.value)})}
                        placeholder="25000"
                      />
                    </div>
                    <Button onClick={calculateTotalFSC} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Total FSC Hesapla
                    </Button>
                    {results.FSC_total !== undefined && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.FSC_total.toFixed(3)} m</div>
                        <div className="text-sm text-muted-foreground">Total FSC</div>
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

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Weather Criterion: φ_steady = φ_wind × 1.5
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={calculateWeatherCriterion} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Weather Criterion Hesapla
                    </Button>
                    {results.weather_criterion !== undefined && (
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold">{(results.wind_heel_angle * 1.5).toFixed(2)}°</div>
                        <div className="text-sm text-muted-foreground">φ_steady</div>
                        <Badge className={`mt-2 ${results.weather_criterion ? 'bg-green-500' : 'bg-red-500'}`}>
                          {results.weather_criterion ? 'UYGUN' : 'UYGUN DEĞİL'}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Area Requirement: Area_30to40 ≥ 1.719 m.rad
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={calculateAreaRequirement} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Area Requirement Hesapla
                    </Button>
                    {results.area_30to40_compliance !== undefined && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.area_30to40_calculated?.toFixed(3) || '0.000'} m.rad</div>
                        <div className="text-sm text-muted-foreground">Area 30-40°</div>
                        <Badge className={`mt-2 ${results.area_30to40_compliance ? 'bg-green-500' : 'bg-red-500'}`}>
                          {results.area_30to40_compliance ? 'UYGUN' : 'UYGUN DEĞİL'}
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
                      Area 0-30°: Area ≥ 3.151 m.rad
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={calculateArea0to30} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Area 0-30° Hesapla
                    </Button>
                    {results.area_0to30 !== undefined && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.area_0to30.toFixed(3)} m.rad</div>
                        <div className="text-sm text-muted-foreground">Area 0-30°</div>
                        <Badge className={`mt-2 ${results.area_0to30 >= 3.151 ? 'bg-green-500' : 'bg-red-500'}`}>
                          {results.area_0to30 >= 3.151 ? 'UYGUN' : 'UYGUN DEĞİL'}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Area 0-40°: Area ≥ 5.157 m.rad
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={calculateArea0to40} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Area 0-40° Hesapla
                    </Button>
                    {results.area_0to40 !== undefined && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.area_0to40.toFixed(3)} m.rad</div>
                        <div className="text-sm text-muted-foreground">Area 0-40°</div>
                        <Badge className={`mt-2 ${results.area_0to40 >= 5.157 ? 'bg-green-500' : 'bg-red-500'}`}>
                          {results.area_0to40 >= 5.157 ? 'UYGUN' : 'UYGUN DEĞİL'}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Area 30-40°: Area ≥ 1.719 m.rad
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={calculateArea30to40} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Area 30-40° Hesapla
                    </Button>
                    {results.area_30to40 !== undefined && (
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.area_30to40.toFixed(3)} m.rad</div>
                        <div className="text-sm text-muted-foreground">Area 30-40°</div>
                        <Badge className={`mt-2 ${results.area_30to40 >= 1.719 ? 'bg-green-500' : 'bg-red-500'}`}>
                          {results.area_30to40 >= 1.719 ? 'UYGUN' : 'UYGUN DEĞİL'}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      IMO Uygunluk Kontrolü
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

            {/* 🌾 Grain Stability */}
            <TabsContent value="grain" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Grain Stability (SOLAS Ch. VI)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="delta_grain">Δ [ton]</Label>
                        <Input
                          id="delta_grain"
                          type="number"
                          value={data.delta || ''}
                          onChange={(e) => setData({...data, delta: parseFloat(e.target.value)})}
                          placeholder="25000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="B_grain">B [m]</Label>
                        <Input
                          id="B_grain"
                          type="number"
                          value={data.B || ''}
                          onChange={(e) => setData({...data, B: parseFloat(e.target.value)})}
                          placeholder="25"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateGrainStability} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Tahıl Stabilitesi Hesapla
                    </Button>
                    {results.phi_grain_calculated !== undefined && (
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.phi_grain_calculated.toFixed(2)}°</div>
                        <div className="text-sm text-muted-foreground">Tahıl Yatma Açısı</div>
                        <Badge className={`mt-2 ${results.grain_compliance ? 'bg-green-500' : 'bg-red-500'}`}>
                          {results.grain_compliance ? 'UYGUN' : 'UYGUN DEĞİL'}
                        </Badge>
                        {results.SF_grain_calculated !== undefined && (
                          <div className="text-lg font-semibold mt-1">SF: {results.SF_grain_calculated.toFixed(2)}</div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Grain Allowable Heel: φ_allowable = arctan(M_grain / (Δ × GM))
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="delta_allowable">Δ [ton]</Label>
                        <Input
                          id="delta_allowable"
                          type="number"
                          value={data.delta || ''}
                          onChange={(e) => setData({...data, delta: parseFloat(e.target.value)})}
                          placeholder="25000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="B_allowable">B [m]</Label>
                        <Input
                          id="B_allowable"
                          type="number"
                          value={data.B || ''}
                          onChange={(e) => setData({...data, B: parseFloat(e.target.value)})}
                          placeholder="25"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateGrainAllowableHeel} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Grain Allowable Heel Hesapla
                    </Button>
                    {results.phi_allowable_calculated !== undefined && (
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.phi_allowable_calculated.toFixed(2)}°</div>
                        <div className="text-sm text-muted-foreground">Allowable Heel</div>
                        <Badge className={`mt-2 ${results.grain_stability_criterion ? 'bg-green-500' : 'bg-red-500'}`}>
                          {results.grain_stability_criterion ? 'UYGUN' : 'UYGUN DEĞİL'}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 🔬 Advanced Stability */}
            <TabsContent value="advanced" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Advanced Stability Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="k">k (Radius of Gyration) [m]</Label>
                        <Input
                          id="k"
                          type="number"
                          step="0.1"
                          value={data.k || ''}
                          onChange={(e) => setData({...data, k: parseFloat(e.target.value)})}
                          placeholder="10.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="T_wave">T_wave (Wave Period) [s]</Label>
                        <Input
                          id="T_wave"
                          type="number"
                          step="0.1"
                          value={data.T_wave || ''}
                          onChange={(e) => setData({...data, T_wave: parseFloat(e.target.value)})}
                          placeholder="8.0"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateAdvancedStability} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Gelişmiş Stabilite Analizi
                    </Button>
                    {results.T_roll_calculated !== undefined && (
                      <div className="text-center p-3 bg-teal-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.T_roll_calculated.toFixed(1)} s</div>
                        <div className="text-sm text-muted-foreground">Yalpalama Periyodu</div>
                        {results.SI_calculated !== undefined && (
                          <div className="text-lg font-semibold mt-1">SI: {results.SI_calculated.toFixed(1)}%</div>
                        )}
                        <Badge className={`mt-2 ${results.resonance_check ? 'bg-red-500' : 'bg-green-500'}`}>
                          {results.resonance_check ? 'REZONANS' : 'GÜVENLİ'}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      GZ Curve Generation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={calculateGZCurve} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      GZ Eğrisi Oluştur
                    </Button>
                    {results.gz_max_calculated !== undefined && (
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.gz_max_calculated.toFixed(3)} m</div>
                        <div className="text-sm text-muted-foreground">Max GZ</div>
                        {results.phi_max_gz_calculated !== undefined && (
                          <div className="text-lg font-semibold mt-1">@ {results.phi_max_gz_calculated}°</div>
                        )}
                        <div className="text-sm mt-2">GZ Eğrisi 0-90° arası oluşturuldu</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Energy to Heel: E_heel = ∫GZ dφ (0 to φ_max)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phi_max">φ_max [°]</Label>
                      <Input
                        id="phi_max"
                        type="number"
                        value={data.phi_max || ''}
                        onChange={(e) => setData({...data, phi_max: parseFloat(e.target.value)})}
                        placeholder="30"
                      />
                    </div>
                    <Button onClick={calculateEnergyToHeel} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Energy to Heel Hesapla
                    </Button>
                    {results.E_heel_calculated !== undefined && (
                      <div className="text-center p-3 bg-indigo-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.E_heel_calculated.toFixed(3)} m.rad</div>
                        <div className="text-sm text-muted-foreground">Energy to Heel</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      GM Standards: SI = (GM_corrected / GM_standard) × 100
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={calculateGMStandards} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      GM Standards Hesapla
                    </Button>
                    {results.GM_standard_calculated !== undefined && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.GM_standard_calculated.toFixed(2)} m</div>
                        <div className="text-sm text-muted-foreground">GM Standard</div>
                        {results.GM_min_calculated !== undefined && (
                          <div className="text-lg font-semibold mt-1">GM Min: {results.GM_min_calculated.toFixed(2)} m</div>
                        )}
                        {results.SI_calculated !== undefined && (
                          <div className="text-lg font-semibold mt-1">SI: {results.SI_calculated.toFixed(1)}%</div>
                        )}
                        {results.SM_calculated !== undefined && (
                          <div className="text-lg font-semibold mt-1">SM: {results.SM_calculated.toFixed(1)}%</div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      GZ Curve Analysis: Area, Dynamic Stability, Righting Moment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={calculateGZCurveAnalysis} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      GZ Curve Analysis Hesapla
                    </Button>
                    {results.area_calculated !== undefined && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.area_calculated.toFixed(3)} m.rad</div>
                        <div className="text-sm text-muted-foreground">Area Under Curve</div>
                        {results.dynamic_stability_calculated !== undefined && (
                          <div className="text-lg font-semibold mt-1">Dynamic Stability: {results.dynamic_stability_calculated.toFixed(3)} m.rad</div>
                        )}
                        {results.righting_moment_calculated !== undefined && (
                          <div className="text-lg font-semibold mt-1">Righting Moment: {results.righting_moment_calculated.toFixed(1)} kN.m</div>
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
                      <div className="space-y-2">
                        <Label htmlFor="M_flooded">M_flooded [ton.m]</Label>
                        <Input
                          id="M_flooded"
                          type="number"
                          value={data.M_flooded || ''}
                          onChange={(e) => setData({...data, M_flooded: parseFloat(e.target.value)})}
                          placeholder="1000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="Q_cross">Q_cross [m³/min]</Label>
                        <Input
                          id="Q_cross"
                          type="number"
                          value={data.Q_cross || ''}
                          onChange={(e) => setData({...data, Q_cross: parseFloat(e.target.value)})}
                          placeholder="50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="h_vent">h_vent [m]</Label>
                        <Input
                          id="h_vent"
                          type="number"
                          value={data.h_vent || ''}
                          onChange={(e) => setData({...data, h_vent: parseFloat(e.target.value)})}
                          placeholder="15"
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

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Cross Flooding Time: t_cross = V_compartment / Q_cross
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="V_compartment_cross">V_compartment [m³]</Label>
                        <Input
                          id="V_compartment_cross"
                          type="number"
                          value={data.V_compartment || ''}
                          onChange={(e) => setData({...data, V_compartment: parseFloat(e.target.value)})}
                          placeholder="500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="Q_cross_calc">Q_cross [m³/min]</Label>
                        <Input
                          id="Q_cross_calc"
                          type="number"
                          value={data.Q_cross || ''}
                          onChange={(e) => setData({...data, Q_cross: parseFloat(e.target.value)})}
                          placeholder="50"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateCrossFloodingTime} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Cross Flooding Time Hesapla
                    </Button>
                    {results.t_cross !== undefined && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.t_cross.toFixed(1)} min</div>
                        <div className="text-sm text-muted-foreground">Cross Flooding Time</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Downflooding Angle: φ_down = arctan((h_vent - T) / (B/2))
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="h_vent_down">h_vent [m]</Label>
                        <Input
                          id="h_vent_down"
                          type="number"
                          value={data.h_vent || ''}
                          onChange={(e) => setData({...data, h_vent: parseFloat(e.target.value)})}
                          placeholder="15"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="T_down">T [m]</Label>
                        <Input
                          id="T_down"
                          type="number"
                          value={data.T || ''}
                          onChange={(e) => setData({...data, T: parseFloat(e.target.value)})}
                          placeholder="8"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="B_down">B [m]</Label>
                        <Input
                          id="B_down"
                          type="number"
                          value={data.B || ''}
                          onChange={(e) => setData({...data, B: parseFloat(e.target.value)})}
                          placeholder="25"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateDownfloodingAngle} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Downflooding Angle Hesapla
                    </Button>
                    {results.phi_down !== undefined && (
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.phi_down.toFixed(2)}°</div>
                        <div className="text-sm text-muted-foreground">Downflooding Angle</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Equalized Angle: φ_eq = φ_heel × (1 - e^(-t/t_cross))
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={calculateEqualizedAngle} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Equalized Angle Hesapla
                    </Button>
                    {results.phi_eq !== undefined && (
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.phi_eq.toFixed(2)}°</div>
                        <div className="text-sm text-muted-foreground">Equalized Angle</div>
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