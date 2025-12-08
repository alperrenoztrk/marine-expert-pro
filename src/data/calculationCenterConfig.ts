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
        status: "info",
        fallback: {
          intro:
            "Kargo operasyonlarında draft survey, yük planlama ve terminal koordinasyonunun tek bir çatı altında ele alınması gerekir. Bölüm; hazırlık, uygulama ve raporlama adımlarını adım adım açıklar.",
          highlights: [
            {
              title: "Draft Survey Akışı",
              detail: "Baş/orta/kıç draft ölçümleri, yoğunluk düzeltmeleri ve TPC ile deplasman hesapları aynı formda toplanır.",
            },
            {
              title: "Yükleme Planı & Trim",
              detail: "Yük dağılımı, allowable GM, SF/BM limitleri ve balast stratejileri tek tabloda kıyaslanır.",
            },
            {
              title: "Operasyonel İzleme",
              detail: "Tank kalibrasyonları, pompa programları, konsinye raporları ve terminal logları eşlenir.",
            },
          ],
          links: [
            {
              label: "Regülasyon Rehberi",
              href: "/regulations",
              description: "IMSBC & ISGOTT referansları",
            },
          ],
        },
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
        status: "info",
        fallback: {
          intro: "Yükleme operasyonları uluslararası kodlar ve terminal talimatlarıyla sınırlandırılır.",
          rules: [
            "IMSBC Kodu - TML/Nem limitlerini, kargo sınıflandırmalarını ve özel taşıma şartlarını doğrulayın.",
            "Grain Rules - Serbest yüzey düzeltmeleri, KG/GM sınırları ve yük dağılımı kontrolleri zorunludur.",
            "ISGOTT & Terminal Talimatları - Gaz ölçümleri, sıcak iş izinleri ve manifold güvenliği aynı plan üzerinde tutulur.",
          ],
          links: [
            { label: "Regülasyonlar", href: "/regulations", description: "IMO, Flag ve terminal gereklilikleri" },
          ],
        },
      },
      {
        id: "assistant",
        label: "Asistan",
        description: "AI ile yükleme sırası ve trim danışmanlığı",
        status: "info",
        fallback: {
          intro: "Operasyon sırasında yapay zekâya aktarılacak standart soru şablonları burada listelenir.",
          assistantTips: [
            "\"Şu draft survey verilerini tablo halinde özetle ve kg/ton dönüşümünü yap.\"",
            "\"X ton yük için hangi tank kombinasyonu trim'i +/-0.10 m içinde tutar?\"",
            "\"Terminal pompa kapatma süresi 30 dk ise toplam operasyon süresi nasıl değişir?\"",
          ],
        },
      },
      {
        id: "quiz",
        label: "Quiz",
        description: "Draft survey ve yük hesap soruları",
        status: "info",
        fallback: {
          intro: "Hızlı kontrol için örnek sınav sorusu.",
          quiz: {
            question: "TPC değeri 25 ton/cm olan bir geminin draftı 8.80 m'den 9.05 m'ye çıktığında yaklaşık kaç ton yük alınmıştır?",
            options: ["250 ton", "375 ton", "625 ton", "900 ton"],
            answer: "625 ton",
            explanation: "Delta T = 0.25 m = 25 cm => 25 * 25 = 625 ton. Hesap: Ağırlık = TPC * Delta T (cm).",
          },
        },
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
        status: "info",
        fallback: {
          intro: "Seyir planlamasında en sık kullanılan meteorolojik denklemler özetlenmiştir.",
          formulas: [
            {
              name: "Gerçek Rüzgâr Hızı",
              expression: "Vt = sqrt(Va^2 + Vg^2 - 2*Va*Vg*cos(theta))",
              note: "Va: görünür rüzgâr, Vg: gemi hızı, theta: açı farkı.",
            },
            {
              name: "Hava Yoğunluğu",
              expression: "rho = P / (R * T)",
              note: "P: Pa, R = 287 J/kg*K, T: Kelvin.",
            },
            {
              name: "Derin Su Dalgaboyu",
              expression: "L = (g * T^2) / (2 * pi)",
              note: "T: periyot (s), g: 9.81 m/s^2.",
            },
          ],
        },
      },
      {
        id: "rules",
        label: "Kurallar",
        description: "SOLAS V/34, STCW VIII/2 ve WMO prosedürleri",
        status: "info",
        fallback: {
          intro: "Meteoroloji kullanımı SOLAS ve STCW altında zorunlu tutulur.",
          rules: [
            "SOLAS V/34 - Seyir planı hazırlanırken güncel meteorolojik veri kullanılmalıdır.",
            "IMO Weather Routing Guidelines - Şiddetli hava beklenen rotalarda kaçınma planı şarttır.",
            "STCW VIII/2 - Köprüüstü vardiya zabitleri meteorolojik veriyi sürekli değerlendirmelidir.",
          ],
          links: [
            { label: "Detaylı Meteoroloji", href: "/meteorology/topics", description: "Konu anlatımı ve vaka çalışmaları" },
          ],
        },
      },
      {
        id: "assistant",
        label: "Asistan",
        description: "Rota bazlı hava tavsiyeleri ve alarm eşikleri",
        status: "info",
        fallback: {
          intro: "Yapay zekâya sorulabilecek standart meteoroloji istemleri.",
          assistantTips: [
            "\"Şu koordinatlar arasında Beaufort 7 üzeri rüzgâr olasılığını çıkar.\"",
            "\"Rota üzerindeki dalga boyu >5 m ise alternatif rotayı puanla.\"",
            "\"Sıcaklık 0 deg C altına inerse hangi güverte operasyonları ertelenmeli?\"",
          ],
        },
      },
      {
        id: "quiz",
        label: "Quiz",
        description: "Beaufort, bulut türleri ve storm-avoidance soruları",
        status: "info",
        fallback: {
          intro: "Örnek meteoroloji sınav sorusu.",
          quiz: {
            question: "Beaufort 8 (Gale) rüzgârının yaklaşık hız aralığı nedir?",
            options: ["17-21 knot", "28-33 knot", "34-40 knot", "45-52 knot"],
            answer: "34-40 knot",
            explanation: "Beaufort 8 = Gale, 34-40 knot (62-74 km/s) aralığına karşılık gelir.",
          },
        },
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
        status: "info",
        fallback: {
          intro: "Operasyonel gemicilik hesaplamaları için temel yaklaşımlar.",
          highlights: [
            {
              title: "Palamar Yükleri",
              detail: "SWL x güvenlik katsayısı, rüzgâr/dalga yükü ve rıhtım açıları birlikte değerlendirilir.",
            },
            {
              title: "Zincir Katenary Analizi",
              detail: "Serbest uzunluk, dip sürtünmesi ve kilitleme kuvveti aynı grafik üzerinde tutulur.",
            },
            {
              title: "Römorkör Yardımı",
              detail: "Bollard Pull, yaklaşma hızı ve trim ilişkisiyle hesaplanır.",
            },
          ],
        },
      },
      {
        id: "formulas",
        label: "Formüller",
        description: "Mooring, catenary ve rüzgâr yükü eşitlikleri",
        status: "info",
        fallback: {
          intro: "Gemicilik sahasında sık kullanılan pratik formüller.",
          formulas: [
            {
              name: "Palamar Çalışma Yükü",
              expression: "Çalışma Yükü (kN) = (SWL * Güvenlik Katsayısı) / 1000",
              note: "Güvenlik katsayısı genelde 0.55-0.60 aralığındadır.",
            },
            {
              name: "Rüzgâr Kuvveti",
              expression: "F = 0.613 * C_D * A * V^2",
              note: "F: kN, A: m^2 cephe alanı, V: m/s rüzgâr hızı.",
            },
            {
              name: "Zincir Eğimi",
              expression: "T = W * sinh(s / a)",
              note: "W: birim uzunluk ağırlığı, s: yatay mesafe, a: katenary parametresi.",
            },
          ],
        },
      },
      {
        id: "rules",
        label: "Kurallar",
        description: "COLREG, ISM, ISPS ve liman talimatları",
        status: "info",
        fallback: {
          intro: "Gemicilik uygulamaları düzenleyici çerçevelerle desteklenmelidir.",
          rules: [
            "COLREG Kısım B - Manevra ve yol hakkı kuralları tüm vardiya planlarında referans alınır.",
            "ISM Kodu - Operasyonel risk değerlendirmesi ve kayıt tutma zorunludur.",
            "ISPS & Liman Talimatları - Güverte erişimleri, vardiya prosedürleri ve izinler kontrol edilir.",
          ],
          links: [
            { label: "Regülasyonlar", href: "/regulations", description: "COLREG, ISM, ISPS özetleri" },
          ],
        },
      },
      {
        id: "assistant",
        label: "Asistan",
        description: "Vardiya, bakım ve güvenlik için öneri setleri",
        status: "info",
        fallback: {
          intro: "Gemicilik asistanına sorulacak standart istemler.",
          assistantTips: [
            "\"Rüzgâr 35 kn olduğunda hangi palamar kombinasyonu önerilir?\"",
            "\"Ağır hava devriyelerinde vardiya süresini 2 saatten 3 saate çıkarmak güvenli mi?\"",
            "\"Demir taraması tespit edildiğinde uygulanacak acil durum akışını sırala.\"",
          ],
        },
      },
      {
        id: "quiz",
        label: "Quiz",
        description: "Demirleme, çarmıh ve vardiya senaryoları",
        status: "info",
        fallback: {
          intro: "Örnek gemicilik sorusu.",
          quiz: {
            question: "Baş tarafta 6 şakuli şamandıra hattı bulunan bir gemide rüzgâr 30 kn'a çıktığında hangi yönde palamar takviyesi önceliklidir?",
            options: [
              "Kıç spring hatları",
              "Baş spring hatları",
              "Kıç başüstü çaprazı",
              "Çift palamar takviyesi gereksiz",
            ],
            answer: "Baş spring hatları",
            explanation: "Rüzgâr baştan geldiğinde baş springler sürüklenmeyi sınırlar; gerekirse kıç başüstü takviye edilir.",
          },
        },
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
        status: "info",
        fallback: {
          intro: "Emniyet yönetim sistemi; planlama, uygulama ve kayıt döngüsüne dayanır.",
          highlights: [
            { title: "SMS Döngüsü", detail: "Planla-Uygula-Kontrol-Eylem mantığıyla riskler izlenir." },
            { title: "Muster & Drill", detail: "Haftalık tatbikat, equipment readiness ve log gereklidir." },
            { title: "İş İzinleri", detail: "Sıcak iş, tank girişi ve izole işlemler ayrı formlarla izlenir." },
          ],
        },
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
        status: "info",
        fallback: {
          intro: "LSA/FFA planlamasında kullanılan temel formüller.",
          formulas: [
            {
              name: "Köpük Çözeltisi Miktarı",
              expression: "Q = (Uygulama Hızı * Alan * Süre)",
              note: "Uygulama hızı: 6.5 L/m^2/dk (makine dairesi standartı).",
            },
            {
              name: "CO2 Miktarı",
              expression: "M = 1.5 * V * (rho_gas / rho_liq)",
              note: "V: korunan hacim, rho_gas ~ 1.84 kg/m^3 (20 deg C).",
            },
            {
              name: "Su Sisi Debisi",
              expression: "Q = K * sqrt(P)",
              note: "K: nozzle faktörü, P: bar.",
            },
          ],
        },
      },
      {
        id: "rules",
        label: "Kurallar",
        description: "SOLAS, LSA, FFA ve ulusal otorite gereklilikleri",
        status: "info",
        fallback: {
          intro: "Emniyet ve düzenlemeler bölümü; uluslararası konvansiyonları ve şirket talimatlarını aynı ekranda toplar.",
          rules: [
            "SOLAS Bölüm II-2 - Yangın güvenliği ve FFA donanımları.",
            "LSA Kodu - Can kurtarma araçlarının kapasite ve bakım gereklilikleri.",
            "ISM/ISPS - Dokümantasyon, iç denetim ve güvenlik seviyeleri.",
          ],
          links: [
            { label: "SOLAS Regülasyonları", href: "/solas/regulations", description: "Detaylı madde bazlı özet" },
            { label: "LSA / FFA Envanteri", href: "/solas/safety-equipment", description: "Ekipman şartları ve çizelgeler" },
          ],
        },
      },
      {
        id: "assistant",
        label: "Asistan",
        description: "Risk değerlendirme ve denetim hazırlığı için AI",
        status: "info",
        fallback: {
          intro: "Emniyet asistanına verilecek örnek istemler.",
          assistantTips: [
            "\"Güncel ISM iç denetim bulgularını aksiyon planına dönüştür.\"",
            "\"LSA kontrolleri gecikmişse PSC'de hangi belgeler istenir?\"",
            "\"FFA servis raporlarına göre hangi yedek parçalar sipariş edilmeli?\"",
          ],
        },
      },
      {
        id: "quiz",
        label: "Quiz",
        description: "SOLAS, ISM ve emniyet prosedürü soruları",
        status: "info",
        fallback: {
          intro: "Örnek emniyet sorusu.",
          quiz: {
            question: "SOLAS'a göre yolcu gemilerinde haftalık olarak yapılması zorunlu tatbikat nedir?",
            options: ["Yangın Tatbikatı", "Can.salımlı tatbikat", "Muster ve cankurtarma tatbikatı", "ISPS güvenlik tatbikatı"],
            answer: "Muster ve cankurtarma tatbikatı",
            explanation: "SOLAS III/19 gereği yolcu gemilerinde haftalık muster ve cankurtarma tatbikatı yapılır.",
          },
        },
      },
    ],
  },
];
