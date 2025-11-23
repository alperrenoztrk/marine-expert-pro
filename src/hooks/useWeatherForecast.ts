import { useState, useEffect, useCallback } from "react";

export type ForecastDay = {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  weatherCode: number;
  precipitationSum: number;
  windSpeedMax: number;
  windDirection: number;
};

export type HourlyData = {
  time: string;
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  weatherCode: number;
};

export type WeatherForecast = {
  latitude: number;
  longitude: number;
  daily: ForecastDay[];
};

export function useWeatherForecast(lat?: number, lon?: number) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WeatherForecast | null>(null);

  const fetchForecast = useCallback(async (latitude: number, longitude: number) => {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const forecastUrl = new URL("https://api.open-meteo.com/v1/forecast");
      forecastUrl.searchParams.set("latitude", String(latitude));
      forecastUrl.searchParams.set("longitude", String(longitude));
      forecastUrl.searchParams.set(
        "daily",
        [
          "temperature_2m_max",
          "temperature_2m_min", 
          "weather_code",
          "precipitation_sum",
          "wind_speed_10m_max",
          "wind_direction_10m_dominant",
        ].join(",")
      );
      forecastUrl.searchParams.set("wind_speed_unit", "kn");
      forecastUrl.searchParams.set("timezone", "auto");
      forecastUrl.searchParams.set("forecast_days", "5");

      const res = await fetch(forecastUrl.toString());
      if (!res.ok) throw new Error(`Hava tahmini alınamadı (${res.status})`);
      
      const json = await res.json();
      const daily = json.daily || {};
      
      const forecastData: WeatherForecast = {
        latitude: json.latitude,
        longitude: json.longitude,
        daily: (daily.time || []).map((date: string, index: number) => ({
          date,
          temperatureMax: daily.temperature_2m_max?.[index] ?? NaN,
          temperatureMin: daily.temperature_2m_min?.[index] ?? NaN,
          weatherCode: daily.weather_code?.[index] ?? -1,
          precipitationSum: daily.precipitation_sum?.[index] ?? 0,
          windSpeedMax: daily.wind_speed_10m_max?.[index] ?? NaN,
          windDirection: daily.wind_direction_10m_dominant?.[index] ?? NaN,
        }))
      };
      
      setData(forecastData);
    } catch (e: any) {
      const message = e?.message || "Bilinmeyen hata";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (lat && lon) {
      fetchForecast(lat, lon);
    }
  }, [lat, lon, fetchForecast]);

  return { loading, error, data, refetch: () => lat && lon && fetchForecast(lat, lon) };
}

// Saatlik hava durumu tahmini için yeni hook
export function useHourlyForecast(lat?: number, lon?: number, targetDate?: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<HourlyData[] | null>(null);

  const fetchHourlyForecast = useCallback(async (latitude: number, longitude: number, date: string) => {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || !date) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const forecastUrl = new URL("https://api.open-meteo.com/v1/forecast");
      forecastUrl.searchParams.set("latitude", String(latitude));
      forecastUrl.searchParams.set("longitude", String(longitude));
      forecastUrl.searchParams.set(
        "hourly",
        [
          "temperature_2m",
          "relative_humidity_2m",
          "precipitation",
          "wind_speed_10m",
          "weather_code",
        ].join(",")
      );
      forecastUrl.searchParams.set("wind_speed_unit", "kn");
      forecastUrl.searchParams.set("timezone", "auto");
      forecastUrl.searchParams.set("start_date", date);
      forecastUrl.searchParams.set("end_date", date);

      const res = await fetch(forecastUrl.toString());
      if (!res.ok) throw new Error(`Saatlik hava tahmini alınamadı (${res.status})`);
      
      const json = await res.json();
      const hourly = json.hourly || {};
      
      const hourlyData: HourlyData[] = (hourly.time || []).map((time: string, index: number) => ({
        time,
        temperature: hourly.temperature_2m?.[index] ?? NaN,
        humidity: hourly.relative_humidity_2m?.[index] ?? NaN,
        precipitation: hourly.precipitation?.[index] ?? 0,
        windSpeed: hourly.wind_speed_10m?.[index] ?? NaN,
        weatherCode: hourly.weather_code?.[index] ?? -1,
      }));
      
      setData(hourlyData);
    } catch (e: any) {
      const message = e?.message || "Bilinmeyen hata";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (lat && lon && targetDate) {
      fetchHourlyForecast(lat, lon, targetDate);
    }
  }, [lat, lon, targetDate, fetchHourlyForecast]);

  return { loading, error, data, refetch: () => lat && lon && targetDate && fetchHourlyForecast(lat, lon, targetDate) };
}