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
  },
  // CHALLENGING USCG LEVEL QUESTIONS START HERE
  {
    id: 51,
    question: "Geminin rotası 064°T, varyasyon 17°W ve pusula rotası 094°M ise sapma (deviation) ne kadardır?",
    options: ["4°E", "4°W", "13°E", "13°W"],
    correctAnswer: 2,
    explanation: "T = M + Var + Dev. 064° = 094° + (-17°) + Dev. Dev = 064° - 077° = -13°E → Pozitif değer olması için +13°E",
    category: "Pusula Hesaplamaları"
  },
  {
    id: 52,
    question: "Radar plotingde hedefin CPA'sı 0.8 NM ve TCPA'sı 12 dakika ise, çarpışma riski var mıdır?",
    options: ["Hayır, güvenli geçiş", "Evet, yüksek risk", "Şartlı, hızlara bağlı", "Belirsiz, takip gerekli"],
    correctAnswer: 1,
    explanation: "CPA < 1 NM ve TCPA < 20 dakika ise yüksek çarpışma riski vardır. Derhal kaçınma manevrası gereklidir.",
    category: "Radar & Çarpışma Önleme"
  },
  {
    id: 53,
    question: "Gök cismi yüksekliği 35°20', göz yüksekliği 12 m ve endeks hatası +2' ise gözlenen yükseklik (Ho) nedir?",
    options: ["35°16'", "35°18'", "35°22'", "35°12'"],
    correctAnswer: 3,
    explanation: "Ho = Hs - IE - DIP. DIP = 1.77√12 ≈ 6'. Ho = 35°20' - 2' - 6' = 35°12'",
    category: "Astronomik Seyir"
  },
  {
    id: 54,
    question: "Tidal stream 2.5 kn 090° yönünde akıyor. Hedef rota 000° ve hız 8 kn ise gerçek rota ne olmalı?",
    options: ["342°", "018°", "000°", "270°"],
    correctAnswer: 0,
    explanation: "Akıntı üçgeni çözümü gerekli. Stream etkisini yenmek için geminin başını batıya çevirmesi gerekir, yaklaşık 342°.",
    category: "Akıntı & Rüzgar"
  },
  {
    id: 55,
    question: "COLREGS'e göre, balıkçı gemisi, motorlu gemi ve yelkenli gemi karşılaştığında öncelik sırası nedir?",
    options: ["Yelkenli > Motorlu > Balıkçı", "Balıkçı > Yelkenli > Motorlu", "Motorlu > Balıkçı > Yelkenli", "Hepsi eşit"],
    correctAnswer: 1,
    explanation: "COLREGS Kural 18: Balıkçı gemisi (faaliyet halinde) > Yelkenli > Motorlu gemi öncelik sırası.",
    category: "COLREGS"
  },
  {
    id: 56,
    question: "GPS HDOP değeri 8.5 ise pozisyon kalitesi nasıl değerlendirilir?",
    options: ["Mükemmel (1-2)", "İyi (2-5)", "Orta (5-10)", "Kötü (>10)"],
    correctAnswer: 2,
    explanation: "HDOP (Horizontal Dilution of Precision): 5-10 arası orta kalite, 8.5 kabul edilebilir ama dikkatli kullanım gerekli.",
    category: "Elektronik Seyir"
  },
  {
    id: 57,
    question: "Mercator projeksiyonunda iki nokta arası rumb çizgisi rotası ve mesafe nasıl bulunur?",
    options: ["Harita üzerinde düz çizgi", "Büyük daire hesabı", "DLat ve DLong ile", "Gnomonik projeksiyon gerekli"],
    correctAnswer: 2,
    explanation: "Mercator'da rumb çizgisi düz çizgidir. Rota = arctan(dLong/dLat), mesafe = dLat/cos(rota).",
    category: "Harita Projeksiyonları"
  },
  {
    id: 58,
    question: "Dead reckoning pozisyonundan fix'e kadar 2.5 NM error var. Bu durumda ne yapmalı?",
    options: ["DR'ı devam ettir", "Set ve drift hesapla", "Kompası kontrol et", "Hızı azalt"],
    correctAnswer: 1,
    explanation: "2.5 NM error büyük. Set (akıntı yönü) ve drift (akıntı hızı) hesaplayıp DR'ı düzeltmek gerekli.",
    category: "Dead Reckoning"
  },
  {
    id: 59,
    question: "Parallel indexing method kullanılırken radar hedefe 2.0 NM mesafede iken 15° starboard da görünüyor. Risk değerlendirmesi?",
    options: ["Güvenli geçiş", "Yakın geçiş, takip et", "Çarpışma kursu", "Manevraya gerek yok"],
    correctAnswer: 2,
    explanation: "Parallel indexing'de hedef radar ekranında sabit açıda kalıyorsa çarpışma kursu vardır. 15° az açı, yüksek risk.",
    category: "Radar Navigasyon"
  },
  {
    id: 60,
    question: "Sunrise azimuth 078°, amplitudo 073° gözlenmiş. Magnetic compass sapması (deviation) nedir?",
    options: ["5°E", "5°W", "151°E", "151°W"],
    correctAnswer: 0,
    explanation: "Deviation = True azimuth - Compass azimuth. Dev = 078° - 073° = 5°E.",
    category: "Astronomik Pusula Kontrolü"
  },
  {
    id: 61,
    question: "ARPA sisteminde 5 dakikalık vektör 2 cm ise hedefin hızı ne kadardır? (Ölçek 1 cm = 6 kn)",
    options: ["6 kn", "12 kn", "24 kn", "30 kn"],
    correctAnswer: 2,
    explanation: "5 dakikalık vektör için: 2 cm × 6 kn/cm × (60/5) = 2 × 6 × 12 = 144 kn değil, doğru formül: 2 cm × 6 kn/cm × 2 = 24 kn (5 dk için çarpan 2)",
    category: "ARPA"
  },
  {
    id: 62,
    question: "Celestial sight reduction'da Hc = 35°25', Ho = 35°18' ise intercept ne kadardır?",
    options: ["7' Away", "7' Towards", "43' Away", "43' Towards"],
    correctAnswer: 0,
    explanation: "Intercept = Ho - Hc = 35°18' - 35°25' = -7'. Negatif değer 'Away' (uzak) demektir.",
    category: "Astronomik Seyir"
  },
  {
    id: 63,
    question: "Local apparent noon'da güneşin bearing'i 178° ise gyro compass hatası ne kadardır?",
    options: ["2°E", "2°W", "182°E", "182°W"],
    correctAnswer: 1,
    explanation: "LAN'da güneş tam güneyde (180°T) olmalı. Gyro error = Gyro - True = 178° - 180° = -2° = 2°W.",
    category: "Gyro Compass Kontrolü"
  },
  {
    id: 64,
    question: "Tidal heights: HW 4.2m at 1430, LW 0.8m at 2045. Saat 1700'de su derinliği yaklaşık kaç metredir?",
    options: ["3.1m", "2.7m", "3.5m", "4.0m"],
    correctAnswer: 0,
    explanation: "Tidal curve rule of twelfths veya cosine rule kullanılır. 1430-1700 = 2.5 saat, tidal range 3.4m, yaklaşık 3.1m.",
    category: "Gelgit Hesaplamaları"
  },
  {
    id: 65,
    question: "Great circle navigation'da vertex latitude nedir?",
    options: ["Başlangıç lat.+ 25°", "Course değişiminin ortası", "En yüksek latitude", "Final lat.+ 25°"],
    correctAnswer: 2,
    explanation: "Great circle'da vertex en yüksek (veya en düşük) latitude noktasıdır.",
    category: "Great Circle"
  },
  {
    id: 66,
    question: "Composite great circle navigation ne zaman kullanılır?",
    options: ["Tüm uzun mesafelerde", "Ice limit varsa", "Fuel tasarrufu için", "Sadece Atlantik'te"],
    correctAnswer: 1,
    explanation: "Composite sailing, ice limit, traffic separation zones gibi kısıtlamalar olduğunda kullanılır.",
    category: "Composite Sailing"
  },
  {
    id: 67,
    question: "Electronic chart (ECDIS) alarm: 'Cross Track Error 0.5 NM'. Ne yapmalı?",
    options: ["Alarmı kapat", "Route'u kontrol et", "Manual steering'e geç", "Hızı azalt"],
    correctAnswer: 1,
    explanation: "XTE 0.5 NM büyük sapma. Route planını, akıntıyı ve steering mode'u kontrol etmek gerekli.",
    category: "ECDIS"
  },
  {
    id: 68,
    question: "Magnetic variation 15°W olan bölgede compass heading 270°M'dan true heading'e çevirmek için?",
    options: ["270° + 15° = 285°T", "270° - 15° = 255°T", "270° × 1.15", "Ek hesap gerekli"],
    correctAnswer: 1,
    explanation: "True = Magnetic + Variation. Westerly variation negatif: T = 270° + (-15°) = 255°T.",
    category: "Compass Corrections"
  },
  {
    id: 69,
    question: "COLREGS Rule 19 (fog) gereği radar contact'ta ne yapmalı?",
    options: ["Starboard'a dön", "Full astern", "Safe speed'e düş", "Fog signal ver"],
    correctAnswer: 2,
    explanation: "Rule 19: Görüş kısıtlı havada safe speed ile gitmek, ani manevralardan kaçınmak gerekir.",
    category: "COLREGS - Fog"
  },
  {
    id: 70,
    question: "Celestial navigation'da meridian passage time nasıl hesaplanır?",
    options: ["GHA = longitude", "SHA + GHA = 360°", "LMT = GMT + longitude", "Sunrise + 6 saat"],
    correctAnswer: 0,
    explanation: "Meridian passage'da GHA = observer longitude olduğu zamanı hesaplamak gerekir.",
    category: "Celestial Timing"
  },
  {
    id: 71,
    question: "Parallel sailing formülünde DLong = 180 NM, latitude 45°N ise departure ne kadardır?",
    options: ["127 NM", "180 NM", "255 NM", "360 NM"],
    correctAnswer: 0,
    explanation: "Departure = DLong × cos(lat) = 180 × cos(45°) = 180 × 0.707 = 127 NM.",
    category: "Parallel Sailing"
  },
  {
    id: 72,
    question: "GPS almanac data kaç gün geçerlidir?",
    options: ["1 gün", "7 gün", "30 gün", "180 gün"],
    correctAnswer: 3,
    explanation: "GPS almanac yaklaşık 6 ay (180 gün) geçerlidir. Ephemeris data ise 2-4 saat geçerli.",
    category: "GPS Teknik"
  },
  {
    id: 73,
    question: "Current triangle'da set 045°, drift 2.5 kn, ship's heading 000°, speed 10 kn ise track nedir?",
    options: ["014°", "346°", "045°", "000°"],
    correctAnswer: 0,
    explanation: "Vector addition: Ship vector + current vector = track vector. Yaklaşık 014° çıkar.",
    category: "Current Calculations"
  },
  {
    id: 74,
    question: "Radar horizon gemiden 20 NM uzakta ise radar anteni yaklaşık kaç metre yükseklikte?",
    options: ["15 m", "30 m", "45 m", "60 m"],
    correctAnswer: 1,
    explanation: "Radar horizon = 1.23 × √h (metre). 20 = 1.23 × √h → h ≈ 264 m² ÷ 1.23² ≈ 30m antenna yüksekliği.",
    category: "Radar Theory"
  },
  {
    id: 75,
    question: "SOLAS Chapter V navigation equipment requirements hangi boyuttaki gemiler için zorunludur?",
    options: ["Tüm gemiler", ">300 GT", ">500 GT", ">1600 GT"],
    correctAnswer: 1,
    explanation: "SOLAS Chapter V navigation requirements genelde 300 GT üzeri gemiler için zorunludur.",
    category: "Maritime Regulations"
  },
  {
    id: 76,
    question: "Mercator chart'ta 1° latitude 60 NM ise, 45°N'de 1° longitude kaç NM'dir?",
    options: ["42.4 NM", "60 NM", "84.8 NM", "120 NM"],
    correctAnswer: 0,
    explanation: "45°N'de: 1° longitude = 60 × cos(45°) = 60 × 0.707 = 42.4 NM.",
    category: "Chart Projections"
  },
  {
    id: 77,
    question: "True wind speed 25 kn, direction 090°T. Ship heading 045°T, speed 15 kn ise apparent wind nedir?",
    options: ["18 kn, 063°T", "32 kn, 072°T", "25 kn, 090°T", "40 kn, 045°T"],
    correctAnswer: 1,
    explanation: "Wind triangle: True wind - ship motion = apparent wind. Vector calculation gerekli, yaklaşık 32 kn, 072°T.",
    category: "Wind Calculations"
  },
  {
    id: 78,
    question: "AIS Class A transponder güncelleme frequency ne kadardır?",
    options: ["10 saniye", "2-6 saniye", "30 saniye", "2 dakika"],
    correctAnswer: 1,
    explanation: "AIS Class A: Hıza göre 2-10 saniye arası, genelde yüksek hızda 2-6 saniye güncelleme.",
    category: "AIS Technical"
  },
  {
    id: 79,
    question: "Gyrocompass settling time genellikle ne kadardır?",
    options: ["15 dakika", "2-6 saat", "24 saat", "3 gün"],
    correctAnswer: 1,
    explanation: "Gyrocompass settling time (true north'a alignment) genellikle 2-6 saat sürer.",
    category: "Gyrocompass"
  },
  {
    id: 80,
    question: "COLREGS'te 'constrained by draught' geminin lights configuration nasıl olmalı?",
    options: ["3 red lights", "Red-White-Red", "2 black balls", "Diamond shape"],
    correctAnswer: 0,
    explanation: "Constrained by draught: 3 vertical red lights (gece) ve cylinder (gündüz) gösterir.",
    category: "COLREGS Signals"
  },
  {
    id: 81,
    question: "Electronic chart corrections ne sıklıkta yapılmalıdır?",
    options: ["Haftalık", "Aylık", "Voyage öncesi", "Daily NtM check"],
    correctAnswer: 3,
    explanation: "Electronic chart corrections daily Notice to Mariners ile kontrol edilmeli ve güncel tutulmalı.",
    category: "Chart Corrections"
  },
  {
    id: 82,
    question: "Radar ARPA target acquisition için minimum time ne kadardır?",
    options: ["30 saniye", "1 dakika", "3 dakika", "5 dakika"],
    correctAnswer: 2,
    explanation: "ARPA reliable track establishment için minimum 3 dakika gerekmektedir.",
    category: "ARPA Technical"
  },
  {
    id: 83,
    question: "GPS Selective Availability hangi yılda kaldırılmıştır?",
    options: ["1995", "2000", "2005", "2010"],
    correctAnswer: 1,
    explanation: "GPS Selective Availability (artificial accuracy degradation) 1 Mayıs 2000'de kaldırıldı.",
    category: "GPS History"
  },
  {
    id: 84,
    question: "GMDSS sea area A2'de hangi communication systems zorunludur?",
    options: ["Sadece VHF", "VHF + MF", "VHF + INMARSAT", "Tüm sistemler"],
    correctAnswer: 2,
    explanation: "GMDSS A2 area: VHF + MF/HF veya VHF + satellite communication (INMARSAT) zorunlu.",
    category: "GMDSS"
  },
  {
    id: 85,
    question: "Tide tables'da secondary port için corrections nasıl uygulanır?",
    options: ["Direct reading", "Time & height differences", "Percentage calculation", "Linear interpolation"],
    correctAnswer: 1,
    explanation: "Secondary port: Standard port'tan time difference ve height difference uygulanır.",
    category: "Tidal Calculations"
  },
  {
    id: 86,
    question: "ECDIS display scale 1:25000 iken over-scale indication ne zaman aktif olur?",
    options: ["1:12500", "1:50000", "1:100000", "Scale limit yok"],
    correctAnswer: 1,
    explanation: "ECDIS over-scale warning, chart compilation scale'den daha büyük scale'de görüntüleme yapıldığında aktif olur.",
    category: "ECDIS Display"
  },
  {
    id: 87,
    question: "GPS/GNSS integrity monitoring RAIM için minimum kaç uydu gerekir?",
    options: ["4", "5", "6", "8"],
    correctAnswer: 1,
    explanation: "RAIM (Receiver Autonomous Integrity Monitoring) için minimum 5 uydu gereklidir.",
    category: "GPS/GNSS"
  },
  {
    id: 88,
    question: "COLREGS Rule 2 (responsibility) en önemli prensibi nedir?",
    options: ["Right of way", "Good seamanship", "Technical compliance", "Speed limits"],
    correctAnswer: 1,
    explanation: "Rule 2: Good seamanship ve ordinary practice of seamen her durumda geçerlidir.",
    category: "COLREGS Philosophy"
  },
  {
    id: 89,
    question: "Chart datum ve GPS datum farkı pozisyon hatası yaratabilir mi?",
    options: ["Hayır, aynıdır", "Evet, 100m'ye kadar", "Sadece eski chartlarda", "Teknisyen ayarlar"],
    correctAnswer: 1,
    explanation: "Chart datum (genelde local) ile GPS datum (WGS84) farkı önemli pozisyon hatası (100-200m) yaratabilir.",
    category: "Datum Differences"
  },
  {
    id: 90,
    question: "Emergency navigation equipment listesinde olması gereken minimum items nelerdir?",
    options: ["Sadece compass", "Compass + charts", "Compass, charts, sextant", "Full bridge equipment"],
    correctAnswer: 2,
    explanation: "Emergency navigation: Magnetic compass, essential charts, sextant, chronometer, navigation tables minimum gereklidir.",
    category: "Emergency Navigation"
  }
];

export const getRandomNavigationQuestions = (count: number): QuizQuestion[] => {
  const shuffled = [...navigationQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, navigationQuestions.length));
};

export const getNavigationCategories = (): string[] => {
  return Array.from(new Set(navigationQuestions.map(q => q.category)));
};
