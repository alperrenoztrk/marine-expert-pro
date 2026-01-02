import { useState, useCallback, useMemo, memo, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Anchor, ChevronRight, Calculator } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { navigationTopicsContent, type NavigationTopicSection, type NavigationTopicPage } from "@/data/navigationTopicsContent";

// Memoized page card component to prevent unnecessary re-renders
const PageCard = memo(({ page, topicId }: { page: NavigationTopicPage; topicId: string }) => (
  <div className="flex h-full flex-col gap-3 rounded-xl border border-border/40 bg-card/70 p-4 shadow-sm">
    <div>
      <p className="text-sm font-semibold text-foreground">{page.title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{page.summary}</p>
    </div>
    <ul className="space-y-2 text-xs text-muted-foreground">
      {page.bullets.map((bullet, idx) => (
        <li key={idx} className="flex items-start gap-2">
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
    {page.detailBlocks && page.detailBlocks.length > 0 && (
      <div className="grid gap-2 text-[11px] text-muted-foreground">
        {page.detailBlocks.map((block, idx) => (
          <div key={idx} className="rounded-lg border border-border/40 bg-background/70 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {block.title}
            </p>
            <ul className="mt-2 space-y-1">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )}
    <div className="mt-auto rounded-lg border border-dashed border-border/70 bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
      JPG Görsel: <span className="font-medium text-foreground">{page.imageSrc}</span>
      <span className="block text-[10px] text-muted-foreground/80">{page.imageAlt}</span>
    </div>
    {page.motionCue && (
      <div className="rounded-lg border border-border/40 bg-background/70 px-3 py-2 text-[11px] text-muted-foreground">
        <span className="font-semibold text-foreground">Animasyon Notu:</span> {page.motionCue}
      </div>
    )}
    {(page.references || page.updatedAt) && (
      <div className="rounded-lg border border-border/40 bg-background/70 px-3 py-2 text-[11px] text-muted-foreground">
        {page.references && (
          <div className="space-y-1">
            <span className="font-semibold text-foreground">Kaynaklar:</span>
            <ul className="mt-1 space-y-1">
              {page.references.slice(0, 2).map((reference, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{reference}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {page.updatedAt && (
          <div className="mt-2 text-[10px] text-muted-foreground/80">
            Güncelleme: <span className="font-medium text-foreground">{page.updatedAt}</span>
          </div>
        )}
      </div>
    )}
  </div>
));
PageCard.displayName = "PageCard";

// Memoized topic content component - only renders when accordion is open
const TopicContent = memo(({ topic }: { topic: NavigationTopicSection }) => (
  <>
    <div className="grid gap-4 pt-3 md:grid-cols-2">
      {topic.pages.map((page, idx) => (
        <PageCard key={idx} page={page} topicId={topic.id} />
      ))}
    </div>
    <div className="mt-4 rounded-xl border border-border/40 bg-background/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Görsel Planı (JPG)
      </p>
      <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
        {topic.pages.map((page, idx) => (
          <li key={idx} className="flex flex-col gap-1">
            <span className="font-medium text-foreground">{page.imageAlt}</span>
            <span className="text-[11px] text-muted-foreground/80">{page.imageSrc}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="mt-4 grid gap-4 rounded-xl border border-border/40 bg-background/60 p-4 lg:grid-cols-3">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Hızlı Kontrol Listesi
        </p>
        <ul className="space-y-2 text-xs text-muted-foreground">
          {topic.pages.slice(0, 3).map((page, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <span>{page.title}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Mini Senaryo
        </p>
        <p className="text-xs text-muted-foreground">
          {topic.title} başlığında, köprüüstü ekibi için kritik adımlar nelerdir? İlk sayfadaki özet:
        </p>
        <p className="text-xs font-medium text-foreground">{topic.pages[0]?.summary}</p>
      </div>
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Mini Quiz
        </p>
        <ul className="space-y-2 text-xs text-muted-foreground">
          <li>Bu başlıkta "en kritik 3 kontrol" hangileridir?</li>
          <li>Bugünkü seyirde bu başlıktan hangi riski önceliklendirirsin?</li>
        </ul>
      </div>
    </div>
    {topic.accuracyChecklist && topic.accuracyChecklist.length > 0 && (
      <div className="mt-4 rounded-xl border border-border/40 bg-background/60 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Doğruluk Kontrol Listesi
        </p>
        <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
          {topic.accuracyChecklist.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
    {topic.pdfResource && (
      <div className="mt-4 rounded-xl border border-border/40 bg-background/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              PDF Kaynak
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">{topic.pdfResource.title}</p>
            {topic.pdfResource.description && (
              <p className="mt-1 text-xs text-muted-foreground">{topic.pdfResource.description}</p>
            )}
          </div>
          <a
            href={topic.pdfResource.href}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-primary transition hover:text-primary/80"
          >
            PDF’yi yeni sekmede aç
          </a>
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-border/40 bg-background">
          <iframe
            title={topic.pdfResource.title}
            src={topic.pdfResource.href}
            className="h-[70vh] w-full"
          />
        </div>
      </div>
    )}
    {topic.calculationLinks && topic.calculationLinks.length > 0 && (
      <div className="mt-4 rounded-xl border border-border/40 bg-background/60 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <Calculator className="h-4 w-4 text-primary" />
            Hesaplama Bağlantıları
          </div>
          {topic.calculationLinks[0] && (
            <Link
              to={topic.calculationLinks[0].href}
              className="text-[11px] font-semibold text-primary transition hover:text-primary/80"
            >
              Bu konuyla ilgili hesaplama
            </Link>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {topic.calculationLinks.map((link, idx) => (
            <Link
              key={idx}
              to={link.href}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-xs font-medium text-foreground transition hover:border-primary/50 hover:bg-card"
            >
              {link.title}
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    )}
  </>
));
TopicContent.displayName = "TopicContent";

// Memoized accordion item
const TopicAccordionItem = memo(({ 
  topic, 
  isOpen, 
  onToggle 
}: { 
  topic: NavigationTopicSection; 
  isOpen: boolean;
  onToggle: (id: string) => void;
}) => (
  <AccordionItem 
    value={topic.id} 
    className="rounded-xl border border-border/40 bg-background/60 px-4"
  >
    <AccordionTrigger 
      className="text-left text-sm font-semibold text-foreground"
      onClick={() => onToggle(topic.id)}
    >
      {topic.title}
    </AccordionTrigger>
    <AccordionContent>
      {isOpen && <TopicContent topic={topic} />}
    </AccordionContent>
  </AccordionItem>
));
TopicAccordionItem.displayName = "TopicAccordionItem";

export default function NavigationTopicsPage() {
  const [openTopic, setOpenTopic] = useState<string>("");
  
  const handleToggle = useCallback((id: string) => {
    setOpenTopic(prev => prev === id ? "" : id);
  }, []);

  // Only show first 10 topics initially for faster initial render
  const visibleTopics = useMemo(() => 
    navigationTopicsContent.slice(0, 15), 
    []
  );

  const highRefreshRateStyles: CSSProperties = {
    ["--frame-rate" as string]: "120",
    ["--animation-duration" as string]: "8.33ms",
    ["--transition-duration" as string]: "16.67ms",
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 px-4 py-8 dark:from-[hsl(220,50%,6%)] dark:via-[hsl(220,50%,8%)] dark:to-[hsl(220,50%,10%)]"
      data-no-translate
      style={highRefreshRateStyles}
    >
      {/* Simplified background - removed blur for mobile performance */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute -top-24 left-1/4 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-8 right-6 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-6">
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground backdrop-blur-sm">
            <GraduationCap className="h-4 w-4" />
            Konu Anlatımı
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-lg">
              <Anchor className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Seyir Konu Anlatımı</h1>
          </div>
          <p className="mx-auto max-w-3xl text-sm text-muted-foreground">
            Her başlık en az 4 sayfa olacak şekilde yapılandırıldı. Her sayfada JPG formatında görsel kullanımı planlandı.
          </p>
        </header>

        <section className="rounded-2xl border border-border/40 bg-card/80 p-6">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Seyir Konu Başlıkları</h2>
          </div>

          <Accordion 
            type="single" 
            collapsible 
            className="space-y-3"
            value={openTopic}
            onValueChange={setOpenTopic}
          >
            {visibleTopics.map((topic) => (
              <TopicAccordionItem 
                key={topic.id} 
                topic={topic} 
                isOpen={openTopic === topic.id}
                onToggle={handleToggle}
              />
            ))}
          </Accordion>
          
          {navigationTopicsContent.length > 15 && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Toplam {navigationTopicsContent.length} konu başlığı mevcuttur.
            </p>
          )}
        </section>

        <div className="flex justify-center pt-2">
          <Link
            to="/lessons"
            className="inline-flex items-center gap-2 rounded-full bg-card/60 px-4 py-2 text-xs text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
            Tüm Derslere Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
