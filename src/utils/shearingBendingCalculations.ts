export interface PointLoad {
  id: string;
  positionMeters: number; // x from fore (or left support) in meters
  magnitudeKN: number; // positive = downward load (kN)
  label?: string;
}

export interface SFBMSample {
  x: number; // meters
  shearKN: number; // kN
  momentKNm: number; // kN*m
}

export interface Reactions {
  reactionA_KN: number; // kN at x=0 (upward positive)
  reactionB_KN: number; // kN at x=L (upward positive)
}

export function computeUniformDistributedLoadFromGeometry(
  breadthMeters: number,
  draftMeters: number,
  blockCoefficient: number,
  seawaterWeightKNPerM3: number = 10.05
): number {
  // w ≈ ρ_sw * g * (B * T * Cb) [kN/m]
  if (
    !isFinite(breadthMeters) ||
    !isFinite(draftMeters) ||
    !isFinite(blockCoefficient) ||
    breadthMeters <= 0 ||
    draftMeters <= 0 ||
    blockCoefficient <= 0
  ) {
    return 0;
  }
  return seawaterWeightKNPerM3 * breadthMeters * draftMeters * blockCoefficient;
}

export function computeReactions(
  lengthMeters: number,
  uniformLoadKNPerM: number,
  pointLoads: PointLoad[]
): Reactions {
  const L = lengthMeters;
  const w = isFinite(uniformLoadKNPerM) ? uniformLoadKNPerM : 0;
  const totalUniformLoad = w * Math.max(L, 0);
  const totalPointLoads = pointLoads.reduce((sum, p) => sum + (isFinite(p.magnitudeKN) ? p.magnitudeKN : 0), 0);
  const sumMomentsAboutA = (totalUniformLoad * (L / 2)) + pointLoads.reduce((m, p) => m + (p.magnitudeKN * p.positionMeters), 0);
  const reactionB_KN = L > 0 ? sumMomentsAboutA / L : 0;
  const reactionA_KN = totalUniformLoad + totalPointLoads - reactionB_KN;
  return { reactionA_KN, reactionB_KN };
}

export function sampleSFBM(
  lengthMeters: number,
  uniformLoadKNPerM: number,
  pointLoads: PointLoad[],
  samples: number = 201
): { data: SFBMSample[]; reactions: Reactions } {
  const L = Math.max(lengthMeters, 0);
  const w = isFinite(uniformLoadKNPerM) ? uniformLoadKNPerM : 0;
  const loadsSorted = [...pointLoads].sort((a, b) => a.positionMeters - b.positionMeters);
  const reactions = computeReactions(L, w, loadsSorted);

  const data: SFBMSample[] = [];
  for (let i = 0; i < samples; i++) {
    const x = (L * i) / (samples - 1);
    // Shear: V(x) = RA - w*x - sum(Pi for xi <= x)
    let shear = reactions.reactionA_KN - w * x;
    for (const p of loadsSorted) {
      if (p.positionMeters <= x) {
        shear -= p.magnitudeKN;
      } else {
        break;
      }
    }
    // Moment: M(x) = RA*x - (w*x^2)/2 - sum(Pi*(x - xi) for xi <= x)
    let moment = reactions.reactionA_KN * x - (w * x * x) / 2;
    for (const p of loadsSorted) {
      if (p.positionMeters <= x) {
        moment -= p.magnitudeKN * (x - p.positionMeters);
      } else {
        break;
      }
    }
    data.push({ x, shearKN: shear, momentKNm: moment });
  }
  return { data, reactions };
}

export function findCriticals(data: SFBMSample[]) {
  let maxShear = { x: 0, value: 0 };
  let minShear = { x: 0, value: 0 };
  let maxMoment = { x: 0, value: 0 };
  let minMoment = { x: 0, value: 0 };

  for (const d of data) {
    if (d.shearKN > maxShear.value) maxShear = { x: d.x, value: d.shearKN };
    if (d.shearKN < minShear.value) minShear = { x: d.x, value: d.shearKN };
    if (d.momentKNm > maxMoment.value) maxMoment = { x: d.x, value: d.momentKNm };
    if (d.momentKNm < minMoment.value) minMoment = { x: d.x, value: d.momentKNm };
  }

  // zero shear crossing ~ potential peak BM
  let zeroShearAtX: number | null = null;
  for (let i = 1; i < data.length; i++) {
    const prev = data[i - 1].shearKN;
    const curr = data[i].shearKN;
    if ((prev <= 0 && curr >= 0) || (prev >= 0 && curr <= 0)) {
      // linear interpolation
      const x0 = data[i - 1].x;
      const x1 = data[i].x;
      const t = prev === curr ? 0 : prev / (prev - curr);
      zeroShearAtX = x0 + t * (x1 - x0);
      break;
    }
  }

  const maxAbsMoment = Math.abs(maxMoment.value) >= Math.abs(minMoment.value) ? maxMoment : minMoment;
  const maxAbsShear = Math.abs(maxShear.value) >= Math.abs(minShear.value) ? maxShear : minShear;

  return {
    maxShear,
    minShear,
    maxMoment,
    minMoment,
    maxAbsMoment,
    maxAbsShear,
    zeroShearAtX,
  };
}

export function computeStillWaterBMEstimate(data: SFBMSample[], preferMidship: boolean = true): number {
  if (data.length === 0) return 0;
  if (preferMidship) {
    const midIndex = Math.floor(data.length / 2);
    return data[midIndex].momentKNm;
  }
  const { maxAbsMoment } = findCriticals(data);
  return maxAbsMoment.value;
}

export function computeWaveInducedBM(
  lengthMeters: number,
  breadthMeters: number,
  blockCoefficient: number,
  coefficientKNPerM3: number
): number {
  // WIBM ≈ C · L^2 · B · (Cb + 0.7)  [kN·m], when C is in kN/m^3
  if (!isFinite(lengthMeters) || !isFinite(breadthMeters) || !isFinite(blockCoefficient) || !isFinite(coefficientKNPerM3)) {
    return 0;
  }
  return coefficientKNPerM3 * (lengthMeters * lengthMeters) * breadthMeters * (blockCoefficient + 0.7);
}

export function computeBendingStressMPa(maxMomentKNm: number, sectionModulusM3: number): number {
  if (!isFinite(maxMomentKNm) || !isFinite(sectionModulusM3) || sectionModulusM3 <= 0) return 0;
  // sigma = M / Z; with M in kN·m and Z in m^3 -> kN/m^2 = kPa; convert to MPa by /1000
  return (maxMomentKNm / sectionModulusM3) / 1000;
}

export function computeShearStressMPa(maxShearKN: number, shearAreaM2: number): number {
  if (!isFinite(maxShearKN) || !isFinite(shearAreaM2) || shearAreaM2 <= 0) return 0;
  // tau_avg = V / A; with V in kN and A in m^2 -> kN/m^2 = kPa; convert to MPa by /1000
  return (maxShearKN / shearAreaM2) / 1000;
}
