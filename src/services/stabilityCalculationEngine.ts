// Comprehensive Ship Stability Calculation Engine
// Based on the detailed specification provided

import {
  VesselData,
  LoadingCase,
  LoadingSummary,
  DraftTrimSolution,
  StabilityCurve,
  StabilityCriteria,
  WindHeeling,
  DamageCase,
  DamageCondition,
  TankState,
  CriteriaResult
} from '../types/vessel';

export class StabilityCalculationEngine {
  private static readonly GRAVITY = 9.81; // m/s²
  private static readonly SEAWATER_DENSITY = 1.025; // t/m³

  /**
   * Main calculation pipeline - performs complete stability analysis
   */
  static performCompleteAnalysis(
    vessel: VesselData,
    loading: LoadingCase,
    criteriaParams?: any
  ) {
    // Step 1: Calculate loading totals
    const loadingSummary = this.computeLoadingTotals(vessel, loading);
    
    // Step 2: Solve draft and trim
    const draftSolution = this.solveDraftAndTrim(
      vessel.hydrostatics,
      loadingSummary.total_displacement,
      loadingSummary.LCG
    );
    
    // Step 3: Apply free surface correction
    const KG_corrected = this.applyFreeSurface(
      loadingSummary.KG,
      loadingSummary.fsm_sum,
      loadingSummary.total_displacement
    );
    
    // Step 4: Compute GM
    const GM_t = this.computeGMt(draftSolution.KMt, KG_corrected);
    
    // Step 5: Compute GZ curve
    const stabilityCurve = this.computeGZCurve(
      vessel.hydrostatics.KN,
      draftSolution.T_mean,
      KG_corrected
    );
    
    // Step 6: Integrate areas and check criteria
    const areas = this.integrateAreas(stabilityCurve.GZ, stabilityCurve.angles);
    const criteriaResults = this.checkCriteria(
      criteriaParams || this.getDefaultCriteria(),
      GM_t,
      stabilityCurve,
      areas,
      vessel.downflooding_angle_deg
    );
    
    return {
      loadingSummary,
      draftSolution,
      KG_corrected,
      GM_t,
      stabilityCurve,
      areas,
      criteriaResults,
      warnings: this.generateWarnings(loadingSummary, GM_t, stabilityCurve, criteriaResults)
    };
  }

  /**
   * Step 1: Compute loading totals
   */
  static computeLoadingTotals(vessel: VesselData, loading: LoadingCase): LoadingSummary {
    // Calculate weights from items
    const itemWeights = loading.items.reduce((sum, item) => sum + item.weight, 0);
    const itemLCG = loading.items.reduce((sum, item) => sum + item.weight * item.lcg, 0) / itemWeights;
    const itemTCG = loading.items.reduce((sum, item) => sum + item.weight * item.tcg, 0) / itemWeights;
    const itemVCG = loading.items.reduce((sum, item) => sum + item.weight * item.vcg, 0) / itemWeights;

    // Calculate tank weights and states
    const tankStates: TankState[] = [];
    let tankWeights = 0;
    let tankLCGMoment = 0;
    let tankTCGMoment = 0;
    let tankVCGMoment = 0;
    let totalFSM = 0;

    for (const tankFilling of loading.tanks) {
      const tankGeometry = vessel.tanks.find(t => t.id === tankFilling.id);
      if (!tankGeometry) continue;

      const fillRatio = tankFilling.fill_percent / 100;
      const tankVolume = tankGeometry.capacity_m3 * fillRatio;
      const tankWeight = tankVolume * tankGeometry.rho;
      
      // Free surface moment from lookup table
      const fsm = this.interpolateFSM(tankGeometry.fsm_table, tankFilling.fill_percent);

      tankStates.push({
        id: tankFilling.id,
        weight: tankWeight,
        lcg: tankGeometry.lcg,
        tcg: tankGeometry.tcg,
        vcg: tankGeometry.vcg,
        fsm: fsm,
        fill_percent: tankFilling.fill_percent
      });

      tankWeights += tankWeight;
      tankLCGMoment += tankWeight * tankGeometry.lcg;
      tankTCGMoment += tankWeight * tankGeometry.tcg;
      tankVCGMoment += tankWeight * tankGeometry.vcg;
      totalFSM += fsm;
    }

    // Total displacement including lightship
    const total_displacement = vessel.lightship.weight + itemWeights + tankWeights;
    
    // Combined centers of gravity
    const totalLCGMoment = vessel.lightship.weight * vessel.lightship.LCG + 
                          loading.items.reduce((sum, item) => sum + item.weight * item.lcg, 0) +
                          tankLCGMoment;
    
    const totalTCGMoment = vessel.lightship.weight * vessel.lightship.TCG +
                          loading.items.reduce((sum, item) => sum + item.weight * item.tcg, 0) +
                          tankTCGMoment;
                          
    const totalVCGMoment = vessel.lightship.weight * vessel.lightship.KG +
                          loading.items.reduce((sum, item) => sum + item.weight * item.vcg, 0) +
                          tankVCGMoment;

    const LCG = totalLCGMoment / total_displacement;
    const TCG = totalTCGMoment / total_displacement;
    const KG = totalVCGMoment / total_displacement;
    const KG_corrected = KG + (totalFSM / total_displacement);

    return {
      total_displacement,
      KG,
      LCG,
      TCG,
      KG_corrected,
      fsm_sum: totalFSM,
      tank_states: tankStates
    };
  }

  /**
   * Step 2: Solve draft and trim
   */
  static solveDraftAndTrim(
    hydrostatics: any,
    targetDisplacement: number,
    LCG: number
  ): DraftTrimSolution {
    // Simple interpolation for target displacement
    const { T_values, Delta, KB, KMt, BMt, LCB, LCF, TPC, MTC } = hydrostatics;
    
    // Find draft that gives target displacement
    const T_mean = this.interpolateArray(Delta, T_values, targetDisplacement);
    
    // Get hydrostatic properties at this draft
    const KB_val = this.interpolateArray(T_values, KB, T_mean);
    const KMt_val = this.interpolateArray(T_values, KMt, T_mean);
    const BMt_val = this.interpolateArray(T_values, BMt || KMt, T_mean); // Use KMt if BMt not available
    const LCB_val = this.interpolateArray(T_values, LCB || Array(T_values.length).fill(0), T_mean);
    const LCF_val = this.interpolateArray(T_values, LCF || Array(T_values.length).fill(0), T_mean);
    const TPC_val = this.interpolateArray(T_values, TPC || Array(T_values.length).fill(0), T_mean);
    const MTC_val = this.interpolateArray(T_values, MTC || Array(T_values.length).fill(0), T_mean);

    // Simple trim calculation
    const trimMoment = targetDisplacement * (LCG - LCB_val);
    const trim = MTC_val > 0 ? trimMoment / MTC_val / 100 : 0; // Convert cm to m
    const trim_angle = Math.atan2(trim, 100) * (180 / Math.PI); // Assuming 100m LBP for angle

    return {
      T_mean,
      T_fwd: T_mean - trim / 2,
      T_aft: T_mean + trim / 2,
      trim,
      trim_angle,
      KB: KB_val,
      KMt: KMt_val,
      BMt: BMt_val,
      LCB: LCB_val,
      LCF: LCF_val,
      TPC: TPC_val,
      MTC: MTC_val
    };
  }

  /**
   * Step 3: Apply free surface correction
   */
  static applyFreeSurface(KG: number, fsm_sum: number, displacement: number): number {
    return KG + (fsm_sum / displacement);
  }

  /**
   * Step 4: Compute GM
   */
  static computeGMt(KMt: number, KG_corrected: number): number {
    return KMt - KG_corrected;
  }

  /**
   * Step 5: Compute GZ curve
   */
  static computeGZCurve(
    KN_table: any,
    draft: number,
    KG_corrected: number,
    angleRange: number[] = Array.from({length: 61}, (_, i) => i) // 0-60 degrees
  ): StabilityCurve {
    const angles = angleRange;
    const GZ: number[] = [];
    const KN: number[] = [];
    const righting_moments: number[] = [];

    // Find the appropriate KN curve for this draft
    const draftKey = this.findClosestDraftKey(KN_table, draft);
    const knValues = KN_table[draftKey] || KN_table[Object.keys(KN_table)[1]]; // Skip phi_deg key

    for (let i = 0; i < angles.length; i++) {
      const angle = angles[i];
      const angleRad = (angle * Math.PI) / 180;
      
      // Interpolate KN value for this angle
      const knValue = this.interpolateArray(KN_table.phi_deg, knValues, angle);
      
      // Calculate GZ = KN - KG_corrected * sin(φ)
      const gzValue = knValue - KG_corrected * Math.sin(angleRad);
      
      KN.push(knValue);
      GZ.push(Math.max(0, gzValue)); // GZ cannot be negative
      righting_moments.push(gzValue * 1000 * this.GRAVITY); // Approximate displacement in kN·m
    }

    // Find maximum GZ and vanishing angle
    let max_GZ = 0;
    let max_GZ_angle = 0;
    let vanishing_angle = 90;

    for (let i = 0; i < GZ.length; i++) {
      if (GZ[i] > max_GZ) {
        max_GZ = GZ[i];
        max_GZ_angle = angles[i];
      }
      if (GZ[i] <= 0.001 && vanishing_angle === 90) {
        vanishing_angle = angles[i];
      }
    }

    return {
      angles,
      GZ,
      KN,
      righting_moments,
      max_GZ,
      max_GZ_angle,
      vanishing_angle
    };
  }

  /**
   * Step 6: Integrate areas under GZ curve
   */
  static integrateAreas(
    GZ: number[],
    angles: number[],
    ranges: Array<[number, number]> = [[0, 30], [0, 40], [30, 40]]
  ) {
    const results: any = {};
    
    for (const [start, end] of ranges) {
      let area = 0;
      
      for (let i = 0; i < angles.length - 1; i++) {
        if (angles[i] >= start && angles[i] <= end) {
          const angleDiff = (angles[i + 1] - angles[i]) * Math.PI / 180; // Convert to radians
          const gzAvg = (GZ[i] + GZ[i + 1]) / 2;
          area += gzAvg * angleDiff;
        }
      }
      
      const key = `A${start}_${end}`;
      results[key] = area;
    }
    
    return results;
  }

  /**
   * Step 7: Check stability criteria
   */
  static checkCriteria(
    params: any,
    GM_t: number,
    stabilityCurve: StabilityCurve,
    areas: any,
    downfloodingAngle: number
  ): StabilityCriteria {
    const criteria: CriteriaResult[] = [];
    
    // IMO criteria checks
    criteria.push({
      name: 'Initial GM',
      value: GM_t,
      requirement: params.min_GM || 0.15,
      passed: GM_t >= (params.min_GM || 0.15),
      critical: true
    });

    criteria.push({
      name: 'Area 0-30°',
      value: areas.A0_30 || 0,
      requirement: params.min_area_0_30 || 0.055,
      passed: (areas.A0_30 || 0) >= (params.min_area_0_30 || 0.055),
      critical: true
    });

    criteria.push({
      name: 'Area 0-40°',
      value: areas.A0_40 || 0,
      requirement: params.min_area_0_40 || 0.090,
      passed: (areas.A0_40 || 0) >= (params.min_area_0_40 || 0.090),
      critical: true
    });

    criteria.push({
      name: 'Area 30-40°',
      value: areas.A30_40 || 0,
      requirement: params.min_area_30_40 || 0.030,
      passed: (areas.A30_40 || 0) >= (params.min_area_30_40 || 0.030),
      critical: true
    });

    criteria.push({
      name: 'Maximum GZ',
      value: stabilityCurve.max_GZ,
      requirement: params.min_max_GZ || 0.20,
      passed: stabilityCurve.max_GZ >= (params.min_max_GZ || 0.20),
      critical: true
    });

    criteria.push({
      name: 'Max GZ at >30°',
      value: stabilityCurve.max_GZ_angle,
      requirement: 30,
      passed: stabilityCurve.max_GZ_angle >= 30,
      critical: false
    });

    return {
      area_0_30: areas.A0_30 || 0,
      area_0_40: areas.A0_40 || 0,
      area_30_40: areas.A30_40 || 0,
      max_GZ: stabilityCurve.max_GZ,
      initial_GM: GM_t,
      compliance: criteria
    };
  }

  /**
   * Generate warnings based on calculation results
   */
  static generateWarnings(
    loading: LoadingSummary,
    GM_t: number,
    stability: StabilityCurve,
    criteria: StabilityCriteria
  ): string[] {
    const warnings: string[] = [];

    if (GM_t <= 0) {
      warnings.push('DANGER: Negative GM - Ship may capsize!');
    } else if (GM_t < 0.15) {
      warnings.push('WARNING: Low GM - Insufficient initial stability');
    }

    if (loading.fsm_sum / loading.total_displacement > 0.2) {
      warnings.push('WARNING: High free surface effect');
    }

    if (stability.vanishing_angle < 60) {
      warnings.push('WARNING: Low vanishing angle - Limited stability range');
    }

    const failedCriteria = criteria.compliance.filter(c => !c.passed && c.critical);
    if (failedCriteria.length > 0) {
      warnings.push(`CRITICAL: ${failedCriteria.length} stability criteria failed`);
    }

    return warnings;
  }

  /**
   * Utility functions
   */
  private static interpolateArray(xArray: number[], yArray: number[], targetX: number): number {
    if (xArray.length !== yArray.length) return 0;
    
    // Handle edge cases
    if (targetX <= xArray[0]) return yArray[0];
    if (targetX >= xArray[xArray.length - 1]) return yArray[yArray.length - 1];
    
    // Find interpolation points
    for (let i = 0; i < xArray.length - 1; i++) {
      if (targetX >= xArray[i] && targetX <= xArray[i + 1]) {
        const ratio = (targetX - xArray[i]) / (xArray[i + 1] - xArray[i]);
        return yArray[i] + ratio * (yArray[i + 1] - yArray[i]);
      }
    }
    
    return 0;
  }

  private static interpolateFSM(fsmTable: number[][], fillPercent: number): number {
    for (let i = 0; i < fsmTable.length - 1; i++) {
      if (fillPercent >= fsmTable[i][0] && fillPercent <= fsmTable[i + 1][0]) {
        const ratio = (fillPercent - fsmTable[i][0]) / (fsmTable[i + 1][0] - fsmTable[i][0]);
        return fsmTable[i][1] + ratio * (fsmTable[i + 1][1] - fsmTable[i][1]);
      }
    }
    return 0;
  }

  private static findClosestDraftKey(knTable: any, targetDraft: number): string {
    const keys = Object.keys(knTable).filter(k => k.startsWith('T='));
    if (keys.length === 0) return '';
    
    let closestKey = keys[0];
    let closestDiff = Math.abs(parseFloat(keys[0].substring(2)) - targetDraft);
    
    for (const key of keys) {
      const draft = parseFloat(key.substring(2));
      const diff = Math.abs(draft - targetDraft);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestKey = key;
      }
    }
    
    return closestKey;
  }

  private static getDefaultCriteria() {
    return {
      min_GM: 0.15,
      min_area_0_30: 0.055,
      min_area_0_40: 0.090,
      min_area_30_40: 0.030,
      min_max_GZ: 0.20
    };
  }

  /**
   * Calculate wind heeling effects
   */
  static calculateWindHeeling(
    windSpeed: number,
    lateralArea: number,
    centerHeight: number,
    displacement: number,
    GM_t: number
  ): WindHeeling {
    const windPressure = 0.5 * 1.225 * windSpeed * windSpeed; // N/m²
    const windForce = windPressure * lateralArea; // N
    const heelingMoment = windForce * centerHeight; // N·m
    const heelingArm = heelingMoment / (displacement * 1000 * this.GRAVITY); // m
    const heelAngle = Math.atan(heelingArm / GM_t) * (180 / Math.PI); // degrees

    return {
      wind_speed: windSpeed,
      heel_angle: heelAngle,
      heeling_arm: heelingArm,
      stability_margin: GM_t - heelingArm
    };
  }

  /**
   * Export calculation results
   */
  static exportResults(results: any, format: 'json' | 'pdf' = 'json') {
    if (format === 'json') {
      return JSON.stringify(results, null, 2);
    }
    // PDF export would be implemented here
    return results;
  }
}