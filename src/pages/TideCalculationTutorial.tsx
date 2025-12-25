import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Waves } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TideCalculationTutorial = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="space-y-4" data-no-translate>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Waves className="h-4 w-4" /> Gelgit Hesabı — Hesabın Yapılışı
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/navigation/calc/tides")}>
            <ArrowLeft className="h-4 w-4" /> Geri Dön
          </Button>
        </div>

        <Card className="shadow">
          <CardHeader>
            <CardTitle>Gelgit hesabını adım adım yapma kılavuzu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm leading-6">
            <div className="space-y-2">
              <p>
                Bu sayfa, gelgit hesabını sahada ve eğitim senaryolarında kullanılan yöntemlerle
                adım adım açıklar. Amaç; HW/LW zaman-yükseklik bilgisinden istenen saatte gelgit
                yüksekliğini bulmak, ardından harita derinliğine ekleyerek güvenli derinliği
                değerlendirmektir.
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-base font-semibold">1) Gerekli verileri topla</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Seçilen liman için HW (High Water) ve LW (Low Water) zamanları ve yükseklikleri.</li>
                <li>Gelgit tablosundaki referans tarih ve saat dilimi (UTC/GMT veya yerel).</li>
                <li>Harita derinliği (Charted Depth) ve referans datum (CD) bilgisi.</li>
                <li>Gerekiyorsa ikincil liman düzeltmeleri (time/height corrections).</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold">2) Liman türünü belirle ve düzeltmeleri uygula</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Standart liman:</strong> HW/LW değerleri doğrudan kullanılır.</li>
                <li><strong>İkincil liman:</strong> tablo veya notlarda verilen zaman/yükseklik düzeltmeleri eklenir.</li>
                <li>Düzeltme sonrası HW/LW değerlerini tekrar yaz ve aralığı (Range) hesapla.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold">3) Standart limanda istenen saat için gelgit yüksekliği</h3>
              <p>
                Standart yaklaşım, HW–LW aralığını 6 eşit saate bölmek ve “Rule of Twelfths” ile
                saatlik artış/azalış yüzdesini kullanmaktır. Alternatif olarak gelgit grafiğinde, LW ve HW
                noktalarını birleştirip gelgit yükseklik doğrusunu çizerek istenen saatteki yüksekliği
                grafik üzerinden okuyabilirsin.
              </p>
              <div className="rounded border bg-muted/30 p-3">
                <div className="font-semibold">Rule of Twelfths — saatlik katkılar</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mt-2">
                  <div>1. saat: 1/12</div>
                  <div>2. saat: 2/12</div>
                  <div>3. saat: 3/12</div>
                  <div>4. saat: 3/12</div>
                  <div>5. saat: 2/12</div>
                  <div>6. saat: 1/12</div>
                </div>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                <li>LW’den itibaren kaçıncı saatte olduğunu bul.</li>
                <li>Range × (toplam oran) ile gelgit yüksekliğini hesapla.</li>
                <li>LW yüksekliğine ekleyerek istenen saat yüksekliğini elde et.</li>
                <li>Range, spring/near değerlerine yakınsa grafik eğrisini buna göre seç.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold">4) Standart limanda istenen gelgit yüksekliği için zaman</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>İstenen yükseklik ile LW arasındaki farkı hesapla.</li>
                <li>Bu farkın, Range içindeki yüzdesini bul.</li>
                <li>Rule of Twelfths kademelerine göre yaklaşık saat dilimini belirle.</li>
                <li>Gerekirse grafikli yöntemle (gelgit eğrisi) daha hassas okuma yap.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold">5) İkincil limanda zaman ve yükseklik düzeltmesi</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Önce bağlı olunan standart limanın HW/LW değerlerini çıkar.</li>
                <li>İkincil liman tablolarındaki zaman ve yükseklik düzeltmelerini uygula.</li>
                <li>Düzeltilmiş HW/LW ile standart liman adımlarını aynen uygula.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold">6) Geçiş zamanı ve UKC değerlendirmesi</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Toplam derinlik</strong> = Harita derinliği + Gelgit yüksekliği.</li>
                <li><strong>Güvenli derinlik</strong> = Toplam derinlik − Draft − Squat − Emniyet payı.</li>
                <li>Negatif sonuç varsa geçiş/operasyon için zaman veya rota yeniden planlanır.</li>
              </ul>
              <div className="rounded border bg-muted/30 p-3 text-xs">
                Harita derinliği + Gelgit yüksekliği = Gemi draftı + Omurga altı emniyet payı
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold">7) Gelgit akıntısı hesabı (tidal stream)</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>İlgili bölgenin gelgit akıntı haritasından en yakın harf kutucuğunu seç.</li>
                <li>Tabloda HW’den önce/sonra saat ofsetine göre hız ve yön değerini oku.</li>
                <li>İstenen saat için uygun tablo satırını kullanarak akıntı set ve süratini bul.</li>
              </ul>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-base font-semibold">Uygulama örneği — standart liman</h3>
              <p>
                Örnek veri seti ile istenen saat için gelgit yüksekliği hesaplama:
              </p>
              <div className="rounded border bg-muted/30 p-3 space-y-2">
                <div><strong>Tarih:</strong> 20 Nisan</div>
                <div><strong>HW:</strong> 11:38 — 5,5 m</div>
                <div><strong>LW:</strong> 18:25 — 1,0 m</div>
                <div><strong>İstenen saat:</strong> 15:00</div>
              </div>
              <ol className="list-decimal pl-5 space-y-1">
                <li>HW ve LW noktalarını grafikte işaretle, gelgit yükseklik doğrusunu oluştur.</li>
                <li>Saat eksenine HW saatinden başlayarak saatlik aralıkları doldur.</li>
                <li>15:00’dan dik çık; gelgit eğrisiyle kesişimden gelgit doğrusuna paralel çiz.</li>
                <li>Kesişimden yukarı çıkarak “HW Hts m” ölçeğinde yüksekliği oku.</li>
                <li>Range, spring değerine yakınsa düz eğri; neap’e yakınsa kesik eğri kullan.</li>
              </ol>
              <p className="text-xs text-muted-foreground">
                Bu yöntemle 15:00 için yaklaşık gelgit yüksekliği bulunur ve harita derinliğine eklenir.
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-base font-semibold">Kontrol listesi (hızlı doğrulama)</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Saat dilimi karışıklığı var mı? (UTC/GMT vs. yerel)</li>
                <li>LW mi HW mi baz alındı doğru mu?</li>
                <li>İkincil liman düzeltmesi unutuldu mu?</li>
                <li>Range ve işaret (+/−) tutarlı mı?</li>
                <li>UKC için emniyet payı ekli mi?</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default TideCalculationTutorial;
