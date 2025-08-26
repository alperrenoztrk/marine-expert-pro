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
          <Badge variant={studentMode ? "default" : "secondary"} className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Öğrenci Modu
          </Badge>
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
            <TabsList className="grid w-full grid-cols-4">
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
}