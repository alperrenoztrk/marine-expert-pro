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
    question: "GM (Metasentrik Yükseklik) hesaplamasında hangi formül kullanılır?",
    options: [
      "GM = KM + KG",
      "GM = KM - KG", 
      "GM = KB + BM - KG",
      "GM = KG - KM"
    ],
    correctAnswer: 1,
    explanation: "GM = KM - KG formülü ile hesaplanır. KM (metasentrik yükseklik) ile KG (ağırlık merkezi yüksekliği) arasındaki farktır.",
    category: "Temel Stabilite"
  },
  {
    id: 2,
    question: "IS Code'a göre minimum GM değeri nedir?",
    options: [
      "0.10 m",
      "0.15 m",
      "0.20 m", 
      "0.25 m"
    ],
    correctAnswer: 1,
    explanation: "2008 IS Code'a göre çelik kuru yük gemileri için minimum GM değeri genellikle 0.15 m'dir.",
    category: "IS Code"
  },
  {
    id: 3,
    question: "GZ eğrisinin 0°-30° arasındaki alanı en az ne olmalıdır?",
    options: [
      "0.030 m·rad",
      "0.055 m·rad",
      "0.090 m·rad",
      "0.120 m·rad"
    ],
    correctAnswer: 1,
    explanation: "IS Code'a göre GZ eğrisinin 0°-30° arası alanı minimum 0.055 m·rad olmalıdır.",
    category: "IS Code"
  },
  {
    id: 4,
    question: "Serbest yüzey etkisi (FSE) GM'yi nasıl etkiler?",
    options: [
      "GM'yi artırır",
      "GM'yi azaltır",
      "GM'yi etkilemez",
      "Sadece GZ'yi etkiler"
    ],
    correctAnswer: 1,
    explanation: "Serbest yüzey etkisi (FSE) sanal KG artışına neden olarak GM'yi azaltır ve stabiliteyi olumsuz etkiler.",
    category: "Serbest Yüzey"
  },
  {
    id: 5,
    question: "International Grain Code'a göre düzeltilmiş GM (GMcorr) minimum değeri nedir?",
    options: [
      "0.15 m",
      "0.20 m",
      "0.30 m",
      "0.40 m"
    ],
    correctAnswer: 2,
    explanation: "Tahıl yükleri için düzeltilmiş GM minimum 0.30 m olmalıdır. Bu, tahıl kayması etkilerini içerir.",
    category: "Grain Code"
  },
  {
    id: 6,
    question: "Weather Criterion'da denge açısı genellikle ne kadardır?",
    options: [
      "12°",
      "16°", 
      "20°",
      "25°"
    ],
    correctAnswer: 1,
    explanation: "Hava koşulu kriterinde denge açısı genellikle 16° veya güverte kenarının batma açısının %80'i (hangisi küçükse) olmalıdır.",
    category: "Weather Criterion"
  },
  {
    id: 7,
    question: "Maksimum GZ değeri en az ne olmalıdır?",
    options: [
      "0.15 m",
      "0.20 m",
      "0.25 m",
      "0.30 m"
    ],
    correctAnswer: 1,
    explanation: "IS Code'a göre maksimum GZ değeri en az 0.20 m olmalı ve bu değer 30° veya daha büyük açıda oluşmalıdır.",
    category: "IS Code"
  },
  {
    id: 8,
    question: "KG artarsa stabilite nasıl etkilenir?",
    options: [
      "Stabilite artar",
      "Stabilite azalır",
      "Stabilite değişmez",
      "Sadece trim etkiler"
    ],
    correctAnswer: 1,
    explanation: "KG (ağırlık merkezi yüksekliği) arttığında GM azalır ve geminin stabilitesi olumsuz etkilenir.",
    category: "Temel Stabilite"
  },
  {
    id: 9,
    question: "Tahıl kayması sonrası denge açısı maksimum ne kadar olmalıdır?",
    options: [
      "8°",
      "12°",
      "16°",
      "20°"
    ],
    correctAnswer: 1,
    explanation: "International Grain Code'a göre tahıl kayması sonrası oluşan denge açısı 12° veya güverte kenarının batma açısından küçük olanını aşmamalıdır.",
    category: "Grain Code"
  },
  {
    id: 10,
    question: "Pozitif stabilite menzili en az ne kadar olmalıdır?",
    options: [
      "20°",
      "30°",
      "40°",
      "50°"
    ],
    correctAnswer: 1,
    explanation: "Pozitif stabilite menzili en az 30° olmalıdır. Güverte kenarı tercihen 30°'den sonra batmalıdır.",
    category: "IS Code"
  },
  {
    id: 11,
    question: "BM (Metasentrik Yarıçap) neye bağlıdır?",
    options: [
      "Sadece geminin boyuna",
      "Sadece su çekimine",
      "Su hattı alanının atalet momentine",
      "Sadece deplasmana"
    ],
    correctAnswer: 2,
    explanation: "BM = I/∇ formülü ile hesaplanır. I su hattı alanının atalet momenti, ∇ ise su altı hacmidir.",
    category: "Temel Stabilite"
  },
  {
    id: 12,
    question: "Loll durumu ne zaman oluşur?",
    options: [
      "GM > 0 olduğunda",
      "GM = 0 olduğunda",
      "GM < 0 olduğunda",
      "KG = KB olduğunda"
    ],
    correctAnswer: 2,
    explanation: "Loll durumu GM < 0 (negatif stabilite) olduğunda oluşur. Gemi bir açıda dengeye gelir.",
    category: "Loll"
  },
  {
    id: 13,
    question: "GZ eğrisinin 30°-40° arasındaki alanı en az ne olmalıdır?",
    options: [
      "0.020 m·rad",
      "0.030 m·rad",
      "0.055 m·rad",
      "0.090 m·rad"
    ],
    correctAnswer: 1,
    explanation: "IS Code'a göre GZ eğrisinin 30°-40° arası alanı minimum 0.030 m·rad olmalıdır.",
    category: "IS Code"
  },
  {
    id: 14,
    question: "Trim açısı nasıl hesaplanır?",
    options: [
      "tan⁻¹((TA-TF)/LOA)",
      "tan⁻¹((TF-TA)/LOA)",
      "sin⁻¹((TA-TF)/LBP)",
      "cos⁻¹((TA-TF)/LBP)"
    ],
    correctAnswer: 0,
    explanation: "Trim açısı = tan⁻¹((TA-TF)/L) formülü ile hesaplanır. TA kıç su çekimi, TF baş su çekimi, L gemi boyudur.",
    category: "Trim"
  },
  {
    id: 15,
    question: "Hangi durumda en fazla serbest yüzey etkisi oluşur?",
    options: [
      "Tank tamamen dolu",
      "Tank tamamen boş",
      "Tank yarı dolu",
      "Tank %25 dolu"
    ],
    correctAnswer: 2,
    explanation: "En fazla serbest yüzey etkisi tank yarı dolu olduğunda oluşur çünkü serbest yüzey alanı maksimum olur.",
    category: "Serbest Yüzey"
  }
  ,
  {
    id: 16,
    question: "Dikdörtgen kesitli bir tankta serbest yüzey momenti (FSM) için basit yaklaşım hangisidir?",
    options: [
      "FSM = ρ × L × B × T",
      "FSM = ρ × b^3 × l / 12",
      "FSM = ρ × l^3 × b / 12",
      "FSM = ρ × b × l^3 / 3"
    ],
    correctAnswer: 1,
    explanation: "Dikdörtgen tank için enine FSM yaklaşık ρ × b^3 × l / 12 (b: serbest yüzey genişliği, l: uzunluk).",
    category: "Serbest Yüzey"
  },
  {
    id: 17,
    question: "GM = 0.8 m ve KG = 7.2 m ise KM kaç m'dir?",
    options: ["6.4", "7.2", "8.0", "8.0 + 7.2"],
    correctAnswer: 2,
    explanation: "GM = KM − KG ⇒ KM = GM + KG = 0.8 + 7.2 = 8.0 m.",
    category: "Sayısal"
  },
  {
    id: 18,
    question: "Pozitif stabilite menzili hangi iki açı arasındaki aralıktır?",
    options: [
      "0° ile GZ max",
      "0° ile denge açısı",
      "Denge açısı ile güverte batma",
      "İlk sıfır GZ ile son sıfır GZ"
    ],
    correctAnswer: 3,
    explanation: "Pozitif stabilite menzili GZ eğrisinin pozitif olduğu aralıktır: ilk 0 kesişimi ile son 0 kesişimi arası.",
    category: "Temel Stabilite"
  },
  {
    id: 19,
    question: "Bir ağırlık gemi merkez hattından sancak tarafa d metre taşınırsa hangi büyüklük doğrudan etkilenir?",
    options: ["LCG", "VCG", "TCG", "Displacement"],
    correctAnswer: 2,
    explanation: "Yanal taşımada transvers ağırlık merkezi (TCG) değişir; LCG/VCG değil.",
    category: "Ağırlık Operasyonları"
  },
  {
    id: 20,
    question: "Δ = 12,000 t, w = 120 t yük başa 40 m taşındı. Trim momenti nedir?",
    options: ["4,800 tm", "3,600 tm", "2,400 tm", "1,200 tm"],
    correctAnswer: 1,
    explanation: "Trim (boyuna) momenti = w × mesafe = 120 × 40 = 4,800 tm.",
    category: "Trim"
  },
  {
    id: 21,
    question: "GZ ≈ GM × sinθ yaklaşımı hangi açı aralığında geçerlidir?",
    options: ["0°–5°", "0°–10°", "0°–15°", "0°–30°"],
    correctAnswer: 1,
    explanation: "Küçük açılar için sinθ ≈ θ; pratikte 0–10° aralığında doğruluk kabul edilir.",
    category: "Temel Stabilite"
  },
  {
    id: 22,
    question: "GM küçüldükçe yalpa periyodu nasıl değişir?",
    options: ["Kısalır", "Uzunlaşır", "Değişmez", "Sadece KN etkilenir"],
    correctAnswer: 1,
    explanation: "Yalpa periyodu T ≈ 2π × √(k^2/(g×GM)); GM küçülürse periyot artar.",
    category: "Yalpa"
  },
  {
    id: 23,
    question: "Hasarlı stabilite hesabında kullanılan oturma/trim düzeltmeleri hangi veri setine uygulanır?",
    options: ["Bonjean eğrileri", "KN tablosu", "Tank soundingi", "LCB eğrisi"],
    correctAnswer: 1,
    explanation: "Hasarlı durum KN değerleri su çekimi ve trim için düzeltilir.",
    category: "Hasarlı Stabilite"
  },
  {
    id: 24,
    question: "Tahıl stabilitesinde 'heeling moment due to grain shift' neyin fonksiyonudur?",
    options: ["GMcorr", "Grain heeling moment (GHM)", "GZmax", "TPC"],
    correctAnswer: 1,
    explanation: "Grain Code'da GHM hesaplanır ve GMcorr ile karşılaştırılır; soruda momenti soruyor.",
    category: "Grain Code"
  },
  {
    id: 25,
    question: "KB değeri hangi büyüklüğe yakındır?",
    options: ["Draft/2", "Freeboard", "Beam/2", "LCB"],
    correctAnswer: 0,
    explanation: "Birçok gemide KB yaklaşık olarak draftın yarısına yakındır (geometriye bağlıdır).",
    category: "Temel Stabilite"
  },
  {
    id: 26,
    question: "LCG, LCB'den kıça ise gemi nasıl trime gelir?",
    options: ["Baş trimi", "Kıç trimi", "Düz yatar", "Loll oluşur"],
    correctAnswer: 1,
    explanation: "Ağırlık merkezi daha kıçta olduğunda gemi kıça trime gelir.",
    category: "Trim"
  },
  {
    id: 27,
    question: "Δ = 10,000 t, GM = 0.9 m. 5° için righting moment yaklaşık kaç tm?",
    options: ["7,850", "1,570", "785", "157"],
    correctAnswer: 1,
    explanation: "RM ≈ Δ × GM × sinθ = 10,000 × 0.9 × sin5° ≈ 10,000 × 0.9 × 0.087 = 783 tm ≈ 785 tm. En yakın 785.",
    category: "Sayısal"
  },
  {
    id: 28,
    question: "Metasentrin tanımı hangisidir?",
    options: [
      "Su hattı alanı merkezidir",
      "Dönme sonrası kaldırma kuvveti doğrultusunun kesişim noktası",
      "Ağırlık merkezidir",
      "Yüzdürme merkezidir"
    ],
    correctAnswer: 1,
    explanation: "Küçük meyilde yeni kaldırma doğrultusu ile düşeyin kesiştiği nokta metasentr.",
    category: "Temel Stabilite"
  },
  {
    id: 29,
    question: "GM negatifse aşağıdakilerden hangisi beklenir?",
    options: ["Dik durur", "Loll oluşur", "Periyot kısalır", "GZ artar"],
    correctAnswer: 1,
    explanation: "GM < 0 olduğunda gemi küçük bir açıda kararsız dengeye (loll) gelir.",
    category: "Loll"
  },
  {
    id: 30,
    question: "TPC hangi büyüklüğe daha yakındır?",
    options: ["Δ ile orantılıdır", "Su hattı alanı ile orantılıdır", "GM ile orantılıdır", "LCB ile orantılıdır"],
    correctAnswer: 1,
    explanation: "TPC ≈ ρ × Awp / 100; su hattı alanına bağlıdır.",
    category: "Hidrostatik"
  },
  {
    id: 31,
    question: "KN eğrisi neyi temsil eder?",
    options: ["GZ/GM", "K'dan dikey île oluşturulan kol", "KB", "BM"],
    correctAnswer: 1,
    explanation: "KN, K noktasından sağlanan righting arm referansı olup GZ = KN − KG × sinθ ile kullanılır.",
    category: "GZ"
  },
  {
    id: 32,
    question: "Δ = 8,000 t; FSC = 0.20 m. Sanal KG artışı kaç m'dir?",
    options: ["0.20", "0.025", "0.0025", "Δ ile hesaplanmaz"],
    correctAnswer: 0,
    explanation: "Serbest yüzey düzeltmesi sanal KG artışı olarak GM'den düşülür; burada 0.20 m.",
    category: "Serbest Yüzey"
  },
  {
    id: 33,
    question: "İlk çapraz noktadaki GZ değeri sıfır ise bu açı nedir?",
    options: ["Güverte batma açısı", "Denge açısı", "Pozitif stabilite başlangıcı", "Son stabilite açısı"],
    correctAnswer: 2,
    explanation: "GZ ilk kez 0'dan pozitif olurken geçtiği açı pozitif stabilitenin başlangıcıdır (genelde 0°).",
    category: "GZ"
  },
  {
    id: 34,
    question: "Weather Criterion'da rüzgar momentine karşı hangi büyüklük alan olarak karşılaştırılır?",
    options: ["GZmax", "0–40° alanı", "0–θe alanı", "30–40° alanı"],
    correctAnswer: 2,
    explanation: "Hava kriterinde rüzgar devirmesi etkisine karşı 0–denge açısı (θe) arası alan kullanılır.",
    category: "Weather Criterion"
  },
  {
    id: 35,
    question: "Boyuna metasantr (KML) artarsa MCT1cm nasıl etkilenir?",
    options: ["Artar", "Azalır", "Değişmez", "Sadece LCB etkilenir"],
    correctAnswer: 0,
    explanation: "MCT1cm ≈ Δ × GML / (100 × LPP); GML artarsa MCT artar.",
    category: "Trim"
  },
  {
    id: 36,
    question: "Bir yük gemi güvertesinde 5 m yükseltilirse KG nasıl değişir?",
    options: ["Artar", "Azalır", "Değişmez", "Sadece LCG değişir"],
    correctAnswer: 0,
    explanation: "Yükün yukarı taşınması VCG'yi artırır; dolayısıyla KG artar, GM azalır.",
    category: "Ağırlık Operasyonları"
  },
  {
    id: 37,
    question: "Δ = 9,500 t, GM = 0.7 m. 10° için righting moment?",
    options: ["1,158 tm", "1,1580 tm", "1,160 tm", "6,650 tm"],
    correctAnswer: 0,
    explanation: "RM ≈ Δ × GM × sin10° = 9,500×0.7×0.1736 ≈ 1,155 tm ≈ 1,158 tm.",
    category: "Sayısal"
  },
  {
    id: 38,
    question: "Serbest yüzeyin azaltılmasının en etkili yolu hangisidir?",
    options: ["Tankları yarıda tutmak", "Tankları tam doldurmak veya boşaltmak", "Tankları bölmekten kaçınmak", "Viskoziteyi düşürmek"],
    correctAnswer: 1,
    explanation: "Yarı dolu durumdan kaçınmak esastır; tam dolu veya boş en iyisidir. Bölme eklemek de etkilidir.",
    category: "Serbest Yüzey"
  },
  {
    id: 39,
    question: "GZ maksimumu tipik olarak hangi açı civarında oluşur?",
    options: ["10–15°", "25–35°", "40–50°", "60–70°"],
    correctAnswer: 1,
    explanation: "Birçok yük gemisinde GZ_max yaklaşık 25–35° aralığındadır.",
    category: "GZ"
  },
  {
    id: 40,
    question: "Bonjean eğrileri hangi amaçla kullanılır?",
    options: ["Yalpa periyodu", "Su altı alan/alan momentleri", "Rüzgar alanı", "Pervane itmesi"],
    correctAnswer: 1,
    explanation: "Bonjean eğrileri gemi kesit alanlarını ve hacimlerini hesaplamak için kullanılır.",
    category: "Hidrostatik"
  },
  {
    id: 41,
    question: "GM = 0.5 m iken loll oluşmuş gemide hangi işlem loll'u düzeltebilir?",
    options: ["Yükü yukarı taşıma", "Yarı dolu tank açma", "Ballastı aşağı doldurma", "Serbest yüzey ekleme"],
    correctAnswer: 2,
    explanation: "Aşağı seviyelerde ballast almak KG'yi düşürür, GM'yi artırır, loll'u azaltır.",
    category: "Loll"
  },
  {
    id: 42,
    question: "Δ artarken BM nasıl değişir?",
    options: ["Artar", "Azalır", "Değişmez", "Önce artar sonra azalır"],
    correctAnswer: 1,
    explanation: "BM = I/∇; deplasman (∇) artarsa BM azalır (I sabit kabul edilirse).",
    category: "Temel Stabilite"
  },
  {
    id: 43,
    question: "GZ = KN − KG×sinθ bağıntısında KN hangi veriden gelir?",
    options: ["Bonjean", "KN Tablosu/Eğrisi", "TPC tablosu", "MCT1cm tablosu"],
    correctAnswer: 1,
    explanation: "KN değerleri hidrostatik/KN tablolarından elde edilir.",
    category: "GZ"
  },
  {
    id: 44,
    question: "Bir ağırlık gemi merkezinden 15 m sancak tarafa taşındı. Δ=12,000 t, w=60 t. Meyil momenti?",
    options: ["900 tm", "600 tm", "1,200 tm", "3,600 tm"],
    correctAnswer: 0,
    explanation: "Meyil momenti = w × y = 60 × 15 = 900 tm.",
    category: "Sayısal"
  },
  {
    id: 45,
    question: "Krenle güverteden 10 m yukarı kaldırılan 50 t yük için GG1? Δ=10,000 t",
    options: ["0.05 m", "0.5 m", "0.25 m", "0.005 m"],
    correctAnswer: 3,
    explanation: "GG1 = w×h/Δ = 50×10/10,000 = 0.05 m? Dikkat: 50×10=500; 500/10,000=0.05 m. Doğru 0.05 m.",
    category: "Ağırlık Operasyonları"
  },
  {
    id: 46,
    question: "IS Code'a göre 0–40° alanı en az ne olmalıdır?",
    options: ["0.08 m·rad", "0.09 m·rad", "0.12 m·rad", "0.20 m·rad"],
    correctAnswer: 2,
    explanation: "Minimum alan 0.09 (0–30°) ve 0.03 (30–40°); toplam en az 0.12 m·rad olmalıdır.",
    category: "IS Code"
  },
  {
    id: 47,
    question: "GM = 1.2 m ve θe = 35°. Küçük açı yaklaşımıyla GZ(10°) yaklaşık?",
    options: ["0.12 m", "0.21 m", "0.17 m", "0.34 m"],
    correctAnswer: 1,
    explanation: "GZ ≈ GM×sin10° = 1.2×0.1736 ≈ 0.208 m ≈ 0.21 m.",
    category: "Sayısal"
  },
  {
    id: 48,
    question: "Serbest yüzey düzeltmesi hangi terime uygulanır?",
    options: ["KB", "BM", "KG/GM", "KN"],
    correctAnswer: 2,
    explanation: "Sanal KG artışı olarak KG'ye eklenir veya GM'den düşülür (GMcorr).",
    category: "Serbest Yüzey"
  },
  {
    id: 49,
    question: "Δ=11,000 t, GM=0.8 m iken 12°'de RM yaklaşık kaç tm?",
    options: ["1,800", "1,832", "920", "88"],
    correctAnswer: 1,
    explanation: "RM ≈ 11,000×0.8×sin12° ≈ 8,800×0.2079 ≈ 1,832 tm.",
    category: "Sayısal"
  },
  {
    id: 50,
    question: "KN eğrisi altında kalan alan neyi temsil eder?",
    options: ["Dinamik stabilite", "Statik stabilite", "Rüzgar momenti", "Trim momenti"],
    correctAnswer: 0,
    explanation: "Açıya göre integrali dinamik stabiliteyi (enerjiyi) verir; pratikte GZ alanı kullanılır.",
    category: "Dinamik Stabilite"
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