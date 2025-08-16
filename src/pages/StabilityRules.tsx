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
      'GZ eğrisi alanı: 0°–30° ≥ 0.055 m·rad; 0°–40° ≥ 0.090 m·rad; 30°–40° ≥ 0.030 m·rad.',
      'Maksimum GZ ≥ 0.20 m ve tepe açısı θ ≥ 30°. ',
      'Başlangıç GM (GM0) ≥ 0.15 m (genel yolcu/dökme/dry cargo için).',
      'Weather criterion: Rüzgâr etkisinde denge açısına kadar artık alan şartı sağlanmalı (IS Code ilgili bölümler).'
    ],
    sources: [
      { label: 'IMO 2008 IS Code (MSC.267(85))', href: 'https://www.imo.org/en/publications' }
    ]
  },
  {
    title: 'International Grain Code — Tahıl Yükleri',
    rules: [
      'Düzeltilmiş GM (serbest yüzey + tahıl kayması düzeltmeleri sonrası) GMcorr ≥ 0.30 m.',
      'Tahıl kayması sonucu denge açısı θ ≤ 12°. ',
      'Düşey su geçer hattı/drenaj ve boşluk doldurma önlemleri uygulanmalı; onaylı Grain Loading Manual gemide bulundurulmalı.'
    ],
    sources: [
      { label: 'International Grain Code', href: 'https://www.imo.org/en/publications' }
    ]
  },
  {
    title: 'SOLAS II‑1 — Olasılıksal Hasar Stabilitesi',
    rules: [
      'A (sağkalım) ≥ R (gerekli) kriteri sağlanmalı; s‑ ve p‑faktörlerine göre hasar senaryoları değerlendirilir.',
      'Damage Control Plan/Booklet gemide bulunmalı; su geçmez kapılar ve uzaktan kumandalar plan üzerinde gösterilmeli.',
      'Yükleme durumları için onaylı hasar stabilitesi kontrolü yapılmalı (stability instrument veya eşdeğeri).'
    ],
    sources: [
      { label: 'SOLAS 1974, Bölüm II‑1', href: 'https://www.imo.org/en/publications' }
    ]
  },
  {
    title: 'Timber Deck Cargo Code — Güverte Tomruk',
    rules: [
      'Tomruk bağlama/çemberleme MSL esaslı hesaplarla doğrulanmalı.',
      'Görüş/drenaj ve güverte erişimi sağlanmalı; kötü hava için işletme talimatları uygulanmalı.',
      'Stabilite marjı, IS Code kriterlerine ilave olarak yükleme konfigürasyonuna göre korunmalı.'
    ],
    sources: [
      { label: '2011 Timber Deck Cargo Code', href: 'https://www.imo.org/en/publications' }
    ]
  },
  {
    title: 'IBC/IGC — Kimyasal ve Gaz Tankerleri',
    rules: [
      'Kargo tipine bağlı intakt/hasar stabilitesi şartları ve tank düzeni sınırlamaları sağlanmalı.',
      'Her onaylı yükleme durumu için cihazla doğrulama (stability instrument) yapılmalı.'
    ],
    sources: [
      { label: 'IBC Code / IGC Code', href: 'https://www.imo.org/en/publications' }
    ]
  },
  {
    title: 'Polar Code — Kutup Suları Operasyonları',
    rules: [
      'Buz tutması (icing) ve düşük sıcaklıklar için KG artışı ve stabilite marjı dikkate alınmalıdır.',
      'PWOM (Polar Water Operational Manual) gemide bulunmalı ve işletme limitleri uygulanmalıdır.'
    ],
    sources: [
      { label: 'Polar Code (MSC.385(94))', href: 'https://www.imo.org/en/publications' }
    ]
  },
  {
    title: 'Cargo Securing Manual (CSM) — Bağlama ve İstif',
    rules: [
      'Gemi ivmeleri (CSS Code, Annex 13) ile bağlama hesapları yapılmalı; MSL ve sürtünme katsayıları esas alınmalı.',
      'Özel/parça yükler, araç ve konteynerler için işletim kuralları uygulanmalı.'
    ],
    sources: [
      { label: 'CSS Code (Annex 13)', href: 'https://www.imo.org/en/publications' }
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