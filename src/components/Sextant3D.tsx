import React from "react";

interface Sextant3DProps {
  src: string;
  alt?: string;
  className?: string;
  depthPx?: number; // Total depth (thickness) in pixels
  numLayers?: number; // Number of layers to extrude
  tiltXdeg?: number; // Fixed X tilt in degrees
  swayXPx?: number; // Max lateral parallax sway across depth (px)
}

export const Sextant3D: React.FC<Sextant3DProps> = ({
  src,
  alt = "Sextant",
  className = "",
  depthPx = 48,
  numLayers = 28,
  tiltXdeg = 20,
  swayXPx = 4,
}) => {
  const totalLayers = Math.max(3, Math.floor(numLayers));
  const middleIndex = (totalLayers - 1) / 2;
  const depthStepPx = depthPx / (totalLayers - 1);

  return (
    <div className="sextant-3d-container">
      <div
        className={[
          "sextant-3d maritime-logo maritime-logo--rotate-3d",
          className,
        ].join(" ")}
        style={{ transform: `rotateX(${tiltXdeg}deg)` }}
      >
        {Array.from({ length: totalLayers }, (_, layerIndex) => {
          const depthFactor = (layerIndex - middleIndex) / (totalLayers - 1);
          const zOffsetPx = depthFactor * depthPx;
          const xOffsetPx = depthFactor * swayXPx;
          const brightness = 0.88 + (layerIndex / (totalLayers - 1)) * 0.12;
          const opacity = 0.82 + (layerIndex / (totalLayers - 1)) * 0.18;
          return (
            <img
              key={layerIndex}
              src={src}
              alt={layerIndex === Math.round(middleIndex) ? alt : ""}
              className="sextant-3d__layer"
              style={{
                transform: `translateX(${xOffsetPx.toFixed(2)}px) translateZ(${zOffsetPx.toFixed(2)}px)`,
                filter: `brightness(${brightness.toFixed(3)})`,
                opacity,
              }}
              loading={layerIndex === Math.round(middleIndex) ? "eager" : "lazy"}
            />
          );
        })}
        <div className="sextant-3d__glow" aria-hidden />
      </div>
    </div>
  );
};