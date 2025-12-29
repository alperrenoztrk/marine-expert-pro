import stabilityFormulas from "@/data/formulas/stability.json";
import hydrostaticsFormulas from "@/data/formulas/hydrostatics.json";

export type CalculationFormulaMeta = {
  title: string;
  formula: string;
  source: string;
  edition: string;
  lastUpdated: string;
  sourceUrl?: string;
};

export const calculationFormulas: Record<string, CalculationFormulaMeta> = {
  ...stabilityFormulas,
  ...hydrostaticsFormulas,
};
