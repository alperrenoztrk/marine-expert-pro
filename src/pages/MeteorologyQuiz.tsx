import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ListChecks, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const meteorologyQuestions = [
  {
    question: "Beaufort 8 (Gale) rüzgârının yaklaşık hız aralığı nedir?",
    options: ["17-21 knot", "28-33 knot", "34-40 knot", "45-52 knot"],
    answer: 2,
    explanation: "Beaufort 8 = Gale, 34-40 knot (62-74 km/s) aralığına karşılık gelir."
  },
  {
    question: "Kumulonimbus bulutu hangi hava olayının habercisidir?",
    options: ["Sakin hava", "Fırtına ve sağanak yağış", "Sis", "Hafif rüzgâr"],
    answer: 1,
    explanation: "Kumulonimbus, dikey gelişim gösteren fırtına bulutudur ve şiddetli hava olaylarına neden olur."
  },
  {
    question: "Coriolis kuvveti Kuzey yarımkürede hava akışını hangi yöne saptırır?",
    options: ["Sola", "Sağa", "Yukarı", "Aşağı"],
    answer: 1,
    explanation: "Kuzey yarımkürede Coriolis kuvveti hareketi sağa saptırır, bu nedenle siklonlar saat yönünün tersine döner."
  },
  {
    question: "Deniz suyunun ortalama tuzluluk değeri nedir?",
    options: ["15‰", "25‰", "35‰", "45‰"],
    answer: 2,
    explanation: "Açık okyanuslarda ortalama tuzluluk yaklaşık 35 promildir (35 g/kg)."
  },
  {
    question: "NAVTEX hangi frekans bandında yayın yapar?",
    options: ["VHF", "MF (518 kHz)", "HF", "UHF"],
    answer: 1,
    explanation: "NAVTEX, 518 kHz (uluslararası) ve 490 kHz (yerel) MF frekanslarında yayın yapar."
  },
  {
    question: "Sis oluşumu için çiğ noktası ile hava sıcaklığı arasındaki fark ne kadar olmalıdır?",
    options: ["< 2.5°C", "< 5°C", "< 10°C", "< 15°C"],
    answer: 0,
    explanation: "Çiğ noktası ile hava sıcaklığı arasındaki fark 2.5°C'nin altına düştüğünde sis oluşma riski yükselir."
  },
  {
    question: "Derin su dalgaboyu formülünde T = 10 s için dalgaboyu yaklaşık kaç metredir?",
    options: ["78 m", "100 m", "156 m", "200 m"],
    answer: 2,
    explanation: "L = (g × T²) / (2π) = (9.81 × 100) / 6.28 ≈ 156 m"
  },
  {
    question: "Alçak basınç merkezi çevresinde rüzgâr Kuzey yarımkürede nasıl döner?",
    options: ["Saat yönünde", "Saat yönünün tersine", "Merkezden dışarı", "Dışarıdan merkeze düz"],
    answer: 1,
    explanation: "Kuzey yarımkürede alçak basınç çevresinde rüzgâr Coriolis etkisiyle saat yönünün tersine döner."
  }
];

export default function MeteorologyQuizPage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/calculations");
  };

  const handleAnswer = (index: number) => {
    if (answered) return;
    setSelectedAnswer(index);
    setAnswered(true);
    if (index === meteorologyQuestions[currentQuestion].answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < meteorologyQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswered(false);
  };

  const question = meteorologyQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="gap-2" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
            Geri Dön
          </Button>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            Meteoroloji Quiz
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Meteoroloji Quiz
          </h1>
          <p className="text-muted-foreground mt-2">
            Beaufort, bulut türleri ve storm-avoidance soruları
          </p>
        </div>

        {showResult ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">Quiz Tamamlandı!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-5xl font-bold text-sky-600">
                {score} / {meteorologyQuestions.length}
              </div>
              <p className="text-muted-foreground">
                {score === meteorologyQuestions.length
                  ? "Mükemmel! Tüm soruları doğru yanıtladınız."
                  : score >= meteorologyQuestions.length * 0.7
                  ? "İyi iş! Konuyu iyi kavramışsınız."
                  : "Daha fazla çalışmanız gerekiyor."}
              </p>
              <Button onClick={handleRestart} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Tekrar Başla
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Soru {currentQuestion + 1} / {meteorologyQuestions.length}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  Puan: {score}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-medium">{question.question}</p>
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={
                      answered
                        ? index === question.answer
                          ? "default"
                          : selectedAnswer === index
                          ? "destructive"
                          : "outline"
                        : "outline"
                    }
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => handleAnswer(index)}
                    disabled={answered}
                  >
                    <span className="flex items-center gap-2">
                      {answered && index === question.answer && (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      {answered && selectedAnswer === index && index !== question.answer && (
                        <XCircle className="h-4 w-4" />
                      )}
                      {option}
                    </span>
                  </Button>
                ))}
              </div>
              {answered && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm">{question.explanation}</p>
                </div>
              )}
              {answered && (
                <Button onClick={handleNext} className="w-full">
                  {currentQuestion < meteorologyQuestions.length - 1 ? "Sonraki Soru" : "Sonuçları Gör"}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
