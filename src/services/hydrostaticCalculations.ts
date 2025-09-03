import {
  ShipGeometry,
  HydrostaticData,
  CenterPoints,
  HydrostaticCoefficients,
  StabilityData,
  IMOStabilityCriteria,
  TrimAndList,
  DamageStability,
  GrainStability,
  DynamicStability,
  WeightDistribution,
  TankData,
  FreeSurfaceCorrection,
  DraftSurvey,
  StabilityAnalysis,
  BonjeanCurve,
  SectionalArea,
  GZCurvePoint,
  CompartmentAnalysis,
  CrossCurves,
  BonjeanSet
} from '../types/hydrostatic';

export class HydrostaticCalculations {
  private static readonly GRAVITY = 9.81; // m/s²
  private static readonly WATER_DENSITY = 1.025; // t/m³ (seawater)
  private static readonly FRESH_WATER_DENSITY = 1.000; // t/m³

  /** Additional constants for environmental calculations */
  private static readonly AIR_DENSITY = 1.225; // kg/m³ (sea level) – informational

  /**
   * Calculate displacement and volume displacement
   */
  static calculateDisplacement(geometry: ShipGeometry): { displacement: number; volumeDisplacement: number } {
    const volumeDisplacement = geometry.length * geometry.breadth * geometry.draft * geometry.blockCoefficient;
    const displacement = volumeDisplacement * this.WATER_DENSITY;
    
    return { displacement, volumeDisplacement };
  }

  /**
   * Calculate waterplane area
   */
  static calculateWaterplaneArea(geometry: ShipGeometry): number {
    return geometry.length * geometry.breadth * geometry.waterplaneCoefficient;
  }

  /**
   * Calculate immersed volume
   */
  static calculateImmersedVolume(geometry: ShipGeometry): number {
    return geometry.length * geometry.breadth * geometry.draft * geometry.blockCoefficient;
  }

  /**
   * Generate Bonjean curves
   */
  static generateBonjeanCurves(geometry: ShipGeometry): BonjeanCurve[] {
    const curves: BonjeanCurve[] = [];
    const stations = 21; // Standard 21 stations
    
    for (let i = 0; i <= stations; i++) {
      const station = i;
      const draft = geometry.draft;
      const area = this.calculateSectionalArea(geometry, station, draft);
      const moment = area * draft / 2; // Simplified moment calculation
      
      curves.push({ station, draft, area, moment });
    }
    
    return curves;
  }

  /**
   * Calculate sectional area at given station and draft
   */
  private static calculateSectionalArea(geometry: ShipGeometry, station: number, draft: number): number {
    // Simplified sectional area calculation
    const stationPosition = station / 20; // Normalized position (0-1)
    const maxBreadth = geometry.breadth;
    const currentBreadth = maxBreadth * Math.sin(Math.PI * stationPosition);
    const area = currentBreadth * draft * geometry.midshipCoefficient;
    
    return area;
  }

  /**
   * Calculate center points (LCB, VCB, LCF, VCF, KB, KM, BM, KG, GM)
   */
  static calculateCenterPoints(geometry: ShipGeometry, kg: number): CenterPoints {
    const lcb = geometry.length * 0.5; // Simplified LCB calculation
    const vcb = geometry.draft * 0.5; // Simplified VCB calculation
    const lcf = geometry.length * 0.5; // Simplified LCF calculation
    const vcf = 0; // VCF is at waterline
    const kb = geometry.draft * 0.5; // Simplified KB calculation
    const bmt = this.calculateBMT(geometry);
    const bml = this.calculateBML(geometry);
    const kmt = kb + bmt;
    const kml = kb + bml;
    const gmt = kmt - kg;
    const gml = kml - kg;
    // Legacy aliases map to transverse values
    const bm = bmt;
    const km = kmt;
    const gm = gmt;
    return { lcb, vcb, lcf, vcf, kb, km, bm, kg, gm, kmt, bmt, gmt, kml, bml, gml } as CenterPoints;
  }

  /**
   * Calculate BM (Metacentric radius)
   */
  private static calculateBMT(geometry: ShipGeometry): number {
    // Transverse waterplane second moment (about centerline): I_T ≈ Cw * L * B^3 / 12
    const it = geometry.waterplaneCoefficient * (geometry.length * Math.pow(geometry.breadth, 3)) / 12;
    const volumeDisplacement = geometry.length * geometry.breadth * geometry.draft * geometry.blockCoefficient;
    return volumeDisplacement > 0 ? it / volumeDisplacement : 0;
  }

  private static calculateBML(geometry: ShipGeometry): number {
    // Longitudinal waterplane second moment (about transverse axis through LCF): I_L ≈ Cw * B * L^3 / 12
    const il = geometry.waterplaneCoefficient * (geometry.breadth * Math.pow(geometry.length, 3)) / 12;
    const volumeDisplacement = geometry.length * geometry.breadth * geometry.draft * geometry.blockCoefficient;
    return volumeDisplacement > 0 ? il / volumeDisplacement : 0;
  }

  /**
   * Calculate hydrostatic coefficients (TPC, MTC, LCF, WPA, KB, KM, BM)
   */
  static calculateHydrostaticCoefficients(geometry: ShipGeometry): HydrostaticCoefficients {
    const wpa = this.calculateWaterplaneArea(geometry);
    const tpc = wpa * this.WATER_DENSITY / 100; // TPC in tonnes per cm
    const mtc1cm = this.calculateMCT1cm(geometry, /* kg */ 0); // kg will be subtracted later if needed
    const lcf = geometry.length * 0.5; // Simplified LCF
    const kb = geometry.draft * 0.5; // Simplified KB
    const bm = this.calculateBMT(geometry);
    const km = kb + bm;
    return { tpc, mtc1cm, lcf, wpa, kb, km, bm } as HydrostaticCoefficients;
  }

  /**
   * Calculate MTC (Moment to Change Trim)
   */
  private static calculateMCT1cm(geometry: ShipGeometry, kg: number): number {
    // MCT1cm (t-m/cm) ≈ (Δ · GM_l) / (100 · L)
    const { displacement } = this.calculateDisplacement(geometry); // tonnes
    const centers = this.calculateCenterPoints(geometry, kg);
    const gml = centers.gml; // meters
    if (geometry.length <= 0) return 0;
    return (displacement * gml) / (100 * geometry.length);
  }

  /**
   * Calculate stability data (GZ curve, righting moments, critical angles)
   */
  static calculateStabilityData(geometry: ShipGeometry, kg: number): StabilityData {
    const angles = Array.from({ length: 91 }, (_, i) => i); // 0-90 degrees
    const gz: number[] = [];
    const rightingMoment: number[] = [];
    
    let maxGz = 0;
    let maxGzAngle = 0;
    let vanishingAngle = 0;
    let deckEdgeAngle = 0;
    let downfloodingAngle = 0;
    let equalizedAngle = 0;
    
    for (const angle of angles) {
      const gzValue = this.calculateGZ(geometry, kg, angle);
      const rightingMomentValue = gzValue * this.calculateDisplacement(geometry).displacement * this.GRAVITY;
      
      gz.push(gzValue);
      rightingMoment.push(rightingMomentValue);
      
      if (gzValue > maxGz) {
        maxGz = gzValue;
        maxGzAngle = angle;
      }
      
      if (gzValue <= 0 && vanishingAngle === 0) {
        vanishingAngle = angle;
      }
    }
    
    // Calculate critical angles
    deckEdgeAngle = this.calculateDeckEdgeAngle(geometry);
    downfloodingAngle = this.calculateDownfloodingAngle(geometry);
    equalizedAngle = this.calculateEqualizedAngle(geometry);
    
    const gm = this.calculateCenterPoints(geometry, kg).gmt;
    
    return {
      gm,
      gz,
      rightingMoment,
      angles,
      maxGz,
      maxGzAngle,
      vanishingAngle,
      deckEdgeAngle,
      downfloodingAngle,
      equalizedAngle
    };
  }

  /**
   * Calculate GZ (Righting arm) at given angle with deck edge corrections
   */
  private static calculateGZ(geometry: ShipGeometry, kg: number, angle: number): number {
    const angleRad = (angle * Math.PI) / 180;
    const km = this.calculateCenterPoints(geometry, kg).kmt; // transverse KM
    const deckEdgeAngle = this.calculateDeckEdgeAngle(geometry);
    
    // Basic GZ calculation using wall-sided formula
    let gz = (km - kg) * Math.sin(angleRad);
    
    // Apply deck edge correction for large angles
    if (angle > deckEdgeAngle) {
      // Deck edge immersion reduces GZ due to loss of waterplane area
      const deckEdgeReduction = this.calculateDeckEdgeReduction(geometry, angle, deckEdgeAngle);
      gz -= deckEdgeReduction;
    }
    
    // Apply form corrections for large angles
    if (angle > 15) {
      // Form correction for finite breadth effect
      const formCorrection = 0.5 * geometry.breadth * Math.pow(Math.sin(angleRad), 2) / geometry.draft;
      gz -= formCorrection;
    }
    
    return Math.max(0, gz); // GZ cannot be negative
  }

  /**
   * Calculate deck edge reduction in GZ for angles beyond deck edge immersion
   */
  private static calculateDeckEdgeReduction(geometry: ShipGeometry, angle: number, deckEdgeAngle: number): number {
    if (angle <= deckEdgeAngle) return 0;
    
    // Deck edge reduction increases with angle beyond deck edge
    const excessAngle = angle - deckEdgeAngle;
    const angleRad = excessAngle * Math.PI / 180;
    
    // Reduction factor based on waterplane area loss
    const reductionFactor = 0.1 * geometry.breadth * Math.sin(angleRad);
    
    return reductionFactor;
  }

  /**
   * Generate detailed GZ curve points for a given angle range
   */
  static generateGZCurve(
    geometry: ShipGeometry,
    kg: number,
    startAngle: number = 0,
    endAngle: number = 90,
    step: number = 1
  ): GZCurvePoint[] {
    const points: GZCurvePoint[] = [];
    for (let angle = startAngle; angle <= endAngle; angle += step) {
      const gz = this.calculateGZ(geometry, kg, angle);
      const rightingMoment = gz * this.calculateDisplacement(geometry).displacement * this.GRAVITY;
      points.push({ angle, gz, rightingMoment });
    }
    return points;
  }

  /**
   * Approximate KN value at a given angle (for reference-based workflows)
   * This uses a simplified proxy: KN ≈ KM × sin(φ)
   */
  static calculateKNApprox(geometry: ShipGeometry, kg: number, angle: number): number {
    const km = this.calculateCenterPoints(geometry, kg).km;
    const angleRad = (angle * Math.PI) / 180;
    return Math.max(0, km * Math.sin(angleRad));
  }

  /**
   * Calculate righting moment from displacement and righting arm
   */
  static calculateRightingMoment(displacementTonnes: number, gz: number): number {
    // Return in kN·m for convenience
    return (displacementTonnes * this.GRAVITY * gz) / 1_000;
  }

  /**
   * Calculate draft from volume and waterplane area (T = V / Awp)
   */
  static calculateDraftFromVolumeAndWPA(volume: number, waterplaneArea: number): number {
    if (waterplaneArea === 0) return 0;
    return volume / waterplaneArea;
  }

  /**
   * Calculate list angle from a transverse weight shift (θ = arctan(W·d / (Δ·GM)))
   */
  static calculateListAngleFromShift(weight: number, transverseDistance: number, displacementTonnes: number, gm: number): number {
    if (displacementTonnes <= 0 || gm <= 0) return 0;
    const theta = Math.atan((weight * transverseDistance) / (displacementTonnes * gm));
    return (theta * 180) / Math.PI;
  }

  /**
   * Calculate angle of loll (valid for near-zero/negative initial GM): φ_loll = arccos(KG / KM)
   */
  static calculateAngleOfLoll(kg: number, km: number): number {
    if (km <= 0 || kg >= km) return 0;
    return Math.acos(kg / km) * (180 / Math.PI);
  }

  /**
   * Wind heeling moment (simplified): M_wind = 0.5 × ρ_air × v² × A × h  [N·m]
   * Provide already computed pressure P (N/m²) when available: M = P × A × h
   */
  static calculateWindMoment({ pressure, area, height, velocity }:
    { pressure?: number; area: number; height: number; velocity?: number }): number {
    if (pressure && pressure > 0) {
      return pressure * area * height; // N·m
    }
    if (velocity && velocity > 0) {
      // Convert to N·m using AIR_DENSITY
      const P = 0.5 * this.AIR_DENSITY * velocity * velocity; // N/m²
      return P * area * height;
    }
    return 0;
  }

  /**
   * Wind heel angle: tan(φ) = M_wind / (Δ·g·GM)
   */
  static calculateWindHeelAngle(momentNewtonMeter: number, displacementTonnes: number, gm: number): number {
    if (displacementTonnes <= 0 || gm <= 0) return 0;
    const tanPhi = momentNewtonMeter / (displacementTonnes * this.GRAVITY * gm);
    return (Math.atan(tanPhi) * 180) / Math.PI;
  }

  /**
   * Heeling arm due to wind: H_wind = M_wind / (Δ·g)
   */
  static calculateWindHeelingArm(momentNewtonMeter: number, displacementTonnes: number): number {
    if (displacementTonnes <= 0) return 0;
    return momentNewtonMeter / (displacementTonnes * this.GRAVITY);
  }

  /**
   * Calculate deck edge angle
   */
  private static calculateDeckEdgeAngle(geometry: ShipGeometry): number {
    return Math.atan2(geometry.breadth / 2, geometry.depth) * 180 / Math.PI;
  }

  /**
   * Calculate downflooding angle - angle at which water enters through openings
   */
  private static calculateDownfloodingAngle(geometry: ShipGeometry): number {
    // Downflooding angle depends on opening heights and vessel geometry
    // For general cargo vessels: typically related to freeboard and opening positions
    const freeboard = geometry.depth - geometry.draft;
    const relativeFreeboard = freeboard / geometry.depth;
    
    // Empirical formula based on freeboard ratio
    // Higher freeboard = higher downflooding angle
    const baseAngle = 15; // Base angle for low freeboard
    const maxAngle = 40;  // Maximum realistic downflooding angle
    
    const downfloodingAngle = baseAngle + (maxAngle - baseAngle) * relativeFreeboard;
    
    return Math.max(15, Math.min(40, downfloodingAngle));
  }

  /**
   * Calculate equalized angle - angle at which vessel reaches equilibrium after damage
   */
  private static calculateEqualizedAngle(geometry: ShipGeometry): number {
    // Equalized angle depends on vessel geometry and damage characteristics
    // For intact stability, this represents the angle where vessel would settle
    // after asymmetric flooding or loading
    
    const beamToDraftRatio = geometry.breadth / geometry.draft;
    const blockCoefficient = geometry.blockCoefficient;
    
    // Empirical formula based on vessel form
    // Fuller vessels (high Cb) tend to have larger equalized angles
    const baseAngle = 20;
    const formFactor = blockCoefficient * beamToDraftRatio;
    const equalizedAngle = baseAngle + (formFactor - 1) * 10;
    
    return Math.max(15, Math.min(45, equalizedAngle));
  }

  /**
   * Calculate IMO stability criteria
   */
  static calculateIMOStabilityCriteria(stabilityData: StabilityData): IMOStabilityCriteria {
    const area0to30 = this.calculateAreaUnderGZCurve(stabilityData.gz, stabilityData.angles, 0, 30);
    const area0to40 = this.calculateAreaUnderGZCurve(stabilityData.gz, stabilityData.angles, 0, 40);
    const area30to40 = area0to40 - area0to30;
    
    const initialGM = stabilityData.gm;
    const areaRequirement = 0.055; // Minimum area requirement in m-rad
    const weatherCriterion = this.calculateWeatherCriterion(stabilityData);
    
    const compliance = this.checkIMOCompliance({
      area0to30,
      area0to40,
      area30to40,
      maxGz: stabilityData.maxGz,
      initialGM,
      areaRequirement,
      weatherCriterion,
      compliance: false
    });
    
    return {
      area0to30,
      area0to40,
      area30to40,
      maxGz: stabilityData.maxGz,
      initialGM,
      areaRequirement,
      weatherCriterion,
      compliance
    };
  }

  /**
   * Calculate area under GZ curve between given angles
   */
  private static calculateAreaUnderGZCurve(gz: number[], angles: number[], startAngle: number, endAngle: number): number {
    let area = 0;
    
    for (let i = 0; i < angles.length - 1; i++) {
      if (angles[i] >= startAngle && angles[i] <= endAngle) {
        const angleDiff = (angles[i + 1] - angles[i]) * Math.PI / 180; // Convert to radians
        const gzAvg = (gz[i] + gz[i + 1]) / 2;
        area += gzAvg * angleDiff;
      }
    }
    
    return area;
  }

  /**
   * Calculate weather criterion according to IMO requirements
   */
  private static calculateWeatherCriterion(stabilityData: StabilityData): number {
    // Weather criterion requires that the vessel can withstand wind heeling
    // The area under the GZ curve up to the angle of deck edge immersion or 40°
    // (whichever is less) should be at least 1.4 times the wind heeling energy
    
    const limitAngle = Math.min(stabilityData.deckEdgeAngle, 40);
    const availableArea = this.calculateAreaUnderGZCurve(
      stabilityData.gz, 
      stabilityData.angles, 
      0, 
      limitAngle
    );
    
    // Wind heeling energy calculation (simplified)
    // Actual calculation requires wind pressure, lateral area, and center of pressure
    const standardWindPressure = 504; // N/m² (standard wind pressure)
    const estimatedLateralArea = 100; // m² (typical lateral projected area)
    const estimatedLeverArm = 10; // m (typical wind lever arm)
    
    // Wind heeling energy = (P × A × h) / (Δ × g)
    const displacement = 10000; // tonnes (this should come from actual calculation)
    const windHeelingEnergy = (standardWindPressure * estimatedLateralArea * estimatedLeverArm) / 
                             (displacement * 1000 * this.GRAVITY);
    
    // Weather criterion = Available area / Required area
    // Should be ≥ 1.4 for compliance
    return windHeelingEnergy > 0 ? availableArea / (1.4 * windHeelingEnergy) : 0;
  }

  /**
   * Check IMO compliance
   */
  private static checkIMOCompliance(criteria: IMOStabilityCriteria): boolean {
    return (
      criteria.area0to30 >= 0.055 &&
      criteria.area0to40 >= 0.090 &&
      criteria.area30to40 >= 0.030 &&
      criteria.maxGz >= 0.20 &&
      criteria.initialGM >= 0.15
    );
  }

  /**
   * Calculate trim and list
   */
  static calculateTrimAndList(
    geometry: ShipGeometry,
    weightDistribution: WeightDistribution[],
    tanks: TankData[]
  ): TrimAndList {
    const totalWeight = weightDistribution.reduce((sum, item) => sum + item.weight, 0);
    const totalMoment = weightDistribution.reduce((sum, item) => sum + item.moment, 0);
    
    // MCT1cm in t-m per cm; totalMoment assumed t-m
    const mtc1cm = this.calculateMCT1cm(geometry, 0);
    const trimChange = mtc1cm > 0 ? (Math.abs(totalMoment) / mtc1cm) / 100 : 0; // meters
    const trimAngle = Math.atan2(trimChange, geometry.length) * 180 / Math.PI;
    const listAngle = this.calculateListAngle(weightDistribution, tanks);
    const listMoment = this.calculateListMoment(weightDistribution, tanks);
    const mct1cmValue = mtc1cm;
    
    const trimCorrection = this.calculateTrimCorrection(geometry, trimAngle);
    const listCorrection = this.calculateListCorrection(geometry, listAngle);
    const draftCorrection = trimCorrection + listCorrection;
    
    return {
      trimAngle,
      trimChange,
      listAngle,
      listMoment,
      mct1cm: mct1cmValue,
      trimCorrection,
      listCorrection,
      draftCorrection
    };
  }

  /**
   * Calculate list angle
   */
  private static calculateListAngle(weightDistribution: WeightDistribution[], tanks: TankData[]): number {
    const totalTransverseMoment = weightDistribution.reduce((sum, item) => sum + item.weight * item.tcg, 0);
    const totalWeight = weightDistribution.reduce((sum, item) => sum + item.weight, 0);
    
    return Math.atan2(totalTransverseMoment, totalWeight) * 180 / Math.PI;
  }

  /**
   * Calculate list moment
   */
  private static calculateListMoment(weightDistribution: WeightDistribution[], tanks: TankData[]): number {
    return weightDistribution.reduce((sum, item) => sum + item.weight * item.tcg, 0);
  }

  /**
   * Calculate trim correction
   */
  private static calculateTrimCorrection(geometry: ShipGeometry, trimAngle: number): number {
    return (geometry.length * Math.tan(trimAngle * Math.PI / 180)) / 2;
  }

  /**
   * Calculate list correction
   */
  private static calculateListCorrection(geometry: ShipGeometry, listAngle: number): number {
    return (geometry.breadth * Math.tan(listAngle * Math.PI / 180)) / 2;
  }

  /**
   * Calculate damage stability
   */
  static calculateDamageStability(
    geometry: ShipGeometry,
    kg: number,
    floodedCompartments: CompartmentAnalysis[]
  ): DamageStability {
    const floodedVolume = floodedCompartments.reduce((sum, comp) => sum + comp.floodedVolume, 0);
    const newKG = this.calculateNewKG(kg, floodedCompartments);
    const residualGM = this.calculateResidualGM(geometry, newKG, floodedVolume);
    const crossFloodingTime = this.calculateCrossFloodingTime(floodedCompartments);
    const downfloodingAngle = this.calculateDownfloodingAngle(geometry);
    const equalizedAngle = this.calculateEqualizedAngle(geometry);
    const survivalFactor = this.calculateSurvivalFactor(residualGM, downfloodingAngle);
    
    return {
      floodedVolume,
      newKG,
      residualGM,
      crossFloodingTime,
      downfloodingAngle,
      equalizedAngle,
      survivalFactor,
      compartmentAnalysis: floodedCompartments
    };
  }

  /**
   * Calculate new KG after damage - proper moment-based calculation
   */
  private static calculateNewKG(originalKG: number, floodedCompartments: CompartmentAnalysis[]): number {
    if (floodedCompartments.length === 0) return originalKG;
    
    // Calculate new KG using moment balance
    // Total moment = Original moment + Flooded water moments
    let totalMoment = originalKG; // Assuming unit displacement initially
    let totalWeight = 1; // Unit weight for original vessel
    
    for (const comp of floodedCompartments) {
      // Flooded water weight = volume × seawater density × permeability
      const floodedWeight = comp.floodedVolume * this.WATER_DENSITY;
      const compartmentKG = comp.newKG;
      
      totalMoment += floodedWeight * compartmentKG;
      totalWeight += floodedWeight;
    }
    
    return totalMoment / totalWeight;
  }

  /**
   * Calculate residual GM after damage
   */
  private static calculateResidualGM(geometry: ShipGeometry, newKG: number, floodedVolume: number): number {
    // Calculate new displacement including flooded water
    const originalDisplacement = this.calculateDisplacement(geometry).displacement;
    const floodedWeight = floodedVolume * this.WATER_DENSITY;
    const newDisplacement = originalDisplacement + floodedWeight;
    
    // Calculate new draft due to additional weight
    const waterplaneArea = this.calculateWaterplaneArea(geometry);
    const draftIncrease = floodedWeight / (waterplaneArea * this.WATER_DENSITY);
    const newDraft = geometry.draft + draftIncrease;
    
    // Calculate new KM with increased draft
    const newGeometry = { ...geometry, draft: newDraft };
    const newKM = this.calculateCenterPoints(newGeometry, newKG).km;
    
    // Account for lost buoyancy effect on BM
    const volumeLoss = floodedVolume;
    const bmReduction = volumeLoss / newDisplacement * newKM * 0.1; // Approximate reduction
    const correctedKM = newKM - bmReduction;
    
    return correctedKM - newKG;
  }

  /**
   * Calculate cross flooding time based on compartment geometry and opening sizes
   */
  private static calculateCrossFloodingTime(floodedCompartments: CompartmentAnalysis[]): number {
    if (floodedCompartments.length === 0) return 0;
    
    // Cross flooding time calculation based on Torricelli's law
    // t = (A_compartment × h) / (A_opening × √(2gh))
    // Simplified approach using average compartment characteristics
    
    let totalTime = 0;
    let compartmentCount = 0;
    
    for (const comp of floodedCompartments) {
      // Estimate compartment area from flooded volume (assume rectangular)
      const estimatedHeight = 3; // Typical compartment height in meters
      const compartmentArea = comp.floodedVolume / estimatedHeight;
      
      // Typical opening area for cross flooding (0.5-2% of compartment area)
      const openingArea = compartmentArea * 0.01; // 1% of compartment area
      
      // Cross flooding time using simplified Torricelli formula
      // Assume flooding height of 2 meters
      const floodingHeight = 2;
      const velocity = Math.sqrt(2 * this.GRAVITY * floodingHeight);
      const flowRate = openingArea * velocity; // m³/s
      
      if (flowRate > 0) {
        const floodingTime = comp.floodedVolume / flowRate / 60; // Convert to minutes
        totalTime += floodingTime;
        compartmentCount++;
      }
    }
    
    return compartmentCount > 0 ? totalTime / compartmentCount : 20;
  }

  /**
   * Calculate survival factor
   */
  private static calculateSurvivalFactor(residualGM: number, downfloodingAngle: number): number {
    return Math.max(0, residualGM / downfloodingAngle);
  }

  /**
   * Calculate grain stability (SOLAS Ch. VI)
   */
  static calculateGrainStability(
    geometry: ShipGeometry,
    grainShiftMoment: number,
    grainHeelAngle: number
  ): GrainStability {
    const grainSafetyFactor = this.calculateGrainSafetyFactor(grainShiftMoment, grainHeelAngle);
    const grainAllowableHeel = this.calculateGrainAllowableHeel(geometry);
    const grainStabilityCriterion = this.calculateGrainStabilityCriterion(grainShiftMoment, grainAllowableHeel);
    const compliance = this.checkGrainCompliance(grainStabilityCriterion, grainSafetyFactor);
    
    return {
      grainShiftMoment,
      grainHeelAngle,
      grainSafetyFactor,
      grainAllowableHeel,
      grainStabilityCriterion,
      compliance
    };
  }

  /**
   * Calculate grain safety factor according to SOLAS Chapter VI
   */
  private static calculateGrainSafetyFactor(grainShiftMoment: number, grainHeelAngle: number): number {
    if (grainHeelAngle <= 0) return 0;
    
    // Safety factor = Available righting moment / Required righting moment
    // This is a simplified calculation - actual SOLAS requires detailed area calculations
    const grainHeelAngleRad = grainHeelAngle * Math.PI / 180;
    return Math.abs(grainShiftMoment) > 0 ? 1 / Math.tan(grainHeelAngleRad) : 1.0;
  }

  /**
   * Calculate grain allowable heel angle according to SOLAS
   */
  private static calculateGrainAllowableHeel(geometry: ShipGeometry): number {
    // SOLAS Chapter VI requirements:
    // - Generally 12° or angle of deck edge immersion, whichever is less
    // - For vessels with effective grain securing: up to 15°
    
    const deckEdgeAngle = this.calculateDeckEdgeAngle(geometry);
    const standardLimit = 12; // Standard SOLAS limit
    const maxAllowable = 15; // With proper securing
    
    // Use the minimum of deck edge angle and standard limit
    const allowableHeel = Math.min(deckEdgeAngle, standardLimit);
    
    return Math.max(5, Math.min(maxAllowable, allowableHeel));
  }

  /**
   * Calculate grain stability criterion per SOLAS Chapter VI
   */
  private static calculateGrainStabilityCriterion(grainShiftMoment: number, grainAllowableHeel: number): number {
    // Grain stability criterion checks if the vessel can withstand grain shift
    // Criterion = Heeling moment / Righting moment at allowable angle
    
    if (grainAllowableHeel <= 0) return 0;
    
    const allowableAngleRad = grainAllowableHeel * Math.PI / 180;
    const rightingCapacity = Math.sin(allowableAngleRad); // Simplified righting capacity
    
    return Math.abs(grainShiftMoment) / rightingCapacity;
  }

  /**
   * Check grain compliance with SOLAS Chapter VI requirements
   */
  private static checkGrainCompliance(grainStabilityCriterion: number, grainSafetyFactor: number): boolean {
    // SOLAS compliance requires:
    // 1. Stability criterion ≤ 1.0 (heeling moment ≤ available righting moment)
    // 2. Safety factor ≥ 1.4 (40% safety margin)
    // 3. Initial GM ≥ 0.30 m for grain carriers
    
    const criterionOK = grainStabilityCriterion <= 1.0;
    const safetyOK = grainSafetyFactor >= 1.4;
    
    return criterionOK && safetyOK;
  }

  /**
   * Calculate dynamic stability
   */
  static calculateDynamicStability(
    geometry: ShipGeometry,
    stabilityData: StabilityData,
    weightDistribution: WeightDistribution[]
  ): DynamicStability {
    const rollingPeriod = this.calculateRollingPeriod(geometry, stabilityData.gm);
    const naturalPeriod = this.calculateNaturalPeriod(geometry);
    const energyToHeel = this.calculateEnergyToHeel(stabilityData);
    const stabilityIndex = this.calculateStabilityIndex(stabilityData);
    const safetyMargin = this.calculateSafetyMargin(stabilityData);
    const resonanceCheck = this.checkResonance(rollingPeriod, naturalPeriod);
    const stabilityRange = this.calculateStabilityRange(stabilityData);
    const stabilityQuality = this.calculateStabilityQuality(stabilityData);
    const gmStandards = this.calculateGMStandards(stabilityData.gm);
    
    const gzCurve: GZCurvePoint[] = stabilityData.angles.map((angle, index) => ({
      angle,
      gz: stabilityData.gz[index],
      rightingMoment: stabilityData.rightingMoment[index]
    }));
    
    return {
      rollingPeriod,
      naturalPeriod,
      energyToHeel,
      stabilityIndex,
      safetyMargin,
      resonanceCheck,
      stabilityRange,
      stabilityQuality,
      gmStandards,
      gzCurve
    };
  }

  /**
   * Calculate rolling period
   */
  private static calculateRollingPeriod(geometry: ShipGeometry, gm: number): number {
    const radiusOfGyration = geometry.breadth / 2;
    return 2 * Math.PI * radiusOfGyration / Math.sqrt(gm * this.GRAVITY);
  }

  /**
   * Calculate natural period
   */
  private static calculateNaturalPeriod(geometry: ShipGeometry): number {
    return 2 * Math.PI * Math.sqrt(geometry.depth / this.GRAVITY);
  }

  /**
   * Calculate energy to heel - dynamic stability energy calculation
   */
  private static calculateEnergyToHeel(stabilityData: StabilityData): number {
    // Energy to heel = ∫ GZ dφ (area under GZ curve)
    // Calculate the area under the GZ curve using trapezoidal rule
    
    if (stabilityData.gz.length < 2 || stabilityData.angles.length < 2) return 0;
    
    let energy = 0;
    const degToRad = Math.PI / 180;
    
    for (let i = 0; i < stabilityData.gz.length - 1; i++) {
      const angle1 = stabilityData.angles[i] * degToRad;
      const angle2 = stabilityData.angles[i + 1] * degToRad;
      const gz1 = stabilityData.gz[i];
      const gz2 = stabilityData.gz[i + 1];
      
      // Trapezoidal integration
      const deltaAngle = angle2 - angle1;
      const avgGZ = (gz1 + gz2) / 2;
      energy += avgGZ * deltaAngle;
    }
    
    return energy; // m·rad
  }

  /**
   * Calculate stability index
   */
  private static calculateStabilityIndex(stabilityData: StabilityData): number {
    return stabilityData.maxGz / stabilityData.gm;
  }

  /**
   * Calculate safety margin
   */
  private static calculateSafetyMargin(stabilityData: StabilityData): number {
    return (stabilityData.maxGzAngle - stabilityData.vanishingAngle) / 2;
  }

  /**
   * Check resonance
   */
  private static checkResonance(rollingPeriod: number, naturalPeriod: number): boolean {
    const ratio = rollingPeriod / naturalPeriod;
    return ratio >= 0.8 && ratio <= 1.2;
  }

  /**
   * Calculate stability range
   */
  private static calculateStabilityRange(stabilityData: StabilityData): number {
    return stabilityData.vanishingAngle;
  }

  /**
   * Calculate stability quality
   */
  private static calculateStabilityQuality(stabilityData: StabilityData): number {
    return stabilityData.maxGz / stabilityData.vanishingAngle;
  }

  /**
   * Calculate GM standards
   */
  private static calculateGMStandards(gm: number): number {
    return Math.max(0.15, gm);
  }

  /**
   * Calculate free surface corrections with proper tank geometry
   */
  static calculateFreeSurfaceCorrections(tanks: TankData[]): FreeSurfaceCorrection[] {
    return tanks.map(tank => {
      // Calculate free surface moment using proper tank geometry
      // FSM = ρ × I_t / Δ where I_t is transverse moment of inertia
      
      let freeSurfaceMoment = 0;
      
      if (tank.length && tank.breadth && tank.fillRatio !== undefined) {
        // For rectangular tanks: I_t = L × B³ / 12
        const tankLength = tank.length;
        const tankBreadth = tank.breadth;
        const fillRatio = tank.fillRatio;
        
        // Free surface only exists for partially filled tanks
        if (fillRatio > 0 && fillRatio < 1) {
          const momentOfInertia = (tankLength * Math.pow(tankBreadth, 3)) / 12;
          freeSurfaceMoment = tank.fluidDensity * momentOfInertia;
        }
      } else {
        // Fallback calculation if tank geometry not available
        const estimatedBreadth = Math.pow(tank.currentVolume / 10, 1/3); // Rough estimate
        const momentOfInertia = Math.pow(estimatedBreadth, 4) / 12;
        freeSurfaceMoment = tank.fluidDensity * momentOfInertia;
      }
      
      // Free surface correction to KG
      const correction = freeSurfaceMoment; // This will be divided by displacement later
      const totalFSC = correction;
      
      return {
        tankName: tank.name,
        freeSurfaceMoment,
        correction,
        totalFSC
      };
    });
  }

  /**
   * Calculate free surface corrections (advanced): FSC_i ≈ ρ × i / Δ
   * Since TankData does not include L and B, fall back to provided freeSurfaceEffect as i proxy when available
   */
  static calculateFreeSurfaceCorrectionsAdvanced(
    geometry: ShipGeometry,
    tanks: TankData[]
  ): FreeSurfaceCorrection[] {
    const displacement = this.calculateDisplacement(geometry).displacement; // tonnes
    return tanks.map(tank => {
      // Interpret freeSurfaceEffect as an equivalent moment of inertia surrogate in m^4 when available
      const iProxy = Math.max(0, tank.freeSurfaceEffect || 0);
      const freeSurfaceMoment = iProxy; // proxy units
      const correction = displacement > 0 ? (tank.fluidDensity * iProxy) / displacement : 0; // meters
      const totalFSC = correction; // keep meters as total correction
      return {
        tankName: tank.name,
        freeSurfaceMoment,
        correction,
        totalFSC
      };
    });
  }

  /**
   * Calculate draft survey
   */
  static calculateDraftSurvey(
    forwardDraft: number,
    midshipDraft: number,
    aftDraft: number,
    geometry: ShipGeometry
  ): DraftSurvey {
    const meanDraft = (forwardDraft + 2 * midshipDraft + aftDraft) / 4;
    const trim = aftDraft - forwardDraft;
    const list = 0; // Simplified - would need transverse draft readings
    
    const correctedDraft = meanDraft + this.calculateTrimCorrection(geometry, Math.atan2(trim, geometry.length) * 180 / Math.PI);
    const displacement = this.calculateDisplacement({ ...geometry, draft: correctedDraft }).displacement;
    const tpc = this.calculateHydrostaticCoefficients({ ...geometry, draft: correctedDraft }).tpc;
    const lcf = geometry.length * 0.5; // Simplified LCF
    
    return {
      forwardDraft,
      midshipDraft,
      aftDraft,
      meanDraft,
      trim,
      list,
      correctedDraft,
      displacement,
      tpc,
      lcf
    };
  }

  /**
   * Calculate GZ using KN cross curves if provided, otherwise fallback
   */
  private static calculateGZWithCrossCurves(
    geometry: ShipGeometry,
    kg: number,
    angle: number,
    crossCurves?: CrossCurves
  ): number {
    if (!crossCurves) {
      return this.calculateGZ(geometry, kg, angle);
    }
    // Linear interpolate KN at requested angle
    const { angles, kn } = crossCurves;
    if (angles.length !== kn.length || angles.length === 0) {
      return this.calculateGZ(geometry, kg, angle);
    }
    const clampAngle = Math.max(Math.min(angle, angles[angles.length - 1]), angles[0]);
    // find segment
    let i = 0;
    for (; i < angles.length - 1; i++) {
      if (clampAngle >= angles[i] && clampAngle <= angles[i + 1]) break;
    }
    const a0 = angles[i];
    const a1 = angles[Math.min(i + 1, angles.length - 1)];
    const k0 = kn[i];
    const k1 = kn[Math.min(i + 1, kn.length - 1)];
    const t = a1 === a0 ? 0 : (clampAngle - a0) / (a1 - a0);
    const knInterp = k0 + t * (k1 - k0);
    // GZ = KN - KG * sin(φ)
    const angleRad = (clampAngle * Math.PI) / 180;
    const gz = knInterp - kg * Math.sin(angleRad);
    return Math.max(0, gz);
  }

  /**
   * Recalculate hydrostatic areas using provided Bonjean set if available
   */
  private static buildHydrostaticsWithBonjean(
    geometry: ShipGeometry,
    bonjean?: BonjeanSet
  ): Pick<HydrostaticData, 'bonjeanCurves' | 'sectionalAreas' | 'waterplaneArea' | 'immersedVolume'> {
    if (!bonjean) {
      return {
        bonjeanCurves: this.generateBonjeanCurves(geometry),
        sectionalAreas: this.generateBonjeanCurves(geometry).map(curve => ({
          station: curve.station,
          area: curve.area,
          moment: curve.moment
        })),
        waterplaneArea: this.calculateWaterplaneArea(geometry),
        immersedVolume: this.calculateImmersedVolume(geometry)
      };
    }
    const sectionalAreas: SectionalArea[] = bonjean.sections;
    const immersedVolume = sectionalAreas.reduce((sum, s) => sum + s.area * (bonjean.stationSpacing || geometry.length / Math.max(1, sectionalAreas.length - 1)), 0);
    // Simple proxy for waterplane area from sections near waterline not available; fallback to geometry coefficient
    const waterplaneArea = this.calculateWaterplaneArea(geometry);
    const bonjeanCurves: BonjeanCurve[] = sectionalAreas.map((s) => ({ station: s.station, draft: geometry.draft, area: s.area, moment: s.moment } as unknown as BonjeanCurve));
    return { bonjeanCurves, sectionalAreas, waterplaneArea, immersedVolume };
  }

  /**
   * Perform complete stability analysis (with optional high-fidelity inputs)
   */
  static performStabilityAnalysis(
    geometry: ShipGeometry,
    kg: number,
    weightDistribution: WeightDistribution[],
    tanks: TankData[],
    floodedCompartments: CompartmentAnalysis[] = [],
    grainShiftMoment: number = 0,
    grainHeelAngle: number = 0,
    options?: {
      crossCurves?: CrossCurves;
      bonjean?: BonjeanSet;
    }
  ): StabilityAnalysis {
    const hydrostaticGeom = this.buildHydrostaticsWithBonjean(geometry, options?.bonjean);

    const hydrostatic = {
      displacement: this.calculateDisplacement(geometry).displacement,
      volumeDisplacement: this.calculateDisplacement(geometry).volumeDisplacement,
      waterplaneArea: hydrostaticGeom.waterplaneArea,
      immersedVolume: hydrostaticGeom.immersedVolume,
      bonjeanCurves: hydrostaticGeom.bonjeanCurves,
      sectionalAreas: hydrostaticGeom.sectionalAreas
    };

    const freeSurfaceCorrections = this.calculateFreeSurfaceCorrectionsAdvanced(geometry, tanks);
    const totalFSC = this.calculateTotalFSC(freeSurfaceCorrections);
    const kgCorrected = kg + Math.max(0, totalFSC);
    const centers = this.calculateCenterPoints(geometry, kg);
    const coefficients = this.calculateHydrostaticCoefficients(geometry);

    // If cross curves provided, build stability data using them
    const angles = Array.from({ length: 91 }, (_, i) => i);
    const gzValues = angles.map(a => this.calculateGZWithCrossCurves(geometry, kgCorrected, a, options?.crossCurves));
    const rightingMoments = gzValues.map(gz => gz * this.calculateDisplacement(geometry).displacement * this.GRAVITY);
    let maxGz = 0;
    let maxGzAngle = 0;
    let vanishingAngle = 0;
    gzValues.forEach((gz, idx) => {
      if (gz > maxGz) { maxGz = gz; maxGzAngle = angles[idx]; }
      if (gz <= 0 && vanishingAngle === 0 && angles[idx] > 0) { vanishingAngle = angles[idx]; }
    });
    const stability = options?.crossCurves ? {
      gm: this.calculateCenterPoints(geometry, kgCorrected).gmt,
      gz: gzValues,
      rightingMoment: rightingMoments,
      angles,
      maxGz,
      maxGzAngle,
      vanishingAngle,
      deckEdgeAngle: this.calculateDeckEdgeAngle(geometry),
      downfloodingAngle: this.calculateDownfloodingAngle(geometry),
      equalizedAngle: this.calculateEqualizedAngle(geometry)
    } as StabilityData : this.calculateStabilityData(geometry, kgCorrected);

    const imoCriteria = this.calculateIMOStabilityCriteria(stability);
    const trimList = this.calculateTrimAndList(geometry, weightDistribution, tanks);
    const damageStability = this.calculateDamageStability(geometry, kg, floodedCompartments);
    const grainStability = this.calculateGrainStability(geometry, grainShiftMoment, grainHeelAngle);
    const dynamicStability = this.calculateDynamicStability(geometry, stability, weightDistribution);
    const draftSurvey = this.calculateDraftSurvey(geometry.draft, geometry.draft, geometry.draft, geometry);

    return {
      hydrostatic,
      centers,
      coefficients,
      stability,
      imoCriteria,
      trimList,
      damageStability,
      grainStability,
      dynamicStability,
      weightDistribution,
      tanks,
      freeSurfaceCorrections,
      draftSurvey
    };
  }

  /**
   * Calculate KG from weight distribution (vertical CG)
   */
  static calculateKGFromWeights(weightDistribution: WeightDistribution[]): number {
    const totalWeight = weightDistribution.reduce((sum, w) => sum + w.weight, 0);
    if (totalWeight <= 0) return 0;
    const weightedVCG = weightDistribution.reduce((sum, w) => sum + w.weight * w.vcg, 0);
    return weightedVCG / totalWeight;
  }

  /**
   * Sum total Free Surface Correction (meters)
   */
  static calculateTotalFSC(corrections: FreeSurfaceCorrection[]): number {
    return corrections.reduce((sum, c) => sum + (c.correction || 0), 0);
  }

  /**
   * Correct GM with total FSC
   */
  static calculateCorrectedGM(gm: number, totalFSC: number): number {
    return gm - Math.max(0, totalFSC);
  }

  /**
   * Analyze GZ curve with standard metrics (areas and maxima)
   */
  static analyzeGZCurve(stabilityData: StabilityData): {
    area0to30: number;
    area0to40: number;
    area30to40: number;
    maxGz: number;
    maxGzAngle: number;
    vanishingAngle: number;
  } {
    const area0to30 = this.calculateAreaUnderGZCurve(stabilityData.gz, stabilityData.angles, 0, 30);
    const area0to40 = this.calculateAreaUnderGZCurve(stabilityData.gz, stabilityData.angles, 0, 40);
    const area30to40 = area0to40 - area0to30;
    return {
      area0to30,
      area0to40,
      area30to40,
      maxGz: stabilityData.maxGz,
      maxGzAngle: stabilityData.maxGzAngle,
      vanishingAngle: stabilityData.vanishingAngle
    };
  }

  /**
   * Righting moment curve generator (alias for GZ curve with moments)
   */
  static generateRightingMomentCurve(geometry: ShipGeometry, kg: number, startAngle = 0, endAngle = 90, step = 1): { angle: number; rightingMoment: number }[] {
    return this.generateGZCurve(geometry, kg, startAngle, endAngle, step).map(p => ({ angle: p.angle, rightingMoment: p.rightingMoment }));
  }

  /**
   * Small-angle GZ (φ < 15°): GZ ≈ GM·sinφ
   */
  static calculateSmallAngleGZ(geometry: ShipGeometry, kg: number, angle: number): number {
    const gm = this.calculateCenterPoints(geometry, kg).gm;
    const angleRad = (angle * Math.PI) / 180;
    return Math.max(0, gm * Math.sin(angleRad));
  }

  /**
   * Large-angle GZ (wall-sided approximation)
   */
  static calculateLargeAngleGZ(geometry: ShipGeometry, kg: number, angle: number): number {
    return this.calculateGZ(geometry, kg, angle);
  }

  /**
   * Simulate tank volume changes and return updated tank set and FSC
   */
  static applyTankVolumeChanges(
    geometry: ShipGeometry,
    tanks: TankData[],
    changes: { name: string; deltaVolume: number }[]
  ): { updatedTanks: TankData[]; freeSurfaceCorrections: FreeSurfaceCorrection[]; totalFSC: number } {
    const nameToDelta = new Map<string, number>(changes.map(c => [c.name, c.deltaVolume]));
    const updatedTanks: TankData[] = tanks.map(t => {
      const delta = nameToDelta.get(t.name) || 0;
      const newVolume = Math.max(0, Math.min(t.capacity, t.currentVolume + delta));
      return { ...t, currentVolume: newVolume };
    });
    const fsc = this.calculateFreeSurfaceCorrectionsAdvanced(geometry, updatedTanks);
    const totalFSC = this.calculateTotalFSC(fsc);
    return { updatedTanks, freeSurfaceCorrections: fsc, totalFSC };
  }

  /**
   * Parse Cross Curves (KN) from CSV text: columns: angle,kn
   */
  static parseCrossCurvesCSV(csvText: string): CrossCurves {
    const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
    const angles: number[] = [];
    const kn: number[] = [];
    for (const line of lines) {
      const [a, k] = line.split(/,|;|\s+/).map(x => x.trim());
      const av = parseFloat(a);
      const kv = parseFloat(k);
      if (!Number.isNaN(av) && !Number.isNaN(kv)) {
        angles.push(av);
        kn.push(kv);
      }
    }
    return { angles, kn };
  }

  /**
   * GG1 from a weight shift: GG1 = w · d / Δ
   */
  static calculateGG1(weightTonnes: number, distanceMeters: number, displacementTonnes: number): number {
    if (displacementTonnes <= 0) return 0;
    return (weightTonnes * distanceMeters) / displacementTonnes;
  }

  /**
   * Heel angle from GZ and GM: tan(φ) = GZ / GM
   */
  static calculateHeelAngleFromGZ(gzMeters: number, gmMeters: number): number {
    if (gmMeters === 0) return 0;
    const phiRad = Math.atan(gzMeters / gmMeters);
    return (phiRad * 180) / Math.PI;
  }

  /**
   * Pendulum-based heel angle approximation: tanφ ≈ sinφ = deviation/length
   */
  static calculatePendulumHeelAngle(deviationMeters: number, pendulumLengthMeters: number): number {
    if (pendulumLengthMeters <= 0) return 0;
    const phiRad = Math.atan(deviationMeters / pendulumLengthMeters);
    return (phiRad * 180) / Math.PI;
  }

  /**
   * FSM for a rectangular tank: FSM = (L · B^3 / 12) · ρ
   */
  static calculateFSMRectangularTank(lengthMeters: number, breadthMeters: number, rhoTPerM3: number = this.WATER_DENSITY): number {
    if (lengthMeters <= 0 || breadthMeters <= 0 || rhoTPerM3 <= 0) return 0;
    return (lengthMeters * Math.pow(breadthMeters, 3) / 12) * rhoTPerM3; // tonne·m
  }

  /**
   * ΔKG (free-surface GM reduction) from FSM: ΔKG = FSM / Δ
   */
  static calculateDeltaKGFromFSM(fsmTonneMeter: number, displacementTonnes: number): number {
    if (displacementTonnes <= 0) return 0;
    return fsmTonneMeter / displacementTonnes; // meters
  }

  /**
   * Vertical shift in KG due to lifting with crane/derrick: ΔKG = w · (h_hook − h_load) / Δ
   */
  static calculateCraneDeltaKG(weightTonnes: number, hookHeightMeters: number, loadHeightMeters: number, displacementTonnes: number): number {
    if (displacementTonnes <= 0) return 0;
    return (weightTonnes * (hookHeightMeters - loadHeightMeters)) / displacementTonnes;
  }

  /**
   * Floating dock reaction P (tonnes): P = MCT1cm · Trim(cm) / t (m)
   */
  static calculateDockReactionP(mct1cm_tonMeterPerCm: number, trimCm: number, distanceMeters: number): number {
    if (distanceMeters === 0) return 0;
    return (mct1cm_tonMeterPerCm * trimCm) / distanceMeters; // tonnes
  }

  /**
   * Critical GM in dock: GM_k = (P · KM) / Δ
   */
  static calculateCriticalGMDock(reactionTonnes: number, kmMeters: number, displacementTonnes: number): number {
    if (displacementTonnes <= 0) return 0;
    return (reactionTonnes * kmMeters) / displacementTonnes; // meters
  }

  /**
   * GZ from KN cross curve: GZ = KN − KG · sinφ
   */
  static calculateGZFromKN(knMeters: number, kgMeters: number, angleDeg: number): number {
    const rad = (angleDeg * Math.PI) / 180;
    const gz = knMeters - kgMeters * Math.sin(rad);
    return Math.max(0, gz);
  }

  /**
   * Simplified roll period: T = C(cb) · B / sqrt(GM)
   * C(cb) is approximated as ~0.7 for typical cargo ships and adjusted slightly by Cb.
   */
  static calculateRollPeriodSimplified(cb: number, breadthMeters: number, gmMeters: number): number {
    if (gmMeters <= 0 || breadthMeters <= 0) return 0;
    // Approximate C from block coefficient: clamp between 0.6 and 0.8
    const c = Math.max(0.6, Math.min(0.8, 0.7 + 0.1 * (cb - 0.7)));
    return c * breadthMeters / Math.sqrt(gmMeters);
  }

  /**
   * Parse Bonjean from CSV text: columns: station,area,moment (draft assumed current)
   */
  static parseBonjeanCSV(csvText: string, stationSpacing?: number): BonjeanSet {
    const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
    const sections: SectionalArea[] = [];
    for (const line of lines) {
      const [s, a, m] = line.split(/,|;|\s+/).map(x => x.trim());
      const sv = parseFloat(s);
      const av = parseFloat(a);
      const mv = parseFloat(m);
      if (!Number.isNaN(sv) && !Number.isNaN(av)) {
        sections.push({ station: sv, area: av, moment: Number.isNaN(mv) ? 0 : mv });
      }
    }
    return { sections, stationSpacing: stationSpacing || 0 };
  }

  /**
   * Adaptive area under GZ curve (Simpson's rule where applicable)
   */
  static calculateAreaUnderGZCurveAdaptive(gz: number[], angles: number[], startAngle: number, endAngle: number): number {
    const idx = angles.map((a, i) => ({ a, i })).filter(x => x.a >= startAngle && x.a <= endAngle).map(x => x.i);
    if (idx.length < 2) return 0;
    let area = 0;
    const deg2rad = Math.PI / 180;
    // Use Simpson when we have odd number of segments
    const segmentCount = idx.length - 1;
    if (segmentCount >= 2 && segmentCount % 2 === 0) {
      for (let k = 0; k < segmentCount; k += 2) {
        const i0 = idx[k], i1 = idx[k + 1], i2 = idx[k + 2];
        const h = (angles[i2] - angles[i0]) * deg2rad / 2; // two steps -> 2h, but integrate over pair so use h accordingly
        const f0 = gz[i0], f1 = gz[i1], f2 = gz[i2];
        area += (h / 3) * (f0 + 4 * f1 + f2);
      }
    } else {
      for (let k = 0; k < segmentCount; k++) {
        const i0 = idx[k], i1 = idx[k + 1];
        const h = (angles[i1] - angles[i0]) * deg2rad;
        area += ((gz[i0] + gz[i1]) / 2) * h;
      }
    }
    return area;
  }

  /**
   * Iterative trim solution using MTC/TPC re-evaluation until convergence
   */
  static solveTrimIterative(
    geometry: ShipGeometry,
    weightMomentTonMeters: number,
    maxIterations: number = 10,
    toleranceDeg: number = 0.01
  ): { trimAngle: number; iterations: number } {
    let currentGeometry = { ...geometry };
    let lastTrim = 0;
    for (let iter = 1; iter <= maxIterations; iter++) {
      const mct = this.calculateMCT1cm(currentGeometry, 0);
      const trimChange = mct > 0 ? (weightMomentTonMeters / mct) : 0;
      const trimAngle = Math.atan2(trimChange, currentGeometry.length) * 180 / Math.PI;
      currentGeometry = { ...currentGeometry, draft: Math.max(0.1, geometry.draft + trimChange / 2) };
      if (Math.abs(trimAngle - lastTrim) < toleranceDeg) {
        return { trimAngle, iterations: iter };
      }
      lastTrim = trimAngle;
    }
    return { trimAngle: lastTrim, iterations: maxIterations };
  }

  /**
   * FSC from tank geometry (if available)
   */
  static calculateFSCFromTankGeometry(geometry: ShipGeometry, tanks: TankData[]): FreeSurfaceCorrection[] {
    const displacement = this.calculateDisplacement(geometry).displacement; // tonnes
    return tanks.map(t => {
      const L = t.length || 0;
      const B = t.breadth || 0;
      const fill = t.fillRatio ?? (t.capacity > 0 ? t.currentVolume / t.capacity : 0);
      const ixx = L > 0 && B > 0 ? (L * Math.pow(B, 3)) / 12 * Math.max(0, Math.min(1, fill)) : 0; // m^4
      const fsm = (t.fluidDensity || 1.025) * ixx; // tonne·m
      const correction = displacement > 0 ? fsm / displacement : 0; // meters (ΔKG)
      return { tankName: t.name, freeSurfaceMoment: fsm, correction, totalFSC: correction };
    });
  }

  /**
   * IS Code 2008 extended checks
   */
  static evaluateISCodeCriteria(stabilityData: StabilityData): {
    area0to30OK: boolean;
    area0to40OK: boolean;
    area30to40OK: boolean;
    maxGZOK: boolean;
    initialGMOK: boolean;
    phiMaxRangeOK: boolean;
    vanishingAngleOK: boolean;
  } {
    const a0_30 = this.calculateAreaUnderGZCurveAdaptive(stabilityData.gz, stabilityData.angles, 0, 30);
    const a0_40 = this.calculateAreaUnderGZCurveAdaptive(stabilityData.gz, stabilityData.angles, 0, 40);
    const a30_40 = a0_40 - a0_30;
    const maxGZOK = stabilityData.maxGz >= 0.20 && stabilityData.maxGzAngle >= 25 && stabilityData.maxGzAngle <= 35;
    const initialGMOK = stabilityData.gm >= 0.15;
    const phiMaxRangeOK = stabilityData.maxGzAngle >= 25 && stabilityData.maxGzAngle <= 35;
    const vanishingAngleOK = stabilityData.vanishingAngle >= 40;
    return {
      area0to30OK: a0_30 >= 0.055,
      area0to40OK: a0_40 >= 0.090,
      area30to40OK: a30_40 >= 0.030,
      maxGZOK,
      initialGMOK,
      phiMaxRangeOK,
      vanishingAngleOK
    };
  }

  /**
   * Comprehensive weather criterion according to IMO requirements
   */
  static checkWeatherCriterion(
    stabilityData: StabilityData,
    wind: { pressureNPerM2: number; areaM2: number; leverM: number; displacementT: number }
  ): { ok: boolean; phiEq: number; windHeelingArea: number; availableArea: number } {
    const heelingArm = (wind.pressureNPerM2 * wind.areaM2 * wind.leverM) / (wind.displacementT * 1000 * this.GRAVITY); // meters
    
    // Find equilibrium angle where GZ = heelingArm
    let phiEq = 0;
    for (let i = 0; i < stabilityData.angles.length; i++) {
      if (stabilityData.gz[i] >= heelingArm) { 
        phiEq = stabilityData.angles[i]; 
        break; 
      }
    }
    
    // Calculate wind heeling area (area under constant heeling arm)
    const phiEqRad = phiEq * Math.PI / 180;
    const windHeelingArea = heelingArm * phiEqRad;
    
    // Calculate available righting area (area under GZ curve from 0 to φ1)
    // where φ1 = min(φ_deck_edge, φ_downflooding, 50°)
    const phi1 = Math.min(stabilityData.deckEdgeAngle, stabilityData.downfloodingAngle, 50);
    let availableArea = 0;
    const deg2rad = Math.PI / 180;
    
    for (let i = 0; i < stabilityData.angles.length - 1 && stabilityData.angles[i] <= phi1; i++) {
      const a0 = stabilityData.angles[i] * deg2rad;
      const a1 = stabilityData.angles[i + 1] * deg2rad;
      const g0 = stabilityData.gz[i];
      const g1 = stabilityData.gz[i + 1];
      availableArea += ((g0 + g1) / 2) * (a1 - a0);
    }
    
    // Weather criterion check: available area ≥ 1.4 × wind heeling area
    const weatherCriterionRatio = windHeelingArea > 0 ? availableArea / windHeelingArea : 0;
    const ok = weatherCriterionRatio >= 1.4 && phiEq < Math.min(stabilityData.vanishingAngle, phi1);
    
    return { ok, phiEq, windHeelingArea, availableArea };
  }

  /**
   * Calculate parametric rolling susceptibility
   */
  static calculateParametricRolling(
    geometry: ShipGeometry,
    stabilityData: StabilityData,
    waveLength: number,
    waveHeight: number
  ): { susceptible: boolean; resonanceRatio: number; criticalWaveLength: number } {
    // Parametric rolling occurs when wave length ≈ ship length
    // and wave period ≈ rolling period / 2 (parametric resonance)
    
    const rollingPeriod = this.calculateRollingPeriod(geometry, stabilityData.gm);
    const criticalWaveLength = geometry.length; // L ≈ λ for maximum effect
    const waveSpeed = Math.sqrt(this.GRAVITY * waveLength / (2 * Math.PI)); // Deep water wave speed
    const wavePeriod = waveLength / waveSpeed;
    
    // Parametric rolling period = rolling period / 2
    const parametricPeriod = rollingPeriod / 2;
    const resonanceRatio = Math.abs(wavePeriod - parametricPeriod) / parametricPeriod;
    
    // Susceptible if:
    // 1. Wave length close to ship length (0.8L to 1.2L)
    // 2. Wave period close to half rolling period (±20%)
    // 3. Wave height significant relative to ship beam
    const lengthRatio = waveLength / geometry.length;
    const lengthMatch = lengthRatio >= 0.8 && lengthRatio <= 1.2;
    const periodMatch = resonanceRatio <= 0.2;
    const significantWave = waveHeight / geometry.breadth >= 0.1;
    
    const susceptible = lengthMatch && periodMatch && significantWave;
    
    return { susceptible, resonanceRatio, criticalWaveLength };
  }

  /**
   * Calculate optimum trim for minimum resistance
   */
  static calculateOptimumTrim(
    geometry: ShipGeometry,
    speed: number,
    displacement: number
  ): { optimumTrim: number; resistanceReduction: number; recommendedDraft: { forward: number; aft: number } } {
    // Optimum trim calculation based on Froude number and vessel characteristics
    const froudeNumber = speed / Math.sqrt(this.GRAVITY * geometry.length);
    
    // For most cargo vessels, slight stern trim is optimal
    // Optimum trim ≈ 0.5% to 1.0% of LBP for Fn = 0.15-0.25
    let optimumTrimPercent = 0.005; // Default 0.5%
    
    if (froudeNumber > 0.2) {
      optimumTrimPercent = 0.008; // 0.8% for higher speeds
    } else if (froudeNumber < 0.15) {
      optimumTrimPercent = 0.003; // 0.3% for lower speeds
    }
    
    const optimumTrim = geometry.length * optimumTrimPercent; // meters
    
    // Calculate resistance reduction (approximate)
    const baseResistance = Math.pow(froudeNumber, 2) * 100; // Simplified resistance coefficient
    const resistanceReduction = optimumTrim * 0.02; // 2% reduction per meter of optimum trim
    
    // Recommended drafts
    const meanDraft = displacement / (geometry.length * geometry.breadth * geometry.blockCoefficient * this.WATER_DENSITY);
    const forwardDraft = meanDraft - optimumTrim / 2;
    const aftDraft = meanDraft + optimumTrim / 2;
    
    return {
      optimumTrim,
      resistanceReduction,
      recommendedDraft: { forward: forwardDraft, aft: aftDraft }
    };
  }

  /**
   * Calculate bollard pull requirements for towing operations
   */
  static calculateBollardPull(
    geometry: ShipGeometry,
    displacement: number,
    windSpeed: number,
    currentSpeed: number,
    waveHeight: number
  ): { requiredBollardPull: number; safetyFactor: number; recommendedTugPower: number } {
    // Calculate environmental forces
    const windArea = geometry.length * (geometry.depth + 2); // Estimated lateral area
    const windForce = 0.5 * 1.225 * Math.pow(windSpeed, 2) * windArea; // N
    
    const currentArea = geometry.length * geometry.draft; // Underwater lateral area
    const currentForce = 0.5 * this.WATER_DENSITY * 1000 * Math.pow(currentSpeed, 2) * currentArea; // N
    
    const waveForce = 1000 * Math.pow(waveHeight, 2) * geometry.breadth; // Simplified wave force
    
    // Total environmental force
    const totalForce = windForce + currentForce + waveForce;
    
    // Required bollard pull (convert to tonnes)
    const requiredBollardPull = totalForce / (this.GRAVITY * 1000); // tonnes
    
    // Apply safety factor (typically 1.5-2.0)
    const safetyFactor = 1.8;
    const safeBollardPull = requiredBollardPull * safetyFactor;
    
    // Recommended tug power (kW) - approximate relationship
    const recommendedTugPower = safeBollardPull * 75; // kW (rule of thumb: 75 kW per tonne BP)
    
    return {
      requiredBollardPull: safeBollardPull,
      safetyFactor,
      recommendedTugPower
    };
  }

  /**
   * Calculate stability during cargo operations (loading/discharging)
   */
  static calculateCargoOperationStability(
    geometry: ShipGeometry,
    initialKG: number,
    cargoOperations: Array<{ weight: number; kg: number; operation: 'load' | 'discharge' }>
  ): { 
    stages: Array<{ stage: number; displacement: number; kg: number; gm: number; stable: boolean }>; 
    minimumGM: number;
    criticalStage: number;
  } {
    const stages: Array<{ stage: number; displacement: number; kg: number; gm: number; stable: boolean }> = [];
    let currentDisplacement = this.calculateDisplacement(geometry).displacement;
    let currentKG = initialKG;
    let minimumGM = Infinity;
    let criticalStage = -1;
    
    // Initial condition
    const initialGM = this.calculateCenterPoints(geometry, initialKG).gmt;
    stages.push({
      stage: 0,
      displacement: currentDisplacement,
      kg: currentKG,
      gm: initialGM,
      stable: initialGM > 0.15
    });
    
    if (initialGM < minimumGM) {
      minimumGM = initialGM;
      criticalStage = 0;
    }
    
    // Calculate each operation stage
    for (let i = 0; i < cargoOperations.length; i++) {
      const operation = cargoOperations[i];
      const weightChange = operation.operation === 'load' ? operation.weight : -operation.weight;
      
      // Calculate new KG using moment balance
      const totalMoment = currentDisplacement * currentKG + weightChange * operation.kg;
      const newDisplacement = currentDisplacement + weightChange;
      const newKG = totalMoment / newDisplacement;
      
      // Calculate new GM
      const newGeometry = { 
        ...geometry, 
        draft: newDisplacement / (geometry.length * geometry.breadth * geometry.blockCoefficient * this.WATER_DENSITY)
      };
      const newGM = this.calculateCenterPoints(newGeometry, newKG).gmt;
      
      stages.push({
        stage: i + 1,
        displacement: newDisplacement,
        kg: newKG,
        gm: newGM,
        stable: newGM > 0.15
      });
      
      if (newGM < minimumGM) {
        minimumGM = newGM;
        criticalStage = i + 1;
      }
      
      currentDisplacement = newDisplacement;
      currentKG = newKG;
    }
    
    return { stages, minimumGM, criticalStage };
  }
}