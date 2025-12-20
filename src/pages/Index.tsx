import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import SplashCompassDial from "@/components/ui/SplashCompassDial";
import { createCompassListener, requestCompassPermission } from "@/utils/heading";
import { ChevronLeft, ChevronRight, Newspaper, RefreshCw, Settings } from "lucide-react";
import { fetchMaritimeNews } from "@/services/maritimeNews";

const Index = () => {
  const navigate = useNavigate();
  
  // Compass state
  const [headingDeg, setHeadingDeg] = useState<number | null>(null);

  // Swipe state
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchLastX = useRef<number | null>(null);
  const touchLastY = useRef<number | null>(null);
  const didSwipeRef = useRef(false);

  // --- Compass logic using unified listener ---
  useEffect(() => {
    let cleanup: (() => void) | null = null;

    const initCompass = async () => {
      const granted = await requestCompassPermission();
      if (!granted) {
        console.warn('Compass permission not granted');
      }
      
      cleanup = createCompassListener((heading) => {
        setHeadingDeg(Math.round(heading));
      }, 0.3);
    };

    initCompass();

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    didSwipeRef.current = false;
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
    touchLastX.current = null;
    touchLastY.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchLastX.current = e.targetTouches[0].clientX;
    touchLastY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const endTouch = e.changedTouches[0];
    const endX = touchLastX.current ?? endTouch.clientX;
    const endY = touchLastY.current ?? endTouch.clientY;
    
    const dx = endX - touchStartX.current;
    const dy = endY - touchStartY.current;

    if (Math.abs(dx) < 80 || Math.abs(dx) < Math.abs(dy)) {
      touchStartX.current = null;
      touchStartY.current = null;
      touchLastX.current = null;
      touchLastY.current = null;
      return;
    }

    const isLeftSwipe = dx < 0;
    const isRightSwipe = dx > 0;
    
    if (isLeftSwipe) {
      didSwipeRef.current = true;
      navigate('/widgets');
    }
    if (isRightSwipe) {
      didSwipeRef.current = true;
      navigate('/maritime-news');
    }
    
    touchStartX.current = null;
    touchStartY.current = null;
    touchLastX.current = null;
    touchLastY.current = null;
  };

  const handleTouchCancel = () => {
    touchStartX.current = null;
    touchStartY.current = null;
    touchLastX.current = null;
    touchLastY.current = null;
    didSwipeRef.current = false;
  };

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (didSwipeRef.current) {
      didSwipeRef.current = false;
      return;
    }

    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('[role="button"]')
    ) {
      return;
    }

    const clickX = e.clientX;
    const clickY = e.clientY;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    if (clickY > screenHeight * 0.70) return;
    
    if (clickX < screenWidth * 0.35) {
      navigate('/maritime-news');
      return;
    }
    if (clickX > screenWidth * 0.65) {
      navigate('/widgets');
    }
  };

  const headlinesQuery = useQuery({
    queryKey: ["maritime-news", "headlines"],
    queryFn: () => fetchMaritimeNews({ totalLimit: 12, perSourceLimit: 6 }),
    staleTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const headlineItems = useMemo(() => {
    const items = headlinesQuery.data?.items ?? [];
    const seen = new Set<string>();
    return items.filter((item) => {
      const key = `${item.source}-${item.title}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return Boolean(item.title);
    });
  }, [headlinesQuery.data?.items]);

  const formatDateTR = (iso?: string): string => {
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
  };


  return (
    <div
      className="relative min-h-[100svh] overflow-hidden touch-auto cursor-pointer"
      style={{
        background: `
          radial-gradient(circle at 20% 18%, hsl(var(--primary) / 0.18), transparent 32%),
          radial-gradient(circle at 80% 12%, hsl(var(--accent) / 0.12), transparent 28%),
          linear-gradient(180deg, hsl(var(--secondary) / 0.2) 0%, hsl(var(--background)) 50%, hsl(var(--background)) 100%)
        `
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onClick={handleClick}
    >
      {/* Subtle texture overlay */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}
      />

      {/* Settings button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate('/settings');
        }}
        className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
        aria-label="Ayarlar"
      >
        <Settings className="w-6 h-6 text-white/70" />
      </button>

      {/* Left arrow indicator */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none opacity-30">
        <ChevronLeft className="w-6 h-6 text-white drop-shadow-lg animate-pulse" />
      </div>

      {/* Right arrow indicator */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none opacity-30">
        <ChevronRight className="w-6 h-6 text-white drop-shadow-lg animate-pulse" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center px-6 text-center">
        {/* Title */}
        <div className="pt-12 sm:pt-16">
          <h1 className="select-none font-black tracking-wider text-[#a8c4d4]">
            <span className="block text-[clamp(2.8rem,10vw,5rem)] leading-tight">MARINE</span>
            <span className="block text-[clamp(2.8rem,10vw,5rem)] leading-tight">EXPERT</span>
          </h1>
        </div>

        {/* Compass */}
        <div className="mt-8 flex-1 flex items-center justify-center">
          <div className="relative h-[clamp(12rem,40vw,16rem)] w-[clamp(12rem,40vw,16rem)]">
            <div className="relative h-full w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
              <SplashCompassDial
                headingDeg={headingDeg ?? 0}
                className="h-full w-full select-none pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Maritime news headlines */}
        <div className="mt-10 w-full max-w-4xl text-left">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">
                <Newspaper className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-white/70">Güncel denizcilik haberleri</p>
                <h2 className="text-xl font-semibold text-white">Başlıklar</h2>
                {headlinesQuery.data?.fetchedAt ? (
                  <p className="text-xs text-white/50">Son güncelleme: {formatDateTR(headlinesQuery.data.fetchedAt)}</p>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
                size="sm"
                onClick={() => headlinesQuery.refetch()}
                disabled={headlinesQuery.isFetching}
              >
                <RefreshCw className={"mr-2 h-4 w-4 " + (headlinesQuery.isFetching ? "animate-spin" : "")} />
                Yenile
              </Button>
              <Button
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/15"
                size="sm"
                onClick={() => navigate('/maritime-news')}
              >
                Tüm Haberler
              </Button>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md">
            {headlinesQuery.isLoading ? (
              <div className="grid gap-3 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-white/10" />
                ))}
              </div>
            ) : headlinesQuery.isError ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
                Haber başlıkları yüklenemedi. Biraz sonra tekrar deneyin.
              </div>
            ) : headlineItems.length === 0 ? (
              <div className="text-sm text-white/70">Gösterilecek haber başlığı bulunamadı.</div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {headlineItems.slice(0, 12).map((item, idx) => (
                  <a
                    key={`${item.link}-${idx}`}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex h-full items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition-all hover:border-white/30 hover:bg-white/10"
                  >
                    <div className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-cyan-300" aria-hidden />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold leading-snug text-white group-hover:text-cyan-200">
                        {item.title}
                      </p>
                      <p className="text-xs text-white/60">
                        {item.source}
                        {item.publishedAt ? ` • ${formatDateTR(item.publishedAt)}` : ""}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <div className="w-full pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-6">
          <Link to="/calculations" className="inline-block w-full max-w-[22rem]" aria-label="Keşfetmeye Başla">
            <Button
              className="w-full rounded-full py-6 text-[clamp(1.3rem,4vw,1.6rem)] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(180deg, #35e0e0 0%, #20c5c5 50%, #18b0b0 100%)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              Keşfetmeye Başla
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
