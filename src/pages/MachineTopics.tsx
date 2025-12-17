import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Wrench, Fuel, Thermometer, Gauge, Settings, AlertTriangle, Droplets, Wind } from "lucide-react";

const topics = [
  {
    id: "main-engine",
    title: "Ana Makine ve Tahrik Sistemi",
    icon: Wrench,
    content: `Ana makine, geminin temel tahrik gücünü sağlayan en kritik ekipmandır. Modern gemilerde genellikle düşük devirli iki zamanlı dizel motorlar kullanılır.

**Ana Makine Tipleri:**
- İki Zamanlı Düşük Devirli: Büyük konteyner ve tanker gemilerinde (MAN B&W, Wärtsilä)
- Dört Zamanlı Orta Devirli: Cruise gemileri ve feribot gibi gemilerde
- Gaz Türbinleri: Askeri gemiler ve bazı LNG taşıyıcılarında

**Temel Performans Parametreleri:**
- MCR (Maximum Continuous Rating): Maksimum sürekli güç
- NCR (Normal Continuous Rating): Normal operasyon gücü (%85-90 MCR)
- SFOC (Specific Fuel Oil Consumption): Spesifik yakıt tüketimi (g/kWh)
- Mean Effective Pressure (MEP): Ortalama efektif basınç

**Güç İletim Hattı:**
Ana Makine → Şaft Hattı → Ara Mil → Pervane Mili → Pervane

**Kritik İzleme Parametreleri:**
- Silindir basınçları ve sıcaklıkları
- Egzoz gaz sıcaklıkları
- Soğutma suyu sıcaklıkları
- Yağ basıncı ve sıcaklığı
- Devir (RPM) ve güç çıkışı`,
  },
  {
    id: "fuel-system",
    title: "Yakıt Sistemi",
    icon: Fuel,
    content: `Yakıt sistemi, geminin enerji ihtiyacını karşılayan en önemli sistemlerden biridir. Doğru yakıt yönetimi hem ekonomik hem de operasyonel açıdan kritiktir.

**Yakıt Tipleri:**
- HFO (Heavy Fuel Oil): Ağır yakıt, en yaygın kullanılan
- VLSFO (Very Low Sulphur Fuel Oil): %0.5 kükürt içerikli
- MGO (Marine Gas Oil): Deniz mazotu, ECA bölgelerinde
- LSFO (Low Sulphur Fuel Oil): Düşük kükürtlü fuel oil
- LNG: Sıvılaştırılmış doğal gaz

**Yakıt Sistemi Bileşenleri:**
1. Bunker tankları
2. Settling tankları
3. Service tankları
4. Purifier ve separator üniteleri
5. Isıtıcılar
6. Filtreler
7. Viskozimetreler

**SFOC Hesaplama:**
SFOC = Yakıt Tüketimi (g) / Üretilen Güç (kWh)

**Viskozite Kontrolü:**
- HFO için enjeksiyon öncesi hedef: 10-15 cSt
- Isıtma sıcaklığı yakıt tipine göre ayarlanır
- Viskozimetre sürekli izleme sağlar

**Bunker Kalite Kontrolü:**
- BDN (Bunker Delivery Note) kontrolü
- Numune alma ve analiz
- Yoğunluk ve viskozite ölçümü
- Uyumsuzluk prosedürleri`,
  },
  {
    id: "cooling-system",
    title: "Soğutma Sistemi",
    icon: Thermometer,
    content: `Soğutma sistemi, makine dairesindeki ekipmanların aşırı ısınmasını önleyerek güvenli çalışmalarını sağlar.

**Soğutma Çevrimleri:**

1. **Tatlı Su (LT - Low Temperature):**
   - LT soğutucu
   - Yağ soğutucuları
   - Hava soğutucuları (charge air)

2. **Tatlı Su (HT - High Temperature):**
   - Ana makine silindir gömlekleri
   - Silindir kapakları
   - Egzoz valfleri

3. **Deniz Suyu:**
   - Merkezi soğutucu (central cooler)
   - Tüm HT ve LT sistemlerini soğutur

**Kritik Parametreler:**
- HT inlet: 70-85°C
- HT outlet: 80-95°C
- LT inlet: 32-38°C
- Deniz suyu outlet: < deniz suyu + 15°C

**Yaygın Sorunlar:**
- Kavitasyon
- Korozyon ve erozyon
- Biyolojik büyüme (deniz suyu tarafı)
- Tıkanma ve kirlenme
- Termostat arızaları`,
  },
  {
    id: "lubrication",
    title: "Yağlama Sistemi",
    icon: Droplets,
    content: `Yağlama sistemi, hareketli parçalar arasındaki sürtünmeyi azaltır, aşınmayı önler ve ısı transferine yardımcı olur.

**Yağlama Türleri:**

1. **Ana Makine Silindir Yağı:**
   - Silindir gömleklerinin yağlanması
   - BN (Base Number) kontrolü önemli
   - Kükürt içeriğine göre BN ayarı

2. **Sistem Yağı:**
   - Krank mili yatakları
   - Kam mili
   - Crosshead
   - Dişli kutuları

3. **Türbin Yağı:**
   - Turbocharger yağlaması
   - Ayrı sistem veya ana sistem

**Yağ Analizi Parametreleri:**
- Viskozite
- TBN (Total Base Number)
- Partikül sayımı
- Su içeriği
- Metal aşınma analizi

**Purifier Operasyonu:**
- Yağ sıcaklığı: 90-98°C
- Gravity disc seçimi
- Akış kontrolü
- Sludge ve su ayrımı`,
  },
  {
    id: "auxiliary-engines",
    title: "Yardımcı Makineler",
    icon: Gauge,
    content: `Yardımcı makineler, geminin elektrik ihtiyacını ve diğer servis gereksinimlerini karşılar.

**Dizel Jeneratörler (D/G):**
- Genellikle 3-4 adet
- Dört zamanlı orta devirli motorlar
- Güç: 500 kW - 3000 kW (gemi tipine göre)
- Paralel çalışma kapasitesi

**Yük Yönetimi:**
- Optimum yük: %50-85
- Düşük yük riski: karbon birikimi
- Yüksek yük riski: aşırı ısınma
- Otomatik yük paylaşımı

**Acil Durum Jeneratörü:**
- Bağımsız başlatma (batarya/hidrolik)
- 45 saniye içinde devreye girme
- Kritik sistemleri besleme

**Kazanlar:**
- Ana kazan (HFO/MGO)
- Egzoz gazı ekonomizeri
- Kompozit kazan
- Buhar üretimi: 7-10 bar

**Kompresörler:**
- Başlangıç havası: 25-30 bar
- Servis havası: 7-8 bar
- Kontrol havası: 7-8 bar`,
  },
  {
    id: "air-system",
    title: "Hava Sistemi",
    icon: Wind,
    content: `Hava sistemi, motorların başlatılması, kontrol sistemleri ve servis ihtiyaçları için basınçlı hava sağlar.

**Sistem Bileşenleri:**

1. **Başlangıç Havası (Starting Air):**
   - Basınç: 25-30 bar
   - Ana makine ve D/G başlatma
   - Minimum 2 adet kompresör
   - En az 6 ardışık başlatma kapasitesi

2. **Servis Havası:**
   - Basınç: 7-8 bar
   - Pnömatik aletler
   - Temizlik işleri
   - Genel kullanım

3. **Kontrol Havası:**
   - Basınç: 7-8 bar
   - Kuru ve temiz
   - Pnömatik kontrol valfleri
   - Otomasyon sistemleri

**Hava Kalitesi:**
- Nem kontrolü (kurutucular)
- Yağ ayırıcılar
- Filtreler
- Dekompresyon valfleri

**Emniyet:**
- Otomatik başlatma kilidi (düşük basınç)
- Basınç relief valfleri
- Periyodik drenaj`,
  },
  {
    id: "maintenance",
    title: "Bakım Yönetimi",
    icon: Settings,
    content: `Etkin bakım yönetimi, geminin güvenli ve verimli operasyonu için kritik öneme sahiptir.

**Bakım Türleri:**

1. **Planlı Bakım (PMS):**
   - Running hours bazlı
   - Takvim bazlı
   - Durum bazlı (condition-based)

2. **Düzeltici Bakım:**
   - Arıza sonrası onarım
   - Acil müdahale
   - Geçici ve kalıcı çözümler

3. **Prediktif Bakım:**
   - Titreşim analizi
   - Termografi
   - Yağ analizi
   - Performans trend analizi

**Kritik Ekipman Listesi:**
- Ana makine
- Dümen makinesi
- Jeneratörler
- Yangın pompaları
- Sintine pompaları
- Seyir ekipmanları

**Bakım Kayıtları:**
- İş emirleri
- Spare part yönetimi
- Çalışma saatleri
- Arıza geçmişi
- Sertifika takibi`,
  },
  {
    id: "troubleshooting",
    title: "Arıza Tespiti ve Çözümü",
    icon: AlertTriangle,
    content: `Sistematik arıza tespiti, problemlerin hızlı ve doğru çözümü için gereklidir.

**Arıza Tespit Metodolojisi:**

1. **Semptomları Tanımla:**
   - Ne zaman başladı?
   - Hangi koşullarda?
   - Diğer belirtiler?

2. **Veri Topla:**
   - Alarm kayıtları
   - Trend verileri
   - Operatör gözlemleri

3. **Analiz Et:**
   - Olası nedenler
   - Kök neden analizi
   - Risk değerlendirmesi

4. **Uygula ve Doğrula:**
   - Düzeltici eylem
   - Test ve doğrulama
   - Dokümantasyon

**Yaygın Arızalar ve Nedenleri:**

**Ana Makine:**
- Yüksek egzoz sıcaklığı: Kötü yanma, enjektör sorunu
- Düşük güç: Turbocharger, yakıt sistemi
- Yüksek titreşim: Dengesizlik, yatak aşınması

**Jeneratör:**
- Frekans dalgalanması: Governor sorunu
- Düşük yalıtım: Nem, kirlilik
- Aşırı ısınma: Soğutma, aşırı yük

**Pompa:**
- Düşük debi: Kavitasyon, aşınma
- Yüksek ses: Yatak, kavitasyon
- Sızıntı: Salmastra, mekanik seal`,
  },
];

export default function MachineTopics() {
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
            Makine Konu Anlatımı
          </h1>
          <p className="text-muted-foreground">
            Ana makine, yardımcı sistemler ve bakım yönetimi
          </p>
        </div>

        <div className="space-y-6">
          {topics.map((topic) => (
            <Card key={topic.id} className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <topic.icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  {topic.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {topic.content.split("\n\n").map((paragraph, idx) => (
                    <div key={idx} className="mb-4">
                      {paragraph.split("\n").map((line, lineIdx) => {
                        if (line.startsWith("**") && line.endsWith("**")) {
                          return (
                            <h4 key={lineIdx} className="font-semibold text-slate-800 dark:text-slate-200 mt-4 mb-2">
                              {line.replace(/\*\*/g, "")}
                            </h4>
                          );
                        }
                        if (line.startsWith("- ")) {
                          return (
                            <li key={lineIdx} className="text-slate-600 dark:text-slate-400 ml-4">
                              {line.substring(2)}
                            </li>
                          );
                        }
                        if (line.match(/^\d+\.\s/)) {
                          return (
                            <li key={lineIdx} className="text-slate-600 dark:text-slate-400 ml-4 list-decimal">
                              {line.replace(/^\d+\.\s/, "")}
                            </li>
                          );
                        }
                        return (
                          <p key={lineIdx} className="text-slate-600 dark:text-slate-400">
                            {line}
                          </p>
                        );
                      })}
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
