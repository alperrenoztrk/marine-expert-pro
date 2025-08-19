import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Waves, Ruler, Activity, Package, LineChart, LifeBuoy, ClipboardCheck } from "lucide-react";
import StabilityAssistantPopup from "@/components/StabilityAssistantPopup";

export default function Stability2() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Helmet>
        <title>Stabilite Hesaplamaları | Gelişmiş Stabilite Modülleri</title>
        <meta name="description" content="Stabilite hesaplamaları: Hidrostatik, stabilite, trim & list, analiz, bonjean, dip ve hasar stabilite hesaplamaları." />
        <link rel="canonical" href="/stability-2" />
      </Helmet>

      <header className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate('/calculations')}>
          <ArrowLeft className="h-4 w-4" />
          Ana Sayfa
        </Button>
      </header>

      <main className="space-y-6">
        <h1 className="text-3xl font-bold" data-no-translate>Stabilite Hesaplamaları</h1>
        <p className="text-muted-foreground">İleri seviye stabilite hesaplamaları ve analizleri</p>

        {/* Stabilite Asistanı (silme, kalsın) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <LineChart className="h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StabilityAssistantPopup variant="inline" />
          </CardContent>
        </Card>

        {/* 1) Enine Stabilite (Transverse) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Waves className="h-5 w-5" /> 1) Enine Stabilite (Transverse)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <h3 className="font-semibold">Hesaplamalar</h3>
            <div className="space-y-2">
              <div>
                <div className="font-medium">KMt, KB, BMt, KG, GMt:</div>
                <div className="text-sm text-muted-foreground">{`(I_{WP}: su hattı alan atâleti, enine)`}</div>
                <div className="mt-2">
                  <Button size="sm" variant="outline" onClick={() => window.open('/stability/gm', '_blank')}>GM Hesapla</Button>
                </div>
              </div>
              <div>
                <div className="font-medium">GZ eğrisi</div>
                <div className="text-sm text-muted-foreground">Küçük açılar için; tam eğri hidrost. tablolardan.</div>
                <div className="mt-2">
                  <Button size="sm" variant="outline" onClick={() => window.open('/stability/gz', '_blank')}>GZ Hesapla</Button>
                </div>
              </div>
              <div>
                <div className="font-medium">Alan kriterleri</div>
                <div className="text-sm text-muted-foreground">(ör. 0–30°, 0–40°, max GZ ve açıları).</div>
              </div>
              <div>
                <div className="font-medium">Serbest yüzey düzeltmesi (FSE)</div>
                <div className="text-sm text-muted-foreground">(I_f: tank serbest yüzey atâleti)</div>
              </div>
              <div>
                <div className="font-medium">Yük kayması (shifting)</div>
                <div className="text-sm text-muted-foreground">Yana kayma momenti →</div>
              </div>
              <div>
                <div className="font-medium">Yalpa (rolling) periyodu (yaklaşık)</div>
                <div className="text-sm text-muted-foreground">(C ~ 0.8–1.1 gemi tipine göre)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2) Boyuna Stabilite (Trim / Longitudinal) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Ruler className="h-5 w-5" /> 2) Boyuna Stabilite (Trim / Longitudinal)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <h3 className="font-semibold">Hesaplamalar</h3>
            <div className="space-y-2">
              <div>
                <div className="font-medium">KMl, BMl, GMl</div>
                <div className="text-sm text-muted-foreground">(boyuna atâlet)</div>
              </div>
              <div>
                <div className="font-medium">Trim ve MCT 1 cm</div>
                <div className="text-sm text-muted-foreground">(yaklaşık) (Pratikte hidrost. cetvelden alınır.)</div>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => window.open('/stability/trim', '_blank')}>Trim Hesapla</Button>
                  <Button size="sm" variant="outline" onClick={() => window.open('/stability/list', '_blank')}>List Hesapla</Button>
                </div>
              </div>
              <div>
                <div className="font-medium">Yük/aktarma ile trim</div>
                <div className="text-sm text-muted-foreground">(d = yükün LCF’ye boyuna uzaklığı)</div>
              </div>
              <div>
                <div className="font-medium">Uç draft değişimleri (yaklaşık)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3) Sağlam (Intact) Stabilite */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> 3) Sağlam (Intact) Stabilite</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <h3 className="font-semibold">Hesaplamalar</h3>
            <div className="space-y-2">
              <div>
                <div className="font-medium">Temel ilişkiler</div>
              </div>
              <div>
                <div className="font-medium">GZ eğrisi parametreleri</div>
                <div className="text-sm text-muted-foreground">max GZ, max GZ açısı, alanları.</div>
              </div>
              <div>
                <div className="font-medium">Rüzgâr kriteri (weather criterion) kontrolü</div>
                <div className="text-sm text-muted-foreground">Rüzgâr heeling lever ile GZ’nin kesişimi, güvenli denge açısı.</div>
              </div>
              <div>
                <div className="font-medium">Serbest yüzey düzeltmeleri</div>
                <div className="text-sm text-muted-foreground">Tüm tanklara uygulanır.</div>
              </div>
              <div>
                <div className="font-medium">Minimum GM / alan limitleri</div>
                <div className="text-sm text-muted-foreground">(tip ve kurala göre) kontrol edilir.</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4) Zarar Görmüş (Damage) Stabilite */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><LifeBuoy className="h-5 w-5" /> 4) Zarar Görmüş (Damage) Stabilite</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <h3 className="font-semibold">Hesaplamalar</h3>
            <div className="space-y-2">
              <div>
                <div className="font-medium">Hasarlı hacimler & geçirgenlik (μ)</div>
                <div className="text-sm text-muted-foreground">Kayıp yüzdürme (lost buoyancy) / ek ağırlık (added weight) yöntemleri.</div>
              </div>
              <div>
                <div className="font-medium">Denge hâli</div>
                <div className="text-sm text-muted-foreground">Su hattı, trim, heel için yeni değerler.</div>
              </div>
              <div>
                <div className="font-medium">Bölme dolma senaryoları</div>
                <div className="text-sm text-muted-foreground">tek/çok bölme; boyuna, enine ve dikey yayılım.</div>
              </div>
              <div>
                <div className="font-medium">Marj çizgisi ve limit su hattı</div>
                <div className="text-sm text-muted-foreground">İhlallerin kontrolü.</div>
              </div>
              <div>
                <div className="font-medium">Kümülatif indeksler</div>
                <div className="text-sm text-muted-foreground">(A ≥ R vb.; gemi tipine göre).</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5) Dinamik Stabilite */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" /> 5) Dinamik Stabilite</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <h3 className="font-semibold">Hesaplamalar</h3>
            <div className="space-y-2">
              <div>
                <div className="font-medium">Enerji kriteri</div>
              </div>
              <div>
                <div className="font-medium">Rüzgâr/dalga momenti–GZ etkileşimi</div>
                <div className="text-sm text-muted-foreground">Zarf eğrileri, kesişim açıları.</div>
              </div>
              <div>
                <div className="font-medium">Parametrik/senkron yalpa risk değerlendirmesi</div>
                <div className="text-sm text-muted-foreground">GM, blok katsayısı, dalga periyodu ve gemi doğal periyodu uyumu.</div>
              </div>
              <div>
                <div className="font-medium">Broaching & surf-riding</div>
                <div className="text-sm text-muted-foreground">Hız–dalga–trim kombinasyon kontrolleri.</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 6) Yükleme & Denge (Cargo / Loading) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> 6) Yükleme & Denge (Cargo / Loading)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <h3 className="font-semibold">Hesaplamalar</h3>
            <div className="space-y-2">
              <div>
                <div className="font-medium">DWT</div>
              </div>
              <div>
                <div className="font-medium">Hacim / ağırlık limiti</div>
              </div>
              <div>
                <div className="font-medium">Stowage factor (SF)</div>
              </div>
              <div>
                <div className="font-medium">Moment toplamları</div>
                <div className="text-sm text-muted-foreground">(∑w, ∑w·x, ∑w·y, ∑w·z)</div>
              </div>
              <div>
                <div className="font-medium">Tank kütleleri</div>
                <div className="text-sm text-muted-foreground">tablo/ullage/trim düzeltmesi → kütle & merkez (x,y,z).</div>
              </div>
              <div>
                <div className="font-medium">List açısı (yan ağırlık farkı)</div>
              </div>
              <div>
                <div className="font-medium">Serbest yüzey ve dökme yük kayması düzeltmeleri</div>
                <div className="text-sm text-muted-foreground">(FSM, shifting moment).</div>
              </div>
              <div>
                <div className="font-medium">Loadicator çıktıları</div>
                <div className="text-sm text-muted-foreground">trim, draftlar, GM, GZ, SF/BM ön-kontrol.</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 7) Boyuna Dayanım (Longitudinal Strength) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ClipboardCheck className="h-5 w-5" /> 7) Boyuna Dayanım (Longitudinal Strength)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <h3 className="font-semibold">Hesaplamalar</h3>
            <div className="space-y-2">
              <div>
                <div className="font-medium">Dağıtılmış yük diyagramı</div>
              </div>
              <div>
                <div className="font-medium">Kesme kuvveti (SF) ve eğilme momenti (BM)</div>
              </div>
              <div>
                <div className="font-medium">Zemin basınçları ve yük limitleri</div>
                <div className="text-sm text-muted-foreground">Ambar/tank zemin basınçları ve kapak/güverte yük limitleri.</div>
              </div>
              <div>
                <div className="font-medium">Maks. izin verilen SF/BM ile karşılaştırma</div>
                <div className="text-sm text-muted-foreground">emniyet katsayıları.</div>
              </div>
              <div>
                <div className="font-medium">Hogging/sagging kontrolü</div>
                <div className="text-sm text-muted-foreground">özellikle barç/dökme yükte.</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 8) Hat Başlıkları / Sefer Uygunluğu (Draft–Freeboard–Load Line) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Waves className="h-5 w-5" /> 8) Hat Başlıkları / Sefer Uygunluğu (Draft–Freeboard–Load Line)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <h3 className="font-semibold">Hesaplamalar</h3>
            <div className="space-y-2">
              <div>
                <div className="font-medium">Draft & freeboard</div>
                <div className="text-sm text-muted-foreground">ölçülen draftlardan mevcut freeboard.</div>
              </div>
              <div>
                <div className="font-medium">Yoğunluk düzeltmesi</div>
              </div>
              <div>
                <div className="font-medium">Tatlı/su tuzluluk farkı → draft düzeltmesi</div>
                <div className="text-sm text-muted-foreground">pratikte immersion: TPC (Tonnes per cm).</div>
              </div>
              <div>
                <div className="font-medium">Immersion/Emersion</div>
                <div className="text-sm text-muted-foreground">yük alım/boşaltım sonrası ortalama draft değişimi.</div>
              </div>
              <div>
                <div className="font-medium">Load Line markaları (S, T, F vb.)</div>
                <div className="text-sm text-muted-foreground">limit kontrolleri; trim etkisiyle uç draftların uygunluğu.</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 9) Doğrulama & Kalibrasyon */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" /> 9) Doğrulama & Kalibrasyon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <h3 className="font-semibold">Hesaplamalar</h3>
            <div className="space-y-2">
              <div>
                <div className="font-medium">Inclining experiment (yoklama)</div>
                <div className="text-sm text-muted-foreground">GM ≈ (w·d)/(Δ·φ)</div>
                <div className="text-xs text-muted-foreground">(w: denge ağırlığı, d: ağırlık boyuna/enine yer değiştirme mesafesi)</div>
              </div>
              <div>
                <div className="font-medium">Lightship survey</div>
                <div className="text-sm text-muted-foreground">Lightship ağırlığı ve merkezlerinin doğrulanması.</div>
              </div>
              <div>
                <div className="font-medium">Loadicator kalibrasyonu</div>
                <div className="text-sm text-muted-foreground">örnek senaryolarda draft–trim–SF/BM–GM karşılaştırmaları.</div>
              </div>
              <div>
                <div className="font-medium">Hidrost. tablo uyumu</div>
                <div className="text-sm text-muted-foreground">gemi çizelgeleri ↔ ölçümler eşleştirme.</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}