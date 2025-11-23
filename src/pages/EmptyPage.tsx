import React, { useRef, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentWeather } from "@/hooks/useCurrentWeather";
import TimeWidgets from "@/components/widgets/TimeWidgets";
import WeatherInfoWidgets from "@/components/widgets/WeatherInfoWidgets";
import LocationCelestialWidgets from "@/components/widgets/LocationCelestialWidgets";
import NavigationWidgets from "@/components/widgets/NavigationWidgets";

const EmptyPage = () => {
  const navigate = useNavigate();
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const { loading, error, data, locationLabel } = useCurrentWeather({
    watchPosition: false,
    refreshMs: 300000,
    reverseGeocode: true,
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    
    const distance = touchEndX.current - touchStartX.current;
    const isRightSwipe = distance > 100;
    
    if (isRightSwipe) {
      navigate('/');
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Utility functions
  const degreesToCompass = (degrees: number): string => {
    const directions = ["K", "KKD", "KD", "DKD", "D", "DGD", "GD", "GGD", "G", "GGB", "GB", "BGB", "B", "BKB", "KB", "KKB"];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const degreesToWindNameTr = (degrees: number): string => {
    const windNames = [
      "Poyraz", "Poyraz-Keşişleme", "Keşişleme", "Keşişleme-Gündoğusu",
      "Gündoğusu", "Gündoğusu-Kıble", "Kıble", "Kıble-Lodos",
      "Lodos", "Lodos-Günbatısı", "Günbatısı", "Günbatısı-Karayel",
      "Karayel", "Karayel-Yıldız", "Yıldız", "Yıldız-Poyraz"
    ];
    const index = Math.round(degrees / 22.5) % 16;
    return windNames[index];
  };

  const decimalToDMS = (decimal: number, isLatitude: boolean = true): string => {
    const absolute = Math.abs(decimal);
    const degrees = Math.floor(absolute);
    const minutesFloat = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesFloat);
    const seconds = ((minutesFloat - minutes) * 60).toFixed(1);
    const direction = isLatitude
      ? (decimal >= 0 ? "K" : "G")
      : (decimal >= 0 ? "D" : "B");
    return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
  };

  const wmoToEmoji = (code?: number): string => {
    if (code === undefined) return "🌡️";
    if (code === 0) return "☀️";
    if (code <= 3) return "⛅";
    if (code <= 48) return "☁️";
    if (code <= 67) return "🌧️";
    if (code <= 77) return "🌨️";
    if (code <= 82) return "🌧️";
    if (code <= 86) return "🌨️";
    if (code >= 95) return "⛈️";
    return "🌡️";
  };

  const wmoToTr = (code?: number): string => {
    if (code === undefined) return "Bilinmiyor";
    if (code === 0) return "Açık";
    if (code <= 3) return "Az Bulutlu";
    if (code <= 48) return "Bulutlu";
    if (code <= 67) return "Yağmurlu";
    if (code <= 77) return "Karlı";
    if (code <= 82) return "Sağanak Yağışlı";
    if (code <= 86) return "Kar Yağışlı";
    if (code >= 95) return "Fırtınalı";
    return "Bilinmiyor";
  };

  // Computed values
  const windCompass = useMemo(
    () => (data?.windDirectionDeg !== undefined ? degreesToCompass(data.windDirectionDeg) : "—"),
    [data?.windDirectionDeg]
  );

  const windNameTr = useMemo(
    () => (data?.windDirectionDeg !== undefined ? degreesToWindNameTr(data.windDirectionDeg) : "—"),
    [data?.windDirectionDeg]
  );

  const latitudeDMS = useMemo(
    () => (data?.latitude !== undefined ? decimalToDMS(data.latitude, true) : "—"),
    [data?.latitude]
  );

  const longitudeDMS = useMemo(
    () => (data?.longitude !== undefined ? decimalToDMS(data.longitude, false) : "—"),
    [data?.longitude]
  );

  const weatherEmoji = useMemo(() => wmoToEmoji(data?.weatherCode), [data?.weatherCode]);
  const weatherDescription = useMemo(() => wmoToTr(data?.weatherCode), [data?.weatherCode]);

  // Time calculations
  const trtOffset = 3;
  const trtTime = useMemo(() => {
    const trt = new Date(currentTime.getTime() + trtOffset * 3600000);
    return trt.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  }, [currentTime]);

  const gmtTime = useMemo(() => {
    return currentTime.toLocaleTimeString("en-GB", { timeZone: "UTC", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  }, [currentTime]);

  const lmtTime = useMemo(() => {
    if (!data?.longitude) return "—";
    const lmtOffset = data.longitude / 15;
    const lmt = new Date(currentTime.getTime() + lmtOffset * 3600000);
    return lmt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  }, [currentTime, data?.longitude]);

  const ztTime = useMemo(() => {
    if (!data?.longitude) return "—";
    const lmtOffset = data.longitude / 15;
    const zt = new Date(currentTime.getTime() + Math.round(lmtOffset) * 3600000);
    return zt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  }, [currentTime, data?.longitude]);

  const sunriseTime = useMemo(() => {
    if (!data?.sunriseIso) return "—";
    const sunrise = new Date(data.sunriseIso);
    return sunrise.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", hour12: false });
  }, [data?.sunriseIso]);

  const sunsetTime = useMemo(() => {
    if (!data?.sunsetIso) return "—";
    const sunset = new Date(data.sunsetIso);
    return sunset.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", hour12: false });
  }, [data?.sunsetIso]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-blue-600">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-red-600 text-center">Hata: {error}</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-white text-blue-600 px-6 py-8 touch-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="container mx-auto max-w-[900px]">
        <Tabs defaultValue="time" className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-6 bg-blue-50">
            <TabsTrigger value="time" className="text-xs sm:text-sm">
              ⏰ Zaman
            </TabsTrigger>
            <TabsTrigger value="weather" className="text-xs sm:text-sm">
              🌤️ Hava
            </TabsTrigger>
            <TabsTrigger value="location" className="text-xs sm:text-sm">
              🌍 Konum
            </TabsTrigger>
            <TabsTrigger value="navigation" className="text-xs sm:text-sm">
              🧭 Pusula
            </TabsTrigger>
          </TabsList>

          <TabsContent value="time" className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">⏰ Zaman Bilgileri</h2>
            <TimeWidgets
              trtTime={trtTime}
              gmtTime={gmtTime}
              lmtTime={lmtTime}
              ztTime={ztTime}
              sunriseTime={sunriseTime}
              sunsetTime={sunsetTime}
            />
          </TabsContent>

          <TabsContent value="weather" className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">🌤️ Hava Durumu</h2>
            <WeatherInfoWidgets
              temperature={data?.temperatureC}
              humidity={data?.humidityPct}
              pressure={data?.pressureHpa}
              windSpeed={data?.windSpeedKt}
              windDirection={data?.windDirectionDeg}
              windCompass={windCompass}
              windNameTr={windNameTr}
              weatherCode={data?.weatherCode}
              weatherEmoji={weatherEmoji}
              weatherDescription={weatherDescription}
            />
          </TabsContent>

          <TabsContent value="location" className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">🌍 Konum & Göksel Cisimler</h2>
            <LocationCelestialWidgets
              locationLabel={locationLabel}
              latitude={data?.latitude}
              longitude={data?.longitude}
              latitudeDMS={latitudeDMS}
              longitudeDMS={longitudeDMS}
            />
          </TabsContent>

          <TabsContent value="navigation" className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">🧭 Navigasyon Araçları</h2>
            <NavigationWidgets />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmptyPage;
