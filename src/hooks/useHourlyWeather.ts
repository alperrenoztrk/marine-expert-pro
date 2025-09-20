import { useState, useCallback } from "react";

export type HourlyWeatherData = {
  time: string;
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  humidity: number;
  pressure: number;
};

export type HourlyWeatherResponse = {
  latitude: number;
  longitude: number;
  hourly: HourlyWeatherData[];
};

export function useHourlyWeather() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<HourlyWeatherResponse | null>(null);

  const fetchHourlyWeather = useCallback(async (latitude: number, longitude: number, date: string) => {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const url = new URL("https://api.open-meteo.com/v1/forecast");
      url.searchParams.set("latitude", String(latitude));
      url.searchParams.set("longitude", String(longitude));
      url.searchParams.set(
        "hourly",
        [
          "temperature_2m",
          "weather_code",
          "wind_speed_10m",
          "wind_direction_10m",
          "precipitation",
          "relative_humidity_2m",
          "pressure_msl",
        ].join(",")
      );
      url.searchParams.set("wind_speed_unit", "kn");
      url.searchParams.set("timezone", "auto");
      url.searchParams.set("start_date", date);
      url.searchParams.set("end_date", date);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`Saatlik hava tahmini alınamadı (${res.status})`);
      
      const json = await res.json();
      const hourly = json.hourly || {};
      
      const hourlyData: HourlyWeatherResponse = {
        latitude: json.latitude,
        longitude: json.longitude,
        hourly: (hourly.time || []).map((time: string, index: number) => ({
          time,
          temperature: hourly.temperature_2m?.[index] ?? NaN,
          weatherCode: hourly.weather_code?.[index] ?? -1,
          windSpeed: hourly.wind_speed_10m?.[index] ?? NaN,
          windDirection: hourly.wind_direction_10m?.[index] ?? NaN,
          precipitation: hourly.precipitation?.[index] ?? 0,
          humidity: hourly.relative_humidity_2m?.[index] ?? NaN,
          pressure: hourly.pressure_msl?.[index] ?? NaN,
        }))
      };
      
      setData(hourlyData);
    } catch (e: any) {
      const message = e?.message || "Bilinmeyen hata";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, data, fetchHourlyWeather };
}