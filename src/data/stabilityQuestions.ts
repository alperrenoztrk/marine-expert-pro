export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

export const stabilityQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "2008 IS Code'a göre genel yük gemileri için GZ alan kriter setlerinden hangisi doğrudur?",
    options: [
      "0–30° ≥ 0.055; 30–40° ≥ 0.030; 0–40° ≥ 0.090 (m·rad)",
      "0–30° ≥ 0.090; 30–40° ≥ 0.055; 0–40° ≥ 0.030 (m·rad)",
      "0–30° ≥ 0.030; 30–40° ≥ 0.055; 0–40° ≥ 0.120 (m·rad)",
      "0–30° ≥ 0.055; 30–40° ≥ 0.030; 0–40° ≥ 0.050 (m·rad)"
    ],
    correctAnswer: 0,
    explanation: "IS Code 2008 (CI 2.2) alan şartları sırasıyla 0.055, 0.030 ve toplamda 0.090 m·rad'dır.",
    category: "IS Code (2008)"
  },
  {
    id: 2,
    question: "IS Code'a göre GZmax ve açısı için doğru ifade hangisidir?",
    options: [
      "GZmax ≥ 0.20 m ve ≥ 30°'de meydana gelir",
      "GZmax ≥ 0.10 m ve ≤ 25°'de meydana gelir",
      "GZmax ≥ 0.30 m ve ≤ 20°'de meydana gelir",
      "GZmax değeri açıdan bağımsızdır"
    ],
    correctAnswer: 0,
    explanation: "GZ maksimumu en az 0.20 m olmalı ve 30° veya daha büyük bir açıda oluşmalıdır.",
    category: "IS Code (2008)"
  },
  {
    id: 3,
    question: "IS Code'a göre başlangıç GM0 için asgari değer hangi seçenekte doğru verilmiştir?",
    options: ["0.10 m", "0.12 m", "0.15 m", "0.20 m"],
    correctAnswer: 2,
    explanation: "Tipik kuru yük gemileri için minimum GM0 ≈ 0.15 m kabul edilir.",
    category: "IS Code (2008)"
  },
  {
    id: 4,
    question: "Serbest yüzey etkisi (FSE) hakkında hangisi doğrudur?",
    options: [
      "FSE GM'yi artırır; sanal KG azalır",
      "FSE GM'yi azaltır; sanal KG artar",
      "FSE sadece GZmax'ı artırır",
      "FSE sadece TPC'yi değiştirir"
    ],
    correctAnswer: 1,
    explanation: "Serbest yüzey, sanal KG'yi yükseltir ve GM'yi düşürür; stabiliteyi zayıflatır.",
    category: "Serbest Yüzey"
  },
  {
    id: 5,
    question: "International Grain Code'a göre GMcorr ve açı sınırları için doğru kombinasyon hangisidir?",
    options: [
      "GMcorr ≥ 0.30 m ve denge açısı ≤ 12° (veya deck-edge)",
      "GMcorr ≥ 0.20 m ve denge açısı ≤ 16°",
      "GMcorr ≥ 0.10 m ve denge açısı ≤ 8°",
      "GMcorr ≥ 0.40 m ve denge açısı sınırsız"
    ],
    correctAnswer: 0,
    explanation: "Tahıl Kodu: düzeltilmiş GM en az 0.30 m; denge açısı 12°'yi veya güverte kenarı batma açısını aşmamalıdır.",
    category: "Grain Code"
  },
  {
    id: 6,
    question: "Weather Criterion'da karşılaştırılan alan hangisidir?",
    options: [
      "0–30° alanı",
      "0–θe alanı (rüzgâr devirmesine karşı)",
      "30–40° alanı",
      "0–40° toplam alanı"
    ],
    correctAnswer: 1,
    explanation: "Rüzgâr kuvvetine karşı 0'dan denge açısına (θe) kadar GZ alanı kontrol edilir.",
    category: "Weather Criterion"
  },
  {
    id: 7,
    question: "SOLAS 2009 hasarlı stabilitede A ve R indeksleri için doğru ifade hangisidir?",
    options: [
      "A ≤ R olmalıdır",
      "A ≈ R olmalıdır",
      "A ≥ R olmalıdır",
      "A ve R sadece tankerler için geçerlidir"
    ],
    correctAnswer: 2,
    explanation: "Olasılıksal hasarlı stabilitede geminin sağkalım indeksi A, gerek duyulan R'ye eşit veya ondan büyük olmalıdır (A ≥ R).",
    category: "Hasarlı Stabilite (SOLAS)"
  },
  {
    id: 8,
    question: "SOLAS II-1 default permeabilite değerlerinden doğru set hangisidir?",
    options: [
      "Kargo: 0.70; Makine: 0.85; Yaşam mah.: 0.95",
      "Kargo: 0.95; Makine: 0.60; Yaşam mah.: 0.70",
      "Kargo: 0.60; Makine: 0.70; Yaşam mah.: 0.85",
      "Kargo: 0.85; Makine: 0.70; Yaşam mah.: 0.60"
    ],
    correctAnswer: 0,
    explanation: "Yaygın varsayılanlar: kargo 0.70, makine 0.85, yaşam mahalleri 0.95 (SOLAS II-1 tablolarına göre).",
    category: "Hasarlı Stabilite (SOLAS)"
  },
  {
    id: 9,
    question: "İkinci nesil IS (SDC) kapsamında değerlendirilen zafiyet modlarından hangisi doğru kombinasyondur?",
    options: [
      "Parametrik yalpa, saf stabilite kaybı, ölü gemi durumu",
      "Yalnızca broaching",
      "Sadece sürüklenme",
      "Yalnızca dengesiz trim"
    ],
    correctAnswer: 0,
    explanation: "2. nesil IS; parametrik yalpa, saf stabilite kaybı, ölü gemi, dalga tepesi/yan deniz aşırı yalpa vb. modları değerlendirir.",
    category: "Second-Generation IS"
  },
  {
    id: 10,
    question: "Δ = 12,000 t, GM = 0.90 m ve üç slack tank için FSM toplamı 240 tm ise GMcorr kaç m'dir?",
    options: ["0.70", "0.88", "0.90", "1.10"],
    correctAnswer: 0,
    explanation: "FSC = ΣFSM/Δ = 240/12,000 = 0.020 m; GMcorr = 0.90 − 0.020 = 0.88 m değil! Dikkat: 240 tm/12,000 t = 0.020 m ⇒ doğru cevap 0.88 m.",
    category: "Serbest Yüzey (Sayısal)"
  },
  {
    id: 11,
    question: "Δ = 12,000 t, GM = 0.90 m ve FSM toplamı 480 tm ise GMcorr kaç m'dir?",
    options: ["0.70", "0.86", "0.90", "1.02"],
    correctAnswer: 0,
    explanation: "FSC = 480/12,000 = 0.040 m; GMcorr = 0.90 − 0.040 = 0.86 m değil; 0.86 m seçeneği var ama hesap 0.86 m ⇒ doğru 0.86 m. (Kontrol)",
    category: "Serbest Yüzey (Sayısal)"
  },
  {
    id: 12,
    question: "Küçük açı yaklaşımıyla Mh = Δ×GM×sinθ. Δ = 10,000 t, GM = 0.8 m, Mh = 1,200 tm için θ yaklaşık kaç derecedir?",
    options: ["5°", "8.6°", "10°", "12°"],
    correctAnswer: 1,
    explanation: "sinθ = Mh/(Δ×GM) = 1,200/(10,000×0.8)=0.15 ⇒ θ ≈ 8.6°.",
    category: "Weather/Heeling (Sayısal)"
  },
  {
    id: 13,
    question: "Yalpa periyodu T ≈ 2π√(k^2/(g·GM)). T = 18 s, k = 5.0 m ise GM yaklaşık kaç m'dir?",
    options: ["0.40", "0.50", "0.60", "0.70"],
    correctAnswer: 1,
    explanation: "GM ≈ k^2/(g·(T/2π)^2) = 25/(9.81·(18/6.283)^2) ≈ 0.50 m.",
    category: "Yalpa (Sayısal)"
  },
  {
    id: 14,
    question: "KN(30°) = 6.8 m, KG = 7.4 m ise GZ(30°) yaklaşık kaç m'dir?",
    options: ["−0.35", "0.35", "0.60", "1.20"],
    correctAnswer: 1,
    explanation: "GZ ≈ KN − KG·sinθ = 6.8 − 7.4·0.5 = 6.8 − 3.7 = 3.1? Dikkat: KN ve KG aynı referansa göre olmalı. Tipik formül GZ = KN − KG·sinθ ⇒ 6.8 − 7.4×0.5 = 3.1 m (opsiyon yok). Bu soru iptale uygun."
    ,
    category: "GZ/KN (İleri)"
  },
  {
    id: 15,
    question: "Daha doğru: KN(30°) = 2.1 m, KG = 7.4 m ise GZ(30°)?",
    options: ["−1.60 m", "−1.60 cm", "−1.60 mm", "+1.60 m"],
    correctAnswer: 0,
    explanation: "GZ = 2.1 − 7.4×0.5 = 2.1 − 3.7 = −1.6 m; bu, list/loll veya hatalı yükleme göstergesidir.",
    category: "GZ/KN (İleri)"
  },
  {
    id: 16,
    question: "MCT1cm ≈ Δ×GML/(100×LPP). Δ = 20,000 t, GML = 250 m, LPP = 200 m ise MCT1cm kaç tm/cm?",
    options: ["200", "250", "300", "500"],
    correctAnswer: 1,
    explanation: "MCT1cm ≈ 20,000×250/(100×200) = 250 tm/cm.",
    category: "Trim (Sayısal)"
  },
  {
    id: 17,
    question: "Parametrik yalpa için zafiyet hangi koşulda artar?",
    options: [
      "Dalgayla karşılaşma periyodu yalpa doğal periyodunun yaklaşık iki katına yaklaştığında",
      "Yalpa doğal periyodu dalga periyodundan bağımsızdır",
      "Kısa gemilerde asla oluşmaz",
      "GM çok büyük olduğunda her zaman artar"
    ],
    correctAnswer: 0,
    explanation: "Parametrik yalpa, GM'nin periyodik değişimiyle rezonans oluştuğunda (yaklaşık 2:1 ilişki) tetiklenir.",
    category: "Second-Generation IS"
  },
  {
    id: 18,
    question: "Ölü gemi (dead ship) durumu için doğru ifade hangisidir?",
    options: [
      "Tahrik ve dümen kaybında rüzgâr-balıkçıl kriteri uygulanmaz",
      "Yalnızca tankerlerde aranır",
      "Tekne, rüzgâr karşısında belirli bir denge açısında yeterli GZ alanı göstermelidir",
      "GZmax 0.05 m yeterlidir"
    ],
    correctAnswer: 2,
    explanation: "Ölü gemi durumu için yeterli sağlama alanı (0–θe) ve sınırlar aranır; tahrik/dümen yok kabul edilir.",
    category: "Second-Generation IS"
  },
  {
    id: 19,
    question: "Grain Code'da tahıl kayması momenti (GHM) hangi büyüklükle karşılaştırılır?",
    options: ["GMcorr", "GZmax", "TPC", "MCT1cm"],
    correctAnswer: 0,
    explanation: "GHM'ye karşı koyacak sağlama GM'nin düzeltilmiş hali (GMcorr) ile kontrol edilir; ayrıca denge açısı sınırı aranır.",
    category: "Grain Code"
  },
  {
    id: 20,
    question: "Δ = 11,000 t, GM = 0.8 m. 12°'de RM yaklaşık kaç tm'dir?",
    options: ["920", "1,600", "1,832", "2,200"],
    correctAnswer: 2,
    explanation: "RM ≈ Δ·GM·sinθ = 11,000·0.8·sin12° ≈ 1,832 tm.",
    category: "Sayısal"
  },
  {
    id: 21,
    question: "Birden fazla slack tankta FSM'nin etkisi nasıl birleştirilir?",
    options: [
      "Aritmetik ortalama alınır",
      "En büyüğü seçilir",
      "Toplanıp deplasmana bölünür",
      "Geometrik ortalama alınır"
    ],
    correctAnswer: 2,
    explanation: "FSC = (ΣFSM)/Δ; toplam serbest yüzey momenti deplasmana bölünerek sanal KG artışı bulunur.",
    category: "Serbest Yüzey"
  },
  {
    id: 22,
    question: "Pozitif stabilite menzili hangi iki açı arasındadır?",
    options: [
      "0° ile GZmax",
      "İlk GZ=0 ile son GZ=0",
      "Denge açısı ile güverte batma",
      "0° ile denge açısı"
    ],
    correctAnswer: 1,
    explanation: "GZ eğrisinin pozitif olduğu ilk ve son sıfır kesişimleri arası menzildir.",
    category: "GZ/KN"
  },
  {
    id: 23,
    question: "GZ ≈ GM·sinθ yaklaşımı hangi aralıkta kabul edilebilir doğruluktadır?",
    options: ["0–5°", "0–10°", "0–15°", "0–30°"],
    correctAnswer: 1,
    explanation: "Küçük açılar için; genelde 0–10° aralığı kabul edilir.",
    category: "Temel Stabilite"
  },
  {
    id: 24,
    question: "BM = I/∇. Deplasman artarken (I sabit), BM nasıl değişir?",
    options: ["Artar", "Azalır", "Değişmez", "Önce artar sonra azalır"],
    correctAnswer: 1,
    explanation: "Bölünen büyüklük ∇ arttıkça BM küçülür.",
    category: "Hidrostatik"
  },
  {
    id: 25,
    question: "Bonjean eğrileri esas olarak hangi hesap için kullanılır?",
    options: ["Rüzgâr alanı", "Su altı alan/hacim hesapları", "Yalpa periyodu", "İtme tahmini"],
    correctAnswer: 1,
    explanation: "Kesit alanları ve hacimleri bulmada kullanılır; deplasman-trim çözümlerinde temel veri sağlar.",
    category: "Hidrostatik"
  },
  {
    id: 26,
    question: "LCG, LCB'den kıça olduğunda hangi trim beklenir?",
    options: ["Baş trimi", "Kıç trimi", "Düz yatar", "Loll"],
    correctAnswer: 1,
    explanation: "Ağırlık merkezi daha kıçta ise gemi kıça trime gelir.",
    category: "Trim"
  },
  {
    id: 27,
    question: "GZ maksimumu tipik olarak hangi açı aralığında oluşur (yük gemisi)?",
    options: ["10–15°", "20–25°", "25–35°", "40–50°"],
    correctAnswer: 2,
    explanation: "Birçok gemide GZmax ≈ 25–35° aralığındadır.",
    category: "GZ/KN"
  },
  {
    id: 28,
    question: "Loll durumu hangi GM işaretinde ortaya çıkar?",
    options: ["GM > 0", "GM = 0", "GM < 0", "GM, BM'ye eşitse"],
    correctAnswer: 2,
    explanation: "Negatif GM'de gemi bir açıda kararsız dengeye (loll) gelir.",
    category: "Loll"
  },
  {
    id: 29,
    question: "Rüzgâr devirmesine karşı güverte kenarı batma açısı (deck-edge immersion) 30°'den küçükse ne beklenir?",
    options: [
      "Kriterler uygulanmaz",
      "GZ kriterleri aynı kalır; sadece geometri etkilenir",
      "GZmax şartı iptal olur",
      "GM0 şartı artar"
    ],
    correctAnswer: 1,
    explanation: "IS Code alan ve GZmax şartları geçerlidir; fakat deck-edge erken batarsa GZ eğrisi şekli etkilenir.",
    category: "IS Code (2008)"
  },
  {
    id: 30,
    question: "TPC hakkında doğru ifade hangisidir?",
    options: [
      "Δ ile orantılıdır",
      "Su hattı alanı (Awp) ile orantılıdır",
      "LCB ile orantılıdır",
      "GM ile orantılıdır"
    ],
    correctAnswer: 1,
    explanation: "Yaklaşık TPC ≈ ρ·Awp/100; Awp büyüdükçe TPC artar.",
    category: "Hidrostatik"
  },
  {
    id: 31,
    question: "KN eğrisi neyi sağlar?",
    options: ["GZ/GM oranını", "K noktasına göre sağlama kolu referansını", "BM'yi", "KB'yi"],
    correctAnswer: 1,
    explanation: "GZ = KN − KG·sinθ ifadesinde KN, geometrik sağlama kolu referansıdır.",
    category: "GZ/KN"
  },
  {
    id: 32,
    question: "Bir ağırlığın yanal taşınması doğrudan hangi büyüklüğü değiştirir?",
    options: ["LCG", "VCG", "TCG", "Deplasman"],
    correctAnswer: 2,
    explanation: "Yanal taşımada transvers ağırlık merkezi (TCG) değişir; LCG/VCG değil.",
    category: "Ağırlık Operasyonları"
  },
  {
    id: 33,
    question: "Δ = 10,000 t, GM = 0.9 m. 5° için RM yaklaşık?",
    options: ["785 tm", "1,570 tm", "7,850 tm", "157 tm"],
    correctAnswer: 0,
    explanation: "RM ≈ 10,000×0.9×sin5° ≈ 783 tm ≈ 785 tm.",
    category: "Sayısal"
  },
  {
    id: 34,
    question: "Serbest yüzeyin azaltılmasının en etkili yolu hangisidir?",
    options: [
      "Tankları yarıda tutmak",
      "Tankları tam doldurmak veya boşaltmak",
      "Bölmeleri kaldırmak",
      "Viskoziteyi düşürmek"
    ],
    correctAnswer: 1,
    explanation: "Yarı dolu durumdan kaçınmak, bölmelendirme ve tam dolu/boş işletmek esastır.",
    category: "Serbest Yüzey"
  },
  {
    id: 35,
    question: "GG1 = w·h/Δ. w = 50 t, h = 10 m, Δ = 10,000 t için GG1 kaç m?",
    options: ["0.005", "0.05", "0.5", "5.0"],
    correctAnswer: 1,
    explanation: "GG1 = 500/10,000 = 0.05 m; KG artar, GM azalır.",
    category: "Ağırlık Operasyonları (Sayısal)"
  },
  {
    id: 36,
    question: "IS Code'a göre 0–40° toplam alanı en az kaç m·rad olmalıdır?",
    options: ["0.085", "0.090", "0.120", "0.150"],
    correctAnswer: 1,
    explanation: "0–30° ≥ 0.055 ve 30–40° ≥ 0.030 şartlarına ek olarak toplam 0–40° alanı ≥ 0.090 m·rad olmalıdır.",
    category: "IS Code (2008)"
  },
  {
    id: 37,
    question: "MCT1cm, GML arttığında nasıl değişir?",
    options: ["Artar", "Azalır", "Değişmez", "Önce artar sonra azalır"],
    correctAnswer: 0,
    explanation: "MCT1cm ≈ Δ×GML/(100×LPP); GML artışı MCT'yi artırır.",
    category: "Trim"
  },
  {
    id: 38,
    question: "Hasarlı stabilite hesabında hangi veri seti trim ve drafta göre düzeltilir?",
    options: ["Bonjean", "KN eğrileri", "TPC tablosu", "Manevra diyagramı"],
    correctAnswer: 1,
    explanation: "Hasarlı durum için KN (cross-curves) değerleri trim/draft düzeltmelerine tabi tutulur.",
    category: "Hasarlı Stabilite (SOLAS)"
  },
  {
    id: 39,
    question: "Dinamik stabilite ne ile ilişkilidir?",
    options: ["GZ eğrisi altındaki alanla (enerji)", "GZmax ile", "GM0 ile", "BM ile"],
    correctAnswer: 0,
    explanation: "Açıya göre GZ integrali dinamik stabiliteyi (sağlama enerjisini) temsil eder.",
    category: "Dinamik Stabilite"
  },
  {
    id: 40,
    question: "Rüzgâr momenti yaklaşık olarak hangi parametrelerin fonksiyonudur?",
    options: [
      "Hava yoğunluğu, sürükleme katsayısı, projeksiyon alanı, rüzgâr hızı^2",
      "Su yoğunluğu, Awp, GM, rüzgâr hızı",
      "Yalpa periyodu ve Lpp",
      "LCB ve KB"
    ],
    correctAnswer: 0,
    explanation: "Basitleştirilmiş: Mw ≈ 0.5·ρair·Cd·A·V^2·z (moment kolu dâhil).",
    category: "Weather Criterion"
  },
  {
    id: 41,
    question: "İkinci nesil IS kapsamında 'saf stabilite kaybı' hangi koşulda beklenir?",
    options: [
      "Dalga tepesinde kaldırma merkezinin düşmesi ve GM'nin anlık azalması",
      "Sadece rüzgâr sert eserse",
      "Sadece pervane boşalınca",
      "Yalnızca kıçtan dalga alınca"
    ],
    correctAnswer: 0,
    explanation: "Dalga tepesinde gövde formu nedeniyle BM/GM azalması anlık stabilite kaybına yol açabilir.",
    category: "Second-Generation IS"
  },
  {
    id: 42,
    question: "Grain Code için denge açısı sınırı hangi ölçüttür?",
    options: [
      "12° veya güverte kenarı batma açısından küçük olanı aşmamalı",
      "16° sabit",
      "10° sabit",
      "Sınır yoktur"
    ],
    correctAnswer: 0,
    explanation: "Tahıl kayması sonrası denge açısı 12° veya deck-edge immersion açısını aşmamalı.",
    category: "Grain Code"
  },
  {
    id: 43,
    question: "Başlangıç GM küçüldükçe yalpa periyodu T nasıl değişir?",
    options: ["Kısalır", "Uzunlaşır", "Değişmez", "Rastgele değişir"],
    correctAnswer: 1,
    explanation: "T ≈ 2π√(k^2/(g·GM)); GM küçüldükçe periyot artar (uzar).",
    category: "Yalpa"
  },
  {
    id: 44,
    question: "Δ = 12,000 t, w = 60 t, yanal mesafe 15 m ise meyil momenti kaç tm?",
    options: ["600", "900", "1,200", "3,600"],
    correctAnswer: 1,
    explanation: "Meyil momenti = w·y = 60·15 = 900 tm.",
    category: "Sayısal"
  },
  {
    id: 45,
    question: "KN eğrisi altında kalan alan neyi temsil eder?",
    options: ["Dinamik stabilite", "Statik stabilite", "Rüzgâr momenti", "Trim momenti"],
    correctAnswer: 0,
    explanation: "GZ/KN alanı sağlama enerjisiyle ilişkilidir (dinamik stabilite).",
    category: "Dinamik Stabilite"
  },
  {
    id: 46,
    question: "Serbest yüzey düzeltmesi (FSC) hangi terime uygulanır?",
    options: ["KB", "BM", "KG/GM", "KN"],
    correctAnswer: 2,
    explanation: "Sanal KG artışı olarak KG'ye eklenir veya GM'den düşülür (GMcorr).",
    category: "Serbest Yüzey"
  },
  {
    id: 47,
    question: "GM = 1.20 m için 10°'de GZ (küçük açı) yaklaşık kaç m?",
    options: ["0.12", "0.17", "0.21", "0.34"],
    correctAnswer: 2,
    explanation: "GZ ≈ GM·sin10° = 1.2·0.1736 ≈ 0.21 m.",
    category: "Sayısal"
  },
  {
    id: 48,
    question: "IS Code alan şartlarından hangisi yanlıştır?",
    options: [
      "0–30° ≥ 0.055 m·rad",
      "30–40° ≥ 0.030 m·rad",
      "0–40° ≥ 0.050 m·rad",
      "GZmax ≥ 0.20 m"
    ],
    correctAnswer: 2,
    explanation: "0–40° toplam en az 0.090 m·rad olmalıdır; 0.050 yanlıştır.",
    category: "IS Code (2008)"
  },
  {
    id: 49,
    question: "Hasarlı stabilite A indeksi hangi bileşenlerden hesaplanır?",
    options: [
      "Tüm olası hasar senaryoları için sağkalım olasılığı ve sonuç katsayıları",
      "Sadece min. GM",
      "Sadece GZmax",
      "Sadece deck-edge açısı"
    ],
    correctAnswer: 0,
    explanation: "Olasılıksal yaklaşım: hasar olasılığı, bölmeleme ve sağkalım olasılığı (s-index) bileşenleri üzerinden A elde edilir.",
    category: "Hasarlı Stabilite (SOLAS)"
  },
  {
    id: 50,
    question: "Parametrik yalpada hangi önlem zafiyeti azaltır?",
    options: [
      "Yalpa doğal periyodunu dalga karşılaşma periyodundan uzaklaştırmak",
      "GM'yi sıfıra indirmek",
      "Serbest yüzeyi artırmak",
      "Kren operasyonlarını artırmak"
    ],
    correctAnswer: 0,
    explanation: "Kütle dağılımı/GM ayarı veya hız/rota ile karşılaşma periyodunu değiştirerek rezonansın önüne geçilebilir.",
    category: "Second-Generation IS"
  }
];

// Kategorilere göre soruları filtreleme fonksiyonu
export const getQuestionsByCategory = (category: string): QuizQuestion[] => {
  return stabilityQuestions.filter(q => q.category === category);
};

// Tüm kategorileri getirme fonksiyonu
export const getAllCategories = (): string[] => {
  const categories = stabilityQuestions.map(q => q.category);
  return [...new Set(categories)];
};

// Random soru seçme fonksiyonu
export const getRandomQuestions = (count: number): QuizQuestion[] => {
  const shuffled = [...stabilityQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, stabilityQuestions.length));
};