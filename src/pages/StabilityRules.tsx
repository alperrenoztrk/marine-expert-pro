import React, { useState } from 'react';
import { MobileLayout } from '@/components/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, Shuffle } from 'lucide-react';
import { StabilityQuiz } from '@/components/stability/StabilityQuiz';
import { stabilityQuestions, getQuestionsByCategory, getAllCategories, getRandomQuestions } from '@/data/stabilityQuestions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RuleSection {
  title: string;
  rules: string[];
  sources: { label: string; href: string }[];
  extras?: { heading: string; items: string[] }[];
}

const sections: RuleSection[] = [
  {
    title: '2008 IS Code — Hasarsız (Intakt) Stabilite',
    rules: [
      'GZ eğrisi alanı: 0°–30° ≥ 0.055 m·rad; 0°–40° (veya taşma açısına kadar) ≥ 0.090 m·rad; 30°–40° ≥ 0.030 m·rad.',
      'Maksimum GZ ≥ 0.20 m ve tepe açısı θ ≥ 30°.',
      'Başlangıç GM (GM0) ≥ 0.15 m (çelik kuru yük, genel kargo vb. için tipik taban değer).',
      'Pozitif stabilite menzili en az 30°; borda kesim hattı (deck edge) tercihen 30°’den sonra batmalı.',
      'Hava koşulu kriteri (Weather Criterion): 26–40 m/s rüzgârda denge açısı θw ≤ 16° veya θdeck’in %80’i (hangisi küçükse).',
      'Hava koşulu kriteri (Weather Criterion): Aynı sınırlayıcı açıya kadar kalan GZ alanı, rüzgâr devirmesine karşı en az %40 fazlalık göstermeli.'
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
      'Olasılıksal yöntem: A = Σ(s × p). Burada s: hasar sonrası sağkalım katsayısı, p: o hasarın meydana gelme olasılığı (bölme uzunluğu/konumuna bağlı).',
      'R: Gemi boyuna bağlı olarak yönetmelikte tablolarla verilen “gerekli” değerdir.',
      'Kriter: A ≥ R sağlanmalıdır; değilse bölümlendirme/stabilite yetersiz kabul edilir.',
      'Hasarlı durumda son durum: serbest yüzey/trim etkileriyle birlikte can salı indirme ve erişim koşulları sağlanmalı.',
      'Damage Control Plan/Booklet gemide; su geçmez kapılar ve uzaktan kumandalar ile ölçüm noktaları plan üzerinde gösterilmeli.'
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
    extras: [
      {
        heading: 'Eklenebilecekler',
        items: [
          'Sızıntı senaryoları: Kargo sızıntısı halinde serbest yüzey, KG değişimi ve heeling moment etkilerini içeren hassasiyet analizleri.',
          'Buharlaşma etkileri: Uçucu kargolarda buharlaşmanın kütle/yoğunluk ve KG üzerindeki etkilerini dikkate alan yöntemler.'
        ]
      },
      {
        heading: 'Güncellenmesi Gerekenler',
        items: [
          'Kargo tipleri: Yeni kimyasal ve gaz kargo tipleri için (IBC/IGC son ekleri uyarınca) ilave stabilite gereksinimlerinin eklenmesi.'
        ]
      }
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
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [quizQuestions, setQuizQuestions] = useState(stabilityQuestions);

  const categories = getAllCategories();

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleBackToRules = () => {
    setShowQuiz(false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setQuizQuestions(stabilityQuestions);
    } else {
      setQuizQuestions(getQuestionsByCategory(category));
    }
  };

  const handleRandomQuiz = () => {
    const randomQuestions = getRandomQuestions(10);
    setQuizQuestions(randomQuestions);
    setSelectedCategory('random');
    setShowQuiz(true);
  };

  const handleQuizComplete = (score: number, total: number) => {
    // Quiz tamamlandığında yapılacak işlemler
    console.log(`Quiz completed: ${score}/${total}`);
  };

  if (showQuiz) {
    return (
      <MobileLayout>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="gap-2" onClick={handleBackToRules}>
              Kurallara Dön
            </Button>
            <div className="text-sm text-muted-foreground">
              {selectedCategory === 'all' ? 'Tüm Sorular' : 
               selectedCategory === 'random' ? 'Rastgele Sorular' : 
               selectedCategory}
            </div>
          </div>
          
          <StabilityQuiz 
            questions={quizQuestions} 
            onComplete={handleQuizComplete}
          />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="space-y-4">

        {/* Quiz Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" /> Stabilite Quiz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Stabilite bilginizi test edin! Quiz'de otomatik geçiş yoktur, önceki ve sonraki butonları kullanarak kendi hızınızda ilerleyebilirsiniz.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Sorular ({stabilityQuestions.length})</SelectItem>
                      {categories.map(category => {
                        const count = getQuestionsByCategory(category).length;
                        return (
                          <SelectItem key={category} value={category}>
                            {category} ({count})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleStartQuiz} className="gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Quiz Başlat
                  </Button>
                  <Button variant="outline" onClick={handleRandomQuiz} className="gap-2">
                    <Shuffle className="h-4 w-4" />
                    Rastgele 10
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                  {sec.extras?.map((ex) => (
                    <div key={ex.heading} className="mt-2">
                      <div className="text-sm font-medium text-foreground">{ex.heading}</div>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                        {ex.items.map((it, j) => (
                          <li key={j}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
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