import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Waves, Ruler, Activity, Package, LineChart, LifeBuoy, ClipboardCheck, type LucideIcon } from "lucide-react";

export default function Stability2() {
  const sections: { id: string; title: string; icon: LucideIcon; items: string[] }[] = [
    {
      id: "transverse",
      title: "1) Enine Stabilite (Transverse)",
      icon: Shield,
      items: [
        "KMt, KB, BMt, KG, GMt (I_WP: su hattı alan atâleti, enine)",
        "GZ eğrisi: küçük açılar için; tam eğri hidrost. tablolardan",
        "Alan kriterleri: 0–30°, 0–40°, max GZ ve açıları",
        "Serbest yüzey düzeltmesi (FSE) – I_f: tank serbest yüzey atâleti",
        "Yük kayması (shifting) – yana kayma momenti",
        "Yalpa (rolling) periyodu (yaklaşık) – C ≈ 0.8–1.1"
      ]
    },
    {
      id: "longitudinal",
      title: "2) Boyuna Stabilite (Trim / Longitudinal)",
      icon: Waves,
      items: [
        "KMl, BMl, GMl (boyuna atâlet)",
        "Trim ve MCT 1 cm (yaklaşık, pratikte hidrost. cetvelden)",
        "Yük/aktarma ile trim: d = yükün LCF’ye boyuna uzaklığı",
        "Uç draft değişimleri (yaklaşık)"
      ]
    },
    {
      id: "intact",
      title: "3) Sağlam (Intact) Stabilite",
      icon: LifeBuoy,
      items: [
        "Temel ilişkiler",
        "GZ eğrisi parametreleri: max GZ, max GZ açısı, alanlar",
        "Rüzgâr kriteri kontrolü: rüzgâr heeling lever – GZ kesişimi",
        "Serbest yüzey düzeltmeleri (tüm tanklar)",
        "Minimum GM / alan limitlerinin kontrolü"
      ]
    },
    {
      id: "damage",
      title: "4) Zarar Görmüş (Damage) Stabilite",
      icon: Activity,
      items: [
        "Hasarlı hacimler & geçirgenlik (μ) ile lost buoyancy / added weight",
        "Denge hâli: su hattı, trim, heel",
        "Bölme dolma senaryoları: tek/çok bölme; boyuna, enine, dikey",
        "Marj çizgisi ve limit su hattı ihlalleri",
        "Kümülatif indeksler (A ≥ R vb.)"
      ]
    },
    {
      id: "dynamic",
      title: "5) Dinamik Stabilite",
      icon: LineChart,
      items: [
        "Enerji kriteri (∫GZ dθ)",
        "Rüzgâr/dalga momenti – GZ etkileşimi ve zarf eğrileri",
        "Parametrik/senkron yalpa risk değerlendirmesi",
        "Broaching & surf-riding için hız–dalga–trim kontrolleri"
      ]
    },
    {
      id: "loading",
      title: "6) Yükleme & Denge (Cargo / Loading)",
      icon: Package,
      items: [
        "DWT, hacim/ağırlık limiti, Stowage factor (SF)",
        "Moment toplamları ve merkezler (x,y,z)",
        "Tank kütleleri: ullage/trim düzeltmesi → kütle & merkez",
        "List açısı: yan ağırlık farkı",
        "Serbest yüzey ve dökme yük kayması düzeltmeleri",
        "Loadicator çıktıları: trim, draftlar, GM, GZ, SF/BM"
      ]
    },
    {
      id: "strength",
      title: "7) Boyuna Dayanım (Longitudinal Strength)",
      icon: Ruler,
      items: [
        "Dağıtılmış yük diyagramı",
        "Kesme kuvveti (SF) ve eğilme momenti (BM)",
        "Ambar/tank zemin basınçları, kapak/güverte yük limitleri",
        "Maks. izin verilen SF/BM ile karşılaştırma",
        "Hogging/sagging durumlarının kontrolü"
      ]
    },
    {
      id: "loadline",
      title: "8) Hat Başlıkları / Sefer Uygunluğu (Draft–Freeboard–Load Line)",
      icon: Waves,
      items: [
        "Draft & freeboard: ölçülen draftlardan mevcut freeboard",
        "Yoğunluk düzeltmesi: tuzluluk farkı → immersion yaklaşımı",
        "TPC (Tonnes per cm) ve immersion/emersion",
        "Load Line markaları (S, T, F vb.) limit kontrolleri",
        "Trim etkisiyle uç draftların uygunluğu"
      ]
    },
    {
      id: "verification",
      title: "9) Doğrulama & Kalibrasyon",
      icon: ClipboardCheck,
      items: [
        "Inclining experiment: w·d → GM doğrulaması",
        "Lightship survey: lightship ağırlığı ve merkezleri",
        "Loadicator kalibrasyonu: draft–trim–SF/BM–GM karşılaştırmaları",
        "Hidrost. tablo uyumu: gemi çizelgeleri ↔ ölçümler"
      ]
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Helmet>
        <title>Stabilite 2 | Gelişmiş Stabilite Başlıkları</title>
        <meta name="description" content="Stabilite 2: Enine ve boyuna stabilite, sağlam ve hasarlı stabilite, dinamik stabilite, yükleme, boyuna dayanım, load line ve kalibrasyon." />
        <link rel="canonical" href="/stability-2" />
      </Helmet>

      <header className="flex items-center justify-between">
        <Link to="/calculations">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Geri
          </Button>
        </Link>
      </header>

      <main>
        <h1 className="text-3xl font-bold mb-2" data-no-translate>Stabilite 2</h1>
        <p className="text-muted-foreground mb-4">Aşağıda her başlık altında ilgili hesaplamalar özetlenmiştir.</p>

        <div className="grid gap-4 md:grid-cols-2">
          {sections.map(({ id, title, icon: Icon, items }) => (
            <article key={id} id={id} className="scroll-mt-20">
              <Card>
                <CardHeader className="flex flex-row items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base md:text-lg" data-no-translate>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm md:text-[15px]">
                    {items.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
