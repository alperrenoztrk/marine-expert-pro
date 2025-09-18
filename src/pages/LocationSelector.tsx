import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, MapPin, Users, Clock } from 'lucide-react';
import { useLocationSearch, type LocationResult } from '@/hooks/useLocationSearch';
import { useWeatherForecast } from '@/hooks/useWeatherForecast';
import { useCurrentWeather } from '@/hooks/useCurrentWeather';

function decimalToDMS(decimal: number, isLatitude: boolean = true): string {
  if (!Number.isFinite(decimal)) return "-";
  
  const abs = Math.abs(decimal);
  const degrees = Math.floor(abs);
  const minutesFloat = (abs - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const secondsFloat = (minutesFloat - minutes) * 60;
  const seconds = Math.round(secondsFloat * 100) / 100; // Tam saniye hassasiyeti için 2 decimal
  
  let direction: string;
  if (isLatitude) {
    direction = decimal >= 0 ? "K" : "G"; // Kuzey/Güney
  } else {
    direction = decimal >= 0 ? "D" : "B"; // Doğu/Batı
  }
  
  const secondsStr = seconds < 10 ? `0${seconds.toFixed(2)}` : seconds.toFixed(2);
  return `${degrees}°${minutes.toString().padStart(2, '0')}'${secondsStr}"${direction}`;
}

function LocationCard({ location, onSelect }: { location: LocationResult; onSelect: (location: LocationResult) => void }) {
  return (
    <Card 
      className="cursor-pointer border-border/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
      onClick={() => onSelect(location)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative mt-1">
            <MapPin className="h-5 w-5 text-primary drop-shadow-sm" />
            <div className="absolute inset-0 animate-pulse opacity-30 group-hover:opacity-0 transition-opacity">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="font-semibold text-foreground text-lg">{location.name}</h3>
              <p className="text-muted-foreground text-sm">
                {location.admin1 ? `${location.admin1}, ` : ''}{location.country}
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <span>📍</span>
                <span className="font-mono text-xs">
                  <div>{decimalToDMS(location.latitude, true)}</div>
                  <div>{decimalToDMS(location.longitude, false)}</div>
                </span>
              </div>
              
              {location.population && (
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{location.population.toLocaleString('tr-TR')}</span>
                </div>
              )}
              
              {location.timezone && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{location.timezone}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            →
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LocationSelector() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { query, setQuery, results, loading, error } = useLocationSearch();
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
  
  const returnTo = searchParams.get('returnTo') || '/';
  const { locationLabel } = useCurrentWeather();

  const handleLocationSelect = (location: LocationResult) => {
    setSelectedLocation(location);
    
    // Navigate to weather forecast with selected coordinates
    navigate(`/weather-forecast?lat=${location.latitude}&lon=${location.longitude}&location=${encodeURIComponent(`${location.name}, ${location.country}`)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-card p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(returnTo)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Konum Seçici</h1>
          <div></div>
        </div>

        {/* Current Location */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              Mevcut Konum
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {locationLabel || "Konum bilgisi alınıyor..."}
            </p>
          </CardContent>
        </Card>

        {/* Search */}
        <Card className="border-border/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Search className="h-5 w-5 text-primary" />
              Yeni Konum Ara
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Şehir, ülke veya bölge adı girin..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 text-base"
              />
            </div>
            
            <p className="text-sm text-muted-foreground">
              Örnek: Istanbul, Tokyo, New York, Paris, London
            </p>
          </CardContent>
        </Card>

        {/* Search Results */}
        {query.length >= 2 && (
          <Card className="border-border/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground">Arama Sonuçları</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center gap-3 py-8">
                  <div className="relative">
                    <svg className="animate-spin h-6 w-6 text-primary" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  </div>
                  <p className="text-muted-foreground">Konumlar aranıyor...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-destructive font-semibold mb-2">Arama hatası</p>
                  <p className="text-muted-foreground text-sm">{error}</p>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-3">
                  {results.map((location) => (
                    <LocationCard
                      key={location.id}
                      location={location}
                      onSelect={handleLocationSelect}
                    />
                  ))}
                </div>
              ) : query.length >= 2 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">"{query}" için sonuç bulunamadı</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Farklı bir arama terimi deneyin
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}