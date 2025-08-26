import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Gauge, Ruler, Timer, Waves, BookOpen, Calculator, Lightbulb, GraduationCap, HelpCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, useRef, useState } from "react";
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
  const [studentMode, setStudentMode] = useState<boolean>(true);
  const [showStepByStep, setShowStepByStep] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [learningProgress, setLearningProgress] = useState<number>(0);
  const [officerMode, setOfficerMode] = useState<boolean>(false);
  const [selectedShipType, setSelectedShipType] = useState<string>("cargo");
  const [weatherCondition, setWeatherCondition] = useState<number>(3);
  const [urgentCalculation, setUrgentCalculation] = useState<boolean>(false);

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
            <label className="flex items-center gap-2 cursor-pointer">
              <Switch 
                checked={!studentMode} 
                onCheckedChange={(checked) => {
                  setStudentMode(!checked);
                  setOfficerMode(checked);
                  if (checked) {
                    setActiveTab("officer");
                  } else {
                    setActiveTab("learn");
                  }
                }}
              />
              <span className="text-sm font-medium">
                {studentMode ? "Öğrenci" : "Zabit"} Modu
              </span>
            </label>
            <Badge variant={!studentMode ? "default" : "secondary"} className="gap-2">
              {studentMode ? <GraduationCap className="h-4 w-4" /> : <Timer className="h-4 w-4" />}
              {studentMode ? "Öğrenci" : "Profesyonel"}
            </Badge>
          </div>
          {studentMode && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">İlerleme:</span>
              <Progress value={learningProgress} className="w-20" />
              <span className="text-sm font-medium">{learningProgress}%</span>
            </div>
          )}
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
            <TabsList className={`grid w-full ${studentMode ? 'grid-cols-4' : 'grid-cols-3'}`}>
              {studentMode ? (
                <>
                  <TabsTrigger value="learn" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Öğren
                  </TabsTrigger>
                  <TabsTrigger value="calculator" className="gap-2">
                    <Calculator className="h-4 w-4" />
                    Hesapla
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
                  Gemi yatırıldığında kendini düzeltmeye çalışır. GM > 0 olmalıdır.
                </p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Negatif Stabilite</h4>
                <p className="text-sm text-red-800 dark:text-red-200">
                  Gemi yatırıldığında daha da yatmaya devam eder. GM < 0 - Tehlikeli!
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
                  <h4 className="font-semibold text-green-800 dark:text-green-200">GM > 1.0m</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">Sert stabilite - hızlı düzeltme ama rahatsız</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200">0.15m < GM < 1.0m</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Optimal aralık - rahat ve güvenli</p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                  <h4 className="font-semibold text-red-800 dark:text-red-200">GM < 0.15m</h4>
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
    return (
      <div className="space-y-6">
        <Alert>
          <HelpCircle className="h-4 w-4" />
          <AlertTitle>Pratik Alıştırmalar</AlertTitle>
          <AlertDescription>
            Aşağıdaki senaryoları inceleyerek enine stabilite kavramlarını pekiştirin.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🚢 Senaryo 1: Kargo Gemisi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm"><strong>Durum:</strong> 180m kargo gemisi, yükleme sonrası GM = 0.8m</p>
                  <p className="text-sm mt-2"><strong>Soru:</strong> Bu GM değeri güvenli midir?</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setGeometry({
                      length: 180,
                      breadth: 30,
                      depth: 18,
                      draft: 12,
                      blockCoefficient: 0.75,
                      waterplaneCoefficient: 0.85,
                      midshipCoefficient: 0.98,
                      prismaticCoefficient: 0.77,
                      verticalPrismaticCoefficient: 0.75,
                    });
                    setKg(15);
                    setActiveTab("calculator");
                  }}
                >
                  Senaryoyu Çöz
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">⛽ Senaryo 2: Yakıt Tüketimi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <p className="text-sm"><strong>Durum:</strong> Seyir sırasında yakıt tüketimi KG'yi nasıl etkiler?</p>
                  <p className="text-sm mt-2"><strong>Soru:</strong> Alt tanklardan yakıt tüketilirse GM artar mı?</p>
                </div>
                <Button variant="outline" className="w-full">
                  Cevabı Öğren
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>🏆 Bilgi Testi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
                <h4 className="font-semibold">Soru 1: GM'nin artması ne anlama gelir?</h4>
                <div className="mt-3 space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="q1" value="a" />
                    <span className="text-sm">A) Gemi daha hızlı gider</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="q1" value="b" />
                    <span className="text-sm">B) Stabilite sertleşir</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="q1" value="c" />
                    <span className="text-sm">C) Yakıt tüketimi azalır</span>
                  </label>
                </div>
              </div>

              <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
                <h4 className="font-semibold">Soru 2: Serbest yüzey etkisi nedir?</h4>
                <div className="mt-3 space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="q2" value="a" />
                    <span className="text-sm">A) KG'yi azaltır</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="q2" value="b" />
                    <span className="text-sm">B) KG'yi arttırır (sanal)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="q2" value="c" />
                    <span className="text-sm">C) GM'yi etkilemez</span>
                  </label>
                </div>
              </div>

              <Button className="w-full">
                Cevapları Kontrol Et
              </Button>
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
}