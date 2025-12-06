import { Button } from "@/components/ui/button";
import { ArrowLeft, Container, Calculator, Ship, AlertTriangle, Box, Anchor } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StabilityAssistantPopup from "@/components/StabilityAssistantPopup";

export default function StabilityCargoShiftPage() {
  const navigate = useNavigate();

  // Common parameters
  const [displacement, setDisplacement] = useState("");
  const [gm, setGm] = useState("");
  const [breadth, setBreadth] = useState("");

  // Bulk cargo shift
  const [bulkWeight, setBulkWeight] = useState("");
  const [bulkAngle, setBulkAngle] = useState(""); // angle of repose
  const [bulkHeight, setBulkHeight] = useState("");
  const [bulkWidth, setBulkWidth] = useState("");

  // Container shift
  const [containerWeight, setContainerWeight] = useState("");
  const [containerDistance, setContainerDistance] = useState("");
  const [containerHeight, setContainerHeight] = useState("");
  const [containerRows, setContainerRows] = useState("");

  // Liquid cargo
  const [tankLength, setTankLength] = useState("");
  const [tankBreadth, setTankBreadth] = useState("");
  const [tankHeight, setTankHeight] = useState("");
  const [fluidDensity, setFluidDensity] = useState("1.025");
  const [fillPercentage, setFillPercentage] = useState("");

  // Securing failure
  const [cargoType, setCargoType] = useState("container");
  const [securedWeight, setSecuredWeight] = useState("");
  const [tippingDistance, setTippingDistance] = useState("");

  // Results
  const [results, setResults] = useState<{
    heelAngle: number;
    shiftMoment: number;
    fsm?: number;
    gmReduction?: number;
    warning: string | null;
    criticalAngle?: number;
  } | null>(null);

  // Load saved values
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cargo-shift-inputs');
      if (saved) {
        const data = JSON.parse(saved);
        setDisplacement(data.displacement || "");
        setGm(data.gm || "");
        setBreadth(data.breadth || "");
      }
    } catch (e) {
      console.error("Error loading saved inputs:", e);
    }
  }, []);

  // Save values
  useEffect(() => {
    try {
      localStorage.setItem('cargo-shift-inputs', JSON.stringify({
        displacement, gm, breadth
      }));
    } catch (e) {
      console.error("Error saving inputs:", e);
    }
  }, [displacement, gm, breadth]);

  const parseInput = (value: string) => {
    const parsed = parseFloat(value.replace(",", "."));
    return isNaN(parsed) ? 0 : parsed;
  };

  const calculateBulkShift = () => {
    const delta = parseInput(displacement);
    const gmVal = parseInput(gm);
    const w = parseInput(bulkWeight);
    const angleOfRepose = parseInput(bulkAngle);
    const h = parseInput(bulkHeight);
    const width = parseInput(bulkWidth);

    if (delta <= 0 || gmVal <= 0) {
      setResults(null);
      return;
    }

    // For bulk cargo shift:
    // Shift distance = (h × tan(angle of repose)) / 2
    // where h is the height of cargo pile
    const shiftDistance = (h * Math.tan(angleOfRepose * Math.PI / 180)) / 2;
    
    // Shifted weight (approximation: 50% of cargo shifts in worst case)
    const shiftedWeight = w * 0.5;
    
    // Shift moment
    const shiftMoment = shiftedWeight * shiftDistance;
    
    // Heel angle
    const tanTheta = shiftMoment / (delta * gmVal);
    const heelAngle = Math.atan(tanTheta) * 180 / Math.PI;

    // Critical angle (angle where cargo starts to shift)
    const criticalAngle = angleOfRepose;

    let warning = null;
    if (heelAngle > 12) {
      warning = "TEHLİKE: Heel açısı 12°'yi aştı! IMO Tahıl Kodu sınırı aşıldı.";
    } else if (heelAngle > 8) {
      warning = "UYARI: Heel açısı yüksek. Düzeltici önlem alınmalı.";
    }

    setResults({
      heelAngle,
      shiftMoment,
      criticalAngle,
      warning
    });
  };

  const calculateContainerShift = () => {
    const delta = parseInput(displacement);
    const gmVal = parseInput(gm);
    const w = parseInput(containerWeight);
    const d = parseInput(containerDistance);
    const h = parseInput(containerHeight);
    const rows = parseInput(containerRows);

    if (delta <= 0 || gmVal <= 0) {
      setResults(null);
      return;
    }

    // Total shifted weight (if multiple containers shift)
    const totalWeight = w * rows;
    
    // Shift moment (horizontal + vertical component)
    const horizontalMoment = totalWeight * d;
    const verticalEffect = totalWeight * h * 0.1; // Approximate vertical effect
    const shiftMoment = horizontalMoment + verticalEffect;
    
    // Heel angle
    const tanTheta = shiftMoment / (delta * gmVal);
    const heelAngle = Math.atan(tanTheta) * 180 / Math.PI;

    let warning = null;
    if (heelAngle > 5) {
      warning = "UYARI: Liste açısı 5°'yi aştı. Konteyner bağlamaları kontrol edilmeli.";
    }

    setResults({
      heelAngle,
      shiftMoment,
      warning
    });
  };

  const calculateLiquidShift = () => {
    const delta = parseInput(displacement);
    const gmVal = parseInput(gm);
    const l = parseInput(tankLength);
    const b = parseInput(tankBreadth);
    const h = parseInput(tankHeight);
    const rho = parseInput(fluidDensity);
    const fill = parseInput(fillPercentage) / 100;

    if (delta <= 0 || gmVal <= 0) {
      setResults(null);
      return;
    }

    // Free Surface Moment
    // FSM = (ρ × l × b³) / 12
    const fsm = (rho * l * Math.pow(b, 3)) / 12;
    
    // GM reduction
    const gmReduction = fsm / delta;
    
    // Effective GM
    const effectiveGm = gmVal - gmReduction;
    
    // If tank is slack, heel angle depends on fill level
    // For partially filled tank, shift moment increases
    const tankVolume = l * b * h * fill;
    const fluidWeight = tankVolume * rho;
    
    // Approximate shift distance at small angles
    const shiftDistance = b * 0.1; // ~10% of breadth for estimation
    const shiftMoment = fluidWeight * shiftDistance;
    
    const tanTheta = shiftMoment / (delta * effectiveGm);
    const heelAngle = Math.atan(tanTheta) * 180 / Math.PI;

    let warning = null;
    if (effectiveGm < 0.15) {
      warning = "TEHLİKE: Düzeltilmiş GM 0.15m'nin altında! Stabilite kritik.";
    } else if (gmReduction > gmVal * 0.5) {
      warning = "UYARI: Serbest yüzey etkisi GM'nin %50'sinden fazla.";
    }

    setResults({
      heelAngle,
      shiftMoment,
      fsm,
      gmReduction,
      warning
    });
  };

  const calculateSecuringFailure = () => {
    const delta = parseInput(displacement);
    const gmVal = parseInput(gm);
    const w = parseInput(securedWeight);
    const d = parseInput(tippingDistance);

    if (delta <= 0 || gmVal <= 0) {
      setResults(null);
      return;
    }

    // When securing fails, cargo shifts
    const shiftMoment = w * d;
    const tanTheta = shiftMoment / (delta * gmVal);
    const heelAngle = Math.atan(tanTheta) * 180 / Math.PI;

    let warning = null;
    if (heelAngle > 10) {
      warning = "TEHLİKE: Ciddi stabilite kaybı! Acil müdahale gerekli.";
    }

    setResults({
      heelAngle,
      shiftMoment,
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
              <Container className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Kargo Kayması Hesaplayıcı
            </h1>
          </div>
          <p className="text-gray-600">Bulk, container, sıvı kargo kayması ve bağlama arızası simülasyonu</p>
        </div>

        {/* Common Parameters */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Ship className="w-5 h-5" />
              Gemi Parametreleri
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div>
              <Label>Genişlik (m)</Label>
              <Input 
                value={breadth} 
                onChange={(e) => setBreadth(e.target.value)}
                placeholder="Örn: 20"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="bulk" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bulk">Bulk Kargo</TabsTrigger>
            <TabsTrigger value="container">Konteyner</TabsTrigger>
            <TabsTrigger value="liquid">Sıvı Kargo</TabsTrigger>
            <TabsTrigger value="securing">Bağlama Arızası</TabsTrigger>
          </TabsList>

          <TabsContent value="bulk">
            <Card className="bg-white/80 backdrop-blur-sm border-white/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Box className="w-5 h-5" />
                  Bulk Kargo Kayması
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Kargo Ağırlığı (ton)</Label>
                    <Input 
                      value={bulkWeight} 
                      onChange={(e) => setBulkWeight(e.target.value)}
                      placeholder="Örn: 5000"
                    />
                  </div>
                  <div>
                    <Label>Kayma Açısı / Angle of Repose (°)</Label>
                    <Input 
                      value={bulkAngle} 
                      onChange={(e) => setBulkAngle(e.target.value)}
                      placeholder="Örn: 30 (tahıl için)"
                    />
                  </div>
                  <div>
                    <Label>Yığın Yüksekliği (m)</Label>
                    <Input 
                      value={bulkHeight} 
                      onChange={(e) => setBulkHeight(e.target.value)}
                      placeholder="Örn: 8"
                    />
                  </div>
                  <div>
                    <Label>Ambar Genişliği (m)</Label>
                    <Input 
                      value={bulkWidth} 
                      onChange={(e) => setBulkWidth(e.target.value)}
                      placeholder="Örn: 15"
                    />
                  </div>
                </div>
                <Button 
                  onClick={calculateBulkShift}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Hesapla
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="container">
            <Card className="bg-white/80 backdrop-blur-sm border-white/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Container className="w-5 h-5" />
                  Konteyner Kayması
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Konteyner Ağırlığı (ton)</Label>
                    <Input 
                      value={containerWeight} 
                      onChange={(e) => setContainerWeight(e.target.value)}
                      placeholder="Örn: 25"
                    />
                  </div>
                  <div>
                    <Label>Kayma Mesafesi (m)</Label>
                    <Input 
                      value={containerDistance} 
                      onChange={(e) => setContainerDistance(e.target.value)}
                      placeholder="Örn: 2.5"
                    />
                  </div>
                  <div>
                    <Label>Konteyner Yüksekliği (m)</Label>
                    <Input 
                      value={containerHeight} 
                      onChange={(e) => setContainerHeight(e.target.value)}
                      placeholder="Örn: 12"
                    />
                  </div>
                  <div>
                    <Label>Kayan Konteyner Sayısı</Label>
                    <Input 
                      value={containerRows} 
                      onChange={(e) => setContainerRows(e.target.value)}
                      placeholder="Örn: 5"
                    />
                  </div>
                </div>
                <Button 
                  onClick={calculateContainerShift}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Hesapla
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="liquid">
            <Card className="bg-white/80 backdrop-blur-sm border-white/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Anchor className="w-5 h-5" />
                  Sıvı Kargo / FSM Etkisi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tank Uzunluğu (m)</Label>
                    <Input 
                      value={tankLength} 
                      onChange={(e) => setTankLength(e.target.value)}
                      placeholder="Örn: 20"
                    />
                  </div>
                  <div>
                    <Label>Tank Genişliği (m)</Label>
                    <Input 
                      value={tankBreadth} 
                      onChange={(e) => setTankBreadth(e.target.value)}
                      placeholder="Örn: 10"
                    />
                  </div>
                  <div>
                    <Label>Tank Yüksekliği (m)</Label>
                    <Input 
                      value={tankHeight} 
                      onChange={(e) => setTankHeight(e.target.value)}
                      placeholder="Örn: 8"
                    />
                  </div>
                  <div>
                    <Label>Sıvı Yoğunluğu (t/m³)</Label>
                    <Input 
                      value={fluidDensity} 
                      onChange={(e) => setFluidDensity(e.target.value)}
                      placeholder="1.025"
                    />
                  </div>
                  <div>
                    <Label>Doluluk Oranı (%)</Label>
                    <Input 
                      value={fillPercentage} 
                      onChange={(e) => setFillPercentage(e.target.value)}
                      placeholder="Örn: 50"
                    />
                  </div>
                </div>
                <Button 
                  onClick={calculateLiquidShift}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Hesapla
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="securing">
            <Card className="bg-white/80 backdrop-blur-sm border-white/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <AlertTriangle className="w-5 h-5" />
                  Bağlama Arızası Simülasyonu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Kargo Tipi</Label>
                  <Select value={cargoType} onValueChange={setCargoType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="container">Konteyner</SelectItem>
                      <SelectItem value="vehicle">Araç (Ro-Ro)</SelectItem>
                      <SelectItem value="heavy">Ağır Yük</SelectItem>
                      <SelectItem value="timber">Kereste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Bağlaması Kopan Yük (ton)</Label>
                    <Input 
                      value={securedWeight} 
                      onChange={(e) => setSecuredWeight(e.target.value)}
                      placeholder="Örn: 100"
                    />
                  </div>
                  <div>
                    <Label>Devrilme/Kayma Mesafesi (m)</Label>
                    <Input 
                      value={tippingDistance} 
                      onChange={(e) => setTippingDistance(e.target.value)}
                      placeholder="Örn: 5"
                    />
                  </div>
                </div>
                <Button 
                  onClick={calculateSecuringFailure}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600"
                >
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Arıza Simülasyonu
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Results */}
        {results && (
          <Card className={`border-2 ${results.warning ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
            <CardHeader>
              <CardTitle className={results.warning ? 'text-red-700' : 'text-green-700'}>
                Sonuçlar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.warning && (
                <div className="bg-red-100 border border-red-300 rounded-lg p-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="text-red-800 font-medium">{results.warning}</span>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/80 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">Heel Açısı</p>
                  <p className={`text-2xl font-bold ${Math.abs(results.heelAngle) > 12 ? 'text-red-600' : 'text-blue-600'}`}>
                    {results.heelAngle.toFixed(2)}°
                  </p>
                </div>
                <div className="bg-white/80 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">Kayma Momenti</p>
                  <p className="text-2xl font-bold text-blue-600">{results.shiftMoment.toFixed(1)} t·m</p>
                </div>
                {results.fsm !== undefined && (
                  <div className="bg-white/80 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">FSM</p>
                    <p className="text-2xl font-bold text-blue-600">{results.fsm.toFixed(1)} t·m</p>
                  </div>
                )}
                {results.gmReduction !== undefined && (
                  <div className="bg-white/80 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">GM Kaybı</p>
                    <p className="text-2xl font-bold text-orange-600">{results.gmReduction.toFixed(3)} m</p>
                  </div>
                )}
                {results.criticalAngle !== undefined && (
                  <div className="bg-white/80 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">Kritik Açı</p>
                    <p className="text-2xl font-bold text-orange-600">{results.criticalAngle}°</p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="bg-blue-100 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Önlemler</h4>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Kargo kaymaya başlamadan önce düzeltici manevra yapın</li>
                  <li>Balast transferi ile listeyi düzeltin</li>
                  <li>Hız azaltarak salınımı minimize edin</li>
                  <li>Kötü hava koşullarında sığınak arayın</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        <StabilityAssistantPopup />
      </div>
    </div>
  );
}
