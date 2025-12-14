import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ListChecks, Shuffle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StabilityQuiz as Quiz } from "@/components/stability/StabilityQuiz";
import { navigationQuestions, getRandomNavigationQuestions } from "@/data/navigationQuestions";

export default function NavigationQuizPage() {
  const navigate = useNavigate();
  const [count, setCount] = useState<number>(50);
  const [seed, setSeed] = useState<number>(Date.now());

  const questions = useMemo(() => {
    return getRandomNavigationQuestions(count, seed);
  }, [seed, count]);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/navigation");
  };

  const maxCount = navigationQuestions.length;
  const selectableCounts = useMemo(() => {
    const baseCounts = [10, 25, 50, maxCount];
    const uniqueCounts = Array.from(new Set(baseCounts.filter((n) => n <= maxCount)));
    return uniqueCounts.sort((a, b) => a - b);
  }, [maxCount]);

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
            Seyir Quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>Toplam soru havuzu: {maxCount}</span>
            <span>•</span>
            <span>Görüntülenen: {count} soru</span>
            <span>•</span>
            <span>Temel ve uygulamalı karışık</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectableCounts.map((c) => (
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

      <Quiz questions={questions} />
    </div>
  );
}

