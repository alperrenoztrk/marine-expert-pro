import { useState, useEffect } from 'react';

export type LocationResult = {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  population?: number;
  timezone?: string;
};

export function useLocationSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const searchLocations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=tr&format=json`
        );
        
        if (!response.ok) {
          throw new Error('Konum araması başarısız');
        }
        
        const data = await response.json();
        
        if (data.results) {
          setResults(data.results.map((result: any) => ({
            id: result.id,
            name: result.name,
            country: result.country,
            admin1: result.admin1,
            latitude: result.latitude,
            longitude: result.longitude,
            population: result.population,
            timezone: result.timezone
          })));
        } else {
          setResults([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchLocations, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return {
    query,
    setQuery,
    results,
    loading,
    error
  };
}