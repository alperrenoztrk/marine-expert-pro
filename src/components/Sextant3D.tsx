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
  depthPx = 60,
  numLayers = 18,
  tiltXdeg = 0,
  swayXPx = 0,
}) => {
  const totalLayers = Math.max(8, Math.floor(numLayers));
  const middleIndex = (totalLayers - 1) / 2;

  return (
    <div className="sextant-3d-container">
      <div
        className={[
          "sextant-3d maritime-logo maritime-logo--3d",
          className,
        ].join(" ")}
      >
        {Array.from({ length: totalLayers }, (_, layerIndex) => {
          const depthFactor = (layerIndex - middleIndex) / (totalLayers - 1);
          
          // Simple 3D depth positioning
          const zOffsetPx = depthFactor * depthPx;
          
          // Realistic 3D lighting and opacity based on depth
          const distanceFromCenter = Math.abs(depthFactor);
          const brightness = 0.8 + (1 - distanceFromCenter) * 0.2;
          const opacity = 0.6 + (1 - distanceFromCenter) * 0.4;
          
          // Simple metallic reflection based on layer position
          const reflectionIntensity = (1 - distanceFromCenter) * 0.15;
          
          return (
            <img
              key={layerIndex}
              src={src}
              alt={layerIndex === Math.round(middleIndex) ? alt : ""}
              className="sextant-3d__layer"
              style={{
                transform: `translateZ(${zOffsetPx.toFixed(2)}px)`,
                filter: `
                  brightness(${(brightness + reflectionIntensity).toFixed(3)}) 
                  contrast(${(1.05 + reflectionIntensity).toFixed(2)})
                  drop-shadow(${(zOffsetPx * 0.1).toFixed(1)}px ${(zOffsetPx * 0.15).toFixed(1)}px ${(Math.abs(zOffsetPx) * 0.3).toFixed(1)}px hsl(210 40% 10% / ${(0.3 * distanceFromCenter).toFixed(2)}))
                `,
                opacity: opacity.toFixed(3),
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