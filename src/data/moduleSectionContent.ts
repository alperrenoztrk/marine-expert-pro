import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Anchor,
  BarChart3,
  BookOpenCheck,
  ClipboardCheck,
  Droplets,
  Gauge,
  LifeBuoy,
  Navigation,
  Ruler,
  Scale,
  Shield,
  Ship,
  ThermometerSun,
  Waves,
  Wind,
} from "lucide-react";

export interface HeroStat {
  label: string;
  value: string;
  trend?: string;
}

export interface HighlightCard {
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
}

export interface TimelinePhase {
  title: string;
  detail: string;
  duration?: string;
}

export interface TimelineBlock {
  title: string;
  phases: TimelinePhase[];
}

export interface FrameworkBlock {
  title: string;
  steps: { title: string; detail: string }[];
}

export interface MatrixBlock {
  title: string;
  headers: string[];
  rows: { label: string; values: string[] }[];
}

export interface ResourceLink {
  label: string;
  description: string;
  href?: string;
}

export interface ChecklistBlock {
  title: string;
  items: string[];
}

export interface AssistantPrompt {
  prompt: string;
  context?: string;
}

export interface ActionCard {
  title: string;
  detail: string;
  chips?: string[];
  icon?: LucideIcon;
}

export interface CalloutBlock {
  title: string;
  items: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface QuizBlock {
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export interface ModuleSectionContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    stats?: HeroStat[];
  };
  highlightCards?: HighlightCard[];
  timeline?: TimelineBlock;
  frameworks?: FrameworkBlock[];
  matrix?: MatrixBlock;
  resources?: ResourceLink[];
  checklist?: ChecklistBlock;
  assistantPrompts?: AssistantPrompt[];
  actions?: ActionCard[];
  callouts?: CalloutBlock;
  quiz?: QuizBlock;
}

export const moduleSectionContent: Record<string, ModuleSectionContent> = {
  "cargo-topics": {
    hero: {
      badge: "Operasyon Dizilimi",
      title: "Kargo & Operasyon Konu Anlatımı",
      subtitle: "Draft survey, trim optimizasyonu ve terminal koordinasyonunun tamamı tek şablonda toplanır.",
      stats: [
        { label: "Hazırlık Formu", value: "12 adım", trend: "ISGOTT + Terminal gereklilikleri" },
        { label: "Yoğunluk Güncellemesi", value: "≤ 15 dk", trend: "Laboratuvar doğrulaması" },
        { label: "Trim Hedefi", value: "±0.10 m", trend: "GM & SF limitlerine göre" },
      ],
    },
    highlightCards: [
      {
        title: "Draft Survey Akışı",
        description: "Baş/orta/kıç draftları tek grid’de tutulur; TPC ve yoğunluk otomatik eşleşir.",
        icon: Gauge,
        badge: "Saha ölçümü",
      },
      {
        title: "Trim & KG Senaryoları",
        description: "Yük dağılımı, allowable GM ve balast stratejisi aynı görsel üzerinde gösterilir.",
        icon: Scale,
        badge: "Stabilite",
      },
      {
        title: "Operasyonel İzleme",
        description: "Pompa dizisi, rıhtım formları ve konsinye raporları gerçek zamanlı check list’e bağlanır.",
        icon: ClipboardCheck,
        badge: "Shift log",
      },
    ],
    timeline: {
      title: "Saha Akışı",
      phases: [
        { title: "Pre-Arrival", detail: "Risk değerlendirmesi, manifold checklist, terminal izinleri.", duration: "H-24" },
        { title: "Alongside", detail: "Draft survey, yoğunluk testi, yükleme planı onayı.", duration: "H" },
        { title: "Yükleme/Sıyırma", detail: "Pompa programı, kg/ton mutabakatı, raporlama.", duration: "H+1 ➜ ETD" },
      ],
    },
    resources: [
      { label: "Draft Survey Şablonu", description: "ISO standardı ağırlık dengesi sayfası." },
      { label: "Terminal Briefing", description: "Gaz ölçümü, sıcak iş ve izin akışı kontrol listesi." },
      { label: "Operasyon Logbook", description: "Saatlik yükleme ve balast değişim girdileri." },
    ],
  },
  "cargo-rules": {
    hero: {
      badge: "Regülasyon Kapsamı",
      title: "IMSBC, Grain Rules ve Terminal Limitleri",
      subtitle: "Kod referansları ile saha uygulamaları yan yana tutulur.",
      stats: [
        { label: "Uyum Kontrolü", value: "4 ana kod", trend: "Son revizyonlara göre" },
        { label: "Operasyon Kaydı", value: "3 zorunlu form", trend: "Terminal + Flag" },
      ],
    },
    matrix: {
      title: "Kod & Gereklilik Matrisi",
      headers: ["Amaç", "Kritik Gereklilikler", "Saha Kanıtı"],
      rows: [
        {
          label: "IMSBC",
          values: [
            "Nem & TML limitleri",
            "TML raporu, MSDS, taşıma koşulları",
            "Laboratuvar raporu + kaptan beyanı",
          ],
        },
        {
          label: "Grain Rules",
          values: [
            "Serbest yüzey etkisi",
            "KG limitleri, heeling deneyi, trimmer planı",
            "Stow plan + hesap raporu",
          ],
        },
        {
          label: "ISGOTT / Terminal",
          values: [
            "Gaz ölçümü ve izinli işler",
            "Hot-work, giriş izni, manifold güvenliği",
            "İmzalı izin formları",
          ],
        },
        {
          label: "Klas & Flag",
          values: [
            "Operasyon kayıtları",
            "Deklarasyon, PSC kontrol listeleri",
            "Resmi log + dijital kayıt",
          ],
        },
      ],
    },
    checklist: {
      title: "Günlük Uyum Kontrolü",
      items: [
        "Kargo kondüsyon raporu terminal ile eşlendi.",
        "MSDS ve izin formları köprüüstü + CCR’da.",
        "Tank topping / stripping prosedürü imzalandı.",
        "Operasyon sonunda joint survey planlandı.",
      ],
    },
    resources: [
      { label: "IMSBC Tablo 1.7", description: "Kargo sınıflandırması rehberi." },
      { label: "Terminal Standing Orders", description: "Yerel kısıtlar ve hızı limitleri." },
    ],
  },
  "cargo-assistant": {
    hero: {
      badge: "AI Operasyon Partneri",
      title: "Kargo Asistanı",
      subtitle: "Draft survey verilerini anlık olarak yorumlayıp aksiyon önerir.",
      stats: [
        { label: "Veri Girişi", value: "İki dakika", trend: "CSV / manuel" },
        { label: "Öneri Seti", value: "5 hazır şablon", trend: "Trim & KG" },
      ],
    },
    actions: [
      {
        title: "Trim Dengeleme",
        detail: "AI, balast tankı kombinasyonlarını allowable GM ile eşler.",
        chips: ["GM ≥ 0.75 m", "SF/BM ≤ 0.85"],
        icon: Scale,
      },
      {
        title: "Yük Programı",
        detail: "Pompa debisi ve manifold limitlerini dakik bazda doğrular.",
        chips: ["Debi: 2.200 m³/h", "Shore sync"],
        icon: Gauge,
      },
      {
        title: "Rapor Otomasyonu",
        detail: "Draft survey sonuçlarını pdf + terminal formatında üretir.",
        chips: ["CSV", "PDF", "e-mail"],
        icon: ClipboardCheck,
      },
    },
    assistantPrompts: [
      { prompt: "Bu draft survey verisinden alınan tonajı hesapla ve yoğunluk düzeltmesini uygula." },
      { prompt: "Trim’i ±0.10 m’de tutmak için hangi tank kombinasyonu yeterli olur?" },
      { prompt: "Terminal pompa ayrılış süresi 30 dk ise ETA nasıl değişir?" },
    ],
    callouts: {
      title: "Bağlı Veri Kaynakları",
      items: [
        "Draft survey CSV veya manuel form girişi",
        "Terminal debi ve manifold limitleri",
        "Kargo planı (loadicator çıktısı)",
      ],
    },
    resources: [
      { label: "Prompt Kitaplığı", description: "Sık sorulan 12 operasyon senaryosu." },
      { label: "Veri Şablonu", description: "CSV kolon yapısı ve örnek kayıtlar." },
    ],
  },
  "cargo-quiz": {
    hero: {
      badge: "Operasyon Testi",
      title: "Draft Survey & Yük Denge Quiz",
      subtitle: "Gerçek sahadan alınmış mini senaryolar ile bilgiyi doğrula.",
    },
    quiz: {
      title: "Hızlı Kontrol",
      description: "Her soru tek bir hesap veya karar noktasını test eder.",
      questions: [
        {
          question: "TPC değeri 28 ton/cm olan bir gemide draft 9.10 m’den 9.32 m’ye çıktı. Kaç ton yük alınmıştır?",
          options: ["420 ton", "560 ton", "616 ton", "840 ton"],
          answer: "616 ton",
          explanation: "ΔT = 0.22 m = 22 cm → 22 * 28 = 616 ton.",
        },
        {
          question: "KG 7.8 m, allowable KG 8.1 m. 300 ton yük üst güverteye alınacaksa trim korumak için hangi aksiyon kritiktir?",
          options: [
            "1 No balast tankı boşaltılır",
            "Alt tavalara 180 ton balast alınır",
            "Yük orta kesim yerine kıç ambarlara alınır",
            "Mevcut kg değeri sınır içinde, aksiyon gerekmez",
          ],
          answer: "Alt tavalara 180 ton balast alınır",
          explanation: "Üst güverte yükü KG'yi yükseltir; balast ile KG geri çekilir.",
        },
        {
          question: "Terminal 1.800 m³/h debi limitine sahip. Geminin pompa kapasitesi 2.200 m³/h. 24.000 tonluk kargo tahliyesi kaç saat sürer?",
          options: ["10.9 saat", "12.5 saat", "13.3 saat", "14.8 saat"],
          answer: "13.3 saat",
          explanation: "24.000 ton ≈ 24.000 m³ varsayımıyla 24.000 / 1.800 = 13.3 saat.",
        },
      ],
    },
  },
  "meteorology-formulas": {
    hero: {
      badge: "Hesap Şablonları",
      title: "Meteoroloji Formül Seti",
      subtitle: "Gerçek ve görünür rüzgâr, dalga boyu ve atmosfer yoğunluğu hesapları tek kartta.",
      stats: [
        { label: "Güncel tablolar", value: "2025 Rev.1" },
        { label: "Hazır makrolar", value: "6 form", trend: "Excel & Python" },
      ],
    },
    highlightCards: [
      {
        title: "Gerçek Rüzgâr",
        description: "Vt = sqrt(Va² + Vg² - 2·Va·Vg·cosθ). Köprüüstü hız düzeltmeleri için hazır.",
        icon: Wind,
      },
      {
        title: "Hava Yoğunluğu",
        description: "ρ = P / (R·T). Makine önden verilen barometre değerlerini doğrudan kullan.",
        icon: ThermometerSun,
      },
      {
        title: "Derin Su Dalgaboyu",
        description: "L = (g·T²) / (2π). Rota optimizasyonu için dalga boyu tahmini.",
        icon: Waves,
      },
    ],
    frameworks: [
      {
        title: "Gerçek Rüzgâr Senaryosu",
        steps: [
          { title: "1. Açı Ölçümü", detail: "Pruva referanslı görünür rüzgâr açısı kaydedilir." },
          { title: "2. Hız Dönüşümü", detail: "Geminin sürati knot→m/s dönüştürülür." },
          { title: "3. Formül Uygulaması", detail: "Trigonometrik hesapla Vt ve yön elde edilir." },
        ],
      },
      {
        title: "Deniz Durumu Tahmini",
        steps: [
          { title: "Periyot Verisi", detail: "Uydu / boğaz raporundan alınır." },
          { title: "Dalga Boyu", detail: "Derin su denklemiyle hesaplanır." },
          { title: "Limiti Karşılaştır", detail: "Geminin manevra limitleri ile kıyaslanır." },
        ],
      },
    ],
    resources: [
      { label: "Excel Makroları", description: "Va→Vt dönüşümü ve polar diyagram." },
      { label: "Python Notebook", description: "Synoptic girdi ile toplu hesap." },
    ],
  },
  "meteorology-rules": {
    hero: {
      badge: "Uyum Takibi",
      title: "SOLAS V/34, STCW VIII/2 ve WMO",
      subtitle: "Seyir planı boyunca meteorolojik veri kullanımına dair zorunluluklar.",
      stats: [
        { label: "Briefing Süresi", value: "15 dk", trend: "Deniz güncellemesi" },
        { label: "Rapor Aralığı", value: "6 saat", trend: "WMO tavsiyesi" },
      ],
    },
    matrix: {
      title: "Regülasyon Matrisi",
      headers: ["Amaç", "Kanıt", "Not"],
      rows: [
        {
          label: "SOLAS V/34",
          values: [
            "Rota planında meteoroloji zorunlu.",
            "Passage plan + hava kaynakları",
            "Her değişimde revize edilir.",
          ],
        },
        {
          label: "IMO Weather Routing",
          values: [
            "Şiddetli hava kaçınma planı.",
            "Alternatif rota + karar kriterleri",
            "≥ Beaufort 7 için yazılı prosedür.",
          ],
        },
        {
          label: "STCW VIII/2",
          values: [
            "Vardiya zabiti sürekli değerlendirme yapar.",
            "Bridge log + radar overlay",
            "Bridge Resource Management ile uyumlu.",
          ],
        },
      ],
    },
    timeline: {
      title: "Uyum Döngüsü",
      phases: [
        { title: "Pre-Sail", detail: "Synoptic haritalar, routing brief, imza.", duration: "T-6h" },
        { title: "En-Route", detail: "6 saatlik güncelleme, alarmlar.", duration: "Seyir" },
        { title: "Post-Voyage", detail: "Voyage review, lesson learned.", duration: "ETA+12h" },
      ],
    },
    checklist: {
      title: "Günlük Kontrol",
      items: [
        "Routing sağlayıcısından son uyarı alındı.",
        "Bridge log’da rüzgâr/dalga kaydı güncel.",
        "Alternatif rota kriterleri gözden geçirildi.",
      ],
    },
  },
  "meteorology-assistant": {
    hero: {
      badge: "AI Meteoroloji",
      title: "Rota Bazlı Hava Danışmanı",
      subtitle: "Synoptic ve gemi sensör verisini işleyerek rota önerileri üretir.",
      stats: [
        { label: "Veri Kaynağı", value: "GRIB + Sensor" },
        { label: "Öneri Süresi", value: "< 30 sn" },
      ],
    },
    actions: [
      {
        title: "Beaufort Risk Skoru",
        detail: "Planlanan rota boyunca >BF7 segmentlerini vurgular.",
        chips: ["Polar diyagram", "Wave limit"],
        icon: Wind,
      },
      {
        title: "VTS Diyaloğu",
        detail: "METAREA raporlarını standart formatta özetler.",
        chips: ["NAVTEX", "SafetyNet"],
        icon: Navigation,
      },
      {
        title: "Operasyon Alarmı",
        detail: "Görüş < 2 NM olduğunda ekipman önerilerini gösterir.",
        chips: ["RADAR", "Seyir ışıkları"],
        icon: AlertTriangle,
      },
    },
    assistantPrompts: [
      { prompt: "Şu koordinatlar arasında Beaufort 7 üzeri rüzgâr olasılığını çıkar." },
      { prompt: "Dalga boyu 5 m’yi aştığında alternatif rota puanlaması yap." },
      { prompt: "0 °C altı sıcaklıklarda güverte operasyonları için ne önerirsin?" },
    ],
    callouts: {
      title: "Veri Beslemeleri",
      items: ["GRIB 1° grid", "Gemiden alınan AWS verisi", "Routing sağlayıcı API"],
    },
  },
  "meteorology-quiz": {
    hero: {
      badge: "Hava Durumu Testi",
      title: "Meteoroloji Quiz",
      subtitle: "Beaufort, bulut türleri ve storm-avoidance için 3 kritik soru.",
    },
    quiz: {
      title: "Seyir Öncesi Hatırlatma",
      description: "Formülü bilmenin yanı sıra karar kriterini ölçer.",
      questions: [
        {
          question: "Beaufort 8 rüzgârı için tipik hız aralığı hangisidir?",
          options: ["17-21 kn", "28-33 kn", "34-40 kn", "45-52 kn"],
          answer: "34-40 kn",
          explanation: "Gale şiddeti 34-40 kn aralığına denk gelir.",
        },
        {
          question: "Görünür rüzgâr 25 kn, gemi 12 kn hızla rüzgâr yönüne 30° açı yapıyor. Gerçek rüzgâr yaklaşık kaç kn’dır?",
          options: ["14 kn", "18 kn", "22 kn", "29 kn"],
          answer: "22 kn",
          explanation: "Vt ≈ √(25² + 12² - 2·25·12·cos30°) ≈ 22 kn.",
        },
        {
          question: "Sıcak cephe geçişinde beklenen bulut sıralaması aşağıdakilerden hangisidir?",
          options: [
            "Cumulus → Stratocumulus → Nimbostratus",
            "Cirrus → Cirrostratus → Altostratus → Nimbostratus",
            "Cumulonimbus → Altocumulus → Stratus",
            "Stratus → Cirrus → Cumulus",
          ],
          answer: "Cirrus → Cirrostratus → Altostratus → Nimbostratus",
          explanation: "Sıcak cephede yüksek katmanlı bulutlar önden gelir.",
        },
      ],
    },
  },
  "seamanship-calculations": {
    hero: {
      badge: "Uygulamalı Hesaplar",
      title: "Gemicilik Hesap Modülü",
      subtitle: "Palamar yükleri, zincir katenary ve römorkör kuvvetlerini tek tabloda çözümlersin.",
      stats: [
        { label: "Örnek Senaryo", value: "6 adet" },
        { label: "Hazır Formül", value: "9 adet" },
      ],
    },
    highlightCards: [
      {
        title: "Palamar Yükü",
        description: "SWL x güvenlik katsayısı + rüzgâr/dalga bileşeni.",
        icon: Anchor,
      },
      {
        title: "Zincir Katenary",
        description: "Serbest uzunluk, dip sürtünmesi ve kilitleme kuvveti grafiği.",
        icon: Waves,
      },
      {
        title: "Römorkör Yardımı",
        description: "Bollard pull, yaklaşma hızı ve trim ilişkisi.",
        icon: Ship,
      },
    ],
    frameworks: [
      {
        title: "Palamar Kuvveti Adımları",
        steps: [
          { title: "Çevresel yük hesapla", detail: "Rüzgâr ve akıntı kuvveti kN cinsine çevrilir." },
          { title: "Hat geometrisini belirle", detail: "Açı ve katedilen uzunluk ile faktör bulunur." },
          { title: "Emniyet katsayısı uygula", detail: "SWL * 0.55–0.60 aralığı kullanılır." },
        ],
      },
      {
        title: "Katenary Analizi",
        steps: [
          { title: "Dip Noktasını Bul", detail: "Serbest uzunluk / zemine sürtünme." },
          { title: "Kuvvet Hesabı", detail: "T = W * sinh(s/a) eşitliği." },
          { title: "Kilitleme Kararı", detail: "Dipteki sürtünme güvenlik katsayısı > 1,2 olmalı." },
        ],
      },
    ],
    resources: [
      { label: "Palamar Kartı", description: "Kıç/baş hat dizilimi şablonu." },
      { label: "Römorkör Excel", description: "Bollard pull hesaplayıcısı." },
    ],
  },
  "seamanship-formulas": {
    hero: {
      badge: "Formül Defteri",
      title: "Gemicilik Formülleri",
      subtitle: "Mooring, katenary ve rüzgâr yükü denklemleri sahada kullanılabilir formatta.",
    },
    highlightCards: [
      {
        title: "Çalışma Yükü",
        description: "ÇY = (SWL × Güvenlik Katsayısı) / 1000",
        icon: Scale,
      },
      {
        title: "Rüzgâr Kuvveti",
        description: "F = 0.613 × C_D × A × V²",
        icon: Wind,
      },
      {
        title: "Zincir Eğimi",
        description: "T = W × sinh(s / a)",
        icon: Waves,
      },
    ],
    matrix: {
      title: "Parametre Referansı",
      headers: ["Parametre", "Tipik Değer", "Not"],
      rows: [
        { label: "Güvenlik Katsayısı", values: ["0.55 – 0.60", "IACS tavsiyesi"] },
        { label: "C_D", values: ["1.1 – 1.3", "Yüksek üst yapı"] },
        { label: "W (kN/m)", values: ["2 – 4", "12 cm zincir için"] },
      ],
    },
  },
  "seamanship-rules": {
    hero: {
      badge: "Vardiya Gereklilikleri",
      title: "COLREG, ISM, ISPS ve Liman Talimatları",
      subtitle: "Gemicilik operasyonları için zorunlu kayıt ve prosedür akışı.",
    },
    matrix: {
      title: "Uyum Tablosu",
      headers: ["Amaç", "Uygulama", "Kanıt"],
      rows: [
        {
          label: "COLREG B",
          values: ["Manevra ve yol hakkı", "Gözlemci tayini, çağrı planı", "Bridge log + VHF kaydı"],
        },
        {
          label: "ISM",
          values: ["Risk analizi", "Vardiya briefing, toolbox meeting", "SWP formu"],
        },
        {
          label: "ISPS",
          values: ["Giriş kontrolü", "Watch list, erişim logu", "SSP kayıtları"],
        },
        {
          label: "Liman Talimatı",
          values: ["Yerel kısıtlar", "Palamar demirleme kombinasyonu", "Terminal imza formu"],
        },
      ],
    },
    checklist: {
      title: "Vardiya Checklist",
      items: [
        "Bridge resource team tamamlandı.",
        "Palamar/çarmık gözetimi atandı.",
        "ISPS güvenlik seviyeleri doğrulandı.",
        "Terminal alarm kanalları test edildi.",
      ],
    },
  },
  "seamanship-assistant": {
    hero: {
      badge: "AI Vardiya Fonu",
      title: "Gemicilik Asistanı",
      subtitle: "Demirleme, ağır hava ve bakım görevlerinde öneri paketleri üretir.",
      stats: [
        { label: "Senaryo Şablonu", value: "14 adet" },
        { label: "Öneri Süresi", value: "5 sn" },
      ],
    },
    actions: [
      {
        title: "Palamar Kombinasyonu",
        detail: "Rüzgâr 35 kn olduğunda tavsiye edilen hat dizilimini verir.",
        chips: ["Çift spring", "Yedek çapraz"],
        icon: Anchor,
      },
      {
        title: "Ağır Hava Vardiyası",
        detail: "Watch rota, alarm eşikleri ve limitli operasyon rehberi sunar.",
        chips: ["2h cycle", "Bridge + Forecastle"],
        icon: Wind,
      },
      {
        title: "Bakım Takvimi",
        detail: "Palamar makarası, zincir yağlama ve deck walkdown planını listeler.",
        chips: ["48h", "Logbook"],
        icon: Ruler,
      },
    },
    assistantPrompts: [
      { prompt: "Rüzgâr 35 kn olduğunda hangi palamar kombinasyonu önerilir?" },
      { prompt: "Demir taraması görüldüğünde uygulanacak acil durum akışını sırala." },
      { prompt: "Ağır hava devriyelerinde vardiya süresini 3 saate uzatmak güvenli mi?" },
    ],
  },
  "seamanship-quiz": {
    hero: {
      badge: "Gemicilik Testi",
      title: "Mooring & Watchkeeping Quiz",
      subtitle: "Demirleme, çarmık kontrolü ve vardiya kararlarına odaklı sorular.",
    },
    quiz: {
      title: "Hazırlık Soruları",
      description: "Her soru tek vardiya kararını ölçer.",
      questions: [
        {
          question: "Baş tarafta 6 şakuli şamandıra hattı bulunan bir gemide rüzgâr 30 kn baştan esiyor. İlk güçlendirme hangisi olmalı?",
          options: ["Kıç spring hatları", "Baş spring hatları", "Kıç başüstü çaprazı", "Ek güçlendirme gerekmez"],
          answer: "Baş spring hatları",
          explanation: "Rüzgâr baştan geldiğinde baş springler sürüklenmeyi sınırlar.",
        },
        {
          question: "Demirdeyken tarama alarmı 0.2 NM sapma gösterdi. İlk aksiyon nedir?",
          options: ["Makine hazırlığı", "İkinci demiri funde etmek", "VTS’ye rapor", "Balastı boşaltmak"],
          answer: "Makine hazırlığı",
          explanation: "Kısa sürede manevra hazır olmak kritik ilk adımdır.",
        },
        {
          question: "Römorkör çekişinde bollard pull 45 ton, gerekli kuvvet 52 ton. Çözüm?",
          options: [
            "İkinci römorkör iste",
            "Çekiş açısını 20° artır",
            "Sürati 2 kn düşür",
            "Trim’i kıça al",
          ],
          answer: "İkinci römorkör iste",
          explanation: "Gerekli kuvvet mevcut römorkörü aşar; ilave BP gerekir.",
        },
      ],
    },
  },
  "safety-topics": {
    hero: {
      badge: "SMS Çerçevesi",
      title: "Emniyet Konu Anlatımı",
      subtitle: "SMS döngüsü, muster organizasyonu ve izinli işler aynı sayfada.",
      stats: [
        { label: "SMS Adımı", value: "4", trend: "Planla-Uygula-Kontrol-Eylem" },
        { label: "Tatbikat Sıklığı", value: "7 gün", trend: "SOLAS III/19" },
      ],
    },
    highlightCards: [
      {
        title: "SMS Döngüsü",
        description: "Risk belirle, mitigasyon uygula, kaydet ve sürekli iyileştir.",
        icon: Shield,
      },
      {
        title: "Muster & Drill",
        description: "Haftalık tatbikat takvimi, rol kartları ve ekipman kontrolü.",
        icon: LifeBuoy,
      },
      {
        title: "İzinli İşler",
        description: "Sıcak iş, tank girişi ve izole prosedürü tek formda takip edilir.",
        icon: ClipboardCheck,
      },
    ],
    timeline: {
      title: "Haftalık Emniyet Döngüsü",
      phases: [
        { title: "Pazartesi", detail: "SMS risk review + toolbox," },
        { title: "Çarşamba", detail: "Drill + ekipman test," },
        { title: "Cuma", detail: "Lesson learned + plan update." },
      ],
    },
    resources: [
      { label: "SMS Manueli", description: "Revizyon 2025/03 – dijital erişim." },
      { label: "Tatbikat Şablonları", description: "Yangın, can kurtarma, kirlilik." },
    ],
  },
  "safety-formulas": {
    hero: {
      badge: "LSA / FFA Hesapları",
      title: "Emniyet Formülleri",
      subtitle: "Köpük çözeltisi, CO₂ ve su sisi kapasite hesapları.",
      stats: [
        { label: "Kontrol Noktası", value: "3 temel hesap" },
      ],
    },
    highlightCards: [
      { title: "Köpük Debisi", description: "Q = Uygulama hızı × Alan × Süre", icon: Waves },
      { title: "CO₂ Kütlesi", description: "M = 1.5 × V × (ρ_gas / ρ_liq)", icon: Gauge },
      { title: "Su Sisi", description: "Q = K × √P", icon: Droplets },
    ] as HighlightCard[],
    frameworks: [
      {
        title: "Yangın Pompa Hesabı",
        steps: [
          { title: "Korunan Alanı Belirle", detail: "m² cinsinden net alan." },
          { title: "Standart Hızı Uygula", detail: "6.5 L/m²/dk makine dairesi." },
          { title: "Toplam Süreyi Ekle", detail: "≥ 20 dk gerekliliği." },
        ],
      },
      {
        title: "CO₂ Şarjı",
        steps: [
          { title: "Hacmi Hesapla", detail: "Korunan hacim (m³)." },
          { title: "Çarpan Uygula", detail: "1.5 x V formülü." },
          { title: "Depolama Kontrolü", detail: "Silindir sayısı ve %10 rezerv." },
        ],
      },
    ],
  },
  "safety-rules": {
    hero: {
      badge: "Regülasyon Haritası",
      title: "SOLAS, LSA, FFA ve Ulusal Gereklilikler",
      subtitle: "Denetim sırasında istenen doküman ve test akışı.",
      stats: [
        { label: "Denetim Süresi", value: "≤ 3 saat", trend: "PSC hedefi" },
      ],
    },
    matrix: {
      title: "Uyum Tablosu",
      headers: ["Gereklilik", "İspat", "Sıklık"],
      rows: [
        { label: "SOLAS II-2", values: ["Yangın planı", "Ekipman test raporu", "Aylık"] },
        { label: "LSA Kodu", values: ["Can salı sertifikası", "Servis fişi", "Yıllık"] },
        { label: "ISM / ISPS", values: ["Denetim raporu", "Aksiyon planı", "6 ay"] },
        { label: "Ulusal Otorite", values: ["Form 13", "Liman tutanakları", "Değişken"] },
      ],
    },
    checklist: {
      title: "PSC Hazırlık",
      items: [
        "LSA ve FFA sertifikaları güncel.",
        "Drill kayıtları imzalı.",
        "Risk değerlendirme dosyası kolay erişimde.",
        "Yetkili listesi köprüüstünde.",
      ],
    },
  },
  "safety-assistant": {
    hero: {
      badge: "Denetim Koçu",
      title: "Emniyet Asistanı",
      subtitle: "Risk değerlendirme ve denetim hazırlığını otomatikleştirir.",
      stats: [
        { label: "Kontrol Listesi", value: "28 madde" },
        { label: "Öneri Süresi", value: "8 sn" },
      ],
    },
    actions: [
      {
        title: "Risk Matrisi",
        detail: "İzinli iş veya yeni operasyon için olasılık/etki puanını hesaplar.",
        chips: ["5x5", "ALARP"],
        icon: BarChart3,
      },
      {
        title: "Denetim Hazırlığı",
        detail: "LSA/FFA eksiklerini listeler, sorumlulara görev açar.",
        chips: ["SMS task", "Due date"],
        icon: ClipboardCheck,
      },
      {
        title: "Doküman Paketi",
        detail: "SOLAS referansları, raporlar ve lesson learned özetini tek dosyada toplar.",
        chips: ["PDF", "Share link"],
        icon: BookOpenCheck,
      },
    },
    assistantPrompts: [
      { prompt: "Güncel ISM iç denetim bulgularını aksiyon planına dönüştür." },
      { prompt: "LSA kontrolleri gecikmişse PSC’de hangi belgeler istenir?" },
      { prompt: "FFA servis raporuna göre hangi yedek parçalar sipariş edilmeli?" },
    ],
    callouts: {
      title: "Girdi Kaynakları",
      items: ["Risk matrisi şablonu", "Drill kayıtları", "Servis raporları"],
    },
  },
  "safety-quiz": {
    hero: {
      badge: "Emniyet Testi",
      title: "SOLAS & ISM Quiz",
      subtitle: "Denetim öncesi temel bilgileri hatırlatır.",
    },
    quiz: {
      title: "Kontrol Soruları",
      description: "5 dakikalık hızlı değerlendirme.",
      questions: [
        {
          question: "SOLAS III/19’a göre yolcu gemilerinde hangi tatbikat haftalık zorunludur?",
          options: ["Yangın tatbikatı", "Cansalımlı tatbikat", "Muster ve cankurtarma", "ISPS tatbikatı"],
          answer: "Muster ve cankurtarma",
          explanation: "SOLAS III/19 haftalık musterı şart koşar.",
        },
        {
          question: "CO₂ tüplerinin %10’dan fazlası ağırlık limitinin altına düşerse ilk aksiyon nedir?",
          options: [
            "PSCO’ya rapor et",
            "Yedek tüpleri devreye al",
            "Tam takım servise gönder",
            "Sadece etkilenen tüpleri işaretle",
          ],
          answer: "Tam takım servise gönder",
          explanation: "LSA/FFA gereği parti halinde kalibre edilir.",
        },
        {
          question: "Hot-work izninde gaz ölçümü kaç dakikada bir tekrar edilmeli?",
          options: ["15 dk", "30 dk", "60 dk", "Sadece başlangıçta"],
          answer: "30 dk",
          explanation: "ISGOTT tavsiyesi ≤30 dk aralık.",
        },
      ],
    },
  },
};

export type SectionContentKey = keyof typeof moduleSectionContent;
