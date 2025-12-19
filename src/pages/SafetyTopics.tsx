import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Shield, AlertTriangle, FileCheck, Users } from "lucide-react";

const safetyTopics = [
  {
    title: "Safety Management System (SMS)",
    icon: FileCheck,
    content: [
      "SMS, ISM Kodu kapsamında zorunlu olan güvenlik yönetim sistemidir.",
      "Planla-Uygula-Kontrol-Eylem (PDCA) döngüsüyle riskler sürekli izlenir.",
      "Tüm operasyonlar dokümante edilmeli ve kayıtlar saklanmalıdır.",
      "Düzenli iç denetimler ve gözden geçirmeler yapılmalıdır."
    ]
  },
  {
    title: "Muster ve Tatbikat Organizasyonu",
    icon: Users,
    content: [
      "Haftalık muster tatbikatları zorunludur (yolcu gemilerinde).",
      "Yangın ve terk tatbikatları aylık olarak düzenlenir.",
      "Tüm tatbikatlar seyir defterine kaydedilmelidir.",
      "Mürettebat görev dağılımları güncel tutulmalıdır.",
      "Muster listesi görünür yerlerde asılı olmalıdır."
    ]
  },
  {
    title: "İş İzinleri (Permit to Work)",
    icon: AlertTriangle,
    content: [
      "Sıcak iş (Hot Work): Kaynak, kesme işlemleri için özel izin gerekir.",
      "Kapalı alan girişi: Gaz ölçümleri ve nöbetçi şarttır.",
      "Yüksekte çalışma: Güvenlik kemeri ve denetim zorunludur.",
      "Elektrik çalışmaları: İzolasyon ve etiketleme uygulanmalıdır.",
      "Tüm izinler yetkilendirilmiş kişilerce onaylanmalıdır."
    ]
  },
  {
    title: "Risk Değerlendirmesi",
    icon: Shield,
    content: [
      "Her operasyon öncesi risk değerlendirmesi yapılmalıdır.",
      "Tehlikeler belirlenmeli ve derecelendirilmelidir.",
      "Kontrol önlemleri planlanmalı ve uygulanmalıdır.",
      "Risk matrisi kullanılarak önceliklendirme yapılır.",
      "Near-miss olayları raporlanmalı ve değerlendirilmelidir."
    ]
  }
];

export default function SafetyTopicsPage() {
  return (
    <MobileLayout className="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-3xl space-y-6 px-3 py-6 sm:px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="gap-2" asChild>
            <a href="/calculations">
              <ArrowLeft className="h-4 w-4" />
              Hesaplama Merkezi
            </a>
          </Button>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Emniyet Konuları
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
            Emniyet & Düzenlemeler
          </h1>
          <p className="text-muted-foreground mt-2">
            SMS, muster organizasyonu ve izinli işler
          </p>
        </div>

        <div className="grid gap-6">
          {safetyTopics.map((topic, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <topic.icon className="h-5 w-5 text-rose-600" />
                  {topic.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {topic.content.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-rose-500 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
