import React, { useEffect, useMemo, useState } from "react";
// @ts-ignore - isolatedModules quirk in some envs
import { useNavigate } from "react-router-dom";
import { Moon as MoonIcon, ChevronRight } from "lucide-react";

type Phase = {
  key: string;
  name: string;
  emoji: string;
};

const PHASES: Phase[] = [
  { key: "new", name: "Yeni Ay", emoji: "🌑" },
  { key: "waxing_crescent", name: "Hilal", emoji: "🌒" },
  { key: "first_quarter", name: "İlk Dördün", emoji: "🌓" },
  { key: "waxing_gibbous", name: "Şişkin Ay", emoji: "🌔" },
  { key: "full", name: "Dolunay", emoji: "🌕" },
  { key: "waning_gibbous", name: "Küçülen Ay", emoji: "🌖" },
  { key: "last_quarter", name: "Son Dördün", emoji: "🌗" },
  { key: "waning_crescent", name: "Son Hilal", emoji: "🌘" },
];

const LUNAR_CYCLE_DAYS = 29.53058867;

function calculatePhaseFraction(date: Date): number {
  const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14));
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSinceKnownNewMoon = (date.getTime() - knownNewMoon.getTime()) / msPerDay;
  const phaseDays = ((daysSinceKnownNewMoon % LUNAR_CYCLE_DAYS) + LUNAR_CYCLE_DAYS) % LUNAR_CYCLE_DAYS;
  return phaseDays / LUNAR_CYCLE_DAYS; // 0..1
}

function mapFractionToPhaseIndex(fraction: number): number {
  // Thresholds centered between canonical 8 phases
  const thresholds = [
    0.0625, 0.1875, 0.3125, 0.4375, 0.5625, 0.6875, 0.8125, 0.9375, 1.0,
  ];
  for (let i = 0; i < thresholds.length; i++) {
    if (fraction < thresholds[i]) return i;
  }
  return 0;
}

function getNextBoundaryFraction(fraction: number): number {
  const boundaries = [
    0.0625, 0.1875, 0.3125, 0.4375, 0.5625, 0.6875, 0.8125, 0.9375, 1.0,
  ];
  for (const b of boundaries) {
    if (fraction < b) return b;
  }
  return 1.0;
}

function formatEtaDays(hoursFloat: number): string {
  const totalMinutes = Math.max(0, Math.round(hoursFloat * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  if (days >= 2) return `${days} gün`;
  if (days === 1) return `1 gün ${hours} sa`;
  if (hours >= 1) return `${hours} sa ${minutes} dk`;
  return `${minutes} dk`;
}

export default function MoonPhaseWidget() {
  const navigate = useNavigate();
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const { fraction, phaseIndex, nextEtaText } = useMemo(() => {
    const f = calculatePhaseFraction(now);
    const idx = mapFractionToPhaseIndex(f);
    const nextBoundary = getNextBoundaryFraction(f);
    const remainingFraction = (nextBoundary - f + 1) % 1; // 0..1
    const remainingHours = remainingFraction * LUNAR_CYCLE_DAYS * 24;
    return {
      fraction: f,
      phaseIndex: idx,
      nextEtaText: formatEtaDays(remainingHours),
    } as const;
  }, [now]);

  const percentage = Math.round(fraction * 100);

  return (
    <div
      className="glass-widget glass-widget-hover col-span-2 relative overflow-hidden rounded-xl p-5 shadow-lg cursor-pointer group"
      onClick={() => navigate("/moon-phases")}
      title="Ay Fazları"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MoonIcon className="h-6 w-6 text-indigo-400 drop-shadow-sm" />
            <div className="text-sm font-medium text-muted-foreground">Ay Fazları</div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground/70 group-hover:text-foreground transition-colors" />
        </div>

        <div className="flex items-center justify-between gap-2">
          {PHASES.map((p, i) => {
            const isActive = i === phaseIndex;
            return (
              <div key={p.key} className="flex flex-col items-center gap-1">
                <div
                  className={
                    "text-xl sm:text-2xl transition-transform " +
                    (isActive ? "scale-110" : "opacity-70")
                  }
                >
                  {p.emoji}
                </div>
                <div
                  className={
                    "text-[10px] sm:text-xs font-medium " +
                    (isActive ? "text-foreground" : "text-muted-foreground")
                  }
                >
                  {p.name}
                </div>
                {isActive ? (
                  <div className="h-1 w-6 rounded-full bg-primary/70" />
                ) : (
                  <div className="h-1 w-6 rounded-full bg-transparent" />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mevcut evre: <span className="font-semibold text-foreground">{PHASES[phaseIndex].name}</span>
          </div>
          <div className="text-xs text-muted-foreground">Döngü %{percentage}</div>
        </div>

        <div className="w-full bg-white/10 dark:bg-white/10 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-400 to-purple-500 h-full rounded-full transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="text-xs text-muted-foreground">
          Sonraki evreye: <span className="font-medium text-foreground">{nextEtaText}</span>
        </div>
      </div>
    </div>
  );
}
