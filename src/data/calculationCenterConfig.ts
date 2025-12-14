import type { LucideIcon } from "lucide-react";
import { Anchor, CloudSun, Compass, Package, Shield, Ship } from "lucide-react";

export type SectionId = "topics" | "calculations" | "formulas" | "rules" | "assistant" | "quiz";
export type CategoryId = "stability" | "navigation" | "cargo" | "meteorology" | "seamanship" | "safety";
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
  fallback?: SectionFallback;
}

export interface CategoryConfig {
  id: CategoryId;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accent: string;
  sections: SectionConfig[];
}

export const calculationCategories: CategoryConfig[] = [
  {
    id: "stability",
    title: "Stabilite Hesaplayıcısı",
    subtitle: "GM, GZ, IMO kriterleri ve ileri analizler",
    icon: Ship,
    accent: "from-blue-500 via-indigo-500 to-blue-600",
    sections: [
      {
        id: "topics",
        label: "Konu Anlatımı",
        description: "Temel ve ileri stabilite dersleri",
        status: "live",
        href: "/stability/topics",
      },
      {
        id: "calculations",
        label: "Hesaplamalar",
        description: "GZ, GM, ağırlık kaydırma ve FWA araçları",
        status: "live",
        href: "/stability/calculations",
      },
      {
        id: "formulas",
        label: "Formüller",
        description: "Tüm stabilite formülleri ve açıklamaları",
        status: "live",
        href: "/stability/formulas",
      },
      {
        id: "rules",
        label: "Kurallar",
        description: "IMO, IS Code ve klas limitleri",
        status: "live",
        href: "/stability/rules",
      },
      {
        id: "assistant",
        label: "Asistan",
        description: "Stabilite danışmanı ve AI destekli öneriler",
        status: "live",
        href: "/stability/assistant",
      },
      {
        id: "quiz",
        label: "Quiz",
        description: "Sınav soruları ve anlık geri bildirimler",
        status: "live",
        href: "/stability/quiz",
      },
    ],
  },
  {
    id: "navigation",
    title: "Seyir Hesaplayıcısı",
    subtitle: "Rota, astro seyir ve COLREG pratikleri",
    icon: Compass,
    accent: "from-indigo-500 via-purple-500 to-blue-500",
    sections: [
      {
        id: "topics",
        label: "Konu Anlatımı",
        description: "Güncel seyir doktrinleri ve vaka analizleri",
        status: "live",
        href: "/navigation/topics",
      },
      {
        id: "calculations",
        label: "Hesaplamalar",
        description: "Rota, ETA, yakıt ve gök cisimleri",
        status: "live",
        href: "/navigation",
      },
      {
        id: "formulas",
        label: "Formüller",
        description: "Trigonometrik ve astronomik hesap tabloları",
        status: "live",
        href: "/navigation/formulas",
      },
      {
        id: "rules",
        label: "Kurallar",
        description: "COLREG, STCW ve seyir jeneralleri",
        status: "live",
        href: "/regulations",
      },
      {
        id: "assistant",
        label: "Asistan",
        description: "Seyir planı, meteoroloji ve VTS diyaloğu",
        status: "live",
        href: "/navigation/assistant",
      },
      {
        id: "quiz",
        label: "Quiz",
        description: "COLREG, seyir astronomisi ve radar testleri",
        status: "live",
        href: "/navigation/quiz",
      },
    ],
  },
  {
    id: "cargo",
    title: "Kargo & Operasyon Araçları",
    subtitle: "Draft survey, yükleme planı ve operasyonel takip",
    icon: Package,
    accent: "from-amber-500 via-orange-500 to-rose-500",
    sections: [
      {
        id: "topics",
        label: "Konu Anlatımı",
        description: "Yükleme öncesi prosedürler ve saha akışı",
        status: "live",
        href: "/cargo/topics",
      },
      {
        id: "calculations",
        label: "Hesaplamalar",
        description: "Draft survey ve yükleme hesap modülleri",
        status: "live",
        href: "/cargo/calculations",
      },
      {
        id: "formulas",
        label: "Formüller",
        description: "Standart draft survey formülleri ve örnekler",
        status: "live",
        href: "/cargo/formulas",
      },
      {
        id: "rules",
        label: "Kurallar",
        description: "IMSBC, Grain Rules ve terminal prosedürleri",
        status: "live",
        href: "/cargo/rules",
      },
      {
        id: "assistant",
        label: "Asistan",
        description: "AI ile yükleme sırası ve trim danışmanlığı",
        status: "live",
        href: "/cargo/assistant",
      },
      {
        id: "quiz",
        label: "Quiz",
        description: "Draft survey ve yük hesap soruları",
        status: "live",
        href: "/cargo/quiz",
      },
    ],
  },
  {
    id: "meteorology",
    title: "Meteoroloji Araçları",
    subtitle: "Tahmin, hava raporu ve rota optimizasyonu",
    icon: CloudSun,
    accent: "from-sky-500 via-cyan-500 to-blue-500",
    sections: [
      {
        id: "topics",
        label: "Konu Anlatımı",
        description: "Detaylı meteoroloji ve oşinografi dersleri",
        status: "live",
        href: "/meteorology/topics",
      },
      {
        id: "calculations",
        label: "Hesaplamalar",
        description: "Rüzgâr, dalga, görüş ve yoğunluk araçları",
        status: "live",
        href: "/weather",
      },
      {
        id: "formulas",
        label: "Formüller",
        description: "Rüzgâr, dalga ve atmosfer denklemleri",
        status: "live",
        href: "/meteorology/formulas",
      },
      {
        id: "rules",
        label: "Kurallar",
        description: "SOLAS V/34, STCW VIII/2 ve WMO prosedürleri",
        status: "live",
        href: "/meteorology/rules",
      },
      {
        id: "assistant",
        label: "Asistan",
        description: "Rota bazlı hava tavsiyeleri ve alarm eşikleri",
        status: "live",
        href: "/meteorology/assistant",
      },
      {
        id: "quiz",
        label: "Quiz",
        description: "Beaufort, bulut türleri ve storm-avoidance soruları",
        status: "live",
        href: "/meteorology/quiz",
      },
    ],
  },
  {
    id: "seamanship",
    title: "Gemicilik Araçları",
    subtitle: "Demirleme, palamar, ağır hava ve vardiya yönetimi",
    icon: Anchor,
    accent: "from-emerald-500 via-teal-500 to-blue-500",
    sections: [
      {
        id: "topics",
        label: "Konu Anlatımı",
        description: "Gemicilik konu başlıkları ve görsel anlatımlar",
        status: "live",
        href: "/seamanship/topics",
      },
      {
        id: "calculations",
        label: "Hesaplamalar",
        description: "Palamar yükü, zincir katenary ve römorkör kuvvetleri",
        status: "live",
        href: "/seamanship/calculations",
      },
      {
        id: "formulas",
        label: "Formüller",
        description: "Mooring, catenary ve rüzgâr yükü eşitlikleri",
        status: "live",
        href: "/seamanship/formulas",
      },
      {
        id: "rules",
        label: "Kurallar",
        description: "COLREG, ISM, ISPS ve liman talimatları",
        status: "live",
        href: "/seamanship/rules",
      },
      {
        id: "assistant",
        label: "Asistan",
        description: "Vardiya, bakım ve güvenlik için öneri setleri",
        status: "live",
        href: "/seamanship/assistant",
      },
      {
        id: "quiz",
        label: "Quiz",
        description: "Demirleme, çarmıh ve vardiya senaryoları",
        status: "live",
        href: "/seamanship/quiz",
      },
    ],
  },
  {
    id: "safety",
    title: "Emniyet & Düzenlemeler",
    subtitle: "IMO, SOLAS, LSA/FFA ve ISM kapsamı",
    icon: Shield,
    accent: "from-rose-500 via-orange-500 to-amber-500",
    sections: [
      {
        id: "topics",
        label: "Konu Anlatımı",
        description: "SMS, muster organizasyonu ve izinli işler",
        status: "live",
        href: "/safety/topics",
      },
      {
        id: "calculations",
        label: "Hesaplamalar",
        description: "Risk matrisi, yangın suyu ve kaçış süreleri",
        status: "live",
        href: "/safety",
      },
      {
        id: "formulas",
        label: "Formüller",
        description: "Yangın söndürme, köpük ve CO2 miktar hesapları",
        status: "live",
        href: "/safety/formulas",
      },
      {
        id: "rules",
        label: "Kurallar",
        description: "SOLAS, LSA, FFA ve ulusal otorite gereklilikleri",
        status: "live",
        href: "/safety/rules",
      },
      {
        id: "assistant",
        label: "Asistan",
        description: "Risk değerlendirme ve denetim hazırlığı için AI",
        status: "live",
        href: "/safety/assistant",
      },
      {
        id: "quiz",
        label: "Quiz",
        description: "SOLAS, ISM ve emniyet prosedürü soruları",
        status: "live",
        href: "/safety/quiz",
      },
    ],
  },
];
