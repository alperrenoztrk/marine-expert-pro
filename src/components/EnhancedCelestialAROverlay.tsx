import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  EnhancedCelestialBody, 
  ConstellationLine,
  getAllEnhancedCelestialBodies,
  getVisibleConstellationLines
} from '@/utils/enhancedCelestialCalculations';
import { 
  celestialToScreenCoordinates, 
  getMagnitudeSize,
  isNauticalTwilight,
  ObserverPosition
} from '@/utils/celestialCalculations';
import { Sun, Moon, Star, Circle, Eye, EyeOff, Search, Info } from 'lucide-react';

interface EnhancedCelestialAROverlayProps {
  observerPosition: ObserverPosition;
  deviceOrientation: { alpha: number; beta: number; gamma: number };
  screenWidth: number;
  screenHeight: number;
  className?: string;
}

export const EnhancedCelestialAROverlay: React.FC<EnhancedCelestialAROverlayProps> = ({
  observerPosition,
  deviceOrientation,
  screenWidth,
  screenHeight,
  className = ""
}) => {
  
  const [showLabels, setShowLabels] = useState(true);
  const [showConstellations, setShowConstellations] = useState(true);
  const [showDeepSky, setShowDeepSky] = useState(false);
  const [minimumMagnitude, setMinimumMagnitude] = useState(4.0);
  const [selectedObject, setSelectedObject] = useState<EnhancedCelestialBody | null>(null);
  const [showOnlyNavigationStars, setShowOnlyNavigationStars] = useState(false);

  const { celestialBodies, constellationLines } = useMemo(() => {
    const bodies = getAllEnhancedCelestialBodies(observerPosition, {
      includeStars: true,
      includeDeepSky: showDeepSky,
      includePlanets: true,
      includeSunMoon: true,
      minimumMagnitude: minimumMagnitude
    });

    // Filter for navigation stars if requested
    const filteredBodies = showOnlyNavigationStars 
      ? bodies.filter(body => 
          body.type !== 'star' || 
          ['Sirius', 'Canopus', 'Arcturus', 'Vega', 'Capella', 'Rigel', 'Procyon', 'Betelgeuse', 'Aldebaran', 'Spica', 'Antares', 'Pollux', 'Fomalhaut', 'Deneb', 'Regulus', 'Polaris'].includes(body.name)
        )
      : bodies;

    const lines = showConstellations ? getVisibleConstellationLines(filteredBodies) : [];

    return { celestialBodies: filteredBodies, constellationLines: lines };
  }, [observerPosition, showDeepSky, minimumMagnitude, showOnlyNavigationStars, showConstellations]);

  const visibleBodies = useMemo(() => {
    return celestialBodies
      .map(body => {
        const screenPos = celestialToScreenCoordinates(
          body.altitude,
          body.azimuth,
          deviceOrientation,
          screenWidth,
          screenHeight
        );
        
        return {
          ...body,
          screenX: screenPos.x,
          screenY: screenPos.y,
          isInView: screenPos.isInView
        };
      })
      .filter(body => body.isInView && body.isVisible);
  }, [celestialBodies, deviceOrientation, screenWidth, screenHeight]);

  const visibleConstellationLines = useMemo(() => {
    return constellationLines
      .map(line => {
        const fromScreenPos = celestialToScreenCoordinates(
          line.fromStar.altitude,
          line.fromStar.azimuth,
          deviceOrientation,
          screenWidth,
          screenHeight
        );
        
        const toScreenPos = celestialToScreenCoordinates(
          line.toStar.altitude,
          line.toStar.azimuth,
          deviceOrientation,
          screenWidth,
          screenHeight
        );

        return {
          ...line,
          fromX: fromScreenPos.x,
          fromY: fromScreenPos.y,
          toX: toScreenPos.x,
          toY: toScreenPos.y,
          isVisible: fromScreenPos.isInView && toScreenPos.isInView
        };
      })
      .filter(line => line.isVisible);
  }, [constellationLines, deviceOrientation, screenWidth, screenHeight]);

  const getBodyIcon = (body: EnhancedCelestialBody) => {
    const size = body.type === 'star' && body.magnitude 
      ? getMagnitudeSize(body.magnitude) 
      : 20;
    
    const iconProps = {
      size: size,
      style: { color: body.color },
      className: "drop-shadow-lg"
    };

    switch (body.type) {
      case 'sun':
        return <Sun {...iconProps} className={`${iconProps.className} animate-pulse`} />;
      case 'moon':
        return <Moon {...iconProps} />;
      case 'planet':
        return <Circle {...iconProps} fill="currentColor" />;
      case 'star':
        return <Star {...iconProps} fill="currentColor" />;
      case 'galaxy':
      case 'nebula':
      case 'star_cluster':
      case 'planetary_nebula':
        return <Circle {...iconProps} className={`${iconProps.className} opacity-70`} />;
      default:
        return <Circle {...iconProps} />;
    }
  };

  const getBodyColor = (body: EnhancedCelestialBody): string => {
    if (body.type === 'sun') {
      if (body.altitude < 6) return '#FF6B35';
      return '#FFD700';
    }
    return body.color || '#FFFFFF';
  };

  const sunBody = celestialBodies.find(b => b.type === 'sun');
  const isGoodForStarSights = sunBody ? isNauticalTwilight(sunBody.altitude) : false;

  return (
    <div className={`absolute inset-0 ${className}`}>
      {/* Control Panel */}
      <div className="absolute top-4 left-4 space-y-2 z-10">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={showLabels ? "default" : "outline"}
              onClick={() => setShowLabels(!showLabels)}
              className="text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              Etiketler
            </Button>
            <Button
              size="sm"
              variant={showConstellations ? "default" : "outline"}
              onClick={() => setShowConstellations(!showConstellations)}
              className="text-xs"
            >
              <Star className="h-3 w-3 mr-1" />
              Takımyıldızlar
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={showOnlyNavigationStars ? "default" : "outline"}
              onClick={() => setShowOnlyNavigationStars(!showOnlyNavigationStars)}
              className="text-xs"
            >
              Seyir Yıldızları
            </Button>
            <Button
              size="sm"
              variant={showDeepSky ? "default" : "outline"}
              onClick={() => setShowDeepSky(!showDeepSky)}
              className="text-xs"
            >
              Derin Uzay
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white">Min Parlaklık:</span>
            <select 
              value={minimumMagnitude} 
              onChange={(e) => setMinimumMagnitude(parseFloat(e.target.value))}
              className="text-xs bg-black/40 text-white border border-white/20 rounded px-1"
            >
              <option value={2.0}>2.0</option>
              <option value={3.0}>3.0</option>
              <option value={4.0}>4.0</option>
              <option value={5.0}>5.0</option>
              <option value={6.0}>6.0</option>
            </select>
          </div>
        </div>
      </div>

      {/* Twilight indicator */}
      {isGoodForStarSights && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <Badge variant="default" className="bg-blue-600 text-white animate-pulse">
            ⭐ Yıldız Gözlemi İçin İdeal Zaman
          </Badge>
        </div>
      )}

      {/* Constellation Lines */}
      {showConstellations && (
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          {visibleConstellationLines.map((line, index) => (
            <line
              key={`constellation-line-${index}`}
              x1={line.fromX}
              y1={line.fromY}
              x2={line.toX}
              y2={line.toY}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}
        </svg>
      )}

      {/* Celestial bodies */}
      {visibleBodies.map((body, index) => (
        <div
          key={`${body.name}-${index}`}
          className="absolute pointer-events-auto cursor-pointer"
          style={{
            left: body.screenX - 10,
            top: body.screenY - 10,
            transform: 'translate(-50%, -50%)',
            zIndex: 2
          }}
          onClick={() => setSelectedObject(body)}
        >
          {/* Body icon with glow effect */}
          <div 
            className={`relative flex items-center justify-center celestial-body ${
              body.type === 'star' ? 'celestial-star' : 
              body.type === 'sun' ? 'celestial-sun' :
              body.type === 'moon' ? 'celestial-moon' :
              'celestial-planet'
            }`}
            style={{
              filter: `drop-shadow(0 0 8px ${getBodyColor(body)})`,
            }}
          >
            {getBodyIcon(body)}
            
            {/* Pulsing ring for planets and bright stars */}
            {(body.type === 'planet' || (body.type === 'star' && body.magnitude && body.magnitude < 1)) && (
              <div 
                className="absolute inset-0 rounded-full border-2 animate-ping"
                style={{
                  borderColor: getBodyColor(body),
                  opacity: 0.3
                }}
              />
            )}
          </div>

          {/* Label */}
          {showLabels && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
              <Badge 
                variant="outline"
                className="text-xs whitespace-nowrap"
                style={{
                  backgroundColor: body.type === 'sun' ? 'rgba(255, 215, 0, 0.9)' : 
                                  body.type === 'moon' ? 'rgba(192, 192, 192, 0.9)' : 
                                  'rgba(0, 0, 0, 0.7)',
                  color: body.type === 'sun' ? '#000' : '#fff',
                  border: `1px solid ${getBodyColor(body)}`
                }}
              >
                {body.commonName || body.name}
                {body.magnitude && (
                  <span className="ml-1 text-xs opacity-75">
                    {body.magnitude.toFixed(1)}
                  </span>
                )}
              </Badge>
            </div>
          )}
        </div>
      ))}

      {/* Selected Object Info Panel */}
      {selectedObject && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white z-20">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              {getBodyIcon(selectedObject)}
              <div>
                <h3 className="font-bold text-lg">{selectedObject.commonName || selectedObject.name}</h3>
                {selectedObject.constellation && (
                  <p className="text-sm text-gray-300">{selectedObject.constellation} takımyıldızı</p>
                )}
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedObject(null)}
              className="text-white hover:bg-white/20"
            >
              ✕
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Yükseklik:</strong> {selectedObject.altitude.toFixed(1)}°</p>
              <p><strong>Azimuth:</strong> {selectedObject.azimuth.toFixed(1)}°</p>
              {selectedObject.magnitude && (
                <p><strong>Parlaklık:</strong> {selectedObject.magnitude.toFixed(1)} mag</p>
              )}
            </div>
            <div>
              {selectedObject.spectralClass && (
                <p><strong>Spektral Sınıf:</strong> {selectedObject.spectralClass}</p>
              )}
              {selectedObject.distance && (
                <p><strong>Uzaklık:</strong> {selectedObject.distance.toLocaleString()} ışık yılı</p>
              )}
            </div>
          </div>

          {selectedObject.description && (
            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-sm text-gray-200">{selectedObject.description}</p>
            </div>
          )}

          {selectedObject.mythology && (
            <div className="mt-2">
              <p className="text-xs text-gray-300 italic">{selectedObject.mythology}</p>
            </div>
          )}
        </div>
      )}

      {/* Compass rose overlay */}
      <div className="absolute bottom-4 right-4 w-24 h-24 pointer-events-none" style={{ zIndex: 3 }}>
        <div 
          className="w-full h-full rounded-full border-2 border-white/60 bg-black/40"
          style={{
            transform: `rotate(${-deviceOrientation.alpha}deg)`
          }}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold">K</div>
          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold">D</div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-white text-xs font-bold">G</div>
          <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold">B</div>
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-red-500" />
          </div>
        </div>
      </div>

      {/* Information panel */}
      <div className="absolute top-4 right-4 space-y-2 pointer-events-none z-10">
        <Badge variant="outline" className="bg-black/60 text-white border-white/40">
          Görünür: {visibleBodies.length} gök cismi
        </Badge>
        
        {isGoodForStarSights && (
          <Badge variant="default" className="bg-blue-600 text-white">
            🌟 Nautical Twilight
          </Badge>
        )}
        
        <Badge variant="outline" className="bg-black/60 text-white border-white/40 text-xs">
          Azimuth: {deviceOrientation.alpha?.toFixed(1)}°
        </Badge>
      </div>
    </div>
  );
};