import { HydrostaticCalculations } from "./hydrostaticCalculations";
import {
  BonjeanSet,
  CrossCurves,
  GrainCalculationInputs,
  GrainComputationResult,
  GrainLoadingPlan,
  GrainVesselData,
  ShipGeometry,
} from "@/types/hydrostatic";

/**
 * Grain Stability Service
 * - Aggregates grain cargo loading into weight, LCG/VCG proxies, and heeling arm model
 * - Combines with hydrostatic GZ to produce Net GZ and criteria checks per IMO Grain Code
 */
export class GrainStabilityService {
  private static readonly DEFAULT_CHECK_ANGLES = [5, 10, 12];
  private static readonly DEFAULT_MIN_GM = 0.30; // m

  /** Build displacement and KG if not explicitly provided */
  private static deriveHydrostatics(
    vessel: GrainVesselData,
    inputs?: GrainCalculationInputs,
    bonjean?: BonjeanSet
  ) {
    const geometry: ShipGeometry = vessel.geometry;
    const { displacement } = HydrostaticCalculations.calculateDisplacement(geometry);
    const km = HydrostaticCalculations.calculateCenterPoints(geometry, vessel.VCGm).km;
    const gmInitial = typeof vessel.GMm === "number" ? vessel.GMm : km - vessel.VCGm;

    const fsc = inputs?.freeSurfaceCorrectionM || 0;
    const gmCorrected = gmInitial - Math.max(0, fsc);
    const kg = typeof inputs?.KGm === "number" ? inputs!.KGm : vessel.VCGm;

    // Drafts (approx): keep current geometry.draft; compute simple trim=0
    const draftMean = geometry.draft;
    const draftFwd = draftMean;
    const draftAft = draftMean;

    return { displacement, km, kg, gmInitial, gmCorrected, draftMean, draftFwd, draftAft, trim: 0 };
  }

  /** Estimate grain heeling arm shape using a simple proxy proportional to sin(phi) up to angle of repose */
  private static computeGrainHeelingArm(
    plan: GrainLoadingPlan,
    displacementTonnes: number,
    anglesDeg: number[]
  ): number[] {
    if (displacementTonnes <= 0) return anglesDeg.map(() => 0);

    // Aggregate an effective heeling moment coefficient from holds
    let momentCoeff = 0; // tonne·m per unit sin(phi)
    let breadthGuess = 0;
    for (const hold of plan.holds) {
      const volume = hold.volumeM3 ?? hold.length * hold.width * hold.height;
      const sf = hold.stowageFactorM3PerT ?? hold.cargo.stowageFactorM3PerT;
      const density = hold.cargo.densityTPerM3 || (sf && sf > 0 ? 1 / sf : undefined);
      const angleRepose = Math.max(0, hold.cargo.angleOfReposeDeg);
      const mitigationFactor = 1 - (
        (hold.measures?.shiftingBoard ? 0.25 : 0) +
        (hold.measures?.feeders ? 0.15 : 0) +
        (hold.measures?.saucering ? 0.10 : 0) +
        (hold.measures?.bundlingOrTrimming ? 0.10 : 0)
      );
      const effectiveDensity = density ?? 0.75; // fallback density t/m³
      const tonnes = hold.cargoTonnage ?? (sf && sf > 0 ? volume / sf : volume * effectiveDensity);

      // Simple lever proxy: fraction of breadth; untrimmed/part loads are worse
      const arrangementFactor =
        hold.arrangement === "untrimmed" ? 1.0 : hold.arrangement === "part" ? 0.85 : hold.arrangement === "trimmed" ? 0.6 : 0.7; // full

      // Assume average lever ~ 0.20·B scaled by arrangement and angle of repose ratio
      const angleScale = angleRepose > 0 ? Math.min(1, 12 / angleRepose) : 1;
      const lever = 0.2 * arrangementFactor * angleScale * mitigationFactor; // meters per meter of B -> use via width

      momentCoeff += tonnes * lever; // tonne·m per unit breadth fraction
      breadthGuess = Math.max(breadthGuess, hold.width);
    }
    const breadth = Math.max(0.1, breadthGuess);

    return anglesDeg.map((phi) => {
      const rad = (phi * Math.PI) / 180;
      const momentTonneMeter = momentCoeff * breadth * Math.sin(rad);
      const heelingArm = momentTonneMeter / displacementTonnes; // meters, since ΔKG = M/Δ
      return Math.max(0, heelingArm);
    });
  }

  /** Integrate area between angle range (degrees), gz array in meters; returns m·rad */
  private static integrateArea(angles: number[], values: number[], start: number, end: number): number {
    let area = 0;
    const deg2rad = Math.PI / 180;
    for (let i = 0; i < angles.length - 1; i++) {
      const a0 = angles[i];
      const a1 = angles[i + 1];
      if (a1 < start || a0 > end) continue;
      const s0 = Math.max(start, a0);
      const s1 = Math.min(end, a1);
      if (s1 <= s0) continue;
      const t = (s0 - a0) / (a1 - a0);
      const u = (s1 - a0) / (a1 - a0);
      const v0 = values[i] + t * (values[i + 1] - values[i]);
      const v1 = values[i] + u * (values[i + 1] - values[i]);
      area += ((v0 + v1) / 2) * ((s1 - s0) * deg2rad);
    }
    return area;
  }

  /** Compute Net GZ from hydrostatic GZ and grain heeling arm */
  static compute(
    vessel: GrainVesselData,
    plan: GrainLoadingPlan,
    calcInputs?: GrainCalculationInputs,
    options?: { crossCurves?: CrossCurves; bonjean?: BonjeanSet; angles?: number[] }
  ): GrainComputationResult {
    const angles = options?.angles ?? Array.from({ length: 61 }, (_, i) => i); // 0..60°
    const heelCheck = calcInputs?.heelCheckAnglesDeg ?? this.DEFAULT_CHECK_ANGLES;
    const gmMin = calcInputs?.gmMinRequiredM ?? this.DEFAULT_MIN_GM;

    const { displacement, km, kg, gmInitial, gmCorrected, draftMean, draftFwd, draftAft, trim } = this.deriveHydrostatics(
      vessel,
      calcInputs,
      options?.bonjean
    );

    // Build GZ from either cross curves or fallback model
    const gz = angles.map((phi) => {
      if (options?.crossCurves) {
        const rad = (phi * Math.PI) / 180;
        // Interpolate KN
        const { angles: a, kn } = options.crossCurves;
        let knVal = kn[0];
        for (let i = 0; i < a.length - 1; i++) {
          if (phi >= a[i] && phi <= a[i + 1]) {
            const t = (phi - a[i]) / (a[i + 1] - a[i]);
            knVal = kn[i] + t * (kn[i + 1] - kn[i]);
            break;
          }
        }
        const val = knVal - kg * Math.sin(rad);
        return Math.max(0, val);
      }
      return HydrostaticCalculations.calculateLargeAngleGZ(vessel.geometry, kg, phi);
    });

    // Grain heeling arm
    const heeling = this.computeGrainHeelingArm(plan, displacement, angles);
    const net = gz.map((g, i) => Math.max(0, g - heeling[i]));

    // Equilibrium angle where net ≈ 0 crossing
    let phiEq = 0;
    for (let i = 0; i < angles.length - 1; i++) {
      if (net[i] > 0 && net[i + 1] <= 0) {
        const a0 = angles[i];
        const a1 = angles[i + 1];
        const n0 = net[i];
        const n1 = net[i + 1];
        const t = n0 / (n0 - n1);
        phiEq = a0 + t * (a1 - a0);
        break;
      }
    }

    // Areas under curves
    const areaGZ_0_30 = this.integrateArea(angles, gz, 0, 30);
    const areaGZ_0_40 = this.integrateArea(angles, gz, 0, 40);
    const areaGZ_30_40 = Math.max(0, areaGZ_0_40 - areaGZ_0_30);

    const areaNet_0_30 = this.integrateArea(angles, net, 0, 30);
    const areaNet_0_40 = this.integrateArea(angles, net, 0, 40);
    const areaNet_30_40 = Math.max(0, areaNet_0_40 - areaNet_0_30);

    const areaEqTo40 = phiEq > 0 ? this.integrateArea(angles, net, phiEq, 40) : areaNet_0_40; // residual area beyond equilibrium

    // Max GZ
    let maxGZ = 0;
    let maxGZAngleDeg = 0;
    gz.forEach((v, i) => {
      if (v > maxGZ) {
        maxGZ = v;
        maxGZAngleDeg = angles[i];
      }
    });

    // Criteria (simplified IMO Grain Code checks)
    const criteria = [
      { name: "Initial GM (≥ 0.30 m)", value: gmCorrected, requirement: gmMin, passed: gmCorrected >= gmMin },
      { name: "Area Net 0-30° (≥ 0)", value: areaNet_0_30, requirement: 0, passed: areaNet_0_30 > 0 },
      { name: "Area Net 0-40° (≥ 0.075 m·rad)", value: areaNet_0_40, requirement: 0.075, passed: areaNet_0_40 >= 0.075 },
      { name: "Residual Area φ_eq→40° (≥ 0.040 m·rad)", value: areaEqTo40, requirement: 0.040, passed: areaEqTo40 >= 0.040 },
    ];

    // Check angles table
    const checkAngles = heelCheck.map((a) => {
      // interpolate arrays at angle a
      const lerp = (arr: number[]): number => {
        for (let i = 0; i < angles.length - 1; i++) {
          if (a >= angles[i] && a <= angles[i + 1]) {
            const t = (a - angles[i]) / (angles[i + 1] - angles[i]);
            return arr[i] + t * (arr[i + 1] - arr[i]);
          }
        }
        return arr[arr.length - 1];
      };
      const gzA = lerp(gz);
      const heelA = lerp(heeling);
      const netA = Math.max(0, gzA - heelA);
      return { angle: a, gz: gzA, heeling: heelA, net: netA };
    });

    const compliant = criteria.every((c) => c.passed);

    return {
      angles,
      gz,
      heelingArm: heeling,
      netGZ: net,
      phiEquilibriumDeg: phiEq,
      gmInitialM: gmInitial,
      gmCorrectedM: gmCorrected,
      kmM: km,
      kgM: kg,
      displacementTonnes: displacement,
      draftMeanM: draftMean,
      draftFwdM: draftFwd,
      draftAftM: draftAft,
      trimM: trim,
      maxGZ,
      maxGZAngleDeg,
      areaGZ_0_30,
      areaGZ_0_40,
      areaGZ_30_40,
      areaNet_0_30,
      areaNet_0_40,
      areaNet_30_40,
      residualAreaEq_40: areaEqTo40,
      checkAngles,
      criteria,
      compliant,
    };
  }
}
