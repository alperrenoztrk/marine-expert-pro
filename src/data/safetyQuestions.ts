import type { QuizQuestion } from "@/types/quiz";

export const safetyQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "SOLAS'a göre yolcu gemilerinde haftalık olarak yapılması zorunlu tatbikat nedir?",
    options: ["Yangın tatbikatı", "Can salı tatbikatı", "Muster ve cankurtarma tatbikatı", "ISPS güvenlik tatbikatı"],
    correctAnswer: 2,
    explanation: "SOLAS III/19 kapsamında muster ve cankurtarma tatbikatları düzenli yapılır.",
    category: "SOLAS/LSA"
  },
  {
    id: 2,
    question: "ISM Kodu kapsamında DPA (Designated Person Ashore) kim tarafından atanır?",
    options: ["Kaptan", "Şirket yönetimi", "Baş mühendis", "Liman otoritesi"],
    correctAnswer: 1,
    explanation: "DPA şirket tarafından atanır ve gemi-kıyı arasında emniyet bağlantısını sağlar.",
    category: "ISM"
  },
  {
    id: 3,
    question: "ISPS Kodu kaç güvenlik seviyesi tanımlar?",
    options: ["2", "3", "4", "5"],
    correctAnswer: 1,
    explanation: "ISPS: 3 güvenlik seviyesi (1/2/3).",
    category: "ISPS"
  },
  {
    id: 4,
    question: "Makine dairesinde sabit köpük sistemleri için tipik uygulama hızı hangi değere yakındır?",
    options: ["2.5 L/m²/dk", "4.0 L/m²/dk", "6.5 L/m²/dk", "10.0 L/m²/dk"],
    correctAnswer: 2,
    explanation: "Makine dairesi köpük sistemlerinde yaygın referans değer 6.5 L/m²/dk'dır.",
    category: "FFA"
  },
  {
    id: 5,
    question: "EPIRB genellikle hangi koşulda otomatik olarak aktive olur?",
    options: ["Yangın alarmıyla", "HRU ile 1–4 m derinlikte serbest kalınca", "Kaptan emriyle", "Makine arızasında"],
    correctAnswer: 1,
    explanation: "Hidrostatik serbest bırakma (HRU) EPIRB'i 1–4 m derinlikte serbest bırakır; cihaz suyla temasla aktive olur.",
    category: "GMDSS"
  },
  {
    id: 6,
    question: "Risk matrisinde skor 15 ve üzeri genellikle hangi risk kategorisine girer?",
    options: ["Düşük", "Orta", "Yüksek", "Kabul edilebilir"],
    correctAnswer: 2,
    explanation: "Birçok SMS matrisinde 15–25 aralığı 'yüksek risk' olarak tanımlanır.",
    category: "SMS"
  },
  {
    id: 7,
    question: "Hot Work (Sıcak İş) izni hangi işler için gereklidir?",
    options: ["Temizlik işleri", "Kaynak/kesme/taşlama", "Boya işleri", "Elektrik ölçüm işleri"],
    correctAnswer: 1,
    explanation: "Isı ve kıvılcım üreten tüm işler Hot Work kapsamındadır.",
    category: "PTW"
  },
  {
    id: 8,
    question: "Can sallarının servis aralığı en fazla ne kadardır?",
    options: ["6 ay", "12 ay", "18 ay", "24 ay"],
    correctAnswer: 1,
    explanation: "Liferaft bakımı genellikle en geç 12 ayda bir yetkili istasyonda yapılır.",
    category: "SOLAS/LSA"
  },
  {
    id: 9,
    question: "Enclosed space entry için en kritik ölçümlerden biri hangisidir?",
    options: ["Deniz suyu tuzluluğu", "O2 ve LEL (patlayıcı) ölçümü", "Barometre", "Rüzgâr yönü"],
    correctAnswer: 1,
    explanation: "Kapalı mahallerde oksijen eksikliği ve patlayıcı/toksik gaz riski vardır; ölçüm şarttır.",
    category: "PTW"
  },
  {
    id: 10,
    question: "Yangın sınıflarında 'Class B' neyi ifade eder?",
    options: ["Katı maddeler", "Yanıcı sıvılar", "Metal yangınları", "Elektrik yangınları"],
    correctAnswer: 1,
    explanation: "Class B: flammable liquids (benzin, solvent vb.).",
    category: "FFA"
  },
  {
    id: 11,
    question: "CO2 sabit yangın söndürme sistemini devreye almadan önce en kritik adım hangisidir?",
    options: ["Kapıları açmak", "Personeli tahliye edip mahalı kapatmak", "Havalandırmayı artırmak", "Yangına su vermek"],
    correctAnswer: 1,
    explanation: "CO2 boğucu etkili gazdır; personel tahliyesi + mahal sızdırmazlığı şarttır.",
    category: "FFA"
  },
  {
    id: 12,
    question: "Can yeleğinde (lifejacket) temel amaç hangisidir?",
    options: ["Isıyı artırmak", "Kişiyi su üstünde ve yüzü yukarıda tutmak", "Hızlandırmak", "Sadece görünürlük"],
    correctAnswer: 1,
    explanation: "Lifejacket, bilinç kaybında bile kişiyi yüzü yukarı pozisyona getirip afloat tutmayı hedefler.",
    category: "SOLAS/LSA"
  },
  {
    id: 13,
    question: "SART (Search and Rescue Transponder) temel olarak hangi cihazla etkileşir?",
    options: ["GPS", "Radar", "Echosounder", "AIS"],
    correctAnswer: 1,
    explanation: "SART, X-band radar sinyaline cevap vererek ekran üzerinde işaretler üretir.",
    category: "GMDSS"
  },
  {
    id: 14,
    question: "Bir iş kazasında 'near miss' neyi ifade eder?",
    options: ["Kesin yaralanma", "Yaralanma/hasar olmadan atlatılan olay", "Planlı tatbikat", "Yetkisiz giriş"],
    correctAnswer: 1,
    explanation: "Near miss, kaza olabilirdi ama zarar oluşmadan atlatıldı; raporlama ile önlem geliştirilir.",
    category: "SMS"
  },
  {
    id: 15,
    question: "PPE hiyerarşisinde (kontrol önlemleri) en etkili yaklaşım hangisidir?",
    options: ["Sadece PPE kullanmak", "Tehlikeyi ortadan kaldırmak (elimination)", "Uyarı levhası", "Eldiven takmak"],
    correctAnswer: 1,
    explanation: "Kontrol hiyerarşisinde elimination/substitution en üsttedir; PPE en son bariyerdir.",
    category: "İş Güvenliği"
  },
  {
    id: 16,
    question: "Muster list (alarm rol listesi) neyi düzenler?",
    options: ["Kargo planını", "Acil durum görev dağılımını", "Yakıt tüketimini", "Radar ayarlarını"],
    correctAnswer: 1,
    explanation: "Muster list, acil durumda herkesin görevini ve toplanma yerini tanımlar.",
    category: "SOLAS/LSA"
  },
  {
    id: 17,
    question: "Foam (köpük) özellikle hangi yangınlarda etkilidir?",
    options: ["Metal", "Yanıcı sıvı", "Kağıt/odun", "Elektrik panosu"],
    correctAnswer: 1,
    explanation: "Köpük, Class B'de yüzeyi örter ve buharlaşmayı/oksijen temasını azaltır.",
    category: "FFA"
  },
  {
    id: 18,
    question: "Lifeboat/liferaft 'embarkation' sırasında en kritik risklerden biri hangisidir?",
    options: ["Güneş yanığı", "Düşme ve sıkışma", "Uyku", "Yüksek tuzluluk"],
    correctAnswer: 1,
    explanation: "Embarkation, düşme/sıkışma ve kontrolsüz hareket riskleri taşır; talimatlara uyulmalı.",
    category: "SOLAS/LSA"
  },
  {
    id: 19,
    question: "Gemi üzerinde 'lock-out/tag-out' (LOTO) sistemi neyi hedefler?",
    options: ["Güverteyi boyamak", "Enerji izolasyonu ile kazara çalıştırmayı önlemek", "GPS güncellemek", "Kargo ısıtmak"],
    correctAnswer: 1,
    explanation: "LOTO, bakım/onarımda ekipman enerjisinin izole edilmesini ve yanlışlıkla devreye alınmamasını sağlar.",
    category: "İş Güvenliği"
  },
  {
    id: 20,
    question: "SOLAS'ta yangın kapılarının (fire doors) temel amacı hangisidir?",
    options: ["Hava sirkülasyonu", "Yangın ve dumanın yayılımını sınırlamak", "Dekorasyon", "Ses yalıtımı"],
    correctAnswer: 1,
    explanation: "Fire doors, bölmeler arası yangın/duman geçişini geciktirir ve kaçış için zaman kazandırır.",
    category: "SOLAS/FFA"
  },
  {
    id: 21,
    question: "Bir yangın alarmında, dumanı tahliye etmek için kontrolsüz kapı açmak neden risklidir?",
    options: ["Risk değildir", "Oksijen sağlayarak yangını büyütebilir", "Suyu artırır", "Sesi azaltır"],
    correctAnswer: 1,
    explanation: "Kapı açmak hava/oksijen sağlayıp 'flashover/backdraft' riskini artırabilir.",
    category: "FFA"
  },
  {
    id: 22,
    question: "İlk yardımda ciddi kanamada en doğru ilk müdahale hangisidir?",
    options: ["Yarayı yıkamak", "Doğrudan basınç uygulamak", "Bandajı gevşek bırakmak", "Kişiyi yürütmek"],
    correctAnswer: 1,
    explanation: "Masif kanamada doğrudan basınç, yükseltme ve gerekiyorsa turnike prosedürü uygulanır.",
    category: "İlk Yardım"
  },
  {
    id: 23,
    question: "Gemi üzerinde 'safety induction' (oryantasyon) en çok neyi sağlar?",
    options: ["Daha hızlı internet", "Temel emniyet kuralları ve prosedürlere aşinalık", "Yakıt tasarrufu", "Harita düzeltmesi"],
    correctAnswer: 1,
    explanation: "Yeni katılan personelin acil durumlar, PPE, PTW, toplanma yerleri gibi kritik konuları öğrenmesini sağlar.",
    category: "SMS"
  },
  {
    id: 24,
    question: "SCBA (self-contained breathing apparatus) en çok hangi durumda gereklidir?",
    options: ["Açık güvertede", "Dumanlı/oksijeni belirsiz ortamda", "Kamarada", "Köprüüstünde"],
    correctAnswer: 1,
    explanation: "Duman/oksijen eksikliği/toksik gaz ihtimali olan alanlarda SCBA şarttır.",
    category: "PPE"
  },
  {
    id: 25,
    question: "Güvertede kayma/düşmeyi azaltmak için en temel önlem hangisidir?",
    options: ["Koşmak", "Housekeeping ve uygun ayakkabı", "Işıkları kapatmak", "Rüzgârı ölçmek"],
    correctAnswer: 1,
    explanation: "Düzenli güverte, döküntülerin temizlenmesi ve uygun ayakkabı kayma/düşmeyi ciddi azaltır.",
    category: "İş Güvenliği"
  }
];

