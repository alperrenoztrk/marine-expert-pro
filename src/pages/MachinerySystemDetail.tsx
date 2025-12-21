import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { machinerySystemMap, type MachinerySystemId } from "@/data/machinerySystems";

const SectionList = ({ title, items }: { title: string; items: string[] }) => (
  <div className="space-y-2 rounded-xl border border-border/60 bg-card/70 p-3 shadow-sm">
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

export default function MachinerySystemDetailPage() {
  const { systemId } = useParams<{ systemId: MachinerySystemId }>();
  const system = systemId ? machinerySystemMap[systemId] : undefined;

  if (!system) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-50 via-amber-50 to-orange-100 px-4 py-12 text-center dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
        <p className="text-lg font-semibold text-foreground">Makine modülü bulunamadı</p>
        <Link to="/calculations" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" />
          Hesaplama Merkezine dön
        </Link>
      </div>
    );
  }

  const SystemIcon = system.icon;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-amber-50 to-orange-100 px-4 py-10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className={`absolute -top-20 left-1/3 h-56 w-56 rounded-full bg-gradient-to-br ${system.accent} opacity-20 blur-3xl`} />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
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
            <span className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${system.accent} text-white shadow-lg`}>
              <SystemIcon className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">Gemi Makineleri</p>
              <h1 className="text-3xl font-black text-foreground sm:text-4xl">{system.name}</h1>
            </div>
          </div>
          <p className="text-sm text-muted-foreground sm:text-base">{system.summary}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <SectionList title="Görev ve kapsama" items={system.duties} />
          <SectionList title="Operasyon adımları" items={system.operations} />
          <SectionList title="İzleme ve bakım" items={system.monitoring} />
          <SectionList title="Entegrasyon ve iş akışı" items={system.integration} />
        </div>

        <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 text-sm text-foreground shadow-inner sm:p-6">
          <p className="mb-2 text-base font-semibold text-primary">Neden önemli?</p>
          <p className="text-muted-foreground">
            {system.name} modülü, makine dairesi operasyonlarının güvenli, verimli ve sınıf/gemi talimatlarına uyumlu yürütülmesine yardımcı olur. Bu özet,
            vardiya mühendisleri ve zabitler için hızlı bir oryantasyon rehberi sağlar.
          </p>
        </div>
      </div>
    </div>
  );
}
