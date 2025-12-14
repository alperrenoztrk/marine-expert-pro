import type { QuizQuestion } from "@/types/quiz";

export const meteorologyQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Beaufort 8 (Gale) rüzgârının yaklaşık hız aralığı nedir?",
    options: ["17-21 knot", "28-33 knot", "34-40 knot", "45-52 knot"],
    correctAnswer: 2,
    explanation: "Beaufort 8 = Gale: yaklaşık 34–40 kn aralığı.",
    category: "Beaufort"
  },
  {
    id: 2,
    question: "Kumulonimbus (Cb) bulutu genellikle hangi hava olayının habercisidir?",
    options: ["Sakin hava", "Fırtına ve sağanak", "Sis", "Hafif rüzgâr"],
    correctAnswer: 1,
    explanation: "Cb dikey gelişimli fırtına bulutudur; şiddetli sağanak, yıldırım, squall görülebilir.",
    category: "Bulutlar"
  },
  {
    id: 3,
    question: "Coriolis kuvveti Kuzey yarımkürede hareket eden hava kütlelerini hangi yöne saptırır?",
    options: ["Sola", "Sağa", "Yukarı", "Aşağı"],
    correctAnswer: 1,
    explanation: "Kuzey yarımkürede hareket sağa sapar; bu yüzden alçak basınçlar saat yönünün tersine döner.",
    category: "Dinamik"
  },
  {
    id: 4,
    question: "Deniz suyunun açık okyanuslarda ortalama tuzluluğu yaklaşık kaç promildir (‰)?",
    options: ["15‰", "25‰", "35‰", "45‰"],
    correctAnswer: 2,
    explanation: "Açık okyanuslarda ortalama tuzluluk ~35‰ kabul edilir.",
    category: "Oşinografi"
  },
  {
    id: 5,
    question: "NAVTEX uluslararası yayın için en yaygın hangi frekansta çalışır?",
    options: ["VHF", "MF (518 kHz)", "HF", "UHF"],
    correctAnswer: 1,
    explanation: "NAVTEX: 518 kHz (international) ve 490 kHz (local) MF yayınları.",
    category: "GMDSS/Met"
  },
  {
    id: 6,
    question: "Sis oluşumu riski, çiğ noktası ile hava sıcaklığı farkı hangi değerin altına indiğinde artar?",
    options: ["< 2.5°C", "< 5°C", "< 10°C", "< 15°C"],
    correctAnswer: 0,
    explanation: "Sıcaklık çiğ noktasına yaklaştıkça bağıl nem artar; fark ~2–3°C altına indiğinde sis riski yüksektir.",
    category: "Sis"
  },
  {
    id: 7,
    question: "Derin su dalga boyu yaklaşık formülü \(L \\approx 1.56\\,T^2\\) (m) ise T=10 s için L kaç metredir?",
    options: ["78 m", "100 m", "156 m", "200 m"],
    correctAnswer: 2,
    explanation: "L ≈ 1.56×100 = 156 m.",
    category: "Dalgalar"
  },
  {
    id: 8,
    question: "Kuzey yarımkürede alçak basınç merkezi çevresinde rüzgâr nasıl döner?",
    options: ["Saat yönünde", "Saat yönünün tersine", "Merkezden dışarı doğru", "Tamamen doğrusal"],
    correctAnswer: 1,
    explanation: "Alçak basınçta rüzgâr merkeze doğru ve saat yönünün tersine spiral yapar (KH).",
    category: "Basınç Sistemleri"
  },
  {
    id: 9,
    question: "İzobarlar (isobars) üzerinde değerler birbirine yaklaştıkça genellikle ne artar?",
    options: ["Rüzgâr şiddeti", "Görüş mesafesi", "Deniz suyu tuzluluğu", "Hava sıcaklığı"],
    correctAnswer: 0,
    explanation: "Basınç gradyanı büyüdükçe rüzgâr artar; izobar aralığı daralır.",
    category: "Basınç Sistemleri"
  },
  {
    id: 10,
    question: "Tropikal siklonlar genellikle deniz yüzeyi sıcaklığı kaç °C ve üzerindeyken güçlenir?",
    options: ["18°C", "22°C", "26.5°C", "30°C"],
    correctAnswer: 2,
    explanation: "Genel eşik SST ≈ 26.5°C olarak kabul edilir.",
    category: "Tropikal Meteoroloji"
  },
  {
    id: 11,
    question: "Tropikal siklonun 'eye' bölgesi genellikle nasıldır?",
    options: ["En şiddetli rüzgâr ve yağış", "Sakin/az bulutlu", "Yoğun sis", "Sürekli dolu yağışı"],
    correctAnswer: 1,
    explanation: "Eye nispeten sakin ve açık; en şiddetli koşullar eyewall bölgesindedir.",
    category: "Tropikal Meteoroloji"
  },
  {
    id: 12,
    question: "Soğuk cephe geçişinde aşağıdakilerden hangisi daha olasıdır?",
    options: ["Sıcaklığın artması", "Kısa süreli sağanak ve ani rüzgâr değişimi", "Uzun süreli hafif yağmur", "Rüzgârın tamamen kesilmesi"],
    correctAnswer: 1,
    explanation: "Soğuk cephe: dar bantta konvektif yağış, squall, sıcaklık düşüşü.",
    category: "Cepheler"
  },
  {
    id: 13,
    question: "Sıcak cephe yaklaşırken tipik bulut sıralaması hangisidir?",
    options: ["Cb → Cu → Sc", "Ci → Cs → As → Ns", "St → Sc → Cu", "Ac → Ci → Cb"],
    correctAnswer: 1,
    explanation: "Sıcak cephelerde üst seviye Ci/Cs ile başlar, As/Ns ile yağış gelir.",
    category: "Cepheler"
  },
  {
    id: 14,
    question: "Duman/sis ayrımında, sisin temel özelliği hangisidir?",
    options: ["Sadece gündüz oluşur", "Yoğunlaşma ile su damlacıkları içerir", "Her zaman kuru olur", "Sadece kirli havada oluşur"],
    correctAnswer: 1,
    explanation: "Sis, havadaki su buharının yoğuşmasıyla oluşan çok küçük su damlacıklarıdır.",
    category: "Sis"
  },
  {
    id: 15,
    question: "Bora rüzgârı aşağıdaki özelliklerden hangisiyle bilinir?",
    options: ["Sıcak ve nemli", "Soğuk, kuru ve ani şiddetli", "Sürekli hafif meltem", "Tropikal fırtına"],
    correctAnswer: 1,
    explanation: "Bora: özellikle Adriyatik'te görülen katabatik, soğuk ve çok şiddetli rüzgâr.",
    category: "Yerel Rüzgarlar"
  },
  {
    id: 16,
    question: "Mistral rüzgârı en çok hangi bölgede bilinir?",
    options: ["Kızıldeniz", "Biskay Körfezi", "Güney Fransa / Rhone Vadisi", "Karadeniz"],
    correctAnswer: 2,
    explanation: "Mistral: Rhone vadisinden Akdeniz'e esen soğuk, kuru rüzgâr.",
    category: "Yerel Rüzgarlar"
  },
  {
    id: 17,
    question: "Deniz seviyesinde standart atmosfer basıncı yaklaşık kaç hPa'dır?",
    options: ["1000 hPa", "1013 hPa", "1025 hPa", "1050 hPa"],
    correctAnswer: 1,
    explanation: "Standart basınç ~1013.25 hPa kabul edilir.",
    category: "Temel"
  },
  {
    id: 18,
    question: "Bağıl nem %100'e yaklaştığında aşağıdakilerden hangisi beklenir?",
    options: ["Buharlaşma hızlanır", "Yoğuşma/sis/bulut olasılığı artar", "Basınç her zaman artar", "Rüzgâr her zaman kesilir"],
    correctAnswer: 1,
    explanation: "%100'e yaklaştıkça hava doygunluğa yaklaşır; yoğuşma başlar.",
    category: "Nem"
  },
  {
    id: 19,
    question: "Tropikal siklonlardan kaçınmada en temel ilke hangisidir?",
    options: ["Merkeze yaklaşmak", "Güvenli sektörü belirleyip merkezden uzaklaşmak", "Hızı artırıp merkeze girmek", "Rüzgâr yönünü görmezden gelmek"],
    correctAnswer: 1,
    explanation: "Storm avoidance: safe/dangerous semicircle analizi yapıp merkezi mümkün olan en büyük mesafede tutmak esastır.",
    category: "Storm Avoidance"
  },
  {
    id: 20,
    question: "Kuzey yarımkürede, sırtınızı rüzgâra verdiğinizde alçak basınç yaklaşık hangi tarafta kalır? (Buys Ballot)",
    options: ["Sağda", "Solda", "Önünüzde", "Arkanızda"],
    correctAnswer: 1,
    explanation: "KH'de rüzgârı arkaya alınca alçak basınç solda kalır.",
    category: "Basınç Sistemleri"
  },
  {
    id: 21,
    question: "METAR raporlarında 'CAVOK' ne anlama gelir?",
    options: ["Şiddetli fırtına", "Görüş ve bulut şartları iyi", "Sis uyarısı", "Buzlanma riski"],
    correctAnswer: 1,
    explanation: "CAVOK: Ceiling And Visibility OK (görüş ≥ 10 km, belirgin bulut yok vb.).",
    category: "Met Raporları"
  },
  {
    id: 22,
    question: "Dalga periyodu artarsa, derin suda dalga boyu nasıl değişir?",
    options: ["Azalır", "Artar", "Değişmez", "Rastgele değişir"],
    correctAnswer: 1,
    explanation: "Derin suda L ∝ T²; periyot artışı dalga boyunu büyütür.",
    category: "Dalgalar"
  },
  {
    id: 23,
    question: "Deniz üzerinde oluşan adveksiyon sisi en sık hangi durumda görülür?",
    options: ["Soğuk hava sıcak su üzerine geldiğinde", "Sıcak ve nemli hava soğuk su üzerine geldiğinde", "Sadece dağlarda", "Sadece gece"],
    correctAnswer: 1,
    explanation: "Sıcak-nemli hava soğuk yüzeye taşınınca (adveksiyon) hızla doygunluğa ulaşıp sis oluşur.",
    category: "Sis"
  },
  {
    id: 24,
    question: "Rüzgâr şiddeti çok artmadan önce barometrede hızlı düşüş gözleniyorsa bu genellikle neye işaret eder?",
    options: ["Yüksek basınç sırtı", "Yaklaşan alçak basınç/cephe", "Kesin olarak sis", "Gelgit değişimi"],
    correctAnswer: 1,
    explanation: "Hızlı basınç düşüşü genellikle yaklaşan alçak basınç/cephe sistemidir.",
    category: "Basınç Sistemleri"
  },
  {
    id: 25,
    question: "Denizcilikte 'swell' için en doğru tanım hangisidir?",
    options: ["Yerel rüzgârın oluşturduğu kısa periyotlu dalga", "Uzak fırtınadan gelen uzun periyotlu dalga", "Gelgit akıntısı", "Buz parçaları"],
    correctAnswer: 1,
    explanation: "Swell: uzak fırtınaların ürettiği, uzun periyotlu düzenli dalga sistemidir.",
    category: "Dalgalar"
  }
];

