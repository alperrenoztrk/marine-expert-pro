import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { crewHierarchy } from "@/data/crewHierarchy";
import { ArrowLeft } from "lucide-react";

export default function CrewHierarchyPage() {
  const highRefreshRateStyles: CSSProperties = {
    ["--frame-rate" as string]: "120",
    ["--animation-duration" as string]: "8.33ms",
    ["--transition-duration" as string]: "16.67ms",
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 px-4 py-8 dark:from-[hsl(220,50%,6%)] dark:via-[hsl(220,50%,8%)] dark:to-[hsl(220,50%,10%)]"
      data-no-translate
      style={highRefreshRateStyles}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-10 right-10 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6">
        <header className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground backdrop-blur">
            Hesaplama Merkezi
          </div>
          <h1 className="text-2xl font-bold text-foreground">Gemi Personeli</h1>
          <p className="text-xs text-muted-foreground">
            Köprüüstü, makine ve ikmal departmanlarında görev yapan gemi personelinin hiyerarşik yapısı.
          </p>
          <div className="flex justify-center">
            <Link
              to="/calculations"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2 text-xs font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:bg-card"
            >
              <ArrowLeft className="h-4 w-4" />
              Geri
            </Link>
          </div>
        </header>

        <section className="space-y-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur">
          <div className="grid gap-3 md:grid-cols-2">
            {crewHierarchy.map((group) => (
              <div
                key={group.department}
                className="rounded-xl border border-border/50 bg-gradient-to-br from-white/60 via-card to-slate-50/70 p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:from-background dark:via-card dark:to-slate-900/40"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">{group.department}</h2>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{group.focus}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
                    {group.colorCode}
                  </span>
                </div>

                <div className="space-y-2">
                  {group.roles.map((role) => (
                    <Link
                      key={role.slug}
                      to={`/crew/${role.slug}`}
                      className="group block rounded-lg border border-border/40 bg-background/80 px-3 py-2 text-sm shadow-xs transition hover:border-primary/40 hover:bg-card"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold text-foreground">{role.rank}</div>
                            <span className="text-[10px] uppercase tracking-wide text-primary/80">Görev Detayı</span>
                          </div>
                          <div className="text-xs text-muted-foreground">{role.responsibility}</div>
                        </div>
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-700 transition group-hover:bg-primary/15 group-hover:text-primary dark:bg-slate-800 dark:text-slate-200">
                          {role.reportsTo}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

