import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Sigma, Shield, Wind, Anchor, LineChart as LineChartIcon, Calculator } from "lucide-react";

export default function StabilityFormulasPage() {
  const sections = [
    { id: "gm-kg", title: "GM ve KG Temelleri" },
    { id: "gz", title: "Doğrultucu Kol (GZ) ve Moment (RM)" },
    { id: "free-surface", title: "Serbest Yüzey Düzeltmesi (FSC)" },
    { id: "trim-list", title: "Trim ve List Açıları" },
    { id: "loll", title: "Angle of Loll" },
    { id: "roll-period", title: "Yalpa Periyodu" },
    { id: "hydrostatic", title: "Hidrostatik Temeller (KB, BM, KM, Δ, ∇, TPC)" },
    { id: "imo", title: "IMO Kriterleri (Özet)" },
    { id: "wind", title: "Rüzgâr Heeling ve Weather Criterion" },
    { id: "inclination", title: "İnklinasyon Deneyi" },
    { id: "konu-anlatimi", title: "Konu Anlatımı" }
  ];

  return (
    <MobileLayout>
      <div className="space-y-4" data-no-translate>
        <div className="flex items-center justify-between">
          <Link to="/stability">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Stabilite
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Formüller Rehberi
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sigma className="h-5 w-5" /> Stabilite Formülleri – İçindekiler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`}>
                  <Button variant="outline" size="sm" className="whitespace-nowrap">
                    {s.title}
                  </Button>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="gm-kg" className="scroll-mt-24">GM ve KG Temelleri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`GM = KM − KG
KM = KB + BM
BM = IT / ∇`}</pre>
            </div>
            <p>Uygulamada sık kullanılan eşdeğer ifade:</p>
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`GM = KB + BM − KG`}</pre>
            </div>
            <ul className="list-disc pl-5 space-y-1">
              <li>KB ≈ T · (0.53 + 0.085·C<sub>B</sub>) (yaklaşım)</li>
              <li>I<sub>T</sub> ≈ (L·B³·C<sub>W</sub>)/12 (su hattı ikinci momenti)</li>
              <li>∇ = L·B·T·C<sub>B</sub> (hacim deplasmanı)</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="gz" className="scroll-mt-24">Doğrultucu Kol (GZ) ve Moment (RM)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`Küçük açılar:   GZ ≈ GM · sin(φ)
Genel durumda: GZ(φ) = KN(φ) − KG · sin(φ)
Doğrultucu moment: RM = Δ · GZ`}</pre>
            </div>
            <p>Burada Δ deplasman (ton), GZ metre cinsindedir. RM genellikle kN·m olarak raporlanır.</p>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="free-surface" className="scroll-mt-24">Serbest Yüzey Düzeltmesi (FSC)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`GMdüz = GM − ΣFSC
FSC = (ρtank / ρdeniz) · (if / ∇)
if (dikdörtgen tank) = l · b³ / 12`}</pre>
            </div>
            <p>Birden fazla yarı dolu tank varsa FSC değerleri toplanır.</p>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="trim-list" className="scroll-mt-24">Trim ve List Açıları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`Trim açısı: φtrim = arctan((Taft − Tfwd)/L)
List açısı: φlist = arctan((w · d)/(Δ · GM))
Düşey şift sonucu KG değişimi: ΔKG = w · h / Δ`}</pre>
            </div>
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`Trim (moment yaklaşımı): Trim = Δ · (LCG − LCB) / MTC`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="loll" className="scroll-mt-24">Angle of Loll</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`φloll = arccos(KG / KM)
Yaklaşım: tan φloll ≈ √(−2 · GM / BMT), GM < 0`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="roll-period" className="scroll-mt-24">Yalpa Periyodu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`T = 2π · k / √(g · GMdüz)`}</pre>
            </div>
            <p>k tipik olarak ~0.35·B alınabilir (yaklaşım).</p>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="hydrostatic" className="scroll-mt-24">Hidrostatik Temeller (KB, BM, KM, Δ, ∇, TPC)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`∇ = L · B · T · CB
Δ = ∇ · ρdeniz
WPA = L · B · CW
IT ≈ (L · B³ · CW)/12
BMT = IT / ∇
KMT = KB + BMT
TPC = WPA · ρdeniz / 100`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="imo" className="scroll-mt-24">IMO Kriterleri (Özet)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`Alan (0–30°) ≥ 0.055 m·rad
Alan (0–40°) ≥ 0.090 m·rad
Alan (30–40°) ≥ 0.030 m·rad
Maksimum GZ ≥ 0.20 m (tepe ≥ 30°)
Başlangıç GM ≥ 0.15 m`}</pre>
            </div>
            <p>2008 IS Code (MSC.267(85)) tipik değerleridir; gemi tipine göre değişebilir.</p>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="wind" className="scroll-mt-24">Rüzgâr Heeling ve Weather Criterion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`Rüzgâr basıncı: q = 0.5 · ρhava · V²
Kuvvet: F = q · A
Devirme momenti: Mh = F · z
Heeling kolu: ah = Mh / (Δ · g)`}</pre>
            </div>
            <p>Weather Criterion: Heeling alanı, GZ eğrisi altında kalan sağlama alanını aşmamalıdır (özet).</p>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="inclination" className="scroll-mt-24">İnklinasyon Deneyi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3">
              <pre className="font-mono text-sm leading-6">{`GMT = (w · l) / (Δ · tan φ)`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="konu-anlatimi" className="scroll-mt-24">Konu Anlatımı</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <section>
              <h4 className="text-base font-semibold text-foreground mb-2">Stabilite Nedir? (Büyük Resim)</h4>
              <p>
                Bir geminin rüzgâr, dalga ve yük yer değişimleri gibi dış etkiler altında eğilip bükülse bile
                kendiliğinden dik konuma geri dönebilme kabiliyetine <strong>stabilite</strong> denir. Stabilitenin
                kalbi, devirmeye çalışan momentlere (<em>heeling</em>) karşı koyan <strong>doğrultucu moment</strong>
                (<em>righting moment</em>) üretmektir. Bu momentin kol uzunluğu <strong>GZ</strong> olarak adlandırılır ve
                deplasmanla çarpımı doğru­ltucu momenti verir.
              </p>
            </section>

            <section>
              <h4 className="text-base font-semibold text-foreground mb-2">Temel Büyüklükler ve İlişkiler</h4>
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`∇ = L · B · T · C_B
Δ = ∇ · ρ_deniz
I_T ≈ (L · B³ · C_W)/12
BM = I_T / ∇
KM = KB + BM
GM = KM − KG
Küçük açılar: GZ(φ) ≈ GM · sin(φ)
Doğrultucu moment: RM = Δ · GZ`}</pre>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>∇</strong>: Su altı hacmi (deplasman hacmi). <strong>Δ</strong>: Deplasman ağırlığı.</li>
                <li><strong>KB</strong>: Yüzerlik merkezinin omurgaya (K) uzaklığı. <strong>BM</strong>: Metasentrik yarıçap.</li>
                <li><strong>KM</strong>: Omurgadan metasentruma. <strong>KG</strong>: Omurgadan ağırlık merkezine.</li>
                <li><strong>GM</strong>: Başlangıç doğrultuculuğu; küçük açılarda toparlama sertliğini belirler.</li>
              </ul>
            </section>

            <section>
              <h4 className="text-base font-semibold text-foreground mb-2">Denge, GZ Eğrisi ve Enerji Anlamı</h4>
              <p>
                Denge, devirmeye çalışan ve doğrultan momentlerin eşit olduğu noktadır. <strong>GZ eğrisi</strong>, açıya (
                φ) bağlı doğrultucu kolu gösterir. Eğrinin altında kalan alan, geminin devrilmeye karşı <strong>enerji
                rezervi</strong>dir. Başlıca göstergeler: maksimum GZ değeri ve açısı, 0–30°, 0–40° ve 30–40° aralıklarında
                eğri altı alanlar, doğrultuculuk aralığı (stability range) ve <em>Angle of Vanishing Stability (AVS)</em>.
              </p>
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Küçük açılar:   GZ ≈ GM · sin(φ)
Genel durumda: GZ(φ) = KN(φ) − KG · sin(φ)
RM = Δ · GZ`}</pre>
              </div>
            </section>

            <section>
              <h4 className="text-base font-semibold text-foreground mb-2">IMO (2008 IS Code) — Tipik Hasarsız Kriterler</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Alan (0–30°) ≥ 0.055 m·rad</li>
                <li>Alan (0–40°) ≥ 0.090 m·rad</li>
                <li>Alan (30–40°) ≥ 0.030 m·rad</li>
                <li>Maksimum GZ ≥ 0.20 m ve tepe açısı ≥ 30°</li>
                <li>Başlangıç GM ≥ 0.15 m (gemi tipine göre değişebilir)</li>
              </ul>
              <p className="text-xs mt-1">Not: Gemi türüne göre özel kurallar ve farklı eşikler uygulanabilir.</p>
            </section>

            <section>
              <h4 className="text-base font-semibold text-foreground mb-2">Serbest Yüzey Etkisi (FSE) ve Düzeltme</h4>
              <p>
                Yarı dolu tanklarda sıvı yüzeyi hareket edebilir; kütle transferi <strong>KG</strong>'yi artırır ve
                <strong>GM</strong>'yi düşürür. Bu etki, birden fazla tankta mevcutsa toplanır. Kritik operasyonlarda
                tankları mümkünse <em>tam</em> ya da <em>boş</em> tutmak güvenlidir.
              </p>
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`GM_düz = GM − ΣFSC
FSC ≈ (ρ_tank / ρ_deniz) · (I_f / ∇)
I_f (dikdörtgen) = l · b³ / 12`}</pre>
              </div>
            </section>

            <section>
              <h4 className="text-base font-semibold text-foreground mb-2">İnklinasyon Deneyi (Inclining Test)</h4>
              <p>
                Geminin <strong>KG</strong> ve <strong>GM</strong> değerlerini belirlemek için belirli ağırlıklar güverte
                üzerinde kontrollü şekilde yana kaydırılır; oluşan denge açılarından <strong>GMT</strong> hesaplanır.
              </p>
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`GMT = (w · l) / (Δ · tan φ)`}</pre>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                <li>Birden fazla deneme yapılır, ortalama alınır; çevresel etkiler (rüzgâr, dalga) minimize edilir.</li>
                <li>Sonuçlar ışığında <strong>KG</strong> ve <strong>GM</strong> kalibrasyonu yapılır.</li>
              </ul>
            </section>

            <section>
              <h4 className="text-base font-semibold text-foreground mb-2">Rüzgâr Altında Davranış ve Weather Criterion</h4>
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Rüzgâr basıncı: q = 0.5 · ρ_hava · V²
Kuvvet:        F = q · A
Devirme mom.:  M_h = F · z
Heeling kolu:  a_h = M_h / (Δ · g)`}</pre>
              </div>
              <p>
                <em>Weather Criterion</em>: Rüzgârın oluşturduğu alan, GZ eğrisi altında kalan sağlama alanını aşmamalıdır;
                denge açısı makul sınırlar içinde kalmalıdır (tipik rehberlik ≈ 16° çevresi).
              </p>
            </section>

            <section>
              <h4 className="text-base font-semibold text-foreground mb-2">Angle of Loll (GM &lt; 0 Durumu)</h4>
              <p>
                Eğer yükleme sonucu <strong>GM &lt; 0</strong> ise gemi küçük bir açıya kadar kendiliğinden yan yatmış halde
                dengede kalır (<em>loll</em>). Bu tehlikelidir; sıvı transferi ve yük düzenlemesiyle <strong>KG</strong>
                düşürülerek <strong>GM</strong> pozitife çevrilmelidir.
              </p>
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Yaklaşım: tan φ_loll ≈ √(−2 · GM / BMT),  GM < 0`}</pre>
              </div>
            </section>

            <section>
              <h4 className="text-base font-semibold text-foreground mb-2">Yalpa Periyodu (Hızlı Tahmin)</h4>
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`T ≈ 2π · k / √(g · GM_düz)`}</pre>
              </div>
              <p>
                Burada <em>k</em> deneyimsel bir katsayıdır; pratikte kabaca <em>k ≈ 0.35 · B</em> alınabilir.
              </p>
            </section>

            <section>
              <h4 className="text-base font-semibold text-foreground mb-2">Boyuna Stabilite (Trim) — Kısa Not</h4>
              <p>
                Boyuna düzlemde dengelenme <strong>LCG–LCB</strong> farkı ve <strong>MCT</strong> (Moment to Change Trim)
                ile değerlendirilir. Yüklerin boyuna yer değişimi trim oluşturur; MCT ve LCF/LCB verileriyle hesaplanır.
              </p>
              <div className="bg-muted/30 rounded p-3">
                <pre className="font-mono text-sm leading-6">{`Trim (moment yaklaşımı): Trim = Δ · (LCG − LCB) / MCT`}</pre>
              </div>
            </section>

            <section>
              <h4 className="text-base font-semibold text-foreground mb-2">Özel Yükler: Tahıl (Grain) ve Diğerleri</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Tahıl yüzeyi seyirde düzleşip kayarak ilave <em>heeling</em> ve <strong>GM</strong> kaybı yaratır.</li>
                <li><strong>Grain Code</strong>: Genelde düzeltilmiş <strong>GM</strong> sınırları ve denge açısı kısıtları ister.</li>
                <li>Önlemler: boşluk doldurma, bölme, üst ağırlığın azaltılması, tank yönetimi.</li>
              </ul>
            </section>

            <section>
              <h4 className="text-base font-semibold text-foreground mb-2">Hasarlı Stabilite (Özet)</h4>
              <p>
                Su geçirmez bölmeler, <em>margin line</em> ve yanal/boyuna su alma senaryoları ile değerlendirilir. GZ
                eğrisi, su basmış hacimler ve serbest yüzeylerle yeniden hesaplanır; regülasyonlar gemi tipine göre farklıdır.
              </p>
            </section>

            <section>
              <h4 className="text-base font-semibold text-foreground mb-2">Operasyonel Yol Haritası</h4>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Doğru <strong>lightship</strong> ve güncel yük/tank verileriyle <strong>KG</strong> hesapla.</li>
                <li><strong>GM</strong> ve <strong>GM_düz</strong> (FSE ile) kontrol et.</li>
                <li>Hidrostatik tablolardan <strong>KN</strong> eğrilerini al, <strong>GZ</strong> eğrisini oluştur.</li>
                <li>IMO kriterlerini (alanlar, maksimum GZ, başlangıç GM) değerlendir.</li>
                <li>Rüzgâr/yalpa, özel yük (Grain, timber, DG) kurallarını uygula.</li>
                <li>Şüphede kalırsan onaylı stabilite kitapçığı ve yazılımla doğrula.</li>
              </ol>
            </section>

            <section>
              <h4 className="text-base font-semibold text-foreground mb-2">Sık Hatalar ve İpuçları</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Başlangıç GM ile tüm açı­lar için stabiliteyi eşitlemek (yanlış). Büyük açılarda <strong>GZ</strong> belirleyicidir.</li>
                <li>Kısmi dolu tankların <strong>FSE</strong> etkisini göz ardı etmek.</li>
                <li>Kayıp/ilave geçici yükleri (<em>portable</em>) KG hesabına katmamak.</li>
                <li>Rüzgâr etkisinde alan kıyasını (<em>Weather Criterion</em>) yapmamak.</li>
                <li>İnklinasyon verilerini tek denemeye göre almak (yeterli değil; tekrar ve ortalama alın).</li>
              </ul>
            </section>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button asChild variant="default" className="gap-2">
            <a href="#gm-kg">
              <Calculator className="h-4 w-4" /> Başa Dön
            </a>
          </Button>
        </div>

        <Separator />
      </div>
    </MobileLayout>
  );
}

