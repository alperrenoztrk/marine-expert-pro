import React from "react";

interface MapPreviewProps {
  latitude: number;
  longitude: number;
  locationLabel: string;
  height?: string;
  zoom?: number;
}

const MapPreview: React.FC<MapPreviewProps> = ({
  latitude,
  longitude,
  height = "200px",
  zoom = 13,
}) => {
  // OpenStreetMap embed URL
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.05},${latitude - 0.05},${longitude + 0.05},${latitude + 0.05}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <div className="relative overflow-hidden rounded-lg border border-border/50" style={{ height }}>
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        src={mapUrl}
        style={{ border: 0 }}
        title="Location Map"
      />
    </div>
  );
};

export default MapPreview;
