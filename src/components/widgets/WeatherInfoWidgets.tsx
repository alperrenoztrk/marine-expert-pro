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
      <Card className="bg-white border-blue-200 p-6">
        <div className="text-center">
          <div className="text-6xl mb-2">{weatherEmoji}</div>
          <div className="text-lg font-semibold text-blue-600">
            {weatherDescription}
          </div>
        </div>
      </Card>

      {/* Weather Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-white border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-blue-600 mb-1">Sıcaklık</div>
              <div className="text-2xl font-bold text-blue-600">
                {temperature?.toFixed(1)}°C
              </div>
            </div>
            <Thermometer className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="bg-white border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-blue-600 mb-1">Nem</div>
              <div className="text-2xl font-bold text-blue-600">
                {humidity}%
              </div>
            </div>
            <Droplets className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="bg-white border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-blue-600 mb-1">Basınç</div>
              <div className="text-2xl font-bold text-blue-600">
                {pressure} hPa
              </div>
            </div>
            <Gauge className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="bg-white border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-blue-600 mb-1">Rüzgar</div>
              <div className="text-xl font-bold text-blue-600">
                {windSpeed?.toFixed(1)} kt
              </div>
              <div className="text-sm text-blue-600">
                {windFlipped ? windNameTr : `${windDirection}° ${windCompass}`}
              </div>
            </div>
            <Wind className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WeatherInfoWidgets;
