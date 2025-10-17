import React from "react";
import { ArrowLeft, BookOpen, Sigma, Calculator, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function StabilityTopicsPage() {
  return (
    <div key="stability-topics-v2" className="relative min-h-screen overflow-hidden" data-no-translate>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-dark via-primary to-primary-light" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        {/* Back */}
        <div className="mb-8">
          <Link to="/stability">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Geri
            </Button>
          </Link>
        </div>

        {/* Title */}
        <div className="mb-6 text-center">
          <h1 className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 drop-shadow-sm">Stabilite Konu Anlatımı</h1>
          <p className="mt-2 text-sm text-white/90">Gemi stabilitesi ve yük işlemleri — özet, formül ve pratik akışlar</p>
        </div>

        <div className="space-y-6">
          {/* 1. Giriş ve Tanımlar */}
          <Card className="shadow-lg border-white/30 bg-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-700" /> 1) Giriş ve Temel Tanımlar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7">
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Deplasman (Δ)</strong>: Δ = ρ · ∇. Deniz: 1.025 t/m³, Tatlı: 1.000 t/m³.</li>
                <li><strong>Boş deplasman (LSW)</strong>: Yapı + makine + daimi donanım; yük/yakıt/balast yok.</li>
                <li><strong>DWT</strong>: Δ<sub>yüklü</sub> − Δ<sub>boş</sub>.</li>
                <li><strong>GT/NT</strong>: Hacimsel; 1 GT = 2.83 m³.</li>
              </ul>
              <div className="bg-white/5 rounded p-3 overflow-x-auto">
                <pre className="font-mono text-xs whitespace-pre-wrap">{`Hogging: (dF + dA)/2 > dM   |   Sagging: (dF + dA)/2 < dM
Metrik draft okumada rakam alt/orta/üst: +0/+5/+10 cm`}</pre>
              </div>
            </CardContent>
          </Card>

          {/* 2. Enine Denge */}
          <Card className="shadow-lg border-white/30 bg-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sigma className="h-5 w-5 text-blue-700" /> 2) Enine Denge (Transverse Stability)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7">
              <div className="bg-white/5 rounded p-3 overflow-x-auto">
                <pre className="font-mono text-xs whitespace-pre-wrap">{`KM = KB + BM
GM = KM − KG
Küçük açılar:  GZ(φ) ≈ GM · sin φ`}</pre>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Yeni KG</strong>: KG' = (Σ wᵢ·KGᵢ) / (Σ wᵢ)</li>
                <li><strong>Dikey shifting</strong>: ΔGM = (w·d)/Δ (yukarı + ⇒ GM ↓)</li>
                <li><strong>Yatay shifting</strong>: GZ = (w·y)/Δ; θ = arctan(GZ/GM)</li>
                <li><strong>Bumba/Kreyn</strong>: GG₁ = w(h<sub>cunda</sub>−h<sub>yük</sub>)/Δ; GM' = GM − GG₁</li>
              </ul>
            </CardContent>
          </Card>

          {/* 3. Boyuna Denge ve Trim */}
          <Card className="shadow-lg border-white/30 bg-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-700" /> 3) Boyuna Denge (Trim)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7">
              <div className="bg-white/5 rounded p-3 overflow-x-auto">
                <pre className="font-mono text-xs whitespace-pre-wrap">{`Trim(cm) = Σ(wᵢ · LCGᵢ) / MCT (1 cm)
Paralel batma (cm) = w / TPC
LCF mastoride: ΔdF = −ΔTrim/2,  ΔdA = +ΔTrim/2`}</pre>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                <li>LCF mastoride değilse: ΔdF = −(L<sub>F</sub>/LBP)·ΔTrim; ΔdA = +(L<sub>A</sub>/LBP)·ΔTrim</li>
                <li>Draft düzeltmesi: gözlemlenen trim ve LBD ile düzelt.</li>
              </ul>
            </CardContent>
          </Card>

          {/* 4. Draft Survey */}
          <Card className="shadow-lg border-white/30 bg-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sigma className="h-5 w-5 text-blue-700" /> 4) Draft Survey
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7">
              <div className="bg-white/5 rounded p-3 overflow-x-auto">
                <pre className="font-mono text-xs whitespace-pre-wrap">{`MMM = (dF + dA + 6·dM)/8
Δ₁ = Trim·LCF·TPC·100 / LBP
Δ₂ = Trim² · ΔMCT · 50 / LBP  (daima +)
Δρ = (ρ/1.025 − 1) · Δ`}</pre>
              </div>
              <p className="text-xs opacity-90">Nihai: Δ<sub>nihai</sub> = Δ<sub>MMM</sub> + Δ₁ + Δ₂ + Δρ; Net yük = Δ<sub>nihai</sub> − Δ<sub>boş</sub> − yakıt − su − diğer.</p>
            </CardContent>
          </Card>

          {/* 5. SOLAS ve GZ */}
          <Card className="shadow-lg border-white/30 bg-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-blue-700" /> 5) SOLAS Kriterleri ve GZ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7">
              <ul className="list-disc pl-5 space-y-1">
                <li>GM min: genel ≥ 0.15 m; tahıl ≥ 0.30 m.</li>
                <li>Alanlar: 0–30° ≥ 0.055 m·rad; 0–40° ≥ 0.090; 30–40° ≥ 0.030.</li>
                <li>GZ: GZ(θ) = KN(θ) − KG·sin θ; GZ<sub>max</sub> ≥ 0.20 m, ≥ 25°.</li>
                <li>FSM/FSC: If ≈ L·B³/12; GM<sub>düz</sub> = GM − ΣFSC (tanklar tam dolu/boş).</li>
              </ul>
            </CardContent>
          </Card>

          {/* 6. Yük ve Diğer Hesaplar */}
          <Card className="shadow-lg border-white/30 bg-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-700" /> 6) Yük ve Diğer Hesaplar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7">
              <div className="bg-white/5 rounded p-3 overflow-x-auto">
                <pre className="font-mono text-xs whitespace-pre-wrap">{`Dikdörtgen tank: V = L·B·H;  m = V·ρ
Blok katsayısı:  Cb = ∇/(L·B·T)
FWA = Δ/(4·TPC);  ΔT(mm) = FWA·(1025 − ρ)/25
Yakıt ρ(T): ρ₂ = ρ₁ − (T₂ − T₁)·k`}</pre>
              </div>
            </CardContent>
          </Card>

          {/* 7. Pratik Akışlar */}
          <Card className="shadow-lg border-white/30 bg-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-700" /> 7) Pratik Çözüm Akışları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm leading-7">
              <ol className="list-decimal pl-5 space-y-1">
                <li>KG/GM: Moment₀ = Δ·KG → moment ekle/çıkar → KG' → GM = KM − KG'.</li>
                <li>Trim/Draft: Mt = Σ(w·LCG) → ΔTrim = Mt/MCT → paralel batma = w/TPC → LCF ile dağıt.</li>
                <li>Yatay shifting: GZ = (w·y)/Δ; θ = arctan(GZ/GM).</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
