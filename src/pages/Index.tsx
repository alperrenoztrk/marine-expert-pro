import { useState, useEffect, useRef } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Brain, Ship, Compass, Waves, Cog, Package, Droplets, Building, Shield, Leaf, Cloud, Settings, Calculator, BarChart3, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
// import { GoogleAuth } from "@/components/auth/GoogleAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";




import { useAdManager, loadAdSenseScript } from "@/hooks/useAdManager";
import { useTheme } from "@/hooks/useTheme";

import { AdBannerMobile, AdBannerInline } from "@/components/ads/AdBanner";
import { NativeAd, MaritimeEquipmentAd, MaritimeSoftwareAd } from "@/components/ads/NativeAd";
import { toast } from "sonner";
import React from "react"; // Added missing import for React


// Removed calculation components - they are now on individual pages

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const neonTextRef = useRef<HTMLHeadingElement>(null);
  const { theme } = useTheme();
  
  // Safe hooks with error handling
  const safeAdManager = (() => {
    try {
      return useAdManager();
    } catch (error) {
      console.warn('AdManager hook failed, using fallback:', error);
      return { 
        shouldShowAd: () => false, 
        trackInteraction: () => {} 
      };
    }
  })();
  
  const { shouldShowAd, trackInteraction } = safeAdManager;

  // Mouse tracking for neon text
  const handleMouseMove = (e: React.MouseEvent<HTMLHeadingElement>) => {
    if (theme === 'neon' && neonTextRef.current) {
      const rect = neonTextRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Ensure coordinates are within bounds
      const clampedX = Math.max(0, Math.min(x, rect.width));
      const clampedY = Math.max(0, Math.min(y, rect.height));
      
      setMousePosition({ x: clampedX, y: clampedY });
    }
  };

  const handleMouseEnter = () => {
    if (theme === 'neon') {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (theme === 'neon') {
      setIsHovering(false);
      setMousePosition({ x: 0, y: 0 });
    }
  };

  // Load AdSense script safely
  useEffect(() => {
    const loadAds = async () => {
      try {
        if (import.meta.env.VITE_ADS_ENABLED === 'true') {
          await loadAdSenseScript();
        }
      } catch (error) {
        console.warn('AdSense loading failed:', error);
      }
    };
    loadAds();
    
    // Set loading to false after component mounts
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Calculation cards removed - using individual pages now

  const handleCalculationComplete = async (calculationType: string, inputData: any, resultData: any) => {
    // Temporarily disabled - authentication not implemented
    console.log('Calculation completed:', calculationType, inputData, resultData);
    toast.success("Hesaplama tamamlandı!");
  };

  const handleToggleFavorite = async (calculationId: string) => {
    // Temporarily disabled - authentication not implemented
    console.log('Toggle favorite:', calculationId);
    toast.success("Favori durumu güncellendi!");
  };

  const [calcRingOpen, setCalcRingOpen] = useState(false);
  const [carouselRotation, setCarouselRotation] = useState(0);
	const rotatePrev = () => setCarouselRotation((deg)=> deg - (360 / calcItems.length));
	const rotateNext = () => setCarouselRotation((deg)=> deg + (360 / calcItems.length));
  const [autoSpin, setAutoSpin] = useState(true);
	const spinRef = useRef<number | null>(null);
	useEffect(() => {
		if (!calcRingOpen) return; // only when overlay open
		let last = performance.now();
		const step = (now: number) => {
			if (autoSpin) {
				const dt = Math.min(32, now - last);
				last = now;
				setCarouselRotation((deg)=> deg + (dt * 0.03)); // speed: degrees per ms
			}
			spinRef.current = requestAnimationFrame(step);
		};
		spinRef.current = requestAnimationFrame(step);
		return () => { if (spinRef.current) cancelAnimationFrame(spinRef.current); };
	}, [autoSpin, calcRingOpen]);
  const calcItems = [
    { path: "/stability", label: "Stabilite", Icon: Ship },
    { path: "/navigation-menu", label: "Seyir", Icon: Compass },
    { path: "/hydrodynamics-menu", label: "Hidrodinamik", Icon: Waves },
    { path: "/engine-menu", label: "Makine", Icon: Cog },
    { path: "/cargo", label: "Kargo", Icon: Package },
    { path: "/ballast-menu", label: "Balast", Icon: Droplets },
    { path: "/tank-menu", label: "Tank", Icon: Package },
    { path: "/structural-menu", label: "Yapısal", Icon: Building },
    { path: "/safety-menu", label: "Güvenlik", Icon: Shield },
    { path: "/emissions-menu", label: "Emisyon", Icon: Leaf },
    { path: "/weather-menu", label: "Meteoroloji", Icon: Cloud },
    { path: "/special-ships-menu", label: "Özel Gemiler", Icon: Ship },
  ];

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Maritime Calculator yükleniyor...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      {/* Header Section */}
      <div className="relative mb-6 sm:mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-teal-600/20 rounded-xl"></div>
        
        <div className="relative bg-card/90 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-border shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6">
            {/* Logo - Hidden for neon theme */}
            {theme !== 'neon' && (
              <div className="flex-shrink-0">
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src="/lovable-uploads/c6c6ba44-f631-4adf-8900-c7b1c64e1f49.png" 
                    alt="Maritime Calculator Logo" 
                    className="maritime-logo w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 drop-shadow-lg hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            )}
            
            {/* Title with Neon Billboard Effect */}
            <div className="text-center">
              {theme === 'neon' ? (
                <div className="neon-billboard relative">
                  {/* Billboard Background */}
                  <div className="billboard-background absolute inset-0 bg-black/80 rounded-lg border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(0,255,255,0.5)]"></div>
                  
                  {/* New Pulse Rings Effect */}
                  <div className="billboard-pulse-rings">
                    <div className="billboard-pulse-ring"></div>
                    <div className="billboard-pulse-ring"></div>
                    <div className="billboard-pulse-ring"></div>
                  </div>
                  
                  {/* New Matrix Scanning Effect */}
                  <div className="billboard-matrix-scan"></div>
                  
                  {/* New Holographic Shimmer Effect */}
                  <div className="billboard-holographic-shimmer"></div>
                  
                  {/* New Corner Glitch Effects */}
                  <div className="billboard-corner-glitch top-left"></div>
                  <div className="billboard-corner-glitch top-right"></div>
                  <div className="billboard-corner-glitch bottom-left"></div>
                  <div className="billboard-corner-glitch bottom-right"></div>
                  
                  {/* Neon Text Container */}
                  <div className="relative z-10 p-4">
                    <h1 
                      ref={neonTextRef}
                      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold neon-text neon-text-interactive"
                      data-translatable
                      onMouseMove={handleMouseMove}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        '--mouse-x': `${mousePosition.x}px`,
                        '--mouse-y': `${mousePosition.y}px`,
                        '--is-hovering': isHovering ? '1' : '0'
                      } as React.CSSProperties}
                    >
                      Maritime Calculator
                    </h1>
                    
                  </div>
                  
                  {/* Billboard Frame */}
                  <div className="billboard-frame absolute inset-0 border-4 border-cyan-400/30 rounded-lg"></div>
                  
                  {/* Neon Glow Effects */}
                  <div className="neon-glow-1 absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-purple-400/20 blur-sm"></div>
                  <div className="neon-glow-2 absolute inset-0 rounded-lg bg-gradient-to-b from-cyan-400/10 to-transparent"></div>
                </div>
              ) : (
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent drop-shadow-sm" data-translatable>
                  Maritime Calculator
                </h1>
                            )}
            </div>
          </div>



          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed" data-translatable>
                Uzakyol zabitlerinden denizcilik öğrencilerine – tüm denizciler için pratik hesaplama platformu
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {/* First Row - Asistan and Regülasyonlar */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <Link to="/formulas">
                    <Button size="sm" variant="outline" className="gap-2 border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-gray-700 cyberpunk:border-purple-400 cyberpunk:text-purple-400 cyberpunk:hover:bg-gray-800 nature:border-purple-400 nature:text-purple-600 nature:hover:bg-purple-50">
                      <Brain className="w-4 h-4" />
                      <span data-translatable>Soru Asistanı: Mark</span>
                    </Button>
                  </Link>
                                     <Link to="/regulations">
                     <Button size="sm" variant="outline" className="gap-2 border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-600 dark:text-emerald-400 dark:hover:bg-gray-700 cyberpunk:border-emerald-400 cyberpunk:text-emerald-400 cyberpunk:hover:bg-gray-800 nature:border-emerald-400 nature:text-emerald-600 nature:hover:bg-emerald-50">
                       <Shield className="w-4 h-4" />
                       <span data-translatable>Regülasyonlar</span>
                     </Button>
                   </Link>
                </div>
                
                {/* Second Row - Other buttons */}
                <div className="flex gap-2 flex-wrap">
					<DropdownMenu>
						{/* Calculations Fullscreen Overlay */}
						<div className="relative">
							<Button
								size="sm"
								variant="outline"
								aria-label="Hesaplamalar"
								onClick={() => setCalcRingOpen(true)}
								className="gap-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-600 dark:text-indigo-400 dark:hover:bg-gray-700 cyberpunk:border-indigo-400 cyberpunk:text-indigo-400 cyberpunk:hover:bg-gray-800 nature:border-indigo-400 nature:text-indigo-600 nature:hover:bg-indigo-50"
							>
								<Calculator className="w-4 h-4" />
								<span data-translatable>Hesaplamalar</span>
							</Button>
							{calcRingOpen && (
								<div className="fixed inset-0 z-[9999] pointer-events-auto">
																			<div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200" />
																			<div className="absolute inset-0 flex flex-col">
											<div className="flex items-center justify-between p-4 sm:p-6">
												<h3 className="font-semibold text-base sm:text-lg">Hesaplamalar</h3>
												<Button size="sm" variant="secondary" onClick={()=> setCalcRingOpen(false)}>Kapat</Button>
											</div>
											<div className="flex-1 flex items-stretch">
												<div className="relative w-full h-full px-4 sm:px-8 select-none">
													{/* 3D Carousel Container */}
																																									<div className="absolute inset-0 perspective-[1200px]">
															<div className="absolute inset-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 preserve-3d" style={{ transformStyle: 'preserve-3d', transform: `rotateX(55deg) rotateZ(-12deg)` }}>
																<div className="absolute inset-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 preserve-3d transition-transform duration-500 ease-out" style={{ transformStyle: 'preserve-3d', transform: `rotateY(${carouselRotation}deg)` }}>
																	{/* Torus illusion: inner and outer rings of ticks */}
																	{Array.from({ length: 36 }).map((_, i) => {
																		const angle = (360 / 36) * i;
																		const inner = 460, outer = 540;
																		return (
																			<>
																			<div key={`tick-in-${i}`} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transform: `rotateY(${angle}deg) translateZ(${inner}px)` }}>
																				<div className="w-1 h-1 rounded-full bg-indigo-300/55" />
																			</div>
																			<div key={`tick-out-${i}`} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transform: `rotateY(${angle}deg) translateZ(${outer}px)` }}>
																				<div className="w-2 h-2 rounded-full bg-indigo-400/70 shadow-[0_0_10px_rgba(99,102,241,0.6)]" />
																			</div>
																		</>
																	);
																	})}
																	{calcItems.map((item, idx) => {
																		const total = calcItems.length;
																		const angle = (360 / total) * idx;
																		const radius = 520; // distance from center
																		return (
																			<Link key={item.path} to={item.path} onClick={()=> setCalcRingOpen(false)}
																				className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
																				style={{ transform: `rotateY(${angle}deg) translateZ(${radius}px)`, transformStyle: 'preserve-3d' }}
																		>
																			<div className="w-[70vw] sm:w-[520px] h-[56vh] sm:h-[64vh] rounded-3xl border border-indigo-300 bg-white/95 dark:bg-gray-900/95 shadow-[0_20px_60px_rgba(0,0,0,0.25)] px-6 py-6 flex items-center justify-center text-3xl sm:text-4xl font-extrabold text-foreground" style={{ transform: 'translateZ(2px)' }}>
																				<span className="text-gray-900 dark:text-gray-100">{item.label}</span>
																			</div>
																		</Link>
																	);
																	})}
																</div>
															</div>
													{/* Controls */}
																									<div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-3 sm:gap-4">
														<Button size="icon" variant="outline" className="rounded-full h-10 w-10" onClick={(e)=>{e.preventDefault(); rotatePrev();}}>
															<ChevronLeft className="w-5 h-5" />
														</Button>
														<Button size="icon" variant="outline" className="rounded-full h-10 w-10" onClick={(e)=>{e.preventDefault(); setAutoSpin((v)=> !v);}}>
															{autoSpin ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
														</Button>
														<Button size="icon" variant="outline" className="rounded-full h-10 w-10" onClick={(e)=>{e.preventDefault(); rotateNext();}}>
															<ChevronRight className="w-5 h-5" />
														</Button>
													</div>
												</div>
											</div>
										</div>
								</div>
							)}
						</div>
					</DropdownMenu>
                </div>
              </div>
            </div>
            
            {/* Settings */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <Link to="/settings">
                <Button
                  size="icon"
                  className="w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                  title="Ayarlar"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Top Page Ad */}
      {shouldShowAd('top-page') && (
        <div className="mb-6">
          <AdBannerMobile />
        </div>
      )}



      {/* Bottom Page Ad */}
      {shouldShowAd('bottom-page') && (
        <div className="mt-8">
          <AdBannerInline />
        </div>
      )}

    </MobileLayout>
  );
};

export default Index;
