import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { MapPin, Maximize2 } from "lucide-react";
import { useLocation } from "@/contexts/LocationContext";
import { useCurrentWeather } from "@/hooks/useCurrentWeather";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MapPreview from "./MapPreview";

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
  const [mapDialogOpen, setMapDialogOpen] = useState(false);

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

  const hasValidCoordinates = effectiveLatitude !== undefined && effectiveLongitude !== undefined;

  return (
    <>
      <div className="space-y-4" data-widget-container>
        {/* Location Card */}
        <Card className="glass-widget relative overflow-hidden rounded-xl shadow-lg group">
          <div className="absolute inset-0 bg-gradient-to-r from-destructive/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Header with location info */}
          <div 
            className="relative p-5 cursor-pointer glass-widget-hover"
            onClick={() => navigate("/location-selector")}
          >
            <div className="flex items-start gap-4">
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
          </div>

          {/* Map Preview */}
          {hasValidCoordinates && (
            <div className="relative">
              <div className="px-5 pb-3">
                <MapPreview
                  latitude={effectiveLatitude!}
                  longitude={effectiveLongitude!}
                  locationLabel={effectiveLabel || "Konum"}
                  height="180px"
                  zoom={10}
                />
              </div>
              
              {/* Full Map Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMapDialogOpen(true);
                }}
                className="absolute bottom-6 right-8 glass-widget glass-widget-hover p-2 rounded-lg group/btn"
              >
                <Maximize2 className="h-4 w-4 text-primary group-hover/btn:scale-110 transition-transform" />
              </button>
            </div>
          )}
        </Card>
      </div>

      {/* Full Screen Map Dialog */}
      {hasValidCoordinates && (
        <Dialog open={mapDialogOpen} onOpenChange={setMapDialogOpen}>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-destructive" />
                {effectiveLabel}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 mt-4">
              <MapPreview
                latitude={effectiveLatitude!}
                longitude={effectiveLongitude!}
                locationLabel={effectiveLabel || "Konum"}
                height="100%"
                zoom={13}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default LocationCelestialWidgets;
