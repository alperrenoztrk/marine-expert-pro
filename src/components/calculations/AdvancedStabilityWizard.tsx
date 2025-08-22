import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HydrostaticCalculations } from "@/services/hydrostaticCalculations";
import { ShipGeometry } from "@/types/hydrostatic";

// Kullanıcı profili yapısı (mevcut LS formatına uyumlu)
type ShipProfile = {
  name: string;
  length: number;
  breadth: number;
  depth: number;
  draft: number;
  blockCoefficient: number;
  waterplaneCoefficient: number;
  tanks: Array<{ name: string; capacity: number; current: number; lcg: number; vcg: number; tcg: number; density: number; freeSurfaceEffect?: number }>;
};

type LearnMode = 'gm' | 'gz' | 'trim' | 'list' | 'loll';

const LS_KEY = "advanced-ship-profile";

export const AdvancedStabilityWizard = ({ open, onClose, onSaved }: { open: boolean; onClose: ()=>void; onSaved: (p: ShipProfile)=>void }) => {
  // Genel akış adımları: 0=hedef seçimi, 1=dinamik hesap ekranı, 2=profil düzenleme
  const [step, setStep] = useState(0);
  const [learnMode, setLearnMode] = useState<LearnMode | null>(null);

  // Profil durumu
  const [profile, setProfile] = useState<ShipProfile>({
    name: "",
    length: 0, breadth: 0, depth: 0, draft: 0,
    blockCoefficient: 0.7, waterplaneCoefficient: 0.8,
    tanks: []
  });
  const [hasStoredProfile, setHasStoredProfile] = useState(false);

  // Dinamik hesaplarda profil kullanımı
  const [useProfile, setUseProfile] = useState(true);

  // Profil kullanılmadığında geometri girişleri
  const [geometryInputs, setGeometryInputs] = useState({
    length: "100",
    breadth: "20",
    depth: "10",
    draft: "6",
    blockCoefficient: "0.7",
    waterplaneCoefficient: "0.8"
  });

  // Hesaplamalara özel girişler ve sonuçlar
  const [kgInput, setKgInput] = useState<string>("5"); // GM, GZ, List, Loll için KG
  const [angleInput, setAngleInput] = useState<string>("10"); // GZ için açı (°)
  const [trimTa, setTrimTa] = useState<string>("6.2");
  const [trimTf, setTrimTf] = useState<string>("5.8");
  const [listWeight, setListWeight] = useState<string>("100"); // ton
  const [listDistance, setListDistance] = useState<string>("5"); // m

  const [resultText, setResultText] = useState<string>("");

  // Profil düzenleme alt-adımı (0=geometri, 1=tanklar)
  const [profileStep, setProfileStep] = useState(0);

  useEffect(()=>{
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed: ShipProfile = JSON.parse(raw);
        setProfile(parsed);
        setHasStoredProfile(true);
        // Geometri girişlerini profilden doldur
        setGeometryInputs({
          length: String(parsed.length || 0),
          breadth: String(parsed.breadth || 0),
          depth: String(parsed.depth || 0),
          draft: String(parsed.draft || 0),
          blockCoefficient: String(parsed.blockCoefficient || 0.7),
          waterplaneCoefficient: String(parsed.waterplaneCoefficient || 0.8)
        });
        setUseProfile(true);
      } else {
        setHasStoredProfile(false);
        setUseProfile(false);
      }
    } catch {
      setHasStoredProfile(false);
      setUseProfile(false);
    }
  }, [open]);

  const getGeometry = (): ShipGeometry => {
    const length = useProfile ? profile.length : parseFloat(geometryInputs.length);
    const breadth = useProfile ? profile.breadth : parseFloat(geometryInputs.breadth);
    const depth = useProfile ? profile.depth : parseFloat(geometryInputs.depth);
    const draft = useProfile ? profile.draft : parseFloat(geometryInputs.draft);
    const blockCoefficient = useProfile ? profile.blockCoefficient : parseFloat(geometryInputs.blockCoefficient);
    const waterplaneCoefficient = useProfile ? profile.waterplaneCoefficient : parseFloat(geometryInputs.waterplaneCoefficient);

    // Varsayılan katsayılar (gerekli tip alanları)
    const geometry: ShipGeometry = {
      length: isFinite(length) ? length : 0,
      breadth: isFinite(breadth) ? breadth : 0,
      depth: isFinite(depth) ? depth : 0,
      draft: isFinite(draft) ? draft : 0,
      blockCoefficient: isFinite(blockCoefficient) ? blockCoefficient : 0.7,
      waterplaneCoefficient: isFinite(waterplaneCoefficient) ? waterplaneCoefficient : 0.8,
      midshipCoefficient: 0.9,
      prismaticCoefficient: 0.65,
      verticalPrismaticCoefficient: 0.75
    };
    return geometry;
  };

  const saveProfile = () => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(profile)); } catch {}
    setHasStoredProfile(true);
    onSaved(profile);
  };

  const closeWizard = () => {
    setResultText("");
    setLearnMode(null);
    setStep(0);
    onClose();
  };

  const handleCalculate = () => {
    if (!learnMode) return;
    const geometry = getGeometry();

    // Ortak yardımcılar
    const kg = parseFloat(kgInput);
    const displacement = HydrostaticCalculations.calculateDisplacement(geometry).displacement; // ton
    const g = 9.81;

    if (learnMode === 'gm') {
      if (!isFinite(kg)) { setResultText("Lütfen geçerli KG girin."); return; }
      const centers = HydrostaticCalculations.calculateCenterPoints(geometry, kg);
      const stability = centers.gm > 0 ? "Pozitif (Stabil)" : (centers.gm === 0 ? "Nötr" : "Negatif (Stabil değil)");
      setResultText(`GM = ${centers.kb.toFixed(3)} + ${centers.bm.toFixed(3)} - ${kg.toFixed(3)} = ${centers.gm.toFixed(3)} m → ${stability}`);
      return;
    }

    if (learnMode === 'gz') {
      const angle = parseFloat(angleInput);
      if (!isFinite(kg) || !isFinite(angle)) { setResultText("Lütfen KG ve Açı girin."); return; }
      const centers = HydrostaticCalculations.calculateCenterPoints(geometry, kg);
      const angleRad = (angle * Math.PI) / 180;
      const gz = Math.max(0, (centers.km - kg) * Math.sin(angleRad) - 0.5 * geometry.breadth * Math.pow(Math.sin(angleRad), 2));
      const rm = gz * displacement * g; // kN·m yaklaşık
      setResultText(`GZ(${angle.toFixed(1)}°) = ${gz.toFixed(4)} m, Sağlama Momenti ≈ ${rm.toFixed(1)} kN·m`);
      return;
    }

    if (learnMode === 'trim') {
      const ta = parseFloat(trimTa);
      const tf = parseFloat(trimTf);
      if (!isFinite(ta) || !isFinite(tf) || geometry.length <= 0) { setResultText("Lütfen TA, TF ve geçerli L girin."); return; }
      const trimAngle = Math.atan((ta - tf) / geometry.length) * (180 / Math.PI);
      setResultText(`Trim Açısı = ${trimAngle.toFixed(3)}° (TA-TF=${(ta-tf).toFixed(2)} m, L=${geometry.length.toFixed(1)} m)`);
      return;
    }

    if (learnMode === 'list') {
      const w = parseFloat(listWeight);
      const d = parseFloat(listDistance);
      if (!isFinite(kg) || !isFinite(w) || !isFinite(d)) { setResultText("Lütfen KG, ağırlık ve mesafe girin."); return; }
      const gm = HydrostaticCalculations.calculateCenterPoints(geometry, kg).gm;
      if (gm <= 0) { setResultText("GM ≤ 0: Liste hesabı uygun değil (loll durumu olabilir)."); return; }
      const listAngle = Math.atan((w * d) / (displacement * gm)) * (180 / Math.PI);
      setResultText(`List Açısı = ${listAngle.toFixed(3)}° (W=${w} t, d=${d} m, Δ=${displacement.toFixed(0)} t, GM=${gm.toFixed(3)} m)`);
      return;
    }

    if (learnMode === 'loll') {
      if (!isFinite(kg)) { setResultText("Lütfen KG girin."); return; }
      const centers = HydrostaticCalculations.calculateCenterPoints(geometry, kg);
      const ratio = Math.max(0, Math.min(1, centers.km > 0 ? kg / centers.km : 1));
      const lollAngle = Math.acos(ratio) * (180 / Math.PI);
      setResultText(`Loll Açısı ≈ ${lollAngle.toFixed(2)}° (KG=${kg.toFixed(2)} m, KM=${centers.km.toFixed(2)} m)`);
      return;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v)=>{ if(!v) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gelişmiş Stabilite Asistanı</DialogTitle>
        </DialogHeader>

        {step === 0 && (
          <div className="space-y-4">
            <div className="text-sm">Öncelikle, neyi öğrenmek istiyorsunuz?</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Button variant={learnMode==='gm'? 'default':'secondary'} onClick={()=>{ setLearnMode('gm'); setStep(1); }}>GM (Metasentrik Yükseklik)</Button>
              <Button variant={learnMode==='gz'? 'default':'secondary'} onClick={()=>{ setLearnMode('gz'); setStep(1); }}>GZ (Doğrultucu Kol)</Button>
              <Button variant={learnMode==='trim'? 'default':'secondary'} onClick={()=>{ setLearnMode('trim'); setStep(1); }}>Trim Açısı</Button>
              <Button variant={learnMode==='list'? 'default':'secondary'} onClick={()=>{ setLearnMode('list'); setStep(1); }}>List Açısı</Button>
              <Button variant={learnMode==='loll'? 'default':'secondary'} onClick={()=>{ setLearnMode('loll'); setStep(1); }}>Loll Açısı</Button>
            </div>
            <div className="text-xs opacity-70">Profilinizi düzenlemek isterseniz aşağıdan devam edin.</div>
            <div>
              <Button variant="outline" onClick={()=>{ setStep(2); setProfileStep(0); }}>Gemi Profili (Opsiyonel)</Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">Seçilen konu: {learnMode === 'gm' ? 'GM' : learnMode === 'gz' ? 'GZ' : learnMode === 'trim' ? 'Trim' : learnMode === 'list' ? 'List' : 'Loll'}</div>
              <div className="flex items-center gap-2 text-xs">
                <input id="useProfile" type="checkbox" checked={useProfile && hasStoredProfile} onChange={(e)=> setUseProfile(e.target.checked && hasStoredProfile)} />
                <Label htmlFor="useProfile">Profili kullan</Label>
              </div>
            </div>

            {!useProfile && (
              <div className="grid grid-cols-2 gap-2">
                <div><Label>L (m)</Label><Input type="number" value={geometryInputs.length} onChange={(e)=> setGeometryInputs(v=>({...v, length: e.target.value}))} /></div>
                <div><Label>B (m)</Label><Input type="number" value={geometryInputs.breadth} onChange={(e)=> setGeometryInputs(v=>({...v, breadth: e.target.value}))} /></div>
                <div><Label>D (m)</Label><Input type="number" value={geometryInputs.depth} onChange={(e)=> setGeometryInputs(v=>({...v, depth: e.target.value}))} /></div>
                <div><Label>T (m)</Label><Input type="number" value={geometryInputs.draft} onChange={(e)=> setGeometryInputs(v=>({...v, draft: e.target.value}))} /></div>
                <div><Label>Cb</Label><Input type="number" step="0.01" value={geometryInputs.blockCoefficient} onChange={(e)=> setGeometryInputs(v=>({...v, blockCoefficient: e.target.value}))} /></div>
                <div><Label>Cwp</Label><Input type="number" step="0.01" value={geometryInputs.waterplaneCoefficient} onChange={(e)=> setGeometryInputs(v=>({...v, waterplaneCoefficient: e.target.value}))} /></div>
              </div>
            )}

            {/* Konu bazlı girdiler */}
            {(learnMode==='gm' || learnMode==='gz' || learnMode==='list' || learnMode==='loll') && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div>
                  <Label>KG (m)</Label>
                  <Input type="number" value={kgInput} onChange={(e)=> setKgInput(e.target.value)} />
                </div>
                {learnMode==='gz' && (
                  <div>
                    <Label>Açı (°)</Label>
                    <Input type="number" value={angleInput} onChange={(e)=> setAngleInput(e.target.value)} />
                  </div>
                )}
                {learnMode==='list' && (
                  <>
                    <div>
                      <Label>Ağırlık W (ton)</Label>
                      <Input type="number" value={listWeight} onChange={(e)=> setListWeight(e.target.value)} />
                    </div>
                    <div>
                      <Label>Mesafe d (m)</Label>
                      <Input type="number" value={listDistance} onChange={(e)=> setListDistance(e.target.value)} />
                    </div>
                  </>
                )}
              </div>
            )}

            {learnMode==='trim' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div>
                  <Label>TA (m)</Label>
                  <Input type="number" value={trimTa} onChange={(e)=> setTrimTa(e.target.value)} />
                </div>
                <div>
                  <Label>TF (m)</Label>
                  <Input type="number" value={trimTf} onChange={(e)=> setTrimTf(e.target.value)} />
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button onClick={handleCalculate}>Hesapla</Button>
              <Button variant="outline" onClick={()=>{ setStep(0); setResultText(""); }}>Konu Değiştir</Button>
              <Button variant="ghost" onClick={()=>{ setStep(2); setProfileStep(0); }}>Profili Düzenle</Button>
            </div>

            {resultText && (
              <div className="p-3 rounded bg-muted text-sm whitespace-pre-wrap">{resultText}</div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">Gemi Profili (Opsiyonel)</div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={()=> setStep(0)}>Geri</Button>
                <Button onClick={saveProfile}>Profili Kaydet</Button>
              </div>
            </div>

            {profileStep === 0 && (
              <div className="space-y-3">
                <div>
                  <Label>Gemi Adı</Label>
                  <Input value={profile.name} onChange={(e)=> setProfile(p=>({...p, name: e.target.value}))} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label>L (m)</Label><Input type="number" value={profile.length||''} onChange={(e)=> setProfile(p=>({...p, length: parseFloat(e.target.value)}))} /></div>
                  <div><Label>B (m)</Label><Input type="number" value={profile.breadth||''} onChange={(e)=> setProfile(p=>({...p, breadth: parseFloat(e.target.value)}))} /></div>
                  <div><Label>D (m)</Label><Input type="number" value={profile.depth||''} onChange={(e)=> setProfile(p=>({...p, depth: parseFloat(e.target.value)}))} /></div>
                  <div><Label>T (m)</Label><Input type="number" value={profile.draft||''} onChange={(e)=> setProfile(p=>({...p, draft: parseFloat(e.target.value)}))} /></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label>Cb</Label><Input type="number" step="0.01" value={profile.blockCoefficient||''} onChange={(e)=> setProfile(p=>({...p, blockCoefficient: parseFloat(e.target.value)}))} /></div>
                  <div><Label>Cwp</Label><Input type="number" step="0.01" value={profile.waterplaneCoefficient||''} onChange={(e)=> setProfile(p=>({...p, waterplaneCoefficient: parseFloat(e.target.value)}))} /></div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={()=> setProfileStep(1)}>Tanklara Geç</Button>
                </div>
              </div>
            )}

            {profileStep === 1 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between"><div className="font-medium">Tanklar</div><Button size="sm" variant="outline" onClick={()=> setProfile(p=> ({...p, tanks:[...p.tanks, { name:`Tank ${p.tanks.length+1}`, capacity:0, current:0, lcg:0, vcg:0, tcg:0, density:1.025 }]}))}>Tank Ekle</Button></div>
                <div className="space-y-2 max-h-64 overflow-auto pr-1">
                  {profile.tanks.map((t, idx)=> (
                    <div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2 rounded bg-muted">
                      <Input value={t.name} onChange={(e)=>{ const c = [...profile.tanks]; c[idx] = {...c[idx], name: e.target.value}; setProfile(p=>({...p, tanks:c})); }} />
                      <Input type="number" placeholder="Kapasite (m³)" value={t.capacity||''} onChange={(e)=>{ const c = [...profile.tanks]; c[idx] = {...c[idx], capacity: parseFloat(e.target.value)}; setProfile(p=>({...p, tanks:c})); }} />
                      <Input type="number" placeholder="Hacim (m³)" value={t.current||''} onChange={(e)=>{ const c = [...profile.tanks]; c[idx] = {...c[idx], current: parseFloat(e.target.value)}; setProfile(p=>({...p, tanks:c})); }} />
                      <Input type="number" step="0.01" placeholder="Yoğunluk (t/m³)" value={t.density||''} onChange={(e)=>{ const c = [...profile.tanks]; c[idx] = {...c[idx], density: parseFloat(e.target.value)}; setProfile(p=>({...p, tanks:c})); }} />
                      <Input type="number" step="0.01" placeholder="LCG (m)" value={t.lcg||''} onChange={(e)=>{ const c = [...profile.tanks]; c[idx] = {...c[idx], lcg: parseFloat(e.target.value)}; setProfile(p=>({...p, tanks:c})); }} />
                      <Input type="number" step="0.01" placeholder="VCG (m)" value={t.vcg||''} onChange={(e)=>{ const c = [...profile.tanks]; c[idx] = {...c[idx], vcg: parseFloat(e.target.value)}; setProfile(p=>({...p, tanks:c})); }} />
                      <Input type="number" step="0.01" placeholder="TCG (m)" value={t.tcg||''} onChange={(e)=>{ const c = [...profile.tanks]; c[idx] = {...c[idx], tcg: parseFloat(e.target.value)}; setProfile(p=>({...p, tanks:c})); }} />
                      <Input type="number" step="0.01" placeholder="Free Surface" value={t.freeSurfaceEffect||''} onChange={(e)=>{ const c = [...profile.tanks]; c[idx] = {...c[idx], freeSurfaceEffect: parseFloat(e.target.value)}; setProfile(p=>({...p, tanks:c})); }} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 justify-between">
                  <Button variant="outline" onClick={()=> setProfileStep(0)}>Geri</Button>
                  <Button onClick={saveProfile}>Profili Kaydet</Button>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <div className="text-xs opacity-70">Adım {step+1} / 3</div>
            <div className="flex gap-2">
              {step>0 && (<Button variant="outline" onClick={()=> setStep(s=>Math.max(0, s-1))}>Geri</Button>)}
              {step===0 && (<Button variant="secondary" onClick={()=> setStep(2)}>Profili Düzenle</Button>)}
              <Button onClick={closeWizard}>Kapat</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

