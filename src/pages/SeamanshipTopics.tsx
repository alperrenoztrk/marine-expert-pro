import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Anchor, Waves, Wind, LifeBuoy, Ruler, Wrench, BookOpen, ChevronDown } from "lucide-react";

export default function SeamanshipTopicsPage() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const isOpen = (id: string) => !!openSections[id];
  const toggle = (id: string) => setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  const open = (id: string) => setOpenSections(prev => (prev[id] ? prev : { ...prev, [id]: true }));

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.slice(1);
      if (id) open(id);
    }
  }, []);

  const toc = [
    { id: "anchoring", title: "Demirleme", icon: Anchor },
    { id: "mooring", title: "Halat ve Bağlama", icon: Waves },
    { id: "heavy-weather", title: "Fırtına Manevraları", icon: Wind },
    { id: "mob", title: "Can Kurtarma (MOB)", icon: LifeBuoy },
    { id: "deck-ops", title: "Güverte İşleri", icon: Ruler },
    { id: "daily-ops", title: "Günlük Operasyonlar", icon: Wrench },
  ];

  return (
    <MobileLayout>
      <div className="space-y-6 max-w-3xl mx-auto leading-relaxed break-words" data-no-translate>
        <div className="flex items-center justify-between">
          <Link to="/seamanship-menu">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Gemicilik
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Konu Anlatımı • v1.0
          </div>
        </div>

        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Anchor className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold">Gemicilik Konu Anlatımı</h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Demirleme, bağlama, ağır hava manevraları, MOB, güverte işleri ve günlük operasyonlar için pratik rehber.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> İçindekiler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {toc.map(item => (
                <a key={item.id} href={`#${item.id}`}>
                  <Button variant="outline" size="sm" onClick={() => open(item.id)}>
                    {item.title}
                  </Button>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Demirleme */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('anchoring')} className="cursor-pointer" aria-expanded={isOpen('anchoring')}>
            <CardTitle id="anchoring" className="scroll-mt-24 flex items-center justify-between">
              Demirleme
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('anchoring') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('anchoring') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Hazırlık:</strong> Demir yeri, derinlik, zeminin yapısı ve serbest salınım dairesi kontrol edilir.</li>
              <li><strong>Zincir Miktarı:</strong> Derinliğin 3–5 katı (hava/deniz durumuna göre artırılır).</li>
              <li><strong>Drop & Heave:</strong> Rüzgâr pruvada; demir bırakılır, zincir kontrollü salınır; tutuş teyidi.</li>
              <li><strong>Kontroller:</strong> Transits, bearing değişimi ve GPS ile sürüklenme kontrolü.</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* Halat ve Bağlama */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('mooring')} className="cursor-pointer" aria-expanded={isOpen('mooring')}>
            <CardTitle id="mooring" className="scroll-mt-24 flex items-center justify-between">
              Halat ve Bağlama
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('mooring') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('mooring') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Düzen:</strong> Baş/kıç spring, head/stern, breast lines ile simetrik yük paylaşımı.</li>
              <li><strong>Emniyet:</strong> Bight altında kalma; snap-back bölgelerinden uzak durma.</li>
              <li><strong>Ayar:</strong> Gelgit ve rüzgâra göre periyodik sıkma/gevşetme; chafe koruması.</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* Fırtına Manevraları */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('heavy-weather')} className="cursor-pointer" aria-expanded={isOpen('heavy-weather')}>
            <CardTitle id="heavy-weather" className="scroll-mt-24 flex items-center justify-between">
              Fırtına Manevraları
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('heavy-weather') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('heavy-weather') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Rota/Sürat:</strong> Dalga gelişine göre başa/omağa alma; parametric/ synchronous roll riskine dikkat.</li>
              <li><strong>Hazırlık:</strong> Güvertede emniyet; sızdırmazlık; yük bağlama kontrolü.</li>
              <li><strong>Makine:</strong> Yüksek hazır ol (standby); dümen periyodik; su alma/sürüklenme izleme.</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* MOB */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('mob')} className="cursor-pointer" aria-expanded={isOpen('mob')}>
            <CardTitle id="mob" className="scroll-mt-24 flex items-center justify-between">
              Can Kurtarma (MOB)
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('mob') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('mob') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Alarm/İşaret:</strong> MOB alarmı; göz temasını kaybetme; can simidi/duman/ışık at.</li>
              <li><strong>Manevra:</strong> Williamson/Anderson/Scharnow manevraları; rüzgâr/akıntı tarafına yaklaş.</li>
              <li><strong>Kurtarma:</strong> Jacob’s ladder/ rescue boat; hipotermi ve ilk yardım.</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* Güverte İşleri */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('deck-ops')} className="cursor-pointer" aria-expanded={isOpen('deck-ops')}>
            <CardTitle id="deck-ops" className="scroll-mt-24 flex items-center justify-between">
              Güverte İşleri
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('deck-ops') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('deck-ops') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Bakım:</strong> Pas temizliği, boyama, güverte donanımı muayeneleri.</li>
              <li><strong>Yük Emniyeti:</strong> Lashings/ stanchions/ tarpaulins; stabilite etkileri (GM, GZ).</li>
              <li><strong>İletişim:</strong> Güverte-makine-köprüüstü koordinasyonu; iş izinleri.</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* Günlük Operasyonlar */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('daily-ops')} className="cursor-pointer" aria-expanded={isOpen('daily-ops')}>
            <CardTitle id="daily-ops" className="scroll-mt-24 flex items-center justify-between">
              Günlük Operasyonlar
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('daily-ops') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('daily-ops') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Watchkeeping:</strong> Köprüüstü vardiyası, kayıtlar, checklist’ler.</li>
              <li><strong>Emniyet:</strong> Driller, ekipman kontrolleri, PPE kullanımı.</li>
              <li><strong>Rutinler:</strong> Yakıt/su/yağ kontrolleri, atık yönetimi, ISM kayıtları.</li>
            </ul>
          </CardContent>
          )}
        </Card>

        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">Sürüm: v1.0 • Gemicilik konuları için temel özet ve pratik notlar eklendi.</div>
          <Button asChild variant="default" className="gap-2">
            <a href="#anchoring">
              Başa Dön
            </a>
          </Button>
        </div>

        <Separator />
      </div>
    </MobileLayout>
  );
}

