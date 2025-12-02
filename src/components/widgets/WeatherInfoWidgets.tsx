import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Thermometer, Droplets, Gauge, Wind } from "lucide-react";
import { useWeatherForecast, useHourlyForecast } from "@/hooks/useWeatherForecast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface WeatherInfoWidgetsProps {
  temperature?: number;
  humidity?: number;
  pressure?: number;
  windSpeed?: number;
  windDirection?: number;
  windCompass: string;
  windNameTr: string;
  weatherCode?: number;
  weatherEmoji: string;
  weatherDescription: string;
  latitude?: number;
  longitude?: number;
}

const WeatherInfoWidgets: React.FC<WeatherInfoWidgetsProps> = ({
  temperature,
  humidity,
  pressure,
  windSpeed,
  windDirection,
  windCompass,
  windNameTr,
  weatherCode,
  weatherEmoji,
  weatherDescription,
  latitude,
  longitude,
}) => {
  const [windFlipped, setWindFlipped] = useState(false);
  const [forecastOpen, setForecastOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hourlyDialogOpen, setHourlyDialogOpen] = useState(false);
  
  const { data: forecast, loading: forecastLoading } = useWeatherForecast(
    latitude || 0,
    longitude || 0
  );

  const { data: hourlyData, loading: hourlyLoading } = useHourlyForecast(
    latitude || 0,
    longitude || 0,
    selectedDate || undefined
  );

  const handleDayClick = (date: string) => {
    setSelectedDate(date);
    setHourlyDialogOpen(true);
  };

  const wmoToEmoji = (code?: number): string => {
    if (!code) return "🌡️";
    if (code === 0) return "☀️";
    if (code <= 3) return "⛅";
    if (code <= 48) return "🌫️";
    if (code <= 67) return "🌧️";
    if (code <= 77) return "🌨️";
    if (code <= 82) return "🌦️";
    if (code <= 86) return "⛈️";
    return "🌡️";
  };

  const wmoToTr = (code?: number): string => {
    if (!code) return "Veri Yok";
    if (code === 0) return "Açık";
    if (code <= 3) return "Az Bulutlu";
    if (code <= 48) return "Sisli";
    if (code <= 67) return "Yağmurlu";
    if (code <= 77) return "Karlı";
    if (code <= 82) return "Sağanak Yağışlı";
    if (code <= 86) return "Gök Gürültülü";
    return "Veri Yok";
  };

  useEffect(() => {
    const flipInterval = setInterval(() => {
      setWindFlipped((prev) => !prev);
    }, 3000);
    return () => clearInterval(flipInterval);
  }, []);

  return (
    <>
      <div className="space-y-4" data-widget-container>
        {/* Weather Condition Card - Clickable */}
        <Card 
          className="glass-widget glass-widget-hover weather-widget-clickable relative overflow-hidden rounded-2xl p-6 shadow-2xl cursor-pointer group"
          onClick={() => setForecastOpen(true)}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative text-center space-y-2">
            <div className="relative inline-block">
              <div className="text-7xl animate-float">{weatherEmoji}</div>
              <div className="absolute inset-0 blur-2xl opacity-30 animate-float" style={{ animationDelay: '0.5s' }}>
                {weatherEmoji}
              </div>
            </div>
            <div className="text-xl font-bold text-foreground">
              {weatherDescription}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">
              7 günlük tahmin için tıklayın
            </div>
          </div>
        </Card>

      {/* Weather Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="glass-widget glass-widget-hover relative overflow-hidden rounded-xl p-4 shadow-lg group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sıcaklık</div>
              <div className="text-2xl font-bold text-foreground">
                {temperature?.toFixed(1)}°C
              </div>
            </div>
            <div className="relative">
              <Thermometer className="w-10 h-10 text-red-500 animate-float" />
              <div className="absolute inset-0 blur-lg opacity-40">
                <Thermometer className="w-10 h-10 text-red-500" />
              </div>
            </div>
          </div>
          <div className="mt-2 w-full bg-muted/30 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-red-500 to-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, ((temperature || 0) + 10) / 50 * 100))}%` }}
            />
          </div>
        </Card>

        <Card className="glass-widget glass-widget-hover relative overflow-hidden rounded-xl p-4 shadow-lg group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Nem</div>
              <div className="text-2xl font-bold text-foreground">
                {humidity}%
              </div>
            </div>
            <div className="relative">
              <Droplets className="w-10 h-10 text-blue-500 animate-float" style={{ animationDelay: '0.5s' }} />
              <div className="absolute inset-0 blur-lg opacity-40">
                <Droplets className="w-10 h-10 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="mt-2 w-full bg-muted/30 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${humidity}%` }}
            />
          </div>
        </Card>

        <Card className="glass-widget glass-widget-hover relative overflow-hidden rounded-xl p-4 shadow-lg group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Basınç</div>
              <div className="text-2xl font-bold text-foreground">
                {pressure} hPa
              </div>
            </div>
            <div className="relative">
              <Gauge className="w-10 h-10 text-purple-500 animate-float" style={{ animationDelay: '1s' }} />
              <div className="absolute inset-0 blur-lg opacity-40">
                <Gauge className="w-10 h-10 text-purple-500" />
              </div>
            </div>
          </div>
          <div className="mt-2 w-full bg-muted/30 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, ((pressure || 1013) - 980) / 50 * 100))}%` }}
            />
          </div>
        </Card>

        <Card className="glass-widget glass-widget-hover relative overflow-hidden rounded-xl p-4 shadow-lg group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Rüzgar</div>
              <div className="text-xl font-bold text-foreground">
                {windSpeed?.toFixed(1)} kt
              </div>
              <div className="text-xs text-muted-foreground">
                {windFlipped ? windNameTr : `${windDirection}° ${windCompass}`}
              </div>
            </div>
            <div className="relative">
              <Wind 
                className="w-10 h-10 text-green-500 transition-transform duration-300" 
                style={{ transform: `rotate(${windDirection}deg)` }}
              />
              <div className="absolute inset-0 blur-lg opacity-40">
                <Wind className="w-10 h-10 text-green-500" />
              </div>
            </div>
          </div>
          <div className="mt-2 w-full bg-muted/30 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (windSpeed || 0) / 50 * 100)}%` }}
            />
          </div>
        </Card>
      </div>
      </div>

      {/* 7-Day Forecast Dialog */}
      <Dialog open={forecastOpen} onOpenChange={setForecastOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>7 Günlük Hava Durumu Tahmini</DialogTitle>
          </DialogHeader>
          
          {forecastLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Yükleniyor...</div>
            </div>
          ) : forecast && forecast.daily ? (
            <div className="space-y-3">
              {forecast.daily.map((day, index) => (
                <Card 
                  key={index} 
                  className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handleDayClick(day.date)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{wmoToEmoji(day.weatherCode)}</div>
                      <div>
                        <div className="font-semibold">
                          {new Date(day.date).toLocaleDateString('tr-TR', { 
                            weekday: 'short', 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {wmoToTr(day.weatherCode)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {day.temperatureMax.toFixed(0)}° / {day.temperatureMin.toFixed(0)}°
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Wind className="w-3 h-3" />
                        {day.windSpeedMax.toFixed(0)} kt
                      </div>
                      {day.precipitationSum > 0 && (
                        <div className="text-xs text-blue-500 flex items-center gap-1">
                          <Droplets className="w-3 h-3" />
                          {day.precipitationSum.toFixed(0)} mm
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Hava durumu tahmini yüklenemedi
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Hourly Forecast Dialog */}
      <Dialog open={hourlyDialogOpen} onOpenChange={setHourlyDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDate && `${new Date(selectedDate).toLocaleDateString('tr-TR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long',
                year: 'numeric' 
              })} - Saatlik Hava Durumu`}
            </DialogTitle>
          </DialogHeader>
          
          {hourlyLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Yükleniyor...</div>
            </div>
          ) : hourlyData && hourlyData.length > 0 ? (
            <div className="space-y-6">
              {/* Sıcaklık Grafiği */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Thermometer className="w-4 h-4" />
                  Sıcaklık (°C)
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      tickFormatter={(time) => new Date(time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(time) => new Date(time).toLocaleTimeString('tr-TR')}
                      formatter={(value: number) => [`${value.toFixed(1)}°C`, 'Sıcaklık']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="#ef4444" 
                      strokeWidth={2} 
                      dot={{ r: 3 }} 
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Nem Grafiği */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  Nem (%)
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      tickFormatter={(time) => new Date(time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(time) => new Date(time).toLocaleTimeString('tr-TR')}
                      formatter={(value: number) => [`${value.toFixed(0)}%`, 'Nem']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="humidity" 
                      stroke="#3b82f6" 
                      strokeWidth={2} 
                      dot={{ r: 3 }} 
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Rüzgar Hızı Grafiği */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Wind className="w-4 h-4" />
                  Rüzgar Hızı (kt)
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      tickFormatter={(time) => new Date(time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(time) => new Date(time).toLocaleTimeString('tr-TR')}
                      formatter={(value: number) => [`${value.toFixed(1)} kt`, 'Rüzgar']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="windSpeed" 
                      stroke="#10b981" 
                      strokeWidth={2} 
                      dot={{ r: 3 }} 
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Yağış Grafiği */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  Yağış (mm)
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      tickFormatter={(time) => new Date(time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(time) => new Date(time).toLocaleTimeString('tr-TR')}
                      formatter={(value: number) => [`${value.toFixed(1)} mm`, 'Yağış']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="precipitation" 
                      stroke="#8b5cf6" 
                      strokeWidth={2} 
                      dot={{ r: 3 }} 
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Saatlik Detay Tablosu */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold mb-3">Saatlik Detaylar</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                  {hourlyData.map((hour, index) => (
                    <Card key={index} className="p-3">
                      <div className="text-xs font-semibold text-center mb-2">
                        {new Date(hour.time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-center text-2xl mb-1">
                        {wmoToEmoji(hour.weatherCode)}
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Sıc:</span>
                          <span className="font-semibold">{hour.temperature.toFixed(1)}°</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Nem:</span>
                          <span className="font-semibold">{hour.humidity.toFixed(0)}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Rüz:</span>
                          <span className="font-semibold">{hour.windSpeed.toFixed(0)} kt</span>
                        </div>
                        {hour.precipitation > 0 && (
                          <div className="flex items-center justify-between text-blue-500">
                            <span>Yağış:</span>
                            <span className="font-semibold">{hour.precipitation.toFixed(1)} mm</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Saatlik hava durumu verisi yüklenemedi
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WeatherInfoWidgets;
