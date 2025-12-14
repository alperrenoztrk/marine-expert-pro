import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ListChecks, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const cargoQuestions = [
  {
    question: "TPC değeri 25 ton/cm olan bir geminin draftı 8.80 m'den 9.05 m'ye çıktığında yaklaşık kaç ton yük alınmıştır?",
    options: ["250 ton", "375 ton", "625 ton", "900 ton"],
    answer: 2,
    explanation: "Delta T = 0.25 m = 25 cm => 25 × 25 = 625 ton. Hesap: Ağırlık = TPC × Delta T (cm)."
  },
  {
    question: "IMSBC Koduna göre TML (Transportable Moisture Limit) ne anlama gelir?",
    options: [
      "Kargonun maksimum taşıma sıcaklığı",
      "Kargonun güvenli taşınabilir nem limiti",
      "Kargonun toplam ağırlık limiti",
      "Kargonun yoğunluk sınırı"
    ],
    answer: 1,
    explanation: "TML, bir kargonun sıvılaşma riski olmadan güvenle taşınabileceği maksimum nem içeriğidir."
  },
  {
    question: "International Grain Code'a göre düzeltilmiş GM minimum kaç metre olmalıdır?",
    options: ["0.15 m", "0.20 m", "0.30 m", "0.50 m"],
    answer: 2,
    explanation: "Grain Code, tahıl taşıyan gemilerde düzeltilmiş GM'in minimum 0.30 m olmasını şart koşar."
  },
  {
    question: "Draft survey'de birinci trim düzeltmesi (First Trim Correction) ne için yapılır?",
    options: [
      "Yoğunluk farkını düzeltmek için",
      "LCF konumundaki deplasman farkını düzeltmek için",
      "Sıcaklık etkisini düzeltmek için",
      "Rüzgar etkisini düzeltmek için"
    ],
    answer: 1,
    explanation: "Birinci trim düzeltmesi, geminin LCF konumu ile perpendicular'lar arasındaki farkı düzeltir."
  },
  {
    question: "VGM (Verified Gross Mass) hangi tür yükler için zorunludur?",
    options: [
      "Sadece tehlikeli maddeler",
      "Tüm konteynerler",
      "Sadece dökme yükler",
      "Sadece sıvı kargolar"
    ],
    answer: 1,
    explanation: "SOLAS'a göre, gemiye yüklenen tüm konteynerler için VGM zorunludur."
  },
  {
    question: "Grain Code'a göre statik heeling açısı maksimum kaç derece olabilir?",
    options: ["5°", "8°", "12°", "15°"],
    answer: 2,
    explanation: "International Grain Code, statik heeling açısının 12°'yi geçmemesini şart koşar."
  },
  {
    question: "Draft survey'de yoğunluk düzeltmesi hangi durumda yapılır?",
    options: [
      "Deniz suyu yoğunluğu 1.025'ten farklıysa",
      "Hava sıcaklığı 20°C'nin altındaysa",
      "Trim 1 metreden fazlaysa",
      "Rüzgar hızı 15 knot'un üzerindeyse"
    ],
    answer: 0,
    explanation: "Standart deniz suyu yoğunluğu 1.025 t/m³'tür. Farklı yoğunluklarda düzeltme yapılmalıdır."
  },
  {
    question: "IMSBC Kodundaki Grup A kargolar için en önemli risk nedir?",
    options: [
      "Patlama riski",
      "Sıvılaşma riski",
      "Zehirlenme riski",
      "Yanma riski"
    ],
    answer: 1,
    explanation: "Grup A kargolar sıvılaşabilir özelliktedir ve TML kontrolü yapılmalıdır."
  }
];

export default function CargoQuizPage() {
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
    if (index === cargoQuestions[currentQuestion].answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < cargoQuestions.length - 1) {
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

  const question = cargoQuestions[currentQuestion];

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
            Kargo Quiz
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
            Kargo & Operasyon Quiz
          </h1>
          <p className="text-muted-foreground mt-2">
            Draft survey ve yük hesap soruları
          </p>
        </div>

        {showResult ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">Quiz Tamamlandı!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-5xl font-bold text-amber-600">
                {score} / {cargoQuestions.length}
              </div>
              <p className="text-muted-foreground">
                {score === cargoQuestions.length
                  ? "Mükemmel! Tüm soruları doğru yanıtladınız."
                  : score >= cargoQuestions.length * 0.7
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
                <span>Soru {currentQuestion + 1} / {cargoQuestions.length}</span>
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
                  {currentQuestion < cargoQuestions.length - 1 ? "Sonraki Soru" : "Sonuçları Gör"}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
