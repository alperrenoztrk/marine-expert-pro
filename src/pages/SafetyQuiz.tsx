import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ListChecks, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const safetyQuestions = [
  {
    question: "SOLAS'a göre yolcu gemilerinde haftalık olarak yapılması zorunlu tatbikat nedir?",
    options: ["Yangın Tatbikatı", "Can salı tatbikatı", "Muster ve cankurtarma tatbikatı", "ISPS güvenlik tatbikatı"],
    answer: 2,
    explanation: "SOLAS III/19 gereği yolcu gemilerinde haftalık muster ve cankurtarma tatbikatı yapılır."
  },
  {
    question: "ISM Kodu kapsamında DPA (Designated Person Ashore) kimin sorumluluğundadır?",
    options: ["Kaptan", "Şirket yönetimi", "Baş mühendis", "Liman otoritesi"],
    answer: 1,
    explanation: "DPA, şirket yönetimi tarafından atanır ve gemi ile kıyı arasında güvenlik bağlantısını sağlar."
  },
  {
    question: "ISPS Kodu kaç güvenlik seviyesi tanımlar?",
    options: ["2 seviye", "3 seviye", "4 seviye", "5 seviye"],
    answer: 1,
    explanation: "ISPS Kodu 3 güvenlik seviyesi tanımlar: Seviye 1 (Normal), Seviye 2 (Artırılmış), Seviye 3 (Olağanüstü)."
  },
  {
    question: "Makine dairesinde köpük uygulaması için standart uygulama hızı nedir?",
    options: ["2.5 L/m²/dk", "4.0 L/m²/dk", "6.5 L/m²/dk", "10.0 L/m²/dk"],
    answer: 2,
    explanation: "Makine dairesi için standart köpük uygulama hızı 6.5 L/m²/dk'dır."
  },
  {
    question: "EPIRB ne zaman otomatik olarak aktive olur?",
    options: ["Yangın alarmıyla", "1-4 m derinlikte", "Kaptan emriyle", "Makine arızasında"],
    answer: 1,
    explanation: "Hidrostatic release unit (HRU), EPIRB'i 1-4 metre derinlikte otomatik olarak serbest bırakır ve aktive eder."
  },
  {
    question: "Risk matrisinde skor 15 ve üzeri hangi risk kategorisine girer?",
    options: ["Düşük risk", "Orta risk", "Yüksek risk", "Kabul edilebilir risk"],
    answer: 2,
    explanation: "Risk matrisi: 15-25 = Yüksek Risk, 8-14 = Orta Risk, 1-7 = Düşük Risk."
  },
  {
    question: "Hot Work (Sıcak İş) izni hangi işlemler için gereklidir?",
    options: [
      "Temizlik işleri",
      "Kaynak, kesme ve taşlama işleri",
      "Boya işleri",
      "Elektrik ölçüm işleri"
    ],
    answer: 1,
    explanation: "Hot Work izni; kaynak, kesme, taşlama ve ısı/kıvılcım üreten tüm işler için gereklidir."
  },
  {
    question: "Can sallarının servis aralığı en fazla ne kadardır?",
    options: ["6 ay", "12 ay", "18 ay", "24 ay"],
    answer: 1,
    explanation: "Can salları en geç 12 ayda bir onaylı servis istasyonunda bakımdan geçirilmelidir."
  }
];

export default function SafetyQuizPage() {
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
    if (index === safetyQuestions[currentQuestion].answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < safetyQuestions.length - 1) {
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

  const question = safetyQuestions[currentQuestion];

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
            Emniyet Quiz
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
            Emniyet Quiz
          </h1>
          <p className="text-muted-foreground mt-2">
            SOLAS, ISM ve emniyet prosedürü soruları
          </p>
        </div>

        {showResult ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">Quiz Tamamlandı!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-5xl font-bold text-rose-600">
                {score} / {safetyQuestions.length}
              </div>
              <p className="text-muted-foreground">
                {score === safetyQuestions.length
                  ? "Mükemmel! Tüm soruları doğru yanıtladınız."
                  : score >= safetyQuestions.length * 0.7
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
                <span>Soru {currentQuestion + 1} / {safetyQuestions.length}</span>
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
                  {currentQuestion < safetyQuestions.length - 1 ? "Sonraki Soru" : "Sonuçları Gör"}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
