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
  depthPx = 120,
  numLayers = 60,
  tiltXdeg = 0,
  swayXPx = 0,
}) => {
  const totalLayers = Math.max(8, Math.floor(numLayers));
  const middleIndex = (totalLayers - 1) / 2;
  const depthStepPx = depthPx / (totalLayers - 1);

  return (
    <div className="sextant-4d-container">
      <div
        className={[
          "sextant-4d maritime-logo maritime-logo--hypercube",
          className,
        ].join(" ")}
      >
        {Array.from({ length: totalLayers }, (_, layerIndex) => {
          const normalizedIndex = layerIndex / (totalLayers - 1);
          const depthFactor = (layerIndex - middleIndex) / (totalLayers - 1);
          
          // True 3D positioning with perspective correction
          const zOffsetPx = depthFactor * depthPx;
          const perspectiveScale = 1 / (1 + Math.abs(zOffsetPx) * 0.001);
          
          // 4D hypercube transformations
          const rotateW = normalizedIndex * 360; // 4th dimension rotation
          const hyperX = Math.cos(normalizedIndex * Math.PI * 2) * 2;
          const hyperY = Math.sin(normalizedIndex * Math.PI * 2) * 2;
          
          // Realistic 3D lighting and opacity
          const distanceFromCenter = Math.abs(depthFactor);
          const brightness = 0.7 + (1 - distanceFromCenter) * 0.3;
          const opacity = 0.4 + (1 - distanceFromCenter) * 0.6;
          
          // Metallic surface reflection simulation
          const reflectionIntensity = Math.abs(Math.cos(normalizedIndex * Math.PI)) * 0.2;
          return (
            <img
              key={layerIndex}
              src={src}
              alt={layerIndex === Math.round(middleIndex) ? alt : ""}
              className="sextant-4d__layer"
              style={{
                transform: `
                  translateZ(${zOffsetPx.toFixed(2)}px) 
                  scale(${perspectiveScale.toFixed(3)}) 
                  rotateX(${(normalizedIndex * 20 - 10).toFixed(1)}deg)
                  rotateY(${(normalizedIndex * 15 - 7.5).toFixed(1)}deg)
                  rotateZ(${(Math.sin(normalizedIndex * Math.PI * 4) * 2).toFixed(1)}deg)
                `,
                filter: `
                  brightness(${(brightness + reflectionIntensity).toFixed(3)}) 
                  contrast(${(1.1 + reflectionIntensity).toFixed(2)})
                  drop-shadow(${(zOffsetPx * 0.08).toFixed(1)}px ${(zOffsetPx * 0.12).toFixed(1)}px ${(Math.abs(zOffsetPx) * 0.25).toFixed(1)}px hsl(210 40% 10% / ${(0.4 * distanceFromCenter).toFixed(2)}))
                  drop-shadow(0 0 ${(Math.abs(zOffsetPx) * 0.1).toFixed(1)}px hsl(45 100% 70% / ${(reflectionIntensity).toFixed(2)}))
                `,
                opacity: opacity.toFixed(3),
                animationDelay: `${(layerIndex * 0.02).toFixed(2)}s`,
              }}
              loading={layerIndex === Math.round(middleIndex) ? "eager" : "lazy"}
            />
          );
        })}
        <div className="sextant-4d__glow" aria-hidden />
        <div className="sextant-4d__hyperglow" aria-hidden />
      </div>
    </div>
  );
};