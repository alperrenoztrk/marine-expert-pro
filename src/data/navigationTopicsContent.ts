export interface NavigationTopicPage {
  title: string;
  summary: string;
  bullets: string[];
  imageSrc: string;
  imageAlt: string;
  motionCue?: string;
  detailBlocks?: Array<{ title: string; items: string[] }>;
  references?: string[];
  updatedAt?: string;
}

export interface NavigationTopicSection {
  id: string;
  title: string;
  pages: NavigationTopicPage[];
  calculationLinks?: Array<{ title: string; href: string }>;
  accuracyChecklist?: string[];
  pdfResource?: { title: string; href: string; description?: string };
}

const defaultReferences = [
  "IMO Model Course 7.03 — Bridge watchkeeping temelleri",
  "Admiralty NP 136 (The Mariner’s Handbook) — operasyonel rehber",
  "Admiralty Sailing Directions (NP serisi) — yerel seyir bilgileri",
  "IHO S-4 — Chart Specifications",
];

const referenceSets: Record<string, string[]> = {
  routePlanning: [
    "Bowditch Chapter 24 — The Sailings (Plane, Mercator, Great Circle)",
    "IMO Model Course 7.03 — Passage Planning esasları",
    "Admiralty NP 5011 — Chart Symbols & Abbreviations",
    "Admiralty Sailing Directions (NP serisi) — rota kısıtları",
    "IHO S-4 — Chart Specifications",
  ],
  navigationFundamentals: [
    "IMO STCW Code A-VIII/2 — Watchkeeping prensipleri",
    "IMO Model Course 7.03 — Bridge Procedures",
    "COLREG 1972 Rule 6–8 — emniyetli seyir ve çarpışmayı önleme",
    "Admiralty NP 136 (The Mariner’s Handbook) — temel seyir ilkeleri",
    "Admiralty Sailing Directions (NP serisi) — operasyonel notlar",
  ],
  bowditchSummary: [
    "Bowditch — The American Practical Navigator (2014 PDF)",
    "Bowditch Chapter 5 — Short Range Aids to Navigation",
    "Bowditch Chapter 6 — Nautical Charts",
    "Bowditch Chapter 8 — Piloting",
    "Bowditch Chapter 11 — Satellite Navigation",
    "Bowditch Chapter 13 — Radar Navigation",
    "Bowditch Chapter 14 — Electronic Charts",
    "Bowditch Chapter 15–20 — Celestial Navigation serisi",
    "Bowditch Chapter 24 — The Sailings",
  ],
  mercatorRhumb: [
    "Bowditch Chapter 24 — The Sailings (Mercator Sailing)",
    "Bowditch Chapter 6 — Nautical Charts",
    "Admiralty Manual of Navigation Vol. 1 — Mercator/loxodrome",
    "Admiralty NP 5011 — Chart Symbols & Abbreviations",
    "IMO Model Course 7.03 — Chartwork uygulamaları",
  ],
  greatCircle: [
    "Bowditch Chapter 24 — Great Circle Sailing",
    "Bowditch Chapter 24 — Composite Sailing",
    "Admiralty Manual of Navigation Vol. 1 — Great circle rotaları",
    "IMO Model Course 7.03 — Rota planlama",
    "Admiralty Sailing Directions (NP serisi) — kıyı kısıtları",
  ],
  celestial: [
    "Bowditch Chapter 15 — Navigational Astronomy",
    "Bowditch Chapter 16 — Instruments for Celestial Navigation",
    "Bowditch Chapter 17 — Azimuths and Amplitudes",
    "Bowditch Chapter 18 — Time",
    "Bowditch Chapter 19 — The Almanacs",
    "Bowditch Chapter 20 — Sight Reduction",
    "Admiralty Nautical Almanac — göksel veriler",
    "Admiralty NP 401 — Sight Reduction Tables",
  ],
  tides: [
    "Admiralty Tide Tables (ATT) — HW/LW verileri",
    "Admiralty Tidal Stream Atlases (NP serisi) — akıntı bilgileri",
    "Admiralty NP 136 (The Mariner’s Handbook) — gelgit notları",
    "IHO S-4 — Charted tides & heights",
  ],
  currentWind: [
    "Admiralty Tidal Stream Atlases (NP serisi) — set/drift bilgileri",
    "Admiralty NP 136 (The Mariner’s Handbook) — akıntı etkileri",
    "IMO Model Course 7.03 — set/drift uygulamaları",
    "Admiralty Sailing Directions (NP serisi) — yerel akıntılar",
  ],
  ukc: [
    "IMO Resolution A.893(21) — Passage Planning",
    "Admiralty NP 136 (The Mariner’s Handbook) — UKC & squat",
    "Admiralty Sailing Directions (NP serisi) — sığ su notları",
    "IHO S-4 — charted depths",
  ],
  radar: [
    "Bowditch Chapter 13 — Radar Navigation",
    "IMO Model Course 1.08 — Radar Navigation",
    "IMO Model Course 1.07 — ARPA",
    "Admiralty Manual of Navigation Vol. 1 — radar watchkeeping",
    "COLREG 1972 — radar kullanımı kuralları",
  ],
  ecdis: [
    "Bowditch Chapter 14 — Electronic Charts",
    "IMO Model Course 1.27 — ECDIS",
    "IHO S-52 — ECDIS Presentation Library",
    "IHO S-57/S-101 — ENC veri standartları",
    "Admiralty NP 5011 — ENC sembol referansı",
  ],
  gnss: [
    "Bowditch Chapter 11 — Satellite Navigation",
    "IMO MSC.112(73) — GNSS Performance Standards",
    "IMO Resolution A.915(22) — GNSS performance",
    "Admiralty List of Radio Signals (NP serisi) — GNSS servisleri",
  ],
  safety: [
    "COLREG 1972 — emniyetli hız ve gözcülük",
    "IMO STCW Code A-VIII/2 — watchkeeping",
    "Admiralty NP 136 (The Mariner’s Handbook) — güvenli seyir",
    "IMO Resolution A.893(21) — Passage Planning",
  ],
  humanFactors: [
    "IMO Model Course 1.22 — Bridge Teamwork",
    "IMO STCW Code A-VIII/2 — watchkeeping",
    "Admiralty NP 136 (The Mariner’s Handbook) — insan faktörü notları",
    "IMO Model Course 7.03 — bridge procedures",
  ],
  restrictedWaters: [
    "IMO Resolution A.893(21) — Passage Planning",
    "Admiralty Sailing Directions (NP serisi) — kısıtlı su notları",
    "Admiralty NP 136 (The Mariner’s Handbook) — restricted waters",
    "IALA Maritime Buoyage System — kanal işaretleri",
  ],
  coastal: [
    "Bowditch Chapter 8 — Piloting",
    "Bowditch Chapter 5 — Short Range Aids to Navigation",
    "Admiralty NP 5011 — Chart Symbols & Abbreviations",
    "Admiralty List of Lights & Fog Signals (NP serisi)",
    "Admiralty Sailing Directions (NP serisi) — kıyı referansları",
  ],
  chartMarks: [
    "Bowditch Chapter 5 — Short Range Aids to Navigation",
    "Bowditch Chapter 6 — Nautical Charts",
    "IALA Maritime Buoyage System — Region A/B",
    "IHO S-52 — ECDIS Presentation Library",
    "Admiralty NP 5011 — Chart Symbols & Abbreviations",
  ],
  pilotage: [
    "IMO Resolution A.960 — Pilot transfer arrangements",
    "Admiralty Sailing Directions (NP serisi) — pilotaj notları",
    "IMO Model Course 7.03 — pilotage procedures",
    "Admiralty NP 136 (The Mariner’s Handbook) — pilotaj rehberi",
  ],
  passageAudit: [
    "IMO Resolution A.893(21) — Passage Planning",
    "IMO STCW Code A-VIII/2 — watchkeeping records",
    "Admiralty NP 136 (The Mariner’s Handbook) — plan kontrolü",
    "IMO Model Course 7.03 — plan denetimi",
  ],
  heavyWeather: [
    "IMO Resolution A.893(21) — Passage Planning",
    "Admiralty NP 136 (The Mariner’s Handbook) — heavy weather",
    "Admiralty Sailing Directions (NP serisi) — meteoroloji notları",
    "IMO Model Course 7.03 — heavy weather seamanship",
  ],
  iceNavigation: [
    "IMO Polar Code — operasyonel kısıtlar",
    "Admiralty Sailing Directions (NP serisi) — ice notes",
    "Admiralty NP 136 (The Mariner’s Handbook) — ice navigation",
    "IMO Model Course 7.03 — ice navigation",
  ],
  maneuvering: [
    "IMO Resolution A.751(18) — ship manoeuvrability",
    "Admiralty NP 136 (The Mariner’s Handbook) — manevra limitleri",
    "IMO Model Course 7.03 — ship handling",
    "Admiralty Sailing Directions (NP serisi) — liman manevrası notları",
  ],
  economic: [
    "IMO SEEMP Guidelines — enerji verimliliği",
    "Admiralty NP 136 (The Mariner’s Handbook) — ekonomik seyir",
    "Admiralty Sailing Directions (NP serisi) — rota optimizasyonu",
    "IMO Model Course 7.03 — voyage planning",
  ],
  ais: [
    "Bowditch Chapter 12 — Loran-C, AIS, and Other Systems",
    "IMO Resolution A.917(22) — AIS",
    "IALA Guidelines on AIS — operasyonel kullanım",
    "Admiralty List of Radio Signals (NP serisi) — AIS/VTS",
  ],
  colreg: [
    "COLREG 1972 — kural uygulamaları",
    "Admiralty NP 136 (The Mariner’s Handbook) — COLREG yorumları",
    "IMO Model Course 7.03 — collision avoidance",
    "IMO STCW Code A-VIII/2 — watchkeeping",
  ],
  incidents: [
    "IMO Casualty Investigation Code (MSC.255(84))",
    "COLREG 1972 — olay değerlendirme",
    "IMO Model Course 7.03 — incident review",
    "Admiralty NP 136 (The Mariner’s Handbook) — safety notes",
  ],
  simulator: [
    "Bowditch Chapter 13 — Radar Navigation",
    "IMO Model Course 1.22 — Bridge Teamwork",
    "IMO Model Course 1.08 — Radar Navigation",
    "IMO STCW Code Section A-I/12 — simulator training",
  ],
  documents: [
    "Bowditch — The American Practical Navigator",
    "IMO STCW Code A-VIII/2 — logbook kayıtları",
    "Admiralty NP 136 (The Mariner’s Handbook) — kayıt düzeni",
    "IMO Model Course 7.03 — bridge records",
    "Admiralty List of Radio Signals (NP serisi) — GMDSS kayıtları",
  ],
  watchkeeping: [
    "IMO STCW Code A-VIII/2 — watchkeeping",
    "COLREG 1972 Rule 5 — lookout",
    "IMO Model Course 7.03 — bridge watchkeeping",
    "Admiralty NP 136 (The Mariner’s Handbook) — watch routines",
  ],
};

const sectionReferences: Record<string, string[]> = {
  "rota-hesaplamalari": referenceSets.routePlanning,
  "seyir-temelleri": referenceSets.navigationFundamentals,
  "bowditch-seyir-ozeti": referenceSets.bowditchSummary,
  "mercator-loxodromik-seyir": referenceSets.mercatorRhumb,
  "buyuk-daire-seyri": referenceSets.greatCircle,
  "astronomik-navigasyon": referenceSets.celestial,
  "gelgit-hesaplari": referenceSets.tides,
  "akinti-ruzgar-duzeltmeleri": referenceSets.currentWind,
  "gelgit-derinlik-emniyeti": referenceSets.ukc,
  "radar-navigasyonu": referenceSets.radar,
  ecdis: referenceSets.ecdis,
  "gps-gnss": referenceSets.gnss,
  "seyir-emniyeti": referenceSets.safety,
  "insan-faktoru": referenceSets.humanFactors,
  "kisitli-sularda-seyir": referenceSets.restrictedWaters,
  "kiyi-seyri": referenceSets.coastal,
  "harita-isaretleri": referenceSets.chartMarks,
  pilotaj: referenceSets.pilotage,
  "seyir-plani-denetimi": referenceSets.passageAudit,
  "agir-hava-seyri": referenceSets.heavyWeather,
  "buzlu-sularda-seyir": referenceSets.iceNavigation,
  "manevra-karakteristikleri": referenceSets.maneuvering,
  "ekonomik-seyir": referenceSets.economic,
  "ais-kullanimi": referenceSets.ais,
  "colreg-pratikleri": referenceSets.colreg,
  "kaza-ornekleri": referenceSets.incidents,
  "simulator-modulleri": referenceSets.simulator,
  "seyir-belgeleri": referenceSets.documents,
  "vardiya-yonetimi": referenceSets.watchkeeping,
};

const accuracyChecklistMap: Record<string, string[]> = {
  "rota-hesaplamalari": [
    "Harita ve yayın güncelliği teyit edildi.",
    "Başlangıç/bitiş koordinatları çift kontrol edildi.",
    "Rota tipi seçimi (büyük daire/loxodrom) gerekçelendirildi.",
    "WP listesi, XTD/UKC limitleri doğrulandı.",
    "ETA ve hız varsayımları güncellendi.",
  ],
  "seyir-temelleri": [
    "Köprüüstü cihaz testleri tamamlandı.",
    "Seyir planı ekip ile paylaşıldı.",
    "Vardiya ve gözcülük düzeni doğrulandı.",
    "Riskler ve yedek prosedürler gözden geçirildi.",
  ],
  "bowditch-seyir-ozeti": [
    "Bowditch bölüm eşleşmeleri (harita/piloting/sailings) doğrulandı.",
    "Kullanılan terimler (COG/SOG, LOP, variation/deviation) standarda uygun.",
    "Harita ve yayın güncelliği kontrolü açıkça belirtildi.",
    "Elektronik ve göksel seyir prosedürleri çapraz doğrulama ile sunuldu.",
  ],
  "mercator-loxodromik-seyir": [
    "Mercator ölçeği ve enlem farkı doğrulandı.",
    "Rhumb line kerteriz hesapları kontrol edildi.",
    "Mesafe ölçümleri chart ölçeğiyle tutarlı.",
    "Gyro/compass düzeltmeleri işlendi.",
  ],
  "buyuk-daire-seyri": [
    "GC hesaplarında enlem/boylam doğrulandı.",
    "WP’ler harita üzerinde güvenlik payıyla işaretlendi.",
    "Yüksek enlem kısıtları kontrol edildi.",
    "Alternatif rota senaryosu hazırlandı.",
  ],
  "astronomik-navigasyon": [
    "Sextant index ve dip düzeltmeleri uygulandı.",
    "Kronometre/zaman doğruluğu teyit edildi.",
    "Nautical Almanac verileri güncel.",
    "En az iki LOP kesişimiyle mevki doğrulandı.",
    "GNSS/ECDIS ile çapraz kontrol yapıldı.",
  ],
  "gelgit-hesaplari": [
    "Referans liman ve zaman dilimi doğrulandı.",
    "HW/LW saatleri ATT ile kontrol edildi.",
    "Ara yükseklik yöntemi doğrulandı.",
    "Gelgit akıntısı ve UKC etkisi değerlendirildi.",
  ],
  "akinti-ruzgar-duzeltmeleri": [
    "Set/drift verisi güncel kaynakla teyit edildi.",
    "Leeway düzeltmesi rüzgâr şiddetine göre hesaplandı.",
    "Yeni kerteriz ve hız değerleri tekrar ölçüldü.",
    "Radar/GNSS ile çapraz doğrulama yapıldı.",
  ],
  "gelgit-derinlik-emniyeti": [
    "UKC limitleri şirket prosedürüyle uyumlu.",
    "Draft ve squat etkisi güncel verilerle kontrol edildi.",
    "Gelgit yüksekliği/ara yükseklik hesapları doğrulandı.",
    "Echo sounder ve charted depth kıyası yapıldı.",
  ],
  "radar-navigasyonu": [
    "Radar ayarları (gain/sea/rain) optimize edildi.",
    "CPA/TCPA değerleri görsel gözlemle doğrulandı.",
    "Plotting aralıkları sabit tutuldu.",
    "Radar-AIS/ECDIS verileri çapraz kontrol edildi.",
  ],
  ecdis: [
    "ENC güncellemesi ve lisans durumu doğrulandı.",
    "Safety contour/alarmlar doğru ayarlandı.",
    "Rota WP ve XTD limitleri kontrol edildi.",
    "Bağımsız kaynakla çapraz kontrol yapıldı.",
  ],
  "gps-gnss": [
    "DOP değerleri ve uydu geometrisi kontrol edildi.",
    "Anten konumu ve giriş parametreleri doğrulandı.",
    "GNSS mevki diğer sensörlerle çapraz doğrulandı.",
    "Alarm limitleri ve yedek prosedürler test edildi.",
  ],
  "seyir-emniyeti": [
    "Emniyetli hız kararı kayıt altına alındı.",
    "CPA limitleri trafik yoğunluğuna göre ayarlandı.",
    "Gözcülük ve vardiya düzeni doğrulandı.",
    "COLREG uygulaması için senaryo teyidi yapıldı.",
  ],
  "insan-faktoru": [
    "Görev ve sorumluluklar netleştirildi.",
    "Vardiya yorgunluk durumu değerlendirildi.",
    "Kritik kararlar çift kontrolle onaylandı.",
    "Near-miss kayıtları gözden geçirildi.",
  ],
  "kisitli-sularda-seyir": [
    "Sığ su/UKC limitleri teyit edildi.",
    "Hız limitleri ve manevra planı onaylandı.",
    "VTS/pilot talimatları kayıt altına alındı.",
    "Ek gözcülük ve kontrol sıklığı artırıldı.",
  ],
  "kiyi-seyri": [
    "Landmark ve fener kimlikleri doğrulandı.",
    "Paralel indeks hatları kontrol edildi.",
    "Radar/ECDIS ile görsel mevki çaprazlandı.",
    "Kıyı mesafe limitleri ve güvenli geçişler teyit edildi.",
  ],
  "harita-isaretleri": [
    "IALA bölgesi (A/B) doğrulandı.",
    "ENC/harita sembolleri NP 5011 ile kontrol edildi.",
    "Gece/gündüz işaret farkları teyit edildi.",
    "Şamandıra sürüklenme olasılığı değerlendirildi.",
  ],
  pilotaj: [
    "Pilot brifingi tamamlandı ve kayıt altına alındı.",
    "Manevra planı ve tug gereklilikleri teyit edildi.",
    "Hız limitleri ve kısıtlı alanlar doğrulandı.",
    "Pilot-köprüüstü iletişim kanalı test edildi.",
  ],
  "seyir-plani-denetimi": [
    "Passage plan dokümanları güncel ve imzalı.",
    "WP koordinatları ve XTD limitleri doğrulandı.",
    "Risk değerlendirmesi ve kontrol listeleri tamamlandı.",
    "Plan güncellemeleri kayıt altına alındı.",
  ],
  "agir-hava-seyri": [
    "Meteoroloji raporları ve uyarılar güncel.",
    "Rota/hız değişiklikleri güvenlik sınırına uygun.",
    "Yük ve güverte ekipmanı emniyete alındı.",
    "Vardiya/gözcülük yoğunluğu artırıldı.",
  ],
  "buzlu-sularda-seyir": [
    "Polar Code ve ice class kısıtları doğrulandı.",
    "Ice chart ve uydu görüntüleri güncel.",
    "Hız ve makine limitleri kontrol edildi.",
    "Acil durum ve kurtarma planı güncellendi.",
  ],
  "manevra-karakteristikleri": [
    "Turning circle verileri güncel test kayıtlarıyla doğrulandı.",
    "Stopping distance yük durumuna göre güncellendi.",
    "Rüzgâr/akıntı düzeltmeleri işlendi.",
    "Manevra limitleri ekiple paylaşıldı.",
  ],
  "ekonomik-seyir": [
    "Tüketim eğrileri ve hedef hız doğrulandı.",
    "Weather routing verileri güncel.",
    "ETA ve yakıt planı tutarlı.",
    "Sapma raporları ve KPI takibi başlatıldı.",
  ],
  "ais-kullanimi": [
    "AIS statik/dinamik verileri güncel.",
    "AIS hedefleri radar ile çaprazlandı.",
    "CPA/TCPA alarmları kontrol edildi.",
    "AIS hatalı veri riskleri not edildi.",
  ],
  "colreg-pratikleri": [
    "Karşılaşma tipi doğru sınıflandırıldı.",
    "Give-way/stand-on rolleri teyit edildi.",
    "Manevra zamanı ve hız değişimi kayıtlandı.",
    "VHF iletişimi ve görsel teyit sağlandı.",
  ],
  "kaza-ornekleri": [
    "Vaka kronolojisi ve kararlar doğrulandı.",
    "COLREG/prosedür ihlalleri işaretlendi.",
    "Kök neden analizi tamamlandı.",
    "Düzeltici aksiyonlar belirlendi.",
  ],
  "simulator-modulleri": [
    "Senaryo hedefleri ve değerlendirme kriterleri net.",
    "Radar/ARPA ayarları doğrulandı.",
    "BRM iletişim adımları izlendi.",
    "Değerlendirme kayıtları arşivlendi.",
  ],
  "seyir-belgeleri": [
    "Logbook ve kayıtlar eksiksiz.",
    "Elektronik yedekleme kontrol edildi.",
    "GMDSS/NAVTEX kayıtları güncel.",
    "Denetim öncesi hızlı kontrol listesi tamamlandı.",
  ],
  "vardiya-yonetimi": [
    "Vardiya devri bilgileri tam aktarıldı.",
    "Gözcülük düzeni ve alarm limitleri kontrol edildi.",
    "Kritik riskler ve öncelikler teyit edildi.",
    "Vardiya sonrası kısa değerlendirme yapıldı.",
  ],
};

const buildPages = (
  baseSlug: string,
  entries: Array<Omit<NavigationTopicPage, "imageSrc" | "references" | "updatedAt">>
): NavigationTopicPage[] =>
  entries.map((entry, index) => ({
    ...entry,
    imageSrc: `/images/lessons/navigation/${baseSlug}-${index + 1}.jpg`,
    references: sectionReferences[baseSlug] ?? defaultReferences,
    updatedAt: "2025-02-05",
  }));

export const navigationTopicsContent: NavigationTopicSection[] = [
  {
    id: "rota-hesaplamalari",
    title: "Rota Hesaplamaları",
    pages: buildPages("rota-hesaplamalari", [
      {
        title: "1. Temel Kavramlar",
        summary: "Rota hesaplaması, seyir planının omurgasıdır ve rota tipinin seçimiyle başlar.",
        bullets: [
          "Büyük daire (kısa mesafe/yakıt avantajı) ile loxodromik rota (sabit kerteriz/kolay takip) seçim kriterlerini karşılaştır.",
          "Rota başlangıç-bitiş noktalarını, enlem kısıtlarını ve kıyı emniyet payını netleştir.",
          "Rota değişiklik noktalarını (WP) trafik yoğunluğu, manevra alanı ve pilotaj gereksinimine göre belirle.",
        ],
        imageAlt: "Rota planlamada büyük daire ve loxodromik seçim şeması",
        motionCue: "Büyük daire ve loxodromik rotayı yan yana çiz, mesafe farkını ölçü etiketiyle vurgula.",
      },
      {
        title: "2. Hesaplama Akışı",
        summary: "Rota planı, harita üzerindeki mesafe ve yön bilgileriyle doğrulanır.",
        bullets: [
          "Paralel cetvel ile kerterizi rota çizgisine taşı, kuzey çizgileriyle kerterizi derece olarak oku.",
          "Pergel ile mesafeyi ölç, haritanın enlem ölçeğinden NM karşılığını al.",
          "Ölçek değişimlerinde enlem ölçeğine göre mesafe dönüşümünü yeniden kontrol et.",
        ],
        imageAlt: "Rota ölçüm adımlarını gösteren çalışma şeması",
        motionCue: "Paralel cetvelin rota üzerinde kaydırılıp kerteriz okumasını, ardından pergel ile mesafe ölçümünü adım adım canlandır.",
      },
      {
        title: "3. Uygulama ve Kontroller",
        summary: "Rota hesapları, seyir öncesi ve seyir sırasında düzenli kontrol ister.",
        bullets: [
          "NAVAREA/NAVTEX uyarıları ve Notice to Mariners düzeltmelerini rota üzerindeki risk noktalarıyla eşleştir.",
          "Geçici/ön uyarıları (T&P) rota çizimine not düş, gerekiyorsa WP revizyonu yap.",
          "Rota üstü hız/ETA kontrol noktaları oluştur ve köprüüstü ekibiyle iki kişi teyit et.",
        ],
        imageAlt: "Rota teyit kontrol noktaları",
        motionCue: "Uyarı kartlarını rota üzerinde ilgili noktaya bağlayan ince çizgilerle ardışık olarak göster.",
      },
      {
        title: "4. Hata Kaynakları",
        summary: "Ölçek, yayın güncelliği ve insan hatası rota hesaplarını etkiler.",
        bullets: [
          "Harita güncelliği, düzeltmeler ve yayın doğrulama adımlarını atlama.",
          "Gyro hatası ile manyetik pusula varyasyon/deviasyonunu düzelt, compass error = variation + deviation hesabını uygula.",
          "Deviation curve ve karşılaştırma kerteriziyle hata trendini izleyip çapraz kontrol yap.",
        ],
        imageAlt: "Rota hatası kaynakları kontrol listesi",
        motionCue: "Gyro ve manyetik pusula hatalarını farklı renk ikonlarla gösterip düzeltme oklarını ekle.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["rota-hesaplamalari"],
    calculationLinks: [
      { title: "Büyük Daire (Great Circle)", href: "/navigation/calc/gc" },
      { title: "Rhumb Line (Mercator)", href: "/navigation/calc/rhumb" },
      { title: "Plane Sailing", href: "/navigation/calc/plane" },
      { title: "Chart Ölçeği (cm ↔ NM)", href: "/navigation/calc/chart" },
      { title: "Passage Plan (Leg ETA)", href: "/navigation/calc/passage" },
      { title: "Seyir Formülleri", href: "/navigation/formulas" },
    ],
  },
  {
    id: "seyir-temelleri",
    title: "Seyir Temelleri",
    pages: buildPages("seyir-temelleri", [
      {
        title: "1. Seyre Hazırlık",
        summary: "Seyre hazırlık; emniyet, yayın, ekipman ve plan kontrolünün bütünüdür.",
        bullets: [
          "Gyro, manyetik pusula, radar/ARPA ve ECDIS testlerini tamamla; alarmları doğrula.",
          "Güncel harita, ENC düzeltmeleri ve Notice to Mariners kayıtlarını kontrol et.",
          "Hava/deniz tahmini, pilotaj zamanı ve liman prosedürlerini gözden geçir.",
        ],
        imageAlt: "Seyre hazırlık kontrol akışı",
        motionCue: "Kontrol akışını adım adım ilerleyen çizgi animasyonuyla göster.",
      },
      {
        title: "2. Planlama-İcra-İzleme",
        summary: "Seyir döngüsü; planlama, uygulama ve sürekli izlemeyi içerir.",
        bullets: [
          "Planlanan rota ile gerçek COG/SOG verilerini belirlenen aralıklarla karşılaştır.",
          "Hız, akıntı ve hava koşullarına göre rota/ETA güncellemelerini kayda geçir.",
          "Seyir raporları, vardiya devri ve olay kayıtlarını standart formatta tut.",
        ],
        imageAlt: "Planlama-icra-izleme döngüsü",
        motionCue: "Döngü oklarını 120ms aralıkla döndürerek hareket hissi ver.",
      },
      {
        title: "3. Temel Seyir Hesapları",
        summary: "D/T/V ilişkisi, ETA ve kalan mesafe hesaplarının temelidir.",
        bullets: [
          "Set/drift ve rüzgar sürüklenmesini hesaba katıp COG düzeltmesini çıkar.",
          "Dönme çemberi ve dönüş süresi tahminlerini rota değişikliklerinde kullan.",
          "Hız değişimlerinin ETA etkisini güncel rapora yansıt.",
        ],
        imageAlt: "D-T-V ilişkisini gösteren basit şema",
        motionCue: "D-T-V üçgeninde değerleri sırayla parlat.",
      },
      {
        title: "4. Emniyetli Seyir İlkeleri",
        summary: "Emniyetli seyir, öngörü ve disiplinli izlemeyi gerektirir.",
        bullets: [
          "COLREG 1972 Rule 6 (Emniyetli Sürat) gereklerini çevresel koşullara göre uygula.",
          "COLREG 1972 Rule 7–8 (Çarpışma Riski/Önleme) için radar/ARPA ve görsel teyidi birlikte kullan.",
          "Gözcülük, vardiya düzeni ve riskli bölgelerde ek kontrol listelerini aksatma.",
        ],
        imageAlt: "Emniyetli seyir ilkeleri özeti",
        motionCue: "Özet kartlarını dikey slide-in animasyonuyla sırala.",
      },
      {
        title: "5. Temel Mevki Takibi",
        summary: "Mevki takibi, seyrin her aşamasında doğrulama ve raporlama disiplinidir.",
        bullets: [
          "Tanım: Mevki takibi, planlanan rota ile gerçek konumun sürekli karşılaştırılmasıdır.",
          "Kullanım senaryosu: Kıyı yaklaşmalarında veya trafik yoğunluğunda kısa aralıklarla yapılır.",
          "Prosedür: Görsel, radar ve ECDIS verisini tek sayfa kontrol listesiyle doğrula.",
          "Tipik hata: Tek sensöre güvenip LOP/kerteriz doğrulamasını atlamak.",
          "Örnek uygulama: Saat başı mevkiyi işleyip sapma limitini aştığında rota düzeltmesi yapmak.",
        ],
        detailBlocks: [
          {
            title: "Mini Örnek Vaka",
            items: [
              "Kıyı seyrinde 1,5 NM sapma tespit edildi, radar sabit kerteriz ile doğrulandı.",
              "Köprüüstü ekip, bir sonraki WP’ye yaklaşmadan önce düzeltme rotası verdi.",
            ],
          },
          {
            title: "Hesap Adımı",
            items: [
              "Gerçek rota - planlanan rota = sapma açısı.",
              "Sapma açısı × kalan mesafe = beklenen enine sapma.",
            ],
          },
          {
            title: "Uygulama Notları",
            items: [
              "LOP çizimleri için zaman damgasını UTC olarak kaydet.",
              "Kısıtlı sularda mevki aralığını 15–30 dk’ya düşür.",
            ],
          },
          {
            title: "Kritik Uyarılar",
            items: [
              "GNSS verisi tek başına yeterli değildir; radar/görsel teyit şarttır.",
              "Sapma limitini aşan durumlarda köprüüstü alarmı aktif edilmeli.",
            ],
          },
        ],
        imageAlt: "Mevki takibi kontrol ve doğrulama akışı",
        motionCue: "Mevki noktalarını kısa aralıklarla parlatan nabız animasyonu kullan.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["seyir-temelleri"],
    calculationLinks: [
      { title: "Temel Seyir (Zaman–Mesafe–Hız)", href: "/navigation/calc/eta" },
      { title: "Mesafe Hesaplamaları", href: "/navigation/calc/distance" },
      { title: "DR / Enlem-Boylam", href: "/navigation/calc/position" },
      { title: "Passage Plan (Leg ETA)", href: "/navigation/calc/passage" },
      { title: "Seyir Formülleri", href: "/navigation/formulas" },
    ],
  },
  {
    id: "bowditch-seyir-ozeti",
    title: "Bowditch Seyir Özeti",
    pages: buildPages("bowditch-seyir-ozeti", [
      {
        title: "1. Bowditch ile Seyir Çerçevesi",
        summary: "Bowditch, seyri harita, rota ve mevki disiplinini tek bir çatı altında toplar.",
        bullets: [
          "Akış: Harita/yayın → seyir yardımcıları → rota/sailings → elektronik & göksel doğrulama.",
          "Her başlıkta çapraz kontrol kültürü: görsel, radar ve elektronik kaynaklar birlikte kullanılır.",
          "Seyir defteri, yayın düzeltmeleri ve ekipman testleri süreklilik esasına göre yürütülür.",
        ],
        imageAlt: "Bowditch seyir akışı ve disiplin haritası",
        motionCue: "Akış oklarını sırasıyla parlatıp bir öğrenme yolu hissi ver.",
      },
      {
        title: "2. Haritalar ve Yayınlar (Ch 6)",
        summary: "Harita seçimi ve güncellik kontrolü, güvenli seyir için temel adımdır.",
        bullets: [
          "Büyük ölçek kıyı/pilotaj, küçük ölçek okyanus geçişleri için tercih edilir.",
          "Notice to Mariners ve ENC güncellemeleri tarih/numara ile haritaya işlenir.",
          "Semboller, derinlikler ve tehlike notları güvenli kontur ve UKC ile eşleştirilir.",
        ],
        imageAlt: "Harita seçimi, güncelleme ve sembol kontrol şeması",
        motionCue: "Harita katmanlarını üst üste bindirip güncelleme etiketi ekle.",
      },
      {
        title: "3. Seyir Yardımcıları & Piloting (Ch 5 & 8)",
        summary: "Kıyı seyrinde işaretler ve görsel/radar kerterizleri mevki doğrular.",
        bullets: [
          "IALA şamandıra sistemi, ışık karakterleri ve racon işaretleri kimlikle eşleştirilir.",
          "Görsel/radar kerterizleriyle LOP oluştur, transit/leading line kullan.",
          "Paralel indeks, clearing bearing ve güvenli mesafe çizgileri kıyı seyri için kritik olur.",
        ],
        imageAlt: "Kıyı seyrinde şamandıra, kerteriz ve transit çizgileri",
        motionCue: "Kerteriz çizgilerini kıyı hattına doğru uzatıp LOP kesişimini vurgula.",
      },
      {
        title: "4. Sailings ve Rota Tipleri (Ch 24)",
        summary: "Rota tipi, mesafe, enlem ve operasyonel kısıtlara göre seçilir.",
        bullets: [
          "Plane/Middle Latitude/Mercator ile Great Circle seçeneklerini göreve göre eşleştir.",
          "Büyük daire rotasını WP’lere böl, yüksek enlem kısıtları ve alternatif rota belirle.",
          "Rhumb line sabit kerteriz sağlar; akıntı ve rüzgâr düzeltmeleri mutlaka eklenir.",
        ],
        imageAlt: "Rota tipleri karşılaştırması ve WP yerleşimi",
        motionCue: "Rota tiplerini farklı renklerle çizip mesafe etiketlerini ekle.",
      },
      {
        title: "5. Elektronik ve Göksel Seyir Özeti (Ch 11–20, 13–14)",
        summary: "Elektronik ve göksel yöntemler, birbirini doğrulayan iki ana sütundur.",
        bullets: [
          "GNSS için DOP/uydu geometrisi ve alarm limitlerini kontrol et; bağımsız sensörle doğrula.",
          "Radar/ARPA CPA-TCPA takibi ve guard zone alarmları ECDIS ile çaprazlanır.",
          "Göksel seyirde sextant düzeltmeleri, zaman/almanak ve sight reduction ile LOP kesişimi yapılır.",
        ],
        imageAlt: "Elektronik ve göksel seyir çapraz doğrulama şeması",
        motionCue: "GNSS, radar ve sextant ikonlarını ortak bir doğrulama merkezine animasyonla taşı.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["bowditch-seyir-ozeti"],
    calculationLinks: [
      { title: "Chart Ölçeği (cm ↔ NM)", href: "/navigation/calc/chart" },
      { title: "Kerteriz Hesaplamaları", href: "/navigation/calc/bearings" },
      { title: "Büyük Daire (Great Circle)", href: "/navigation/calc/gc" },
      { title: "Astronomik Seyir (Almanac + LOP)", href: "/navigation/calc/astro" },
    ],
    pdfResource: {
      title: "Bowditch — The American Practical Navigator (PDF)",
      href: "https://maritimesafetyinnovationlab.org/wp-content/uploads/2014/07/bowditch.pdf",
      description: "Tam metin PDF, seyir konu anlatımında görüntülenir.",
    },
  },
  {
    id: "mercator-loxodromik-seyir",
    title: "Mercator & Loxodromik Seyir",
    pages: buildPages("mercator-loxodromik-seyir", [
      {
        title: "1. Mercator Harita Mantığı",
        summary: "Mercator projeksiyonu, sabit kerterizli rotaları düz çizgi gösterir.",
        bullets: [
          "Paraleller arası mesafe enlem arttıkça büyür; kutuplara yaklaşırken ölçek şişer.",
          "Konformal yapı açıları korur, sabit kerterizli (loxodrom) çizim düz görünür.",
          "Yüksek enlemlerde alan ve mesafe distorsiyonu belirginleşir.",
        ],
        imageAlt: "Mercator projeksiyonunda distorsiyon şeması",
        motionCue: "Ekvator üzerindeki kareyi yukarı taşırken genişleyen bir ızgara ile ölçek büyümesini göster.",
      },
      {
        title: "2. Loxodromik Rota",
        summary: "Loxodromik rota, sabit kerterizle seyir sağlar.",
        bullets: [
          "Sabit pusula ile seyir için uygundur.",
          "Uzun mesafelerde büyük daireye göre daha uzundur.",
          "Kısa mesafe ve kıyı seyrinde yaygındır.",
        ],
        imageAlt: "Loxodromik rota çizimi",
        motionCue: "Rota çizgisini soldan sağa çizim animasyonuyla göster.",
      },
      {
        title: "3. Hesaplama Adımları",
        summary: "Loxodromik rota hesaplarında temel parametreleri netleştir.",
        bullets: [
          "Enlem/boylam farklarını (ΔLat/ΔLong) işaretle ve yönünü doğrula.",
          "Ortalama enlemi φm = (φ1 + φ2)/2 al, mesafeyi ΔLong × cos φm ile kontrol et.",
          "Rota kerterizini Mercator’dan ölçüp sapma/akıntı düzeltmesini ekle.",
        ],
        imageAlt: "Loxodromik hesap akışı",
        motionCue: "Akış kutularını sırayla aydınlatan geçiş animasyonu kullan.",
      },
      {
        title: "4. Uygulama Notları",
        summary: "Harita, pusula ve elektronik sistemler arasında doğrulama yapılır.",
        bullets: [
          "Gyro ve manyetik pusula farkını hesaba kat.",
          "ECDIS ve kağıt harita çapraz kontrol uygula.",
          "Yüksek enlemde düzeltme hassasiyetini artır.",
        ],
        imageAlt: "Mercator-ECIDS karşılaştırma kontrolü",
        motionCue: "Karşılaştırma kartlarını çapraz fade ile göster.",
      },
      {
        title: "5. Loxodromik Seyir Uygulaması",
        summary: "Sabit kerterizli rotanın hazırlanması, harita ve pusula uyumuna dayanır.",
        bullets: [
          "Tanım: Loxodromik rota, meridyenleri sabit açıyla kesen sabit kerterizli seyirdir.",
          "Kullanım senaryosu: Orta mesafeli kıyı geçişlerinde sabit pusula seyri gerektiğinde.",
          "Prosedür: Ortalama enlemden meridyen aralığını bul, mesafe ve kerterizi Mercator’dan ölç.",
          "Tipik hata: Ortalama enlemi yanlış seçip mesafeyi eksik/yanlış hesaplamak.",
          "Örnek uygulama: 35°N-38°N arası rotada ortalama enlem kullanarak mesafeyi hesaplamak.",
        ],
        detailBlocks: [
          {
            title: "Mini Örnek Vaka",
            items: [
              "Kıyıdan 12 NM açıklıkta sabit 095° rota planlandı.",
              "Rota sapması 1° olduğunda leeway düzeltmesi uygulandı.",
            ],
          },
          {
            title: "Hesap Adımı",
            items: [
              "ΔBoylam (dk) = Boylam1 - Boylam2.",
              "Mesafe (NM) = ΔBoylam × cos(ortalama enlem).",
            ],
          },
          {
            title: "Uygulama Notları",
            items: [
              "Gyro-magnetic düzeltmelerini rota hesabına ekle.",
              "Harita ölçeğine göre çizim hassasiyetini artır.",
            ],
          },
          {
            title: "Kritik Uyarılar",
            items: [
              "Yüksek enlemde Mercator distorsiyonu rotayı yanıltabilir.",
              "Sabit kerteriz, akıntı etkisini göz ardı etmemelidir.",
            ],
          },
        ],
        imageAlt: "Loxodromik rota hesap ve çizim adımları",
        motionCue: "Rota çizgisini sabit kerteriz etiketiyle birlikte akıcı şekilde çiz.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["mercator-loxodromik-seyir"],
    calculationLinks: [
      { title: "Rhumb Line (Mercator)", href: "/navigation/calc/rhumb" },
      { title: "Middle Latitude Sailing", href: "/navigation/calc/midlat" },
      { title: "Chart Ölçeği (cm ↔ NM)", href: "/navigation/calc/chart" },
      { title: "Seyir Formülleri", href: "/navigation/formulas" },
    ],
  },
  {
    id: "buyuk-daire-seyri",
    title: "Büyük Daire Seyri",
    pages: buildPages("buyuk-daire-seyri", [
      {
        title: "1. Temel Tanım",
        summary: "Büyük daire rotası, küre üzerinde en kısa mesafeyi sağlar.",
        bullets: [
          "Küresel mesafelerde yakıt ve zaman avantajı sağlar.",
          "Haritada kıvrımlı görünür; WP’lerle uygulanır.",
          "Yüksek enlemlere yaklaşırken dikkat gerektirir.",
        ],
        imageAlt: "Büyük daire ve loxodromik rota kıyaslaması",
        motionCue: "İki rotayı sırayla vurgulayan renk geçiş animasyonu uygula.",
      },
      {
        title: "2. Rota Planlama",
        summary: "Büyük daire rotası, dönüm noktalarıyla pratik hale getirilir.",
        bullets: [
          "WP’ler arasındaki rota doğrultularını belirle.",
          "Enlem kısıtları ve güvenli mesafeleri uygula.",
          "Hava/deniz durumuna göre alternatif plan hazırla.",
        ],
        imageAlt: "Büyük daire WP planı",
        motionCue: "WP noktalarını ping animasyonuyla öne çıkar.",
      },
      {
        title: "3. Hesaplama ve İzleme",
        summary: "Rota boyunca kerteriz değişimi düzenli takip edilir.",
        bullets: [
          "Kerteriz değişimini seyir kayıtlarına işle.",
          "GPS/ECDIS üzerinden rota uyumunu izle.",
          "Sapan durumlarda düzeltme prosedürü uygula.",
        ],
        imageAlt: "Büyük daire izleme şeması",
        motionCue: "Rota üzerindeki mevcut konumu küçük bir parıltıyla ilerlet.",
      },
      {
        title: "4. Riskler ve Sınırlar",
        summary: "Büyük daire rotası çevresel kısıtlar nedeniyle sınırlandırılabilir.",
        bullets: [
          "Buzlu bölgeler ve kısıtlı sular için limit belirle.",
          "Yayın uyarılarını rota revizyonuna dahil et.",
          "Pilotaj gerektiren alanlarda loxodromik tercih edilebilir.",
        ],
        imageAlt: "Büyük daire risk bölgeleri",
        motionCue: "Risk bölgelerini kırmızı dalga animasyonuyla vurgula.",
      },
      {
        title: "5. Büyük Daire Uygulama Paketi",
        summary: "Büyük daire planı, güvenli enlem ve WP setiyle işletilebilir hale gelir.",
        bullets: [
          "Tanım: Büyük daire, küre üzerinde en kısa mesafeyi veren rotadır.",
          "Kullanım senaryosu: Okyanus geçişlerinde yakıt/ETA optimizasyonu hedeflenirken.",
          "Prosedür: Başlangıç-bitiş noktalarını seç, en yüksek enlem limitini belirle, WP’leri dağıt.",
          "Tipik hata: Kısıtlı enlem limitini dikkate almadan buz/tehlike bölgelerine yaklaşmak.",
          "Örnek uygulama: 6 WP ile 1.200 NM rota, her 200 NM’de kerteriz değişimi kaydı.",
        ],
        detailBlocks: [
          {
            title: "Mini Örnek Vaka",
            items: [
              "Kuzey Atlantik geçişinde buz hattı nedeniyle 55°N limit konuldu.",
              "WP’ler ECDIS’e girildi, rota uyumu saatlik kontrol edildi.",
            ],
          },
          {
            title: "Hesap Adımı",
            items: [
              "GC mesafesi için küresel trigonometrik formül kullan.",
              "WP arası kerteriz = önceki WP’den sonraki WP’ye büyük daire doğrultusu.",
            ],
          },
          {
            title: "Uygulama Notları",
            items: [
              "Her WP’de kerteriz değişimini seyir defterine kaydet.",
              "Hava raporlarını GC rotasıyla örtüştür.",
            ],
          },
          {
            title: "Kritik Uyarılar",
            items: [
              "Büyük daire rotası, pilotaj ve kısıtlı sulara yaklaşırken kırılmalıdır.",
              "Enlem kısıtını aşan WP, rota planını geçersiz kılar.",
            ],
          },
        ],
        imageAlt: "Büyük daire WP dağılımı ve güvenli enlem sınırı",
        motionCue: "WP noktalarını sıralı ping animasyonuyla ve enlem limitini çizgiyle vurgula.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["buyuk-daire-seyri"],
    calculationLinks: [
      { title: "Büyük Daire (Great Circle)", href: "/navigation/calc/gc" },
      { title: "Passage Plan (Leg ETA)", href: "/navigation/calc/passage" },
      { title: "Mesafe Hesaplamaları", href: "/navigation/calc/distance" },
      { title: "Seyir Formülleri", href: "/navigation/formulas" },
    ],
  },
  {
    id: "astronomik-navigasyon",
    title: "Astronomik Navigasyon",
    pages: buildPages("astronomik-navigasyon", [
      {
        title: "1. Temel İlkeler",
        summary: "Göksel seyir, gök cisimleriyle mevki belirleme yöntemidir.",
        bullets: [
          "Sextant ölçümü ve zaman doğruluğu kritiktir.",
          "Gözlemler hata düzeltmeleriyle kullanılır.",
          "Bulutluluk ve ufuk görünürlüğü gözlem kalitesini etkiler.",
        ],
        imageAlt: "Sextant gözlem süreci",
        motionCue: "Sextant açı ölçümünü hafif dönme animasyonuyla göster.",
      },
      {
        title: "2. Ölçüm ve Düzeltmeler",
        summary: "Gözlemler; index, dip ve atmosfer düzeltmeleriyle işlenir.",
        bullets: [
          "Index hatasını düzenli kontrol et.",
          "Dip düzeltmesini gözlem yüksekliğine göre uygula.",
          "Almanak verilerini güncel kullan.",
        ],
        imageAlt: "Astronomik düzeltme adımları",
        motionCue: "Düzeltme adımlarını sırayla highlight et.",
      },
      {
        title: "3. Mevki Bulma",
        summary: "Line of position (LOP) kesişimiyle mevki belirlenir.",
        bullets: [
          "En az iki LOP ile güvenli mevki tespiti yap.",
          "Dead reckoning konumunu referans al.",
          "Zaman hatasını minimize etmek için kronometre kullan.",
        ],
        imageAlt: "LOP kesişimi şeması",
        motionCue: "LOP çizgilerini üst üste bindiren fade animasyonu kullan.",
      },
      {
        title: "4. Operasyonel Kullanım",
        summary: "Göksel seyir, elektronik sistem arızalarında yedek yöntemdir.",
        bullets: [
          "GNSS arızasında göksel mevki prosedürü hazırla.",
          "Eğitim ve pratik gözlem rutinleri oluştur.",
          "Sonuçları harita ve ECDIS ile karşılaştır.",
        ],
        imageAlt: "Göksel seyir yedek kullanım akışı",
        motionCue: "Yedek yöntem akışını sağdan sola geçişle vurgula.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["astronomik-navigasyon"],
    calculationLinks: [
      { title: "Astronomik Seyir (Almanac + LOP)", href: "/navigation/calc/astro" },
      { title: "Sight Reduction", href: "/navigation/calc/sight" },
      { title: "Göksel Navigasyon", href: "/navigation/calc/celestial" },
      { title: "Seyir Formülleri", href: "/navigation/formulas" },
    ],
  },
  {
    id: "gelgit-hesaplari",
    title: "Gelgit Hesapları",
    pages: buildPages("gelgit-hesaplari", [
      {
        title: "1. Gelgit Temelleri",
        summary: "Gelgit; güneş ve ayın çekim etkileriyle oluşan su seviyesi değişimidir.",
        bullets: [
          "Spring ve neap dönemlerini ayırt et.",
          "Referans liman kavramını kullan.",
          "Yerel şartların gecikme yaratabileceğini unutma.",
        ],
        imageAlt: "Gelgit döngüsü şeması",
        motionCue: "Gelgit eğrisini dalgalanan çizgi animasyonuyla göster.",
      },
      {
        title: "2. Tablo Okuma",
        summary: "Gelgit tabloları, belirli liman için yükselme/alçalma saatlerini verir.",
        bullets: [
          "HW/LW saatlerini doğru yorumla.",
          "Zaman dilimi ve yaz saati düzeltmelerini kontrol et.",
          "Günlük sapma faktörlerini uygula.",
        ],
        imageAlt: "Gelgit tablosu okuma örneği",
        motionCue: "Tablodaki satırları sırayla vurgu rengiyle göster.",
      },
      {
        title: "3. Ara Yükseklik",
        summary: "Ara saatlerde su yüksekliği interpolasyonla hesaplanır.",
        bullets: [
          "Rule of Twelfths gibi yöntemleri uygula.",
          "Akıntı etkisini ayrıca değerlendir.",
          "Seyir planına geçiş saatlerini işle.",
        ],
        imageAlt: "Ara yükseklik hesap şeması",
        motionCue: "Ara noktaları ölçen çizgi animasyonu kullan.",
      },
      {
        title: "4. Operasyonel Etki",
        summary: "Gelgit, draft, UKC ve liman giriş zamanlamasını etkiler.",
        bullets: [
          "Emniyetli draft limitlerini gelgit ile değerlendir.",
          "Gelgit akıntısını rota planına dahil et.",
          "Gelgit hatalarına karşı emniyet payı bırak.",
        ],
        imageAlt: "Gelgitin operasyonlara etkisi",
        motionCue: "Operasyon simgelerini dalga hareketiyle hafifçe titreştir.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["gelgit-hesaplari"],
    calculationLinks: [
      { title: "Gelgit + UKC", href: "/navigation/calc/tides" },
      { title: "Gelgit İnterpolasyonu (Ara Yükseklik)", href: "/navigation/calc/tides" },
      { title: "Gelgit Akıntısı", href: "/navigation/calc/tides" },
      { title: "Gelgit Eğitim Notu", href: "/navigation/tide-tutorial" },
      { title: "Seyir Emniyeti (Squat/UKC)", href: "/navigation/calc/safety" },
    ],
  },
  {
    id: "akinti-ruzgar-duzeltmeleri",
    title: "Akıntı & Rüzgâr Düzeltmeleri",
    pages: buildPages("akinti-ruzgar-duzeltmeleri", [
      {
        title: "1. Set ve Drift",
        summary: "Akıntı etkisi, set (yön) ve drift (hız) olarak ifade edilir.",
        bullets: [
          "Gerçek rota ile planlanan rota arasındaki farkı izle.",
          "Akıntı verilerini güncel yayınlardan takip et.",
          "Set/drift verisini seyir defterine kaydet.",
        ],
        imageAlt: "Set ve drift vektör şeması",
        motionCue: "Vektör oklarını sırayla büyütüp küçülterek vurgula.",
      },
      {
        title: "2. Rüzgâr Düzeltmesi",
        summary: "Leeway, rüzgârın gemiyi yanal sürüklemesidir.",
        bullets: [
          "Leeway açılarını gemi tipi ve rüzgâr şiddetine göre değerlendir.",
          "Kısa aralıklarla rota düzeltmesi yap.",
          "Rüzgâr etkisini radar ve GPS ile doğrula.",
        ],
        imageAlt: "Leeway etkisini gösteren rota çizimi",
        motionCue: "Leeway sapmasını küçük dalga animasyonuyla göster.",
      },
      {
        title: "3. Hesaplama ve Uygulama",
        summary: "Akıntı ve rüzgâr düzeltmeleri, gerçek rotayı hedef rotaya çeker.",
        bullets: [
          "Set/drift vektörlerini hız vektörüyle birleştir.",
          "Düzeltme sonrası yeni kerterizi uygula.",
          "Günlük meteoroloji raporlarıyla güncelle.",
        ],
        imageAlt: "Düzeltme vektör diyagramı",
        motionCue: "Vektör toplamını birleşme animasyonuyla sun.",
      },
      {
        title: "4. Hata Yönetimi",
        summary: "Akıntı değişkenliği, büyük rota sapmalarına yol açabilir.",
        bullets: [
          "Akıntı değişimini erken tespit için referans noktaları kullan.",
          "Rota sapma limitleri belirle ve alarm oluştur.",
          "Kıyı yakınında daha sık düzeltme uygula.",
        ],
        imageAlt: "Akıntı hatası kontrol listesi",
        motionCue: "Kontrol maddelerini sırayla onay animasyonuyla göster.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["akinti-ruzgar-duzeltmeleri"],
    calculationLinks: [
      { title: "Akıntı Üçgeni (CTS)", href: "/navigation/calc/current" },
      { title: "Hava Durumu", href: "/navigation/calc/weather" },
      { title: "Temel Seyir (Zaman–Mesafe–Hız)", href: "/navigation/calc/eta" },
    ],
  },
  {
    id: "gelgit-derinlik-emniyeti",
    title: "Gelgit & Derinlik Emniyeti",
    pages: buildPages("gelgit-derinlik-emniyeti", [
      {
        title: "1. UKC Kavramı",
        summary: "Under Keel Clearance (UKC), emniyetli seyir için kritik bir değerdir.",
        bullets: [
          "UKC limitlerini şirket prosedürüne göre belirle.",
          "Güncel draft ve gelgit değerlerini kullan.",
          "Manevra sırasında UKC düşebilir.",
        ],
        imageAlt: "UKC kavramını gösteren şema",
        motionCue: "UKC mesafesini yukarı-aşağı dalga animasyonuyla vurgula.",
      },
      {
        title: "2. Squat ve Sığ Su Etkisi",
        summary: "Squat, geminin sığ sularda batmasını artıran etkidir.",
        bullets: [
          "Hız arttıkça squat artar.",
          "Dar kanalda squat etkisi daha büyüktür.",
          "Sığ su alarm limitleri belirle.",
        ],
        imageAlt: "Squat etkisi diyagramı",
        motionCue: "Gemi gövdesini aşağı çekilen animasyonla göster.",
      },
      {
        title: "3. Gelgit Planlama",
        summary: "Gelgit yüksekliği, derinlik emniyetini destekler.",
        bullets: [
          "Geçiş zamanını uygun gelgit saatine planla.",
          "Ara yükseklik hesaplarını rota planına ekle.",
          "Derinlik verilerini güncel yayınlarla doğrula.",
        ],
        imageAlt: "Gelgit ile derinlik planı",
        motionCue: "Gelgit çizgisini saat yönünde akıcı animasyonla göster.",
      },
      {
        title: "4. Uygulama Kontrolleri",
        summary: "Kısıtlı sularda sürekli derinlik izleme yapılmalıdır.",
        bullets: [
          "Echo sounder verilerini düzenli kontrol et.",
          "Kıyı mesafelerini emniyet limitleriyle karşılaştır.",
          "Pilot ve köprüüstü ekip koordinasyonunu güçlendir.",
        ],
        imageAlt: "Derinlik emniyeti kontrol listesi",
        motionCue: "Kontrol kutularını sırayla highlight et.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["gelgit-derinlik-emniyeti"],
    calculationLinks: [
      { title: "Gelgit + UKC", href: "/navigation/calc/tides" },
      { title: "Gelgit İnterpolasyonu (Ara Yükseklik)", href: "/navigation/calc/tides" },
      { title: "Seyir Emniyeti (Squat/UKC)", href: "/navigation/calc/safety" },
      { title: "Passage Plan (Leg ETA)", href: "/navigation/calc/passage" },
    ],
  },
  {
    id: "radar-navigasyonu",
    title: "Radar Navigasyonu",
    pages: buildPages("radar-navigasyonu", [
      {
        title: "1. Radar Temelleri",
        summary: "Radar, çevre hedeflerini tespit ederek seyir emniyetini artırır.",
        bullets: [
          "Gain, sea clutter ve rain clutter ayarlarını bil.",
          "Radar kör noktalarını fark et.",
          "Doğru menzil ölçeğini seç.",
        ],
        imageAlt: "Radar ayarları ve hedef tespiti",
        motionCue: "Radar sweep efektini dairesel hafif animasyonla göster.",
      },
      {
        title: "2. ARPA Fonksiyonları",
        summary: "ARPA, hedeflerin hareketini otomatik takip eder.",
        bullets: [
          "CPA/TCPA bilgilerini düzenli kontrol et.",
          "Hedef bilgilerini görsel gözlemle doğrula.",
          "ARPA güncelleme gecikmesini hesaba kat.",
        ],
        imageAlt: "ARPA takip örneği",
        motionCue: "Hedef izlerini kısa aralıklarla yanıp sönen iz efektiyle göster.",
      },
      {
        title: "3. Radar Plotting",
        summary: "Manuel plotting, radar kullanımında temel yetkinliktir.",
        bullets: [
          "Plotting kâğıdında hedef hareketini izle.",
          "Relatif ve gerçek hareketi ayırt et.",
          "Plotting hatalarını azaltmak için sabit aralık kullan.",
        ],
        imageAlt: "Radar plotting şeması",
        motionCue: "Plotting noktalarını adım adım birleştir.",
      },
      {
        title: "4. Emniyetli Kullanım",
        summary: "Radar tek başına yeterli değildir; diğer kaynaklarla desteklenmelidir.",
        bullets: [
          "Görsel gözcülüğü kesintisiz sürdür.",
          "Radar ve AIS verilerini çapraz kontrol et.",
          "Kısıtlı görüşte COLREG kurallarını uygula.",
        ],
        imageAlt: "Radar emniyet kullanım kontrolü",
        motionCue: "Kontrol listesi başlıklarını kısa fade ile sırala.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["radar-navigasyonu"],
    calculationLinks: [
      { title: "Radar Plot (Hedef Rota/Hız)", href: "/navigation/calc/radar" },
      { title: "CPA / TCPA", href: "/navigation/calc/cpa" },
      { title: "COLREG Durum & Manevra", href: "/navigation/calc/colreg" },
    ],
  },
  {
    id: "ecdis",
    title: "ECDIS",
    pages: buildPages("ecdis", [
      {
        title: "1. ECDIS Rolü",
        summary: "ECDIS, elektronik seyir haritası ve bilgi sistemidir.",
        bullets: [
          "ENC veri kalitesini ve güncelliğini kontrol et.",
          "Görsel katmanları amaçla uyumlu aç/kapat.",
          "Alarmların doğruluğunu test et.",
        ],
        imageAlt: "ECDIS katman yönetimi",
        motionCue: "Katmanları sırayla aç/kapat animasyonu ile göster.",
      },
      {
        title: "2. Rota Yönetimi",
        summary: "ECDIS rota planlama ve izleme için merkezi araçtır.",
        bullets: [
          "Rota planını WP doğrulamasıyla kaydet.",
          "Cross track limitlerini belirle.",
          "Güvenli derinlik ve safety contour ayarlarını yap.",
        ],
        imageAlt: "ECDIS rota planı",
        motionCue: "Rota çizgisini çizim animasyonuyla sun.",
      },
      {
        title: "3. Alarm ve Uyarılar",
        summary: "ECDIS alarmları, güvenlik sınırları aşıldığında devreye girer.",
        bullets: [
          "Alarmları operasyonel gereksinime göre yapılandır.",
          "Alarmları göz ardı etme; sebebini doğrula.",
          "Alarm testlerini sefer öncesi yap.",
        ],
        imageAlt: "ECDIS alarm örnekleri",
        motionCue: "Alarm ikonlarını yumuşak pulse animasyonuyla vurgula.",
      },
      {
        title: "4. Operasyonel Hatalar",
        summary: "Yanlış ayarlar, ECDIS kullanımında büyük risk yaratır.",
        bullets: [
          "Güvenli derinlik ayarını yanlış girmeden kaçın.",
          "ENC güncellemesini düzenli uygula.",
          "Harita ölçek değişimlerini dikkatle yönet.",
        ],
        imageAlt: "ECDIS hata önleme kontrol listesi",
        motionCue: "Hata kartlarını yatay kaydırma animasyonuyla sırala.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap.ecdis,
    calculationLinks: [
      { title: "ECDIS (XTD / Look-ahead)", href: "/navigation/calc/ecdis" },
      { title: "Passage Plan (Leg ETA)", href: "/navigation/calc/passage" },
      { title: "Chart Ölçeği (cm ↔ NM)", href: "/navigation/calc/chart" },
    ],
  },
  {
    id: "gps-gnss",
    title: "GPS ve GNSS",
    pages: buildPages("gps-gnss", [
      {
        title: "1. GNSS Temelleri",
        summary: "GNSS, uydu tabanlı konumlama sistemlerinin genel adıdır.",
        bullets: [
          "GPS, GLONASS, Galileo gibi sistemleri ayırt et.",
          "DOP değerleri konum doğruluğunu etkiler.",
          "Anten konumu ölçüm hassasiyetini etkiler.",
        ],
        imageAlt: "GNSS sistemleri şeması",
        motionCue: "Uydu ikonlarını dairesel yörüngede hareket ettir.",
      },
      {
        title: "2. Hata Kaynakları",
        summary: "GNSS sinyalleri atmosferik ve teknik etkilere açıktır.",
        bullets: [
          "Multipath etkisini azaltacak anten konumu seç.",
          "Uydu görünürlüğünü düzenli takip et.",
          "Farklı sensörlerle çapraz kontrol yap.",
        ],
        imageAlt: "GNSS hata kaynakları",
        motionCue: "Hata kaynaklarını sırayla kırmızı vurguyla göster.",
      },
      {
        title: "3. Operasyonel Kullanım",
        summary: "GNSS, ECDIS ve radar ile birlikte kullanılmalıdır.",
        bullets: [
          "GNSS verisini gyro/log ile doğrula.",
          "Konum sapmalarını erken tespit et.",
          "Günlük GNSS kontrol kayıtları oluştur.",
        ],
        imageAlt: "GNSS operasyonel kullanım akışı",
        motionCue: "Akış oklarını ileri yönlü animasyonla hareket ettir.",
      },
      {
        title: "4. Yedekleme",
        summary: "GNSS arızasında alternatif mevki yöntemleri hazır olmalıdır.",
        bullets: [
          "Kıyı seyri için görsel mevki yöntemlerini bil.",
          "Göksel seyir gibi yedek metotları destekle.",
          "GNSS alarm limitlerini düzenli test et.",
        ],
        imageAlt: "GNSS yedekleme planı",
        motionCue: "Yedek sistem kartını sağdan içeri kaydır.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["gps-gnss"],
    calculationLinks: [
      { title: "DR / Enlem-Boylam", href: "/navigation/calc/position" },
      { title: "Fixing Position", href: "/navigation/calc/fix" },
      { title: "Kerteriz Hesaplamaları", href: "/navigation/calc/bearings" },
    ],
  },
  {
    id: "seyir-emniyeti",
    title: "Seyir Emniyeti",
    pages: buildPages("seyir-emniyeti", [
      {
        title: "1. Risk Değerlendirme",
        summary: "Seyir öncesi risk analizi, güvenliği artırır.",
        bullets: [
          "Riskleri rota, hava ve trafik yoğunluğuna göre sınıflandır.",
          "Risk matrisi ile önlem seviyesini belirle.",
          "Risk kontrol önlemlerini planla.",
        ],
        imageAlt: "Seyir risk matrisi",
        motionCue: "Risk matrisi hücrelerini sırayla parlat.",
      },
      {
        title: "2. Emniyetli Hız",
        summary: "Emniyetli hız, COLREG gereği şarttır.",
        bullets: [
          "Görüş, trafik ve manevra kabiliyetine göre hız belirle.",
          "Kısıtlı görüşte hız düşürme prosedürü uygula.",
          "Makine durumunu ve durdurma mesafesini dikkate al.",
        ],
        imageAlt: "Emniyetli hız değerlendirme",
        motionCue: "Hız barını yumuşak yükselen animasyonla göster.",
      },
      {
        title: "3. Emniyetli Mesafe",
        summary: "Emniyetli mesafe, kıyı ve tehlikelere yaklaşımı sınırlar.",
        bullets: [
          "Kıyıdan emniyetli mesafe limitlerini belirle.",
          "Trafik yoğun bölgelerde CPA limitlerini yükselt.",
          "Emniyetli mesafeyi ECDIS alarmıyla destekle.",
        ],
        imageAlt: "Emniyetli mesafe kontrolü",
        motionCue: "Mesafe halkalarını genişleyip daralan animasyonla sun.",
      },
      {
        title: "4. Kriz Yönetimi",
        summary: "Kriz yönetimi, hızlı karar ve koordinasyon gerektirir.",
        bullets: [
          "Bridge team iletişimini net tut.",
          "Acil durum görev paylaşımını önceden belirle.",
          "Olay raporlamasını eksiksiz yap.",
        ],
        imageAlt: "Seyir kriz yönetimi",
        motionCue: "Acil durum kartlarını kısa titreşim animasyonuyla vurgula.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["seyir-emniyeti"],
    calculationLinks: [
      { title: "Seyir Emniyeti (Squat/UKC)", href: "/navigation/calc/safety" },
      { title: "CPA / TCPA", href: "/navigation/calc/cpa" },
      { title: "COLREG Durum & Manevra", href: "/navigation/calc/colreg" },
      { title: "COLREG Kuralları", href: "/navigation/rules" },
    ],
  },
  {
    id: "insan-faktoru",
    title: "İnsan Faktörü",
    pages: buildPages("insan-faktoru", [
      {
        title: "1. BRM Temelleri",
        summary: "Bridge Resource Management, ekip koordinasyonunu iyileştirir.",
        bullets: [
          "Rolleri ve sorumlulukları netleştir.",
          "Karar sürecinde açık iletişim kur.",
          "Hiyerarşi kaynaklı iletişim engellerini azalt.",
        ],
        imageAlt: "BRM iletişim şeması",
        motionCue: "İletişim oklarını sırayla parlatan animasyon kullan.",
      },
      {
        title: "2. Yorgunluk Yönetimi",
        summary: "Yorgunluk, navigasyon hatalarının başlıca nedenidir.",
        bullets: [
          "Vardiya düzenini dinlenme ihtiyacına göre planla.",
          "Uzun seyirlerde görev paylaşımını artır.",
          "Yorgunluk belirtilerini erken tanı.",
        ],
        imageAlt: "Yorgunluk belirtileri listesi",
        motionCue: "Uyarı ikonlarını sırayla görünür yap.",
      },
      {
        title: "3. Durumsal Farkındalık",
        summary: "Durumsal farkındalık, çevresel ve operasyonel bilgiyi kapsar.",
        bullets: [
          "Radar, AIS, görsel gözlem verilerini birleştir.",
          "Rota, hız ve trafik değişimlerini sürekli izle.",
          "Yanlış varsayımlardan kaçın.",
        ],
        imageAlt: "Durumsal farkındalık döngüsü",
        motionCue: "Döngü oklarını yumuşak dönüş animasyonuyla canlandır.",
      },
      {
        title: "4. Hata Yönetimi",
        summary: "Hata yönetimi, tekrar eden riskleri azaltır.",
        bullets: [
          "Near-miss kayıtlarını düzenli analiz et.",
          "Standart prosedürlere uyumu takip et.",
          "Kök neden analizi ile önlem geliştir.",
        ],
        imageAlt: "Hata yönetimi kontrol listesi",
        motionCue: "Kontrol maddelerini sırayla parlat.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["insan-faktoru"],
    calculationLinks: [
      { title: "COLREG Durum & Manevra", href: "/navigation/calc/colreg" },
      { title: "Acil Durum", href: "/navigation/calc/emergency" },
      { title: "COLREG Kuralları", href: "/navigation/rules" },
    ],
  },
  {
    id: "kisitli-sularda-seyir",
    title: "Kısıtlı Sularda Seyir",
    pages: buildPages("kisitli-sularda-seyir", [
      {
        title: "1. Kısıtlı Su Tanımı",
        summary: "Dar kanal, boğaz ve liman girişleri kısıtlı su kabul edilir.",
        bullets: [
          "Trafik yoğunluğu ve manevra alanını değerlendir.",
          "Sığ su ve bank effect riskini dikkate al.",
          "Pilot gerekliliğini planla.",
        ],
        imageAlt: "Kısıtlı su risk haritası",
        motionCue: "Risk bölgelerini yumuşak pulse animasyonuyla vurgula.",
      },
      {
        title: "2. Bank Effect",
        summary: "Bank effect, geminin kıyıya yaklaşmasıyla oluşan çekme-itme etkisidir.",
        bullets: [
          "Kıyıya yaklaşma açısını kontrollü tut.",
          "Hız arttıkça bank effect artar.",
          "Kıçın kıyıya çekilme etkisini hesaba kat.",
        ],
        imageAlt: "Bank effect diyagramı",
        motionCue: "Gemi kıçının yanlama etkisini dalga animasyonuyla göster.",
      },
      {
        title: "3. Trafik Yönetimi",
        summary: "Kısıtlı sularda trafik disiplinine uyum kritik önemdedir.",
        bullets: [
          "VTS talimatlarına uy.",
          "İletişim kanallarını açık tut.",
          "Öncelik kurallarını doğru uygula.",
        ],
        imageAlt: "Kısıtlı sularda trafik akışı",
        motionCue: "Trafik oklarını ardışık olarak hareket ettir.",
      },
      {
        title: "4. Emniyet Uygulamaları",
        summary: "Ek personel ve sık kontrol, riskleri azaltır.",
        bullets: [
          "Ek gözcü görevlendir.",
          "Sürat limitlerine uy.",
          "Acil manevra planını hazır tut.",
        ],
        imageAlt: "Kısıtlı sularda emniyet kontrolü",
        motionCue: "Kontrol listesi öğelerini sırayla onay animasyonuyla göster.",
      },
      {
        title: "5. Kısıtlı Suda Geçiş Planı",
        summary: "Geçiş planı, kısıtlı sularda hız, rota ve trafik kontrolünü birleştirir.",
        bullets: [
          "Tanım: Kısıtlı su geçiş planı, manevra ve trafik risklerini yönetmek için hazırlanır.",
          "Kullanım senaryosu: Dar boğaz geçişi veya liman yaklaşmasında.",
          "Prosedür: VTS talimatlarını al, pilot brifing yap, hız limitlerini belirle.",
          "Tipik hata: Bank effect etkisini hesaba katmadan aşırı hızla yaklaşmak.",
          "Örnek uygulama: 8 kn hız limitinde geçiş, 0.5 NM CPA hedefiyle takip.",
        ],
        detailBlocks: [
          {
            title: "Mini Örnek Vaka",
            items: [
              "Dar kanal geçişinde CPA 0,4 NM’ye düştü, hız 1 kn azaltıldı.",
              "Pilot önerisiyle rota 2° iskele düzeltildi.",
            ],
          },
          {
            title: "Hesap Adımı",
            items: [
              "Güvenli hız = kanal genişliği × 0,1 + akıntı etkisi düzeltmesi.",
              "CPA = hedef mesafe - rota sapma payı.",
            ],
          },
          {
            title: "Uygulama Notları",
            items: [
              "Echo sounder alarmını UKC limitine göre ayarla.",
              "Vardiya devrinde VTS kanalını teyit et.",
            ],
          },
          {
            title: "Kritik Uyarılar",
            items: [
              "Bank effect ve squat birlikte etkiler; hızla çarpan gibi artar.",
              "Kısıtlı görüşte hız limitini tekrar değerlendir.",
            ],
          },
        ],
        imageAlt: "Kısıtlı sularda geçiş planı ve hız kontrol şeması",
        motionCue: "Geçiş koridorunu çizgiyle belirginleştirip hız limitini nabızla vurgula.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["kisitli-sularda-seyir"],
    calculationLinks: [
      { title: "Seyir Emniyeti (Squat/UKC)", href: "/navigation/calc/safety" },
      { title: "Dönüş Hesaplamaları", href: "/navigation/calc/turning" },
      { title: "Akıntı Üçgeni (CTS)", href: "/navigation/calc/current" },
    ],
  },
  {
    id: "kiyi-seyri",
    title: "Kıyı Seyri",
    pages: buildPages("kiyi-seyri", [
      {
        title: "1. Kıyı Referansları",
        summary: "Kıyı seyri, görsel referanslara dayanır.",
        bullets: [
          "Belirgin landmark ve deniz fenerlerini kullan.",
          "Rota üstü transit hatları belirle.",
          "Görüş düşerse alternatif yöntemlere geç.",
        ],
        imageAlt: "Kıyı referans noktaları",
        motionCue: "Landmark işaretlerini kısa parıltı animasyonuyla vurgula.",
      },
      {
        title: "2. Paralel İndeks",
        summary: "Paralel indeks, radar üzerinde kıyı mesafesini korumaya yarar.",
        bullets: [
          "Paralel indeks hatlarını doğru belirle.",
          "Rota sapmasını erken tespit et.",
          "Kritik geçişlerde kullan.",
        ],
        imageAlt: "Paralel indeks örneği",
        motionCue: "Paralel indeks çizgilerini soldan sağa kaydır.",
      },
      {
        title: "3. Geçiş Noktaları",
        summary: "Kıyı seyrinde dönüş noktaları net olmalıdır.",
        bullets: [
          "Dönüş noktalarını net işaretle.",
          "Kıyı mesafe limitlerini belirle.",
          "Görsel teyit prosedürü uygula.",
        ],
        imageAlt: "Kıyı seyrinde dönüş noktaları",
        motionCue: "Dönüş noktalarını ping animasyonuyla öne çıkar.",
      },
      {
        title: "4. Hata Önleme",
        summary: "Görsel hatalar ve yanlış tanımlamalar risk yaratır.",
        bullets: [
          "Landmark doğrulamasını çift kontrol et.",
          "Görüş koşullarını sürekli takip et.",
          "Radar ve ECDIS verisini destek olarak kullan.",
        ],
        imageAlt: "Kıyı seyri hata önleme",
        motionCue: "Hata kartlarını yumuşak shake animasyonuyla göster.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["kiyi-seyri"],
    calculationLinks: [
      { title: "Kerteriz Hesaplamaları", href: "/navigation/calc/bearings" },
      { title: "Fixing Position", href: "/navigation/calc/fix" },
      { title: "Mesafe Hesaplamaları", href: "/navigation/calc/distance" },
      { title: "Chart Ölçeği (cm ↔ NM)", href: "/navigation/calc/chart" },
    ],
  },
  {
    id: "harita-isaretleri",
    title: "Harita İşaretleri",
    pages: buildPages("harita-isaretleri", [
      {
        title: "1. IALA Sistemi",
        summary: "IALA şamandıra sistemi, denizcilik işaretlerinin temelidir.",
        bullets: [
          "IALA A ve B bölgelerini ayırt et.",
          "Yan şamandıraların renk ve şekil anlamlarını öğren.",
          "Giriş/çıkış yönüne göre yorumla.",
        ],
        imageAlt: "IALA şamandıra sistemi",
        motionCue: "Şamandıra ikonlarını yavaşça sallayan animasyon kullan.",
      },
      {
        title: "2. Tehlike İşaretleri",
        summary: "İzole tehlike, emniyetli su ve özel işaretler ayırt edilmelidir.",
        bullets: [
          "İzole tehlike şamandırasını doğru tanı.",
          "Emniyetli su işaretini giriş/rota için kullan.",
          "Özel işaretlerin yerel anlamlarını kontrol et.",
        ],
        imageAlt: "Tehlike ve özel işaretler",
        motionCue: "Tehlike işaretlerini kırmızı puls efektiyle göster.",
      },
      {
        title: "3. ENC Sembolleri",
        summary: "ENC sembolleri, elektronik harita üzerinde kritik bilgi sağlar.",
        bullets: [
          "Sığlık ve batık sembollerini doğru yorumla.",
          "Sembol açıklamalarını ECDIS üzerinden incele.",
          "Sembol filtrasyonu risk yaratabilir.",
        ],
        imageAlt: "ENC sembolleri örneği",
        motionCue: "Sembol kartlarını sırayla soluklaşan geçişle göster.",
      },
      {
        title: "4. Uygulama Notları",
        summary: "Harita işaretlerinin yanlış okunması kaza riski yaratır.",
        bullets: [
          "Görsel işaretleri radar ve ECDIS ile doğrula.",
          "Gece ve gündüz işaret farklarını bil.",
          "Şamandıra sürüklenmesi olasılığına dikkat et.",
        ],
        imageAlt: "Harita işaretleri uygulama notları",
        motionCue: "Not kartlarını yukarıdan aşağıya akışla sırala.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["harita-isaretleri"],
    calculationLinks: [
      { title: "Chart Ölçeği (cm ↔ NM)", href: "/navigation/calc/chart" },
      { title: "Kerteriz Hesaplamaları", href: "/navigation/calc/bearings" },
      { title: "ECDIS (XTD / Look-ahead)", href: "/navigation/calc/ecdis" },
      { title: "Seyir Formülleri", href: "/navigation/formulas" },
    ],
  },
  {
    id: "pilotaj",
    title: "Pilotaj",
    pages: buildPages("pilotaj", [
      {
        title: "1. Pilotaj Hazırlığı",
        summary: "Pilotaj, kısıtlı sularda emniyetli geçiş için kritik destek sağlar.",
        bullets: [
          "Pilot istasyon bilgilerini önceden hazırla.",
          "Pilot brifingini standart forma göre yap.",
          "Pilot alma/indirme risklerini değerlendir.",
        ],
        imageAlt: "Pilotaj hazırlık akışı",
        motionCue: "Hazırlık adımlarını sırayla vurgula.",
      },
      {
        title: "2. Pilot-Brifing",
        summary: "Pilot ve köprüüstü ekip iletişimi net olmalıdır.",
        bullets: [
          "Gemi manevra kabiliyetlerini açıkça paylaş.",
          "Planlanan rota ve hızları doğrula.",
          "Acil durum senaryolarını gözden geçir.",
        ],
        imageAlt: "Pilot brifing kontrol listesi",
        motionCue: "Brifing kartlarını kısa fade ile sırala.",
      },
      {
        title: "3. Liman Giriş-Çıkış",
        summary: "Liman manevraları, hız ve mesafe kontrolü gerektirir.",
        bullets: [
          "Tug gerekliliklerini planla.",
          "Römorkör manevra planını teyit et.",
          "Hız limitlerine uy.",
        ],
        imageAlt: "Liman giriş-çıkış planı",
        motionCue: "Giriş-çıkış oklarını animasyonla hareket ettir.",
      },
      {
        title: "4. İş Birliği",
        summary: "Pilot, kaptan ve köprüüstü ekip birlikte karar alır.",
        bullets: [
          "Pilot önerilerini doğrulayıcı kontrolle uygula.",
          "Kritik manevralarda açık iletişim sürdür.",
          "Pilotaj sonrası kayıtları tamamla.",
        ],
        imageAlt: "Pilotaj iş birliği şeması",
        motionCue: "İletişim bağlantılarını parıltı animasyonuyla göster.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap.pilotaj,
    calculationLinks: [
      { title: "Dönüş Hesaplamaları", href: "/navigation/calc/turning" },
      { title: "Seyir Emniyeti (Squat/UKC)", href: "/navigation/calc/safety" },
      { title: "Akıntı Üçgeni (CTS)", href: "/navigation/calc/current" },
      { title: "Passage Plan (Leg ETA)", href: "/navigation/calc/passage" },
    ],
  },
  {
    id: "seyir-plani-denetimi",
    title: "Seyir Planı Denetimi",
    pages: buildPages("seyir-plani-denetimi", [
      {
        title: "1. Denetim Kapsamı",
        summary: "Passage plan denetimi, planın eksiksiz ve güncel olduğunu doğrular.",
        bullets: [
          "Rota, yayın ve risk belgelerini kontrol et.",
          "WP doğruluğunu ve koordinatları teyit et.",
          "Güvenlik ayarlarını gözden geçir.",
        ],
        imageAlt: "Seyir planı denetim kapsamı",
        motionCue: "Denetim kutularını sırayla vurgula.",
      },
      {
        title: "2. PSC/Flag Beklentileri",
        summary: "Denetimlerde genellikle dokümantasyon ve plan bütünlüğü aranır.",
        bullets: [
          "Rota planının imzalı ve onaylı olmasını sağla.",
          "Risk değerlendirme kayıtlarını sakla.",
          "Önceki sefer notlarını ekle.",
        ],
        imageAlt: "PSC denetim kontrol listesi",
        motionCue: "Denetim maddelerini adım adım parlat.",
      },
      {
        title: "3. Operasyonel Uyum",
        summary: "Plan ile fiili seyir uyumu düzenli kontrol edilir.",
        bullets: [
          "Plan dışı sapmaları gerekçelendir.",
          "Kritik noktaların geçiş zamanlarını kaydet.",
          "Plan güncellemelerini kayıt altına al.",
        ],
        imageAlt: "Plan-fiili uyum şeması",
        motionCue: "Plan ve fiili çizgilerini üst üste bindirerek göster.",
      },
      {
        title: "4. Eksiklerin Önlenmesi",
        summary: "Standart check-list kullanımı hataları azaltır.",
        bullets: [
          "Önceden hazırlanmış kontrol listelerini uygula.",
          "Plan değişikliklerini ekip ile paylaş.",
          "Denetim sonrası aksiyonları takip et.",
        ],
        imageAlt: "Plan denetimi hata önleme",
        motionCue: "Hata önleme ikonlarını pulse animasyonla vurgula.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["seyir-plani-denetimi"],
    calculationLinks: [
      { title: "Passage Plan (Leg ETA)", href: "/navigation/calc/passage" },
      { title: "ECDIS (XTD / Look-ahead)", href: "/navigation/calc/ecdis" },
      { title: "Seyir Formülleri", href: "/navigation/formulas" },
    ],
  },
  {
    id: "agir-hava-seyri",
    title: "Ağır Hava Seyri",
    pages: buildPages("agir-hava-seyri", [
      {
        title: "1. Hava Analizi",
        summary: "Ağır havada rota ve hız kararı meteoroloji verilerine dayanır.",
        bullets: [
          "Synoptik harita ve forecast raporlarını incele.",
          "Dalga yönü ve periyodunu değerlendir.",
          "Fırtına merkezine olan mesafeyi hesapla.",
        ],
        imageAlt: "Ağır hava analiz şeması",
        motionCue: "Fırtına ikonlarını dalga animasyonuyla canlandır.",
      },
      {
        title: "2. Rota ve Hız Ayarı",
        summary: "Hız düşürme ve rota değişimi yük ve emniyet için kritiktir.",
        bullets: [
          "Dalga yönüne göre rota optimizasyonu yap.",
          "Yük güvenliği için hız sınırlarını uygula.",
          "Manevra kabiliyetini koru.",
        ],
        imageAlt: "Ağır havada rota ayarı",
        motionCue: "Rota çizgisini dalga etkisiyle hafif hareket ettir.",
      },
      {
        title: "3. Gemi Güvenliği",
        summary: "Gemi üzerindeki ekipman ve yüklerin emniyeti önceliklidir.",
        bullets: [
          "Lashing kontrolünü sıklaştır.",
          "Açık güverte ekipmanlarını güvene al.",
          "Gemi içi su alma riskini yönet.",
        ],
        imageAlt: "Ağır hava güvenlik kontrolü",
        motionCue: "Güvenlik kartlarını sırayla parlat.",
      },
      {
        title: "4. Vardiya ve İzleme",
        summary: "Ağır havada vardiya yoğunluğu ve izleme sıklığı artmalıdır.",
        bullets: [
          "Ek gözcü görevlendir.",
          "Kritik parametreleri kısa aralıklarla ölç.",
          "Acil durum hazırlıklarını güncelle.",
        ],
        imageAlt: "Ağır hava vardiya planı",
        motionCue: "Vardiya bloklarını yukarıdan aşağıya kaydır.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["agir-hava-seyri"],
    calculationLinks: [
      { title: "Hava Durumu", href: "/navigation/calc/weather" },
      { title: "Temel Seyir (Zaman–Mesafe–Hız)", href: "/navigation/calc/eta" },
      { title: "Passage Plan (Leg ETA)", href: "/navigation/calc/passage" },
    ],
  },
  {
    id: "buzlu-sularda-seyir",
    title: "Buzlu Sularda Seyir",
    pages: buildPages("buzlu-sularda-seyir", [
      {
        title: "1. Buz Sınıfları",
        summary: "Ice class, geminin buzlu sulardaki operasyon yeteneğini belirler.",
        bullets: [
          "Ice class sertifikasını kontrol et.",
          "Buz sınıfına uygun hız limitlerini uygula.",
          "Yapısal riskleri göz önünde bulundur.",
        ],
        imageAlt: "Buz sınıfı özet tablosu",
        motionCue: "Ice class satırlarını sırayla highlight et.",
      },
      {
        title: "2. Rota Seçimi",
        summary: "Buz yoğunluğu ve akıntı, rota seçiminde belirleyicidir.",
        bullets: [
          "Ice chart ve uydu görüntülerini kullan.",
          "Buz kıran desteğini planla.",
          "Buz yoğun bölgelerden kaçın.",
        ],
        imageAlt: "Buzlu sularda rota planı",
        motionCue: "Buz yoğunluğu bölgelerini yumuşak pulse ile göster.",
      },
      {
        title: "3. Seyir Teknikleri",
        summary: "Buzlu sularda hız ve manevra kontrollü olmalıdır.",
        bullets: [
          "Gemi başını buz yönüne göre ayarla.",
          "Ani manevralardan kaçın.",
          "Makine durumunu sürekli izle.",
        ],
        imageAlt: "Buzlu sularda manevra şeması",
        motionCue: "Manevra oklarını yavaşça hareket ettir.",
      },
      {
        title: "4. Emniyet Önlemleri",
        summary: "Soğuk hava, donma ve ekipman arızaları risk yaratır.",
        bullets: [
          "Güverte ekipmanlarını buzdan temizle.",
          "Arama kurtarma hazırlıklarını artır.",
          "İletişim ve acil durum planlarını güncelle.",
        ],
        imageAlt: "Buzlu sularda emniyet önlemleri",
        motionCue: "Emniyet ikonlarını sıralı parıltı ile vurgula.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["buzlu-sularda-seyir"],
    calculationLinks: [
      { title: "Hava Durumu", href: "/navigation/calc/weather" },
      { title: "Seyir Emniyeti (Squat/UKC)", href: "/navigation/calc/safety" },
      { title: "Passage Plan (Leg ETA)", href: "/navigation/calc/passage" },
    ],
  },
  {
    id: "manevra-karakteristikleri",
    title: "Manevra Karakteristikleri",
    pages: buildPages("manevra-karakteristikleri", [
      {
        title: "1. Dönüş Parametreleri",
        summary: "Turning circle, advance ve transfer değerleri manevra analizinin temelidir.",
        bullets: [
          "Advance ve transfer ölçümlerini bil.",
          "Dönüş çapını gemi hızına göre değerlendir.",
          "Manevra test kayıtlarını incele.",
        ],
        imageAlt: "Turning circle şeması",
        motionCue: "Dönüş çizgisini yarım daire animasyonuyla çiz.",
      },
      {
        title: "2. Durdurma Mesafesi",
        summary: "Stopping distance, acil durumlarda kritik bir parametredir.",
        bullets: [
          "Full astern ve crash stop değerlerini bil.",
          "Yük durumuna göre durdurma mesafesi değişir.",
          "Makine gücünü ve pervane tipini dikkate al.",
        ],
        imageAlt: "Stopping distance grafiği",
        motionCue: "Durdurma grafiğini soldan sağa animasyonla çiz.",
      },
      {
        title: "3. Rüzgâr ve Akıntı Etkisi",
        summary: "Manevra karakteristikleri çevresel koşullardan etkilenir.",
        bullets: [
          "Rüzgâr yönü ve şiddetini manevrada hesaba kat.",
          "Akıntı sapmasını önceden öngör.",
          "Tug desteği gerekliliğini değerlendirin.",
        ],
        imageAlt: "Manevra sırasında rüzgâr etkisi",
        motionCue: "Rüzgâr oklarını hafif dalga animasyonuyla hareket ettir.",
      },
      {
        title: "4. Uygulama ve Eğitim",
        summary: "Manevra performansı simülasyon ve eğitimle geliştirilir.",
        bullets: [
          "Simülatör eğitimlerini düzenli yap.",
          "Manevra limitlerini ekiple paylaş.",
          "Manevra sonrası performans değerlendirmesi yap.",
        ],
        imageAlt: "Manevra eğitimi planı",
        motionCue: "Eğitim adımlarını sırayla parlat.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["manevra-karakteristikleri"],
    calculationLinks: [
      { title: "Dönüş Hesaplamaları", href: "/navigation/calc/turning" },
      { title: "Temel Seyir (Zaman–Mesafe–Hız)", href: "/navigation/calc/eta" },
      { title: "Seyir Emniyeti (Squat/UKC)", href: "/navigation/calc/safety" },
    ],
  },
  {
    id: "ekonomik-seyir",
    title: "Ekonomik Seyir",
    pages: buildPages("ekonomik-seyir", [
      {
        title: "1. Ekonomik Hız",
        summary: "Ekonomik hız, yakıt tüketimi ve zaman dengesiyle belirlenir.",
        bullets: [
          "Tüketim eğrilerini analiz et.",
          "Şirket politikalarını dikkate al.",
          "Rota ve hava koşullarına göre hız ayarla.",
        ],
        imageAlt: "Yakıt tüketim eğrisi",
        motionCue: "Eğriyi soldan sağa çizim animasyonu ile göster.",
      },
      {
        title: "2. Yakıt Yönetimi",
        summary: "Yakıt planlaması, sefer maliyetini doğrudan etkiler.",
        bullets: [
          "Bunker planını rota ve limanlara göre yap.",
          "Yakıt kalite kontrollerini uygula.",
          "Tüketim raporlarını düzenli kaydet.",
        ],
        imageAlt: "Yakıt yönetimi kontrol listesi",
        motionCue: "Kontrol maddelerini sırayla highlight et.",
      },
      {
        title: "3. Rota Optimizasyonu",
        summary: "Hava ve akıntı verileri rota optimizasyonunda kullanılır.",
        bullets: [
          "Weather routing tavsiyelerini değerlendir.",
          "Akıntı avantajını rota planına dahil et.",
          "Alternatif rotaları maliyet bazında karşılaştır.",
        ],
        imageAlt: "Rota optimizasyonu şeması",
        motionCue: "Alternatif rotaları sırayla vurgula.",
      },
      {
        title: "4. Performans İzleme",
        summary: "Performans izleme, ekonomik seyir hedeflerini doğrular.",
        bullets: [
          "KPI’ları (hız, tüketim, ETA) takip et.",
          "Sapmaları raporla ve düzeltme uygula.",
          "Enerji verimliliği raporlarını güncelle.",
        ],
        imageAlt: "Performans izleme paneli",
        motionCue: "KPI kartlarını yumuşak pulse animasyonuyla göster.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["ekonomik-seyir"],
    calculationLinks: [
      { title: "Temel Seyir (Zaman–Mesafe–Hız)", href: "/navigation/calc/eta" },
      { title: "Hava Durumu", href: "/navigation/calc/weather" },
      { title: "Passage Plan (Leg ETA)", href: "/navigation/calc/passage" },
    ],
  },
  {
    id: "ais-kullanimi",
    title: "AIS Kullanımı",
    pages: buildPages("ais-kullanimi", [
      {
        title: "1. AIS Temelleri",
        summary: "AIS, gemi kimlik ve seyir bilgilerini paylaşır.",
        bullets: [
          "AIS sınıflarını (A/B) ayırt et.",
          "Statik ve dinamik verileri bil.",
          "AIS veri güncellemelerini kontrol et.",
        ],
        imageAlt: "AIS veri akışı",
        motionCue: "Veri akışını noktalı çizgi animasyonuyla göster.",
      },
      {
        title: "2. Kullanım Sınırlamaları",
        summary: "AIS verisi her zaman doğru ve güncel olmayabilir.",
        bullets: [
          "Yanlış MMSI ve rota bilgilerine dikkat et.",
          "AIS sinyal kesintisi riskini göz önünde bulundur.",
          "Görsel ve radar doğrulaması yap.",
        ],
        imageAlt: "AIS sınırlamaları",
        motionCue: "Uyarı ikonlarını sırayla kırmızı vurguyla göster.",
      },
      {
        title: "3. Operasyonel Entegrasyon",
        summary: "AIS, radar ve ECDIS ile birlikte kullanılmalıdır.",
        bullets: [
          "AIS hedeflerini radar hedefiyle eşleştir.",
          "AIS mesajlarını trafik resmi için kullan.",
          "Çarpışma önleme kararlarında tek kaynak olarak kullanma.",
        ],
        imageAlt: "AIS entegrasyon şeması",
        motionCue: "Entegrasyon bağlantılarını yumuşak parıltı ile canlandır.",
      },
      {
        title: "4. Veri Yönetimi",
        summary: "AIS kayıtları, olay incelemelerinde kritik bilgi sağlar.",
        bullets: [
          "AIS log kayıtlarını düzenli sakla.",
          "Şüpheli hedefleri not et.",
          "VTS talimatlarıyla uyumu kaydet.",
        ],
        imageAlt: "AIS veri yönetimi",
        motionCue: "Log kayıt kartlarını sırayla parlat.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["ais-kullanimi"],
    calculationLinks: [
      { title: "CPA / TCPA", href: "/navigation/calc/cpa" },
      { title: "COLREG Durum & Manevra", href: "/navigation/calc/colreg" },
      { title: "Radar Plot (Hedef Rota/Hız)", href: "/navigation/calc/radar" },
    ],
  },
  {
    id: "colreg-pratikleri",
    title: "COLREG Pratikleri",
    pages: buildPages("colreg-pratikleri", [
      {
        title: "1. Karşılaşma Durumları",
        summary: "COLREG kuralları karşılaşma tiplerine göre uygulanır.",
        bullets: [
          "Kafa kafaya, çapraz ve geçiş durumlarını ayırt et.",
          "Give-way ve stand-on rollerini netleştir.",
          "Manevra zamanlamasını doğru belirle.",
        ],
        imageAlt: "COLREG karşılaşma şemaları",
        motionCue: "Gemi ikonlarını karşılaşma yönünde hareket ettir.",
      },
      {
        title: "2. Işıklar ve Şekiller",
        summary: "Gemi ışıkları ve şekilleri, geminin durumunu bildirir.",
        bullets: [
          "Seyir fenerlerini ve ışık karakterlerini bil.",
          "Kısıtlı manevra ve özel durum işaretlerini ayırt et.",
          "Gece-gündüz işaret farklarını uygula.",
        ],
        imageAlt: "COLREG ışık karakterleri",
        motionCue: "Işık ikonlarını sıralı yanıp sönme ile göster.",
      },
      {
        title: "3. Kısıtlı Görüş",
        summary: "Kısıtlı görüşte emniyetli hız ve ses sinyalleri önemlidir.",
        bullets: [
          "Emniyetli hızı düşür ve radarı yoğun kullan.",
          "Ses sinyallerini doğru uygula.",
          "Trafik resmi ile karar ver.",
        ],
        imageAlt: "Kısıtlı görüş COLREG uygulaması",
        motionCue: "Görüş kısıtını sis geçiş animasyonuyla vurgula.",
      },
      {
        title: "4. Uygulama Hataları",
        summary: "Yanlış yorum, gecikmiş manevra ve iletişimsizlik risk yaratır.",
        bullets: [
          "Kararı net ve erken uygula.",
          "Karşı tarafı gözlemlemeden manevra yapma.",
          "VHF iletişiminde yanlış anlaşılmaları önle.",
        ],
        imageAlt: "COLREG hata önleme",
        motionCue: "Hata kartlarını kısa shake animasyonuyla göster.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["colreg-pratikleri"],
    calculationLinks: [
      { title: "COLREG Durum & Manevra", href: "/navigation/calc/colreg" },
      { title: "CPA / TCPA", href: "/navigation/calc/cpa" },
      { title: "COLREG Kuralları", href: "/navigation/rules" },
    ],
  },
  {
    id: "kaza-ornekleri",
    title: "Kaza Örnekleri",
    pages: buildPages("kaza-ornekleri", [
      {
        title: "1. Örnek Vaka Analizi",
        summary: "Vaka analizleri, hataların tekrarlanmasını önler.",
        bullets: [
          "Kaza öncesi koşulları ve kararları incele.",
          "COLREG uygulamasındaki hataları belirle.",
          "Teknik ve insan faktörlerini ayır.",
        ],
        imageAlt: "Kaza analizi süreci",
        motionCue: "Zaman çizgisini soldan sağa ilerlet.",
      },
      {
        title: "2. Near-Miss Dersleri",
        summary: "Near-miss olayları, erken uyarı niteliğindedir.",
        bullets: [
          "Near-miss raporlarını paylaş.",
          "Riskli davranışları belirle.",
          "Düzeltici aksiyonları planla.",
        ],
        imageAlt: "Near-miss raporlama akışı",
        motionCue: "Akış oklarını sırayla parlat.",
      },
      {
        title: "3. Öğrenilen Dersler",
        summary: "Öğrenilen dersler prosedürlerin geliştirilmesine katkı sağlar.",
        bullets: [
          "Standart iş talimatlarını güncelle.",
          "Ekip eğitimlerini vaka örnekleriyle güçlendir.",
          "Risk iletişimini artır.",
        ],
        imageAlt: "Öğrenilen dersler listesi",
        motionCue: "Liste öğelerini sırayla highlight et.",
      },
      {
        title: "4. Önleyici Yaklaşım",
        summary: "Önleyici yaklaşım, riskleri oluşmadan azaltır.",
        bullets: [
          "Davranış odaklı emniyet uygulamaları oluştur.",
          "Denetim ve kontrol sıklığını artır.",
          "Sürekli iyileştirme kültürü oluştur.",
        ],
        imageAlt: "Önleyici yaklaşım döngüsü",
        motionCue: "Döngü ikonlarını yumuşak dönüş animasyonuyla canlandır.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["kaza-ornekleri"],
    calculationLinks: [
      { title: "COLREG Durum & Manevra", href: "/navigation/calc/colreg" },
      { title: "Acil Durum", href: "/navigation/calc/emergency" },
      { title: "Seyir Emniyeti (Squat/UKC)", href: "/navigation/calc/safety" },
      { title: "COLREG Kuralları", href: "/navigation/rules" },
    ],
  },
  {
    id: "simulator-modulleri",
    title: "Simülatör Modülleri",
    pages: buildPages("simulator-modulleri", [
      {
        title: "1. Eğitim Amaçları",
        summary: "Simülatör, gerçek risk olmadan pratik yapma imkânı sunar.",
        bullets: [
          "Senaryo hedeflerini netleştir.",
          "Kritik karar noktalarını tanımla.",
          "Eğitim sonuçlarını ölç.",
        ],
        imageAlt: "Simülatör eğitim hedefleri",
        motionCue: "Hedef kartlarını sırayla parlat.",
      },
      {
        title: "2. Radar/ARPA Senaryoları",
        summary: "Radar ve ARPA senaryoları, hedef takibi ve çarpışma önlemeyi öğretir.",
        bullets: [
          "CPA/TCPA yorumlama pratiği yap.",
          "Kısıtlı görüş senaryoları uygula.",
          "Karar hızını artır.",
        ],
        imageAlt: "Radar simülasyon senaryosu",
        motionCue: "Radar ekranında sweep animasyonu kullan.",
      },
      {
        title: "3. Köprüüstü İletişimi",
        summary: "Simülasyon, ekip içi iletişimi test etmeye uygundur.",
        bullets: [
          "BRM iletişim prosedürlerini uygula.",
          "VHF konuşma disiplini oluştur.",
          "Koordinasyon eksiklerini tespit et.",
        ],
        imageAlt: "Köprüüstü iletişim senaryosu",
        motionCue: "İletişim balonlarını kısa fade ile sırala.",
      },
      {
        title: "4. Değerlendirme",
        summary: "Eğitim sonrası değerlendirme, performans gelişimini sağlar.",
        bullets: [
          "Hata noktalarını kayıt altına al.",
          "Gelişim hedeflerini belirle.",
          "Tekrar senaryolarıyla pekiştir.",
        ],
        imageAlt: "Simülatör değerlendirme raporu",
        motionCue: "Değerlendirme kartını aşağıdan yukarıya kaydır.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["simulator-modulleri"],
    calculationLinks: [
      { title: "Radar Plot (Hedef Rota/Hız)", href: "/navigation/calc/radar" },
      { title: "COLREG Durum & Manevra", href: "/navigation/calc/colreg" },
      { title: "CPA / TCPA", href: "/navigation/calc/cpa" },
    ],
  },
  {
    id: "seyir-belgeleri",
    title: "Seyir Belgeleri",
    pages: buildPages("seyir-belgeleri", [
      {
        title: "1. Kayıt Türleri",
        summary: "Seyir kayıtları, operasyonel ve yasal gereklilikleri karşılar.",
        bullets: [
          "Köprüüstü logbook ve seyir jurnali ayır.",
          "Radar/AIS kayıtlarını sakla.",
          "Elektronik kayıtların yedeklerini al.",
        ],
        imageAlt: "Seyir kayıt türleri",
        motionCue: "Belge kartlarını sırayla ortaya çıkar.",
      },
      {
        title: "2. Düzenli Kayıt",
        summary: "Düzenli kayıt, denetim ve kaza incelemelerinde kritik önemdedir.",
        bullets: [
          "Saatlik mevki ve hız kayıtlarını tut.",
          "Olay ve değişimleri açık yaz.",
          "İmza ve onay süreçlerini takip et.",
        ],
        imageAlt: "Kayıt düzeni şeması",
        motionCue: "Kayıt çizgisini soldan sağa çiz.",
      },
      {
        title: "3. GMDSS ve Emniyet",
        summary: "GMDSS kayıtları ve emniyet mesajları resmi belgeler arasındadır.",
        bullets: [
          "GMDSS test ve mesaj kayıtlarını sakla.",
          "MSI ve NAVTEX mesajlarını arşivle.",
          "Arıza kayıtlarını detaylandır.",
        ],
        imageAlt: "GMDSS kayıt akışı",
        motionCue: "GMDSS ikonlarını yumuşak pulse ile vurgula.",
      },
      {
        title: "4. Denetim Hazırlığı",
        summary: "Denetimlerde eksiksiz kayıt sunumu gerekir.",
        bullets: [
          "Kayıtların güncel ve erişilebilir olmasını sağla.",
          "Kayıp veya eksik kayıtları raporla.",
          "Denetim öncesi hızlı kontrol listesi uygula.",
        ],
        imageAlt: "Denetim hazırlık kontrol listesi",
        motionCue: "Kontrol maddelerini sırayla onay animasyonuyla göster.",
      },
      {
        title: "5. Bowditch Kullanımı",
        summary: "Bowditch, seyir planlama ve chartwork için temel başvuru kaynağıdır.",
        bullets: [
          "Tablolar ve formüllerle rota ve zaman hesaplarını doğrula.",
          "Seyir yayınları arasında Bowditch’i güncel baskı/versiyonla takip et.",
          "Köprüüstü prosedürlerinde ilgili bölüm numaralarını hızlı erişim için işaretle.",
        ],
        imageAlt: "Bowditch referans kitabı kullanım akışı",
        motionCue: "Kitap ikonunu açılıp kapanan sayfa animasyonuyla vurgula.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["seyir-belgeleri"],
    calculationLinks: [
      { title: "Passage Plan (Leg ETA)", href: "/navigation/calc/passage" },
      { title: "Temel Seyir (Zaman–Mesafe–Hız)", href: "/navigation/calc/eta" },
      { title: "Seyir Formülleri", href: "/navigation/formulas" },
    ],
  },
  {
    id: "vardiya-yonetimi",
    title: "Vardiya Yönetimi",
    pages: buildPages("vardiya-yonetimi", [
      {
        title: "1. Vardiya Devri",
        summary: "Vardiya devri, kritik bilgilerin aktarımını sağlar.",
        bullets: [
          "Rota ve trafik durumunu devreden personele aktar.",
          "Cihaz ayarlarını ve alarmları bildir.",
          "Öncelikli riskleri vurgula.",
        ],
        imageAlt: "Vardiya devri kontrol listesi",
        motionCue: "Devri gösteren okları sırayla parlat.",
      },
      {
        title: "2. Gözcülük",
        summary: "Gözcülük, emniyetli seyir için vazgeçilmezdir.",
        bullets: [
          "Görsel ve işitsel gözcülüğü sürdür.",
          "Kısıtlı görüşte gözcülük yoğunluğunu artır.",
          "Gözcülük raporlarını kaydet.",
        ],
        imageAlt: "Gözcülük görevleri",
        motionCue: "Gözcü ikonlarını yavaş pulse animasyonuyla göster.",
      },
      {
        title: "3. Vardiya Disiplini",
        summary: "Disiplinli vardiya, hataları ve gecikmeleri azaltır.",
        bullets: [
          "Vardiya saatlerine tam uy.",
          "Kritik işlemler sırasında dikkati bölme.",
          "Vardiya içinde görev dağılımını netleştir.",
        ],
        imageAlt: "Vardiya disiplini şeması",
        motionCue: "Disiplin adımlarını sırayla vurgula.",
      },
      {
        title: "4. Performans Takibi",
        summary: "Vardiya performansı, rapor ve geri bildirimle geliştirilir.",
        bullets: [
          "Vardiya sonrası kısa değerlendirme yap.",
          "Eksik veya hatalı uygulamaları raporla.",
          "Eğitim ihtiyaçlarını belirle.",
        ],
        imageAlt: "Vardiya performans takibi",
        motionCue: "Performans kartlarını sırayla parlat.",
      },
    ]),
    accuracyChecklist: accuracyChecklistMap["vardiya-yonetimi"],
    calculationLinks: [
      { title: "Temel Seyir (Zaman–Mesafe–Hız)", href: "/navigation/calc/eta" },
      { title: "CPA / TCPA", href: "/navigation/calc/cpa" },
      { title: "Acil Durum", href: "/navigation/calc/emergency" },
    ],
  },
];
