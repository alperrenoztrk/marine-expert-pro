import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import SplashCompassDial from "@/components/ui/SplashCompassDial";
import { createCompassListener, requestCompassPermission } from "@/utils/heading";
import { ChevronLeft, ChevronRight, Newspaper, RefreshCw, Settings } from "lucide-react";
import { fetchMaritimeNews } from "@/services/maritimeNews";
import { useTheme } from "@/hooks/useTheme";

const Index = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
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
        background: 'linear-gradient(180deg, hsl(214 84% 8%) 0%, hsl(214 84% 15%) 50%, hsl(200 80% 18%) 100%)'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onClick={handleClick}
    >
      {/* Background glow effect */}
      <div 
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(56,189,248,0.12) 0%, transparent 50%)'
        }}
      />

      {/* Lighthouse */}
      <div className="absolute right-[8%] bottom-[22%] w-[50px] h-[100px] z-[1] pointer-events-none">
        <svg viewBox="0 0 60 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
          <ellipse cx="30" cy="118" rx="28" ry="4" fill="rgba(30,40,50,0.8)"/>
          <path d="M20 115 L22 50 L38 50 L40 115 Z" fill="rgba(255,255,255,0.9)"/>
          <path d="M22.5 65 L37.5 65 L37.2 75 L22.8 75 Z" fill="rgba(239,68,68,0.9)"/>
          <path d="M23.3 85 L36.7 85 L36.4 95 L23.6 95 Z" fill="rgba(239,68,68,0.9)"/>
          <rect x="18" y="42" width="24" height="10" rx="1" fill="rgba(40,50,60,0.95)"/>
          <rect x="20" y="44" width="20" height="6" rx="0.5" fill="rgba(251,191,36,0.6)"/>
          <path d="M15 42 L30 30 L45 42 Z" fill="rgba(60,70,80,0.95)"/>
          <rect x="29" y="24" width="2" height="8" fill="rgba(80,90,100,0.9)"/>
          <rect x="26" y="100" width="8" height="15" rx="4" fill="rgba(60,50,40,0.9)"/>
        </svg>
        <div 
          className="absolute top-[28%] left-1/2 w-[200px] h-[4px] origin-left"
          style={{
            background: 'linear-gradient(90deg, rgba(251,191,36,0.8) 0%, rgba(251,191,36,0.4) 30%, transparent 100%)',
            filter: 'blur(1px)',
            animation: 'beacon-rotate 4s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute top-[26%] left-[45%] w-[20px] h-[20px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(251,191,36,0.9) 0%, rgba(251,191,36,0.4) 40%, transparent 70%)',
            animation: 'beacon-pulse 4s ease-in-out infinite'
          }}
        />
      </div>

      {/* Animated waves */}
      <div className="absolute bottom-0 left-0 right-0 h-[45%] overflow-hidden pointer-events-none">
        <div 
          className="absolute bottom-0 left-[-10%] w-[120%] h-full opacity-70"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%230ea5e9' fill-opacity='0.15' d='M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,186.7C672,192,768,160,864,165.3C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: '1440px 100%',
            animation: 'wave-move 8s linear infinite'
          }}
        />
        <div 
          className="absolute bottom-[10px] left-[-10%] w-[120%] h-full opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%2338bdf8' fill-opacity='0.12' d='M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,149.3C672,149,768,171,864,181.3C960,192,1056,192,1152,170.7C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: '1440px 100%',
            animation: 'wave-move 12s linear infinite reverse'
          }}
        />
        <div 
          className="absolute bottom-[20px] left-[-10%] w-[120%] h-full opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%237dd3fc' fill-opacity='0.1' d='M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,197.3C672,213,768,235,864,229.3C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: '1440px 100%',
            animation: 'wave-move 16s linear infinite'
          }}
        />
      </div>

      {/* Sailing ship */}
      <div 
        className="absolute bottom-[18%] w-[80px] h-[40px] z-[3] pointer-events-none"
        style={{
          filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.3))',
          animation: 'ship-sail 20s linear infinite, ship-bob 2.5s ease-in-out infinite'
        }}
      >
        <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M10 45 L25 55 L95 55 L110 45 L100 45 L95 40 L25 40 L20 45 Z" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
          <rect x="30" y="32" width="60" height="8" rx="1" fill="rgba(255,255,255,0.85)"/>
          <rect x="55" y="18" width="25" height="14" rx="1" fill="rgba(255,255,255,0.9)"/>
          <rect x="58" y="21" width="8" height="6" rx="0.5" fill="rgba(56,189,248,0.4)"/>
          <rect x="69" y="21" width="8" height="6" rx="0.5" fill="rgba(56,189,248,0.4)"/>
          <rect x="72" y="8" width="6" height="10" fill="rgba(255,255,255,0.9)"/>
          <rect x="71" y="6" width="8" height="3" rx="0.5" fill="rgba(255,255,255,0.8)"/>
          <rect x="44" y="5" width="2" height="27" fill="rgba(255,255,255,0.8)"/>
          <rect x="35" y="6" width="20" height="1" fill="rgba(255,255,255,0.6)"/>
          <path d="M85 32 L85 22 L92 28" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>

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
          <h1 
            className="select-none font-black tracking-wider"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #7dd3fc 50%, #ffffff 100%)',
              backgroundSize: '200% auto',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'title-shine 3s linear infinite',
              textShadow: '0 0 40px rgba(56,189,248,0.3)'
            }}
          >
            <span className="block text-[clamp(2.5rem,9vw,4.5rem)] leading-tight">MARINE</span>
            <span className="block text-[clamp(2.5rem,9vw,4.5rem)] leading-tight">EXPERT PRO</span>
          </h1>
          <p 
            className="mt-2 text-white/60 uppercase tracking-[3px] text-sm"
            style={{ animation: 'fade-in 0.6s ease-out 0.3s both' }}
          >
            Professional Maritime Solutions
          </p>
        </div>

        {/* Compass */}
        <div className="mt-8 flex-1 flex items-center justify-center">
          <div className="relative h-[clamp(12rem,40vw,16rem)] w-[clamp(12rem,40vw,16rem)]">
            <div 
              className="relative h-full w-full"
              style={{ 
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5)) drop-shadow(0 0 20px rgba(56,189,248,0.2))'
              }}
            >
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
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm text-white border border-white/10">
                <Newspaper className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-white/60">Güncel denizcilik haberleri</p>
                <h2 className="text-xl font-semibold text-white">Başlıklar</h2>
                {headlinesQuery.data?.fetchedAt ? (
                  <p className="text-xs text-white/40">Son güncelleme: {formatDateTR(headlinesQuery.data.fetchedAt)}</p>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="text-white/80 hover:bg-white/10 hover:text-white"
                size="sm"
                onClick={() => headlinesQuery.refetch()}
                disabled={headlinesQuery.isFetching}
              >
                <RefreshCw className={"mr-2 h-4 w-4 " + (headlinesQuery.isFetching ? "animate-spin" : "")} />
                Yenile
              </Button>
              <Button
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/15 backdrop-blur-sm"
                size="sm"
                onClick={() => navigate('/maritime-news')}
              >
                Tüm Haberler
              </Button>
            </div>
          </div>

          <div 
            className="mt-4 rounded-2xl border border-white/10 p-4 backdrop-blur-md"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >
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
                    className="group flex h-full items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition-all hover:border-cyan-400/30 hover:bg-white/10"
                  >
                    <div className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-cyan-400" aria-hidden />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold leading-snug text-white group-hover:text-cyan-300">
                        {item.title}
                      </p>
                      <p className="text-xs text-white/50">
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
              className="w-full rounded-full py-6 text-[clamp(1.3rem,4vw,1.6rem)] font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(180deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 24px rgba(14,165,233,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
              }}
            >
              Keşfetmeye Başla
            </Button>
          </Link>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes wave-move {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes ship-sail {
          0% { left: -100px; }
          100% { left: calc(100% + 100px); }
        }
        @keyframes ship-bob {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-6px) rotate(1deg); }
        }
        @keyframes beacon-rotate {
          0%, 100% { transform: rotate(-30deg); opacity: 0.9; }
          50% { transform: rotate(60deg); opacity: 0.6; }
        }
        @keyframes beacon-pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.3); opacity: 0.5; }
        }
        @keyframes title-shine {
          to { background-position: 200% center; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Index;
