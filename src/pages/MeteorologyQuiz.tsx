import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, ListChecks, Shuffle } from "lucide-react";

import { StabilityQuiz as Quiz } from "@/components/stability/StabilityQuiz";
import { meteorologyQuestions } from "@/data/meteorologyQuestions";
import { createSeededRng, pickRandomUnique } from "@/utils/random";

export default function MeteorologyQuizPage() {
  const [count, setCount] = useState<number>(25);
  const [seed, setSeed] = useState<number>(Date.now());

  const questions = useMemo(() => {
    const rng = createSeededRng(seed);
    return pickRandomUnique(meteorologyQuestions, count, rng);
  }, [seed, count]);
  const maxCount = meteorologyQuestions.length;
  const selectableCounts = useMemo(() => {
    const baseCounts = [10, 25, 50, maxCount];
    const uniqueCounts = Array.from(new Set(baseCounts.filter((n) => n <= maxCount)));
    return uniqueCounts.sort((a, b) => a - b);
  }, [maxCount]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-[hsl(220,50%,6%)] dark:via-[hsl(220,50%,8%)] dark:to-[hsl(220,50%,10%)]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-green-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 space-y-6">
        <div className="text-center mb-2 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl mb-4">
            <Cloud className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-3">
            Meteoroloji Quiz
          </h1>
          <p className="text-muted-foreground">Beaufort, bulutlar, cepheler ve fırtına kaçınma konularını pekiştirin</p>
        </div>

        <Card className="border-border/60 bg-card/85 backdrop-blur-sm animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5" />
              Soru Havuzu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>Toplam soru havuzu: {maxCount}</span>
              <span>•</span>
              <span>Görüntülenen: {count} soru</span>
              <span>•</span>
              <span>Beaufort, bulutlar, cepheler, storm-avoidance</span>
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
