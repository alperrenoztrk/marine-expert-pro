import { moduleFormulaSources } from "@/data/formulas/moduleFormulaSources";

export type CalculationFormulaMeta = {
  title: string;
  formula: string;
  source: string;
  edition: string;
  referenceYear: string;
  lastUpdated: string;
  sourceUrl?: string;
};

export const calculationFormulas: Record<string, CalculationFormulaMeta> = {
  ...moduleFormulaSources.stability,
  ...moduleFormulaSources.hydrostatics,
};
