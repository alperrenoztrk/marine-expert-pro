import { useState } from "react";
import { Link } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Waves, 
  Calculator, 
  BookOpen, 
  ChevronRight, 
  Moon, 
  Sun, 
  Anchor,
  Ship,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Clock,
  Ruler
} from "lucide-react";

// Tide curve visualization component
const TideCurveVisualization = () => {
  const width = 320;
  const height = 180;
  const padding = 30;
  
  // Generate sinusoidal tide curve
  const points: string[] = [];
  for (let i = 0; i <= 12; i++) {
    const x = padding + (i / 12) * (width - 2 * padding);
    // Sinusoidal curve from LW to HW and back
    const y = height - padding - (Math.sin((i / 12) * Math.PI) * (height - 2 * padding - 20));
    points.push(`${x},${y}`);
  }
  
  // Rule of twelfths markers
  const twelfthsFactors = [1, 2, 3, 3, 2, 1];
  const cumulative = [0, 1, 3, 6, 9, 11, 12];
  
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-md mx-auto">
      {/* Background */}
      <rect x="0" y="0" width={width} height={height} fill="hsl(var(--muted))" rx="8" />
      
      {/* Grid lines */}
      {[0, 2, 4, 6, 8, 10, 12].map((h) => (
        <line 
          key={h} 
          x1={padding + (h / 12) * (width - 2 * padding)} 
          y1={padding - 10} 
          x2={padding + (h / 12) * (width - 2 * padding)} 
          y2={height - padding + 10} 
          stroke="hsl(var(--border))" 
          strokeWidth="1" 
          strokeDasharray="4,4"
        />
      ))}
      
      {/* Tide curve */}
      <polyline 
        points={points.join(" ")} 
        fill="none" 
        stroke="hsl(var(--primary))" 
        strokeWidth="3" 
        strokeLinecap="round"
      />
      
      {/* LW and HW markers */}
      <circle cx={padding} cy={height - padding} r="6" fill="hsl(var(--destructive))" />
      <circle cx={padding + (width - 2 * padding) / 2} cy={padding} r="6" fill="hsl(var(--success))" />
      <circle cx={width - padding} cy={height - padding} r="6" fill="hsl(var(--destructive))" />
      
      {/* Labels */}
      <text x={padding} y={height - 8} textAnchor="middle" className="fill-muted-foreground text-[10px]">LW</text>
      <text x={padding + (width - 2 * padding) / 2} y={height - 8} textAnchor="middle" className="fill-muted-foreground text-[10px]">6h</text>
      <text x={width - padding} y={height - 8} textAnchor="middle" className="fill-muted-foreground text-[10px]">HW</text>
      
      {/* Twelfths annotations */}
      {twelfthsFactors.map((factor, i) => (
        <g key={i}>
          <text 
            x={padding + ((i + 0.5) / 6) * ((width - 2 * padding) / 2)} 
            y={height / 2 + 40} 
            textAnchor="middle" 
            className="fill-primary text-[9px] font-semibold"
          >
            {factor}/12
          </text>
        </g>
      ))}
    </svg>
  );
};

// Depth diagram component
const DepthDiagram = () => {
  const width = 300;
  const height = 200;
  
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-sm mx-auto">
      {/* Sea surface */}
      <path 
        d="M0 60 Q 30 55, 60 60 T 120 60 T 180 60 T 240 60 T 300 60" 
        fill="none" 
        stroke="hsl(var(--primary))" 
        strokeWidth="3"
      />
      
      {/* Water */}
      <rect x="0" y="60" width={width} height="100" fill="hsl(var(--primary) / 0.15)" />
      
      {/* Sea bed */}
      <rect x="0" y="160" width={width} height="40" fill="hsl(var(--muted-foreground) / 0.3)" />
      <line x1="0" y1="160" x2={width} y2="160" stroke="hsl(var(--muted-foreground))" strokeWidth="2" />
      
      {/* Chart Datum line */}
      <line x1="0" y1="140" x2={width} y2="140" stroke="hsl(var(--warning))" strokeWidth="2" strokeDasharray="8,4" />
      <text x="10" y="135" className="fill-warning text-[9px] font-semibold">Chart Datum (CD)</text>
      
      {/* Ship */}
      <rect x="130" y="40" width="40" height="30" fill="hsl(var(--foreground))" rx="2" />
      <polygon points="150,35 140,40 160,40" fill="hsl(var(--foreground))" />
      
      {/* Draft indicator */}
      <line x1="175" y1="40" x2="175" y2="70" stroke="hsl(var(--destructive))" strokeWidth="2" />
      <text x="180" y="58" className="fill-destructive text-[8px]">Draft</text>
      
      {/* HOT indicator */}
      <line x1="200" y1="60" x2="200" y2="140" stroke="hsl(var(--success))" strokeWidth="2" />
      <text x="205" y="105" className="fill-success text-[8px]">HOT</text>
      
      {/* Charted Depth indicator */}
      <line x1="225" y1="140" x2="225" y2="160" stroke="hsl(var(--primary))" strokeWidth="2" />
      <text x="230" y="152" className="fill-primary text-[8px]">CD</text>
      
      {/* UKC indicator */}
      <line x1="250" y1="70" x2="250" y2="160" stroke="hsl(var(--accent))" strokeWidth="2" />
      <text x="255" y="120" className="fill-accent text-[8px]">UKC</text>
      
      {/* Labels */}
      <text x={width / 2} y="185" textAnchor="middle" className="fill-muted-foreground text-[10px]">Deniz Tabanı</text>
    </svg>
  );
};

// Moon-Sun position diagram
const MoonSunDiagram = ({ type }: { type: "spring" | "neap" }) => {
  const size = 120;
  const center = size / 2;
  
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-24 h-24 mx-auto">
      {/* Earth */}
      <circle cx={center} cy={center} r="15" fill="hsl(var(--primary))" />
      <text x={center} y={center + 3} textAnchor="middle" className="fill-primary-foreground text-[6px] font-bold">Dünya</text>
      
      {/* Sun */}
      <circle 
        cx={type === "spring" ? center + 40 : center + 40} 
        cy={center} 
        r="12" 
        fill="hsl(var(--warning))" 
      />
      <text 
        x={type === "spring" ? center + 40 : center + 40} 
        y={center + 3} 
        textAnchor="middle" 
        className="fill-warning-foreground text-[5px] font-bold"
      >
        ☀
      </text>
      
      {/* Moon */}
      <circle 
        cx={type === "spring" ? center - 35 : center} 
        cy={type === "spring" ? center : center - 40} 
        r="8" 
        fill="hsl(var(--muted-foreground))" 
      />
      <text 
        x={type === "spring" ? center - 35 : center} 
        y={type === "spring" ? center + 2 : center - 38} 
        textAnchor="middle" 
        className="fill-background text-[5px] font-bold"
      >
        ☾
      </text>
      
      {/* Alignment line for spring */}
      {type === "spring" && (
        <line 
          x1={center - 45} 
          y1={center} 
          x2={center + 52} 
          y2={center} 
          stroke="hsl(var(--accent))" 
          strokeWidth="1" 
          strokeDasharray="3,3"
        />
      )}
    </svg>
  );
};

export default function TideCalculationTutorial() {
  const [activeSection, setActiveSection] = useState<string>("intro");
  
  const sections = [
    { id: "intro", title: "Gelgit Nedir?", icon: Waves },
    { id: "terms", title: "Terimler", icon: BookOpen },
    { id: "twelfths", title: "Onikiler Kuralı", icon: Calculator },
    { id: "hot-calc", title: "HOT Hesabı", icon: Clock },
    { id: "ukc-calc", title: "UKC Hesabı", icon: Anchor },
    { id: "warnings", title: "Dikkat Edilecekler", icon: AlertTriangle },
    { id: "examples", title: "Pratik Örnekler", icon: CheckCircle },
  ];
  
  return (
    <MobileLayout>
      <ScrollArea className="h-full">
        <div className="p-4 pb-24 space-y-6">
          {/* Header */}
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Waves className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Gelgit Hesabı</CardTitle>
                  <p className="text-sm text-muted-foreground">Adım Adım Öğrenme Rehberi</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Bu eğitim, gelgit yüksekliği (HOT) ve emniyet derinliği (UKC) hesaplarını 
                adım adım öğretmektedir. Denizcilik eğitiminde kullanılan standart yöntemler 
                ve onikiler kuralı detaylı olarak açıklanmaktadır.
              </p>
            </CardContent>
          </Card>
          
          {/* Navigation Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "outline"}
                size="sm"
                className="shrink-0"
                onClick={() => setActiveSection(section.id)}
              >
                <section.icon className="h-3 w-3 mr-1" />
                {section.title}
              </Button>
            ))}
          </div>
          
          {/* Content Sections */}
          <div className="space-y-6">
            
            {/* Section 1: Gelgit Nedir? */}
            {activeSection === "intro" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Waves className="h-5 w-5 text-primary" />
                    Gelgit Nedir?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">
                    <strong>Gelgit</strong>, Ay ve Güneş'in çekim kuvvetlerinin etkisiyle 
                    deniz seviyesinin periyodik olarak yükselmesi ve alçalmasıdır.
                  </p>
                  
                  <div className="rounded-lg border p-4 bg-muted/30 space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Ay'ın Etkisi
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Ay, Dünya'ya en yakın gök cismi olduğu için gelgit üzerinde en büyük 
                      etkiye sahiptir. Ay'ın çekim kuvveti, deniz sularını kendisine doğru çeker.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border p-4 bg-muted/30 space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Güneş'in Etkisi
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Güneş'in etkisi Ay'ın yaklaşık %46'sı kadardır. Ancak Ay ve Güneş 
                      aynı hizaya geldiğinde etkileri birleşir.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="rounded-lg border p-3 bg-success/10 border-success/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-success/20 text-success border-success/40">
                          Spring Tide
                        </Badge>
                      </div>
                      <MoonSunDiagram type="spring" />
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        <strong>Sizigi Gelgiti:</strong> Ay ve Güneş aynı hizada. 
                        Maksimum gelgit aralığı.
                      </p>
                    </div>
                    
                    <div className="rounded-lg border p-3 bg-warning/10 border-warning/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-warning/20 text-warning border-warning/40">
                          Neap Tide
                        </Badge>
                      </div>
                      <MoonSunDiagram type="neap" />
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        <strong>Kuadratur Gelgiti:</strong> Ay ve Güneş 90° açıda. 
                        Minimum gelgit aralığı.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm" onClick={() => setActiveSection("terms")}>
                      Sonraki: Terimler <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Section 2: Terimler */}
            {activeSection === "terms" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Gelgit Terimleri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DepthDiagram />
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="hw">
                      <AccordionTrigger className="text-sm">
                        <span className="flex items-center gap-2">
                          <Badge className="bg-success">HW</Badge>
                          High Water (Yüksek Su)
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        Gelgit döngüsünde deniz seviyesinin ulaştığı en yüksek nokta. 
                        Tide tablosunda "HW" olarak gösterilir.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="lw">
                      <AccordionTrigger className="text-sm">
                        <span className="flex items-center gap-2">
                          <Badge className="bg-destructive">LW</Badge>
                          Low Water (Alçak Su)
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        Gelgit döngüsünde deniz seviyesinin ulaştığı en düşük nokta. 
                        Tide tablosunda "LW" olarak gösterilir.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="range">
                      <AccordionTrigger className="text-sm">
                        <span className="flex items-center gap-2">
                          <Badge variant="outline">Range</Badge>
                          Gelgit Aralığı
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        HW ve LW arasındaki yükseklik farkı. 
                        <br /><strong>Range = HW - LW</strong>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="hot">
                      <AccordionTrigger className="text-sm">
                        <span className="flex items-center gap-2">
                          <Badge className="bg-primary">HOT</Badge>
                          Height of Tide
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        Belirli bir andaki gelgit yüksekliği. Chart Datum'dan (CD) 
                        su yüzeyine kadar olan mesafe.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="cd">
                      <AccordionTrigger className="text-sm">
                        <span className="flex items-center gap-2">
                          <Badge className="bg-warning text-warning-foreground">CD</Badge>
                          Chart Datum
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        Harita sıfır seviyesi. Haritadaki derinlikler bu seviyeye göre 
                        ölçülür. Genellikle LAT (Lowest Astronomical Tide) alınır.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="duration">
                      <AccordionTrigger className="text-sm">
                        <span className="flex items-center gap-2">
                          <Badge variant="outline">Duration</Badge>
                          Gelgit Süresi
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        LW'den HW'ye (veya tersi) geçen süre. Normal koşullarda yaklaşık 
                        6 saat 12.5 dakikadır.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm" onClick={() => setActiveSection("intro")}>
                      Önceki
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setActiveSection("twelfths")}>
                      Sonraki: Onikiler Kuralı <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Section 3: Onikiler Kuralı */}
            {activeSection === "twelfths" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calculator className="h-5 w-5 text-primary" />
                    Onikiler Kuralı (Rule of Twelfths)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">
                    Gelgit değişimi sinüzoidal bir eğri izler. <strong>Onikiler Kuralı</strong>, 
                    bu eğriyi yaklaşık olarak hesaplamak için kullanılan pratik bir yöntemdir.
                  </p>
                  
                  <TideCurveVisualization />
                  
                  <div className="rounded-lg border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-2 text-left">Saat</th>
                          <th className="p-2 text-center">Değişim</th>
                          <th className="p-2 text-center">Kümülatif</th>
                          <th className="p-2 text-left">Açıklama</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-2 font-mono">1. saat</td>
                          <td className="p-2 text-center font-semibold text-primary">1/12</td>
                          <td className="p-2 text-center">1/12</td>
                          <td className="p-2 text-muted-foreground">Yavaş başlangıç</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2 font-mono">2. saat</td>
                          <td className="p-2 text-center font-semibold text-primary">2/12</td>
                          <td className="p-2 text-center">3/12</td>
                          <td className="p-2 text-muted-foreground">Hızlanıyor</td>
                        </tr>
                        <tr className="border-t bg-primary/5">
                          <td className="p-2 font-mono">3. saat</td>
                          <td className="p-2 text-center font-semibold text-primary">3/12</td>
                          <td className="p-2 text-center">6/12</td>
                          <td className="p-2 text-muted-foreground">Maksimum hız</td>
                        </tr>
                        <tr className="border-t bg-primary/5">
                          <td className="p-2 font-mono">4. saat</td>
                          <td className="p-2 text-center font-semibold text-primary">3/12</td>
                          <td className="p-2 text-center">9/12</td>
                          <td className="p-2 text-muted-foreground">Maksimum hız</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2 font-mono">5. saat</td>
                          <td className="p-2 text-center font-semibold text-primary">2/12</td>
                          <td className="p-2 text-center">11/12</td>
                          <td className="p-2 text-muted-foreground">Yavaşlıyor</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2 font-mono">6. saat</td>
                          <td className="p-2 text-center font-semibold text-primary">1/12</td>
                          <td className="p-2 text-center">12/12</td>
                          <td className="p-2 text-muted-foreground">Yavaş bitiş</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="rounded-lg border p-4 bg-info-muted">
                    <h4 className="font-semibold text-sm text-info-muted-foreground mb-2">
                      Kolay Hatırla: 1-2-3-3-2-1
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Her saat için Range'in kaçta kaçının değişeceğini gösterir.
                      3. ve 4. saatlerde en hızlı değişim yaşanır (toplam 6/12 = %50).
                    </p>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm" onClick={() => setActiveSection("terms")}>
                      Önceki
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setActiveSection("hot-calc")}>
                      Sonraki: HOT Hesabı <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Section 4: HOT Hesabı */}
            {activeSection === "hot-calc" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="h-5 w-5 text-primary" />
                    Adım Adım HOT Hesabı
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">
                    Belirli bir zamandaki gelgit yüksekliğini (HOT) hesaplamak için aşağıdaki 
                    adımları izleyin:
                  </p>
                  
                  <div className="space-y-3">
                    {[
                      {
                        step: 1,
                        title: "Tide Tablosundan Verileri Al",
                        content: "LW ve HW zamanlarını ve yüksekliklerini not edin.",
                        example: "LW: 06:00 → 0.8m, HW: 12:10 → 4.8m"
                      },
                      {
                        step: 2,
                        title: "Range Hesapla",
                        content: "Range = HW Yüksekliği - LW Yüksekliği",
                        example: "Range = 4.8 - 0.8 = 4.0m"
                      },
                      {
                        step: 3,
                        title: "Duration Hesapla",
                        content: "Duration = HW Zamanı - LW Zamanı",
                        example: "Duration = 12:10 - 06:00 = 6 saat 10 dk"
                      },
                      {
                        step: 4,
                        title: "Interval Bul",
                        content: "İstenen zaman ile LW arasındaki süre",
                        example: "İstenen: 09:00 → Interval = 09:00 - 06:00 = 3 saat"
                      },
                      {
                        step: 5,
                        title: "Saat Dilimini Belirle",
                        content: "Interval'i Duration'a oranlayarak hangi 'saat'te olduğunu bul",
                        example: "3h / 6.17h × 6 ≈ 3. saat"
                      },
                      {
                        step: 6,
                        title: "Onikiler Kuralını Uygula",
                        content: "Kümülatif faktörü bul (1+2+3 = 6/12 = 0.5)",
                        example: "3. saat sonu: 6/12 = 0.50"
                      },
                      {
                        step: 7,
                        title: "ΔH Hesapla",
                        content: "ΔH = Range × Faktör",
                        example: "ΔH = 4.0 × 0.50 = 2.0m"
                      },
                      {
                        step: 8,
                        title: "HOT Hesapla",
                        content: "HOT = LW + ΔH (yükseliyor) veya HW - ΔH (alçalıyor)",
                        example: "HOT = 0.8 + 2.0 = 2.8m"
                      }
                    ].map((item) => (
                      <div key={item.step} className="rounded-lg border p-3 bg-muted/20">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-primary">{item.step}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.content}</p>
                            <code className="text-xs bg-muted px-2 py-1 rounded mt-1 inline-block">
                              {item.example}
                            </code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="rounded-lg border-2 border-success/50 p-4 bg-success/5">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span className="font-semibold text-sm">Sonuç</span>
                    </div>
                    <p className="text-sm">
                      Saat 09:00'da gelgit yüksekliği (HOT) = <strong>2.8 metre</strong>
                    </p>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm" onClick={() => setActiveSection("twelfths")}>
                      Önceki
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setActiveSection("ukc-calc")}>
                      Sonraki: UKC Hesabı <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Section 5: UKC Hesabı */}
            {activeSection === "ukc-calc" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Anchor className="h-5 w-5 text-primary" />
                    UKC (Under Keel Clearance) Hesabı
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">
                    <strong>UKC</strong>, geminin omurgası ile deniz tabanı arasındaki 
                    güvenli mesafedir. Bu hesap, geminin sığ sularda güvenle seyir 
                    edebileceğini doğrulamak için kritik öneme sahiptir.
                  </p>
                  
                  <div className="rounded-lg border p-4 bg-muted/30">
                    <h4 className="font-semibold text-sm mb-3">UKC Formülü</h4>
                    <div className="bg-background rounded p-3 font-mono text-sm text-center">
                      UKC = Charted Depth + HOT - Draft - Squat - Safety Margin
                    </div>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="cd">
                      <AccordionTrigger className="text-sm">
                        <span className="flex items-center gap-2">
                          <Ruler className="h-4 w-4" />
                          Charted Depth (Harita Derinliği)
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        Deniz haritasında gösterilen derinlik. Chart Datum'dan deniz 
                        tabanına kadar olan mesafe.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="hot">
                      <AccordionTrigger className="text-sm">
                        <span className="flex items-center gap-2">
                          <Waves className="h-4 w-4" />
                          HOT (Height of Tide)
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        Hesaplanan gelgit yüksekliği. Chart Datum üzerine eklenir.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="draft">
                      <AccordionTrigger className="text-sm">
                        <span className="flex items-center gap-2">
                          <Ship className="h-4 w-4" />
                          Draft (Çekiş/Su Kesimi)
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        Geminin su altında kalan kısmının derinliği. Su yüzeyinden 
                        omurgaya kadar olan mesafe.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="squat">
                      <AccordionTrigger className="text-sm">
                        <span className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4" />
                          Squat (Batma)
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        Gemi hareket halindeyken oluşan hidrodinamik batma etkisi. 
                        Hız arttıkça squat değeri artar. 
                        <br /><strong>Barrass Formülü:</strong> Squat = Cb × (V/100)² × 2
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="safety">
                      <AccordionTrigger className="text-sm">
                        <span className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Safety Margin
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        Beklenmedik durumlar için eklenen güvenlik payı. 
                        Genellikle minimum 0.5m - 1.0m arasında tutulur.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="rounded-lg border p-4 bg-muted/30">
                    <h4 className="font-semibold text-sm mb-3">Örnek Hesaplama</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Charted Depth:</span>
                        <span className="font-mono">9.0 m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>HOT (hesaplanan):</span>
                        <span className="font-mono">+ 2.8 m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Draft:</span>
                        <span className="font-mono">- 8.2 m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Squat:</span>
                        <span className="font-mono">- 0.4 m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Safety Margin:</span>
                        <span className="font-mono">- 0.5 m</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>UKC:</span>
                        <span className="font-mono text-success">2.7 m ✓</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4 bg-warning/10 border-warning/30">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm">Minimum UKC Gereksinimleri</h4>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                          <li>• Açık deniz: Draft'ın %10'u veya min. 1.5m</li>
                          <li>• Kıyı suları: Draft'ın %15'i veya min. 2.0m</li>
                          <li>• Liman/kanal: Yerel düzenlemelere göre</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm" onClick={() => setActiveSection("hot-calc")}>
                      Önceki
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setActiveSection("warnings")}>
                      Sonraki: Dikkat Edilecekler <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Section 6: Dikkat Edilecekler */}
            {activeSection === "warnings" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    Dikkat Edilmesi Gerekenler
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="rounded-lg border p-4 bg-destructive/5 border-destructive/30">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center text-xs">1</span>
                        Onikiler Kuralı Yaklaşık Bir Yöntemdir
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        Bu kural, sinüzoidal gelgit eğrisinin bir yaklaşımıdır. 
                        Gerçek gelgit değerleri yerel koşullara göre farklılık gösterebilir.
                        Kritik geçişlerde resmi tide tablolarını kullanın.
                      </p>
                    </div>
                    
                    <div className="rounded-lg border p-4 bg-warning/5 border-warning/30">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center text-xs">2</span>
                        Spring vs Neap Gelgitleri
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        Spring gelgitlerinde değişim hızı daha yüksek, neap gelgitlerinde 
                        daha düşüktür. Planlama yaparken gelgit türünü göz önünde bulundurun.
                      </p>
                    </div>
                    
                    <div className="rounded-lg border p-4 bg-info-muted border-primary/30">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">3</span>
                        Yerel Faktörler
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        Rüzgar, atmosfer basıncı ve nehir akışları gelgit yüksekliğini 
                        etkileyebilir. Güçlü rüzgar su seviyesini 0.5m veya daha fazla 
                        değiştirebilir.
                      </p>
                    </div>
                    
                    <div className="rounded-lg border p-4 bg-muted/30">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs">4</span>
                        Secondary Port Düzeltmeleri
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        Standard Port verilerinden Secondary Port için hesaplama yaparken 
                        zaman ve yükseklik düzeltmelerini uygulamayı unutmayın.
                      </p>
                    </div>
                    
                    <div className="rounded-lg border p-4 bg-muted/30">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs">5</span>
                        Zaman Dilimleri
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        Tide tablolarının hangi zaman diliminde verildiğini kontrol edin 
                        (UTC, yerel saat, yaz saati uygulaması vb.).
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm" onClick={() => setActiveSection("ukc-calc")}>
                      Önceki
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setActiveSection("examples")}>
                      Sonraki: Pratik Örnekler <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Section 7: Pratik Örnekler */}
            {activeSection === "examples" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle className="h-5 w-5 text-success" />
                    Pratik Örnekler
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Example 1 */}
                  <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge>Örnek 1</Badge>
                      <span className="text-sm font-semibold">Liman Girişi Hesabı</span>
                    </div>
                    
                    <div className="text-sm space-y-2 bg-muted/30 rounded p-3">
                      <p><strong>Verilen:</strong></p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>LW: 05:30 → 1.2m</li>
                        <li>HW: 11:45 → 5.4m</li>
                        <li>Liman girişi planlanıyor: 08:00</li>
                        <li>Charted Depth: 7.5m</li>
                        <li>Draft: 7.0m</li>
                      </ul>
                    </div>
                    
                    <Accordion type="single" collapsible>
                      <AccordionItem value="solution1">
                        <AccordionTrigger className="text-sm">Çözümü Gör</AccordionTrigger>
                        <AccordionContent className="space-y-2 text-sm">
                          <p>1. Range = 5.4 - 1.2 = <strong>4.2m</strong></p>
                          <p>2. Duration = 11:45 - 05:30 = <strong>6 saat 15 dk</strong></p>
                          <p>3. Interval = 08:00 - 05:30 = <strong>2 saat 30 dk</strong></p>
                          <p>4. Saat dilimi: 2.5h / 6.25h × 6 ≈ <strong>2.4 (≈2. saat sonu)</strong></p>
                          <p>5. Faktör (2. saat sonu): 1/12 + 2/12 = <strong>3/12 = 0.25</strong></p>
                          <p>6. ΔH = 4.2 × 0.25 = <strong>1.05m</strong></p>
                          <p>7. HOT = 1.2 + 1.05 = <strong>2.25m</strong></p>
                          <p>8. Actual Depth = 7.5 + 2.25 = <strong>9.75m</strong></p>
                          <p>9. UKC = 9.75 - 7.0 = <strong className="text-success">2.75m ✓</strong></p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  
                  {/* Example 2 */}
                  <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge>Örnek 2</Badge>
                      <span className="text-sm font-semibold">Sığ Su Geçişi</span>
                    </div>
                    
                    <div className="text-sm space-y-2 bg-muted/30 rounded p-3">
                      <p><strong>Verilen:</strong></p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>LW: 14:00 → 0.5m</li>
                        <li>HW: 20:15 → 4.0m</li>
                        <li>Geçiş zamanı: 17:00</li>
                        <li>Sığ bölge derinliği: 5.0m</li>
                        <li>Draft: 6.5m, Squat: 0.3m, Safety: 0.5m</li>
                      </ul>
                    </div>
                    
                    <Accordion type="single" collapsible>
                      <AccordionItem value="solution2">
                        <AccordionTrigger className="text-sm">Çözümü Gör</AccordionTrigger>
                        <AccordionContent className="space-y-2 text-sm">
                          <p>1. Range = 4.0 - 0.5 = <strong>3.5m</strong></p>
                          <p>2. Duration = 20:15 - 14:00 = <strong>6 saat 15 dk</strong></p>
                          <p>3. Interval = 17:00 - 14:00 = <strong>3 saat</strong></p>
                          <p>4. Saat dilimi: 3h / 6.25h × 6 ≈ <strong>2.9 (≈3. saat)</strong></p>
                          <p>5. Faktör (3. saat): 1/12 + 2/12 + 3/12 = <strong>6/12 = 0.5</strong></p>
                          <p>6. ΔH = 3.5 × 0.5 = <strong>1.75m</strong></p>
                          <p>7. HOT = 0.5 + 1.75 = <strong>2.25m</strong></p>
                          <p>8. Actual Depth = 5.0 + 2.25 = <strong>7.25m</strong></p>
                          <p>9. Req'd Depth = 6.5 + 0.3 + 0.5 = <strong>7.3m</strong></p>
                          <p>10. UKC = 7.25 - 7.3 = <strong className="text-destructive">-0.05m ✗</strong></p>
                          <p className="text-destructive font-semibold mt-2">
                            ⚠️ Yetersiz UKC! Geçiş zamanını geciktirin veya alternatif rota kullanın.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  
                  {/* Example 3 */}
                  <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge>Örnek 3</Badge>
                      <span className="text-sm font-semibold">En Erken Geçiş Zamanı</span>
                    </div>
                    
                    <div className="text-sm space-y-2 bg-muted/30 rounded p-3">
                      <p><strong>Soru:</strong></p>
                      <p className="text-muted-foreground">
                        Yukarıdaki örnekte, en erken hangi saatte güvenli geçiş yapılabilir?
                      </p>
                    </div>
                    
                    <Accordion type="single" collapsible>
                      <AccordionItem value="solution3">
                        <AccordionTrigger className="text-sm">Çözümü Gör</AccordionTrigger>
                        <AccordionContent className="space-y-2 text-sm">
                          <p>Gereken minimum derinlik: 7.3m</p>
                          <p>Charted Depth: 5.0m</p>
                          <p>Gereken HOT = 7.3 - 5.0 = <strong>2.3m</strong></p>
                          <p>LW yüksekliği: 0.5m</p>
                          <p>Gereken ΔH = 2.3 - 0.5 = <strong>1.8m</strong></p>
                          <p>Faktör = 1.8 / 3.5 = <strong>0.514 (≈6.2/12)</strong></p>
                          <p>Bu 3. saatin başlarına denk gelir.</p>
                          <p>Geçiş zamanı ≈ 14:00 + 3h + birkaç dakika = <strong className="text-success">~17:10</strong></p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  
                  {/* Practice Link */}
                  <div className="rounded-lg border-2 border-primary/30 p-4 bg-primary/5 text-center">
                    <h4 className="font-semibold mb-2">Pratik Yapmak İster misiniz?</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Etkileşimli gelgit hesabı eğitim aracını kullanarak 
                      öğrendiklerinizi pekiştirin.
                    </p>
                    <Button asChild>
                      <Link to="/navigation/tide-trainer">
                        <Calculator className="h-4 w-4 mr-2" />
                        Eğitim Aracını Aç
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm" onClick={() => setActiveSection("warnings")}>
                      Önceki
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/navigation/calc/tides">
                        Hesap Sayfasına Dön
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
          </div>
        </div>
      </ScrollArea>
    </MobileLayout>
  );
}
