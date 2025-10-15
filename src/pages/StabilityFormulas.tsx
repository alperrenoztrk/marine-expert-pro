import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Calculator } from "lucide-react";

export default function StabilityFormulasPage() {

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

        {/** İçindekiler bölümü kaldırıldı */}

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="temel" className="scroll-mt-24">⚖️ Temel Tanımlar ve Kavramlar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-muted rounded">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-2">Terim</th>
                    <th className="p-2">Sembol</th>
                    <th className="p-2">Tanım / Formül</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-2">Deplasman</td>
                    <td className="p-2">Δ</td>
                    <td className="p-2 font-mono">Δ = ρ · ∇</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2">Yoğunluk</td>
                    <td className="p-2">ρ</td>
                    <td className="p-2">Deniz suyu: 1.025 t/m³, Tatlı su: 1.000 t/m³</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2">Draft (Ortalama)</td>
                    <td className="p-2">T</td>
                    <td className="p-2 font-mono">T = (T_f + T_a)/2</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2">Trim</td>
                    <td className="p-2">—</td>
                    <td className="p-2 font-mono">Trim = T_a − T_f</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2">MCT 1 cm</td>
                    <td className="p-2">—</td>
                    <td className="p-2 font-mono">MCT<sub>1cm</sub> ≈ (Δ · GM<sub>L</sub> / L) · 0.01 ≈ (ρ · I<sub>TL</sub> / L) · 0.01 (veya Stabilite Kitapçığı)</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2">Tons per cm Immersion</td>
                    <td className="p-2">TPC</td>
                    <td className="p-2 font-mono">TPC = ρ · A<sub>w</sub> / 100 (A<sub>w</sub>: su hattı alanı)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="yuzerlik" className="scroll-mt-24">⚓ Yüzerlik ve Metasentrik Yükseklik</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3 overflow-x-auto">
              <pre className="font-mono text-sm leading-6 whitespace-pre-wrap break-words">{`KB ≈ T · (0.53 + 0.085·C_B)   (yaklaşım, aksi halde tablodan)
BM_T = I_T / ∇
KM_T = KB + BM_T
GM_T = KM_T − KG
Küçük açılar:   GZ(φ) ≈ GM_T · sin φ
Genel:          GZ(φ) = KN(φ) − KG · sin φ`}</pre>
            </div>
            <p>I<sub>T</sub>: su hattı alanının enine atalet momenti; KN(φ): hidrostatik tablodan.</p>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="agirlik" className="scroll-mt-24">⚙️ Ağırlık Transferleri ve KG Hesapları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3 overflow-x-auto">
              <pre className="font-mono text-sm leading-6 whitespace-pre-wrap break-words">{`Yeni KG (ağırlık eklendi):   KG' = (Δ·KG + w·KG_w)/(Δ + w)
Yeni KG (ağırlık kaldırıldı): KG' = (Δ·KG − w·KG_w)/(Δ − w)
Dikey taşınma:                ΔKG = (w · h)/Δ   (yukarı +)
Yatay taşınma (heel):         tan φ ≈ (w · y)/(Δ · GM_T)
Boyuna taşınma (trim):        Trim(cm) = (w · l)/MCT_1cm`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="trim" className="scroll-mt-24">🧮 Trim Hesapları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3 overflow-x-auto">
              <pre className="font-mono text-sm leading-6 whitespace-pre-wrap break-words">{`Trim değişimi (cm):       Trim = M_t / MCT_1cm
Trim momenti:             M_t = Δ·(LCG − LCB)  (veya w·l)
Baş draft değişimi:       ΔT_f = −Trim · (LCF→FP)/L
Kıç draft değişimi:       ΔT_a =  Trim · (LCF→AP)/L
Ortalama draft değişimi:  ΔT_mean(cm) = w / TPC`}</pre>
            </div>
            <p>İşaretler LCF referansına göredir; mesafeler boyuna eksen üzerindeki izdüşümlerdir.</p>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="free-surface" className="scroll-mt-24">🧭 Free Surface Effect (Serbest Yüzey Etkisi)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3 overflow-x-auto">
              <pre className="font-mono text-sm leading-6 whitespace-pre-wrap break-words">{`FSM = ρ_tank · I_f
FSC = FSM / Δ = (ρ_tank/ρ_deniz) · (I_f/∇)
GM_düz = GM − ΣFSC
I_f (dikdörtgen) = l · b³ / 12`}</pre>
            </div>
            <p>Birden fazla yarı dolu tank varsa düzeltmeler toplanır.</p>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="heel-gz" className="scroll-mt-24">⚓ Yanal Eğilme (Heel) ve GZ Eğrisi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3 overflow-x-auto">
              <pre className="font-mono text-sm leading-6 whitespace-pre-wrap break-words">{`Doğrultucu Moment: RM(φ) = Δ · GZ(φ)
Heeling moment (ör.): M_h = w·y  veya  M_h = F·z
Eşitlik (statik):    RM(φ_eq) = M_h(φ_eq)  ⇔  GZ(φ_eq) = a_h(φ_eq)
GZ (büyük açılar):   GZ(φ) = KN(φ) − KG · sin φ  (KN: tablodan)`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="curves" className="scroll-mt-24">⚙️ Kararlılık Eğrileri (Statical Stability Curves)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3 overflow-x-auto">
              <pre className="font-mono text-sm leading-6 whitespace-pre-wrap break-words">{`GZ eğrisi altı alan: A(θ) = ∫_0^θ GZ(φ) dφ   [m·rad]
Dinamik stabilite:    Δ · A(θ)                   [ton·m·rad]
Maksimum GZ açısı:    θ_max (genelde 30°–40°)
AVS:                  φ_AVS s.t. GZ(φ_AVS) = 0`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="loading" className="scroll-mt-24">⚖️ Yükleme, Ballast ve Denge Hesapları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3 overflow-x-auto">
              <pre className="font-mono text-sm leading-6 whitespace-pre-wrap break-words">{`Trim düzeltmesi (LCG≠LCB): Trim(cm) = Δ·(LCG − LCB)/MCT_1cm
LCF ile draft dağılımı:     ΔT_f = −Trim · (LCF→FP)/L;  ΔT_a = Trim · (LCF→AP)/L
KG düzeltmesi (transfer):   KG' = KG ± (w·h)/Δ   →   GM' = KM − KG'`}</pre>
            </div>
            <p>LCF, LCB ve MCT değerleri onaylı hidrostatik/stabilite kitapçığından alınmalıdır.</p>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="grain" className="scroll-mt-24">🧱 Tahıl ve Serbest Yük Stabilitesi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3 overflow-x-auto">
              <pre className="font-mono text-sm leading-6 whitespace-pre-wrap break-words">{`Grain Heeling Moment: M_g = GSM  (Grain Code'dan)
Minimum GM (özet):    SOLAS/Grain Code şartlarına göre GM_düz ≥ GM_min
Heeling düzeltmesi:   GZ(φ) = a_h,grain(φ) eşitliğinden denge açısı bulunur`}</pre>
            </div>
            <p>Tahıl için kayma momentleri (GSM) ve kriterler <em>International Grain Code</em> kapsamında verilir.</p>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="freeboard" className="scroll-mt-24">🌊 Freeboard, Draft ve Trim Uyumları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3 overflow-x-auto">
              <pre className="font-mono text-sm leading-6 whitespace-pre-wrap break-words">{`Ortalama draft:     T_mean = (T_f + T_a)/2
Deplasman değişimi:  Δ_final = Δ_initial ± Σw
Son deplasman:       Δ_final (yoğunluğa göre ∇ = Δ/ρ)
Ton-mile moment:     TM = w · mesafe (deniz mili)`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="denge" className="scroll-mt-24">⚙️ Statik ve Dinamik Denge Koşulları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3 overflow-x-auto">
              <pre className="font-mono text-sm leading-6 whitespace-pre-wrap break-words">{`Statik denge:   RM(φ) = M_h(φ)  ve  GM > 0 (küçük açılar)
Nötr denge:     GM = 0  ve  GZ ≈ 0 (küçük açılar)
Kararsız denge: GM < 0  ve  GZ < 0 (küçük açılar)`}</pre>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle id="ek" className="scroll-mt-24">🔧 Kullanışlı Ek Formüller</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/30 rounded p-3 overflow-x-auto">
              <pre className="font-mono text-sm leading-6 whitespace-pre-wrap break-words">{`Dikdörtgen yüzey atalet mom.: I = l · b³ / 12
Su hattı alanı (yaklaşım):    A_w = L_WL · B_WL · C_W
Blok katsayısı:               C_B = ∇/(L · B · T)
Deplasman hacmi:              ∇ = Δ/ρ`}</pre>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button asChild variant="default" className="gap-2">
            <a href="#temel">
              <Calculator className="h-4 w-4" /> Başa Dön
            </a>
          </Button>
        </div>

        {/** Alt çizgi kaldırıldı */}
      </div>
    </MobileLayout>
  );
}

