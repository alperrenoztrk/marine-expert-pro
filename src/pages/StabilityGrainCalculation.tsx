import { Button } from "@/components/ui/button";
import { ArrowLeft, Anchor, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function StabilityGrainCalculationPage() {
  const navigate = useNavigate();
  
  // 1. Stowage Factor Calculations
  const [volume, setVolume] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [stowageFactor, setStowageFactor] = useState<number>(1.35); // m³/ton - typical for grain
  
  // 2. Broken Stowage
  const [holdVolume, setHoldVolume] = useState<number>(0);
  const [brokenStowage, setBrokenStowage] = useState<number>(0); // % - usually 0 for grain
  
  // 3. Loadable Cargo
  const [displacement, setDisplacement] = useState<number>(0);
  const [lightship, setLightship] = useState<number>(0);
  const [constant, setConstant] = useState<number>(0);
  const [fuel, setFuel] = useState<number>(0);
  const [freshWater, setFreshWater] = useState<number>(0);
  const [stores, setStores] = useState<number>(0);
  
  // 4. Draft Calculations
  const [tpi, setTpi] = useState<number>(0); // Tonnes per inch immersion
  const [mt1, setMt1] = useState<number>(0); // Moment to change trim 1 cm
  const [draftChange, setDraftChange] = useState<number>(0);
  
  // 5. Grain Heeling Moment
  const [shiftVolume, setShiftVolume] = useState<number>(0);
  const [deltaKG, setDeltaKG] = useState<number>(0);
  const [grainDensity, setGrainDensity] = useState<number>(0.8); // ton/m³
  
  // 6. Stability Parameters
  const [gm, setGm] = useState<number>(0);
  const [kg, setKg] = useState<number>(0);
  const [km, setKm] = useState<number>(0);
  
  // 7. FSM for Grain
  const [fsmShiftArea, setFsmShiftArea] = useState<number>(0);
  const [fsmArm, setFsmArm] = useState<number>(0);

  // Calculate Stowage Factor
  const calculateSF = () => {
    if (volume && weight) {
      return (volume / weight).toFixed(3);
    }
    return null;
  };

  // Calculate Required Volume
  const calculateRequiredVolume = () => {
    if (weight && stowageFactor) {
      return (weight * stowageFactor).toFixed(2);
    }
    return null;
  };

  // Calculate Maximum Weight
  const calculateMaxWeight = () => {
    if (volume && stowageFactor) {
      return (volume / stowageFactor).toFixed(2);
    }
    return null;
  };

  // Calculate Usable Volume (with Broken Stowage)
  const calculateUsableVolume = () => {
    if (holdVolume) {
      const bs = brokenStowage / 100;
      return (holdVolume * (1 - bs)).toFixed(2);
    }
    return null;
  };

  // Calculate Loadable Cargo
  const calculateLoadableCargo = () => {
    if (displacement) {
      const deadweight = displacement - lightship;
      const loadable = deadweight - (constant + fuel + freshWater + stores);
      return {
        deadweight: deadweight.toFixed(2),
        loadable: loadable.toFixed(2)
      };
    }
    return null;
  };

  // Calculate Draft Change Weight
  const calculateDraftWeight = () => {
    if (tpi && draftChange) {
      // TPI is in tonnes per inch, convert draft change to inches if needed
      const deltaW = tpi * draftChange;
      return deltaW.toFixed(2);
    }
    return null;
  };

  // Calculate Moment Change for Trim
  const calculateTrimMoment = () => {
    if (mt1 && draftChange) {
      const deltaM = mt1 * (draftChange / 1);
      return deltaM.toFixed(2);
    }
    return null;
  };

  // Calculate Grain Heeling Moment (GHM)
  const calculateGHM = () => {
    if (shiftVolume && deltaKG && grainDensity) {
      const ghm = shiftVolume * deltaKG * grainDensity;
      return ghm.toFixed(2);
    }
    return null;
  };

  // Calculate Heeling Angle
  const calculateHeelingAngle = () => {
    const ghm = calculateGHM();
    if (ghm && displacement && gm) {
      const tanTheta = parseFloat(ghm) / (displacement * gm);
      const theta = Math.atan(tanTheta) * (180 / Math.PI);
      return theta.toFixed(2);
    }
    return null;
  };

  // Calculate FSM for Grain
  const calculateFSM = () => {
    if (fsmShiftArea && fsmArm && grainDensity) {
      const fsm = grainDensity * fsmShiftArea * fsmArm;
      return fsm.toFixed(2);
    }
    return null;
  };

  // Calculate Corrected GM
  const calculateCorrectedGM = () => {
    const fsm = calculateFSM();
    if (gm && fsm && displacement) {
      const gmCorrected = gm - (parseFloat(fsm) / displacement);
      return gmCorrected.toFixed(3);
    }
    return null;
  };

  // IMO Grain Stability Criteria Check
  const checkIMOCriteria = () => {
    const correctedGM = calculateCorrectedGM();
    const heelingAngle = calculateHeelingAngle();
    
    const criteria = {
      gmPass: correctedGM ? parseFloat(correctedGM) >= 0.30 : false,
      anglePass: heelingAngle ? parseFloat(heelingAngle) <= 12 : false,
      gmValue: correctedGM,
      angleValue: heelingAngle
    };
    
    return criteria;
  };

  const sfResult = calculateSF();
  const reqVolume = calculateRequiredVolume();
  const maxWeight = calculateMaxWeight();
  const usableVolume = calculateUsableVolume();
  const loadableResult = calculateLoadableCargo();
  const draftWeight = calculateDraftWeight();
  const trimMoment = calculateTrimMoment();
  const ghm = calculateGHM();
  const heelingAngle = calculateHeelingAngle();
  const fsm = calculateFSM();
  const correctedGM = calculateCorrectedGM();
  const imoCriteria = checkIMOCriteria();

  return (
    <div className="container mx-auto p-6 space-y-4">
      <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate('/stability/calculations')}>
        <ArrowLeft className="h-4 w-4" />
        Geri Dön
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Anchor className="h-6 w-6" />
            Tahıl Stabilite Hesaplamaları (IMO Grain Code)
          </CardTitle>
          <CardDescription>
            Tahıl yükü stabilitesi için kapsamlı hesaplamalar ve IMO kriterleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="stowage" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="stowage">Yığma Faktörü</TabsTrigger>
              <TabsTrigger value="cargo">Yük Kapasitesi</TabsTrigger>
              <TabsTrigger value="heeling">Yatma Momenti</TabsTrigger>
              <TabsTrigger value="stability">Stabilite</TabsTrigger>
              <TabsTrigger value="criteria">IMO Kriterleri</TabsTrigger>
            </TabsList>

            {/* Tab 1: Stowage Factor */}
            <TabsContent value="stowage" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">1️⃣ Stowage Factor (SF) – Yığma Faktörü</CardTitle>
                  <CardDescription>Bir ton tahılın kaç m³ yer kapladığını hesaplayın</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Yük Hacmi (m³)</Label>
                      <Input
                        type="number"
                        value={volume || ""}
                        onChange={(e) => setVolume(parseFloat(e.target.value) || 0)}
                        placeholder="Örnek: 1000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Yük Ağırlığı (ton)</Label>
                      <Input
                        type="number"
                        value={weight || ""}
                        onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                        placeholder="Örnek: 740"
                      />
                    </div>
                  </div>

                  {sfResult && (
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertDescription>
                        <div className="space-y-2">
                          <p className="font-semibold">SF = V / W</p>
                          <p className="text-lg font-bold text-blue-700">
                            Stowage Factor = {sfResult} m³/ton
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">2️⃣ Gereken Hacim Hesabı</h4>
                    <div className="space-y-2">
                      <Label>Stowage Factor (m³/ton)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={stowageFactor || ""}
                        onChange={(e) => setStowageFactor(parseFloat(e.target.value) || 0)}
                        placeholder="Tipik: 1.35"
                      />
                      <p className="text-xs text-muted-foreground">
                        Tipik değerler: Buğday 1.25-1.35, Mısır 1.40-1.50, Arpa 1.45-1.55 m³/ton
                      </p>
                    </div>

                    {reqVolume && (
                      <Alert className="bg-green-50 border-green-200">
                        <AlertDescription>
                          <p className="font-semibold">V = W × SF</p>
                          <p className="text-lg font-bold text-green-700">
                            Gereken Hacim = {reqVolume} m³
                          </p>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">3️⃣ Maksimum Tahıl Miktarı</h4>
                    {maxWeight && (
                      <Alert className="bg-purple-50 border-purple-200">
                        <AlertDescription>
                          <p className="font-semibold">W = V / SF</p>
                          <p className="text-lg font-bold text-purple-700">
                            Maksimum Yük = {maxWeight} ton
                          </p>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">4️⃣ Broken Stowage – Kayıp Hacim</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Ambar Hacmi (m³)</Label>
                        <Input
                          type="number"
                          value={holdVolume || ""}
                          onChange={(e) => setHoldVolume(parseFloat(e.target.value) || 0)}
                          placeholder="Örnek: 10000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Broken Stowage (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={brokenStowage || ""}
                          onChange={(e) => setBrokenStowage(parseFloat(e.target.value) || 0)}
                          placeholder="Tahıl için genelde 0%"
                        />
                      </div>
                    </div>

                    {usableVolume && (
                      <Alert className="bg-amber-50 border-amber-200">
                        <AlertDescription>
                          <p className="font-semibold">Kullanılabilir Hacim = Ambar Hacmi × (1 - BS)</p>
                          <p className="text-lg font-bold text-amber-700">
                            Kullanılabilir Hacim = {usableVolume} m³
                          </p>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Cargo Capacity */}
            <TabsContent value="cargo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">5️⃣ Yük Kapasitesi Hesaplamaları</CardTitle>
                  <CardDescription>Seferlik yüklenebilir tahıl miktarını hesaplayın</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Displacement (ton)</Label>
                      <Input
                        type="number"
                        value={displacement || ""}
                        onChange={(e) => setDisplacement(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Lightship (ton)</Label>
                      <Input
                        type="number"
                        value={lightship || ""}
                        onChange={(e) => setLightship(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Constant (ton)</Label>
                      <Input
                        type="number"
                        value={constant || ""}
                        onChange={(e) => setConstant(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fuel (ton)</Label>
                      <Input
                        type="number"
                        value={fuel || ""}
                        onChange={(e) => setFuel(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fresh Water (ton)</Label>
                      <Input
                        type="number"
                        value={freshWater || ""}
                        onChange={(e) => setFreshWater(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Stores (ton)</Label>
                      <Input
                        type="number"
                        value={stores || ""}
                        onChange={(e) => setStores(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  {loadableResult && (
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertDescription>
                        <div className="space-y-2">
                          <p className="font-semibold">
                            Loadable Cargo = Displacement - (Lightship + Constant + Fuel + FW + Stores)
                          </p>
                          <p className="text-sm">Deadweight = {loadableResult.deadweight} ton</p>
                          <p className="text-lg font-bold text-blue-700">
                            Yüklenebilir Kargo = {loadableResult.loadable} ton
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">Draft / Trim Etkisi</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>TPI (ton/inch)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={tpi || ""}
                          onChange={(e) => setTpi(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>MT1 (ton·m/cm)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={mt1 || ""}
                          onChange={(e) => setMt1(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Draft Değişimi (inch/cm)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={draftChange || ""}
                          onChange={(e) => setDraftChange(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {draftWeight && (
                        <Alert>
                          <AlertDescription>
                            <p className="font-semibold text-xs">ΔW = TPI × ΔT</p>
                            <p className="font-bold">Ağırlık Değişimi = {draftWeight} ton</p>
                          </AlertDescription>
                        </Alert>
                      )}
                      {trimMoment && (
                        <Alert>
                          <AlertDescription>
                            <p className="font-semibold text-xs">ΔM = MT1 × (ΔT / 1m)</p>
                            <p className="font-bold">Trim Momenti = {trimMoment} ton·m</p>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: Heeling Moment */}
            <TabsContent value="heeling" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">6️⃣ Grain Heeling Moment (GHM)</CardTitle>
                  <CardDescription>Tahıl kaymasının yatma momentini hesaplayın</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Shift Volume (m³)</Label>
                      <Input
                        type="number"
                        value={shiftVolume || ""}
                        onChange={(e) => setShiftVolume(parseFloat(e.target.value) || 0)}
                        placeholder="IMO tablosundan"
                      />
                      <p className="text-xs text-muted-foreground">IMO Grain Code shift volumes tablosundan alınır</p>
                    </div>
                    <div className="space-y-2">
                      <Label>ΔKG (m)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={deltaKG || ""}
                        onChange={(e) => setDeltaKG(parseFloat(e.target.value) || 0)}
                        placeholder="Kayma sonucu KG artışı"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tahıl Yoğunluğu (ton/m³)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={grainDensity || ""}
                        onChange={(e) => setGrainDensity(parseFloat(e.target.value) || 0)}
                        placeholder="Tipik: 0.8"
                      />
                    </div>
                  </div>

                  {ghm && (
                    <Alert className="bg-orange-50 border-orange-200">
                      <AlertDescription>
                        <p className="font-semibold">GHM = Vol × ΔKG × ρ</p>
                        <p className="text-lg font-bold text-orange-700">
                          Grain Heeling Moment = {ghm} ton·m
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">7️⃣ Heeling Angle (Yatma Açısı)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>GM (m)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={gm || ""}
                          onChange={(e) => setGm(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Displacement (ton)</Label>
                        <Input
                          type="number"
                          value={displacement || ""}
                          onChange={(e) => setDisplacement(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    {heelingAngle && (
                      <Alert className={parseFloat(heelingAngle) <= 12 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                        <AlertDescription>
                          <p className="font-semibold">tan(θ) = GHM / (Δ × GM)</p>
                          <p className="text-lg font-bold" style={{ color: parseFloat(heelingAngle) <= 12 ? '#15803d' : '#991b1b' }}>
                            Yatma Açısı (θ) = {heelingAngle}°
                          </p>
                          <p className="text-sm mt-2">
                            {parseFloat(heelingAngle) <= 12 ? (
                              <span className="text-green-700">✓ IMO limiti içinde (≤ 12°)</span>
                            ) : (
                              <span className="text-red-700">✗ IMO limitini aşıyor (&gt; 12°)</span>
                            )}
                          </p>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 4: Stability */}
            <TabsContent value="stability" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">8️⃣ FSM (Free Surface Moment) – Tahıl İçin</CardTitle>
                  <CardDescription>Tahıl için serbest yüzey momentini hesaplayın</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Tahıl, sıvı gibi tam free surface vermez. FSM genelde IMO Grain Code tablosundan okunur.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Shift Area (m²)</Label>
                      <Input
                        type="number"
                        value={fsmShiftArea || ""}
                        onChange={(e) => setFsmShiftArea(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Arm (m)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={fsmArm || ""}
                        onChange={(e) => setFsmArm(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Yoğunluk (ton/m³)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={grainDensity || ""}
                        onChange={(e) => setGrainDensity(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  {fsm && (
                    <Alert className="bg-purple-50 border-purple-200">
                      <AlertDescription>
                        <p className="font-semibold">FSM = ρ × shift area × arm</p>
                        <p className="text-lg font-bold text-purple-700">
                          Free Surface Moment = {fsm} ton·m
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">Corrected GM</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>KG (m)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={kg || ""}
                          onChange={(e) => setKg(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>KM (m)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={km || ""}
                          onChange={(e) => setKm(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>GM (m)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={gm || ""}
                          onChange={(e) => setGm(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    {correctedGM && (
                      <Alert className={parseFloat(correctedGM) >= 0.30 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                        <AlertDescription>
                          <p className="font-semibold">GM_corrected = GM - (FSM / Δ)</p>
                          <p className="text-lg font-bold" style={{ color: parseFloat(correctedGM) >= 0.30 ? '#15803d' : '#991b1b' }}>
                            Düzeltilmiş GM = {correctedGM} m
                          </p>
                          <p className="text-sm mt-2">
                            {parseFloat(correctedGM) >= 0.30 ? (
                              <span className="text-green-700">✓ IMO minimum değerinin üstünde (≥ 0.30 m)</span>
                            ) : (
                              <span className="text-red-700">✗ IMO minimum değerinin altında (&lt; 0.30 m)</span>
                            )}
                          </p>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 5: IMO Criteria */}
            <TabsContent value="criteria" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">9️⃣ IMO Grain Stability Criterion</CardTitle>
                  <CardDescription>Geminin tahıl yüküyle stabil olup olmadığını kontrol edin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <p className="font-semibold mb-2">IMO Grain Code Kriterleri:</p>
                      <ul className="space-y-1 text-sm">
                        <li>• Initial GM corrected ≥ 0.30 m</li>
                        <li>• Angle of heel ≤ 12°</li>
                        <li>• Area under GZ curve ≥ 0.075 m·rad (toplam alan)</li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Stabilite Kontrol Sonuçları</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className={imoCriteria.gmPass ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3">
                            {imoCriteria.gmPass ? (
                              <CheckCircle2 className="h-8 w-8 text-green-600" />
                            ) : (
                              <XCircle className="h-8 w-8 text-red-600" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">GM Corrected</p>
                              <p className="text-2xl font-bold">
                                {imoCriteria.gmValue || "—"} m
                              </p>
                              <p className="text-xs mt-1">
                                {imoCriteria.gmPass ? "✓ ≥ 0.30 m" : "✗ < 0.30 m"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className={imoCriteria.anglePass ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3">
                            {imoCriteria.anglePass ? (
                              <CheckCircle2 className="h-8 w-8 text-green-600" />
                            ) : (
                              <XCircle className="h-8 w-8 text-red-600" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Heeling Angle</p>
                              <p className="text-2xl font-bold">
                                {imoCriteria.angleValue || "—"}°
                              </p>
                              <p className="text-xs mt-1">
                                {imoCriteria.anglePass ? "✓ ≤ 12°" : "✗ > 12°"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Alert className={imoCriteria.gmPass && imoCriteria.anglePass ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"}>
                      <AlertDescription>
                        <div className="flex items-center gap-3">
                          {imoCriteria.gmPass && imoCriteria.anglePass ? (
                            <>
                              <CheckCircle2 className="h-6 w-6 text-green-600" />
                              <div>
                                <p className="font-bold text-green-700 text-lg">Stabilite Uygun</p>
                                <p className="text-sm text-green-600">Gemi IMO Grain Code kriterlerini sağlıyor</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-6 w-6 text-red-600" />
                              <div>
                                <p className="font-bold text-red-700 text-lg">Stabilite Uygun Değil</p>
                                <p className="text-sm text-red-600">
                                  {!imoCriteria.gmPass && "GM düşük. "}
                                  {!imoCriteria.anglePass && "Yatma açısı yüksek. "}
                                  Ballast ayarlaması gerekebilir.
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>

                    <div className="p-4 bg-muted rounded-lg">
                      <h5 className="font-semibold mb-2 text-sm">📋 Öneriler</h5>
                      <ul className="space-y-1 text-xs">
                        <li>• Tahıl yüklemesi öncesi tüm parametreleri doğrulayın</li>
                        <li>• IMO Grain Code tablosundan shift volumes değerlerini kontrol edin</li>
                        <li>• Gerekirse ballast suyu ile GM'i artırın</li>
                        <li>• Ambar bölmeleri arasına separator (ayırıcı) kullanın</li>
                        <li>• Loading computer ile cross-check yapın</li>
                        <li>• Yükleme sırasında heel açısını sürekli izleyin</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
