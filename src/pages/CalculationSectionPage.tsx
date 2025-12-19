import { Link, useParams } from "react-router-dom";
import { calculationCategories, type SectionId } from "@/data/calculationCenterConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpenCheck, ExternalLink, Info } from "lucide-react";

export default function CalculationSectionPage() {
  const { categoryId, sectionId } = useParams<{ categoryId: string; sectionId: SectionId }>();
  const category = calculationCategories.find((cat) => cat.id === categoryId);
  const section = category?.sections.find((sec) => sec.id === sectionId);

  if (!category || !section) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>İçerik bulunamadı</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>İstediğiniz kategori veya bölüm mevcut değil.</p>
            <Button asChild>
              <Link to="/calculations">Hesaplama Merkezine Dön</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fallback = section.fallback;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-center justify-end">
          {section.href && !fallback && (
            <Button asChild>
              <Link to={section.href} className="gap-2">
                <BookOpenCheck className="h-4 w-4" />
                Modüle git
              </Link>
            </Button>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-blue-500/80 dark:text-blue-300/60">{category.title}</p>
          <h1 className="text-4xl font-bold text-foreground">{section.label}</h1>
          <p className="text-muted-foreground text-lg max-w-3xl">{section.description}</p>
        </div>

        {!fallback ? (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Bu bölüm hazır</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                {section.label} içeriği canlı modül üzerinde sunuluyor. Yukarıdaki "Modüle git" butonu ile doğrudan ilgili arayüze
                ulaşabilirsiniz.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Özet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{fallback.intro}</p>
                {fallback.highlights && (
                  <div className="grid gap-3">
                    {fallback.highlights.map((item) => (
                      <div key={item.title} className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/60 p-4">
                        <p className="font-semibold text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {fallback.formulas && (
              <Card>
                <CardHeader>
                  <CardTitle>Formüller</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {fallback.formulas.map((formula) => (
                    <div key={formula.name} className="rounded-xl bg-slate-900/5 dark:bg-slate-900/40 p-3">
                      <p className="text-sm font-semibold text-foreground">{formula.name}</p>
                      <p className="font-mono text-sm text-blue-600 dark:text-blue-300">{formula.expression}</p>
                      {formula.note && <p className="text-xs text-muted-foreground mt-1">{formula.note}</p>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {fallback.rules && (
              <Card>
                <CardHeader>
                  <CardTitle>Kurallar &amp; Gereklilikler</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc text-sm text-muted-foreground pl-6 space-y-2">
                    {fallback.rules.map((rule) => (
                      <li key={rule}>{rule}</li>
                    ))}
                  </ul>
                  {fallback.links && (
                    <div className="mt-4 space-y-2">
                      {fallback.links.map((link) => (
                        <Button key={link.label} variant="outline" asChild className="w-full justify-start gap-2">
                          <Link to={link.href}>
                            <ExternalLink className="h-4 w-4" />
                            <span className="font-semibold">{link.label}</span>
                            {link.description && (
                              <span className="text-xs text-muted-foreground">{link.description}</span>
                            )}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {fallback.assistantTips && (
              <Card>
                <CardHeader>
                  <CardTitle>Asistan Prompt Şablonları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {fallback.assistantTips.map((tip, idx) => (
                    <div key={tip} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Badge variant="outline" className="mt-0.5">#{idx + 1}</Badge>
                      <p>{tip}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {fallback.quiz && (
              <Card>
                <CardHeader>
                  <CardTitle>Örnek Quiz</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-semibold text-foreground">{fallback.quiz.question}</p>
                  <div className="space-y-2">
                    {fallback.quiz.options.map((option) => (
                      <div key={option} className="rounded-xl border border-slate-200/70 dark:border-slate-800/70 px-4 py-2 text-sm">
                        {option}
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-500/30 p-4 text-sm">
                    <p className="font-semibold text-emerald-800 dark:text-emerald-200">Doğru Cevap: {fallback.quiz.answer}</p>
                    <p className="text-muted-foreground mt-1">{fallback.quiz.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {fallback && !fallback.highlights && !fallback.formulas && !fallback.rules && !fallback.assistantTips && !fallback.quiz && (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                İçerik Bilgisi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Bu bölüm için hazırlanan bilgi kısa sürede güncellenecektir.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
