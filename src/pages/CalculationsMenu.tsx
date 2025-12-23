import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import {
  BookOpen,
  ChevronRight,
  ClipboardList,
  Scale
} from "lucide-react";

export default function CalculationsMenu() {
  const highRefreshRateStyles: CSSProperties = {
    // Ensure the calculations menu animates at 120Hz for ultra-smooth interactions
    ['--frame-rate' as string]: "120",
    ['--animation-duration' as string]: "8.33ms",
    ['--transition-duration' as string]: "16.67ms"
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 px-4 py-8 dark:from-[hsl(220,50%,6%)] dark:via-[hsl(220,50%,8%)] dark:to-[hsl(220,50%,10%)]"
      data-no-translate
      style={highRefreshRateStyles}
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-10 right-10 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6">
        {/* Header */}
        <header className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground backdrop-blur">
            Hesaplama Merkezi
          </div>
        </header>

        <div className="flex flex-col gap-4">
          <Link
            to="/lessons"
            className="group inline-flex items-center justify-center gap-2 self-center rounded-full border border-border/60 bg-card/80 px-5 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:bg-card"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white shadow group-hover:scale-105">
              <BookOpen className="h-4 w-4" />
            </span>
            <span>Dersler</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>

          <Link
            to="/crew"
            className="group inline-flex items-center justify-center gap-2 self-center rounded-full border border-border/60 bg-card/80 px-5 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:bg-card"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 text-white shadow group-hover:scale-105">
              👥
            </span>
            <span>Gemi Personeli</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>

          <Link
            to="/bridge"
            className="group inline-flex items-center justify-center gap-2 self-center rounded-full border border-border/60 bg-card/80 px-5 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:bg-card"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500 text-white shadow group-hover:scale-105">
              📡
            </span>
            <span>Köprüüstü Aygıtları</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>

          <Link
            to="/machinery"
            className="group inline-flex items-center justify-center gap-2 self-center rounded-full border border-border/60 bg-card/80 px-5 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:bg-card"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-600 via-orange-500 to-yellow-500 text-white shadow group-hover:scale-105">
              🛠️
            </span>
            <span>Gemi Makineleri</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>

          <Link
            to="/ship-tasks"
            className="group inline-flex items-center justify-center gap-2 self-center rounded-full border border-border/60 bg-card/80 px-5 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:bg-card"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow group-hover:scale-105">
              <ClipboardList className="h-4 w-4" />
            </span>
            <span>Gemide Yapılan Tüm İşler ve Sorumluları</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>

          <Link
            to="/regulations"
            className="group inline-flex items-center justify-center gap-2 self-center rounded-full border border-border/60 bg-card/80 px-5 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:bg-card"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-500 via-rose-500 to-pink-500 text-white shadow group-hover:scale-105">
              <Scale className="h-4 w-4" />
            </span>
            <span>Regülasyonlar</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

