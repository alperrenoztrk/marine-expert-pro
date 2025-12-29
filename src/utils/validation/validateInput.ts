import type { InputConstraint } from "./inputConstraints";
import { validateRange, validateUnit } from "./validationHelpers";

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
  const unitError = validateUnit(rawValue, {
    label: constraint.label,
    unit: constraint.unit,
    example: `${constraint.min}`
  });
  if (unitError) {
    return { value: null, error: unitError };
  }
  const numeric = Number(rawValue);
  if (Number.isNaN(numeric)) {
    return { value: null, error: `${constraint.label} sayısal olmalıdır.` };
  }
  const rangeError = validateRange(numeric, {
    label: constraint.label,
    unit: constraint.unit,
    min: constraint.min,
    max: constraint.max,
    example: `${constraint.min}`
  });
  if (rangeError) {
    return { value: numeric, error: rangeError };
  }
  return { value: numeric };
}

export function formatConstraintHint(constraint: InputConstraint): string {
  return `${constraint.label} · ${constraint.min}–${constraint.max} ${constraint.unit}`;
}
