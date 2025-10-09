// Hydrostatic and Stability Calculation Types

export interface ShipGeometry {
  length: number; // LBP - Length Between Perpendiculars
  breadth: number; // B - Beam
  depth: number; // D - Depth
  draft: number; // T - Draft
  blockCoefficient: number; // Cb - Block Coefficient
  waterplaneCoefficient: number; // Cw - Waterplane Coefficient
  midshipCoefficient: number; // Cm - Midship Coefficient
  prismaticCoefficient: number; // Cp - Prismatic Coefficient
  verticalPrismaticCoefficient: number; // Cvp - Vertical Prismatic Coefficient
}

export interface HydrostaticData {
  displacement: number; // Δ - Displacement in tonnes
  volumeDisplacement: number; // ∇ - Volume displacement in m³
  waterplaneArea: number; // WPA - Waterplane Area in m²
  immersedVolume: number; // Submerged volume in m³
  bonjeanCurves: BonjeanCurve[];
  sectionalAreas: SectionalArea[];
}

export interface BonjeanCurve {
  station: number; // Station number
  draft: number; // Draft at this station
  area: number; // Sectional area at this draft
  moment: number; // Moment about baseline
}

export interface SectionalArea {
  station: number;
  area: number;
  moment: number;
}

export interface CenterPoints {
  lcb: number; // Longitudinal Center of Buoyancy
  vcb: number; // Vertical Center of Buoyancy
  lcf: number; // Longitudinal Center of Flotation
  vcf: number; // Vertical Center of Flotation
  kb: number; // Center of Buoyancy above keel
  // Transverse metacentric values (default legacy km/bm/gm map to transverse)
  km: number; // Transverse metacentric height (KMt)
  bm: number; // Transverse metacentric radius (BMt)
  kg: number; // Center of Gravity above keel
  gm: number; // Transverse metacentric height GMt (legacy alias)
  // Explicit transverse and longitudinal breakdown
  kmt: number; // KM (transverse)
  bmt: number; // BM (transverse)
  gmt: number; // GM (transverse)
  kml: number; // KM (longitudinal)
  bml: number; // BM (longitudinal)
  gml: number; // GM (longitudinal)
}

export interface HydrostaticCoefficients {
  tpc: number; // Tonnes Per Centimeter immersion
  mtc1cm: number; // Moment to Change Trim by 1 cm (t-m/cm)
  lcf: number; // Longitudinal Center of Flotation
  wpa: number; // Waterplane Area
  kb: number; // Center of Buoyancy
  km: number; // Metacentric height
  bm: number; // Metacentric radius
}

export interface StabilityData {
  gm: number; // Metacentric height
  gz: number[]; // Righting arm values
  rightingMoment: number[]; // Righting moment values
  angles: number[]; // Heel angles in degrees
  maxGz: number; // Maximum GZ value
  maxGzAngle: number; // Angle at maximum GZ
  vanishingAngle: number; // Angle where GZ becomes zero
  deckEdgeAngle: number; // Angle of deck edge immersion
  downfloodingAngle: number; // Downflooding angle
  equalizedAngle: number; // Equalized angle
}

export interface IMOStabilityCriteria {
  area0to30: number; // Area under GZ curve 0-30°
  area0to40: number; // Area under GZ curve 0-40°
  area30to40: number; // Fark area between 30-40°
  maxGz: number; // Maximum GZ value
  initialGM: number; // Initial GM requirement
  areaRequirement: number; // Area requirement
  weatherCriterion: number; // Weather criterion
  compliance: boolean; // IMO compliance check
}

export interface TrimAndList {
  trimAngle: number; // Trim angle in degrees
  trimChange: number; // Trim change in meters
  listAngle: number; // List angle in degrees
  listMoment: number; // List moment
  mct1cm: number; // Moment to Change Trim by 1 cm (t-m/cm)
  trimCorrection: number; // Trim correction
  listCorrection: number; // List correction
  draftCorrection: number; // Draft reading correction
}

export interface DamageStability {
  floodedVolume: number; // Flooded volume
  newKG: number; // New center of gravity
  residualGM: number; // Residual GM
  crossFloodingTime: number; // Cross flooding time
  downfloodingAngle: number; // Downflooding angle
  equalizedAngle: number; // Equalized angle
  survivalFactor: number; // Survival factor
  compartmentAnalysis: CompartmentAnalysis[];
}

export interface CompartmentAnalysis {
  compartment: string;
  floodedVolume: number;
  newKG: number;
  residualGM: number;
  downfloodingAngle: number;
}

export interface GrainStability {
  grainShiftMoment: number; // Grain shift moment
  grainHeelAngle: number; // Grain heel angle
  grainSafetyFactor: number; // Grain safety factor
  grainAllowableHeel: number; // Grain allowable heel
  grainStabilityCriterion: number; // Grain stability criterion
  compliance: boolean; // SOLAS Ch. VI compliance
}

export interface DynamicStability {
  rollingPeriod: number; // Rolling period
  naturalPeriod: number; // Natural period
  energyToHeel: number; // Energy to heel
  stabilityIndex: number; // Stability index
  safetyMargin: number; // Safety margin
  resonanceCheck: boolean; // Resonance check
  stabilityRange: number; // Stability range
  stabilityQuality: number; // Stability quality
  gmStandards: number; // GM standards
  gzCurve: GZCurvePoint[];
}

export interface GZCurvePoint {
  angle: number; // Heel angle in degrees
  gz: number; // Righting arm
  rightingMoment: number; // Righting moment
}

export interface WeightDistribution {
  item: string;
  weight: number; // Weight in tonnes
  lcg: number; // Longitudinal center of gravity
  vcg: number; // Vertical center of gravity
  tcg: number; // Transverse center of gravity
  moment: number; // Moment about reference point
}

export interface TankData {
  name: string;
  capacity: number; // Tank capacity in m³
  currentVolume: number; // Current volume in m³
  lcg: number; // Longitudinal center of gravity
  vcg: number; // Vertical center of gravity
  tcg: number; // Transverse center of gravity
  freeSurfaceEffect: number; // Free surface effect (proxy or i)
  fluidDensity: number; // Fluid density in t/m³
  // Optional geometry for advanced free-surface correction
  length?: number; // tank length [m]
  breadth?: number; // tank breadth [m]
  height?: number; // tank height [m]
  fillRatio?: number; // 0-1, approximate fill level
}

export interface FreeSurfaceCorrection {
  tankName: string;
  freeSurfaceMoment: number; // Free surface moment (proxy or i)
  correction: number; // Free surface correction (m)
  totalFSC: number; // Total free surface correction (m)
}

export interface DraftSurvey {
  forwardDraft: number; // Forward draft
  midshipDraft: number; // Midship draft
  aftDraft: number; // Aft draft
  meanDraft: number; // Mean draft
  trim: number; // Trim
  list: number; // List
  correctedDraft: number; // Corrected draft
  displacement: number; // Displacement from draft
  tpc: number; // TPC at current draft
  lcf: number; // LCF at current draft
}

export interface StabilityAnalysis {
  hydrostatic: HydrostaticData;
  centers: CenterPoints;
  coefficients: HydrostaticCoefficients;
  stability: StabilityData;
  imoCriteria: IMOStabilityCriteria;
  trimList: TrimAndList;
  damageStability: DamageStability;
  grainStability: GrainStability;
  dynamicStability: DynamicStability;
  weightDistribution: WeightDistribution[];
  tanks: TankData[];
  freeSurfaceCorrections: FreeSurfaceCorrection[];
  draftSurvey: DraftSurvey;
}

// High-fidelity optional inputs
export interface CrossCurves {
  angles: number[]; // degrees
  kn: number[]; // meters
}

export interface BonjeanSet {
  sections: SectionalArea[]; // at target draft
  stationSpacing: number; // m, spacing between stations along LBP
}

// =========================
// Grain Stability - Types
// =========================

export type GrainArrangement = 'full' | 'part' | 'trimmed' | 'untrimmed';

export interface GrainMeasures {
  shiftingBoard?: boolean;
  feeders?: boolean;
  saucering?: boolean;
  bundlingOrTrimming?: boolean;
}

export interface GrainCargoType {
  name: string; // e.g., Wheat, Corn, Barley
  stowageFactorM3PerT?: number; // m³/t (preferred)
  densityTPerM3?: number; // t/m³ (alternative to stowage factor)
  angleOfReposeDeg: number; // movement angle
}

export interface GrainHoldInfo {
  holdId: string;
  location: string; // textual position e.g. "No.3 Hold"
  length: number; // m
  width: number; // m
  height: number; // m
  volumeM3?: number; // m³ (optional, if not length×width×height)
  cargoTonnage?: number; // tonnes (optional if volume+SF provided)
  arrangement: GrainArrangement; // full/part/trimmed/untrimmed
  cargo: GrainCargoType;
  measures?: GrainMeasures; // mitigation devices
  stowageFactorM3PerT?: number; // override cargo SF per hold if needed
}

export interface GrainLoadingPlan {
  holds: GrainHoldInfo[];
}

export interface TankSoundingPoint {
  soundingMm: number;
  volumeM3: number;
}

export interface TankSoundingTable {
  tankName: string;
  points: TankSoundingPoint[];
}

export interface GrainVesselData {
  geometry: ShipGeometry; // L, B, D, T, coefficients
  lightweightTonnes: number; // LW
  LCGm: number; // Longitudinal CG
  VCGm: number; // Vertical CG (KG)
  DWTcapacityTonnes?: number; // Deadweight capacity
  KMm?: number; // KM (transverse)
  GMm?: number; // GM (initial)
  tanks?: TankData[]; // capacities and current volumes
  tankSoundTables?: TankSoundingTable[]; // optional detailed sound tables
}

export interface GrainCalculationInputs {
  displacementTonnes?: number; // Δ (if known)
  KGm?: number; // KG (if known)
  KBm?: number; // KB (optional)
  BMm?: number; // BM (optional)
  freeSurfaceCorrectionM?: number; // FSC (ΔKG)
  heelCheckAnglesDeg?: number[]; // e.g., [5,10,12]
  gmMinRequiredM?: number; // Grain Code requirement (default 0.30 m)
}

export interface GrainCriteria {
  name: string;
  value: number;
  requirement: number;
  passed: boolean;
}

export interface GrainComputationResult {
  angles: number[]; // degrees
  gz: number[]; // m (righting arm)
  heelingArm: number[]; // m (grain heeling arm)
  netGZ: number[]; // m (GZ - heelingArm)
  phiEquilibriumDeg: number; // where netGZ≈0
  gmInitialM: number;
  gmCorrectedM: number;
  kmM: number;
  kgM: number;
  displacementTonnes: number;
  draftMeanM: number;
  draftFwdM: number;
  draftAftM: number;
  trimM: number;
  maxGZ: number;
  maxGZAngleDeg: number;
  areaGZ_0_30: number; // m·rad
  areaGZ_0_40: number; // m·rad
  areaGZ_30_40: number; // m·rad
  areaNet_0_30: number; // m·rad
  areaNet_0_40: number; // m·rad
  areaNet_30_40: number; // m·rad
  residualAreaEq_40: number; // m·rad (φ_eq to 40°)
  checkAngles?: Array<{ angle: number; gz: number; heeling: number; net: number }>;
  criteria: GrainCriteria[];
  compliant: boolean;
}
