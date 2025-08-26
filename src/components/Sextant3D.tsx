import React, { useState, useCallback } from "react";
import { BackgroundRemovalProcessor } from './BackgroundRemovalProcessor';

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
  depthPx = 30,
  numLayers = 12,
}) => {
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [showProcessor, setShowProcessor] = useState(true);

  const handleImageProcessed = useCallback((processedUrl: string) => {
    setProcessedImageUrl(processedUrl);
    setShowProcessor(false);
  }, []);

  const totalLayers = Math.max(6, Math.floor(numLayers));
  const middleIndex = (totalLayers - 1) / 2;

  if (showProcessor && !processedImageUrl) {
    return (
      <div className="sextant-3d-container">
        <BackgroundRemovalProcessor 
          imageUrl={src} 
          onProcessed={handleImageProcessed}
        />
      </div>
    );
  }

  const finalImageSrc = processedImageUrl || src;

  return (
    <div className="sextant-3d-container">
      <div
        className={[
          "sextant-3d maritime-logo",
          className,
        ].join(" ")}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {Array.from({ length: totalLayers }, (_, layerIndex) => {
          const depthFactor = (layerIndex - middleIndex) / (totalLayers - 1);
          
          // Simple 3D depth positioning without rotation
          const zOffsetPx = depthFactor * depthPx;
          
          // Realistic 3D lighting and opacity based on depth
          const distanceFromCenter = Math.abs(depthFactor);
          const brightness = 0.85 + (1 - distanceFromCenter) * 0.15;
          const opacity = 0.7 + (1 - distanceFromCenter) * 0.3;
          
          // Simple metallic reflection based on layer position
          const reflectionIntensity = (1 - distanceFromCenter) * 0.1;
          
          return (
            <img
              key={layerIndex}
              src={finalImageSrc}
              alt={layerIndex === Math.round(middleIndex) ? alt : ""}
              className="sextant-3d__layer"
              style={{
                transform: `translateZ(${zOffsetPx.toFixed(2)}px)`,
                filter: `
                  brightness(${(brightness + reflectionIntensity).toFixed(3)}) 
                  contrast(${(1.03 + reflectionIntensity).toFixed(2)})
                  drop-shadow(${(zOffsetPx * 0.08).toFixed(1)}px ${(zOffsetPx * 0.12).toFixed(1)}px ${(Math.abs(zOffsetPx) * 0.25).toFixed(1)}px hsl(210 30% 15% / ${(0.25 * distanceFromCenter).toFixed(2)}))
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