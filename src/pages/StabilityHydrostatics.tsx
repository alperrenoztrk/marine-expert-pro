import { Button } from "@/components/ui/button";
import { ArrowLeft, Gauge, Calculator, Droplets, Anchor, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import StabilityAssistantPopup from "@/components/StabilityAssistantPopup";

export default function StabilityHydrostaticsPage() {
  const navigate = useNavigate();

  // Ship parameters
  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [draft, setDraft] = useState("");
  const [cb, setCb] = useState("");
  const [cw, setCw] = useState("");
  const [displacement, setDisplacement] = useState("");
  const [waterDensity, setWaterDensity] = useState("1.025");

  // Direct inputs for hydrostatic values
  const [kb, setKb] = useState("");
  const [bm, setBm] = useState("");
  const [kg, setKg] = useState("");
  const [lcb, setLcb] = useState("");
  const [lcf, setLcf] = useState("");

  // Results
  const [results, setResults] = useState<{
    tpc: number;
    mct1cm: number;
    kb: number;
    bm: number;
    km: number;
    gm: number;
    lcb: number;
    lcf: number;
    waterplaneArea: number;
    volumeDisplacement: number;
  } | null>(null);

  // Load saved values
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hydrostatics-inputs');
      if (saved) {
        const data = JSON.parse(saved);
        setLength(data.length || "");
        setBreadth(data.breadth || "");
        setDraft(data.draft || "");
        setCb(data.cb || "");
        setCw(data.cw || "");
        setDisplacement(data.displacement || "");
        setKb(data.kb || "");
        setBm(data.bm || "");
        setKg(data.kg || "");
      }
    } catch (e) {
      console.error("Error loading saved inputs:", e);
    }
  }, []);

  // Save values
  useEffect(() => {
    try {
      localStorage.setItem('hydrostatics-inputs', JSON.stringify({
        length, breadth, draft, cb, cw, displacement, kb, bm, kg
      }));
    } catch (e) {
      console.error("Error saving inputs:", e);
    }
  }, [length, breadth, draft, cb, cw, displacement, kb, bm, kg]);

  const parseInput = (value: string) => {
    const parsed = parseFloat(value.replace(",", "."));
    return isNaN(parsed) ? 0 : parsed;
  };

  const calculateHydrostatics = () => {
    const L = parseInput(length);
    const B = parseInput(breadth);
    const T = parseInput(draft);
    const Cb = parseInput(cb);
    const Cw = parseInput(cw);
    const rho = parseInput(waterDensity);
    const kbVal = parseInput(kb);
    const bmVal = parseInput(bm);
    const kgVal = parseInput(kg);

    // Volume displacement
    const volume = L * B * T * Cb;
    
    // Waterplane area
    const Aw = L * B * Cw;
    
    // TPC (Tonnes Per Cm immersion)
    const tpc = (Aw * rho) / 100;
    
    // MCT 1cm (Moment to Change Trim 1 cm)
    // MCT = (Δ × GML) / (100 × L)  ≈ (Δ × BML) / (100 × L)
    // BML ≈ L²/(12×T) for box-shaped vessels
    const bml = (L * L) / (12 * T);
    const delta = volume * rho;
    const mct1cm = (delta * bml) / (100 * L);
    
    // KB (height of center of buoyancy)
    const calculatedKb = kbVal > 0 ? kbVal : T * (0.5 + 0.1 * Cb);
    
    // BM (metacentric radius)
    // BM = I / V where I = L×B³/12 × Cw
    const I = (L * Math.pow(B, 3) / 12) * Cw;
    const calculatedBm = bmVal > 0 ? bmVal : I / volume;
    
    // KM = KB + BM
    const km = calculatedKb + calculatedBm;
    
    // GM = KM - KG
    const gm = km - kgVal;
    
    // LCB (Longitudinal Center of Buoyancy) - approximation
    const calculatedLcb = parseInput(lcb) > 0 ? parseInput(lcb) : L * 0.5;
    
    // LCF (Longitudinal Center of Flotation) - approximation
    const calculatedLcf = parseInput(lcf) > 0 ? parseInput(lcf) : L * 0.52;

    setResults({
      tpc,
      mct1cm,
      kb: calculatedKb,
      bm: calculatedBm,
      km,
      gm,
      lcb: calculatedLcb,
      lcf: calculatedLcf,
      waterplaneArea: Aw,
      volumeDisplacement: volume
    });
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/stability/calculations');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" size="sm" className="gap-2" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
          Geri Dön
        </Button>

        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <Gauge className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Hidrostatik Değerler
            </h1>
          </div>
          <p className="text-gray-600">TPC, MCT, KB, KM, BM, LCB, LCF hesapları</p>
        </div>

        {/* Ship Dimensions */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Anchor className="w-5 h-5" />
              Gemi Boyutları
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label>Boy (L) (m)</Label>
              <Input 
                value={length} 
                onChange={(e) => setLength(e.target.value)}
                placeholder="Örn: 120"
              />
            </div>
            <div>
              <Label>Genişlik (B) (m)</Label>
              <Input 
                value={breadth} 
                onChange={(e) => setBreadth(e.target.value)}
                placeholder="Örn: 20"
              />
            </div>
            <div>
              <Label>Draft (T) (m)</Label>
              <Input 
                value={draft} 
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Örn: 8"
              />
            </div>
            <div>
              <Label>Blok Katsayısı (Cb)</Label>
              <Input 
                value={cb} 
                onChange={(e) => setCb(e.target.value)}
                placeholder="Örn: 0.75"
              />
            </div>
            <div>
              <Label>Su Hattı Katsayısı (Cw)</Label>
              <Input 
                value={cw} 
                onChange={(e) => setCw(e.target.value)}
                placeholder="Örn: 0.85"
              />
            </div>
            <div>
              <Label>Su Yoğunluğu (t/m³)</Label>
              <Input 
                value={waterDensity} 
                onChange={(e) => setWaterDensity(e.target.value)}
                placeholder="1.025"
              />
            </div>
          </CardContent>
        </Card>

        {/* Optional Direct Inputs */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <ArrowUpDown className="w-5 h-5" />
              Bilinen Değerler (Opsiyonel)
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <Label>KB (m)</Label>
              <Input 
                value={kb} 
                onChange={(e) => setKb(e.target.value)}
                placeholder="Boş = otomatik"
              />
            </div>
            <div>
              <Label>BM (m)</Label>
              <Input 
                value={bm} 
                onChange={(e) => setBm(e.target.value)}
                placeholder="Boş = otomatik"
              />
            </div>
            <div>
              <Label>KG (m)</Label>
              <Input 
                value={kg} 
                onChange={(e) => setKg(e.target.value)}
                placeholder="Örn: 7.5"
              />
            </div>
            <div>
              <Label>LCB (m)</Label>
              <Input 
                value={lcb} 
                onChange={(e) => setLcb(e.target.value)}
                placeholder="Boş = otomatik"
              />
            </div>
            <div>
              <Label>LCF (m)</Label>
              <Input 
                value={lcf} 
                onChange={(e) => setLcf(e.target.value)}
                placeholder="Boş = otomatik"
              />
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={calculateHydrostatics}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          size="lg"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Hesapla
        </Button>

        {/* Results */}
        {results && (
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700">Hidrostatik Sonuçlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/80 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">TPC</p>
                  <p className="text-xl font-bold text-blue-600">{results.tpc.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">t/cm</p>
                </div>
                <div className="bg-white/80 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">MCT 1cm</p>
                  <p className="text-xl font-bold text-blue-600">{results.mct1cm.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">t·m</p>
                </div>
                <div className="bg-white/80 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">KB</p>
                  <p className="text-xl font-bold text-blue-600">{results.kb.toFixed(3)}</p>
                  <p className="text-xs text-gray-500">m</p>
                </div>
                <div className="bg-white/80 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">BM</p>
                  <p className="text-xl font-bold text-blue-600">{results.bm.toFixed(3)}</p>
                  <p className="text-xs text-gray-500">m</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/80 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">KM</p>
                  <p className="text-xl font-bold text-green-600">{results.km.toFixed(3)}</p>
                  <p className="text-xs text-gray-500">m</p>
                </div>
                <div className="bg-white/80 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">GM</p>
                  <p className={`text-xl font-bold ${results.gm >= 0.15 ? 'text-green-600' : 'text-red-600'}`}>
                    {results.gm.toFixed(3)}
                  </p>
                  <p className="text-xs text-gray-500">m</p>
                </div>
                <div className="bg-white/80 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">LCB</p>
                  <p className="text-xl font-bold text-blue-600">{results.lcb.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">m (kıçtan)</p>
                </div>
                <div className="bg-white/80 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">LCF</p>
                  <p className="text-xl font-bold text-blue-600">{results.lcf.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">m (kıçtan)</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">Su Hattı Alanı (Aw)</p>
                  <p className="text-xl font-bold text-blue-600">{results.waterplaneArea.toFixed(2)} m²</p>
                </div>
                <div className="bg-white/80 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">Hacim Deplasmanı (∇)</p>
                  <p className="text-xl font-bold text-blue-600">{results.volumeDisplacement.toFixed(2)} m³</p>
                </div>
              </div>

              {/* Density Correction Info */}
              <div className="bg-blue-100 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  Yoğunluk Düzeltmesi
                </h4>
                <p className="text-sm text-blue-700">
                  Farklı yoğunlukta su için deplasman düzeltmesi: Δ₂ = Δ₁ × (ρ₂/ρ₁)
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Tatlı su (ρ=1.000): Δ = {(results.volumeDisplacement * parseInput(waterDensity) * 1.000 / 1.025).toFixed(2)} t
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <StabilityAssistantPopup />
      </div>
    </div>
  );
}
