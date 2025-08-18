import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Shield, Waves, Ruler, Activity, Package, LineChart, LifeBuoy, ClipboardCheck } from "lucide-react";

export default function Stability2() {
  // State for calculations
  const [transverseInputs, setTransverseInputs] = useState({
    I_WP: '',
    KB: '',
    KG: '',
    displacement: ''
  });

  const [longitudinalInputs, setLongitudinalInputs] = useState({
    I_L: '',
    displacement: '',
    weight: '',
    distance_from_LCF: '',
    MCT: ''
  });

  const [intactInputs, setIntactInputs] = useState({
    GM: '',
    GZ_max: '',
    angle_max_GZ: '',
    area_0_30: '',
    area_0_40: '',
    wind_pressure: '',
    wind_area: '',
    wind_height: ''
  });

  const [damageInputs, setDamageInputs] = useState({
    damaged_volume: '',
    permeability: '',
    compartment_length: '',
    compartment_breadth: '',
    compartment_height: ''
  });

  const [dynamicInputs, setDynamicInputs] = useState({
    wave_height: '',
    wave_period: '',
    ship_speed: '',
    GM: '',
    roll_period: ''
  });

  const [loadingInputs, setLoadingInputs] = useState({
    lightship: '',
    cargo_weight: '',
    cargo_lcg: '',
    fuel_weight: '',
    water_weight: '',
    stores_weight: ''
  });

  const [strengthInputs, setStrengthInputs] = useState({
    still_water_BM: '',
    wave_BM: '',
    allowable_BM: '',
    shear_force: '',
    allowable_SF: ''
  });

  const [loadlineInputs, setLoadlineInputs] = useState({
    measured_draft_fwd: '',
    measured_draft_aft: '',
    density: '',
    TPC: ''
  });

  const [verificationInputs, setVerificationInputs] = useState({
    inclining_weight: '',
    inclining_distance: '',
    deflection: '',
    lightship_weight: ''
  });

  // Calculation functions
  const calculateTransverse = () => {
    const I_WP = parseFloat(transverseInputs.I_WP) || 0;
    const displacement = parseFloat(transverseInputs.displacement) || 0;
    const KB = parseFloat(transverseInputs.KB) || 0;
    const KG = parseFloat(transverseInputs.KG) || 0;
    
    const BMt = I_WP / displacement;
    const KMt = KB + BMt;
    const GMt = KMt - KG;
    
    return { BMt, KMt, GMt };
  };

  const calculateLongitudinal = () => {
    const I_L = parseFloat(longitudinalInputs.I_L) || 0;
    const displacement = parseFloat(longitudinalInputs.displacement) || 0;
    const weight = parseFloat(longitudinalInputs.weight) || 0;
    const distance = parseFloat(longitudinalInputs.distance_from_LCF) || 0;
    const MCT = parseFloat(longitudinalInputs.MCT) || 0;
    
    const BMl = I_L / displacement;
    const trim_change = (weight * distance) / MCT;
    
    return { BMl, trim_change };
  };

  const calculateIntact = () => {
    const GM = parseFloat(intactInputs.GM) || 0;
    const area_0_30 = parseFloat(intactInputs.area_0_30) || 0;
    const area_0_40 = parseFloat(intactInputs.area_0_40) || 0;
    const wind_pressure = parseFloat(intactInputs.wind_pressure) || 0;
    const wind_area = parseFloat(intactInputs.wind_area) || 0;
    const wind_height = parseFloat(intactInputs.wind_height) || 0;
    
    const wind_moment = wind_pressure * wind_area * wind_height;
    const stability_adequate = GM > 0.15 && area_0_30 > 3.15 && area_0_40 > 5.16;
    
    return { wind_moment, stability_adequate };
  };

  const calculateDamage = () => {
    const volume = parseFloat(damageInputs.damaged_volume) || 0;
    const permeability = parseFloat(damageInputs.permeability) || 0;
    const length = parseFloat(damageInputs.compartment_length) || 0;
    const breadth = parseFloat(damageInputs.compartment_breadth) || 0;
    const height = parseFloat(damageInputs.compartment_height) || 0;
    
    const lost_buoyancy = volume * permeability;
    const compartment_volume = length * breadth * height;
    const flooding_volume = compartment_volume * permeability;
    
    return { lost_buoyancy, flooding_volume };
  };

  const calculateDynamic = () => {
    const wave_height = parseFloat(dynamicInputs.wave_height) || 0;
    const wave_period = parseFloat(dynamicInputs.wave_period) || 0;
    const ship_speed = parseFloat(dynamicInputs.ship_speed) || 0;
    const roll_period = parseFloat(dynamicInputs.roll_period) || 0;
    
    const encounter_period = wave_period * (1 - (ship_speed * wave_period) / (1.56 * wave_height));
    const resonance_risk = Math.abs(encounter_period - roll_period) < 1;
    
    return { encounter_period, resonance_risk };
  };

  const calculateLoading = () => {
    const lightship = parseFloat(loadingInputs.lightship) || 0;
    const cargo = parseFloat(loadingInputs.cargo_weight) || 0;
    const fuel = parseFloat(loadingInputs.fuel_weight) || 0;
    const water = parseFloat(loadingInputs.water_weight) || 0;
    const stores = parseFloat(loadingInputs.stores_weight) || 0;
    const cargo_lcg = parseFloat(loadingInputs.cargo_lcg) || 0;
    
    const total_weight = lightship + cargo + fuel + water + stores;
    const total_moment = cargo * cargo_lcg;
    const lcg = total_moment / total_weight;
    
    return { total_weight, lcg };
  };

  const calculateStrength = () => {
    const still_BM = parseFloat(strengthInputs.still_water_BM) || 0;
    const wave_BM = parseFloat(strengthInputs.wave_BM) || 0;
    const allowable_BM = parseFloat(strengthInputs.allowable_BM) || 0;
    
    const total_BM = still_BM + wave_BM;
    const BM_utilization = (total_BM / allowable_BM) * 100;
    const adequate_strength = BM_utilization < 100;
    
    return { total_BM, BM_utilization, adequate_strength };
  };

  const calculateLoadline = () => {
    const draft_fwd = parseFloat(loadlineInputs.measured_draft_fwd) || 0;
    const draft_aft = parseFloat(loadlineInputs.measured_draft_aft) || 0;
    const density = parseFloat(loadlineInputs.density) || 1.025;
    const TPC = parseFloat(loadlineInputs.TPC) || 0;
    
    const mean_draft = (draft_fwd + draft_aft) / 2;
    const trim = draft_aft - draft_fwd;
    const density_correction = TPC * (1.025 - density) / 1.025;
    
    return { mean_draft, trim, density_correction };
  };

  const calculateVerification = () => {
    const weight = parseFloat(verificationInputs.inclining_weight) || 0;
    const distance = parseFloat(verificationInputs.inclining_distance) || 0;
    const deflection = parseFloat(verificationInputs.deflection) || 0;
    const displacement = parseFloat(verificationInputs.lightship_weight) || 0;
    
    const GM = (weight * distance) / (displacement * Math.tan(deflection * Math.PI / 180));
    
    return { GM };
  };

  const transverseResults = calculateTransverse();
  const longitudinalResults = calculateLongitudinal();
  const intactResults = calculateIntact();
  const damageResults = calculateDamage();
  const dynamicResults = calculateDynamic();
  const loadingResults = calculateLoading();
  const strengthResults = calculateStrength();
  const loadlineResults = calculateLoadline();
  const verificationResults = calculateVerification();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Helmet>
        <title>Stabilite 2 | Gelişmiş Stabilite Hesaplamaları</title>
        <meta name="description" content="Stabilite 2: Enine ve boyuna stabilite, sağlam ve hasarlı stabilite, dinamik stabilite, yükleme, boyuna dayanım, load line ve kalibrasyon hesaplamaları." />
        <link rel="canonical" href="/stability-2" />
      </Helmet>

      <header className="flex items-center justify-between">
        <Link to="/calculations">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Geri
          </Button>
        </Link>
      </header>

      <main>
        <h1 className="text-3xl font-bold mb-2" data-no-translate>Stabilite 2</h1>
        <p className="text-muted-foreground mb-6">İleri seviye stabilite hesaplamaları ve analizleri</p>

        <Tabs defaultValue="transverse" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 mb-6">
            <TabsTrigger value="transverse">Enine</TabsTrigger>
            <TabsTrigger value="longitudinal">Boyuna</TabsTrigger>
            <TabsTrigger value="intact">Sağlam</TabsTrigger>
            <TabsTrigger value="damage">Hasarlı</TabsTrigger>
            <TabsTrigger value="dynamic">Dinamik</TabsTrigger>
            <TabsTrigger value="loading">Yükleme</TabsTrigger>
            <TabsTrigger value="strength">Dayanım</TabsTrigger>
            <TabsTrigger value="loadline">Load Line</TabsTrigger>
            <TabsTrigger value="verification">Doğrulama</TabsTrigger>
          </TabsList>

          <TabsContent value="transverse">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Enine Stabilite (Transverse)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Giriş Parametreleri</h3>
                    <div className="grid gap-3">
                      <div>
                        <Label htmlFor="iwp">Su Hattı Alan Atâleti (I_WP) [m⁴]</Label>
                        <Input
                          id="iwp"
                          value={transverseInputs.I_WP}
                          onChange={(e) => setTransverseInputs({...transverseInputs, I_WP: e.target.value})}
                          placeholder="Örn: 50000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="kb">KB [m]</Label>
                        <Input
                          id="kb"
                          value={transverseInputs.KB}
                          onChange={(e) => setTransverseInputs({...transverseInputs, KB: e.target.value})}
                          placeholder="Örn: 8.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="kg">KG [m]</Label>
                        <Input
                          id="kg"
                          value={transverseInputs.KG}
                          onChange={(e) => setTransverseInputs({...transverseInputs, KG: e.target.value})}
                          placeholder="Örn: 12.2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="disp">Deplasман [ton]</Label>
                        <Input
                          id="disp"
                          value={transverseInputs.displacement}
                          onChange={(e) => setTransverseInputs({...transverseInputs, displacement: e.target.value})}
                          placeholder="Örn: 25000"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Sonuçlar</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>BMt:</span>
                        <span className="font-mono">{transverseResults.BMt.toFixed(2)} m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>KMt:</span>
                        <span className="font-mono">{transverseResults.KMt.toFixed(2)} m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GMt:</span>
                        <span className="font-mono">{transverseResults.GMt.toFixed(2)} m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="longitudinal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waves className="h-5 w-5" />
                  Boyuna Stabilite (Trim)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Giriş Parametreleri</h3>
                    <div className="grid gap-3">
                      <div>
                        <Label htmlFor="il">Boyuna Atâlet (I_L) [m⁴]</Label>
                        <Input
                          id="il"
                          value={longitudinalInputs.I_L}
                          onChange={(e) => setLongitudinalInputs({...longitudinalInputs, I_L: e.target.value})}
                          placeholder="Örn: 800000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="disp_l">Deplasман [ton]</Label>
                        <Input
                          id="disp_l"
                          value={longitudinalInputs.displacement}
                          onChange={(e) => setLongitudinalInputs({...longitudinalInputs, displacement: e.target.value})}
                          placeholder="Örn: 25000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="weight_l">Yük Ağırlığı [ton]</Label>
                        <Input
                          id="weight_l"
                          value={longitudinalInputs.weight}
                          onChange={(e) => setLongitudinalInputs({...longitudinalInputs, weight: e.target.value})}
                          placeholder="Örn: 500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="distance_lcf">LCF'den Uzaklık [m]</Label>
                        <Input
                          id="distance_lcf"
                          value={longitudinalInputs.distance_from_LCF}
                          onChange={(e) => setLongitudinalInputs({...longitudinalInputs, distance_from_LCF: e.target.value})}
                          placeholder="Örn: 20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="mct">MCT 1cm [ton.m]</Label>
                        <Input
                          id="mct"
                          value={longitudinalInputs.MCT}
                          onChange={(e) => setLongitudinalInputs({...longitudinalInputs, MCT: e.target.value})}
                          placeholder="Örn: 180"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Sonuçlar</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>BMl:</span>
                        <span className="font-mono">{longitudinalResults.BMl.toFixed(2)} m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Trim Değişimi:</span>
                        <span className="font-mono">{longitudinalResults.trim_change.toFixed(3)} m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="intact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LifeBuoy className="h-5 w-5" />
                  Sağlam Stabilite
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Giriş Parametreleri</h3>
                    <div className="grid gap-3">
                      <div>
                        <Label htmlFor="gm_intact">GM [m]</Label>
                        <Input
                          id="gm_intact"
                          value={intactInputs.GM}
                          onChange={(e) => setIntactInputs({...intactInputs, GM: e.target.value})}
                          placeholder="Örn: 1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="area_0_30">Alan 0-30° [m.rad]</Label>
                        <Input
                          id="area_0_30"
                          value={intactInputs.area_0_30}
                          onChange={(e) => setIntactInputs({...intactInputs, area_0_30: e.target.value})}
                          placeholder="Örn: 3.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="area_0_40">Alan 0-40° [m.rad]</Label>
                        <Input
                          id="area_0_40"
                          value={intactInputs.area_0_40}
                          onChange={(e) => setIntactInputs({...intactInputs, area_0_40: e.target.value})}
                          placeholder="Örn: 6.0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="wind_pressure">Rüzgar Basıncı [N/m²]</Label>
                        <Input
                          id="wind_pressure"
                          value={intactInputs.wind_pressure}
                          onChange={(e) => setIntactInputs({...intactInputs, wind_pressure: e.target.value})}
                          placeholder="Örn: 504"
                        />
                      </div>
                      <div>
                        <Label htmlFor="wind_area">Rüzgar Alanı [m²]</Label>
                        <Input
                          id="wind_area"
                          value={intactInputs.wind_area}
                          onChange={(e) => setIntactInputs({...intactInputs, wind_area: e.target.value})}
                          placeholder="Örn: 2000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="wind_height">Rüzgar Yüksekliği [m]</Label>
                        <Input
                          id="wind_height"
                          value={intactInputs.wind_height}
                          onChange={(e) => setIntactInputs({...intactInputs, wind_height: e.target.value})}
                          placeholder="Örn: 15"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Sonuçlar</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Rüzgar Momenti:</span>
                        <span className="font-mono">{(intactResults.wind_moment / 1000000).toFixed(1)} MN.m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stabilite Yeterli:</span>
                        <span className={`font-mono ${intactResults.stability_adequate ? 'text-green-600' : 'text-red-600'}`}>
                          {intactResults.stability_adequate ? 'EVET' : 'HAYIR'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="damage">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Zarar Görmüş Stabilite
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Giriş Parametreleri</h3>
                    <div className="grid gap-3">
                      <div>
                        <Label htmlFor="damaged_volume">Hasarlı Hacim [m³]</Label>
                        <Input
                          id="damaged_volume"
                          value={damageInputs.damaged_volume}
                          onChange={(e) => setDamageInputs({...damageInputs, damaged_volume: e.target.value})}
                          placeholder="Örn: 500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="permeability">Geçirgenlik (μ)</Label>
                        <Input
                          id="permeability"
                          value={damageInputs.permeability}
                          onChange={(e) => setDamageInputs({...damageInputs, permeability: e.target.value})}
                          placeholder="Örn: 0.85"
                        />
                      </div>
                      <div>
                        <Label htmlFor="comp_length">Bölme Boyu [m]</Label>
                        <Input
                          id="comp_length"
                          value={damageInputs.compartment_length}
                          onChange={(e) => setDamageInputs({...damageInputs, compartment_length: e.target.value})}
                          placeholder="Örn: 20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="comp_breadth">Bölme Eni [m]</Label>
                        <Input
                          id="comp_breadth"
                          value={damageInputs.compartment_breadth}
                          onChange={(e) => setDamageInputs({...damageInputs, compartment_breadth: e.target.value})}
                          placeholder="Örn: 15"
                        />
                      </div>
                      <div>
                        <Label htmlFor="comp_height">Bölme Yüksekliği [m]</Label>
                        <Input
                          id="comp_height"
                          value={damageInputs.compartment_height}
                          onChange={(e) => setDamageInputs({...damageInputs, compartment_height: e.target.value})}
                          placeholder="Örn: 8"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Sonuçlar</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Kayıp Yüzdürme:</span>
                        <span className="font-mono">{damageResults.lost_buoyancy.toFixed(1)} m³</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Su Alma Hacmi:</span>
                        <span className="font-mono">{damageResults.flooding_volume.toFixed(1)} m³</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dynamic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Dinamik Stabilite
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Giriş Parametreleri</h3>
                    <div className="grid gap-3">
                      <div>
                        <Label htmlFor="wave_height">Dalga Yüksekliği [m]</Label>
                        <Input
                          id="wave_height"
                          value={dynamicInputs.wave_height}
                          onChange={(e) => setDynamicInputs({...dynamicInputs, wave_height: e.target.value})}
                          placeholder="Örn: 8"
                        />
                      </div>
                      <div>
                        <Label htmlFor="wave_period">Dalga Periyodu [s]</Label>
                        <Input
                          id="wave_period"
                          value={dynamicInputs.wave_period}
                          onChange={(e) => setDynamicInputs({...dynamicInputs, wave_period: e.target.value})}
                          placeholder="Örn: 12"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ship_speed">Gemi Hızı [knot]</Label>
                        <Input
                          id="ship_speed"
                          value={dynamicInputs.ship_speed}
                          onChange={(e) => setDynamicInputs({...dynamicInputs, ship_speed: e.target.value})}
                          placeholder="Örn: 15"
                        />
                      </div>
                      <div>
                        <Label htmlFor="roll_period">Yalpa Periyodu [s]</Label>
                        <Input
                          id="roll_period"
                          value={dynamicInputs.roll_period}
                          onChange={(e) => setDynamicInputs({...dynamicInputs, roll_period: e.target.value})}
                          placeholder="Örn: 14"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Sonuçlar</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Karşılaşma Periyodu:</span>
                        <span className="font-mono">{dynamicResults.encounter_period.toFixed(1)} s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rezonans Riski:</span>
                        <span className={`font-mono ${dynamicResults.resonance_risk ? 'text-red-600' : 'text-green-600'}`}>
                          {dynamicResults.resonance_risk ? 'VAR' : 'YOK'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loading">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Yükleme & Denge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Giriş Parametreleri</h3>
                    <div className="grid gap-3">
                      <div>
                        <Label htmlFor="lightship">Lightship [ton]</Label>
                        <Input
                          id="lightship"
                          value={loadingInputs.lightship}
                          onChange={(e) => setLoadingInputs({...loadingInputs, lightship: e.target.value})}
                          placeholder="Örn: 8000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cargo_weight">Kargo Ağırlığı [ton]</Label>
                        <Input
                          id="cargo_weight"
                          value={loadingInputs.cargo_weight}
                          onChange={(e) => setLoadingInputs({...loadingInputs, cargo_weight: e.target.value})}
                          placeholder="Örn: 15000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cargo_lcg">Kargo LCG [m]</Label>
                        <Input
                          id="cargo_lcg"
                          value={loadingInputs.cargo_lcg}
                          onChange={(e) => setLoadingInputs({...loadingInputs, cargo_lcg: e.target.value})}
                          placeholder="Örn: 85"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fuel_weight">Yakıt [ton]</Label>
                        <Input
                          id="fuel_weight"
                          value={loadingInputs.fuel_weight}
                          onChange={(e) => setLoadingInputs({...loadingInputs, fuel_weight: e.target.value})}
                          placeholder="Örn: 1500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="water_weight">Su [ton]</Label>
                        <Input
                          id="water_weight"
                          value={loadingInputs.water_weight}
                          onChange={(e) => setLoadingInputs({...loadingInputs, water_weight: e.target.value})}
                          placeholder="Örn: 300"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stores_weight">Erzak [ton]</Label>
                        <Input
                          id="stores_weight"
                          value={loadingInputs.stores_weight}
                          onChange={(e) => setLoadingInputs({...loadingInputs, stores_weight: e.target.value})}
                          placeholder="Örn: 200"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Sonuçlar</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Toplam Ağırlık:</span>
                        <span className="font-mono">{loadingResults.total_weight.toFixed(0)} ton</span>
                      </div>
                      <div className="flex justify-between">
                        <span>LCG:</span>
                        <span className="font-mono">{loadingResults.lcg.toFixed(2)} m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strength">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="h-5 w-5" />
                  Boyuna Dayanım
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Giriş Parametreleri</h3>
                    <div className="grid gap-3">
                      <div>
                        <Label htmlFor="still_bm">Sakin Su BM [MN.m]</Label>
                        <Input
                          id="still_bm"
                          value={strengthInputs.still_water_BM}
                          onChange={(e) => setStrengthInputs({...strengthInputs, still_water_BM: e.target.value})}
                          placeholder="Örn: 850"
                        />
                      </div>
                      <div>
                        <Label htmlFor="wave_bm">Dalga BM [MN.m]</Label>
                        <Input
                          id="wave_bm"
                          value={strengthInputs.wave_BM}
                          onChange={(e) => setStrengthInputs({...strengthInputs, wave_BM: e.target.value})}
                          placeholder="Örn: 450"
                        />
                      </div>
                      <div>
                        <Label htmlFor="allowable_bm">İzin Verilen BM [MN.m]</Label>
                        <Input
                          id="allowable_bm"
                          value={strengthInputs.allowable_BM}
                          onChange={(e) => setStrengthInputs({...strengthInputs, allowable_BM: e.target.value})}
                          placeholder="Örn: 1500"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Sonuçlar</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Toplam BM:</span>
                        <span className="font-mono">{strengthResults.total_BM.toFixed(0)} MN.m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>BM Kullanımı:</span>
                        <span className="font-mono">{strengthResults.BM_utilization.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dayanım Yeterli:</span>
                        <span className={`font-mono ${strengthResults.adequate_strength ? 'text-green-600' : 'text-red-600'}`}>
                          {strengthResults.adequate_strength ? 'EVET' : 'HAYIR'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loadline">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waves className="h-5 w-5" />
                  Load Line & Freeboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Giriş Parametreleri</h3>
                    <div className="grid gap-3">
                      <div>
                        <Label htmlFor="draft_fwd">Baş Draft [m]</Label>
                        <Input
                          id="draft_fwd"
                          value={loadlineInputs.measured_draft_fwd}
                          onChange={(e) => setLoadlineInputs({...loadlineInputs, measured_draft_fwd: e.target.value})}
                          placeholder="Örn: 8.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="draft_aft">Kıç Draft [m]</Label>
                        <Input
                          id="draft_aft"
                          value={loadlineInputs.measured_draft_aft}
                          onChange={(e) => setLoadlineInputs({...loadlineInputs, measured_draft_aft: e.target.value})}
                          placeholder="Örn: 9.2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="density">Su Yoğunluğu [t/m³]</Label>
                        <Input
                          id="density"
                          value={loadlineInputs.density}
                          onChange={(e) => setLoadlineInputs({...loadlineInputs, density: e.target.value})}
                          placeholder="Örn: 1.025"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tpc">TPC [ton/cm]</Label>
                        <Input
                          id="tpc"
                          value={loadlineInputs.TPC}
                          onChange={(e) => setLoadlineInputs({...loadlineInputs, TPC: e.target.value})}
                          placeholder="Örn: 25"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Sonuçlar</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Ortalama Draft:</span>
                        <span className="font-mono">{loadlineResults.mean_draft.toFixed(2)} m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Trim:</span>
                        <span className="font-mono">{loadlineResults.trim.toFixed(2)} m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Yoğunluk Düzeltmesi:</span>
                        <span className="font-mono">{loadlineResults.density_correction.toFixed(3)} m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  Doğrulama & Kalibrasyon
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Giriş Parametreleri</h3>
                    <div className="grid gap-3">
                      <div>
                        <Label htmlFor="incl_weight">Eğim Ağırlığı [ton]</Label>
                        <Input
                          id="incl_weight"
                          value={verificationInputs.inclining_weight}
                          onChange={(e) => setVerificationInputs({...verificationInputs, inclining_weight: e.target.value})}
                          placeholder="Örn: 20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="incl_distance">Eğim Mesafesi [m]</Label>
                        <Input
                          id="incl_distance"
                          value={verificationInputs.inclining_distance}
                          onChange={(e) => setVerificationInputs({...verificationInputs, inclining_distance: e.target.value})}
                          placeholder="Örn: 8"
                        />
                      </div>
                      <div>
                        <Label htmlFor="deflection">Sapma [derece]</Label>
                        <Input
                          id="deflection"
                          value={verificationInputs.deflection}
                          onChange={(e) => setVerificationInputs({...verificationInputs, deflection: e.target.value})}
                          placeholder="Örn: 2.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lightship_weight">Lightship Ağırlığı [ton]</Label>
                        <Input
                          id="lightship_weight"
                          value={verificationInputs.lightship_weight}
                          onChange={(e) => setVerificationInputs({...verificationInputs, lightship_weight: e.target.value})}
                          placeholder="Örn: 8000"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Sonuçlar</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Hesaplanan GM:</span>
                        <span className="font-mono">{verificationResults.GM.toFixed(2)} m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}