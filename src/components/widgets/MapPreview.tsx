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
      {/* OSM embed iframe renders attribution inside the iframe (cross-origin),
          so we can only hide it visually via an overlay. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-background"
      />
    </div>
  );
};

export default MapPreview;
