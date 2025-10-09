/**
 * Free Surface Correction (FSC) Calculation Utilities
 * Serbest Yüzey Düzeltmesi Hesaplama Araçları
 */

export interface TankData {
  id: string;
  name: string;
  length: number; // m
  breadth: number; // m
  height: number; // m
  fillage: number; // % (0-100)
  density: number; // t/m³
  type: 'fuel' | 'ballast' | 'freshwater' | 'cargo' | 'other';
}

export interface FSCResult {
  tankId: string;
  tankName: string;
  Ixx: number; // m⁴
  FSC: number; // m
  contribution: number; // percentage
  criticalityLevel: 'safe' | 'warning' | 'critical';
}

export interface FSCAnalysis {
  totalFSC: number;
  initialGM: number;
  correctedGM: number;
  gmReduction: number;
  gmReductionPercentage: number;
  criticalTanks: FSCResult[];
  recommendations: string[];
  complianceStatus: 'compliant' | 'warning' | 'non-compliant';
}

/**
 * Calculate moment of inertia (Ixx) for a rectangular tank
 * Dikdörtgen tank için atalet momenti hesapla
 */
export function calculateIxx(length: number, breadth: number): number {
  return (length * Math.pow(breadth, 3)) / 12;
}

/**
 * Calculate Free Surface Correction for a single tank
 * Tek tank için Serbest Yüzey Düzeltmesi hesapla
 */
export function calculateSingleTankFSC(
  tank: TankData,
  displacement: number
): FSCResult {
  const Ixx = calculateIxx(tank.length, tank.breadth);
  const FSC = (Ixx * tank.density) / displacement;
  
  // Determine criticality based on fillage
  let criticalityLevel: 'safe' | 'warning' | 'critical' = 'safe';
  if (tank.fillage > 15 && tank.fillage < 85) {
    criticalityLevel = FSC > 0.1 ? 'critical' : 'warning';
  }
  
  return {
    tankId: tank.id,
    tankName: tank.name,
    Ixx,
    FSC,
    contribution: 0, // Will be calculated in comprehensive analysis
    criticalityLevel,
  };
}

/**
 * Calculate total FSC for multiple tanks
 * Çoklu tanklar için toplam FSC hesapla
 */
export function calculateMultipleTanksFSC(
  tanks: TankData[],
  displacement: number
): FSCResult[] {
  const results = tanks.map(tank => 
    calculateSingleTankFSC(tank, displacement)
  );
  
  const totalFSC = results.reduce((sum, result) => sum + result.FSC, 0);
  
  // Calculate contribution percentage for each tank
  return results.map(result => ({
    ...result,
    contribution: totalFSC > 0 ? (result.FSC / totalFSC) * 100 : 0,
  }));
}

/**
 * Analyze fillage effect on FSC
 * Doluluk oranının FSC üzerindeki etkisini analiz et
 */
export function analyzeFillageEffect(
  length: number,
  breadth: number,
  density: number,
  displacement: number
): Array<{ fillage: number; fsc: number }> {
  const fillagePoints = [0, 10, 25, 50, 75, 90, 98, 100];
  const Ixx = calculateIxx(length, breadth);
  const baseFSC = (Ixx * density) / displacement;
  
  return fillagePoints.map(fillage => ({
    fillage,
    fsc: fillage > 5 && fillage < 95 ? baseFSC : baseFSC * 0.1, // Minimal FSC at very low/high fillage
  }));
}

/**
 * Comprehensive FSC analysis with recommendations
 * Önerilerle kapsamlı FSC analizi
 */
export function analyzeFSC(
  tanks: TankData[],
  displacement: number,
  initialGM: number
): FSCAnalysis {
  const results = calculateMultipleTanksFSC(tanks, displacement);
  const totalFSC = results.reduce((sum, result) => sum + result.FSC, 0);
  const correctedGM = initialGM - totalFSC;
  const gmReduction = totalFSC;
  const gmReductionPercentage = (gmReduction / initialGM) * 100;
  
  // Find critical tanks (high FSC contribution and partial fillage)
  const criticalTanks = results.filter(
    result => result.contribution > 15 || result.criticalityLevel === 'critical'
  );
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (correctedGM < 0.15) {
    recommendations.push('🚨 ACİL: Düzeltilmiş GM IMO minimum değerinin (0.15m) altında!');
    recommendations.push('Acil olarak tanklarda düzenleme yapılmalıdır.');
  } else if (correctedGM < 0.35) {
    recommendations.push('⚠️ UYARI: GM değeri düşük seviyede.');
  }
  
  if (gmReductionPercentage > 30) {
    recommendations.push(`FSC, başlangıç GM'nin %${gmReductionPercentage.toFixed(1)}'ünü azaltıyor - bu çok yüksek!`);
  }
  
  // Tank-specific recommendations
  tanks.forEach((tank, index) => {
    const result = results[index];
    if (tank.fillage > 15 && tank.fillage < 85 && result.FSC > 0.05) {
      recommendations.push(
        `"${tank.name}" tankını tamamen doldurun (%98+) veya boşaltın (%10-) - Mevcut doluluk: %${tank.fillage}`
      );
    }
  });
  
  if (criticalTanks.length > 1) {
    recommendations.push(
      `${criticalTanks.length} kritik tank tespit edildi. Bu tanklar toplam FSC'nin büyük kısmını oluşturuyor.`
    );
  }
  
  if (recommendations.length === 0) {
    recommendations.push('✅ FSC değerleri kabul edilebilir seviyede.');
    recommendations.push('Tank doluluk oranları stabil navigasyon için uygun.');
  }
  
  // Determine compliance status
  let complianceStatus: 'compliant' | 'warning' | 'non-compliant';
  if (correctedGM < 0.15) {
    complianceStatus = 'non-compliant';
  } else if (correctedGM < 0.35 || gmReductionPercentage > 25) {
    complianceStatus = 'warning';
  } else {
    complianceStatus = 'compliant';
  }
  
  return {
    totalFSC,
    initialGM,
    correctedGM,
    gmReduction,
    gmReductionPercentage,
    criticalTanks,
    recommendations,
    complianceStatus,
  };
}

/**
 * Get density presets for common tank types
 * Yaygın tank tipleri için yoğunluk ön ayarları
 */
export function getDensityPresets(): Record<string, number> {
  return {
    'Deniz Suyu (Seawater)': 1.025,
    'Tatlı Su (Freshwater)': 1.000,
    'Fuel Oil (HFO)': 0.95,
    'Marine Diesel Oil (MDO)': 0.89,
    'Lubricating Oil': 0.90,
    'Balast (Ballast)': 1.025,
  };
}

/**
 * Calculate optimal fillage to minimize FSC
 * FSC'yi minimize etmek için optimal doluluk hesapla
 */
export function getOptimalFillage(currentFillage: number): { target: number; reason: string } {
  if (currentFillage < 15) {
    return { target: 0, reason: 'Tankı tamamen boşaltın (serbest yüzey etkisini minimize eder)' };
  } else if (currentFillage > 85) {
    return { target: 98, reason: 'Tankı tamamen doldurun (serbest yüzey etkisini minimize eder)' };
  } else {
    // In the critical range
    const distanceToEmpty = currentFillage;
    const distanceToFull = 100 - currentFillage;
    
    if (distanceToEmpty < distanceToFull) {
      return { target: 0, reason: 'Tankı boşaltmak daha yakın - FSC\'yi sıfırlayın' };
    } else {
      return { target: 98, reason: 'Tankı doldurmak daha yakın - FSC\'yi minimize edin' };
    }
  }
}

/**
 * Format FSC value with appropriate precision
 * FSC değerini uygun hassasiyetle formatla
 */
export function formatFSC(fsc: number): string {
  return fsc.toFixed(4);
}

/**
 * Format percentage with appropriate precision
 * Yüzdeyi uygun hassasiyetle formatla
 */
export function formatPercentage(value: number): string {
  return value.toFixed(1);
}
