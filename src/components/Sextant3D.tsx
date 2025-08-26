import React from "react";

interface Sextant3DProps {
  src: string;
  alt?: string;
  className?: string;
  depthPx?: number; // Total depth (thickness) in pixels
  numLayers?: number; // Number of layers to extrude
}

export const Sextant3D: React.FC<Sextant3DProps> = ({
  src,
  alt = "Sextant",
  className = "",
  depthPx = 28,
  numLayers = 18,
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
      >
        {Array.from({ length: totalLayers }, (_, layerIndex) => {
          const zOffsetPx = (layerIndex - middleIndex) * depthStepPx;
          const brightness = 0.9 + (layerIndex / (totalLayers - 1)) * 0.1;
          const opacity = 0.85 + (layerIndex / (totalLayers - 1)) * 0.15;
          return (
            <img
              key={layerIndex}
              src={src}
              alt={layerIndex === Math.round(middleIndex) ? alt : ""}
              className="sextant-3d__layer"
              style={{
                transform: `translateZ(${zOffsetPx.toFixed(2)}px)`,
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