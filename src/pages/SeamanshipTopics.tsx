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
    { id: "terminology", title: "Temel Kavramlar ve Terminoloji", icon: BookOpen },
    { id: "ship-types", title: "Gemi Tipleri ve Yapısı", icon: Anchor },
    { id: "rope-work", title: "Halat İşleri ve Düğümler", icon: Waves },
    { id: "anchoring", title: "Demirleme ve Şamandıra", icon: Anchor },
    { id: "mooring", title: "Yanaşma-Ayrılma Manevraları", icon: Waves },
    { id: "steering", title: "Dümen ve Manevra", icon: Wrench },
    { id: "heavy-weather", title: "Ağır Hava Gemiciliği", icon: Wind },
    { id: "navigation", title: "Seyir Temelleri", icon: BookOpen },
    { id: "compass", title: "Pusulalar ve Sapmalar", icon: Ruler },
    { id: "tides", title: "Akıntılar ve Gelgitler", icon: Waves },
    { id: "iala", title: "IALA Seyir Yardımcıları", icon: LifeBuoy },
    { id: "colreg", title: "COLREG Kuralları", icon: BookOpen },
    { id: "communication", title: "Haberleşme Sistemleri", icon: Waves },
    { id: "radar", title: "Radar, ARPA ve ECDIS", icon: Ruler },
    { id: "watchkeeping", title: "Vardiya Usulleri ve BRM", icon: Wrench },
    { id: "safety", title: "Emniyet Yönetimi", icon: LifeBuoy },
    { id: "lifesaving", title: "Can Kurtarma", icon: LifeBuoy },
    { id: "firefighting", title: "Yangınla Mücadele", icon: Wind },
    { id: "pollution", title: "Kirliliği Önleme", icon: Waves },
    { id: "stability", title: "Stabilite ve Yükleme", icon: Ruler },
    { id: "cargo", title: "Yük Operasyonları", icon: Anchor },
    { id: "deck-maintenance", title: "Güverte Bakımı", icon: Wrench },
    { id: "boat-ops", title: "Küçük Tekne Operasyonları", icon: Waves },
    { id: "sar", title: "Arama ve Kurtarma (SAR)", icon: LifeBuoy },
    { id: "human-factors", title: "İnsan Faktörleri ve İSG", icon: BookOpen },
    { id: "documentation", title: "Dokümantasyon ve Kayıtlar", icon: BookOpen },
    { id: "port-ops", title: "Liman Kuralları", icon: Anchor },
    { id: "special-nav", title: "Özel Seyrüsefer", icon: Wind },
    { id: "surveys", title: "Sörvey ve Muayeneler", icon: Ruler },
    { id: "efficiency", title: "Enerji Verimliliği", icon: Wrench },
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
            Konu Anlatımı • v2.0
          </div>
        </div>

        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Anchor className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold">Gemicilik Konu Anlatımı</h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Denizcilik kavramlarından enerji verimliliğine kadar 30 temel gemicilik konusu için kapsamlı rehber.
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

        {/* 1. Temel Kavramlar ve Terminoloji */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('terminology')} className="cursor-pointer" aria-expanded={isOpen('terminology')}>
            <CardTitle id="terminology" className="scroll-mt-24 flex items-center justify-between">
              Temel Denizcilik Kavramları ve Terminoloji
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('terminology') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('terminology') && (
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-3">
              <h4 className="font-semibold text-base">Gemi Yönleri ve Temel Kavramlar</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Ana Yönler:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Pruva (Bow/Fore):</strong> Geminin ön kısmı, hareket yönü</li>
                    <li><strong>Kıç (Stern/Aft):</strong> Geminin arka kısmı</li>
                    <li><strong>İskele (Port):</strong> Geminin sol tarafı (kırmızı ışık)</li>
                    <li><strong>Sancak (Starboard):</strong> Geminin sağ tarafı (yeşil ışık)</li>
                    <li><strong>Omurga (Keel):</strong> Geminin alt kısmı, temel yapı</li>
                    <li><strong>Borda (Side):</strong> Geminin yan duvarları</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Boyutlar ve Ölçümler:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>LOA (Length Overall):</strong> Geminin toplam uzunluğu</li>
                    <li><strong>LBP (Length Between Perpendiculars):</strong> Dikler arası uzunluk</li>
                    <li><strong>B (Beam):</strong> Geminin maksimum genişliği</li>
                    <li><strong>T (Draft):</strong> Su çekimi, omurganın su altında kalan kısmı</li>
                    <li><strong>D (Depth):</strong> Güverte seviyesinden omurgaya derinlik</li>
                    <li><strong>Freeboard:</strong> Su seviyesinden güverteye olan mesafe</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Hız ve Mesafe Birimleri</h4>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Denizcilik Birimleri:</h5>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Knot (kn):</strong> 1 deniz mili/saat = 1.852 km/h = 0.514 m/s</li>
                  <li><strong>Deniz Mili (Nautical Mile):</strong> 1.852 metre (1 dakika enlem)</li>
                  <li><strong>Kablo (Cable):</strong> 1/10 deniz mili = 185.2 metre</li>
                  <li><strong>Log:</strong> Geminin hızını ölçen cihaz</li>
                  <li><strong>Fathom:</strong> 6 feet = 1.83 metre (derinlik ölçümü)</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Güverte Teçhizatı ve Yapısal Elemanlar</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Güverte Ekipmanları:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Amortisör (Fender):</strong> Gemiyi rıhtımdan koruyan yastık</li>
                    <li><strong>Barbette:</strong> Top veya vinç için döner platform</li>
                    <li><strong>Bulwark:</strong> Güverte kenarındaki koruyucu duvar</li>
                    <li><strong>Fairlead:</strong> Halatın yönlendirildiği delikli metal</li>
                    <li><strong>Hawse Pipe:</strong> Demir zincirinin geçtiği boru</li>
                    <li><strong>Bitts:</strong> Halat bağlama direkleri</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Yapısal Elemanlar:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Frame:</strong> Geminin kaburga yapısı</li>
                    <li><strong>Bulkhead:</strong> Gemiyi bölümlere ayıran duvar</li>
                    <li><strong>Deck:</strong> Geminin katları (güverte)</li>
                    <li><strong>Hatch:</strong> Güverte açıklığı, kapak</li>
                    <li><strong>Coaming:</strong> Hatch çevresindeki yüksek kenar</li>
                    <li><strong>Scupper:</strong> Güverte suyunun akıtıldığı delik</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Pratik Uygulama</h4>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Önemli Notlar:</h5>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Denizcilik terminolojisi uluslararası standartlara uygun kullanılmalıdır</li>
                  <li>Yön belirtirken "port" ve "starboard" terimleri kullanılır, "left" ve "right" kullanılmaz</li>
                  <li>Gemi boyutları tonaj hesaplamalarında kritik önem taşır</li>
                  <li>Hız ölçümünde knot birimi kullanılır, km/h değil</li>
                  <li>Mesafe ölçümlerinde deniz mili standart birimdir</li>
                </ul>
              </div>
            </div>
          </CardContent>
          )}
        </Card>

        {/* 2. Gemi Tipleri ve Yapısı */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('ship-types')} className="cursor-pointer" aria-expanded={isOpen('ship-types')}>
            <CardTitle id="ship-types" className="scroll-mt-24 flex items-center justify-between">
              Gemi Tipleri ve Temel Gemi Yapısı
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('ship-types') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('ship-types') && (
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-3">
              <h4 className="font-semibold text-base">Ana Gemi Tipleri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Yük Gemileri:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Tanker:</strong> Sıvı kargo taşıyan gemiler (ham petrol, ürün, kimyasal)</li>
                    <li><strong>Konteyner:</strong> Standart konteyner taşıyan gemiler (TEU/FEU)</li>
                    <li><strong>Dökme Yük:</strong> Tahıl, kömür, cevher taşıyan gemiler</li>
                    <li><strong>RoRo:</strong> Araç taşıyan gemiler (roll-on/roll-off)</li>
                    <li><strong>Genel Kargo:</strong> Çeşitli yükler taşıyan gemiler</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Özel Amaçlı Gemiler:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Kruvaziyer:</strong> Yolcu taşıyan lüks gemiler</li>
                    <li><strong>Balıkçı Gemisi:</strong> Balık avlama gemileri</li>
                    <li><strong>Römorkör:</strong> Diğer gemileri çeken gemiler</li>
                    <li><strong>Platform:</strong> Offshore çalışma platformları</li>
                    <li><strong>Yardımcı:</strong> Liman ve deniz hizmet gemileri</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Gemi Yapısal Elemanları</h4>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Ana Yapısal Bileşenler:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium mb-1">Gövde Yapısı:</h6>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      <li><strong>Omurga (Keel):</strong> Geminin temel yapısal elemanı</li>
                      <li><strong>Bordalar (Sides):</strong> Geminin yan duvarları</li>
                      <li><strong>Kaburga (Frames):</strong> Yapısal destek elemanları</li>
                      <li><strong>Bulkhead:</strong> Su geçirmez bölme duvarları</li>
                      <li><strong>Deck:</strong> Geminin katları</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium mb-1">Güverte Teçhizatı:</h6>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      <li><strong>Vinç (Crane):</strong> Yük kaldırma ekipmanı</li>
                      <li><strong>Irgat (Winch):</strong> Halat çekme makinesi</li>
                      <li><strong>Windlass:</strong> Demir zinciri çekme makinesi</li>
                      <li><strong>Capstan:</strong> Döner halat çekme makinesi</li>
                      <li><strong>Bollard:</strong> Halat bağlama direği</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Üstyapı ve Özel Bölümler</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Köprüüstü ve Kontrol:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Bridge:</strong> Geminin kontrol merkezi</li>
                    <li><strong>Wheelhouse:</strong> Dümen evi</li>
                    <li><strong>Chart Room:</strong> Harita odası</li>
                    <li><strong>Radio Room:</strong> Haberleşme odası</li>
                    <li><strong>Engine Room:</strong> Makine dairesi</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Yaşam Alanları:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Kamaralar:</strong> Mürettebat yatakhaneleri</li>
                    <li><strong>Mess Room:</strong> Yemek salonu</li>
                    <li><strong>Galley:</strong> Mutfak</li>
                    <li><strong>Hospital:</strong> Revir</li>
                    <li><strong>Store Room:</strong> Depo</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Gemi Sınıflandırması</h4>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Boyut ve Kapasite:</h5>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Panamax:</strong> Panama Kanalı'ndan geçebilen maksimum boyut</li>
                  <li><strong>Post-Panamax:</strong> Panama Kanalı'ndan büyük gemiler</li>
                  <li><strong>Suezmax:</strong> Süveyş Kanalı'ndan geçebilen maksimum boyut</li>
                  <li><strong>Capesize:</strong> Cape Horn'dan geçen büyük gemiler</li>
                  <li><strong>Handymax:</strong> Orta boyutlu çok amaçlı gemiler</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Pratik Bilgiler</h4>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Önemli Notlar:</h5>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Her gemi tipinin kendine özgü operasyonel gereksinimleri vardır</li>
                  <li>Gemi yapısı, yük tipine ve operasyonel gereksinimlere göre tasarlanır</li>
                  <li>Güverte teçhizatı, güvenlik ve operasyonel verimlilik için kritiktir</li>
                  <li>Üstyapı düzeni, mürettebat konforu ve operasyonel verimliliği etkiler</li>
                  <li>Gemi sınıflandırması, liman ve kanal kısıtlamalarını belirler</li>
                </ul>
              </div>
            </div>
          </CardContent>
          )}
        </Card>

        {/* 3. Halat İşleri */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('rope-work')} className="cursor-pointer" aria-expanded={isOpen('rope-work')}>
            <CardTitle id="rope-work" className="scroll-mt-24 flex items-center justify-between">
              Halat İşleri, Düğümler ve Splicing
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('rope-work') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('rope-work') && (
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-3">
              <h4 className="font-semibold text-base">Halat Tipleri ve Özellikleri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Fiber Halatlar:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Polyester:</strong> Güçlü, UV dayanıklı, az esnek</li>
                    <li><strong>Nylon:</strong> Çok esnek, şok emici, nem çeker</li>
                    <li><strong>Polypropylene:</strong> Hafif, suda yüzer, UV hassas</li>
                    <li><strong>Kevlar:</strong> Çok güçlü, kesici aletlere dayanıklı</li>
                    <li><strong>Dyneema:</strong> Ultra güçlü, hafif, pahalı</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Çelik Halatlar:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Galvanized:</strong> Paslanmaz kaplama</li>
                    <li><strong>Stainless Steel:</strong> Paslanmaz çelik</li>
                    <li><strong>Wire Rope:</strong> Çok telli yapı</li>
                    <li><strong>Mixed Rope:</strong> Fiber + çelik kombinasyonu</li>
                    <li><strong>Chain:</strong> Zincir, demirleme için</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Temel Düğümler ve Kullanım Alanları</h4>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Ana Düğümler:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium mb-1">Bağlama Düğümleri:</h6>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      <li><strong>Bowline:</strong> Güvenli halka, kolay çözülür</li>
                      <li><strong>Clove Hitch:</strong> Hızlı bağlama, kayabilir</li>
                      <li><strong>Sheet Bend:</strong> Farklı kalınlıkta halatları birleştirir</li>
                      <li><strong>Rolling Hitch:</strong> Kaymaz bağlama</li>
                      <li><strong>Figure-Eight:</strong> Uç koruma, durdurucu</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium mb-1">Özel Düğümler:</h6>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      <li><strong>Reef Knot:</strong> İki ucu birleştirir</li>
                      <li><strong>Fisherman's Bend:</strong> Güvenli bağlama</li>
                      <li><strong>Round Turn:</strong> Güçlü bağlama</li>
                      <li><strong>Marlinspike Hitch:</strong> Halat çekme</li>
                      <li><strong>Monkey's Fist:</strong> Ağırlık ekleme</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Splicing Teknikleri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Fiber Halat Splicing:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Eye Splice:</strong> Halka oluşturma, güvenli</li>
                    <li><strong>Back Splice:</strong> Uç koruma, estetik</li>
                    <li><strong>Short Splice:</strong> İki halatı birleştirme</li>
                    <li><strong>Long Splice:</strong> Kalınlık koruyarak birleştirme</li>
                    <li><strong>Crown Splice:</strong> Uç koruma, dekoratif</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Çelik Halat Splicing:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Wire Rope Splice:</strong> Çelik halat birleştirme</li>
                    <li><strong>Thimble Splice:</strong> Göz oluşturma</li>
                    <li><strong>Flemish Eye:</strong> Güvenli halka</li>
                    <li><strong>Socket Splice:</strong> Metal soket bağlama</li>
                    <li><strong>Swage Splice:</strong> Basınçlı birleştirme</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Güverte Ekipmanları ve Kullanım</h4>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Ana Ekipmanlar:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium mb-1">Kaldırma Ekipmanları:</h6>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      <li><strong>Palanga (Tackle):</strong> Güç artırma sistemi</li>
                      <li><strong>Vinç (Crane):</strong> Yük kaldırma makinesi</li>
                      <li><strong>Irgat (Winch):</strong> Halat çekme makinesi</li>
                      <li><strong>Windlass:</strong> Demir zinciri çekme</li>
                      <li><strong>Capstan:</strong> Döner halat çekme</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium mb-1">Bağlama Ekipmanları:</h6>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      <li><strong>Mapa (Shackle):</strong> Bağlantı elemanı</li>
                      <li><strong>Bollard:</strong> Halat bağlama direği</li>
                      <li><strong>Fairlead:</strong> Halat yönlendirici</li>
                      <li><strong>Cleat:</strong> Halat bağlama çıkıntısı</li>
                      <li><strong>Bitts:</strong> Çift direkli bağlama</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Güvenlik ve Bakım</h4>
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Güvenlik Kuralları:</h5>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Halat yük limitlerini aşmayın (SWL - Safe Working Load)</li>
                  <li>Halat hasarını düzenli kontrol edin (aşınma, kesik, yıpranma)</li>
                  <li>Düğümleri doğru şekilde bağlayın ve kontrol edin</li>
                  <li>Halat çekme sırasında snap-back bölgesinden uzak durun</li>
                  <li>Çelik halat kullanırken eldiven giyin</li>
                  <li>Halatları temiz ve kuru tutun</li>
                  <li>UV ışınlarından koruyun</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Pratik Uygulama</h4>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Önemli Notlar:</h5>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Her düğümün kendine özgü kullanım alanı vardır</li>
                  <li>Splicing, düğümden daha güvenli ve estetiktir</li>
                  <li>Halat seçimi, kullanım amacına göre yapılmalıdır</li>
                  <li>Düzenli bakım, halat ömrünü uzatır</li>
                  <li>Güvenlik her zaman öncelikli olmalıdır</li>
                </ul>
              </div>
            </div>
          </CardContent>
          )}
        </Card>

        {/* 4. Demirleme */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('anchoring')} className="cursor-pointer" aria-expanded={isOpen('anchoring')}>
            <CardTitle id="anchoring" className="scroll-mt-24 flex items-center justify-between">
              Demirleme, Şamandıraya Bağlama ve Demir Taraması
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('anchoring') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('anchoring') && (
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-3">
              <h4 className="font-semibold text-base">Demir Tipleri ve Özellikleri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Ana Demir Tipleri:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Admiralty Pattern:</strong> Klasik demir, genel amaçlı</li>
                    <li><strong>Danforth:</strong> Yüksek tutma gücü, kum/çamur için ideal</li>
                    <li><strong>Bruce:</strong> Çok amaçlı, kayalık zemin için uygun</li>
                    <li><strong>Plow/CQR:</strong> Derin kazma, çamur için ideal</li>
                    <li><strong>Rocna:</strong> Modern tasarım, yüksek performans</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Özel Demirler:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Mushroom:</strong> Kalıcı demirleme için</li>
                    <li><strong>Grapnel:</strong> Batık kurtarma için</li>
                    <li><strong>Kedge:</strong> Yardımcı demir, manevra için</li>
                    <li><strong>Stream:</strong> Akıntıda kullanım için</li>
                    <li><strong>Sea Anchor:</strong> Fırtınada sürüklenme önleme</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Demirleme Hazırlığı</h4>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Yer Seçimi Kriterleri:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium mb-1">Zemin Analizi:</h6>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      <li><strong>Kum:</strong> İyi tutma, kolay çıkarma</li>
                      <li><strong>Çamur:</strong> Mükemmel tutma, zor çıkarma</li>
                      <li><strong>Kaya:</strong> Riskli, demir takılabilir</li>
                      <li><strong>Çakıl:</strong> Orta tutma, aşınma riski</li>
                      <li><strong>Deniz Yosunu:</strong> Zayıf tutma</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium mb-1">Çevre Faktörleri:</h6>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      <li><strong>Derinlik:</strong> Scope hesabı için kritik</li>
                      <li><strong>Akıntı:</strong> Yön ve şiddet</li>
                      <li><strong>Rüzgâr:</strong> Hız ve yön değişimi</li>
                      <li><strong>Gelgit:</strong> Su seviyesi değişimi</li>
                      <li><strong>Traffic:</strong> Diğer gemiler</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Scope Hesaplaması ve Zincir Miktarı</h4>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Scope Formülü:</h5>
                <div className="space-y-2">
                  <div className="font-mono text-sm bg-white dark:bg-gray-800 p-2 rounded">
                    Scope = Zincir Uzunluğu / Su Derinliği
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li><strong>Normal Koşullar:</strong> Scope = 3-5 (derinliğin 3-5 katı)</li>
                    <li><strong>Fırtına:</strong> Scope = 7-10 (güvenlik için artırılır)</li>
                    <li><strong>Kısa Süreli:</strong> Scope = 2-3 (hızlı demirleme)</li>
                    <li><strong>Kalıcı:</strong> Scope = 5-7 (uzun süreli demirleme)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Demirleme Prosedürü</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Demir Bırakma:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Hazırlık:</strong> Demir ve zincir kontrolü</li>
                    <li><strong>Pozisyon:</strong> Rüzgâr pruvada, yavaş hız</li>
                    <li><strong>Bırakma:</strong> Kontrollü zincir salma</li>
                    <li><strong>Kontrol:</strong> Tutuş teyidi, pozisyon kontrolü</li>
                    <li><strong>Güvenlik:</strong> Demir bekçisi, düzenli kontrol</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Demir Çekme:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Hazırlık:</strong> Makine hazırlığı, pozisyon alma</li>
                    <li><strong>Çekme:</strong> Zincir çekme, demir temizleme</li>
                    <li><strong>Kontrol:</strong> Demir ve zincir hasar kontrolü</li>
                    <li><strong>Güvenlik:</strong> Zincir temizleme, demir kilitleme</li>
                    <li><strong>Kayıt:</strong> Demirleme süresi ve koşulları</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Şamandıra Bağlama</h4>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Mooring Buoy Bağlama:</h5>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Bridle Düzeni:</strong> İki halat ile dengeli bağlama</li>
                  <li><strong>Halat Seçimi:</strong> Uygun kalınlık ve uzunluk</li>
                  <li><strong>Bağlama Tekniği:</strong> Güvenli düğüm kullanımı</li>
                  <li><strong>Kontrol:</strong> Düzenli halat kontrolü</li>
                  <li><strong>Güvenlik:</strong> Yedek halat hazırlığı</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Demir Taraması ve Sorun Giderme</h4>
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Yaygın Sorunlar:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium mb-1">Demir Taraması:</h6>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      <li><strong>Neden:</strong> Yetersiz scope, zayıf zemin</li>
                      <li><strong>Belirti:</strong> Pozisyon değişimi</li>
                      <li><strong>Çözüm:</strong> Scope artırma, yeniden demirleme</li>
                      <li><strong>Önlem:</strong> Düzenli pozisyon kontrolü</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium mb-1">Foul Anchor:</h6>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      <li><strong>Neden:</strong> Demir takılması</li>
                      <li><strong>Belirti:</strong> Çekme zorluğu</li>
                      <li><strong>Çözüm:</strong> Farklı açılardan çekme</li>
                      <li><strong>Önlem:</strong> Uygun demir seçimi</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Güvenlik ve Bakım</h4>
              <div className="bg-gray-50 dark:bg-gray-900/20 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Önemli Notlar:</h5>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Demirleme öncesi hava durumu kontrolü yapın</li>
                  <li>Zincir ve demir düzenli kontrol edilmeli</li>
                  <li>Demirleme sırasında düzenli pozisyon kontrolü</li>
                  <li>Aciliyet durumunda demir kesme prosedürü</li>
                  <li>Demirleme kayıtları tutulmalı</li>
                  <li>Yedek demir ve zincir hazır bulundurulmalı</li>
                </ul>
              </div>
            </div>
          </CardContent>
          )}
        </Card>

        {/* 5. Yanaşma-Ayrılma */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('mooring')} className="cursor-pointer" aria-expanded={isOpen('mooring')}>
            <CardTitle id="mooring" className="scroll-mt-24 flex items-center justify-between">
              Yanaşma–Ayrılma ve Rıhtım Manevraları
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('mooring') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('mooring') && (
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-3">
              <h4 className="font-semibold text-base">Halat Düzeni ve Bağlama Sistemi</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Ana Halatlar:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Head Line:</strong> Baş halat, ön bağlama</li>
                    <li><strong>Stern Line:</strong> Kıç halat, arka bağlama</li>
                    <li><strong>Forward Spring:</strong> Baş spring, ileri hareket önleme</li>
                    <li><strong>Aft Spring:</strong> Kıç spring, geri hareket önleme</li>
                    <li><strong>Breast Line:</strong> Yan halat, yan hareket önleme</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Yardımcı Halatlar:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Heaving Line:</strong> Atma halatı, bağlantı kurma</li>
                    <li><strong>Messenger Line:</strong> Ana halat çekme</li>
                    <li><strong>Slip Line:</strong> Hızlı ayrılma halatı</li>
                    <li><strong>Check Line:</strong> Kontrol halatı</li>
                    <li><strong>Safety Line:</strong> Güvenlik halatı</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Yanaşma Prosedürü</h4>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Yanaşma Aşamaları:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium mb-1">Hazırlık:</h6>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      <li><strong>Pilot Koordinasyonu:</strong> Pilot ile iletişim</li>
                      <li><strong>Fender Hazırlığı:</strong> Amortisör yerleştirme</li>
                      <li><strong>Halat Hazırlığı:</strong> Halatların hazırlanması</li>
                      <li><strong>Makine Hazırlığı:</strong> Makine ve dümen kontrolü</li>
                      <li><strong>Mürettebat Hazırlığı:</strong> Vardiya düzeni</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium mb-1">Yaklaşma:</h6>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      <li><strong>Hız Kontrolü:</strong> Yavaş yaklaşma</li>
                      <li><strong>Açı Hesabı:</strong> Rüzgâr ve akıntı etkisi</li>
                      <li><strong>Pozisyon Kontrolü:</strong> Doğru konumlama</li>
                      <li><strong>Halat Atma:</strong> İlk bağlantı</li>
                      <li><strong>Son Pozisyon:</strong> Final konumlama</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Manevra Tipleri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Yanaşma Tipleri:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Alongside:</strong> Rıhtıma yan yana yanaşma</li>
                    <li><strong>Med-Mooring:</strong> Ortada demirleme</li>
                    <li><strong>Trot Mooring:</strong> İki demir arası</li>
                    <li><strong>Single Point:</strong> Tek nokta bağlama</li>
                    <li><strong>Multi-Point:</strong> Çok nokta bağlama</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Özel Durumlar:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Windward:</strong> Rüzgâr üstü yanaşma</li>
                    <li><strong>Leeward:</strong> Rüzgâr altı yanaşma</li>
                    <li><strong>Current:</strong> Akıntıda yanaşma</li>
                    <li><strong>Ice:</strong> Buzlu koşullarda</li>
                    <li><strong>Emergency:</strong> Acil yanaşma</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Römorkör Operasyonları</h4>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Römorkör Tipleri ve Kullanımı:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium mb-1">Römorkör Tipleri:</h6>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      <li><strong>Harbor Tug:</strong> Liman römorkörü</li>
                      <li><strong>Ocean Tug:</strong> Açık deniz römorkörü</li>
                      <li><strong>Azimuth Tug:</strong> Döner pervane</li>
                      <li><strong>Conventional Tug:</strong> Klasik römorkör</li>
                      <li><strong>Voith Tug:</strong> Voith-Schneider pervane</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium mb-1">Operasyon Modları:</h6>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      <li><strong>Push Mode:</strong> İtme modu</li>
                      <li><strong>Pull Mode:</strong> Çekme modu</li>
                      <li><strong>Escort Mode:</strong> Eşlik modu</li>
                      <li><strong>Emergency Mode:</strong> Acil mod</li>
                      <li><strong>Standby Mode:</strong> Bekleme modu</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Güvenlik ve Risk Yönetimi</h4>
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Güvenlik Kuralları:</h5>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Snap-back Zone:</strong> Halat kopma bölgesinden uzak durun</li>
                  <li><strong>Bight Safety:</strong> Halat halkası altında kalmayın</li>
                  <li><strong>Chafe Protection:</strong> Halat aşınma koruması</li>
                  <li><strong>Tide Adjustment:</strong> Gelgit ayarlamaları</li>
                  <li><strong>Weather Monitoring:</strong> Hava durumu takibi</li>
                  <li><strong>Communication:</strong> Sürekli haberleşme</li>
                  <li><strong>Emergency Procedures:</strong> Acil durum prosedürleri</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Ayrılma Prosedürü</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Hazırlık:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Makine Hazırlığı:</strong> Makine ve dümen kontrolü</li>
                    <li><strong>Halat Kontrolü:</strong> Halat durumu kontrolü</li>
                    <li><strong>Fender Kontrolü:</strong> Amortisör kontrolü</li>
                    <li><strong>Pilot Koordinasyonu:</strong> Pilot ile iletişim</li>
                    <li><strong>Mürettebat Hazırlığı:</strong> Vardiya düzeni</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Ayrılma:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Halat Çözme:</strong> Sıralı halat çözme</li>
                    <li><strong>Pozisyon Kontrolü:</strong> Güvenli ayrılma</li>
                    <li><strong>Hız Kontrolü:</strong> Kontrollü hareket</li>
                    <li><strong>Fender Toplama:</strong> Amortisör toplama</li>
                    <li><strong>Final Kontrol:</strong> Son güvenlik kontrolü</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Pratik Uygulama</h4>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Önemli Notlar:</h5>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Her yanaşma durumu benzersizdir, esnek olun</li>
                  <li>Rüzgâr ve akıntı her zaman hesaba katılmalı</li>
                  <li>Pilot deneyimi ve önerileri önemlidir</li>
                  <li>Güvenlik her zaman öncelikli olmalıdır</li>
                  <li>Düzenli iletişim kritik önem taşır</li>
                  <li>Aciliyet durumunda hazırlıklı olun</li>
                </ul>
              </div>
            </div>
          </CardContent>
          )}
        </Card>

        {/* 6. Dümen ve Manevra */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('steering')} className="cursor-pointer" aria-expanded={isOpen('steering')}>
            <CardTitle id="steering" className="scroll-mt-24 flex items-center justify-between">
              Dümen Kullanımı, Sevk ve Manevra
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('steering') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('steering') && (
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-3">
              <h4 className="font-semibold text-base">Gemi Manevra Prensipleri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Pivot Noktası:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Forward Position:</strong> İleri yükleme, dönüş yarıçapı küçük</li>
                    <li><strong>Aft Position:</strong> Geri yükleme, dönüş yarıçapı büyük</li>
                    <li><strong>Center Position:</strong> Dengeli yükleme, orta dönüş</li>
                    <li><strong>Yükleme Etkisi:</strong> KG yüksekliği dönüşü etkiler</li>
                    <li><strong>Hız Etkisi:</strong> Yüksek hızda dönüş zorlaşır</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Manevra Faktörleri:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Gemi Boyutu:</strong> Büyük gemi, zor manevra</li>
                    <li><strong>Su Derinliği:</strong> Sığ suda manevra zorlaşır</li>
                    <li><strong>Rüzgâr Etkisi:</strong> Yüksek rüzgârda kontrol zor</li>
                    <li><strong>Akıntı Etkisi:</strong> Güçlü akıntıda sürüklenme</li>
                    <li><strong>Yükleme Durumu:</strong> Trim ve list etkisi</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Sığ Su Etkileri</h4>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Squat Effect:</h5>
                <div className="space-y-2">
                  <div className="font-mono text-sm bg-white dark:bg-gray-800 p-2 rounded">
                    Squat = (Cb × V²) / (100 × √h)
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li><strong>Cb:</strong> Blok katsayısı (0.6-0.8)</li>
                    <li><strong>V:</strong> Gemi hızı (knot)</li>
                    <li><strong>h:</strong> Su derinliği (metre)</li>
                    <li><strong>UKC:</strong> Under Keel Clearance hesabı</li>
                    <li><strong>Güvenli UKC:</strong> En az 0.5m + squat</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Kanal ve Kıyı Etkileri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Bank Effect:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Yaw Moment:</strong> Kanal kenarına doğru dönme</li>
                    <li><strong>Suction Effect:</strong> Kanal kenarından emme</li>
                    <li><strong>Speed Effect:</strong> Hız artışıyla etki artar</li>
                    <li><strong>Distance Effect:</strong> Kenara yakınlık etkisi</li>
                    <li><strong>Compensation:</strong> Dümen ile kompanzasyon</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Kanal Navigasyonu:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Center Line:</strong> Kanal merkezi takibi</li>
                    <li><strong>Speed Control:</strong> Hız kontrolü</li>
                    <li><strong>Course Correction:</strong> Rota düzeltmeleri</li>
                    <li><strong>Traffic Management:</strong> Trafik yönetimi</li>
                    <li><strong>Emergency Procedures:</strong> Acil durum prosedürleri</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Dümen ve Sevk Sistemleri</h4>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Dümen Tipleri:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium mb-1">Klasik Dümenler:</h6>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      <li><strong>Rudder:</strong> Klasik dümen</li>
                      <li><strong>Balanced Rudder:</strong> Denge dümeni</li>
                      <li><strong>Unbalanced Rudder:</strong> Dengesiz dümen</li>
                      <li><strong>Spade Rudder:</strong> Kılıç dümen</li>
                      <li><strong>Skeg Rudder:</strong> Destekli dümen</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium mb-1">Modern Sistemler:</h6>
                    <ul className="list-disc pl-5 space-y-1 text-xs">
                      <li><strong>Azimuth Thruster:</strong> Döner pervane</li>
                      <li><strong>Bow Thruster:</strong> Baş pervane</li>
                      <li><strong>Stern Thruster:</strong> Kıç pervane</li>
                      <li><strong>Steerable Nozzle:</strong> Döner nozul</li>
                      <li><strong>Voith-Schneider:</strong> Dikey pervane</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Manevra Teknikleri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Temel Manevralar:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Kick Ahead:</strong> İleri itme, pozisyon düzeltme</li>
                    <li><strong>Kick Astern:</strong> Geri itme, durdurma</li>
                    <li><strong>Stemming:</strong> Akıntıya karşı durma</li>
                    <li><strong>Crabbing:</strong> Yan hareket</li>
                    <li><strong>Backing and Filling:</strong> Geri-ileri kombinasyonu</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Özel Manevralar:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Turning Circle:</strong> Dönüş dairesi</li>
                    <li><strong>Crash Stop:</strong> Acil durdurma</li>
                    <li><strong>Mooring Maneuver:</strong> Yanaşma manevrası</li>
                    <li><strong>Unmooring:</strong> Ayrılma manevrası</li>
                    <li><strong>Emergency Turn:</strong> Acil dönüş</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Hesaplamalar ve Formüller</h4>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Önemli Hesaplamalar:</h5>
                <div className="space-y-2">
                  <div className="font-mono text-sm bg-white dark:bg-gray-800 p-2 rounded">
                    Turning Radius = L × (1 + V/10)
                  </div>
                  <div className="font-mono text-sm bg-white dark:bg-gray-800 p-2 rounded">
                    Stopping Distance = V² / (2 × Deceleration)
                  </div>
                  <div className="font-mono text-sm bg-white dark:bg-gray-800 p-2 rounded">
                    Advance = L × (0.5 + V/20)
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-xs mt-2">
                    <li><strong>L:</strong> Gemi uzunluğu</li>
                    <li><strong>V:</strong> Gemi hızı (knot)</li>
                    <li><strong>Deceleration:</strong> Yavaşlama oranı</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Güvenlik ve Risk Yönetimi</h4>
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Güvenlik Kuralları:</h5>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Sığ suda hızı azaltın (squat etkisi)</li>
                  <li>Kanal kenarından yeterli mesafe bırakın</li>
                  <li>Rüzgâr ve akıntı etkilerini hesaba katın</li>
                  <li>Manevra öncesi makine kontrolü yapın</li>
                  <li>Aciliyet durumunda hazırlıklı olun</li>
                  <li>Traffic separation kurallarına uyun</li>
                  <li>Pilot önerilerini dikkate alın</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base">Pratik Uygulama</h4>
              <div className="bg-gray-50 dark:bg-gray-900/20 p-3 rounded-lg">
                <h5 className="font-medium mb-2">Önemli Notlar:</h5>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Her gemi farklı manevra karakteristiklerine sahiptir</li>
                  <li>Deneyim ve pratik önemlidir</li>
                  <li>Hava koşulları manevrayı etkiler</li>
                  <li>Güvenlik her zaman öncelikli olmalıdır</li>
                  <li>Düzenli makine bakımı kritiktir</li>
                  <li>Manevra kayıtları tutulmalıdır</li>
                </ul>
              </div>
            </div>
          </CardContent>
          )}
        </Card>

        {/* 7. Ağır Hava */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('heavy-weather')} className="cursor-pointer" aria-expanded={isOpen('heavy-weather')}>
            <CardTitle id="heavy-weather" className="scroll-mt-24 flex items-center justify-between">
              Ağır Hava Gemiciliği ve Fırtına İdaresi
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('heavy-weather') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('heavy-weather') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Rota/Sürat:</strong> Dalga gelişine göre başa/omağa alma; parametric/synchronous roll önleme</li>
              <li><strong>Hazırlık:</strong> Güverte emniyeti, sızdırmazlık kontrolleri, yük bağlama takviyesi</li>
              <li><strong>Makine Kullanımı:</strong> Standby hazır, dümen periyodik kontrol, pervane yükü izleme</li>
              <li><strong>Yolcu/Mürettebat:</strong> Sınırlı hareket, can yeleği hazırlığı, deniz tutması önlemi</li>
              <li><strong>İzleme:</strong> Su alma/sürüklenme takibi, yapısal hasar kontrolleri, hava durumu güncellemeleri</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 8. Seyir Temelleri */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('navigation')} className="cursor-pointer" aria-expanded={isOpen('navigation')}>
            <CardTitle id="navigation" className="scroll-mt-24 flex items-center justify-between">
              Seyir Temelleri: Harita Okuma ve Mevki Belirleme
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('navigation') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('navigation') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Harita Tipleri:</strong> Mercator, gnomonic, electronic (ENC/RNC), harbor charts</li>
              <li><strong>Harita Okuma:</strong> Lat/Long, sounding, contours, symbols, notices to mariners</li>
              <li><strong>Yayınlar:</strong> Sailing Directions, List of Lights, Tide Tables, ALRS, NP</li>
              <li><strong>Mevki Belirleme:</strong> GPS, visual fixes (bearing/range), celestial navigation temelleri</li>
              <li><strong>Rota Planlama:</strong> Passage planning, waypoints, wheel-over points, no-go areas</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 9. Pusulalar */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('compass')} className="cursor-pointer" aria-expanded={isOpen('compass')}>
            <CardTitle id="compass" className="scroll-mt-24 flex items-center justify-between">
              Pusulalar ve Sapmalar
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('compass') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('compass') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Manyetik Pusula:</strong> Variation (declination), deviation, compass error</li>
              <li><strong>Cayma Düzeltmeleri:</strong> Compass to True (C→M→T), deviation kartı kullanımı</li>
              <li><strong>Ciro Pusula (Gyro):</strong> Gyro error, azimuth check, amplitude check</li>
              <li><strong>Kontroller:</strong> Sun/star azimuth, terrestrial bearings, gyro vs magnetic karşılaştırma</li>
              <li><strong>Bakım:</strong> Deviation swing, compass adjustment, kayıt tutma</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 10. Akıntılar ve Gelgitler */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('tides')} className="cursor-pointer" aria-expanded={isOpen('tides')}>
            <CardTitle id="tides" className="scroll-mt-24 flex items-center justify-between">
              Akıntılar ve Gelgitler
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('tides') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('tides') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Gelgit Tipleri:</strong> Semi-diurnal, diurnal, mixed; spring/neap tides</li>
              <li><strong>Hesaplamalar:</strong> HW/LW zamanları, height of tide, tidal curve kullanımı</li>
              <li><strong>Akıntı:</strong> Tidal stream, ocean current, set and drift hesabı</li>
              <li><strong>Derinlik Ölçümü:</strong> Echo sounder, lead line, charted depth vs actual depth</li>
              <li><strong>Rota Planlama:</strong> UKC (Under Keel Clearance), tidal window, pilot boarding depth</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 11. IALA */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('iala')} className="cursor-pointer" aria-expanded={isOpen('iala')}>
            <CardTitle id="iala" className="scroll-mt-24 flex items-center justify-between">
              IALA Seyir Yardımcıları ve Şamandıra Sistemleri
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('iala') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('iala') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>IALA A Bölgesi:</strong> Kırmızı iskele, yeşil sancak (Avrupa, Afrika, Asya)</li>
              <li><strong>IALA B Bölgesi:</strong> Kırmızı sancak, yeşil iskele (Amerika)</li>
              <li><strong>Lateral Marks:</strong> Port/starboard buoys, preferred channel marks</li>
              <li><strong>Cardinal Marks:</strong> N, E, S, W işaretleri, top marks, light characteristics</li>
              <li><strong>Özel İşaretler:</strong> Isolated danger, safe water, special marks (yellow)</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 12. COLREG */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('colreg')} className="cursor-pointer" aria-expanded={isOpen('colreg')}>
            <CardTitle id="colreg" className="scroll-mt-24 flex items-center justify-between">
              COLREG (Denizde Çatışmayı Önleme Kuralları)
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('colreg') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('colreg') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Temel Kurallar:</strong> Rule 5 (look-out), Rule 6 (safe speed), Rule 7 (risk of collision)</li>
              <li><strong>Yol Verme:</strong> Head-on, crossing, overtaking situations; power vs sail</li>
              <li><strong>Seyir Işıkları:</strong> Masthead, sidelights, sternlight, towing lights, NUC/RAM/CBD</li>
              <li><strong>İşaretler:</strong> Shapes (ball, cone, cylinder, diamond), day signals</li>
              <li><strong>Ses Sinyalleri:</strong> Whistle, bell, gong; fog signals, maneuvering signals</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 13. Haberleşme */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('communication')} className="cursor-pointer" aria-expanded={isOpen('communication')}>
            <CardTitle id="communication" className="scroll-mt-24 flex items-center justify-between">
              Haberleşme: VHF/DSC, GMDSS Temelleri
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('communication') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('communication') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>VHF:</strong> Ch 16 (distress/calling), Ch 13 (bridge-to-bridge), working channels</li>
              <li><strong>DSC:</strong> Digital Selective Calling, distress alert, MMSI kullanımı</li>
              <li><strong>GMDSS:</strong> A1/A2/A3/A4 alanları, EPIRB, SART, NAVTEX, Inmarsat</li>
              <li><strong>Işık/Ses İşaretleri:</strong> Morse (SOS), aldis lamp, whistle codes</li>
              <li><strong>Flama İşaretleri:</strong> International Code of Signals (ICS), single/double letter meanings</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 14. Radar ve ECDIS */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('radar')} className="cursor-pointer" aria-expanded={isOpen('radar')}>
            <CardTitle id="radar" className="scroll-mt-24 flex items-center justify-between">
              Radar, ARPA ve ECDIS'e Giriş
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('radar') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('radar') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Radar:</strong> Pulse length, PRF, range/bearing accuracy, clutter suppression (FTC/STC)</li>
              <li><strong>ARPA:</strong> Auto tracking, CPA/TCPA, trial maneuver, target swap, vector modes</li>
              <li><strong>ECDIS:</strong> ENC display, route planning, safety contour/depth, alarm management</li>
              <li><strong>Kör Seyir:</strong> Reduced visibility procedures, radar plotting, parallel indexing</li>
              <li><strong>Limitasyonlar:</strong> Radar shadow, false echoes, blind sectors, SART detection</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 15. Vardiya */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('watchkeeping')} className="cursor-pointer" aria-expanded={isOpen('watchkeeping')}>
            <CardTitle id="watchkeeping" className="scroll-mt-24 flex items-center justify-between">
              Vardiya Usulleri ve Köprüüstü Kaynak Yönetimi (BRM)
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('watchkeeping') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('watchkeeping') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Vardiya Sistemi:</strong> 4-on 8-off, 6-on 6-off, watch handover prosedürü</li>
              <li><strong>STCW Gerekleri:</strong> Rest hours, fitness for duty, look-out requirements</li>
              <li><strong>BRM Prensipleri:</strong> Situational awareness, workload management, communication</li>
              <li><strong>Köprüüstü Ekip:</strong> Master-pilot relationship, OOW sorumlulukları, karar verme</li>
              <li><strong>Kayıtlar:</strong> Deck log, bell book, course recorder, BNWAS</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 16. Emniyet Yönetimi */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('safety')} className="cursor-pointer" aria-expanded={isOpen('safety')}>
            <CardTitle id="safety" className="scroll-mt-24 flex items-center justify-between">
              Emniyet Yönetimi: SOLAS, ISM, ISPS
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('safety') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('safety') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>SOLAS:</strong> Life-saving appliances, fire protection, radio, navigation safety</li>
              <li><strong>ISM Code:</strong> Safety Management System, DPA, internal audit, non-conformities</li>
              <li><strong>ISPS Code:</strong> Ship security plan, SSO, security levels 1/2/3, drills</li>
              <li><strong>Sertifikalar:</strong> SMC, DOC, ISSC, statutory certificates</li>
              <li><strong>Drill ve Eğitim:</strong> Fire, abandon ship, MOB, security drills; training records</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 17. Can Kurtarma */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('lifesaving')} className="cursor-pointer" aria-expanded={isOpen('lifesaving')}>
            <CardTitle id="lifesaving" className="scroll-mt-24 flex items-center justify-between">
              Can Kurtarma Araçları ve Tahliye Prosedürleri
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('lifesaving') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('lifesaving') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Ekipman:</strong> Lifeboat, life raft, rescue boat, lifejacket, immersion suit</li>
              <li><strong>MOB Prosedürü:</strong> Alarm, Williamson/Anderson turn, rescue boat launch, recovery</li>
              <li><strong>Tahliye:</strong> Muster station, abandon ship signal, embarkation ladder, lifeboat davit</li>
              <li><strong>Acil Ekipman:</strong> EPIRB, SART, pyrotechnics (flares, smoke), GMDSS alerting</li>
              <li><strong>Bakım:</strong> Weekly/monthly inspections, davit tests, hydrostatic tests, inventory checks</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 18. Yangın */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('firefighting')} className="cursor-pointer" aria-expanded={isOpen('firefighting')}>
            <CardTitle id="firefighting" className="scroll-mt-24 flex items-center justify-between">
              Yangınla Mücadele
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('firefighting') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('firefighting') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Yangın Sınıfları:</strong> A (katı), B (sıvı), C (gaz), D (metal), E (elektrik)</li>
              <li><strong>Ekipman:</strong> Portable extinguisher (CO₂, foam, dry powder), fire hose, nozzle</li>
              <li><strong>Sabit Sistemler:</strong> Sprinkler, CO₂ flooding, foam, water mist, inert gas</li>
              <li><strong>Tatbikatlar:</strong> Fire drill scenarios, SCBA kullanımı, boundary cooling</li>
              <li><strong>Prosedürler:</strong> Fire detection, alarm, isolation, attack, boundary cooling, ventilation control</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 19. Kirliliği Önleme */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('pollution')} className="cursor-pointer" aria-expanded={isOpen('pollution')}>
            <CardTitle id="pollution" className="scroll-mt-24 flex items-center justify-between">
              Kirliliği Önleme: MARPOL Ekleri
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('pollution') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('pollution') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Annex I:</strong> Oil pollution; ODMCS, ORB, 15 ppm limit, special areas</li>
              <li><strong>Annex II:</strong> Noxious liquid substances (NLS); categories X/Y/Z</li>
              <li><strong>Annex IV:</strong> Sewage; treatment plant, holding tank, discharge criteria</li>
              <li><strong>Annex V:</strong> Garbage; plastic ban, food waste, Garbage Record Book</li>
              <li><strong>Annex VI:</strong> Air pollution; SOx/NOx limits, EEDI/EEXI/CII, fuel sulfur content</li>
              <li><strong>Balast Suyu:</strong> BWM Convention, D-1/D-2 standards, BWMS, BWM Record Book</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 20. Stabilite */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('stability')} className="cursor-pointer" aria-expanded={isOpen('stability')}>
            <CardTitle id="stability" className="scroll-mt-24 flex items-center justify-between">
              Stabilite ve Yükleme Temelleri
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('stability') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('stability') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Temel Kavramlar:</strong> G (gravity center), B (buoyancy center), M (metacenter)</li>
              <li><strong>Stabilite Kriterleri:</strong> GM (metacentric height), GZ (righting lever), IMO criteria</li>
              <li><strong>Serbest Yüzey Etkisi:</strong> FSM (free surface moment), tank doluluk oranı, ballasting</li>
              <li><strong>Yükleme:</strong> Trim, list, draft surveys, loading computer, stress calculations</li>
              <li><strong>İnklonometre:</strong> GM determination, inclining test, lightweight survey</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 21. Yük Operasyonları */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('cargo')} className="cursor-pointer" aria-expanded={isOpen('cargo')}>
            <CardTitle id="cargo" className="scroll-mt-24 flex items-center justify-between">
              Yük Operasyonları
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('cargo') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('cargo') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Genel Yük:</strong> Break bulk, project cargo, heavy lift; securing, dunnage</li>
              <li><strong>Dökme Yük:</strong> Grain (angle of repose, shifting), ore, coal; hold preparation</li>
              <li><strong>Konteyner:</strong> TEU/FEU, stowage planning, lashing, stack weight, reefer containers</li>
              <li><strong>Tanker:</strong> Crude/product/chemical; COW, IGS, venting, static electricity, cargo compatibility</li>
              <li><strong>IMDG/IBC/IGC:</strong> Dangerous goods classes, segregation, stowage, documentation</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 22. Güverte Bakımı */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('deck-maintenance')} className="cursor-pointer" aria-expanded={isOpen('deck-maintenance')}>
            <CardTitle id="deck-maintenance" className="scroll-mt-24 flex items-center justify-between">
              Güverte Bakımı ve Bakım Planları
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('deck-maintenance') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('deck-maintenance') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Pas ve Boya:</strong> Rust chipping, wire brushing, priming, topcoat; paint types</li>
              <li><strong>Zincir-Halat Bakımı:</strong> Cable inspection, lubrication, end-for-end, renewal criteria</li>
              <li><strong>Güverte Ekipmanı:</strong> Winch, windlass, crane, hatch cover; greasing, testing</li>
              <li><strong>PMS (Planned Maintenance):</strong> Running hours, calendar-based, critical equipment</li>
              <li><strong>Spare Parts:</strong> Critical spares inventory, ROB management, ordering procedures</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 23. Küçük Tekne */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('boat-ops')} className="cursor-pointer" aria-expanded={isOpen('boat-ops')}>
            <CardTitle id="boat-ops" className="scroll-mt-24 flex items-center justify-between">
              Küçük Tekne/Servis Botu Operasyonları
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('boat-ops') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('boat-ops') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Pilot Transfer:</strong> Pilot ladder, combination ladder, lee side, transfer arrangements</li>
              <li><strong>Servis Botu:</strong> Davit/crane launch, outboard motor, fuel/safety checks</li>
              <li><strong>Kürek/Motor Kullanımı:</strong> Rowing technique, helm orders, emergency procedures</li>
              <li><strong>Emniyet:</strong> Lifejacket, man-ropes, lifebuoy, VHF handheld, distress signals</li>
              <li><strong>Bakım:</strong> Hull inspection, plug checks, painter/gripes, embarkation ladder</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 24. SAR */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('sar')} className="cursor-pointer" aria-expanded={isOpen('sar')}>
            <CardTitle id="sar" className="scroll-mt-24 flex items-center justify-between">
              Arama ve Kurtarma (SAR)
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('sar') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('sar') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>IAMSAR:</strong> Search patterns (expanding square, sector, parallel track)</li>
              <li><strong>OSC/SMC:</strong> On-Scene Coordinator, SAR Mission Coordinator roles</li>
              <li><strong>Distress Signals:</strong> Mayday, DSC alert, EPIRB, pyrotechnics, SOS</li>
              <li><strong>Acil Haberleşme:</strong> Urgency (Pan-Pan), Safety (Securite), medical advice</li>
              <li><strong>Koordinasyon:</strong> MRCC, RCC, SAR units, helicopter operations, medical evacuation</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 25. İnsan Faktörleri */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('human-factors')} className="cursor-pointer" aria-expanded={isOpen('human-factors')}>
            <CardTitle id="human-factors" className="scroll-mt-24 flex items-center justify-between">
              İnsan Faktörleri, İSG ve PPE
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('human-factors') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('human-factors') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>İnsan Faktörleri:</strong> Fatigue, stress, situational awareness, decision making</li>
              <li><strong>İSG:</strong> Risk assessment, hazard identification, injury reporting, accident investigation</li>
              <li><strong>PPE:</strong> Hard hat, safety shoes, gloves, goggles, harness, lifejacket</li>
              <li><strong>Permit-to-Work:</strong> Hot work, confined space, working aloft, electrical isolation</li>
              <li><strong>Ergonomi:</strong> Manual handling, repetitive strain, noise exposure, vibration</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 26. Dokümantasyon */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('documentation')} className="cursor-pointer" aria-expanded={isOpen('documentation')}>
            <CardTitle id="documentation" className="scroll-mt-24 flex items-center justify-between">
              Dokümantasyon ve Kayıtlar
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('documentation') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('documentation') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Günlükler:</strong> Deck log, engine log, oil record book, garbage record book</li>
              <li><strong>Raporlar:</strong> Noon report, arrival/departure report, incident/accident report</li>
              <li><strong>Check-lists:</strong> Pre-departure, bridge/engine room rounds, cargo operations</li>
              <li><strong>Kayıtlar:</strong> Training records, drill records, maintenance logs, rest hour records</li>
              <li><strong>Elektronik:</strong> Voyage Data Recorder (VDR), ECDIS logs, AIS playback</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 27. Liman Operasyonları */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('port-ops')} className="cursor-pointer" aria-expanded={isOpen('port-ops')}>
            <CardTitle id="port-ops" className="scroll-mt-24 flex items-center justify-between">
              Liman Kuralları ve Mevzuat
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('port-ops') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('port-ops') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Liman Kuralları:</strong> Speed limits, VTS reporting, pilotage, tug requirements</li>
              <li><strong>Yerel Mevzuat:</strong> Port regulations, customs, immigration, health clearance</li>
              <li><strong>PSC (Port State Control):</strong> Inspection checklist, deficiencies, detention, NIL deficiency</li>
              <li><strong>Formaliteler:</strong> Arrival notice, SOF (Statement of Facts), NOR (Notice of Readiness)</li>
              <li><strong>Ücretler:</strong> Port dues, pilotage, towage, mooring, waste disposal</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 28. Özel Seyrüsefer */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('special-nav')} className="cursor-pointer" aria-expanded={isOpen('special-nav')}>
            <CardTitle id="special-nav" className="scroll-mt-24 flex items-center justify-between">
              Özel Seyrüsefer Durumları
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('special-nav') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('special-nav') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Dar Kanal:</strong> COLREG Rule 9, overtaking restrictions, traffic separation</li>
              <li><strong>Sığ Su:</strong> Squat effect, UKC management, speed reduction, bottom interaction</li>
              <li><strong>Buz:</strong> Ice navigation, ice classes, icebreaker assistance, hull damage risks</li>
              <li><strong>Sis ve Kısıtlı Görüş:</strong> Sound signals, radar navigation, safe speed, lookout</li>
              <li><strong>Özel Bölgeler:</strong> TSS (Traffic Separation Scheme), restricted areas, anchorage zones</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 29. Sörvey */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('surveys')} className="cursor-pointer" aria-expanded={isOpen('surveys')}>
            <CardTitle id="surveys" className="scroll-mt-24 flex items-center justify-between">
              Sörvey, Klas ve Muayeneler
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('surveys') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('surveys') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Klas Sörveyleri:</strong> Annual, intermediate, special, docking, renewal surveys</li>
              <li><strong>Bayrak Devleti:</strong> Flag state inspections, ISM/ISPS audits, statutory certificates</li>
              <li><strong>Tonaj:</strong> Gross tonnage (GT), net tonnage (NT), deadweight (DWT), displacement</li>
              <li><strong>Sertifikalar:</strong> Class certificate, IOPP, Safety Equipment, Load Line, PSPC</li>
              <li><strong>Hazırlık:</strong> Survey checklist, deficiency rectification, documentation readiness</li>
            </ul>
          </CardContent>
          )}
        </Card>

        {/* 30. Enerji Verimliliği */}
        <Card className="shadow">
          <CardHeader onClick={() => toggle('efficiency')} className="cursor-pointer" aria-expanded={isOpen('efficiency')}>
            <CardTitle id="efficiency" className="scroll-mt-24 flex items-center justify-between">
              Enerji Verimliliği ve Çevresel Yönetim
              <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen('efficiency') ? "rotate-180" : "")} />
            </CardTitle>
          </CardHeader>
          {isOpen('efficiency') && (
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>SEEMP:</strong> Ship Energy Efficiency Management Plan, fuel consumption monitoring</li>
              <li><strong>EEXI:</strong> Energy Efficiency Existing Ship Index, technical/operational measures</li>
              <li><strong>CII:</strong> Carbon Intensity Indicator (A/B/C/D/E rating), annual improvement</li>
              <li><strong>Optimizasyon:</strong> Weather routing, trim/ballast optimization, speed optimization</li>
              <li><strong>Alternatif Yakıtlar:</strong> LNG, methanol, ammonia, hydrogen; green shipping initiatives</li>
            </ul>
          </CardContent>
          )}
        </Card>

        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">Sürüm: v2.0 • 30 kapsamlı gemicilik konusu eklendi.</div>
          <Button asChild variant="default" className="gap-2">
            <a href="#terminology">
              Başa Dön
            </a>
          </Button>
        </div>

        <Separator />
      </div>
    </MobileLayout>
  );
}
