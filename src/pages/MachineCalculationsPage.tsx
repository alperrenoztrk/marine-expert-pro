import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Anchor,
  Battery,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Cog,
  Droplets,
  Factory,
  Flame,
  Gauge,
  ShieldCheck,
  Snowflake,
  Wrench,
} from "lucide-react";
import { EngineCalculations } from "@/components/calculations/EngineCalculations";
import { MobileLayout } from "@/components/MobileLayout";
import { CalculationGridScreen } from "@/components/ui/calculation-grid";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      "Kullanım: LNG taşıyıclar, çevreci feribotlar, yeni nesil konteyner ve offshore tedarik gemileri.",
    ],
  },
  {
    title: "Gaz Türbini Tahrik",
    summary:
      "Brayton çevrimiyle çalışan kompakt makineler; redüksiyon dişlisiyle pervane veya jeneratöre bağlanır.",
    bullets: [
      "Avantaj: Çok yüksek güç/ağırlık oranı, düşük titreşim, hızlı güç artışı.",
      "Dezavantaj: Kısmi yükte verim düşer, yakıt tüketimi dizelden yüksek, sıcak parça bakımı maliyetli.",
      "Kullanım: CODAG/CODLAG kombinasyonlu savaş gemileri, yüksek hızlı feribotlar, bazı yatlar.",
    ],
  },
  {
    title: "Buhar Türbini ve Kazan Sistemi",
    summary: "Kazanda üretilen buhar türbinde genişleyerek şaftı döndürür; kondenser ve besi suyu devresi kapalı çevrim sağlar.",
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
    summary:
      "Elektrik üretimi ve şafttan güç alma/şafta güç verme sistemleri enerji yönetimini optimize eder.",
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

const onboardMachines = [
  {
    name: "Ana Makine (Sevk Sistemi)",
    detail: "Ana dizel makine, buhar/gaz türbini veya diesel-electric tahrik",
    description:
      "Geminin ana tahrik sistemini oluşturur; pervane, şaft hattı ve kumanda zinciriyle entegre çalışır. Yakıt kalitesi, yağlama basıncı ve ana yatak sıcaklıkları performans için kritik parametrelerdir.",
    manual: [
      "Vardiya öncesi: yağ seviyesi, deniz/yağ soğutma suyu devreleri ve yakıt viskozite ısıtmasını kontrol et.",
      "Start-up: turning gear ayrıldı mı, lube oil basıncı ve jacket water sıcaklığı operasyon limitlerinde mi doğrula.",
      "Seyir: egzoz sıcaklık trendlerini izleyip silindir dengesi kontrolünü düzenli yap; titreşim/alarm kayıtlarını logla.",
      "Durdurma: yükü kademeli azalt, soğutma devrelerini normal duruş prosedürüne göre sirküle etmeye devam et.",
    ],
  },
  {
    name: "Yardımcı Makineler",
    detail: "Yardımcı dizel ve acil jeneratörler, ana şafttan tahrikli jeneratör",
    description:
      "Gemi elektriğini sağlayan yardımcı dizel jeneratörler ve acil jeneratör, kritik sistemlerin kesintisiz beslenmesi için yedekli çalışır. Yük paylaşımı ve otomatik devre alma kabiliyetleri önemlidir.",
    manual: [
      "Başlatmadan önce yağ, soğutma suyu, yakıt ve hava/fog testlerini tamamla.",
      "Jeneratör yük paylaşımını (load sharing) izleyerek harmonik/reaktif yükleri dengede tut.",
      "Acil jeneratörün otomatik devre alma (auto-start) ve yakıt seviyesi testlerini haftalık yap.",
      "Planlı bakımda AVR, governor ve izolasyon direnci testlerini kayda al.",
    ],
  },
  {
    name: "Elektrik & Güç Sistemleri",
    detail: "Ana/acil switchboard, UPS, trafolar ve batarya grupları",
    description:
      "Ana ve acil switchboard üzerinden güç dağıtımı yapılır; kritik devreler UPS ve bataryalarla korunur. Toprak kaçağı, kısa devre ve frekans/voltaj sapmaları anlık izlenmelidir.",
    manual: [
      "Baralar arası senkronizasyon ve breaker kapama/açma dizilerini prosedüre göre uygula.",
      "Yük devri sırasında harmonik bozunum ve gerilim dengesini takip et; aşırı ısınan baraları termal kamera ile kontrol et.",
      "UPS batarya testlerini periyodik yap, odayı havalandır ve gaz dedektörlerini kontrol et.",
      "Acil durum tatbikatlarında black-out senaryolarını çalıştırıp zamanlarını kaydet.",
    ],
  },
  {
    name: "Yakıt & Yağ Sistemleri",
    detail: "Fuel/Lube oil separatörleri, günlük tanklar, transfer ve besleme pompaları",
    description:
      "Ana makine ve jeneratörlere temiz, uygun viskozitede yakıt/yağ sağlar. Separatörler su ve partikülü ayırır; günlük tank seviyeleri geminin trim/stabilitesini de etkileyebilir.",
    manual: [
      "Separatör öncesi ısıtıcıyı yakıtın cinsine göre ayarla; bowl hızının nominal değerde olduğundan emin ol.",
      "Günlük tanklar arası transferde taşma riskine karşı otomatik shut-off ve gözcü uygula.",
      "LO/FO filtrasyon diferansiyel basınçlarını izleyerek tıkanma eğilimlerini kayıt altına al.",
      "Sludge ve drain tahliyelerini MARPOL prosedürüne uygun gerçekleştirip Oil Record Book’a işle.",
    ],
  },
  {
    name: "Pompalar",
    detail: "Sintine, balast, yangın, soğutma suyu ve tatlı/deniz suyu pompaları",
    description:
      "Gemideki tüm akışkan transferlerinin bel kemiğidir; yangın, balast ve soğutma pompaları farklı görevlerde çalışır. Kavitasyon, titreşim ve sızıntı erken arıza göstergeleridir.",
    manual: [
      "Her pompa devreye almadan önce emiş-çıkış vanaları ve hava alma ihtiyaçlarını kontrol et.",
      "Balast pompalarında tank sıralamasını stabilite planına göre takip et; yangın pompalarını haftalık test et.",
      "Soğutma suyu pompalarında strainers/filtreleri düzenli temizle, basınç ve sıcaklık farklarını logla.",
      "Sintine pompalarını MARPOL gereklilikleri ve 15 ppm OWS interlock’larıyla birlikte doğrula.",
    ],
  },
  {
    name: "Soğutma & HVAC",
    detail: "Merkezi soğutma devresi, HVAC, soğuk hava depoları ve reefer sistemleri",
    description:
      "Ana/yardımcı makine jacket water ve merkezi soğutma devreleri, güverte ve yaşam mahallini iklimlendiren HVAC ile entegre çalışır. Reefer konteyner beslemeleri sıcaklık hassasiyetlidir.",
    manual: [
      "Merkezi soğutma plakalı eşanjörlerini diferansiyel basınç üzerinden takip edip gerektiğinde temizle.",
      "HVAC filtrelerini ve damper ayarlarını aylık kontrol et; taze hava oranını CO₂ sensörlerine göre ayarla.",
      "Reefer prizlerinin yük testlerini ve alarm izleme panosunu düzenli doğrula.",
      "Kondenser/evaporatör yüzeylerini kirlenmeye karşı denetle, gaz kaçak testlerini kayıt altına al.",
    ],
  },
  {
    name: "Kazanlar (Boiler)",
    detail: "Auxiliary boiler ve EGB; ısıtma, yakıt viskozitesi ve buhar ihtiyacı",
    description:
      "Yardımcı kazanlar ve egzoz gaz kazanı, yakıt ısıtma, tank ısıtma ve yaşam mahalli buhar ihtiyacını sağlar. Yanma ayarı, su seviyesi kontrolü ve blow-down kritik güvenlik noktalarıdır.",
    manual: [
      "Yakıt atomizasyonu için gereken buhar/hava basıncını ve viskoziteyi devreye almadan önce doğrula.",
      "Düşük su seviyesi ve yüksek buhar basıncı alarmlarının testini periyodik yap; su besleme pompalarını gözlemle.",
      "EGB’de kurum üfleme (soot-blowing) işlemini egzoz sıcaklık farkına göre planla ve kayıt altına al.",
      "Günlük blow-down yaparak TDS/PH değerlerini takip et; kimyasal dozajı test sonuçlarına göre ayarla.",
    ],
  },
  {
    name: "Emniyet & Kontrol Sistemleri",
    detail: "Yangın algılama/CO₂, ECR operasyonu, alarm ve izleme sistemleri",
    description:
      "Makine dairesi otomasyon sistemi, alarm ve emniyet kilitlemeleriyle tüm ekipmanı izler. Uzaktan izleme (AMS), acil durdurma istasyonları ve gaz söndürme sistemleri koordineli çalışmalıdır.",
    manual: [
      "Alarm paneli inhibit/override modlarını yalnızca prosedür gereği kullan; yapılan değişiklikleri logla.",
      "CO₂/FM200 sisteminin izolasyon vanaları, çekme pimleri ve siren testlerini periyodik doğrula.",
      "ECR’den yerel kontrol moduna geçiş prosedürünü personelle birlikte tatbik et.",
      "Trend kayıtlarını (basınç, sıcaklık, titreşim) haftalık değerlendirip erken uyarı limitlerini güncelle.",
    ],
  },
  {
    name: "Güverte Makineleri",
    detail: "Irgat, mooring winch, kreyn, capstan ve Ro-Ro rampaları",
    description:
      "Güverte operasyonlarında yük kaldırma ve bağlama ekipmanlarının güvenli çalışması kritik önemdedir. Hidrolik sistemler, fren bandı ayarları ve acil durdurma istasyonları düzenli kontrol ister.",
    manual: [
      "Operasyon öncesi limit switch’ler, yağ seviyeleri ve emniyet pimlerini kontrol et; çalışma alanını bariyerle.",
      "Mooring winch fren testlerini ve SWL etiketlerini periyodik doğrula, tel halat yağlamasını yap.",
      "Kreyn ve rampa operasyonlarında haberleşme prosedürünü ve el işaretlerini ekip ile paylaş.",
      "Hidrolik sistem basınç/sızıntı kontrollerini tamamla; acil stop ve manüel override noktalarını göster.",
    ],
  },
];

export default function MachineCalculationsPage() {
  const [showMachines, setShowMachines] = useState(false);

  return (
    <MobileLayout>
      <CalculationGridScreen
      eyebrow="Makine"
      title="Makine Hesaplamaları"
      subtitle="Motor gücü, yakıt tüketimi ve performans hesaplamalarınızı yapın"
    >
      <Card className="border-blue-100/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white shadow-sm">
        <CardHeader className="pb-3 text-center">
          <CardTitle className="text-xl font-extrabold tracking-tight">Gemi Makineleri Paneli</CardTitle>
          <p className="text-sm text-slate-200/80">
            Jeneratör, separatör, kazan, kompresör ve diğer makineleri tek ekranda açın.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {machinerySystems.map((system) => {
              const MachineryIcon = system.icon;
              return (
                <button
                  key={system.name}
                  type="button"
                  className="group flex h-full flex-col items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-amber-400/50 hover:bg-white/10 hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-600 via-orange-500 to-yellow-500 text-white shadow">
                      <MachineryIcon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold text-white">{system.name}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{system.description}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-amber-300">
                    Erişim
                    <ChevronRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-inner">
            <div className="mb-3 flex items-center gap-2 text-white">
              <BookOpen className="h-4 w-4 text-amber-300" />
              <h3 className="text-sm font-semibold">Detaylı Makine Açıklamaları</h3>
            </div>
            <div className="space-y-3">
              {machineryDetailSections.map((section) => (
                <details
                  key={section.title}
                  className="group rounded-lg border border-white/10 bg-black/20 p-3 shadow-sm transition hover:border-amber-400/50"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-2 text-left text-white">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold">{section.title}</div>
                      <p className="text-xs text-slate-200 leading-relaxed">{section.summary}</p>
                    </div>
                    <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 transition group-open:rotate-180" />
                  </summary>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-100/90">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-100/70 bg-gradient-to-br from-blue-50 via-white to-slate-50 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-lg text-[#2F5BFF]">
              <Wrench className="h-5 w-5" />
                Gemideki Makineler
              </CardTitle>
              <Button variant="outline" onClick={() => setShowMachines((prev) => !prev)}>
                {showMachines ? "Listeyi Gizle" : "Tüm Makineleri Göster"}
              </Button>
            </div>
          </CardHeader>
          {showMachines && (
            <CardContent className="pt-0">
              <div className="grid gap-3 md:grid-cols-2">
                {onboardMachines.map((machine) => (
                  <div
                    key={machine.name}
                    className="rounded-xl border border-blue-100 bg-white/80 px-4 py-3 shadow-[0_8px_24px_rgba(47,91,255,0.08)] space-y-3"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900">{machine.name}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{machine.detail}</p>
                      <p className="text-sm text-slate-700 leading-relaxed dark:text-slate-200">{machine.description}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 px-3 py-2 text-slate-700 dark:bg-slate-900/40">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#2F5BFF]">
                        Kullanım kılavuzu
                      </p>
                      <ul className="mt-2 space-y-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                        {machine.manual.map((step) => (
                          <li key={step} className="flex gap-2">
                            <span className="mt-0.5 text-[#2F5BFF]">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="bg-white/90 border-white/60 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl text-[#2F5BFF]">
              <Wrench className="h-6 w-6" />
              Makine Hesaplama Modülü
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EngineCalculations />
          </CardContent>
        </Card>
      </CalculationGridScreen>
    </MobileLayout>
  );
}
