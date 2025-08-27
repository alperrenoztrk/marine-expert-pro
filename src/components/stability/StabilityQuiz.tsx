import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  onComplete?: (score: number, totalQuestions: number) => void;
}

export const StabilityQuiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Reset quiz state when questions change
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizCompleted(false);
  }, [questions]);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowResults(false);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowResults(false);
    }
  };

  const showCurrentQuestionResult = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const finishQuiz = () => {
    setQuizCompleted(true);
    const score = calculateScore();
    onComplete?.(score, totalQuestions);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizCompleted(false);
  };

  const isCurrentQuestionAnswered = selectedAnswers[currentQuestion.id] !== undefined;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const allQuestionsAnswered = questions.every(q => selectedAnswers[q.id] !== undefined);

  if (quizCompleted) {
    const score = calculateScore();
    const percentage = Math.round((score / totalQuestions) * 100);
    
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Quiz Tamamlandı!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold text-primary">{percentage}%</div>
            <div className="text-lg">
              {score} / {totalQuestions} doğru cevap
            </div>
            <div className="text-sm text-muted-foreground">
              {percentage >= 80 ? "Tebrikler! Mükemmel bir performans!" : 
               percentage >= 60 ? "İyi bir sonuç! Biraz daha çalışarak daha iyi olabilir." :
               "Daha fazla çalışma gerekiyor. Tekrar deneyin!"}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">Soru Detayları:</h3>
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={question.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">
                        {index + 1}. {question.question}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Sizin cevabınız: {question.options[userAnswer]} 
                        {!isCorrect && (
                          <span className="text-green-600 block">
                            Doğru cevap: {question.options[question.correctAnswer]}
                          </span>
                        )}
                      </div>
                      {!isCorrect && (
                        <div className="text-sm text-blue-600 mt-2 p-2 bg-blue-50 rounded">
                          <strong>Açıklama:</strong> {question.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-center">
            <Button onClick={resetQuiz} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Tekrar Dene
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="text-center py-8">
          <div className="text-muted-foreground">Henüz soru yüklenmedi.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Soru {currentQuestionIndex + 1} / {totalQuestions}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {currentQuestion.category}
          </div>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-lg font-medium leading-relaxed">
          {currentQuestion.question}
        </div>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion.id] === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const isIncorrect = showResults && isSelected && !isCorrect;
            const shouldHighlightCorrect = showResults && isCorrect;
            
            return (
              <button
                key={index}
                onClick={() => !showResults && handleOptionSelect(index)}
                disabled={showResults}
                className={cn(
                  "w-full text-left p-4 rounded-lg border-2 transition-all",
                  "hover:bg-muted/50 disabled:cursor-not-allowed",
                  isSelected && !showResults && "border-primary bg-primary/10",
                  shouldHighlightCorrect && "border-green-500 bg-green-50 text-green-800",
                  isIncorrect && "border-red-500 bg-red-50 text-red-800",
                  !isSelected && !showResults && "border-border"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold",
                    isSelected && !showResults && "border-primary bg-primary text-primary-foreground",
                    shouldHighlightCorrect && "border-green-500 bg-green-500 text-white",
                    isIncorrect && "border-red-500 bg-red-500 text-white",
                    !isSelected && !showResults && "border-muted-foreground"
                  )}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1">{option}</span>
                  {showResults && isCorrect && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {showResults && isIncorrect && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
        
        {showResults && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="font-medium text-blue-800 mb-2">Açıklama:</div>
            <div className="text-blue-700 text-sm leading-relaxed">
              {currentQuestion.explanation}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Önceki
          </Button>
          
          <div className="flex gap-2">
            {isCurrentQuestionAnswered && !showResults && (
              <Button
                variant="secondary"
                onClick={showCurrentQuestionResult}
              >
                Cevabı Göster
              </Button>
            )}
            
            {isLastQuestion && allQuestionsAnswered ? (
              <Button
                onClick={finishQuiz}
                className="gap-2"
              >
                Quiz'i Bitir
                <CheckCircle className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={goToNextQuestion}
                disabled={currentQuestionIndex === totalQuestions - 1}
                className="gap-2"
              >
                Sonraki
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="text-center text-xs text-muted-foreground">
          Yanıtlanmış sorular: {Object.keys(selectedAnswers).length} / {totalQuestions}
        </div>
      </CardContent>
    </Card>
  );
};