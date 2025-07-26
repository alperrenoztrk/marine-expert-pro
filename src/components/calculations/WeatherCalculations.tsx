import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CloudRain, Wind, Waves } from "lucide-react";

export const WeatherCalculations = () => {
  // Beaufort Scale Calculator
  const [windSpeed, setWindSpeed] = useState("");
  const [beaufortResult, setBeaufortResult] = useState<any>(null);

  // Wave Height Analysis
  const [waveHeight, setWaveHeight] = useState("");
  const [shipDraft, setShipDraft] = useState("");
  const [waveAnalysis, setWaveAnalysis] = useState<any>(null);

  // Storm Avoidance
  const [stormCourse, setStormCourse] = useState("");
  const [stormSpeed, setStormSpeed] = useState("");
  const [avoidanceRoute, setAvoidanceRoute] = useState<any>(null);

  const calculateBeaufort = () => {
    const speed = parseFloat(windSpeed);
    if (isNaN(speed)) return;

    let beaufortScale: number;
    let description: string;
    let seaConditions: string;

    if (speed < 1) {
      beaufortScale = 0;
      description = "Calm";
      seaConditions = "Deniz ayna gibi";
    } else if (speed <= 3) {
      beaufortScale = 1;
      description = "Light air";
      seaConditions = "Hafif dalgacıklar";
    } else if (speed <= 7) {
      beaufortScale = 2;
      description = "Light breeze";
      seaConditions = "Küçük dalgalar";
    } else if (speed <= 12) {
      beaufortScale = 3;
      description = "Gentle breeze";
      seaConditions = "Büyük dalgacıklar";
    } else if (speed <= 18) {
      beaufortScale = 4;
      description = "Moderate breeze";
      seaConditions = "Küçük dalgalar, köpük başları";
    } else if (speed <= 24) {
      beaufortScale = 5;
      description = "Fresh breeze";
      seaConditions = "Orta dalgalar, çok köpük";
    } else if (speed <= 31) {
      beaufortScale = 6;
      description = "Strong breeze";
      seaConditions = "Büyük dalgalar, köpük çizgileri";
    } else if (speed <= 38) {
      beaufortScale = 7;
      description = "Near gale";
      seaConditions = "Deniz kabarıyor, köpük üfleniyor";
    } else if (speed <= 46) {
      beaufortScale = 8;
      description = "Gale";
      seaConditions = "Yüksek dalgalar, köpük çizgileri";
    } else if (speed <= 54) {
      beaufortScale = 9;
      description = "Strong gale";
      seaConditions = "Çok yüksek dalgalar";
    } else if (speed <= 63) {
      beaufortScale = 10;
      description = "Storm";
      seaConditions = "Olağanüstü yüksek dalgalar";
    } else if (speed <= 72) {
      beaufortScale = 11;
      description = "Violent storm";
      seaConditions = "Çok yüksek dalgalar, görüş sınırlı";
    } else {
      beaufortScale = 12;
      description = "Hurricane";
      seaConditions = "Hava tamamen köpük ve sprey";
    }

    setBeaufortResult({
      scale: beaufortScale,
      description,
      seaConditions,
      windSpeed: speed
    });
  };

  const analyzeWaveImpact = () => {
    const wave = parseFloat(waveHeight);
    const draft = parseFloat(shipDraft);
    if (isNaN(wave) || isNaN(draft)) return;

    const ratio = wave / draft;
    let impact: string;
    let recommendation: string;
    let status: 'safe' | 'caution' | 'dangerous';

    if (ratio < 0.5) {
      status = 'safe';
      impact = "Minimal etki";
      recommendation = "Normal seyir devam edebilir";
    } else if (ratio < 1.0) {
      status = 'caution';
      impact = "Orta seviye etki";
      recommendation = "Hız azaltılmalı, dikkatli seyir";
    } else if (ratio < 2.0) {
      status = 'dangerous';
      impact = "Yüksek etki - slamming riski";
      recommendation = "Hız ve rota değişikliği gerekli";
    } else {
      status = 'dangerous';
      impact = "Çok yüksek etki - ciddi hasar riski";
      recommendation = "Fırtınaya karşı pozisyon alın";
    }

    setWaveAnalysis({
      ratio,
      impact,
      recommendation,
      status,
      waveHeight: wave,
      draft
    });
  };

  const calculateStormAvoidance = () => {
    const course = parseFloat(stormCourse);
    const speed = parseFloat(stormSpeed);
    if (isNaN(course) || isNaN(speed)) return;

    // Storm avoidance recommendations based on northern hemisphere
    let avoidanceCourse: number;
    let maneuver: string;

    if (course >= 0 && course < 90) {
      avoidanceCourse = course + 45;
      maneuver = "Sağa 45° dön";
    } else if (course >= 90 && course < 180) {
      avoidanceCourse = course - 45;
      maneuver = "Sola 45° dön";
    } else if (course >= 180 && course < 270) {
      avoidanceCourse = course + 45;
      maneuver = "Sağa 45° dön";
    } else {
      avoidanceCourse = course - 45;
      maneuver = "Sola 45° dön";
    }

    if (avoidanceCourse >= 360) avoidanceCourse -= 360;
    if (avoidanceCourse < 0) avoidanceCourse += 360;

    const reducedSpeed = speed * 0.7; // 30% speed reduction

    setAvoidanceRoute({
      originalCourse: course,
      avoidanceCourse,
      maneuver,
      originalSpeed: speed,
      recommendedSpeed: reducedSpeed,
      speedReduction: ((speed - reducedSpeed) / speed * 100).toFixed(1)
    });
  };

  return (
    <div className="space-y-6">
      {/* Beaufort Scale Calculator */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wind className="w-5 h-5 text-blue-500" />
            Beaufort Ölçeği
          </CardTitle>
          <CardDescription>
            Rüzgar hızından Beaufort sayısını hesapla
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="windSpeed">Rüzgar Hızı (knot)</Label>
              <Input
                id="windSpeed"
                type="number"
                value={windSpeed}
                onChange={(e) => setWindSpeed(e.target.value)}
                placeholder="Rüzgar hızını girin"
              />
            </div>
          </div>
          
          <Button onClick={calculateBeaufort} className="w-full">
            Beaufort Hesapla
          </Button>

          {beaufortResult && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Beaufort Sayısı:</span>
                  <Badge variant="outline" className="ml-2">
                    {beaufortResult.scale}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Tanım:</span>
                  <span className="ml-2">{beaufortResult.description}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Deniz Durumu:</span>
                  <p className="mt-1 text-muted-foreground">{beaufortResult.seaConditions}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Wave Impact Analysis */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Waves className="w-5 h-5 text-blue-600" />
            Dalga Etkisi Analizi
          </CardTitle>
          <CardDescription>
            Dalga yüksekliği vs draft analizi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="waveHeight">Dalga Yüksekliği (m)</Label>
              <Input
                id="waveHeight"
                type="number"
                value={waveHeight}
                onChange={(e) => setWaveHeight(e.target.value)}
                placeholder="Dalga yüksekliği"
              />
            </div>
            <div>
              <Label htmlFor="shipDraft">Gemi Drafı (m)</Label>
              <Input
                id="shipDraft"
                type="number"
                value={shipDraft}
                onChange={(e) => setShipDraft(e.target.value)}
                placeholder="Gemi drafı"
              />
            </div>
          </div>
          
          <Button onClick={analyzeWaveImpact} className="w-full">
            Analiz Et
          </Button>

          {waveAnalysis && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Dalga/Draft Oranı:</span>
                  <Badge variant={waveAnalysis.status === 'safe' ? 'default' : 
                                waveAnalysis.status === 'caution' ? 'outline' : 'destructive'}>
                    {waveAnalysis.ratio.toFixed(2)}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Etki:</span>
                  <span className="ml-2">{waveAnalysis.impact}</span>
                </div>
                <div>
                  <span className="font-medium">Öneri:</span>
                  <p className="mt-1 text-muted-foreground">{waveAnalysis.recommendation}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Storm Avoidance */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CloudRain className="w-5 h-5 text-orange-500" />
            Fırtına Kaçınma Rotası
          </CardTitle>
          <CardDescription>
            Fırtına kaçınma manevra hesabı
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stormCourse">Mevcut Rota (°)</Label>
              <Input
                id="stormCourse"
                type="number"
                value={stormCourse}
                onChange={(e) => setStormCourse(e.target.value)}
                placeholder="0-360°"
              />
            </div>
            <div>
              <Label htmlFor="stormSpeed">Mevcut Hız (knot)</Label>
              <Input
                id="stormSpeed"
                type="number"
                value={stormSpeed}
                onChange={(e) => setStormSpeed(e.target.value)}
                placeholder="Hız"
              />
            </div>
          </div>
          
          <Button onClick={calculateStormAvoidance} className="w-full">
            Kaçınma Rotası Hesapla
          </Button>

          {avoidanceRoute && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Mevcut Rota:</span>
                    <span className="ml-2">{avoidanceRoute.originalCourse}°</span>
                  </div>
                  <div>
                    <span className="font-medium">Kaçınma Rotası:</span>
                    <span className="ml-2 text-green-600 font-bold">{avoidanceRoute.avoidanceCourse}°</span>
                  </div>
                  <div>
                    <span className="font-medium">Manevra:</span>
                    <span className="ml-2">{avoidanceRoute.maneuver}</span>
                  </div>
                  <div>
                    <span className="font-medium">Önerilen Hız:</span>
                    <span className="ml-2">{avoidanceRoute.recommendedSpeed.toFixed(1)} knot</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Hız Azaltma:</strong> %{avoidanceRoute.speedReduction}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};