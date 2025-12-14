import type { QuizQuestion } from "@/types/quiz";

export const cargoQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "TPC değeri 25 ton/cm olan bir geminin draftı 8.80 m'den 9.05 m'ye çıktığında yaklaşık kaç ton yük alınmıştır?",
    options: ["250 ton", "375 ton", "625 ton", "900 ton"],
    correctAnswer: 2,
    explanation: "ΔT = 0.25 m = 25 cm. Yük ≈ TPC × ΔT(cm) = 25 × 25 = 625 ton.",
    category: "TPC"
  },
  {
    id: 2,
    question: "IMSBC Koduna göre TML (Transportable Moisture Limit) ne anlama gelir?",
    options: [
      "Kargonun maksimum taşıma sıcaklığı",
      "Kargonun güvenli taşınabilir nem limiti",
      "Kargonun toplam ağırlık limiti",
      "Kargonun yoğunluk sınırı"
    ],
    correctAnswer: 1,
    explanation: "TML, sıvılaşma (liquefaction) riski olmadan güvenle taşınabilecek azami nem içeriğidir.",
    category: "IMSBC"
  },
  {
    id: 3,
    question: "International Grain Code'a göre düzeltilmiş GM (GMcorr) minimum kaç metre olmalıdır?",
    options: ["0.15 m", "0.20 m", "0.30 m", "0.50 m"],
    correctAnswer: 2,
    explanation: "Grain Code, tahıl taşımada GMcorr için tipik minimum 0.30 m şartını arar.",
    category: "Grain"
  },
  {
    id: 4,
    question: "Draft survey'de birinci trim düzeltmesi (First Trim Correction) ne için yapılır?",
    options: [
      "Yoğunluk farkını düzeltmek için",
      "LCF konumundan dolayı orta draft/deplasman farkını düzeltmek için",
      "Sıcaklık etkisini düzeltmek için",
      "Rüzgar etkisini düzeltmek için"
    ],
    correctAnswer: 1,
    explanation: "Trim varken LCF nedeniyle AP/FP draftlarından elde edilen orta draft doğrudan LCF draftını temsil etmez; birinci düzeltme bunu ele alır.",
    category: "Draft Survey"
  },
  {
    id: 5,
    question: "VGM (Verified Gross Mass) hangi tür yükler için zorunludur?",
    options: ["Sadece tehlikeli maddeler", "Tüm konteynerler", "Sadece dökme yükler", "Sadece sıvı kargolar"],
    correctAnswer: 1,
    explanation: "SOLAS gereği gemiye yüklenen tüm konteynerler için VGM beyanı zorunludur.",
    category: "Konteyner"
  },
  {
    id: 6,
    question: "Grain Code'a göre statik heeling açısı maksimum kaç derece olabilir?",
    options: ["5°", "8°", "12°", "15°"],
    correctAnswer: 2,
    explanation: "Tahıl kayması sonrası statik heeling açısı 12°'yi geçmemelidir (veya deck-edge daha küçükse).",
    category: "Grain"
  },
  {
    id: 7,
    question: "Draft survey'de yoğunluk düzeltmesi hangi durumda yapılır?",
    options: [
      "Deniz suyu yoğunluğu 1.025'ten farklıysa",
      "Hava sıcaklığı 20°C'nin altındaysa",
      "Trim 1 metreden fazlaysa",
      "Rüzgar hızı 15 knot'un üzerindeyse"
    ],
    correctAnswer: 0,
    explanation: "Deplasman tabloları genellikle 1.025 t/m³ deniz suyu içindir; farklı yoğunlukta düzeltme gerekir.",
    category: "Draft Survey"
  },
  {
    id: 8,
    question: "IMSBC Kodundaki Grup A kargolar için en önemli risk nedir?",
    options: ["Patlama riski", "Sıvılaşma riski", "Zehirlenme riski", "Yanma riski"],
    correctAnswer: 1,
    explanation: "Grup A kargolar sıvılaşabilir; TML/FMP kontrolleri bu yüzden kritiktir.",
    category: "IMSBC"
  },
  {
    id: 9,
    question: "Stowage Factor (SF) aşağıdakilerden hangisini ifade eder?",
    options: ["1 ton kargonun kapladığı hacim (m³/t)", "1 m³ kargonun ağırlığı (t/m³)", "Kargonun rutubet yüzdesi", "Kargonun boşaltma hızı"],
    correctAnswer: 0,
    explanation: "SF, birim ağırlık başına hacimdir (m³/ton).",
    category: "Stowage"
  },
  {
    id: 10,
    question: "Konteyner elleçlemede 'twist-lock' temel olarak ne işe yarar?",
    options: ["Yükün soğutulması", "Konteynerlerin birbirine/şasiye kilitlenmesi", "Konteyner tartımı", "Kapı mühürleme"],
    correctAnswer: 1,
    explanation: "Twist-lock, konteyner köşe dökümlerini kilitleyerek istif emniyetini sağlar.",
    category: "Konteyner"
  },
  {
    id: 11,
    question: "IMDG Code'a göre Sınıf 3 aşağıdakilerden hangisidir?",
    options: ["Yanıcı sıvılar", "Aşındırıcı maddeler", "Radyoaktif maddeler", "Sıkıştırılmış gazlar"],
    correctAnswer: 0,
    explanation: "IMDG Class 3: Flammable liquids.",
    category: "IMDG"
  },
  {
    id: 12,
    question: "IMDG Code'a göre Sınıf 8 aşağıdakilerden hangisidir?",
    options: ["Zehirli maddeler", "Aşındırıcı maddeler", "Organik peroksitler", "Oksitleyiciler"],
    correctAnswer: 1,
    explanation: "IMDG Class 8: Corrosives.",
    category: "IMDG"
  },
  {
    id: 13,
    question: "Draft survey'de 'mark correction' (işaret düzeltmesi) neden yapılır?",
    options: [
      "Draft marklarının gemi boyuna göre konumundan kaynaklı düzeltme için",
      "Deniz suyu sıcaklığını düzeltmek için",
      "Rüzgâr basıncını düzeltmek için",
      "Kargonun yoğunluğunu düzeltmek için"
    ],
    correctAnswer: 0,
    explanation: "Draft okuması markın konumuna ve okunan noktaya bağlı hatalar içerir; mark correction ile gerçek drafta yaklaşılır.",
    category: "Draft Survey"
  },
  {
    id: 14,
    question: "MARPOL Annex I en çok hangi kirliliği düzenler?",
    options: ["Petrol kirliliği", "Çöp/atıklar", "Hava emisyonları", "Pis su (sewage)"],
    correctAnswer: 0,
    explanation: "Annex I: Oil pollution prevention.",
    category: "Regülasyon"
  },
  {
    id: 15,
    question: "MARPOL Annex V hangi konuyu kapsar?",
    options: ["Çöp/atıklar", "Petrol", "Balast suyu", "SOx/NOx emisyonları"],
    correctAnswer: 0,
    explanation: "Annex V: Garbage (çöp) yönetimi ve deşarj kısıtları.",
    category: "Regülasyon"
  },
  {
    id: 16,
    question: "Bilge suyu (bilge) discharge'ında OWS (15 ppm) alarmı devreye girerse doğru aksiyon hangisidir?",
    options: ["Deşarja devam etmek", "Deşarjı durdurmak ve sistemi kontrol etmek", "OWS'i bypass etmek", "Sadece kaydı silmek"],
    correctAnswer: 1,
    explanation: "15 ppm üstü alarmda deşarj durdurulur; ekipman arızası/yanlış işletim araştırılır.",
    category: "Operasyon"
  },
  {
    id: 17,
    question: "Bulk kargolarda 'angle of repose' neyi etkiler?",
    options: ["Kargonun gemide kayma eğilimi/istif stabilitesi", "Kargonun pH değeri", "Kargonun ısıl iletkenliği", "Kargonun konteyner ihtiyacı"],
    correctAnswer: 0,
    explanation: "Angle of repose, dökme kargonun eğimde ne kadar kaymadan durabildiğini gösterir; kayma riskini etkiler.",
    category: "IMSBC"
  },
  {
    id: 18,
    question: "Tahıl taşımada 'shifting board' temel amacı nedir?",
    options: ["Havalandırma", "Kargonun yanlara kaymasını sınırlamak", "Ambar kapak sızdırmazlığı", "Yükleme hızını artırmak"],
    correctAnswer: 1,
    explanation: "Shifting board, grain shift riskini azaltmak için ambar içinde bölme/engel görevi görür.",
    category: "Grain"
  },
  {
    id: 19,
    question: "Konteynerlerin SOLAS VGM doğrulamasında iki yaygın yöntem hangileridir?",
    options: ["Sıcaklık ölçümü + hacim ölçümü", "Tartım + kalibrasyon", "Yöntem 1 (brüt tartım) + Yöntem 2 (bileşen hesap) ", "Sadece liman beyanı"],
    correctAnswer: 2,
    explanation: "Method 1: konteynerin brüt tartımı; Method 2: içerik/ambalaj/tara üzerinden hesap.",
    category: "Konteyner"
  },
  {
    id: 20,
    question: "Hatch cover cleat/locking kontrolü en kritik olarak neyi azaltır?",
    options: ["Trim", "Su girişi ve yük hasarı riskini", "Yakıt tüketimini", "Kargo sıcaklığını"],
    correctAnswer: 1,
    explanation: "Ambar kapak emniyeti, heavy weather'da su girişini ve cargo wetting riskini azaltır.",
    category: "Operasyon"
  },
  {
    id: 21,
    question: "Bill of Lading (B/L) için en doğru ifade hangisidir?",
    options: ["Sadece sigorta poliçesidir", "Taşıma sözleşmesi kanıtı ve makbuz/temsil belgesidir", "Sadece gümrük beyannamesidir", "Kaptanın şahsi notudur"],
    correctAnswer: 1,
    explanation: "B/L: receipt + evidence of contract + document of title (çoğu durumda).",
    category: "Dokümantasyon"
  },
  {
    id: 22,
    question: "IMSBC Koduna göre Group B kargoların genel özelliği nedir?",
    options: ["Sıvılaşabilir", "Kimyasal tehlike taşır", "Hiç risk taşımaz", "Sadece tahıldır"],
    correctAnswer: 1,
    explanation: "Group B: chemical hazards (toxic, corrosive, etc.).",
    category: "IMSBC"
  },
  {
    id: 23,
    question: "Kargo planlamasında 'segregation' ilkeleri en çok ne için kullanılır?",
    options: ["Kargonun hızını artırmak", "Uyuşmayan kargoları ayırarak tehlikeyi azaltmak", "Draftı düşürmek", "Yakıt tasarrufu"],
    correctAnswer: 1,
    explanation: "Özellikle IMDG/tehlikeli yüklerde, uyumsuzlukları ayırmak reaksiyon/yangın riskini azaltır.",
    category: "Planlama"
  },
  {
    id: 24,
    question: "Reefer konteynerlerde en sık kritik kontrol hangisidir?",
    options: ["Kapı rengi", "Setpoint ve havalandırma/airflow ayarları", "Konteyner numarası uzunluğu", "Twist-lock markası"],
    correctAnswer: 1,
    explanation: "Reefer setpoint, pulp temperature, ventilation ve power bağlantısı kargonun bozulmasını önler.",
    category: "Konteyner"
  },
  {
    id: 25,
    question: "Dökme yükte 'trimming' işlemi neden yapılır?",
    options: ["Kargoyu tek tarafa yığmak için", "Kargo yüzeyini düzleyerek stabilite ve yük emniyetini artırmak için", "Kargoyu ıslatmak için", "Sadece fotoğraf için"],
    correctAnswer: 1,
    explanation: "Trimming, boşlukları azaltır, kayma riskini düşürür ve ambar içi yük dağılımını iyileştirir.",
    category: "Operasyon"
  }
];

