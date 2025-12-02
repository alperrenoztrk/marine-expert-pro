import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useLocation } from "@/contexts/LocationContext";
import { useCurrentWeather } from "@/hooks/useCurrentWeather";
import MoonPhaseWidget from "@/components/MoonPhaseWidget";

interface LocationCelestialWidgetsProps {
  locationLabel: string;
  latitude?: number;
  longitude?: number;
  latitudeDMS: string;
  longitudeDMS: string;
}

const LocationCelestialWidgets: React.FC<LocationCelestialWidgetsProps> = ({
  locationLabel: propLocationLabel,
  latitude: propLatitude,
  longitude: propLongitude,
}) => {
  const navigate = useNavigate();
  const { selectedLocation } = useLocation();
  const { data: currentWeather, locationLabel: currentLocationLabel } = useCurrentWeather();

  // Context'ten veya prop'lardan konumu al
  const effectiveLatitude = selectedLocation?.latitude ?? currentWeather?.latitude ?? propLatitude;
  const effectiveLongitude = selectedLocation?.longitude ?? currentWeather?.longitude ?? propLongitude;
  const effectiveLabel = selectedLocation?.locationLabel ?? currentLocationLabel ?? propLocationLabel;

  // DMS formatını hesapla
  const decimalToDMS = (decimal: number | undefined, isLatitude: boolean = true): string => {
    if (decimal === undefined || !Number.isFinite(decimal)) return "-";
    
    const abs = Math.abs(decimal);
    const degrees = Math.floor(abs);
    const minutesFloat = (abs - degrees) * 60;
    const minutes = Math.floor(minutesFloat);
    const seconds = Math.round((minutesFloat - minutes) * 60);
    
    let direction: string;
    if (isLatitude) {
      direction = decimal >= 0 ? "K" : "G";
    } else {
      direction = decimal >= 0 ? "D" : "B";
    }
    
    return `${degrees}°${minutes.toString().padStart(2, '0')}'${seconds.toString().padStart(2, '0')}"${direction}`;
  };

  const latitudeDMS = decimalToDMS(effectiveLatitude, true);
  const longitudeDMS = decimalToDMS(effectiveLongitude, false);

  return (
    <div className="space-y-4" data-widget-container>
      {/* Location Card */}
      <Card
        className="glass-widget glass-widget-hover relative overflow-hidden rounded-xl p-5 shadow-lg cursor-pointer group"
        onClick={() => navigate("/location-selector")}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-destructive/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-start gap-4">
          <div className="relative mt-1">
            <MapPin className="h-8 w-8 text-destructive animate-float flex-shrink-0" />
            <div className="absolute inset-0 blur-xl opacity-50">
              <MapPin className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Konum
              </div>
              <div className="text-lg font-bold text-foreground truncate">
                {effectiveLabel || "Bilinmiyor"}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="glass-widget rounded-lg p-2 space-y-0.5">
                <div className="text-muted-foreground uppercase tracking-wide">Enlem</div>
                <div className="font-mono font-semibold text-foreground">{latitudeDMS}</div>
              </div>
              <div className="glass-widget rounded-lg p-2 space-y-0.5">
                <div className="text-muted-foreground uppercase tracking-wide">Boylam</div>
                <div className="font-mono font-semibold text-foreground">{longitudeDMS}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Moon Phase Widget */}
      <MoonPhaseWidget />
    </div>
  );
};

export default LocationCelestialWidgets;
