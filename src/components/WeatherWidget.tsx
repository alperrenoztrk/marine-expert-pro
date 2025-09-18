import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Wind, Gauge, Compass, AlertTriangle, MapPin } from "lucide-react";
import { useCurrentWeather } from "@/hooks/useCurrentWeather";
// Removed analog clock in favor of digital time tiles

type WeatherResponse = {
  latitude: number;
  longitude: number;
  timezone?: string;
  utc_offset_seconds?: number;
  current_units?: Record<string, string>;
  current?: {
    time?: string;
    temperature_2m?: number;
    relative_humidity_2m?: number;
    pressure_msl?: number;
    surface_pressure?: number;
    wind_speed_10m?: number;
    wind_direction_10m?: number;
    weather_code?: number;
  };
};

type WeatherData = {
  temperatureC: number;
  humidityPct: number;
  pressureHpa: number;
  windSpeedKt: number;
  windDirectionDeg: number;
  weatherCode: number;
  timeIso?: string;
  latitude: number;
  longitude: number;
  timezoneId?: string;
  utcOffsetSeconds?: number;
};

type BigDataCloudReverse = {
  latitude?: number;
  longitude?: number;
  locality?: string;
  city?: string;
  principalSubdivision?: string;
  countryName?: string;
  localityInfo?: {
    informative?: Array<{
      name?: string;
      description?: string;
    }>;
  };
};

function degreesToCompass(degrees: number): string {
  if (Number.isNaN(degrees)) return "-";
  const directions = [
    "K", // N - Kuzey
    "KKB", // NNE
    "KB", // NE
    "KDB", // ENE
    "D", // E - Doğu
    "GDB", // ESE
    "GB", // SE
    "GGB", // SSE
    "G", // S - Güney
    "GGB", // SSW (teknik olarak GGD; Türkçe kullanım farklılık gösterebilir)
    "GB", // SW
    "GDB", // WSW
    "B", // W - Batı
    "KDB", // WNW
    "KB", // NW
    "KKB", // NNW
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

function decimalToDMS(decimal: number, isLatitude: boolean = true): string {
  if (!Number.isFinite(decimal)) return "-";
  
  const abs = Math.abs(decimal);
  const degrees = Math.floor(abs);
  const minutesFloat = (abs - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;
  
  let direction: string;
  if (isLatitude) {
    direction = decimal >= 0 ? "K" : "G"; // Kuzey/Güney
  } else {
    direction = decimal >= 0 ? "D" : "B"; // Doğu/Batı
  }
  
  return `${degrees}°${minutes.toString().padStart(2, '0')}'${seconds.toFixed(1).padStart(4, '0')}"${direction}`;
}

function wmoToTr(code?: number): string {
  switch (code) {
    case 0:
      return "Açık";
    case 1:
      return "Az bulutlu";
    case 2:
      return "Parçalı bulutlu";
    case 3:
      return "Kapalı";
    case 45:
    case 48:
      return "Sis";
    case 51:
    case 53:
    case 55:
      return "Çiseleme";
    case 56:
    case 57:
      return "Donan çiseleme";
    case 61:
    case 63:
    case 65:
      return "Yağmur";
    case 66:
    case 67:
      return "Donan yağmur";
    case 71:
    case 73:
    case 75:
      return "Kar";
    case 77:
      return "Kar taneleri";
    case 80:
    case 81:
    case 82:
      return "Sağanak yağmur";
    case 85:
    case 86:
      return "Kar sağanağı";
    case 95:
      return "Gök gürültülü fırtına";
    case 96:
    case 99:
      return "Dolu fırtınası";
    default:
      return "Belirsiz";
  }
}

export default function WeatherWidget() {
  const { loading, error, data, locationLabel } = useCurrentWeather();
  const [nowMs, setNowMs] = useState<number>(Date.now());
  const [loadingTimeout, setLoadingTimeout] = useState<boolean>(false);

  // Tick every 1s to refresh time displays (GMT/LMT/ZT)
  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Loading timeout - eğer 30 saniye sonra hala yüklüyorsa timeout göster
  useEffect(() => {
    if (loading) {
      const timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
      }, 30000);
      return () => clearTimeout(timeoutId);
    } else {
      setLoadingTimeout(false);
    }
  }, [loading]);

  useEffect(() => {
    // Weather fetching and reverse geocoding handled by useCurrentWeather hook
  }, []);

  const windCompass = useMemo(() => {
    return degreesToCompass(data?.windDirectionDeg ?? NaN);
  }, [data?.windDirectionDeg]);

  const analogTimes = useMemo(() => {
    const utcMs = nowMs;
    const offsetSeconds = data?.utcOffsetSeconds ?? 0;
    const ztMs = utcMs + offsetSeconds * 1000;
    const lmtMs = utcMs + (data?.longitude ?? 0) * 4 * 60 * 1000; // 4 min per degree

    const asParts = (ms: number) => {
      const d = new Date(ms);
      return { h: d.getUTCHours(), m: d.getUTCMinutes(), s: d.getUTCSeconds() };
    };

    const gmt = asParts(utcMs);
    const zt = asParts(ztMs);
    const lmt = asParts(lmtMs);
    const trt = (() => {
      try {
        const parts = new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Europe/Istanbul",
        }).formatToParts(utcMs);
        const get = (t: string) => parseInt(parts.find(p => p.type === t)?.value ?? "0", 10);
        return { h: get("hour"), m: get("minute"), s: get("second") };
      } catch {
        return zt;
      }
    })();

    return { gmt, zt, lmt, trt } as const;
  }, [nowMs, data?.utcOffsetSeconds, data?.longitude]);

  return (
    <Card className="w-full relative overflow-hidden border border-border/20 shadow-lg backdrop-blur-sm bg-gradient-to-br from-card/80 via-card/60 to-background/40">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute inset-0 shadow-inner pointer-events-none" />
      <CardContent className="relative pt-6 space-y-6">
        {loading && !loadingTimeout ? (
          <div className="flex flex-col items-center justify-center gap-4 text-sm text-muted-foreground p-8">
            <div className="relative">
              <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <div className="absolute inset-0 animate-ping">
                <svg className="h-8 w-8 text-primary/30" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1"></circle>
                </svg>
              </div>
            </div>
            <div className="text-center">
              <div className="animate-pulse mb-2" data-translatable>Konum ve hava verisi alınıyor...</div>
              <div className="text-xs text-muted-foreground/70" data-translatable>Konum iznini verdiğinizden emin olun</div>
            </div>
          </div>
        ) : loadingTimeout ? (
          <div className="flex flex-col items-center justify-center gap-4 text-sm text-warning p-8 rounded-lg bg-warning/5 border border-warning/20">
            <div className="text-warning text-lg">⏱️</div>
            <div className="text-center">
              <div className="font-semibold mb-2" data-translatable>Yükleme uzun sürüyor</div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div data-translatable>• Konum iznini verdiğinizden emin olun</div>
                <div data-translatable>• Internet bağlantınızı kontrol edin</div>
                <div data-translatable>• Sayfayı yenilemeyi deneyin</div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-start gap-4 text-sm text-destructive p-6 rounded-lg bg-destructive/5 border border-destructive/20">
            <div className="relative">
              <AlertTriangle className="h-6 w-6 mt-0.5 animate-pulse" />
              <div className="absolute inset-0 animate-ping opacity-30">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1" data-translatable>Hava verisi alınamadı</div>
              <div className="text-muted-foreground text-xs" data-translatable>{error}</div>
            </div>
          </div>
        ) : data ? (
          <div className="grid grid-cols-2 gap-4">
            {/* Dijital saatler: TRT, GMT, LMT, ZT */}
            <div className="col-span-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {(() => {
                  const pad2 = (n: number) => n.toString().padStart(2, "0");
                  const fmt = (t: { h: number; m: number; s: number }) => `${pad2(t.h)}:${pad2(t.m)}:${pad2(t.s)}`;
                  const tiles = [
                    { label: "TRT", value: fmt(analogTimes.trt) },
                    { label: "GMT", value: fmt(analogTimes.gmt) },
                    { label: "LMT", value: fmt(analogTimes.lmt) },
                    { label: "ZT", value: fmt(analogTimes.zt) },
                  ] as const;
                   return tiles.map((tile, index) => (
                     <div 
                       key={tile.label} 
                       className="group relative mx-auto flex flex-col items-center rounded-xl bg-gradient-to-br from-card via-card/90 to-background/50 border border-border/30 shadow-lg backdrop-blur-sm px-4 py-3 min-w-[96px] hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
                       style={{
                         animationDelay: `${index * 0.1}s`,
                         animation: 'fadeIn 0.6s ease-out forwards'
                       }}
                     >
                       <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                       <div className="relative z-10">
                         <div className="text-xs font-medium text-muted-foreground mb-1">{tile.label}</div>
                         <div className="font-mono text-xl sm:text-2xl font-semibold tracking-widest tabular-nums text-foreground drop-shadow-sm">{tile.value}</div>
                       </div>
                       <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
                     </div>
                  ));
                })()}
              </div>
            </div>
            <div className="col-span-2 group relative rounded-xl bg-gradient-to-r from-card/80 to-background/60 border border-border/30 p-4 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-4">
                <div className="relative">
                  <MapPin className="h-6 w-6 text-destructive drop-shadow-sm" />
                  <div className="absolute inset-0 animate-pulse opacity-30">
                    <MapPin className="h-6 w-6 text-destructive" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-muted-foreground mb-1" data-translatable>Konum</div>
                  <div className="text-lg font-semibold text-foreground">{locationLabel ?? "Bilinmiyor"}</div>
                </div>
                <div className="text-xs text-muted-foreground font-mono bg-muted/30 px-2 py-1 rounded-md">
                  {Number.isFinite(data.latitude) && Number.isFinite(data.longitude) ? (
                    <div className="space-y-1">
                      <div>{decimalToDMS(data.latitude, true)}</div>
                      <div>{decimalToDMS(data.longitude, false)}</div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="group relative rounded-xl bg-gradient-to-br from-card/80 to-background/60 border border-border/30 p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-info/5 to-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-4">
                <div className="relative">
                  <Thermometer className="h-6 w-6 text-info drop-shadow-sm" />
                  <div className="absolute inset-0 animate-pulse opacity-20">
                    <Thermometer className="h-6 w-6 text-info" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1" data-translatable>Sıcaklık</div>
                  <div className="text-lg font-bold text-foreground">{Number.isFinite(data.temperatureC) ? `${data.temperatureC.toFixed(1)} °C` : "-"}</div>
                </div>
              </div>
            </div>

            <div className="group relative rounded-xl bg-gradient-to-br from-card/80 to-background/60 border border-border/30 p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-4">
                <div className="relative">
                  <Droplets className="h-6 w-6 text-accent drop-shadow-sm" />
                  <div className="absolute inset-0 animate-pulse opacity-20">
                    <Droplets className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1" data-translatable>Nem</div>
                  <div className="text-lg font-bold text-foreground">{Number.isFinite(data.humidityPct) ? `${Math.round(data.humidityPct)} %` : "-"}</div>
                </div>
              </div>
            </div>

            <div className="group relative rounded-xl bg-gradient-to-br from-card/80 to-background/60 border border-border/30 p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-warning/5 to-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-4">
                <div className="relative">
                  <Gauge className="h-6 w-6 text-warning drop-shadow-sm" />
                  <div className="absolute inset-0 animate-pulse opacity-20">
                    <Gauge className="h-6 w-6 text-warning" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1" data-translatable>Basınç (hPa)</div>
                  <div className="text-lg font-bold text-foreground">{Number.isFinite(data.pressureHpa) ? `${Math.round(data.pressureHpa)}` : "-"}</div>
                </div>
              </div>
            </div>

            <div className="group relative rounded-xl bg-gradient-to-br from-card/80 to-background/60 border border-border/30 p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-4">
                <div className="relative">
                  <Wind className="h-6 w-6 text-success drop-shadow-sm" />
                  <div className="absolute inset-0 animate-pulse opacity-20">
                    <Wind className="h-6 w-6 text-success" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-muted-foreground mb-1" data-translatable>Rüzgar</div>
                  <div className="text-lg font-bold text-foreground">
                    {Number.isFinite(data.windSpeedKt) ? `${data.windSpeedKt.toFixed(0)} kt` : "-"}
                    {Number.isFinite(data.windDirectionDeg) && (
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <Compass className="h-4 w-4 transition-transform duration-500" style={{ transform: `rotate(${data.windDirectionDeg}deg)` }} />
                        <span className="font-medium">{windCompass} ({Math.round(data.windDirectionDeg)}°)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-2 group relative rounded-xl bg-gradient-to-r from-card/80 to-background/60 border border-border/30 p-4 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-success/5 to-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-4">
                <div className="relative">
                  <div className="h-3 w-3 rounded-full bg-success animate-pulse shadow-lg shadow-success/30" />
                  <div className="absolute inset-0 h-3 w-3 rounded-full bg-success animate-ping opacity-30" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-muted-foreground mb-1" data-translatable>Durum</div>
                  <div className="text-lg font-semibold text-foreground">{wmoToTr(data.weatherCode)}</div>
                </div>
                <div className="text-xs text-muted-foreground font-mono bg-muted/30 px-3 py-1 rounded-full border">
                  {data.timeIso ? new Date(data.timeIso).toLocaleTimeString() : null}
                </div>
              </div>
            </div>

          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

