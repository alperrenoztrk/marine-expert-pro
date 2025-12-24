import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { EngineCalculations } from "@/components/calculations/EngineCalculations";
import { MobileLayout } from "@/components/MobileLayout";
import { CalculationGridScreen } from "@/components/ui/calculation-grid";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const onboardMachines = [
  {
    name: "Ana Makine (Sevk Sistemi)",
    detail: "Ana dizel makine, buhar/gaz türbini veya diesel-electric tahrik",
    description:
      "Geminin ana tahrik sistemini oluşturur; pervane, şaft hattı ve kumanda zinciriyle entegre çalışır. Yakıt kalitesi, yağlama basıncı ve ana yatak sıcaklıkları performans için kritik parametrelerdir.",
    manual: [
      "Vardiya öncesi: yağ seviyesi, deniz/yağ soğutma suyu devreleri ve yakıt viskozite ısıtmasını kontrol et.",
      "Start-up: turning gear ayrıldı mı, lube oil basıncı ve jacket water sıcaklığı operasyon limitlerinde mi doğrula.",
      "Seyir: egzoz sıcaklık trendlerini izleyip silindir dengesi kontrolünü düzenli yap; titreşim/alarm kayıtlarını logla.",
      "Durdurma: yükü kademeli azalt, soğutma devrelerini normal duruş prosedürüne göre sirküle etmeye devam et.",
    ],
  },
  {
    name: "Yardımcı Makineler",
    detail: "Yardımcı dizel ve acil jeneratörler, ana şafttan tahrikli jeneratör",
    description:
      "Gemi elektriğini sağlayan yardımcı dizel jeneratörler ve acil jeneratör, kritik sistemlerin kesintisiz beslenmesi için yedekli çalışır. Yük paylaşımı ve otomatik devre alma kabiliyetleri önemlidir.",
    manual: [
      "Başlatmadan önce yağ, soğutma suyu, yakıt ve hava/fog testlerini tamamla.",
      "Jeneratör yük paylaşımını (load sharing) izleyerek harmonik/reaktif yükleri dengede tut.",
      "Acil jeneratörün otomatik devre alma (auto-start) ve yakıt seviyesi testlerini haftalık yap.",
      "Planlı bakımda AVR, governor ve izolasyon direnci testlerini kayda al.",
    ],
  },
  {
    name: "Elektrik & Güç Sistemleri",
    detail: "Ana/acil switchboard, UPS, trafolar ve batarya grupları",
    description:
      "Ana ve acil switchboard üzerinden güç dağıtımı yapılır; kritik devreler UPS ve bataryalarla korunur. Toprak kaçağı, kısa devre ve frekans/voltaj sapmaları anlık izlenmelidir.",
    manual: [
      "Baralar arası senkronizasyon ve breaker kapama/açma dizilerini prosedüre göre uygula.",
      "Yük devri sırasında harmonik bozunum ve gerilim dengesini takip et; aşırı ısınan baraları termal kamera ile kontrol et.",
      "UPS batarya testlerini periyodik yap, odayı havalandır ve gaz dedektörlerini kontrol et.",
      "Acil durum tatbikatlarında black-out senaryolarını çalıştırıp zamanlarını kaydet.",
    ],
  },
  {
    name: "Yakıt & Yağ Sistemleri",
    detail: "Fuel/Lube oil separatörleri, günlük tanklar, transfer ve besleme pompaları",
    description:
      "Ana makine ve jeneratörlere temiz, uygun viskozitede yakıt/yağ sağlar. Separatörler su ve partikülü ayırır; günlük tank seviyeleri geminin trim/stabilitesini de etkileyebilir.",
    manual: [
      "Separatör öncesi ısıtıcıyı yakıtın cinsine göre ayarla; bowl hızının nominal değerde olduğundan emin ol.",
      "Günlük tanklar arası transferde taşma riskine karşı otomatik shut-off ve gözcü uygula.",
      "LO/FO filtrasyon diferansiyel basınçlarını izleyerek tıkanma eğilimlerini kayıt altına al.",
      "Sludge ve drain tahliyelerini MARPOL prosedürüne uygun gerçekleştirip Oil Record Book’a işle.",
    ],
  },
  {
    name: "Pompalar",
    detail: "Sintine, balast, yangın, soğutma suyu ve tatlı/deniz suyu pompaları",
    description:
      "Gemideki tüm akışkan transferlerinin bel kemiğidir; yangın, balast ve soğutma pompaları farklı görevlerde çalışır. Kavitasyon, titreşim ve sızıntı erken arıza göstergeleridir.",
    manual: [
      "Her pompa devreye almadan önce emiş-çıkış vanaları ve hava alma ihtiyaçlarını kontrol et.",
      "Balast pompalarında tank sıralamasını stabilite planına göre takip et; yangın pompalarını haftalık test et.",
      "Soğutma suyu pompalarında strainers/filtreleri düzenli temizle, basınç ve sıcaklık farklarını logla.",
      "Sintine pompalarını MARPOL gereklilikleri ve 15 ppm OWS interlock’larıyla birlikte doğrula.",
    ],
  },
  {
    name: "Soğutma & HVAC",
    detail: "Merkezi soğutma devresi, HVAC, soğuk hava depoları ve reefer sistemleri",
    description:
      "Ana/yardımcı makine jacket water ve merkezi soğutma devreleri, güverte ve yaşam mahallini iklimlendiren HVAC ile entegre çalışır. Reefer konteyner beslemeleri sıcaklık hassasiyetlidir.",
    manual: [
      "Merkezi soğutma plakalı eşanjörlerini diferansiyel basınç üzerinden takip edip gerektiğinde temizle.",
      "HVAC filtrelerini ve damper ayarlarını aylık kontrol et; taze hava oranını CO₂ sensörlerine göre ayarla.",
      "Reefer prizlerinin yük testlerini ve alarm izleme panosunu düzenli doğrula.",
      "Kondenser/evaporatör yüzeylerini kirlenmeye karşı denetle, gaz kaçak testlerini kayıt altına al.",
    ],
  },
  {
    name: "Kazanlar (Boiler)",
    detail: "Auxiliary boiler ve EGB; ısıtma, yakıt viskozitesi ve buhar ihtiyacı",
    description:
      "Yardımcı kazanlar ve egzoz gaz kazanı, yakıt ısıtma, tank ısıtma ve yaşam mahalli buhar ihtiyacını sağlar. Yanma ayarı, su seviyesi kontrolü ve blow-down kritik güvenlik noktalarıdır.",
    manual: [
      "Yakıt atomizasyonu için gereken buhar/hava basıncını ve viskoziteyi devreye almadan önce doğrula.",
      "Düşük su seviyesi ve yüksek buhar basıncı alarmlarının testini periyodik yap; su besleme pompalarını gözlemle.",
      "EGB’de kurum üfleme (soot-blowing) işlemini egzoz sıcaklık farkına göre planla ve kayıt altına al.",
      "Günlük blow-down yaparak TDS/PH değerlerini takip et; kimyasal dozajı test sonuçlarına göre ayarla.",
    ],
  },
  {
    name: "Emniyet & Kontrol Sistemleri",
    detail: "Yangın algılama/CO₂, ECR operasyonu, alarm ve izleme sistemleri",
    description:
      "Makine dairesi otomasyon sistemi, alarm ve emniyet kilitlemeleriyle tüm ekipmanı izler. Uzaktan izleme (AMS), acil durdurma istasyonları ve gaz söndürme sistemleri koordineli çalışmalıdır.",
    manual: [
      "Alarm paneli inhibit/override modlarını yalnızca prosedür gereği kullan; yapılan değişiklikleri logla.",
      "CO₂/FM200 sisteminin izolasyon vanaları, çekme pimleri ve siren testlerini periyodik doğrula.",
      "ECR’den yerel kontrol moduna geçiş prosedürünü personelle birlikte tatbik et.",
      "Trend kayıtlarını (basınç, sıcaklık, titreşim) haftalık değerlendirip erken uyarı limitlerini güncelle.",
    ],
  },
  {
    name: "Güverte Makineleri",
    detail: "Irgat, mooring winch, kreyn, capstan ve Ro-Ro rampaları",
    description:
      "Güverte operasyonlarında yük kaldırma ve bağlama ekipmanlarının güvenli çalışması kritik önemdedir. Hidrolik sistemler, fren bandı ayarları ve acil durdurma istasyonları düzenli kontrol ister.",
    manual: [
      "Operasyon öncesi limit switch’ler, yağ seviyeleri ve emniyet pimlerini kontrol et; çalışma alanını bariyerle.",
      "Mooring winch fren testlerini ve SWL etiketlerini periyodik doğrula, tel halat yağlamasını yap.",
      "Kreyn ve rampa operasyonlarında haberleşme prosedürünü ve el işaretlerini ekip ile paylaş.",
      "Hidrolik sistem basınç/sızıntı kontrollerini tamamla; acil stop ve manüel override noktalarını göster.",
    ],
  },
];

export default function MachineCalculationsPage() {
  const [showMachines, setShowMachines] = useState(false);

  return (
    <MobileLayout>
      <CalculationGridScreen
        eyebrow="Makine"
        title="Makine Hesaplamaları"
        subtitle="Motor gücü, yakıt tüketimi ve performans hesaplamalarınızı yapın"
      >
        <Card className="border-border bg-gradient-to-br from-card via-background to-muted/30 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-lg text-primary">
                <Wrench className="h-5 w-5" />
                Gemideki Makineler
              </CardTitle>
              <Button variant="outline" onClick={() => setShowMachines((prev) => !prev)}>
                {showMachines ? "Listeyi Gizle" : "Tüm Makineleri Göster"}
              </Button>
            </div>
          </CardHeader>
          {showMachines && (
            <CardContent className="pt-0">
              <div className="grid gap-3 md:grid-cols-2">
                {onboardMachines.map((machine) => (
                  <div
                    key={machine.name}
                    className="rounded-xl border border-border bg-card/70 px-4 py-3 shadow-sm space-y-3"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{machine.name}</p>
                      <p className="text-xs text-muted-foreground">{machine.detail}</p>
                      <p className="text-sm text-foreground/90 leading-relaxed">{machine.description}</p>
                    </div>
                    <div className="rounded-lg bg-muted/40 border border-border px-3 py-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                        Kullanım kılavuzu
                      </p>
                      <ul className="mt-2 space-y-1 text-xs leading-relaxed text-foreground/90">
                        {machine.manual.map((step) => (
                          <li key={step} className="flex gap-2">
                            <span className="mt-0.5 text-primary">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl text-primary">
              <Wrench className="h-6 w-6" />
              Makine Hesaplama Modülü
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EngineCalculations />
          </CardContent>
        </Card>
      </CalculationGridScreen>
    </MobileLayout>
  );
}
