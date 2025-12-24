import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, Globe, Search, Moon, Calendar } from "lucide-react";
import { 
  navigationStars, 
  planets, 
  planetEphemeris2025, 
  moonEphemeris2025,
  getMoonPosition,
  getMoonGhaAtHour,
  getMoonDecAtHour,
  formatDec,
  type NavigationStar,
  type MoonPosition
} from "@/data/navigationStars";
import { 
  getMoonPhase, 
  getUpcomingMoonPhases, 
  getMoonPhasesForMonth,
  type MoonPhase 
} from "@/utils/moonPhase";

interface StarPlanetTableProps {
  selectedDate: Date;
}

export function StarPlanetTable({ selectedDate }: StarPlanetTableProps) {
  const [starSearch, setStarSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "sha" | "magnitude">("sha");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter and sort stars
  const filteredStars = navigationStars
    .filter(star => 
      star.name.toLowerCase().includes(starSearch.toLowerCase()) ||
      star.constellation.toLowerCase().includes(starSearch.toLowerCase())
    )
    .sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;
      if (sortBy === "name") return multiplier * a.name.localeCompare(b.name);
      if (sortBy === "sha") return multiplier * (a.sha - b.sha);
      return multiplier * (a.magnitude - b.magnitude);
    });

  // Get planet positions for selected date
  const month = selectedDate.getMonth();
  const getPlanetData = (planetName: string) => {
    const ephemeris = planetEphemeris2025.find(p => p.name === planetName);
    if (!ephemeris || month >= ephemeris.positions.length) return null;
    return ephemeris.positions[month];
  };

  // Get Moon position for selected date
  const moonData = getMoonPosition(selectedDate);
  
  // Get Moon phase for selected date
  const moonPhase = getMoonPhase(selectedDate);
  const upcomingPhases = getUpcomingMoonPhases(selectedDate, 4);
  const monthPhases = getMoonPhasesForMonth(selectedDate.getFullYear(), selectedDate.getMonth());

  const handleSort = (column: "name" | "sha" | "magnitude") => {
    if (sortBy === column) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const getMagnitudeColor = (mag: number): string => {
    if (mag < 0) return "text-yellow-300";
    if (mag < 1) return "text-yellow-400";
    if (mag < 2) return "text-yellow-500";
    return "text-yellow-600";
  };

  const formatDegrees = (deg: number): string => {
    const d = Math.floor(Math.abs(deg));
    const m = ((Math.abs(deg) - d) * 60).toFixed(1);
    const sign = deg < 0 ? '-' : '';
    return `${sign}${d}° ${m}'`;
  };

  return (
    <Tabs defaultValue="stars" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="stars" className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          Yıldızlar
        </TabsTrigger>
        <TabsTrigger value="planets" className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Gezegenler
        </TabsTrigger>
        <TabsTrigger value="moon" className="flex items-center gap-2">
          <Moon className="w-4 h-4" />
          Ay
        </TabsTrigger>
      </TabsList>

      <TabsContent value="stars" className="mt-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Seyir Yıldızları - SHA & Dec</CardTitle>
              <div className="relative w-48">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Yıldız ara..."
                  value={starSearch}
                  onChange={(e) => setStarSearch(e.target.value)}
                  className="pl-8 h-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto max-h-[400px] rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th 
                      className="text-left p-2 cursor-pointer hover:bg-muted"
                      onClick={() => handleSort("name")}
                    >
                      Yıldız {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th 
                      className="text-right p-2 cursor-pointer hover:bg-muted"
                      onClick={() => handleSort("sha")}
                    >
                      SHA {sortBy === "sha" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="text-right p-2">Dec</th>
                    <th 
                      className="text-center p-2 cursor-pointer hover:bg-muted"
                      onClick={() => handleSort("magnitude")}
                    >
                      Mag {sortBy === "magnitude" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="text-left p-2">Takımyıldız</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStars.map((star, idx) => (
                    <tr 
                      key={star.name}
                      className={idx % 2 === 0 ? "bg-background" : "bg-muted/30"}
                    >
                      <td className="p-2 font-medium">{star.name}</td>
                      <td className="p-2 text-right font-mono">{star.sha.toFixed(1)}°</td>
                      <td className="p-2 text-right font-mono">{formatDec(star.dec)}</td>
                      <td className={`p-2 text-center font-mono ${getMagnitudeColor(star.magnitude)}`}>
                        {star.magnitude.toFixed(1)}
                      </td>
                      <td className="p-2 text-muted-foreground">{star.constellation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              * SHA değerleri 2025 yılı için yaklaşık değerlerdir. Gerçek navigasyon için Nautical Almanac kullanın.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="planets" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Gezegen Pozisyonları - {selectedDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {planets.map(planet => {
                const data = getPlanetData(planet.name);
                return (
                  <div 
                    key={planet.name}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <span 
                        className="text-2xl" 
                        style={{ color: planet.color }}
                      >
                        {planet.symbol}
                      </span>
                      <div>
                        <h4 className="font-semibold">{planet.name}</h4>
                        <p className="text-xs text-muted-foreground">Navigasyon Gezegeni</p>
                      </div>
                    </div>
                    {data ? (
                      <div className="flex gap-6">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">GHA (00:00 UT)</p>
                          <p className="font-mono font-medium">{data.gha.toFixed(1)}°</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Dec</p>
                          <p className="font-mono font-medium">{formatDec(data.dec)}</p>
                        </div>
                        {data.hp !== undefined && (
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">HP</p>
                            <p className="font-mono font-medium">{data.hp.toFixed(1)}'</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Badge variant="secondary">Veri yok</Badge>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-2">Gezegen Tablosu Kullanımı</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>GHA</strong>: Greenwich Saat Açısı (Greenwich Hour Angle) - 00:00 UT için</li>
                <li>• <strong>Dec</strong>: Deklinasyon (Kuzey pozitif, Güney negatif)</li>
                <li>• <strong>HP</strong>: Yatay Paralaks (Horizontal Parallax) - Venüs ve Mars için</li>
                <li>• Saatlik GHA hesabı için: GHA = GHA(00:00) + 15° × saat</li>
              </ul>
            </div>

            <ScrollArea className="h-[200px] mt-4">
              <div className="overflow-auto rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="text-left p-2">Gezegen</th>
                      <th className="text-center p-2">Oca</th>
                      <th className="text-center p-2">Şub</th>
                      <th className="text-center p-2">Mar</th>
                      <th className="text-center p-2">Nis</th>
                      <th className="text-center p-2">May</th>
                      <th className="text-center p-2">Haz</th>
                      <th className="text-center p-2">Tem</th>
                      <th className="text-center p-2">Ağu</th>
                      <th className="text-center p-2">Eyl</th>
                      <th className="text-center p-2">Eki</th>
                      <th className="text-center p-2">Kas</th>
                      <th className="text-center p-2">Ara</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planetEphemeris2025.map((planet, idx) => (
                      <tr key={planet.name} className={idx % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                        <td className="p-2 font-medium">{planet.name}</td>
                        {planet.positions.map((pos, i) => (
                          <td key={i} className="p-2 text-center text-xs font-mono">
                            <div>{pos.gha.toFixed(0)}°</div>
                            <div className="text-muted-foreground">{pos.dec > 0 ? '+' : ''}{pos.dec.toFixed(0)}°</div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
            <p className="text-xs text-muted-foreground mt-2">
              * Tabloda GHA (üst) ve Dec (alt) değerleri gösterilmektedir. Ayın ilk günü için 00:00 UT değerleri.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="moon" className="mt-4 space-y-4">
        {/* Moon Phase Card */}
        <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-indigo-700">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Moon className="h-5 w-5" />
              Ay Fazı - {selectedDate.toLocaleDateString('tr-TR')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              {/* Current Phase Display */}
              <div className="text-center">
                <div className="text-6xl mb-2">{moonPhase.emoji}</div>
                <div className="text-lg font-semibold">{moonPhase.nameTr}</div>
                <div className="text-sm text-indigo-200">{moonPhase.name}</div>
              </div>
              
              {/* Phase Details */}
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-xs text-indigo-200 mb-1">Aydınlanma</p>
                  <p className="text-xl font-bold">{moonPhase.illumination}%</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <p className="text-xs text-indigo-200 mb-1">Ay Yaşı</p>
                  <p className="text-xl font-bold">{moonPhase.age} gün</p>
                </div>
              </div>
            </div>

            {/* Illumination Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-indigo-200 mb-1">
                <span>🌑 Yeni Ay</span>
                <span>Dolunay 🌕</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-400 to-yellow-300 transition-all duration-500"
                  style={{ width: `${moonPhase.illumination}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Phases */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5" />
              Yaklaşan Ay Fazları
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {upcomingPhases.map((phase, idx) => (
                <div 
                  key={idx}
                  className="flex flex-col items-center p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <span className="text-3xl mb-1">{phase.emoji}</span>
                  <span className="text-sm font-medium">{phase.nameTr}</span>
                  <span className="text-xs text-muted-foreground">
                    {phase.date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {phase.date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} UTC
                  </span>
                </div>
              ))}
            </div>
            
            {/* This Month's Phases */}
            {monthPhases.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold mb-2">
                  {selectedDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })} Ay Fazları
                </h4>
                <div className="flex flex-wrap gap-2">
                  {monthPhases.map((phase, idx) => (
                    <Badge key={idx} variant="outline" className="py-1.5 px-3">
                      <span className="mr-1">{phase.emoji}</span>
                      {phase.nameTr} - {phase.date.getDate()}.{phase.date.getMonth() + 1}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Moon Data */}
        <Card className="bg-gradient-to-br from-slate-50 to-indigo-50 border-indigo-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Moon className="h-5 w-5 text-indigo-600" />
              Navigasyon Verileri - {moonData?.date || selectedDate.toISOString().split('T')[0]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {moonData ? (
              <div className="space-y-4">
                {/* Main Moon Data */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                    <p className="text-xs text-muted-foreground mb-1">GHA (00:00 UT)</p>
                    <p className="text-lg font-mono font-bold text-indigo-600">
                      {formatDegrees(moonData.gha00)}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                    <p className="text-xs text-muted-foreground mb-1">Dec (00:00 UT)</p>
                    <p className="text-lg font-mono font-bold text-indigo-600">
                      {formatDec(moonData.dec00)}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                    <p className="text-xs text-muted-foreground mb-1">HP (Yatay Paralaks)</p>
                    <p className="text-lg font-mono font-bold text-indigo-600">
                      {moonData.hp.toFixed(1)}'
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                    <p className="text-xs text-muted-foreground mb-1">SD (Yarı Çap)</p>
                    <p className="text-lg font-mono font-bold text-indigo-600">
                      {moonData.sd.toFixed(1)}'
                    </p>
                  </div>
                </div>

                {/* Hourly Change Rates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-indigo-100/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Saatlik GHA Değişimi</p>
                    <p className="font-mono font-medium">{moonData.ghaDelta.toFixed(2)}°/saat</p>
                  </div>
                  <div className="bg-indigo-100/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Saatlik Dec Değişimi</p>
                    <p className="font-mono font-medium">{moonData.decDelta > 0 ? '+' : ''}{moonData.decDelta.toFixed(2)}°/saat</p>
                  </div>
                </div>

                {/* Hourly Moon Table */}
                <div>
                  <h4 className="font-semibold mb-2">Saatlik Ay Tablosu</h4>
                  <ScrollArea className="h-[200px]">
                    <table className="w-full text-sm">
                      <thead className="bg-indigo-100/50 sticky top-0">
                        <tr>
                          <th className="text-left p-2 font-medium">UTC</th>
                          <th className="text-right p-2 font-medium">GHA</th>
                          <th className="text-right p-2 font-medium">Dec</th>
                          <th className="text-right p-2 font-medium">HP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 24 }, (_, hour) => (
                          <tr key={hour} className={hour % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                            <td className="p-2 font-mono">{hour.toString().padStart(2, '0')}:00</td>
                            <td className="p-2 text-right font-mono">
                              {formatDegrees(getMoonGhaAtHour(moonData, hour))}
                            </td>
                            <td className="p-2 text-right font-mono">
                              {formatDec(getMoonDecAtHour(moonData, hour))}
                            </td>
                            <td className="p-2 text-right font-mono">{moonData.hp.toFixed(1)}'</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ScrollArea>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Bu tarih için Ay verisi bulunamadı
              </p>
            )}
          </CardContent>
        </Card>

        {/* Moon Usage Guide */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Ay Fazları Rehberi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="text-center p-2 rounded-lg bg-muted/30">
                <span className="text-2xl">🌑</span>
                <p className="text-xs font-medium mt-1">Yeni Ay</p>
                <p className="text-xs text-muted-foreground">0% aydınlık</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/30">
                <span className="text-2xl">🌓</span>
                <p className="text-xs font-medium mt-1">İlk Dördün</p>
                <p className="text-xs text-muted-foreground">50% aydınlık</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/30">
                <span className="text-2xl">🌕</span>
                <p className="text-xs font-medium mt-1">Dolunay</p>
                <p className="text-xs text-muted-foreground">100% aydınlık</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/30">
                <span className="text-2xl">🌗</span>
                <p className="text-xs font-medium mt-1">Son Dördün</p>
                <p className="text-xs text-muted-foreground">50% aydınlık</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• <strong>Sinodik Ay</strong>: Yeni ay'dan yeni ay'a ~29.5 gün</p>
              <p>• <strong>Gelgit Etkisi</strong>: Dolunay ve yeni ay'da en güçlü gelgitler oluşur</p>
              <p>• <strong>Navigasyon</strong>: Dolunay navigasyon için en iyi görünürlük sağlar</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
