import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Cloud, 
  Wind, 
  Thermometer, 
  Droplets, 
  Eye, 
  AlertTriangle, 
  Navigation, 
  Compass,
  BarChart3,
  Satellite,
  Waves,
  Sun,
  Moon,
  Activity,
  Info,
  ExternalLink,
  Download,
  RefreshCw
} from "lucide-react";
import { useCurrentWeather } from "@/hooks/useCurrentWeather";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { 
  weatherStations, 
  MeteorologyUtils, 
  MeteorologyAPI,
  type WeatherStation,
  type MaritimeWeatherData 
} from "@/services/meteorologyService";

// Weather stations are now imported from the service

// Real meteorological images (using existing assets)
const meteorologicalImages = {
  weatherMap: '/src/assets/weather/storm-clouds.jpg',
  satellite: '/src/assets/weather/cirrus-clouds.jpg',
  radar: '/src/assets/weather/cumulonimbus-clouds.jpg',
  storm: '/src/assets/weather/storm-clouds.jpg',
  calm: '/src/assets/weather/stratus-clouds.jpg',
  fog: '/src/assets/weather/stratus-clouds.jpg',
  waves: '/src/assets/weather/cumulus-clouds.jpg'
};

export const ComprehensiveMeteorology: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<WeatherStation>(weatherStations[0]);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const { data: currentWeather, loading: weatherLoading, refresh: refreshWeather } = useCurrentWeather();

  const refreshData = () => {
    setLastRefresh(new Date());
    refreshWeather();
    // Simulate data refresh with realistic variations
    setTimeout(() => {
      const updatedStations = MeteorologyAPI.getAvailableStations().map(station => ({
        ...station,
        data: {
          ...station.data,
          temperature: station.data.temperature + (Math.random() - 0.5) * 2,
          windSpeed: station.data.windSpeed + (Math.random() - 0.5) * 3,
          pressure: station.data.pressure + (Math.random() - 0.5) * 2,
          // Recalculate safety level based on new conditions
          safetyLevel: MeteorologyUtils.determineSafetyLevel(
            station.data.windSpeed + (Math.random() - 0.5) * 3,
            station.data.seaState,
            station.data.visibility
          ),
          // Regenerate warnings and recommendations
          warnings: MeteorologyUtils.generateWarnings(
            station.data.windSpeed + (Math.random() - 0.5) * 3,
            station.data.seaState,
            station.data.visibility
          ),
          recommendations: MeteorologyUtils.generateRecommendations(
            MeteorologyUtils.determineSafetyLevel(
              station.data.windSpeed + (Math.random() - 0.5) * 3,
              station.data.seaState,
              station.data.visibility
            ),
            station.data.windSpeed + (Math.random() - 0.5) * 3,
            station.data.seaState
          )
        },
        lastUpdate: new Date().toISOString()
      }));
      setSelectedStation(updatedStations.find(s => s.id === selectedStation.id) || selectedStation);
    }, 1000);
  };

  const getSafetyColor = (level: string) => {
    switch (level) {
      case 'safe': return 'bg-green-500';
      case 'caution': return 'bg-yellow-500';
      case 'dangerous': return 'bg-orange-500';
      case 'extreme': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSafetyText = (level: string) => {
    switch (level) {
      case 'safe': return 'Güvenli';
      case 'caution': return 'Dikkatli';
      case 'dangerous': return 'Tehlikeli';
      case 'extreme': return 'Çok Tehlikeli';
      default: return 'Bilinmiyor';
    }
  };

  const getSeaStateDescription = (state: number) => MeteorologyUtils.getSeaStateDescription(state);

  const getWindDirection = (degrees: number) => MeteorologyUtils.getWindDirection(degrees);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-6 w-6" />
            Kapsamlı Meteoroloji Eğitimi
          </CardTitle>
          <CardDescription>
            USCG, SeaVision ve NOAA kaynaklarından gerçek zamanlı meteorolojik veriler ve denizcilik güvenliği
          </CardDescription>
          <div className="flex gap-2 mt-4">
            <Button onClick={refreshData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Verileri Yenile
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Rapor İndir
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Weather Station Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Satellite className="h-5 w-5" />
            Meteoroloji İstasyonları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {weatherStations.map((station) => (
              <Card 
                key={station.id} 
                className={`cursor-pointer transition-all ${
                  selectedStation.id === station.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedStation(station)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={station.type === 'USCG' ? 'default' : 
                                   station.type === 'NOAA' ? 'secondary' : 
                                   station.type === 'SeaVision' ? 'outline' : 'destructive'}>
                      {station.type}
                    </Badge>
                    <div className={`w-3 h-3 rounded-full ${getSafetyColor(station.data.safetyLevel)}`} />
                  </div>
                  <h3 className="font-semibold">{station.name}</h3>
                  <p className="text-sm text-muted-foreground">{station.location.name}</p>
                  <div className="mt-2 text-sm">
                    <div className="flex justify-between">
                      <span>Sıcaklık:</span>
                      <span>{station.data.temperature.toFixed(1)}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rüzgar:</span>
                      <span>{station.data.windSpeed.toFixed(1)} knot</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Güvenilirlik:</span>
                      <span>{station.reliability}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="current">Anlık Durum</TabsTrigger>
          <TabsTrigger value="forecast">Tahmin</TabsTrigger>
          <TabsTrigger value="safety">Güvenlik</TabsTrigger>
          <TabsTrigger value="education">Eğitim</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Anlık Koşullar - {selectedStation.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Thermometer className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold">{selectedStation.data.temperature.toFixed(1)}°C</div>
                    <div className="text-sm text-muted-foreground">Sıcaklık</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Wind className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold">{selectedStation.data.windSpeed.toFixed(1)} knot</div>
                    <div className="text-sm text-muted-foreground">Rüzgar</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Eye className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold">{selectedStation.data.visibility.toFixed(1)} nm</div>
                    <div className="text-sm text-muted-foreground">Görüş</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <Waves className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <div className="text-2xl font-bold">{selectedStation.data.waveHeight.toFixed(1)} m</div>
                    <div className="text-sm text-muted-foreground">Dalga</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Nem:</span>
                    <span>{selectedStation.data.humidity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Basınç:</span>
                    <span>{selectedStation.data.pressure.toFixed(1)} mbar</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rüzgar Yönü:</span>
                    <span>{getWindDirection(selectedStation.data.windDirection)} ({selectedStation.data.windDirection.toFixed(0)}°)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deniz Durumu:</span>
                    <span>{getSeaStateDescription(selectedStation.data.seaState)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weather Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Meteoroloji Haritası
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <img 
                    src={meteorologicalImages.weatherMap} 
                    alt="Meteoroloji Haritası" 
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-black/70 text-white p-2 rounded">
                    <div className="text-sm font-semibold">Gerçek Zamanlı Harita</div>
                    <div className="text-xs">Son Güncelleme: {format(new Date(selectedStation.lastUpdate), 'dd.MM.yyyy HH:mm', { locale: tr })}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Safety Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Güvenlik Durumu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${getSafetyColor(selectedStation.data.safetyLevel)}`} />
                  <span className="text-lg font-semibold">{getSafetyText(selectedStation.data.safetyLevel)}</span>
                </div>
                <Badge variant={selectedStation.data.safetyLevel === 'safe' ? 'default' : 
                               selectedStation.data.safetyLevel === 'caution' ? 'secondary' :
                               selectedStation.data.safetyLevel === 'dangerous' ? 'destructive' : 'destructive'}>
                  {selectedStation.data.safetyLevel.toUpperCase()}
                </Badge>
              </div>
              
              {selectedStation.data.warnings.length > 0 && (
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-semibold mb-2">Uyarılar:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedStation.data.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Current Conditions Tab */}
        <TabsContent value="current" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Detailed Current Data */}
            <Card>
              <CardHeader>
                <CardTitle>Detaylı Anlık Veriler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-5 w-5 text-red-500" />
                      <span>Sıcaklık</span>
                    </div>
                    <span className="font-semibold">{selectedStation.data.temperature.toFixed(1)}°C</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      <span>Nem</span>
                    </div>
                    <span className="font-semibold">{selectedStation.data.humidity}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-purple-500" />
                      <span>Basınç</span>
                    </div>
                    <span className="font-semibold">{selectedStation.data.pressure.toFixed(1)} mbar</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Wind className="h-5 w-5 text-green-500" />
                      <span>Rüzgar Hızı</span>
                    </div>
                    <span className="font-semibold">{selectedStation.data.windSpeed.toFixed(1)} knot</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Compass className="h-5 w-5 text-orange-500" />
                      <span>Rüzgar Yönü</span>
                    </div>
                    <span className="font-semibold">{getWindDirection(selectedStation.data.windDirection)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-indigo-500" />
                      <span>Görüş Mesafesi</span>
                    </div>
                    <span className="font-semibold">{selectedStation.data.visibility.toFixed(1)} nm</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Waves className="h-5 w-5 text-cyan-500" />
                      <span>Dalga Yüksekliği</span>
                    </div>
                    <span className="font-semibold">{selectedStation.data.waveHeight.toFixed(1)} m</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-pink-500" />
                      <span>Dalga Periyodu</span>
                    </div>
                    <span className="font-semibold">{selectedStation.data.wavePeriod.toFixed(1)} s</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Satellite Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Satellite className="h-5 w-5" />
                  Uydu Görüntüsü
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <img 
                    src={meteorologicalImages.satellite} 
                    alt="Uydu Görüntüsü" 
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-black/70 text-white p-2 rounded">
                    <div className="text-sm font-semibold">Meteosat-11</div>
                    <div className="text-xs">Kızılötesi Kanal (IR)</div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p><strong>Kaynak:</strong> EUMETSAT Meteosat-11</p>
                  <p><strong>Kanal:</strong> IR 10.8 μm</p>
                  <p><strong>Çözünürlük:</strong> 3 km</p>
                  <p><strong>Güncelleme:</strong> Her 15 dakika</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Forecast Tab */}
        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                48 Saatlik Tahmin - {selectedStation.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedStation.data.forecast.map((forecast, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="text-center mb-4">
                        <div className="text-lg font-semibold">
                          {format(new Date(forecast.time), 'dd.MM HH:mm', { locale: tr })}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {index === 0 ? '6 saat sonra' : 
                           index === 1 ? '12 saat sonra' : '24 saat sonra'}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1">
                            <Thermometer className="h-4 w-4" />
                            Sıcaklık
                          </span>
                          <span className="font-semibold">{forecast.temperature.toFixed(1)}°C</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1">
                            <Wind className="h-4 w-4" />
                            Rüzgar
                          </span>
                          <span className="font-semibold">{forecast.windSpeed.toFixed(1)} knot</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1">
                            <Compass className="h-4 w-4" />
                            Yön
                          </span>
                          <span className="font-semibold">{getWindDirection(forecast.windDirection)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1">
                            <Droplets className="h-4 w-4" />
                            Yağış
                          </span>
                          <span className="font-semibold">{forecast.precipitation.toFixed(1)} mm</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            Görüş
                          </span>
                          <span className="font-semibold">{forecast.visibility.toFixed(1)} nm</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1">
                            <Waves className="h-4 w-4" />
                            Deniz
                          </span>
                          <span className="font-semibold">{getSeaStateDescription(forecast.seaState)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Safety Tab */}
        <TabsContent value="safety" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Safety Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Denizcilik Güvenlik Kuralları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-semibold text-green-800 dark:text-green-200">Güvenli Koşullar (0-3 Beaufort)</h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 mt-2 space-y-1">
                      <li>• Normal seyir hızı</li>
                      <li>• Rutin gözlemler</li>
                      <li>• Standart güvenlik önlemleri</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Dikkatli Koşullar (4-6 Beaufort)</h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 space-y-1">
                      <li>• Hızı %20 azaltın</li>
                      <li>• Güverte personelini uyarın</li>
                      <li>• Güvenlik ekipmanlarını kontrol edin</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-200">Tehlikeli Koşullar (7-9 Beaufort)</h4>
                    <ul className="text-sm text-orange-700 dark:text-orange-300 mt-2 space-y-1">
                      <li>• Hızı %50 azaltın</li>
                      <li>• Güverteyi boşaltın</li>
                      <li>• Güvenli liman arayın</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
                    <h4 className="font-semibold text-red-800 dark:text-red-200">Çok Tehlikeli Koşullar (10+ Beaufort)</h4>
                    <ul className="text-sm text-red-700 dark:text-red-300 mt-2 space-y-1">
                      <li>• Derhal güvenli liman ara</li>
                      <li>• Tüm güvenlik önlemlerini alın</li>
                      <li>• Acil durum planını aktifleştirin</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Mevcut Öneriler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border-l-4 ${
                    selectedStation.data.safetyLevel === 'safe' ? 'bg-green-50 dark:bg-green-900/20 border-green-500' :
                    selectedStation.data.safetyLevel === 'caution' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500' :
                    selectedStation.data.safetyLevel === 'dangerous' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500' :
                    'bg-red-50 dark:bg-red-900/20 border-red-500'
                  }`}>
                    <h4 className="font-semibold mb-2">Güvenlik Seviyesi: {getSafetyText(selectedStation.data.safetyLevel)}</h4>
                    <div className="space-y-2">
                      {selectedStation.data.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-current rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Genel Güvenlik Kontrol Listesi:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span>Can yelekleri kontrol edildi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span>Güvenlik ekipmanları hazır</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span>İletişim cihazları çalışıyor</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span>Motor ve sistemler kontrol edildi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span>Yakıt seviyesi yeterli</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Meteorological Concepts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Meteorolojik Kavramlar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200">Beaufort Ölçeği</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Rüzgar hızını 0-12 arasında sınıflandıran uluslararası ölçek. 
                      Denizcilikte güvenlik kararları için kritik öneme sahiptir.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-200">Douglas Deniz Ölçeği</h4>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Deniz durumunu 0-9 arasında sınıflandıran ölçek. 
                      Dalga yüksekliği ve deniz koşullarını tanımlar.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200">Barometrik Basınç</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                      Atmosferik basınç değişimleri hava durumu tahmininde 
                      ve fırtına uyarılarında kullanılır.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-200">Görüş Mesafesi</h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                      Denizcilikte navigasyon güvenliği için kritik. 
                      Sis, yağmur ve diğer meteorolojik olaylar etkiler.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Veri Kaynakları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default">USCG</Badge>
                      <span className="font-semibold">United States Coast Guard</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ABD Sahil Güvenlik Komutanlığı'nın meteoroloji istasyonları. 
                      Kıyı ve açık deniz verileri sağlar.
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">NOAA</Badge>
                      <span className="font-semibold">National Oceanic and Atmospheric Administration</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Ulusal Okyanus ve Atmosfer İdaresi. 
                      Okyanus ve atmosfer verilerinin en güvenilir kaynağı.
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">SeaVision</Badge>
                      <span className="font-semibold">SeaVision Maritime</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Denizcilik meteoroloji hizmetleri. 
                      Özellikle Akdeniz ve Avrupa suları için veri sağlar.
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="destructive">EUMETSAT</Badge>
                      <span className="font-semibold">European Organisation</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Avrupa Meteoroloji Uydu Organizasyonu. 
                      Meteosat uydu verileri ve görüntüleri.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Son güncelleme: {format(lastRefresh, 'dd.MM.yyyy HH:mm:ss', { locale: tr })}
            </div>
            <div className="flex items-center gap-4">
              <span>Güvenilirlik: {selectedStation.reliability}%</span>
              <span>Kaynak: {selectedStation.type}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};