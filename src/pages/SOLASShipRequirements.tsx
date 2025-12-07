import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Anchor } from "lucide-react";

const requirementGroups = [
  {
    title: "Yapısal & Stabilite",
    badge: "Bölüm II-1",
    description: "Bölmelendirme, su alma senaryoları ve hasar stabilitesi gereklilikleri.",
    items: [
      "Su geçirmez bölme çizgileri + kapı planları dijital olarak mevcut olmalı",
      "Damage Control Booklet köprüüstünde güncel tutulmalı",
      "Bilgisayar tabanlı stabilite programı sınıf tarafından onaylanmalı",
    ],
    readiness: 82,
  },
  {
    title: "Yangın Güvenliği",
    badge: "Bölüm II-2",
    description: "Yangın bölmeleri, sprinkler/ drencher sistemleri, sabit gazlı söndürme ve algılama ekipmanları.",
    items: [
      "Her zon için Fire Control Plan kopyası ve glow-in-the-dark kartlar",
      "CO₂ oda erişimi, kilitleme ve sayma sistemleri çalışır durumda",
      "Makine dairesi ısı sensörleri ve yüksek sis sistemleri test kayıtları",
    ],
    readiness: 76,
  },
  {
    title: "Can Kurtarma & Tahliye",
    badge: "Bölüm III",
    description: "Filikalar, can salları, MES sistemleri ve muster düzenlemeleri.",
    items: [
      "Filika ve davitler için 5 yıllık yük testi sertifikaları arşivli",
      "MES deployment tatbikat videoları ve check-list'leri saklanıyor",
      "Her vardiya için muster listesi ve görev kartları güncel",
    ],
    readiness: 88,
  },
  {
    title: "Seyir ve Haberleşme",
    badge: "Bölüm V",
    description: "Navigasyon ekipmanları, kayıt cihazları, seyir defterleri ve GMDSS prosedürleri.",
    items: [
      "BNWAS, VDR ve ECDIS fonksiyon test raporları 90 gün içinde",
      "Passage plan şablonları SOLAS gerekliliklerine göre revize edildi",
      "GMDSS teyit mesajları ve test logları aylık olarak imzalanıyor",
    ],
    readiness: 90,
  },
];

const SOLASShipRequirementsPage = () => {
  return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Anchor className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
            <div>
              <p className="text-sm uppercase tracking-wider text-indigo-600 dark:text-indigo-300">Teknik Gereklilikler</p>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                SOLAS Gemi Gereksinimleri
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Tasarım onayları, operasyonel kayıtlar ve günlük bakımlar için takip edilmesi gereken minimum gereksinim seti.
          </p>
        </div>

        {/* Requirement Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requirementGroups.map((group) => (
            <Card key={group.title} className="border border-indigo-100/60 shadow-md shadow-indigo-500/10">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">{group.badge}</Badge>
                  <span className="text-xs text-muted-foreground">Hazırlık: %{group.readiness}</span>
                </div>
                <CardTitle>{group.title}</CardTitle>
                <CardDescription>{group.description}</CardDescription>
                <Progress value={group.readiness} className="h-2" />
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {group.items.map((item) => (
                  <div key={item} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SOLASShipRequirementsPage;
