import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Thermometer, Droplets, Gauge, Wind } from "lucide-react";

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
}) => {
  const [windFlipped, setWindFlipped] = useState(false);

  useEffect(() => {
    const flipInterval = setInterval(() => {
      setWindFlipped((prev) => !prev);
    }, 3000);
    return () => clearInterval(flipInterval);
  }, []);

  return (
    <div className="space-y-4">
      {/* Weather Condition Card */}
      <Card className="group relative rounded-xl bg-gradient-to-br from-card/80 to-background/60 border border-border/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 to-accent/5" />
        <div className="relative text-center">
          <div className="text-6xl mb-2">{weatherEmoji}</div>
          <div className="text-lg font-semibold text-foreground">
            {weatherDescription}
          </div>
        </div>
      </Card>

      {/* Weather Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="group relative rounded-xl bg-gradient-to-br from-card/80 to-background/60 border border-border/30 p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-red-500/10 to-orange-500/10" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Sıcaklık</div>
              <div className="text-2xl font-bold text-foreground">
                {temperature?.toFixed(1)}°C
              </div>
            </div>
            <Thermometer className="w-8 h-8 text-red-500 drop-shadow-sm" />
          </div>
        </Card>

        <Card className="group relative rounded-xl bg-gradient-to-br from-card/80 to-background/60 border border-border/30 p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-blue-500/10 to-cyan-500/10" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Nem</div>
              <div className="text-2xl font-bold text-foreground">
                {humidity}%
              </div>
            </div>
            <Droplets className="w-8 h-8 text-blue-500 drop-shadow-sm" />
          </div>
        </Card>

        <Card className="group relative rounded-xl bg-gradient-to-br from-card/80 to-background/60 border border-border/30 p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Basınç</div>
              <div className="text-2xl font-bold text-foreground">
                {pressure} hPa
              </div>
            </div>
            <Gauge className="w-8 h-8 text-purple-500 drop-shadow-sm" />
          </div>
        </Card>

        <Card className="group relative rounded-xl bg-gradient-to-br from-card/80 to-background/60 border border-border/30 p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-green-500/10 to-emerald-500/10" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Rüzgar</div>
              <div className="text-xl font-bold text-foreground">
                {windSpeed?.toFixed(1)} kt
              </div>
              <div className="text-sm text-muted-foreground">
                {windFlipped ? windNameTr : `${windDirection}° ${windCompass}`}
              </div>
            </div>
            <Wind className="w-8 h-8 text-green-500 drop-shadow-sm" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WeatherInfoWidgets;
