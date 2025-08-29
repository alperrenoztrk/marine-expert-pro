import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Wind, Gauge, Compass, AlertTriangle } from "lucide-react";

type WeatherResponse = {
  latitude: number;
  longitude: number;
  timezone?: string;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WeatherData | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function getWeather() {
      setLoading(true);
      setError(null);
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!("geolocation" in navigator)) {
            reject(new Error("Konum servisi desteklenmiyor"));
            return;
          }
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos),
            (err) => reject(err),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
          );
        });

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const url = new URL("https://api.open-meteo.com/v1/forecast");
        url.searchParams.set("latitude", String(lat));
        url.searchParams.set("longitude", String(lon));
        url.searchParams.set(
          "current",
          [
            "temperature_2m",
            "relative_humidity_2m",
            "pressure_msl",
            "wind_speed_10m",
            "wind_direction_10m",
            "weather_code",
          ].join(",")
        );
        url.searchParams.set("wind_speed_unit", "kn");
        url.searchParams.set("timezone", "auto");

        const res = await fetch(url.toString());
        if (!res.ok) {
          throw new Error(`Hava verisi alınamadı (${res.status})`);
        }
        const json = (await res.json()) as WeatherResponse;
        const cur = json.current ?? {};

        if (cancelled) return;

        setData({
          temperatureC: cur.temperature_2m ?? NaN,
          humidityPct: cur.relative_humidity_2m ?? NaN,
          pressureHpa: (cur.pressure_msl ?? cur.surface_pressure ?? NaN),
          windSpeedKt: cur.wind_speed_10m ?? NaN,
          windDirectionDeg: cur.wind_direction_10m ?? NaN,
          weatherCode: cur.weather_code ?? -1,
          timeIso: cur.time,
          latitude: json.latitude,
          longitude: json.longitude,
        });
      } catch (e: any) {
        const message = e?.message || "Bilinmeyen hata";
        if (!cancelled) setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    getWeather();
    return () => {
      cancelled = true;
    };
  }, []);

  const windCompass = useMemo(() => {
    return degreesToCompass(data?.windDirectionDeg ?? NaN);
  }, [data?.windDirectionDeg]);

  return (
    <Card className="w-full shadow-lg">
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
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

