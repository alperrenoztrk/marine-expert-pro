import { Button } from "@/components/ui/button";
import { ArrowLeft, Ruler, Calculator, Ship, Anchor, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import StabilityAssistantPopup from "@/components/StabilityAssistantPopup";

export default function StabilityDraftTrimPage() {
  const navigate = useNavigate();

  // Draft inputs
  const [draftFwd, setDraftFwd] = useState("");
  const [draftAft, setDraftAft] = useState("");
  const [draftMid, setDraftMid] = useState("");
  const [lbp, setLbp] = useState("");
  const [lcf, setLcf] = useState("");
  const [tpc, setTpc] = useState("");
  const [mct1cm, setMct1cm] = useState("");
  const [displacement, setDisplacement] = useState("");

  // Weight change inputs
  const [addWeight, setAddWeight] = useState("");
  const [weightLcg, setWeightLcg] = useState("");
  const [weightVcg, setWeightVcg] = useState("");

  // Results
  const [results, setResults] = useState<{
    meanDraft: number;
    trim: number;
    trimType: string;
    correctedMeanDraft: number;
    newDisplacement: number;
    newTrim: number;
    newDraftFwd: number;
    newDraftAft: number;
    changeTrim: number;
    lcgMoment: number;
  } | null>(null);

  // Load saved values
  useEffect(() => {
    try {
      const saved = localStorage.getItem('draft-trim-inputs');
      if (saved) {
        const data = JSON.parse(saved);
        setDraftFwd(data.draftFwd || "");
        setDraftAft(data.draftAft || "");
        setDraftMid(data.draftMid || "");
        setLbp(data.lbp || "");
        setLcf(data.lcf || "");
        setTpc(data.tpc || "");
        setMct1cm(data.mct1cm || "");
        setDisplacement(data.displacement || "");
      }
    } catch (e) {
      console.error("Error loading saved inputs:", e);
    }
  }, []);

  // Save values
  useEffect(() => {
    try {
      localStorage.setItem('draft-trim-inputs', JSON.stringify({
        draftFwd, draftAft, draftMid, lbp, lcf, tpc, mct1cm, displacement
      }));
    } catch (e) {
      console.error("Error saving inputs:", e);
    }
  }, [draftFwd, draftAft, draftMid, lbp, lcf, tpc, mct1cm, displacement]);

  const parseInput = (value: string) => {
    const parsed = parseFloat(value.replace(",", "."));
    return isNaN(parsed) ? 0 : parsed;
  };

  const calculateDraftTrim = () => {
    const dF = parseInput(draftFwd);
    const dA = parseInput(draftAft);
    const dM = parseInput(draftMid);
    const L = parseInput(lbp);
    const lcfVal = parseInput(lcf);
    const tpcVal = parseInput(tpc);
    const mctVal = parseInput(mct1cm);
    const dispVal = parseInput(displacement);
    const w = parseInput(addWeight);
    const wLcg = parseInput(weightLcg);

    // Mean draft (6-point method for hogging/sagging correction)
    const meanDraft = dM > 0 
      ? (dF + 6 * dM + dA) / 8 
      : (dF + dA) / 2;

    // Trim calculation
    const trim = dA - dF;
    const trimType = trim > 0 ? "Kıç Trimi" : trim < 0 ? "Baş Trimi" : "Dengeli";

    // LCF correction for mean draft
    const lcfFromMid = lcfVal - L / 2;
    const trimCorrection = L > 0 ? (trim * lcfFromMid) / L : 0;
    const correctedMeanDraft = meanDraft + trimCorrection;

    // Weight addition effects
    let newDisplacement = dispVal;
    let newTrim = trim;
    let changeTrim = 0;
    let lcgMoment = 0;
    let newDraftFwd = dF;
    let newDraftAft = dA;

    if (w > 0 && mctVal > 0 && tpcVal > 0) {
      // Parallel sinkage
      const sinkage = w / tpcVal; // cm
      
      // Trimming moment
      const midshipLcf = L / 2;
      const leverArm = wLcg - lcfVal;
      const trimmingMoment = w * leverArm;
      lcgMoment = trimmingMoment;
      
      // Change of trim
      changeTrim = trimmingMoment / mctVal; // cm
      
      // New drafts
      const trimFwdChange = (changeTrim * (L - lcfVal)) / L / 100;
      const trimAftChange = (changeTrim * lcfVal) / L / 100;
      
      newDraftFwd = dF + sinkage / 100 - trimFwdChange;
      newDraftAft = dA + sinkage / 100 + trimAftChange;
      newTrim = newDraftAft - newDraftFwd;
      newDisplacement = dispVal + w;
    }

    setResults({
      meanDraft,
      trim,
      trimType,
      correctedMeanDraft,
      newDisplacement,
      newTrim,
      newDraftFwd,
      newDraftAft,
      changeTrim,
      lcgMoment
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
              <Ruler className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Draft & Trim Hesaplayıcı
            </h1>
          </div>
          <p className="text-gray-600">Deplasman, trim ve ağırlık değişimi hesapları</p>
        </div>

        {/* Current Drafts */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Ship className="w-5 h-5" />
              Mevcut Draftlar
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Baş Draft (m)</Label>
              <Input 
                value={draftFwd} 
                onChange={(e) => setDraftFwd(e.target.value)}
                placeholder="Örn: 5.20"
              />
            </div>
            <div>
              <Label>Orta Draft (m)</Label>
              <Input 
                value={draftMid} 
                onChange={(e) => setDraftMid(e.target.value)}
                placeholder="Örn: 5.50"
              />
            </div>
            <div>
              <Label>Kıç Draft (m)</Label>
              <Input 
                value={draftAft} 
                onChange={(e) => setDraftAft(e.target.value)}
                placeholder="Örn: 5.80"
              />
            </div>
          </CardContent>
        </Card>

        {/* Ship Parameters */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Anchor className="w-5 h-5" />
              Gemi Parametreleri
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label>LBP (m)</Label>
              <Input 
                value={lbp} 
                onChange={(e) => setLbp(e.target.value)}
                placeholder="Örn: 120"
              />
            </div>
            <div>
              <Label>LCF (m - kıçtan)</Label>
              <Input 
                value={lcf} 
                onChange={(e) => setLcf(e.target.value)}
                placeholder="Örn: 58"
              />
            </div>
            <div>
              <Label>TPC (t/cm)</Label>
              <Input 
                value={tpc} 
                onChange={(e) => setTpc(e.target.value)}
                placeholder="Örn: 25"
              />
            </div>
            <div>
              <Label>MCT 1cm (t·m)</Label>
              <Input 
                value={mct1cm} 
                onChange={(e) => setMct1cm(e.target.value)}
                placeholder="Örn: 180"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Mevcut Deplasman (ton)</Label>
              <Input 
                value={displacement} 
                onChange={(e) => setDisplacement(e.target.value)}
                placeholder="Örn: 12000"
              />
            </div>
          </CardContent>
        </Card>

        {/* Weight Addition */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Calculator className="w-5 h-5" />
              Ağırlık Ekleme/Çıkarma
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Ağırlık (ton) (+/-)</Label>
              <Input 
                value={addWeight} 
                onChange={(e) => setAddWeight(e.target.value)}
                placeholder="Örn: 500 veya -200"
              />
            </div>
            <div>
              <Label>Ağırlık LCG (m - kıçtan)</Label>
              <Input 
                value={weightLcg} 
                onChange={(e) => setWeightLcg(e.target.value)}
                placeholder="Örn: 70"
              />
            </div>
            <div>
              <Label>Ağırlık VCG (m)</Label>
              <Input 
                value={weightVcg} 
                onChange={(e) => setWeightVcg(e.target.value)}
                placeholder="Örn: 8"
              />
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={calculateDraftTrim}
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
              <CardTitle className="text-blue-700">Sonuçlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/80 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">Ortalama Draft</p>
                  <p className="text-xl font-bold text-blue-600">{results.meanDraft.toFixed(3)} m</p>
                </div>
                <div className="bg-white/80 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">Trim</p>
                  <p className="text-xl font-bold text-blue-600">{Math.abs(results.trim).toFixed(3)} m</p>
                  <p className="text-xs text-gray-500">{results.trimType}</p>
                </div>
                <div className="bg-white/80 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">Düzeltilmiş Draft</p>
                  <p className="text-xl font-bold text-blue-600">{results.correctedMeanDraft.toFixed(3)} m</p>
                </div>
                <div className="bg-white/80 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">LCG Momenti</p>
                  <p className="text-xl font-bold text-blue-600">{results.lcgMoment.toFixed(1)} t·m</p>
                </div>
              </div>

              {parseInput(addWeight) !== 0 && (
                <>
                  <Separator />
                  <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                    {parseInput(addWeight) > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    Ağırlık Değişimi Sonrası
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/80 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-600">Yeni Deplasman</p>
                      <p className="text-xl font-bold text-green-600">{results.newDisplacement.toFixed(1)} t</p>
                    </div>
                    <div className="bg-white/80 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-600">Trim Değişimi</p>
                      <p className="text-xl font-bold text-orange-600">{results.changeTrim.toFixed(2)} cm</p>
                    </div>
                    <div className="bg-white/80 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-600">Yeni Baş Draft</p>
                      <p className="text-xl font-bold text-blue-600">{results.newDraftFwd.toFixed(3)} m</p>
                    </div>
                    <div className="bg-white/80 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-600">Yeni Kıç Draft</p>
                      <p className="text-xl font-bold text-blue-600">{results.newDraftAft.toFixed(3)} m</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        <StabilityAssistantPopup />
      </div>
    </div>
  );
}
