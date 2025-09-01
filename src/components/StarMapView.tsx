import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Map, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Compass, 
  Eye, 
  Star,
  Sun,
  Moon,
  Circle,
  Move
} from 'lucide-react';
import {
  EnhancedCelestialBody,
  ConstellationLine,
  getAllEnhancedCelestialBodies,
  getVisibleConstellationLines
} from '@/utils/enhancedCelestialCalculations';
import { ObserverPosition, getMagnitudeSize } from '@/utils/celestialCalculations';

interface StarMapViewProps {
  observerPosition: ObserverPosition;
  selectedObject?: EnhancedCelestialBody | null;
  onSelectObject?: (object: EnhancedCelestialBody) => void;
  className?: string;
}

interface MapProjection {
  centerRA: number; // Right ascension center in degrees
  centerDec: number; // Declination center in degrees
  scale: number; // Zoom level
  rotation: number; // Map rotation in degrees
}

export const StarMapView: React.FC<StarMapViewProps> = ({
  observerPosition,
  selectedObject,
  onSelectObject,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [projection, setProjection] = useState<MapProjection>({
    centerRA: 0,
    centerDec: 0,
    scale: 1,
    rotation: 0
  });
  const [showConstellations, setShowConstellations] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showDeepSky, setShowDeepSky] = useState(false);
  const [minimumMagnitude, setMinimumMagnitude] = useState(5.0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  const canvasWidth = 800;
  const canvasHeight = 600;

  // Get celestial bodies
  const celestialBodies = useMemo(() => {
    return getAllEnhancedCelestialBodies(observerPosition, {
      includeStars: true,
      includeDeepSky: showDeepSky,
      includePlanets: true,
      includeSunMoon: true,
      minimumMagnitude: minimumMagnitude
    });
  }, [observerPosition, showDeepSky, minimumMagnitude]);

  // Get constellation lines
  const constellationLines = useMemo(() => {
    return showConstellations ? getVisibleConstellationLines(celestialBodies) : [];
  }, [celestialBodies, showConstellations]);

  // Convert celestial coordinates to canvas coordinates
  const celestialToCanvas = (ra: number, dec: number): { x: number; y: number; visible: boolean } => {
    // Convert RA from hours to degrees
    const raDeg = ra * 15;
    
    // Apply rotation and centering
    const deltaRA = raDeg - projection.centerRA;
    const deltaDec = dec - projection.centerDec;
    
    // Simple stereographic projection
    const cosC = Math.cos(deltaDec * Math.PI / 180) * Math.cos(deltaRA * Math.PI / 180);
    const k = 2 / (1 + cosC);
    
    const x = k * Math.cos(deltaDec * Math.PI / 180) * Math.sin(deltaRA * Math.PI / 180) * projection.scale;
    const y = -k * Math.sin(deltaDec * Math.PI / 180) * projection.scale;
    
    // Apply rotation
    const rotRad = projection.rotation * Math.PI / 180;
    const rotX = x * Math.cos(rotRad) - y * Math.sin(rotRad);
    const rotY = x * Math.sin(rotRad) + y * Math.cos(rotRad);
    
    // Convert to canvas coordinates
    const canvasX = canvasWidth / 2 + rotX * 100;
    const canvasY = canvasHeight / 2 + rotY * 100;
    
    const visible = canvasX >= 0 && canvasX <= canvasWidth && canvasY >= 0 && canvasY <= canvasHeight;
    
    return { x: canvasX, y: canvasY, visible };
  };

  // Draw the star map
  const drawStarMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas with dark background
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // RA lines (meridians)
    for (let ra = 0; ra < 24; ra++) {
      ctx.beginPath();
      for (let dec = -90; dec <= 90; dec += 5) {
        const pos = celestialToCanvas(ra, dec);
        if (dec === -90) {
          ctx.moveTo(pos.x, pos.y);
        } else {
          ctx.lineTo(pos.x, pos.y);
        }
      }
      ctx.stroke();
    }
    
    // Dec lines (parallels)
    for (let dec = -80; dec <= 80; dec += 20) {
      ctx.beginPath();
      for (let ra = 0; ra < 24; ra += 0.5) {
        const pos = celestialToCanvas(ra, dec);
        if (ra === 0) {
          ctx.moveTo(pos.x, pos.y);
        } else {
          ctx.lineTo(pos.x, pos.y);
        }
      }
      ctx.stroke();
    }
    
    // Draw constellation lines
    if (showConstellations) {
      ctx.strokeStyle = 'rgba(100, 149, 237, 0.4)';
      ctx.lineWidth = 1;
      
      constellationLines.forEach(line => {
        const fromPos = celestialToCanvas(line.fromStar.rightAscension || 0, line.fromStar.declination || 0);
        const toPos = celestialToCanvas(line.toStar.rightAscension || 0, line.toStar.declination || 0);
        
        if (fromPos.visible || toPos.visible) {
          ctx.beginPath();
          ctx.moveTo(fromPos.x, fromPos.y);
          ctx.lineTo(toPos.x, toPos.y);
          ctx.stroke();
        }
      });
    }
    
    // Draw celestial bodies
    celestialBodies.forEach(body => {
      const pos = celestialToCanvas(body.rightAscension || 0, body.declination || 0);
      if (!pos.visible) return;
      
      const size = body.type === 'star' && body.magnitude 
        ? Math.max(2, getMagnitudeSize(body.magnitude) / 3)
        : body.type === 'sun' ? 12 
        : body.type === 'moon' ? 8
        : 6;
      
      // Draw glow effect for bright objects
      if ((body.type === 'star' && body.magnitude && body.magnitude < 2) || 
          body.type === 'sun' || body.type === 'moon' || body.type === 'planet') {
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size * 2);
        gradient.addColorStop(0, body.color || '#ffffff');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, size * 2, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      // Draw main body
      ctx.fillStyle = body.color || '#ffffff';
      ctx.beginPath();
      
      if (body.type === 'sun') {
        // Draw sun with rays
        ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw rays
        ctx.strokeStyle = body.color || '#FFD700';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4;
          const x1 = pos.x + Math.cos(angle) * (size + 3);
          const y1 = pos.y + Math.sin(angle) * (size + 3);
          const x2 = pos.x + Math.cos(angle) * (size + 8);
          const y2 = pos.y + Math.sin(angle) * (size + 8);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      } else if (body.type === 'moon') {
        // Draw moon with crescent
        ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI);
        ctx.fill();
      } else if (body.type === 'star') {
        // Draw star with points
        const points = 5;
        const outerRadius = size;
        const innerRadius = size * 0.4;
        
        ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
          const angle = (i * Math.PI) / points;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const x = pos.x + Math.cos(angle) * radius;
          const y = pos.y + Math.sin(angle) * radius;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.fill();
      } else {
        // Draw planet as circle
        ctx.arc(pos.x, pos.y, size, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      // Highlight selected object
      if (selectedObject && selectedObject.name === body.name) {
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, size + 5, 0, 2 * Math.PI);
        ctx.stroke();
      }
      
      // Draw labels
      if (showLabels && size > 3) {
        ctx.fillStyle = '#ffffff';
        ctx.font = `${Math.max(10, size)}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(body.commonName || body.name, pos.x, pos.y + size + 15);
        
        if (body.magnitude) {
          ctx.font = '8px Arial';
          ctx.fillStyle = '#cccccc';
          ctx.fillText(body.magnitude.toFixed(1), pos.x, pos.y + size + 25);
        }
      }
    });
    
    // Draw compass
    const compassX = canvasWidth - 60;
    const compassY = 60;
    const compassRadius = 40;
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(compassX, compassY, compassRadius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // North arrow
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(compassX, compassY - compassRadius + 5);
    ctx.lineTo(compassX - 5, compassY - compassRadius + 15);
    ctx.lineTo(compassX + 5, compassY - compassRadius + 15);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('K', compassX, compassY - compassRadius - 5);
  };

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;
      
      setProjection(prev => ({
        ...prev,
        centerRA: prev.centerRA - deltaX * 0.5 / prev.scale,
        centerDec: Math.max(-90, Math.min(90, prev.centerDec + deltaY * 0.5 / prev.scale))
      }));
      
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Find clicked object
    const clickedObject = celestialBodies.find(body => {
      const pos = celestialToCanvas(body.rightAscension || 0, body.declination || 0);
      const distance = Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2);
      const size = body.type === 'star' && body.magnitude 
        ? Math.max(2, getMagnitudeSize(body.magnitude) / 3)
        : 8;
      return distance <= size + 5;
    });
    
    if (clickedObject && onSelectObject) {
      onSelectObject(clickedObject);
    }
  };

  // Zoom functions
  const zoomIn = () => {
    setProjection(prev => ({ ...prev, scale: Math.min(prev.scale * 1.5, 10) }));
  };

  const zoomOut = () => {
    setProjection(prev => ({ ...prev, scale: Math.max(prev.scale / 1.5, 0.1) }));
  };

  const resetView = () => {
    setProjection({ centerRA: 0, centerDec: 0, scale: 1, rotation: 0 });
  };

  // Center on selected object
  useEffect(() => {
    if (selectedObject && selectedObject.rightAscension && selectedObject.declination) {
      setProjection(prev => ({
        ...prev,
        centerRA: selectedObject.rightAscension! * 15,
        centerDec: selectedObject.declination!
      }));
    }
  }, [selectedObject]);

  // Redraw when projection or data changes
  useEffect(() => {
    drawStarMap();
  }, [projection, celestialBodies, constellationLines, showConstellations, showLabels, selectedObject]);

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Yıldız Haritası
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Controls */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={zoomIn}>
              <ZoomIn className="h-4 w-4 mr-1" />
              Yakınlaştır
            </Button>
            <Button variant="outline" size="sm" onClick={zoomOut}>
              <ZoomOut className="h-4 w-4 mr-1" />
              Uzaklaştır
            </Button>
            <Button variant="outline" size="sm" onClick={resetView}>
              <Compass className="h-4 w-4 mr-1" />
              Merkez
            </Button>
            <Button
              variant={showConstellations ? "default" : "outline"}
              size="sm"
              onClick={() => setShowConstellations(!showConstellations)}
            >
              Takımyıldızlar
            </Button>
            <Button
              variant={showLabels ? "default" : "outline"}
              size="sm"
              onClick={() => setShowLabels(!showLabels)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Etiketler
            </Button>
          </div>

          {/* Magnitude filter */}
          <div className="mb-4">
            <label className="text-sm font-medium">
              Minimum Parlaklık: {minimumMagnitude.toFixed(1)}
            </label>
            <Slider
              value={[minimumMagnitude]}
              onValueChange={(value) => setMinimumMagnitude(value[0])}
              min={1}
              max={6}
              step={0.1}
              className="w-full mt-2"
            />
          </div>

          {/* Canvas */}
          <div className="relative border rounded-lg overflow-hidden bg-black">
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              className="cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={handleClick}
            />
            
            {/* Map info overlay */}
            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs p-2 rounded">
              <div>Merkez: RA {(projection.centerRA / 15).toFixed(1)}h, Dec {projection.centerDec.toFixed(1)}°</div>
              <div>Zoom: {projection.scale.toFixed(1)}x</div>
              <div>Nesneler: {celestialBodies.length}</div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs p-2 rounded">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span>Güneş</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span>Ay</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>Gezegen</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-white" fill="currentColor" />
                  <span>Yıldız</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs p-2 rounded">
              <div>🖱️ Sürükle: Hareket</div>
              <div>🖱️ Tıkla: Seç</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};