import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Ship, TrendingUp, Target, Waves, AlertTriangle, CheckCircle, Anchor, Droplets, Info, Plus, Trash2, Layers } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { toast } from "sonner";
import {
  computeBendingStressMPa,
  computeReactions,
  computeShearStressMPa,
  computeStillWaterBMEstimate,
  computeUniformDistributedLoadFromGeometry,
  computeWaveInducedBM,
  findCriticals,
  sampleSFBM,
  type PointLoad,
} from "@/utils/shearingBendingCalculations";

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

  // 🌾 Tahıl Hesabı (Draft Survey) Girdileri
  draft_fwd_p: number; // Forward draft - Port [m]
  draft_fwd_s: number; // Forward draft - Starboard [m]
  draft_mid_p: number; // Midship draft - Port [m]
  draft_mid_s: number; // Midship draft - Starboard [m]
  draft_aft_p: number; // Aft draft - Port [m]
  draft_aft_s: number; // Aft draft - Starboard [m]
  lbp: number; // Length Between Perpendiculars [m]
  lcf_from_mid: number; // LCF distance from midships (+aft, -fwd) [m]
  hydro_displacement: number; // Displacement from hydrostatics at mean draft [t]
  tpc_hydro: number; // TPC (t/cm) from hydrostatics at mean draft
  fuel_oil: number; // Fuel Oil onboard [t]
  diesel_oil: number; // Diesel Oil onboard [t]
  ballast_water: number; // Ballast Water onboard [t]
  fresh_water: number; // Fresh Water onboard [t]
  constant_weight: number; // Constant weight (stores, etc.) [t]
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

  // 🌾 Tahıl Hesabı (Draft Survey) Sonuçları
  grain_account?: {
    forward_draft: number; // [m]
    mid_draft?: number; // [m]
    aft_draft: number; // [m]
    apparent_mean_draft: number; // [m]
    true_mean_draft: number; // [m]
    trim: number; // [m]
    lbp: number; // [m]
    lcf_from_mid: number; // [m]
    tpc: number; // [t/cm]
    displacement_table: number; // [t]
    displacement_trim_corrected: number; // [t]
    displacement_density_corrected: number; // [t]
    density_used: number; // [t/m³]
    deductions: {
      fuel_oil: number;
      diesel_oil: number;
      ballast_water: number;
      fresh_water: number;
      constant_weight: number;
    };
    cargo_on_board: number; // [t]
  };
  
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
  const [activeTab, setActiveTab] = useState("grainAccount");
  const allowedTabs = new Set(["grainAccount", "shearBending"]);

  // Initialize active tab from URL hash (only allow grainAccount/shearBending) and keep hash in sync
  useEffect(() => {
    const initialHash = (typeof window !== 'undefined' && window.location.hash ? window.location.hash.substring(1) : "");
    if (initialHash && allowedTabs.has(initialHash)) {
      setActiveTab(initialHash);
    } else {
      setActiveTab('grainAccount');
    }
    const onHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (allowedTabs.has(hash)) {
        setActiveTab(hash);
      } else {
        setActiveTab('grainAccount');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const current = window.location.hash.substring(1);
      if (current !== activeTab) {
        window.location.hash = `#${activeTab}`;
      }
    }
  }, [activeTab]);
  
  // === Shear & Bending (SF/BM) calculator state ===
  const [sb_length, setSbLength] = useState<string>("120");
  const [sbUseGeometryForW, setSbUseGeometryForW] = useState<boolean>(true);
  const [sbBreadth, setSbBreadth] = useState<string>("20");
  const [sbDraft, setSbDraft] = useState<string>("9.5");
  const [sbCb, setSbCb] = useState<string>("0.72");
  const [sbUniformW, setSbUniformW] = useState<string>("0"); // kN/m if direct

  const [sbLoads, setSbLoads] = useState<PointLoad[]>([
    { id: "p1", positionMeters: 30, magnitudeKN: 1500, label: "Cargo 1" },
    { id: "p2", positionMeters: 85, magnitudeKN: 1800, label: "Cargo 2" },
  ]);

  const [sbHogSag, setSbHogSag] = useState<"hog" | "sag">("hog");
  const [sbUseMidshipBM, setSbUseMidshipBM] = useState<boolean>(true);
  const [sbWaveCoeff, setSbWaveCoeff] = useState<string>("0.10"); // kN/m^3 (empirical)

  const [sbSectionModulus, setSbSectionModulus] = useState<string>("5000"); // m^3
  const [sbShearArea, setSbShearArea] = useState<string>("12"); // m^2 (web area approximation)

  const SB_L = parseFloat(sb_length);
  const SB_B = parseFloat(sbBreadth);
  const SB_T = parseFloat(sbDraft);
  const SB_Cb = parseFloat(sbCb);
  const SB_wFromGeom = computeUniformDistributedLoadFromGeometry(SB_B, SB_T, SB_Cb); // kN/m
  const SB_w = sbUseGeometryForW ? SB_wFromGeom : (() => { const v = parseFloat(sbUniformW); return Number.isFinite(v) ? v : Number.NaN; })();

  const { data: sbData, reactions: sbReactions } = useMemo(() => {
    const safeLoads = sbLoads
      .filter((p) => isFinite(p.positionMeters) && isFinite(p.magnitudeKN))
      .map((p) => ({ ...p, positionMeters: Math.max(0, Math.min(p.positionMeters, isFinite(SB_L) ? SB_L : p.positionMeters)) }));
    return sampleSFBM(isFinite(SB_L) ? SB_L : 0, isFinite(SB_w) ? SB_w : 0, safeLoads, 241);
  }, [SB_L, SB_w, sbLoads]);

  const sbCrit = useMemo(() => findCriticals(sbData), [sbData]);
  const sbSwbm = useMemo(() => computeStillWaterBMEstimate(sbData, sbUseMidshipBM), [sbData, sbUseMidshipBM]);
  const sbWibm = useMemo(() => computeWaveInducedBM(isFinite(SB_L) ? SB_L : 0, isFinite(SB_B) ? SB_B : 0, isFinite(SB_Cb) ? SB_Cb : 0, (() => { const v = parseFloat(sbWaveCoeff); return Number.isFinite(v) ? v : 0; })()), [SB_L, SB_B, SB_Cb, sbWaveCoeff]);
  const sbTotalBM = useMemo(() => (sbHogSag === "hog" ? sbSwbm + sbWibm : sbSwbm - sbWibm), [sbSwbm, sbWibm, sbHogSag]);

  const sbBendingStressMPa = useMemo(() => computeBendingStressMPa(Math.abs(sbTotalBM), (() => { const v = parseFloat(sbSectionModulus); return Number.isFinite(v) ? v : 0; })()), [sbTotalBM, sbSectionModulus]);
  const sbShearStressMPa = useMemo(() => computeShearStressMPa(Math.abs(sbCrit.maxAbsShear.value), (() => { const v = parseFloat(sbShearArea); return Number.isFinite(v) ? v : 0; })()), [sbCrit.maxAbsShear.value, sbShearArea]);

  const sbAddLoad = () => {
    const nextIndex = sbLoads.length + 1;
    setSbLoads((prev) => [...prev, { id: `p${nextIndex}`, positionMeters: Math.max(0, Math.min(isFinite(SB_L) ? SB_L / 2 : 0, isFinite(SB_L) ? SB_L : 0)), magnitudeKN: 1000, label: `Load ${nextIndex}` }]);
  };
  const sbRemoveLoad = (id: string) => setSbLoads((prev) => prev.filter((p) => p.id !== id));
  const sbUpdateLoad = (id: string, field: keyof PointLoad, value: string) => {
    setSbLoads((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: field === "positionMeters" || field === "magnitudeKN" ? (value === '' ? Number.NaN : parseFloat(value)) : (value as unknown as any) } : p)));
  };


  // 🎯 Temel Stabilite Formülleri
  const calculateGM = () => {
    if (data.KM == null || data.KG == null) {
      toast.error("Lütfen KM ve KG değerlerini girin.");
      return;
    }
    
    const GM = data.KM - data.KG;
    const GM_corrected = GM - (Number.isFinite(results.FSC_total) ? (results.FSC_total as number) : 0);
    
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

  // 🌾 Tahıl Hesabı (Draft Survey)
  const calculateGrainAccount = () => {
    const lbp = data.lbp;
    const lcfFromMid = data.lcf_from_mid ?? 0;
    const tpc = data.tpc_hydro;
    const deltaTable = data.hydro_displacement;

    if (
      lbp == null || lbp <= 0 ||
      tpc == null || tpc <= 0 ||
      deltaTable == null || deltaTable <= 0 ||
      data.draft_fwd_p == null || data.draft_fwd_s == null ||
      data.draft_aft_p == null || data.draft_aft_s == null
    ) {
      toast.error("Lütfen LBP, LCF, TPC, Δ (tablo) ve baş/kıç draft (P/S) değerlerini girin.");
      return;
    }

    const fwd = (data.draft_fwd_p + data.draft_fwd_s) / 2;
    const aft = (data.draft_aft_p + data.draft_aft_s) / 2;
    const midProvided = Number.isFinite(data.draft_mid_p) && Number.isFinite(data.draft_mid_s);
    const mid = midProvided && data.draft_mid_p != null && data.draft_mid_s != null
      ? (data.draft_mid_p + data.draft_mid_s) / 2
      : undefined;

    const apparent_mean = mid != null ? (fwd + aft + mid) / 3 : (fwd + aft) / 2;
    const trim = aft - fwd; // +: kıç trimi
    const true_mean = apparent_mean + (trim * (lcfFromMid / lbp));

    // Δ düzeltmeleri
    const deltaTrimCorrected = deltaTable + tpc * 100 * (true_mean - apparent_mean);
    const rho = data.rho_sw ?? 1.025;
    const deltaDensityCorrected = deltaTrimCorrected * (rho / 1.025);

    // Düşülecekler
    const fuelOil = data.fuel_oil ?? 0;
    const dieselOil = data.diesel_oil ?? 0;
    const ballast = data.ballast_water ?? 0;
    const freshWater = data.fresh_water ?? 0;
    const constant = data.constant_weight ?? 0;
    const deductionsTotal = fuelOil + dieselOil + ballast + freshWater + constant;
    const cargoOnBoard = deltaDensityCorrected - deductionsTotal;

    setResults(prev => ({
      ...prev,
      grain_account: {
        forward_draft: fwd,
        mid_draft: mid,
        aft_draft: aft,
        apparent_mean_draft: apparent_mean,
        true_mean_draft: true_mean,
        trim,
        lbp,
        lcf_from_mid: lcfFromMid,
        tpc,
        displacement_table: deltaTable,
        displacement_trim_corrected: deltaTrimCorrected,
        displacement_density_corrected: deltaDensityCorrected,
        density_used: rho,
        deductions: {
          fuel_oil: fuelOil,
          diesel_oil: dieselOil,
          ballast_water: ballast,
          fresh_water: freshWater,
          constant_weight: constant
        },
        cargo_on_board: cargoOnBoard
      }
    }));

    toast.success(`Tahıl Hesabı: Net Yük = ${Math.round(cargoOnBoard)} t`);
  };

  const calculateKG = () => {
    if (!Array.isArray(data.weights) || !Array.isArray(data.heights) || data.weights.length === 0 || data.heights.length === 0 || data.weights.length !== data.heights.length || data.weights.some(w => !Number.isFinite(w)) || data.heights.some(h => !Number.isFinite(h))) {
      toast.error("Lütfen geçerli ve eşit sayıda ağırlık/yükseklik değerlerini girin.");
      return;
    }
    
    // KG = Σ(Wi × zi) / ΣWi
    const totalWeight = data.weights.reduce((sum, weight) => sum + weight, 0);
    if (totalWeight === 0) {
      toast.error("Toplam ağırlık 0 olamaz.");
      return;
    }
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
    if (data.KB == null || data.BM == null) {
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
    if (data.T == null || data.CB == null || data.CWP == null) {
      toast.error("Lütfen T, CB ve CWP değerlerini girin.");
      return;
    }
    if (data.CB === 0) {
      toast.error("CB 0 olamaz.");
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
    if (data.L == null || data.B == null || data.delta == null) {
      toast.error("Lütfen L, B ve Δ değerlerini girin.");
      return;
    }
    if (data.L <= 0 || data.B <= 0 || data.delta <= 0) {
      toast.error("L, B ve Δ pozitif olmalıdır.");
      return;
    }
    const rho_sw = data.rho_sw || 1.025;
    if (rho_sw <= 0) {
      toast.error("ρ_sw pozitif olmalıdır.");
      return;
    }
    
    const I_waterplane = (data.L * Math.pow(data.B, 3)) / 12;
    const volume_displacement = data.delta / rho_sw;
    if (volume_displacement <= 0) {
      toast.error("Hacim deplasmanı pozitif olmalıdır.");
      return;
    }
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
    if (data.phi == null || results.GM_corrected == null || data.KM == null || data.KG == null) {
      toast.error("Lütfen φ değerini girin ve önce GM hesaplayın.");
      return;
    }
    
    const phiRad = (data.phi * Math.PI) / 180;
    const GZ_small = results.GM_corrected * Math.sin(phiRad);
    const GZ_large = (data.KM - data.KG) * Math.sin(phiRad);
    const righting_moment = GZ_small * (data.delta || 25000) * (data.g || 9.81); // kN.m
    
    setResults(prev => ({ 
      ...prev, 
      GZ_small,
      GZ_large,
      righting_moment
    }));
    
    toast.success(`GZ (küçük açılar): ${GZ_small.toFixed(3)}m - Righting Moment: ${righting_moment.toFixed(1)} kN.m`);
  };

  const calculateDynamicStability = () => {
    if (data.phi == null || results.GZ_small == null) {
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
    if (data.L_tank == null || data.B_tank == null || data.rho_fluid == null || data.delta == null) {
      toast.error("Lütfen tank boyutları, ρ_fluid ve Δ değerlerini girin.");
      return;
    }
    if (data.L_tank <= 0 || data.B_tank <= 0 || data.rho_fluid <= 0 || data.delta <= 0) {
      toast.error("Tank boyutları, ρ_fluid ve Δ pozitif olmalıdır.");
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
    if (!data.P_wind || !data.A_wind || !data.h_wind || !data.delta || results.GM_corrected == null) {
      toast.error("Lütfen rüzgar parametrelerini girin ve önce GM hesaplayın.");
      return;
    }
    
    const wind_moment = (data.P_wind * data.A_wind * data.h_wind) / 1000; // kN.m
    const righting_moment = (data.delta || 25000) * (results.GM_corrected || 1.0) * (data.g || 9.81); // kN.m
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
    if (!results.GM_corrected) {
      toast.error("Lütfen önce GM hesaplayın.");
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
    if (!results.GM_corrected) {
      toast.error("Lütfen önce GM hesaplayın.");
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
      area_30to40_compliance: area_30to40 >= 0.03
    }));
    
    toast.success(`Area 30-40°: ${area_30to40.toFixed(3)} m.rad - ${area_30to40 >= 0.03 ? 'UYGUN' : 'UYGUN DEĞİL'}`);
  };

  const calculateIMOCompliance = () => {
    if (!results.area_0to30 || !results.area_0to40 || !results.area_30to40 || results.GM_corrected === undefined || results.gz_max_calculated === undefined || results.phi_max_gz_calculated === undefined) {
      toast.error("Lütfen önce tüm alan hesaplamalarını, GM'yi ve GZ eğrisini hesaplayın.");
      return;
    }
    
    const imo_compliance = {
      area_0to30: results.area_0to30 >= 0.055,
      area_0to40: results.area_0to40 >= 0.09,
      area_30to40: results.area_30to40 >= 0.03,
      gz_max: (results.gz_max_calculated >= 0.20) && ((Number.isFinite(results.phi_max_gz_calculated) ? (results.phi_max_gz_calculated as number) : 0) >= 30),
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
    if (data.LCG == null || data.LCB == null || results.GM_corrected == null || data.BM == null) {
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
    if (!data.V_compartment || !data.permeability || !data.KG_flooded || !data.delta_flooded || !data.M_flooded || !data.delta) {
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

  

  

  

  // 🔄 Total FSC Calculation
  const calculateTotalFSC = () => {
    if (!Array.isArray(data.tanks) || data.delta == null) {
      toast.error("Lütfen tank bilgilerini ve Δ değerini girin.");
      return;
    }
    if (data.delta <= 0) {
      toast.error("Δ pozitif olmalıdır.");
      return;
    }
    
    // FSC_total = Σ(Ixx_i × ρ_i) / Δ
    let totalFSC = 0;
    data.tanks.forEach(tank => {
      if (!tank || tank.L <= 0 || tank.B <= 0 || tank.rho <= 0) {
        return;
      }
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

  // 🌪️ Hava Kriteri
  const calculateWeatherCriterion = () => {
    if (results.wind_heel_angle == null) {
      toast.error("Lütfen önce Rüzgar Yatma Açısı hesaplayın.");
      return;
    }
    
    const phi_steady = results.wind_heel_angle * 1.5;
    const weather_criterion = phi_steady <= 25; // Simplified criterion
    
    setResults(prev => ({ 
      ...prev, 
      weather_criterion
    }));
    
    toast.success(`Hava Kriteri: ${phi_steady.toFixed(2)}° - ${weather_criterion ? 'UYGUN' : 'UYGUN DEĞİL'}`);
  };

  // 📊 Range of Stability
  const calculateStabilityRange = () => {
    if (results.vanishing_angle == null || results.angle_of_list == null) {
      toast.error("Lütfen önce Kritik Açıları hesaplayın.");
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
      toast.error("Lütfen önce GZ Eğrisi hesaplayın.");
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

  // 🛡️ Çapraz Dolma Süresi
  const calculateCrossFloodingTime = () => {
    if (data.V_compartment == null || data.Q_cross == null) {
      toast.error("Lütfen V_compartment ve Q_cross değerlerini girin.");
      return;
    }
    if (data.Q_cross === 0) {
      toast.error("Q_cross 0 olamaz.");
      return;
    }
    
    const t_cross = data.V_compartment / data.Q_cross; // minutes
    
    setResults(prev => ({ 
      ...prev, 
      t_cross
    }));
    
    toast.success(`Çapraz Dolma Süresi: ${t_cross.toFixed(1)} dk`);
  };

  // 🌪️ Alan Kriteri 30–40°
  const calculateAreaRequirement = () => {
    if (results.area_30to40_calculated == null) {
      toast.error("Lütfen önce Area 30-40° hesaplayın.");
      return;
    }
    
    const area_requirement = results.area_30to40_calculated >= 0.03;
    
    setResults(prev => ({ 
      ...prev, 
      area_30to40_compliance: area_requirement
    }));
    
    toast.success(`Alan Kriteri 30–40°: ${results.area_30to40_calculated.toFixed(3)} m.rad - ${area_requirement ? 'UYGUN' : 'UYGUN DEĞİL'}`);
  };

  // 🛡️ Aşağı Su Alma Açısı
  const calculateDownfloodingAngle = () => {
    if (data.h_vent == null || data.T == null || data.B == null) {
      toast.error("Lütfen h_vent, T ve B değerlerini girin.");
      return;
    }
    
    // φ_down = arctan((h_vent - T) / (B/2))
    const phi_down = Math.atan((data.h_vent - data.T) / (data.B / 2)) * (180 / Math.PI);
    
    setResults(prev => ({ 
      ...prev, 
      phi_down
    }));
    
    toast.success(`Aşağı Su Alma Açısı: ${phi_down.toFixed(2)}°`);
  };

  // 🛡️ Eşitlenmiş Açı
  const calculateEqualizedAngle = () => {
    if (results.heel_angle == null || results.t_cross == null) {
      toast.error("Lütfen önce Yatma Açısı ve Çapraz Dolma Süresini hesaplayın.");
      return;
    }
    
    // φ_eq = φ_heel × (1 - e^(-t/t_cross))
    const phi_eq = results.heel_angle * (1 - Math.exp(-1)); // Simplified with t = t_cross
    
    setResults(prev => ({ 
      ...prev, 
      phi_eq
    }));
    
    toast.success(`Eşitlenmiş Açı: ${phi_eq.toFixed(2)}°`);
  };

  

  

  

  

  // 🚢 Doğrultucu Moment Hesaplama
  const calculateRightingMoment = () => {
    if (data.L == null || data.B == null || data.H == null || data.delta == null || data.heel_angle == null) {
      toast.error("Lütfen L, B, H, Δ ve yatma açısı değerlerini girin.");
      return;
    }
    if (data.L <= 0 || data.B <= 0 || data.H <= 0 || data.delta <= 0) {
      toast.error("L, B, H ve Δ pozitif olmalıdır.");
      return;
    }
    
    // 1. Draft hesaplama (A = L × B × d × density)
    const density = data.rho_sw || 1.025; // t/m³
    const draft = data.delta / (data.L * data.B * density);
    
    if (draft <= 0) {
      toast.error("Draft pozitif olmalıdır.");
      return;
    }
    
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
    
    // 7. Doğrultucu Moment = Δ × g × GM × tan(φ)
    const heel_angle_rad = (data.heel_angle * Math.PI) / 180;
    const righting_moment = data.delta * (data.g || 9.81) * GM * Math.tan(heel_angle_rad);
    
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
    
    toast.success(`Doğrultucu Moment: ${righting_moment.toFixed(1)} kN.m - GM: ${GM.toFixed(3)}m - Draft: ${draft.toFixed(3)}m`);
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grainAccount">🌾 Tahıl Hesabı</TabsTrigger>
              <TabsTrigger value="shearBending">🪚 Shear Force & Bending Moment</TabsTrigger>
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
                        <div className="text-2xl font-bold">{results.righting_moment_special.toFixed(1)} kN.m</div>
                        <div className="text-sm text-muted-foreground">Doğrultucu Moment (kN.m)</div>
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
                      Hava Kriteri: φ_steady = φ_wind × 1.5
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={calculateWeatherCriterion} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Hava Kriteri Hesapla
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
                      Alan Kriteri: 30–40° ≥ 0.03 m.rad
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={calculateAreaRequirement} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Alan Kriteri Hesapla
                    </Button>
                    {results.area_30to40_compliance !== undefined && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.area_30to40_calculated?.toFixed(3) || '0.000'} m.rad</div>
                        <div className="text-sm text-muted-foreground">Alan 30–40°</div>
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
                      Alan 0–30°: Alan ≥ 0.055 m.rad
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={calculateArea0to30} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Alan 0–30° Hesapla
                    </Button>
                    {results.area_0to30 !== undefined && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.area_0to30.toFixed(3)} m.rad</div>
                        <div className="text-sm text-muted-foreground">Alan 0–30°</div>
                        <Badge className={`mt-2 ${results.area_0to30 >= 0.055 ? 'bg-green-500' : 'bg-red-500'}`}>
                          {results.area_0to30 >= 0.055 ? 'UYGUN' : 'UYGUN DEĞİL'}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Alan 0–40°: Alan ≥ 0.09 m.rad
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={calculateArea0to40} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Alan 0–40° Hesapla
                    </Button>
                    {results.area_0to40 !== undefined && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.area_0to40.toFixed(3)} m.rad</div>
                        <div className="text-sm text-muted-foreground">Alan 0–40°</div>
                        <Badge className={`mt-2 ${results.area_0to40 >= 0.09 ? 'bg-green-500' : 'bg-red-500'}`}>
                          {results.area_0to40 >= 0.09 ? 'UYGUN' : 'UYGUN DEĞİL'}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Alan 30–40°: Alan ≥ 0.03 m.rad
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={calculateArea30to40} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Alan 30–40° Hesapla
                    </Button>
                    {results.area_30to40 !== undefined && (
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.area_30to40.toFixed(3)} m.rad</div>
                        <div className="text-sm text-muted-foreground">Alan 30–40°</div>
                        <Badge className={`mt-2 ${results.area_30to40 >= 0.03 ? 'bg-green-500' : 'bg-red-500'}`}>
                          {results.area_30to40 >= 0.03 ? 'UYGUN' : 'UYGUN DEĞİL'}
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
                                {key === 'area_0to30' && 'Alan 0–30° ≥ 0.055 m.rad'}
                                {key === 'area_0to40' && 'Alan 0–40° ≥ 0.09 m.rad'}
                                {key === 'area_30to40' && 'Alan 30–40° ≥ 0.03 m.rad'}
                                {key === 'gz_max' && 'GZ_max ≥ 0.20 m @ φ ≥ 30°'}
                                {key === 'initial_gm' && 'Başlangıç GM ≥ 0.15 m'}
                                {key === 'weather_criterion' && 'Hava Kriteri'}
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

            {/* Grain stability tab removed */}

            {/* 🌾 Tahıl Hesabı (Draft Survey) */}
            <TabsContent value="grainAccount" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Tahıl Hesabı: Draft ve Hidrostatik Veriler
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="draft_fwd_p">Baş Draft P [m]</Label>
                        <Input id="draft_fwd_p" type="number" step="0.01" value={data.draft_fwd_p || ''} onChange={(e) => setData({ ...data, draft_fwd_p: parseFloat(e.target.value) })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="draft_fwd_s">Baş Draft S [m]</Label>
                        <Input id="draft_fwd_s" type="number" step="0.01" value={data.draft_fwd_s || ''} onChange={(e) => setData({ ...data, draft_fwd_s: parseFloat(e.target.value) })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lbp">LBP [m]</Label>
                        <Input id="lbp" type="number" step="0.1" value={data.lbp || ''} onChange={(e) => setData({ ...data, lbp: parseFloat(e.target.value) })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="draft_mid_p">Orta Draft P [m]</Label>
                        <Input id="draft_mid_p" type="number" step="0.01" value={data.draft_mid_p || ''} onChange={(e) => setData({ ...data, draft_mid_p: parseFloat(e.target.value) })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="draft_mid_s">Orta Draft S [m]</Label>
                        <Input id="draft_mid_s" type="number" step="0.01" value={data.draft_mid_s || ''} onChange={(e) => setData({ ...data, draft_mid_s: parseFloat(e.target.value) })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lcf_from_mid">LCF (orta referans, +kıç) [m]</Label>
                        <Input id="lcf_from_mid" type="number" step="0.1" value={data.lcf_from_mid} onChange={(e) => setData({ ...data, lcf_from_mid: e.target.value === '' ? Number.NaN : parseFloat(e.target.value) })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="draft_aft_p">Kıç Draft P [m]</Label>
                        <Input id="draft_aft_p" type="number" step="0.01" value={data.draft_aft_p || ''} onChange={(e) => setData({ ...data, draft_aft_p: parseFloat(e.target.value) })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="draft_aft_s">Kıç Draft S [m]</Label>
                        <Input id="draft_aft_s" type="number" step="0.01" value={data.draft_aft_s || ''} onChange={(e) => setData({ ...data, draft_aft_s: parseFloat(e.target.value) })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tpc_hydro">TPC (t/cm)</Label>
                        <Input id="tpc_hydro" type="number" step="0.01" value={data.tpc_hydro || ''} onChange={(e) => setData({ ...data, tpc_hydro: parseFloat(e.target.value) })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hydro_displacement">Δ (Tablo) [t]</Label>
                        <Input id="hydro_displacement" type="number" step="1" value={data.hydro_displacement || ''} onChange={(e) => setData({ ...data, hydro_displacement: parseFloat(e.target.value) })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rho_sw">Yoğunluk ρ [t/m³]</Label>
                        <Input id="rho_sw" type="number" step="0.001" value={data.rho_sw || 1.025} onChange={(e) => setData({ ...data, rho_sw: parseFloat(e.target.value) })} />
                      </div>
                      <div className="space-y-2">
                        <Label>LCF Bilgisi</Label>
                        <div className="text-sm text-muted-foreground">Pozitif: kıç tarafta, negatif: baş tarafta</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Düşülecekler ve Hesapla
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fuel_oil">Fuel Oil [t]</Label>
                        <Input id="fuel_oil" type="number" step="0.1" value={data.fuel_oil} onChange={(e) => setData({ ...data, fuel_oil: e.target.value === '' ? Number.NaN : parseFloat(e.target.value) })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="diesel_oil">Diesel Oil [t]</Label>
                        <Input id="diesel_oil" type="number" step="0.1" value={data.diesel_oil} onChange={(e) => setData({ ...data, diesel_oil: e.target.value === '' ? Number.NaN : parseFloat(e.target.value) })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ballast_water">Ballast Water [t]</Label>
                        <Input id="ballast_water" type="number" step="0.1" value={data.ballast_water} onChange={(e) => setData({ ...data, ballast_water: e.target.value === '' ? Number.NaN : parseFloat(e.target.value) })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fresh_water">Fresh Water [t]</Label>
                        <Input id="fresh_water" type="number" step="0.1" value={data.fresh_water} onChange={(e) => setData({ ...data, fresh_water: e.target.value === '' ? Number.NaN : parseFloat(e.target.value) })} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="constant_weight">Constant (stores, vb.) [t]</Label>
                        <Input id="constant_weight" type="number" step="0.1" value={data.constant_weight} onChange={(e) => setData({ ...data, constant_weight: e.target.value === '' ? Number.NaN : parseFloat(e.target.value) })} />
                      </div>
                    </div>

                    <Button onClick={calculateGrainAccount} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Tahıl Hesabı Yap
                    </Button>

                    {results.grain_account && (
                      <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <div className="text-muted-foreground">Ortalama Draft (görünen)</div>
                            <div className="font-semibold">{results.grain_account.apparent_mean_draft.toFixed(3)} m</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Trim</div>
                            <div className="font-semibold">{results.grain_account.trim.toFixed(3)} m</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Ortalama Draft (gerçek)</div>
                            <div className="font-semibold">{results.grain_account.true_mean_draft.toFixed(3)} m</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Δ Tablo</div>
                            <div className="font-semibold">{results.grain_account.displacement_table.toFixed(0)} t</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Δ Trim Düzeltmeli</div>
                            <div className="font-semibold">{results.grain_account.displacement_trim_corrected.toFixed(0)} t</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Δ Yoğunluk Düzeltmeli</div>
                            <div className="font-semibold">{results.grain_account.displacement_density_corrected.toFixed(0)} t</div>
                          </div>
                        </div>
                        <Separator />
                        <div className="text-sm">
                          <div className="mb-1 font-medium">Düşülecekler</div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            <div>Fuel Oil: {results.grain_account.deductions.fuel_oil.toFixed(1)} t</div>
                            <div>Diesel Oil: {results.grain_account.deductions.diesel_oil.toFixed(1)} t</div>
                            <div>Ballast: {results.grain_account.deductions.ballast_water.toFixed(1)} t</div>
                            <div>Fresh Water: {results.grain_account.deductions.fresh_water.toFixed(1)} t</div>
                            <div>Constant: {results.grain_account.deductions.constant_weight.toFixed(1)} t</div>
                          </div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg text-center">
                          <div className="text-2xl font-bold">{results.grain_account.cargo_on_board.toFixed(0)} t</div>
                          <div className="text-sm text-muted-foreground">Cargo on Board (Grain Account)</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 🪚 Shear Force & Bending Moment */}
            <TabsContent value="shearBending" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="sb-length">Length L (m)</Label>
                  <Input id="sb-length" type="number" step="0.1" value={sb_length} onChange={(e) => setSbLength(e.target.value)} />
                </div>
                <div className="md:col-span-3 flex items-end gap-2">
                  <Button type="button" variant={sbUseGeometryForW ? "default" : "outline"} onClick={() => setSbUseGeometryForW(true)}>
                    w from geometry (kN/m)
                  </Button>
                  <Button type="button" variant={!sbUseGeometryForW ? "default" : "outline"} onClick={() => setSbUseGeometryForW(false)}>
                    direct w (kN/m)
                  </Button>
                  {!sbUseGeometryForW && (
                    <div className="flex-1">
                      <Label htmlFor="sb-w">w (kN/m)</Label>
                      <Input id="sb-w" type="number" step="1" value={sbUniformW} onChange={(e) => setSbUniformW(e.target.value)} />
                    </div>
                  )}
                </div>
              </div>

              {sbUseGeometryForW && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="sb-breadth">Breadth B (m)</Label>
                    <Input id="sb-breadth" type="number" step="0.1" value={sbBreadth} onChange={(e) => setSbBreadth(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="sb-draft">Draft T (m)</Label>
                    <Input id="sb-draft" type="number" step="0.1" value={sbDraft} onChange={(e) => setSbDraft(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="sb-cb">Cb</Label>
                    <Input id="sb-cb" type="number" step="0.01" value={sbCb} onChange={(e) => setSbCb(e.target.value)} />
                  </div>
                  <div className="flex items-end">
                    <div className="w-full bg-primary/10 border border-primary/20 rounded p-2 text-sm">
                      w ≈ {SB_wFromGeom.toFixed(1)} kN/m
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold flex items-center gap-2"><Layers className="h-4 w-4" /> Point Loads</h4>
                  <Button type="button" size="sm" className="gap-2" onClick={sbAddLoad}><Plus className="h-4 w-4" /> Add</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-sm">
                  {sbLoads.map((p) => (
                    <div key={p.id} className="md:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                      <div className="md:col-span-4">
                        <Label>Label</Label>
                        <Input value={p.label ?? ""} onChange={(e) => sbUpdateLoad(p.id, "label", e.target.value)} />
                      </div>
                      <div className="md:col-span-4">
                        <Label>Position x (m)</Label>
                        <Input type="number" step="0.1" value={isFinite(p.positionMeters) ? p.positionMeters : 0}
                               onChange={(e) => sbUpdateLoad(p.id, "positionMeters", e.target.value)} />
                      </div>
                      <div className="md:col-span-3">
                        <Label>Magnitude (kN)</Label>
                        <Input type="number" step="1" value={isFinite(p.magnitudeKN) ? p.magnitudeKN : 0}
                               onChange={(e) => sbUpdateLoad(p.id, "magnitudeKN", e.target.value)} />
                      </div>
                      <div className="md:col-span-1">
                        <Button variant="ghost" size="icon" onClick={() => sbRemoveLoad(p.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Shear Force Diagram V(x)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={sbData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="x" label={{ value: "x (m)", position: "insideBottom", offset: -5 }} />
                        <YAxis label={{ value: "V (kN)", angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <Legend />
                        <ReferenceLine y={0} stroke="#999" strokeDasharray="3 3" />
                        {sbLoads.map((p) => (
                          <ReferenceLine key={`lv-${p.id}`} x={p.positionMeters} stroke="#bbb" strokeDasharray="2 2" />
                        ))}
                        {sbCrit.zeroShearAtX !== null && (
                          <ReferenceLine x={sbCrit.zeroShearAtX} stroke="#ef4444" strokeDasharray="4 2" label={{ value: "V=0", position: "top" }} />
                        )}
                        <Line type="monotone" dataKey="shearKN" name="V (kN)" stroke="#ef4444" dot={false} strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>RA = {sbReactions.reactionA_KN.toFixed(1)} kN</div>
                      <div>RB = {sbReactions.reactionB_KN.toFixed(1)} kN</div>
                      <div>Vmax = {sbCrit.maxAbsShear.value.toFixed(1)} kN @ x≈{sbCrit.maxAbsShear.x.toFixed(1)} m</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Bending Moment Diagram M(x)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={sbData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="x" label={{ value: "x (m)", position: "insideBottom", offset: -5 }} />
                        <YAxis label={{ value: "M (kN·m)", angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <Legend />
                        <ReferenceLine y={0} stroke="#999" strokeDasharray="3 3" />
                        {sbLoads.map((p) => (
                          <ReferenceLine key={`lm-${p.id}`} x={p.positionMeters} stroke="#bbb" strokeDasharray="2 2" />
                        ))}
                        <Line type="monotone" dataKey="momentKNm" name="M (kN·m)" stroke="#3b82f6" dot={false} strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>Mmax = {Math.max(Math.abs(sbCrit.maxMoment.value), Math.abs(sbCrit.minMoment.value)).toFixed(1)} kN·m</div>
                      <div>Midship M ≈ {sbSwbm.toFixed(1)} kN·m</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="sb-wave-coeff">Wave coefficient C (kN/m³)</Label>
                  <Input id="sb-wave-coeff" type="number" step="0.01" value={sbWaveCoeff} onChange={(e) => setSbWaveCoeff(e.target.value)} />
                </div>
                <div className="flex items-end gap-2">
                  <Button type="button" variant={sbHogSag === "hog" ? "default" : "outline"} onClick={() => setSbHogSag("hog")}>Hogging (+)</Button>
                  <Button type="button" variant={sbHogSag === "sag" ? "default" : "outline"} onClick={() => setSbHogSag("sag")}>Sagging (−)</Button>
                </div>
                <div className="flex items-end gap-2">
                  <Button type="button" variant={sbUseMidshipBM ? "default" : "outline"} onClick={() => setSbUseMidshipBM(true)}>Midship BM</Button>
                  <Button type="button" variant={!sbUseMidshipBM ? "default" : "outline"} onClick={() => setSbUseMidshipBM(false)}>|M| Maximum</Button>
                </div>
              </div>
              <div className="bg-muted/30 rounded p-3 grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-sm">
                <div>SWBM ≈ {sbSwbm.toFixed(1)} kN·m</div>
                <div>WIBM ≈ {sbWibm.toFixed(1)} kN·m</div>
                <div>Total BM ≈ {sbTotalBM.toFixed(1)} kN·m</div>
                <div>V=0 @ x≈{sbCrit.zeroShearAtX !== null ? sbCrit.zeroShearAtX.toFixed(1) : "—"} m</div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="sb-z">Section Modulus Z (m³)</Label>
                  <Input id="sb-z" type="number" step="1" value={sbSectionModulus} onChange={(e) => setSbSectionModulus(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="sb-area">Shear Area A (m²)</Label>
                  <Input id="sb-area" type="number" step="0.1" value={sbShearArea} onChange={(e) => setSbShearArea(e.target.value)} />
                </div>
                <div className="md:col-span-2 grid grid-cols-2 gap-3 bg-primary/10 border border-primary/20 rounded p-3 text-sm">
                  <div>σ_bend ≈ {sbBendingStressMPa.toFixed(3)} MPa</div>
                  <div>τ_shear ≈ {sbShearStressMPa.toFixed(3)} MPa</div>
                </div>
              </div>
            </TabsContent>

            {/* Advanced tab removed */}

            {/* 🛡️ Damage Stability */}
            <TabsContent value="damage" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Hasar Stabilitesi
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
                      Çapraz Dolma Süresi: t_cross = V_compartment / Q_cross
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
                      Çapraz Dolma Süresi Hesapla
                    </Button>
                    {results.t_cross !== undefined && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.t_cross.toFixed(1)} dk</div>
                        <div className="text-sm text-muted-foreground">Çapraz Dolma Süresi</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Aşağı Su Alma Açısı: φ_down = arctan((h_vent - T) / (B/2))
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
                      Aşağı Su Alma Açısı Hesapla
                    </Button>
                    {results.phi_down !== undefined && (
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.phi_down.toFixed(2)}°</div>
                        <div className="text-sm text-muted-foreground">Aşağı Su Alma Açısı</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Eşitlenmiş Açı: φ_eq = φ_heel × (1 - e^(-t/t_cross))
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={calculateEqualizedAngle} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Eşitlenmiş Açı Hesapla
                    </Button>
                    {results.phi_eq !== undefined && (
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.phi_eq.toFixed(2)}°</div>
                        <div className="text-sm text-muted-foreground">Eşitlenmiş Açı</div>
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