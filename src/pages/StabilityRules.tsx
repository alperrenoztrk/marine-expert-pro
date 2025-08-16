import React, { useState } from 'react';
import { MobileLayout } from '@/components/MobileLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PdfViewer } from '@/components/ui/pdf-viewer';

interface ManualItem {
  id: string;
  title: string;
  filename: string; // served from /public/manuals
  external?: string; // official reference/purchase/info
}

const manuals: ManualItem[] = [
  { id: 'damage-stability-booklet', title: 'Damage Stability Booklet / Damage Control Plan', filename: '/manuals/damage-stability-booklet.pdf', external: 'https://www.imo.org/en/publications' },
  { id: 'grain-loading-manual', title: 'Grain Loading Manual (Tahıl)', filename: '/manuals/grain-loading-manual.pdf', external: 'https://www.imo.org/en/publications' },
  { id: 'timber-deck-cargo-manual', title: 'Timber Deck Cargo Manual (Güverte Tomruk)', filename: '/manuals/timber-deck-cargo-manual.pdf', external: 'https://www.imo.org/en/publications' },
  { id: 'loading-manual-stability-instrument', title: 'Loading Manual / Stability Instrument (Kılavuz + Onay)', filename: '/manuals/loading-manual-stability-instrument.pdf', external: 'https://www.imo.org/en/publications' },
  { id: 'cargo-securing-manual', title: 'Cargo Securing Manual (CSM)', filename: '/manuals/cargo-securing-manual.pdf', external: 'https://www.imo.org/en/publications' },
  { id: 'ibc-igc-stability-loading', title: 'IBC/IGC Stabilite/Yükleme Kitapçıkları', filename: '/manuals/ibc-igc-stability-loading.pdf', external: 'https://www.imo.org/en/publications' },
  { id: 'polar-water-operational-manual', title: 'Polar Water Operational Manual (PWOM)', filename: '/manuals/polar-water-operational-manual.pdf', external: 'https://www.imo.org/en/publications' },
];

export default function StabilityRulesPage() {
  const [selected, setSelected] = useState<ManualItem | null>(manuals[0] || null);

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
              <BookOpen className="h-5 w-5" /> Stabilite Kuralları
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Left: manual list */}
              <div className="md:col-span-1 space-y-2">
                {manuals.map((m) => (
                  <div key={m.id} className="flex items-center justify-between gap-2">
                    <Button
                      variant={selected?.id === m.id ? 'default' : 'outline'}
                      className="w-full justify-start gap-2"
                      onClick={() => setSelected(m)}
                    >
                      <FileText className="h-4 w-4" />
                      {m.title}
                    </Button>
                    {m.external && (
                      <a href={m.external} target="_blank" rel="noreferrer" className="text-xs underline whitespace-nowrap">
                        Resmi bilgi
                      </a>
                    )}
                  </div>
                ))}
                <p className="text-xs text-muted-foreground mt-2">
                  Not: PDF açılmıyorsa dosyayı aynı adla `public/manuals` klasörüne ekleyin ve sayfayı yenileyin.
                </p>
              </div>

              {/* Right: viewer */}
              <div className="md:col-span-2">
                <PdfViewer url={selected?.filename} title={selected?.title} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}