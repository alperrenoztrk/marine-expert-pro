import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";

type Detail = {
  title: string;
  group: string;
  content: string;
};

const details: Record<string, Detail> = {
  // 1. Giriş
  "giris": {
    title: "1. Giriş – Hogging & Sagging Tespiti",
    group: "Giriş",
    content: `Hogging & Sagging Tespiti:
Hogging: (dF + dA)/2 > dM
Sagging: (dF + dA)/2 < dM`,
  },

  // 2. Enine Denge Hesapları
  "moment-kg": {
    title: "2.1. Moment ve KG Hesapları",
    group: "Enine Denge Hesapları",
    content: `Toplam Moment:
Moment = Ağırlık × KG Mesafesi

Yeni KG:
KG_yeni = Toplam Moment / Toplam Ağırlık

GM Hesaplama:
GM = KM − KG`,
  },
  "gm-shifting": {
    title: "2.2. Shifting ile GM Değişimi",
    group: "Enine Denge Hesapları",
    content: `GM Değişimi:
ΔGM = (w × d) / Δ`,
  },
  "meyil-acisi": {
    title: "2.3. Meyil Açısı Hesaplama",
    group: "Enine Denge Hesapları",
    content: `GZ Kolu:
GZ = (w × y) / Δ

Meyil Açısı:
	an(θ) = GZ / GM`,
  },
  "kreyn-gm": {
    title: "2.4. Bumba/Kreyn ile GM Değişimi",
    group: "Enine Denge Hesapları",
    content: `GM Azalması:
GG₁ = (w × (h_cunda − h_yük)) / Δ`,
  },
  "havuzlama-gm": {
    title: "2.5. Havuzlamada Kritik GM",
    group: "Enine Denge Hesapları",
    content: `P Kuvveti:
P = (MCT × Trim (cm)) / l

GM Değişimi:
ΔGM = (P × KM) / Δ`,
  },

  // 3. Boyuna Denge Hesapları
  "trim-degisimi": {
    title: "3.1. Trim Değişimi",
    group: "Boyuna Denge Hesapları",
    content: `Trim Değişimi:
ΔTrim = Toplam Moment / MCT`,
  },
  "paralel-batma": {
    title: "3.2. Paralel Batma/Çıkma",
    group: "Boyuna Denge Hesapları",
    content: `Paralel Batma (cm):
Batma = w / TPC`,
  },
  "draft-duzeltme": {
    title: "3.3. Baş/Kıç Draft Düzeltmesi",
    group: "Boyuna Denge Hesapları",
    content: `Baş/Kıç Draft Düzeltmesi:
Düzeltme = (Mesafe × Trim) / LBD`,
  },

  // 4. Draft Survey
  "mmm-draft": {
    title: "4.1. MMM Draft",
    group: "Draft Survey",
    content: `MMM = (dF + dA + 6 × dM) / 8`,
  },
  "trim-duzeltmeleri": {
    title: "4.2. Trim Düzeltmeleri",
    group: "Draft Survey",
    content: `1. Trim Düzeltmesi:
Δ₁ = (Trim × LCF × TPC × 100) / LBP

2. Trim Düzeltmesi:
Δ₂ = (Trim² × ΔMCT × 50) / LBP`,
  },
  "yogunluk-duzeltmesi": {
    title: "4.3. Yoğunluk Düzeltmesi",
    group: "Draft Survey",
    content: `Δρ = ((ρ / 1.025) − 1) × Δ`,
  },

  // 5. Diğer Hesaplar
  "duba-tank-hacim": {
    title: "5.1. Duba/Tank Hacim Hesapları",
    group: "Diğer Hesaplar",
    content: `Hacim:
V = Boy × En × Yükseklik

Kütle:
m = V × ρ`,
  },
  "blok-katsayisi": {
    title: "5.2. Blok Katsayısı",
    group: "Diğer Hesaplar",
    content: `C_b = ∇ / (L × B × T)`,
  },
  "fwa-yogunluk": {
    title: "5.3. Yoğunluk Farkı ve FWA",
    group: "Diğer Hesaplar",
    content: `FWA:
FWA = Δ / (4 × TPC)

Draft Değişimi:
ΔT = (FWA × (1025 − ρ)) / 25`,
  },

  // 6. SOLAS Stabilite Kriterleri
  "kumelenme-acisi": {
    title: "6.1. Kümelenme Açısı",
    group: "SOLAS Stabilite Kriterleri",
    content: `θ = (57.3 × GHM) / (Δ × GM)`,
  },
  "gz-kn": {
    title: "6.2. GZ Kolu (KN Eğrileri)",
    group: "SOLAS Stabilite Kriterleri",
    content: `GZ = KN − KG · sin(θ)`,
  },
  "simpson-alan": {
    title: "6.3. Simpson ile Alan Hesabı",
    group: "SOLAS Stabilite Kriterleri",
    content: `Simpson 1/3 Kuralı:
A = (h/3) · (y0 + 4y1 + 2y2 + ··· + yn)

Simpson 3/8 Kuralı:
A = (3h/8) · (y0 + 3y1 + 3y2 + y3)`,
  },
  "fsm": {
    title: "6.4. Serbest Yüzey Momenti (FSM)",
    group: "SOLAS Stabilite Kriterleri",
    content: `GG₁ = (L × B³) / (12 × V) × (ρ_sıvı / ρ_deniz) × (1 / n²)`,
  },
  "yalpa-periyodu": {
    title: "6.5. Yalpa Periyodu",
    group: "SOLAS Stabilite Kriterleri",
    content: `T = (C_b × B) / √(GM)`,
  },
  "yarali-stabilite": {
    title: "6.6. Yaralı Stabilite",
    group: "SOLAS Stabilite Kriterleri",
    content: `ΔT = w / ((L × B) − (L_yaralı × B))`,
  },

  // 7. Yük Hesapları
  "musade-yuk": {
    title: "7.1. Müsaade Edilen Yük",
    group: "Yük Hesapları",
    content: `Maksimum Yük Yüksekliği:
h_max = SF × PL

Maksimum Yük Miktarı:
w_max = V_ambar / SF`,
  },
  "sicaklik-yogunluk": {
    title: "7.2. Sıcaklıkla Yoğunluk Değişimi",
    group: "Yük Hesapları",
    content: `ρ₂ = ρ₁ − ((T₂ − T₁) × k)`,
  },
};

export default function StabilityFormulaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const detail = (id && details[id]) || null;

  return (
    <MobileLayout>
      <div className="space-y-4" data-no-translate>
        <div className="flex items-center justify-between">
          <Link to="/stability/formulas">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Formüller
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Stabilite Formülleri
          </div>
        </div>

        {!detail ? (
          <Card className="shadow">
            <CardHeader>
              <CardTitle>Sayfa bulunamadı</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">Geçersiz başlık kimliği.</div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow">
            <CardHeader>
              <div className="text-xs text-primary">{detail.group}</div>
              <CardTitle className="scroll-mt-24">{detail.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="bg-muted/30 rounded p-3 overflow-x-auto">
                <pre className="font-mono text-sm leading-6 whitespace-pre-wrap break-words">{detail.content}</pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MobileLayout>
  );
}
