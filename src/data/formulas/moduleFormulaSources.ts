import stabilityFormulas from "@/data/formulas/stability.json";
import hydrostaticsFormulas from "@/data/formulas/hydrostatics.json";

export const moduleFormulaSources = {
  stability: stabilityFormulas,
  hydrostatics: hydrostaticsFormulas,
} as const;

export type FormulaModuleId = keyof typeof moduleFormulaSources;
