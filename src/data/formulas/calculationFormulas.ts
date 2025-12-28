export type CalculationFormulaMeta = {
  formula: string;
  sourceLabel: string;
  sourceUrl: string;
};

export const calculationFormulas: Record<string, CalculationFormulaMeta> = {
  "grain": {
    formula: "Tahıl stabilitesi: GHM = Δ · GM · tanφ (SOLAS Ch. VI yaklaşımı)",
    sourceLabel: "SOLAS Ch. VI / Grain Code",
    sourceUrl: "https://www.imo.org/en/OurWork/Safety/Pages/GrainSafety.aspx"
  },
  "gz-curve": {
    formula: "GZ(φ) = KN(φ) − KG · sinφ, küçük açılar için GZ ≈ GM · sinφ",
    sourceLabel: "IMO Intact Stability Code (MSC.267(85))",
    sourceUrl: "https://www.imo.org/en/OurWork/Safety/Pages/IntactStabilityCode.aspx"
  },
  "free-surface": {
    formula: "FSM = (L · B³ · ρ) / 12, ΔKG = FSM / Δ",
    sourceLabel: "IMO Intact Stability Code (FSM Appendix)",
    sourceUrl: "https://www.imo.org/en/OurWork/Safety/Pages/IntactStabilityCode.aspx"
  },
  "wind-weather": {
    formula: "M_wind = 0.5 · ρ_air · v² · A · h, tanφ = M_wind / (Δ · g · GM)",
    sourceLabel: "IMO Weather Criterion",
    sourceUrl: "https://www.imo.org/en/OurWork/Safety/Pages/IntactStabilityCode.aspx"
  },
  "imo-criteria": {
    formula: "Alan(0–30°) ≥ 0.055 m·rad, Alan(0–40°) ≥ 0.090 m·rad, Max GZ ≥ 0.20 m",
    sourceLabel: "IMO Intact Stability Code (MSC.267(85))",
    sourceUrl: "https://www.imo.org/en/OurWork/Safety/Pages/IntactStabilityCode.aspx"
  },
  "shear-bending": {
    formula: "Shear/Bending: ΣW = 0, ΣM = 0 ve kesit boyunca kümülatif yük yaklaşımı",
    sourceLabel: "Klasik Gemi Yapı Mukavemeti Referansı",
    sourceUrl: "https://www.imo.org/en/OurWork/Safety/Pages/ShipDesignConstruction.aspx"
  }
};
