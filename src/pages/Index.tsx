import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SplashCompassDial from "@/components/ui/SplashCompassDial";
import { createCompassListener, requestCompassPermission } from "@/utils/heading";
import { Anchor, ChevronLeft, ChevronRight, Settings, Sparkles, Waves } from "lucide-react";

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


  return (
    <div
      className="relative min-h-[100svh] overflow-hidden touch-auto cursor-pointer"
      style={{
        background:
          'radial-gradient(circle at 20% 20%, rgba(97, 180, 211, 0.18), transparent 40%), radial-gradient(circle at 80% 10%, rgba(255, 255, 255, 0.12), transparent 38%), linear-gradient(180deg, #1f3342 0%, #182b39 40%, #132130 100%)'
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

      {/* Glow accents */}
      <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-cyan-400/10 blur-[72px]" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-72 w-72 rounded-full bg-sky-300/10 blur-[88px]" />

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
        <div className="pt-12 sm:pt-16 space-y-4">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-cyan-100/90 shadow-inner shadow-black/20 backdrop-blur">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            Akıllı Denizcilik Asistanı
          </div>
          <h1 className="select-none font-black tracking-wider text-[#c3d9e5] drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <span className="block text-[clamp(2.9rem,10vw,5rem)] leading-tight">MARINE</span>
            <span className="block text-[clamp(2.9rem,10vw,5rem)] leading-tight">EXPERT</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-200/70 max-w-xl mx-auto leading-relaxed">
            Navigasyon hesaplamalarından emniyet kontrollerine kadar günlük denizcilik işlerinizi hızlandıran, modern ve güvenilir araçlar.
          </p>
        </div>

        {/* Compass */}
        <div className="mt-8 flex-1 flex items-center justify-center w-full">
          <div className="relative w-full max-w-[22rem]">
            <div className="absolute inset-x-6 -inset-y-6 rounded-[28px] bg-gradient-to-b from-white/12 via-white/4 to-white/0 blur-3xl opacity-80" />
            <div className="relative rounded-[32px] border border-white/10 bg-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-lg px-6 py-8">
              <div className="absolute inset-x-10 -top-10 h-24 rounded-full bg-cyan-300/25 blur-3xl" />
              <div className="relative mx-auto h-[clamp(12rem,38vw,16rem)] w-[clamp(12rem,38vw,16rem)]">
                <div className="absolute inset-4 rounded-full bg-gradient-to-b from-cyan-500/20 via-transparent to-transparent blur-3xl" />
                <div className="relative h-full w-full drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]">
                  <SplashCompassDial
                    headingDeg={headingDeg ?? 0}
                    className="h-full w-full select-none pointer-events-none"
                  />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 text-left text-sm text-slate-100/80">
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 shadow-inner shadow-black/20">
                  <Anchor className="h-4 w-4 text-cyan-200" />
                  <span>Limandan seyire güvenli geçiş</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 shadow-inner shadow-black/20">
                  <Waves className="h-4 w-4 text-cyan-200" />
                  <span>Anlık deniz durumu analizi</span>
                </div>
              </div>
            </div>
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
          <p className="mt-4 text-xs text-slate-200/70">
            Hızlı erişim için sağa/sola kaydırabilir ya da ekranın kenarlarına dokunabilirsiniz.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="mb-10 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {["Hızlı hesaplama", "Güncel regülasyonlar", "Gemi tipi seçenekleri"].map((item, idx) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100/80 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm"
              style={{
                animationDelay: `${idx * 80}ms`
              }}
            >
              <div className="text-sm font-semibold tracking-wide">{item}</div>
              <div className="text-xs text-slate-200/70 mt-1">Başlangıç ekranından tek dokunuşla erişin.</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
