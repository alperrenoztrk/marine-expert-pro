import { calculationFormulas } from "@/data/formulas/calculationFormulas";
import { cn } from "@/lib/utils";

type FormulaReferenceProps = {
  metaId: string;
  className?: string;
};

export function FormulaReference({ metaId, className }: FormulaReferenceProps) {
  const meta = calculationFormulas[metaId];

  if (!meta) {
    return null;
  }

  return (
    <div
      className={cn(
        "mt-4 rounded-lg border border-slate-200/60 bg-white/80 p-3 text-xs text-slate-700 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-200",
        className,
      )}
    >
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Referans</div>
      <div className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">{meta.title}</div>
      <div className="mt-1 text-slate-600 dark:text-slate-300">Formül: {meta.formula}</div>
      <div className="mt-2 text-slate-600 dark:text-slate-300">
        Kaynak: {meta.source} — {meta.edition}
      </div>
      <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
        Son güncelleme: {meta.lastUpdated}
      </div>
    </div>
  );
}
