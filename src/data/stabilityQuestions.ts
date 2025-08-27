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