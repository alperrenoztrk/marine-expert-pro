import React from "react";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculationCard } from "@/components/ui/calculation-card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Calculator } from "lucide-react";

export type FormulaAccent = "blue" | "green" | "orange" | "red" | "purple" | "teal" | "slate";

export interface FormulaLine {
  label?: string;
  formula: string;
}

export interface FormulaSection {
  title: string;
  accent?: FormulaAccent;
  lines: FormulaLine[];
}

interface FormulaCardProps {
  title?: string;
  description?: string;
  sections: FormulaSection[];
  symbolsNote?: React.ReactNode;
  className?: string;
}

const accentTextClass: Record<FormulaAccent, string> = {
  blue: "text-blue-700 dark:text-blue-300",
  green: "text-green-700 dark:text-green-300",
  orange: "text-orange-700 dark:text-orange-300",
  red: "text-red-700 dark:text-red-300",
  purple: "text-purple-700 dark:text-purple-300",
  teal: "text-teal-700 dark:text-teal-300",
  slate: "text-slate-700 dark:text-slate-300",
};

export function FormulaCard({
  title = "Formüller",
  description,
  sections,
  symbolsNote,
  className,
}: FormulaCardProps) {
  return (
    <CalculationCard className={cn("h-fit", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          {title}
        </CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>

      <CardContent className="space-y-4">
        {sections.map((section, idx) => (
          <div key={`${section.title}-${idx}`} className="space-y-2">
            <h4
              className={cn(
                "font-semibold text-sm",
                accentTextClass[section.accent ?? "blue"]
              )}
            >
              {section.title}
            </h4>
            <div className="space-y-1 text-xs">
              {section.lines.map((line, lineIdx) => (
                <div key={`${line.formula}-${lineIdx}`} className="space-y-1">
                  {line.label ? <p className="font-medium">{line.label}</p> : null}
                  <p className="font-mono bg-muted/40 dark:bg-white/5 p-1.5 rounded">
                    {line.formula}
                  </p>
                </div>
              ))}
            </div>
            {idx < sections.length - 1 ? <Separator /> : null}
          </div>
        ))}

        {symbolsNote ? (
          <div className="mt-2 p-3 rounded-lg bg-sky-50/70 dark:bg-sky-900/15 border border-sky-200/50 dark:border-sky-500/20">
            <div className="text-xs text-sky-800 dark:text-sky-200">{symbolsNote}</div>
          </div>
        ) : null}
      </CardContent>
    </CalculationCard>
  );
}

