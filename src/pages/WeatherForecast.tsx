import React, { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Thermometer, Wind, CloudRain, Compass } from "lucide-react";
import { useWeatherForecast } from "@/hooks/useWeatherForecast";
import { useCurrentWeather } from "@/hooks/useCurrentWeather";

function wmoToEmoji(code?: number): string {
  switch (code) {
    case 0: return "☀️";
    case 1: return "🌤️";
    case 2: return "⛅";
    case 3: return "☁️";
    case 45:
    case 48: return "🌫️";
    case 51:
    case 53:
    case 55: return "🌦️";
    case 56:
    case 57: return "🌨️";
    case 61:
    case 63:
    case 65: return "🌧️";
    case 66:
    case 67: return "🌨️";
    case 71:
    case 73:
    case 75: return "❄️";
    case 77: return "🌨️";
    case 80:
    case 81:
    case 82: return "🌦️";
    case 85:
    case 86: return "❄️";
    case 95: return "⛈️";
    case 96:
    case 99: return "⛈️";
    default: return "❓";
  }
}

function wmoToTr(code?: number): string {
  switch (code) {
    case 0: return "Açık";
    case 1: return "Az bulutlu";
    case 2: return "Parçalı bulutlu";
    case 3: return "Kapalı";
    case 45:
    case 48: return "Sis";
    case 51:
    case 53:
    case 55: return "Çiseleme";
    case 56:
    case 57: return "Donan çiseleme";
    case 61:
    case 63:
    case 65: return "Yağmur";
    case 66:
    case 67: return "Donan yağmur";
    case 71:
    case 73:
    case 75: return "Kar";
    case 77: return "Kar taneleri";
    case 80:
    case 81:
    case 82: return "Sağanak yağmur";
    case 85:
    case 86: return "Kar sağanağı";
    case 95: return "Gök gürültülü fırtına";
    case 96:
    case 99: return "Dolu fırtınası";
    default: return "Belirsiz";
  }
}

function degreesToCompass(degrees: number): string {
  if (Number.isNaN(degrees)) return "-";
  const directions = ["K", "KKD", "KD", "DKD", "D", "DGD", "GD", "GGD", "G", "GGB", "GB", "BGB", "B", "BKB", "KB", "KKB"];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export default function WeatherForecast() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { locationLabel } = useCurrentWeather();
  
  const lat = Number(searchParams.get('lat'));
  const lon = Number(searchParams.get('lon'));
  const selectedLocationName = searchParams.get('location');
  
  const { loading, error, data } = useWeatherForecast(lat, lon);

  const dayNames = useMemo(() => {
    return ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  }, []);

  const formatDate = (dateStr: string, index: number) => {
    const date = new Date(dateStr);
    const dayName = dayNames[date.getDay()];
    if (index === 0) return "Bugün";
    if (index === 1) return "Yarın";
    return `${dayName} ${date.getDate()}/${date.getMonth() + 1}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-card p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri
          </Button>
          <h1 className="text-2xl font-bold text-foreground">5 Günlük Hava Tahmini</h1>
          <div></div>
        </div>

        {/* Location Info */}
        <Card className="border-border/20 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {selectedLocationName || locationLabel || "Konum bilgisi alınıyor..."}
              </h2>
              <p className="text-sm text-muted-foreground">
                {Number.isFinite(lat) && Number.isFinite(lon) 
                  ? `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`
                  : "Koordinat bilgisi alınıyor..."
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Forecast Content */}
        {loading ? (
          <Card className="border-border/20 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                <div className="relative">
                  <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                </div>
                <p className="text-muted-foreground">Hava tahmini yükleniyor...</p>
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border-destructive/20 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-destructive font-semibold mb-2">Hava tahmini alınamadı</p>
                <p className="text-muted-foreground text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : data ? (
          <div className="grid gap-4">
            {data.daily.map((day, index) => (
              <Card key={day.date} className={`border-border/20 shadow-lg transition-all duration-300 hover:shadow-xl ${index === 0 ? 'ring-2 ring-primary/20' : ''}`}>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                    {/* Date & Weather */}
                    <div className="text-center md:text-left">
                      <h3 className="font-semibold text-lg text-foreground mb-1">
                        {formatDate(day.date, index)}
                      </h3>
                      <div className="flex items-center justify-center md:justify-start gap-3">
                        <span className="text-3xl">{wmoToEmoji(day.weatherCode)}</span>
                        <div>
                          <p className="font-medium text-foreground">{wmoToTr(day.weatherCode)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(day.date).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Temperature */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Thermometer className="h-5 w-5 text-info" />
                        <span className="text-sm font-medium text-muted-foreground">Sıcaklık</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xl font-bold text-foreground">
                          {Number.isFinite(day.temperatureMax) ? `${Math.round(day.temperatureMax)}°` : "-"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Min: {Number.isFinite(day.temperatureMin) ? `${Math.round(day.temperatureMin)}°` : "-"}
                        </p>
                      </div>
                    </div>

                    {/* Wind */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Wind className="h-5 w-5 text-success" />
                        <span className="text-sm font-medium text-muted-foreground">Rüzgar</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-foreground">
                          {Number.isFinite(day.windSpeedMax) ? `${Math.round(day.windSpeedMax)} kt` : "-"}
                        </p>
                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                          <Compass className="h-3 w-3" style={{ transform: `rotate(${day.windDirection || 0}deg)` }} />
                          <span>{degreesToCompass(day.windDirection)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Precipitation */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <CloudRain className="h-5 w-5 text-accent" />
                        <span className="text-sm font-medium text-muted-foreground">Yağış</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-foreground">
                          {day.precipitationSum > 0 ? `${day.precipitationSum.toFixed(1)} mm` : "Yok"}
                        </p>
                        <p className="text-xs text-muted-foreground">Toplam</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}