import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Clock, 
  Calendar, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw,
  FastForward,
  Rewind,
  Sun,
  Moon,
  Star
} from 'lucide-react';
import {
  EnhancedCelestialBody,
  calculateCelestialBodiesForDate
} from '@/utils/enhancedCelestialCalculations';
import { ObserverPosition } from '@/utils/celestialCalculations';

interface CelestialTimeTravelProps {
  observerPosition: Omit<ObserverPosition, 'dateTime'>;
  onTimeChange?: (dateTime: Date, bodies: EnhancedCelestialBody[]) => void;
  className?: string;
}

export const CelestialTimeTravel: React.FC<CelestialTimeTravelProps> = ({
  observerPosition,
  onTimeChange,
  className = ""
}) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // hours per second
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState(
    new Date().toTimeString().slice(0, 5)
  );

  // Calculate celestial bodies for current time
  const celestialBodies = useMemo(() => {
    const fullObserver: ObserverPosition = {
      ...observerPosition,
      dateTime: currentDateTime
    };
    return calculateCelestialBodiesForDate(fullObserver, currentDateTime);
  }, [observerPosition, currentDateTime]);

  // Update time and notify parent
  const updateTime = (newTime: Date) => {
    setCurrentDateTime(newTime);
    onTimeChange?.(newTime, celestialBodies);
  };

  // Playback control
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentDateTime(prev => {
          const newTime = new Date(prev.getTime() + playbackSpeed * 60 * 60 * 1000);
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed]);

  // Quick time jumps
  const jumpToTime = (hours: number) => {
    const newTime = new Date(currentDateTime);
    newTime.setTime(newTime.getTime() + hours * 60 * 60 * 1000);
    updateTime(newTime);
  };

  const jumpToDays = (days: number) => {
    const newTime = new Date(currentDateTime);
    newTime.setDate(newTime.getDate() + days);
    updateTime(newTime);
  };

  // Set specific date/time
  const setSpecificDateTime = () => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    
    const newTime = new Date(year, month - 1, day, hours, minutes);
    updateTime(newTime);
  };

  // Reset to current time
  const resetToNow = () => {
    const now = new Date();
    setCurrentDateTime(now);
    setSelectedDate(now.toISOString().split('T')[0]);
    setSelectedTime(now.toTimeString().slice(0, 5));
    updateTime(now);
  };

  // Get visible objects summary
  const visibleSummary = useMemo(() => {
    const visible = celestialBodies.filter(body => body.isVisible && body.altitude > 0);
    const sun = visible.find(body => body.type === 'sun');
    const moon = visible.find(body => body.type === 'moon');
    const planets = visible.filter(body => body.type === 'planet');
    const stars = visible.filter(body => body.type === 'star');
    
    return { sun, moon, planets, stars, total: visible.length };
  }, [celestialBodies]);

  // Time of day classification
  const getTimeOfDay = () => {
    const sunAltitude = visibleSummary.sun?.altitude || -90;
    
    if (sunAltitude > 6) return { label: 'Gündüz', color: 'bg-yellow-500' };
    if (sunAltitude > -6) return { label: 'Alacakaranlık', color: 'bg-orange-500' };
    if (sunAltitude > -12) return { label: 'Sivil Alacakaranlık', color: 'bg-blue-500' };
    if (sunAltitude > -18) return { label: 'Denizci Alacakaranlığı', color: 'bg-indigo-500' };
    return { label: 'Gece', color: 'bg-purple-900' };
  };

  const timeOfDay = getTimeOfDay();

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Zaman Yolculuğu
          </CardTitle>
          <CardDescription>
            Farklı tarih ve saatlerde gökyüzünü keşfedin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Time Display */}
          <div className="text-center space-y-2">
            <div className="text-2xl font-mono font-bold">
              {currentDateTime.toLocaleDateString('tr-TR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="text-xl font-mono">
              {currentDateTime.toLocaleTimeString('tr-TR')}
            </div>
            <Badge className={`${timeOfDay.color} text-white`}>
              {timeOfDay.label}
            </Badge>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => jumpToDays(-1)}
              title="1 gün geri"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => jumpToTime(-1)}
              title="1 saat geri"
            >
              <Rewind className="h-4 w-4" />
            </Button>
            
            <Button
              variant={isPlaying ? "default" : "outline"}
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-6"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => jumpToTime(1)}
              title="1 saat ileri"
            >
              <FastForward className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => jumpToDays(1)}
              title="1 gün ileri"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={resetToNow}
              title="Şimdiki zamana dön"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Speed Control */}
          <div className="space-y-2">
            <Label>Oynatma Hızı: {playbackSpeed}x (saat/saniye)</Label>
            <Slider
              value={[playbackSpeed]}
              onValueChange={(value) => setPlaybackSpeed(value[0])}
              min={0.1}
              max={24}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.1x</span>
              <span>24x</span>
            </div>
          </div>

          {/* Quick Time Jumps */}
          <div className="space-y-2">
            <Label>Hızlı Atlama</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => jumpToTime(-12)}>
                12 Saat Geri
              </Button>
              <Button variant="outline" size="sm" onClick={() => jumpToTime(12)}>
                12 Saat İleri
              </Button>
              <Button variant="outline" size="sm" onClick={() => jumpToDays(-7)}>
                1 Hafta Geri
              </Button>
              <Button variant="outline" size="sm" onClick={() => jumpToDays(7)}>
                1 Hafta İleri
              </Button>
              <Button variant="outline" size="sm" onClick={() => jumpToDays(-30)}>
                1 Ay Geri
              </Button>
              <Button variant="outline" size="sm" onClick={() => jumpToDays(30)}>
                1 Ay İleri
              </Button>
            </div>
          </div>

          {/* Manual Date/Time Setting */}
          <div className="space-y-4 border-t pt-4">
            <Label>Belirli Tarih/Saat</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Tarih</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Saat</Label>
                <Input
                  id="time"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={setSpecificDateTime} className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Bu Tarihe Git
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sky Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Gökyüzü Özeti
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <Sun className="h-8 w-8 mx-auto text-yellow-500" />
              <div className="text-sm font-medium">Güneş</div>
              <div className="text-xs text-muted-foreground">
                {visibleSummary.sun ? (
                  <>
                    {visibleSummary.sun.altitude > 0 ? 'Görünür' : 'Görünmez'}
                    <br />
                    {visibleSummary.sun.altitude.toFixed(1)}°
                  </>
                ) : (
                  'Hesaplanamadı'
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Moon className="h-8 w-8 mx-auto text-gray-400" />
              <div className="text-sm font-medium">Ay</div>
              <div className="text-xs text-muted-foreground">
                {visibleSummary.moon ? (
                  <>
                    {visibleSummary.moon.altitude > 0 ? 'Görünür' : 'Görünmez'}
                    <br />
                    {visibleSummary.moon.altitude.toFixed(1)}°
                  </>
                ) : (
                  'Hesaplanamadı'
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-8 w-8 mx-auto bg-orange-500 rounded-full"></div>
              <div className="text-sm font-medium">Gezegenler</div>
              <div className="text-xs text-muted-foreground">
                {visibleSummary.planets.length} görünür
                <br />
                {visibleSummary.planets.map(p => p.name).join(', ') || 'Yok'}
              </div>
            </div>

            <div className="space-y-2">
              <Star className="h-8 w-8 mx-auto text-white" fill="currentColor" />
              <div className="text-sm font-medium">Yıldızlar</div>
              <div className="text-xs text-muted-foreground">
                {visibleSummary.stars.length} görünür
                <br />
                En parlak: {visibleSummary.stars
                  .sort((a, b) => (a.magnitude || 10) - (b.magnitude || 10))[0]?.name || 'Yok'}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t text-center">
            <Badge variant="outline" className="text-lg px-4 py-2">
              Toplam {visibleSummary.total} gök cismi görünür
            </Badge>
          </div>

          {/* Best objects to observe */}
          {visibleSummary.stars.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">En İyi Gözlem Nesneleri</h4>
              <div className="space-y-1">
                {visibleSummary.stars
                  .filter(star => star.altitude > 30) // High altitude stars
                  .sort((a, b) => (a.magnitude || 10) - (b.magnitude || 10))
                  .slice(0, 3)
                  .map((star, index) => (
                    <div key={star.name} className="flex justify-between text-sm">
                      <span>{star.commonName || star.name}</span>
                      <span className="text-muted-foreground">
                        {star.altitude.toFixed(1)}° • {star.magnitude?.toFixed(1)} mag
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};