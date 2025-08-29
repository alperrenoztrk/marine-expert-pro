import { ShipGeometry } from '../types/hydrostatic';
import { HydrostaticCalculations } from './hydrostaticCalculations';

export interface TrimMomentEntry {
  weightTonnes: number; // tonnes
  distanceMeters: number; // meters, positive = forward of CF, negative = aft of CF
  description?: string;
}

export interface LongitudinalInputs {
  geometry: ShipGeometry;
  kg: number; // meters
  xCFfromAft: number; // meters (distance from aft perpendicular to CF)
  initialDraftForward: number; // meters
  initialDraftAft: number; // meters
  moments: TrimMomentEntry[]; // list of trimming moments W * d (ton·m)
}

export interface LongitudinalResults {
  displacementTonnes: number;
  kml: number; // KM_L (m)
  gml: number; // GM_L (m)
  mct1cm: number; // t·m/cm
  totalTrimMoment: number; // t·m
  trimChangeCm: number; // cm, + by stern, − by head
  distribution: {
    aftCm: number; // cm applied at aft draft (signed with trim sign)
    forwardCm: number; // cm applied at forward draft (opposite sign)
    xCFfromAft: number; // m
  };
  newDrafts: {
    forward: number; // m
    aft: number; // m
    mean: number; // m
  };
}

export class LongitudinalStabilityService {
  /**
   * Compute longitudinal GM (GML), MCT(1cm), total trim change, distribution by CF, and new drafts
   * Sign convention: Positive total trim (cm) = trim by stern (aft draft increases)
   */
  static compute(inputs: LongitudinalInputs): LongitudinalResults {
    const { geometry, kg, xCFfromAft, initialDraftForward, initialDraftAft, moments } = inputs;

    // Displacement (tonnes) and centers (includes KML and GML)
    const { displacement } = HydrostaticCalculations.calculateDisplacement(geometry);
    const centers = HydrostaticCalculations.calculateCenterPoints(geometry, kg);
    const kml = centers.kml;
    const gml = centers.gml;

    // MCT 1 cm using Δ and GML
    const length = geometry.length;
    const mct1cm = length > 0 ? (displacement * gml) / (100 * length) : 0;

    // Sum trimming moments (ton·m)
    const totalTrimMoment = moments.reduce((sum, m) => sum + (m.weightTonnes || 0) * (m.distanceMeters || 0), 0);

    // Trim change in cm
    const trimChangeCm = mct1cm !== 0 ? totalTrimMoment / mct1cm : 0;

    // Distribution about CF
    const LBP = geometry.length;
    const xCFA = Math.max(0, Math.min(LBP, xCFfromAft));
    const xCFF = Math.max(0, LBP - xCFA);
    const aftCmUnsigned = Math.abs(trimChangeCm) * (xCFA / LBP);
    const fwdCmUnsigned = Math.abs(trimChangeCm) * (xCFF / LBP);
    const sign = Math.sign(trimChangeCm) || 1; // default positive if zero
    const aftCm = sign * aftCmUnsigned;
    const forwardCm = -sign * fwdCmUnsigned;

    // New drafts (m)
    const newAft = initialDraftAft + aftCm / 100;
    const newFwd = initialDraftForward + forwardCm / 100;
    const mean = (newAft + newFwd) / 2;

    return {
      displacementTonnes: displacement,
      kml,
      gml,
      mct1cm,
      totalTrimMoment,
      trimChangeCm,
      distribution: {
        aftCm,
        forwardCm,
        xCFfromAft: xCFA
      },
      newDrafts: {
        forward: newFwd,
        aft: newAft,
        mean
      }
    };
  }
}

