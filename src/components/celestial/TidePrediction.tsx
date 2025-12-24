import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Waves, ArrowUp, ArrowDown, Moon, Sun, Calendar, Info } from "lucide-react";
import { 
  calculateDailyTides, 
  calculateWeeklyTides,
  turkishPorts,
  formatTideTime,
  getTidalStrength,
  type DailyTides,
  type PortInfo
} from "@/utils/tideCalculator";
import { getMoonPhase } from "@/utils/moonPhase";

interface TidePredictionProps {
  selectedDate: Date;
}

export function TidePrediction({ selectedDate }: TidePredictionProps) {
  const [selectedPort, setSelectedPort] = useState<PortInfo>(turkishPorts[0]);
  
  // Calculate tides for selected date and port
  const dailyTides = useMemo(() => {
    return calculateDailyTides(selectedDate, selectedPort.highTideOffset, selectedPort.factor);
  }, [selectedDate, selectedPort]);
  
  // Calculate weekly tides
  const weeklyTides = useMemo(() => {
    return calculateWeeklyTides(selectedDate, selectedPort.highTideOffset, selectedPort.factor);
  }, [selectedDate, selectedPort]);
  
  const moonPhase = getMoonPhase(selectedDate);
  const tidalStrength = getTidalStrength(dailyTides.tidalRange);
  
  return (
    <div className="space-y-4">
      {/* Port Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Waves className="h-5 w-5 text-blue-500" />
            Gelgit Tahmini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Liman/Bölge:</label>
              <Select 
                value={selectedPort.name}
                onValueChange={(value) => {
                  const port = turkishPorts.find(p => p.name === value);
                  if (port) setSelectedPort(port);
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {turkishPorts.map(port => (
                    <SelectItem key={port.name} value={port.name}>
                      {port.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <span>Ortalama gelgit genliği: {selectedPort.tidalRange}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Conditions */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              {selectedDate.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
            <Badge variant="outline" className={tidalStrength.color}>
              {tidalStrength.label}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Moon Phase Info */}
          <div className="flex items-center gap-4 mb-4 p-3 rounded-lg bg-white/50">
            <span className="text-3xl">{moonPhase.emoji}</span>
            <div>
              <p className="font-medium">{moonPhase.nameTr}</p>
              <p className="text-sm text-muted-foreground">
                Aydınlanma: {moonPhase.illumination}% • Ay yaşı: {moonPhase.age} gün
              </p>
            </div>
          </div>
          
          {/* Tide Events */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {dailyTides.events.map((event, idx) => (
              <div 
                key={idx}
                className={`rounded-lg p-3 text-center ${
                  event.type === 'high' 
                    ? 'bg-blue-100 border border-blue-300' 
                    : 'bg-cyan-100 border border-cyan-300'
                }`}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  {event.type === 'high' ? (
                    <ArrowUp className="h-4 w-4 text-blue-600" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-cyan-600" />
                  )}
                  <span className="text-sm font-medium">
                    {event.type === 'high' ? 'Yüksek' : 'Alçak'}
                  </span>
                </div>
                <p className="text-xl font-bold font-mono">
                  {formatTideTime(event.time)}
                </p>
                <div className="mt-1 h-2 bg-white rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${event.type === 'high' ? 'bg-blue-500' : 'bg-cyan-500'}`}
                    style={{ width: `${event.height}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Tidal Range Info */}
          <div className="mt-4 p-3 rounded-lg bg-white/50">
            <p className="text-sm text-muted-foreground">
              <strong>{tidalStrength.description}</strong>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Forecast */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">7 Günlük Gelgit Tahmini</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {weeklyTides.map((day, idx) => {
                const strength = getTidalStrength(day.tidalRange);
                return (
                  <div 
                    key={idx}
                    className={`p-3 rounded-lg border ${
                      idx === 0 ? 'bg-blue-50 border-blue-200' : 'bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {day.date.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </span>
                        {idx === 0 && <Badge variant="secondary" className="text-xs">Bugün</Badge>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{day.moonPhase}</span>
                        <Badge variant="outline" className={`text-xs ${strength.color}`}>
                          {strength.label}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2">
                      {day.events.map((event, eventIdx) => (
                        <div 
                          key={eventIdx}
                          className={`text-center p-2 rounded text-xs ${
                            event.type === 'high' ? 'bg-blue-100' : 'bg-cyan-100'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1">
                            {event.type === 'high' ? (
                              <ArrowUp className="h-3 w-3 text-blue-600" />
                            ) : (
                              <ArrowDown className="h-3 w-3 text-cyan-600" />
                            )}
                            <span className="font-mono font-medium">
                              {formatTideTime(event.time)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Educational Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sun className="h-5 w-5 text-yellow-500" />
            <Moon className="h-5 w-5 text-indigo-500" />
            Gelgit Nasıl Oluşur?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <h4 className="font-semibold flex items-center gap-2 mb-2">
                <span className="text-lg">🌕🌑</span> Sizigi Gelgiti (Spring)
              </h4>
              <p className="text-sm text-muted-foreground">
                Yeni ay ve dolunay dönemlerinde Güneş, Ay ve Dünya aynı hizaya gelir. 
                Birleşik çekim kuvveti en yüksek ve en alçak gelgitleri oluşturur.
              </p>
            </div>
            
            <div className="p-3 rounded-lg bg-muted/50">
              <h4 className="font-semibold flex items-center gap-2 mb-2">
                <span className="text-lg">🌓🌗</span> Kuadratur Gelgiti (Neap)
              </h4>
              <p className="text-sm text-muted-foreground">
                İlk ve son dördün dönemlerinde Güneş ve Ay birbirine dik açıdadır. 
                Çekim kuvvetleri zayıflar ve gelgit farkı azalır.
              </p>
            </div>
            
            <div className="p-3 rounded-lg bg-muted/50">
              <h4 className="font-semibold flex items-center gap-2 mb-2">
                <span className="text-lg">⏱️</span> Gelgit Periyodu
              </h4>
              <p className="text-sm text-muted-foreground">
                Ardışık yüksek gelgitler arasında yaklaşık 12 saat 25 dakika geçer. 
                Bu nedenle her gün gelgitler yaklaşık 50 dakika gecikir.
              </p>
            </div>
            
            <div className="p-3 rounded-lg bg-muted/50">
              <h4 className="font-semibold flex items-center gap-2 mb-2">
                <span className="text-lg">🌊</span> Akdeniz'de Gelgitler
              </h4>
              <p className="text-sm text-muted-foreground">
                Akdeniz yarı kapalı bir deniz olduğundan gelgit farkı genellikle 
                20-40 cm arasındadır. Atlantik kıyılarında ise 4-12 metre olabilir.
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>⚠️ Uyarı:</strong> Bu tahminler basitleştirilmiş bir modele dayanmaktadır. 
              Gerçek gelgit zamanları ve yükseklikleri yerel faktörlerden etkilenir. 
              Navigasyon için resmi gelgit tablolarını kullanın.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
