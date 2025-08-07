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
  GZCurvePoint
} from '../types/hydrostatic';

export class HydrostaticCalculations {
  private static readonly GRAVITY = 9.81; // m/s²
  private static readonly WATER_DENSITY = 1.025; // t/m³ (seawater)
  private static readonly FRESH_WATER_DENSITY = 1.000; // t/m³

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
    const bm = this.calculateBM(geometry);
    const km = kb + bm;
    const gm = km - kg;
    
    return { lcb, vcb, lcf, vcf, kb, km, bm, kg, gm };
  }

  /**
   * Calculate BM (Metacentric radius)
   */
  private static calculateBM(geometry: ShipGeometry): number {
    const momentOfInertia = (geometry.length * Math.pow(geometry.breadth, 3)) / 12;
    const volumeDisplacement = geometry.length * geometry.breadth * geometry.draft * geometry.blockCoefficient;
    
    return momentOfInertia / volumeDisplacement;
  }

  /**
   * Calculate hydrostatic coefficients (TPC, MTC, LCF, WPA, KB, KM, BM)
   */
  static calculateHydrostaticCoefficients(geometry: ShipGeometry): HydrostaticCoefficients {
    const wpa = this.calculateWaterplaneArea(geometry);
    const tpc = wpa * this.WATER_DENSITY / 100; // TPC in tonnes per cm
    const mtc = this.calculateMTC(geometry);
    const lcf = geometry.length * 0.5; // Simplified LCF
    const kb = geometry.draft * 0.5; // Simplified KB
    const bm = this.calculateBM(geometry);
    const km = kb + bm;
    
    return { tpc, mtc, lcf, wpa, kb, km, bm };
  }

  /**
   * Calculate MTC (Moment to Change Trim)
   */
  private static calculateMTC(geometry: ShipGeometry): number {
    const momentOfInertia = (geometry.breadth * Math.pow(geometry.length, 3)) / 12;
    const volumeDisplacement = geometry.length * geometry.breadth * geometry.draft * geometry.blockCoefficient;
    
    return momentOfInertia / volumeDisplacement;
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
    
    const gm = this.calculateCenterPoints(geometry, kg).gm;
    
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
    const km = this.calculateCenterPoints(geometry, kg).km;
    
    // Simplified GZ calculation using wall-sided formula
    const gz = (km - kg) * Math.sin(angleRad) - 0.5 * geometry.breadth * Math.pow(Math.sin(angleRad), 2);
    
    return Math.max(0, gz); // GZ cannot be negative
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
    
    const trimAngle = Math.atan2(totalMoment, totalWeight * geometry.length) * 180 / Math.PI;
    const trimChange = Math.abs(totalMoment) / this.calculateMTC(geometry);
    const listAngle = this.calculateListAngle(weightDistribution, tanks);
    const listMoment = this.calculateListMoment(weightDistribution, tanks);
    const mct = this.calculateMTC(geometry);
    
    const trimCorrection = this.calculateTrimCorrection(geometry, trimAngle);
    const listCorrection = this.calculateListCorrection(geometry, listAngle);
    const draftCorrection = trimCorrection + listCorrection;
    
    return {
      trimAngle,
      trimChange,
      listAngle,
      listMoment,
      mct,
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
   * Calculate free surface corrections
   */
  static calculateFreeSurfaceCorrections(tanks: TankData[]): FreeSurfaceCorrection[] {
    return tanks.map(tank => {
      const freeSurfaceMoment = tank.currentVolume * Math.pow(tank.tcg, 2);
      const correction = freeSurfaceMoment / this.calculateDisplacement({} as ShipGeometry).displacement;
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
   * Perform complete stability analysis
   */
  static performStabilityAnalysis(
    geometry: ShipGeometry,
    kg: number,
    weightDistribution: WeightDistribution[],
    tanks: TankData[],
    floodedCompartments: CompartmentAnalysis[] = [],
    grainShiftMoment: number = 0,
    grainHeelAngle: number = 0
  ): StabilityAnalysis {
    const hydrostatic = {
      displacement: this.calculateDisplacement(geometry).displacement,
      volumeDisplacement: this.calculateDisplacement(geometry).volumeDisplacement,
      waterplaneArea: this.calculateWaterplaneArea(geometry),
      immersedVolume: this.calculateImmersedVolume(geometry),
      bonjeanCurves: this.generateBonjeanCurves(geometry),
      sectionalAreas: this.generateBonjeanCurves(geometry).map(curve => ({
        station: curve.station,
        area: curve.area,
        moment: curve.moment
      }))
    };

    const centers = this.calculateCenterPoints(geometry, kg);
    const coefficients = this.calculateHydrostaticCoefficients(geometry);
    const stability = this.calculateStabilityData(geometry, kg);
    const imoCriteria = this.calculateIMOStabilityCriteria(stability);
    const trimList = this.calculateTrimAndList(geometry, weightDistribution, tanks);
    const damageStability = this.calculateDamageStability(geometry, kg, floodedCompartments);
    const grainStability = this.calculateGrainStability(geometry, grainShiftMoment, grainHeelAngle);
    const dynamicStability = this.calculateDynamicStability(geometry, stability, weightDistribution);
    const freeSurfaceCorrections = this.calculateFreeSurfaceCorrections(tanks);
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
}