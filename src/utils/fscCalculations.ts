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
  // IMO/IS Code practice: free surface effects should be accounted for unless tank is effectively pressed up.
  // With a rectangular-tank approximation, Ixx is constant for most fill levels; so we apply FSC for
  // all practical partial-fill conditions and only heavily down-weight it when the tank is near empty/full.
  const nearPressedUp = tank.fillage >= 98;
  const nearEmpty = tank.fillage <= 2;
  const fillageFactor = (nearPressedUp || nearEmpty) ? 0.05 : 1.0;
  const FSC = ((Ixx * tank.density) / displacement) * fillageFactor;
  
  // Criticality is better evaluated relative to GM in analyzeFSC(); here we only flag "safe" when pressed up/empty.
  const criticalityLevel: 'safe' | 'warning' | 'critical' = (nearPressedUp || nearEmpty) ? 'safe' : 'warning';
  
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
    // Simple pressed-up approximation: treat <=2% or >=98% as negligible, otherwise full effect.
    fsc: (fillage <= 2 || fillage >= 98) ? baseFSC * 0.05 : baseFSC,
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
  
  // Re-classify per-tank criticality based on GM impact and contribution
  const resultsWithSeverity: FSCResult[] = results.map((r, idx) => {
    const tank = tanks[idx];
    const nearPressedUp = tank.fillage >= 98;
    const nearEmpty = tank.fillage <= 2;
    if (nearPressedUp || nearEmpty) {
      return { ...r, criticalityLevel: 'safe' };
    }
    const fractionOfGM = initialGM > 0 ? (r.FSC / initialGM) : 1;
    if (correctedGM < 0.15 || fractionOfGM >= 0.25 || r.contribution >= 25) {
      return { ...r, criticalityLevel: 'critical' };
    }
    if (correctedGM < 0.35 || fractionOfGM >= 0.10 || r.contribution >= 15) {
      return { ...r, criticalityLevel: 'warning' };
    }
    return { ...r, criticalityLevel: 'safe' };
  });

  // Find critical tanks
  const criticalTanks = resultsWithSeverity.filter(r => r.criticalityLevel !== 'safe');
  
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
  
  // Tank-specific recommendations (IMO-aligned: aim for pressed-up ~98% or near empty)
  tanks.forEach((tank, index) => {
    const result = resultsWithSeverity[index];
    if (result.criticalityLevel !== 'safe') {
      recommendations.push(
        `"${tank.name}" için serbest yüzey etkisi anlamlı. Tankı mümkünse pressed-up (~%98+) yapın veya mümkünse boşaltın (≤%2). Mevcut doluluk: %${tank.fillage}`
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
