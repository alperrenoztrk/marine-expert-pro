import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, Globe, Search } from "lucide-react";
import { 
  navigationStars, 
  planets, 
  planetEphemeris2025, 
  formatDec,
  type NavigationStar 
} from "@/data/navigationStars";

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

  return (
    <Tabs defaultValue="stars" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="stars" className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          Yıldızlar (57)
        </TabsTrigger>
        <TabsTrigger value="planets" className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Gezegenler (4)
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

            <div className="mt-4 overflow-auto rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
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
            <p className="text-xs text-muted-foreground mt-2">
              * Tabloda GHA (üst) ve Dec (alt) değerleri gösterilmektedir. Ayın ilk günü için 00:00 UT değerleri.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
