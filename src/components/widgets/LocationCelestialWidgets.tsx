import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface LocationCelestialWidgetsProps {
  locationLabel: string;
  latitude?: number;
  longitude?: number;
  latitudeDMS: string;
  longitudeDMS: string;
}

const LocationCelestialWidgets: React.FC<LocationCelestialWidgetsProps> = ({
  locationLabel,
  latitude,
  longitude,
  latitudeDMS,
  longitudeDMS,
}) => {
  const navigate = useNavigate();

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
              {locationLabel}
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
