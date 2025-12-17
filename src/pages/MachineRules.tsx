import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Shield, Fuel, Wrench, AlertTriangle, ClipboardCheck } from "lucide-react";

const ruleCategories = [
  {
    title: "MARPOL Annex VI - Hava Kirliliği",
    icon: Fuel,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
    rules: [
      {
        subtitle: "Kükürt Limitleri",
        content: [
          "Global kükürt limiti: %0.50 m/m (1 Ocak 2020'den itibaren)",
          "ECA bölgelerinde: %0.10 m/m",
          "Uyumlu yakıt veya scrubber kullanımı zorunlu",
          "BDN ve yakıt numunesi 3 yıl saklanmalı",
        ],
      },
      {
        subtitle: "NOx Gereklilikleri",
        content: [
          "Tier I: 2000 öncesi inşa gemiler için",
          "Tier II: 2011-2016 arası inşa gemiler",
          "Tier III: ECA bölgelerinde 2016 sonrası gemiler",
          "EIAPP sertifikası zorunlu",
        ],
      },
      {
        subtitle: "Enerji Verimliliği",
        content: [
          "EEDI: Yeni gemiler için zorunlu",
          "SEEMP: Tüm gemiler için zorunlu",
          "EEXI: Mevcut gemiler için (2023)",
          "CII: Yıllık karbon yoğunluğu değerlendirmesi",
        ],
      },
    ],
  },
  {
    title: "ISM Code - Güvenlik Yönetimi",
    icon: Shield,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    rules: [
      {
        subtitle: "Bakım Gereklilikleri",
        content: [
          "Planlı bakım sistemi (PMS) uygulaması zorunlu",
          "Kritik ekipman listesi tanımlanmalı",
          "Bakım kayıtları tutulmalı ve saklanmalı",
          "Yedek parça yönetimi prosedürü olmalı",
        ],
      },
      {
        subtitle: "Operasyonel Kontroller",
        content: [
          "Makine dairesi günlük kontrol listeleri",
          "Parametre kayıt ve trend analizi",
          "Arıza raporlama ve takip sistemi",
          "Düzeltici ve önleyici eylemler",
        ],
      },
      {
        subtitle: "Eğitim ve Yetkinlik",
        content: [
          "Makine personeli yetkinlik gereklilikleri",
          "Acil durum tatbikatları (yangın, terk, vb.)",
          "Familiarizasyon prosedürleri",
          "Sürekli eğitim kayıtları",
        ],
      },
    ],
  },
  {
    title: "SOLAS - Makine Gereklilikleri",
    icon: FileText,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    rules: [
      {
        subtitle: "Tahrik ve Dümen",
        content: [
          "Yedek dümen sistemi gereksinimi",
          "Dümen test prosedürleri (her kalkışta)",
          "Acil dümen operasyonu eğitimi",
          "Ana makine manevrabilite gereksinimleri",
        ],
      },
      {
        subtitle: "Elektrik Sistemleri",
        content: [
          "Acil jeneratör gereksinimleri",
          "UPS ve batarya kapasiteleri",
          "Elektrik pano koruma gereksinimleri",
          "Yalıtım izleme sistemleri",
        ],
      },
      {
        subtitle: "Yangın Güvenliği",
        content: [
          "Makine dairesi yangın söndürme sistemleri",
          "Otomatik algılama ve alarm",
          "Hızlı kapatma (quick closing) valfleri",
          "Acil yakıt kesme sistemleri",
        ],
      },
    ],
  },
  {
    title: "Klas Kuralları",
    icon: ClipboardCheck,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
    rules: [
      {
        subtitle: "Periyodik Sörveyler",
        content: [
          "Yıllık sörvey gereksinimleri",
          "Ara sörvey (2.5 yıl)",
          "Özel sörvey (5 yıllık)",
          "Docking sörvey gereksinimleri",
        ],
      },
      {
        subtitle: "Makine Sörveyleri",
        content: [
          "Ana makine parça ömürleri ve kontrolleri",
          "Yardımcı makine sörvey aralıkları",
          "Şaft hattı ve pervane kontrolleri",
          "Kazan ve basınçlı kap muayeneleri",
        ],
      },
      {
        subtitle: "CMS (Condition Monitoring)",
        content: [
          "Sürekli izleme alternatifleri",
          "Titreşim analizi gereksinimleri",
          "Yağ analizi programları",
          "Performans izleme sistemleri",
        ],
      },
    ],
  },
  {
    title: "Bunker Prosedürleri",
    icon: Fuel,
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900/20",
    rules: [
      {
        subtitle: "Bunker Öncesi",
        content: [
          "Bunker planı hazırlanmalı",
          "Tank hesaplamaları yapılmalı",
          "Güvenlik kontrol listesi tamamlanmalı",
          "İletişim prosedürleri belirlenmeli",
        ],
      },
      {
        subtitle: "Bunker Sırası",
        content: [
          "Akış hızı kontrolü",
          "Tank seviye takibi",
          "Sızıntı kontrolü",
          "Acil durdurma hazırlığı",
        ],
      },
      {
        subtitle: "Bunker Sonrası",
        content: [
          "BDN kontrolü ve imza",
          "Numune alma (MARPOL requirement)",
          "Miktar doğrulama",
          "Kayıt ve dokümantasyon",
        ],
      },
    ],
  },
  {
    title: "Acil Durum Prosedürleri",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/20",
    rules: [
      {
        subtitle: "Makine Dairesi Yangını",
        content: [
          "Alarm ve tahliye prosedürü",
          "Ventilasyon kapatma",
          "Yakıt kesme prosedürü",
          "CO2/FM200 salınım prosedürü",
        ],
      },
      {
        subtitle: "Blackout",
        content: [
          "Acil jeneratör devreye alma",
          "Kritik sistemlerin önceliklendirilmesi",
          "Ana makine restart prosedürü",
          "Blackout sonrası kontroller",
        ],
      },
      {
        subtitle: "Diğer Acil Durumlar",
        content: [
          "Dümen arızası prosedürü",
          "Ana makine arızası",
          "Denize döküntü prosedürü",
          "Crankcase patlaması",
        ],
      },
    ],
  },
];

export default function MachineRules() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-[hsl(220,50%,6%)] dark:via-[hsl(220,50%,8%)] dark:to-[hsl(220,50%,10%)]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to="/calculations">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-card/50">
              <ArrowLeft className="h-4 w-4" />
              Hesaplama Merkezi
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-slate-600 via-zinc-600 to-slate-800 bg-clip-text text-transparent mb-3">
            Makine Kuralları
          </h1>
          <p className="text-muted-foreground">
            MARPOL, SOLAS, ISM ve klas gereksinimleri
          </p>
        </div>

        <div className="space-y-6">
          {ruleCategories.map((category) => (
            <Card key={category.title} className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 ${category.bgColor} rounded-lg`}>
                    <category.icon className={`h-5 w-5 ${category.color}`} />
                  </div>
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {category.rules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">
                        {rule.subtitle}
                      </h4>
                      <ul className="space-y-2">
                        {rule.content.map((item, itemIdx) => (
                          <li
                            key={itemIdx}
                            className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2"
                          >
                            <span className="text-slate-400 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
