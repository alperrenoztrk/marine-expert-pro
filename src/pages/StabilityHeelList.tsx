import { Button } from "@/components/ui/button";
import { ArrowLeft, Move, Calculator, Ship, AlertTriangle, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StabilityAssistantPopup from "@/components/StabilityAssistantPopup";

export default function StabilityHeelListPage() {
  const navigate = useNavigate();

  // Weight shift inputs
  const [weight, setWeight] = useState("");
  const [distance, setDistance] = useState("");
  const [displacement, setDisplacement] = useState("");
  const [gm, setGm] = useState("");

  // TCG change inputs
  const [initialTcg, setInitialTcg] = useState("");
  const [finalTcg, setFinalTcg] = useState("");

  // Heeling moment inputs
  const [heelingMoment, setHeelingMoment] = useState("");

  // Results
  const [results, setResults] = useState<{
    heelAngle: number;
    tcgChange: number;
    gz: number;
    heelingLever: number;
    warning: string | null;
  } | null>(null);

  // Load saved values
  useEffect(() => {
    try {
      const saved = localStorage.getItem('heel-list-inputs');
      if (saved) {
        const data = JSON.parse(saved);
        setWeight(data.weight || "");
        setDistance(data.distance || "");
        setDisplacement(data.displacement || "");
        setGm(data.gm || "");
      }
    } catch (e) {
      console.error("Error loading saved inputs:", e);
    }
  }, []);

  // Save values
  useEffect(() => {
    try {
      localStorage.setItem('heel-list-inputs', JSON.stringify({
        weight, distance, displacement, gm
      }));
    } catch (e) {
      console.error("Error saving inputs:", e);
    }
  }, [weight, distance, displacement, gm]);

  const parseInput = (value: string) => {
    const parsed = parseFloat(value.replace(",", "."));
    return isNaN(parsed) ? 0 : parsed;
  };

  const calculateFromWeightShift = () => {
    const w = parseInput(weight);
    const d = parseInput(distance);
    const delta = parseInput(displacement);
    const gmVal = parseInput(gm);

    if (delta <= 0 || gmVal <= 0) {
      setResults(null);
      return;
    }

    // TCG change due to weight shift
    const tcgChange = (w * d) / delta;
    
    // Heel angle using tan(θ) = TCG / GM for small angles
    // For larger angles: tan(θ) = (w × d) / (Δ × GM)
    const tanTheta = (w * d) / (delta * gmVal);
    const heelAngle = Math.atan(tanTheta) * 180 / Math.PI;
    
    // GZ at this angle (for small angles, GZ ≈ GM × sin(θ))
    const gz = gmVal * Math.sin(heelAngle * Math.PI / 180);
    
    // Heeling lever
    const heelingLever = tcgChange;

    // Warning check
    let warning = null;
    if (heelAngle > 15) {
      warning = "Büyük açı uyarısı: Hesaplar küçük açı teorisine dayalıdır.";
    }
    if (heelAngle > 5) {
      warning = "Liste açısı 5°'yi aştı - düzeltici önlem alınmalı.";
    }

    setResults({
      heelAngle,
      tcgChange,
      gz,
      heelingLever,
      warning
    });
  };

  const calculateFromTcgChange = () => {
    const delta = parseInput(displacement);
    const gmVal = parseInput(gm);
    const tcgI = parseInput(initialTcg);
    const tcgF = parseInput(finalTcg);

    if (delta <= 0 || gmVal <= 0) {
      setResults(null);
      return;
    }

    const tcgChange = tcgF - tcgI;
    const tanTheta = tcgChange / gmVal;
    const heelAngle = Math.atan(tanTheta) * 180 / Math.PI;
    const gz = gmVal * Math.sin(heelAngle * Math.PI / 180);

    let warning = null;
    if (Math.abs(heelAngle) > 5) {
      warning = "Liste açısı 5°'yi aştı - düzeltici önlem alınmalı.";
    }

    setResults({
      heelAngle,
      tcgChange,
      gz,
      heelingLever: tcgChange,
      warning
    });
  };

  const calculateFromHeelingMoment = () => {
    const delta = parseInput(displacement);
    const gmVal = parseInput(gm);
    const moment = parseInput(heelingMoment);

    if (delta <= 0 || gmVal <= 0) {
      setResults(null);
      return;
    }

    // Heeling moment = Δ × GM × tan(θ)
    // Therefore: tan(θ) = Heeling moment / (Δ × GM)
    const tanTheta = moment / (delta * gmVal);
    const heelAngle = Math.atan(tanTheta) * 180 / Math.PI;
    const gz = gmVal * Math.sin(heelAngle * Math.PI / 180);
    const heelingLever = moment / delta;

    let warning = null;
    if (Math.abs(heelAngle) > 5) {
      warning = "Liste açısı 5°'yi aştı - düzeltici önlem alınmalı.";
    }

    setResults({
      heelAngle,
      tcgChange: heelingLever,
      gz,
      heelingLever,
      warning
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
              <Move className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Heel & List Hesaplayıcı
            </h1>
          </div>
          <p className="text-gray-600">Transverse shift, TCG değişimi, heel angle hesapları</p>
        </div>

        {/* Common Parameters */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Ship className="w-5 h-5" />
              Gemi Parametreleri
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Deplasman (ton)</Label>
              <Input 
                value={displacement} 
                onChange={(e) => setDisplacement(e.target.value)}
                placeholder="Örn: 12000"
              />
            </div>
            <div>
              <Label>GM (m)</Label>
              <Input 
                value={gm} 
                onChange={(e) => setGm(e.target.value)}
                placeholder="Örn: 0.8"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="weight-shift" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weight-shift">Ağırlık Kayması</TabsTrigger>
            <TabsTrigger value="tcg-change">TCG Değişimi</TabsTrigger>
            <TabsTrigger value="heeling-moment">Kren Momenti</TabsTrigger>
          </TabsList>

          <TabsContent value="weight-shift">
            <Card className="bg-white/80 backdrop-blur-sm border-white/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Move className="w-5 h-5" />
                  Enine Ağırlık Kayması
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Kayan Ağırlık (ton)</Label>
                    <Input 
                      value={weight} 
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="Örn: 100"
                    />
                  </div>
                  <div>
                    <Label>Kayma Mesafesi (m)</Label>
                    <Input 
                      value={distance} 
                      onChange={(e) => setDistance(e.target.value)}
                      placeholder="Örn: 5"
                    />
                  </div>
                </div>
                <Button 
                  onClick={calculateFromWeightShift}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Hesapla
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tcg-change">
            <Card className="bg-white/80 backdrop-blur-sm border-white/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <TrendingUp className="w-5 h-5" />
                  TCG Değişiminden Liste
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Başlangıç TCG (m)</Label>
                    <Input 
                      value={initialTcg} 
                      onChange={(e) => setInitialTcg(e.target.value)}
                      placeholder="Örn: 0"
                    />
                  </div>
                  <div>
                    <Label>Final TCG (m)</Label>
                    <Input 
                      value={finalTcg} 
                      onChange={(e) => setFinalTcg(e.target.value)}
                      placeholder="Örn: 0.5"
                    />
                  </div>
                </div>
                <Button 
                  onClick={calculateFromTcgChange}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Hesapla
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="heeling-moment">
            <Card className="bg-white/80 backdrop-blur-sm border-white/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Ship className="w-5 h-5" />
                  Kren Momentinden Liste
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Kren Momenti (t·m)</Label>
                  <Input 
                    value={heelingMoment} 
                    onChange={(e) => setHeelingMoment(e.target.value)}
                    placeholder="Örn: 500"
                  />
                </div>
                <Button 
                  onClick={calculateFromHeelingMoment}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Hesapla
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Results */}
        {results && (
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700">Sonuçlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.warning && (
                <div className="bg-amber-100 border border-amber-300 rounded-lg p-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span className="text-amber-800">{results.warning}</span>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/80 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">Heel Açısı (θ)</p>
                  <p className={`text-2xl font-bold ${Math.abs(results.heelAngle) > 5 ? 'text-red-600' : 'text-blue-600'}`}>
                    {results.heelAngle.toFixed(2)}°
                  </p>
                </div>
                <div className="bg-white/80 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">TCG Değişimi</p>
                  <p className="text-2xl font-bold text-blue-600">{results.tcgChange.toFixed(3)} m</p>
                </div>
                <div className="bg-white/80 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">GZ</p>
                  <p className="text-2xl font-bold text-blue-600">{results.gz.toFixed(3)} m</p>
                </div>
                <div className="bg-white/80 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">Kren Kolu</p>
                  <p className="text-2xl font-bold text-blue-600">{results.heelingLever.toFixed(3)} m</p>
                </div>
              </div>

              <Separator />

              <div className="bg-blue-100 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Formüller</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• TCG değişimi = (w × d) / Δ</p>
                  <p>• tan(θ) = (w × d) / (Δ × GM)</p>
                  <p>• GZ = GM × sin(θ)</p>
                  <p>• Kren Momenti = Δ × GM × tan(θ)</p>
                </div>
              </div>

              {/* Visual representation */}
              <div className="bg-white/80 rounded-lg p-4">
                <h4 className="font-semibold text-blue-700 mb-2">Görsel Temsil</h4>
                <div className="relative h-32 bg-gradient-to-b from-sky-200 to-blue-400 rounded overflow-hidden">
                  <div 
                    className="absolute inset-x-4 bottom-0 h-20 bg-gray-700 rounded-t-lg origin-bottom transition-transform duration-500"
                    style={{ transform: `rotate(${-results.heelAngle}deg)` }}
                  >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-8 bg-white rounded" />
                  </div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white font-bold">
                    {results.heelAngle > 0 ? '→ Sancak' : results.heelAngle < 0 ? 'İskele ←' : 'Dengeli'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <StabilityAssistantPopup />
      </div>
    </div>
  );
}
