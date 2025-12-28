import stabilityGolden from "../../data/validation/stability_golden.json";
import { HydrostaticCalculations } from "../../services/hydrostaticCalculations";
import type { ShipGeometry } from "../../types/hydrostatic";

const failures: string[] = [];

const withinTolerance = (actual: number, expected: number, tolerance: number, label: string) => {
  if (Math.abs(actual - expected) > tolerance) {
    failures.push(`${label}: expected ${expected} ± ${tolerance}, got ${actual}`);
  }
};

const scenarios = stabilityGolden.scenarios;
if (scenarios.length < 5 || scenarios.length > 10) {
  failures.push(`Scenario count ${scenarios.length} is outside 5–10 range`);
}

for (const scenario of scenarios) {
  switch (scenario.kind) {
    case "gm_gz": {
      const geometry = scenario.inputs.geometry as ShipGeometry;
      const kg = scenario.inputs.kg as number;
      const angle = scenario.inputs.angleDeg as number;
      const stability = HydrostaticCalculations.calculateStabilityData(geometry, kg);
      const angleIndex = stability.angles.indexOf(angle);
      const gz = angleIndex >= 0 ? stability.gz[angleIndex] : 0;
      withinTolerance(stability.gm, scenario.expected.gm as number, scenario.tolerance.gm as number, `${scenario.id}.gm`);
      withinTolerance(gz, scenario.expected.gz as number, scenario.tolerance.gz as number, `${scenario.id}.gz`);
      withinTolerance(stability.maxGz, scenario.expected.maxGz as number, scenario.tolerance.maxGz as number, `${scenario.id}.maxGz`);
      withinTolerance(stability.maxGzAngle, scenario.expected.maxGzAngle as number, scenario.tolerance.maxGzAngle as number, `${scenario.id}.maxGzAngle`);
      withinTolerance(stability.vanishingAngle, scenario.expected.vanishingAngle as number, scenario.tolerance.vanishingAngle as number, `${scenario.id}.vanishingAngle`);
      break;
    }
    case "fsm": {
      const fsm = HydrostaticCalculations.calculateFSMRectangularTank(
        scenario.inputs.length as number,
        scenario.inputs.breadth as number,
        scenario.inputs.rho as number
      );
      const deltaKg = HydrostaticCalculations.calculateDeltaKGFromFSM(
        fsm,
        scenario.inputs.displacement as number
      );
      withinTolerance(fsm, scenario.expected.fsm as number, scenario.tolerance.fsm as number, `${scenario.id}.fsm`);
      withinTolerance(deltaKg, scenario.expected.deltaKg as number, scenario.tolerance.deltaKg as number, `${scenario.id}.deltaKg`);
      break;
    }
    case "imo": {
      const geometry = scenario.inputs.geometry as ShipGeometry;
      const kg = scenario.inputs.kg as number;
      const stability = HydrostaticCalculations.calculateStabilityData(geometry, kg);
      const criteria = HydrostaticCalculations.calculateIMOStabilityCriteria(stability);
      withinTolerance(criteria.area0to30, scenario.expected.area0to30 as number, scenario.tolerance.area0to30 as number, `${scenario.id}.area0to30`);
      withinTolerance(criteria.area0to40, scenario.expected.area0to40 as number, scenario.tolerance.area0to40 as number, `${scenario.id}.area0to40`);
      withinTolerance(criteria.area30to40, scenario.expected.area30to40 as number, scenario.tolerance.area30to40 as number, `${scenario.id}.area30to40`);
      withinTolerance(criteria.maxGz, scenario.expected.maxGz as number, scenario.tolerance.maxGz as number, `${scenario.id}.maxGz`);
      withinTolerance(criteria.initialGM, scenario.expected.initialGM as number, scenario.tolerance.initialGM as number, `${scenario.id}.initialGM`);
      withinTolerance(criteria.weatherCriterion, scenario.expected.weatherCriterion as number, scenario.tolerance.weatherCriterion as number, `${scenario.id}.weatherCriterion`);
      if (criteria.compliance !== scenario.expected.compliance) {
        failures.push(`${scenario.id}.compliance: expected ${scenario.expected.compliance}, got ${criteria.compliance}`);
      }
      break;
    }
    case "gz_from_kn": {
      const gz = HydrostaticCalculations.calculateGZFromKN(
        scenario.inputs.kn as number,
        scenario.inputs.kg as number,
        scenario.inputs.angleDeg as number
      );
      withinTolerance(gz, scenario.expected.gz as number, scenario.tolerance.gz as number, `${scenario.id}.gz`);
      break;
    }
    default:
      failures.push(`Unknown scenario kind: ${scenario.kind}`);
  }
}

if (failures.length) {
  const message = ["Validation failures:", ...failures.map((failure) => `- ${failure}`)].join("\n");
  throw new Error(message);
}
console.log("Validation scenarios passed.");
