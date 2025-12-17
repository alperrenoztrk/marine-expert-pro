import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Leaf, CheckCircle, XCircle, RotateCcw, Trophy } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "CO₂ emisyonu hesaplamasında kullanılan temel iki parametre nedir?",
    options: [
      "Draft ve trim değerleri",
      "Yakıt tüketimi ve karbon faktörü (CF)",
      "Rüzgâr hızı ve dalga yüksekliği",
      "Motor devri ve tork"
    ],
    correctAnswer: 1,
    explanation: "CO₂ = Yakıt tüketimi (ton) × CF. Karbon faktörü yakıt türüne göre değişir (HFO: 3.114, MGO: 3.206)."
  },
  {
    id: 2,
    question: "2020'den itibaren geçerli olan global kükürt limiti nedir?",
    options: [
      "%3.5 m/m",
      "%1.0 m/m",
      "%0.50 m/m",
      "%0.10 m/m"
    ],
    correctAnswer: 2,
    explanation: "IMO 2020 kuralı ile global kükürt limiti %0.50 m/m olarak belirlenmiştir. ECA bölgelerinde %0.10 m/m uygulanır."
  },
  {
    id: 3,
    question: "CII (Carbon Intensity Indicator) hangi derecelendirme sistemini kullanır?",
    options: [
      "1-5 arası sayısal",
      "A-E arası harf",
      "Düşük-Orta-Yüksek",
      "Yeşil-Sarı-Kırmızı"
    ],
    correctAnswer: 1,
    explanation: "CII, A (en iyi) ile E (en kötü) arasında harf derecelendirmesi kullanır. D veya E alan gemiler düzeltici aksiyon planı sunmalıdır."
  },
  {
    id: 4,
    question: "Balast suyu değişimi (D-1 standardı) için minimum mesafe ve derinlik ne olmalıdır?",
    options: [
      "50 nm, 50 m",
      "100 nm, 100 m",
      "200 nm, 200 m",
      "300 nm, 300 m"
    ],
    correctAnswer: 2,
    explanation: "D-1 standardına göre balast değişimi karadan en az 200 deniz mili uzakta ve 200 metre derinlikte yapılmalıdır."
  },
  {
    id: 5,
    question: "MARPOL Annex V'e göre plastik atıklar için denize deşarj kuralı nedir?",
    options: [
      "Karadan 12 nm sonra deşarj edilebilir",
      "Karadan 25 nm sonra deşarj edilebilir",
      "Tamamen yasaktır",
      "Öğütülmüşse deşarj edilebilir"
    ],
    correctAnswer: 2,
    explanation: "Plastik atıkların denize deşarjı her koşulda ve her bölgede YASAKTIR."
  },
  {
    id: 6,
    question: "NOx emisyonu için Tier III standardı hangi bölgelerde zorunludur?",
    options: [
      "Tüm denizlerde",
      "Sadece karasuları içinde",
      "NECA (NOx Emission Control Areas) bölgelerinde",
      "Sadece limanlarda"
    ],
    correctAnswer: 2,
    explanation: "Tier III, 2016 sonrası inşa edilen gemiler için NECA bölgelerinde (Kuzey Amerika, Karayipler vb.) zorunludur."
  },
  {
    id: 7,
    question: "EEXI sertifikası hangi tarihten itibaren zorunludur?",
    options: [
      "2020",
      "2021",
      "2023",
      "2025"
    ],
    correctAnswer: 2,
    explanation: "EEXI (Energy Efficiency Existing Ship Index) mevcut gemiler için 2023'ten itibaren zorunludur."
  },
  {
    id: 8,
    question: "Sintine suyu deşarjı için maksimum yağ içeriği ne olmalıdır?",
    options: [
      "5 ppm",
      "10 ppm",
      "15 ppm",
      "25 ppm"
    ],
    correctAnswer: 2,
    explanation: "Sintine suyu deşarjı için yağ içeriği 15 ppm'den az olmalı ve onaylı yağ filtreleme ekipmanı kullanılmalıdır."
  },
  {
    id: 9,
    question: "LNG yakıtının karbon faktörü (CF) nedir?",
    options: [
      "3.114",
      "3.206",
      "2.750",
      "1.375"
    ],
    correctAnswer: 2,
    explanation: "LNG için CF = 2.750 ton CO₂/ton yakıt. Bu değer HFO (3.114) ve MGO'dan (3.206) düşüktür."
  },
  {
    id: 10,
    question: "IMO DCS (Data Collection System) hangi gemiler için zorunludur?",
    options: [
      "Tüm gemiler",
      "400 GT üstü gemiler",
      "5000 GT üstü gemiler",
      "Sadece tankerler"
    ],
    correctAnswer: 2,
    explanation: "IMO DCS, 5000 GT ve üzeri uluslararası sefer yapan gemiler için zorunludur."
  }
];

export default function EmissionQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    if (answered) return;
    
    setSelectedAnswer(answerIndex);
    setAnswered(true);

    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      toast.success("Doğru!");
    } else {
      toast.error("Yanlış!");
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswered(false);
  };

  const question = questions[currentQuestion];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-[hsl(220,50%,6%)] dark:via-[hsl(220,50%,8%)] dark:to-[hsl(220,50%,10%)]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-green-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to="/calculations">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-card/50">
              <ArrowLeft className="h-4 w-4" />
              Geri
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl mb-4">
            <Leaf className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-3">
            Çevre Quiz
          </h1>
          <p className="text-muted-foreground">MARPOL ve emisyon bilginizi test edin</p>
        </div>

        {!showResult ? (
          <Card className="border-border/60 bg-card/85 backdrop-blur-sm animate-fade-in">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Soru {currentQuestion + 1}/{questions.length}</CardTitle>
                <span className="text-sm text-muted-foreground">Puan: {score}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-foreground font-medium text-lg">{question.question}</p>

              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={answered}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      answered
                        ? index === question.correctAnswer
                          ? "bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-500"
                          : index === selectedAnswer
                          ? "bg-red-100 dark:bg-red-900/30 border-2 border-red-500"
                          : "bg-muted/50 border border-border"
                        : "bg-muted/50 border border-border hover:bg-muted hover:border-emerald-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {answered && index === question.correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      )}
                      {answered && index === selectedAnswer && index !== question.correctAnswer && (
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      )}
                      <span className="text-foreground">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {answered && (
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Açıklama:</strong> {question.explanation}
                  </p>
                </div>
              )}

              {answered && (
                <Button 
                  onClick={nextQuestion}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                >
                  {currentQuestion < questions.length - 1 ? "Sonraki Soru" : "Sonucu Gör"}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border/60 bg-card/85 backdrop-blur-sm animate-fade-in text-center">
            <CardContent className="pt-8 pb-8 space-y-6">
              <Trophy className="h-16 w-16 mx-auto text-amber-500" />
              <div>
                <h2 className="text-2xl font-bold text-foreground">Quiz Tamamlandı!</h2>
                <p className="text-muted-foreground mt-2">
                  {questions.length} sorudan {score} tanesini doğru yanıtladınız
                </p>
              </div>

              <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                %{Math.round((score / questions.length) * 100)}
              </div>

              <p className="text-sm text-muted-foreground">
                {score >= 8 ? "Mükemmel! Çevre konusunda uzman seviyesindesiniz." :
                 score >= 6 ? "İyi! Biraz daha çalışmayla mükemmel olabilirsiniz." :
                 "Daha fazla çalışmanız önerilir."}
              </p>

              <Button 
                onClick={restartQuiz}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Tekrar Dene
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
