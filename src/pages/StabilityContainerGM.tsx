import { Button } from "@/components/ui/button";
import { ArrowLeft, Scale, Calculator, Ship, CheckCircle, XCircle, AlertTriangle, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ReferenceLine, Area, ComposedChart, Bar } from "recharts";
import StabilityAssistantPopup from "@/components/StabilityAssistantPopup";

export default function StabilityContainerGMPage() {
  const navigate = useNavigate();

  // Ship parameters
  const [displacement, setDisplacement] = useState("");
  const [actualGm, setActualGm] = useState("");
  const [breadth, setBreadth] = useState("");
  const [kgShip, setKgShip] = useState("");
  const [kmShip, setKmShip] = useState("");

  // Container stack parameters
  const [stackWeight, setStackWeight] = useState("");
  const [tierHeight, setTierHeight] = useState("2.6");
  const [tiers, setTiers] = useState("");
  const [bayNumber, setBayNumber] = useState("");
  const [baseHeight, setBaseHeight] = useState(""); // Height of first tier bottom from keel

  // GM Limit Curve data (sample data - in real scenario, this comes from ship's stability booklet)
  const [gmLimitData, setGmLimitData] = useState<Array<{ stackWeight: number; gmLimit: number }>>([
    { stackWeight: 0, gmLimit: 0.5 },
    { stackWeight: 50, gmLimit: 0.8 },
    { stackWeight: 100, gmLimit: 1.2 },
    { stackWeight: 150, gmLimit: 1.8 },
    { stackWeight: 200, gmLimit: 2.5 },
    { stackWeight: 250, gmLimit: 3.5 },
    { stackWeight: 300, gmLimit: 5.0 },
  ]);

  // Results
  const [results, setResults] = useState<{
    requiredGm: number;
    stackKg: number;
    gmMargin: number;
    compliant: boolean;
    maxAllowedWeight: number;
    stackMoment: number;
    effectiveKg: number;
    lashingForce: number;
  } | null>(null);

  // Load saved values
  useEffect(() => {
    try {
      const saved = localStorage.getItem('container-gm-inputs');
      if (saved) {
        const data = JSON.parse(saved);
        setDisplacement(data.displacement || "");
        setActualGm(data.actualGm || "");
        setBreadth(data.breadth || "");
        setKgShip(data.kgShip || "");
        setKmShip(data.kmShip || "");
      }
    } catch (e) {
      console.error("Error loading saved inputs:", e);
    }
  }, []);

  // Save values
  useEffect(() => {
    try {
      localStorage.setItem('container-gm-inputs', JSON.stringify({
        displacement, actualGm, breadth, kgShip, kmShip
      }));
    } catch (e) {
      console.error("Error saving inputs:", e);
    }
  }, [displacement, actualGm, breadth, kgShip, kmShip]);

  const parseInput = (value: string) => {
    const parsed = parseFloat(value.replace(",", "."));
    return isNaN(parsed) ? 0 : parsed;
  };

  const calculateGmLimit = () => {
    const delta = parseInput(displacement);
    const gm = parseInput(actualGm);
    const B = parseInput(breadth);
    const swt = parseInput(stackWeight);
    const th = parseInput(tierHeight);
    const t = parseInput(tiers);
    const base = parseInput(baseHeight);

    if (delta <= 0 || gm <= 0) {
      setResults(null);
      return;
    }

    // Calculate stack center of gravity
    // Stack KG = base + (tierHeight × (tiers - 1) / 2) + (tierHeight / 2)
    // Simplified: Stack KG = base + tierHeight × (tiers / 2)
    const stackKg = base + th * (t / 2);

    // Calculate stack moment
    const stackMoment = swt * stackKg;

    // Effective ship KG with this stack
    const shipKg = parseInput(kgShip);
    const km = parseInput(kmShip);
    const totalMoment = (delta * shipKg) + stackMoment;
    const newDisplacement = delta + swt;
    const effectiveKg = totalMoment / newDisplacement;

    // Calculate required GM from GM limit curve (interpolation)
    let requiredGm = 0;
    for (let i = 0; i < gmLimitData.length - 1; i++) {
      if (swt >= gmLimitData[i].stackWeight && swt <= gmLimitData[i + 1].stackWeight) {
        const ratio = (swt - gmLimitData[i].stackWeight) / (gmLimitData[i + 1].stackWeight - gmLimitData[i].stackWeight);
        requiredGm = gmLimitData[i].gmLimit + ratio * (gmLimitData[i + 1].gmLimit - gmLimitData[i].gmLimit);
        break;
      }
    }
    if (swt > gmLimitData[gmLimitData.length - 1].stackWeight) {
      requiredGm = gmLimitData[gmLimitData.length - 1].gmLimit * 1.5; // Extrapolate
    }

    // GM margin
    const gmMargin = gm - requiredGm;
    const compliant = gmMargin >= 0;

    // Find maximum allowed weight at current GM
    let maxAllowedWeight = 0;
    for (let i = gmLimitData.length - 1; i >= 0; i--) {
      if (gmLimitData[i].gmLimit <= gm) {
        if (i < gmLimitData.length - 1) {
          const ratio = (gm - gmLimitData[i].gmLimit) / (gmLimitData[i + 1].gmLimit - gmLimitData[i].gmLimit);
          maxAllowedWeight = gmLimitData[i].stackWeight + ratio * (gmLimitData[i + 1].stackWeight - gmLimitData[i].stackWeight);
        } else {
          maxAllowedWeight = gmLimitData[i].stackWeight;
        }
        break;
      }
    }

    // Approximate lashing force calculation (simplified)
    // Based on CSS Code requirements
    const g = 9.81; // m/s²
    const accelerationFactor = 1.5; // Typical transverse acceleration
    const lashingForce = swt * 1000 * g * accelerationFactor / 4; // Per lashing point, in Newtons

    setResults({
      requiredGm,
      stackKg,
      gmMargin,
      compliant,
      maxAllowedWeight,
      stackMoment,
      effectiveKg,
      lashingForce: lashingForce / 1000 // Convert to kN
    });
  };

  // Prepare chart data
  const chartData = gmLimitData.map(d => ({
    ...d,
    actualGm: parseInput(actualGm)
  }));

  if (results) {
    chartData.push({
      stackWeight: parseInput(stackWeight),
      gmLimit: results.requiredGm,
      actualGm: parseInput(actualGm)
    });
  }

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
              <Scale className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Container GM Limit
            </h1>
          </div>
          <p className="text-gray-600">GM limit curves, stack weight uyumu, lashing kuvvetleri</p>
        </div>

        {/* Ship Parameters */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Ship className="w-5 h-5" />
              Gemi Parametreleri
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <Label>Deplasman (ton)</Label>
              <Input 
                value={displacement} 
                onChange={(e) => setDisplacement(e.target.value)}
                placeholder="Örn: 25000"
              />
            </div>
            <div>
              <Label>Mevcut GM (m)</Label>
              <Input 
                value={actualGm} 
                onChange={(e) => setActualGm(e.target.value)}
                placeholder="Örn: 1.5"
              />
            </div>
            <div>
              <Label>Genişlik (m)</Label>
              <Input 
                value={breadth} 
                onChange={(e) => setBreadth(e.target.value)}
                placeholder="Örn: 32"
              />
            </div>
            <div>
              <Label>Gemi KG (m)</Label>
              <Input 
                value={kgShip} 
                onChange={(e) => setKgShip(e.target.value)}
                placeholder="Örn: 8.5"
              />
            </div>
            <div>
              <Label>Gemi KM (m)</Label>
              <Input 
                value={kmShip} 
                onChange={(e) => setKmShip(e.target.value)}
                placeholder="Örn: 10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Container Stack Parameters */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <BarChart3 className="w-5 h-5" />
              Konteyner Stack Parametreleri
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <Label>Stack Ağırlığı (ton)</Label>
              <Input 
                value={stackWeight} 
                onChange={(e) => setStackWeight(e.target.value)}
                placeholder="Örn: 150"
              />
            </div>
            <div>
              <Label>Tier Yüksekliği (m)</Label>
              <Input 
                value={tierHeight} 
                onChange={(e) => setTierHeight(e.target.value)}
                placeholder="2.6"
              />
            </div>
            <div>
              <Label>Tier Sayısı</Label>
              <Input 
                value={tiers} 
                onChange={(e) => setTiers(e.target.value)}
                placeholder="Örn: 6"
              />
            </div>
            <div>
              <Label>Bay Numarası</Label>
              <Input 
                value={bayNumber} 
                onChange={(e) => setBayNumber(e.target.value)}
                placeholder="Örn: 42"
              />
            </div>
            <div>
              <Label>Taban Yüksekliği (m)</Label>
              <Input 
                value={baseHeight} 
                onChange={(e) => setBaseHeight(e.target.value)}
                placeholder="Örn: 10"
              />
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={calculateGmLimit}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          size="lg"
        >
          <Calculator className="w-5 h-5 mr-2" />
          GM Limit Kontrolü
        </Button>

        {/* Results */}
        {results && (
          <>
            <Card className={`border-2 ${results.compliant ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${results.compliant ? 'text-green-700' : 'text-red-700'}`}>
                  {results.compliant ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  {results.compliant ? 'GM YETERLİ' : 'GM YETERSİZ'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!results.compliant && (
                  <div className="bg-red-100 border border-red-300 rounded-lg p-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800 font-medium">
                      Stack ağırlığını {results.maxAllowedWeight.toFixed(1)} ton'a düşürün veya GM'i artırın!
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/80 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">Gerekli GM</p>
                    <p className="text-xl font-bold text-blue-600">{results.requiredGm.toFixed(2)} m</p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">Mevcut GM</p>
                    <p className="text-xl font-bold text-blue-600">{parseInput(actualGm).toFixed(2)} m</p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">GM Marjı</p>
                    <p className={`text-xl font-bold ${results.gmMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {results.gmMargin.toFixed(2)} m
                    </p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">Max İzin Ağırlık</p>
                    <p className="text-xl font-bold text-orange-600">{results.maxAllowedWeight.toFixed(1)} t</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/80 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">Stack KG</p>
                    <p className="text-xl font-bold text-blue-600">{results.stackKg.toFixed(2)} m</p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">Stack Moment</p>
                    <p className="text-xl font-bold text-blue-600">{results.stackMoment.toFixed(1)} t·m</p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">Efektif KG</p>
                    <p className="text-xl font-bold text-blue-600">{results.effectiveKg.toFixed(2)} m</p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">Lashing Kuvveti</p>
                    <p className="text-xl font-bold text-orange-600">{results.lashingForce.toFixed(1)} kN</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* GM Limit Curve Chart */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/60">
              <CardHeader>
                <CardTitle className="text-blue-700">GM Limit Eğrisi</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={chartData.sort((a, b) => a.stackWeight - b.stackWeight)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="stackWeight" 
                      label={{ value: 'Stack Ağırlığı (ton)', position: 'bottom' }} 
                    />
                    <YAxis 
                      label={{ value: 'GM (m)', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="gmLimit" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="GM Limit (Min)" 
                      dot={false}
                    />
                    <ReferenceLine 
                      y={parseInput(actualGm)} 
                      stroke="#22c55e" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      label={{ value: 'Mevcut GM', position: 'right', fill: '#22c55e' }}
                    />
                    {parseInput(stackWeight) > 0 && (
                      <ReferenceLine 
                        x={parseInput(stackWeight)} 
                        stroke="#3b82f6" 
                        strokeDasharray="3 3"
                        label={{ value: 'Stack', position: 'top', fill: '#3b82f6' }}
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Mevcut GM (yeşil çizgi) her zaman GM Limit (kırmızı çizgi) üzerinde olmalıdır
                </p>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-700">Bay Plan Önerileri</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-blue-700 space-y-2 list-disc list-inside">
                  <li>Ağır konteynerleri alt tierlere yerleştirin (düşük KG)</li>
                  <li>Stack ağırlığını GM limit eğrisine göre sınırlayın</li>
                  <li>Lashing ekipmanının kapasitesini kontrol edin</li>
                  <li>Balast ayarlarıyla GM'i optimize edin</li>
                  <li>Bay plan yazılımında {bayNumber ? `Bay ${bayNumber}` : 'ilgili bay'} için limit kontrolü yapın</li>
                </ul>
              </CardContent>
            </Card>
          </>
        )}

        <StabilityAssistantPopup />
      </div>
    </div>
  );
}
