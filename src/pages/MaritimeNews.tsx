import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
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
    // Avoid "empty list cached all day" when upstream feeds temporarily fail.
    staleTime: 10 * 60 * 1000,
    refetchInterval: (q) => (q.state.data?.items?.length ? false : 60 * 1000),
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const items = query.data?.items ?? [];
  const sourceErrors = query.data?.errors ?? [];
  const fetchedAt = query.data?.fetchedAt;

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
            {fetchedAt ? (
              <p className="mt-1 text-xs text-white/50">Son güncelleme: {formatDateTR(fetchedAt)}</p>
            ) : null}
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
                <div className="flex gap-4">
                  <Skeleton className="h-24 w-32 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : query.isError ? (
          <Card className="border-red-500/30 bg-red-500/10 p-4">
            <div className="text-sm text-red-200">Haberler alınamadı. Biraz sonra tekrar deneyin.</div>
            <div className="mt-2 text-xs text-red-200/80 break-words">
              {query.error instanceof Error ? query.error.message : "Bilinmeyen hata"}
            </div>
          </Card>
        ) : items.length === 0 ? (
          <Card className="border-white/10 bg-white/5 p-4">
            <div className="text-sm text-white/80">
              Şu anda listelenecek haber bulunamadı.
              {sourceErrors.length ? (
                <div className="mt-3 text-xs text-white/60">
                  Bazı kaynaklara erişilemedi. Yenile’ye basarak tekrar deneyin.
                </div>
              ) : null}
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <Card key={it.link} className="border-white/10 bg-white/5 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <div className="w-full sm:w-32">
                    {it.imageUrl ? (
                      <div className="relative h-24 overflow-hidden rounded-md border border-white/10 bg-black/30 shadow-inner">
                        <img
                          src={it.imageUrl}
                          alt={it.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="flex h-24 items-center justify-center rounded-md border border-white/10 bg-white/5 text-xs text-white/50">
                        Görsel yok
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    {it.publishedAt ? (
                      <div className="text-xs text-white/60">{formatDateTR(it.publishedAt)}</div>
                    ) : null}
                    <a
                      href={it.link}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-base font-semibold text-white hover:underline"
                    >
                      {it.title}
                    </a>
                    {it.summary ? <p className="text-sm text-white/75">{it.summary}</p> : null}
                  </div>

                  <Button
                    asChild
                    size="icon"
                    variant="outline"
                    className="mt-1 shrink-0 border-white/15 bg-transparent text-white hover:bg-white/10 sm:mt-0"
                  >
                    <a href={it.link} target="_blank" rel="noreferrer" aria-label="Haberi aç">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaritimeNews;
