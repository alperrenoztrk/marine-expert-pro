import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Star, 
  Sun, 
  Moon, 
  Circle, 
  Clock, 
  MapPin, 
  Eye,
  Filter,
  BookOpen,
  Telescope
} from 'lucide-react';
import {
  EnhancedCelestialBody,
  getAllEnhancedCelestialBodies,
  searchCelestialObjects,
  calculateBestViewingTime,
  getConstellationInfo
} from '@/utils/enhancedCelestialCalculations';
import { 
  enhancedStarCatalog, 
  constellations, 
  deepSkyObjects,
  getStarsByConstellation,
  getNavigationStars
} from '@/utils/enhancedStarDatabase';
import { ObserverPosition } from '@/utils/celestialCalculations';

interface StarSearchAndCatalogProps {
  observerPosition: ObserverPosition;
  onSelectObject?: (object: EnhancedCelestialBody) => void;
  className?: string;
}

export const StarSearchAndCatalog: React.FC<StarSearchAndCatalogProps> = ({
  observerPosition,
  onSelectObject,
  className = ""
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConstellation, setSelectedConstellation] = useState<string>('');
  const [magnitudeFilter, setMagnitudeFilter] = useState<number>(6.0);
  const [showOnlyVisible, setShowOnlyVisible] = useState(true);
  const [selectedObject, setSelectedObject] = useState<EnhancedCelestialBody | null>(null);

  // Get all celestial bodies
  const allBodies = useMemo(() => {
    return getAllEnhancedCelestialBodies(observerPosition, {
      includeStars: true,
      includeDeepSky: true,
      includePlanets: true,
      includeSunMoon: true,
      minimumMagnitude: magnitudeFilter
    });
  }, [observerPosition, magnitudeFilter]);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchCelestialObjects(searchQuery, observerPosition);
  }, [searchQuery, observerPosition]);

  // Filtered bodies based on current filters
  const filteredBodies = useMemo(() => {
    let bodies = allBodies;

    if (selectedConstellation) {
      bodies = bodies.filter(body => body.constellation === selectedConstellation);
    }

    if (showOnlyVisible) {
      bodies = bodies.filter(body => body.isVisible && body.altitude > 0);
    }

    return bodies.sort((a, b) => {
      // Sort by type first (sun, moon, planets, stars), then by magnitude/altitude
      const typeOrder = { sun: 0, moon: 1, planet: 2, star: 3, galaxy: 4, nebula: 5, star_cluster: 6 };
      const aOrder = typeOrder[a.type as keyof typeof typeOrder] || 7;
      const bOrder = typeOrder[b.type as keyof typeof typeOrder] || 7;
      
      if (aOrder !== bOrder) return aOrder - bOrder;
      
      if (a.type === 'star' && b.type === 'star' && a.magnitude && b.magnitude) {
        return a.magnitude - b.magnitude; // Brighter stars first
      }
      
      return b.altitude - a.altitude; // Higher altitude first
    });
  }, [allBodies, selectedConstellation, showOnlyVisible]);

  // Navigation stars
  const navigationStars = useMemo(() => {
    return getNavigationStars().map(star => {
      const body = allBodies.find(b => b.name === star.name);
      return body || null;
    }).filter(Boolean) as EnhancedCelestialBody[];
  }, [allBodies]);

  const getObjectIcon = (object: EnhancedCelestialBody) => {
    const iconProps = { size: 16, className: "mr-2" };
    
    switch (object.type) {
      case 'sun': return <Sun {...iconProps} style={{ color: object.color }} />;
      case 'moon': return <Moon {...iconProps} style={{ color: object.color }} />;
      case 'planet': return <Circle {...iconProps} style={{ color: object.color }} fill="currentColor" />;
      case 'star': return <Star {...iconProps} style={{ color: object.color }} fill="currentColor" />;
      case 'galaxy':
      case 'nebula':
      case 'star_cluster':
      case 'planetary_nebula':
        return <Telescope {...iconProps} style={{ color: object.color }} />;
      default: return <Circle {...iconProps} />;
    }
  };

  const handleObjectSelect = (object: EnhancedCelestialBody) => {
    setSelectedObject(object);
    onSelectObject?.(object);
  };

  const getBestViewingTime = (objectName: string) => {
    const bestTime = calculateBestViewingTime(objectName, observerPosition);
    if (bestTime) {
      return `${bestTime.time.toLocaleTimeString()} (${bestTime.altitude.toFixed(1)}°)`;
    }
    return 'Hesaplanamadı';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Yıldız Kataloğu ve Arama
          </CardTitle>
          <CardDescription>
            Gök cisimlerini arayın, filtreleyin ve detaylı bilgilerini görüntüleyin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Yıldız, gezegen veya takımyıldız arayın..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedConstellation}
                onChange={(e) => setSelectedConstellation(e.target.value)}
                className="px-3 py-1 text-sm border rounded-md bg-background"
              >
                <option value="">Tüm Takımyıldızlar</option>
                {constellations.map(constellation => (
                  <option key={constellation.name} value={constellation.name}>
                    {constellation.name}
                  </option>
                ))}
              </select>

              <select
                value={magnitudeFilter}
                onChange={(e) => setMagnitudeFilter(parseFloat(e.target.value))}
                className="px-3 py-1 text-sm border rounded-md bg-background"
              >
                <option value={2.0}>Parlaklık ≤ 2.0</option>
                <option value={3.0}>Parlaklık ≤ 3.0</option>
                <option value={4.0}>Parlaklık ≤ 4.0</option>
                <option value={5.0}>Parlaklık ≤ 5.0</option>
                <option value={6.0}>Parlaklık ≤ 6.0</option>
              </select>

              <Button
                variant={showOnlyVisible ? "default" : "outline"}
                size="sm"
                onClick={() => setShowOnlyVisible(!showOnlyVisible)}
                className="text-xs"
              >
                <Eye className="h-3 w-3 mr-1" />
                Sadece Görünür
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Tümü</TabsTrigger>
          <TabsTrigger value="search">Arama</TabsTrigger>
          <TabsTrigger value="navigation">Seyir</TabsTrigger>
          <TabsTrigger value="constellations">Takımyıldızlar</TabsTrigger>
          <TabsTrigger value="deepsky">Derin Uzay</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Tüm Gök Cisimleri ({filteredBodies.length})</h3>
          </div>
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {filteredBodies.map((object, index) => (
                <Card 
                  key={`${object.name}-${index}`} 
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleObjectSelect(object)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getObjectIcon(object)}
                        <div>
                          <div className="font-medium text-sm">
                            {object.commonName || object.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {object.constellation && `${object.constellation} • `}
                            Alt: {object.altitude.toFixed(1)}° • Az: {object.azimuth.toFixed(1)}°
                            {object.magnitude && ` • ${object.magnitude.toFixed(1)} mag`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {object.isVisible && object.altitude > 0 && (
                          <Badge variant="outline" className="text-xs">
                            Görünür
                          </Badge>
                        )}
                        {object.altitude > 45 && (
                          <Badge variant="secondary" className="text-xs">
                            Yüksek
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="search" className="space-y-2">
          {searchQuery ? (
            <>
              <h3 className="text-sm font-medium">Arama Sonuçları ({searchResults.length})</h3>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {searchResults.map((object, index) => (
                    <Card 
                      key={`search-${object.name}-${index}`} 
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleObjectSelect(object)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center">
                          {getObjectIcon(object)}
                          <div>
                            <div className="font-medium text-sm">
                              {object.commonName || object.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {object.constellation && `${object.constellation} • `}
                              Alt: {object.altitude.toFixed(1)}° • Az: {object.azimuth.toFixed(1)}°
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {searchResults.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Arama kriterinize uygun sonuç bulunamadı
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Arama yapmak için yukarıdaki kutucuğa yazın
            </div>
          )}
        </TabsContent>

        <TabsContent value="navigation" className="space-y-2">
          <h3 className="text-sm font-medium">Seyir Yıldızları ({navigationStars.length})</h3>
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {navigationStars.map((star, index) => (
                <Card 
                  key={`nav-${star.name}-${index}`} 
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleObjectSelect(star)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-2" style={{ color: star.color }} fill="currentColor" />
                        <div>
                          <div className="font-medium text-sm">
                            {star.commonName || star.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {star.constellation} • {star.magnitude?.toFixed(1)} mag
                          </div>
                        </div>
                      </div>
                      <Badge variant={star.isVisible && star.altitude > 0 ? "default" : "secondary"} className="text-xs">
                        {star.altitude.toFixed(1)}°
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="constellations" className="space-y-2">
          <h3 className="text-sm font-medium">Takımyıldızlar ({constellations.length})</h3>
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {constellations.map((constellation) => (
                <Card key={constellation.name} className="cursor-pointer hover:bg-accent transition-colors">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{constellation.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {constellation.abbreviation} • {constellation.season && `${constellation.season} mevsimi`}
                        </div>
                        {constellation.mythology && (
                          <div className="text-xs text-muted-foreground mt-1 italic">
                            {constellation.mythology}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedConstellation(constellation.name)}
                      >
                        Filtrele
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="deepsky" className="space-y-2">
          <h3 className="text-sm font-medium">Derin Uzay Nesneleri ({deepSkyObjects.length})</h3>
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {deepSkyObjects.map((dso) => {
                const body = allBodies.find(b => b.name === dso.name);
                return (
                  <Card 
                    key={dso.name} 
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => body && handleObjectSelect(body)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Telescope className="h-4 w-4 mr-2" style={{ color: dso.color }} />
                          <div>
                            <div className="font-medium text-sm">{dso.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {dso.type.replace('_', ' ')} • {dso.constellation} • {dso.magnitude.toFixed(1)} mag
                            </div>
                            {dso.description && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {dso.description}
                              </div>
                            )}
                          </div>
                        </div>
                        {body && (
                          <Badge variant={body.isVisible && body.altitude > 0 ? "default" : "secondary"} className="text-xs">
                            {body.altitude.toFixed(1)}°
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Selected Object Details */}
      {selectedObject && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getObjectIcon(selectedObject)}
              {selectedObject.commonName || selectedObject.name}
            </CardTitle>
            {selectedObject.constellation && (
              <CardDescription>{selectedObject.constellation} takımyıldızı</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Yükseklik:</strong> {selectedObject.altitude.toFixed(2)}°</p>
                <p><strong>Azimuth:</strong> {selectedObject.azimuth.toFixed(2)}°</p>
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
                <p><strong>En İyi Gözlem:</strong> {getBestViewingTime(selectedObject.name)}</p>
              </div>
            </div>

            {selectedObject.description && (
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">{selectedObject.description}</p>
              </div>
            )}

            {selectedObject.mythology && (
              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium mb-1">Mitoloji</h4>
                <p className="text-sm text-muted-foreground italic">{selectedObject.mythology}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Badge variant={selectedObject.isVisible && selectedObject.altitude > 0 ? "default" : "secondary"}>
                {selectedObject.isVisible && selectedObject.altitude > 0 ? "Şu anda görünür" : "Görünmüyor"}
              </Badge>
              {selectedObject.altitude > 45 && (
                <Badge variant="outline">Yüksek konumda</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};