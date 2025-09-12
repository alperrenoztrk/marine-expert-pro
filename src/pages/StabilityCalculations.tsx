import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Sigma, Calculator, Shield, Anchor, Ship, Wind, Ruler, Activity } from "lucide-react";
import { useMemo, useState } from "react";

type TankRow = {
  id: string;
  length_m: string;
  breadth_m: string;
  rho_t: string; // t/m3
  volume_ship_m3: string; // ∇ of ship
};

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

  // GM calculator states
  const [kb, setKb] = useState<string>("");
  const [bm, setBm] = useState<string>("");
  const [kg, setKg] = useState<string>("");
  const gm = useMemo(() => {
    const KB = parseFloat(kb);
    const BM = parseFloat(bm);
    const KG = parseFloat(kg);
    if ([KB, BM, KG].some((v) => Number.isNaN(v))) return null;
    return KB + BM - KG;
  }, [kb, bm, kg]);

  // GZ small-angle calculator
  const [gmForGZ, setGmForGZ] = useState<string>("");
  const [phiDeg, setPhiDeg] = useState<string>("");
  const gzSmall = useMemo(() => {
    const GM = parseFloat(gmForGZ);
    const PHI = parseFloat(phiDeg);
    if ([GM, PHI].some((v) => Number.isNaN(v))) return null;
    return GM * Math.sin((PHI * Math.PI) / 180);
  }, [gmForGZ, phiDeg]);

  // General GZ via KN
  const [kn, setKn] = useState<string>("");
  const [kgForKN, setKgForKN] = useState<string>("");
  const [phiDeg2, setPhiDeg2] = useState<string>("");
  const gzGeneral = useMemo(() => {
    const KN = parseFloat(kn);
    const KG2 = parseFloat(kgForKN);
    const PHI2 = parseFloat(phiDeg2);
    if ([KN, KG2, PHI2].some((v) => Number.isNaN(v))) return null;
    return KN - KG2 * Math.sin((PHI2 * Math.PI) / 180);
  }, [kn, kgForKN, phiDeg2]);

  // RM = Δ · GZ
  const [deltaTons, setDeltaTons] = useState<string>("");
  const rm = useMemo(() => {
    const D = parseFloat(deltaTons);
    const GZ = gzSmall ?? gzGeneral ?? NaN;
    if (Number.isNaN(D) || Number.isNaN(GZ)) return null;
    return D * GZ; // kN·m not applied here; Δ in ton and GZ in m -> ton·m
  }, [deltaTons, gzSmall, gzGeneral]);

  // FSC multi-tank
  const [tanks, setTanks] = useState<TankRow[]>([
    { id: crypto.randomUUID(), length_m: "", breadth_m: "", rho_t: "0.85", volume_ship_m3: "" },
  ]);
  const seawater = 1.025; // t/m3
  const fscRows = useMemo(() => {
    return tanks.map((t) => {
      const l = parseFloat(t.length_m);
      const b = parseFloat(t.breadth_m);
      const rho = parseFloat(t.rho_t);
      const vol = parseFloat(t.volume_ship_m3);
      if ([l, b, rho, vol].some((v) => Number.isNaN(v)) || vol === 0) return { fsc: null } as { fsc: number | null };
      const iF = (l * Math.pow(b, 3)) / 12;
      const fsc = (rho / seawater) * (iF / vol);
      return { fsc } as { fsc: number | null };
    });
  }, [tanks]);
  const fscSum = useMemo(() => fscRows.reduce((s, r) => s + (r.fsc ?? 0), 0), [fscRows]);
  const [gmBase, setGmBase] = useState<string>("");
  const gmCorrected = useMemo(() => {
    const GMb = parseFloat(gmBase);
    if (Number.isNaN(GMb)) return null;
    return GMb - fscSum;
  }, [gmBase, fscSum]);

  // Trim/List
  const [ta, setTa] = useState<string>("");
  const [tf, setTf] = useState<string>("");
  const [L, setL] = useState<string>("");
  const trimAngle = useMemo(() => {
    const TA = parseFloat(ta);
    const TF = parseFloat(tf);
    const LL = parseFloat(L);
    if ([TA, TF, LL].some((v) => Number.isNaN(v)) || LL === 0) return null;
    return Math.atan((TA - TF) / LL) * (180 / Math.PI);
  }, [ta, tf, L]);

  const [w, setW] = useState<string>("");
  const [d, setD] = useState<string>("");
  const [Delta, setDelta] = useState<string>("");
  const [GM, setGM] = useState<string>("");
  const listAngle = useMemo(() => {
    const W = parseFloat(w);
    const Dd = parseFloat(d);
    const De = parseFloat(Delta);
    const Gm = parseFloat(GM);
    if ([W, Dd, De, Gm].some((v) => Number.isNaN(v)) || De === 0 || Gm === 0) return null;
    return Math.atan((W * Dd) / (De * Gm)) * (180 / Math.PI);
  }, [w, d, Delta, GM]);

  // Loll
  const [kgLoll, setKgLoll] = useState<string>("");
  const [kmLoll, setKmLoll] = useState<string>("");
  const lollAngle = useMemo(() => {
    const KG = parseFloat(kgLoll);
    const KM = parseFloat(kmLoll);
    if ([KG, KM].some((v) => Number.isNaN(v)) || KM <= KG) return null;
    return Math.acos(KG / KM) * (180 / Math.PI);
  }, [kgLoll, kmLoll]);

  // Roll period
  const [breadth, setBreadth] = useState<string>("");
  const [gmCorr, setGmCorr] = useState<string>("");
  const [kRadius, setKRadius] = useState<string>("");
  const rollPeriod = useMemo(() => {
    const B = parseFloat(breadth);
    const GMc = parseFloat(gmCorr);
    const kVal = kRadius ? parseFloat(kRadius) : !Number.isNaN(B) ? 0.35 * B : NaN;
    if ([B, GMc, kVal].some((v) => Number.isNaN(v)) || GMc <= 0) return null;
    return (2 * Math.PI * kVal) / Math.sqrt(9.81 * GMc);
  }, [breadth, gmCorr, kRadius]);

  // Hydrostatic quick calcs
  const [Lhs, setLhs] = useState<string>("");
  const [Bhs, setBhs] = useState<string>("");
  const [Ths, setThs] = useState<string>("");
  const [Cb, setCb] = useState<string>("");
  const [Cw, setCw] = useState<string>("");
  const hydro = useMemo(() => {
    const Lm = parseFloat(Lhs);
    const Bm = parseFloat(Bhs);
    const Tm = parseFloat(Ths);
    const Cbb = parseFloat(Cb);
    const Cww = parseFloat(Cw);
    if ([Lm, Bm, Tm, Cbb, Cww].some((v) => Number.isNaN(v))) return null;
    const volume = Lm * Bm * Tm * Cbb;
    const displacement = volume * seawater;
    const wpa = Lm * Bm * Cww;
    const KB = Tm * (0.53 + 0.085 * Cbb);
    const iT = (Lm * Math.pow(Bm, 3) * Cww) / 12;
    const BMt = iT / volume;
    const KMt = KB + BMt;
    const TPC = (wpa * seawater) / 100;
    return { volume, displacement, wpa, KB, BMt, KMt, TPC };
  }, [Lhs, Bhs, Ths, Cb, Cw]);

  // Wind heeling
  const [q, setQ] = useState<string>("");
  const [A, setA] = useState<string>("");
  const [z, setZ] = useState<string>("");
  const [DeltaH, setDeltaH] = useState<string>("");
  const wind = useMemo(() => {
    const qn = parseFloat(q);
    const An = parseFloat(A);
    const zn = parseFloat(z);
    const Dn = parseFloat(DeltaH);
    if ([qn, An, zn, Dn].some((v) => Number.isNaN(v))) return null;
    const Mh_kNm = (qn * An * zn) / 1000;
    const ah_m = Mh_kNm / (Dn * 9.81);
    return { Mh_kNm, ah_m };
  }, [q, A, z, DeltaH]);

  // Inclination test
  const [wT, setWT] = useState<string>("");
  const [lT, setLT] = useState<string>("");
  const [DeltaT, setDeltaT] = useState<string>("");
  const [phiObs, setPhiObs] = useState<string>("");
  const gmtIncl = useMemo(() => {
    const wt = parseFloat(wT);
    const lt = parseFloat(lT);
    const Dt = parseFloat(DeltaT);
    const ph = parseFloat(phiObs);
    if ([wt, lt, Dt, ph].some((v) => Number.isNaN(v)) || Math.tan((ph * Math.PI) / 180) === 0) return null;
    return (wt * lt) / (Dt * Math.tan((ph * Math.PI) / 180));
  }, [wT, lT, DeltaT, phiObs]);

  // IMO quick checker (uses hydro + gmCorrected)
  // For simplicity we only check initial GM threshold here; others require GZ curve.

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
              <Sigma className="h-5 w-5" /> Stabilite Hesaplamaları – İçindekiler
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

        {/* GM & KG */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle id="gm-kg" className="scroll-mt-24">GM ve KG Temelleri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div>
                <Label>KB (m)</Label>
                <Input type="number" value={kb} onChange={(e)=>setKb(e.target.value)} />
              </div>
              <div>
                <Label>BM (m)</Label>
                <Input type="number" value={bm} onChange={(e)=>setBm(e.target.value)} />
              </div>
              <div>
                <Label>KG (m)</Label>
                <Input type="number" value={kg} onChange={(e)=>setKg(e.target.value)} />
              </div>
              <Button className="w-full" variant="default"><Calculator className="h-4 w-4 mr-2"/>Hesapla</Button>
            </div>
            {gm !== null && (
              <div className="bg-muted/30 rounded p-3">
                <div className="font-mono">GM = {gm.toFixed(3)} m</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* GZ & RM */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle id="gz" className="scroll-mt-24">Doğrultucu Kol (GZ) ve Moment (RM)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="bg-muted/30 rounded p-3 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div>
                  <Label>GM (m)</Label>
                  <Input type="number" value={gmForGZ} onChange={(e)=>setGmForGZ(e.target.value)} />
                </div>
                <div>
                  <Label>φ (°)</Label>
                  <Input type="number" value={phiDeg} onChange={(e)=>setPhiDeg(e.target.value)} />
                </div>
                <Button className="w-full"><Calculator className="h-4 w-4 mr-2"/>GZ (küçük açı)</Button>
              </div>
              {gzSmall !== null && (
                <div className="font-mono">GZ ≈ {gzSmall.toFixed(4)} m</div>
              )}
            </div>

            <div className="bg-muted/30 rounded p-3 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                <div>
                  <Label>KN (m)</Label>
                  <Input type="number" value={kn} onChange={(e)=>setKn(e.target.value)} />
                </div>
                <div>
                  <Label>KG (m)</Label>
                  <Input type="number" value={kgForKN} onChange={(e)=>setKgForKN(e.target.value)} />
                </div>
                <div>
                  <Label>φ (°)</Label>
                  <Input type="number" value={phiDeg2} onChange={(e)=>setPhiDeg2(e.target.value)} />
                </div>
                <Button className="w-full"><Calculator className="h-4 w-4 mr-2"/>GZ (genel)</Button>
              </div>
              {gzGeneral !== null && (
                <div className="font-mono">GZ = {gzGeneral.toFixed(4)} m</div>
              )}
            </div>

            <div className="bg-muted/30 rounded p-3 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                <div>
                  <Label>Δ (ton)</Label>
                  <Input type="number" value={deltaTons} onChange={(e)=>setDeltaTons(e.target.value)} />
                </div>
                <Button className="w-full"><Calculator className="h-4 w-4 mr-2"/>RM</Button>
              </div>
              {rm !== null && (
                <div className="font-mono">RM = {rm.toFixed(2)} ton·m</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* FSC */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle id="free-surface" className="scroll-mt-24">Serbest Yüzey Düzeltmesi (FSC)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {tanks.map((t, idx) => (
              <div key={t.id} className="bg-muted/30 rounded p-3">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
                  <div>
                    <Label>L (m)</Label>
                    <Input type="number" value={t.length_m} onChange={(e)=> setTanks(prev => prev.map((p,i)=> i===idx?{...p, length_m:e.target.value}:p))} />
                  </div>
                  <div>
                    <Label>b (m)</Label>
                    <Input type="number" value={t.breadth_m} onChange={(e)=> setTanks(prev => prev.map((p,i)=> i===idx?{...p, breadth_m:e.target.value}:p))} />
                  </div>
                  <div>
                    <Label>ρ_t (t/m³)</Label>
                    <Input type="number" value={t.rho_t} onChange={(e)=> setTanks(prev => prev.map((p,i)=> i===idx?{...p, rho_t:e.target.value}:p))} />
                  </div>
                  <div>
                    <Label>∇ (m³)</Label>
                    <Input type="number" value={t.volume_ship_m3} onChange={(e)=> setTanks(prev => prev.map((p,i)=> i===idx?{...p, volume_ship_m3:e.target.value}:p))} />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="w-full" onClick={() => setTanks(prev => prev.filter((_,i)=>i!==idx))}>Sil</Button>
                  </div>
                </div>
                <div className="mt-2 font-mono">FSC[{idx+1}] = {fscRows[idx]?.fsc?.toFixed(4) ?? '-'} m</div>
              </div>
            ))}
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setTanks(prev => [...prev, { id: crypto.randomUUID(), length_m: "", breadth_m: "", rho_t: "0.85", volume_ship_m3: prev[prev.length-1]?.volume_ship_m3 || "" }])}>Tank Ekle</Button>
            </div>
            <div className="bg-muted/30 rounded p-3 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div className="font-mono">ΣFSC = {fscSum.toFixed(4)} m</div>
              <div>
                <Label>Başlangıç GM (m)</Label>
                <Input type="number" value={gmBase} onChange={(e)=>setGmBase(e.target.value)} />
              </div>
              <div className="font-mono">GM_düz = {(gmCorrected ?? NaN).toFixed ? gmCorrected!.toFixed(3) : '-'} m</div>
            </div>
          </CardContent>
        </Card>

        {/* Trim & List */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle id="trim-list" className="scroll-mt-24">Trim ve List Açıları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                <div>
                  <Label>Ta (m)</Label>
                  <Input type="number" value={ta} onChange={(e)=>setTa(e.target.value)} />
                </div>
                <div>
                  <Label>Tf (m)</Label>
                  <Input type="number" value={tf} onChange={(e)=>setTf(e.target.value)} />
                </div>
                <div>
                  <Label>L (m)</Label>
                  <Input type="number" value={L} onChange={(e)=>setL(e.target.value)} />
                </div>
                <Button className="w-full"><Ruler className="h-4 w-4 mr-2"/>Trim Açısı</Button>
              </div>
              {trimAngle !== null && <div className="font-mono mt-2">φ_trim = {trimAngle.toFixed(4)}°</div>}
            </div>

            <div className="bg-muted/30 rounded p-3">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
                <div>
                  <Label>W (t)</Label>
                  <Input type="number" value={w} onChange={(e)=>setW(e.target.value)} />
                </div>
                <div>
                  <Label>d (m)</Label>
                  <Input type="number" value={d} onChange={(e)=>setD(e.target.value)} />
                </div>
                <div>
                  <Label>Δ (t)</Label>
                  <Input type="number" value={Delta} onChange={(e)=>setDelta(e.target.value)} />
                </div>
                <div>
                  <Label>GM (m)</Label>
                  <Input type="number" value={GM} onChange={(e)=>setGM(e.target.value)} />
                </div>
                <Button className="w-full"><Calculator className="h-4 w-4 mr-2"/>List Açısı</Button>
              </div>
              {listAngle !== null && <div className="font-mono mt-2">φ_list = {listAngle.toFixed(4)}°</div>}
            </div>
          </CardContent>
        </Card>

        {/* Loll */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle id="loll" className="scroll-mt-24">Angle of Loll</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div>
                <Label>KG (m)</Label>
                <Input type="number" value={kgLoll} onChange={(e)=>setKgLoll(e.target.value)} />
              </div>
              <div>
                <Label>KM (m)</Label>
                <Input type="number" value={kmLoll} onChange={(e)=>setKmLoll(e.target.value)} />
              </div>
              <Button className="w-full"><Activity className="h-4 w-4 mr-2"/>Loll Açısı</Button>
            </div>
            {lollAngle !== null && (
              <div className="bg-muted/30 rounded p-3 font-mono">φ_loll = {lollAngle.toFixed(2)}°</div>
            )}
          </CardContent>
        </Card>

        {/* Roll period */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle id="roll-period" className="scroll-mt-24">Yalpa Periyodu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div>
                <Label>B (m)</Label>
                <Input type="number" value={breadth} onChange={(e)=>setBreadth(e.target.value)} />
              </div>
              <div>
                <Label>GM_düz (m)</Label>
                <Input type="number" value={gmCorr} onChange={(e)=>setGmCorr(e.target.value)} />
              </div>
              <div>
                <Label>k (m)</Label>
                <Input type="number" value={kRadius} onChange={(e)=>setKRadius(e.target.value)} placeholder="Otomatik 0.35·B" />
              </div>
              <Button className="w-full"><Calculator className="h-4 w-4 mr-2"/>Periyot</Button>
            </div>
            {rollPeriod !== null && (
              <div className="bg-muted/30 rounded p-3 font-mono">T = {rollPeriod.toFixed(2)} s</div>
            )}
          </CardContent>
        </Card>

        {/* Hydrostatic foundations */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle id="hydrostatic" className="scroll-mt-24">Hidrostatik Temeller</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 items-end">
              <div><Label>L (m)</Label><Input type="number" value={Lhs} onChange={(e)=>setLhs(e.target.value)} /></div>
              <div><Label>B (m)</Label><Input type="number" value={Bhs} onChange={(e)=>setBhs(e.target.value)} /></div>
              <div><Label>T (m)</Label><Input type="number" value={Ths} onChange={(e)=>setThs(e.target.value)} /></div>
              <div><Label>C_B</Label><Input type="number" value={Cb} onChange={(e)=>setCb(e.target.value)} /></div>
              <div><Label>C_W</Label><Input type="number" value={Cw} onChange={(e)=>setCw(e.target.value)} /></div>
              <Button className="w-full"><Calculator className="h-4 w-4 mr-2"/>Hesapla</Button>
            </div>
            {hydro && (
              <div className="bg-muted/30 rounded p-3 font-mono space-y-1">
                <div>Δ = {hydro.displacement.toFixed(1)} t, ∇ = {hydro.volume.toFixed(1)} m³</div>
                <div>KB = {hydro.KB.toFixed(3)} m, BM_T = {hydro.BMt.toFixed(3)} m, KM_T = {hydro.KMt.toFixed(3)} m</div>
                <div>WPA = {hydro.wpa.toFixed(1)} m², TPC = {hydro.TPC.toFixed(2)} t/cm</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Wind heeling */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle id="wind" className="scroll-mt-24">Rüzgâr Heeling</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
              <div><Label>q (N/m²)</Label><Input type="number" value={q} onChange={(e)=>setQ(e.target.value)} /></div>
              <div><Label>A (m²)</Label><Input type="number" value={A} onChange={(e)=>setA(e.target.value)} /></div>
              <div><Label>z (m)</Label><Input type="number" value={z} onChange={(e)=>setZ(e.target.value)} /></div>
              <div><Label>Δ (t)</Label><Input type="number" value={DeltaH} onChange={(e)=>setDeltaH(e.target.value)} /></div>
              <Button className="w-full"><Wind className="h-4 w-4 mr-2"/>Hesapla</Button>
            </div>
            {wind && (
              <div className="bg-muted/30 rounded p-3 font-mono">M_h = {wind.Mh_kNm.toFixed(1)} kN·m, a_h = {wind.ah_m.toFixed(4)} m</div>
            )}
          </CardContent>
        </Card>

        {/* Inclination test */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle id="inclination" className="scroll-mt-24">İnklinasyon Deneyi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
              <div><Label>w (t)</Label><Input type="number" value={wT} onChange={(e)=>setWT(e.target.value)} /></div>
              <div><Label>l (m)</Label><Input type="number" value={lT} onChange={(e)=>setLT(e.target.value)} /></div>
              <div><Label>Δ (t)</Label><Input type="number" value={DeltaT} onChange={(e)=>setDeltaT(e.target.value)} /></div>
              <div><Label>φ (°)</Label><Input type="number" value={phiObs} onChange={(e)=>setPhiObs(e.target.value)} /></div>
              <Button className="w-full"><Calculator className="h-4 w-4 mr-2"/>GM_T</Button>
            </div>
            {gmtIncl !== null && (
              <div className="bg-muted/30 rounded p-3 font-mono">GM_T = {gmtIncl.toFixed(3)} m</div>
            )}
          </CardContent>
        </Card>

        {/* Minimal IMO check note */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle id="imo" className="scroll-mt-24">IMO Kriterleri (Özet)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <div className="font-mono">Başlangıç GM ≥ 0.15 m — GM_düz: {gmCorrected !== null && !Number.isNaN(gmCorrected) ? gmCorrected!.toFixed(3) + ' m' : '-'}</div>
            </div>
            <p>Alan kriterleri ve tam doğrulama için GZ eğrisi entegrasyonu ayrı analiz modülünde yapılır.</p>
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

