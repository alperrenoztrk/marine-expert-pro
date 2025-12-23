import type { LucideIcon } from "lucide-react";
import { Anchor, BookOpen, Brain, Calculator, CloudSun, Compass, Leaf, ListChecks, Package, Shield, Ship, Sigma, TrendingUp, Wrench } from "lucide-react";

export type SectionId = "calculations" | "formulas" | "rules" | "assistant" | "quiz";
export type CategoryId =
  | "stability"
  | "navigation"
  | "cargo"
  | "meteorology"
  | "seamanship"
  | "safety"
  | "machine"
  | "environment"
  | "economics";
export type SectionStatus = "live" | "info" | "external" | "upcoming";

export interface SectionFallback {
  intro: string;
  highlights?: { title: string; detail: string }[];
  formulas?: { name: string; expression: string; note?: string }[];
  rules?: string[];
  assistantTips?: string[];
  quiz?: {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  };
  links?: { label: string; href: string; description?: string }[];
}

export interface SectionConfig {
  id: SectionId;
  label: string;
  description: string;
  status?: SectionStatus;
  href?: string;
  badge?: string;
  ctaLabel?: string;
  fallback?: SectionFallback;
}

export interface CategoryConfig {
  id: CategoryId;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accent: string;
  status?: SectionStatus;
  badge?: string;
  ctaLabel?: string;
  sections: SectionConfig[];
}

export const sectionIconMap: Record<SectionId, LucideIcon> = {
  calculations: Calculator,
  formulas: Sigma,
  rules: BookOpen,
  assistant: Brain,
  quiz: ListChecks,
};

export const calculationCategories: CategoryConfig[] = [
  {
    id: "stability",
    title: "Stabilite",
    subtitle: "",
    icon: Ship,
    accent: "from-blue-500 via-indigo-500 to-blue-600",
    badge: "Çekirdek",
    status: "live",
    ctaLabel: "Stabilite merkezine git",
    sections: [
      {
        id: "calculations",
        label: "Hesaplamalar",
        description: "GZ, GM, ağırlık kaydırma ve FWA araçları",
        status: "live",
        badge: "Hazır",
        ctaLabel: "Hesaplamaları aç",
        href: "/stability/calculations",
      },
      {
        id: "formulas",
        label: "Formüller",
        description: "Tüm stabilite formülleri ve açıklamaları",
        status: "live",
        badge: "Hazır",
        href: "/stability/formulas",
      },
      {
        id: "rules",
        label: "Kurallar",
        description: "IMO, IS Code ve klas limitleri",
        status: "live",
        badge: "Hazır",
        href: "/stability/rules",
      },
      {
        id: "assistant",
        label: "Asistan",
        description: "Stabilite danışmanı ve AI destekli öneriler",
        status: "live",
        badge: "Hazır",
        href: "/stability/assistant",
      },
      {
        id: "quiz",
        label: "Quiz",
        description: "Sınav soruları ve anlık geri bildirimler",
        status: "live",
        badge: "Hazır",
        href: "/stability/quiz",
      },
    ],
  },
  {
    id: "navigation",
    title: "Seyir",
    subtitle: "",
    icon: Compass,
    accent: "from-indigo-500 via-purple-500 to-blue-500",
    badge: "Günlük",
    status: "live",
    ctaLabel: "Seyir merkezine git",
    sections: [
      {
        id: "calculations",
        label: "Hesaplamalar",
        description: "Rota, ETA, yakıt ve gök cisimleri",
        status: "live",
        badge: "Hazır",
        ctaLabel: "Navigasyon araçları",
        href: "/navigation",
      },
      {
        id: "formulas",
        label: "Formüller",
        description: "Trigonometrik ve astronomik hesap tabloları",
        status: "live",
        badge: "Hazır",
        href: "/navigation/formulas",
      },
      {
        id: "rules",
        label: "Kurallar",
        description: "COLREG, STCW ve seyir jeneralleri",
        status: "live",
        badge: "Hazır",
        href: "/regulations",
      },
      {
        id: "assistant",
        label: "Asistan",
        description: "Seyir planı, meteoroloji ve VTS diyaloğu",
        status: "live",
        badge: "Hazır",
        href: "/navigation/assistant",
      },
      {
        id: "quiz",
        label: "Quiz",
        description: "COLREG, seyir astronomisi ve radar testleri",
        status: "live",
        badge: "Hazır",
        href: "/navigation/quiz",
      },
    ],
  },
  {
    id: "cargo",
    title: "Yük Elleçleme ve İstifleme",
    subtitle: "",
    icon: Package,
    accent: "from-amber-500 via-orange-500 to-rose-500",
    badge: "Operasyon",
    status: "live",
    ctaLabel: "Kargo menüsü",
    sections: [
      {
        id: "calculations",
        label: "Hesaplamalar",
        description: "Draft survey ve yükleme hesap modülleri",
        status: "live",
        badge: "Hazır",
        href: "/cargo/calculations",
      },
      {
        id: "formulas",
        label: "Formüller",
        description: "Standart draft survey formülleri ve örnekler",
        status: "live",
        badge: "Hazır",
        href: "/cargo/formulas",
      },
      {
        id: "rules",
        label: "Kurallar",
        description: "IMSBC, Grain Rules ve terminal prosedürleri",
        status: "live",
        badge: "Hazır",
        href: "/cargo/rules",
      },
      {
        id: "assistant",
        label: "Asistan",
        description: "AI ile yükleme sırası ve trim danışmanlığı",
        status: "live",
        badge: "Hazır",
        href: "/cargo/assistant",
      },
      {
        id: "quiz",
        label: "Quiz",
        description: "Draft survey ve yük hesap soruları",
        status: "live",
        badge: "Hazır",
        href: "/cargo/quiz",
      },
    ],
  },
  {
    id: "meteorology",
    title: "Meteoroloji",
    subtitle: "",
    icon: CloudSun,
    accent: "from-sky-500 via-cyan-500 to-blue-500",
    badge: "Hava",
    status: "live",
    ctaLabel: "Meteoroloji menüsü",
    sections: [
      {
        id: "calculations",
        label: "Hesaplamalar",
        description: "Rüzgâr, dalga, görüş ve yoğunluk araçları",
        status: "live",
        badge: "Hazır",
        href: "/weather",
      },
      {
        id: "formulas",
        label: "Formüller",
        description: "Rüzgâr, dalga ve atmosfer denklemleri",
        status: "live",
        badge: "Hazır",
        href: "/meteorology/formulas",
      },
      {
        id: "rules",
        label: "Kurallar",
        description: "SOLAS V/34, STCW VIII/2 ve WMO prosedürleri",
        status: "live",
        badge: "Hazır",
        href: "/meteorology/rules",
      },
      {
        id: "assistant",
        label: "Asistan",
        description: "Rota bazlı hava tavsiyeleri ve alarm eşikleri",
        status: "live",
        badge: "Hazır",
        href: "/meteorology/assistant",
      },
      {
        id: "quiz",
        label: "Quiz",
        description: "Beaufort, bulut türleri ve storm-avoidance soruları",
        status: "live",
        badge: "Hazır",
        href: "/meteorology/quiz",
      },
    ],
  },
  {
    id: "seamanship",
    title: "Gemicilik",
    subtitle: "",
    icon: Anchor,
    accent: "from-emerald-500 via-teal-500 to-blue-500",
    badge: "Güverte",
    status: "live",
    ctaLabel: "Gemicilik menüsü",
    sections: [
      {
        id: "calculations",
        label: "Hesaplamalar",
        description: "Palamar yükü, zincir katenary ve römorkör kuvvetleri",
        status: "live",
        badge: "Hazır",
        href: "/seamanship/calculations",
      },
      {
        id: "formulas",
        label: "Formüller",
        description: "Mooring, catenary ve rüzgâr yükü eşitlikleri",
        status: "live",
        badge: "Hazır",
        href: "/seamanship/formulas",
      },
      {
        id: "rules",
        label: "Kurallar",
        description: "COLREG, ISM, ISPS ve liman talimatları",
        status: "live",
        badge: "Hazır",
        href: "/seamanship/rules",
      },
      {
        id: "assistant",
        label: "Asistan",
        description: "Vardiya, bakım ve güvenlik için öneri setleri",
        status: "live",
        badge: "Hazır",
        href: "/seamanship/assistant",
      },
      {
        id: "quiz",
        label: "Quiz",
        description: "Demirleme, çarmıh ve vardiya senaryoları",
        status: "live",
        badge: "Hazır",
        href: "/seamanship/quiz",
      },
    ],
  },
  {
    id: "safety",
    title: "Denizde Güvenlik",
    subtitle: "",
    icon: Shield,
    accent: "from-rose-500 via-orange-500 to-amber-500",
    badge: "Kritik",
    status: "info",
    ctaLabel: "Emniyet menüsü",
    sections: [
      {
        id: "calculations",
        label: "Hesaplamalar",
        description: "Risk matrisi, yangın suyu ve kaçış süreleri",
        status: "live",
        badge: "Hazır",
        href: "/safety",
      },
      {
        id: "formulas",
        label: "Formüller",
        description: "Yangın söndürme, köpük ve CO2 miktar hesapları",
        status: "live",
        badge: "Hazır",
        href: "/safety/formulas",
      },
      {
        id: "rules",
        label: "Kurallar",
        description: "SOLAS, LSA, FFA ve ulusal otorite gereklilikleri",
        status: "live",
        badge: "Hazır",
        href: "/safety/rules",
      },
      {
        id: "assistant",
        label: "Asistan",
        description: "Risk değerlendirme ve denetim hazırlığı için AI",
        status: "live",
        badge: "Hazır",
        href: "/safety/assistant",
      },
      {
        id: "quiz",
        label: "Quiz",
        description: "SOLAS, ISM ve emniyet prosedürü soruları",
        status: "live",
        badge: "Hazır",
        href: "/safety/quiz",
      },
    ],
  },
  {
    id: "machine",
    title: "Gemi Makineleri",
    subtitle: "",
    icon: Wrench,
    accent: "from-slate-600 via-zinc-600 to-slate-800",
    badge: "Teknik",
    status: "info",
    ctaLabel: "Makine menüsü",
    sections: [
      {
        id: "calculations",
        label: "Hesaplamalar",
        description: "Yakıt tüketimi, SFOC, güç/enerji ve bakım KPI’ları",
        status: "live",
        badge: "Hazır",
        href: "/machine/calculations",
      },
      {
        id: "formulas",
        label: "Formüller",
        description: "Makine performansı ve tüketim için temel eşitlikler",
        status: "live",
        badge: "Hazır",
        href: "/machine/formulas",
      },
      {
        id: "rules",
        label: "Kurallar",
        description: "MARPOL Annex VI, ISM bakım yaklaşımı ve kayıtlar",
        status: "live",
        badge: "Hazır",
        href: "/machine/rules",
      },
      {
        id: "assistant",
        label: "Asistan",
        description: "Makine arızası, trend analizi ve bakım önerileri",
        status: "live",
        badge: "Hazır",
        href: "/machine/assistant",
      },
      {
        id: "quiz",
        label: "Quiz",
        description: "Makine sistemi senaryoları ve hızlı test",
        status: "live",
        badge: "Hazır",
        href: "/machine/quiz",
      },
    ],
  },
  {
    id: "environment",
    title: "Denizcilik ve Çevre Koruma",
    subtitle: "",
    icon: Leaf,
    accent: "from-emerald-600 via-green-600 to-teal-700",
    badge: "Yeşil",
    status: "live",
    ctaLabel: "Çevre menüsü",
    sections: [
      {
        id: "calculations",
        label: "Hesaplamalar",
        description: "CO₂/CO₂e, CII, EEXI ve raporlama hesapları",
        status: "live",
        badge: "Hazır",
        href: "/environment/calculations",
      },
      {
        id: "formulas",
        label: "Formüller",
        description: "Emisyon ve enerji verimliliği formülleri",
        status: "live",
        badge: "Hazır",
        href: "/environment/formulas",
      },
      {
        id: "rules",
        label: "Kurallar",
        description: "MARPOL, BWM, IMO DCS ve bölgesel raporlama",
        status: "live",
        badge: "Hazır",
        href: "/environment/rules",
      },
      {
        id: "assistant",
        label: "Asistan",
        description: "Denetim hazırlığı, kayıt kontrolü ve aksiyon önerileri",
        status: "live",
        badge: "Hazır",
        href: "/environment/assistant",
      },
      {
        id: "quiz",
        label: "Quiz",
        description: "MARPOL, atık ve balast yönetimi soru setleri",
        status: "live",
        badge: "Hazır",
        href: "/environment/quiz",
      },
    ],
  },
  {
    id: "economics",
    title: "Deniz İşletmeciliğinde Ticari Operasyonlar",
    subtitle: "",
    icon: TrendingUp,
    accent: "from-amber-400 via-yellow-500 to-orange-600",
    badge: "Finans",
    status: "info",
    ctaLabel: "Ekonomi araçları",
    sections: [
      {
        id: "calculations",
        label: "Hesaplamalar",
        description: "TCE, demurrage/despatch ve maliyet dökümleri",
        status: "live",
        badge: "Hazır",
        ctaLabel: "Hesapla",
        href: "/economics",
      },
      {
        id: "formulas",
        label: "Formüller",
        description: "Bunker, hız/yakıt eğrileri ve sefer planı",
        status: "info",
        badge: "Özet",
        href: "/economics",
      },
      {
        id: "assistant",
        label: "Asistan",
        description: "Kârlılık senaryoları için prompt setleri",
        status: "upcoming",
        badge: "Yakında",
      },
      {
        id: "rules",
        label: "Kurallar",
        description: "Charter party ve lojistik sözleşme kontrol listesi",
        status: "info",
        badge: "Bilgi",
        href: "/economics",
      },
      {
        id: "quiz",
        label: "Quiz",
        description: "Navlun hesap soruları ve mini senaryolar",
        status: "upcoming",
        badge: "Yakında",
      },
    ],
  },
];
