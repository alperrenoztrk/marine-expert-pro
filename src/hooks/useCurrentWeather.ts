import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { weatherPreloader } from "@/services/weatherPreloader";
import { useLocation } from "@/contexts/LocationContext";

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
  daily?: {
    time?: string[];
    sunrise?: string[];
    sunset?: string[];
  };
};

export type WeatherData = {
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
  sunriseIso?: string;
  sunsetIso?: string;
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

export type UseCurrentWeatherOptions = {
  watchPosition?: boolean;
  refreshMs?: number;
  reverseGeocode?: boolean;
  movementWeatherThresholdM?: number;
  movementReverseThresholdM?: number;
};

export function useCurrentWeather(options: UseCurrentWeatherOptions = {}) {
  const {
    watchPosition = true,
    refreshMs = 120000,
    reverseGeocode = true,
    movementWeatherThresholdM = 200,
    movementReverseThresholdM = 1000,
  } = options;

  const { selectedLocation } = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WeatherData | null>(null);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);

  const lastPositionRef = useRef<{ lat: number; lon: number } | null>(null);
  const lastReverseRef = useRef<{ lat: number; lon: number; label: string | null } | null>(null);
  const weatherInFlightRef = useRef<boolean>(false);
  const reverseInFlightRef = useRef<boolean>(false);

  const haversineMeters = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }, []);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
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
      weatherUrl.searchParams.set(
        "daily",
        [
          "sunrise",
          "sunset",
        ].join(",")
      );
      weatherUrl.searchParams.set("forecast_days", "1");
      weatherUrl.searchParams.set("wind_speed_unit", "kn");
      weatherUrl.searchParams.set("timezone", "auto");

      const res = await fetch(weatherUrl.toString());
      if (!res.ok) throw new Error(`Hava verisi alınamadı (${res.status})`);
      const json = (await res.json()) as WeatherResponse;
      const cur = json.current ?? {};
      const sunriseIso = json.daily?.sunrise?.[0];
      const sunsetIso = json.daily?.sunset?.[0];
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
        sunriseIso,
        sunsetIso,
      });
    } finally {
      weatherInFlightRef.current = false;
    }
  }, []);

  const fetchReverse = useCallback(async (lat: number, lon: number) => {
    if (!reverseGeocode) return;
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
      
      // Önce deniz/okyanus gibi su alanlarını kontrol et
      const informative = reverseJson?.localityInfo?.informative || [];
      const waterKeywords = ["sea", "ocean", "gulf", "bay", "strait", "channel", "sound", "deniz", "okyanus", "körfez"];
      let seaLikeName: string | undefined;
      
      for (const keyword of waterKeywords) {
        const match = informative.find((x) => {
          const desc = (x.description || "").toLowerCase();
          const name = (x.name || "").toLowerCase();
          return desc.includes(keyword) || name.includes(keyword);
        });
        if (match?.name && !match.name.includes("Türkiye") && !match.name.includes("Turkey")) {
          seaLikeName = match.name;
          break;
        }
      }
      
      // Şehir/konum bilgisini al - daha spesifik bilgiyi önce göster
      let cityLikeName: string | undefined;
      if (reverseJson.city && reverseJson.locality && reverseJson.city !== reverseJson.locality) {
        // Eğer şehir ve mahalle farklıysa, ikisini birlikte göster
        cityLikeName = `${reverseJson.locality}, ${reverseJson.city}`;
      } else {
        // Tek bir bilgi varsa onu göster, yoksa hiyerarşik sırala
        cityLikeName = reverseJson.city || reverseJson.locality || reverseJson.principalSubdivision || reverseJson.countryName;
      }
      
      const label = seaLikeName || cityLikeName || null;
      setLocationLabel(label);
      lastReverseRef.current = { lat, lon, label };
    } catch (_err) {
      console.debug("Reverse geocoding failed (ignored)");
    } finally {
      reverseInFlightRef.current = false;
    }
  }, [reverseGeocode]);

  const handleWatch = useCallback((pos: GeolocationPosition) => {
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
    if (movedM >= movementWeatherThresholdM) {
      fetchWeather(lat, lon);
    }
    const lastReverse = lastReverseRef.current;
    const needReverse = !lastReverse || haversineMeters(lastReverse.lat, lastReverse.lon, lat, lon) >= movementReverseThresholdM;
    if (needReverse) {
      fetchReverse(lat, lon);
    }
  }, [fetchReverse, fetchWeather, haversineMeters, movementReverseThresholdM, movementWeatherThresholdM]);

  const requestOnce = useCallback(async () => {
    console.log("🌤️ Hava durumu verisi alınmaya başlandı...");
    
    // Check if we have preloaded data first
    const preloadedData = weatherPreloader.getPreloadedData();
    if (preloadedData) {
      console.log("✅ Preload edilmiş hava durumu verisi kullanılıyor");
      setData({
        temperatureC: preloadedData.temperatureC,
        humidityPct: preloadedData.humidityPct,
        pressureHpa: preloadedData.pressureHpa,
        windSpeedKt: preloadedData.windSpeedKt,
        windDirectionDeg: preloadedData.windDirectionDeg,
        weatherCode: preloadedData.weatherCode,
        timeIso: preloadedData.timeIso,
        latitude: preloadedData.latitude,
        longitude: preloadedData.longitude,
        timezoneId: preloadedData.timezoneId,
        utcOffsetSeconds: preloadedData.utcOffsetSeconds,
        sunriseIso: preloadedData.sunriseIso,
        sunsetIso: preloadedData.sunsetIso,
      });
      if (preloadedData.locationLabel) {
        setLocationLabel(preloadedData.locationLabel);
      }
      lastPositionRef.current = { lat: preloadedData.latitude, lon: preloadedData.longitude };
      setLoading(false);
      
      // Clear preloaded data since we've used it
      weatherPreloader.clearPreloadedData();
      return dataRef.current;
    }

    const preloadError = weatherPreloader.getPreloadError();
    if (preloadError) {
      console.log("⚠️ Preload hatası mevcut, normal yükleme yapılıyor:", preloadError);
    }
    
    setLoading(true);
    setError(null);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        console.log("📍 Konum servisi kontrol ediliyor...");
        if (!("geolocation" in navigator)) {
          console.error("❌ Konum servisi desteklenmiyor");
          reject(new Error("Konum servisi desteklenmiyor"));
          return;
        }
        console.log("📍 Konum bilgisi isteniyor...");
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            console.log("✅ Konum alındı:", pos.coords.latitude, pos.coords.longitude);
            resolve(pos);
          },
          (err) => {
            console.error("❌ Konum alınamadı:", err.message);
            reject(err);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 600000 }
        );
      });
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      lastPositionRef.current = { lat, lon };
      console.log("🌤️ Hava durumu ve konum verisi alınıyor...");
      await Promise.allSettled([
        fetchWeather(lat, lon),
        fetchReverse(lat, lon),
      ]);
      console.log("✅ Hava durumu verisi başarıyla alındı");
      return dataRef.current;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Bilinmeyen hata";
      console.error("❌ Hava durumu hatası:", message);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchReverse, fetchWeather]);

  const dataRef = useRef<WeatherData | null>(null);
  useEffect(() => { dataRef.current = data; }, [data]);

  useEffect(() => {
    let watchId: number | null = null;
    let intervalId: number | null = null;
    let cancelled = false;

    // Eğer selectedLocation varsa, onu kullan
    if (selectedLocation) {
      (async () => {
        if (cancelled) return;
        setLoading(true);
        lastPositionRef.current = { lat: selectedLocation.latitude, lon: selectedLocation.longitude };
        setLocationLabel(selectedLocation.locationLabel);
        await fetchWeather(selectedLocation.latitude, selectedLocation.longitude);
        setLoading(false);
      })();

      // Periyodik refresh için interval
      intervalId = window.setInterval(() => {
        if (selectedLocation) {
          fetchWeather(selectedLocation.latitude, selectedLocation.longitude);
        }
      }, refreshMs);

      return () => {
        cancelled = true;
        if (intervalId !== null) {
          clearInterval(intervalId);
        }
      };
    }

    // selectedLocation yoksa, GPS kullan
    (async () => {
      if (cancelled) return;
      await requestOnce();
    })();

    if (watchPosition && "geolocation" in navigator) {
      try {
        watchId = navigator.geolocation.watchPosition(
          handleWatch,
          () => { /* ignore watch errors */ },
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
    }, refreshMs);

    return () => {
      cancelled = true;
      if (watchId !== null) {
        try { navigator.geolocation.clearWatch(watchId); } catch (_err) { console.debug("clearWatch failed (ignored)"); }
      }
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [fetchWeather, handleWatch, refreshMs, watchPosition, requestOnce, selectedLocation]);

  const refresh = useCallback(() => {
    const cur = lastPositionRef.current;
    if (!cur) return requestOnce();
    return fetchWeather(cur.lat, cur.lon);
  }, [fetchWeather, requestOnce]);

  return useMemo(() => ({
    loading,
    error,
    data,
    locationLabel,
    refresh,
    requestOnce,
  }), [data, error, loading, locationLabel, refresh, requestOnce]);
}

