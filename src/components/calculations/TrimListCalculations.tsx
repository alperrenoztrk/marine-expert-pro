import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Ship, TrendingUp, Target, Waves, Package } from "lucide-react";
import { toast } from "sonner";

interface CalculationData {
  // Temel Trim Formülleri
  T_a: number; // Aft draft
  T_f: number; // Forward draft
  L: number; // Length
  delta: number; // Displacement
  GM_L: number; // Longitudinal metacentric height
  B: number; // Breadth
  W: number; // Weight
  d: number; // Distance
  
  // Draft Survey Formülleri
  T_m: number; // Mid draft
  V: number; // Volume
  rho_sw: number; // Seawater density
  A_wp: number; // Waterplane area
  
  // Bonjean Curves
  A_x: number; // Area at station x
  x: number; // Station position
  
  // Sounding Tabloları
  tank_L: number; // Tank length
  tank_B: number; // Tank breadth
  tank_h: number; // Tank height
  r: number; // Tank radius
  theta: number; // Trim angle
  l: number; // Length for trim correction
  
  // List Hesaplamaları
  GM: number; // Metacentric height
}

interface CalculationResults {
  // Temel Trim Formülleri
  trimAngle: number;
  mct: number;
  trimChange: number;
  
  // Draft Survey Formülleri
  meanDraft: number;
  displacement: number;
  tpc: number;
  
  // Bonjean Curves
  underwaterVolume: number;
  lcb: number;
  moment: number;
  
  // Sounding Tabloları
  tankVolumeRect: number;
  tankVolumeCyl: number;
  trimCorrection: number;
  
  // List Hesaplamaları
  listAngle: number;
  listMoment: number;
}

export const TrimListCalculations = () => {
  const [data, setData] = useState<Partial<CalculationData>>({
    rho_sw: 1.025,
    GM: 1.0
  });
  const [results, setResults] = useState<Partial<CalculationResults>>({});
  const [activeTab, setActiveTab] = useState("trim");

  // 📐 Temel Trim Formülleri
  const calculateTrimAngle = () => {
    if (!data.T_a || !data.T_f || !data.L) {
      toast.error("Lütfen T_a, T_f ve L değerlerini girin.");
      return;
    }
    const trimAngle = Math.atan((data.T_a - data.T_f) / data.L) * (180 / Math.PI);
    setResults(prev => ({ ...prev, trimAngle }));
    toast.success(`Trim Açısı: ${trimAngle.toFixed(4)}°`);
  };

  const calculateMCT = () => {
    if (!data.delta || !data.GM_L || !data.B || !data.L) {
      toast.error("Lütfen Δ, GM_L, B ve L değerlerini girin.");
      return;
    }
    const mct = (data.delta * data.GM_L * Math.pow(data.B, 2)) / (12 * data.L);
    setResults(prev => ({ ...prev, mct }));
    toast.success(`MCT: ${mct.toFixed(2)} ton.m/cm`);
  };

  const calculateTrimChange = () => {
    if (!data.W || !data.d || !results.mct) {
      toast.error("Lütfen W, d değerlerini girin ve önce MCT hesaplayın.");
      return;
    }
    const trimChange = (data.W * data.d) / results.mct;
    setResults(prev => ({ ...prev, trimChange }));
    toast.success(`Trim Değişimi: ${trimChange.toFixed(2)} cm`);
  };

  // ⚖️ Draft Survey Formülleri
  const calculateMeanDraft = () => {
    if (!data.T_f || !data.T_m || !data.T_a) {
      toast.error("Lütfen T_f, T_m ve T_a değerlerini girin.");
      return;
    }
    const meanDraft = (data.T_f + 4 * data.T_m + data.T_a) / 6;
    setResults(prev => ({ ...prev, meanDraft }));
    toast.success(`Ortalama Draft: ${meanDraft.toFixed(3)} m`);
  };

  const calculateDisplacement = () => {
    if (!data.V || !data.rho_sw) {
      toast.error("Lütfen V ve ρ_sw değerlerini girin.");
      return;
    }
    const displacement = data.V * data.rho_sw;
    setResults(prev => ({ ...prev, displacement }));
    toast.success(`Deplasman: ${displacement.toFixed(2)} ton`);
  };

  const calculateTPC = () => {
    if (!data.A_wp || !data.rho_sw) {
      toast.error("Lütfen A_wp ve ρ_sw değerlerini girin.");
      return;
    }
    const tpc = (data.A_wp * data.rho_sw) / 100;
    setResults(prev => ({ ...prev, tpc }));
    toast.success(`TPC: ${tpc.toFixed(3)} ton/cm`);
  };

  // 📊 Bonjean Curves
  const calculateUnderwaterVolume = () => {
    if (!data.A_x) {
      toast.error("Lütfen A(x) değerini girin.");
      return;
    }
    // Simplified calculation: V = ∫ A(x) dx ≈ A(x) × dx
    const underwaterVolume = data.A_x * 1; // Assuming dx = 1
    setResults(prev => ({ ...prev, underwaterVolume }));
    toast.success(`Su Altı Hacim: ${underwaterVolume.toFixed(2)} m³`);
  };

  const calculateLCB = () => {
    if (!data.x || !data.A_x || !results.underwaterVolume) {
      toast.error("Lütfen x, A(x) değerlerini girin ve önce Su Altı Hacim hesaplayın.");
      return;
    }
    const lcb = (data.x * data.A_x) / results.underwaterVolume;
    setResults(prev => ({ ...prev, lcb }));
    toast.success(`LCB: ${lcb.toFixed(2)} m`);
  };

  const calculateMoment = () => {
    if (!data.x || !data.A_x) {
      toast.error("Lütfen x ve A(x) değerlerini girin.");
      return;
    }
    const moment = Math.pow(data.x, 2) * data.A_x;
    setResults(prev => ({ ...prev, moment }));
    toast.success(`Moment: ${moment.toFixed(2)} m³`);
  };

  // 🧮 Sounding Tabloları
  const calculateTankVolumeRect = () => {
    if (!data.tank_L || !data.tank_B || !data.tank_h) {
      toast.error("Lütfen tank L, B ve h değerlerini girin.");
      return;
    }
    const tankVolumeRect = data.tank_L * data.tank_B * data.tank_h;
    setResults(prev => ({ ...prev, tankVolumeRect }));
    toast.success(`Dikdörtgen Tank Hacmi: ${tankVolumeRect.toFixed(2)} m³`);
  };

  const calculateTankVolumeCyl = () => {
    if (!data.r || !data.tank_h) {
      toast.error("Lütfen r ve h değerlerini girin.");
      return;
    }
    const tankVolumeCyl = Math.PI * Math.pow(data.r, 2) * data.tank_h;
    setResults(prev => ({ ...prev, tankVolumeCyl }));
    toast.success(`Silindirik Tank Hacmi: ${tankVolumeCyl.toFixed(2)} m³`);
  };

  const calculateTrimCorrection = () => {
    if (!data.tank_L || !data.tank_B || !data.theta || !data.l) {
      toast.error("Lütfen tank boyutları, θ ve l değerlerini girin.");
      return;
    }
    const area = data.tank_L * data.tank_B;
    const trimCorrection = area * Math.tan(data.theta * Math.PI / 180) * data.l;
    setResults(prev => ({ ...prev, trimCorrection }));
    toast.success(`Trim Düzeltmesi: ${trimCorrection.toFixed(2)} m³`);
  };

  // 🌊 List Hesaplamaları
  const calculateListAngle = () => {
    if (!data.W || !data.d || !data.delta || !data.GM) {
      toast.error("Lütfen W, d, Δ ve GM değerlerini girin.");
      return;
    }
    const listAngle = Math.atan((data.W * data.d) / (data.delta * data.GM)) * (180 / Math.PI);
    setResults(prev => ({ ...prev, listAngle }));
    toast.success(`List Açısı: ${listAngle.toFixed(4)}°`);
  };

  const calculateListMoment = () => {
    if (!data.W || !data.d) {
      toast.error("Lütfen W ve d değerlerini girin.");
      return;
    }
    const listMoment = data.W * data.d;
    setResults(prev => ({ ...prev, listMoment }));
    toast.success(`List Moment: ${listMoment.toFixed(2)} ton.m`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ship className="h-6 w-6" />
            Trim ve List Hesaplamaları
          </CardTitle>
          <CardDescription>
            Tüm trim ve list formülleri ayrı ayrı hesaplama butonları ile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="trim">📐 Temel Trim</TabsTrigger>
              <TabsTrigger value="draft">⚖️ Draft Survey</TabsTrigger>
              <TabsTrigger value="bonjean">📊 Bonjean</TabsTrigger>
              <TabsTrigger value="sounding">🧮 Sounding</TabsTrigger>
              <TabsTrigger value="list">🌊 List</TabsTrigger>
            </TabsList>

            {/* 📐 Temel Trim Formülleri */}
            <TabsContent value="trim" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Trim Açısı: θ = arctan((T_a - T_f) / L)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="T_a">T_a (Aft Draft) [m]</Label>
                        <Input
                          id="T_a"
                          type="number"
                          step="0.01"
                          value={data.T_a || ''}
                          onChange={(e) => setData({...data, T_a: parseFloat(e.target.value)})}
                          placeholder="8.20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="T_f">T_f (Forward Draft) [m]</Label>
                        <Input
                          id="T_f"
                          type="number"
                          step="0.01"
                          value={data.T_f || ''}
                          onChange={(e) => setData({...data, T_f: parseFloat(e.target.value)})}
                          placeholder="7.50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="L">L (Length) [m]</Label>
                        <Input
                          id="L"
                          type="number"
                          value={data.L || ''}
                          onChange={(e) => setData({...data, L: parseFloat(e.target.value)})}
                          placeholder="150"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateTrimAngle} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Trim Açısını Hesapla
                    </Button>
                    {results.trimAngle !== undefined && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.trimAngle.toFixed(4)}°</div>
                        <div className="text-sm text-muted-foreground">Trim Açısı</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      MCT: MCT = (Δ × GM_L × B²) / (12 × L)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="delta">Δ (Displacement) [ton]</Label>
                        <Input
                          id="delta"
                          type="number"
                          value={data.delta || ''}
                          onChange={(e) => setData({...data, delta: parseFloat(e.target.value)})}
                          placeholder="25000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="GM_L">GM_L [m]</Label>
                        <Input
                          id="GM_L"
                          type="number"
                          step="0.01"
                          value={data.GM_L || ''}
                          onChange={(e) => setData({...data, GM_L: parseFloat(e.target.value)})}
                          placeholder="150"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="B">B (Breadth) [m]</Label>
                        <Input
                          id="B"
                          type="number"
                          value={data.B || ''}
                          onChange={(e) => setData({...data, B: parseFloat(e.target.value)})}
                          placeholder="25"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="L_mct">L (Length) [m]</Label>
                        <Input
                          id="L_mct"
                          type="number"
                          value={data.L || ''}
                          onChange={(e) => setData({...data, L: parseFloat(e.target.value)})}
                          placeholder="150"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateMCT} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      MCT Hesapla
                    </Button>
                    {results.mct !== undefined && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.mct.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">MCT [ton.m/cm]</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Waves className="h-5 w-5" />
                      Trim Değişimi: ΔT = (W × d) / MCT
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="W">W (Weight) [ton]</Label>
                        <Input
                          id="W"
                          type="number"
                          step="0.1"
                          value={data.W || ''}
                          onChange={(e) => setData({...data, W: parseFloat(e.target.value)})}
                          placeholder="500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="d">d (Distance) [m]</Label>
                        <Input
                          id="d"
                          type="number"
                          step="0.1"
                          value={data.d || ''}
                          onChange={(e) => setData({...data, d: parseFloat(e.target.value)})}
                          placeholder="45"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateTrimChange} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Trim Değişimini Hesapla
                    </Button>
                    {results.trimChange !== undefined && (
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.trimChange.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">Trim Değişimi [cm]</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ⚖️ Draft Survey Formülleri */}
            <TabsContent value="draft" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Ortalama Draft: T_mean = (T_f + 4×T_m + T_a) / 6
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="T_f_draft">T_f (Forward Draft) [m]</Label>
                        <Input
                          id="T_f_draft"
                          type="number"
                          step="0.01"
                          value={data.T_f || ''}
                          onChange={(e) => setData({...data, T_f: parseFloat(e.target.value)})}
                          placeholder="7.50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="T_m">T_m (Mid Draft) [m]</Label>
                        <Input
                          id="T_m"
                          type="number"
                          step="0.01"
                          value={data.T_m || ''}
                          onChange={(e) => setData({...data, T_m: parseFloat(e.target.value)})}
                          placeholder="8.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="T_a_draft">T_a (Aft Draft) [m]</Label>
                        <Input
                          id="T_a_draft"
                          type="number"
                          step="0.01"
                          value={data.T_a || ''}
                          onChange={(e) => setData({...data, T_a: parseFloat(e.target.value)})}
                          placeholder="8.20"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateMeanDraft} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Ortalama Draft Hesapla
                    </Button>
                    {results.meanDraft !== undefined && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.meanDraft.toFixed(3)} m</div>
                        <div className="text-sm text-muted-foreground">Ortalama Draft</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ship className="h-5 w-5" />
                      Displacement: Δ = V × ρ_sw
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="V">V (Volume) [m³]</Label>
                        <Input
                          id="V"
                          type="number"
                          value={data.V || ''}
                          onChange={(e) => setData({...data, V: parseFloat(e.target.value)})}
                          placeholder="25000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rho_sw">ρ_sw (Seawater Density) [t/m³]</Label>
                        <Input
                          id="rho_sw"
                          type="number"
                          step="0.001"
                          value={data.rho_sw || ''}
                          onChange={(e) => setData({...data, rho_sw: parseFloat(e.target.value)})}
                          placeholder="1.025"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateDisplacement} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Deplasman Hesapla
                    </Button>
                    {results.displacement !== undefined && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.displacement.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">Deplasman [ton]</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      TPC: TPC = (A_wp × ρ_sw) / 100
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="A_wp">A_wp (Waterplane Area) [m²]</Label>
                        <Input
                          id="A_wp"
                          type="number"
                          value={data.A_wp || ''}
                          onChange={(e) => setData({...data, A_wp: parseFloat(e.target.value)})}
                          placeholder="3000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rho_sw_tpc">ρ_sw (Seawater Density) [t/m³]</Label>
                        <Input
                          id="rho_sw_tpc"
                          type="number"
                          step="0.001"
                          value={data.rho_sw || ''}
                          onChange={(e) => setData({...data, rho_sw: parseFloat(e.target.value)})}
                          placeholder="1.025"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateTPC} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      TPC Hesapla
                    </Button>
                    {results.tpc !== undefined && (
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.tpc.toFixed(3)}</div>
                        <div className="text-sm text-muted-foreground">TPC [ton/cm]</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 📊 Bonjean Curves */}
            <TabsContent value="bonjean" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Waves className="h-5 w-5" />
                      Su Altı Hacim: V = ∫ A(x) dx
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="A_x">A(x) (Area at station x) [m²]</Label>
                      <Input
                        id="A_x"
                        type="number"
                        value={data.A_x || ''}
                        onChange={(e) => setData({...data, A_x: parseFloat(e.target.value)})}
                        placeholder="150"
                      />
                    </div>
                    <Button onClick={calculateUnderwaterVolume} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Su Altı Hacim Hesapla
                    </Button>
                    {results.underwaterVolume !== undefined && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.underwaterVolume.toFixed(2)} m³</div>
                        <div className="text-sm text-muted-foreground">Su Altı Hacim</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      LCB: LCB = ∫ x × A(x) dx / V
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="x">x (Station position) [m]</Label>
                        <Input
                          id="x"
                          type="number"
                          value={data.x || ''}
                          onChange={(e) => setData({...data, x: parseFloat(e.target.value)})}
                          placeholder="75"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="A_x_lcb">A(x) (Area at station x) [m²]</Label>
                        <Input
                          id="A_x_lcb"
                          type="number"
                          value={data.A_x || ''}
                          onChange={(e) => setData({...data, A_x: parseFloat(e.target.value)})}
                          placeholder="150"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateLCB} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      LCB Hesapla
                    </Button>
                    {results.lcb !== undefined && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.lcb.toFixed(2)} m</div>
                        <div className="text-sm text-muted-foreground">LCB</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Moment: M = ∫ x² × A(x) dx
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="x_moment">x (Station position) [m]</Label>
                        <Input
                          id="x_moment"
                          type="number"
                          value={data.x || ''}
                          onChange={(e) => setData({...data, x: parseFloat(e.target.value)})}
                          placeholder="75"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="A_x_moment">A(x) (Area at station x) [m²]</Label>
                        <Input
                          id="A_x_moment"
                          type="number"
                          value={data.A_x || ''}
                          onChange={(e) => setData({...data, A_x: parseFloat(e.target.value)})}
                          placeholder="150"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateMoment} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Moment Hesapla
                    </Button>
                    {results.moment !== undefined && (
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.moment.toFixed(2)} m³</div>
                        <div className="text-sm text-muted-foreground">Moment</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 🧮 Sounding Tabloları */}
            <TabsContent value="sounding" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Tank Hacmi (Dikdörtgen): V = L × B × h
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tank_L">L (Tank Length) [m]</Label>
                        <Input
                          id="tank_L"
                          type="number"
                          value={data.tank_L || ''}
                          onChange={(e) => setData({...data, tank_L: parseFloat(e.target.value)})}
                          placeholder="20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tank_B">B (Tank Breadth) [m]</Label>
                        <Input
                          id="tank_B"
                          type="number"
                          value={data.tank_B || ''}
                          onChange={(e) => setData({...data, tank_B: parseFloat(e.target.value)})}
                          placeholder="15"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tank_h">h (Tank Height) [m]</Label>
                        <Input
                          id="tank_h"
                          type="number"
                          value={data.tank_h || ''}
                          onChange={(e) => setData({...data, tank_h: parseFloat(e.target.value)})}
                          placeholder="8"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateTankVolumeRect} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Dikdörtgen Tank Hacmi Hesapla
                    </Button>
                    {results.tankVolumeRect !== undefined && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.tankVolumeRect.toFixed(2)} m³</div>
                        <div className="text-sm text-muted-foreground">Dikdörtgen Tank Hacmi</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Tank Hacmi (Silindirik): V = π × r² × h
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="r">r (Radius) [m]</Label>
                        <Input
                          id="r"
                          type="number"
                          step="0.01"
                          value={data.r || ''}
                          onChange={(e) => setData({...data, r: parseFloat(e.target.value)})}
                          placeholder="7.5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tank_h_cyl">h (Height) [m]</Label>
                        <Input
                          id="tank_h_cyl"
                          type="number"
                          value={data.tank_h || ''}
                          onChange={(e) => setData({...data, tank_h: parseFloat(e.target.value)})}
                          placeholder="8"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateTankVolumeCyl} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Silindirik Tank Hacmi Hesapla
                    </Button>
                    {results.tankVolumeCyl !== undefined && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.tankVolumeCyl.toFixed(2)} m³</div>
                        <div className="text-sm text-muted-foreground">Silindirik Tank Hacmi</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Waves className="h-5 w-5" />
                      Trim Düzeltmesi: ΔV = A × tan(θ) × l
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tank_L_trim">L (Tank Length) [m]</Label>
                        <Input
                          id="tank_L_trim"
                          type="number"
                          value={data.tank_L || ''}
                          onChange={(e) => setData({...data, tank_L: parseFloat(e.target.value)})}
                          placeholder="20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tank_B_trim">B (Tank Breadth) [m]</Label>
                        <Input
                          id="tank_B_trim"
                          type="number"
                          value={data.tank_B || ''}
                          onChange={(e) => setData({...data, tank_B: parseFloat(e.target.value)})}
                          placeholder="15"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="theta">θ (Trim Angle) [°]</Label>
                        <Input
                          id="theta"
                          type="number"
                          step="0.01"
                          value={data.theta || ''}
                          onChange={(e) => setData({...data, theta: parseFloat(e.target.value)})}
                          placeholder="2.5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="l">l (Length) [m]</Label>
                        <Input
                          id="l"
                          type="number"
                          value={data.l || ''}
                          onChange={(e) => setData({...data, l: parseFloat(e.target.value)})}
                          placeholder="10"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateTrimCorrection} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Trim Düzeltmesi Hesapla
                    </Button>
                    {results.trimCorrection !== undefined && (
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.trimCorrection.toFixed(2)} m³</div>
                        <div className="text-sm text-muted-foreground">Trim Düzeltmesi</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 🌊 List Hesaplamaları */}
            <TabsContent value="list" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      List Açısı: φ = arctan(W × d / (Δ × GM))
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="W_list">W (Weight) [ton]</Label>
                        <Input
                          id="W_list"
                          type="number"
                          step="0.1"
                          value={data.W || ''}
                          onChange={(e) => setData({...data, W: parseFloat(e.target.value)})}
                          placeholder="100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="d_list">d (Distance) [m]</Label>
                        <Input
                          id="d_list"
                          type="number"
                          step="0.01"
                          value={data.d || ''}
                          onChange={(e) => setData({...data, d: parseFloat(e.target.value)})}
                          placeholder="2.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="delta_list">Δ (Displacement) [ton]</Label>
                        <Input
                          id="delta_list"
                          type="number"
                          value={data.delta || ''}
                          onChange={(e) => setData({...data, delta: parseFloat(e.target.value)})}
                          placeholder="25000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="GM">GM (Metacentric Height) [m]</Label>
                        <Input
                          id="GM"
                          type="number"
                          step="0.01"
                          value={data.GM || ''}
                          onChange={(e) => setData({...data, GM: parseFloat(e.target.value)})}
                          placeholder="1.0"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateListAngle} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      List Açısını Hesapla
                    </Button>
                    {results.listAngle !== undefined && (
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.listAngle.toFixed(4)}°</div>
                        <div className="text-sm text-muted-foreground">List Açısı</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      List Moment: M_list = W × d
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="W_moment">W (Weight) [ton]</Label>
                        <Input
                          id="W_moment"
                          type="number"
                          step="0.1"
                          value={data.W || ''}
                          onChange={(e) => setData({...data, W: parseFloat(e.target.value)})}
                          placeholder="100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="d_moment">d (Distance) [m]</Label>
                        <Input
                          id="d_moment"
                          type="number"
                          step="0.01"
                          value={data.d || ''}
                          onChange={(e) => setData({...data, d: parseFloat(e.target.value)})}
                          placeholder="2.0"
                        />
                      </div>
                    </div>
                    <Button onClick={calculateListMoment} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      List Moment Hesapla
                    </Button>
                    {results.listMoment !== undefined && (
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold">{results.listMoment.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">List Moment [ton.m]</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};