import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calculator, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart, ReferenceDot, ReferenceArea } from "recharts";
import { StableTalesEngine } from "./StableTalesCalculationEngine";

export const AdvancedSOLASChecker = () => {
  const [vesselData, setVesselData] = useState({
    deplasman: 25000,
    km: 8.5,
    kg: 7.2,
    gemi_tipi: 'cargo',
    hizmet_alani: 'unrestricted'
  });

  const [criteriaResults, setCriteriaResults] = useState<any>(null);
  const [gzCurve, setGzCurve] = useState<Array<{ aci: number; gz: number; area: number; rightingMoment: number }>>([]);
  
  const checkSOLASCriteria = () => {
    try {
      const engine = new StableTalesEngine(vesselData.deplasman, vesselData.km, vesselData.kg);
      
      // Generate detailed GZ curve
      const curveData = [];
      let cumulativeArea = 0;
      
      for (let aci = 0; aci <= 90; aci += 1) {
        const aci_rad = aci * (Math.PI / 180);
        const gm = engine.hesapla_gm();
        const gz = gm * Math.sin(aci_rad); // Simplified GZ calculation
        
        // Calculate incremental area
        if (aci > 0) {
          const prevGz = curveData[curveData.length - 1]?.gz || 0;
          const incrementalArea = ((gz + prevGz) / 2) * (Math.PI / 180); // Trapezoidal rule
          cumulativeArea += incrementalArea;
        }
        
        curveData.push({
          aci,
          gz: Math.max(0, gz),
          area: cumulativeArea,
          rightingMoment: vesselData.deplasman * Math.max(0, gz)
        });
      }
      
      setGzCurve(curveData);
      
      // Calculate SOLAS areas
      const alan_0_30 = curveData.find(p => p.aci === 30)?.area || 0;
      const alan_0_40 = curveData.find(p => p.aci === 40)?.area || 0;
      const alan_30_40 = (curveData.find(p => p.aci === 40)?.area || 0) - (curveData.find(p => p.aci === 30)?.area || 0);
      
      // Find maximum GZ
      const max_gz_point = curveData.reduce((max, point) => point.gz > max.gz ? point : max, {gz: 0, aci: 0});
      
      // SOLAS criteria based on vessel type
      const getCriteria = () => {
        const baseCriteria = {
          min_gm: 0.150,
          min_area_0_30: 0.055,
          min_area_0_40: 0.090,
          min_area_30_40: 0.030,
          min_max_gz: 0.200,
          min_gz_angle: 30
        };
        
        // Adjust for vessel type
        if (vesselData.gemi_tipi === 'passenger') {
          baseCriteria.min_gm = 0.200;
          baseCriteria.min_area_0_30 = 0.070;
        } else if (vesselData.gemi_tipi === 'tanker') {
          baseCriteria.min_area_0_30 = 0.065;
          baseCriteria.min_area_0_40 = 0.100;
        }
        
        return baseCriteria;
      };

      const criteria = getCriteria();
      const gm = engine.hesapla_gm();
      
      // Check each criterion
      const results = {
        gm: {
          value: gm,
          required: criteria.min_gm,
          passed: gm >= criteria.min_gm,
          score: Math.min(100, (gm / criteria.min_gm) * 100)
        },
        area_0_30: {
          value: alan_0_30,
          required: criteria.min_area_0_30,
          passed: alan_0_30 >= criteria.min_area_0_30,
          score: Math.min(100, (alan_0_30 / criteria.min_area_0_30) * 100)
        },
        area_0_40: {
          value: alan_0_40,
          required: criteria.min_area_0_40,
          passed: alan_0_40 >= criteria.min_area_0_40,
          score: Math.min(100, (alan_0_40 / criteria.min_area_0_40) * 100)
        },
        area_30_40: {
          value: alan_30_40,
          required: criteria.min_area_30_40,
          passed: alan_30_40 >= criteria.min_area_30_40,
          score: Math.min(100, (alan_30_40 / criteria.min_area_30_40) * 100)
        },
        max_gz: {
          value: max_gz_point.gz,
          required: criteria.min_max_gz,
          passed: max_gz_point.gz >= criteria.min_max_gz,
          score: Math.min(100, (max_gz_point.gz / criteria.min_max_gz) * 100)
        },
        gz_angle: {
          value: max_gz_point.aci,
          required: criteria.min_gz_angle,
          passed: max_gz_point.aci >= criteria.min_gz_angle,
          score: Math.min(100, (max_gz_point.aci / criteria.min_gz_angle) * 100)
        }
      };

      // Calculate overall compliance
      const passedCriteria = Object.values(results).filter(r => r.passed).length;
      const totalCriteria = Object.values(results).length;
      const overallScore = Object.values(results).reduce((sum, r) => sum + r.score, 0) / totalCriteria;
      
      const finalResults = {
        ...results,
        overall: {
          passed: passedCriteria,
          total: totalCriteria,
          score: overallScore,
          compliant: passedCriteria === totalCriteria
        }
      };
      
      setCriteriaResults(finalResults);
      
      if (finalResults.overall.compliant) {
        toast.success(`✅ Tüm SOLAS kriterleri sağlandı! Genel skor: ${overallScore.toFixed(1)}%`);
      } else {
        toast.error(`❌ ${totalCriteria - passedCriteria} SOLAS kriteri başarısız! Genel skor: ${overallScore.toFixed(1)}%`);
      }
      
    } catch (error) {
      console.error("SOLAS check error:", error);
      toast.error("SOLAS kriterleri kontrolü sırasında bir hata oluştu!");
    }
  };

  const getCriterionName = (key: string) => {
    const names: { [key: string]: string } = {
      gm: 'Başlangıç GM',
      area_0_30: 'Alan 0-30°',
      area_0_40: 'Alan 0-40°',
      area_30_40: 'Alan 30-40°',
      max_gz: 'Maksimum GZ',
      gz_angle: 'Max GZ Açısı'
    };
    return names[key] || key;
  };

  const getCriterionUnit = (key: string) => {
    const units: { [key: string]: string } = {
      gm: 'm',
      area_0_30: 'm.rad',
      area_0_40: 'm.rad',
      area_30_40: 'm.rad',
      max_gz: 'm',
      gz_angle: '°'
    };
    return units[key] || '';
  };

  return (
    <div className="space-y-6">
      {/* Gemi Bilgileri */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gelişmiş SOLAS Kriter Kontrolü
          </CardTitle>
          <CardDescription>
            SOLAS Bölüm II-1 Stabilite Kriterlerinin detaylı analizi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label>Deplasman (ton)</Label>
              <Input
                type="number"
                value={vesselData.deplasman}
                onChange={(e) => setVesselData(prev => ({ ...prev, deplasman: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label>KM (m)</Label>
              <Input
                type="number"
                step="0.01"
                value={vesselData.km}
                onChange={(e) => setVesselData(prev => ({ ...prev, km: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label>KG (m)</Label>
              <Input
                type="number"
                step="0.01"
                value={vesselData.kg}
                onChange={(e) => setVesselData(prev => ({ ...prev, kg: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label>Gemi Tipi</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={vesselData.gemi_tipi}
                onChange={(e) => setVesselData(prev => ({ ...prev, gemi_tipi: e.target.value }))}
              >
                <option value="cargo">Kargo Gemisi</option>
                <option value="passenger">Yolcu Gemisi</option>
                <option value="tanker">Tanker</option>
                <option value="container">Konteyner Gemisi</option>
              </select>
            </div>
            <div>
              <Label>Hizmet Alanı</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={vesselData.hizmet_alani}
                onChange={(e) => setVesselData(prev => ({ ...prev, hizmet_alani: e.target.value }))}
              >
                <option value="unrestricted">Sınırsız</option>
                <option value="restricted">Sınırlı</option>
                <option value="coastal">Kıyı Seferleri</option>
              </select>
            </div>
          </div>

          <Button onClick={checkSOLASCriteria} className="w-full mt-4">
            <Calculator className="mr-2 h-4 w-4" />
            SOLAS Kriterlerini Kontrol Et
          </Button>
        </CardContent>
      </Card>

      {/* Sonuçlar */}
      {criteriaResults && (
        <div className="space-y-6">
          {/* Genel Durum */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {criteriaResults.overall.compliant ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
                SOLAS Uygunluk Durumu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">{criteriaResults.overall.score.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Genel Skor</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-secondary">
                    {criteriaResults.overall.passed}/{criteriaResults.overall.total}
                  </p>
                  <p className="text-sm text-muted-foreground">Geçen Kriter</p>
                </div>
                <div className="text-center">
                  <Badge variant={criteriaResults.overall.compliant ? "default" : "destructive"}>
                    {criteriaResults.overall.compliant ? "UYGUN" : "UYGUN DEĞİL"}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">Genel Durum</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{vesselData.gemi_tipi.toUpperCase()}</p>
                  <p className="text-sm text-muted-foreground">Gemi Tipi</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Genel Uygunluk</span>
                  <span className="text-sm text-muted-foreground">{criteriaResults.overall.score.toFixed(1)}%</span>
                </div>
                <Progress value={criteriaResults.overall.score} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Detaylı Kriter Sonuçları */}
          <Card>
            <CardHeader>
              <CardTitle>Detaylı Kriter Analizi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(criteriaResults).filter(([key]) => key !== 'overall').map(([key, criterion]: [string, any]) => (
                  <div key={key} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{getCriterionName(key)}</h4>
                      <Badge variant={criterion.passed ? "default" : "destructive"}>
                        {criterion.passed ? "✓" : "✗"}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Mevcut Değer:</span>
                        <span className="font-medium">
                          {criterion.value.toFixed(3)} {getCriterionUnit(key)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Gerekli Minimum:</span>
                        <span className="font-medium">
                          {criterion.required.toFixed(3)} {getCriterionUnit(key)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Güvenlik Marjı:</span>
                        <span className={`font-medium ${criterion.value >= criterion.required ? 'text-green-600' : 'text-red-600'}`}>
                          {(criterion.value - criterion.required).toFixed(3)} {getCriterionUnit(key)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium">Skor</span>
                        <span className="text-xs text-muted-foreground">{criterion.score.toFixed(1)}%</span>
                      </div>
                      <Progress value={criterion.score} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* GZ Eğrisi ve Alanlar */}
          {gzCurve.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>GZ Eğrisi ve SOLAS Alanları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* GZ Curve */}
                  <div>
                    <h4 className="font-medium mb-3">GZ Eğrisi</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={gzCurve.filter(p => p.aci <= 60)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="aci" label={{ value: 'Açı (°)', position: 'insideBottom', offset: -10 }} />
                          <YAxis label={{ value: 'GZ (m)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip
                            content={({ active, payload, label }) => {
                              if (!active || !payload?.length) return null;
                              const payloadData = payload[0]?.payload ?? {};
                              return (
                                <div className="rounded-lg border border-border bg-background p-3 shadow-lg">
                                  <div className="font-medium">Açı: {label}°</div>
                                  <div className="text-sm text-emerald-600">GZ: {payloadData.gz?.toFixed(3)} m</div>
                                  <div className="text-sm text-sky-600">Moment: {payloadData.rightingMoment?.toFixed(0)} t·m</div>
                                </div>
                              );
                            }}
                          />
                          <ReferenceArea x1={0} x2={60} fill="#22c55e" fillOpacity={0.08} />
                          <Line type="monotone" dataKey="gz" stroke="hsl(var(--primary))" strokeWidth={2} />
                          <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
                          <ReferenceLine x={30} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" label={{ value: "30°", position: "top" }} />
                          <ReferenceLine x={40} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" label={{ value: "40°", position: "top" }} />
                          <ReferenceLine y={criteriaResults.max_gz.required} stroke="#14b8a6" strokeDasharray="4 4" label={{ value: "Min GZ 0.20 m", position: "insideTopRight" }} />
                          {(() => {
                            const maxPoint = gzCurve.reduce((max, point) => point.gz > max.gz ? point : max, gzCurve[0]);
                            return (
                              <>
                                <ReferenceArea x1={maxPoint.aci - 2} x2={maxPoint.aci + 2} fill="#f59e0b" fillOpacity={0.12} />
                                <ReferenceDot x={maxPoint.aci} y={maxPoint.gz} r={5} fill="hsl(var(--primary))" stroke="hsl(var(--background))" />
                                <ReferenceDot x={30} y={gzCurve.find(p => p.aci === 30)?.gz ?? 0} r={4} fill="#0ea5e9" stroke="hsl(var(--background))" />
                                <ReferenceDot x={40} y={gzCurve.find(p => p.aci === 40)?.gz ?? 0} r={4} fill="#0ea5e9" stroke="hsl(var(--background))" />
                              </>
                            );
                          })()}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-3 rounded-lg border border-slate-200/60 bg-slate-50 p-3 text-xs text-slate-700 dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-200">
                      <div className="font-semibold">Formül</div>
                      <div>GZ(φ) = GM · sinφ; RM = Δ · GZ</div>
                      <div className="mt-1 font-semibold">Anlam</div>
                      <div>GZ doğrultucu kolu, RM doğrultucu momenttir.</div>
                    </div>
                  </div>

                  {/* Area Curve */}
                  <div>
                    <h4 className="font-medium mb-3">Kümülatif Alan Eğrisi</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={gzCurve.filter(p => p.aci <= 60)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="aci" label={{ value: 'Açı (°)', position: 'insideBottom', offset: -10 }} />
                          <YAxis label={{ value: 'Alan (m.rad)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip
                            content={({ active, payload, label }) => {
                              if (!active || !payload?.length) return null;
                              const payloadData = payload[0]?.payload ?? {};
                              return (
                                <div className="rounded-lg border border-border bg-background p-3 shadow-lg">
                                  <div className="font-medium">Açı: {label}°</div>
                                  <div className="text-sm text-amber-600">Alan: {payloadData.area?.toFixed(4)} m·rad</div>
                                  <div className="text-sm text-emerald-600">GZ: {payloadData.gz?.toFixed(3)} m</div>
                                  <div className="text-sm text-sky-600">Moment: {payloadData.rightingMoment?.toFixed(0)} t·m</div>
                                </div>
                              );
                            }}
                          />
                          <ReferenceArea x1={30} x2={40} fill="#f97316" fillOpacity={0.12} />
                          <Area type="monotone" dataKey="area" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.3} />
                          <ReferenceLine x={30} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" label={{ value: "30°", position: "top" }} />
                          <ReferenceLine x={40} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" label={{ value: "40°", position: "top" }} />
                          <ReferenceLine y={criteriaResults.area_0_30.required} stroke="#14b8a6" strokeDasharray="4 4" label={{ value: "Min A(0-30)", position: "insideTopRight" }} />
                          <ReferenceLine y={criteriaResults.area_0_40.required} stroke="#0ea5e9" strokeDasharray="4 4" label={{ value: "Min A(0-40)", position: "insideTopRight" }} />
                          <ReferenceDot x={30} y={gzCurve.find(p => p.aci === 30)?.area ?? 0} r={4} fill="#f97316" stroke="hsl(var(--background))" />
                          <ReferenceDot x={40} y={gzCurve.find(p => p.aci === 40)?.area ?? 0} r={4} fill="#f97316" stroke="hsl(var(--background))" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-3 rounded-lg border border-slate-200/60 bg-slate-50 p-3 text-xs text-slate-700 dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-200">
                      <div className="font-semibold">Formül</div>
                      <div>Alan(0–30°) ≥ 0.055 m·rad; Alan(0–40°) ≥ 0.090 m·rad; Max GZ ≥ 0.20 m</div>
                      <div className="mt-1 font-semibold">Anlam</div>
                      <div>IS Code alan ve GZ sınırları için görsel kontrol.</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Öneriler */}
          <Card>
            <CardHeader>
              <CardTitle>Stabilite Geliştirme Önerileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!criteriaResults.gm.passed && (
                <div className="p-3 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/20">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    <strong>GM Yetersiz:</strong> Ballast ayarlaması yaparak KG'yi düşürün veya KM'yi artırın.
                  </p>
                </div>
              )}
              
              {!criteriaResults.area_0_30.passed && (
                <div className="p-3 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/20">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    <strong>0-30° Alanı Yetersiz:</strong> İlk stabilite artırıcı önlemler alın.
                  </p>
                </div>
              )}

              {!criteriaResults.max_gz.passed && (
                <div className="p-3 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/20">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    <strong>Maksimum GZ Yetersiz:</strong> Ağırlık dağılımını gözden geçirin.
                  </p>
                </div>
              )}

              <div className="p-4 bg-muted rounded-lg">
                <h5 className="font-medium mb-2">SOLAS Kriter Referansları:</h5>
                <ul className="text-sm space-y-1">
                  <li>• SOLAS Ch.II-1, Reg.25 - Genel Stabilite Kriterleri</li>
                  <li>• IMO Resolution A.749(18) - Stabilite Kod</li>
                  <li>• MSC.267(85) - 2008 IS Code</li>
                  <li>• National Administration Requirements</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
