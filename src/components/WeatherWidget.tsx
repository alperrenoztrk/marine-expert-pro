import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Wind, Gauge, Compass, AlertTriangle, MapPin, Clock } from "lucide-react";
import { useCurrentWeather } from "@/hooks/useCurrentWeather";

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

  // Tick every 1s to refresh time displays (GMT/LMT/ZT)
  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // Weather fetching and reverse geocoding handled by useCurrentWeather hook
  }, []);

  const windCompass = useMemo(() => {
    return degreesToCompass(data?.windDirectionDeg ?? NaN);
  }, [data?.windDirectionDeg]);

  const timeDisplay = useMemo(() => {
    if (!data) return null;
    const utcMs = nowMs; // Date.now() in ms since epoch (UTC epoch)
    const offsetSeconds = data.utcOffsetSeconds ?? 0;
    const ztMs = utcMs + offsetSeconds * 1000;
    const lmtMs = utcMs + (data.longitude ?? 0) * 4 * 60 * 1000; // 4 min per degree
    const fmt = (ms: number) => new Date(ms).toISOString().substring(11, 19); // HH:mm:ss (UTC-based substring)

    // Format ZD = hours to add to ZT to get GMT => ZD = -offset
    const zdTotalMinutes = Math.round((-offsetSeconds) / 60);
    const sign = zdTotalMinutes >= 0 ? "+" : "-";
    const absMin = Math.abs(zdTotalMinutes);
    const zdHours = Math.floor(absMin / 60);
    const zdMins = absMin % 60;
    const zdStr = `${sign}${String(zdHours).padStart(2, "0")}:${String(zdMins).padStart(2, "0")}`;

    return {
      gmt: fmt(utcMs),
      zt: fmt(ztMs),
      lmt: fmt(lmtMs),
      zd: zdStr,
    } as const;
  }, [data, nowMs]);

  const nationalTimeStr = useMemo(() => {
    // Turkey National Time (UTC+3 year-round)
    try {
      return new Intl.DateTimeFormat("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Europe/Istanbul",
      }).format(nowMs);
    } catch {
      return null;
    }
  }, [nowMs]);

  return (
    <Card className="w-full shadow-lg bg-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg" data-translatable>
          Anlık Hava Durumu
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {loading ? (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span data-translatable>Konum ve hava verisi alınıyor...</span>
          </div>
        ) : error ? (
          <div className="flex items-start gap-3 text-sm text-red-600">
            <AlertTriangle className="h-5 w-5 mt-0.5" />
            <div>
              <div className="font-semibold" data-translatable>Hava verisi alınamadı</div>
              <div className="text-muted-foreground" data-translatable>{error}</div>
            </div>
          </div>
        ) : data ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex items-center gap-3">
              <MapPin className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-sm text-muted-foreground" data-translatable>Konum</div>
                <div className="text-base font-medium">{locationLabel ?? "Bilinmiyor"}</div>
              </div>
              <div className="ml-auto text-xs text-muted-foreground">
                {Number.isFinite(data.latitude) && Number.isFinite(data.longitude)
                  ? `${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}`
                  : null}
              </div>
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <Clock className="h-5 w-5 text-indigo-600" />
              <div>
                <div className="text-sm text-muted-foreground" data-translatable>Ulusal Saat</div>
                <div className="text-base font-medium">
                  {nationalTimeStr ?? "-"}
                  <span className="ml-2 text-xs text-muted-foreground">TRT (UTC+3)</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Thermometer className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-sm text-muted-foreground" data-translatable>Sıcaklık</div>
                <div className="text-base font-medium">{Number.isFinite(data.temperatureC) ? `${data.temperatureC.toFixed(1)} °C` : "-"}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Droplets className="h-5 w-5 text-cyan-600" />
              <div>
                <div className="text-sm text-muted-foreground" data-translatable>Nem</div>
                <div className="text-base font-medium">{Number.isFinite(data.humidityPct) ? `${Math.round(data.humidityPct)} %` : "-"}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Gauge className="h-5 w-5 text-amber-600" />
              <div>
                <div className="text-sm text-muted-foreground" data-translatable>Basınç (hPa)</div>
                <div className="text-base font-medium">{Number.isFinite(data.pressureHpa) ? `${Math.round(data.pressureHpa)}` : "-"}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Wind className="h-5 w-5 text-emerald-600" />
              <div>
                <div className="text-sm text-muted-foreground" data-translatable>Rüzgar</div>
                <div className="text-base font-medium">
                  {Number.isFinite(data.windSpeedKt) ? `${data.windSpeedKt.toFixed(0)} kt` : "-"}
                  {Number.isFinite(data.windDirectionDeg) && (
                    <span className="ml-2 inline-flex items-center gap-1 text-muted-foreground">
                      <Compass className="h-4 w-4" style={{ transform: `rotate(${data.windDirectionDeg}deg)` }} />
                      <span>{windCompass} ({Math.round(data.windDirectionDeg)}°)</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-2 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <div>
                <div className="text-sm text-muted-foreground" data-translatable>Durum</div>
                <div className="text-base font-medium">{wmoToTr(data.weatherCode)}</div>
              </div>
              <div className="ml-auto text-xs text-muted-foreground">
                {data.timeIso ? new Date(data.timeIso).toLocaleTimeString() : null}
              </div>
            </div>

            {/* Timezone block: GMT / LMT / ZT / ZD */}
            {timeDisplay && (
              <div className="col-span-2 grid grid-cols-4 gap-3 text-xs">
                <div className="flex flex-col items-start">
                  <span className="text-muted-foreground">GMT</span>
                  <span className="font-medium">{timeDisplay.gmt}</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-muted-foreground">LMT</span>
                  <span className="font-medium">{timeDisplay.lmt}</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-muted-foreground">ZT</span>
                  <span className="font-medium">{timeDisplay.zt}</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-muted-foreground">ZD</span>
                  <span className="font-medium">{timeDisplay.zd}</span>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

