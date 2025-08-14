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
								<div className="fixed inset-0 z-[9999] pointer-events-auto bg-gradient-to-b from-blue-900/80 via-blue-800/70 to-blue-900/80 backdrop-blur-sm">
									{/* Captain's Bridge Background */}
									<div className="absolute inset-0 bg-gradient-to-br from-slate-800/40 via-slate-700/30 to-slate-900/50"></div>
									
									{/* Wall texture */}
									<div className="absolute inset-0 opacity-20" style={{
										backgroundImage: `repeating-linear-gradient(
											45deg,
											transparent,
											transparent 2px,
											rgba(255,255,255,0.03) 2px,
											rgba(255,255,255,0.03) 4px
										)`
									}}></div>

									<div className="absolute inset-0 flex flex-col">
										{/* Header */}
										<div className="flex items-center justify-between p-4 sm:p-6 bg-slate-800/50 border-b border-slate-600/30">
											<h3 className="font-semibold text-base sm:text-lg text-white">Hesaplamalar</h3>
											<Button size="sm" variant="secondary" onClick={()=> setCalcRingOpen(false)}>Kapat</Button>
										</div>

										{/* Life Ring Container */}
										<div className="flex-1 flex items-center justify-center p-4">
											<div className="relative">
												{/* Wall Nail/Hook */}
												<div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
													<div className="w-4 h-4 bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-full shadow-lg"></div>
													<div className="w-2 h-6 bg-gradient-to-b from-yellow-700 to-yellow-900 mx-auto rounded-b-sm shadow-md"></div>
												</div>

												{/* Hanging Rope */}
												<div className="absolute -top-6 left-1/2 -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-amber-800 to-amber-900 opacity-80 z-5"></div>

												{/* Life Ring */}
												<div className="relative w-80 h-80 sm:w-96 sm:h-96 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-full shadow-2xl border-8 border-gray-200">
													{/* Red stripes - 4 segments */}
													<div className="absolute inset-0 rounded-full overflow-hidden">
														{/* Top segment */}
														<div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-b from-red-500 to-red-600 rounded-t-full transform -translate-y-4"></div>
														{/* Right segment */}
														<div className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-l from-red-500 to-red-600 rounded-r-full transform translate-x-4"></div>
														{/* Bottom segment */}
														<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-t from-red-500 to-red-600 rounded-b-full transform translate-y-4"></div>
														{/* Left segment */}
														<div className="absolute left-0 top-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-red-500 to-red-600 rounded-l-full transform -translate-x-4"></div>
													</div>

													{/* Inner hole */}
													<div className="absolute inset-20 bg-white rounded-full border-4 border-gray-300 shadow-inner">
														{/* Nautical center design */}
														<div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-full">
															{/* Compass background pattern */}
															<div className="absolute inset-0 opacity-20" style={{
																background: `radial-gradient(circle, transparent 30%, rgba(0,0,0,0.1) 31%, rgba(0,0,0,0.1) 32%, transparent 33%), 
																			conic-gradient(from 0deg, transparent 85deg, rgba(0,0,0,0.1) 90deg, transparent 95deg)`
															}}></div>
														</div>
													</div>
													
													{/* Rope texture around the ring */}
													<div className="absolute inset-0 rounded-full" style={{
														background: `conic-gradient(
															from 0deg,
															rgba(139,69,19,0.3) 0deg,
															transparent 5deg,
															rgba(139,69,19,0.3) 10deg,
															transparent 15deg
														)`
													}}></div>

													{/* Text labels */}
													<div className="absolute inset-0 flex flex-col items-center justify-center">
														<div className="text-center -mt-8">
															<div className="text-base sm:text-lg font-bold text-gray-800 mb-1">HESAPLAMALAR</div>
														</div>
														<div className="text-center mt-8">
															<div className="text-base sm:text-lg font-bold text-gray-800">CALCULATOR</div>
														</div>
													</div>

													{/* Shadow underneath */}
													<div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-72 h-12 bg-black/30 rounded-full blur-lg"></div>
												</div>

												{/* Menu Items around the ring */}
												<div className="absolute inset-0 w-80 h-80 sm:w-96 sm:h-96">
													{calcItems.map((item, idx) => {
														const total = calcItems.length;
														const angle = (360 / total) * idx;
														const radius = 220;
														const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
														const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
														
														return (
															<Link
																key={item.path}
																to={item.path}
																onClick={() => setCalcRingOpen(false)}
																className="absolute w-24 h-24 sm:w-28 sm:h-28 -translate-x-1/2 -translate-y-1/2 group"
																style={{
																	left: `calc(50% + ${x}px)`,
																	top: `calc(50% + ${y}px)`
																}}
															>
																<div className="w-full h-full bg-white/90 backdrop-blur-sm rounded-xl border border-orange-300 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center gap-1 hover:scale-105 hover:bg-white group-hover:border-orange-500">
																	<item.Icon className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600 group-hover:text-orange-700" />
																	<span className="text-xs sm:text-sm font-medium text-gray-800 text-center px-1 leading-tight">{item.label}</span>
																</div>
															</Link>
														);
													})}
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
