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
   * Calculate GZ (Righting arm) at given angle
   */
  private static calculateGZ(geometry: ShipGeometry, kg: number, angle: number): number {
    const angleRad = (angle * Math.PI) / 180;
    const km = this.calculateCenterPoints(geometry, kg).kmt; // transverse KM
    
    // Simplified GZ calculation using wall-sided formula
    const gz = (km - kg) * Math.sin(angleRad) - 0.5 * geometry.breadth * Math.pow(Math.sin(angleRad), 2);
    
    return Math.max(0, gz); // GZ cannot be negative
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
   * Calculate downflooding angle
   */
  private static calculateDownfloodingAngle(geometry: ShipGeometry): number {
    // Simplified calculation - typically 15-25 degrees
    return 20;
  }

  /**
   * Calculate equalized angle
   */
  private static calculateEqualizedAngle(geometry: ShipGeometry): number {
    // Simplified calculation
    return 30;
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
   * Calculate weather criterion
   */
  private static calculateWeatherCriterion(stabilityData: StabilityData): number {
    // Simplified weather criterion calculation
    return stabilityData.maxGz * 0.6;
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
   * Calculate new KG after damage
   */
  private static calculateNewKG(originalKG: number, floodedCompartments: CompartmentAnalysis[]): number {
    // Simplified calculation
    const totalFloodedVolume = floodedCompartments.reduce((sum, comp) => sum + comp.floodedVolume, 0);
    const averageFloodedKG = floodedCompartments.reduce((sum, comp) => sum + comp.floodedVolume * comp.newKG, 0) / totalFloodedVolume;
    
    return (originalKG + averageFloodedKG) / 2;
  }

  /**
   * Calculate residual GM
   */
  private static calculateResidualGM(geometry: ShipGeometry, newKG: number, floodedVolume: number): number {
    const km = this.calculateCenterPoints(geometry, newKG).km;
    return km - newKG;
  }

  /**
   * Calculate cross flooding time
   */
  private static calculateCrossFloodingTime(floodedCompartments: CompartmentAnalysis[]): number {
    // Simplified calculation - typically 15-30 minutes
    return 20;
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
   * Calculate grain safety factor
   */
  private static calculateGrainSafetyFactor(grainShiftMoment: number, grainHeelAngle: number): number {
    return grainShiftMoment / (grainHeelAngle * Math.PI / 180);
  }

  /**
   * Calculate grain allowable heel
   */
  private static calculateGrainAllowableHeel(geometry: ShipGeometry): number {
    return 12; // Standard 12 degrees for grain
  }

  /**
   * Calculate grain stability criterion
   */
  private static calculateGrainStabilityCriterion(grainShiftMoment: number, grainAllowableHeel: number): number {
    return grainShiftMoment / grainAllowableHeel;
  }

  /**
   * Check grain compliance
   */
  private static checkGrainCompliance(grainStabilityCriterion: number, grainSafetyFactor: number): boolean {
    return grainStabilityCriterion <= 1.0 && grainSafetyFactor >= 1.0;
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
   * Calculate energy to heel
   */
  private static calculateEnergyToHeel(stabilityData: StabilityData): number {
    return stabilityData.rightingMoment.reduce((sum, moment) => sum + moment, 0);
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
   * Calculate free surface corrections (basic)
   */
  static calculateFreeSurfaceCorrections(tanks: TankData[]): FreeSurfaceCorrection[] {
    return tanks.map(tank => {
      const freeSurfaceMoment = tank.currentVolume * Math.pow(tank.tcg, 2);
      // Legacy simplistic correction; kept for backward compatibility
      const correction = freeSurfaceMoment; // dimensionless placeholder
      const totalFSC = correction * tank.fluidDensity;
      
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
   * Simplified weather criterion: ensure area(GZ > H_wind) up to downflooding exceeds heeling work
   */
  static checkWeatherCriterion(
    stabilityData: StabilityData,
    wind: { pressureNPerM2: number; areaM2: number; leverM: number; displacementT: number }
  ): { ok: boolean; phiEq: number } {
    const heelingArm = (wind.pressureNPerM2 * wind.areaM2 * wind.leverM) / (wind.displacementT * this.GRAVITY); // meters
    // Find equilibrium angle where GZ = heelingArm
    let phiEq = 0;
    for (let i = 0; i < stabilityData.angles.length; i++) {
      if (stabilityData.gz[i] >= heelingArm) { phiEq = stabilityData.angles[i]; break; }
    }
    // Area between 0 and phiEq of (GZ - H)
    let area = 0;
    const deg2rad = Math.PI / 180;
    for (let i = 0; i < stabilityData.angles.length - 1 && stabilityData.angles[i] <= phiEq; i++) {
      const a0 = stabilityData.angles[i] * deg2rad;
      const a1 = stabilityData.angles[i + 1] * deg2rad;
      const g0 = Math.max(0, stabilityData.gz[i] - heelingArm);
      const g1 = Math.max(0, stabilityData.gz[i + 1] - heelingArm);
      area += ((g0 + g1) / 2) * (a1 - a0);
    }
    // Simplified acceptance: positive area and phiEq < vanishing
    return { ok: area > 0 && phiEq < stabilityData.vanishingAngle, phiEq };
  }
}