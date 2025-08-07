import { ShipGeometry, WeightDistribution, TankData } from '../types/hydrostatic';

export class HydrostaticUtils {
  private static readonly GRAVITY = 9.81; // m/s²
  private static readonly WATER_DENSITY = 1.025; // t/m³ (seawater)
  private static readonly FRESH_WATER_DENSITY = 1.000; // t/m³

  /**
   * Calculate form coefficients
   */
  static calculateFormCoefficients(geometry: ShipGeometry): {
    blockCoefficient: number;
    waterplaneCoefficient: number;
    midshipCoefficient: number;
    prismaticCoefficient: number;
    verticalPrismaticCoefficient: number;
  } {
    const volumeDisplacement = geometry.length * geometry.breadth * geometry.draft * geometry.blockCoefficient;
    const waterplaneArea = geometry.length * geometry.breadth * geometry.waterplaneCoefficient;
    const midshipArea = geometry.breadth * geometry.draft * geometry.midshipCoefficient;

    const blockCoefficient = volumeDisplacement / (geometry.length * geometry.breadth * geometry.draft);
    const waterplaneCoefficient = waterplaneArea / (geometry.length * geometry.breadth);
    const midshipCoefficient = midshipArea / (geometry.breadth * geometry.draft);
    const prismaticCoefficient = volumeDisplacement / (midshipArea * geometry.length);
    const verticalPrismaticCoefficient = volumeDisplacement / (waterplaneArea * geometry.draft);

    return {
      blockCoefficient,
      waterplaneCoefficient,
      midshipCoefficient,
      prismaticCoefficient,
      verticalPrismaticCoefficient
    };
  }

  /**
   * Calculate weight distribution moments
   */
  static calculateWeightMoments(weightDistribution: WeightDistribution[]): {
    totalWeight: number;
    totalLongitudinalMoment: number;
    totalVerticalMoment: number;
    totalTransverseMoment: number;
    lcg: number;
    vcg: number;
    tcg: number;
  } {
    const totalWeight = weightDistribution.reduce((sum, item) => sum + item.weight, 0);
    const totalLongitudinalMoment = weightDistribution.reduce((sum, item) => sum + item.weight * item.lcg, 0);
    const totalVerticalMoment = weightDistribution.reduce((sum, item) => sum + item.weight * item.vcg, 0);
    const totalTransverseMoment = weightDistribution.reduce((sum, item) => sum + item.weight * item.tcg, 0);

    const lcg = totalLongitudinalMoment / totalWeight;
    const vcg = totalVerticalMoment / totalWeight;
    const tcg = totalTransverseMoment / totalWeight;

    return {
      totalWeight,
      totalLongitudinalMoment,
      totalVerticalMoment,
      totalTransverseMoment,
      lcg,
      vcg,
      tcg
    };
  }

  /**
   * Calculate tank effects
   */
  static calculateTankEffects(tanks: TankData[]): {
    totalTankWeight: number;
    totalTankLongitudinalMoment: number;
    totalTankVerticalMoment: number;
    totalTankTransverseMoment: number;
    totalFreeSurfaceEffect: number;
  } {
    const totalTankWeight = tanks.reduce((sum, tank) => sum + tank.currentVolume * tank.fluidDensity, 0);
    const totalTankLongitudinalMoment = tanks.reduce((sum, tank) => sum + tank.currentVolume * tank.fluidDensity * tank.lcg, 0);
    const totalTankVerticalMoment = tanks.reduce((sum, tank) => sum + tank.currentVolume * tank.fluidDensity * tank.vcg, 0);
    const totalTankTransverseMoment = tanks.reduce((sum, tank) => sum + tank.currentVolume * tank.fluidDensity * tank.tcg, 0);
    const totalFreeSurfaceEffect = tanks.reduce((sum, tank) => sum + tank.freeSurfaceEffect, 0);

    return {
      totalTankWeight,
      totalTankLongitudinalMoment,
      totalTankVerticalMoment,
      totalTankTransverseMoment,
      totalFreeSurfaceEffect
    };
  }

  /**
   * Calculate corrected KG with free surface effects
   */
  static calculateCorrectedKG(originalKG: number, freeSurfaceEffects: number[]): number {
    const totalFreeSurfaceEffect = freeSurfaceEffects.reduce((sum, effect) => sum + effect, 0);
    return originalKG + totalFreeSurfaceEffect;
  }

  /**
   * Calculate stability at small angles (φ < 15°)
   */
  static calculateSmallAngleStability(geometry: ShipGeometry, kg: number): {
    gm: number;
    stabilityRange: number;
    naturalPeriod: number;
  } {
    const km = this.calculateKM(geometry);
    const gm = km - kg;
    const stabilityRange = Math.asin(geometry.breadth / (2 * geometry.depth)) * 180 / Math.PI;
    const naturalPeriod = 2 * Math.PI * Math.sqrt(geometry.depth / this.GRAVITY);

    return {
      gm,
      stabilityRange,
      naturalPeriod
    };
  }

  /**
   * Calculate stability at large angles (φ > 15°)
   */
  static calculateLargeAngleStability(geometry: ShipGeometry, kg: number, angle: number): {
    gz: number;
    rightingMoment: number;
    stabilityIndex: number;
  } {
    const angleRad = (angle * Math.PI) / 180;
    const km = this.calculateKM(geometry);
    
    // Wall-sided formula for large angles
    const gz = (km - kg) * Math.sin(angleRad) - 0.5 * geometry.breadth * Math.pow(Math.sin(angleRad), 2);
    const rightingMoment = gz * this.calculateDisplacement(geometry) * this.GRAVITY;
    const stabilityIndex = gz / (km - kg);

    return {
      gz: Math.max(0, gz),
      rightingMoment,
      stabilityIndex
    };
  }

  /**
   * Calculate deck edge immersion angle
   */
  static calculateDeckEdgeImmersion(geometry: ShipGeometry): number {
    return Math.atan2(geometry.breadth / 2, geometry.depth) * 180 / Math.PI;
  }

  /**
   * Calculate area under curve using trapezoidal rule
   */
  static calculateAreaUnderCurve(x: number[], y: number[], startIndex: number, endIndex: number): number {
    let area = 0;
    
    for (let i = startIndex; i < endIndex; i++) {
      const dx = (x[i + 1] - x[i]) * Math.PI / 180; // Convert to radians
      const yAvg = (y[i] + y[i + 1]) / 2;
      area += yAvg * dx;
    }
    
    return area;
  }

  /**
   * Calculate weather criterion according to IMO standards
   */
  static calculateWeatherCriterion(gzCurve: number[], angles: number[]): number {
    // Simplified weather criterion calculation
    const maxGz = Math.max(...gzCurve);
    const maxGzAngle = angles[gzCurve.indexOf(maxGz)];
    
    // Weather criterion is typically 0.6 * maxGz
    return maxGz * 0.6;
  }

  /**
   * Calculate resonance check
   */
  static checkResonance(rollingPeriod: number, naturalPeriod: number): {
    isResonant: boolean;
    ratio: number;
    riskLevel: 'low' | 'medium' | 'high';
  } {
    const ratio = rollingPeriod / naturalPeriod;
    let isResonant = false;
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    if (ratio >= 0.8 && ratio <= 1.2) {
      isResonant = true;
      if (ratio >= 0.9 && ratio <= 1.1) {
        riskLevel = 'high';
      } else {
        riskLevel = 'medium';
      }
    }

    return {
      isResonant,
      ratio,
      riskLevel
    };
  }

  /**
   * Calculate safety margin
   */
  static calculateSafetyMargin(maxGzAngle: number, vanishingAngle: number): {
    margin: number;
    safetyLevel: 'excellent' | 'good' | 'adequate' | 'poor';
  } {
    const margin = maxGzAngle - vanishingAngle;
    let safetyLevel: 'excellent' | 'good' | 'adequate' | 'poor' = 'adequate';

    if (margin >= 60) {
      safetyLevel = 'excellent';
    } else if (margin >= 40) {
      safetyLevel = 'good';
    } else if (margin >= 20) {
      safetyLevel = 'adequate';
    } else {
      safetyLevel = 'poor';
    }

    return {
      margin,
      safetyLevel
    };
  }

  /**
   * Calculate stability quality index
   */
  static calculateStabilityQuality(maxGz: number, vanishingAngle: number, gm: number): {
    quality: number;
    rating: 'excellent' | 'good' | 'adequate' | 'poor';
  } {
    const quality = maxGz / (vanishingAngle * gm);
    let rating: 'excellent' | 'good' | 'adequate' | 'poor' = 'adequate';

    if (quality >= 0.8) {
      rating = 'excellent';
    } else if (quality >= 0.6) {
      rating = 'good';
    } else if (quality >= 0.4) {
      rating = 'adequate';
    } else {
      rating = 'poor';
    }

    return {
      quality,
      rating
    };
  }

  /**
   * Calculate GM standards compliance
   */
  static calculateGMStandards(gm: number): {
    standard: number;
    compliance: boolean;
    margin: number;
  } {
    const standard = Math.max(0.15, gm);
    const compliance = gm >= 0.15;
    const margin = gm - 0.15;

    return {
      standard,
      compliance,
      margin
    };
  }

  /**
   * Calculate energy to heel
   */
  static calculateEnergyToHeel(rightingMoments: number[]): number {
    return rightingMoments.reduce((sum, moment) => sum + moment, 0);
  }

  /**
   * Calculate stability index
   */
  static calculateStabilityIndex(maxGz: number, gm: number): number {
    return maxGz / gm;
  }

  /**
   * Calculate rolling period
   */
  static calculateRollingPeriod(geometry: ShipGeometry, gm: number): number {
    const radiusOfGyration = geometry.breadth / 2;
    return 2 * Math.PI * radiusOfGyration / Math.sqrt(gm * this.GRAVITY);
  }

  /**
   * Calculate natural period
   */
  static calculateNaturalPeriod(geometry: ShipGeometry): number {
    return 2 * Math.PI * Math.sqrt(geometry.depth / this.GRAVITY);
  }

  /**
   * Calculate displacement
   */
  private static calculateDisplacement(geometry: ShipGeometry): number {
    const volumeDisplacement = geometry.length * geometry.breadth * geometry.draft * geometry.blockCoefficient;
    return volumeDisplacement * this.WATER_DENSITY;
  }

  /**
   * Calculate KM
   */
  private static calculateKM(geometry: ShipGeometry): number {
    const kb = geometry.draft * 0.5; // Simplified KB calculation
    const bm = this.calculateBM(geometry);
    return kb + bm;
  }

  /**
   * Calculate BM
   */
  private static calculateBM(geometry: ShipGeometry): number {
    const momentOfInertia = (geometry.length * Math.pow(geometry.breadth, 3)) / 12;
    const volumeDisplacement = geometry.length * geometry.breadth * geometry.draft * geometry.blockCoefficient;
    
    return momentOfInertia / volumeDisplacement;
  }

  /**
   * Convert degrees to radians
   */
  static degreesToRadians(degrees: number): number {
    return degrees * Math.PI / 180;
  }

  /**
   * Convert radians to degrees
   */
  static radiansToDegrees(radians: number): number {
    return radians * 180 / Math.PI;
  }

  /**
   * Round to specified decimal places
   */
  static roundToDecimals(value: number, decimals: number): number {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  /**
   * Format number with units
   */
  static formatWithUnits(value: number, unit: string, decimals: number = 2): string {
    return `${this.roundToDecimals(value, decimals)} ${unit}`;
  }

  /**
   * Validate ship geometry
   */
  static validateShipGeometry(geometry: ShipGeometry): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (geometry.length <= 0) errors.push('Uzunluk pozitif olmalıdır');
    if (geometry.breadth <= 0) errors.push('Genişlik pozitif olmalıdır');
    if (geometry.depth <= 0) errors.push('Derinlik pozitif olmalıdır');
    if (geometry.draft <= 0) errors.push('Draft pozitif olmalıdır');
    if (geometry.draft > geometry.depth) errors.push('Draft derinlikten büyük olamaz');
    if (geometry.blockCoefficient <= 0 || geometry.blockCoefficient > 1) errors.push('Blok katsayısı 0-1 arasında olmalıdır');
    if (geometry.waterplaneCoefficient <= 0 || geometry.waterplaneCoefficient > 1) errors.push('Su hattı katsayısı 0-1 arasında olmalıdır');
    if (geometry.midshipCoefficient <= 0 || geometry.midshipCoefficient > 1) errors.push('Orta kesit katsayısı 0-1 arasında olmalıdır');

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate weight distribution
   */
  static validateWeightDistribution(weightDistribution: WeightDistribution[]): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (weightDistribution.length === 0) {
      errors.push('En az bir ağırlık öğesi olmalıdır');
    }

    weightDistribution.forEach((item, index) => {
      if (item.weight <= 0) errors.push(`${index + 1}. öğe ağırlığı pozitif olmalıdır`);
      if (item.item.trim() === '') errors.push(`${index + 1}. öğe adı boş olamaz`);
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate tank data
   */
  static validateTankData(tanks: TankData[]): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    tanks.forEach((tank, index) => {
      if (tank.capacity <= 0) errors.push(`${index + 1}. tank kapasitesi pozitif olmalıdır`);
      if (tank.currentVolume < 0) errors.push(`${index + 1}. tank hacmi negatif olamaz`);
      if (tank.currentVolume > tank.capacity) errors.push(`${index + 1}. tank hacmi kapasitesini aşamaz`);
      if (tank.fluidDensity <= 0) errors.push(`${index + 1}. tank sıvı yoğunluğu pozitif olmalıdır`);
      if (tank.name.trim() === '') errors.push(`${index + 1}. tank adı boş olamaz`);
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}