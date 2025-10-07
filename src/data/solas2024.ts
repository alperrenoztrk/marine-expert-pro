// Summarized outline for SOLAS 2024 Consolidated Edition (no verbatim text)
// This dataset intentionally provides brief, non-copyright summaries and structure only.

export type SOLAS2024Regulation = {
  id: string; // e.g., "Regulation I/1"
  title: string;
  summary: string; // short, paraphrased summary
};

export type SOLAS2024Chapter = {
  id: string; // e.g., "chapter1"
  chapter: string; // e.g., "Chapter I"
  title: string;
  overview: string; // short, paraphrased overview
  keyProvisions: string[]; // bullet summaries
  regulations: SOLAS2024Regulation[]; // partial, summarized list (expand as needed)
};

export const solas2024Chapters: SOLAS2024Chapter[] = [
  {
    id: "chapter1",
    chapter: "Chapter I",
    title: "General Provisions",
    overview:
      "Scope, tanımlar, uygulama, survey ve sertifikasyon çerçevesini özetler.",
    keyProvisions: [
      "Uygulama kapsamı ve gemi sınıfları",
      "Survey türleri ve periyotları",
      "Sertifika düzeni ve geçerlilik",
      "Bayrak devleti ve PSC kontrol çerçevesi",
    ],
    regulations: [
      {
        id: "I-1",
        title: "Application",
        summary:
          "Konvansiyonun hangi gemilere, sefer alanlarına ve koşullara uygulandığını belirler.",
      },
      {
        id: "I-2",
        title: "Definitions",
        summary: "Temel terimleri tanımlar; sonraki bölümlerdeki hükümler için referans olur.",
      },
      {
        id: "I-3",
        title: "Survey and certification",
        summary:
          "İnşa/ilk, periyodik ve ara survey düzenini ve buna bağlı sertifikaları çerçeveler.",
      },
    ],
  },
  {
    id: "chapter2-1",
    chapter: "Chapter II-1",
    title: "Construction — Subdivision and Stability, Machinery and Electrical Installations",
    overview:
      "Bölmeleme ve stabilite kriterleri ile makine ve elektrik tesislerine ilişkin asgari gerekleri özetler.",
    keyProvisions: [
      "Hasar bölmeleme ve su geçirmezlik",
      "İlk stabilite ve dinamik stabilite asgari kriterleri",
      "Acil güç kaynağı ve dağıtım",
      "Makine tesis güvenliği ve izleme",
    ],
    regulations: [
      {
        id: "II-1-A",
        title: "Subdivision and stability",
        summary:
          "Hasar senaryoları için bölmeleme ve su alma durumunda emniyetli yüzebilirlik esaslarını açıklar.",
      },
      {
        id: "II-1-B",
        title: "Machinery and electrical installations",
        summary:
          "Güç üretimi/dağıtımı, acil durum sistemleri ve elektrik güvenliği gerekliliklerini kapsar.",
      },
    ],
  },
  {
    id: "chapter2-2",
    chapter: "Chapter II-2",
    title: "Construction — Fire Protection, Fire Detection and Fire Extinction",
    overview:
      "Yangın önleme, algılama ve söndürme sistemlerinin tasarım, kurulum ve işletme esaslarını özetler.",
    keyProvisions: [
      "Yangın bütünleme ve malzeme sınırlamaları",
      "Algılama/alarma ve bölgelendirme",
      "Sabit söndürme sistemleri ve taşınabilir ekipman",
      "Kaçış yolları ve acil durum prosedürleri",
    ],
    regulations: [
      {
        id: "II-2-1",
        title: "General",
        summary:
          "Yangın güvenliği hedefleri ve fonksiyonel gereksinimler için temel çerçeve sağlar.",
      },
    ],
  },
  {
    id: "chapter3",
    chapter: "Chapter III",
    title: "Life-Saving Appliances and Arrangements",
    overview:
      "Cankurtarma araçları, donanımı, yerleşimi ve tatbikat gereksinimlerinin özetini verir.",
    keyProvisions: [
      "Can filikaları, can salları ve yeterlilikleri",
      "Kişisel can kurtarma teçhizatı",
      "Yerleştirme, indirme ve erişilebilirlik",
      "Mürettebat eğitimi ve tatbikat",
    ],
    regulations: [
      {
        id: "III-1",
        title: "General",
        summary:
          "LSA sistemlerinin performans hedefleri ve donanım gereksinimlerinin genel çerçevesi.",
      },
    ],
  },
  {
    id: "chapter4",
    chapter: "Chapter IV",
    title: "Radiocommunications",
    overview:
      "GMDSS gereklilikleri, ekipman asgari listesi ve işletme prosedürlerini özetler.",
    keyProvisions: [
      "Sea area A1–A4 kapsamları",
      "Zorunlu GMDSS ekipmanları",
      "Acil durum, emniyet ve rutin haberleşme",
      "Operatör yeterlilikleri ve testler",
    ],
    regulations: [],
  },
  {
    id: "chapter5",
    chapter: "Chapter V",
    title: "Safety of Navigation",
    overview:
      "Seyir emniyeti için teçhizat, prosedür ve köprüüstü organizasyon gerekliliklerini özetler.",
    keyProvisions: [
      "Zorunlu teçhizat: radar, AIS, ECDIS, VDR vb.",
      "Seyir planlaması ve kayıt",
      "Kaptan sorumlulukları ve raporlama",
      "Meteoroloji ve tehlike yayınları",
    ],
    regulations: [],
  },
  {
    id: "chapter6",
    chapter: "Chapter VI",
    title: "Carriage of Cargoes and Oil Fuels",
    overview: "Kargonun güvenli taşınması, istif ve emniyeti için genel esaslar.",
    keyProvisions: ["Kargo güvenliği", "Tahıl ve dökme yük stabilitesi", "Yakıt güvenliği"],
    regulations: [],
  },
  {
    id: "chapter7",
    chapter: "Chapter VII",
    title: "Carriage of Dangerous Goods",
    overview: "Tehlikeli yüklerin sınıflandırma, ambalajlama ve belge gereklilikleri (IMDG referanslı).",
    keyProvisions: ["Sınıflandırma ve ayrım", "Belgeleme", "Ambalaj ve işaretleme"],
    regulations: [],
  },
  {
    id: "chapter8",
    chapter: "Chapter VIII",
    title: "Nuclear Ships",
    overview: "Nükleer tahrikli gemiler için ek emniyet hükümlerinin özeti.",
    keyProvisions: ["Reaktör güvenliği", "Radyasyon korunması", "Acil durum planları"],
    regulations: [],
  },
  {
    id: "chapter9",
    chapter: "Chapter IX",
    title: "Management for the Safe Operation of Ships (ISM)",
    overview: "ISM Kodu kapsamında güvenli işletme yönetim sistemi esasları.",
    keyProvisions: ["Güvenlik politikası", "Sorumluluklar", "Dökümantasyon ve denetim"],
    regulations: [],
  },
  {
    id: "chapter10",
    chapter: "Chapter X",
    title: "Safety Measures for High-Speed Craft",
    overview: "Hızlı tekneler için ek tasarım ve operasyonel güvenlik önlemleri.",
    keyProvisions: ["Tasarım performansı", "Operasyon limitleri", "Eğitim"],
    regulations: [],
  },
  {
    id: "chapter11-1",
    chapter: "Chapter XI-1",
    title: "Special Measures to Enhance Maritime Safety",
    overview: "Emniyeti artırıcı özel tedbirlerin özeti (emniyet yönetimi, belgelendirme vb.).",
    keyProvisions: ["Ek surveyler", "Emniyet iyileştirmeleri"],
    regulations: [],
  },
  {
    id: "chapter11-2",
    chapter: "Chapter XI-2",
    title: "Special Measures to Enhance Maritime Security (ISPS)",
    overview: "ISPS Kodu kapsamındaki güvenlik önlemleri ve uyum esasları.",
    keyProvisions: ["Gemi ve liman tesisi güvenliği", "Güvenlik seviyeleri", "Plan ve denetimler"],
    regulations: [],
  },
  {
    id: "chapter12",
    chapter: "Chapter XII",
    title: "Additional Safety Measures for Bulk Carriers",
    overview: "Dökme yük gemileri için ek emniyet tedbirlerinin özeti.",
    keyProvisions: ["Yapısal dayanım", "Yükleme sınırlamaları", "İzleme"],
    regulations: [],
  },
  {
    id: "chapter13",
    chapter: "Chapter XIII",
    title: "Verification of Compliance (III Code)",
    overview: "Üye devletlerin IMO denetimine ilişkin çerçeve (III Kodu) özeti.",
    keyProvisions: ["IMO denetimleri", "Uygunluk doğrulaması"],
    regulations: [],
  },
  {
    id: "chapter14",
    chapter: "Chapter XIV",
    title: "Safety Measures for Ships Operating in Polar Waters",
    overview: "Kutup sularında çalışan gemiler için ek emniyet gerekliliklerinin özeti (Polar Code).",
    keyProvisions: ["Buz sınırlamaları", "Ekipman ve eğitim", "Operasyon planlaması"],
    regulations: [],
  },
];
