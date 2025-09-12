import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ListChecks, Shuffle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StabilityQuiz as StabilityQuizComponent } from "@/components/stability/StabilityQuiz";
import { stabilityQuestions, getRandomQuestions } from "@/data/stabilityQuestions";

export default function StabilityQuizPage() {
  const navigate = useNavigate();
  const [count, setCount] = useState<number>(50);
  const [seed, setSeed] = useState<number>(Date.now());

  const questions = useMemo(() => {
    // regenerate when seed or count changes
    void seed;
    return getRandomQuestions(count);
  }, [seed, count]);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/stability");
  };

  const maxCount = stabilityQuestions.length;

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-2" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
          Geri Dön
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5" />
            Stabilite Quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>Toplam soru havuzu: {maxCount}</span>
            <span>•</span>
            <span>Karışık {count} soru</span>
            <span>•</span>
            <span>Teorik ve sayısal karışık</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {[10, 25, 50].map((c) => (
              <Button
                key={c}
                variant={count === c ? "default" : "outline"}
                size="sm"
                onClick={() => setCount(Math.min(c, maxCount))}
              >
                {c} Soru
              </Button>
            ))}
            <Button variant="secondary" size="sm" className="gap-2" onClick={() => setSeed(Date.now())}>
              <Shuffle className="h-4 w-4" />
              Yeniden Karıştır
            </Button>
          </div>
        </CardContent>
      </Card>

      <StabilityQuizComponent questions={questions} />
    </div>
  );
}

