import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CelestialBody } from '@/utils/celestialCalculations';
import { Sun, Moon, Star, Circle } from 'lucide-react';

interface CelestialBodySelectorProps {
  celestialBodies: CelestialBody[];
  selectedBody: CelestialBody | null;
  onSelectBody: (body: CelestialBody) => void;
  className?: string;
}

export const CelestialBodySelector: React.FC<CelestialBodySelectorProps> = ({
  celestialBodies,
  selectedBody,
  onSelectBody,
  className = ""
}) => {
  const getBodyIcon = (body: CelestialBody) => {
    const iconProps = { size: 16, style: { color: body.color } };
    
    switch (body.type) {
      case 'sun': return <Sun {...iconProps} />;
      case 'moon': return <Moon {...iconProps} />;
      case 'planet': return <Circle {...iconProps} fill="currentColor" />;
      case 'star': return <Star {...iconProps} fill="currentColor" />;
      default: return <Circle {...iconProps} />;
    }
  };

  const sortedBodies = [...celestialBodies].sort((a, b) => {
    // Sort by type priority (sun, moon, planets, stars) then by magnitude
    const typePriority = { sun: 0, moon: 1, planet: 2, star: 3 };
    const aPriority = typePriority[a.type];
    const bPriority = typePriority[b.type];
    
    if (aPriority !== bPriority) return aPriority - bPriority;
    
    // For stars, sort by magnitude (brighter first)
    if (a.type === 'star' && b.type === 'star') {
      return (a.magnitude || 0) - (b.magnitude || 0);
    }
    
    // For others, sort by altitude (higher first)
    return b.altitude - a.altitude;
  });

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Görünür Gök Cisimleri ({celestialBodies.length})
      </h4>
      
      <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto">
        {sortedBodies.map((body, index) => (
          <Button
            key={`${body.name}-${index}`}
            variant={selectedBody?.name === body.name ? "default" : "ghost"}
            size="sm"
            onClick={() => onSelectBody(body)}
            className="justify-start h-auto py-2 px-3"
          >
            <div className="flex items-center gap-2 w-full">
              {getBodyIcon(body)}
              <div className="flex-1 text-left">
                <div className="text-sm font-medium">{body.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {body.altitude.toFixed(1)}° / {body.azimuth.toFixed(1)}°
                  {body.magnitude && (
                    <span className="ml-2">mag {body.magnitude.toFixed(1)}</span>
                  )}
                </div>
              </div>
              
              {/* Visibility indicator */}
              <div className="flex items-center gap-1">
                {body.altitude > 45 && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    Yüksek
                  </Badge>
                )}
                {body.type === 'star' && body.magnitude && body.magnitude < 2 && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    Parlak
                  </Badge>
                )}
              </div>
            </div>
          </Button>
        ))}
        
        {celestialBodies.length === 0 && (
          <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
            Şu anda görünür gök cismi yok
          </div>
        )}
      </div>
      
      {selectedBody && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            {getBodyIcon(selectedBody)}
            <span className="font-semibold">{selectedBody.name}</span>
          </div>
          <div className="text-sm space-y-1">
            <div>Yükseklik: <span className="font-mono">{selectedBody.altitude.toFixed(2)}°</span></div>
            <div>Azimuth: <span className="font-mono">{selectedBody.azimuth.toFixed(2)}°</span></div>
            {selectedBody.magnitude && (
              <div>Parlaklık: <span className="font-mono">{selectedBody.magnitude.toFixed(1)} mag</span></div>
            )}
            {selectedBody.declination && (
              <div>Declination: <span className="font-mono">{selectedBody.declination.toFixed(2)}°</span></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};