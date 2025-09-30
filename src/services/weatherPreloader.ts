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

export type PreloadedWeatherData = {
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
  locationLabel?: string;
  sunriseIso?: string;
  sunsetIso?: string;
};

class WeatherPreloader {
  private static instance: WeatherPreloader;
  private preloadedData: PreloadedWeatherData | null = null;
  private preloadError: string | null = null;
  private isPreloading: boolean = false;
  private preloadPromise: Promise<PreloadedWeatherData | null> | null = null;

  static getInstance(): WeatherPreloader {
    if (!WeatherPreloader.instance) {
      WeatherPreloader.instance = new WeatherPreloader();
    }
    return WeatherPreloader.instance;
  }

  async preloadWeatherData(): Promise<PreloadedWeatherData | null> {
    if (this.preloadPromise) {
      return this.preloadPromise;
    }

    this.preloadPromise = this.doPreload();
    return this.preloadPromise;
  }

  private async doPreload(): Promise<PreloadedWeatherData | null> {
    if (this.isPreloading) return this.preloadedData;
    
    this.isPreloading = true;
    this.preloadError = null;
    
    console.log("🌤️ [Preloader] Splash screen sırasında hava durumu verisi alınıyor...");
    
    try {
      // Get current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        console.log("📍 [Preloader] Konum servisi kontrol ediliyor...");
        if (!("geolocation" in navigator)) {
          console.error("❌ [Preloader] Konum servisi desteklenmiyor");
          reject(new Error("Konum servisi desteklenmiyor"));
          return;
        }
        
        console.log("📍 [Preloader] Konum bilgisi isteniyor...");
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            console.log("✅ [Preloader] Konum alındı:", pos.coords.latitude, pos.coords.longitude);
            resolve(pos);
          },
          (err) => {
            console.error("❌ [Preloader] Konum alınamadı:", err.message);
            reject(err);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 600000 }
        );
      });

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      console.log("🌤️ [Preloader] Hava durumu ve konum verisi paralel olarak alınıyor...");
      
      // Fetch weather and location data in parallel
      const [weatherResult, locationResult] = await Promise.allSettled([
        this.fetchWeather(lat, lon),
        this.fetchLocationLabel(lat, lon)
      ]);

      let weatherData: PreloadedWeatherData | null = null;
      let locationLabel: string | null = null;

      if (weatherResult.status === 'fulfilled') {
        weatherData = weatherResult.value;
      } else {
        console.error("❌ [Preloader] Hava durumu alınamadı:", weatherResult.reason);
      }

      if (locationResult.status === 'fulfilled') {
        locationLabel = locationResult.value;
      } else {
        console.warn("⚠️ [Preloader] Konum etiketi alınamadı:", locationResult.reason);
      }

      if (weatherData) {
        this.preloadedData = {
          ...weatherData,
          locationLabel: locationLabel || undefined
        };
        console.log("✅ [Preloader] Hava durumu verisi başarıyla preload edildi");
        return this.preloadedData;
      } else {
        throw new Error("Hava durumu verisi alınamadı");
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Bilinmeyen hata";
      console.error("❌ [Preloader] Hava durumu preload hatası:", message);
      this.preloadError = message;
      return null;
    } finally {
      this.isPreloading = false;
    }
  }

  private async fetchWeather(lat: number, lon: number) {
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
    
    return {
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
    };
  }

  private async fetchLocationLabel(lat: number, lon: number): Promise<string | null> {
    try {
      const reverseUrl = new URL("https://api.bigdatacloud.net/data/reverse-geocode-client");
      reverseUrl.searchParams.set("latitude", String(lat));
      reverseUrl.searchParams.set("longitude", String(lon));
      reverseUrl.searchParams.set("localityLanguage", "tr");
      const res = await fetch(reverseUrl.toString());
      if (!res.ok) return null;
      const reverseJson = (await res.json()) as BigDataCloudReverse;
      
      // Check for sea/ocean areas first
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
      
      // Get city/location info - prioritize more specific info
      let cityLikeName: string | undefined;
      if (reverseJson.city && reverseJson.locality && reverseJson.city !== reverseJson.locality) {
        cityLikeName = `${reverseJson.locality}, ${reverseJson.city}`;
      } else {
        cityLikeName = reverseJson.city || reverseJson.locality || reverseJson.principalSubdivision || reverseJson.countryName;
      }
      
      return seaLikeName || cityLikeName || null;
    } catch {
      return null;
    }
  }

  getPreloadedData(): PreloadedWeatherData | null {
    return this.preloadedData;
  }

  getPreloadError(): string | null {
    return this.preloadError;
  }

  isPreloadComplete(): boolean {
    return !this.isPreloading && (this.preloadedData !== null || this.preloadError !== null);
  }

  clearPreloadedData(): void {
    this.preloadedData = null;
    this.preloadError = null;
    this.preloadPromise = null;
  }
}

export const weatherPreloader = WeatherPreloader.getInstance();