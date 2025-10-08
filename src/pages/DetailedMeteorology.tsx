import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Cloud, 
  Wind, 
  Thermometer, 
  Droplets, 
  Eye, 
  Compass, 
  AlertTriangle, 
  Info, 
  Navigation,
  BarChart3,
  Map,
  Satellite,
  Waves,
  Sun,
  Moon,
  CloudRain,
  Zap,
  Activity,
  TrendingUp,
  Globe,
  Clock,
  Target,
  Shield,
  BookOpen,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import BackButton from "@/components/BackButton";

interface WeatherSystem {
  id: string;
  name: string;
  nameTr: string;
  type: 'low' | 'high' | 'front' | 'storm';
  description: string;
  characteristics: string[];
  maritimeImpact: string;
  safetyLevel: 'safe' | 'caution' | 'dangerous' | 'extreme';
  windSpeed: string;
  visibility: string;
  seaState: string;
  recommendations: string[];
  imageUrl?: string;
}

interface PressureSystem {
  id: string;
  name: string;
  pressure: string;
  characteristics: string[];
  weatherPattern: string;
  maritimeEffects: string[];
  windPattern: string;
  visibility: string;
  recommendations: string[];
}

interface StormType {
  id: string;
  name: string;
  nameTr: string;
  category: string;
  windSpeed: string;
  characteristics: string[];
  formation: string;
  tracking: string;
  maritimeDanger: string;
  safetyMeasures: string[];
  evacuation: string;
}

const DetailedMeteorology = () => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // USCG Weather Systems Data
  const weatherSystems: WeatherSystem[] = [
    {
      id: 'extratropical-cyclone',
      name: 'Extratropical Cyclone',
      nameTr: 'Ekstratropik Siklon',
      type: 'low',
      description: 'Large-scale low pressure system that forms outside the tropics',
      characteristics: [
        'Cold and warm fronts',
        'Counterclockwise rotation (Northern Hemisphere)',
        'Diameter: 1000-2000 km',
        'Life cycle: 3-7 days',
        'Associated with strong winds and precipitation'
      ],
      maritimeImpact: 'Major navigation hazard with strong winds, heavy seas, and poor visibility',
      safetyLevel: 'dangerous',
      windSpeed: '25-50+ knots',
      visibility: 'Poor to very poor',
      seaState: 'Rough to very rough',
      recommendations: [
        'Avoid center of low pressure',
        'Monitor barometric pressure trends',
        'Prepare for rapid weather changes',
        'Consider port shelter if possible'
      ]
    },
    {
      id: 'tropical-cyclone',
      name: 'Tropical Cyclone',
      nameTr: 'Tropik Siklon',
      type: 'storm',
      description: 'Intense rotating storm system with warm core',
      characteristics: [
        'Eye wall with strongest winds',
        'Symmetric structure',
        'Warm core system',
        'Diameter: 200-1000 km',
        'Life cycle: 1-3 weeks'
      ],
      maritimeImpact: 'Extreme danger with hurricane-force winds, massive seas, and torrential rain',
      safetyLevel: 'extreme',
      windSpeed: '64+ knots (Category 1+)',
      visibility: 'Very poor',
      seaState: 'Phenomenal',
      recommendations: [
        'Evacuate to safe harbor immediately',
        'Stay at least 200 nm from center',
        'Monitor official forecasts continuously',
        'Prepare for extended severe conditions'
      ]
    },
    {
      id: 'anticyclone',
      name: 'Anticyclone',
      nameTr: 'Antisiklon',
      type: 'high',
      description: 'High pressure system with clockwise rotation',
      characteristics: [
        'Clear skies and light winds',
        'Subsiding air',
        'Stable atmospheric conditions',
        'Diameter: 1000-3000 km',
        'Slow-moving system'
      ],
      maritimeImpact: 'Generally favorable conditions with good visibility and calm seas',
      safetyLevel: 'safe',
      windSpeed: '5-15 knots',
      visibility: 'Excellent',
      seaState: 'Calm to slight',
      recommendations: [
        'Ideal conditions for navigation',
        'Monitor for fog formation',
        'Watch for temperature inversions',
        'Maintain normal operations'
      ]
    },
    {
      id: 'cold-front',
      name: 'Cold Front',
      nameTr: 'Soğuk Cephe',
      type: 'front',
      description: 'Boundary between cold and warm air masses',
      characteristics: [
        'Sharp temperature drop',
        'Wind shift to northwest',
        'Cumulonimbus clouds',
        'Squall line formation',
        'Rapid pressure rise'
      ],
      maritimeImpact: 'Sudden weather changes with strong winds, thunderstorms, and rough seas',
      safetyLevel: 'dangerous',
      windSpeed: '20-40 knots',
      visibility: 'Poor during passage',
      seaState: 'Moderate to rough',
      recommendations: [
        'Prepare for sudden wind shifts',
        'Secure all loose equipment',
        'Monitor for squall lines',
        'Reduce speed during passage'
      ]
    },
    {
      id: 'warm-front',
      name: 'Warm Front',
      nameTr: 'Sıcak Cephe',
      type: 'front',
      description: 'Boundary where warm air overrides cold air',
      characteristics: [
        'Gradual temperature rise',
        'Widespread cloud cover',
        'Steady precipitation',
        'Poor visibility',
        'Slow pressure fall'
      ],
      maritimeImpact: 'Extended periods of poor visibility and moderate seas',
      safetyLevel: 'caution',
      windSpeed: '10-25 knots',
      visibility: 'Poor to moderate',
      seaState: 'Slight to moderate',
      recommendations: [
        'Monitor visibility closely',
        'Use radar navigation',
        'Prepare for extended poor weather',
        'Maintain safe speed'
      ]
    }
  ];

  // SeaVision Pressure Systems Data
  const pressureSystems: PressureSystem[] = [
    {
      id: 'deep-low',
      name: 'Deep Low Pressure',
      pressure: '< 980 hPa',
      characteristics: [
        'Intense pressure gradient',
        'Strong winds',
        'Heavy precipitation',
        'Rapid development',
        'Unstable atmosphere'
      ],
      weatherPattern: 'Severe weather with gale to storm force winds',
      maritimeEffects: [
        'Very rough to high seas',
        'Poor visibility',
        'Heavy rain or snow',
        'Strong wind shear',
        'Dangerous navigation conditions'
      ],
      windPattern: 'Strong winds 25-50+ knots',
      visibility: 'Poor to very poor',
      recommendations: [
        'Avoid if possible',
        'Seek sheltered waters',
        'Reduce speed significantly',
        'Monitor weather updates',
        'Prepare for emergency procedures'
      ]
    },
    {
      id: 'shallow-low',
      name: 'Shallow Low Pressure',
      pressure: '980-1000 hPa',
      characteristics: [
        'Moderate pressure gradient',
        'Moderate winds',
        'Variable precipitation',
        'Slow development',
        'Mixed weather conditions'
      ],
      weatherPattern: 'Unsettled weather with moderate winds and precipitation',
      maritimeEffects: [
        'Moderate seas',
        'Variable visibility',
        'Light to moderate precipitation',
        'Moderate wind shear',
        'Manageable navigation conditions'
      ],
      windPattern: 'Moderate winds 15-30 knots',
      visibility: 'Moderate to good',
      recommendations: [
        'Monitor conditions closely',
        'Adjust course if needed',
        'Maintain normal speed',
        'Watch for weather changes',
        'Prepare for moderate conditions'
      ]
    },
    {
      id: 'high-pressure',
      name: 'High Pressure System',
      pressure: '> 1020 hPa',
      characteristics: [
        'Weak pressure gradient',
        'Light winds',
        'Clear skies',
        'Stable conditions',
        'Subsiding air'
      ],
      weatherPattern: 'Fair weather with light winds and good visibility',
      maritimeEffects: [
        'Calm to slight seas',
        'Excellent visibility',
        'Minimal precipitation',
        'Light winds',
        'Favorable navigation conditions'
      ],
      windPattern: 'Light winds 5-15 knots',
      visibility: 'Excellent',
      recommendations: [
        'Ideal navigation conditions',
        'Monitor for fog formation',
        'Maintain normal operations',
        'Watch for temperature inversions',
        'Enjoy favorable weather'
      ]
    }
  ];

  // Storm Classification Data
  const stormTypes: StormType[] = [
    {
      id: 'hurricane-cat1',
      name: 'Category 1 Hurricane',
      nameTr: 'Kategori 1 Kasırga',
      category: 'Category 1',
      windSpeed: '64-82 knots (119-153 km/h)',
      characteristics: [
        'Very dangerous winds',
        'Some damage to structures',
        'Large storm surge',
        'Heavy rainfall',
        'Tornadoes possible'
      ],
      formation: 'Forms over warm ocean waters (26.5°C+) with low wind shear',
      tracking: 'Tracked by satellite, radar, and aircraft reconnaissance',
      maritimeDanger: 'Extreme danger to all vessels',
      safetyMeasures: [
        'Evacuate to safe harbor',
        'Stay at least 200 nm from center',
        'Monitor continuous updates',
        'Prepare for extended severe weather',
        'Secure all equipment'
      ],
      evacuation: 'Immediate evacuation recommended'
    },
    {
      id: 'hurricane-cat5',
      name: 'Category 5 Hurricane',
      nameTr: 'Kategori 5 Kasırga',
      category: 'Category 5',
      windSpeed: '137+ knots (252+ km/h)',
      characteristics: [
        'Catastrophic winds',
        'Massive destruction',
        'Extreme storm surge',
        'Torrential rainfall',
        'Multiple tornadoes'
      ],
      formation: 'Requires perfect conditions: warm water, low shear, high humidity',
      tracking: 'Intensive monitoring with aircraft and satellite',
      maritimeDanger: 'Certain death for any vessel caught in path',
      safetyMeasures: [
        'Immediate evacuation mandatory',
        'Stay at least 300 nm from center',
        'Continuous monitoring required',
        'Prepare for catastrophic conditions',
        'Emergency procedures activated'
      ],
      evacuation: 'Mandatory evacuation - no exceptions'
    },
    {
      id: 'extratropical-storm',
      name: 'Extratropical Storm',
      nameTr: 'Ekstratropik Fırtına',
      category: 'Gale/Storm',
      windSpeed: '34-63+ knots',
      characteristics: [
        'Cold core system',
        'Frontal boundaries',
        'Variable intensity',
        'Large size',
        'Long duration'
      ],
      formation: 'Forms from temperature contrasts between air masses',
      tracking: 'Monitored by weather models and satellite imagery',
      maritimeDanger: 'High danger with strong winds and rough seas',
      safetyMeasures: [
        'Avoid center of low pressure',
        'Monitor barometric pressure',
        'Prepare for rapid changes',
        'Reduce speed significantly',
        'Consider port shelter'
      ],
      evacuation: 'Consider port shelter if conditions deteriorate'
    }
  ];

  const getSafetyColor = (level: string) => {
    switch (level) {
      case 'safe': return 'bg-green-100 text-green-800 border-green-200';
      case 'caution': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'dangerous': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'extreme': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSafetyIcon = (level: string) => {
    switch (level) {
      case 'safe': return <Shield className="h-4 w-4" />;
      case 'caution': return <AlertTriangle className="h-4 w-4" />;
      case 'dangerous': return <AlertTriangle className="h-4 w-4" />;
      case 'extreme': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <BackButton />
        </div>

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Cloud className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Meteoroloji Konu Anlatımı
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            USCG ve SeaVision kaynaklarından derlenen kapsamlı meteoroloji rehberi
          </p>
        </div>

        {/* Data Sources Alert */}
        <Alert className="border-2 border-blue-300 dark:border-blue-600 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20">
          <div className="flex items-start gap-3">
            <div className="bg-blue-600 dark:bg-blue-500 rounded-full p-2 mt-1">
              <Info className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                📡 Veri Kaynakları
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Bu konu anlatımı <span className="font-semibold">US Coast Guard (USCG)</span> ve 
                <span className="font-semibold"> SeaVision</span> meteoroloji verilerinden derlenmiştir. 
                Tüm bilgiler denizcilik güvenliği standartlarına uygun olarak hazırlanmıştır.
              </p>
            </div>
          </div>
        </Alert>

        <Tabs defaultValue="systems" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="systems">Hava Sistemleri</TabsTrigger>
            <TabsTrigger value="pressure">Basınç Sistemleri</TabsTrigger>
            <TabsTrigger value="storms">Fırtına Türleri</TabsTrigger>
            <TabsTrigger value="forecasting">Tahmin Yöntemleri</TabsTrigger>
            <TabsTrigger value="safety">Güvenlik Rehberi</TabsTrigger>
          </TabsList>

          {/* Weather Systems Tab */}
          <TabsContent value="systems" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-6 w-6 text-blue-600" />
                  Hava Sistemleri ve Denizcilik Etkileri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {weatherSystems.map((system) => (
                    <Card key={system.id} className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {system.type === 'low' && <Wind className="h-5 w-5 text-blue-600" />}
                              {system.type === 'high' && <Sun className="h-5 w-5 text-yellow-600" />}
                              {system.type === 'front' && <CloudRain className="h-5 w-5 text-gray-600" />}
                              {system.type === 'storm' && <Zap className="h-5 w-5 text-red-600" />}
                              <CardTitle className="text-lg">{system.nameTr}</CardTitle>
                            </div>
                            <Badge className={getSafetyColor(system.safetyLevel)}>
                              {getSafetyIcon(system.safetyLevel)}
                              <span className="ml-1">
                                {system.safetyLevel === 'safe' ? 'Güvenli' :
                                 system.safetyLevel === 'caution' ? 'Dikkatli' :
                                 system.safetyLevel === 'dangerous' ? 'Tehlikeli' : 'Çok Tehlikeli'}
                              </span>
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSection(system.id)}
                          >
                            {expandedSections[system.id] ? 
                              <ChevronUp className="h-4 w-4" /> : 
                              <ChevronDown className="h-4 w-4" />
                            }
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{system.description}</p>
                      </CardHeader>
                      
                      {expandedSections[system.id] && (
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                Özellikler
                              </h4>
                              <ul className="text-sm space-y-1">
                                {system.characteristics.map((char, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>{char}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <Navigation className="h-4 w-4" />
                                Denizcilik Etkileri
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <Wind className="h-3 w-3 text-blue-600" />
                                  <span><strong>Rüzgar:</strong> {system.windSpeed}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Eye className="h-3 w-3 text-blue-600" />
                                  <span><strong>Görüş:</strong> {system.visibility}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Waves className="h-3 w-3 text-blue-600" />
                                  <span><strong>Deniz Durumu:</strong> {system.seaState}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              Güvenlik Önerileri
                            </h4>
                            <ul className="text-sm space-y-1">
                              {system.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-green-600 mt-1">✓</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pressure Systems Tab */}
          <TabsContent value="pressure" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                  Basınç Sistemleri ve Denizcilik
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {pressureSystems.map((system) => (
                    <Card key={system.id} className="border-l-4 border-l-green-500">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-green-600" />
                          {system.name}
                          <Badge variant="outline" className="ml-auto">
                            {system.pressure}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{system.weatherPattern}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Özellikler</h4>
                            <ul className="text-sm space-y-1">
                              {system.characteristics.map((char, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-green-600 mt-1">•</span>
                                  <span>{char}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Denizcilik Etkileri</h4>
                            <ul className="text-sm space-y-1">
                              {system.maritimeEffects.map((effect, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-blue-600 mt-1">•</span>
                                  <span>{effect}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <Wind className="h-4 w-4 text-blue-600" />
                            <span className="text-sm"><strong>Rüzgar:</strong> {system.windPattern}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-blue-600" />
                            <span className="text-sm"><strong>Görüş:</strong> {system.visibility}</span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Öneriler</h4>
                          <ul className="text-sm space-y-1">
                            {system.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-green-600 mt-1">✓</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Storm Types Tab */}
          <TabsContent value="storms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-red-600" />
                  Fırtına Türleri ve Sınıflandırma
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {stormTypes.map((storm) => (
                    <Card key={storm.id} className="border-l-4 border-l-red-500">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Zap className="h-6 w-6 text-red-600" />
                            <div>
                              <CardTitle className="text-lg">{storm.nameTr}</CardTitle>
                              <p className="text-sm text-muted-foreground">{storm.category}</p>
                            </div>
                          </div>
                          <Badge variant="destructive" className="text-sm">
                            {storm.windSpeed}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Özellikler</h4>
                            <ul className="text-sm space-y-1">
                              {storm.characteristics.map((char, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-red-600 mt-1">•</span>
                                  <span>{char}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Oluşum</h4>
                            <p className="text-sm">{storm.formation}</p>
                            <h4 className="font-semibold text-sm mb-2 mt-3">Takip</h4>
                            <p className="text-sm">{storm.tracking}</p>
                          </div>
                        </div>
                        
                        <Alert className="border-red-200 bg-red-50">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <AlertDescription>
                            <strong>Denizcilik Tehlikesi:</strong> {storm.maritimeDanger}
                          </AlertDescription>
                        </Alert>
                        
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Güvenlik Önlemleri</h4>
                          <ul className="text-sm space-y-1">
                            {storm.safetyMeasures.map((measure, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-red-600 mt-1">⚠</span>
                                <span>{measure}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-red-100 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <span className="font-semibold text-red-800">Tahliye:</span>
                          </div>
                          <p className="text-sm text-red-700 mt-1">{storm.evacuation}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forecasting Methods Tab */}
          <TabsContent value="forecasting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Satellite className="h-6 w-6 text-purple-600" />
                  Meteoroloji Tahmin Yöntemleri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Satellite Imagery */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Satellite className="h-5 w-5 text-purple-600" />
                    Uydu Görüntüleme
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-purple-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Görünür Spektrum (VIS)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>• Gündüz bulut yapıları</li>
                          <li>• Bulut kalınlığı analizi</li>
                          <li>• Fırtına gelişimi takibi</li>
                          <li>• Deniz yüzeyi gözlemi</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-purple-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Kızılötesi (IR)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>• Gece/gündüz sürekli gözlem</li>
                          <li>• Bulut yüksekliği tespiti</li>
                          <li>• Sıcaklık analizi</li>
                          <li>• Fırtına tepesi tespiti</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-purple-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Su Buharı (WV)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>• Atmosferik nem analizi</li>
                          <li>• Jet stream takibi</li>
                          <li>• Cephe sistemleri</li>
                          <li>• Üst seviye rüzgarlar</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-purple-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Mikrodalga</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>• Yağış tespiti</li>
                          <li>• Bulut içi su içeriği</li>
                          <li>• Tropik siklon analizi</li>
                          <li>• Deniz yüzeyi sıcaklığı</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                {/* Weather Models */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Hava Durumu Modelleri
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">GFS (Global)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>• Küresel kapsam</li>
                          <li>• 15 km çözünürlük</li>
                          <li>• 16 gün tahmin</li>
                          <li>• 6 saatlik güncellemeler</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">ECMWF (Avrupa)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>• Yüksek doğruluk</li>
                          <li>• 9 km çözünürlük</li>
                          <li>• 10 gün tahmin</li>
                          <li>• 12 saatlik güncellemeler</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">WRF (Yerel)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>• Yüksek çözünürlük</li>
                          <li>• 1-3 km çözünürlük</li>
                          <li>• 48 saat tahmin</li>
                          <li>• Detaylı yerel analiz</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                {/* Marine Weather Services */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-purple-600" />
                    Denizcilik Meteoroloji Servisleri
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">USCG Weather</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>• VHF hava durumu yayınları</li>
                          <li>• Günlük denizcilik tahminleri</li>
                          <li>• Fırtına uyarıları</li>
                          <li>• Navigasyon güvenliği</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">NOAA Marine</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>• Detaylı deniz tahminleri</li>
                          <li>• Dalga yüksekliği modelleri</li>
                          <li>• Akıntı tahminleri</li>
                          <li>• Tropik siklon takibi</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Safety Guide Tab */}
          <TabsContent value="safety" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-green-600" />
                  Denizcilik Güvenlik Rehberi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Pre-Voyage Planning */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    Seyir Öncesi Planlama
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Hava Durumu Analizi</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>• 72 saatlik tahmin incelemesi</li>
                          <li>• Basınç haritaları analizi</li>
                          <li>• Rüzgar ve dalga tahminleri</li>
                          <li>• Alternatif rota planlaması</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Güvenlik Kontrolü</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>• Acil durum ekipmanları</li>
                          <li>• İletişim sistemleri</li>
                          <li>• Navigasyon cihazları</li>
                          <li>• Güvenlik donanımları</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                {/* Weather Monitoring */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    Seyir Sırasında İzleme
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Sürekli İzleme</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>• Barometrik basınç takibi</li>
                          <li>• Rüzgar yönü ve hızı</li>
                          <li>• Görüş mesafesi</li>
                          <li>• Deniz durumu</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Uyarı Sinyalleri</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>• Ani basınç düşüşü</li>
                          <li>• Rüzgar yönü değişimi</li>
                          <li>• Görüş azalması</li>
                          <li>• Dalga yüksekliği artışı</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Acil Durum</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>• Güvenli liman arama</li>
                          <li>• Hız azaltma</li>
                          <li>• Personel güvenliği</li>
                          <li>• İletişim kurma</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                {/* Emergency Procedures */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Acil Durum Prosedürleri
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription>
                        <strong>Fırtına Yaklaşımı:</strong> Derhal güvenli liman ara, hızı azalt, 
                        tüm ekipmanları sabitle, personeli güvenli alanlara yönlendir.
                      </AlertDescription>
                    </Alert>
                    
                    <Alert className="border-orange-200 bg-orange-50">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <AlertDescription>
                        <strong>Görüş Kaybı:</strong> Radar kullan, hızı azalt, 
                        sis düdüğü çal, VHF ile konum bildir.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                <Separator />

                {/* Communication */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    İletişim ve Yardım
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-purple-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Acil İletişim</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>• VHF Kanal 16 (156.8 MHz)</li>
                          <li>• EPIRB aktivasyonu</li>
                          <li>• Satelit telefon</li>
                          <li>• AIS acil durum sinyali</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-purple-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Bilgi Kaynakları</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1">
                          <li>• NOAA Weather Radio</li>
                          <li>• USCG Broadcasts</li>
                          <li>• Marine Weather Apps</li>
                          <li>• Satellite Weather</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-6">
          <p>
            Bu rehber US Coast Guard ve SeaVision meteoroloji verilerinden derlenmiştir. 
            Tüm bilgiler denizcilik güvenliği standartlarına uygun olarak hazırlanmıştır.
          </p>
          <p className="mt-2">
            <strong>Önemli:</strong> Hava durumu tahminleri değişebilir. 
            Seyir öncesi ve sırasında güncel bilgileri takip edin.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailedMeteorology;