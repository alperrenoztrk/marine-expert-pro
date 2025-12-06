import { Button } from "@/components/ui/button";
import { ArrowLeft, Activity, Calculator, CheckCircle, XCircle, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ReferenceLine, Area, AreaChart } from "recharts";
import StabilityAssistantPopup from "@/components/StabilityAssistantPopup";

export default function StabilityIntactPage() {
  const navigate = useNavigate();

  // Ship parameters
  const [displacement, setDisplacement] = useState("");
  const [kg, setKg] = useState("");
  const [km, setKm] = useState("");
  const [knValues, setKnValues] = useState("");

  // Weight addition for KG correction
  const [addWeight, setAddWeight] = useState("");
  const [weightKg, setWeightKg] = useState("");

  // Results
  const [results, setResults] = useState<{
    gm0: number;
    correctedKg: number;
    correctedGm: number;
    gzCurve: Array<{ angle: number; gz: number; kn: number }>;
    maxGz: number;
    maxGzAngle: number;
    vanishingAngle: number;
    area0to30: number;
    area0to40: number;
    area30to40: number;
    imoCriteria: {
      area0to30: { value: number; required: number; pass: boolean };
      area0to40: { value: number; required: number; pass: boolean };
      area30to40: { value: number; required: number; pass: boolean };
      maxGz: { value: number; required: number; pass: boolean };
      maxGzAngle: { value: number; required: number; pass: boolean };
      gm: { value: number; required: number; pass: boolean };
    };
    overallPass: boolean;
  } | null>(null);

  // Load saved values
  useEffect(() => {
    try {
      const saved = localStorage.getItem('intact-stability-inputs');
      if (saved) {
        const data = JSON.parse(saved);
        setDisplacement(data.displacement || "");
        setKg(data.kg || "");
        setKm(data.km || "");
        setKnValues(data.knValues || "");
      }
    } catch (e) {
      console.error("Error loading saved inputs:", e);
    }
  }, []);

  // Save values
  useEffect(() => {
    try {
      localStorage.setItem('intact-stability-inputs', JSON.stringify({
        displacement, kg, km, knValues
      }));
    } catch (e) {
      console.error("Error saving inputs:", e);
    }
  }, [displacement, kg, km, knValues]);

  const parseInput = (value: string) => {
    const parsed = parseFloat(value.replace(",", "."));
    return isNaN(parsed) ? 0 : parsed;
  };

  const calculateIntactStability = () => {
    const delta = parseInput(displacement);
    const kgVal = parseInput(kg);
    const kmVal = parseInput(km);
    const w = parseInput(addWeight);
    const wKg = parseInput(weightKg);

    // Initial GM
    const gm0 = kmVal - kgVal;

    // KG correction for added weight
    let correctedKg = kgVal;
    let correctedGm = gm0;
    
    if (w !== 0 && delta > 0) {
      const totalMoment = (delta * kgVal) + (w * wKg);
      const newDisplacement = delta + w;
      correctedKg = totalMoment / newDisplacement;
      correctedGm = kmVal - correctedKg;
    }

    // Parse KN values (format: "0:0, 10:0.5, 20:1.2, 30:1.8, 40:2.1, 50:2.0, 60:1.5, 70:0.8, 80:0.2")
    const knPairs = knValues.split(",").map(pair => {
      const [angle, kn] = pair.trim().split(":").map(v => parseFloat(v.replace(",", ".")));
      return { angle: isNaN(angle) ? 0 : angle, kn: isNaN(kn) ? 0 : kn };
    }).filter(p => p.angle >= 0);

    // Generate GZ curve
    let gzCurve: Array<{ angle: number; gz: number; kn: number }> = [];
    
    if (knPairs.length > 0) {
      gzCurve = knPairs.map(p => ({
        angle: p.angle,
        kn: p.kn,
        gz: p.kn - (correctedKg * Math.sin(p.angle * Math.PI / 180))
      }));
    } else {
      // Generate approximate GZ curve if no KN values provided
      for (let angle = 0; angle <= 90; angle += 5) {
        const radians = angle * Math.PI / 180;
        const gz = correctedGm * Math.sin(radians) * (1 - 0.005 * angle);
        gzCurve.push({ angle, gz: Math.max(0, gz), kn: 0 });
      }
    }

    // Find max GZ and angle
    let maxGz = 0;
    let maxGzAngle = 0;
    gzCurve.forEach(p => {
      if (p.gz > maxGz) {
        maxGz = p.gz;
        maxGzAngle = p.angle;
      }
    });

    // Find vanishing angle (where GZ becomes 0 after max)
    let vanishingAngle = 90;
    for (let i = 0; i < gzCurve.length; i++) {
      if (gzCurve[i].angle > maxGzAngle && gzCurve[i].gz <= 0) {
        vanishingAngle = gzCurve[i].angle;
        break;
      }
    }

    // Calculate areas using trapezoidal rule
    const getGzAtAngle = (angle: number): number => {
      const point = gzCurve.find(p => p.angle === angle);
      if (point) return point.gz;
      // Interpolate
      for (let i = 0; i < gzCurve.length - 1; i++) {
        if (gzCurve[i].angle <= angle && gzCurve[i + 1].angle >= angle) {
          const t = (angle - gzCurve[i].angle) / (gzCurve[i + 1].angle - gzCurve[i].angle);
          return gzCurve[i].gz + t * (gzCurve[i + 1].gz - gzCurve[i].gz);
        }
      }
      return 0;
    };

    // Area calculations (in m·rad)
    const calculateArea = (from: number, to: number): number => {
      let area = 0;
      const step = 1;
      for (let angle = from; angle < to; angle += step) {
        const gz1 = getGzAtAngle(angle);
        const gz2 = getGzAtAngle(angle + step);
        area += ((gz1 + gz2) / 2) * (step * Math.PI / 180);
      }
      return area;
    };

    const area0to30 = calculateArea(0, 30);
    const area0to40 = calculateArea(0, Math.min(40, vanishingAngle));
    const area30to40 = calculateArea(30, Math.min(40, vanishingAngle));

    // IMO Criteria check
    const imoCriteria = {
      area0to30: { value: area0to30, required: 0.055, pass: area0to30 >= 0.055 },
      area0to40: { value: area0to40, required: 0.09, pass: area0to40 >= 0.09 },
      area30to40: { value: area30to40, required: 0.03, pass: area30to40 >= 0.03 },
      maxGz: { value: maxGz, required: 0.2, pass: maxGz >= 0.2 },
      maxGzAngle: { value: maxGzAngle, required: 25, pass: maxGzAngle >= 25 },
      gm: { value: correctedGm, required: 0.15, pass: correctedGm >= 0.15 }
    };

    const overallPass = Object.values(imoCriteria).every(c => c.pass);

    setResults({
      gm0,
      correctedKg,
      correctedGm,
      gzCurve,
      maxGz,
      maxGzAngle,
      vanishingAngle,
      area0to30,
      area0to40,
      area30to40,
      imoCriteria,
      overallPass
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
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Intact Stability
            </h1>
          </div>
          <p className="text-gray-600">GM₀, KG düzeltme, GZ eğrisi, IMO kriterleri</p>
        </div>

        {/* Ship Parameters */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Activity className="w-5 h-5" />
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
              <Label>KG (m)</Label>
              <Input 
                value={kg} 
                onChange={(e) => setKg(e.target.value)}
                placeholder="Örn: 7.5"
              />
            </div>
            <div>
              <Label>KM (m)</Label>
              <Input 
                value={km} 
                onChange={(e) => setKm(e.target.value)}
                placeholder="Örn: 8.2"
              />
            </div>
          </CardContent>
        </Card>

        {/* KN Table Input */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <BarChart3 className="w-5 h-5" />
              KN Tablosu (Cross Curves)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label>KN Değerleri (açı:değer formatında, virgülle ayırın)</Label>
            <Input 
              value={knValues} 
              onChange={(e) => setKnValues(e.target.value)}
              placeholder="0:0, 10:0.8, 20:1.6, 30:2.2, 40:2.5, 50:2.4, 60:2.0, 70:1.2, 80:0.3"
              className="font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">
              Boş bırakılırsa yaklaşık GZ eğrisi oluşturulur
            </p>
          </CardContent>
        </Card>

        {/* KG Correction */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Calculator className="w-5 h-5" />
              KG Düzeltmesi (Ağırlık Ekleme/Çıkarma)
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Ağırlık (ton) (+/-)</Label>
              <Input 
                value={addWeight} 
                onChange={(e) => setAddWeight(e.target.value)}
                placeholder="Örn: 500 veya -200"
              />
            </div>
            <div>
              <Label>Ağırlık KG (m)</Label>
              <Input 
                value={weightKg} 
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="Örn: 10"
              />
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={calculateIntactStability}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          size="lg"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Hesapla
        </Button>

        {/* Results */}
        {results && (
          <>
            {/* GM Results */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-700">Stabilite Sonuçları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/80 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">GM₀ (Başlangıç)</p>
                    <p className="text-xl font-bold text-blue-600">{results.gm0.toFixed(3)} m</p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">Düzeltilmiş KG</p>
                    <p className="text-xl font-bold text-blue-600">{results.correctedKg.toFixed(3)} m</p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">Düzeltilmiş GM</p>
                    <p className={`text-xl font-bold ${results.correctedGm >= 0.15 ? 'text-green-600' : 'text-red-600'}`}>
                      {results.correctedGm.toFixed(3)} m
                    </p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">Kaybolma Açısı</p>
                    <p className="text-xl font-bold text-blue-600">{results.vanishingAngle}°</p>
                  </div>
                </div>

                <Separator />

                {/* GZ Curve */}
                <div className="bg-white/80 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-700 mb-3">GZ Eğrisi</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={results.gzCurve}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="angle" label={{ value: 'Açı (°)', position: 'bottom' }} />
                      <YAxis label={{ value: 'GZ (m)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value: number) => value.toFixed(3)} />
                      <Legend />
                      <ReferenceLine y={0} stroke="#666" />
                      <ReferenceLine x={30} stroke="#f59e0b" strokeDasharray="5 5" label="30°" />
                      <ReferenceLine x={40} stroke="#ef4444" strokeDasharray="5 5" label="40°" />
                      <Area type="monotone" dataKey="gz" stroke="#3b82f6" fill="#93c5fd" name="GZ" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white/80 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">Max GZ</p>
                    <p className="text-xl font-bold text-blue-600">{results.maxGz.toFixed(3)} m</p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">Max GZ Açısı</p>
                    <p className="text-xl font-bold text-blue-600">{results.maxGzAngle}°</p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">Alan 0-30°</p>
                    <p className="text-xl font-bold text-blue-600">{results.area0to30.toFixed(4)} m·rad</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* IMO Criteria */}
            <Card className={`border-2 ${results.overallPass ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${results.overallPass ? 'text-green-700' : 'text-red-700'}`}>
                  {results.overallPass ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  IMO Kriter Kontrolü: {results.overallPass ? 'GEÇTİ' : 'KALDI'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(results.imoCriteria).map(([key, criteria]) => (
                    <div key={key} className={`flex items-center justify-between p-2 rounded ${criteria.pass ? 'bg-green-100' : 'bg-red-100'}`}>
                      <span className="font-medium">
                        {key === 'area0to30' && 'Alan 0-30°'}
                        {key === 'area0to40' && 'Alan 0-40°'}
                        {key === 'area30to40' && 'Alan 30-40°'}
                        {key === 'maxGz' && 'Max GZ'}
                        {key === 'maxGzAngle' && 'Max GZ Açısı'}
                        {key === 'gm' && 'GM'}
                      </span>
                      <span className="flex items-center gap-2">
                        <span>{criteria.value.toFixed(3)} {key.includes('Angle') ? '°' : key.includes('area') ? 'm·rad' : 'm'}</span>
                        <span className="text-gray-500">≥ {criteria.required}</span>
                        {criteria.pass ? 
                          <CheckCircle className="w-4 h-4 text-green-600" /> : 
                          <XCircle className="w-4 h-4 text-red-600" />
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <StabilityAssistantPopup />
      </div>
    </div>
  );
}
