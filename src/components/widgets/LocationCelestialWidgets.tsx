import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useLocation } from "@/contexts/LocationContext";
import { useCurrentWeather } from "@/hooks/useCurrentWeather";

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
  latitudeDMS: propLatitudeDMS,
  longitudeDMS: propLongitudeDMS,
}) => {
  const navigate = useNavigate();
  const { selectedLocation } = useLocation();
  const { data: currentWeather, locationLabel: currentLocationLabel } = useCurrentWeather();

  // Context'ten veya prop'lardan konumu al
  const effectiveLatitude = selectedLocation?.latitude ?? currentWeather?.latitude ?? propLatitude;
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
  const longitudeDMS = decimalToDMS(selectedLocation?.longitude ?? currentWeather?.longitude ?? propLongitude, false);

  return (
    <div className="space-y-4">
      {/* Location Card */}
      <Card
        className="group relative rounded-xl bg-gradient-to-r from-card/80 to-background/60 border border-border/30 p-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={() => navigate("/location-selector")}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative flex items-start gap-3">
          <div className="relative">
            <MapPin className="h-6 w-6 text-destructive drop-shadow-sm flex-shrink-0 mt-1" />
            <div className="absolute inset-0 animate-pulse opacity-30">
              <MapPin className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-muted-foreground mb-1">Konum</div>
            <div className="text-sm font-semibold text-foreground mb-2 truncate">
              {effectiveLabel || "Bilinmiyor"}
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Enlem: {latitudeDMS}</div>
              <div>Boylam: {longitudeDMS}</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LocationCelestialWidgets;
