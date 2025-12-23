export type ShipDutyTask = {
  title: string;
  responsible: string;
  details: string;
};

export type ShipDutyIcon = "Waves" | "Cog" | "Anchor" | "ShieldCheck";

export type ShipDutyArea = {
  area: string;
  summary: string;
  accent: string;
  icon: ShipDutyIcon;
  tasks: ShipDutyTask[];
};

export const shipDuties: ShipDutyArea[] = [
  {
    area: "Köprüüstü Operasyonları",
    summary: "Seyir planlama, vardiya düzeni ve gemi trafik raporlaması ile ilgili temel işler.",
    accent: "from-sky-500 via-blue-500 to-indigo-600",
    icon: "Waves",
    tasks: [
      {
        title: "Seyir Planı & Güncellemeler",
        responsible: "Kaptan / 1. Zabit",
        details: "Passage plan hazırlanması, ECDIS/harita güncellemesi, NAVTEX ve MSI takibi.",
      },
      {
        title: "Vardiya Organizasyonu",
        responsible: "1. Zabit",
        details: "Köprüüstü vardiyalarının ataması, log kayıtları ve köprüüstü checklistlerinin takibi.",
      },
      {
        title: "GMDSS & VHF Raporları",
        responsible: "2. Zabit / GMDSS Operator",
        details: "Günlük DSC testleri, trafik raporlamaları ve seyir uyarılarının yayınlanması.",
      },
    ],
  },
  {
    area: "Makine Dairesi",
    summary: "Enerji üretimi, soğutma, yakıt sistemleri ve yardımcı makinelerin işletilmesi.",
    accent: "from-amber-600 via-orange-500 to-yellow-500",
    icon: "Cog",
    tasks: [
      {
        title: "Ana & Yardımcı Makineler",
        responsible: "Baş Mühendis / 2. Mühendis",
        details: "Start/stop prosedürleri, yük paylaşımı ve kritik parametrelerin günlük izlenmesi.",
      },
      {
        title: "Yakıt & Yağlama Sistemleri",
        responsible: "2. Mühendis",
        details: "Separatör operasyonu, transfer/bunkering planı ve tank seviye balansının takibi.",
      },
      {
        title: "Güç Yönetimi & Switchboard",
        responsible: "Elektrik Zabiti",
        details: "Jeneratör senkronizasyonu, UPS/şarj sistemleri ve acil durum devrelerinin kontrolü.",
      },
    ],
  },
  {
    area: "Güverte & Yük Operasyonları",
    summary: "Yük güvenliği, güverte makineleri ve emniyetli operasyon hazırlıkları.",
    accent: "from-emerald-500 via-teal-500 to-sky-500",
    icon: "Anchor",
    tasks: [
      {
        title: "Kargo Operasyonları",
        responsible: "3. Zabit / Güverte Amirliği",
        details: "Draft survey adımları, yükleme planı kontrolleri ve emniyet bariyerlerinin kurulması.",
      },
      {
        title: "Güverte Makineleri",
        responsible: "Bosun / Usta Gemici",
        details: "Irgat, vinç ve mooring ekipmanlarının pre-use kontrolü ve günlük bakım işleri.",
      },
      {
        title: "Tank & Güverte Temizliği",
        responsible: "Güverte Ekibi",
        details: "Tank yıkama planı, güverte yıkama ve kaymayı önleyici önlemlerin uygulanması.",
      },
    ],
  },
  {
    area: "Emniyet & Acil Durum",
    summary: "Tatbikat planları, ekipman hazır bulunuşluğu ve dokümantasyon takibi.",
    accent: "from-rose-500 via-red-500 to-orange-500",
    icon: "ShieldCheck",
    tasks: [
      {
        title: "Acil Durum Tatbikatları",
        responsible: "Kaptan / SSO / Safety Officer",
        details: "GMDSS, yangın, can kurtarma ve sızıntı tatbikatlarının planlanması ve kayıtlanması.",
      },
      {
        title: "ISM / ISPS Dokümantasyonu",
        responsible: "Kaptan / SSO",
        details: "Checklist, risk değerlendirmesi, permit-to-work ve günlük raporların güncel tutulması.",
      },
      {
        title: "Kişisel Koruyucu Donanım",
        responsible: "Safety Officer / Bosun",
        details: "PPE envanteri, dağıtımı ve ekipmanların periyodik kontrol planlarının yürütülmesi.",
      },
    ],
  },
];
