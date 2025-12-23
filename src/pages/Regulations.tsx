import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { regulationItems, type RegulationCategory } from "@/data/regulationItems";
import { ArrowLeft, Scale } from "lucide-react";

const Regulations = () => {
  const highRefreshRateStyles: CSSProperties = {
    ["--frame-rate" as string]: "120",
    ["--animation-duration" as string]: "8.33ms",
    ["--transition-duration" as string]: "16.67ms",
  };

  const regulationStyles: Record<RegulationCategory, string> = {
    "IMO Sözleşmeleri": "bg-primary",
    "Emniyet Kodları": "bg-amber-500",
    "Çevresel Düzenlemeler": "bg-emerald-500",
    "Denetim & Sörvey": "bg-sky-500",
    "Gemi Sertifikaları": "bg-violet-500",
    "Bölgesel Düzenlemeler": "bg-rose-500",
  };

  const regulationCards: { category: RegulationCategory; title: string }[] = [
    { category: "IMO Sözleşmeleri", title: "🌐 IMO Sözleşmeleri" },
    { category: "Emniyet Kodları", title: "🛡️ Emniyet Kodları" },
    { category: "Çevresel Düzenlemeler", title: "🌿 Çevresel Düzenlemeler" },
    { category: "Denetim & Sörvey", title: "🔍 Denetim & Sörvey" },
    { category: "Gemi Sertifikaları", title: "📋 Gemi Sertifikaları" },
    { category: "Bölgesel Düzenlemeler", title: "🗺️ Bölgesel Düzenlemeler" },
  ];

  const getRegulationItemsByCategory = (category: RegulationCategory) =>
    regulationItems.filter((item) => item.category === category);

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
          <div className="flex items-center justify-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Regülasyonlar</h1>
          </div>
          <p className="text-xs text-muted-foreground">Uluslararası ve ulusal denizcilik regülasyonları</p>
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

        <section className="space-y-4 rounded-2xl border border-border/50 bg-card/60 p-4 backdrop-blur-md">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {regulationCards.map((card) => (
              <div key={card.category} className="rounded-xl border border-border/40 bg-background/50 p-4">
                <h2 className="mb-3 font-bold text-foreground">{card.title}</h2>
                <ul className="space-y-2 text-sm text-foreground/90">
                  {getRegulationItemsByCategory(card.category).map((item) => (
                    <li key={item.slug} className="flex items-start gap-2">
                      <span
                        className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${regulationStyles[card.category]}`}
                        aria-hidden
                      />
                      <Link
                        to={`/regulations/${item.slug}`}
                        className="font-semibold text-foreground transition hover:text-primary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Regulations;
