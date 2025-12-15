import React, { useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMaritimeNews } from "@/services/maritimeNews";
import { ChevronRight, ExternalLink, RefreshCw } from "lucide-react";

function formatDateTR(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("tr-TR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

const MaritimeNews = () => {
  const navigate = useNavigate();
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const query = useQuery({
    queryKey: ["maritime-news"],
    queryFn: () => fetchMaritimeNews(40),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  const items = query.data?.items ?? [];

  const grouped = useMemo(() => {
    // lightweight grouping by source for badge color variety
    const map = new Map<string, number>();
    for (const it of items) map.set(it.source, (map.get(it.source) ?? 0) + 1);
    return map;
  }, [items]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchEndX.current - touchStartX.current;
    const isLeftSwipe = distance < -100;
    if (isLeftSwipe) {
      navigate("/");
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="min-h-[100svh] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-foreground px-4 py-6 touch-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Right arrow indicator - back to home */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none opacity-30">
        <div className="flex flex-col items-center gap-2 animate-pulse">
          <ChevronRight className="w-6 h-6 text-white drop-shadow-lg" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-white">Denizcilik Haberleri</h1>
            <p className="mt-1 text-sm text-white/70">
              Güncel denizcilik haberleri (RSS). Sola kaydırarak ana sayfaya dönebilirsiniz.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="secondary"
              className="bg-white/10 hover:bg-white/15"
              onClick={() => query.refetch()}
              disabled={query.isFetching}
            >
              <RefreshCw className={"mr-2 h-4 w-4 " + (query.isFetching ? "animate-spin" : "")} />
              Yenile
            </Button>
            <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={() => navigate("/")}
            >
              Ana Sayfa
            </Button>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {query.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border-white/10 bg-white/5 p-4">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="mt-3 h-4 w-1/3" />
                <Skeleton className="mt-3 h-4 w-full" />
              </Card>
            ))}
          </div>
        ) : query.isError ? (
          <Card className="border-red-500/30 bg-red-500/10 p-4">
            <div className="text-sm text-red-200">
              Haberler alınamadı. Biraz sonra tekrar deneyin.
            </div>
          </Card>
        ) : items.length === 0 ? (
          <Card className="border-white/10 bg-white/5 p-4">
            <div className="text-sm text-white/80">Şu anda listelenecek haber bulunamadı.</div>
          </Card>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <Card key={it.link} className="border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="bg-white/10 text-white">
                        {it.source}
                      </Badge>
                      {it.publishedAt ? (
                        <span className="text-xs text-white/60">{formatDateTR(it.publishedAt)}</span>
                      ) : null}
                    </div>
                    <a
                      href={it.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 block text-base font-semibold text-white hover:underline"
                    >
                      {it.title}
                    </a>
                    {it.summary ? <p className="mt-2 text-sm text-white/75">{it.summary}</p> : null}
                  </div>
                  <Button
                    asChild
                    size="icon"
                    variant="outline"
                    className="shrink-0 border-white/15 bg-transparent text-white hover:bg-white/10"
                  >
                    <a href={it.link} target="_blank" rel="noreferrer" aria-label="Haberi aç">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </Card>
            ))}

            {grouped.size > 0 ? (
              <div className="pt-2 text-xs text-white/50">
                Kaynaklar: {Array.from(grouped.entries()).map(([k, v]) => `${k} (${v})`).join(" · ")}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaritimeNews;
