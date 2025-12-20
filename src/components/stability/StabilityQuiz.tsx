import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, RotateCcw, Trophy, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/types/quiz";

interface QuizProps {
  questions: QuizQuestion[];
  onComplete?: (score: number, totalQuestions: number) => void;
}

export const StabilityQuiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const totalQuestions = questions.length;
  const question = questions[currentQuestion];

  useEffect(() => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswered(false);
  }, [questions]);

  const handleAnswer = (answerIndex: number) => {
    if (answered) return;

    setSelectedAnswer(answerIndex);
    setAnswered(true);

    if (answerIndex === question?.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setShowResult(true);
      onComplete?.(score, totalQuestions);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswered(false);
  };

  const progress = useMemo(
    () => ((currentQuestion + 1) / Math.max(totalQuestions, 1)) * 100,
    [currentQuestion, totalQuestions]
  );

  if (totalQuestions === 0) {
    return (
      <Card className="border-border/60 bg-card/85 backdrop-blur-sm">
        <CardContent className="py-8 text-center text-muted-foreground">
          Henüz soru yüklenmedi.
        </CardContent>
      </Card>
    );
  }

  if (showResult) {
    return (
      <Card className="border-border/60 bg-card/85 backdrop-blur-sm animate-fade-in text-center">
        <CardContent className="pt-8 pb-8 space-y-6">
          <Trophy className="h-16 w-16 mx-auto text-amber-500" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">Quiz Tamamlandı!</h2>
            <p className="text-muted-foreground mt-2">
              {totalQuestions} sorudan {score} tanesini doğru yanıtladınız
            </p>
          </div>

          <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
            %{Math.round((score / Math.max(totalQuestions, 1)) * 100)}
          </div>

          <p className="text-sm text-muted-foreground">
            {score >= Math.ceil(totalQuestions * 0.8)
              ? "Mükemmel! Konuda uzman seviyesindesiniz."
              : score >= Math.ceil(totalQuestions * 0.6)
                ? "İyi! Biraz daha çalışmayla mükemmel olabilirsiniz."
                : "Daha fazla çalışmanız önerilir."}
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
    );
  }

  return (
    <Card className="border-border/60 bg-card/85 backdrop-blur-sm animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Soru {currentQuestion + 1}/{totalQuestions}</CardTitle>
          <span className="text-sm text-muted-foreground">Puan: {score}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 mt-2">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        {question?.category && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-100/80 dark:bg-emerald-900/30 px-3 py-1 text-sm text-emerald-700 dark:text-emerald-200">
            {question.category}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-foreground font-medium text-lg leading-relaxed">{question?.question}</p>

        <div className="space-y-3">
          {question?.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={answered}
              className={cn(
                "w-full p-4 rounded-xl text-left transition-all",
                answered
                  ? index === question.correctAnswer
                    ? "bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-500"
                    : index === selectedAnswer
                      ? "bg-red-100 dark:bg-red-900/30 border-2 border-red-500"
                      : "bg-muted/50 border border-border"
                  : "bg-muted/50 border border-border hover:bg-muted hover:border-emerald-300"
              )}
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
              <strong>Açıklama:</strong> {question?.explanation}
            </p>
          </div>
        )}

        {answered && (
          <Button
            onClick={nextQuestion}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
          >
            {currentQuestion < totalQuestions - 1 ? "Sonraki Soru" : "Sonucu Gör"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
