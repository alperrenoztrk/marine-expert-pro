import { Link, useParams } from "react-router-dom";
import { crewRoleMap } from "@/data/crewHierarchy";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

export default function CrewRoleDetailPage() {
  const { roleSlug } = useParams<{ roleSlug: string }>();
  const role = roleSlug ? crewRoleMap[roleSlug] : undefined;

  if (!role) {
    return (
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
          Kayıt bulunamadı
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Görev detayı yüklenemedi</h1>
          <p className="text-sm text-muted-foreground">
            İstediğiniz personel kaydı bulunamadı. Lütfen listeden geçerli bir rol seçin.
          </p>
        </div>
        <Link
          to="/hub"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <ArrowLeft className="h-4 w-4" /> Hesaplama Merkezine Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-10 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute left-10 top-10 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 right-16 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/hub"
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground backdrop-blur transition hover:border-primary/40 hover:bg-card"
          >
            <ArrowLeft className="h-4 w-4" />
            Gemi Personeli
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Yeni Görev Sayfası
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-xl backdrop-blur dark:border-border/40 dark:bg-slate-900/70">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Rol Detayı</p>
              <h1 className="text-3xl font-black leading-tight text-foreground">{role.rank}</h1>
              <p className="text-sm text-muted-foreground">{role.responsibility}</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-primary">
              <ShieldCheck className="h-5 w-5" />
              <div className="text-sm font-semibold">
                Üstü: <span className="text-foreground dark:text-white">{role.reportsTo}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <section className="rounded-xl border border-border/50 bg-background/80 p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Her Durumda Temel Sorumluluklar</h2>
                  <p className="text-xs text-muted-foreground">Acil durum ve rutin operasyonlarda değişmeyen görevler</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {role.alwaysDuties.map((duty) => (
                  <li key={duty} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                    <span className="leading-relaxed text-foreground dark:text-slate-200">{duty}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-border/50 bg-background/80 p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Genel Görevler</h2>
                  <p className="text-xs text-muted-foreground">Planlı bakım, raporlama ve günlük işler</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {role.generalTasks.map((task) => (
                  <li key={task} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                    <span className="leading-relaxed text-foreground dark:text-slate-200">{task}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.18em] text-primary">İpucu</p>
              <p className="text-muted-foreground">
                Bu sayfa, ilgili rol için acil durumda ve günlük operasyonlarda değişmeyen sorumluluklara hızlıca ulaşmanız için tasarlandı.
              </p>
            </div>
            <Link
              to="/hub"
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary transition hover:-translate-y-0.5 hover:border-primary/60"
            >
              Tüm Roller
              <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
