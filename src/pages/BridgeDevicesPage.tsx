import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { bridgeDevices } from "@/data/bridgeDevices";
import { ArrowLeft, ChevronRight } from "lucide-react";

export default function BridgeDevicesPage() {
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
          <h1 className="text-2xl font-bold text-foreground">Köprüüstü Aygıtları</h1>
          <p className="text-xs text-muted-foreground">
            VHF, DSC, ECDIS, radar, Navtex ve diğer tüm seyir cihazlarını ayrı ayrı açın.
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

        <section className="space-y-4 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {bridgeDevices.map((device) => {
              const DeviceIcon = device.icon;
              return (
                <Link
                  key={device.id}
                  to={`/bridge/${device.id}`}
                  className="group flex h-full flex-col items-start gap-2 rounded-xl border border-border/50 bg-background/70 p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${device.accent} text-white shadow`}
                    >
                      <DeviceIcon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold text-foreground">{device.name}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{device.description}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                    Ayrı modül
                    <ChevronRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

