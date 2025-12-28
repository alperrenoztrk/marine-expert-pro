import type { InputConstraint } from "./inputConstraints";

export type ValidationResult = {
  value: number | null;
  error?: string;
};

export function validateNumberInput(rawValue: string, constraint: InputConstraint): ValidationResult {
  if (!rawValue || rawValue.trim().length === 0) {
    return constraint.required
      ? { value: null, error: `${constraint.label} (${constraint.unit}) zorunludur.` }
      : { value: null };
  }
  const numeric = Number(rawValue);
  if (Number.isNaN(numeric)) {
    return { value: null, error: `${constraint.label} sayısal olmalıdır.` };
  }
  if (numeric < constraint.min || numeric > constraint.max) {
    return {
      value: numeric,
      error: `${constraint.label} ${constraint.min}–${constraint.max} ${constraint.unit} aralığında olmalıdır.`
    };
  }
  return { value: numeric };
}

export function formatConstraintHint(constraint: InputConstraint): string {
  return `${constraint.label} · ${constraint.min}–${constraint.max} ${constraint.unit}`;
}
