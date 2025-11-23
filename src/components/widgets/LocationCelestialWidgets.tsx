import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import MoonPhaseWidget from "@/components/MoonPhaseWidget";

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
        className="bg-white border-blue-200 p-4 cursor-pointer transition-all"
        onClick={() => navigate("/location-selector")}
      >
        <div className="flex items-start gap-3">
          <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-blue-600 mb-1">Konum</div>
            <div className="text-sm font-semibold text-blue-600 mb-2 truncate">
              {locationLabel}
            </div>
            <div className="text-xs text-blue-600 space-y-1">
              <div>Enlem: {latitudeDMS}</div>
              <div>Boylam: {longitudeDMS}</div>
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
