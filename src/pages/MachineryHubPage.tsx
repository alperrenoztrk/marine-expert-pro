import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Anchor,
  Battery,
  Cog,
  Droplets,
  Factory,
  Flame,
  Gauge,
  ShieldCheck,
  Snowflake,
} from "lucide-react";

const machinerySystems = [
  {
    name: "Ana Makine (Sevk Sistemi)",
    description:
      "Ana dizel makine, türbin ve diesel-electric tahrik kombinasyonlarının devreye alma, yük paylaşımı ve seyir performansını izleme",
    icon: Cog,
  },
  {
    name: "Yardımcı Makineler",
    description:
      "Yardımcı dizel, acil durum ve ana şaft tahrikli jeneratörlerin paralel çalışma, senkronizasyon ve güç yönetimi",
    icon: Factory,
  },
  {
    name: "Elektrik & Güç Sistemleri",
    description:
      "Ana/acil switchboard, UPS, trafolar ve batarya gruplarının yük aktarımı, gerilim/frekans denetimi ve kesintisiz güç sürekliliği",
    icon: Battery,
  },
  {
    name: "Yakıt & Yağ Sistemleri",
    description:
      "Fuel/Lube oil separatörleri, günlük tanklar ve transfer/besleme pompalarının arıtma, ısıtma ve otomatik tank balansı",
    icon: Droplets,
  },
  {
    name: "Pompalar",
    description:
      "Sintine, balast, yangın ve soğutma suyu pompalarının otomatik start/stop, basınç koruma ve hat yedekliliği",
    icon: Gauge,
  },
  {
    name: "Soğutma & HVAC",
    description:
      "Merkezi soğutma, HVAC, soğuk hava depoları ve reefer devrelerinin ısı değiştirici kontrolü, fan/pompa kademesi ve nem-sıcaklık optimizasyonu",
    icon: Snowflake,
  },
  {
    name: "Kazanlar (Boiler)",
    description:
      "Auxiliary boiler ve EGB ile yakma hava ayarı, buhar basıncı regülasyonu ve ısıtma devrelerinin arıza/tekrar devreye alma işlemleri",
    icon: Flame,
  },
  {
    name: "Emniyet & Kontrol Sistemleri",
    description:
      "Yangın algılama/CO₂, ECR, alarm ve izleme sistemlerinin sensör doğrulama, arıza izolasyonu ve otomatik güvenlik müdahaleleri",
    icon: ShieldCheck,
  },
  {
    name: "Güverte Makineleri",
    description:
      "Irgat, mooring winch, kreyn, capstan ve Ro-Ro rampalarının yük limit kontrolü, hidrolik/elektrik tahrik gözetimi ve emniyet kilitlemeleri",
    icon: Anchor,
  },
];

const machineryDetailSections = [
  {
    title: "Dizel Ana Makine (Slow/Medium/High-Speed)",
    summary:
      "Dizel çevrimli pistonlu motorlar; düşük devirde doğrudan şaft, orta/yüksek devirde redüksiyon dişlisiyle pervaneye güç aktarır.",
    bullets: [
      "Avantaj: Yüksek verim ve dayanıklılık, ağır yakıtla çalışabilme, geniş servis ağı.",
      "Dezavantaj: Ağırlık/hacim, titreşim ve emisyonlar için ek arıtma gerekebilir.",
      "Kullanım: Büyük ticari gemilerde slow-speed; Ro-Ro/feribotlarda medium-speed; küçük feribot/devriye botlarında high-speed.",
    ],
  },
  {
    title: "Dual-Fuel Dizel (DF) Ana Makine",
    summary:
      "Gaz modunda küçük pilot dizel püskürtmesiyle tutuşan dizel mimarisi; LNG/LPG/metanol + dizel yakıt esnekliği sunar.",
    bullets: [
      "Avantaj: SOx/PM emisyonlarında ciddi azalma, NOx uyumu kolay, yakıt seçeneği geniş.",
      "Dezavantaj: Gaz besleme ve güvenlik sistemleri karmaşık; LNG'de metan kayması konusu.",
      "Kullanım: LNG taşıyıcılar, çevreci feribotlar, yeni nesil konteyner ve offshore tedarik gemileri.",
    ],
  },
  {
    title: "Gaz Türbini Tahrik",
    summary: "Brayton çevrimiyle çalışan kompakt makineler; redüksiyon dişlisiyle pervane veya jeneratöre bağlanır.",
    bullets: [
      "Avantaj: Çok yüksek güç/ağırlık oranı, düşük titreşim, hızlı güç artışı.",
      "Dezavantaj: Kısmi yükte verim düşer, yakıt tüketimi dizelden yüksek, sıcak parça bakımı maliyetli.",
      "Kullanım: CODAG/CODLAG kombinasyonlu savaş gemileri, yüksek hızlı feribotlar, bazı yatlar.",
    ],
  },
  {
    title: "Buhar Türbini ve Kazan Sistemi",
    summary:
      "Kazanda üretilen buhar türbinde genişleyerek şaftı döndürür; kondenser ve besi suyu devresi kapalı çevrim sağlar.",
    bullets: [
      "Avantaj: Yüksek güçte titreşimsiz çalışma; LNG taşıyıcılarında boil-off gazı değerlendirebilir.",
      "Dezavantaj: Modern dizellere göre düşük verim, kazan/türbin ve su kimyası bakımı karmaşık.",
      "Kullanım: Eski nesil LNG tankerleri, bazı uçak gemileri, buz kıranlar, nükleer tahrikte ısı kaynağı olarak.",
    ],
  },
  {
    title: "Nükleer Tahrik (Buhar Türbini ile)",
    summary: "Reaktördeki fisyon ısısı buhar üretir ve türbinleri döndürür; çok uzun menzil ve yüksek sürekli güç sağlar.",
    bullets: [
      "Avantaj: Yakıt ikmaline düşük bağımlılık, uzun süre yüksek güç.",
      "Dezavantaj: Lisans/güvenlik gereksinimleri, ilk yatırım ve atık yönetimi maliyetli.",
      "Kullanım: Askerî uçak gemisi/denizaltı, bazı buz kıranlar.",
    ],
  },
  {
    title: "CODAD / CODAG / CODOG / CODLAG / IFEP",
    summary:
      "Dizel, gaz türbini ve elektrik motorlarının farklı hız/görev profilleri için kombinasyonlu kullanımı; esnek güç yönetimi sunar.",
    bullets: [
      "Avantaj: Ekonomik seyir için dizel, sprint için gaz türbini; CODLAG/IFEP ile sessiz seyir ve dağıtılabilir güç.",
      "Dezavantaj: Dişli/şaft ve kontrol sistemi karmaşıklığı, bakım ve eğitim ihtiyacı.",
      "Kullanım: Fırkateyn/muhrip, sessiz seyir isteyen denizaltı ve büyük yolcu/feribotlarda IFEP.",
    ],
  },
  {
    title: "Tam Elektrikli / Hibrit-Elektrikli Tahrik",
    summary:
      "Dizel jeneratörler (veya gaz türbini/nükleer) elektrik üretir; frekans dönüştürücülü motorlar pervaneyi döndürür, batarya destek verebilir.",
    bullets: [
      "Avantaj: Yerleşimde esneklik, düşük titreşim ve iyi manevra; batarya ile düşük yük verimi ve hızlı yanıt artar.",
      "Dezavantaj: Güç elektroniği soğutma/kablo ağırlığı, harmonik ve EMC yönetimi gereksinimi.",
      "Kullanım: Yolcu/gezinti gemileri, buz kıranlar, offshore inşaat/tedarik, DP gemileri ve feribotlar.",
    ],
  },
  {
    title: "Azipod / Pod Tahrik",
    summary:
      "Elektrik motoru ve pervane aynı döner gondol içinde; 360° dönebilme ile dümen ihtiyacını azaltır ve manevrayı güçlendirir.",
    bullets: [
      "Avantaj: Üstün manevra, kısalan şaft hattı, pulling tipte verim artışı, gürültü/titreşim azaltımı.",
      "Dezavantaj: Yatırım maliyeti ve sızdırmazlık/bakım hassasiyeti; güçlü elektrik altyapısı ister.",
      "Kullanım: Yolcu/gezinti gemileri, buz kıranlar, dinamik konumlamalı offshore gemileri, feribotlar.",
    ],
  },
  {
    title: "Pervane-Dışı Yüksek İtki Sistemleri",
    summary: "Waterjet, Voith-Schneider ve thruster çözümleri manevra ve hız odaklı itki seçenekleri sunar.",
    bullets: [
      "Waterjet: Yüksek hızda verimli, pervanesiz jet akışı; sığ su ve manevrada güçlü ama düşük hızda verimsiz.",
      "Voith-Schneider: Dikey dönen kanatlarla anında yönlenebilir itki; römorkör ve feribotlarda hassas manevra.",
      "Tunnel/azimuth thruster: Dinamik konumlama, yanaşma ve DP kabiliyeti için ek itki birimleri.",
    ],
  },
  {
    title: "Alternatif Yakıt ve Yeni Teknolojiler",
    summary:
      "Metanol, amonyak, hidrojen yakıt hücresi ve batarya çözümleri sıfıra yakın emisyon hedefleri için geliştiriliyor.",
    bullets: [
      "Metanol motorları: Düşük SOx/PM, güvenlik gereksinimli yakıt sistemi; dizel verimine yakın.",
      "Amonyak: Karbonsuz potansiyel, toksisite ve NOx kontrolü nedeniyle AR-GE aşamasında.",
      "Yakıt hücresi/batarya: Sessiz ve lokal emisyonsuz; şu an küçük güç/yardımcı tahrik ve kısa mesafe feribotlarda yaygın.",
    ],
  },
  {
    title: "Yardımcı Dizel Jeneratörler ve PTO/PTI",
    summary: "Elektrik üretimi ve şafttan güç alma/şafta güç verme sistemleri enerji yönetimini optimize eder.",
    bullets: [
      "Avantaj: Ana makine yüküne göre optimize enerji, limanda düşük emisyon için shore-power veya PTO desteği.",
      "Dezavantaj: Ek güç elektroniği, dişli ve kavrama karmaşıklığı; yük paylaşım algoritması gerektirir.",
      "Kullanım: Çoğu ticari gemide yardımcı/jeneratör seti, enerji verimliliği odaklı PTO/PTI konfigürasyonları.",
    ],
  },
  {
    title: "Yardımcı Kazanlar ve Isı Geri Kazanımı",
    summary:
      "Ana makine egzozu veya bağımsız yakma ile buhar/sıcak su üretip yakıt/yağ/kargo ısıtma ve yaşam mahalli konforu sağlar.",
    bullets: [
      "Avantaj: Economizer ile atık ısıdan yakıt tasarrufu, geniş kullanım yelpazesi.",
      "Dezavantaj: Kazan suyu kimyası, kurum/korozyon kontrolü ve termal şok riskleri dikkat ister.",
      "Kullanım: Çoğu ticari gemide yardımcı kazan; egzoz gazı kazanlarıyla kombine çözümler.",
    ],
  },
];

export default function MachineryHubPage() {
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
          <h1 className="text-2xl font-bold text-foreground">Gemi Makineleri</h1>
          <p className="text-xs text-muted-foreground">
            Jeneratör, separatör, kazan, kompresör ve diğer makineleri tek ekranda inceleyin.
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
            {machinerySystems.map((system) => {
              const MachineryIcon = system.icon;
              return (
                <div
                  key={system.name}
                  className="group flex h-full flex-col items-start gap-2 rounded-xl border border-border/50 bg-background/70 p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-600 via-orange-500 to-yellow-500 text-white shadow">
                      <MachineryIcon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold text-foreground">{system.name}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{system.description}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                    İncele
                    <ChevronRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-border/50 bg-background/60 p-4 shadow-inner">
            <div className="mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Detaylı Makine Açıklamaları</h2>
            </div>
            <div className="space-y-3">
              {machineryDetailSections.map((section) => (
                <details
                  key={section.title}
                  className="group rounded-lg border border-border/40 bg-card/70 p-3 shadow-sm transition hover:border-primary/40"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-2 text-left">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-foreground">{section.title}</div>
                      <p className="text-xs leading-relaxed text-muted-foreground">{section.summary}</p>
                    </div>
                    <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition group-open:rotate-180" />
                  </summary>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-foreground/90">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

