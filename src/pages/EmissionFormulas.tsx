import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Leaf, Sigma } from "lucide-react";

const formulas = [
  {
    category: "Emisyon Hesaplamaları",
    items: [
      {
        name: "CO₂ Emisyonu",
        formula: "CO₂ (ton) = Yakıt (ton) × CF",
        description: "CF: Karbon Faktörü (yakıt türüne göre)",
        example: "HFO için CF = 3.114, 1000 ton HFO → 3114 ton CO₂"
      },
      {
        name: "SOx Emisyonu",
        formula: "SOx (kg) = Yakıt (ton) × S% × 20 × 2",
        description: "S%: Yakıt kükürt içeriği (yüzde), 2: SO₂/S dönüşüm katsayısı",
        example: "%0.5 kükürt, 100 ton yakıt → 200 kg SOx"
      },
      {
        name: "NOx Emisyonu",
        formula: "NOx (kg) = P (kW) × t (h) × EF / 1000",
        description: "EF: Emisyon faktörü (g/kWh), motor tipine göre değişir",
        example: "Tier II motor için EF ≈ 14.4 g/kWh"
      },
      {
        name: "PM Emisyonu",
        formula: "PM (kg) = Yakıt (ton) × EFPM",
        description: "EFPM: Partikül madde emisyon faktörü (kg/ton yakıt)",
        example: "HFO için EFPM ≈ 1.5 kg/ton"
      }
    ]
  },
  {
    category: "Enerji Verimliliği",
    items: [
      {
        name: "EEXI (Energy Efficiency Existing Ship Index)",
        formula: "EEXI = (P × CF × SFC) / (Capacity × Vref)",
        description: "P: Ana makine gücü (kW), SFC: Özgül yakıt tüketimi (g/kWh), Vref: Referans hız (knot)",
        example: "Birim: gCO₂ / (ton·nm)"
      },
      {
        name: "CII (Carbon Intensity Indicator)",
        formula: "CII = (Yıllık CO₂) / (Capacity × Distance)",
        description: "Operasyonel karbon yoğunluğu, yıllık bazda hesaplanır",
        example: "Birim: gCO₂ / (ton·nm)"
      },
      {
        name: "AER (Annual Efficiency Ratio)",
        formula: "AER = (∑CO₂) / (DWT × ∑Distance)",
        description: "Yıllık toplam CO₂ / (Taşıma kapasitesi × Toplam mesafe)",
        example: "Bulk carrier için tipik AER: 3-8 gCO₂/(ton·nm)"
      },
      {
        name: "EEDI (Energy Efficiency Design Index)",
        formula: "EEDI = (∑P × CF × SFC) / (fi × Capacity × Vref)",
        description: "Yeni gemiler için tasarım indeksi, fi: düzeltme faktörleri",
        example: "IMO phase 3: EEDI ≤ Referans × (1 - %30)"
      }
    ]
  },
  {
    category: "Yakıt ve Enerji",
    items: [
      {
        name: "Günlük Yakıt Tüketimi",
        formula: "FOC (ton/gün) = P (kW) × SFOC (g/kWh) × 24 / 10⁶",
        description: "SFOC: Özgül yakıt tüketimi, yük durumuna bağlı değişir",
        example: "10,000 kW, 180 g/kWh → 43.2 ton/gün"
      },
      {
        name: "Sefer Yakıt Tüketimi",
        formula: "Toplam Yakıt = FOC × (Distance / Speed) / 24",
        description: "Mesafe nm, hız knot cinsinden",
        example: "3000 nm, 15 knot, 40 ton/gün → 333 ton"
      },
      {
        name: "Enerji (kWh)",
        formula: "E = P (kW) × t (h)",
        description: "Jeneratör yük analizi için",
        example: "500 kW × 24 saat = 12,000 kWh"
      }
    ]
  },
  {
    category: "Karbon Faktörleri (CF)",
    items: [
      {
        name: "HFO (Heavy Fuel Oil)",
        formula: "CF = 3.114 ton CO₂/ton yakıt",
        description: "Ağır yakıt, en yaygın deniz yakıtı",
        example: ""
      },
      {
        name: "VLSFO (Very Low Sulphur FO)",
        formula: "CF = 3.151 ton CO₂/ton yakıt",
        description: "Düşük kükürtlü yakıt (%0.5 max)",
        example: ""
      },
      {
        name: "MGO/MDO (Marine Gas/Diesel Oil)",
        formula: "CF = 3.206 ton CO₂/ton yakıt",
        description: "Distilat yakıtlar",
        example: ""
      },
      {
        name: "LNG (Liquefied Natural Gas)",
        formula: "CF = 2.750 ton CO₂/ton yakıt",
        description: "Sıvılaştırılmış doğal gaz",
        example: ""
      },
      {
        name: "Methanol",
        formula: "CF = 1.375 ton CO₂/ton yakıt",
        description: "Alternatif yakıt",
        example: ""
      }
    ]
  }
];

export default function EmissionFormulas() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-[hsl(220,50%,6%)] dark:via-[hsl(220,50%,8%)] dark:to-[hsl(220,50%,10%)]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-green-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to="/calculations">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-card/50">
              <ArrowLeft className="h-4 w-4" />
              Geri
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl mb-4">
            <Sigma className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-3">
            Çevre Formülleri
          </h1>
          <p className="text-muted-foreground">Emisyon ve enerji verimliliği hesap formülleri</p>
        </div>

        <div className="space-y-8">
          {formulas.map((category, cIndex) => (
            <div key={cIndex} className="animate-fade-in" style={{ animationDelay: `${cIndex * 100}ms` }}>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Leaf className="h-5 w-5 text-emerald-600" />
                {category.category}
              </h2>
              <div className="grid gap-4">
                {category.items.map((item, iIndex) => (
                  <Card key={iIndex} className="border-border/60 bg-card/85 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-foreground">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 font-mono text-sm">
                        {item.formula}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      {item.example && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10 p-2 rounded">
                          Örnek: {item.example}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
