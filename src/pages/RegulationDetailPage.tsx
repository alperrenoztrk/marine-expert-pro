import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";
import { regulationItemMap } from "@/data/regulationItems";

interface ListProps {
  title: string;
  items: string[];
}

const DetailList = ({ title, items }: ListProps) => (
  <div className="space-y-2 rounded-xl border border-border/60 bg-card/70 p-4 shadow-sm">
    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
      <Sparkles className="h-4 w-4 text-primary" />
      <span>{title}</span>
    </div>
    <ul className="space-y-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="text-primary">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default function RegulationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const regulation = slug ? regulationItemMap[slug] : undefined;

  if (!regulation) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 px-4 py-12 text-center dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
        <p className="text-lg font-semibold text-foreground">Regülasyon bilgisi bulunamadı</p>
        <Link to="/calculations" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" />
          Hesaplama Merkezine dön
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 px-4 py-10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/3 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Link
            to="/calculations"
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary transition hover:translate-x-[-2px]"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
            Hesaplama Merkezine dön
          </Link>

          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-500 text-white shadow-lg">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">Regülasyon</p>
              <h1 className="text-3xl font-black text-foreground sm:text-4xl">{regulation.label}</h1>
            </div>
          </div>
          <p className="text-sm text-muted-foreground sm:text-base">{regulation.overview}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <DetailList title="Temel Odak Alanları" items={regulation.essentials} />
          <DetailList title="Kritik Aksiyonlar" items={regulation.actions} />
        </div>

        {regulation.resources && (
          <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 text-sm text-foreground shadow-inner sm:p-6">
            <p className="mb-3 text-base font-semibold text-primary">Kaynaklar ve bağlantılar</p>
            <ul className="space-y-2 text-muted-foreground">
              {regulation.resources.map((resource) => (
                <li key={resource.href} className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-primary" />
                  <a
                    href={resource.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-foreground transition hover:text-primary"
                  >
                    {resource.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
