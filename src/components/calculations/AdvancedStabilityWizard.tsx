import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

const LS_KEY = "advanced-ship-profile";

export const AdvancedStabilityWizard = ({ open, onClose, onSaved }: { open: boolean; onClose: ()=>void; onSaved: (p: ShipProfile)=>void }) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<ShipProfile>({
    name: "",
    length: 0, breadth: 0, depth: 0, draft: 0,
    blockCoefficient: 0.7, waterplaneCoefficient: 0.8,
    tanks: []
  });

  useEffect(()=>{
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setProfile(JSON.parse(raw));
    } catch {}
  }, [open]);

  const saveAndClose = () => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(profile)); } catch {}
    onSaved(profile);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v)=>{ if(!v) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gelişmiş Gemi Profili Kurulumu</DialogTitle>
        </DialogHeader>

        {step === 0 && (
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
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between"><div className="font-medium">Tanklar</div><Button size="sm" variant="outline" onClick={()=> setProfile(p=> ({...p, tanks:[...p.tanks, { name:`Tank ${p.tanks.length+1}`, capacity:0, current:0, lcg:0, vcg:0, tcg:0, density:1.025 }]}))}>Tank Ekle</Button></div>
            <div className="space-y-2 max-h-64 overflow-auto pr-1">
              {profile.tanks.map((t, idx)=> (
                <div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2 rounded bg-muted">
                  <Input value={t.name} onChange={(e)=>{
                    const c = [...profile.tanks]; c[idx] = {...c[idx], name: e.target.value}; setProfile(p=>({...p, tanks:c}));
                  }} />
                  <Input type="number" placeholder="Kapasite (m³)" value={t.capacity||''} onChange={(e)=>{
                    const c = [...profile.tanks]; c[idx] = {...c[idx], capacity: parseFloat(e.target.value)}; setProfile(p=>({...p, tanks:c}));
                  }} />
                  <Input type="number" placeholder="Hacim (m³)" value={t.current||''} onChange={(e)=>{
                    const c = [...profile.tanks]; c[idx] = {...c[idx], current: parseFloat(e.target.value)}; setProfile(p=>({...p, tanks:c}));
                  }} />
                  <Input type="number" step="0.01" placeholder="Yoğunluk (t/m³)" value={t.density||''} onChange={(e)=>{
                    const c = [...profile.tanks]; c[idx] = {...c[idx], density: parseFloat(e.target.value)}; setProfile(p=>({...p, tanks:c}));
                  }} />
                  <Input type="number" step="0.01" placeholder="LCG (m)" value={t.lcg||''} onChange={(e)=>{
                    const c = [...profile.tanks]; c[idx] = {...c[idx], lcg: parseFloat(e.target.value)}; setProfile(p=>({...p, tanks:c}));
                  }} />
                  <Input type="number" step="0.01" placeholder="VCG (m)" value={t.vcg||''} onChange={(e)=>{
                    const c = [...profile.tanks]; c[idx] = {...c[idx], vcg: parseFloat(e.target.value)}; setProfile(p=>({...p, tanks:c}));
                  }} />
                  <Input type="number" step="0.01" placeholder="TCG (m)" value={t.tcg||''} onChange={(e)=>{
                    const c = [...profile.tanks]; c[idx] = {...c[idx], tcg: parseFloat(e.target.value)}; setProfile(p=>({...p, tanks:c}));
                  }} />
                  <Input type="number" step="0.01" placeholder="Free Surface" value={t.freeSurfaceEffect||''} onChange={(e)=>{
                    const c = [...profile.tanks]; c[idx] = {...c[idx], freeSurfaceEffect: parseFloat(e.target.value)}; setProfile(p=>({...p, tanks:c}));
                  }} />
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <div className="text-xs opacity-70">Adım {step+1} / 2</div>
            <div className="flex gap-2">
              {step>0 && (<Button variant="outline" onClick={()=> setStep(s=>Math.max(0, s-1))}>Geri</Button>)}
              {step<1 && (<Button onClick={()=> setStep(s=>Math.min(1, s+1))}>İleri</Button>)}
              {step===1 && (<Button onClick={saveAndClose}>Kaydet</Button>)}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

