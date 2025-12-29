import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceDot, ReferenceArea } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Anchor, Waves } from "lucide-react";

interface StabilityChartProps {
  data: Array<{
    angle: number;
    gz: number;
    rightingMoment: number;
    kn?: number;
    windHeelingArm?: number;
    net?: number;
  }>;
  criticalPoints?: {
    maxGZ: { angle: number; value: number };
    vanishingAngle: number;
    deckEdgeAngle: number;
    downfloodingAngle: number;
  };
  imoCriteria?: {
    area0to30: number;
    area0to40: number;
    area30to40: number;
    compliance: boolean;
  };
  showKN?: boolean;
  showWindHeeling?: boolean;
  heelingLabel?: string;
  title?: string;
  interactive?: boolean;
}

export const EnhancedStabilityChart: React.FC<StabilityChartProps> = ({
  data,
  criticalPoints,
  imoCriteria,
  showKN = false,
  showWindHeeling = false,
  heelingLabel = "Heeling Arm",
  title = "GZ Stability Curve",
  interactive = true
}) => {
  const findClosestPoint = (targetAngle: number) => {
    if (!data.length) return null;
    return data.reduce((closest, point) => {
      return Math.abs(point.angle - targetAngle) < Math.abs(closest.angle - targetAngle) ? point : closest;
    }, data[0]);
  };

  const angle30Point = findClosestPoint(30);
  const angle40Point = findClosestPoint(40);
  const maxGZAngle = criticalPoints?.maxGZ.angle;
  const positiveRangeEnd = criticalPoints?.vanishingAngle ?? data[data.length - 1]?.angle ?? 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const payloadData = payload[0]?.payload ?? {};
      const gzValue = typeof payloadData.gz === 'number' ? payloadData.gz : null;
      const momentValue = typeof payloadData.rightingMoment === 'number' ? payloadData.rightingMoment : null;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`Açı: ${label}°`}</p>
          {gzValue !== null && (
            <p className="text-sm text-emerald-600">GZ: {gzValue.toFixed(3)} m</p>
          )}
          {momentValue !== null && (
            <p className="text-sm text-sky-600">Moment: {momentValue.toFixed(0)} kN·m</p>
          )}
          {criticalPoints && label === criticalPoints.maxGZ.angle && (
            <Badge variant="secondary" className="mt-1">Max GZ</Badge>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Anchor className="h-5 w-5" />
            {title}
            {imoCriteria && (
              <Badge variant={imoCriteria.compliance ? "default" : "destructive"}>
                IMO {imoCriteria.compliance ? "PASS" : "FAIL"}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
              <XAxis 
                dataKey="angle" 
                stroke="hsl(var(--foreground))"
                label={{ value: 'Heel Angle (degrees)', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                stroke="hsl(var(--foreground))"
                label={{ value: 'GZ / KN (m)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {positiveRangeEnd > 0 && (
                <ReferenceArea x1={0} x2={positiveRangeEnd} fill="#22c55e" fillOpacity={0.08} />
              )}
              {typeof maxGZAngle === 'number' && (
                <ReferenceArea x1={maxGZAngle - 1.5} x2={maxGZAngle + 1.5} fill="#f59e0b" fillOpacity={0.12} />
              )}
              
              {/* Main GZ curve */}
              <Line
                type="monotone"
                dataKey="gz"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={false}
                name="GZ (Righting Arm)"
              />
              
              {/* KN curve if available */}
              {showKN && (
                <Line
                  type="monotone"
                  dataKey="kn"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="KN (Cross Curve)"
                />
              )}
              
              {/* Wind heeling arm if available */}
              {showWindHeeling && (
                <Line
                  type="monotone"
                  dataKey="windHeelingArm"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  dot={false}
                  name={heelingLabel}
                />
              )}
              {/* Net GZ (GZ - Heeling) when present */}
              {data.some(d => typeof d.net === 'number') && (
                <Line
                  type="monotone"
                  dataKey="net"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={false}
                  name="Net GZ"
                />
              )}
              
              {/* Critical angle reference lines */}
              {criticalPoints && (
                <>
                  <ReferenceLine
                    x={criticalPoints.maxGZ.angle}
                    stroke="hsl(var(--primary))"
                    strokeDasharray="3 3"
                    label={{ value: "Max GZ", position: "right" }}
                  />
                  <ReferenceLine
                    x={30}
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="2 2"
                    label={{ value: "30°", position: "top" }}
                  />
                  <ReferenceLine
                    x={40}
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="2 2"
                    label={{ value: "40°", position: "top" }}
                  />
                  <ReferenceLine
                    x={criticalPoints.vanishingAngle}
                    stroke="hsl(var(--destructive))"
                    strokeDasharray="3 3"
                    label={{ value: "Vanishing", position: "right" }}
                  />
                  <ReferenceLine
                    x={criticalPoints.deckEdgeAngle}
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="2 2"
                    label={{ value: "Deck Edge", position: "right" }}
                  />
                  <ReferenceLine
                    x={criticalPoints.downfloodingAngle}
                    stroke="#f97316"
                    strokeDasharray="2 2"
                    label={{ value: "Downflooding", position: "right" }}
                  />
                  <ReferenceDot x={criticalPoints.maxGZ.angle} y={criticalPoints.maxGZ.value} r={5} fill="hsl(var(--primary))" stroke="hsl(var(--background))" />
                  <ReferenceDot x={criticalPoints.vanishingAngle} y={0} r={4} fill="hsl(var(--destructive))" stroke="hsl(var(--background))" />
                  {angle30Point && (
                    <ReferenceDot x={angle30Point.angle} y={angle30Point.gz} r={4} fill="#0ea5e9" stroke="hsl(var(--background))" />
                  )}
                  {angle40Point && (
                    <ReferenceDot x={angle40Point.angle} y={angle40Point.gz} r={4} fill="#0ea5e9" stroke="hsl(var(--background))" />
                  )}
                  {imoCriteria && (
                    <ReferenceLine y={0.2} stroke="#14b8a6" strokeDasharray="4 4" label={{ value: "Min GZ 0.20 m", position: "insideTopRight" }} />
                  )}
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 rounded-lg border border-slate-200/60 bg-slate-50 p-3 text-xs text-slate-700 dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-200">
            <div className="font-semibold">Formül</div>
            <div>GZ(φ) = KN(φ) − KG · sinφ; RM = Δ · GZ</div>
            <div className="mt-1 font-semibold">Anlam</div>
            <div>GZ doğrultucu kolu, RM doğrultucu momenttir.</div>
          </div>
        </CardContent>
      </Card>

      {/* IMO Criteria Summary */}
      {imoCriteria && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              IMO Stability Criteria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold text-primary">
                  {imoCriteria.area0to30.toFixed(3)}
                </div>
                <div className="text-sm text-muted-foreground">Area 0-30°</div>
                <Badge variant={imoCriteria.area0to30 >= 0.055 ? "default" : "destructive"} className="mt-1">
                  {imoCriteria.area0to30 >= 0.055 ? "✓" : "✗"} ≥0.055
                </Badge>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold text-primary">
                  {imoCriteria.area0to40.toFixed(3)}
                </div>
                <div className="text-sm text-muted-foreground">Area 0-40°</div>
                <Badge variant={imoCriteria.area0to40 >= 0.090 ? "default" : "destructive"} className="mt-1">
                  {imoCriteria.area0to40 >= 0.090 ? "✓" : "✗"} ≥0.090
                </Badge>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold text-primary">
                  {imoCriteria.area30to40.toFixed(3)}
                </div>
                <div className="text-sm text-muted-foreground">Area 30-40°</div>
                <Badge variant={imoCriteria.area30to40 >= 0.030 ? "default" : "destructive"} className="mt-1">
                  {imoCriteria.area30to40 >= 0.030 ? "✓" : "✗"} ≥0.030
                </Badge>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold text-primary">
                  {imoCriteria.compliance ? "PASS" : "FAIL"}
                </div>
                <div className="text-sm text-muted-foreground">Overall</div>
                <Badge variant={imoCriteria.compliance ? "default" : "destructive"} className="mt-1">
                  {imoCriteria.compliance ? "✓" : "✗"} Compliance
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Critical Points Summary */}
      {criticalPoints && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves className="h-5 w-5" />
              Critical Angles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold text-primary">
                  {criticalPoints.maxGZ.angle}°
                </div>
                <div className="text-sm text-muted-foreground">Max GZ Angle</div>
                <div className="text-xs text-muted-foreground">
                  GZ: {criticalPoints.maxGZ.value.toFixed(3)}m
                </div>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold text-primary">
                  {criticalPoints.vanishingAngle}°
                </div>
                <div className="text-sm text-muted-foreground">Vanishing Angle</div>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold text-primary">
                  {criticalPoints.deckEdgeAngle.toFixed(1)}°
                </div>
                <div className="text-sm text-muted-foreground">Deck Edge</div>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold text-primary">
                  {criticalPoints.downfloodingAngle.toFixed(1)}°
                </div>
                <div className="text-sm text-muted-foreground">Downflooding</div>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-slate-200/60 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-200">
              Yorum: Maksimum GZ ve vanishing açısı, stabilite aralığını belirler. Deck edge ve downflooding çizgileri,
              günlük operasyonlarda güvenli yatma limitleri için referans noktalarıdır.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
