import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Shield, Waves, Ruler, Activity, Package, LineChart, LifeBuoy, ClipboardCheck } from "lucide-react";

export default function Stability2() {
  // State for calculations
  const [transverseInputs, setTransverseInputs] = useState({
    I_WP: '',
    KB: '',
    KG: '',
    displacement: ''
  });

  const [longitudinalInputs, setLongitudinalInputs] = useState({
    I_L: '',
    displacement: '',
    weight: '',
    distance_from_LCF: ''
  });

  // Calculation functions
  const calculateTransverse = () => {
    const I_WP = parseFloat(transverseInputs.I_WP) || 0;
    const displacement = parseFloat(transverseInputs.displacement) || 0;
    const KB = parseFloat(transverseInputs.KB) || 0;
    const KG = parseFloat(transverseInputs.KG) || 0;
    
    const BMt = I_WP / displacement;
    const KMt = KB + BMt;
    const GMt = KMt - KG;
    
    return { BMt, KMt, GMt };
  };

  const transverseResults = calculateTransverse();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Helmet>
        <title>Stabilite 2 | Gelişmiş Stabilite Hesaplamaları</title>
        <meta name="description" content="Stabilite 2: Enine ve boyuna stabilite, sağlam ve hasarlı stabilite, dinamik stabilite, yükleme, boyuna dayanım, load line ve kalibrasyon hesaplamaları." />
        <link rel="canonical" href="/stability-2" />
      </Helmet>

      <header className="flex items-center justify-between">
        <Link to="/calculations">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Geri
          </Button>
        </Link>
      </header>

      <main>
        <h1 className="text-3xl font-bold mb-2" data-no-translate>Stabilite 2</h1>
        <p className="text-muted-foreground mb-6">İleri seviye stabilite hesaplamaları ve analizleri</p>

        <Tabs defaultValue="transverse" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 mb-6">
            <TabsTrigger value="transverse">Enine</TabsTrigger>
            <TabsTrigger value="longitudinal">Boyuna</TabsTrigger>
            <TabsTrigger value="intact">Sağlam</TabsTrigger>
            <TabsTrigger value="damage">Hasarlı</TabsTrigger>
            <TabsTrigger value="dynamic">Dinamik</TabsTrigger>
            <TabsTrigger value="loading">Yükleme</TabsTrigger>
            <TabsTrigger value="strength">Dayanım</TabsTrigger>
            <TabsTrigger value="loadline">Load Line</TabsTrigger>
            <TabsTrigger value="verification">Doğrulama</TabsTrigger>
          </TabsList>

          <TabsContent value="transverse">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Enine Stabilite (Transverse)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Giriş Parametreleri</h3>
                    <div className="grid gap-3">
                      <div>
                        <Label htmlFor="iwp">Su Hattı Alan Atâleti (I_WP) [m⁴]</Label>
                        <Input
                          id="iwp"
                          value={transverseInputs.I_WP}
                          onChange={(e) => setTransverseInputs({...transverseInputs, I_WP: e.target.value})}
                          placeholder="Örn: 50000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="kb">KB [m]</Label>
                        <Input
                          id="kb"
                          value={transverseInputs.KB}
                          onChange={(e) => setTransverseInputs({...transverseInputs, KB: e.target.value})}
                          placeholder="Örn: 8.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="kg">KG [m]</Label>
                        <Input
                          id="kg"
                          value={transverseInputs.KG}
                          onChange={(e) => setTransverseInputs({...transverseInputs, KG: e.target.value})}
                          placeholder="Örn: 12.2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="disp">Deplasман [ton]</Label>
                        <Input
                          id="disp"
                          value={transverseInputs.displacement}
                          onChange={(e) => setTransverseInputs({...transverseInputs, displacement: e.target.value})}
                          placeholder="Örn: 25000"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Sonuçlar</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>BMt:</span>
                        <span className="font-mono">{transverseResults.BMt.toFixed(2)} m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>KMt:</span>
                        <span className="font-mono">{transverseResults.KMt.toFixed(2)} m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GMt:</span>
                        <span className="font-mono">{transverseResults.GMt.toFixed(2)} m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="longitudinal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waves className="h-5 w-5" />
                  Boyuna Stabilite (Trim)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Boyuna stabilite hesaplamaları burada yer alacak.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="intact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LifeBuoy className="h-5 w-5" />
                  Sağlam Stabilite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Sağlam stabilite hesaplamaları burada yer alacak.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="damage">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Zarar Görmüş Stabilite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Hasarlı stabilite hesaplamaları burada yer alacak.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dynamic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Dinamik Stabilite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Dinamik stabilite hesaplamaları burada yer alacak.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loading">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Yükleme & Denge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Yükleme hesaplamaları burada yer alacak.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strength">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="h-5 w-5" />
                  Boyuna Dayanım
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Dayanım hesaplamaları burada yer alacak.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loadline">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waves className="h-5 w-5" />
                  Load Line & Freeboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Load line hesaplamaları burada yer alacak.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  Doğrulama & Kalibrasyon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Doğrulama hesaplamaları burada yer alacak.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}