import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Calculator, Ship, Wind, Ruler, Activity, Waves, Shield, Anchor } from "lucide-react";
import { useState, useMemo } from "react";

export default function StabilityCalculationsPage() {
  const sections = [
    { id: "gm-kg", title: "GM ve KG Temelleri" },
    { id: "gz", title: "Doğrultucu Kol (GZ) ve Moment (RM)" },
    { id: "free-surface", title: "Serbest Yüzey Düzeltmesi (FSC)" },
    { id: "trim-list", title: "Trim ve List Açıları" },
    { id: "loll", title: "Angle of Loll" },
    { id: "roll-period", title: "Yalpa Periyodu" },
    { id: "hydrostatic", title: "Hidrostatik Temeller (KB, BM, KM, Δ, ∇, TPC)" },
    { id: "wind", title: "Rüzgâr Heeling" },
    { id: "inclination", title: "İnklinasyon Deneyi" },
    { id: "imo", title: "IMO Kriterleri (Özet)" },
  ];

  // GM Calculator States
  const [kb, setKb] = useState("");
  const [bm, setBm] = useState("");
  const [kg, setKg] = useState("");
  
  const gm = useMemo(() => {
    const kbNum = parseFloat(kb);
    const bmNum = parseFloat(bm);
    const kgNum = parseFloat(kg);
    if (isNaN(kbNum) || isNaN(bmNum) || isNaN(kgNum)) return null;
    return kbNum + bmNum - kgNum;
  }, [kb, bm, kg]);

  // GZ Calculator States
  const [gmForGz, setGmForGz] = useState("");
  const [angle, setAngle] = useState("");
  
  const gz = useMemo(() => {
    const gmNum = parseFloat(gmForGz);
    const angleNum = parseFloat(angle);
    if (isNaN(gmNum) || isNaN(angleNum)) return null;
    return gmNum * Math.sin((angleNum * Math.PI) / 180);
  }, [gmForGz, angle]);

  // Free Surface Calculator States
  const [tankLength, setTankLength] = useState("");
  const [tankBreadth, setTankBreadth] = useState("");
  const [fluidDensity, setFluidDensity] = useState("0.85");
  const [shipVolume, setShipVolume] = useState("");
  
  const fsc = useMemo(() => {
    const l = parseFloat(tankLength);
    const b = parseFloat(tankBreadth);
    const rho = parseFloat(fluidDensity);
    const volume = parseFloat(shipVolume);
    if (isNaN(l) || isNaN(b) || isNaN(rho) || isNaN(volume) || volume === 0) return null;
    const iF = (l * Math.pow(b, 3)) / 12;
    const seawater = 1.025;
    return (rho / seawater) * (iF / volume);
  }, [tankLength, tankBreadth, fluidDensity, shipVolume]);

  // Trim Calculator States
  const [tAft, setTAft] = useState("");
  const [tFwd, setTFwd] = useState("");
  const [lpp, setLpp] = useState("");
  
  const trimAngle = useMemo(() => {
    const ta = parseFloat(tAft);
    const tf = parseFloat(tFwd);
    const l = parseFloat(lpp);
    if (isNaN(ta) || isNaN(tf) || isNaN(l) || l === 0) return null;
    return Math.atan((ta - tf) / l) * (180 / Math.PI);
  }, [tAft, tFwd, lpp]);

  // List Calculator States
  const [weight, setWeight] = useState("");
  const [distance, setDistance] = useState("");
  const [displacement, setDisplacement] = useState("");
  const [gmForList, setGmForList] = useState("");
  
  const listAngle = useMemo(() => {
    const w = parseFloat(weight);
    const d = parseFloat(distance);
    const delta = parseFloat(displacement);
    const gmNum = parseFloat(gmForList);
    if (isNaN(w) || isNaN(d) || isNaN(delta) || isNaN(gmNum) || delta === 0 || gmNum === 0) return null;
    return Math.atan((w * d) / (delta * gmNum)) * (180 / Math.PI);
  }, [weight, distance, displacement, gmForList]);

  // Loll Calculator States
  const [kgLoll, setKgLoll] = useState("");
  const [kmLoll, setKmLoll] = useState("");
  
  const lollAngle = useMemo(() => {
    const kgNum = parseFloat(kgLoll);
    const kmNum = parseFloat(kmLoll);
    if (isNaN(kgNum) || isNaN(kmNum) || kmNum <= kgNum) return null;
    return Math.acos(kgNum / kmNum) * (180 / Math.PI);
  }, [kgLoll, kmLoll]);

  // Roll Period Calculator States
  const [breadth, setBreadth] = useState("");
  const [gmRoll, setGmRoll] = useState("");
  
  const rollPeriod = useMemo(() => {
    const b = parseFloat(breadth);
    const gmNum = parseFloat(gmRoll);
    if (isNaN(b) || isNaN(gmNum) || gmNum <= 0) return null;
    const k = 0.35 * b;
    return (2 * Math.PI * k) / Math.sqrt(9.81 * gmNum);
  }, [breadth, gmRoll]);

  // Hydrostatic Calculator States
  const [length, setLength] = useState("");
  const [beam, setBeam] = useState("");
  const [draft, setDraft] = useState("");
  const [cb, setCb] = useState("");
  
  const hydrostatic = useMemo(() => {
    const l = parseFloat(length);
    const b = parseFloat(beam);
    const t = parseFloat(draft);
    const cbNum = parseFloat(cb);
    if (isNaN(l) || isNaN(b) || isNaN(t) || isNaN(cbNum)) return null;
    
    const volume = l * b * t * cbNum;
    const displ = volume * 1.025;
    const kbCalc = t * (0.53 + 0.085 * cbNum);
    const tpcCalc = (l * b * 1.025) / 100;
    
    return { volume, displacement: displ, kb: kbCalc, tpc: tpcCalc };
  }, [length, beam, draft, cb]);

  // Wind Heeling Calculator States
  const [windPressure, setWindPressure] = useState("");
  const [windArea, setWindArea] = useState("");
  const [leverArm, setLeverArm] = useState("");
  const [displWind, setDisplWind] = useState("");
  
  const windHeel = useMemo(() => {
    const p = parseFloat(windPressure);
    const a = parseFloat(windArea);
    const h = parseFloat(leverArm);
    const d = parseFloat(displWind);
    if (isNaN(p) || isNaN(a) || isNaN(h) || isNaN(d) || d === 0) return null;
    
    const force = p * a;
    const moment = force * h;
    const heelingLever = moment / (d * 1000 * 9.81);
    
    return { force, moment, heelingLever };
  }, [windPressure, windArea, leverArm, displWind]);

  return (
    <MobileLayout>
      <div className="space-y-4" data-no-translate>
        <div className="flex items-center justify-between">
          <Link to="/stability">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Stabilite
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Hesaplamalar
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" /> Stabilite Hesaplamaları – İçindekiler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`}>
                  <Button variant="outline" size="sm" className="whitespace-nowrap">
                    {s.title}
                  </Button>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* GM ve KG Temelleri */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle id="gm-kg" className="scroll-mt-24 flex items-center gap-2">
              <Ship className="h-5 w-5" />
              GM ve KG Temelleri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="kb">KB (m)</Label>
                <Input
                  id="kb"
                  type="number"
                  step="0.001"
                  value={kb}
                  onChange={(e) => setKb(e.target.value)}
                  placeholder="0.000"
                />
              </div>
              <div>
                <Label htmlFor="bm">BM (m)</Label>
                <Input
                  id="bm"
                  type="number"
                  step="0.001"
                  value={bm}
                  onChange={(e) => setBm(e.target.value)}
                  placeholder="0.000"
                />
              </div>
              <div>
                <Label htmlFor="kg">KG (m)</Label>
                <Input
                  id="kg"
                  type="number"
                  step="0.001"
                  value={kg}
                  onChange={(e) => setKg(e.target.value)}
                  placeholder="0.000"
                />
              </div>
            </div>
            {gm !== null && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="text-lg font-mono font-semibold">
                  GM = {gm.toFixed(3)} m
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  GM = KB + BM - KG = {kb} + {bm} - {kg} = {gm.toFixed(3)} m
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* GZ Hesaplaması */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle id="gz" className="scroll-mt-24 flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              Doğrultucu Kol (GZ) ve Moment (RM)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gm-gz">GM (m)</Label>
                <Input
                  id="gm-gz"
                  type="number"
                  step="0.001"
                  value={gmForGz}
                  onChange={(e) => setGmForGz(e.target.value)}
                  placeholder="0.000"
                />
              </div>
              <div>
                <Label htmlFor="angle">Yatma Açısı φ (°)</Label>
                <Input
                  id="angle"
                  type="number"
                  step="0.1"
                  value={angle}
                  onChange={(e) => setAngle(e.target.value)}
                  placeholder="0.0"
                />
              </div>
            </div>
            {gz !== null && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="text-lg font-mono font-semibold">
                  GZ = {gz.toFixed(4)} m
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  GZ = GM × sin(φ) = {gmForGz} × sin({angle}°) = {gz.toFixed(4)} m
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Serbest Yüzey Düzeltmesi */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle id="free-surface" className="scroll-mt-24 flex items-center gap-2">
              <Waves className="h-5 w-5" />
              Serbest Yüzey Düzeltmesi (FSC)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tank-length">Tank Uzunluğu l (m)</Label>
                <Input
                  id="tank-length"
                  type="number"
                  step="0.1"
                  value={tankLength}
                  onChange={(e) => setTankLength(e.target.value)}
                  placeholder="0.0"
                />
              </div>
              <div>
                <Label htmlFor="tank-breadth">Tank Genişliği b (m)</Label>
                <Input
                  id="tank-breadth"
                  type="number"
                  step="0.1"
                  value={tankBreadth}
                  onChange={(e) => setTankBreadth(e.target.value)}
                  placeholder="0.0"
                />
              </div>
              <div>
                <Label htmlFor="fluid-density">Sıvı Yoğunluğu ρ (t/m³)</Label>
                <Input
                  id="fluid-density"
                  type="number"
                  step="0.01"
                  value={fluidDensity}
                  onChange={(e) => setFluidDensity(e.target.value)}
                  placeholder="0.85"
                />
              </div>
              <div>
                <Label htmlFor="ship-volume">Gemi Hacmi ∇ (m³)</Label>
                <Input
                  id="ship-volume"
                  type="number"
                  step="1"
                  value={shipVolume}
                  onChange={(e) => setShipVolume(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            {fsc !== null && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="text-lg font-mono font-semibold">
                  FSC = {fsc.toFixed(4)} m
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  FSC = (ρ_tank/ρ_deniz) × (i_f/∇) = ({fluidDensity}/1.025) × ({((parseFloat(tankLength) * Math.pow(parseFloat(tankBreadth), 3)) / 12).toFixed(2)}/{shipVolume})
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trim ve List */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle id="trim-list" className="scroll-mt-24 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Trim ve List Açıları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Trim Açısı Hesaplaması</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="t-aft">Kıç Draft Ta (m)</Label>
                  <Input
                    id="t-aft"
                    type="number"
                    step="0.01"
                    value={tAft}
                    onChange={(e) => setTAft(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="t-fwd">Baş Draft Tf (m)</Label>
                  <Input
                    id="t-fwd"
                    type="number"
                    step="0.01"
                    value={tFwd}
                    onChange={(e) => setTFwd(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="lpp">Gemiler Arası L (m)</Label>
                  <Input
                    id="lpp"
                    type="number"
                    step="0.1"
                    value={lpp}
                    onChange={(e) => setLpp(e.target.value)}
                    placeholder="0.0"
                  />
                </div>
              </div>
              {trimAngle !== null && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <div className="text-lg font-mono font-semibold">
                    Trim Açısı = {trimAngle.toFixed(3)}°
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-semibold">List Açısı Hesaplaması</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Ağırlık w (t)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <Label htmlFor="distance">Mesafe d (m)</Label>
                  <Input
                    id="distance"
                    type="number"
                    step="0.1"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <Label htmlFor="displacement">Deplasman Δ (t)</Label>
                  <Input
                    id="displacement"
                    type="number"
                    step="1"
                    value={displacement}
                    onChange={(e) => setDisplacement(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="gm-list">GM (m)</Label>
                  <Input
                    id="gm-list"
                    type="number"
                    step="0.001"
                    value={gmForList}
                    onChange={(e) => setGmForList(e.target.value)}
                    placeholder="0.000"
                  />
                </div>
              </div>
              {listAngle !== null && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <div className="text-lg font-mono font-semibold">
                    List Açısı = {listAngle.toFixed(3)}°
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Angle of Loll */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle id="loll" className="scroll-mt-24 flex items-center gap-2">
              <Anchor className="h-5 w-5" />
              Angle of Loll
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="kg-loll">KG (m)</Label>
                <Input
                  id="kg-loll"
                  type="number"
                  step="0.001"
                  value={kgLoll}
                  onChange={(e) => setKgLoll(e.target.value)}
                  placeholder="0.000"
                />
              </div>
              <div>
                <Label htmlFor="km-loll">KM (m)</Label>
                <Input
                  id="km-loll"
                  type="number"
                  step="0.001"
                  value={kmLoll}
                  onChange={(e) => setKmLoll(e.target.value)}
                  placeholder="0.000"
                />
              </div>
            </div>
            {lollAngle !== null && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="text-lg font-mono font-semibold">
                  Angle of Loll = {lollAngle.toFixed(3)}°
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  φ_loll = arccos(KG/KM) = arccos({kgLoll}/{kmLoll}) = {lollAngle.toFixed(3)}°
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Yalpa Periyodu */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle id="roll-period" className="scroll-mt-24 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Yalpa Periyodu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="breadth">Genişlik B (m)</Label>
                <Input
                  id="breadth"
                  type="number"
                  step="0.1"
                  value={breadth}
                  onChange={(e) => setBreadth(e.target.value)}
                  placeholder="0.0"
                />
              </div>
              <div>
                <Label htmlFor="gm-roll">GM_düzeltilmiş (m)</Label>
                <Input
                  id="gm-roll"
                  type="number"
                  step="0.001"
                  value={gmRoll}
                  onChange={(e) => setGmRoll(e.target.value)}
                  placeholder="0.000"
                />
              </div>
            </div>
            {rollPeriod !== null && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="text-lg font-mono font-semibold">
                  Yalpa Periyodu = {rollPeriod.toFixed(2)} saniye
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  T = 2π × k / √(g × GM) (k ≈ 0.35 × B)
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hidrostatik Hesaplamalar */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle id="hydrostatic" className="scroll-mt-24 flex items-center gap-2">
              <Ship className="h-5 w-5" />
              Hidrostatik Temeller
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="length">Uzunluk L (m)</Label>
                <Input
                  id="length"
                  type="number"
                  step="0.1"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="0.0"
                />
              </div>
              <div>
                <Label htmlFor="beam">Genişlik B (m)</Label>
                <Input
                  id="beam"
                  type="number"
                  step="0.1"
                  value={beam}
                  onChange={(e) => setBeam(e.target.value)}
                  placeholder="0.0"
                />
              </div>
              <div>
                <Label htmlFor="draft">Draft T (m)</Label>
                <Input
                  id="draft"
                  type="number"
                  step="0.01"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="cb">Blok Katsayısı Cb</Label>
                <Input
                  id="cb"
                  type="number"
                  step="0.001"
                  value={cb}
                  onChange={(e) => setCb(e.target.value)}
                  placeholder="0.000"
                />
              </div>
            </div>
            {hydrostatic !== null && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                  <div>∇ = {hydrostatic.volume.toFixed(2)} m³</div>
                  <div>Δ = {hydrostatic.displacement.toFixed(2)} ton</div>
                  <div>KB = {hydrostatic.kb.toFixed(3)} m</div>
                  <div>TPC = {hydrostatic.tpc.toFixed(2)} ton/cm</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rüzgâr Heeling */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle id="wind" className="scroll-mt-24 flex items-center gap-2">
              <Wind className="h-5 w-5" />
              Rüzgâr Heeling
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wind-pressure">Rüzgâr Basıncı q (N/m²)</Label>
                <Input
                  id="wind-pressure"
                  type="number"
                  step="1"
                  value={windPressure}
                  onChange={(e) => setWindPressure(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="wind-area">Rüzgâr Alanı A (m²)</Label>
                <Input
                  id="wind-area"
                  type="number"
                  step="0.1"
                  value={windArea}
                  onChange={(e) => setWindArea(e.target.value)}
                  placeholder="0.0"
                />
              </div>
              <div>
                <Label htmlFor="lever-arm">Kol Mesafesi z (m)</Label>
                <Input
                  id="lever-arm"
                  type="number"
                  step="0.1"
                  value={leverArm}
                  onChange={(e) => setLeverArm(e.target.value)}
                  placeholder="0.0"
                />
              </div>
              <div>
                <Label htmlFor="displ-wind">Deplasman (ton)</Label>
                <Input
                  id="displ-wind"
                  type="number"
                  step="1"
                  value={displWind}
                  onChange={(e) => setDisplWind(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            {windHeel !== null && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-2">
                <div className="font-mono space-y-1">
                  <div>Rüzgâr Kuvveti: {windHeel.force.toFixed(0)} N</div>
                  <div>Heeling Momenti: {windHeel.moment.toFixed(0)} N·m</div>
                  <div>Heeling Kolu: {windHeel.heelingLever.toFixed(4)} m</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* İnklinasyon Deneyi */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle id="inclination" className="scroll-mt-24 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              İnklinasyon Deneyi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/30 rounded p-3">
              <div className="font-mono text-sm">GM = (w × l) / (Δ × tan φ)</div>
              <p className="text-sm text-muted-foreground mt-2">
                İnklinasyon deneyi için detaylı hesaplama modülü ayrı bir sayfada mevcuttur.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* IMO Kriterleri */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle id="imo" className="scroll-mt-24 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              IMO Kriterleri (Özet)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <div className="font-mono text-sm leading-6 space-y-1">
                <div>• Alan (0–30°) ≥ 0.055 m·rad</div>
                <div>• Alan (0–40°) ≥ 0.090 m·rad</div>
                <div>• Alan (30–40°) ≥ 0.030 m·rad</div>
                <div>• Maksimum GZ ≥ 0.20 m (tepe ≥ 30°)</div>
                <div>• Başlangıç GM ≥ 0.15 m</div>
              </div>
            </div>
            <p className="text-muted-foreground">
              Detaylı IMO kriter kontrolleri için GZ eğrisi hesaplanması gereklidir.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button asChild variant="default" className="gap-2">
            <a href="#gm-kg">
              <Calculator className="h-4 w-4" /> Başa Dön
            </a>
          </Button>
        </div>

        <Separator />
      </div>
    </MobileLayout>
  );
}