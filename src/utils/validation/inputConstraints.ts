export type InputConstraint = {
  label: string;
  unit: string;
  min: number;
  max: number;
  required?: boolean;
  stepHint?: string;
};

export type ConstraintGroup = Record<string, InputConstraint>;

export const stabilityInputConstraints: Record<string, ConstraintGroup> = {
  geometry: {
    length: { label: "Gemi Boyu (L)", unit: "m", min: 10, max: 450, required: true },
    breadth: { label: "Gemi En (B)", unit: "m", min: 2, max: 80, required: true },
    depth: { label: "Derinlik (D)", unit: "m", min: 2, max: 60, required: true },
    draft: { label: "Su Çekimi (T)", unit: "m", min: 0.5, max: 35, required: true },
    blockCoefficient: { label: "Blok Katsayısı (Cb)", unit: "-", min: 0.45, max: 0.95, required: true },
    waterplaneCoefficient: { label: "Su Hattı Katsayısı (Cw)", unit: "-", min: 0.5, max: 0.98, required: true },
    midshipCoefficient: { label: "Orta Kesit Katsayısı (Cm)", unit: "-", min: 0.6, max: 0.99, required: true },
    prismaticCoefficient: { label: "Prizmatik Katsayı (Cp)", unit: "-", min: 0.5, max: 0.85, required: true },
    verticalPrismaticCoefficient: { label: "Düşey Prizmatik Katsayı (Cvp)", unit: "-", min: 0.5, max: 0.95, required: true }
  },
  gmCalculation: {
    kb: { label: "KB", unit: "m", min: 0, max: 20, required: true },
    bm: { label: "BM", unit: "m", min: 0, max: 30, required: true },
    kg: { label: "KG", unit: "m", min: 0, max: 30, required: true }
  },
  gzCalculation: {
    gm: { label: "GM", unit: "m", min: 0, max: 15, required: true },
    angle: { label: "Yatma Açısı", unit: "°", min: 0, max: 90, required: true }
  },
  freeSurface: {
    length: { label: "Tank Boyu (L)", unit: "m", min: 0.5, max: 80, required: true },
    breadth: { label: "Tank Eni (B)", unit: "m", min: 0.5, max: 30, required: true },
    volume: { label: "Hacim (V)", unit: "m³", min: 1, max: 20000, required: true }
  },
  windWeather: {
    windSpeed: { label: "Rüzgar Hızı", unit: "m/s", min: 0, max: 80, required: true },
    pressure: { label: "Rüzgar Basıncı", unit: "N/m²", min: 0, max: 5000, required: true },
    area: { label: "Maruz Alan", unit: "m²", min: 1, max: 50000, required: true },
    lever: { label: "Kaldıraç Kolu", unit: "m", min: 0.5, max: 50, required: true },
    displacement: { label: "Deplasman", unit: "t", min: 10, max: 300000, required: true }
  }
};

export const draftSurveyConstraints: ConstraintGroup = {
  forwardDraft: { label: "Baş Draft", unit: "m", min: 0, max: 25, required: true },
  midshipDraft: { label: "Orta Draft", unit: "m", min: 0, max: 25, required: true },
  aftDraft: { label: "Kıç Draft", unit: "m", min: 0, max: 25, required: true }
};
