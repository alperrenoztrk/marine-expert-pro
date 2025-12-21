import { Anchor, Battery, Cog, Droplets, Factory, Flame, Gauge, ShieldCheck, Snowflake } from "lucide-react";

export type MachinerySystemId =
  | "main-engine"
  | "auxiliary-generators"
  | "power-distribution"
  | "fuel-lube"
  | "pumps"
  | "cooling-hvac"
  | "boilers"
  | "safety-control"
  | "deck-machinery";

export interface MachinerySystemInfo {
  id: MachinerySystemId;
  name: string;
  description: string;
  summary: string;
  icon: typeof Cog;
  accent: string;
  duties: string[];
  operations: string[];
  monitoring: string[];
  integration: string[];
}

export const machinerySystems: MachinerySystemInfo[] = [
  {
    id: "main-engine",
    name: "Ana Makine (Sevk Sistemi)",
    description: "Ana dizel/türbin veya diesel-electric sevk sistemleri",
    summary:
      "Geminin hız, tork ve manevra kabiliyetini sağlayan ana sevk sistemi; yakıt, yağlama ve kontrol sistemleriyle entegre çalışır.",
    icon: Cog,
    accent: "from-amber-600 via-orange-500 to-yellow-500",
    duties: [
      "Ana makine devri, torku ve yük paylaşımıyla güvenli seyir sağlama",
      "CPP/FPP pervane ve nozzle/azimut tahrik ayarlarının manevraya uygun yönetimi",
      "Start/stop, slow-turn, turning gear ve maneuvering testlerinin prosedüre uygun yapılması",
      "Class ve üretici gerekliliklerine göre saatlik/uyarı temelli bakım planlaması"
    ],
    operations: [
      "Fuel rack/SFOC optimizasyonu için yük–devir çizelgesini seyir profilinde ayarla",
      "Start-up öncesi yağ basıncı, jacket/HT/LT soğutma suyu ve LO sirkülasyonunu hazırla",
      "Manevra öncesi astern testini, pitch kontrolünü ve gear kutusu yağ basıncı/filtre bypass kontrollerini kaydet",
      "Black-out veya kick-back senaryoları için emergency stop, air start bottle basıncı ve turning gear emniyetlerini doğrula"
    ],
    monitoring: [
      "ME cylinder/LO temp, exhaust temp spread ve scavenge diferansiyel basınçlarını trend ile takip et",
      "Turbine/turbocharger vibrasyon ve thrust bearing sıcaklıklarını alarm limitlerine göre izle",
      "Fuel leak-off, starting air tüketimi ve crankcase mist/alarm göstergelerini vardiya bazında kaydet",
      "Bridge/ECR yük değişimlerine cevap süresini ve governor hunting durumlarını gözlemle"
    ],
    integration: [
      "Voyage planla uyumlu ekonomik/sea speed profili için köprüüstü ile RPM/Pitch anlaşması",
      "EMS/ECR, thrust/shaft power meter ve VDR ile veri paylaşımı",
      "Kazan, yakıt hazırlama ve güç yönetimi sistemleriyle ortak alarmlar ve load shedding senaryoları"
    ]
  },
  {
    id: "auxiliary-generators",
    name: "Yardımcı Jeneratörler",
    description: "Ana/yardımcı dizel ve acil durum jeneratörleri",
    summary:
      "Güverte ve makina yüklerini besleyen prime mover ve alternatör kombinasyonları; blackout önleme, yük paylaşımı ve yedeklilik sağlar.",
    icon: Factory,
    accent: "from-sky-600 via-blue-500 to-indigo-500",
    duties: [
      "Aktif/inactive set rotasyonu ve eşit saat dağılımı ile güvenilirlik sağlama",
      "Load sharing/droop/isochronous modlarının işletme senaryosuna göre seçilmesi",
      "Blackout recovery ve emergency generator senaryolarının tatbikatı",
      "Yakıt ve yağlama sistemlerinin ayrı/emniyetli devre yönetimi"
    ],
    operations: [
      "Paralel bağlama öncesi voltaj, frekans ve faz açısını senkronoskop veya synch-check ile hizala",
      "Step load testleriyle transient response ve AVR/Governor ayarlarını doğrula",
      "Yük paylaşım eğrilerini (kW/kVAR) gözleyerek reaktif güç dengesini koru",
      "Sıcak/soğuk standby prosedürlerini ve otomatik start/stop lojiklerini test et"
    ],
    monitoring: [
      "Silindir başı sıcaklık, egzoz dumanı ve rulman titreşimlerini karşılaştırmalı izle",
      "Alternatör izolasyon direnci ve stator/rotor sıcaklıklarını periodik ölç",
      "Yakıt tüketimi, yağ basıncı ve filtre diferansiyellerini trende işle",
      "Alarm/event logger üzerinden senkronizasyon ve yük atma kayıtlarını arşivle"
    ],
    integration: [
      "Ana/yardımcı switchboard load shedding ve otomatik yük transfer sekansları",
      "UPS ve kritik tüketiciler için önceliklendirilmiş besleme",
      "EMS/Power management system (PMS) ile merkezi kontrol ve izleme"
    ]
  },
  {
    id: "power-distribution",
    name: "Elektrik & Güç Sistemleri",
    description: "Ana/acil switchboard, trafolar ve bataryalar",
    summary:
      "Switchboard, transformatör ve dağıtım panoları geminin tüm yüklerini besler; selectivity, kısa devre koruma ve yedek güç sürekliliği sağlar.",
    icon: Battery,
    accent: "from-emerald-600 via-green-500 to-teal-500",
    duties: [
      "Ana/acil baralar arası transfer, bus-tie ve shore connection yönetimi",
      "Kısa devre, aşırı yük ve toprak hatası korumalarının koordinasyonu",
      "UPS/DC sistemleriyle seyrüsefer ve haberleşme yüklerinin korunması",
      "Harmonik ve güç faktörü takibiyle enerji kalitesini sürdürme"
    ],
    operations: [
      "Breaker ayarlarını (LSIG, OCR, GFR) selectivity tablolarına göre doğrula",
      "Shore power bağlantısında voltaj/frekans uyumu ve faz sıralamasını kontrol et",
      "Battery room havalandırma, izolasyon ve periyodik kapsite testlerini uygula",
      "Emergency switchboard testlerini (auto-start/auto-transfer) aylık kaydet"
    ],
    monitoring: [
      "Baralar arası yük dengesini ve harmonik bozulmaları (THD) ölç",
      "Isınma/tutarsızlık için IR termal kamera kontrolleri yap",
      "Toprak kaçak izleme (IMD/insulation monitoring) alarm geçmişini kontrol et",
      "UPS alarm/event loglarını inceleyerek DC link ve batarya sağlığını takip et"
    ],
    integration: [
      "PMS, alarm izleme ve enerji raporlama yazılımlarıyla veri paylaşımı",
      "Jeneratör, tahrik motoru ve kritik pompalar için otomatik yük önceliklendirme",
      "Köprüüstü durum ekranları ve VDR ile enerji kesinti kayıtlarının paylaşılması"
    ]
  },
  {
    id: "fuel-lube",
    name: "Yakıt & Yağ Sistemleri",
    description: "Separatörler, transfer/besleme pompaları ve tank yönetimi",
    summary:
      "Fuel ve lube oil hazırlama, separasyon ve dağıtım süreçleri ana/yardımcı makinelerin temiz, uygun viskozitede yakıt/yağ ile beslenmesini sağlar.",
    icon: Droplets,
    accent: "from-orange-600 via-amber-500 to-yellow-400",
    duties: [
      "Daily/service tank seviyeleri ve çift valf/emniyet izolasyonlarının yönetimi",
      "Separatör operasyonu ve sloptank/settling tank su tahliyesi",
      "Yakıt viskozite/sıcaklık kontrolü ve change-over (HFO/MGO) prosedürleri",
      "LO filtrasyon, by-pass ve numune alma süreçlerinin yürütülmesi"
    ],
    operations: [
      "Bunker sonrası density/viscosity analizini yapıp FO heater setpointlerini ayarla",
      "Separatör diferansiyel basıncı, bowl speed ve discharge döngülerini izleyerek temizliği planla",
      "Change-over öncesi ısıtma/soğutma rampalarını MARPOL VI ve üretici limitlerine göre uygula",
      "Drip sample ve günlük LO analizlerini kaydet, trendde metal/katkı değişimini izle"
    ],
    monitoring: [
      "Service/daily tank su kesicilerini ve high-level alarmlarını test et",
      "FO/LO filtre delta-P ve viskozite kontrolörlerinin sapmalarını gözle",
      "Duplex filtre geçişlerinde bypass riskine karşı çapraz kontrol yap",
      "Bunker manifold/transfer operasyonlarında sızıntı ve sıcaklık artışlarını termal kamera ile denetle"
    ],
    integration: [
      "Ana makine, jeneratör ve kazan yakıt tüketim raporlarına veri sağlama",
      "Boiler, inert gas ve sludge management sistemleriyle paylaşılan tank/pompa kullanımı",
      "EMS ve çevresel raporlama için SOx scrubber, VLSFO kullanımı ve enerji verisi entegrasyonu"
    ]
  },
  {
    id: "pumps",
    name: "Pompalar",
    description: "Sintine, balast, yangın ve soğutma pompa setleri",
    summary:
      "Sintine, balast, yangın ve soğutma devreleri için kullanılan pompa sistemleri; emniyet, trim/draft yönetimi ve soğutma sürekliliğini sağlar.",
    icon: Gauge,
    accent: "from-blue-600 via-cyan-500 to-sky-500",
    duties: [
      "Sintine ve balast pompalarıyla trim/draft ve su girişini kontrol et",
      "Yangın pompalarının (main/emergency) hazır olmasını sağla, haftalık testleri yürüt",
      "Sea water/fresh water cooling pompalarıyla makine ısıl yükünü yönet",
      "Hazardous area pompa ve sürücülerinde ex-proof kontrol ve kilitleme"
    ],
    operations: [
      "Balast transferlerinde tank sekans planı, manifold/vent ayarları ve shear force limiti gözet",
      "Fire main basınç testleri ve remote start/stop devrelerinin doğrulaması",
      "SW/FW pumplarının standby/auto değişim lojiklerini test et",
      "Sea chest değişimi sırasında strainer temizliği ve vakum değerlerini izle"
    ],
    monitoring: [
      "Titreşim, motor akımı ve rulman sıcaklıklarını trend ile takip et",
      "Mechanical seal/salmastra kaçaklarını ve coupling hizalamasını kontrol et",
      "Balast/sentine discharge izinleri ve oil content monitor kayıtlarını güncel tut",
      "Yangın pompaları için relief/priming basınçlarını ve non-return valf davranışını izle"
    ],
    integration: [
      "IAS/AMS üzerinden otomatik pompa start/stop ve alarm paylaşımı",
      "Balast Water Management planı ve ODME/15ppm OCM loglarıyla uyum",
      "Main engine, chiller ve auxiliary sistemlerin soğutma suyu ihtiyaçlarıyla koordinasyon"
    ]
  },
  {
    id: "cooling-hvac",
    name: "Soğutma & HVAC",
    description: "Merkezi soğutma, chiller ve klima/soğuk depo sistemleri",
    summary:
      "Makine ve yaşam mahalleri için ısı transferini yöneten merkezi soğutma, chiller ve HVAC sistemleri; konfor, ekipman ömrü ve gıda güvenliğini korur.",
    icon: Snowflake,
    accent: "from-sky-500 via-cyan-400 to-emerald-400",
    duties: [
      "LT/HT devreleri, plate heat exchanger ve central cooler işletimi",
      "Chiller, AHU ve reefer devrelerinin sıcaklık ve nem kontrolü",
      "Soğuk hava depolarında HACCP uyumlu sıcaklık takibi",
      "Kontrol valfleri, üç yollu valf ve bypass ayarlarıyla stabilizasyon"
    ],
    operations: [
      "Chiller start-up/shutdown sırasında oil return ve superheat değerlerini kontrol et",
      "Sea/river water değişimlerinde central cooler bypass ve kimyasal dozlama ayarlarını yap",
      "HVAC filtre/coil temizliği ve damper ayarlarını sezonluk optimize et",
      "Reefer konteyner yüklemesinde setpoint, defrost ve güç kablosu kontrollerini kaydet"
    ],
    monitoring: [
      "Compressor suction/discharge basınçları ve evaporator/condenser delta-T trendi",
      "Glycol/soğutma suyu kalitesi, korozyon inhibitörü ve biyosit takibi",
      "Reefer alarm geçmişi, sıcaklık sapmaları ve enerji tüketimini izleme",
      "HVAC oda basınç balansı ve CO₂/IAQ sensör kalibrasyonlarını doğrula"
    ],
    integration: [
      "Makine kontrol sistemi ve BMS/AMS üzerinden uzaktan izleme",
      "Ana makine ve jeneratör soğutma devreleriyle ısıl yük paylaşımı",
      "Enerji verimliliği raporları ve gıda güvenliği kayıtlarıyla veri paylaşımı"
    ]
  },
  {
    id: "boilers",
    name: "Kazanlar (Boiler)",
    description: "Auxiliary boiler, EGB ve steam sistemleri",
    summary:
      "Buhar ve ısıtma ihtiyacını karşılayan yardımcı kazan ve egzoz gazı kazanı; yakıt hazırlama, tank ısıtma ve hotel yükleri için kritik buhar sağlar.",
    icon: Flame,
    accent: "from-rose-600 via-orange-500 to-amber-500",
    duties: [
      "Buhar üretimi ve dağıtımında basınç/sıcaklık kontrolü",
      "EGB/aux boiler arasında duty/standby veya paralleling stratejisi",
      "Fuel heating, HFO service tank serpantin ve hotel steam yüklerinin yönetimi",
      "Blowdown, water treatment ve TDS kontrolüyle korozyon önleme"
    ],
    operations: [
      "Boiler start-up sırasında purge, ignition ve flame safeguard kontrollerini doğrula",
      "EGB by-pass, soot blower ve economizer washing prosedürlerini uygula",
      "TDS/PH/alkalinity testleriyle su kimyasını ayarla, kimyasal dozlamayı kayıt altına al",
      "Steam trap ve kondens geri dönüş hatlarının izolasyon/kaçak testlerini yap"
    ],
    monitoring: [
      "Basınç, su seviyesi ve flame scanner alarmlarını AMS üzerinden takip et",
      "Fuel/atomizing steam basınçları ve yanma verimliliği için stack O₂/CO ölç",
      "Soot blower sonrası diferansiyel basınç ve egzoz sıcaklığı değişimini izle",
      "Safety valve test tarihleri ve kayıtlarını güncel tut"
    ],
    integration: [
      "Yakıt hazırlama, tank ısıtma ve HVAC/soğuk depo serpantinleriyle buhar paylaşımı",
      "EGB + oil boiler karma çalışmasında yük paylaştırma",
      "Alarm yönetim sistemi ve enerji raporlamasıyla tüketim/performans verisi"
    ]
  },
  {
    id: "safety-control",
    name: "Emniyet & Kontrol Sistemleri",
    description: "ECR, IAS/AMS, yangın algılama ve CO₂",
    summary:
      "Makine dairesi alarm/izleme, yangın algılama ve sabit gazlı söndürme sistemleri; ekip güvenliği ve otomasyon sürekliliğinin temel katmanıdır.",
    icon: ShieldCheck,
    accent: "from-indigo-600 via-purple-500 to-pink-500",
    duties: [
      "IAS/AMS ile makine parametrelerinin toplu izlenmesi ve alarm yönetimi",
      "Yangın algılama, drencher/sprinkler ve sabit CO₂ sistemlerinin hazır tutulması",
      "ECR/Local kontrol noktalarında emergency stop ve quick closing valve testleri",
      "Permit to work, lockout-tagout ve sıcak çalışma izinlerinin uygulanması"
    ],
    operations: [
      "Alarm setpointlerinin class/üretici değerlerine göre doğrulanması",
      "CO₂ release öncesi personel tahliyesi, acil kapamalar ve fan stop sekanslarının tatbikatı",
      "Quick closing fuel valves, ventilation damper ve watertight door testlerini planla",
      "Fire patrol ve detektör kalibrasyon/temizlik programlarını yürüt"
    ],
    monitoring: [
      "Alarm flood/annunciation trendlerini analiz ederek yanlış alarm kaynaklarını bul",
      "CO₂ bottle basınç, weigh-in ve hose integrity kontrollerini periyodik yap",
      "UPS/PLC health status, network latency ve I/O hatalarını izleme",
      "ECR çevre koşulları (ısı, gürültü, aydınlatma) ve CCTV kayıtlarını kontrol et"
    ],
    integration: [
      "Bridge alert management ve VDR ile alarm/event paylaşımı",
      "Machinery space ventilation, FO quick closing ve damper sistemleriyle senkron çalışma",
      "SMS/Muster list tatbikat planları ve ISM raporlamasıyla uyum"
    ]
  },
  {
    id: "deck-machinery",
    name: "Güverte Makineleri",
    description: "Irgat, mooring winch, kreyn ve rampalar",
    summary:
      "Manevra, yükleme ve yanaşma operasyonları için güverte makine ve vinç sistemleri; emniyetli çekme/bağlama ve yük transferi sağlar.",
    icon: Anchor,
    accent: "from-cyan-600 via-teal-500 to-emerald-500",
    duties: [
      "Ir/ mooring winch ve capstan operasyonlarında SWL ve fren yüklerini yönet",
      "Sapan, halat ve zincir bakımını planla; test sertifikalarını güncel tut",
      "Ro-Ro rampa/hydraulic door sistemlerinin kilit/emniyet sekansları",
      "Kreyn ve davit operasyonlarında emniyet briefing ve tag line kullanımını sağla"
    ],
    operations: [
      "Mooring sırasında drum clutch, band brake ve devil claw kontrollerini yap",
      "Windlass/heaving operasyonlarında brake holding testlerini kayıt altına al",
      "Rampa/kapı hydraulic pressure, limit switch ve interlock testlerini yap",
      "Kreyn yağlama, wire rope inspection ve limit switch ayarlarını düzenli kontrol et"
    ],
    monitoring: [
      "Hydraulic oil sıcaklık/basınç ve filtre delta-P değerlerini izle",
      "Wire rope korozyon, aşınma ve kırık tel sayımlarını kayıt altına al",
      "Winch motor akımı ve fren astarı kalınlıklarını takip et",
      "Rampa kilit sensörleri ve emergency release fonksiyonlarını test et"
    ],
    integration: [
      "Ballast/trim planlarıyla mooring yük dağılımının uyumlu olması",
      "Cargo ops planı, terminal ve pilot talimatlarıyla koordinasyon",
      "Hydraulic power pack, alarm paneli ve enerji beslemeleriyle entegre izleme"
    ]
  }
];

export const machinerySystemMap = machinerySystems.reduce<Record<MachinerySystemId, MachinerySystemInfo>>(
  (acc, system) => {
    acc[system.id] = system;
    return acc;
  },
  {} as Record<MachinerySystemId, MachinerySystemInfo>
);
