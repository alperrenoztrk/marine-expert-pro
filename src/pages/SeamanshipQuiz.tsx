import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ListChecks, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const seamanshipQuestions = [
  {
    question: "Demir zinciri scope oranı normal koşullarda en az kaç olmalıdır?",
    options: ["3:1", "5:1", "7:1", "10:1"],
    answer: 1,
    explanation: "Normal koşullarda 5:1 ile 7:1 arasında scope oranı yeterlidir. Fırtınada 10:1 veya daha fazla gerekebilir."
  },
  {
    question: "COLREG Kural 5 neyi zorunlu kılar?",
    options: [
      "Güvenli hız",
      "Uygun gözcülük",
      "Çatışmadan kaçınma",
      "Işık gösterme"
    ],
    answer: 1,
    explanation: "Kural 5, her zaman görsel, işitsel ve mevcut tüm araçlarla uygun gözcülük yapılmasını zorunlu kılar."
  },
  {
    question: "Palamar güvenlik katsayısı (Safety Factor) genellikle ne kadardır?",
    options: ["0.25 - 0.30", "0.40 - 0.45", "0.55 - 0.60", "0.75 - 0.80"],
    answer: 2,
    explanation: "Palamar hatları için güvenlik katsayısı genellikle 0.55 - 0.60 aralığındadır."
  },
  {
    question: "ISM Kodunun temel amacı nedir?",
    options: [
      "Gemi güvenliği sertifikasyonu",
      "Güvenli gemi işletimi ve kirlilik önleme",
      "Mürettebat sertifikasyonu",
      "Kargo güvenliği"
    ],
    answer: 1,
    explanation: "ISM Kodu, güvenli gemi işletimi ve çevre kirliliğinin önlenmesi için standartlar belirler."
  },
  {
    question: "ISPS Kodunda kaç güvenlik seviyesi vardır?",
    options: ["2", "3", "4", "5"],
    answer: 1,
    explanation: "ISPS Kodu 3 güvenlik seviyesi tanımlar: Seviye 1 (Normal), Seviye 2 (Artırılmış), Seviye 3 (Olağanüstü)."
  },
  {
    question: "Demir tutma kuvvetini etkileyen en önemli faktör nedir?",
    options: [
      "Zincir ağırlığı",
      "Deniz akıntısı",
      "Deniz tabanı tipi",
      "Su derinliği"
    ],
    answer: 2,
    explanation: "Deniz tabanı tipi (çamur, kum, kil, kaya) demir tutma kuvvetini doğrudan etkiler."
  },
  {
    question: "Spring halatlar ne için kullanılır?",
    options: [
      "Geminin ileri-geri hareketini kontrol etmek",
      "Geminin yükselip alçalmasını sağlamak",
      "Geminin dönmesini önlemek",
      "Geminin yan yatmasını önlemek"
    ],
    answer: 0,
    explanation: "Spring halatlar, geminin rıhtım boyunca ileri-geri hareketini (surge) kontrol eder."
  },
  {
    question: "Ağır hava devriyesinde kontrol edilmesi gereken öncelikli nokta nedir?",
    options: [
      "Makine dairesi",
      "Güverte ve ambar kapaklarının güvenliği",
      "Mutfak",
      "Kamarot bölümü"
    ],
    answer: 1,
    explanation: "Ağır havada güverte ekipmanları, ambar kapakları ve yük güvenliği öncelikli kontrol edilmelidir."
  }
];

export default function SeamanshipQuizPage() {
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
    if (index === seamanshipQuestions[currentQuestion].answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < seamanshipQuestions.length - 1) {
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

  const question = seamanshipQuestions[currentQuestion];

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
            Gemicilik Quiz
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
            Gemicilik Quiz
          </h1>
          <p className="text-muted-foreground mt-2">
            Demirleme, çarmıh ve vardiya senaryoları
          </p>
        </div>

        {showResult ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">Quiz Tamamlandı!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-5xl font-bold text-emerald-600">
                {score} / {seamanshipQuestions.length}
              </div>
              <p className="text-muted-foreground">
                {score === seamanshipQuestions.length
                  ? "Mükemmel! Tüm soruları doğru yanıtladınız."
                  : score >= seamanshipQuestions.length * 0.7
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
                <span>Soru {currentQuestion + 1} / {seamanshipQuestions.length}</span>
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
                  {currentQuestion < seamanshipQuestions.length - 1 ? "Sonraki Soru" : "Sonuçları Gör"}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
