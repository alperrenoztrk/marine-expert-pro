import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Anchor, Ship, Waves, Shield, AlertTriangle, Calculator, Scale, Lightbulb, CheckCircle, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { stabilityTopicsData } from "@/data/stabilityTopicsContent";

const iconMap: Record<string, React.ReactNode> = {
  Anchor: <Anchor className="h-5 w-5 text-white" />,
  Scale: <Scale className="h-5 w-5 text-white" />,
  Waves: <Waves className="h-5 w-5 text-white" />,
  Calculator: <Calculator className="h-5 w-5 text-white" />,
  Ship: <Ship className="h-5 w-5 text-white" />,
  Shield: <Shield className="h-5 w-5 text-white" />,
  AlertTriangle: <AlertTriangle className="h-5 w-5 text-white" />,
};

export default function StabilityTopicsPage() {
  return (
    <MobileLayout>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-32 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 space-y-6 max-w-4xl mx-auto pb-20">
          <div className="flex items-center justify-between mb-8">
            <Link to="/stability">
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-white/50 dark:hover:bg-slate-900/40">
                <ArrowLeft className="h-4 w-4" />
                Stabilite
              </Button>
            </Link>
          </div>

          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent mb-3">
              Gemi Stabilitesi Konu Anlatımı
            </h1>
            <p className="text-muted-foreground">Kapsamlı teorik bilgi, formüller ve örnekler</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {stabilityTopicsData.map((topic) => (
              <AccordionItem key={topic.id} value={topic.id} className="border-none">
                <Card className="overflow-hidden">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-blue-50/50 dark:hover:bg-slate-900/40">
                    <div className="flex items-center gap-3">
                      <div className={`bg-gradient-to-br ${topic.iconColor} p-2 rounded-lg`}>
                        {iconMap[topic.icon] || <BookOpen className="h-5 w-5 text-white" />}
                      </div>
                      <div className="text-left">
                        <span className="font-semibold text-lg block">{topic.title}</span>
                        <span className="text-xs text-muted-foreground">{topic.description}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-8">
                      {topic.subtopics.map((subtopic, subIndex) => (
                        <div key={subIndex} className="space-y-4">
                          <h3 className="font-bold text-blue-700 dark:text-blue-200 text-lg border-b border-blue-100 dark:border-slate-800 pb-2">
                            {subtopic.title}
                          </h3>
                          
                          {/* Main Content */}
                          <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                            {subtopic.content.split('\n\n').map((paragraph, pIndex) => {
                              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                                return (
                                  <h4 key={pIndex} className="font-semibold text-foreground mt-4 mb-2">
                                    {paragraph.replace(/\*\*/g, '')}
                                  </h4>
                                );
                              }
                              if (paragraph.includes('**')) {
                                const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
                                return (
                                  <p key={pIndex} className="mb-3">
                                    {parts.map((part, i) => 
                                      part.startsWith('**') && part.endsWith('**') 
                                        ? <strong key={i} className="text-foreground">{part.replace(/\*\*/g, '')}</strong>
                                        : part
                                    )}
                                  </p>
                                );
                              }
                              return <p key={pIndex} className="mb-3">{paragraph}</p>;
                            })}
                          </div>

                          {/* Formulas */}
                          {subtopic.formulas && subtopic.formulas.length > 0 && (
                            <div className="space-y-2 mt-4">
                              <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                                <Calculator className="h-4 w-4" /> Formüller
                              </h4>
                              {subtopic.formulas.map((formula, fIndex) => (
                                <div key={fIndex} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                  <p className="font-mono text-center text-blue-800 font-semibold text-lg">
                                    {formula.formula}
                                  </p>
                                  <p className="text-xs text-blue-600 mt-2 text-center">
                                    {formula.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Examples */}
                          {subtopic.examples && subtopic.examples.length > 0 && (
                            <div className="space-y-3 mt-4">
                              <h4 className="font-semibold text-green-600 flex items-center gap-2">
                                <Lightbulb className="h-4 w-4" /> Örnekler
                              </h4>
                              {subtopic.examples.map((example, eIndex) => (
                                <div key={eIndex} className="bg-green-50 p-4 rounded-lg border border-green-200">
                                  <p className="text-sm text-green-800 font-medium mb-2">
                                    <strong>Soru:</strong> {example.problem}
                                  </p>
                                  <p className="text-sm text-green-700 font-mono">
                                    <strong>Çözüm:</strong> {example.solution}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Key Points */}
                          {subtopic.keyPoints && subtopic.keyPoints.length > 0 && (
                            <div className="mt-4">
                              <h4 className="font-semibold text-indigo-600 flex items-center gap-2 mb-2">
                                <CheckCircle className="h-4 w-4" /> Önemli Noktalar
                              </h4>
                              <ul className="space-y-1">
                                {subtopic.keyPoints.map((point, pIndex) => (
                                  <li key={pIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <span className="text-indigo-500 mt-1">•</span>
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Warnings */}
                          {subtopic.warnings && subtopic.warnings.length > 0 && (
                            <div className="mt-4">
                              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <h4 className="font-semibold text-red-700 flex items-center gap-2 mb-2">
                                  <AlertTriangle className="h-4 w-4" /> Uyarılar
                                </h4>
                                <ul className="space-y-1">
                                  {subtopic.warnings.map((warning, wIndex) => (
                                    <li key={wIndex} className="flex items-start gap-2 text-sm text-red-700">
                                      <span className="text-red-500 mt-1">⚠</span>
                                      {warning}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {/* Practical Tips */}
                          {subtopic.practicalTips && subtopic.practicalTips.length > 0 && (
                            <div className="mt-4">
                              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                <h4 className="font-semibold text-amber-700 flex items-center gap-2 mb-2">
                                  <Info className="h-4 w-4" /> Pratik İpuçları
                                </h4>
                                <ul className="space-y-1">
                                  {subtopic.practicalTips.map((tip, tIndex) => (
                                    <li key={tIndex} className="flex items-start gap-2 text-sm text-amber-700">
                                      <span className="text-amber-500 mt-1">💡</span>
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </MobileLayout>
  );
}
