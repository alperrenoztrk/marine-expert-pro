import type { CSSProperties } from "react";
import { useParams, Link } from "react-router-dom";
import { calculationCategories } from "@/data/calculationCenterConfig";
import { GraduationCap, BookOpen, FileText, Lightbulb, ChevronRight } from "lucide-react";

interface TopicContent {
  title: string;
  description: string;
  keyTopics: { title: string; description: string }[];
  resources: { title: string; href: string }[];
}

const topicsData: Record<string, TopicContent> = {
  stability: {
    title: "Stabilite Konu Anlatımı",
    description: "Gemi stabilitesinin temel prensipleri, hesaplama yöntemleri ve IMO kriterleri hakkında kapsamlı bilgi.",
    keyTopics: [
      { title: "Metacentric Height (GM)", description: "Başlangıç stabilitesinin temel ölçüsü ve hesaplama yöntemleri" },
      { title: "GZ Eğrisi", description: "Dinamik stabilite analizi ve kritik açılar" },
      { title: "Free Surface Effect", description: "Tankların stabiliteye etkisi ve düzeltme hesapları" },
      { title: "IMO Kriterleri", description: "Uluslararası stabilite standartları ve gereklilikleri" },
      { title: "Ağırlık Kaydırma", description: "Yük ve balast operasyonlarının stabilite hesapları" },
      { title: "Grain Stability", description: "Tahıl yükünün özel stabilite gereksinimleri" }
    ],
    resources: [
      { title: "Stabilite Hesaplamaları", href: "/stability/calculations" },
      { title: "Stabilite Formülleri", href: "/stability/formulas" },
      { title: "IMO Kuralları", href: "/stability/rules" }
    ]
  },
  navigation: {
    title: "Seyir Konu Anlatımı",
    description: "Deniz seyir teknikleri, astronomik navigasyon ve modern navigasyon sistemleri hakkında detaylı eğitim.",
    keyTopics: [
      { title: "Rota Hesaplamaları", description: "Great circle ve rhumb line rota hesapları" },
      { title: "Astronomik Navigasyon", description: "Güneş, yıldız ve ay mevkileri" },
      { title: "Gelgit Hesapları", description: "Tide tabloları ve hesaplama yöntemleri" },
      { title: "Radar Navigasyonu", description: "ARPA ve radar görüntü yorumlama" },
      { title: "ECDIS", description: "Elektronik harita ve bilgi sistemi kullanımı" },
      { title: "GPS ve GNSS", description: "Uydu navigasyon sistemleri ve doğruluk" }
    ],
    resources: [
      { title: "Seyir Hesaplamaları", href: "/navigation" },
      { title: "Seyir Formülleri", href: "/navigation/formulas" },
      { title: "COLREG Kuralları", href: "/navigation/rules" }
    ]
  },
  cargo: {
    title: "Yük Elleçleme Konu Anlatımı",
    description: "Yük operasyonları, draft survey hesapları ve güvenli istifleme teknikleri.",
    keyTopics: [
      { title: "Draft Survey", description: "Yük miktarı hesaplama yöntemleri" },
      { title: "Trim ve List", description: "Gemi durumunun yük dağılımına etkisi" },
      { title: "Lashing ve Securing", description: "Yük bağlama ve sabitleme teknikleri" },
      { title: "IMSBC Code", description: "Dökme yük taşıma kuralları" },
      { title: "Container Stowage", description: "Konteyner istiflemesi ve ağırlık dağılımı" },
      { title: "Grain Loading", description: "Tahıl yükleme özel prosedürleri" }
    ],
    resources: [
      { title: "Yük Hesaplamaları", href: "/cargo/calculations" },
      { title: "Draft Survey Formülleri", href: "/cargo/formulas" },
      { title: "Yük Kuralları", href: "/cargo/rules" }
    ]
  },
  meteorology: {
    title: "Meteoroloji Konu Anlatımı",
    description: "Deniz meteorolojisi, hava tahminleri ve fırtına kaçınma stratejileri.",
    keyTopics: [
      { title: "Atmosfer Sistemleri", description: "Basınç sistemleri ve hava kütleleri" },
      { title: "Rüzgar ve Dalga", description: "Beaufort skalası ve dalga tahminleri" },
      { title: "Tropikal Siklonlar", description: "Kasırga ve tayfun navigasyonu" },
      { title: "Sis ve Görüş", description: "Kısıtlı görüş koşulları ve tedbirler" },
      { title: "Okyanus Akıntıları", description: "Akıntı sistemleri ve rota etkisi" },
      { title: "Hava Haritaları", description: "Synoptik harita okuma ve yorumlama" }
    ],
    resources: [
      { title: "Meteoroloji Hesaplamaları", href: "/weather" },
      { title: "Meteoroloji Formülleri", href: "/meteorology/formulas" },
      { title: "Meteoroloji Kuralları", href: "/meteorology/rules" }
    ]
  },
  seamanship: {
    title: "Gemicilik Konu Anlatımı",
    description: "Temel gemicilik becerileri, manevra teknikleri ve güverte operasyonları.",
    keyTopics: [
      { title: "Düğümler ve Bağlar", description: "Temel denizci düğümleri ve kullanım alanları" },
      { title: "Demirleme", description: "Demir atma ve alma prosedürleri" },
      { title: "Palamar Operasyonları", description: "Bağlama halatları ve güvenlik" },
      { title: "Römorkaj", description: "Römorkör operasyonları ve hesapları" },
      { title: "Manevra", description: "Gemi manevra karakteristikleri" },
      { title: "Vardiya Tutma", description: "Köprüüstü vardiya prosedürleri" }
    ],
    resources: [
      { title: "Gemicilik Hesaplamaları", href: "/seamanship/calculations" },
      { title: "Gemicilik Formülleri", href: "/seamanship/formulas" },
      { title: "Gemicilik Kuralları", href: "/seamanship/rules" }
    ]
  },
  safety: {
    title: "Denizde Güvenlik Konu Anlatımı",
    description: "Denizde can ve mal güvenliği, acil durum prosedürleri ve emniyet ekipmanları.",
    keyTopics: [
      { title: "SOLAS Gereklilikleri", description: "Denizde can güvenliği sözleşmesi" },
      { title: "Yangın Güvenliği", description: "Yangın önleme, tespit ve söndürme" },
      { title: "Can Kurtarma", description: "LSA ekipmanları ve kullanımı" },
      { title: "Terk Gemi", description: "Gemiyi terk prosedürleri" },
      { title: "İlk Yardım", description: "Denizde tıbbi müdahale" },
      { title: "SAR Operasyonları", description: "Arama kurtarma prosedürleri" }
    ],
    resources: [
      { title: "Güvenlik Hesaplamaları", href: "/safety" },
      { title: "Güvenlik Formülleri", href: "/safety/formulas" },
      { title: "Güvenlik Kuralları", href: "/safety/rules" }
    ]
  },
  machine: {
    title: "Gemi Makineleri Konu Anlatımı",
    description: "Gemi makine sistemleri, bakım prosedürleri ve performans optimizasyonu.",
    keyTopics: [
      { title: "Ana Makine", description: "Dizel motorlar ve çalışma prensipleri" },
      { title: "Yardımcı Makineler", description: "Jeneratörler, pompalar ve kompresörler" },
      { title: "Yakıt Sistemleri", description: "Yakıt hazırlama ve tüketim hesapları" },
      { title: "Soğutma Sistemleri", description: "Deniz suyu ve tatlı su soğutma" },
      { title: "Elektrik Sistemleri", description: "Gemi elektrik dağıtımı" },
      { title: "Bakım Yönetimi", description: "PMS ve bakım stratejileri" }
    ],
    resources: [
      { title: "Makine Hesaplamaları", href: "/machine/calculations" },
      { title: "Makine Formülleri", href: "/machine/formulas" },
      { title: "Makine Kuralları", href: "/machine/rules" }
    ]
  },
  environment: {
    title: "Çevre Koruma Konu Anlatımı",
    description: "Deniz çevresi koruma, emisyon kontrolü ve sürdürülebilir denizcilik.",
    keyTopics: [
      { title: "MARPOL Ekleri", description: "Uluslararası deniz kirliliği önleme" },
      { title: "Emisyon Kontrolü", description: "SOx, NOx ve CO2 düzenlemeleri" },
      { title: "Balast Yönetimi", description: "BWM Convention gereklilikleri" },
      { title: "Atık Yönetimi", description: "Gemi atıklarının bertarafı" },
      { title: "EEXI ve CII", description: "Enerji verimliliği göstergeleri" },
      { title: "Yeşil Denizcilik", description: "Sürdürülebilirlik stratejileri" }
    ],
    resources: [
      { title: "Çevre Hesaplamaları", href: "/environment/calculations" },
      { title: "Çevre Formülleri", href: "/environment/formulas" },
      { title: "Çevre Kuralları", href: "/environment/rules" }
    ]
  },
  economics: {
    title: "Deniz İşletmeciliği Konu Anlatımı",
    description: "Deniz ticareti, charter operasyonları ve ticari hesaplamalar.",
    keyTopics: [
      { title: "Charter Parties", description: "Voyage, time ve bareboat charter" },
      { title: "Navlun Hesapları", description: "Freight rate ve TCE hesaplamaları" },
      { title: "Laytime", description: "Yükleme/boşaltma süresi hesapları" },
      { title: "Demurrage", description: "Gecikme tazminatı hesaplamaları" },
      { title: "Voyage Estimation", description: "Sefer karlılık analizi" },
      { title: "Bunker Yönetimi", description: "Yakıt maliyeti optimizasyonu" }
    ],
    resources: [
      { title: "Ekonomi Hesaplamaları", href: "/economics" },
      { title: "Ekonomi Formülleri", href: "/economics/formulas" },
      { title: "Ekonomi Kuralları", href: "/economics/rules" }
    ]
  }
};

export default function LessonTopicsPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = calculationCategories.find(c => c.id === categoryId);
  const topicContent = categoryId ? topicsData[categoryId] : null;

  const highRefreshRateStyles: CSSProperties = {
    ["--frame-rate" as string]: "120",
    ["--animation-duration" as string]: "8.33ms",
    ["--transition-duration" as string]: "16.67ms",
  };

  if (!category || !topicContent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Kategori bulunamadı</p>
      </div>
    );
  }

  const CategoryIcon = category.icon;

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 px-4 py-8 dark:from-[hsl(220,50%,6%)] dark:via-[hsl(220,50%,8%)] dark:to-[hsl(220,50%,10%)]"
      data-no-translate
      style={highRefreshRateStyles}
    >
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-10 right-10 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col gap-6">
        {/* Header */}
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground backdrop-blur">
            <GraduationCap className="h-4 w-4" />
            Konu Anlatımı
          </div>
          
          <div className="flex items-center justify-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${category.accent} text-white shadow-lg`}>
              <CategoryIcon className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{topicContent.title}</h1>
          </div>
          
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
            {topicContent.description}
          </p>
        </header>

        {/* Key Topics */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Ana Konular</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topicContent.keyTopics.map((topic, index) => (
              <div
                key={index}
                className="group rounded-xl border border-border/40 bg-card/80 p-4 backdrop-blur transition-all hover:border-primary/30 hover:bg-card hover:shadow-md"
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${category.accent} text-white text-xs font-bold`}>
                    {index + 1}
                  </div>
                  <h3 className="font-medium text-foreground">{topic.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground">{topic.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="rounded-2xl border border-border/40 bg-card/80 p-6 backdrop-blur">
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Hızlı Erişim</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {topicContent.resources.map((resource, index) => (
              <Link
                key={index}
                to={resource.href}
                className="group flex items-center justify-between rounded-lg border border-border/40 bg-background/50 px-4 py-3 transition-all hover:border-primary/40 hover:bg-background"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{resource.title}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </section>

        {/* Back to Lessons */}
        <div className="flex justify-center pt-2">
          <Link
            to="/lessons"
            className="inline-flex items-center gap-2 rounded-full bg-card/60 px-4 py-2 text-xs text-muted-foreground backdrop-blur transition-colors hover:bg-card hover:text-foreground"
          >
            <BookOpen className="h-4 w-4" />
            Tüm Derslere Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
