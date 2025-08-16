import React from 'react';
import { MobileLayout } from '@/components/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RuleSection {
  title: string;
  rules: string[];
  sources: { label: string; href: string }[];
}

const sections: RuleSection[] = [
  {
    title: '2008 IS Code — Hasarsız (Intakt) Stabilite',
    rules: [
      'GZ eğrisi alanı: 0°–30° ≥ 0.055 m·rad; 0°–40° (veya taşma açısına kadar) ≥ 0.090 m·rad; 30°–40° ≥ 0.030 m·rad.',
      'Maksimum GZ ≥ 0.20 m ve tepe açısı θ ≥ 30°.',
      'Başlangıç GM (GM0) ≥ 0.15 m (çelik kuru yük, genel kargo vb. için tipik taban değer).',
      'Pozitif stabilite menzili en az 30°; borda kesim hattı (deck edge) tercihen 30°’den sonra batmalı.',
      'Weather criterion: 26–40 m/s rüzgârda denge açısı θw ≤ 16° veya θdeck’in %80’i (hangisi küçükse).',
      'Weather criterion: Aynı sınırlayıcı açıya kadar kalan GZ alanı, rüzgâr devirmesine karşı en az %40 fazlalık göstermeli.'
    ],
    sources: [
      { label: 'IMO 2008 IS Code (MSC.267(85))', href: 'https://www.imo.org/en/publications' }
    ]
  },
  {
    title: 'International Grain Code — Tahıl Yükleri',
    rules: [
      'Düzeltilmiş GM (GMcorr) ≥ 0.30 m (serbest yüzey ve tahıl kayması düzeltmeleri dahil).',
      'Tahıl kaymasıyla oluşan denge açısı θ ≤ 12° veya borda kesim hattı batma açısından küçük olanı.',
      'Her yükleme durumu için onaylı Grain Loading Manual’daki kriterler doğrulanmalı ve DOA (Document of Authorization) gemide bulundurulmalı.'
    ],
    sources: [
      { label: 'International Grain Code', href: 'https://www.imo.org/en/publications' }
    ]
  },
  {
    title: 'SOLAS II‑1 — Olasılıksal Hasar Stabilitesi',
    rules: [
      'A (sağkalım) ≥ R (gerekli) — tüm kıç‑baş hasar senaryolarının ağırlıklı toplamı, gerekli değerden küçük olmamalı.',
      'Hasarlı durumda son durum: serbest yüzey/trim etkileriyle birlikte can salı indirme ve erişim koşulları sağlanmalı.',
      'Damage Control Plan/Booklet gemide; uzaktan kumandalı vana/su geçmez kapı yerleri ve ölçüm noktaları plan üzerinde gösterilmeli.'
    ],
    sources: [
      { label: 'SOLAS 1974, Bölüm II‑1', href: 'https://www.imo.org/en/publications' }
    ]
  },
  {
    title: 'Timber Deck Cargo Code — Güverte Tomruk',
    rules: [
      'Yığın yüksekliği/eğim ve bağlama (stanchion, tel, çember) MSL esaslı hesaplarla doğrulanmalı.',
      'Kötü hava için işletme talimatları: güverte drenajı, güverte erişimi ve görüş koşulları sağlanmalı.',
      'Yükleme örnekleri için IS Code kriterlerine ilave emniyet marjı korunmalı.'
    ],
    sources: [
      { label: '2011 Timber Deck Cargo Code', href: 'https://www.imo.org/en/publications' }
    ]
  },
  {
    title: 'IBC/IGC — Kimyasal ve Gaz Tankerleri',
    rules: [
      'Kargo tipine bağlı intakt ve hasar stabilitesi şartları (survival capability) sağlanmalı.',
      'Her onaylı yükleme durumu için stabilite cihazı ile doğrulama yapılmalı; model/doğrulama sertifikaları güncel olmalı.'
    ],
    sources: [
      { label: 'IBC Code / IGC Code', href: 'https://www.imo.org/en/publications' }
    ]
  },
  {
    title: 'Polar Code — Kutup Suları Operasyonları',
    rules: [
      'Buz tutması (icing) için KG artışı muhafaza edilerek yeterli GM ve GZ marjı korunmalı.',
      'PWOM’da belirtilen operasyon limitleri ve acil durum prosedürleri uygulanmalı.'
    ],
    sources: [
      { label: 'Polar Code (MSC.385(94))', href: 'https://www.imo.org/en/publications' }
    ]
  },
  {
    title: 'CSS Code (Annex 13) — CSM Bağlama Hesaplarına Esas Sayılar',
    rules: [
      'Tipik sürtünme katsayıları: çelik/çelik μ ≈ 0.10; çelik/ahşap μ ≈ 0.30; ahşap/ahşap μ ≈ 0.40; kauçuk/çelik μ ≈ 0.60 (kuru, yağsız yüzey varsayımı).',
      'MSL (Maximum Securing Load) ve ivme katsayıları (long., transv., vert.) gemi boyu ve servis hızına göre Annex 13 tablolarından seçilir.'
    ],
    sources: [
      { label: 'CSS Code, Annex 13', href: 'https://www.imo.org/en/publications' }
    ]
  },
  {
    title: 'Stockholm Agreement — Ro‑Ro Yolcu (Bölgesel Ek Şartlar)',
    rules: [
      'Araç güvertesinde su birikmesi etkisi: hesabında tipik varsayım 0.50 m su yüksekliği (yönergedeki tablolara göre) ve uygun permeabilite ile dikkate alınır.',
      'Su birikmesi dahil hasar stabilitesi değerlendirmesinde A ≥ R şartı korunmalı; can salı/evakuasyon koşulları sağlanmalı.'
    ],
    sources: [
      { label: 'Stockholm Agreement (Ro‑Ro Passenger Ships)', href: 'https://www.imo.org/en/publications' }
    ]
  },
  {
    title: 'Balıkçı Gemileri — Güvenlik Kodu (2005/2012) ve Cape Town Agreement',
    rules: [
      'Başlangıç GM (GM0) için tipik taban değer ≥ 0.35 m (boy ve tasarıma bağlı idare talimatları esas).',
      'GZ alan kriterleri çoğunlukla IS Code ile uyumlu (örn. 0°–30° ≥ 0.055 m·rad).',
      'Düşük serbest borda ve icing riski için ek GM marjı ve operasyon sınırlamaları uygulanmalı.'
    ],
    sources: [
      { label: 'FAO/ILO/IMO Code of Safety for Fishermen & Fishing Vessels (2005/2012)', href: 'https://www.imo.org/en/publications' },
      { label: 'Cape Town Agreement (2012)', href: 'https://www.imo.org/en/OurWork/Safety/Pages/CTA.aspx' }
    ]
  },
  {
    title: 'OSV / SPS — Offshore Supply ve Special Purpose Ships',
    rules: [
      'IS Code kriterleri taban alınır; yük ve personel yoğunluğuna göre minimum GM genellikle ≥ 0.15 m olarak idarelerce talep edilir.',
      'Yük güvertesi serbest yüzey ve yüksek KG etkileri için ek marj ve operasyon limitleri uygulanır.'
    ],
    sources: [
      { label: 'OSV Code (2006/2020)', href: 'https://www.imo.org/en/publications' },
      { label: 'SPS Code (2008)', href: 'https://www.imo.org/en/publications' }
    ]
  },
  {
    title: 'HSC Code — Yüksek Hızlı Tekneler',
    rules: [
      'Yolcu taraflanması/viraj testi altında statik yalpa açısı tipik sınır ≤ 10°.',
      'Minimum GM çoğu konfigürasyonda ≥ 0.15 m; fakat hız, gövde tipi ve seakeeping gereksinimlerine bağlı özel denge testleri uygulanır.'
    ],
    sources: [
      { label: 'HSC Code (1994/2000)', href: 'https://www.imo.org/en/publications' }
    ]
  },
  {
    title: 'MODU Code — Mobil Açık Deniz Üniteleri',
    rules: [
      'Rüzgâr hızları: işletme durumu için tipik 36 m/s, fırtına/survival durumu için 51.5 m/s eşdeğer rüzgâr; heeling moment buna göre alınır.',
      'Righting/Heeling moment eğrisi karşılaştırması ile yeterli emniyet marjı gösterilir; pozitif stabilite menzili ve hava boşluğu (air gap) kontrol edilir.'
    ],
    sources: [
      { label: 'MODU Code (2009)', href: 'https://www.imo.org/en/publications' }
    ]
  },
  {
    title: 'Load Line (LL) — Yükleme Sınırı Sözleşmesi Bağlantıları',
    rules: [
      'Minimum fribord ve kaporta/üstyapı bütünlüğü; downflooding açıları ve muhtemel su giriş yolları stabilite analizinde sınırlandırıcıdır.',
      'Stabilite kitapçığındaki taşma (downflooding) açısı gemi bütünlük şartları ile tutarlı olmalı; LL işaretlemeleri ile çelişmemelidir.'
    ],
    sources: [
      { label: 'International Load Line Convention (1966/1988)', href: 'https://www.imo.org/en/publications' }
    ]
  }
];

export default function StabilityRules() {
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
              <BookOpen className="h-5 w-5" /> Stabilite Kuralları (Özet ve Kaynakça)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {sections.map((sec) => (
                <div key={sec.title}>
                  <h3 className="text-lg font-semibold mb-2">{sec.title}</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {sec.rules.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                  <div className="text-xs mt-2">
                    Kaynaklar:{' '}
                    {sec.sources.map((s, i) => (
                      <span key={s.href}>
                        <a href={s.href} target="_blank" rel="noreferrer" className="underline">{s.label}</a>
                        {i < sec.sources.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">Not: Bu sayfa özet niteliğindedir. Nihai doğrulama için ilgili IMO kodlarının güncel onaylı baskılarına başvurunuz.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}