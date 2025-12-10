import React, { useMemo } from "react";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const buildMapUrl = (latitude: number, longitude: number, zoom: number) => {
  const safeZoom = clamp(zoom, 3, 16);
  const baseZoom = 10;
  const baseDelta = 0.05;
  const zoomFactor = Math.pow(2, safeZoom - baseZoom);
  const latDelta = baseDelta / zoomFactor;
  const cosLat = Math.abs(Math.cos((latitude * Math.PI) / 180));
  const lonDelta = latDelta / Math.max(cosLat, 0.2); // Avoid extreme stretching near the poles

  const bbox = [
    clamp(longitude - lonDelta, -180, 180),
    clamp(latitude - latDelta, -90, 90),
    clamp(longitude + lonDelta, -180, 180),
    clamp(latitude + latDelta, -90, 90),
  ];

  const url = new URL("https://www.openstreetmap.org/export/embed.html");
  url.searchParams.set("bbox", bbox.join(","));
  url.searchParams.set("layer", "mapnik");
  url.searchParams.set("marker", `${latitude},${longitude}`);

  return url.toString();
};

interface MapPreviewProps {
  latitude: number;
  longitude: number;
  locationLabel: string;
  height?: string;
  zoom?: number;
}

const MapPreview: React.FC<MapPreviewProps> = ({ latitude, longitude, locationLabel, height = "200px", zoom = 13 }) => {
  const hasValidCoordinates =
    Number.isFinite(latitude) && Number.isFinite(longitude) && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180;

  const mapUrl = useMemo(() => {
    if (!hasValidCoordinates) return null;
    return buildMapUrl(latitude, longitude, zoom);
  }, [latitude, longitude, zoom, hasValidCoordinates]);

  if (!hasValidCoordinates || !mapUrl) {
    return (
      <div
        className="relative flex items-center justify-center overflow-hidden rounded-lg border border-dashed border-border/50 bg-muted/40 text-xs text-muted-foreground"
        style={{ height }}
      >
        Harita için geçerli koordinat bulunamadı
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-border/50" style={{ height }}>
      <iframe
        key={mapUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        src={mapUrl}
        style={{ border: 0 }}
        title={`Location map for ${locationLabel}`}
        aria-label={`Location map for ${locationLabel}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default MapPreview;
