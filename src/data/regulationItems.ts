export type RegulationCategory =
  | "IMO Sözleşmeleri"
  | "Emniyet Kodları"
  | "Çevresel Düzenlemeler"
  | "Denetim & Sörvey"
  | "Gemi Sertifikaları"
  | "Bölgesel Düzenlemeler";

export interface RegulationResource {
  label: string;
  href: string;
}

export interface RegulationItem {
  slug: string;
  label: string;
  category: RegulationCategory;
  overview: string;
  essentials: string[];
  actions: string[];
  resources?: RegulationResource[];
}

export const regulationItems: RegulationItem[] = [
  {
    slug: "solas",
    label: "SOLAS – Denizde Can Güvenliği",
    category: "IMO Sözleşmeleri",
    overview:
      "Gemilerin tasarım, donanım ve operasyonel güvenlik standartlarını belirleyen temel sözleşme; can kurtarma, yangın güvenliği ve seyre elverişlilik başlıklarını kapsar.",
    essentials: [
      "Bölüm II-2 yangın bütünlüğü, sabit söndürme sistemleri ve algılama gereklilikleri",
      "Bölüm III can kurtarma araçları, tatbikat ve mustering planları",
      "Filo bazında ISM Code ve sertifikasyon sürekliliği",
    ],
    actions: [
      "Emniyet ekipmanının sertifika tarihlerini ve bakım kayıtlarını güncel tut",
      "Acil durum prosedürlerini mürettebatla düzenli tatbikatla doğrula",
      "SMS dokümantasyonunda SOLAS değişikliklerini izleyip yayına al",
    ],
    resources: [
      {
        label: "SOLAS genel bakış (IMO)",
        href: "https://www.imo.org/en/About/Conventions/Pages/International-Convention-for-the-Safety-of-Life-at-Sea.aspx",
      },
    ],
  },
  {
    slug: "marpol",
    label: "MARPOL – Deniz Kirliliğinin Önlenmesi",
    category: "IMO Sözleşmeleri",
    overview:
      "Petrol, kimyasal, atık su, çöpler ve hava emisyonları dâhil olmak üzere gemi kaynaklı kirliliği önlemeye yönelik altı ek ve ilgili kararları düzenler.",
    essentials: [
      "Ek I/II kargo ve makinelerden kaynaklanan kirlenmenin önlenmesi",
      "Ek VI hava emisyonları, yakıt kükürt limitleri ve EGCS raporlaması",
      "Oily Water Separator, IAPP/IOPP sertifikalarının takibi",
    ],
    actions: [
      "Oil Record Book ve Garbage Record Book kayıtlarını günlük doğrula",
      "Bunker teslimat notları ve yakıt örneklerini 36 ay sakla",
      "SEEMP, DCS ve şirket MRV entegrasyonunu denetle",
    ],
    resources: [
      {
        label: "MARPOL konsolide özet",
        href: "https://www.imo.org/en/About/Conventions/Pages/International-Convention-for-the-Prevention-of-Pollution-from-Ships.aspx",
      },
    ],
  },
  {
    slug: "stcw",
    label: "STCW – Gemi Adamları Eğitim ve Belgelendirme",
    category: "IMO Sözleşmeleri",
    overview:
      "Denizcilerin asgari yeterlik, eğitim, sertifikasyon ve vardiya standartlarını belirleyerek güvenli ve çevreci gemi işletmesini sağlar.",
    essentials: [
      "Tablo A-II/1, A-III/1 gibi yeterlik tabloları ve deniz hizmet süreleri",
      "BRM/ERM, ECDIS, IGF, tanker ve güvenlik eğitimlerinin geçerlilik tarihleri",
      "Tıbbi muayene ve denizde çalışma izinlerinin sürekliliği",
    ],
    actions: [
      "Manning planını STCW ve bayrak gerekliliklerine göre eşleştir",
      "Sertifika ve CoC doğrulamalarını onboarding sürecine ekle",
      "Yıllık eğitim matrisi ve simülatör kayıtlarını denetim için sakla",
    ],
    resources: [
      {
        label: "STCW bilgi sayfası",
        href: "https://www.imo.org/en/OurWork/HumanElement/Pages/STCW-Conv-LINK.aspx",
      },
    ],
  },
  {
    slug: "mlc",
    label: "MLC – Denizcilik Çalışma Sözleşmesi",
    category: "IMO Sözleşmeleri",
    overview:
      "Mürettebatın çalışma ve yaşam koşullarını, sözleşme, ödeme, konaklama, sağlık ve refah haklarını harmonize eder.",
    essentials: [
      "MLC Sertifikası, DMLC Bölüm I-II gereklilikleri",
      "Çalışma/istirahat saatleri, mürettebat sözleşmeleri ve repatriation",
      "Gemi sağlık ve refah tesisleri, şikâyet prosedürleri",
    ],
    actions: [
      "Saat çizelgelerini ILO model formatına uygun arşivle",
      "Mürettebat şikâyet kanallarını gemi içi görünür şekilde yayınla",
      "DMLC eylem planı ve iç denetim bulgularını takip et",
    ],
    resources: [
      {
        label: "MLC 2006 rehberi",
        href: "https://www.ilo.org/global/standards/maritime-labour-convention/lang--en/index.htm",
      },
    ],
  },
  {
    slug: "colreg",
    label: "COLREG – Denizde Çatışmayı Önleme Kuralları",
    category: "IMO Sözleşmeleri",
    overview:
      "Çatışmayı önleme manevra kuralları, seyrüsefer ışıkları, şekiller ve ses işaretleri için evrensel standartları belirler.",
    essentials: [
      "Bölüm B Kural 4-19 manevra öncelikleri ve dar kanal uygulamaları",
      "Işık/şekil gösterme ve sis işaretlerinin çalışma kontrolleri",
      "Kaptanın sorumluluğu ve iyi denizcilik uygulaması",
    ],
    actions: [
      "Günlük navigasyon brifinglerinde vaka analizi ve COLREG alıştırmaları yap",
      "Işık ve düdük testlerini seyir öncesi kontrol listesine ekle",
      "ECDIS ve radar alarm limitlerini risk değerlendirmesine göre ayarla",
    ],
    resources: [
      {
        label: "COLREG metni",
        href: "https://www.imo.org/en/About/Conventions/Pages/COLREG.aspx",
      },
    ],
  },
  {
    slug: "load-lines",
    label: "Load Lines – Yükleme Hattı Sözleşmesi",
    category: "IMO Sözleşmeleri",
    overview:
      "Geminin seyre elverişliliğini sağlamak için yaz/kış/tropik bölgeler ve tatlı su için freeboard ve markalama gerekliliklerini belirler.",
    essentials: [
      "Plimsoll markaları, freeboard hesapları ve Load Line sertifikası",
      "Hava kapakları, su geçirmez kapılar ve açıklıkların sızdırmazlığı",
      "Kıç/borda yükseklikleri, sheer ve kat açıklıkları",
    ],
    actions: [
      "Kalkış öncesi draft survey ile freeboard limitini doğrula",
      "Açıklıkların kapatma testlerini (hose test) yıllık planla",
      "Sertifika eklerini ve izin verilen yükleme sezonlarını seyir planına ekle",
    ],
    resources: [
      {
        label: "ICLL 66 özet",
        href: "https://www.imo.org/en/About/Conventions/Pages/International-Convention-on-Load-Lines.aspx",
      },
    ],
  },
  {
    slug: "ism-code",
    label: "ISM Code – Uluslararası Güvenlik Yönetimi",
    category: "Emniyet Kodları",
    overview:
      "Şirket ve gemi için güvenlik yönetim sisteminin kurulması, uygulanması ve sürekli iyileştirilmesi için çerçeve sağlar.",
    essentials: [
      "Emniyet ve çevre koruma politikası, yetkili kişi (DPA) ataması",
      "SMS dokümantasyonu, risk değerlendirme ve değişiklik yönetimi",
      "İç/dış ISM denetimleri ve düzeltici faaliyetler",
    ],
    actions: [
      "Kaza/olay raporlarını kök neden analiziyle kapat",
      "Gemi içi ISM öz değerlendirmelerini altı ayda bir planla",
      "SMS değişikliklerini mürettebata imza karşılığı duyur",
    ],
    resources: [
      {
        label: "ISM Code metni",
        href: "https://www.imo.org/en/OurWork/HumanElement/Pages/ISMCode.aspx",
      },
    ],
  },
  {
    slug: "isps-code",
    label: "ISPS Code – Gemi ve Liman Tesisi Güvenliği",
    category: "Emniyet Kodları",
    overview:
      "Gemi ve liman tesislerinin güvenlik risklerini yönetmek, erişim kontrolü ve acil durum iletişimini standardize etmek için uygulanır.",
    essentials: [
      "SSP uygulaması, güvenlik seviyeleri ve görevli tanımları",
      "ISSC sertifikası, eğitim ve tatbikat kayıtları",
      "Güvenlik ekipmanı, CCTV ve erişim kontrol prosedürleri",
    ],
    actions: [
      "Güvenlik seviyesi değişimlerini köprüüstü kayıtlarına işle",
      "Ziyaretçi/giriş kayıtlarını (ID, araç, yük) günlük kontrol et",
      "Drill ve ex. tatbikatları 3 ayı aşmadan planla",
    ],
    resources: [
      {
        label: "ISPS rehberi",
        href: "https://www.imo.org/en/OurWork/Security/Pages/MaritimeSecurity.aspx",
      },
    ],
  },
  {
    slug: "imdg-code",
    label: "IMDG Code – Tehlikeli Yükler",
    category: "Emniyet Kodları",
    overview:
      "Denizyolu ile taşınan tehlikeli maddelerin sınıflandırma, paketleme, işaretleme, dokümantasyon ve istif kurallarını belirler.",
    essentials: [
      "UN numarası, sınıf ayrımı ve segregasyon tabloları",
      "EmS, MFAG ve special provision uygulamaları",
      "Dokümantasyon: DGD, stowage plan ve manifest doğrulaması",
    ],
    actions: [
      "Segregasyon kurallarını stowage plan üzerinde çapraz kontrol et",
      "IMDG eğitim sertifikalarının geçerlilik tarihlerini izle",
      "Sızıntı/hasar durumunda EmS kartlarına göre müdahale planı hazırla",
    ],
    resources: [
      {
        label: "IMDG Code bilgi notu",
        href: "https://www.imo.org/en/OurWork/Safety/Pages/DangerousGoods.aspx",
      },
    ],
  },
  {
    slug: "imsbc-code",
    label: "IMSBC Code – Katı Dökme Yükler",
    category: "Emniyet Kodları",
    overview:
      "Dökme katı yüklerin taşınmasında nem, akma ve patlama risklerini yönetmek için test, sınıflandırma ve istifleme kuralları sunar.",
    essentials: [
      "TML/MCB testleri, Group A/B/C sınıflandırması",
      "Cihaz kalibrasyonu ve nem sertifikası doğrulaması",
      "Kargo havalandırma ve gaz ölçüm gereklilikleri",
    ],
    actions: [
      "Yükleme öncesi shippers declaration üzerindeki TML/MCB değerlerini kontrol et",
      "Nem ölçer kalibrasyon kayıtlarını sakla",
      "Yükleme sırasında trim ve drenaj prosedürlerini takip et",
    ],
    resources: [
      {
        label: "IMSBC Code özet",
        href: "https://www.imo.org/en/OurWork/Safety/Pages/IMSBC-CODE.aspx",
      },
    ],
  },
  {
    slug: "igc-code",
    label: "IGC Code – Gaz Taşıyıcı Gemiler",
    category: "Emniyet Kodları",
    overview:
      "LNG/LPG gibi sıvılaştırılmış gaz taşıyıcılarının tasarım, sistem bütünlüğü ve operasyonel güvenliğini düzenler.",
    essentials: [
      "Kargo tank tipleri, MARVS limitleri ve bağımsızlık seviyeleri",
      "Boil-off, reliquefaction ve inerting sistemleri",
      "IGC sertifikası ve ESD, gaz algılama testleri",
    ],
    actions: [
      "ESD ve gaz algılama ekipmanının fonksiyon testlerini yükleme öncesi tamamla",
      "IGC operasyonel kısıtlamalarını kargo planına ekle",
      "Soğutma ve inerting prosedürlerini ekip eğitiminde tekrar et",
    ],
    resources: [
      {
        label: "IGC Code",
        href: "https://www.imo.org/en/OurWork/Safety/Pages/IGC-Code.aspx",
      },
    ],
  },
  {
    slug: "ibc-code",
    label: "IBC Code – Kimyasal Tankerler",
    category: "Emniyet Kodları",
    overview:
      "Kimyasal tankerlerde kargo uyumluluğu, malzeme seçimi ve kirlilik riskleri için detaylı teknik gereklilikler getirir.",
    essentials: [
      "Kargo listesi, ship type 1/2/3 gereklilikleri ve coating uyumu",
      "Ventilation, tank cleaning ve yükleme limitleri",
      "IBC sertifikası, P&A Manual ve Emergency Towing",
    ],
    actions: [
      "Kargo uyumluluk matrisi ve coating listesiyle yük kabulü yap",
      "Tank temizliği ve ventilasyon planını IBC yük notlarına göre oluştur",
      "P&A Manual revizyonlarını ve kalibrasyon kayıtlarını güncel tut",
    ],
    resources: [
      {
        label: "IBC Code",
        href: "https://www.imo.org/en/OurWork/Safety/Pages/IBC-Code.aspx",
      },
    ],
  },
  {
    slug: "bwm",
    label: "BWM Convention – Balast Suyu Yönetimi",
    category: "Çevresel Düzenlemeler",
    overview:
      "İstilacı türlerin yayılımını önlemek için balast suyu değişimi veya arıtım sistemleri ve raporlama gerekliliklerini belirler.",
    essentials: [
      "D-1 değişim, D-2 arıtım standartları ve BWTS tip onayı",
      "IBWMC sertifikası, Ballast Water Record Book yönetimi",
      "VGP/COI gibi bölgesel ek gereklilikler",
    ],
    actions: [
      "Balast operasyonlarını zaman/konumla birlikte BWRB'ye eksiksiz işle",
      "BWTS bakım ve kalibrasyon kayıtlarını üretici talimatına göre tut",
      "De-ballast planını çevresel kısıtlamalarla önceden kontrol et",
    ],
    resources: [
      {
        label: "BWM Convention",
        href: "https://www.imo.org/en/About/Conventions/Pages/BWM-Treaty.aspx",
      },
    ],
  },
  {
    slug: "afs",
    label: "AFS Convention – Zehirli Boya Sistemleri",
    category: "Çevresel Düzenlemeler",
    overview:
      "Zararlı gemi boyalarının kullanımını yasaklayarak çevre ve insan sağlığını korur, uyum ve sertifikasyon süreçlerini tarif eder.",
    essentials: [
      "AFS Sertifikası, TBT ve zararlı bileşik yasakları",
      "Kayıtlı uygulama/çıkarma işlemleri ve gövde denetimleri",
      "Yeni kaplama uygulamalarında malzeme beyanı",
    ],
    actions: [
      "AFS sertifikasının geçerliliğini klas denetimleriyle hizala",
      "Kaplama değişikliklerinde malzeme MSDS ve beyanlarını arşivle",
      "Kuru havuz öncesi çevresel bertaraf planını doğrula",
    ],
    resources: [
      {
        label: "AFS sözleşmesi",
        href: "https://www.imo.org/en/OurWork/Environment/Pages/Anti-fouling.aspx",
      },
    ],
  },
  {
    slug: "hong-kong",
    label: "Hong Kong Convention – Gemi Geri Dönüşümü",
    category: "Çevresel Düzenlemeler",
    overview:
      "Gemi geri dönüşümünde insan sağlığı, emniyet ve çevre korumasını sağlamak için malzeme envanteri ve onaylı tesis gereksinimleri getirir.",
    essentials: [
      "IHM (Inventory of Hazardous Materials) ve sertifikası",
      "Geri dönüşüm tesisi onayı ve Recycling Plan",
      "Asbest, PCB, TBT gibi tehlikeli maddelerin yönetimi",
    ],
    actions: [
      "IHM güncellemelerini modifikasyon sonrası 3 ay içinde tamamla",
      "Geri dönüşüm tesisi seçiminde klas/flag onaylarını kontrol et",
      "Tehlikeli madde kayıtlarını mürettebat bilgilendirmesiyle paylaş",
    ],
    resources: [
      {
        label: "Hong Kong Convention",
        href: "https://www.imo.org/en/OurWork/Environment/Pages/Ship-Recycling.aspx",
      },
    ],
  },
  {
    slug: "eedi-eexi",
    label: "EEDI/EEXI – Enerji Verimliliği İndeksleri",
    category: "Çevresel Düzenlemeler",
    overview:
      "Yeni ve mevcut gemiler için tasarımsal enerji verimliliği kriterleri; makine güç limiti ve teknik iyileştirmeleri teşvik eder.",
    essentials: [
      "EEDI/EEXI hesaplaması, EEXI Technical File ve ShaPoLi/POLi",
      "Kısıtlama cihazlarının onayı ve doğrulama testleri",
      "SEEMP Part III ve CII hedefleriyle bağlantı",
    ],
    actions: [
      "EEXI teknik dosyasını klasla onaylatıp gemide bulundur",
      "ShaPoLi/POLi ekipmanının fonksiyon testini liman çıkışında kaydet",
      "SEEMP Part III'ü yıllık CII revizyonlarıyla güncelle",
    ],
    resources: [
      {
        label: "MEPC.335(76) özeti",
        href: "https://www.imo.org/en/MediaCentre/PressBriefings/pages/EEXI.aspx",
      },
    ],
  },
  {
    slug: "cii",
    label: "CII – Karbon Yoğunluğu Göstergesi",
    category: "Çevresel Düzenlemeler",
    overview:
      "Geminin yıllık operasyonel karbon yoğunluğunu derecelendirerek A–E bandında performans ve iyileştirme planlarını zorunlu kılar.",
    essentials: [
      "Aylık yakıt/veri raporlaması ve DCS entegrasyonu",
      "CII derecesi, Corrective Action Plan ve izleme penceresi",
      "SEEMP Part III doğrulaması ve hedef hatları",
    ],
    actions: [
      "A/B hedefini tutturmak için hız, rota ve yük optimizasyonu planla",
      "E veya D notu sonrası CAP aksiyonlarını 3 ay içinde uygula",
      "Dönemsel CII trend analizlerini yönetimle paylaş",
    ],
    resources: [
      {
        label: "CII rehberi",
        href: "https://www.imo.org/en/OurWork/Environment/Pages/CII.aspx",
      },
    ],
  },
  {
    slug: "eu-ets",
    label: "EU ETS – Emisyon Ticaret Sistemi",
    category: "Çevresel Düzenlemeler",
    overview:
      "AB sularında seyreden gemilerin CO₂ emisyonlarını kapsama alarak tahsisat yönetimi ve teslim yükümlülükleri getirir.",
    essentials: [
      "Uygulama kapsamı: AB liman arası %100, AB-dışı seferlerde %50",
      "Doğrulanmış emisyon raporu, tahsisat teslimi ve ceza mekanizması",
      "ETS ile MRV, DCS ve SEEMP veri uyumu",
    ],
    actions: [
      "Yıllık emisyonlarını doğrulanmış MRV raporlarıyla eşleştir",
      "ETS tahsisat alım/teslim takvimini finans ve operasyonla koordine et",
      "Kapsam dışı/istisna seferleri belgeleyerek sakla",
    ],
    resources: [
      {
        label: "EU ETS denizcilik",
        href: "https://climate.ec.europa.eu/eu-action/eu-emissions-trading-system-eu-ets/shipping_en",
      },
    ],
  },
  {
    slug: "psc",
    label: "PSC – Liman Devleti Kontrolü",
    category: "Denetim & Sörvey",
    overview:
      "Liman devleti tarafından yapılan uyum denetimleri; yüksek riskli alanlara odaklanarak eksiklerin giderilmesini sağlar.",
    essentials: [
      "Hedef faktörler, eksiklik ve alıkoyma kriterleri",
      "ISM/ISPS, sertifikalar ve kritik ekipman kontrolleri",
      "Paris/Tokyo MoU kampanyaları (CIC) takibi",
    ],
    actions: [
      "Denetim öncesi self-checklist ile kritik sistemleri kontrol et",
      "Eksiklikleri kapatma kanıtlarını PSC portalına zamanında yükle",
      "CIC temalarını mürettebat brifinglerinde prova et",
    ],
    resources: [
      {
        label: "Paris MoU PSC",
        href: "https://www.parismou.org/",
      },
    ],
  },
  {
    slug: "fsc",
    label: "FSC – Bayrak Devleti Kontrolü",
    category: "Denetim & Sörvey",
    overview:
      "Bayrak devletinin yetkilendirdiği denetçilerce yürütülen sertifika, ekipman ve operasyon uygunluk kontrolleridir.",
    essentials: [
      "Delegation anlaşmaları ve RO gözetimi",
      "Periyodik/yenileme/ara denetim aralıkları",
      "Ciddi olay sonrası ek denetim prosedürleri",
    ],
    actions: [
      "Denetim planını klas/bayrak takvimiyle uyumlu tut",
      "RO bulgularının düzeltici faaliyetlerini SMS'e entegre et",
      "Yetkilendirme kapsamı dışındaki ekipmanları flag guidance'a göre yönet",
    ],
    resources: [
      {
        label: "IMO Flag State Implementation",
        href: "https://www.imo.org/en/OurWork/III/Pages/Default.aspx",
      },
    ],
  },
  {
    slug: "class-survey",
    label: "Class Survey – Klas Denetimleri",
    category: "Denetim & Sörvey",
    overview:
      "Klas kurallarına uyumu doğrulayan periyodik, ara ve özel denetimler; yapısal ve makine bütünlüğüne odaklanır.",
    essentials: [
      "Special Survey, Intermediate, Annual, Docking gereklilikleri",
      "Önemli onarım/modifikasyon sonrası sınıflandırma",
      "Klas kayıtları ve Condition of Class takibi",
    ],
    actions: [
      "Due date yaklaşan surveyleri bakım planı ile hizala",
      "Koşullu klas şartlarını (Condition of Class) önceliklendir",
      "Survey raporlarını teknik yönetim sisteminde arşivle",
    ],
    resources: [
      {
        label: "IACS klas kural linkleri",
        href: "https://iacs.org.uk/publications/unified-requirements/",
      },
    ],
  },
  {
    slug: "vetting",
    label: "Vetting – Tanker Denetimleri (SIRE, CDI)",
    category: "Denetim & Sörvey",
    overview:
      "Charterer ve terminal odaklı denetimler; güvenlik yönetimi, ekipman kondisyonu ve operasyonel disipline yoğunlaşır.",
    essentials: [
      "SIRE 2.0/VIQ7 soru setleri ve tanık operasyonlar",
      "CDI kimyasal tanker odaklı değerlendirmeler",
      "Observation yönetimi ve TMSA entegrasyonu",
    ],
    actions: [
      "SIRE 2.0 KPI ve eCMID bulgularını analiz ederek kapat",
      "Denetim öncesi pre-vetting checklist ve ekip brifingi yap",
      "Kritik ekipman fonksiyon testlerini (ESD, IG, PV valve) belgeyle",
    ],
    resources: [
      {
        label: "OCIMF SIRE",
        href: "https://www.ocimf.org/programmes/sire/",
      },
    ],
  },
  {
    slug: "ism-audit",
    label: "ISM Audit – İç ve Dış Denetimler",
    category: "Denetim & Sörvey",
    overview:
      "Şirket ve gemi SMS uygulamalarının bağımsız olarak gözden geçirilmesi; uygunluk, etkinlik ve sürekli iyileştirme değerlendirilir.",
    essentials: [
      "Yıllık internal audit, 3 aylık doğrulama ve DOC/SMC ara denetimleri",
      "Kök neden analizi, düzeltici/önleyici faaliyet takibi",
      "İletişim, dokümantasyon ve kayıt yönetimi kontrolü",
    ],
    actions: [
      "Audit planını riskli süreçlere odaklayarak hazırlayın",
      "DÖF kapanışını kanıt dokümanlarıyla doğrula",
      "Findings trend analizlerini yönetim gözden geçirmesinde paylaş",
    ],
    resources: [
      {
        label: "ISM denetim rehberi",
        href: "https://www.imo.org/en/OurWork/HumanElement/Pages/ISMCode.aspx",
      },
    ],
  },
  {
    slug: "smc",
    label: "SMC – Safety Management Certificate",
    category: "Gemi Sertifikaları",
    overview:
      "Gemi SMS'inin ISM Code'a uygunluğunu gösteren sertifika; dış denetimle verilir ve süreklilik denetimleriyle korunur.",
    essentials: [
      "5 yıllık geçerlilik, 2.-3. yıllar arasında ara denetim",
      "Sertifika, klas ve bayrak kayıtları ile bağlantı",
      "Deniz kazası sonrası ek doğrulama gereklilikleri",
    ],
    actions: [
      "SMC ara denetim tarihini SMS takviminde takip et",
      "ISM audit bulgularını SMC yenileme öncesi kapat",
      "Sertifika nüshalarını köprüüstü ve ofiste senkronize tut",
    ],
    resources: [
      {
        label: "ISM/SMC bilgiler",
        href: "https://www.imo.org/en/OurWork/HumanElement/Pages/ISMCode.aspx",
      },
    ],
  },
  {
    slug: "doc",
    label: "DOC – Document of Compliance",
    category: "Gemi Sertifikaları",
    overview:
      "Şirketin filosu için ISM Code uyumunu gösteren belge; gemi tip kapsamı ve ofis denetimleriyle doğrulanır.",
    essentials: [
      "Yıllık doğrulama, 5 yılda yenileme",
      "Kapsamlı gemi tiplerinin belgedeki listesi",
      "DPA ve yönetim organizasyonunun doğrulanması",
    ],
    actions: [
      "Yıllık doğrulamayı gecikmeden tamamlamak için audit planı oluştur",
      "Yeni gemi ilavesinde DOC kapsamı güncelliğini kontrol et",
      "Ofis prosedür değişikliklerini DOC referanslarıyla eşleştir",
    ],
    resources: [
      {
        label: "DOC rehberi",
        href: "https://www.imo.org/en/OurWork/HumanElement/Pages/ISMCode.aspx",
      },
    ],
  },
  {
    slug: "issc",
    label: "ISSC – International Ship Security Certificate",
    category: "Gemi Sertifikaları",
    overview:
      "ISPS Code'a uyumu gösteren gemi güvenlik sertifikası; üç yıllık geçerlilikte ara doğrulamalarla desteklenir.",
    essentials: [
      "Security Level prosedürleri ve SSP onayı",
      "Güvenlik görevlisi atanması ve eğitim kayıtları",
      "Tatbikat ve denetim bulgularının takibi",
    ],
    actions: [
      "Ara doğrulama tarihini port visit planlarına göre ayarla",
      "Güvenlik ekipman testlerini (SSAS, AIS güvenlik) belgele",
      "SSP revizyonlarını bayrak/RO onayıyla senkronize et",
    ],
    resources: [
      {
        label: "ISPS/ISSC",
        href: "https://www.imo.org/en/OurWork/Security/Pages/MaritimeSecurity.aspx",
      },
    ],
  },
  {
    slug: "iopp",
    label: "IOPP – Oil Pollution Prevention Certificate",
    category: "Gemi Sertifikaları",
    overview:
      "MARPOL Ek I gereği yağ kirliliğini önlemeye yönelik ekipman, operasyon ve kayıtların uygunluğunu belgelendirir.",
    essentials: [
      "Bilge, sludge, OWS/ODME sistem testleri",
      "ITPP verileri ve segregated ballast kontrolleri",
      "Sertifika yenileme ve ara survey aralıkları",
    ],
    actions: [
      "OWS/ODME fonksiyon testlerini loglarla destekle",
      "Sludge transfer kayıtlarını ORB ile eşleştir",
      "Sertifika eklerini (P&A, IOPP supplement) güncel tut",
    ],
    resources: [
      {
        label: "MARPOL Ek I",
        href: "https://www.imo.org/en/OurWork/Environment/Pages/OilPollution.aspx",
      },
    ],
  },
  {
    slug: "load-line-certificate",
    label: "Load Line Certificate – Yükleme Hattı Belgesi",
    category: "Gemi Sertifikaları",
    overview:
      "ICLL gerekliliklerine uygun freeboard, su geçirmezlik ve markalama kontrollerinin yapıldığını gösterir.",
    essentials: [
      "Freeboard hesapları ve markalama doğrulaması",
      "Açıklıkların testleri ve bakım kayıtları",
      "Yıllık ve yenileme survey aralıkları",
    ],
    actions: [
      "Draft/freeboard ölçümlerini seyir öncesi fotoğrafla belgeley",
      "Açıklıkların bakım/onarım kayıtlarını survey öncesi hazırla",
      "Load Line sertifika geçerliliğini voyage planına ekle",
    ],
    resources: [
      {
        label: "ICLL 66",
        href: "https://www.imo.org/en/About/Conventions/Pages/International-Convention-on-Load-Lines.aspx",
      },
    ],
  },
  {
    slug: "paris-mou",
    label: "Paris MoU – Avrupa PSC Rejimi",
    category: "Bölgesel Düzenlemeler",
    overview:
      "Avrupa ve Kuzey Atlantik limanlarında PSC koordinasyonunu sağlayan bölgesel anlaşma; risk profili ve hedefleme kriterleri sunar.",
    essentials: [
      "Gemi risk profili, hedef faktörleri ve kampanyalar",
      "Eksiklik kodları ve alıkoyma eşikleri",
      "THETIS veri girişi ve sonuç paylaşımı",
    ],
    actions: [
      "Paris MoU profilini izleyip eksiklik trendlerini azalt",
      "CIC konularını gemi brifinglerinde önceden çalış",
      "THETIS girişlerini doğruluk için iç kontrolle takip et",
    ],
    resources: [
      {
        label: "Paris MoU",
        href: "https://www.parismou.org/",
      },
    ],
  },
  {
    slug: "tokyo-mou",
    label: "Tokyo MoU – Asya-Pasifik PSC",
    category: "Bölgesel Düzenlemeler",
    overview:
      "Asya-Pasifik bölgesindeki PSC uygulamalarını standardize eder; hedef faktörler ve kampanyalar Paris MoU ile paraleldir.",
    essentials: [
      "Risk tabanlı denetim ve ortak CIC programları",
      "Eksiklik kodları, kapatma süreleri ve alıkoyma kriterleri",
      "Veri paylaşımı ve IMO GISIS entegrasyonu",
    ],
    actions: [
      "CIC duyurularına göre operasyonel hazırlıkları gözden geçir",
      "Denetim kapanış kanıtlarını bayrak ve klas ile paylaşıp arşivle",
      "Seyir planında yüksek riskli limanlara hazırlık süresi ekle",
    ],
    resources: [
      {
        label: "Tokyo MoU",
        href: "https://www.tokyo-mou.org/",
      },
    ],
  },
  {
    slug: "uscg",
    label: "US USCG – ABD Sahil Güvenlik",
    category: "Bölgesel Düzenlemeler",
    overview:
      "ABD sularında PSC ve güvenlik kontrolleri, VGP, ballast, CFR gereklilikleri ve COI süreçlerini kapsar.",
    essentials: [
      "VGP, BWM AMS onayı ve NOA/D kötü hava bildirimleri",
      "Tanker Security, TVR ve CFR 33/46 gereklilikleri",
      "COI/SQD denetimleri ve hedefleme programı",
    ],
    actions: [
      "NOA/D bildirimlerini zamanında gönderip onay al",
      "VGP numune sonuçlarını ve istisnaları arşivle",
      "USCG denetimlerine yönelik şirket prosedürlerini güncel tut",
    ],
    resources: [
      {
        label: "USCG PSC",
        href: "https://www.dco.uscg.mil/Our-Organization/Assistant-Commandant-for-Prevention-Policy-CG-5P/Travel-Marine-Safety-Center/Port-State-Control/",
      },
    ],
  },
  {
    slug: "eu-regulations",
    label: "EU Regulations – AB Denizcilik Mevzuatı",
    category: "Bölgesel Düzenlemeler",
    overview:
      "AB MRV, ETS, Sulphur Directive ve atık yönetimi gibi bölgesel kuralların topluca uygulanmasını ifade eder.",
    essentials: [
      "MRV yıllık emisyon raporu ve DoC",
      "AB sülfür limitleri ve yakıt örnekleme",
      "Liman atık alım tesisleri ve bildirimleri",
    ],
    actions: [
      "MRV veri akışını DCS/SEEMP ile uyumlu hale getir",
      "Yakıt numune ve BDN arşivini 3 yıl sakla",
      "Liman atık bildirimlerini (Advance Notification) zamanında gönder",
    ],
    resources: [
      {
        label: "EU MRV",
        href: "https://transport.ec.europa.eu/transport-modes/maritime/maritime-and-environment/monitoring-reporting-and-verification-co2-emissions_en",
      },
    ],
  },
  {
    slug: "black-sea-mou",
    label: "Black Sea MoU – Karadeniz PSC",
    category: "Bölgesel Düzenlemeler",
    overview:
      "Karadeniz limanlarındaki PSC denetimlerini koordine eder; risk temelli denetim ve ortak kampanyalar yürütür.",
    essentials: [
      "Hedefleme kriterleri ve kampanya duyuruları",
      "Eksiklik, alıkoyma ve raporlama süreçleri",
      "Veri paylaşımı ve istatistiksel performans göstergeleri",
    ],
    actions: [
      "Karadeniz limanlarına girmeden CIC temalarını mürettebatla gözden geçir",
      "Bulgu kapatma kanıtlarını bayrak ve RO ile paylaş",
      "Bölgesel raporlama portalı kayıtlarını doğrula",
    ],
    resources: [
      {
        label: "Black Sea MoU",
        href: "https://www.bsmou.org/",
      },
    ],
  },
];

export const regulationItemMap = regulationItems.reduce<Record<string, RegulationItem>>((acc, item) => {
  acc[item.slug] = item;
  return acc;
}, {});

export const regulationCategories: RegulationCategory[] = [
  "IMO Sözleşmeleri",
  "Emniyet Kodları",
  "Çevresel Düzenlemeler",
  "Denetim & Sörvey",
  "Gemi Sertifikaları",
  "Bölgesel Düzenlemeler",
];
