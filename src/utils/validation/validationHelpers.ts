export type UnitValidationOptions = {
  label: string;
  unit: string;
  example: string;
};

export type RangeValidationOptions = UnitValidationOptions & {
  min: number;
  max: number;
};

export type ConsistencyCheck = {
  ok: boolean;
  message: string;
  example: string;
};

const NON_NUMERIC_PATTERN = /[^0-9,\.\-+]/;

export const validateUnit = (rawValue: string, options: UnitValidationOptions): string | null => {
  if (!rawValue || rawValue.trim().length === 0) {
    return null;
  }
  if (NON_NUMERIC_PATTERN.test(rawValue)) {
    return `${options.label} için yalnızca sayısal değer girin. Birim etiketi ayrı gösterilir. Doğru kullanım: ${options.example} ${options.unit}.`;
  }
  return null;
};

export const validateRange = (value: number, options: RangeValidationOptions): string | null => {
  if (value < options.min || value > options.max) {
    return `${options.label} değeri ${options.min}–${options.max} ${options.unit} aralığında olmalıdır. Doğru kullanım: ${options.example} ${options.unit}.`;
  }
  return null;
};

export const validateConsistency = (checks: ConsistencyCheck[]): string[] =>
  checks.filter((check) => !check.ok).map((check) => `${check.message} Örnek: ${check.example}.`);
