import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { bridgeDeviceMap, type BridgeDeviceId } from "@/data/bridgeDevices";

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

export default function BridgeDeviceDetailPage() {
  const { deviceId } = useParams<{ deviceId: BridgeDeviceId }>();
  const device = deviceId ? bridgeDeviceMap[deviceId] : undefined;

  if (!device) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 px-4 py-12 text-center dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
        <p className="text-lg font-semibold text-foreground">Cihaz bulunamadı</p>
        <Link to="/calculations" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" />
          Hesaplama Merkezine dön
        </Link>
      </div>
    );
  }

  const DeviceIcon = device.icon;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 px-4 py-10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className={`absolute -top-20 left-1/3 h-56 w-56 rounded-full bg-gradient-to-br ${device.accent} opacity-20 blur-3xl`} />
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
            <span className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${device.accent} text-white shadow-lg`}>
              <DeviceIcon className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">Köprüüstü Aygıtı</p>
              <h1 className="text-3xl font-black text-foreground sm:text-4xl">{device.name}</h1>
            </div>
          </div>
          <p className="text-sm text-muted-foreground sm:text-base">{device.summary}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <SectionList title="Görev ve kullanım alanları" items={device.duties} />
          <SectionList title="Operasyon adımları" items={device.operations} />
          <SectionList title="İzleme ve emniyet" items={device.monitoring} />
          <SectionList title="Entegrasyon ve iş akışı" items={device.integration} />
        </div>

        <div className="space-y-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/80">Örnek görseller</p>
              <h2 className="text-lg font-bold text-foreground">{device.name} köprüüstü perspektifleri</h2>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {device.images.length} fotoğraf
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {device.images.map((url, index) => (
              <figure
                key={url}
                className="group overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-background/80 to-card shadow-sm"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={url}
                    alt={`${device.name} örnek görsel ${index + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-60" />
                </div>
                <figcaption className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Köprüüstü detayı</span>
                  <span className="rounded-md bg-primary/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                    {device.name}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 text-sm text-foreground shadow-inner sm:p-6">
          <p className="mb-2 text-base font-semibold text-primary">Neden önemli?</p>
          <p className="text-muted-foreground">
            {device.name} modülü, köprüüstü ekiplerinin görevi güvenli, düzenli ve belgelenebilir şekilde yürütmesine yardımcı olur. Bu özet, yeni katılan
            zabitler için hızlı bir oryantasyon, deneyimli vardiya zabitleri için ise tatbikat ve denetim hazırlığında referans rehberidir.
          </p>
        </div>
      </div>
    </div>
  );
}
