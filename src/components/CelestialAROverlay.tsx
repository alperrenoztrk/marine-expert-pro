import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  CelestialBody, 
  celestialToScreenCoordinates, 
  getMagnitudeSize,
  isNauticalTwilight 
} from '@/utils/celestialCalculations';
import { Sun, Moon, Star, Circle } from 'lucide-react';

interface CelestialAROverlayProps {
  celestialBodies: CelestialBody[];
  deviceOrientation: { alpha: number; beta: number; gamma: number };
  screenWidth: number;
  screenHeight: number;
  showLabels?: boolean;
  showOnlyNavigationStars?: boolean;
  minimumMagnitude?: number;
  className?: string;
}

export const CelestialAROverlay: React.FC<CelestialAROverlayProps> = ({
  celestialBodies,
  deviceOrientation,
  screenWidth,
  screenHeight,
  showLabels = true,
  showOnlyNavigationStars = false,
  minimumMagnitude = 3.0,
  className = ""
}) => {
  
  const visibleBodies = useMemo(() => {
    return celestialBodies
      .filter(body => {
        // Filter by magnitude for stars
        if (body.type === 'star' && body.magnitude && body.magnitude > minimumMagnitude) {
          return false;
        }
        
        // Filter for navigation stars only if requested
        if (showOnlyNavigationStars && body.type === 'star') {
          const navStarNames = ['Sirius', 'Canopus', 'Arcturus', 'Vega', 'Capella', 'Rigel', 'Procyon', 'Betelgeuse', 'Aldebaran', 'Spica', 'Antares', 'Pollux'];
          return navStarNames.includes(body.name);
        }
        
        return body.isVisible;
      })
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
      .filter(body => body.isInView);
  }, [celestialBodies, deviceOrientation, screenWidth, screenHeight, showOnlyNavigationStars, minimumMagnitude]);

  const getBodyIcon = (body: CelestialBody) => {
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
      default:
        return <Circle {...iconProps} />;
    }
  };

  const getBodyColor = (body: CelestialBody): string => {
    if (body.type === 'sun') {
      // Sun color based on altitude (sunrise/sunset effects)
      if (body.altitude < 6) return '#FF6B35'; // Orange during twilight
      return '#FFD700'; // Yellow during day
    }
    return body.color || '#FFFFFF';
  };

  const getBadgeVariant = (body: CelestialBody) => {
    switch (body.type) {
      case 'sun': return 'default';
      case 'moon': return 'secondary';
      case 'planet': return 'outline';
      case 'star': return 'outline';
      default: return 'outline';
    }
  };

  // Check if it's good time for star sights
  const sunBody = celestialBodies.find(b => b.type === 'sun');
  const isGoodForStarSights = sunBody ? isNauticalTwilight(sunBody.altitude) : false;

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Twilight indicator */}
      {isGoodForStarSights && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <Badge variant="default" className="bg-blue-600 text-white animate-pulse">
            ⭐ Yıldız Gözlemi İçin İdeal Zaman
          </Badge>
        </div>
      )}

      {/* Celestial bodies */}
      {visibleBodies.map((body, index) => (
        <div
          key={`${body.name}-${index}`}
          className="absolute pointer-events-none"
          style={{
            left: body.screenX - 10,
            top: body.screenY - 10,
            transform: 'translate(-50%, -50%)'
          }}
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
                variant={getBadgeVariant(body)}
                className="text-xs whitespace-nowrap"
                style={{
                  backgroundColor: body.type === 'sun' ? 'rgba(255, 215, 0, 0.9)' : 
                                  body.type === 'moon' ? 'rgba(192, 192, 192, 0.9)' : 
                                  'rgba(0, 0, 0, 0.7)',
                  color: body.type === 'sun' ? '#000' : '#fff',
                  border: `1px solid ${getBodyColor(body)}`
                }}
              >
                {body.name}
                <span className="ml-1 text-xs opacity-75">
                  {body.altitude.toFixed(1)}°
                </span>
              </Badge>
            </div>
          )}

          {/* Altitude lines for precise measurement */}
          {body.type === 'sun' && (
            <>
              {/* Horizontal line through sun */}
              <div 
                className="absolute top-1/2 w-32 h-px bg-yellow-400 opacity-60"
                style={{ left: '50%', transform: 'translateX(-50%)' }}
              />
              {/* Vertical line through sun */}
              <div 
                className="absolute left-1/2 h-32 w-px bg-yellow-400 opacity-60"
                style={{ top: '50%', transform: 'translateY(-50%)' }}
              />
            </>
          )}
        </div>
      ))}

      {/* Compass rose overlay */}
      <div className="absolute bottom-4 right-4 w-24 h-24 pointer-events-none">
        <div 
          className="w-full h-full rounded-full border-2 border-white/60 bg-black/40"
          style={{
            transform: `rotate(${-deviceOrientation.alpha}deg)`
          }}
        >
          {/* Cardinal directions */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold">
            K
          </div>
          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold">
            D
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-white text-xs font-bold">
            G
          </div>
          <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold">
            B
          </div>
          
          {/* North indicator arrow */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-red-500" />
          </div>
        </div>
      </div>

      {/* Horizon line indicator */}
      <div className="absolute inset-x-0 top-1/2 pointer-events-none">
        <div 
          className="w-full h-px bg-green-400 opacity-60"
          style={{
            transform: `rotate(${-deviceOrientation.gamma}deg)`,
            transformOrigin: 'center'
          }}
        />
        <div className="absolute left-4 top-0 transform -translate-y-1/2">
          <Badge variant="outline" className="text-xs bg-black/60 text-green-400 border-green-400">
            Horizon
          </Badge>
        </div>
      </div>

      {/* Altitude scale on the side */}
      <div className="absolute left-2 top-1/4 bottom-1/4 w-8 pointer-events-none">
        <div className="relative h-full">
          {/* Altitude marks every 10 degrees */}
          {Array.from({ length: 10 }, (_, i) => {
            const altitude = i * 10;
            const position = (90 - altitude) / 90; // 0 at top (90°), 1 at bottom (0°)
            
            return (
              <div
                key={altitude}
                className="absolute left-0 w-full flex items-center"
                style={{ top: `${position * 100}%` }}
              >
                <div className="w-2 h-px bg-white/60" />
                <span className="text-xs text-white/80 ml-1">{altitude}°</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Information panel */}
      <div className="absolute top-4 right-4 space-y-2 pointer-events-none">
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