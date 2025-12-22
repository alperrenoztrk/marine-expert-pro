import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Capacitor } from "@capacitor/core";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchMaritimeNews, type MaritimeNewsItem } from "@/services/maritimeNews";
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

function toProxyImageUrl(url?: string): string | undefined {
  if (!url) return undefined;

  try {
    const parsed = new URL(url);
    if (!parsed.protocol.startsWith("http")) return undefined;

    const sanitized = `${parsed.hostname}${parsed.pathname}${parsed.search}${parsed.hash}`.replace(/^[\/]+/, "");
    if (!sanitized) return undefined;

    // Request higher-resolution, consistently sized thumbnails via the image proxy.
    // Larger dimensions reduce pixelation from low-quality upstream images while keeping aspect coverage.
    return `https://images.weserv.nl/?url=${encodeURIComponent(sanitized)}&w=1600&h=900&fit=cover`;
  } catch {
    return undefined;
  }
}

const MaritimeNews = () => {
  const navigate = useNavigate();
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const [readerOpen, setReaderOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MaritimeNewsItem | null>(null);

  const openExternal = async (url: string) => {
    try {
      if (Capacitor.isNativePlatform()) {
        const { Browser } = await import("@capacitor/browser");
        await Browser.open({ url });
      } else {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch {
      window.location.href = url;
    }
  };

  const query = useQuery({
    queryKey: ["maritime-news"],
    queryFn: () => fetchMaritimeNews({ perSourceLimit: 10 }),
    // Avoid "empty list cached all day" when upstream feeds temporarily fail.
    staleTime: 10 * 60 * 1000,
    refetchInterval: (q) => (q.state.data?.items?.length ? false : 60 * 1000),
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const items = query.data?.items ?? [];
  const sourceErrors = query.data?.errors ?? [];
  const fetchedAt = query.data?.fetchedAt;
  const sources = query.data?.sources ?? [];
  const perSourceLimit = 10;

  const errorBySource = useMemo(() => {
    const map = new Map<string, string>();
    sourceErrors.forEach((e) => map.set(e.source, e.error));
    return map;
  }, [sourceErrors]);

  const groupedItems = useMemo(() => {
    const bySource = new Map<string, typeof items>();
    items.forEach((it) => {
      const list = bySource.get(it.source) ?? [];
      if (list.length < perSourceLimit) {
        list.push(it);
        bySource.set(it.source, list);
      }
    });

    const definedSources = sources.map((src) => ({
      id: src.id,
      name: src.name,
      url: src.url,
      items: (bySource.get(src.name) ?? []).slice(0, perSourceLimit),
    }));

    const unknownSources = Array.from(bySource.entries())
      .filter(([source]) => !sources.find((s) => s.name === source))
      .map(([source, list]) => ({ id: source, name: source, url: "", items: list.slice(0, perSourceLimit) }));

    return [...definedSources, ...unknownSources].filter((group) => group.items.length > 0 || errorBySource.has(group.name));
  }, [items, sources, perSourceLimit, errorBySource]);

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
      <Helmet>
        <title>Denizcilik Haberleri | Güncel RSS</title>
        <meta
          name="description"
          content="Denizcilik haberleri: gCaptain, MarineLink ve diğer kaynaklardan güncel RSS başlıklarını uygulama içinde okuyun."
        />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

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
            <Button
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white/10"
              onClick={() => navigate("/")}
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
        ) : groupedItems.length === 0 ? (
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
          <div className="space-y-4">
            {groupedItems.map((group) => (
              <Card key={group.id} className="border-white/10 bg-white/5 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-white">{group.name}</h2>
                    <p className="text-sm text-white/70">
                      Her kaynaktan {perSourceLimit} güncel haber. Görseller otomatik olarak çekilir.
                    </p>
                    {errorBySource.has(group.name) ? (
                      <p className="text-xs text-amber-200/80">
                        Bu kaynak için uyarı: {errorBySource.get(group.name)}
                      </p>
                    ) : null}
                  </div>
                  {group.url ? (
                    <Button
                      asChild
                      variant="outline"
                      className="border-white/20 bg-transparent text-white hover:bg-white/10"
                    >
                      <a href={group.url} target="_blank" rel="noreferrer">
                        Kaynağa Git
                      </a>
                    </Button>
                  ) : null}
                </div>

                <Separator className="my-3 bg-white/10" />

                {group.items.length === 0 ? (
                  <div className="rounded-md border border-white/10 bg-white/5 p-3 text-sm text-white/80">
                    Bu kaynaktan haber alınamadı.
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((it) => {
                      const imageUrl = toProxyImageUrl(it.imageUrl);

                      return (
                        <button
                          key={it.link}
                          type="button"
                          onClick={() => {
                            setSelectedItem(it);
                            setReaderOpen(true);
                          }}
                          className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left transition-all hover:border-white/20 hover:bg-white/10"
                        >
                          {/* Görsel */}
                          <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                            {imageUrl ? (
                              <>
                                <img
                                  src={imageUrl}
                                  alt={it.title}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  loading="lazy"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = "none";
                                    if (target.nextElementSibling) {
                                      target.nextElementSibling.classList.remove("hidden");
                                    }
                                  }}
                                />
                                <div className="hidden absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                                  <span className="text-xs text-white/40">Görsel yüklenemedi</span>
                                </div>
                              </>
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                                <span className="text-xs text-white/40">Görsel yok</span>
                              </div>
                            )}
                            {/* Kaynak etiketi */}
                            <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                              {it.source}
                            </div>
                          </div>

                          {/* İçerik */}
                          <div className="flex flex-1 flex-col p-4">
                            {it.publishedAt && (
                              <span className="mb-2 text-xs text-white/50">{formatDateTR(it.publishedAt)}</span>
                            )}
                            <h3 className="line-clamp-3 text-sm font-semibold leading-snug text-white group-hover:text-blue-300">
                              {it.title}
                            </h3>
                            {it.summary && (
                              <p className="mt-2 line-clamp-2 text-xs text-white/60">{it.summary}</p>
                            )}
                            <div className="mt-auto flex items-center gap-1 pt-3 text-xs text-blue-400">
                              <span>Uygulamada oku</span>
                              <ChevronRight className="h-3 w-3" />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={readerOpen}
        onOpenChange={(open) => {
          setReaderOpen(open);
          if (!open) setSelectedItem(null);
        }}
      >
        <DialogContent className="max-w-4xl border-white/10 bg-slate-950 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{selectedItem?.title ?? "Haber"}</DialogTitle>
            <DialogDescription className="text-white/70">
              {selectedItem?.source ? `${selectedItem.source} • ` : ""}
              {selectedItem?.publishedAt ? formatDateTR(selectedItem.publishedAt) : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 overflow-hidden rounded-md border border-white/10 bg-black/30">
            {selectedItem?.link ? (
              <iframe
                title={selectedItem.title}
                src={selectedItem.link}
                className="h-[70svh] w-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="p-6 text-sm text-white/70">Haber bağlantısı bulunamadı.</div>
            )}
          </div>

          <div className="text-xs text-white/50">
            Not: Bazı siteler güvenlik nedeniyle uygulama içinde görüntülenmeyi engelleyebilir. Bu durumda “Dışarıda aç”ı kullanın.
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white/10"
              onClick={() => setReaderOpen(false)}
            >
              Kapat
            </Button>
            <Button
              variant="secondary"
              className="bg-white/10 hover:bg-white/15"
              onClick={() => {
                if (selectedItem?.link) openExternal(selectedItem.link);
              }}
              disabled={!selectedItem?.link}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Dışarıda aç
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaritimeNews;
