import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, FileText, ZoomIn, ZoomOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { dn2025ses1112 } from "@/data/dn2025ses1112";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PdfSourceId = "dn2025ses1112" | "colreg" | "uscg";

const pdfSources = [
  {
    id: "dn2025ses1112",
    title: dn2025ses1112.title,
    subtitle: "MEB ders materyali (PDF + İçindekiler)",
    pdfPath: dn2025ses1112.pdfPath,
    externalHref: dn2025ses1112.sourceUrl,
  },
  {
    id: "colreg",
    title: "COLREG Navigation Rules",
    subtitle: "Collision Regulations (PDF)",
    pdfPath: "/COLREG-Navigation-Rules.pdf",
  },
  {
    id: "uscg",
    title: "USCG Navigation Rules",
    subtitle: "US Coast Guard (PDF)",
    pdfPath: "/USCG-Navigation-Rules.pdf",
  },
] as const satisfies ReadonlyArray<{
  id: PdfSourceId;
  title: string;
  subtitle: string;
  pdfPath: string;
  externalHref?: string;
}>;

export default function NavigationRulesPage() {
  const [activeId, setActiveId] = useState<PdfSourceId>("dn2025ses1112");
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [tocQuery, setTocQuery] = useState<string>("");

  const active = useMemo(() => pdfSources.find((item) => item.id === activeId)!, [activeId]);

  const tocItems = useMemo(() => {
    if (activeId !== "dn2025ses1112") return [];
    const q = tocQuery.trim().toLowerCase();
    const list = dn2025ses1112.toc;
    if (!q) return list;
    return list.filter((item) => item.title.toLowerCase().includes(q));
  }, [activeId, tocQuery]);

  function onDocumentLoadSuccess({ numPages: total }: { numPages: number }) {
    setNumPages(total);
    setPageNumber((prev) => Math.min(Math.max(prev, 1), total));
  }

  function selectPdf(nextId: PdfSourceId) {
    setActiveId(nextId);
    setNumPages(0);
    setPageNumber(1);
    setScale(1.0);
    setTocQuery("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/navigation-menu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:translate-x-[-2px]"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri
          </Link>
          <div className="text-right">
            <h1 className="text-xl font-bold text-foreground">Seyir Kuralları &amp; Ders Materyalleri</h1>
            <p className="text-xs text-muted-foreground">PDF kaynakları + MEB içindekilerden sayfa atlama</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Kaynaklar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {pdfSources.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectPdf(item.id)}
                    className={cn(
                      "w-full rounded-xl border px-4 py-3 text-left transition",
                      item.id === activeId
                        ? "border-primary/40 bg-primary/10"
                        : "border-border/60 bg-card/50 hover:bg-card/80"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.subtitle}</p>
                      </div>
                      {item.externalHref && (
                        <a
                          href={item.externalHref}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Kaynak
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {activeId === "dn2025ses1112" && (
              <Card>
                <CardHeader>
                  <CardTitle>İçindekiler (parse)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    value={tocQuery}
                    onChange={(e) => setTocQuery(e.target.value)}
                    placeholder="Başlık ara…"
                  />
                  <div className="max-h-[45vh] overflow-auto space-y-1 pr-1">
                    {tocItems.map((item) => (
                      <button
                        key={`${item.page}-${item.title}`}
                        type="button"
                        className={cn(
                          "w-full rounded-lg px-3 py-2 text-left text-sm transition",
                          item.level === 1 ? "font-semibold" : "text-muted-foreground",
                          "hover:bg-muted/40"
                        )}
                        onClick={() => setPageNumber(item.page)}
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <span className={cn(item.level === 2 && "pl-3")}>{item.title}</span>
                          <span className="text-xs text-muted-foreground tabular-nums">{item.page}</span>
                        </div>
                      </button>
                    ))}
                    {tocItems.length === 0 && (
                      <p className="text-sm text-muted-foreground">Eşleşen başlık bulunamadı.</p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Not: Sayfa numaraları “İçindekiler” sayfasından alınmıştır; PDF sayfa numarasıyla küçük sapmalar olabilir.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border/60">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base">{active.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sayfa {pageNumber} / {numPages || "—"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                    disabled={pageNumber <= 1}
                    aria-label="Önceki sayfa"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPageNumber((prev) => Math.min(numPages || prev + 1, prev + 1))}
                    disabled={numPages > 0 ? pageNumber >= numPages : false}
                    aria-label="Sonraki sayfa"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setScale((prev) => Math.max(0.5, Number((prev - 0.2).toFixed(2))))}
                    aria-label="Yakınlaştırmayı azalt"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setScale((prev) => Math.min(2.0, Number((prev + 0.2).toFixed(2))))}
                    aria-label="Yakınlaştır"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-white dark:bg-slate-950 overflow-auto flex justify-center p-4" style={{ maxHeight: "calc(100vh - 220px)" }}>
                <Document
                  file={active.pdfPath}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={<div className="py-8 text-sm text-muted-foreground">PDF yükleniyor…</div>}
                  error={<div className="py-8 text-sm text-red-500">PDF yüklenirken hata oluştu.</div>}
                >
                  <Page pageNumber={pageNumber} scale={scale} renderTextLayer renderAnnotationLayer />
                </Document>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

