// Comprehensive Vessel Data Models for Ship Stability Calculations

export interface VesselData {
  name: string;
  Lpp: number; // Length Between Perpendiculars
  B: number;   // Breadth
  D: number;   // Depth
  lightship: LightshipData;
  hydrostatics: HydrostaticTables;
  tanks: TankGeometry[];
  downflooding_angle_deg: number;
  compartments?: CompartmentData[]; // For damage stability
  windage?: WindageData; // Optional wind resistance data
}

export interface LightshipData {
  weight: number; // tonnes
  KG: number;     // m
  LCG: number;    // m
  TCG: number;    // m
}

export interface HydrostaticTables {
  T_values: number[];    // Draft values
  Delta: number[];       // Displacement at each draft
  KB: number[];          // Center of Buoyancy
  KMt: number[];         // Transverse Metacentric Height
  BMt?: number[];        // Transverse Metacentric Radius
  LCB?: number[];        // Longitudinal Center of Buoyancy
  LCF?: number[];        // Longitudinal Center of Flotation
  TPC?: number[];        // Tonnes per Centimeter
  MTC?: number[];        // Moment to Change Trim
  KN: KNTable;           // Cross Curves
}

export interface KNTable {
  phi_deg: number[];     // Heel angles
  [key: string]: number[]; // T=6.0, T=7.0 etc.
}

export interface TankGeometry {
  id: string;
  rho: number;           // Fluid density (t/m³)
  capacity_m3: number;   // Tank capacity
  fsm_table: number[][]; // [fill_percent, fsm_value] pairs
  lcg: number;           // m
  tcg: number;           // m  
  vcg: number;           // m
  length?: number;       // Optional for advanced FSM
  breadth?: number;      // Optional for advanced FSM
  height?: number;       // Optional for advanced FSM
}

export interface CompartmentData {
  id: string;
  volume: number;        // m³
  permeability: number;  // 0-1
  lcg: number;
  tcg: number;
  vcg: number;
}

export interface WindageData {
  lateral_area: number;  // m²
  center_height: number; // m above waterline
  coefficients?: WindCoefficients;
}

export interface WindCoefficients {
  Cx?: number;           // Drag coefficient
  Cy?: number;           // Side force coefficient
}

// Loading Case Models
export interface LoadingCase {
  name?: string;
  items: LoadingItem[];
  tanks: TankFilling[];
  passengers?: PassengerDistribution[];
  vehicles?: VehicleDistribution[];
}

export interface LoadingItem {
  name: string;
  weight: number;        // tonnes
  lcg: number;           // m
  tcg: number;           // m
  vcg: number;           // m
  secured?: boolean;     // For cargo securing analysis
}

export interface TankFilling {
  id: string;            // References TankGeometry.id
  fill_percent: number;  // 0-100
  fill_mm?: number;      // Alternative to percent
}

export interface PassengerDistribution {
  area: string;
  count: number;
  average_weight: number; // kg
  lcg: number;
  tcg: number;
  vcg: number;
}

export interface VehicleDistribution {
  deck: string;
  count: number;
  average_weight: number; // tonnes
  lcg: number;
  tcg: number;
  vcg: number;
}

// Calculation Results
export interface LoadingSummary {
  total_displacement: number;  // tonnes
  KG: number;                 // m
  LCG: number;                // m
  TCG: number;                // m
  KG_corrected: number;       // With free surface
  fsm_sum: number;            // Total free surface moment
  tank_states: TankState[];
}

export interface TankState {
  id: string;
  weight: number;       // tonnes
  lcg: number;
  tcg: number;
  vcg: number;
  fsm: number;          // Free surface moment
  fill_percent: number;
}

export interface DraftTrimSolution {
  T_mean: number;       // m
  T_fwd: number;        // m
  T_aft: number;        // m
  trim: number;         // m (positive by stern)
  trim_angle: number;   // degrees
  KB: number;           // m
  KMt: number;          // m
  BMt: number;          // m
  LCB: number;          // m
  LCF: number;          // m
  TPC: number;          // tonnes/cm
  MTC: number;          // tonne·m/cm
}

export interface StabilityCurve {
  angles: number[];     // degrees
  GZ: number[];         // m
  KN: number[];         // m
  righting_moments: number[]; // kN·m
  max_GZ: number;       // m
  max_GZ_angle: number; // degrees
  vanishing_angle: number; // degrees
}

export interface StabilityCriteria {
  area_0_30: number;    // m·rad
  area_0_40: number;    // m·rad
  area_30_40: number;   // m·rad
  max_GZ: number;       // m
  initial_GM: number;   // m
  weather_criterion?: number;
  passenger_crowding?: number;
  grain_shift?: number;
  compliance: CriteriaResult[];
}

export interface CriteriaResult {
  name: string;
  value: number;
  requirement: number;
  passed: boolean;
  critical: boolean;
}

// Wind and Weather Effects
export interface WindHeeling {
  wind_speed: number;     // m/s
  heel_angle: number;     // degrees
  heeling_arm: number;    // m
  stability_margin: number; // m
  critical_wind_speed?: number; // m/s
}

// Damage Stability
export interface DamageCase {
  compartments: string[]; // Flooded compartment IDs
  permeability: number;   // Average permeability
  flooding_time: number;  // minutes
  final_condition: DamageCondition;
}

export interface DamageCondition {
  heel_angle: number;     // degrees
  trim_angle: number;     // degrees
  residual_GM: number;    // m
  survival_factor: number; // 0-1
  downflooding_margin: number; // degrees
}

// Export for convenience
export type VesselConfiguration = VesselData;
export type LoadingConfiguration = LoadingCase;