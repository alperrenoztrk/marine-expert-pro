import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Gauge, Activity, TrendingUp, Ruler, BookOpen, Calculator, Lightbulb, GraduationCap, HelpCircle, CheckCircle, AlertTriangle, Timer, Waves, Ship, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, useRef, useState } from "react";
import { HydrostaticUtils } from "@/utils/hydrostaticUtils";
import { ShipGeometry } from "@/types/hydrostatic";
import { HydrostaticCalculations } from "@/services/hydrostaticCalculations";
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

export default function StabilityLongitudinal() {
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
  const [angle, setAngle] = useState<number>(20);
  const [result, setResult] = useState<{ gz: number; rightingMoment: number; stabilityIndex: number } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("calculator");
  const [studentMode, setStudentMode] = useState<boolean>(true);
  const [showStepByStep, setShowStepByStep] = useState<boolean>(false);
  const [learningProgress, setLearningProgress] = useState<number>(0);
  const [officerMode, setOfficerMode] = useState<boolean>(false);
  const [selectedShipType, setSelectedShipType] = useState<string>("cargo");
  const [loadCondition, setLoadCondition] = useState<string>("loaded");
  const [trimCondition, setTrimCondition] = useState<number>(0);
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [scenario2Answer, setScenario2Answer] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: string}>({});
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);
  
  // Longitudinal stability example data
  const exampleData = {
    length: 180,
    breadth: 30,
    depth: 18,
    draft: 12,
    blockCoefficient: 0.75,
    waterplaneCoefficient: 0.85,
    midshipCoefficient: 0.98,
    prismaticCoefficient: 0.77,
    verticalPrismaticCoefficient: 0.75,
    kg: 13.5
  };

  const handleChange = (key: keyof ShipGeometry) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setGeometry((prev) => ({ ...prev, [key]: isNaN(value) ? 0 : value }));
  };

  const loadExampleData = () => {
    setGeometry(exampleData);
    setKg(exampleData.kg);
    setAngle(20);
    setErrors([]);
    setResult(null);
  };

  const handleCalculate = () => {
    const v = HydrostaticUtils.validateShipGeometry(geometry);
    setErrors(v.errors);
    if (!v.isValid) {
      setResult(null);
      return;
    }
    const res = HydrostaticUtils.calculateLargeAngleStability(geometry, kg, angle);
    setResult(res);
  };

  const shipPresets = {
    cargo: {
      name: "Kargo Gemisi",
      geometry: { length: 180, breadth: 30, depth: 18, draft: 12, blockCoefficient: 0.75, waterplaneCoefficient: 0.85, midshipCoefficient: 0.98, prismaticCoefficient: 0.77, verticalPrismaticCoefficient: 0.75 },
      kg: 15,
      lcg: 88, // ~L/2 - slightly aft
      vcg: 15
    },
    container: {
      name: "Konteyner Gemisi", 
      geometry: { length: 200, breadth: 32, depth: 20, draft: 13, blockCoefficient: 0.65, waterplaneCoefficient: 0.82, midshipCoefficient: 0.95, prismaticCoefficient: 0.68, verticalPrismaticCoefficient: 0.70 },
      kg: 16,
      lcg: 95,
      vcg: 16
    },
    tanker: {
      name: "Tanker",
      geometry: { length: 250, breadth: 44, depth: 22, draft: 16, blockCoefficient: 0.82, waterplaneCoefficient: 0.90, midshipCoefficient: 0.99, prismaticCoefficient: 0.83, verticalPrismaticCoefficient: 0.80 },
      kg: 14,
      lcg: 125,
      vcg: 14
    },
    bulk: {
      name: "Dökme Yük Gemisi",
      geometry: { length: 190, breadth: 32, depth: 20, draft: 14, blockCoefficient: 0.78, waterplaneCoefficient: 0.88, midshipCoefficient: 0.98, prismaticCoefficient: 0.80, verticalPrismaticCoefficient: 0.77 },
      kg: 16,
      lcg: 92,
      vcg: 16
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

  const calculateTrimData = () => {
    if (!result) return null;
    const centers = HydrostaticCalculations.calculateCenterPoints(geometry, kg);
    const displacement = geometry.length * geometry.breadth * geometry.draft * geometry.blockCoefficient * 1.025;
    
    // Basic trim calculations
    const lcf = geometry.length * 0.485; // Approx LCF
    const lcg = geometry.length * 0.485; // Approx LCG for current condition
    const mct = (displacement * centers.gml * Math.pow(geometry.breadth, 2)) / (12 * geometry.length); // MCT approximation
    
    return {
      displacement,
      lcf,
      lcg,
      mct,
      gml: centers.gml,
      trimMoment: displacement * (lcg - lcf),
      trimAngle: trimCondition
    };
  };

  const getTrimRecommendation = (trimAngle: number) => {
    const absTrim = Math.abs(trimAngle);
    if (absTrim < 0.5) return { status: "good", message: "Optimal trim - iyi dengeleme" };
    if (absTrim < 1.0) return { status: "acceptable", message: "Kabul edilebilir trim" };
    if (absTrim < 2.0) return { status: "caution", message: "Dikkat - trim fazla" };
    return { status: "warning", message: "Kritik trim - düzeltme gerekli" };
  };

  const getOperationalLimits = () => {
    return {
      maxTrimByHead: -2.0,  // metres
      maxTrimByStern: 3.0,  // metres  
      optimalTrimRange: [-0.5, 1.0], // metres
      maxList: 5.0, // degrees
      cargoOperationLimit: 1.5 // metres trim
    };
  };

  const chartData = useMemo(() => {
    const points = HydrostaticCalculations.generateGZCurve(geometry, kg, 0, 90, 1);
    return points.map((p) => ({ angle: p.angle, gz: Number(p.gz.toFixed(3)) }));
  }, [geometry, kg]);
  const centers = useMemo(() => HydrostaticCalculations.calculateCenterPoints(geometry, kg), [geometry, kg]);

  const handleExportPng = async () => {
    if (chartRef.current) await exportNodeToPng(chartRef.current, 'gz-longitudinal.png');
  };

  const handleExportCsv = () => {
    exportToCsv(chartData.map((d) => ({ angle: d.angle, gz: d.gz })), 'gz-longitudinal.csv');
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
              {studentMode ? <GraduationCap className="h-4 w-4" /> : <Ship className="h-4 w-4" />}
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
            <TrendingUp className="h-5 w-5" />
            Boyuna Stabilite ve Trim Hesaplamaları
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
                    <Ship className="h-4 w-4" />
                    Trim Kontrolü
                  </TabsTrigger>
                  <TabsTrigger value="loading" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Yükleme
                  </TabsTrigger>
                  <TabsTrigger value="emergency" className="gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Acil Trim
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
              {renderOfficerTrimControl()}
            </TabsContent>

            <TabsContent value="loading" className="space-y-4 mt-6">
              {renderLoadingOperations()}
            </TabsContent>

            <TabsContent value="emergency" className="space-y-4 mt-6">
              {renderEmergencyTrim()}
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
          <AlertTitle>Boyuna Stabilite Nedir?</AlertTitle>
          <AlertDescription className="space-y-3 mt-3">
            <p>
              <strong>Boyuna stabilite</strong>, geminin boyuna ekseni etrafındaki dengesidir. 
              Trim ve list kontrolü için kritik önem taşır.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Trim Kontrolü</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Baş-kıç dengesi. Trim = (T_kıç - T_baş) / LBP
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">List Kontrolü</h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Sancak-iskele dengesi. Yük dağılımı ile kontrol edilir.
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
                  <h4 className="font-medium">1. Adım: Trim Kavramını Anlayın</h4>
                  <p className="text-sm text-muted-foreground">Baş ve kıç draft farkının LBP'ye oranı</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">2</div>
                <div>
                  <h4 className="font-medium">2. Adım: LCG ve LCF İlişkisini Öğrenin</h4>
                  <p className="text-sm text-muted-foreground">Ağırlık merkezi ile flotasyon merkezi arasındaki mesafe</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
                <div className="h-5 w-5 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs">3</div>
                <div>
                  <h4 className="font-medium">3. Adım: MCT Hesaplayın</h4>
                  <p className="text-sm text-muted-foreground">Moment to Change Trim - 1cm trim değişimi için gereken moment</p>
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
                Adım Adım Trim Hesaplama
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>Öğrenci İpucu</AlertTitle>
                  <AlertDescription>
                    Trim hesaplaması için LCG ve LCF konumları kritiktir. 
                    MCT değeri ile trim değişimi hesaplanabilir.
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
              <CardTitle className="text-lg">📊 Form Katsayıları & Trim</CardTitle>
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
                  KG (m) - Ağırlık Merkezi
                  <Badge variant="outline" className="text-xs">Critical!</Badge>
                </Label>
                <Input type="number" step="0.01" value={kg} onChange={(e) => setKg(parseFloat(e.target.value))} />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  Trim Açısı (°)
                  <Badge variant="outline" className="text-xs">Test Angle</Badge>
                </Label>
                <Input type="number" step="1" value={angle} onChange={(e) => setAngle(parseFloat(e.target.value))} />
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
          <Button variant="secondary" onClick={loadExampleData}>
            Örnek Veri Yükle
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
                  <p><strong>Trim Analizi:</strong></p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm">
                        <strong>GM Boyuna = {centers.gml.toFixed(3)} m</strong>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Boyuna stabilite kalitesi
                      </p>
                    </div>
                    <div>
                      <p className="text-sm">
                        <strong>GZ = {result.gz.toFixed(3)} m</strong>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {angle}° açıdaki düzeltici kol
                      </p>
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            <div ref={chartRef}>
              <Card>
                <CardHeader>
                  <CardTitle>GZ Eğrisi (Boyuna Stabilite)</CardTitle>
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
                    <div className="text-sm text-muted-foreground">GZ (Düzeltici Kol)</div>
                    <div className="text-2xl font-bold">{result.gz.toFixed(3)} m</div>
                    <div className="text-xs text-muted-foreground mt-1">{angle}° açıda</div>
                  </div>
                  <Gauge className="h-8 w-8 text-blue-500" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Düzeltici Moment</div>
                    <div className="text-2xl font-bold">{result.rightingMoment.toFixed(0)} kNm</div>
                    <div className="text-xs text-muted-foreground mt-1">Righting moment</div>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Stabilite İndeksi</div>
                    <div className="text-2xl font-bold">{result.stabilityIndex.toFixed(3)}</div>
                    <div className="text-xs text-muted-foreground mt-1">Stability index</div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">GM Boyuna</div>
                    <div className="text-2xl font-bold">{centers.gml.toFixed(2)} m</div>
                    <div className="text-xs text-muted-foreground mt-1">Longitudinal GM</div>
                  </div>
                  <Ruler className="h-8 w-8 text-orange-500" />
                </div>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>📈 Trim Hesaplama Özeti</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Deplasman</div>
                    <div>{(geometry.length * geometry.breadth * geometry.draft * geometry.blockCoefficient * 1.025).toFixed(0)} ton</div>
                  </div>
                  <div>
                    <div className="font-medium">LCG (yaklaşık)</div>
                    <div>{(geometry.length * 0.485).toFixed(1)} m</div>
                  </div>
                  <div>
                    <div className="font-medium">Test Açısı</div>
                    <div>{angle}°</div>
                  </div>
                  <div>
                    <div className="font-medium">GM Boyuna</div>
                    <div>{centers.gml.toFixed(2)} m</div>
                  </div>
                </div>
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
                Trim Nedir?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>Trim</strong>, geminin baş ve kıç draft farkıdır. Pozitif trim kıçtan bastık demektir.
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200">Pozitif Trim</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">Kıç drafı &gt; Baş drafı - Kıçtan bastık</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200">Negatif Trim</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Baş drafı &gt; Kıç drafı - Baştan bastık</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">Even Keel</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Baş = Kıç draft - Düz trim</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                MCT (Moment to Change Trim)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>MCT</strong>, 1 cm trim değişimi için gereken momenttir.
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500">
                  <h4 className="font-semibold">MCT Formülü</h4>
                  <p className="text-sm font-mono">MCT = (Δ × GML × B²) / (12 × L)</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950 border-l-4 border-green-500">
                  <h4 className="font-semibold">Trim Değişimi</h4>
                  <p className="text-sm font-mono">ΔTrim = (W × d) / MCT</p>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-950 border-l-4 border-orange-500">
                  <h4 className="font-semibold">Trim Tanımı</h4>
                  <p className="text-sm font-mono">Trim = (T_kıç - T_baş) / LBP</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>📚 Boyuna Stabilite Terimleri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">LCG - Longitudinal Center of Gravity</h4>
                  <p className="text-sm text-muted-foreground">Geminin boyuna ağırlık merkezi konumu</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">LCF - Longitudinal Center of Flotation</h4>
                  <p className="text-sm text-muted-foreground">Su çizgisi alanının merkezi - trim ekseni</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">GML - Longitudinal Metacentric Height</h4>
                  <p className="text-sm text-muted-foreground">Boyuna metasentrik yükseklik</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">TPC - Tonnes Per Centimeter</h4>
                  <p className="text-sm text-muted-foreground">1 cm batma için gereken ağırlık</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Trim Moment</h4>
                  <p className="text-sm text-muted-foreground">Trim yaratan moment = W × (LCG - LCF)</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">List</h4>
                  <p className="text-sm text-muted-foreground">Sancak-iskele yönündeki eğilme açısı</p>
                </div>
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
            Boyuna stabilite ve trim hesaplamalarını pekiştirmek için senaryoları çözün.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🚢 Senaryo 1: Kargo Yükleme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm"><strong>Durum:</strong> Hold 1'e 500 ton kargo yüklendi. Trim nasıl değişir?</p>
                  <p className="text-sm mt-2"><strong>Soru:</strong> MCT = 250 tm/cm ise trim değişimi nedir?</p>
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
                  <p className="text-sm"><strong>Durum:</strong> Kıç tanktan 50 ton yakıt tüketildi.</p>
                  <p className="text-sm mt-2"><strong>Soru:</strong> Trim nasıl değişir?</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setScenario2Answer(!scenario2Answer)}
                >
                  {scenario2Answer ? "Cevabı Gizle" : "Cevabı Öğren"}
                </Button>
                {scenario2Answer && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">📚 Doğru Cevap:</h4>
                    <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                      <strong>Trim AZALIR (başa doğru)!</strong> Kıç tanktan yakıt tüketildiğinde:
                    </p>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 ml-4">
                      <li>• Kıç ağırlığı azalır</li>
                      <li>• LCG öne doğru kayar</li>
                      <li>• Trim moment = Δ × (LCG - LCF) azalır</li>
                      <li>• Sonuç: Daha az kıç trim, hatta baş trim olabilir</li>
                    </ul>
                    <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900 rounded">
                      <p className="text-xs font-mono">ΔTrim = (Yakıt_ağırlığı × Kıç_mesafesi) / MCT</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>🏆 Trim Hesaplama Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
                <h4 className="font-semibold">Soru 1: Pozitif trim ne demektir?</h4>
                <div className="mt-3 space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="q1" value="a" />
                    <span className="text-sm">A) Baş draft &gt; Kıç draft</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="q1" value="b" />
                    <span className="text-sm">B) Kıç draft &gt; Baş draft</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="q1" value="c" />
                    <span className="text-sm">C) Baş draft = Kıç draft</span>
                  </label>
                </div>
              </div>

              <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
                <h4 className="font-semibold">Soru 2: MCT formülü nedir?</h4>
                <div className="mt-3 space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="q2" value="a" />
                    <span className="text-sm">A) MCT = Δ × GML / L</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="q2" value="b" />
                    <span className="text-sm">B) MCT = (Δ × GML × B²) / (12 × L)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="q2" value="c" />
                    <span className="text-sm">C) MCT = W × d</span>
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

  function renderOfficerTrimControl() {
    const trimData = calculateTrimData();
    const trimRec = trimData ? getTrimRecommendation(trimData.trimAngle) : null;
    const limits = getOperationalLimits();

    return (
      <div className="space-y-6">
        {/* Quick Ship Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Ship className="h-5 w-5" />
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
                <Settings className="h-5 w-5" />
                Yükleme Durumu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Yükleme Durumu</Label>
                <Select value={loadCondition} onValueChange={setLoadCondition}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ballast">Ballast</SelectItem>
                    <SelectItem value="partial">Kısmi Yüklü</SelectItem>
                    <SelectItem value="loaded">Tam Yüklü</SelectItem>
                    <SelectItem value="heavy">Ağır Yüklü</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Mevcut Trim (m)</Label>
                <Input 
                  type="number" 
                  step="0.1" 
                  value={trimCondition} 
                  onChange={(e) => setTrimCondition(parseFloat(e.target.value))}
                  placeholder="Pozitif = Kıçtan bastık"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Trim Controls */}
        <Card>
          <CardHeader>
            <CardTitle>⚡ Hızlı Trim Kontrol</CardTitle>
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
                <Label>Test Açısı (°)</Label>
                <Input 
                  type="number" 
                  step="1" 
                  value={angle} 
                  onChange={(e) => setAngle(parseFloat(e.target.value))}
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
        {result && trimData && (
          <div className="space-y-4">
            {/* Critical Status */}
            <Alert className={`${
              Math.abs(trimCondition) > 2.0 ? "border-red-500 bg-red-50 dark:bg-red-950" :
              Math.abs(trimCondition) > 1.0 ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950" :
              "border-green-500 bg-green-50 dark:bg-green-950"
            }`}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-lg">
                {Math.abs(trimCondition) > 2.0 ? "🚨 KRİTİK TRİM" :
                 Math.abs(trimCondition) > 1.0 ? "⚠️ FAZLA TRİM" :
                 "✅ OPTİMAL TRİM"}
              </AlertTitle>
              <AlertDescription>
                <div className="mt-2">
                  <p className="text-base font-medium">
                    Trim = {trimCondition.toFixed(2)} m 
                    {trimCondition > 0 ? " (Kıçtan bastık)" : trimCondition < 0 ? " (Baştan bastık)" : " (Even keel)"}
                  </p>
                  <p className="text-sm mt-1">
                    {trimRec?.message}
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{trimData.gml.toFixed(2)}m</div>
                <div className="text-sm text-muted-foreground">GM Boyuna</div>
                <div className="text-xs text-green-600">Longitudinal</div>
              </Card>

              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{trimData.mct.toFixed(0)}</div>
                <div className="text-sm text-muted-foreground">MCT (tm/cm)</div>
                <div className="text-xs text-green-600">Moment to change trim</div>
              </Card>

              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{trimCondition.toFixed(2)}m</div>
                <div className="text-sm text-muted-foreground">Mevcut Trim</div>
                <div className={`text-xs ${
                  Math.abs(trimCondition) < 0.5 ? 'text-green-600' :
                  Math.abs(trimCondition) < 2.0 ? 'text-orange-600' :
                  'text-red-600'
                }`}>
                  {Math.abs(trimCondition) < 0.5 ? 'Optimal' :
                   Math.abs(trimCondition) < 2.0 ? 'Dikkat' :
                   'Kritik'}
                </div>
              </Card>

              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{trimData.displacement.toFixed(0)}</div>
                <div className="text-sm text-muted-foreground">Deplasman (ton)</div>
                <div className="text-xs text-orange-600">Current displacement</div>
              </Card>
            </div>

            {/* Operational Limits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  Operasyonel Trim Limitleri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
                    <h4 className="font-semibold text-green-800 dark:text-green-200">Optimal Aralık</h4>
                    <p className="text-lg font-bold">{limits.optimalTrimRange[0]}m ~ {limits.optimalTrimRange[1]}m</p>
                    <p className="text-xs text-muted-foreground">En verimli seyir</p>
                  </div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg text-center">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Maks Kıç Trim</h4>
                    <p className="text-lg font-bold">{limits.maxTrimByStern}m</p>
                    <p className="text-xs text-muted-foreground">Güvenli limit</p>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-center">
                    <h4 className="font-semibold text-red-800 dark:text-red-200">Maks Baş Trim</h4>
                    <p className="text-lg font-bold">{limits.maxTrimByHead}m</p>
                    <p className="text-xs text-muted-foreground">Tehlikeli limit</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  function renderLoadingOperations() {
    return (
      <div className="space-y-6">
        <Alert>
          <Settings className="h-4 w-4" />
          <AlertTitle>Yükleme Operasyonları ve Trim Kontrolü</AlertTitle>
          <AlertDescription>
            Yük operasyonları sırasında trim değişimlerini izleyin ve kontrol edin.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ship className="h-5 w-5" />
                Trim Hesaplama Araçları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Yüklenecek Ağırlık (ton)</Label>
                  <Input type="number" placeholder="500" />
                </div>
                <div>
                  <Label>Yük Konumu (LCG'den uzaklık, m)</Label>
                  <Input type="number" placeholder="20" />
                </div>
                <div>
                  <Label>MCT (tm/cm)</Label>
                  <Input type="number" value={result ? calculateTrimData()?.mct.toFixed(0) || "250" : "250"} disabled />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Trim Değişimini Hesapla
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Ballast Transfer Planı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Hedef Trim (m)</Label>
                  <Input type="number" step="0.1" defaultValue="0.5" />
                </div>
                <div>
                  <Label>Mevcut Trim (m)</Label>
                  <Input type="number" value={trimCondition.toFixed(2)} disabled />
                </div>
                <div>
                  <Label>Ballast Tank Seçimi</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Tank seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fore-peak">Fore Peak Tank</SelectItem>
                      <SelectItem value="aft-peak">Aft Peak Tank</SelectItem>
                      <SelectItem value="no1-db">No.1 Deep Tank</SelectItem>
                      <SelectItem value="no2-db">No.2 Deep Tank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Ballast Planı Oluştur
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>📋 Yükleme Kontrol Listesi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Yükleme Öncesi:</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span className="text-sm">İlk trim durumu kaydet</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span className="text-sm">Draft okumalarını al</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span className="text-sm">Yük dağılım planını kontrol et</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span className="text-sm">MCT değerini hesapla</span>
                  </label>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Yükleme Sırası:</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span className="text-sm">Her hold sonrası trim kontrol</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span className="text-sm">Ballast transfer işlemleri</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span className="text-sm">List kontrolü (max 2°)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span className="text-sm">Final trim hesaplama</span>
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🎯 Trim Optimizasyon Önerileri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 text-green-600">Yakıt Verimliliği İçin</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Hafif kıç trimi (0.5-1.0m)</li>
                  <li>• Even keel'e yakın</li>
                  <li>• Pervane merkezinde optimal akış</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-600">Kötü Hava İçin</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Çok hafif baş trimi</li>
                  <li>• Dalga etkisini azaltır</li>
                  <li>• Slamming'i önler</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 text-orange-600">Port Operasyonları</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Even keel tercih edilir</li>
                  <li>• Crane erişimi optimal</li>
                  <li>• Güvenli ramp kullanımı</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderEmergencyTrim() {
    return (
      <div className="space-y-6">
        <Alert variant="destructive" className="border-red-500">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-lg">🚨 ACİL TRİM DURUMU PROSEDÜRLERİ</AlertTitle>
          <AlertDescription>
            Kritik trim durumlarında uygulanması gereken acil prosedürler.
          </AlertDescription>
        </Alert>

        {/* Emergency Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-red-200">
            <CardHeader className="bg-red-50 dark:bg-red-950">
              <CardTitle className="text-red-800 dark:text-red-200">
                🚨 AŞIRI BAŞ TRİMİ (&lt; -2.0m)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                  <div>
                    <strong>Derhal Hızı Azalt</strong>
                    <p className="text-muted-foreground">Slamming riskini azalt</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                  <div>
                    <strong>Aft Peak'e Ballast Al</strong>
                    <p className="text-muted-foreground">Kıç trim'i artır</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                  <div>
                    <strong>Fore Peak'ten Ballast Ver</strong>
                    <p className="text-muted-foreground">Baş ağırlığını azalt</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
                  <div>
                    <strong>Draft Kontrolü</strong>
                    <p className="text-muted-foreground">Her 30 dakikada bir ölç</p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="bg-orange-50 dark:bg-orange-950">
              <CardTitle className="text-orange-800 dark:text-orange-200">
                ⚠️ AŞIRI KIÇ TRİMİ (&gt; 3.0m)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                  <div>
                    <strong>Pervane Verimliliği Kontrol</strong>
                    <p className="text-muted-foreground">Kavitasyon kontrolü</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                  <div>
                    <strong>Fore Peak'e Ballast Al</strong>
                    <p className="text-muted-foreground">Baş trim'i artır</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                  <div>
                    <strong>Aft Ballast Transfer</strong>
                    <p className="text-muted-foreground">Kıçtan öne ballast transfer</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
                  <div>
                    <strong>Manevra Kabiliyeti Test</strong>
                    <p className="text-muted-foreground">Dümen etkisini kontrol et</p>
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
              Acil Trim Düzeltme Hesaplama
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Ballast Transfer Hesaplama</h4>
                <div className="space-y-3">
                  <div>
                    <Label>Mevcut Trim (m)</Label>
                    <Input type="number" value={trimCondition.toFixed(2)} disabled />
                  </div>
                  <div>
                    <Label>Hedef Trim (m)</Label>
                    <Input type="number" step="0.1" defaultValue="0.5" />
                  </div>
                  <div>
                    <Label>MCT (tm/cm)</Label>
                    <Input type="number" value={result ? calculateTrimData()?.mct.toFixed(0) || "250" : "250"} disabled />
                  </div>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Gerekli Ballast Miktarını Hesapla
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Acil Ballast Transfer Zamanı</h4>
                <div className="space-y-3">
                  <div>
                    <Label>Ballast Pump Kapasitesi (m³/h)</Label>
                    <Input type="number" defaultValue="200" />
                  </div>
                  <div>
                    <Label>Transfer Edilecek Miktar (m³)</Label>
                    <Input type="number" placeholder="Hesaplanacak..." disabled />
                  </div>
                  <div>
                    <Label>Tahmini Süre (dakika)</Label>
                    <Input type="number" placeholder="Hesaplanacak..." disabled />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Transfer Süresini Hesapla
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
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">VTS Center</h4>
                <p className="text-sm">VHF Channel 16</p>
                <p className="text-sm">Traffic Control</p>
                <Button size="sm" className="mt-2 bg-red-600 hover:bg-red-700">
                  Hemen Ara
                </Button>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Port Control</h4>
                <p className="text-sm">VHF Channel 12</p>
                <p className="text-sm">Harbor Master</p>
                <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                  İletişim Kur
                </Button>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg text-center">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Company DPA</h4>
                <p className="text-sm">24/7 Hotline</p>
                <p className="text-sm">Technical Support</p>
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
            Math.abs(trimCondition) > 2.0 ? "border-red-500 bg-red-50 dark:bg-red-950" :
            Math.abs(trimCondition) > 1.0 ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950" :
            "border-green-500 bg-green-50 dark:bg-green-950"
          }`}>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Mevcut Trim Durumu</AlertTitle>
            <AlertDescription>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                <div>
                  <div className="font-semibold">Trim</div>
                  <div className="text-lg">{trimCondition.toFixed(2)}m</div>
                </div>
                <div>
                  <div className="font-semibold">Durum</div>
                  <div className="text-lg">{loadCondition}</div>
                </div>
                <div>
                  <div className="font-semibold">Risk Seviyesi</div>
                  <div className="text-lg">
                    {Math.abs(trimCondition) > 2.0 ? "YÜKSEK" :
                     Math.abs(trimCondition) > 1.0 ? "ORTA" :
                     "DÜŞÜK"}
                  </div>
                </div>
                <div>
                  <div className="font-semibold">Tavsiye</div>
                  <div className="text-lg">
                    {Math.abs(trimCondition) > 2.0 ? "ACİL EYLEM" :
                     Math.abs(trimCondition) > 1.0 ? "DİKKATLİ" :
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