import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ListChecks, Shuffle } from "lucide-react";

import { StabilityQuiz as Quiz } from "@/components/stability/StabilityQuiz";
import { safetyQuestions } from "@/data/safetyQuestions";
import { createSeededRng, pickRandomUnique } from "@/utils/random";

export default function SafetyQuizPage() {
  const [count, setCount] = useState<number>(25);
  const [seed, setSeed] = useState<number>(Date.now());

  const questions = useMemo(() => {
    const rng = createSeededRng(seed);
    return pickRandomUnique(safetyQuestions, count, rng);
  }, [seed, count]);
  const maxCount = safetyQuestions.length;
  const selectableCounts = useMemo(() => {
    const baseCounts = [10, 25, 50, maxCount];
    const uniqueCounts = Array.from(new Set(baseCounts.filter((n) => n <= maxCount)));
    return uniqueCounts.sort((a, b) => a - b);
  }, [maxCount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto p-6 space-y-4">
        <div className="flex items-center justify-between">
</div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5" />
              Emniyet Quiz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>Toplam soru havuzu: {maxCount}</span>
              <span>•</span>
              <span>Görüntülenen: {count} soru</span>
              <span>•</span>
              <span>SOLAS, FFA/LSA, PTW, SMS</span>
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
    </div>
  );
}
