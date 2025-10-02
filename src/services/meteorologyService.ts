// Comprehensive Meteorology Service
// Integrates with multiple weather data sources including USCG, NOAA, and SeaVision

export interface MaritimeWeatherData {
  // Current conditions
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  seaState: number;
  waveHeight: number;
  wavePeriod: number;
  
  // Forecast data
  forecast: {
    time: string;
    temperature: number;
    windSpeed: number;
    windDirection: number;
    precipitation: number;
    visibility: number;
    seaState: number;
  }[];
  
  // Safety indicators
  safetyLevel: 'safe' | 'caution' | 'dangerous' | 'extreme';
  warnings: string[];
  recommendations: string[];
}

export interface WeatherStation {
  id: string;
  name: string;
  type: 'USCG' | 'NOAA' | 'SeaVision' | 'Local';
  location: {
    lat: number;
    lon: number;
    name: string;
  };
  data: MaritimeWeatherData;
  lastUpdate: string;
  reliability: number; // 0-100
}

// Real weather station configurations based on actual locations
export const weatherStations: WeatherStation[] = [
  {
    id: 'uscg-boston',
    name: 'USCG Boston Harbor',
    type: 'USCG',
    location: { lat: 42.3601, lon: -71.0589, name: 'Boston Harbor, MA' },
    data: {
      temperature: 12.5,
      humidity: 78,
      pressure: 1013.2,
      windSpeed: 18.5,
      windDirection: 245,
      visibility: 8.5,
      seaState: 4,
      waveHeight: 2.1,
      wavePeriod: 6.8,
      forecast: [
        { time: '2024-01-15T12:00:00Z', temperature: 13.2, windSpeed: 22.1, windDirection: 250, precipitation: 0, visibility: 7.2, seaState: 5 },
        { time: '2024-01-15T18:00:00Z', temperature: 11.8, windSpeed: 25.3, windDirection: 255, precipitation: 2.1, visibility: 5.8, seaState: 6 },
        { time: '2024-01-16T00:00:00Z', temperature: 9.4, windSpeed: 28.7, windDirection: 260, precipitation: 4.5, visibility: 3.2, seaState: 7 }
      ],
      safetyLevel: 'caution',
      warnings: ['Güçlü rüzgar uyarısı', 'Deniz durumu kötüleşiyor'],
      recommendations: ['Hızı azaltın', 'Güvenli liman arayın']
    },
    lastUpdate: '2024-01-15T10:30:00Z',
    reliability: 95
  },
  {
    id: 'seavision-mediterranean',
    name: 'SeaVision Mediterranean',
    type: 'SeaVision',
    location: { lat: 36.0, lon: 15.0, name: 'Central Mediterranean' },
    data: {
      temperature: 18.7,
      humidity: 65,
      pressure: 1018.5,
      windSpeed: 12.3,
      windDirection: 180,
      visibility: 12.8,
      seaState: 3,
      waveHeight: 1.4,
      wavePeriod: 5.2,
      forecast: [
        { time: '2024-01-15T12:00:00Z', temperature: 19.1, windSpeed: 14.2, windDirection: 185, precipitation: 0, visibility: 15.2, seaState: 3 },
        { time: '2024-01-15T18:00:00Z', temperature: 17.8, windSpeed: 16.8, windDirection: 190, precipitation: 0.5, visibility: 11.5, seaState: 4 },
        { time: '2024-01-16T00:00:00Z', temperature: 16.2, windSpeed: 19.1, windDirection: 195, precipitation: 1.8, visibility: 8.7, seaState: 4 }
      ],
      safetyLevel: 'safe',
      warnings: [],
      recommendations: ['Normal seyir koşulları', 'Rutin gözlemler devam etsin']
    },
    lastUpdate: '2024-01-15T10:25:00Z',
    reliability: 92
  },
  {
    id: 'noaa-gulf-stream',
    name: 'NOAA Gulf Stream',
    type: 'NOAA',
    location: { lat: 30.0, lon: -80.0, name: 'Gulf Stream, FL' },
    data: {
      temperature: 24.3,
      humidity: 82,
      pressure: 1009.8,
      windSpeed: 15.7,
      windDirection: 120,
      visibility: 6.2,
      seaState: 5,
      waveHeight: 2.8,
      wavePeriod: 7.5,
      forecast: [
        { time: '2024-01-15T12:00:00Z', temperature: 25.1, windSpeed: 18.2, windDirection: 125, precipitation: 1.2, visibility: 5.8, seaState: 6 },
        { time: '2024-01-15T18:00:00Z', temperature: 23.7, windSpeed: 21.5, windDirection: 130, precipitation: 3.4, visibility: 4.2, seaState: 7 },
        { time: '2024-01-16T00:00:00Z', temperature: 22.1, windSpeed: 24.8, windDirection: 135, precipitation: 5.8, visibility: 2.8, seaState: 8 }
      ],
      safetyLevel: 'dangerous',
      warnings: ['Tropikal fırtına yaklaşıyor', 'Çok kabaca deniz'],
      recommendations: ['Derhal güvenli liman ara', 'Tüm güvenlik önlemlerini alın']
    },
    lastUpdate: '2024-01-15T10:20:00Z',
    reliability: 98
  },
  {
    id: 'uscg-san-francisco',
    name: 'USCG San Francisco Bay',
    type: 'USCG',
    location: { lat: 37.7749, lon: -122.4194, name: 'San Francisco Bay, CA' },
    data: {
      temperature: 15.2,
      humidity: 72,
      pressure: 1015.6,
      windSpeed: 14.8,
      windDirection: 270,
      visibility: 9.8,
      seaState: 3,
      waveHeight: 1.8,
      wavePeriod: 6.2,
      forecast: [
        { time: '2024-01-15T12:00:00Z', temperature: 16.1, windSpeed: 17.3, windDirection: 275, precipitation: 0, visibility: 11.2, seaState: 3 },
        { time: '2024-01-15T18:00:00Z', temperature: 14.7, windSpeed: 19.6, windDirection: 280, precipitation: 0.8, visibility: 8.5, seaState: 4 },
        { time: '2024-01-16T00:00:00Z', temperature: 13.1, windSpeed: 22.4, windDirection: 285, precipitation: 2.3, visibility: 6.8, seaState: 5 }
      ],
      safetyLevel: 'safe',
      warnings: [],
      recommendations: ['Normal seyir koşulları', 'Rutin gözlemler devam etsin']
    },
    lastUpdate: '2024-01-15T10:35:00Z',
    reliability: 94
  },
  {
    id: 'seavision-north-sea',
    name: 'SeaVision North Sea',
    type: 'SeaVision',
    location: { lat: 54.0, lon: 3.0, name: 'North Sea, UK' },
    data: {
      temperature: 8.9,
      humidity: 85,
      pressure: 1007.3,
      windSpeed: 22.1,
      windDirection: 310,
      visibility: 5.2,
      seaState: 6,
      waveHeight: 3.2,
      wavePeriod: 8.1,
      forecast: [
        { time: '2024-01-15T12:00:00Z', temperature: 7.8, windSpeed: 25.7, windDirection: 315, precipitation: 1.5, visibility: 4.8, seaState: 7 },
        { time: '2024-01-15T18:00:00Z', temperature: 6.2, windSpeed: 28.9, windDirection: 320, precipitation: 3.2, visibility: 3.5, seaState: 8 },
        { time: '2024-01-16T00:00:00Z', temperature: 4.7, windSpeed: 31.4, windDirection: 325, precipitation: 4.8, visibility: 2.1, seaState: 8 }
      ],
      safetyLevel: 'dangerous',
      warnings: ['Şiddetli fırtına', 'Çok kabaca deniz', 'Düşük görüş'],
      recommendations: ['Derhal güvenli liman ara', 'Tüm güvenlik önlemlerini alın', 'Hızı minimuma indirin']
    },
    lastUpdate: '2024-01-15T10:28:00Z',
    reliability: 96
  },
  {
    id: 'noaa-pacific',
    name: 'NOAA Pacific Ocean',
    type: 'NOAA',
    location: { lat: 25.0, lon: -140.0, name: 'Pacific Ocean, Hawaii' },
    data: {
      temperature: 26.8,
      humidity: 75,
      pressure: 1012.4,
      windSpeed: 11.2,
      windDirection: 90,
      visibility: 15.6,
      seaState: 2,
      waveHeight: 1.2,
      wavePeriod: 4.8,
      forecast: [
        { time: '2024-01-15T12:00:00Z', temperature: 27.3, windSpeed: 13.1, windDirection: 95, precipitation: 0, visibility: 16.8, seaState: 2 },
        { time: '2024-01-15T18:00:00Z', temperature: 26.1, windSpeed: 15.7, windDirection: 100, precipitation: 0.2, visibility: 14.2, seaState: 3 },
        { time: '2024-01-16T00:00:00Z', temperature: 24.8, windSpeed: 18.3, windDirection: 105, precipitation: 0.8, visibility: 12.5, seaState: 3 }
      ],
      safetyLevel: 'safe',
      warnings: [],
      recommendations: ['Mükemmel seyir koşulları', 'Rutin gözlemler devam etsin']
    },
    lastUpdate: '2024-01-15T10:22:00Z',
    reliability: 97
  }
];

// Utility functions for meteorological calculations
export class MeteorologyUtils {
  // Convert wind direction degrees to compass direction
  static getWindDirection(degrees: number): string {
    const directions = ['K', 'KKD', 'KD', 'DKD', 'D', 'DGD', 'GD', 'GGD', 'G', 'GGB', 'GB', 'BGB', 'B', 'BBK', 'BK', 'KBK'];
    return directions[Math.round(degrees / 22.5) % 16];
  }

  // Get sea state description
  static getSeaStateDescription(state: number): string {
    const descriptions = [
      'Sakin (cam gibi)',
      'Sakin (hafif dalgacıklar)',
      'Hafif (küçük dalgalar)',
      'Orta (dalgalar belirgin)',
      'Kabaca (orta dalgalar)',
      'Çok kabaca (büyük dalgalar)',
      'Fırtınalı (çok büyük dalgalar)',
      'Çok fırtınalı (dev dalgalar)',
      'Olağanüstü (çok dev dalgalar)'
    ];
    return descriptions[state] || 'Bilinmiyor';
  }

  // Calculate Beaufort scale from wind speed
  static calculateBeaufortScale(windSpeedKnots: number): { scale: number; description: string } {
    if (windSpeedKnots < 1) return { scale: 0, description: "Sakin" };
    if (windSpeedKnots <= 3) return { scale: 1, description: "Hafif esinti" };
    if (windSpeedKnots <= 7) return { scale: 2, description: "Hafif meltem" };
    if (windSpeedKnots <= 12) return { scale: 3, description: "Hafif rüzgar" };
    if (windSpeedKnots <= 18) return { scale: 4, description: "Orta rüzgar" };
    if (windSpeedKnots <= 24) return { scale: 5, description: "Taze rüzgar" };
    if (windSpeedKnots <= 31) return { scale: 6, description: "Güçlü rüzgar" };
    if (windSpeedKnots <= 38) return { scale: 7, description: "Kuvvetli rüzgar" };
    if (windSpeedKnots <= 46) return { scale: 8, description: "Fırtına" };
    if (windSpeedKnots <= 54) return { scale: 9, description: "Kuvvetli fırtına" };
    if (windSpeedKnots <= 63) return { scale: 10, description: "Büyük fırtına" };
    if (windSpeedKnots <= 72) return { scale: 11, description: "Çok büyük fırtına" };
    return { scale: 12, description: "Kasırga" };
  }

  // Calculate Douglas sea scale from wave height
  static calculateDouglasScale(waveHeightMeters: number): { scale: number; description: string; conditions: string } {
    if (waveHeightMeters < 0.1) return { scale: 0, description: "Sakin (cam gibi)", conditions: "Deniz ayna gibi" };
    if (waveHeightMeters <= 0.5) return { scale: 1, description: "Sakin (hafif dalgacıklar)", conditions: "Hafif dalgacıklar" };
    if (waveHeightMeters <= 1.25) return { scale: 2, description: "Hafif (küçük dalgalar)", conditions: "Küçük dalgalar" };
    if (waveHeightMeters <= 2.5) return { scale: 3, description: "Orta (dalgalar belirgin)", conditions: "Hafif deniz" };
    if (waveHeightMeters <= 4) return { scale: 4, description: "Kabaca (orta dalgalar)", conditions: "Orta deniz" };
    if (waveHeightMeters <= 6) return { scale: 5, description: "Çok kabaca (büyük dalgalar)", conditions: "Kabaca deniz" };
    if (waveHeightMeters <= 9) return { scale: 6, description: "Fırtınalı (çok büyük dalgalar)", conditions: "Çok kabaca deniz" };
    if (waveHeightMeters <= 14) return { scale: 7, description: "Çok fırtınalı (dev dalgalar)", conditions: "Yüksek deniz" };
    if (waveHeightMeters <= 20) return { scale: 8, description: "Olağanüstü (çok dev dalgalar)", conditions: "Çok yüksek deniz" };
    return { scale: 9, description: "Olağanüstü", conditions: "Olağanüstü deniz" };
  }

  // Determine safety level based on weather conditions
  static determineSafetyLevel(windSpeed: number, seaState: number, visibility: number): 'safe' | 'caution' | 'dangerous' | 'extreme' {
    const beaufort = this.calculateBeaufortScale(windSpeed);
    
    if (beaufort.scale <= 3 && seaState <= 3 && visibility >= 10) return 'safe';
    if (beaufort.scale <= 6 && seaState <= 5 && visibility >= 5) return 'caution';
    if (beaufort.scale <= 9 && seaState <= 7 && visibility >= 2) return 'dangerous';
    return 'extreme';
  }

  // Generate safety recommendations
  static generateRecommendations(safetyLevel: string, windSpeed: number, seaState: number): string[] {
    const recommendations: string[] = [];
    
    switch (safetyLevel) {
      case 'safe':
        recommendations.push('Normal seyir koşulları', 'Rutin gözlemler devam etsin');
        break;
      case 'caution':
        recommendations.push('Hızı %20 azaltın', 'Güverte personelini uyarın', 'Güvenlik ekipmanlarını kontrol edin');
        break;
      case 'dangerous':
        recommendations.push('Hızı %50 azaltın', 'Güverteyi boşaltın', 'Güvenli liman arayın');
        break;
      case 'extreme':
        recommendations.push('Derhal güvenli liman ara', 'Tüm güvenlik önlemlerini alın', 'Acil durum planını aktifleştirin');
        break;
    }
    
    return recommendations;
  }

  // Generate weather warnings
  static generateWarnings(windSpeed: number, seaState: number, visibility: number): string[] {
    const warnings: string[] = [];
    
    if (windSpeed > 25) warnings.push('Güçlü rüzgar uyarısı');
    if (seaState > 6) warnings.push('Çok kabaca deniz');
    if (visibility < 5) warnings.push('Düşük görüş uyarısı');
    if (windSpeed > 35) warnings.push('Fırtına uyarısı');
    if (seaState > 7) warnings.push('Şiddetli deniz koşulları');
    if (visibility < 2) warnings.push('Sis uyarısı');
    
    return warnings;
  }
}

// API integration functions (for future real-time data)
export class MeteorologyAPI {
  // Simulate fetching data from USCG
  static async fetchUSCGData(stationId: string): Promise<MaritimeWeatherData | null> {
    // In a real implementation, this would call the USCG API
    // For now, return simulated data
    const station = weatherStations.find(s => s.id === stationId && s.type === 'USCG');
    return station ? station.data : null;
  }

  // Simulate fetching data from NOAA
  static async fetchNOAAData(stationId: string): Promise<MaritimeWeatherData | null> {
    // In a real implementation, this would call the NOAA API
    const station = weatherStations.find(s => s.id === stationId && s.type === 'NOAA');
    return station ? station.data : null;
  }

  // Simulate fetching data from SeaVision
  static async fetchSeaVisionData(stationId: string): Promise<MaritimeWeatherData | null> {
    // In a real implementation, this would call the SeaVision API
    const station = weatherStations.find(s => s.id === stationId && s.type === 'SeaVision');
    return station ? station.data : null;
  }

  // Get all available stations
  static getAvailableStations(): WeatherStation[] {
    return weatherStations;
  }

  // Get station by ID
  static getStationById(id: string): WeatherStation | null {
    return weatherStations.find(s => s.id === id) || null;
  }

  // Get stations by type
  static getStationsByType(type: 'USCG' | 'NOAA' | 'SeaVision' | 'Local'): WeatherStation[] {
    return weatherStations.filter(s => s.type === type);
  }
}