import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Wind, Gauge, Compass, AlertTriangle, MapPin, Clock } from "lucide-react";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WeatherData | null>(null);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState<number>(Date.now());

  const lastPositionRef = useRef<{ lat: number; lon: number } | null>(null);
  const lastReverseRef = useRef<{ lat: number; lon: number; label: string | null } | null>(null);
  const weatherInFlightRef = useRef<boolean>(false);
  const reverseInFlightRef = useRef<boolean>(false);

  function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  // Tick every 1s to refresh time displays (GMT/LMT/ZT)
  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let watchId: number | null = null;
    let intervalId: number | null = null;

    const WEATHER_REFRESH_MS = 120000; // 2 dakika
    const MOVEMENT_WEATHER_THRESHOLD_M = 200; // 200 m hareket edince hava güncellensin
    const MOVEMENT_REVERSE_THRESHOLD_M = 1000; // 1 km hareket edince reverse geocode

    async function fetchWeather(lat: number, lon: number) {
      if (weatherInFlightRef.current) return;
      weatherInFlightRef.current = true;
      try {
        const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
        weatherUrl.searchParams.set("latitude", String(lat));
        weatherUrl.searchParams.set("longitude", String(lon));
        weatherUrl.searchParams.set(
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
        weatherUrl.searchParams.set("wind_speed_unit", "kn");
        weatherUrl.searchParams.set("timezone", "auto");

        const res = await fetch(weatherUrl.toString());
        if (!res.ok) throw new Error(`Hava verisi alınamadı (${res.status})`);
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
          timezoneId: json.timezone,
          utcOffsetSeconds: json.utc_offset_seconds,
        });
      } finally {
        weatherInFlightRef.current = false;
      }
    }

    async function fetchReverse(lat: number, lon: number) {
      if (reverseInFlightRef.current) return;
      reverseInFlightRef.current = true;
      try {
        const reverseUrl = new URL("https://api.bigdatacloud.net/data/reverse-geocode-client");
        reverseUrl.searchParams.set("latitude", String(lat));
        reverseUrl.searchParams.set("longitude", String(lon));
        reverseUrl.searchParams.set("localityLanguage", "tr");
        const res = await fetch(reverseUrl.toString());
        if (!res.ok) return;
        const reverseJson = (await res.json()) as BigDataCloudReverse;
        const informative = reverseJson?.localityInfo?.informative || [];
        const waterPriority = ["sea", "ocean", "gulf", "bay", "strait", "channel", "sound"];
        let seaLikeName: string | undefined;
        for (const keyword of waterPriority) {
          const match = informative.find((x) => (x.description || "").toLowerCase().includes(keyword));
          if (match?.name) { seaLikeName = match.name; break; }
        }
        const cityLikeName = reverseJson.city || reverseJson.locality || reverseJson.principalSubdivision || reverseJson.countryName;
        const label = seaLikeName || cityLikeName || null;
        if (cancelled) return;
        setLocationLabel(label);
        lastReverseRef.current = { lat, lon, label };
      } catch {
        // ignore
      } finally {
        reverseInFlightRef.current = false;
      }
    }

    async function init() {
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
        if (cancelled) return;
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        lastPositionRef.current = { lat, lon };
        await Promise.allSettled([
          fetchWeather(lat, lon),
          fetchReverse(lat, lon),
        ]);
      } catch (e: any) {
        const message = e?.message || "Bilinmeyen hata";
        if (!cancelled) setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    function handleWatch(pos: GeolocationPosition) {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const prev = lastPositionRef.current;
      lastPositionRef.current = { lat, lon };
      if (!prev) {
        fetchWeather(lat, lon);
        fetchReverse(lat, lon);
        return;
      }
      const movedM = haversineMeters(prev.lat, prev.lon, lat, lon);
      if (movedM >= MOVEMENT_WEATHER_THRESHOLD_M) {
        fetchWeather(lat, lon);
      }
      const lastReverse = lastReverseRef.current;
      const needReverse = !lastReverse || haversineMeters(lastReverse.lat, lastReverse.lon, lat, lon) >= MOVEMENT_REVERSE_THRESHOLD_M;
      if (needReverse) {
        fetchReverse(lat, lon);
      }
    }

    init();

    if ("geolocation" in navigator) {
      try {
        watchId = navigator.geolocation.watchPosition(
          handleWatch,
          () => { /* ignore watch errors to avoid UI noise */ },
          { enableHighAccuracy: true, maximumAge: 15000, timeout: 10000 }
        );
      } catch {
        // ignore
      }
    }

    intervalId = window.setInterval(() => {
      const cur = lastPositionRef.current;
      if (!cur) return;
      fetchWeather(cur.lat, cur.lon);
    }, WEATHER_REFRESH_MS);

    return () => {
      cancelled = true;
      if (watchId !== null) {
        try { navigator.geolocation.clearWatch(watchId); } catch {}
      }
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
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

  const localTimeStr = useMemo(() => {
    if (!data?.timezoneId) return null;
    try {
      return new Intl.DateTimeFormat("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: data.timezoneId,
      }).format(nowMs);
    } catch {
      return null;
    }
  }, [data?.timezoneId, nowMs]);

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
                <div className="text-sm text-muted-foreground" data-translatable>Yerel Saat</div>
                <div className="text-base font-medium">
                  {localTimeStr ?? (timeDisplay?.zt ?? "-")}
                  {data?.timezoneId ? (
                    <span className="ml-2 text-xs text-muted-foreground">{data.timezoneId}</span>
                  ) : null}
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

