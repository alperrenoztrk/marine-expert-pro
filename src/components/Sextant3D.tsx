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
  depthPx = 80,
  numLayers = 40,
  tiltXdeg = 25,
  swayXPx = 8,
}) => {
  const totalLayers = Math.max(5, Math.floor(numLayers));
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
          const yOffsetPx = depthFactor * (swayXPx * 0.3); // Slight vertical parallax
          const scaleFactor = 1 + (depthFactor * 0.05); // Perspective scaling
          const brightness = 0.85 + (layerIndex / (totalLayers - 1)) * 0.15;
          const opacity = 0.75 + (layerIndex / (totalLayers - 1)) * 0.25;
          return (
            <img
              key={layerIndex}
              src={src}
              alt={layerIndex === Math.round(middleIndex) ? alt : ""}
              className="sextant-3d__layer"
              style={{
                transform: `translateX(${xOffsetPx.toFixed(2)}px) translateY(${yOffsetPx.toFixed(2)}px) translateZ(${zOffsetPx.toFixed(2)}px) scale(${scaleFactor.toFixed(3)})`,
                filter: `brightness(${brightness.toFixed(3)}) drop-shadow(${Math.abs(zOffsetPx * 0.1)}px ${Math.abs(zOffsetPx * 0.15)}px ${Math.abs(zOffsetPx * 0.2)}px hsl(210 30% 20% / ${0.3 * Math.abs(depthFactor)}))`,
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