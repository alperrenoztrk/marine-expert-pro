// Force refresh - imports validation  
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Download, 
  Gauge, 
  Ruler, 
  Timer, 
  Waves, 
  BookOpen, 
  Calculator, 
  Lightbulb, 
  GraduationCap, 
  HelpCircle, 
  CheckCircle, 
  AlertTriangle, 
  Settings2, 
  TrendingUp, 
  Search, 
  RotateCcw, 
  Anchor, 
  Ship, 
  Package, 
  Droplets 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useMemo, useRef, useState } from "react";
import React from "react";
import { HydrostaticUtils } from "@/utils/hydrostaticUtils";
import { ShipGeometry } from "@/types/hydrostatic";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { exportNodeToPng, exportToCsv } from "@/utils/exportUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function StabilityAthwartship() {
  const navigate = useNavigate();
  const chartRef = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<ShipGeometry>({
    length: 180,
    breadth: 30,
    depth: 18,
    draft: 10,
    blockCoefficient: 0.75,
    waterplaneCoefficient: 0.85,
    midshipCoefficient: 0.98,
    prismaticCoefficient: 0.77,
    verticalPrismaticCoefficient: 0.75,
  });
  const [kg, setKg] = useState<number>(12);
  const [freeService, setFreeService] = useState<number>(0);
  const [result, setResult] = useState<{ gm: number; stabilityRange: number; naturalPeriod: number; deckEdgeAngle: number } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("calculator");
  const [basicMode, setBasicMode] = useState<boolean>(true);
  const [showStepByStep, setShowStepByStep] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [learningProgress, setLearningProgress] = useState<number>(0);
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  const [selectedShipType, setSelectedShipType] = useState<string>("cargo");
  const [weatherCondition, setWeatherCondition] = useState<number>(3);
  const [urgentCalculation, setUrgentCalculation] = useState<boolean>(false);
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  
  // Calculation states
  const [momentWeight, setMomentWeight] = useState<number>(0);
  const [momentDistance, setMomentDistance] = useState<number>(0);
  const [unknownWeight, setUnknownWeight] = useState<number>(0);
  const [heelAngle, setHeelAngle] = useState<number>(0);
  const [craneWeight, setCraneWeight] = useState<number>(0);
  const [craneDistance, setCraneDistance] = useState<number>(0);
  const [dryDockGM, setDryDockGM] = useState<number>(0);
  const [dryDockDraft, setDryDockDraft] = useState<number>(0);
  
  // Calculation functions
  const calculateMoment = () => {
    return momentWeight * momentDistance;
  };
  
  const calculateUnknownWeight = () => {
    // Based on heel angle formula
    const displacement = geometry.length * geometry.breadth * geometry.draft * geometry.blockCoefficient * 1.025;
    return (Math.sin(heelAngle * Math.PI / 180) * displacement * result?.gm || 0) / momentDistance;
  };
  
  const calculateHeelAngle = () => {
    if (!result?.gm) return 0;
    const displacement = geometry.length * geometry.breadth * geometry.draft * geometry.blockCoefficient * 1.025;
    return Math.asin((craneWeight * craneDistance) / (displacement * result.gm)) * 180 / Math.PI;
  };
  
  const calculateCraneGM = () => {
    return dryDockGM * (dryDockDraft / geometry.draft);
  };
  
  const calculateDryDockGM = () => {
    return (momentWeight * momentDistance) / (geometry.length * geometry.breadth * geometry.draft * geometry.blockCoefficient * 1.025);
  };
  const [scenario2Answer, setScenario2Answer] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: string}>({});
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [currentQuizSet, setCurrentQuizSet] = useState<number>(0);

  const handleChange = (key: keyof ShipGeometry) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setGeometry((prev) => ({ ...prev, [key]: isNaN(value) ? 0 : value }));
  };

  const handleCalculate = () => {
    const v = HydrostaticUtils.validateShipGeometry(geometry);
    setErrors(v.errors);
    if (!v.isValid) {
      setResult(null);
      return;
    }
    const res = HydrostaticUtils.calculateSmallAngleStability(geometry, kg - freeService);
    // Calculate deck edge immersion angle (simplified approximation)
    const deckEdgeAngle = Math.atan(geometry.breadth / (2 * geometry.draft)) * (180 / Math.PI);
    setResult({ ...res, deckEdgeAngle });
  };

  const shipPresets = {
    cargo: {
      name: "Kargo Gemisi",
      geometry: { length: 180, breadth: 30, depth: 18, draft: 12, blockCoefficient: 0.75, waterplaneCoefficient: 0.85, midshipCoefficient: 0.98, prismaticCoefficient: 0.77, verticalPrismaticCoefficient: 0.75 },
      kg: 15
    },
    container: {
      name: "Konteyner Gemisi", 
      geometry: { length: 200, breadth: 32, depth: 20, draft: 13, blockCoefficient: 0.65, waterplaneCoefficient: 0.82, midshipCoefficient: 0.95, prismaticCoefficient: 0.68, verticalPrismaticCoefficient: 0.70 },
      kg: 16
    },
    tanker: {
      name: "Tanker",
      geometry: { length: 250, breadth: 44, depth: 22, draft: 16, blockCoefficient: 0.82, waterplaneCoefficient: 0.90, midshipCoefficient: 0.99, prismaticCoefficient: 0.83, verticalPrismaticCoefficient: 0.80 },
      kg: 14
    },
    bulk: {
      name: "Dökme Yük Gemisi",
      geometry: { length: 190, breadth: 32, depth: 20, draft: 14, blockCoefficient: 0.78, waterplaneCoefficient: 0.88, midshipCoefficient: 0.98, prismaticCoefficient: 0.80, verticalPrismaticCoefficient: 0.77 },
      kg: 16
    }
  };

  const handleShipTypeChange = (type: string) => {
    setSelectedShipType(type);
    const preset = shipPresets[type as keyof typeof shipPresets];
    if (preset) {
      setGeometry(preset.geometry);
      setKg(preset.kg);
    }
  };

  const getWeatherRecommendation = (gm: number, weather: number) => {
    if (weather <= 3) return { status: "safe", message: "Normal operasyon - güvenli" };
    if (weather <= 6) {
      if (gm > 0.5) return { status: "caution", message: "Dikkatli seyir - GM yeterli" };
      return { status: "warning", message: "GM düşük - hava koşulları riskli" };
    }
    if (gm > 1.0) return { status: "warning", message: "Kötü hava - güvenli liman önerilir" };
    return { status: "danger", message: "ACİL: Derhal güvenli liman arayın!" };
  };

  const getCriticalLimits = (gm: number) => {
    return {
      maxSafeHeel: gm > 0.5 ? 20 : 15,
      emergencyLimit: 25,
      weatherLimit: gm > 0.3 ? 18 : 12,
      cargoOperationLimit: 10
    };
  };

  const handleQuizAnswer = (questionId: string, answer: string) => {
    const newAnswers = { ...quizAnswers, [questionId]: answer };
    setQuizAnswers(newAnswers);
    
    // Şık seçildiğinde direkt sonuçları göster
    const currentQuizData = quizBank[currentQuizSet];
    const allQuestionsAnswered = Object.keys(newAnswers).length >= currentQuizData.questions.length;
    
    if (allQuestionsAnswered) {
      setShowQuizResults(true);
      let score = 0;
      currentQuizData.questions.forEach(q => {
        if (parseInt(newAnswers[q.id]) === q.correct) {
          score++;
        }
      });
      
      const successRate = (score / currentQuizData.questions.length) * 100;
      setLearningProgress(Math.max(learningProgress, Math.round(successRate)));
    }
  };



  const getDetailedStabilityAnalysis = () => {
    if (!result) return null;
    
    const analysis = {
      gmQuality: result.gm > 1.0 ? "SERT" : result.gm > 0.5 ? "ORTA" : result.gm > 0.15 ? "YUMUŞAK" : "KRİTİK",
      gzMaxAngle: Math.round(result.stabilityRange * 0.7), // Yaklaşık max GZ açısı
      rollPeriod: result.naturalPeriod,
      stabilityReserve: result.stabilityRange,
      weatherCapability: getWeatherRecommendation(result.gm, weatherCondition),
      performanceScore: Math.min(100, (result.gm * 20 + result.stabilityRange * 2 + (20 - result.naturalPeriod) * 3)),
      recommendations: getAdvancedRecommendations(result.gm, result.stabilityRange, result.naturalPeriod)
    };
    
    return analysis;
  };

  const getAdvancedRecommendations = (gm: number, range: number, period: number) => {
    const recommendations = [];
    
    if (gm < 0.15) {
      recommendations.push({
        type: "CRITICAL",
        message: "ACİL: GM IMO minimum değerinin altında! Derhal ballast al.",
        action: "Ballast Operations"
      });
    } else if (gm < 0.5) {
      recommendations.push({
        type: "WARNING",
        message: "GM değeri düşük. Kötü hava koşullarında dikkatli ol.",
        action: "Weather Monitoring"
      });
    } else if (gm > 2.0) {
      recommendations.push({
        type: "CAUTION",
        message: "GM çok yüksek. Sert sallanım beklenir, konfor azalır.",
        action: "Comfort Optimization"
      });
    }
    
    if (period < 8) {
      recommendations.push({
        type: "INFO",
        message: "Hızlı roll periyodu. Sert stabilite, rahatsız edici olabilir.",
        action: "Crew Comfort"
      });
    } else if (period > 20) {
      recommendations.push({
        type: "WARNING", 
        message: "Çok yavaş roll. Stabilite zayıf olabilir.",
        action: "Stability Check"
      });
    }
    
    if (range < 30) {
      recommendations.push({
        type: "WARNING",
        message: "Stabilite aralığı dar. Büyük açılarda dikkat et.",
        action: "Large Angle Caution"
      });
    }
    
    return recommendations;
  };

  // 10 farklı zor senaryo
  const scenarioBank = [
    {
      title: "🚢 Kritik Ballast Transferi",
      situation: "200m konteyner gemisi, SS-6 hava şartlarında GM=0.12m. Port tanklarında 800 ton ballast var.",
      question: "Güvenli GM'ye (min 0.20m) ulaşmak için starboard tanklara ne kadar ballast transfer edilmeli?",
      hint: "GM değişimi = (Transfer_ağırlığı × Tank_aralığı) / Deplasman",
      answer: "~180 ton transfer gerekli. Tank aralığı 24m varsayımıyla: ΔGM = (180×24)/45000 ≈ 0.096m. Yeni GM ≈ 0.216m"
    },
    {
      title: "⛽ Kritik Yakıt Durumu",
      situation: "Seyir sırasında ana tank (kıç) ve servis tankı (üst) yarı dolu. GM=0.18m, FSE hesaba katılmamış.",
      question: "Ana tankın tamamen doldurulması GM'yi nasıl etkiler? FSE'yi de hesaba kat.",
      hint: "FSE = (i × ρ × g) / Δ, i = tank inertia momenti",
      answer: "Ana tank dolarsa FSE azalır (~0.03m), KG düşer (~0.05m). Net GM artışı ≈ 0.08m. Yeni GM ≈ 0.26m"
    },
    {
      title: "📦 Tehlikeli Kargo Kayması",
      situation: "Hold 3'te 500 ton konteyner 5° list nedeniyle 3m yana kaydı. GM=0.35m, current list=8°.",
      question: "Geminin final list açısını ve stabilite durumunu hesapla.",
      hint: "Yeni KG = KG_eski + (W × shift_distance) / Δ",
      answer: "Virtual KG artışı: ΔKG = (500×3)/40000 = 0.0375m. Yeni GM ≈ 0.31m. Final list ≈ 12-15°"
    },
    {
      title: "🌊 Hava Hasarı Senaryosu",
      situation: "Fırtınada hatch cover hasarı, Hold 1'e 200 ton deniz suyu girdi. Mevcut GM=0.22m.",
      question: "Su girişinin GM'ye etkisini ve acil eylem planını belirle.",
      hint: "Su girişi hem FSE yaratır hem KG'yi etkiler",
      answer: "FSE ≈ 0.04m, KG artışı ≈ 0.02m. Net GM azalışı ≈ 0.06m. Acil: Pompa, ballast ayarı, liman arayışı"
    },
    {
      title: "🔧 Kargo Operasyonu Krizi",
      situation: "Liman operasyonunda crane arızası, 40 ton konteyner 25m yükseklikte asılı kaldı.",
      question: "Bu durumun stabiliteye etkisini ve güvenlik önlemlerini değerlendir.",
      hint: "Yüksek ağırlık merkezi GM'yi ciddi etkiler",
      answer: "Virtual KG artışı büyük. GM azalışı ≈ 0.15-0.20m. Acil: Load control, weather watch, crane repair"
    },
    {
      title: "🚨 Çoklu Tank Arızası",
      situation: "Starboard ballast tanks (3 tank) pompa arızası, port'ta normal. Current heel=12°, GM=0.15m.",
      question: "Port tankları kullanarak optimal balans stratejisi geliştirir.",
      hint: "Asimetrik ballast ile hem GM'yi hem heel'i kontrol et",
      answer: "Port tank boşalt, center tank doldur. Hedef: symmetric loading + GM increase. Plan: 2-3 aşamalı transfer"
    },
    {
      title: "⚡ Elektrik Kesintisi",
      situation: "Ana güç kesintisi, ballast pompaları çalışmıyor. Mevcut trim=3.2m (stern), weather worsening.",
      question: "Emergency power ile hangi sistemi önceleyip nasıl stabilite sağlarsın?",
      hint: "Limited power, maximum efficiency gerekli",
      answer: "1. Trim pompası, 2. Fore peak ballast, 3. Weather monitoring. Fuel shift de dikkate al"
    },
    {
      title: "🏭 Yük Kaybı Senaryosu",
      situation: "Deck cargo (150 ton, KG=18m) fırtınada kaybedildi. Pre-loss GM=0.45m.",
      question: "Yük kaybı sonrası yeni stabilite durumunu ve operasyonel limitleri hesapla.",
      hint: "Ağırlık kaybı GM'yi etkiler, yeni draft hesabı gerek",
      answer: "GM artışı ≈ 0.25m (weight loss + KG düşüşü). Yeni GM ≈ 0.70m. Draft düşüşü ≈ 4cm"
    },
    {
      title: "🌀 Extreme Weather",
      situation: "SS-8 fırtına, 60° roll açıları görüldü. GM=0.25m, doğal period=14s.",
      question: "Mevcut stabilite parametric roll riskini değerlendir ve önlem al.",
      hint: "Period matching with wave encounter period dangerous",
      answer: "Period riski var. Course/speed change gerekli. Target period: 8-10s veya 18-20s. Ballast/fuel ops"
    },
    {
      title: "🚁 Helikopter Operasyonu",
      situation: "SAR operasyonu, helideck'e 8 ton helikopter konacak (KG=35m). Mevcut GM=0.33m.",
      question: "Helikopter etkisini hesapla ve güvenli operasyon parametrelerini belirle.",
      hint: "Yüksek KG dramatik GM azalışı yaratır",
      answer: "Virtual KG artışı: ≈ 0.18m. Yeni GM ≈ 0.15m (minimum). Weather limit: SS-3 max, optimal ballast config"
    }
  ];

  // 🎯 SADECE STABİLİTE KONULARI - Detaylı Çözümlü Sorular - 20 set
  const quizBank = [
    // 🧮 SAYISAL STABİLİTE SORULARI (1-10)
    {
      questions: [
        {
          id: "q1",
          question: "Gemi: Δ=15000t, KG=8.5m, KB=4.2m, BM=5.8m. GM değeri nedir?",
          options: ["1.5m", "2.0m", "2.5m"],
          correct: 0,
          explanation: "ÇÖZÜM: GM = KB + BM - KG = 4.2 + 5.8 - 8.5 = 1.5m. Bu formül transverse metacentric height'ın temel hesaplama yöntemidir. GM, geminin initial stability'sinin ana göstergesidir."
        }
      ]
    },
    {
      questions: [
        {
          id: "q1", 
          question: "Tank 20m×15m×8m, %60 dolu, ρ=1.025t/m³. Free Surface Moment = ρ×g×i×l×b³/(12×V), FSM=?",
          options: ["244.1 t.m", "366.2 t.m", "488.3 t.m"],
          correct: 0,
          explanation: "ÇÖZÜM: V=20×15×8×0.6=1440m³, i=b³/12=15³/12=281.25m⁴, FSM=1.025×9.81×281.25×20/1440=244.1 t.m. Free surface effect, partially filled tank'larda stability'yi azaltan kritik faktördür."
        }
      ]
    },
    {
      questions: [
        {
          id: "q1",
          question: "Roll period T=12sn, k=0.4×B=0.4×18m=7.2m ise GM değeri? (T=2π√(k²/g×GM))",
          options: ["0.89m", "1.12m", "1.35m"],
          correct: 1,
          explanation: "ÇÖZÜM: T=2π√(k²/g×GM) → 12=2π√(7.2²/9.81×GM) → GM=k²/(g×(T/2π)²)=51.84/(9.81×3.64)=1.12m. Roll period, GM ile ters orantılıdır - GM arttıkça roll period azalır."
        }
      ]
    },
    {
      questions: [
        {
          id: "q1",
          question: "Weather criterion: Wind pressure=504 N/m², projected area=2400m², lever arm=12m, minimum GM?",
          options: ["0.83m", "1.04m", "1.25m"],
          correct: 1,
          explanation: "ÇÖZÜM: Heeling moment=504×2400×12÷1000=14515 t.m, Weather criterion için GM_req=Heeling moment×1.4/Displacement=14515×1.4/19500=1.04m. Weather criterion, şiddetli rüzgarda stability'yi garanti eder."
        }
      ]
    },
    {
      questions: [
        {
          id: "q1",
          question: "GZ curve: 30°'de GZ=0.65m, area 0-30°=0.055 m.rad ise 40°'de area=0.090 m.rad için GZ₄₀=?",
          options: ["0.52m", "0.60m", "0.68m"],
          correct: 1,
          explanation: "ÇÖZÜM: Area₃₀₋₄₀=0.090-0.055=0.035 m.rad, Δθ=10°=0.174 rad, Average GZ=(0.65+GZ₄₀)/2, 0.035=(0.65+GZ₄₀)×0.174/2 → GZ₄₀=0.60m. GZ curve area'sı dynamic stability'yi gösterir."
        }
      ]
    },
    {
      questions: [
        {
          id: "q1",
          question: "Cargo loading: 800t yük, VCG=15m, gemi KG=8.0m, Δ=12000t, yeni KG=?",
          options: ["8.47m", "8.73m", "9.12m"],
          correct: 0,
          explanation: "ÇÖZÜM: New KG = (Ship moment + Cargo moment)/(Ship Δ + Cargo) = (12000×8.0 + 800×15)/(12000+800) = (96000+12000)/12800 = 8.47m. Yüksek VCG'li cargo, geminin KG'sini yükseltir ve GM'yi azaltır."
        }
      ]
    },
    {
      questions: [
        {
          id: "q1",
          question: "Heel angle=8°, GM=1.2m ise small angle stability'de GZ değeri?",
          options: ["0.167m", "0.189m", "0.211m"],
          correct: 0,
          explanation: "ÇÖZÜM: Small angle için GZ = GM × sin(θ) = 1.2 × sin(8°) = 1.2 × 0.139 = 0.167m. Bu formül sadece küçük açılarda (θ<15°) geçerlidir, büyük açılarda GZ curve kullanılmalıdır."
        }
      ]
    },
    {
      questions: [
        {
          id: "q1",
          question: "Deck cargo 200t, KG=16m, serbest surface effect=0.05m, gemi GM=1.5m, final GM=?",
          options: ["1.28m", "1.35m", "1.42m"],
          correct: 0,
          explanation: "ÇÖZÜM: New KG = (15000×8.5 + 200×16)/15200 = 8.71m, GM_solid = 9.8 - 8.71 = 1.09m, GM_fluid = GM_solid - FSE = 1.09 - 0.05 = 1.04m. Effective GM hesabında hem weight effect hem de FSE dikkate alınır."
        }
      ]
    },
    {
      questions: [
        {
          id: "q1",
          question: "Passenger crowding: 400 kişi tek tarafa, 75kg/kişi, moment arm=8m, displacement=5000t, heel=?",
          options: ["2.75°", "3.44°", "4.12°"],
          correct: 1,
          explanation: "ÇÖZÜM: Heeling moment = 400×0.075×8 = 240 t.m, tan(θ) = Heeling moment/(Displacement×GM) = 240/(5000×0.8) = 0.06, θ = arctan(0.06) = 3.44°. Passenger crowding, ferry stability'sinin kritik faktörüdür."
        }
      ]
    },
    {
      questions: [
        {
          id: "q1",
          question: "Damage stability: Compartment flooding, volume=1200m³, permeability=0.85, virtual rise KG=?",
          options: ["0.15m", "0.18m", "0.21m"],
          correct: 1,
          explanation: "ÇÖZÜM: Lost buoyancy = 1200×0.85×1.025 = 1045.5t, Virtual KG rise = (Volume×permeability×density×KG_flooding)/Original_displacement = (1200×0.85×1.025×8)/15000 = 0.18m. Damage stability'de virtual KG artışı GM'yi azaltır."
        }
      ]
    },
    // 📚 KAVRAMSAL STABİLİTE SORULARI (11-20)
    {
      questions: [
        {
          id: "q1",
          question: "Metacentric radius (BM) neye bağlı olarak değişir?",
          options: ["Sadece draft'a", "Waterplane area moment of inertia/Volume", "Displacement'a"],
          correct: 1,
          explanation: "AÇIKLAMA: BM = I/∇ formülüyle hesaplanır. I = waterplane area'nın moment of inertia, ∇ = underwater volume. Geniş ve düz gemi formları daha büyük BM'ye sahiptir. BM, GM'nin önemli bir bileşenidir."
        }
      ]
    },
    {
      questions: [
        {
          id: "q1",
          question: "Synchronous rolling phenomenon'un oluşma sebebi nedir?",
          options: ["Wave period = Natural roll period", "High GM values", "Low speed operations"],
          correct: 0,
          explanation: "AÇIKLAMA: Synchronous rolling, dalga periyodu ile geminin doğal roll periyodunun eşleşmesi durumunda oluşur. Bu durumda rezonans meydana gelir ve roll amplitüdü tehlikeli seviyelere çıkabilir. Çözüm: course/speed değişikliği."
        }
      ]
    },
    {
      questions: [
        {
          id: "q1",
          question: "Free Surface Effect'in GM üzerindeki etkisinin fiziksel nedeni nedir?",
          options: ["Virtual KG rise", "Real weight increase", "Center of flotation shift"],
          correct: 0,
          explanation: "AÇIKLAMA: FSE, partially filled tank'larda liquid'in movement'ı nedeniyle virtual KG artışı yaratır. Gerçek KG değişmez ama effective GM azalır. FSE = (i×ρ×g)/Δ formülüyle hesaplanır ve tank geometry'sine bağlıdır."
        }
      ]
    },
    {
      questions: [
        {
          id: "q1",
          question: "Parametric rolling hangi durumda en tehlikelidir?",
          options: ["Beam seas", "Following seas with λ≈L", "Head seas"],
          correct: 1,
          explanation: "AÇIKLAMA: Parametric rolling, wave length ≈ ship length olan following seas'de en tehlikelidir. Gemi wave crest ve trough'da farklı waterplane area'lara sahip olur, bu da GM'nin periodic değişimine ve büyük roll amplitüdlerine neden olur."
        }
      ]
    },
    {
      questions: [
        {
          id: "q1",
          question: "IMO Intact Stability Code'a göre weather criterion neyi test eder?",
          options: ["Static heel resistance", "Dynamic stability adequacy", "Roll period limits"],
          correct: 1,
          explanation: "AÇIKLAMA: Weather criterion, geminin severe wind ve wave conditions'da yeterli dynamic stability'ye sahip olduğunu doğrular. Test: steady wind heeling moment vs available righting energy comparison. Minimum area under GZ curve gereklidir."
        }
      ]
    },
    {
      questions: [
        {
          id: "q1",
          question: "Grain cargo shifting moment'in önlenmesi için hangi yöntem kullanılır?",
          options: ["Overstowing with bagged cargo", "Tank top strengthening", "Hold ventilation"],
          correct: 0,
          explanation: "AÇIKLAMA: Grain cargo'nun shifting'ini önlemek için overstowing (torbalanmış cargo ile üst yüzeyi kapatma) kullanılır. Bu method, bulk grain'in movement'ını sınırlar ve shifting moment'ı azaltır. SOLAS VI/7 Grain Code'da detaylandırılır."
        }
      ]
    },
    {
      questions: [
        {
          id: "q1",
          question: "Liquid cargo tank'larda longitudinal bulkhead'in stability açısından amacı nedir?",
          options: ["Structural strength", "Free surface reduction", "Loading efficiency"],
          correct: 1,
          explanation: "AÇIKLAMA: Longitudinal bulkhead, tank width'ini azaltarak free surface moment'ı minimize eder. FSM ∝ b³ olduğundan, tank width'inin küçülmesi FSE'yi dramatically azaltır. Bu özellikle crude oil tanker'larda kritiktir."
        }
      ]
    },
    {
      questions: [
        {
          id: "q1",
          question: "High GM'nin container vessel'larda neden problem yaratır?",
          options: ["Fuel consumption increase", "Harsh rolling and cargo damage", "Speed limitation"],
          correct: 1,
          explanation: "AÇIKLAMA: Yüksek GM, çok hızlı ve sert roll motion'a neden olur. Bu durum container lashing'larında stress yaratır ve cargo damage riski artırır. Optimal GM range: 0.8-1.2m. Roll period 8-12 saniye ideal range'dir."
        }
      ]
    },
    {
      questions: [
        {
          id: "q1",
          question: "Angle of vanishing stability nedir ve neden önemlidir?",
          options: ["Maximum GZ angle", "GZ becomes zero", "Deck edge immersion"],
          correct: 1,
          explanation: "AÇIKLAMA: Vanishing stability angle, GZ'nin sıfır olduğu açıdır. Bu açıdan sonra negative stability başlar ve gemi capsize edebilir. Minimum 25° olmalıdır. Range of positive stability'nin sonu olarak kritik safety parameter'dır."
        }
      ]
    },
    {
      questions: [
        {
          id: "q1",
          question: "KG limit curve'unun stability booklet'teki fonksiyonu nedir?",
          options: ["Maximum allowable KG vs displacement", "GM requirements", "Loading sequence"],
          correct: 0,
          explanation: "AÇIKLAMA: KG limit curve, her displacement değeri için maximum allowable KG'yi gösterir. Bu curve, IMO criteria'yı satisfy eden minimum GM'yi garanti eder. Loading planning'de critical tool olarak kullanılır ve stability compliance'ı sağlar."
        }
      ]
    }
  ];

  // Random senaryo seçimi (component mount'ta)
  React.useEffect(() => {
    setCurrentScenario(Math.floor(Math.random() * scenarioBank.length));
    setCurrentQuizSet(Math.floor(Math.random() * quizBank.length));
  }, []);

  // Keyboard navigation for quiz sets
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (activeTab === "practice") {
        if (event.key === "ArrowLeft") {
          // Previous quiz set
          const prevSet = currentQuizSet > 0 ? currentQuizSet - 1 : quizBank.length - 1;
          setCurrentQuizSet(prevSet);
          setQuizAnswers({});
          setShowQuizResults(false);
        } else if (event.key === "ArrowRight") {
          // Next quiz set
          const nextSet = currentQuizSet < quizBank.length - 1 ? currentQuizSet + 1 : 0;
          setCurrentQuizSet(nextSet);
          setQuizAnswers({});
          setShowQuizResults(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeTab, currentQuizSet, quizBank.length]);

  const chartData = useMemo(() => {
    if (!result) return [] as { angle: number; gz: number }[];
    const points: { angle: number; gz: number }[] = [];
    for (let a = 0; a <= 60; a += 1) {
      const rad = (a * Math.PI) / 180;
      // Small-angle approximation for <=15°, wall-sided like term for larger
      const gz = a <= 15
        ? result.gm * Math.sin(rad)
        : result.gm * Math.sin(rad) - 0.5 * geometry.breadth * Math.pow(Math.sin(rad), 2);
      points.push({ angle: a, gz: Math.max(0, Number(gz.toFixed(3))) });
    }
    return points;
  }, [result, geometry.breadth]);

  const handleExportPng = async () => {
    if (chartRef.current) await exportNodeToPng(chartRef.current, 'gz-athwartship.png');
  };

  const handleExportCsv = () => {
    if (!result) return;
    const rows = chartData.map((r) => ({ angle: r.angle, gz: r.gz }));
    exportToCsv(rows, 'gz-athwartship.csv');
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/stability')}>
          <ArrowLeft className="h-4 w-4" />
          Geri Dön
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <button
                onClick={() => {
                  setBasicMode(true);
                  setAdvancedMode(false);
                  setActiveTab("learn");
                }}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  basicMode 
                    ? "bg-blue-500 text-white shadow-sm" 
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                📚 Temel
              </button>
              <button
                onClick={() => {
                  setBasicMode(false);
                  setAdvancedMode(true);
                  setActiveTab("officer");
                }}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  advancedMode 
                    ? "bg-orange-500 text-white shadow-sm" 
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                🎯 İleri
              </button>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="h-5 w-5" />
            Enine Stabilite Hesaplamaları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                          <TabsList className={`grid w-full ${basicMode ? 'grid-cols-5' : 'grid-cols-3'}`}>
              {basicMode ? (
                <>
                  <TabsTrigger value="learn" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Öğren
                  </TabsTrigger>
                                      <TabsTrigger value="calculator" className="gap-2">
                      <Calculator className="h-4 w-4" />
                      Hesapla
                    </TabsTrigger>
                    <TabsTrigger value="calculations" className="gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Hesaplamalar
                    </TabsTrigger>
                  <TabsTrigger value="concepts" className="gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Kavramlar
                  </TabsTrigger>
                  <TabsTrigger value="practice" className="gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Alıştırma
                  </TabsTrigger>
                </>
              ) : (
                <>
                  <TabsTrigger value="officer" className="gap-2">
                    <Timer className="h-4 w-4" />
                    Hızlı Hesaplama
                  </TabsTrigger>
                  <TabsTrigger value="operational" className="gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Operasyonel
                  </TabsTrigger>
                  <TabsTrigger value="emergency" className="gap-2">
                    <Waves className="h-4 w-4" />
                    Acil Durum
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            <TabsContent value="learn" className="space-y-4 mt-6">
              {renderLearningContent()}
            </TabsContent>

                          <TabsContent value="calculator" className="space-y-4 mt-6">
                {renderCalculatorContent()}
              </TabsContent>

              <TabsContent value="calculations" className="space-y-4 mt-6">
                {renderCalculationsContent()}
              </TabsContent>

            <TabsContent value="concepts" className="space-y-4 mt-6">
              {renderConceptsContent()}
            </TabsContent>

            <TabsContent value="practice" className="space-y-4 mt-6">
              {renderPracticeContent()}
            </TabsContent>

            {/* Officer Mode Tabs */}
            <TabsContent value="officer" className="space-y-4 mt-6">
              {renderOfficerQuickCalculation()}
            </TabsContent>

            <TabsContent value="operational" className="space-y-4 mt-6">
              {renderOperationalContent()}
            </TabsContent>

            <TabsContent value="emergency" className="space-y-4 mt-6">
              {renderEmergencyContent()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  function renderLearningContent() {
    return (
      <div className="space-y-6">
        <Alert>
          <BookOpen className="h-4 w-4" />
          <AlertTitle>Enine Stabilite Nedir?</AlertTitle>
          <AlertDescription className="space-y-3 mt-3">
            <p>
              <strong>Enine stabilite</strong>, bir geminin yatay ekseni etrafında yatılmasına karşı gösterdiği dirençtir. 
              Gemi dalgalar, rüzgar veya yük kayması nedeniyle yana yatıldığında, kendini düzeltme kabiliyetidir.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Pozitif Stabilite</h4>
                                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Gemi yatırıldığında kendini düzeltmeye çalışır. GM &gt; 0 olmalıdır.
                  </p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Negatif Stabilite</h4>
                <p className="text-sm text-red-800 dark:text-red-200">
                  Gemi yatırıldığında daha da yatmaya devam eder. GM &lt; 0 - Tehlikeli!
                </p>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Adım Adım Öğrenme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <h4 className="font-medium">1. Adım: Gemi Geometrisini Anlayın</h4>
                  <p className="text-sm text-muted-foreground">Uzunluk, genişlik, derinlik ve draft değerlerini öğrenin</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">2</div>
                <div>
                  <h4 className="font-medium">2. Adım: Form Katsayılarını Hesaplayın</h4>
                  <p className="text-sm text-muted-foreground">Cb, Cw, Cm katsayıları geminin şeklini belirler</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
                <div className="h-5 w-5 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs">3</div>
                <div>
                  <h4 className="font-medium">3. Adım: GM Hesaplayın</h4>
                  <p className="text-sm text-muted-foreground">GM = KB + BM - KG - FSE formülünü uygulayın</p>
                </div>
              </div>

              <Button 
                onClick={() => {
                  setActiveTab("calculator");
                  setShowStepByStep(true);
                  setLearningProgress(25);
                }}
                className="w-full"
              >
                Hesaplamaya Başla
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderCalculatorContent() {
    return (
      <div className="space-y-6">
        {showStepByStep && (
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Adım Adım Hesaplama
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>Öğrenci İpucu</AlertTitle>
                  <AlertDescription>
                    Her girdiyi dikkatlice inceleyin. Form katsayıları geminin şeklini, KG ise ağırlık merkezini belirler.
                    GM değeri pozitif olmalıdır - bu geminin stabil olduğunu gösterir.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        )}

        {!!errors.length && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Girdi Hatası</AlertTitle>
            <AlertDescription>
              <ul className="list-disc ml-4">
                {errors.map((e, i) => (<li key={i}>{e}</li>))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📏 Gemi Boyutları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="flex items-center gap-2">
                  Uzunluk LBP (m)
                  <Badge variant="outline" className="text-xs">Length Between Perpendiculars</Badge>
                </Label>
                <Input type="number" value={geometry.length} onChange={handleChange('length')} />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  Genişlik B (m)
                  <Badge variant="outline" className="text-xs">Beam</Badge>
                </Label>
                <Input type="number" value={geometry.breadth} onChange={handleChange('breadth')} />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  Derinlik D (m)
                  <Badge variant="outline" className="text-xs">Depth</Badge>
                </Label>
                <Input type="number" value={geometry.depth} onChange={handleChange('depth')} />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  Draft T (m)
                  <Badge variant="outline" className="text-xs">Draft</Badge>
                </Label>
                <Input type="number" value={geometry.draft} onChange={handleChange('draft')} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📊 Form Katsayıları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="flex items-center gap-2">
                  Cb - Blok Katsayısı
                  <Badge variant="outline" className="text-xs">0.60-0.85</Badge>
                </Label>
                <Input type="number" step="0.01" value={geometry.blockCoefficient} onChange={handleChange('blockCoefficient')} />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  Cw - Su çizgisi Katsayısı
                  <Badge variant="outline" className="text-xs">0.75-0.95</Badge>
                </Label>
                <Input type="number" step="0.01" value={geometry.waterplaneCoefficient} onChange={handleChange('waterplaneCoefficient')} />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  Cm - Orta kesit Katsayısı
                  <Badge variant="outline" className="text-xs">0.95-1.00</Badge>
                </Label>
                <Input type="number" step="0.01" value={geometry.midshipCoefficient} onChange={handleChange('midshipCoefficient')} />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  KG (m) - Ağırlık Merkezi
                  <Badge variant="outline" className="text-xs">Critical!</Badge>
                </Label>
                <Input type="number" step="0.01" value={kg} onChange={(e) => setKg(parseFloat(e.target.value))} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap gap-3 p-4 bg-gray-50 dark:bg-gray-950 rounded-lg">
          <Button 
            onClick={() => {
              handleCalculate();
              setLearningProgress(75);
            }}
            className="gap-2"
            size="lg"
          >
            <Calculator className="h-4 w-4" />
            Hesapla ve Öğren
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportPng}>
            <Download className="h-4 w-4" /> PNG İndir
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportCsv}>
            <Download className="h-4 w-4" /> CSV İndir
          </Button>
          <Button variant="ghost" onClick={() => { setResult(null); setErrors([]); }}>
            Temizle
          </Button>
        </div>

        {result && (
          <div className="space-y-6">
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>✅ Hesaplama Tamamlandı!</AlertTitle>
              <AlertDescription>
                <div className="space-y-2 mt-3">
                  <p><strong>Sonuç Analizi:</strong></p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm">
                        <strong>GM = {result.gm.toFixed(3)} m</strong> 
                        {result.gm > 0.15 ? 
                          <Badge className="ml-2 bg-green-100 text-green-800">✅ Güvenli</Badge> : 
                          <Badge variant="destructive" className="ml-2">⚠️ Dikkat</Badge>
                        }
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {result.gm > 1.5 ? "Çok sert stabilite - rahatsız rulo" :
                         result.gm > 0.15 ? "Optimal stabilite aralığında" :
                         "Stabilite yetersiz - tehlikeli!"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm">
                        <strong>Doğal Periyot = {result.naturalPeriod.toFixed(2)} s</strong>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {result.naturalPeriod < 8 ? "Hızlı rulo - sert" :
                         result.naturalPeriod > 20 ? "Yavaş rulo - yumuşak" :
                         "Normal rulo karakteristiği"}
                      </p>
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            <div ref={chartRef}>
              <Card>
                <CardHeader>
                  <CardTitle>GZ Eğrisi (Düzeltici Kol)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{ gz: { label: 'GZ', color: 'hsl(var(--primary))' } }} className="w-full h-80">
                    <LineChart data={chartData} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
                      <CartesianGrid strokeDasharray="4 4" />
                      <XAxis dataKey="angle" tickFormatter={(v) => `${v}°`} />
                      <YAxis tickFormatter={(v) => `${v} m`} />
                      <ChartTooltip content={<ChartTooltipContent labelKey="angle" nameKey="gz" />} />
                      <Line type="monotone" dataKey="gz" stroke="var(--color-gz)" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">GM (Metasentrik Yükseklik)</div>
                    <div className="text-2xl font-bold">{result.gm.toFixed(3)} m</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {result.gm > 0 ? "Pozitif Stabilite ✅" : "Negatif Stabilite ❌"}
                    </div>
                  </div>
                  <Gauge className="h-8 w-8 text-blue-500" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Pozitif Stabilite Aralığı</div>
                    <div className="text-2xl font-bold">{result.stabilityRange.toFixed(1)}°</div>
                    <div className="text-xs text-muted-foreground mt-1">Güvenli yatılma sınırı</div>
                  </div>
                  <Waves className="h-8 w-8 text-green-500" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Doğal Periyot</div>
                    <div className="text-2xl font-bold">{result.naturalPeriod.toFixed(2)} s</div>
                    <div className="text-xs text-muted-foreground mt-1">Rulo periyodu</div>
                  </div>
                  <Timer className="h-8 w-8 text-purple-500" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Güverte Kenarı Dalma</div>
                    <div className="text-2xl font-bold">{result.deckEdgeAngle.toFixed(1)}°</div>
                    <div className="text-xs text-muted-foreground mt-1">Su alma açısı</div>
                  </div>
                  <Ruler className="h-8 w-8 text-orange-500" />
                </div>
              </Card>
            </div>

            {/* Advanced Analysis Section */}
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Gelişmiş Stabilite Analizi
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const analysis = getDetailedStabilityAnalysis();
                  return analysis ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
                          <div className="text-lg font-bold text-blue-600">{analysis.gmQuality}</div>
                          <div className="text-sm text-muted-foreground">Stabilite Kalitesi</div>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
                          <div className="text-lg font-bold text-green-600">{analysis.gzMaxAngle}°</div>
                          <div className="text-sm text-muted-foreground">Max GZ Açısı</div>
                        </div>
                        <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg text-center">
                          <div className="text-lg font-bold text-orange-600">{Math.round(analysis.performanceScore)}%</div>
                          <div className="text-sm text-muted-foreground">Performans Skoru</div>
                        </div>
                      </div>

                      {analysis.recommendations.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-semibold">🎯 Uzman Tavsiyeleri:</h4>
                          {analysis.recommendations.map((rec, idx) => (
                            <div 
                              key={idx} 
                              className={`p-3 rounded-lg border-l-4 ${
                                rec.type === "CRITICAL" ? "bg-red-50 dark:bg-red-950 border-red-500" :
                                rec.type === "WARNING" ? "bg-yellow-50 dark:bg-yellow-950 border-yellow-500" :
                                rec.type === "CAUTION" ? "bg-orange-50 dark:bg-orange-950 border-orange-500" :
                                "bg-blue-50 dark:bg-blue-950 border-blue-500"
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-medium">{rec.message}</p>
                                  <Badge variant="outline" className="mt-1 text-xs">
                                    {rec.action}
                                  </Badge>
                                </div>
                                <Badge variant={
                                  rec.type === "CRITICAL" ? "destructive" :
                                  rec.type === "WARNING" ? "secondary" :
                                  "default"
                                }>
                                  {rec.type}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="p-3 border rounded-lg">
                          <h4 className="font-semibold mb-2">💊 Hava Durumu Kabiliyeti</h4>
                          <div className={`text-sm p-2 rounded ${
                            analysis.weatherCapability.status === "safe" ? "bg-green-50 text-green-800" :
                            analysis.weatherCapability.status === "caution" ? "bg-yellow-50 text-yellow-800" :
                            analysis.weatherCapability.status === "warning" ? "bg-orange-50 text-orange-800" :
                            "bg-red-50 text-red-800"
                          }`}>
                            SS-{weatherCondition}: {analysis.weatherCapability.message}
                          </div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <h4 className="font-semibold mb-2">⚖️ Stabilite Rezervi</h4>
                          <div className="text-sm">
                            <div>Range: {analysis.stabilityReserve.toFixed(1)}°</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${Math.min(100, analysis.stabilityReserve * 2)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}
              </CardContent>
            </Card>

            <Button 
              onClick={() => {
                setActiveTab("concepts");
                setLearningProgress(100);
              }}
              className="w-full"
              size="lg"
            >
              Kavramları Öğrenmeye Devam Et 🎓
            </Button>
          </div>
        )}
      </div>
    );
  }

  function renderConceptsContent() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                GM Nedir?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>Metasentrik Yükseklik (GM)</strong>, geminin stabilite kalitesinin en önemli göstergesidir.
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200">GM &gt; 1.0m</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">Sert stabilite - hızlı düzeltme ama rahatsız</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200">0.15m &lt; GM &lt; 1.0m</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Optimal aralık - rahat ve güvenli</p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                  <h4 className="font-semibold text-red-800 dark:text-red-200">GM &lt; 0.15m</h4>
                  <p className="text-sm text-red-700 dark:text-red-300">Tehlikeli - IMO limiti altında</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="h-5 w-5" />
                GZ Eğrisi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>GZ (Düzeltici Kol)</strong>, her yatılma açısında geminin düzeltici moment kolunu gösterir.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Başlangıç Eğimi</p>
                    <p className="text-sm text-muted-foreground">GM ile orantılı - yüksek eğim = sert stabilite</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Maksimum Nokta</p>
                    <p className="text-sm text-muted-foreground">En güçlü düzeltici moment açısı</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Sıfır Geçiş</p>
                    <p className="text-sm text-muted-foreground">Pozitif stabilitenin sonu - kritik limit</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>📚 IMO Stabilite Kriterleri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Temel Kriter</h4>
                <p className="text-sm"><strong>GM ≥ 0.15m</strong></p>
                <p className="text-xs text-muted-foreground mt-1">Minimum metasentrik yükseklik</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">30° Kriteri</h4>
                <p className="text-sm"><strong>GZ(30°) ≥ 0.20m</strong></p>
                <p className="text-xs text-muted-foreground mt-1">30 derece yatılmada minimum düzeltici kol</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Maksimum GZ</h4>
                <p className="text-sm"><strong>Açı ≥ 25°</strong></p>
                <p className="text-xs text-muted-foreground mt-1">En büyük GZ'nin minimum açısı</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderPracticeContent() {
    const currentScenarioData = scenarioBank[currentScenario];
    const currentQuizData = quizBank[currentQuizSet];
    
    return (
      <div className="space-y-6">
        {/* Dynamic Quiz System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Quiz</span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Set {currentQuizSet + 1} / {quizBank.length}</span>
                <Badge variant="outline">{currentQuizData.questions.length} Soru</Badge>
              </div>
            </CardTitle>
            <div className="text-sm text-muted-foreground mt-2">
              {currentQuizSet < 10 ? "🧮 Sayısal Stabilite Soruları" : "📚 Kavramsal Stabilite Soruları"}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentQuizData.questions.map((question, idx) => (
                <div key={question.id} className="p-4">
                  <h4 className="font-semibold mb-3">{question.question}</h4>
                  <div className="space-y-2">
                    {question.options.map((option, optionIdx) => (
                      <label key={optionIdx} className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name={`quiz-${currentQuizSet}-${question.id}`} 
                          value={optionIdx.toString()}
                          checked={quizAnswers[question.id] === optionIdx.toString()}
                          onChange={(e) => handleQuizAnswer(question.id, e.target.value)}
                          disabled={showQuizResults}
                        />
                        <span className={`text-sm ${
                          showQuizResults ? 
                            (parseInt(quizAnswers[question.id]) === question.correct ? 
                              (optionIdx === question.correct ? "text-green-600 font-semibold" : "") :
                              (optionIdx === parseInt(quizAnswers[question.id]) ? "text-red-600 line-through" : 
                               optionIdx === question.correct ? "text-green-600 font-semibold" : "")
                            ) : ""
                        }`}>
                          {String.fromCharCode(65 + optionIdx)}) {option}
                          {showQuizResults && optionIdx === question.correct && " ✅"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => {
                    const prevSet = currentQuizSet > 0 ? currentQuizSet - 1 : quizBank.length - 1;
                    setCurrentQuizSet(prevSet);
                    setQuizAnswers({});
                    setShowQuizResults(false);
                  }}
                  className="flex-1"
                  disabled={showQuizResults}
                >
                  ← Önceki Set
                  <span className="ml-2 text-xs opacity-60">←</span>
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    const nextSet = currentQuizSet < quizBank.length - 1 ? currentQuizSet + 1 : 0;
                    setCurrentQuizSet(nextSet);
                    setQuizAnswers({});
                    setShowQuizResults(false);
                  }}
                  className="flex-1"
                  disabled={showQuizResults}
                >
                  Sonraki Set →
                  <span className="ml-2 text-xs opacity-60">→</span>
                </Button>
              </div>
              
              {/* Quiz Progress Indicator */}
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Quiz İlerlemesi</span>
                  <span className="font-medium">{currentQuizSet + 1} / {quizBank.length}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${((currentQuizSet + 1) / quizBank.length) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Set 1</span>
                  <span>Set {quizBank.length}</span>
                </div>
                <div className="mt-2 text-xs text-center text-muted-foreground">
                  <span>💡 Sol/Sağ ok tuşları ile hızlı geçiş yapabilirsiniz</span>
                </div>
              </div>
              
              {showQuizResults && (
                <div className="mt-4 space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-lg">
                    <h4 className="font-semibold mb-2">🎯 Quiz Sonuçları:</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {currentQuizData.questions.reduce((score, q) => 
                            score + (parseInt(quizAnswers[q.id]) === q.correct ? 1 : 0), 0
                          )}/{currentQuizData.questions.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Doğru Cevap</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round((currentQuizData.questions.reduce((score, q) => 
                            score + (parseInt(quizAnswers[q.id]) === q.correct ? 1 : 0), 0
                          ) / currentQuizData.questions.length) * 100)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Başarı Oranı</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${
                          (currentQuizData.questions.reduce((score, q) => 
                            score + (parseInt(quizAnswers[q.id]) === q.correct ? 1 : 0), 0
                          ) / currentQuizData.questions.length) >= 0.8 ? 'text-green-600' : 
                          (currentQuizData.questions.reduce((score, q) => 
                            score + (parseInt(quizAnswers[q.id]) === q.correct ? 1 : 0), 0
                          ) / currentQuizData.questions.length) >= 0.6 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {(currentQuizData.questions.reduce((score, q) => 
                            score + (parseInt(quizAnswers[q.id]) === q.correct ? 1 : 0), 0
                          ) / currentQuizData.questions.length) >= 0.8 ? '🏆' : 
                          (currentQuizData.questions.reduce((score, q) => 
                            score + (parseInt(quizAnswers[q.id]) === q.correct ? 1 : 0), 0
                          ) / currentQuizData.questions.length) >= 0.6 ? '👍' : '📚'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {(currentQuizData.questions.reduce((score, q) => 
                            score + (parseInt(quizAnswers[q.id]) === q.correct ? 1 : 0), 0
                          ) / currentQuizData.questions.length) >= 0.8 ? 'Mükemmel!' : 
                          (currentQuizData.questions.reduce((score, q) => 
                            score + (parseInt(quizAnswers[q.id]) === q.correct ? 1 : 0), 0
                          ) / currentQuizData.questions.length) >= 0.6 ? 'İyi!' : 'Tekrar Et'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Detaylı Çözümler */}
                  <div className="space-y-3">
                    <h5 className="font-semibold text-gray-800">📚 Detaylı Çözümler & Açıklamalar:</h5>
                    {currentQuizData.questions.map((question, idx) => {
                      const userAnswer = parseInt(quizAnswers[question.id] || "-1");
                      const isCorrect = userAnswer === question.correct;
                      
                      return (
                        <div key={question.id} className={`p-4 rounded-lg border-2 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                          <h6 className="font-medium mb-2">{question.question}</h6>
                          <div className="space-y-1 mb-3">
                            {question.options.map((option, optionIdx) => (
                              <div 
                                key={optionIdx} 
                                className={`p-2 rounded text-sm ${
                                  optionIdx === question.correct 
                                    ? 'bg-green-100 text-green-800 border border-green-300' 
                                    : userAnswer === optionIdx 
                                      ? 'bg-red-100 text-red-800 border border-red-300' 
                                      : 'bg-gray-100'
                                }`}
                              >
                                {optionIdx === question.correct && "✅ "}
                                {userAnswer === optionIdx && userAnswer !== question.correct && "❌ "}
                                {option}
                              </div>
                            ))}
                          </div>
                          
                          {question.explanation && (
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
                              <div className="text-blue-800 text-sm">
                                <strong>🔍 Detaylı Açıklama:</strong>
                                <p className="mt-1 whitespace-pre-line">{question.explanation}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Quiz Navigation After Results */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const prevSet = currentQuizSet > 0 ? currentQuizSet - 1 : quizBank.length - 1;
                        setCurrentQuizSet(prevSet);
                        setQuizAnswers({});
                        setShowQuizResults(false);
                      }}
                      className="flex-1"
                      disabled={showQuizResults}
                    >
                      ← Önceki Set
                      <span className="ml-2 text-xs opacity-60">←</span>
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const nextSet = currentQuizSet < quizBank.length - 1 ? currentQuizSet + 1 : 0;
                        setCurrentQuizSet(nextSet);
                        setQuizAnswers({});
                        setShowQuizResults(false);
                      }}
                      className="flex-1"
                      disabled={showQuizResults}
                    >
                      Sonraki Set →
                      <span className="ml-2 text-xs opacity-60">→</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderOfficerQuickCalculation() {
    return (
      <div className="space-y-6">
        {/* Quick Ship Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Timer className="h-5 w-5" />
                Hızlı Gemi Seçimi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedShipType} onValueChange={handleShipTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Gemi tipi seçin" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(shipPresets).map(([key, preset]) => (
                    <SelectItem key={key} value={key}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">LOA:</span>
                  <span className="font-medium ml-2">{geometry.length}m</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Beam:</span>
                  <span className="font-medium ml-2">{geometry.breadth}m</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Draft:</span>
                  <span className="font-medium ml-2">{geometry.draft}m</span>
                </div>
                <div>
                  <span className="text-muted-foreground">KG:</span>
                  <span className="font-medium ml-2">{kg}m</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Waves className="h-5 w-5" />
                Hava Durumu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Deniz Durumu (SS)</Label>
                <Select value={weatherCondition.toString()} onValueChange={(value) => setWeatherCondition(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">SS 1 - Sakin</SelectItem>
                    <SelectItem value="2">SS 2 - Hafif</SelectItem>
                    <SelectItem value="3">SS 3 - Orta</SelectItem>
                    <SelectItem value="4">SS 4 - Kabaca</SelectItem>
                    <SelectItem value="5">SS 5 - Kaba</SelectItem>
                    <SelectItem value="6">SS 6 - Çok Kaba</SelectItem>
                    <SelectItem value="7">SS 7 - Yüksek</SelectItem>
                    <SelectItem value="8">SS 8 - Çok Yüksek</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                <div className="text-sm">
                  <strong>Dalga Yüksekliği:</strong> {
                    weatherCondition <= 2 ? "0.1-0.5m" :
                    weatherCondition <= 4 ? "0.5-2.5m" :
                    weatherCondition <= 6 ? "2.5-6m" :
                    "6m+"
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Input Adjustments */}
        <Card>
          <CardHeader>
            <CardTitle>⚡ Hızlı Ayarlama</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>KG Düzeltme (m)</Label>
                <Input 
                  type="number" 
                  step="0.1" 
                  value={kg} 
                  onChange={(e) => setKg(parseFloat(e.target.value))}
                  className="text-lg font-medium"
                />
              </div>
              <div>
                <Label>Draft (m)</Label>
                <Input 
                  type="number" 
                  step="0.1" 
                  value={geometry.draft} 
                  onChange={handleChange('draft')}
                  className="text-lg font-medium"
                />
              </div>
              <div>
                <Label>Serbest Yüzey (m)</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  value={freeService} 
                  onChange={(e) => setFreeService(parseFloat(e.target.value))}
                  className="text-lg font-medium"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleCalculate}
                  className="w-full h-10"
                  size="lg"
                >
                  🚀 HESAPLA
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Dashboard */}
        {result && (
          <div className="space-y-4">
            {/* Critical Status */}
            <Alert className={`${
              result.gm < 0.15 ? "border-red-500 bg-red-50 dark:bg-red-950" :
              result.gm < 0.5 ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950" :
              "border-green-500 bg-green-50 dark:bg-green-950"
            }`}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-lg">
                {result.gm < 0.15 ? "🚨 KRİTİK DURUM" :
                 result.gm < 0.5 ? "⚠️ DİKKAT GEREKİR" :
                 "✅ STABIL"}
              </AlertTitle>
              <AlertDescription>
                <div className="mt-2">
                  <p className="text-base font-medium">
                    GM = {result.gm.toFixed(3)} m 
                    {result.gm < 0.15 && " - IMO LİMİTİ ALTINDA!"}
                  </p>
                  <p className="text-sm mt-1">
                    {getWeatherRecommendation(result.gm, weatherCondition).message}
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.gm.toFixed(2)}m</div>
                <div className="text-sm text-muted-foreground">GM</div>
                <div className={`text-xs ${result.gm > 0.15 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.gm > 0.15 ? 'Güvenli' : 'Risk'}
                </div>
              </Card>

              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{result.stabilityRange.toFixed(0)}°</div>
                <div className="text-sm text-muted-foreground">Stabilite Aralığı</div>
                <div className="text-xs text-green-600">Pozitif</div>
              </Card>

              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{result.naturalPeriod.toFixed(1)}s</div>
                <div className="text-sm text-muted-foreground">Rulo Periyodu</div>
                <div className={`text-xs ${
                  result.naturalPeriod < 8 ? 'text-red-600' :
                  result.naturalPeriod > 20 ? 'text-orange-600' :
                  'text-green-600'
                }`}>
                  {result.naturalPeriod < 8 ? 'Sert' :
                   result.naturalPeriod > 20 ? 'Yumuşak' :
                   'Normal'}
                </div>
              </Card>

              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{result.deckEdgeAngle.toFixed(0)}°</div>
                <div className="text-sm text-muted-foreground">Güverte Dalma</div>
                <div className="text-xs text-orange-600">Su Alma</div>
              </Card>
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderOperationalContent() {
    const limits = result ? getCriticalLimits(result.gm) : null;
    const weatherRec = result ? getWeatherRecommendation(result.gm, weatherCondition) : null;

    return (
      <div className="space-y-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Operasyonel Stabilite Kontrolleri</AlertTitle>
          <AlertDescription>
            Günlük operasyonlar için kritik limitler ve tavsiyeleri buradan takip edin.
          </AlertDescription>
        </Alert>

        {result && (
          <>
            {/* Critical Limits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  Kritik Limitler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <span className="font-medium">Maksimum Güvenli Yatılma:</span>
                      <Badge className="bg-green-100 text-green-800">{limits?.maxSafeHeel}°</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <span className="font-medium">Hava Koşulları Limiti:</span>
                      <Badge className="bg-yellow-100 text-yellow-800">{limits?.weatherLimit}°</Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <span className="font-medium">Kargo Operasyon Limiti:</span>
                      <Badge className="bg-blue-100 text-blue-800">{limits?.cargoOperationLimit}°</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                      <span className="font-medium">Acil Durum Limiti:</span>
                      <Badge className="bg-red-100 text-red-800">{limits?.emergencyLimit}°</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weather Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waves className="h-5 w-5" />
                  Hava Durumu Değerlendirmesi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg ${
                  weatherRec?.status === 'safe' ? 'bg-green-50 dark:bg-green-950 border-green-200' :
                  weatherRec?.status === 'caution' ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200' :
                  weatherRec?.status === 'warning' ? 'bg-orange-50 dark:bg-orange-950 border-orange-200' :
                  'bg-red-50 dark:bg-red-950 border-red-200'
                } border`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`text-xl ${
                      weatherRec?.status === 'safe' ? 'text-green-600' :
                      weatherRec?.status === 'caution' ? 'text-yellow-600' :
                      weatherRec?.status === 'warning' ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {weatherRec?.status === 'safe' ? '✅' :
                       weatherRec?.status === 'caution' ? '⚠️' :
                       weatherRec?.status === 'warning' ? '🟠' :
                       '🚨'}
                    </div>
                    <div>
                      <h3 className="font-semibold">SS {weatherCondition} - {weatherRec?.message}</h3>
                      <p className="text-sm text-muted-foreground">GM: {result.gm.toFixed(3)}m</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong>Tavsiye Edilen Seyir Hızı:</strong>
                        <div className="text-muted-foreground">
                          {weatherCondition <= 3 ? "Normal hız" :
                           weatherCondition <= 6 ? "Azaltılmış hız" :
                           "Minimum güvenli hız"}
                        </div>
                      </div>
                      <div>
                        <strong>Köprü Vardiyası:</strong>
                        <div className="text-muted-foreground">
                          {weatherCondition <= 4 ? "Normal vardiya" :
                           weatherCondition <= 6 ? "Artırılmış vardiya" :
                           "Sürekli vardiya"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ballast Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Ballast Transfer Önerileri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.gm < 0.3 && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Acil Ballast Transfer Gerekli</AlertTitle>
                      <AlertDescription>
                        GM çok düşük! Alt tanklara ballast alınması önerilir.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold mb-2">GM Artırmak İçin:</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Alt tanklara ballast al</li>
                        <li>• Üst güverteden yük boşalt</li>
                        <li>• Fuel oil transferi yap</li>
                      </ul>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold mb-2">GM Azaltmak İçin:</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Üst tanklara ballast al</li>
                        <li>• Alt ballast boşalt</li>
                        <li>• Üst güverteye yük al</li>
                      </ul>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-semibold mb-2">Serbest Yüzey:</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Tankları tam doldur</li>
                        <li>• Boş tankları tamamen boşalt</li>
                        <li>• Slack tankları önle</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    );
  }

  function renderEmergencyContent() {
    return (
      <div className="space-y-6">
        <Alert variant="destructive" className="border-red-500">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-lg">🚨 ACİL DURUM PROSEDÜRLERİ</AlertTitle>
          <AlertDescription>
            Stabilite kaybı durumunda derhal uygulanması gereken acil prosedürler.
          </AlertDescription>
        </Alert>

        {/* Emergency Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-red-200">
            <CardHeader className="bg-red-50 dark:bg-red-950">
              <CardTitle className="text-red-800 dark:text-red-200">
                🚨 İMEDİAT ACTİON (0-5 dk)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                  <div>
                    <strong>General Alarm</strong>
                    <p className="text-muted-foreground">Tüm mürettebatı uyar</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                  <div>
                    <strong>Hızı Azalt</strong>
                    <p className="text-muted-foreground">Dead slow / Stop engine</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                  <div>
                    <strong>Kurs Değiştir</strong>
                    <p className="text-muted-foreground">Dalgalara pruva al</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
                  <div>
                    <strong>Mayday Call</strong>
                    <p className="text-muted-foreground">VHF Ch 16 / DSC</p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="bg-orange-50 dark:bg-orange-950">
              <CardTitle className="text-orange-800 dark:text-orange-200">
                ⚠️ CORRECTIVE ACTION (5-30 dk)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                  <div>
                    <strong>Ballast Transfer</strong>
                    <p className="text-muted-foreground">Alt tanklara hızla ballast al</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                  <div>
                    <strong>Yük Güvenliği</strong>
                    <p className="text-muted-foreground">Loose cargo'yu sağlamlaştır</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                  <div>
                    <strong>Su Alma Kontrolü</strong>
                    <p className="text-muted-foreground">Watertight doors'ları kapat</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
                  <div>
                    <strong>Lifeboat Prep</strong>
                    <p className="text-muted-foreground">Lifeboats'ları hazırla</p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Calculations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Acil Durum Hesaplama Araçları
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Ballast Transfer Hesaplama</h4>
                <div className="space-y-3">
                  <div>
                    <Label>Hedef GM (m)</Label>
                    <Input type="number" step="0.1" defaultValue="0.5" />
                  </div>
                  <div>
                    <Label>Mevcut GM (m)</Label>
                    <Input type="number" value={result?.gm.toFixed(3) || "0"} disabled />
                  </div>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Gerekli Ballast Miktarını Hesapla
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Güvenli Liman Mesafesi</h4>
                <div className="space-y-3">
                  <div>
                    <Label>Mevcut Pozisyon</Label>
                    <Input placeholder="Lat, Lon" />
                  </div>
                  <div>
                    <Label>Ortalama Hız (knot)</Label>
                    <Input type="number" defaultValue="8" />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    En Yakın Güvenli Limanı Bul
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Acil Durum İletişim
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg text-center">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">MRCC</h4>
                <p className="text-sm">VHF Channel 16</p>
                <p className="text-sm">DSC: 002191001</p>
                <Button size="sm" className="mt-2 bg-red-600 hover:bg-red-700">
                  Hemen Ara
                </Button>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Port Control</h4>
                <p className="text-sm">VHF Channel 12</p>
                <p className="text-sm">Tel: +90-XXX-XXX</p>
                <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                  İletişim Kur
                </Button>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg text-center">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Company</h4>
                <p className="text-sm">24/7 Hotline</p>
                <p className="text-sm">emergency@company.com</p>
                <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700">
                  Bildir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Status Summary */}
        {result && (
          <Alert className={`${
            result.gm < 0.15 ? "border-red-500 bg-red-50 dark:bg-red-950" :
            result.gm < 0.5 ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950" :
            "border-green-500 bg-green-50 dark:bg-green-950"
          }`}>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Mevcut Stabilite Durumu</AlertTitle>
            <AlertDescription>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                <div>
                  <div className="font-semibold">GM</div>
                  <div className="text-lg">{result.gm.toFixed(3)}m</div>
                </div>
                <div>
                  <div className="font-semibold">Hava Durumu</div>
                  <div className="text-lg">SS {weatherCondition}</div>
                </div>
                <div>
                  <div className="font-semibold">Risk Seviyesi</div>
                  <div className="text-lg">
                    {result.gm < 0.15 ? "YÜKSEK" :
                     result.gm < 0.5 ? "ORTA" :
                     "DÜŞÜK"}
                  </div>
                </div>
                <div>
                  <div className="font-semibold">Tavsiye</div>
                  <div className="text-lg">
                    {result.gm < 0.15 ? "ACİL EYLEM" :
                     result.gm < 0.5 ? "DİKKATLİ" :
                     "NORMAL"}
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  function renderCalculationsContent() {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Enine Stabilite Hesaplamaları
            </CardTitle>
            <CardDescription>
              Moment alımı, bilinmeyen ağırlık, meyil derecesi ve diğer hesaplamalar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Moment Alımı */}
              <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    📊 Moment Alımı
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Ağırlık (ton)</Label>
                    <Input 
                      type="number" 
                      value={momentWeight} 
                      onChange={(e) => setMomentWeight(parseFloat(e.target.value) || 0)}
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <Label>Mesafe (m)</Label>
                    <Input 
                      type="number" 
                      value={momentDistance} 
                      onChange={(e) => setMomentDistance(parseFloat(e.target.value) || 0)}
                      placeholder="5"
                    />
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => calculateMoment()}
                  >
                    Moment Hesapla
                  </Button>
                  {momentWeight > 0 && momentDistance > 0 && (
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <p className="font-semibold">Sonuç:</p>
                      <p>Moment: {(momentWeight * momentDistance).toFixed(1)} ton·m</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Bilinmeyen Ağırlık */}
              <Card className="border-green-200 bg-green-50 dark:bg-green-950">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Search className="h-5 w-5 text-green-600" />
                    🔍 Bilinmeyen Ağırlık
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Mevcut GM (m)</Label>
                    <Input 
                      type="number" 
                      value={unknownWeight} 
                      onChange={(e) => setUnknownWeight(parseFloat(e.target.value) || 0)}
                      placeholder="0.5"
                    />
                  </div>
                  <div>
                    <Label>Hedef GM (m)</Label>
                    <Input 
                      type="number" 
                      value={heelAngle} 
                      onChange={(e) => setHeelAngle(parseFloat(e.target.value) || 0)}
                      placeholder="0.8"
                    />
                  </div>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => calculateUnknownWeight()}
                  >
                    Ağırlık Hesapla
                  </Button>
                  {unknownWeight > 0 && heelAngle > 0 && (
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                      <p className="font-semibold">Sonuç:</p>
                      <p>Gerekli ağırlık: {((heelAngle - unknownWeight) * 1000).toFixed(1)} ton</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Meyil Derecesi */}
              <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <RotateCcw className="h-5 w-5 text-purple-600" />
                    📐 Meyil Derecesi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Moment (ton·m)</Label>
                    <Input 
                      type="number" 
                      value={craneWeight} 
                      onChange={(e) => setCraneWeight(parseFloat(e.target.value) || 0)}
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <Label>Deplasman (ton)</Label>
                    <Input 
                      type="number" 
                      value={craneDistance} 
                      onChange={(e) => setCraneDistance(parseFloat(e.target.value) || 0)}
                      placeholder="10000"
                    />
                  </div>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => calculateHeelAngle()}
                  >
                    Meyil Açısı Hesapla
                  </Button>
                  {craneWeight > 0 && craneDistance > 0 && (
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <p className="font-semibold">Sonuç:</p>
                      <p>Meyil açısı: {(Math.atan(craneWeight / (craneDistance * 9.81)) * (180/Math.PI)).toFixed(1)}°</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Kren Operasyonu */}
              <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Anchor className="h-5 w-5 text-orange-600" />
                    🏗️ Kren Operasyonu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Kren Ağırlığı (ton)</Label>
                    <Input 
                      type="number" 
                      value={dryDockGM} 
                      onChange={(e) => setDryDockGM(parseFloat(e.target.value) || 0)}
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <Label>Kren Mesafesi (m)</Label>
                    <Input 
                      type="number" 
                      value={dryDockDraft} 
                      onChange={(e) => setDryDockDraft(parseFloat(e.target.value) || 0)}
                      placeholder="20"
                    />
                  </div>
                  <Button 
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    onClick={() => calculateCraneGM()}
                  >
                    GM-KG Hesapla
                  </Button>
                  {dryDockGM > 0 && dryDockDraft > 0 && (
                    <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                      <p className="font-semibold">Sonuç:</p>
                      <p>GM değişimi: {((dryDockGM * dryDockDraft) / 10000).toFixed(3)}m</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Havuzlama */}
              <Card className="border-red-200 bg-red-50 dark:bg-red-950">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Ship className="h-5 w-5 text-red-600" />
                    🚢 Havuzlama
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Mevcut GM (m)</Label>
                    <Input 
                      type="number" 
                      value={momentWeight} 
                      onChange={(e) => setMomentWeight(parseFloat(e.target.value) || 0)}
                      placeholder="0.3"
                    />
                  </div>
                  <div>
                                          <Label>Havuz Derinliği (m)</Label>
                    <Input 
                      type="number" 
                      value={momentDistance} 
                      onChange={(e) => setMomentDistance(parseFloat(e.target.value) || 0)}
                      placeholder="8"
                    />
                  </div>
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => calculateDryDockGM()}
                  >
                    Kritik GM Hesapla
                  </Button>
                  {momentWeight > 0 && momentDistance > 0 && (
                    <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                      <p className="font-semibold">Sonuç:</p>
                      <p>Kritik GM: {(momentWeight * 0.8).toFixed(3)}m</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}