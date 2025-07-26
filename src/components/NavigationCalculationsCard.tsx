import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Compass, Navigation, MapPin } from "lucide-react";
import { useState } from "react";

export const NavigationCalculationsCard = () => {
  const [gcInputs, setGcInputs] = useState({
    lat1: "", lon1: "", lat2: "", lon2: ""
  });
  const [rhumbInputs, setRhumbInputs] = useState({
    lat1: "", lon1: "", lat2: "", lon2: ""
  });
  const [compassInputs, setCompassInputs] = useState({
    compass: "", variation: "", deviation: ""
  });

  const [gcResults, setGcResults] = useState<{distance: number, bearing: number} | null>(null);
  const [rhumbResults, setRhumbResults] = useState<{distance: number, bearing: number} | null>(null);
  const [compassResults, setCompassResults] = useState<{magnetic: number, true: number} | null>(null);

  const calculateGreatCircle = () => {
    const lat1Rad = (parseFloat(gcInputs.lat1) * Math.PI) / 180;
    const lon1Rad = (parseFloat(gcInputs.lon1) * Math.PI) / 180;
    const lat2Rad = (parseFloat(gcInputs.lat2) * Math.PI) / 180;
    const lon2Rad = (parseFloat(gcInputs.lon2) * Math.PI) / 180;

    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
              Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = 6371 * c * 0.539957; // nautical miles

    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    bearing = (bearing + 360) % 360;

    setGcResults({ distance: Math.round(distance * 100) / 100, bearing: Math.round(bearing * 10) / 10 });
  };

  const calculateRhumbLine = () => {
    const lat1 = parseFloat(rhumbInputs.lat1) * Math.PI / 180;
    const lat2 = parseFloat(rhumbInputs.lat2) * Math.PI / 180;
    let dLon = (parseFloat(rhumbInputs.lon2) - parseFloat(rhumbInputs.lon1)) * Math.PI / 180;

    const dPhi = Math.log(Math.tan(lat2/2 + Math.PI/4) / Math.tan(lat1/2 + Math.PI/4));
    const q = Math.abs(dPhi) > 10e-12 ? (lat2 - lat1) / dPhi : Math.cos(lat1);

    if (Math.abs(dLon) > Math.PI) {
      dLon = dLon > 0 ? -(2*Math.PI-dLon) : (2*Math.PI+dLon);
    }

    const distance = Math.sqrt((lat2 - lat1) * (lat2 - lat1) + q * q * dLon * dLon) * 6371 * 0.539957;
    let bearing = Math.atan2(dLon, dPhi) * 180 / Math.PI;
    bearing = (bearing + 360) % 360;

    setRhumbResults({ distance: Math.round(distance * 100) / 100, bearing: Math.round(bearing * 10) / 10 });
  };

  const calculateCompass = () => {
    const compass = parseFloat(compassInputs.compass);
    const variation = parseFloat(compassInputs.variation);
    const deviation = parseFloat(compassInputs.deviation);

    const magnetic = compass + deviation;
    const trueBearing = magnetic + variation;

    setCompassResults({
      magnetic: Math.round(magnetic * 10) / 10,
      true: Math.round(trueBearing * 10) / 10
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Compass className="w-5 h-5" />
          Seyir Hesaplamaları
        </CardTitle>
        <CardDescription>
          Navigasyon hesaplamalarını gerçekleştirin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="great-circle" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="great-circle">Büyük Daire</TabsTrigger>
            <TabsTrigger value="rhumb-line">Loxodromik</TabsTrigger>
            <TabsTrigger value="compass">Pusula</TabsTrigger>
          </TabsList>

          <TabsContent value="great-circle" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gc-lat1">Başlangıç Enlemi</Label>
                <Input
                  id="gc-lat1"
                  type="number"
                  placeholder="40.7589"
                  value={gcInputs.lat1}
                  onChange={(e) => setGcInputs({...gcInputs, lat1: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="gc-lon1">Başlangıç Boylamı</Label>
                <Input
                  id="gc-lon1"
                  type="number"
                  placeholder="29.9511"
                  value={gcInputs.lon1}
                  onChange={(e) => setGcInputs({...gcInputs, lon1: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="gc-lat2">Hedef Enlemi</Label>
                <Input
                  id="gc-lat2"
                  type="number"
                  placeholder="41.0082"
                  value={gcInputs.lat2}
                  onChange={(e) => setGcInputs({...gcInputs, lat2: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="gc-lon2">Hedef Boylamı</Label>
                <Input
                  id="gc-lon2"
                  type="number"
                  placeholder="28.9784"
                  value={gcInputs.lon2}
                  onChange={(e) => setGcInputs({...gcInputs, lon2: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={calculateGreatCircle} className="w-full">Hesapla</Button>
            {gcResults && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p><strong>Mesafe:</strong> {gcResults.distance} nm</p>
                <p><strong>İlk Kerteriz:</strong> {gcResults.bearing}°</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="rhumb-line" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rl-lat1">Başlangıç Enlemi</Label>
                <Input
                  id="rl-lat1"
                  type="number"
                  placeholder="40.7589"
                  value={rhumbInputs.lat1}
                  onChange={(e) => setRhumbInputs({...rhumbInputs, lat1: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="rl-lon1">Başlangıç Boylamı</Label>
                <Input
                  id="rl-lon1"
                  type="number"
                  placeholder="29.9511"
                  value={rhumbInputs.lon1}
                  onChange={(e) => setRhumbInputs({...rhumbInputs, lon1: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="rl-lat2">Hedef Enlemi</Label>
                <Input
                  id="rl-lat2"
                  type="number"
                  placeholder="41.0082"
                  value={rhumbInputs.lat2}
                  onChange={(e) => setRhumbInputs({...rhumbInputs, lat2: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="rl-lon2">Hedef Boylamı</Label>
                <Input
                  id="rl-lon2"
                  type="number"
                  placeholder="28.9784"
                  value={rhumbInputs.lon2}
                  onChange={(e) => setRhumbInputs({...rhumbInputs, lon2: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={calculateRhumbLine} className="w-full">Hesapla</Button>
            {rhumbResults && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p><strong>Mesafe:</strong> {rhumbResults.distance} nm</p>
                <p><strong>Sabit Kerteriz:</strong> {rhumbResults.bearing}°</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="compass" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="compass">Pusula Kerterizi</Label>
                <Input
                  id="compass"
                  type="number"
                  placeholder="090"
                  value={compassInputs.compass}
                  onChange={(e) => setCompassInputs({...compassInputs, compass: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="variation">Manyetik İnhiraf (Variation)</Label>
                <Input
                  id="variation"
                  type="number"
                  placeholder="3.5"
                  value={compassInputs.variation}
                  onChange={(e) => setCompassInputs({...compassInputs, variation: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="deviation">Pusula Hatası (Deviation)</Label>
                <Input
                  id="deviation"
                  type="number"
                  placeholder="-1.2"
                  value={compassInputs.deviation}
                  onChange={(e) => setCompassInputs({...compassInputs, deviation: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={calculateCompass} className="w-full">Hesapla</Button>
            {compassResults && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p><strong>Manyetik Kerteriz:</strong> {compassResults.magnetic}°</p>
                <p><strong>Gerçek Kerteriz:</strong> {compassResults.true}°</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};