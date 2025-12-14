import type { LucideIcon } from "lucide-react";
import { Anchor, CloudSun, Compass, Leaf, Package, Shield, Ship, Wrench } from "lucide-react";

export type SectionId = "topics" | "calculations" | "formulas" | "rules" | "assistant" | "quiz";
export type CategoryId = "stability" | "navigation" | "cargo" | "meteorology" | "seamanship" | "safety" | "machine" | "environment";
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
  {
    id: "machine",
    title: "Makine Modülü",
    subtitle: "Ana makine, yardımcı makineler, yakıt ve bakım hesapları",
    icon: Wrench,
    accent: "from-slate-600 via-zinc-600 to-slate-800",
    sections: [
      {
        id: "topics",
        label: "Konu Anlatımı",
        description: "Makine dairesi sistemlerine hızlı, pratik bakış",
        status: "info",
        fallback: {
          intro:
            "Bu modül; ana makine, jeneratörler, yakıt/hava/egzoz, soğutma ve yağlama gibi temel sistemleri operasyonel perspektiften özetler. Hesap araçları bir sonraki iterasyonda aktive edilecektir.",
          highlights: [
            { title: "Ana Makine & Tahrik", detail: "Güç hattı, şaft, pervane ve temel performans kavramları" },
            { title: "Yardımcı Makineler", detail: "DG setler, kazan/ekonomizer ve servis sistemleri" },
            { title: "Yakıt Sistemi", detail: "SFOC, viskozite/ısıtma, purifier ve tüketim takibi" },
            { title: "Bakım Yönetimi", detail: "Planlı bakım, kritik ekipman, arıza kök neden yaklaşımı" },
          ],
          assistantTips: [
            "Gemi tipi, ana makine gücü (kW), sefer profili ve yakıt türünü vererek günlük yakıt tahmini iste.",
            "Soğutma suyu sıcaklık trendi ve alarm geçmişiyle olası arıza senaryosu analizi iste.",
            "Purifier performansı için ΔP, sıcaklık ve debi değerlerini ver; olası ayar önerisi iste.",
          ],
        },
      },
      {
        id: "calculations",
        label: "Hesaplamalar",
        description: "Yakıt tüketimi, SFOC, güç/enerji ve bakım KPI’ları",
        status: "upcoming",
        fallback: {
          intro:
            "Makine hesap araçları yakında eklenecek. Şimdilik en sık kullanılan pratik hesap kalıpları ve formüller aşağıda referans olarak yer alır.",
          formulas: [
            {
              name: "Yakıt Tüketimi (ton)",
              expression: "Fuel_t = P(kW) × SFOC(g/kWh) × t(h) / 1e6",
              note: "SFOC üretici eğrilerinden; P: ortalama şaft/elektrik gücü",
            },
            {
              name: "Enerji (kWh)",
              expression: "E = P(kW) × t(h)",
              note: "Jeneratör yük analizi ve günlük enerji bilançosu için",
            },
          ],
          rules: [
            "Günlük tüketim hesaplarında saatlik ortalama yük (kW) kullan; anlık pik değerlerle günlük toplam şişebilir.",
            "SFOC, yük yüzdesine bağlıdır; %50–%85 bandı genelde optimum bölgedir (tipik, makineye göre değişir).",
            "FO/LO/JCW sıcaklıkları trendlenmeli; tekil ölçüm yerine eğilim esas alınmalı.",
          ],
        },
      },
      {
        id: "formulas",
        label: "Formüller",
        description: "Makine performansı ve tüketim için temel eşitlikler",
        status: "info",
        fallback: {
          intro:
            "Bu bölüm, günlük operasyonlarda sık kullanılan makine performans ve tüketim formüllerini hızlı erişim için toplar.",
          formulas: [
            { name: "Güç (kW)", expression: "P = T(N·m) × ω(rad/s) / 1000", note: "T: tork, ω: açısal hız" },
            { name: "Açısal hız", expression: "ω = 2π × n(rpm) / 60" },
            { name: "Yakıt Tüketimi (kg)", expression: "Fuel_kg = P(kW) × SFOC(g/kWh) × t(h) / 1000" },
          ],
        },
      },
      {
        id: "rules",
        label: "Kurallar",
        description: "MARPOL Annex VI, ISM bakım yaklaşımı ve kayıtlar",
        status: "info",
        fallback: {
          intro:
            "Makine operasyonları; emisyon, yakıt kalite/uygunluk ve bakım yönetimi açısından birden fazla düzenleme ve şirket prosedürü ile kesişir.",
          rules: [
            "MARPOL Annex VI: yakıt kükürt limitleri, NOx gereklilikleri ve ilgili sertifikasyon kayıtları.",
            "ISM: kritik ekipman ve bakımın etkinliği; arıza/near-miss kayıtlarının kapatılması.",
            "Yakıt bunkering: BDN, numune, yoğunluk/viskozite takibi ve uyumsuzluk prosedürleri.",
          ],
          links: [
            { label: "Hesaplama Merkezine Dön", href: "/calculations", description: "Diğer modülleri görüntüle" },
          ],
        },
      },
      {
        id: "assistant",
        label: "Asistan",
        description: "Makine arızası, trend analizi ve bakım önerileri",
        status: "upcoming",
        fallback: {
          intro:
            "Makine asistanı yakında aktive edilecek. Şimdilik, iyi bir analiz için hangi verileri paylaşmanız gerektiğini aşağıda şablon olarak bulabilirsiniz.",
          assistantTips: [
            "Alarm/olay zamanı, ilgili sensör trendleri (son 24–72 saat), yük yüzdesi ve hava/deniz koşullarını ekle.",
            "Yakıt türü ve bunker tarihi; purifier ayarları ve filtre ΔP değerlerini ekle.",
            "Yapılan son bakım/part değişimleri ve arıza tekrarı bilgilerini ekle.",
          ],
        },
      },
      {
        id: "quiz",
        label: "Quiz",
        description: "Makine sistemi senaryoları ve hızlı test",
        status: "upcoming",
        fallback: {
          intro: "Makine modülü quiz içeriği yakında eklenecek.",
          quiz: {
            question: "SFOC neyi ifade eder?",
            options: ["Shaft Force Output Coefficient", "Specific Fuel Oil Consumption", "Safe Fuel Operation Code", "System Fuel Overheat Control"],
            answer: "Specific Fuel Oil Consumption",
            explanation: "SFOC, üretilen enerji başına tüketilen yakıtı (genellikle g/kWh) ifade eder.",
          },
        },
      },
    ],
  },
  {
    id: "environment",
    title: "Çevre Modülü",
    subtitle: "Emisyon, atık yönetimi, balast ve çevresel uyum hesapları",
    icon: Leaf,
    accent: "from-emerald-600 via-green-600 to-teal-700",
    sections: [
      {
        id: "topics",
        label: "Konu Anlatımı",
        description: "Gemide çevre yönetimi: emisyon, atık, balast, kayıtlar",
        status: "info",
        fallback: {
          intro:
            "Çevre modülü; MARPOL ekleri, atık yönetimi, balast suyu ve raporlama (DCS/MRV vb.) başlıklarını pratik kontrol listeleriyle bir araya getirir.",
          highlights: [
            { title: "Emisyon Yönetimi", detail: "Yakıt tüketimi, CO₂ hesapları, EEXI/CII mantığı" },
            { title: "Atık & Kayıtlar", detail: "Garbage Record Book, Oil Record Book, teslim tutanakları" },
            { title: "Balast Suyu", detail: "BWM prosedürleri, değişim/arıtma ve raporlama" },
            { title: "Uyum & Denetim", detail: "PSC hazırlığı, dokümantasyon ve uygunsuzluk yönetimi" },
          ],
          assistantTips: [
            "Yakıt türü, tüketim (ton) ve sefer mesafesiyle CO₂ ve basit yoğunluk metriklerini hesaplat.",
            "Atık teslim belgeleri ve kayıt defteri girişleri arasında tutarlılık kontrolü iste.",
            "Balast operasyonu için tank planı ve arıtma sistemi durumuyla risk değerlendirmesi iste.",
          ],
        },
      },
      {
        id: "calculations",
        label: "Hesaplamalar",
        description: "CO₂/CO₂e, yoğunluk metrikleri ve raporlama hesapları",
        status: "upcoming",
        fallback: {
          intro:
            "Çevre hesap araçları yakında eklenecek. Şimdilik en sık kullanılan emisyon/yoğunluk hesap şablonları aşağıdadır.",
          formulas: [
            { name: "CO₂ Emisyonu (ton)", expression: "CO2_t = Fuel_t × CF", note: "CF: yakıta göre karbon faktörü (IMO tabloları)" },
            { name: "Basit Emisyon Oranı", expression: "CO2_per_nm = CO2_t / Distance_nm", note: "Operasyonel kıyas için hızlı metrik" },
          ],
          rules: [
            "Aynı sefer için yakıt tüketimi, makine logu ve bunker kayıtları çapraz kontrol edilmelidir.",
            "CF (carbon factor) yakıt türüne bağlıdır; doğru yakıt sınıfını kullandığınızdan emin olun.",
          ],
        },
      },
      {
        id: "formulas",
        label: "Formüller",
        description: "Emisyon ve çevre KPI’ları için referans formüller",
        status: "info",
        fallback: {
          intro:
            "Bu bölüm, emisyon ve çevre performansına yönelik pratik formülleri tek yerde toplar. Resmî raporlama için her zaman ilgili mevzuat/rehberi esas alın.",
          formulas: [
            { name: "CO₂ (ton)", expression: "CO2_t = Fuel_t × CF" },
            { name: "Enerji (kWh)", expression: "E = P(kW) × t(h)" },
            { name: "Yakıt (ton)", expression: "Fuel_t = P(kW) × SFOC(g/kWh) × t(h) / 1e6" },
          ],
        },
      },
      {
        id: "rules",
        label: "Kurallar",
        description: "MARPOL, BWM, IMO DCS ve bölgesel raporlama",
        status: "info",
        fallback: {
          intro:
            "Çevre uyumu; global (IMO/MARPOL) ve bölgesel (ör. MRV) gereklilikler ile şirket prosedürlerinin birlikte yürütülmesini gerektirir.",
          rules: [
            "MARPOL Annex I–VI: petrol, kimyasal, atık, kanalizasyon ve hava emisyonları gereklilikleri.",
            "BWM Convention: balast suyu yönetimi, arıtma sistemi operasyonu ve kayıtlar.",
            "IMO DCS / bölgesel MRV: yakıt tüketimi ve sefer verilerinin doğruluğu, izlenebilirlik ve raporlama.",
          ],
          links: [
            { label: "Hesaplama Merkezine Dön", href: "/calculations", description: "Diğer modülleri görüntüle" },
          ],
        },
      },
      {
        id: "assistant",
        label: "Asistan",
        description: "Denetim hazırlığı, kayıt kontrolü ve aksiyon önerileri",
        status: "upcoming",
        fallback: {
          intro:
            "Çevre asistanı yakında aktive edilecek. Şimdilik denetim hazırlığı için veri toplama şablonları burada.",
          assistantTips: [
            "Son 30 gün: ORB/GRB girişleri, atık teslim belgeleri ve bunker BDN’leri ile tutarlılık kontrolü iste.",
            "Balast operasyonları için: tank listesi, arıtma sistemi durumu ve rota/liman kısıtlarını ekle.",
          ],
        },
      },
      {
        id: "quiz",
        label: "Quiz",
        description: "MARPOL, atık ve balast yönetimi soru setleri",
        status: "upcoming",
        fallback: {
          intro: "Çevre modülü quiz içeriği yakında eklenecek.",
          quiz: {
            question: "CO₂ emisyonu hesaplamasında en temel iki girdi nedir?",
            options: ["Draft & trim", "Yakıt tüketimi & carbon factor (CF)", "Rüzgâr & dalga", "RPM & tork"],
            answer: "Yakıt tüketimi & carbon factor (CF)",
            explanation: "En temel hesap CO₂ = yakıt tüketimi × yakıta özgü karbon faktörü yaklaşımıdır.",
          },
        },
      },
    ],
  },
];
