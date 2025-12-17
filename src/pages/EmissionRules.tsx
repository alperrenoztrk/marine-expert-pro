import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Leaf, Scale, AlertTriangle, CheckCircle, Info } from "lucide-react";

const rules = [
  {
    title: "MARPOL Annex VI - Hava Kirliliği",
    icon: Scale,
    sections: [
      {
        subtitle: "Kükürt Limitleri (SOx)",
        rules: [
          "Global kükürt limiti: %0.50 m/m (1 Ocak 2020'den itibaren)",
          "ECA bölgelerinde: %0.10 m/m",
          "Alternatif: Onaylı egzoz gazı temizleme sistemi (scrubber) kullanımı",
          "Yakıt değişim prosedürü: ECA'ya giriş/çıkışta kayıt tutulmalı"
        ]
      },
      {
        subtitle: "NOx Emisyon Seviyeleri",
        rules: [
          "Tier I: 2000 öncesi inşa edilen gemiler",
          "Tier II: 2011 sonrası inşa edilen gemiler (global standart)",
          "Tier III: 2016 sonrası inşa, NECA bölgelerinde zorunlu",
          "Tier III, Tier I değerinin en az %80 altında olmalı"
        ]
      },
      {
        subtitle: "Enerji Verimliliği",
        rules: [
          "EEDI: Yeni gemiler için zorunlu (2013+)",
          "EEXI: Mevcut gemiler için zorunlu (2023+)",
          "CII: Yıllık operasyonel rating (A-E), 2023+ zorunlu",
          "SEEMP: Tüm gemiler için gemi enerji verimliliği yönetim planı"
        ]
      }
    ]
  },
  {
    title: "BWM Convention - Balast Suyu",
    icon: Scale,
    sections: [
      {
        subtitle: "D-1 Standardı (Değişim)",
        rules: [
          "Karadan en az 200 deniz mili uzakta",
          "Su derinliği en az 200 metre",
          "Balast suyunun en az %95'i değiştirilmeli",
          "Yöntemler: Sıralı, akış-yoluyla veya seyreltme"
        ]
      },
      {
        subtitle: "D-2 Standardı (Arıtma)",
        rules: [
          "Canlı organizma limitleri: <10 organizma ≥50μm/m³",
          "10-50μm aralığında: <10 organizma/ml",
          "Sistem IMO tip onaylı olmalı",
          "Ballast Water Record Book tutulmalı"
        ]
      }
    ]
  },
  {
    title: "MARPOL Annex I - Petrol Kirliliği",
    icon: Scale,
    sections: [
      {
        subtitle: "Sintine Suyu Deşarjı",
        rules: [
          "Yağ içeriği 15 ppm'den az olmalı",
          "Onaylı yağ filtreleme ekipmanı kullanılmalı",
          "Otomatik durdurma sistemi aktif olmalı",
          "Özel alanlarda (Akdeniz, Baltık vb.) sıfır deşarj"
        ]
      },
      {
        subtitle: "Yük Tankı Yıkama",
        rules: [
          "COW (Crude Oil Washing) prosedürleri",
          "Slop tankı yönetimi",
          "Load-on-top prosedürü",
          "Oil Record Book Part II kayıtları"
        ]
      }
    ]
  },
  {
    title: "MARPOL Annex V - Çöp",
    icon: Scale,
    sections: [
      {
        subtitle: "Deşarj Yasakları",
        rules: [
          "Plastik: Denize deşarj YASAK (her yerde)",
          "Yiyecek atıkları: Karadan 12+ nm (öğütülmüş: 3+ nm)",
          "Kargo artıkları: Karadan 12+ nm (zararsız maddeler)",
          "Özel alanlarda: Çoğu atık için sıfır deşarj"
        ]
      },
      {
        subtitle: "Kayıt ve Raporlama",
        rules: [
          "Garbage Record Book zorunlu (400 GT+ gemiler)",
          "Atık yönetim planı mevcut olmalı",
          "Liman tesislerine teslim belgeleri saklanmalı",
          "Kayıtlar 2 yıl muhafaza edilmeli"
        ]
      }
    ]
  },
  {
    title: "IMO DCS ve Bölgesel MRV",
    icon: Scale,
    sections: [
      {
        subtitle: "IMO DCS (Data Collection System)",
        rules: [
          "5000 GT+ gemiler için zorunlu",
          "Yıllık yakıt tüketimi bildirimi",
          "Kat edilen mesafe ve denizde geçirilen saat",
          "SEEMP Part II dokümantasyonu"
        ]
      },
      {
        subtitle: "EU MRV Regulation",
        rules: [
          "AB limanlarına uğrayan 5000 GT+ gemiler",
          "CO₂ emisyonları, yakıt tüketimi, mesafe",
          "Yıllık doğrulama ve raporlama",
          "Kamuya açık emisyon verileri"
        ]
      }
    ]
  }
];

const warnings = [
  {
    type: "critical",
    text: "CII D veya E derecesi alan gemiler 3 yıl içinde düzeltici aksiyon planı sunmalıdır."
  },
  {
    type: "critical",
    text: "EEXI sertifikası olmayan gemiler 2023'ten itibaren sefer yapamaz."
  },
  {
    type: "warning",
    text: "Yakıt değişim prosedürü ECA sınırından önce tamamlanmalı ve kayıt altına alınmalıdır."
  },
  {
    type: "info",
    text: "Scrubber kullanan gemilerin yıkama suyu deşarj limitleri için IMO MEPC.259(68) kararına bakınız."
  }
];

export default function EmissionRules() {
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
            <Scale className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-3">
            Çevre Kuralları
          </h1>
          <p className="text-muted-foreground">MARPOL, BWM ve IMO düzenlemeleri</p>
        </div>

        {/* Warnings */}
        <div className="space-y-3 mb-8">
          {warnings.map((warning, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-4 rounded-xl ${
                warning.type === "critical" 
                  ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800" 
                  : warning.type === "warning"
                  ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                  : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
              }`}
            >
              {warning.type === "critical" ? (
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              ) : warning.type === "warning" ? (
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              ) : (
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm ${
                warning.type === "critical" 
                  ? "text-red-700 dark:text-red-300" 
                  : warning.type === "warning"
                  ? "text-amber-700 dark:text-amber-300"
                  : "text-blue-700 dark:text-blue-300"
              }`}>
                {warning.text}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {rules.map((rule, index) => (
            <Card 
              key={index} 
              className="border-border/60 bg-card/85 backdrop-blur-sm animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <Leaf className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  {rule.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {rule.sections.map((section, sIndex) => (
                  <div key={sIndex}>
                    <h4 className="font-semibold text-foreground mb-3">{section.subtitle}</h4>
                    <ul className="space-y-2">
                      {section.rules.map((item, iIndex) => (
                        <li key={iIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
