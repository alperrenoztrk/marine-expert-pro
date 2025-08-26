import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calculator } from "lucide-react";

export const BasicStabilityCalculations = () => {
  const [gmInputs, setGmInputs] = useState({ kb: "", bm: "", kg: "" });
  const [gm, setGm] = useState<number | null>(null);

  const [kmInputs, setKmInputs] = useState({ kb: "", bm: "" });
  const [km, setKm] = useState<number | null>(null);

  const [bmInputs, setBmInputs] = useState({ length: "", breadth: "", draft: "", cb: "" });
  const [bm, setBm] = useState<number | null>(null);

  const [tpcInputs, setTpcInputs] = useState({ awp: "", rho: "1.025" });
  const [tpc, setTpc] = useState<number | null>(null);

  const [draftInputs, setDraftInputs] = useState({ volume: "", awp: "" });
  const [draftChange, setDraftChange] = useState<number | null>(null);

  const [lcgItems, setLcgItems] = useState<Array<{ name: string; weight: string; lcg: string }>>([
    { name: "Item 1", weight: "", lcg: "" },
  ]);
  const [lcgResult, setLcgResult] = useState<number | null>(null);

  const calcGM = () => {
    const kb = parseFloat(gmInputs.kb);
    const bm = parseFloat(gmInputs.bm);
    const kg = parseFloat(gmInputs.kg);
    if ([kb, bm, kg].some(Number.isNaN)) return;
    setGm(kb + bm - kg);
  };

  const calcKM = () => {
    const kb = parseFloat(kmInputs.kb);
    const bm = parseFloat(kmInputs.bm);
    if ([kb, bm].some(Number.isNaN)) return;
    setKm(kb + bm);
  };

  const calcBM = () => {
    const L = parseFloat(bmInputs.length);
    const B = parseFloat(bmInputs.breadth);
    const T = parseFloat(bmInputs.draft);
    const Cb = parseFloat(bmInputs.cb || "0.7");
    if ([L, B, T, Cb].some(Number.isNaN) || L <= 0 || B <= 0 || T <= 0) return;
    const Ixx = (L * Math.pow(B, 3)) / 12;
    const volumeDisplacement = L * B * T * Cb;
    setBm(Ixx / volumeDisplacement);
  };

  const calcTPC = () => {
    const awp = parseFloat(tpcInputs.awp);
    const rho = parseFloat(tpcInputs.rho);
    if ([awp, rho].some(Number.isNaN)) return;
    setTpc((awp * rho) / 100);
  };

  const calcDraftChange = () => {
    const V = parseFloat(draftInputs.volume);
    const awp = parseFloat(draftInputs.awp);
    if ([V, awp].some(Number.isNaN) || awp === 0) return;
    setDraftChange(V / awp);
  };

  const calcLCG = () => {
    let sumW = 0;
    let sumWx = 0;
    for (const it of lcgItems) {
      const w = parseFloat(it.weight);
      const x = parseFloat(it.lcg);
      if (!Number.isNaN(w) && !Number.isNaN(x)) {
        sumW += w; sumWx += w * x;
      }
    }
    if (sumW <= 0) return;
    setLcgResult(sumWx / sumW);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Temel Stabilite Hesaplamaları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded bg-muted">
              <h4 className="font-semibold mb-3">GM = KB + BM - KG</h4>
              <div className="grid grid-cols-3 gap-2 items-end">
                <div>
                  <Label>KB (m)</Label>
                  <Input value={gmInputs.kb} onChange={(e)=>setGmInputs(p=>({...p, kb:e.target.value}))} />
                </div>
                <div>
                  <Label>BM (m)</Label>
                  <Input value={gmInputs.bm} onChange={(e)=>setGmInputs(p=>({...p, bm:e.target.value}))} />
                </div>
                <div>
                  <Label>KG (m)</Label>
                  <Input value={gmInputs.kg} onChange={(e)=>setGmInputs(p=>({...p, kg:e.target.value}))} />
                </div>
                <Button className="col-span-3" onClick={calcGM}><Calculator className="h-4 w-4 mr-1"/>Hesapla</Button>
              </div>
              {gm!==null && (<div className="mt-2 text-sm">GM = <span className="font-mono">{gm.toFixed(3)} m</span></div>)}
            </div>

            <div className="p-4 rounded bg-muted">
              <h4 className="font-semibold mb-3">KM = KB + BM</h4>
              <div className="grid grid-cols-3 gap-2 items-end">
                <div>
                  <Label>KB (m)</Label>
                  <Input value={kmInputs.kb} onChange={(e)=>setKmInputs(p=>({...p, kb:e.target.value}))} />
                </div>
                <div>
                  <Label>BM (m)</Label>
                  <Input value={kmInputs.bm} onChange={(e)=>setKmInputs(p=>({...p, bm:e.target.value}))} />
                </div>
                <div className="flex items-end"/>
                <Button className="col-span-3" onClick={calcKM}><Calculator className="h-4 w-4 mr-1"/>Hesapla</Button>
              </div>
              {km!==null && (<div className="mt-2 text-sm">KM = <span className="font-mono">{km.toFixed(3)} m</span></div>)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded bg-muted">
              <h4 className="font-semibold mb-3">BM (dikdörtgen yaklaşımı)</h4>
              <div className="grid grid-cols-2 gap-2 items-end">
                <div>
                  <Label>L (m)</Label>
                  <Input value={bmInputs.length} onChange={(e)=>setBmInputs(p=>({...p, length:e.target.value}))} />
                </div>
                <div>
                  <Label>B (m)</Label>
                  <Input value={bmInputs.breadth} onChange={(e)=>setBmInputs(p=>({...p, breadth:e.target.value}))} />
                </div>
                <div>
                  <Label>Su Çekimi (m)</Label>
                  <Input value={bmInputs.draft} onChange={(e)=>setBmInputs(p=>({...p, draft:e.target.value}))} />
                </div>
                <div>
                  <Label>Cb</Label>
                  <Input value={bmInputs.cb} onChange={(e)=>setBmInputs(p=>({...p, cb:e.target.value}))} />
                </div>
                <Button className="col-span-2" onClick={calcBM}><Calculator className="h-4 w-4 mr-1"/>Hesapla</Button>
              </div>
              {bm!==null && (<div className="mt-2 text-sm">BM = <span className="font-mono">{bm.toFixed(3)} m</span></div>)}
            </div>

            <div className="p-4 rounded bg-muted">
              <h4 className="font-semibold mb-3">TPC = Awp × ρ / 100</h4>
              <div className="grid grid-cols-2 gap-2 items-end">
                <div>
                  <Label>Awp (m²)</Label>
                  <Input value={tpcInputs.awp} onChange={(e)=>setTpcInputs(p=>({...p, awp:e.target.value}))} />
                </div>
                <div>
                  <Label>ρ (t/m³)</Label>
                  <Input value={tpcInputs.rho} onChange={(e)=>setTpcInputs(p=>({...p, rho:e.target.value}))} />
                </div>
                <Button className="col-span-2" onClick={calcTPC}><Calculator className="h-4 w-4 mr-1"/>Hesapla</Button>
              </div>
              {tpc!==null && (<div className="mt-2 text-sm">TPC = <span className="font-mono">{tpc.toFixed(2)} ton/cm</span></div>)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded bg-muted">
              <h4 className="font-semibold mb-3">Su çekimi değişimi ΔT = V / Awp</h4>
              <div className="grid grid-cols-2 gap-2 items-end">
                <div>
                  <Label>Hacim V (m³)</Label>
                  <Input value={draftInputs.volume} onChange={(e)=>setDraftInputs(p=>({...p, volume:e.target.value}))} />
                </div>
                <div>
                  <Label>Awp (m²)</Label>
                  <Input value={draftInputs.awp} onChange={(e)=>setDraftInputs(p=>({...p, awp:e.target.value}))} />
                </div>
                <Button className="col-span-2" onClick={calcDraftChange}><Calculator className="h-4 w-4 mr-1"/>Hesapla</Button>
              </div>
              {draftChange!==null && (<div className="mt-2 text-sm">ΔT = <span className="font-mono">{draftChange.toFixed(3)} m</span></div>)}
            </div>

            <div className="p-4 rounded bg-muted">
              <h4 className="font-semibold mb-3">LCG (∑W·x / ∑W)</h4>
              <div className="space-y-2">
                {lcgItems.map((it, idx)=> (
                  <div key={idx} className="grid grid-cols-3 gap-2">
                    <Input placeholder="Ad" value={it.name} onChange={(e)=>{
                      const c = [...lcgItems]; c[idx] = { ...c[idx], name: e.target.value }; setLcgItems(c);
                    }} />
                    <Input placeholder="Ağırlık (t)" value={it.weight} onChange={(e)=>{
                      const c = [...lcgItems]; c[idx] = { ...c[idx], weight: e.target.value }; setLcgItems(c);
                    }} />
                    <Input placeholder="LCG (m)" value={it.lcg} onChange={(e)=>{
                      const c = [...lcgItems]; c[idx] = { ...c[idx], lcg: e.target.value }; setLcgItems(c);
                    }} />
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={()=> setLcgItems(p=>[...p, { name: `Item ${p.length+1}`, weight: "", lcg: "" }])}>Satır Ekle</Button>
                  <Button size="sm" onClick={calcLCG}><Calculator className="h-4 w-4 mr-1"/>Hesapla</Button>
                </div>
                {lcgResult!==null && (<div className="text-sm">LCG = <span className="font-mono">{lcgResult.toFixed(2)} m</span></div>)}
              </div>
            </div>
          </div>

          <Separator />
          <div className="text-xs opacity-70">Basit yaklaşımlar kullanılmıştır; ayrıntılı analiz için Gelişmiş sekmesini kullanın.</div>
        </CardContent>
      </Card>
    </div>
  );
};

