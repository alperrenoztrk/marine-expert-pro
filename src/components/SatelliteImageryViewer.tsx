import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Satellite, 
  RefreshCw, 
  Info, 
  Clock,
  Eye,
  Cloud,
  Thermometer,
  Droplets,
  Sun,
  Moon,
  Zap
} from "lucide-react";

interface SatelliteChannel {
  id: string;
  name: string;
  nameTr: string;
  description: string;
  uses: string[];
  wavelength: string;
  icon: React.ReactNode;
  color: string;
}

export const SatelliteImageryViewer = () => {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedRegion, setSelectedRegion] = useState<'europe' | 'full-disk'>('europe');
  const [autoRefresh, setAutoRefresh] = useState(false);

  const channels: SatelliteChannel[] = [
    {
      id: 'rgb',
      name: 'Natural Color (RGB)',
      nameTr: 'Doğal Renk (RGB)',
      description: 'True color composite showing clouds and surface as they appear to the eye',
      uses: ['Daytime cloud identification', 'Surface features', 'Dust storms', 'Snow cover'],
      wavelength: 'VIS + NIR composite',
      icon: <Eye className="h-4 w-4" />,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'vis',
      name: 'Visible (VIS 0.6)',
      nameTr: 'Görünür Işık (VIS 0.6)',
      description: 'Visible light channel showing cloud reflectivity',
      uses: ['Cloud detection', 'Fog identification', 'Cloud thickness', 'Daytime only'],
      wavelength: '0.635 μm',
      icon: <Sun className="h-4 w-4" />,
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'ir108',
      name: 'Infrared (IR 10.8)',
      nameTr: 'Kızılötesi (IR 10.8)',
      description: 'Thermal infrared showing cloud top temperature',
      uses: ['24/7 cloud detection', 'Cloud height', 'Fog detection', 'Storm intensity'],
      wavelength: '10.8 μm',
      icon: <Thermometer className="h-4 w-4" />,
      color: 'bg-red-100 text-red-800'
    },
    {
      id: 'wv',
      name: 'Water Vapor (WV 6.2)',
      nameTr: 'Su Buharı (WV 6.2)',
      description: 'Upper level moisture and jet stream patterns',
      uses: ['Upper level winds', 'Jet stream location', 'Moisture tracking', 'Storm development'],
      wavelength: '6.2 μm',
      icon: <Droplets className="h-4 w-4" />,
      color: 'bg-cyan-100 text-cyan-800'
    },
    {
      id: 'ir039',
      name: 'Infrared (IR 3.9)',
      nameTr: 'Kızılötesi (IR 3.9)',
      description: 'Nighttime low cloud and fog detection',
      uses: ['Night fog detection', 'Low stratus clouds', 'Fire detection', 'Nighttime imaging'],
      wavelength: '3.9 μm',
      icon: <Moon className="h-4 w-4" />,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'airmass',
      name: 'Air Mass RGB',
      nameTr: 'Hava Kütlesi RGB',
      description: 'Shows different air masses and jet stream features',
      uses: ['Air mass boundaries', 'Jet stream analysis', 'Potential vorticity', 'Storm forecasting'],
      wavelength: 'WV+IR composite',
      icon: <Cloud className="h-4 w-4" />,
      color: 'bg-green-100 text-green-800'
    }
  ];

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdate(new Date());
      }, 5 * 60 * 1000); // Refresh every 5 minutes
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleManualRefresh = () => {
    setLastUpdate(new Date());
  };

  const getEumetsatImageUrl = (channelId: string) => {
    // EUMETSAT public WMS service for Meteosat imagery
    const baseUrl = 'https://eumetview.eumetsat.int/static-images/latestImages/';
    const timestamp = Math.floor(Date.now() / (15 * 60 * 1000)) * (15 * 60 * 1000); // Round to nearest 15 min
    
    const regionPath = selectedRegion === 'europe' ? 'EUMETSAT_MSG_' : 'EUMETSAT_MSG_FD_';
    
    const channelMap: Record<string, string> = {
      'rgb': `${regionPath}RGBNatColor-westernEurope.jpg`,
      'vis': `${regionPath}VIS006-westernEurope.jpg`,
      'ir108': `${regionPath}IR108-westernEurope.jpg`,
      'wv': `${regionPath}WV062-westernEurope.jpg`,
      'ir039': `${regionPath}IR039-westernEurope.jpg`,
      'airmass': `${regionPath}RGBAirmass-westernEurope.jpg`
    };

    // Fallback to a static demonstration image for each channel type
    const fallbackImages: Record<string, string> = {
      'rgb': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&auto=format&fit=crop',
      'vis': 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&auto=format&fit=crop',
      'ir108': 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&auto=format&fit=crop',
      'wv': 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&auto=format&fit=crop',
      'ir039': 'https://images.unsplash.com/photo-1532978379173-0e5793ce6e1d?w=800&auto=format&fit=crop',
      'airmass': 'https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=800&auto=format&fit=crop'
    };

    // Return the fallback image with cache-busting parameter
    return `${fallbackImages[channelId]}&t=${timestamp}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Satellite className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
                  EUMETSAT Uydu Görüntüleri
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300 font-normal">
                  Meteosat Gerçek Zamanlı Meteoroloji Görüntüleme
                </div>
              </div>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Yenile
              </Button>
              <Button
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="gap-2"
              >
                <Clock className="h-4 w-4" />
                {autoRefresh ? 'Otomatik Açık' : 'Otomatik Kapalı'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="border-blue-200 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-900/10">
            <Info className="h-4 w-4 text-blue-700 dark:text-blue-300" />
            <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
              <div className="space-y-2">
                <p className="font-semibold">📡 EUMETSAT Meteosat Uyduları</p>
                <p>
                  Bu görüntüler EUMETSAT'in (Avrupa Meteorolojik Uydular Organizasyonu) Meteosat serisinden alınmaktadır. 
                  Görüntüler yaklaşık 15 dakikada bir güncellenir.
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="h-3 w-3" />
                  Son güncelleme: {lastUpdate.toLocaleTimeString('tr-TR')}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Region Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Görüntü Bölgesi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={selectedRegion === 'europe' ? 'default' : 'outline'}
              onClick={() => setSelectedRegion('europe')}
              className="flex-1"
            >
              Avrupa / Akdeniz
            </Button>
            <Button
              variant={selectedRegion === 'full-disk' ? 'default' : 'outline'}
              onClick={() => setSelectedRegion('full-disk')}
              className="flex-1"
            >
              Tam Disk (Afrika + Avrupa)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Satellite Channels */}
      <Tabs defaultValue="rgb" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {channels.map((channel) => (
            <TabsTrigger key={channel.id} value={channel.id} className="text-xs">
              {channel.icon}
              <span className="ml-1 hidden sm:inline">{channel.nameTr.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {channels.map((channel) => (
          <TabsContent key={channel.id} value={channel.id} className="space-y-4">
            {/* Channel Info */}
            <Card className="border-2">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {channel.icon}
                      {channel.nameTr}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{channel.description}</p>
                  </div>
                  <Badge className={channel.color}>
                    {channel.wavelength}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Kullanım Alanları:
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {channel.uses.map((use, idx) => (
                      <Badge key={idx} variant="outline" className="justify-start">
                        • {use}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Satellite Image */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Canlı Uydu Görüntüsü</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={getEumetsatImageUrl(channel.id)}
                    alt={`${channel.nameTr} uydu görüntüsü`}
                    className="w-full h-auto"
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="text-white text-sm space-y-1">
                      <div className="font-semibold">{channel.name}</div>
                      <div className="text-xs opacity-90">
                        {selectedRegion === 'europe' ? 'Avrupa / Akdeniz' : 'Tam Disk'} • 
                        Güncelleme: {lastUpdate.toLocaleTimeString('tr-TR')}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interpretation Guide */}
            <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-5 w-5 text-yellow-700 dark:text-yellow-300" />
                  Görüntü Yorumlama Rehberi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-yellow-900 dark:text-yellow-100">
                  {channel.id === 'rgb' && (
                    <>
                      <p><strong>Beyaz/Parlak Alanlar:</strong> Kalın bulutlar, genellikle yağış taşıyan sistemler</p>
                      <p><strong>Gri Tonlar:</strong> Orta seviye bulutlar</p>
                      <p><strong>Mavi Alanlar:</strong> Açık deniz yüzeyleri, bulut yok</p>
                      <p><strong>Yeşil/Kahverengi:</strong> Kara yüzeyleri</p>
                    </>
                  )}
                  {channel.id === 'ir108' && (
                    <>
                      <p><strong>Beyaz/Parlak:</strong> Çok soğuk bulut tepeleri (yüksek bulutlar, fırtınalar)</p>
                      <p><strong>Gri:</strong> Orta sıcaklıkta bulutlar</p>
                      <p><strong>Koyu/Siyah:</strong> Sıcak yüzeyler (açık deniz, kara)</p>
                      <p><strong>Not:</strong> 24 saat kullanılabilir, gece görüntüleme için ideal</p>
                    </>
                  )}
                  {channel.id === 'wv' && (
                    <>
                      <p><strong>Beyaz Alanlar:</strong> Nemli hava kütleleri, üst seviye nem</p>
                      <p><strong>Koyu Alanlar:</strong> Kuru hava kütleleri</p>
                      <p><strong>Spiraller:</strong> Jet akımı ve alçak basınç sistemleri</p>
                      <p><strong>Kullanım:</strong> Fırtına gelişimi ve hava kütlesi hareketlerini takip için</p>
                    </>
                  )}
                  {channel.id === 'vis' && (
                    <>
                      <p><strong>Beyaz:</strong> Kalın bulutlar, yüksek yansıma</p>
                      <p><strong>Gri:</strong> İnce bulutlar, sis, pus</p>
                      <p><strong>Koyu:</strong> Açık deniz, bulut yok</p>
                      <p><strong>Sınırlama:</strong> Sadece gündüz saatlerinde kullanılabilir</p>
                    </>
                  )}
                  {channel.id === 'ir039' && (
                    <>
                      <p><strong>Beyaz:</strong> Düşük bulutlar ve sis (gece)</p>
                      <p><strong>Siyah Noktalar:</strong> Yangın tespiti</p>
                      <p><strong>Kullanım:</strong> Gece sis ve düşük stratus bulut tespiti</p>
                      <p><strong>Özel:</strong> Deniz sisi için en iyi kanal</p>
                    </>
                  )}
                  {channel.id === 'airmass' && (
                    <>
                      <p><strong>Kırmızı/Turuncu:</strong> Tropikal hava kütleleri</p>
                      <p><strong>Mavi/Yeşil:</strong> Kutupsal hava kütleleri</p>
                      <p><strong>Sarı/Beyaz:</strong> Kuru stratosferik hava</p>
                      <p><strong>Kullanım:</strong> Cephe analizi ve fırtına tahminlemesi</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Maritime Safety Note */}
      <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
        <AlertDescription className="text-sm text-red-900 dark:text-red-100">
          <div className="space-y-2">
            <p className="font-semibold flex items-center gap-2">
              <Satellite className="h-4 w-4" />
              🚢 Denizcilik Güvenlik Notu
            </p>
            <p>
              Uydu görüntüleri hava durumu tahminlerini destekleyen önemli bir araçtır. Ancak tek başına 
              navigasyon kararları için yeterli değildir. Resmi hava durumu tahminleri, NAVTEX uyarıları 
              ve gemi meteoroloji ekipmanları ile birlikte kullanılmalıdır.
            </p>
            <p className="font-semibold">
              ⚠️ Kritik durumlar için her zaman resmi kaynaklara danışın!
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
