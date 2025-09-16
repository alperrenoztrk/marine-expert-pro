export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

export const navigationQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "D=120 NM yolu 10 kn hızla kaç saatte alırsınız?",
    options: ["10", "12", "14", "8"],
    correctAnswer: 1,
    explanation: "Zaman = Mesafe / Hız = 120 / 10 = 12 saat.",
    category: "Temel Seyir"
  },
  {
    id: 2,
    question: "1 dakikada 0.5 NM gidiyorsanız hızınız kaç kn'dur?",
    options: ["15", "20", "25", "30"],
    correctAnswer: 3,
    explanation: "1 dakika = 1/60 saat. Hız = 0.5 / (1/60) = 30 kn.",
    category: "Hız-Mesafe-Zaman"
  },
  {
    id: 3,
    question: "1 dakika yay hatası yaklaşık kaç deniz mili eder?",
    options: ["1 NM", "2 NM", "15 NM", "60 NM"],
    correctAnswer: 0,
    explanation: "Enlemde 1 dakikalık yay ≈ 1 NM kabul edilir.",
    category: "Coğrafi Temeller"
  },
  {
    id: 4,
    question: "1 derece enlem farkı kaç deniz milidir?",
    options: ["30", "45", "60", "90"],
    correctAnswer: 2,
    explanation: "1° = 60'. 1' ≈ 1 NM olduğundan 60 NM.",
    category: "Coğrafi Temeller"
  },
  {
    id: 5,
    question: "COG 045° ve SOG 12 kn iken 2 saatte yer değiştirme yaklaşık kaç NM ve hangi hıza doğrudur?",
    options: ["12 NM, 045°", "24 NM, 045°", "20 NM, 090°", "24 NM, 090°"],
    correctAnswer: 1,
    explanation: "Yol = SOG × t = 12 × 2 = 24 NM, yön COG = 045°.",
    category: "Plotting"
  },
  {
    id: 6,
    question: "Set 090° ve drift 2 kn. 3 saatte akıntı toplam kaç NM doğuya sürükler?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 3,
    explanation: "Drift × süre = 2 × 3 = 6 NM; set 090° doğuya.",
    category: "Akıntı"
  },
  {
    id: 7,
    question: "Tasarım rota 000°, rüzgar ve akıntı yok. 1 saat 18 kn ile gidilirse enlem değişimi yaklaşık kaç dakikadır?",
    options: ["9'", "15'", "18'", "30'"],
    correctAnswer: 2,
    explanation: "Kuzey-güney doğrultusunda 18 NM yol ≈ 18'.",
    category: "Enlem-Boylam"
  },
  {
    id: 8,
    question: "Pusula kerteriziniz 062°C, sapma (deviation) +2°, manyetik sapma (variation) -4° ise manyetik kerteriz kaçtır?",
    options: ["064°M", "060°M", "058°M", "066°M"],
    correctAnswer: 1,
    explanation: "C → M: Önce deviation düzelt: 062°C +2° = 064°PSC. Variation -4° (W) olduğundan M = 064° − 4° = 060°M.",
    category: "Pusula"
  },
  {
    id: 9,
    question: "LOP (position line) nedir?",
    options: ["Hız vektörü", "Mesafe dairesi", "Konum doğrusu", "Akıntı doğrusu"],
    correctAnswer: 2,
    explanation: "LOP, bir ölçümden elde edilen ve konumun üzerinde bulunduğu doğru/çizgidir.",
    category: "Klasik Seyir"
  },
  {
    id: 10,
    question: "DR (dead reckoning) konumu hangi bilgiden üretilir?",
    options: ["COG/SOG", "HDG/Speed through water", "Rüzgar verisi", "GZ eğrisi"],
    correctAnswer: 1,
    explanation: "DR, gemi baş yönü (HDG) ve suya göre hızdan (STW) türetilir.",
    category: "Klasik Seyir"
  },
  {
    id: 11,
    question: "WGS84 hangi amaçla kullanılır?",
    options: ["Meteoroloji", "Jeodezik referans", "Manyetik harita", "Gelgit tahmini"],
    correctAnswer: 1,
    explanation: "WGS84, küresel konumlama için kullanılan jeodezik referans sistemidir.",
    category: "Jeodezi/GNSS"
  },
  {
    id: 12,
    question: "1 kn kaç m/s'ye en yakındır?",
    options: ["0.34", "0.51", "0.72", "1.00"],
    correctAnswer: 1,
    explanation: "1 kn ≈ 0.514 m/s.",
    category: "Birimler"
  },
  {
    id: 13,
    question: "1 NM yaklaşık kaç kilometredir?",
    options: ["1.6", "1.85", "2.0", "2.2"],
    correctAnswer: 1,
    explanation: "1 NM ≈ 1.852 km.",
    category: "Birimler"
  },
  {
    id: 14,
    question: "Compass error = deviation + variation. Deviation +3°, variation -5° ise toplam hata kaçtır?",
    options: ["-2°", "+2°", "+8°", "-8°"],
    correctAnswer: 0,
    explanation: "+3° + (-5°) = -2° (W).",
    category: "Pusula"
  },
  {
    id: 15,
    question: "UTC 12:00'da boylamınız 030°E ise yerel saat yaklaşık nedir? (15°=1 saat)",
    options: ["14:00", "10:00", "12:00", "13:00"],
    correctAnswer: 0,
    explanation: "030°E/15°=2 saat ileri; 12:00 + 2 = 14:00.",
    category: "Zaman Bölgeleri"
  },
  {
    id: 16,
    question: "Gemi 270°T doğrultusunda 12 kn, akıntı 180°T 3 kn. COG/SOG yaklaşık?",
    options: ["COG 255°, 13 kn", "COG 257°, 12.4 kn", "COG 236°, 9 kn", "COG 270°, 15 kn"],
    correctAnswer: 1,
    explanation: "Vektörel toplama: Batıya 12, güneye 3; sonuç ~257° ve büyüklük √(12²+3²)=12.37 ≈ 12.4 kn.",
    category: "Akıntı"
  },
  {
    id: 17,
    question: "Gelgit tablosunda MHWS neyi gösterir?",
    options: ["En düşük düşük su", "Ortalama yüksek su yay", "Ortalama düşük su neap", "En yüksek yüksek su"],
    correctAnswer: 1,
    explanation: "MHWS: Mean High Water Springs.",
    category: "Gelgit"
  },
  {
    id: 18,
    question: "1 saatlik ileride log 10 NM gösteriyorsa STW kaç kn?",
    options: ["8", "10", "12", "14"],
    correctAnswer: 1,
    explanation: "STW ≈ 10 NM / 1 h = 10 kn.",
    category: "Aletler"
  },
  {
    id: 19,
    question: "COG ile HDG arasındaki fark temel olarak neyi gösterir?",
    options: ["Sapma", "Set/Drift etkisi", "Rüzgar yönü", "Deplasman"],
    correctAnswer: 1,
    explanation: "Akıntı ve rüzgâr etkileri geminin baş yönü ile iz yönü arasındaki farkı yaratır.",
    category: "Klasik Seyir"
  },
  {
    id: 20,
    question: "3 saat içinde 42 NM gidildi. Ortalama hız kaç kn?",
    options: ["12", "13", "14", "15"],
    correctAnswer: 2,
    explanation: "Hız = 42 / 3 = 14 kn.",
    category: "Hız-Mesafe-Zaman"
  },
  {
    id: 21,
    question: "Azimut gözlemi ile bulunan hata hangi pusulaya uygulanır?",
    options: ["Cıvata pusulası", "Gyro", "Manyetik", "Harita"],
    correctAnswer: 1,
    explanation: "Güneş/keşif cismi azimutu ile gyro error belirlenir ve gyroya uygulanır.",
    category: "Pusula"
  },
  {
    id: 22,
    question: "Gyro error +3° ise gyro kuzeyi gerçek kuzeye göre nerededir?",
    options: ["Doğusunda 3°", "Batısında 3°", "Aynı", "30° fark"],
    correctAnswer: 0,
    explanation: "+ hata: gyro true'nun doğusunda.",
    category: "Pusula"
  },
  {
    id: 23,
    question: "RHUMB line (loxodrome) nedir?",
    options: ["Büyük daire", "Sabit kerterizli rota", "En kısa mesafe", "Akıntı doğrusu"],
    correctAnswer: 1,
    explanation: "Loxodrome sabit istikametle izlenen rotadır.",
    category: "Haritacılık"
  },
  {
    id: 24,
    question: "Great circle rotasının avantajı nedir?",
    options: ["Daha kısa mesafe", "Daha az değişken rüzgar", "Daha kolay çizim", "Pusula hatası sıfır"],
    correctAnswer: 0,
    explanation: "Büyük daire en kısa mesafeyi verir.",
    category: "Haritacılık"
  },
  {
    id: 25,
    question: "Mercator projeksiyonun özelliği hangisidir?",
    options: ["Alan korunumlu", "Açı korunumlu", "Uzaklık korunumlu", "Merkezî"],
    correctAnswer: 1,
    explanation: "Mercator konformaldir, açıları korur.",
    category: "Haritacılık"
  },
  {
    id: 26,
    question: "DR ile EP arasındaki fark nedir?",
    options: ["EP akıntı ve rüzgar dahil", "DR GPS'e dayanır", "EP kerterizsiz", "DR akıntı içerir"],
    correctAnswer: 0,
    explanation: "EP (Estimated Position) çevresel etkileri içerir; DR içermez.",
    category: "Klasik Seyir"
  },
  {
    id: 27,
    question: "Uzaklık ölçeğinde 15'lik enlem farkı kaç NM'dir?",
    options: ["10", "15", "30", "60"],
    correctAnswer: 1,
    explanation: "Enlem dakikası ≈ NM olduğundan 15 NM.",
    category: "Coğrafi Temeller"
  },
  {
    id: 28,
    question: "2 LOP kesişimi size ne verir?",
    options: ["Hız", "Rota", "Konum noktası (fix)", "Sapma"],
    correctAnswer: 2,
    explanation: "İki konum doğrusu, bir konum noktası (fix) oluşturur.",
    category: "Klasik Seyir"
  },
  {
    id: 29,
    question: "Radar menzil halkalarında 6 NM çap kaç NM yarıçapa karşılık gelir?",
    options: ["1", "2", "3", "6"],
    correctAnswer: 2,
    explanation: "Çap 6 ise yarıçap 3 NM.",
    category: "Radar"
  },
  {
    id: 30,
    question: "CPA nedir?",
    options: ["Closest Point of Approach", "Course past area", "Compass point angle", "Calculated path angle"],
    correctAnswer: 0,
    explanation: "En yakın yaklaşma noktası.",
    category: "Çatışma Önleme"
  },
  {
    id: 31,
    question: "TCPA = 10 dk ve CPA = 0.2 NM ise hangi aksiyon önceliklidir?",
    options: ["Hiçbiri", "Seyri sürdür", "COLREG'e uygun kaçınma", "Hız artır"],
    correctAnswer: 2,
    explanation: "Kısa TCPA ve düşük CPA çarpışma riskidir; kaçınma manevrası gerekir.",
    category: "COLREG"
  },
  {
    id: 32,
    question: "VAR (variation) doğuda artı ise M'den T'ye dönüşüm nasıl?",
    options: ["T = M + Var(E)", "T = M − Var(E)", "M = T + Var(E)", "C = M + Dev"],
    correctAnswer: 0,
    explanation: "Doğu (+) variation eklenir: True = Magnetic + Var(E).",
    category: "Pusula"
  },
  {
    id: 33,
    question: "Deviation tabloları hangi pusula için tutulur?",
    options: ["Gyro", "Manyetik", "Harita", "Sextant"],
    correctAnswer: 1,
    explanation: "Deviation, manyetik pusulanın gemi üzeri manyetizmadan kaynaklı hatasıdır.",
    category: "Pusula"
  },
  {
    id: 34,
    question: "Plane sailing hangi varsayıma dayanır?",
    options: ["Küre", "Elipsoid", "Düzlem (küçük yaylar)", "Büyük daire"],
    correctAnswer: 2,
    explanation: "Küçük mesafelerde Dünya düzlem kabul edilir.",
    category: "Seyir Yöntemleri"
  },
  {
    id: 35,
    question: "Traverse sailing neyi çözer?",
    options: ["Kutupsal rota", "Küresel trigonometri", "Enlem ve boylam farklarını birlikte", "Sadece boylam farkı"],
    correctAnswer: 2,
    explanation: "Kuzey-güney ve doğu-batı bileşenlerini birlikte ele alır.",
    category: "Seyir Yöntemleri"
  },
  {
    id: 36,
    question: "1 saat 18 kn, set 270° 2 kn. Net batı bileşeni kaç NM?",
    options: ["16", "18", "20", "22"],
    correctAnswer: 0,
    explanation: "Batıya 18 − 2 = 16 NM (batı seti karşıdan kabul).",
    category: "Akıntı"
  },
  {
    id: 37,
    question: "Fix 40°N, 20°E'den 1° enlem güneyine inince enlem nedir?",
    options: ["39°N", "41°N", "40°S", "19°N"],
    correctAnswer: 0,
    explanation: "1° güney = 39°N.",
    category: "Enlem-Boylam"
  },
  {
    id: 38,
    question: "Kerteriz 315°T nedir?",
    options: ["NW", "NE", "SW", "SE"],
    correctAnswer: 0,
    explanation: "315° yaklaşık NW yönüdür.",
    category: "Yönler"
  },
  {
    id: 39,
    question: "1 saatlik seyirde 10° sapma ile gidildi. Hedef çizgiden yanal hata ~? (Yol 12 NM)",
    options: ["~1.2 NM", "~2.1 NM", "~3.5 NM", "~0.5 NM"],
    correctAnswer: 1,
    explanation: "Yanal hata ≈ Yol × sin(10°) ≈ 12×0.1736 ≈ 2.08 NM.",
    category: "Plotting"
  },
  {
    id: 40,
    question: "Tide height interpolation en yaygın hangi yöntemle yapılır?",
    options: ["Doğrusal", "Kübik spline", "Logaritmik", "Üstel"],
    correctAnswer: 0,
    explanation: "Pratikte tablolar arasında doğrusal enterpolasyon yapılır.",
    category: "Gelgit"
  },
  {
    id: 41,
    question: "Eş kerteriz yöntemiyle elde edilen LOP tipi nedir?",
    options: ["Daire", "Doğru", "Parabol", "Elips"],
    correctAnswer: 1,
    explanation: "Eş kerteriz iki kerteriz farkından doğrusal bir LOP verir.",
    category: "Klasik Seyir"
  },
  {
    id: 42,
    question: "SOG 10 kn, STW 12 kn ise akıntı hızı yaklaşık kaç kn?",
    options: ["2", "-2", "0", "1"],
    correctAnswer: 0,
    explanation: "SOG = STW + akıntı bileşeni; 10 = 12 + x ⇒ x ≈ -2 kn (ters). Mutlak hız farkı 2 kn.",
    category: "Akıntı"
  },
  {
    id: 43,
    question: "ECDIS'te güvenli derinlik rengi tipik olarak?",
    options: ["Kırmızı", "Sarı", "Mavi", "Beyaz"],
    correctAnswer: 3,
    explanation: "Derin sular genelde beyaz/açık renk, sığlar mavi tonlar.",
    category: "Elektronik Seyir"
  },
  {
    id: 44,
    question: "GNSS'te HDOP düşükse konum doğruluğu?",
    options: ["Kötü", "Orta", "İyi", "Alakasız"],
    correctAnswer: 2,
    explanation: "Düşük DOP daha iyi geometri ve doğruluk demektir.",
    category: "Jeodezi/GNSS"
  },
  {
    id: 45,
    question: "1 saatlik seyirde 8 NM kuzeye, 6 NM doğuya ilerlediniz. Net mesafe ~?",
    options: ["10", "12", "14", "6"],
    correctAnswer: 0,
    explanation: "√(8²+6²) = 10 NM.",
    category: "Vektör"
  },
  {
    id: 46,
    question: "Kerteriz değişimi ile hız tayini hangi yönteme aittir?",
    options: ["Leeway", "Delta bearing", "Running fix", "Doubling the angle"],
    correctAnswer: 3,
    explanation: "Kıyıdan belirli bir açıyı ikiye katlama yöntemi ile hız/mesafe tayini yapılır.",
    category: "Kıyı Seyri"
  },
  {
    id: 47,
    question: "Leeway nedir?",
    options: ["Rüzgar nedeniyle sapma açısı", "Akıntı hızı", "Pusula hatası", "Gelgit farkı"],
    correctAnswer: 0,
    explanation: "Rüzgarın gemiyi itmesiyle oluşan yanal sapma açısı.",
    category: "Rüzgar"
  },
  {
    id: 48,
    question: "Pilot chart'lar ne sunar?",
    options: ["Anlık hava", "İstatistiksel rüzgar/akıntı", "Gemi hatları", "Derinlik"],
    correctAnswer: 1,
    explanation: "Aylık ortalama rüzgar, akıntı ve rota tavsiyeleri bulunur.",
    category: "Planlama"
  },
  {
    id: 49,
    question: "Transit log hangi bilgiyi içermez?",
    options: ["Gemi kimliği", "Mürettebat listesi", "Yakıt fiyatı", "Güzergâh"],
    correctAnswer: 2,
    explanation: "Transit log operasyonel ve idari verileri içerir; fiyat bilgisi yer almaz.",
    category: "Operasyon"
  },
  {
    id: 50,
    question: "COG 090°, SOG 15 kn ile 4 saat giderseniz boylam değişimi yaklaşık kaç derecedir? (Enlem orta enlemler, Mercator basit)",
    options: ["1°", "2°", "3°", "4°"],
    correctAnswer: 2,
    explanation: "Yol = 60 NM; 1° boylam mesafesi enlem cosφ ile değişir. Orta enlemlerde ~20 NM/° varsayarsak 60/20≈3°. Basitleştirilmiş kabul.",
    category: "Enlem-Boylam"
  }
];

export const getRandomNavigationQuestions = (count: number): QuizQuestion[] => {
  const shuffled = [...navigationQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, navigationQuestions.length));
};

export const getNavigationCategories = (): string[] => {
  return Array.from(new Set(navigationQuestions.map(q => q.category)));
};

