import { useState } from "react";
import type { ModuleSectionContent } from "@/data/moduleSectionContent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  content: ModuleSectionContent;
}

export function RichSectionContent({ content }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200/80 dark:border-slate-800/60 bg-gradient-to-br from-white/90 via-white/70 to-blue-50/60 dark:from-slate-900/60 dark:via-slate-900/30 dark:to-slate-950/40 p-8 shadow-sm space-y-4">
        <Badge variant="secondary" className="uppercase tracking-[0.25em] text-xs">
          {content.hero.badge}
        </Badge>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">{content.hero.title}</h2>
          <p className="text-muted-foreground text-lg">{content.hero.subtitle}</p>
        </div>
        {content.hero.stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {content.hero.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-blue-200/60 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/60 p-4"
              >
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-semibold text-foreground mt-1">{stat.value}</p>
                {stat.trend && <p className="text-xs text-blue-500/70 dark:text-blue-300/80 mt-1">{stat.trend}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {content.highlightCards && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {content.highlightCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title} className="border border-slate-200/80 dark:border-slate-800/60">
                <CardHeader className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{card.title}</CardTitle>
                      {card.badge && <Badge variant="outline">{card.badge}</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {content.actions && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {content.actions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.title} className="border border-slate-200/80 dark:border-slate-800/60">
                <CardHeader className="space-y-2">
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-200">
                        <Icon className="h-5 w-5" />
                      </div>
                    )}
                    <CardTitle className="text-base">{action.title}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{action.detail}</p>
                </CardHeader>
                {action.chips && (
                  <CardContent className="flex flex-wrap gap-2">
                    {action.chips.map((chip) => (
                      <Badge key={chip} variant="outline">
                        {chip}
                      </Badge>
                    ))}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {content.timeline && (
        <Card className="border border-slate-200/80 dark:border-slate-800/60">
          <CardHeader>
            <CardTitle>{content.timeline.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.timeline.phases.map((phase, idx) => (
              <div key={phase.title} className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">#{idx + 1}</Badge>
                  <p className="font-semibold text-foreground">{phase.title}</p>
                </div>
                <div className="flex-1 text-sm text-muted-foreground">{phase.detail}</div>
                {phase.duration && <p className="text-xs text-muted-foreground">{phase.duration}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {content.frameworks && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.frameworks.map((framework) => (
            <Card key={framework.title} className="border border-slate-200/80 dark:border-slate-800/60">
              <CardHeader>
                <CardTitle>{framework.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {framework.steps.map((step, idx) => (
                  <div key={step.title} className="flex gap-3">
                    <Badge variant="outline" className="h-fit">{`0${idx + 1}`}</Badge>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {content.matrix && (
        <Card className="border border-slate-200/80 dark:border-slate-800/60">
          <CardHeader>
            <CardTitle>{content.matrix.title}</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr>
                  <th className="py-2 pr-4 font-semibold">Başlık</th>
                  {content.matrix.headers.map((header) => (
                    <th key={header} className="py-2 pr-4 font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="align-top">
                {content.matrix.rows.map((row) => (
                  <tr key={row.label} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="py-3 pr-4 font-semibold text-foreground">{row.label}</td>
                    {row.values.map((value, idx) => (
                      <td key={`${row.label}-${idx}`} className="py-3 pr-4 text-muted-foreground">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {content.checklist && (
        <Card className="border border-slate-200/80 dark:border-slate-800/60">
          <CardHeader>
            <CardTitle>{content.checklist.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {content.checklist.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {content.resources && (
        <Card className="border border-slate-200/80 dark:border-slate-800/60">
          <CardHeader>
            <CardTitle>Kaynaklar</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {content.resources.map((resource) => (
              <div
                key={resource.label}
                className="rounded-2xl border border-slate-100 dark:border-slate-800/80 px-4 py-3 bg-white/80 dark:bg-slate-900/50"
              >
                <p className="font-semibold text-foreground">{resource.label}</p>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {content.assistantPrompts && (
        <Card className="border border-slate-200/80 dark:border-slate-800/60">
          <CardHeader>
            <CardTitle>Asistan Prompt Şablonları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {content.assistantPrompts.map((prompt, idx) => (
              <div key={prompt.prompt} className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">
                  #{idx + 1}
                </Badge>
                <div>
                  <p className="text-sm text-foreground">{prompt.prompt}</p>
                  {prompt.context && <p className="text-xs text-muted-foreground mt-1">{prompt.context}</p>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {content.callouts && (
        <Card className="border border-slate-200/80 dark:border-slate-800/60">
          <CardHeader>
            <CardTitle>{content.callouts.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {content.callouts.items.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {content.quiz && (
        <Card className="border border-slate-200/80 dark:border-slate-800/60">
          <CardHeader>
            <CardTitle>{content.quiz.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{content.quiz.description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {content.quiz.questions.map((question, idx) => {
              const selected = answers[idx];
              const isCorrect = selected ? selected === question.answer : null;

              return (
                <div key={question.question} className="space-y-3">
                  <p className="font-semibold text-foreground">{question.question}</p>
                  <div className="grid gap-2">
                    {question.options.map((option) => (
                      <Button
                        key={option}
                        variant={selected === option ? "default" : "outline"}
                        className={cn(
                          "justify-start text-left",
                          selected === option ? "bg-blue-600 text-white hover:bg-blue-600/90" : "bg-transparent"
                        )}
                        onClick={() => setAnswers((prev) => ({ ...prev, [idx]: option }))}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                  {selected && (
                    <div
                      className={cn(
                        "rounded-2xl border p-3 text-sm",
                        isCorrect
                          ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/30"
                          : "border-rose-300 bg-rose-50 dark:bg-rose-900/30"
                      )}
                    >
                      <p className="font-semibold">
                        {isCorrect ? "Doğru!" : `Doğru Cevap: ${question.answer}`}
                      </p>
                      <p className="text-muted-foreground mt-1">{question.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
