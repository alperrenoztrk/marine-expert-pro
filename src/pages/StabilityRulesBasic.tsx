import React from 'react';
import { MobileLayout } from '@/components/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, GraduationCap, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StabilityRulesBasic() {
  return (
    <MobileLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link to="/stability">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Geri
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" /> Stabilite Kuralları — Temel Düzey (Öğrenciler için)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 text-sm leading-6 text-muted-foreground">
              <section>
                <h3 className="text-base font-semibold text-foreground mb-2">1) Neden Stabilite?</h3>
                <p>
                  Bir gemi; rüzgâr, dalga ve yük değişimlerine rağmen kendiliğinden dik konuma dönebiliyorsa <strong>stabil</strong> kabul edilir. 
                  Stabilitenin temelinde, devirmeye çalışan momentlere (rüzgâr, yük kayması, serbest yüzey vb.) karşı koyan <strong>doğrultucu moment</strong> vardır.
                </p>
              </section>
              
              <section>
                <h3 className="text-base font-semibold text-foreground mb-2">2) Temel Kavramlar (KG, GM, GZ)</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>KG</strong>: Ağırlık merkezinin su hattına olan yüksekliği. KG artarsa gemi "üst ağırlıklı" olur.</li>
                  <li><strong>GM</strong>: Başlangıç doğrultuculuk (metasentrik yükseklik). <em>GM = KM − KG</em>. GM ne kadar büyükse küçük açılarda gemi o kadar "sert" toparlar.</li>
                  <li><strong>GZ</strong>: Yalpa açısında doğrultucu kol. GZ eğrisinin altında kalan alan, geminin devrilmeye karşı enerjisidir.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-foreground mb-2">3) IS Code Kısaca (Hasarsız Stabilite)</h3>
                <p>Güvenli sayılmak için tipik olarak şu şartlar aranır:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>GZ alanları: 0°–30° ≥ 0.055 m·rad; 0°–40° ≥ 0.090 m·rad; 30°–40° ≥ 0.030 m·rad.</li>
                  <li>Maksimum GZ ≥ 0.20 m ve tepe açısı ≥ 30°.</li>
                  <li>Başlangıç <strong>GM ≥ 0.15 m</strong> (kuru yük vb. için tipik taban).</li>
                  <li><strong>Weather criterion</strong>: Rüzgâr altında kalan alan, rüzgâr devirmesine karşı yeterli olmalı; denge açısı genelde 16° civarını aşmamalıdır.</li>
                </ul>
                <p className="mt-2 text-xs">Kaynak: 2008 IS Code (MSC.267(85))</p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-foreground mb-2">4) Tahıl Kodu (Grain Code) — Pratik Mantık</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Tahıl, seyirde yüzeyini düzleştirir ve yana kayabilir. Bu, <strong>GM</strong>'i düşürür ve <strong>heeling moment</strong> oluşturur.</li>
                  <li>Düzeltilmiş <strong>GMcorr ≥ 0.30 m</strong> olmalı; kayma sonrası denge açısı ≤ 12°.</li>
                  <li>Boşluk doldurma ve bölme gibi önlemlerle kayma azaltılır.</li>
                </ul>
                <p className="mt-2 text-xs">Kaynak: International Grain Code</p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-foreground mb-2">5) Serbest Yüzey Etkisi (FSE) — En Sık Hata</h3>
                <p>Yarı dolu tanklar, kütlenin hareketine izin vererek KG'yi <strong>artırır</strong> ve GM'yi <strong>azaltır</strong>. Basit yaklaşım:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Birden fazla tank aynı anda yarı dolu ise <strong>FSE toplam</strong>ı eklenir.</li>
                  <li>Kısıt: Kritik durumlarda tankları ya "tam" ya da "boş" tutmaya çalışın.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-foreground mb-2">6) Hızlı Kontrol Listesi</h3>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Doğru <strong>lightship</strong> verisi ve <strong>KG</strong> kullanılıyor mu?</li>
                  <li>Tüm tanklar için <strong>FSE</strong> tablosu uygulandı mı?</li>
                  <li>GZ eğrisi alanları ve <strong>GM</strong> kriteri sağlanıyor mu?</li>
                  <li>Rüzgâr/yalpa (weather criterion) kontrol edildi mi?</li>
                  <li>Özel kargo: <strong>Grain</strong>, timber, dangerous goods vb. kuralı uygulandı mı?</li>
                  <li>Sonuçlar <strong>onaylı kitapçık</strong> ve/veya <strong>stability computer</strong> ile doğrulandı mı?</li>
                </ol>
              </section>

              <section className="rounded-md border p-3 bg-muted/30">
                <div className="flex items-center gap-2 text-foreground font-medium mb-1"><Info className="h-4 w-4" /> Önemli Not</div>
                <p>Bu sayfa eğitim amaçlıdır. Nihai doğrulama için <strong>IMO 2008 IS Code</strong>, <strong>International Grain Code</strong> ve ilgili kodların güncel baskılarına başvurun.</p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}