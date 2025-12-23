import { ArrowLeft, Anchor, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const fourStages = [
  { emoji: "1️⃣", title: "APPRAISAL (DEĞERLENDİRME)", description: "Seyre çıkmadan önce neyle karşılaşılacağını değerlendirme." },
  { emoji: "2️⃣", title: "PLANNING (PLANLAMA)", description: "Emniyetli, yasal ve optimize rota planının oluşturulması." },
  { emoji: "3️⃣", title: "EXECUTION (UYGULAMA)", description: "Master onayı sonrası planın uygulanması ve ekip briefingi." },
  { emoji: "4️⃣", title: "MONITORING (İZLEME)", description: "Seyir sırasında planın canlı takibi ve kayıt altına alınması." },
];

const appraisalResources = [
  {
    title: "Harita & Seyir Yayınları",
    items: [
      "Paper Charts / ENC (ECDIS)",
      "Sailing Directions (Pilot Book)",
      "Admiralty List of Lights",
      "Admiralty List of Radio Signals",
      "Tide Tables",
      "Current Atlases",
      "Port Guide / Terminal Info",
    ],
  },
  {
    title: "Meteoroloji & Oşinografi",
    items: [
      "NAVTEX",
      "Weather routing servisleri",
      "GRIB files",
      "Ocean current charts",
      "Seasonal weather routing (monsoon, cyclone zones)",
    ],
  },
  {
    title: "Gemiye Ait Bilgiler",
    items: ["Draft (laden / ballast)", "Air draft", "Turning circle", "Manoeuvring booklet", "Speed / consumption"],
  },
  {
    title: "Risk Faktörleri",
    items: [
      "TSS bölgeleri",
      "Dar boğazlar",
      "Shallow waters",
      "Restricted visibility areas",
      "Piracy zones",
      "Ice limits (mevsimsel)",
    ],
  },
];

const planSections = [
  {
    title: "A. ROUTE SEÇİMİ",
    bullets: ["Great Circle / Rhumb Line kararı", "TSS’lere uygunluk", "En emniyetli derinlikler", "Liman yaklaşımları"],
  },
  {
    title: "B. WAYPOINT OLUŞTURMA",
    bullets: [
      "Latitude / Longitude",
      "Course (True)",
      "Distance",
      "Wheel over point",
      "XTD (Cross Track Distance) – open sea geniş, coastal/confined küçük tutulur",
    ],
  },
  {
    title: "C. UKC (Under Keel Clearance)",
    bullets: ["Static draft", "Squat", "Tide", "Heel", "Wave response"],
    note: "PSC sorusu: Bu bölgede minimum UKC kaçtır?",
  },
  {
    title: "D. SPEED & ETA PLANLAMASI",
    bullets: ["Engine load", "Weather allowance", "Traffic allowance", "Arrival time optimization"],
  },
  {
    title: "E. NO-GO AREA BELİRLEME",
    bullets: ["Sığlıklar", "Yasak alanlar", "Restricted areas", "Environmental zones", "ECDIS safety depth, contour ve alarmları"],
  },
  {
    title: "F. CONTINGENCY PLAN (ÇOK KRİTİK)",
    bullets: [
      "Makine durursa ne olacak?",
      "Hava bozarsa hangi rota?",
      "Trafik kilitlenirse bekleme alanı?",
    ],
    note: "PSC bunu özellikle arar.",
  },
];

const passagePlanContents = [
  "Route overview chart",
  "Coastal / approach charts",
  "Waypoint list",
  "UKC calculation",
  "Tidal data",
  "Weather forecast",
  "Contingency plans",
  "Master’s approval & signature",
];

const roleTable = [
  { task: "Passage plan hazırlama", owner: "2. Kaptan", doer: "2. Kaptan" },
  { task: "Risk değerlendirme", owner: "2/O + Master", doer: "2/O + Master" },
  { task: "Onay", owner: "Master", doer: "Master" },
  { task: "Uygulama", owner: "OOW", doer: "OOW" },
  { task: "İzleme", owner: "OOW", doer: "OOW" },
];

export default function PassagePlanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
        <div className="flex items-center gap-3">
          <Link
            to="/calculations"
            className="flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 transition hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri dön
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Anchor className="h-4 w-4" />
            Seyir & Köprüüstü İşleri
          </div>
        </div>

        <header className="space-y-3 rounded-2xl border border-border/60 bg-card/90 p-6 shadow-lg backdrop-blur">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary">Passage Plan</p>
              <h1 className="text-2xl font-bold leading-tight text-foreground">Seyir Planı (Passage Plan) Rehberi</h1>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Geminin iskele çözüldüğü andan varışta bağlanana kadar izleyeceği emniyetli, yasal ve optimize edilmiş rota planı.
            PSC açısından kaza olursa ilk bakılan belge passage plan’dır; dört aşamanın her biri ayrı ayrı belgelenmelidir.
          </p>
        </header>

        <section className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">🚢 Passage Plan Nedir?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Geminin sefer boyunca izleyeceği rota, riskler ve operasyonel sınırlar bütünüdür. Emniyet, mevzuata uyum ve optimizasyon
            hedeflenir; PSC ve vetting denetimlerinde ilk incelenen dokümandır.
          </p>
        </section>

        <section className="space-y-4 rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">📐 Passage Plan’in 4 Ana Aşaması (IMO Standardı)</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {fourStages.map((stage) => (
              <div key={stage.title} className="rounded-xl border border-border/50 bg-slate-900/60 p-4">
                <p className="text-sm font-semibold text-primary">{stage.emoji} {stage.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stage.description}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Bu 4 adımın her biri ayrı ayrı belgelenmelidir.</p>
        </section>

        <section className="space-y-6 rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">1️⃣ APPRAISAL – DEĞERLENDİRME AŞAMASI</h2>
            <p className="text-sm text-muted-foreground">Bu seyre çıkmadan önce neyle karşılaşabileceğini öngörme aşaması.</p>
            <p className="text-sm text-primary">Appraisal çıktısı: “Bu seyrin risk haritası”.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {appraisalResources.map((group) => (
              <div key={group.title} className="rounded-xl border border-border/50 bg-slate-900/60 p-4">
                <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {group.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">2️⃣ PLANNING – PLANLAMA AŞAMASI</h2>
            <p className="text-sm text-muted-foreground">Asıl passage planın hazırlandığı, rota ve operasyon parametrelerinin netleştiği aşama.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {planSections.map((section) => (
              <div key={section.title} className="rounded-xl border border-border/50 bg-slate-900/60 p-4">
                <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>• {bullet}</li>
                  ))}
                </ul>
                {section.note && <p className="mt-2 text-xs text-primary">{section.note}</p>}
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-dashed border-primary/40 bg-slate-900/50 p-4 text-xs text-muted-foreground">
            <p className="font-semibold text-primary">Contingency Plan Hatırlatması:</p>
            <p>
              Her risk için B planı oluşturulmalı; makine arızasında manevra, kötü hava koşullarında alternatif rota ve trafik sıkışıklığında bekleme
              alanı hazır olmalıdır. PSC denetimleri bu kısmı özellikle kontrol eder.
            </p>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">3️⃣ EXECUTION – UYGULAMA AŞAMASI</h2>
          <p className="text-sm text-muted-foreground">
            Plan master tarafından onaylanmadan uygulanmaz. Bu aşamada bridge team briefing yapılır; vardiya zabitlerine kritik
            waypoint’ler, UKC limitleri ve alarm ayarları aktarılır. Pilot varsa bilgi paylaşılır. Plan körü körüne uygulanmaz; duruma göre
            revize edilebilir ve her revizyon kayıt altına alınır.
          </p>
        </section>

        <section className="space-y-4 rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">4️⃣ MONITORING – İZLEME AŞAMASI</h2>
          <p className="text-sm text-muted-foreground">
            Seyir sırasında planın canlı takibi yapılır. OOW; XTD aşımı, course deviation, hız değişimi, depth trendi ve trafik
            durumunu izler. Sapma varsa düzeltme yapılır, kayıt alınır ve gerekirse master çağrılır.
          </p>
          <div className="rounded-xl border border-border/50 bg-slate-900/60 p-4 text-xs text-muted-foreground">
            <p className="font-semibold text-primary">Kullanılan araçlar:</p>
            <ul className="mt-2 space-y-1">
              <li>• ECDIS, radar overlay, visual bearings</li>
              <li>• GPS / GNSS, echo sounder</li>
              <li>• Alarm limitleri ve XTD takip ekranları</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">📑 Passage Plan Dosyasında Olması Gerekenler</h2>
          <ul className="mt-2 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
            {passagePlanContents.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">✔</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-primary">PSC bu unsurları tek tek isteyebilir.</p>
        </section>

        <section className="space-y-3 rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">👤 Kim Ne Yapar?</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-left">
                  <th className="py-2 pr-4 font-semibold text-foreground">Görev</th>
                  <th className="py-2 pr-4 font-semibold text-primary">Sorumlu</th>
                  <th className="py-2 font-semibold text-muted-foreground">Fiilen Yapan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {roleTable.map((row) => (
                  <tr key={row.task}>
                    <td className="py-1.5 pr-4 text-foreground">{row.task}</td>
                    <td className="py-1.5 pr-4 text-primary">{row.owner}</td>
                    <td className="py-1.5 text-muted-foreground">{row.doer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}
