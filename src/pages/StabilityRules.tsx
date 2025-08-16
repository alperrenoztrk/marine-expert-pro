import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MobileLayout } from '@/components/MobileLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, ArrowLeft, Upload, Trash2, Link as LinkIcon } from 'lucide-react';
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

const storageKey = (id: string) => `manual:${id}`;

export default function StabilityRulesPage() {
  const [selected, setSelected] = useState<ManualItem | null>(manuals[0] || null);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pendingUploadId = useRef<string | null>(null);

  useEffect(() => {
    try {
      const map: Record<string, string> = {};
      manuals.forEach((m) => {
        const v = localStorage.getItem(storageKey(m.id));
        if (v) map[m.id] = v;
      });
      setOverrides(map);
    } catch {}
  }, []);

  const effectiveUrl = useMemo(() => {
    if (!selected) return undefined;
    return overrides[selected.id] || selected.filename;
  }, [selected, overrides]);

  const onFileChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const targetId = pendingUploadId.current;
    if (!files || files.length === 0 || !targetId) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      try {
        localStorage.setItem(storageKey(targetId), dataUrl);
      } catch {}
      setOverrides((prev) => ({ ...prev, [targetId]: dataUrl }));
      if (selected?.id === targetId) {
        setSelected({ ...selected });
      }
    };
    reader.readAsDataURL(file);
    // reset
    if (fileInputRef.current) fileInputRef.current.value = '';
    pendingUploadId.current = null;
  };

  const handleUpload = (id: string) => {
    pendingUploadId.current = id;
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleClear = (id: string) => {
    try { localStorage.removeItem(storageKey(id)); } catch {}
    setOverrides((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  return (
    <MobileLayout>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={onFileChosen}
      />
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
                  <div key={m.id} className="space-y-1 border rounded-md p-2">
                    <div className="flex items-center justify-between gap-2">
                      <Button
                        variant={selected?.id === m.id ? 'default' : 'outline'}
                        className="w-full justify-start gap-2"
                        onClick={() => setSelected(m)}
                      >
                        <FileText className="h-4 w-4" />
                        {m.title}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Button size="xs" variant="secondary" className="h-7 px-2 gap-1" onClick={() => handleUpload(m.id)}>
                          <Upload className="h-3 w-3" /> Yükle
                        </Button>
                        {overrides[m.id] && (
                          <Button size="xs" variant="destructive" className="h-7 px-2 gap-1" onClick={() => handleClear(m.id)}>
                            <Trash2 className="h-3 w-3" /> Sil
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {m.external && (
                          <a href={m.external} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline">
                            <LinkIcon className="h-3 w-3" /> Resmi bilgi
                          </a>
                        )}
                      </div>
                    </div>
                    {overrides[m.id] && (
                      <div className="text-[10px] text-muted-foreground mt-1">Yerel PDF kullanılıyor</div>
                    )}
                  </div>
                ))}
                <p className="text-xs text-muted-foreground mt-2">
                  Not: Kendi PDF’lerinizi tek tek yükleyebilir veya kalıcı olması için dosyaları `public/manuals` klasörüne ekleyebilirsiniz.
                </p>
              </div>

              {/* Right: viewer */}
              <div className="md:col-span-2">
                <PdfViewer url={effectiveUrl} title={selected?.title} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}