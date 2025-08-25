import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
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
  title?: string;
  interactive?: boolean;
}

export const EnhancedStabilityChart: React.FC<StabilityChartProps> = ({
  data,
  criticalPoints,
  imoCriteria,
  showKN = false,
  showWindHeeling = false,
  title = "GZ Stability Curve",
  interactive = true
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`Angle: ${label}°`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.value.toFixed(3)} ${entry.dataKey === 'rightingMoment' ? 'kN·m' : 'm'}`}
            </p>
          ))}
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
                  name="Wind Heeling Arm"
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
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};