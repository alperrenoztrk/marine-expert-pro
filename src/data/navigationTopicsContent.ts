export interface NavigationTopicPage {
  title: string;
  summary: string;
  bullets: string[];
  imageSrc: string;
  imageAlt: string;
  motionCue?: string;
  references?: string[];
  updatedAt?: string;
}

export interface NavigationTopicSection {
  id: string;
  title: string;
  pages: NavigationTopicPage[];
  calculationLinks?: Array<{ title: string; href: string }>;
}

const buildPages = (
  baseSlug: string,
  entries: Array<{ title: string; summary: string; bullets: string[]; imageAlt: string }>
): NavigationTopicPage[] =>
  entries.map((entry, index) => ({
    ...entry,
    imageSrc: `/images/lessons/navigation/${baseSlug}-${index + 1}.jpg`,
    references: ["IMO Model Course 7.03", "Admiralty Nautical Publications", "IALA Maritime Buoyage System"],
    updatedAt: "2025-01-15",
  }));

export const navigationTopicsContent: NavigationTopicSection[] = [
  {
    id: "rota-hesaplamalari",
    title: "Rota Hesaplamaları",
    pages: buildPages("rota-hesaplamalari", [
      {
        title: "1. Temel Kavramlar",
        summary: "Rota hesaplaması, seyir planının omurgasıdır ve rota tipinin seçimiyle başlar.",
        bullets: [
          "Büyük daire ve loxodromik rotanın kullanım yerlerini ayırt et.",
          "Rota başlangıç/bitiş noktalarını ve kıyı kısıtlarını netleştir.",
          "Rota değişiklik noktalarını (WP) operasyonel ihtiyaçlara göre belirle.",
        ],
        imageAlt: "Rota planlamada büyük daire ve loxodromik seçim şeması",
        motionCue: "Rota çizgisinde sabit kerterizden büyük daireye geçişi yumuşak çizgi animasyonuyla göster.",
      },
      {
        title: "2. Hesaplama Akışı",
        summary: "Rota planı, harita üzerindeki mesafe ve yön bilgileriyle doğrulanır.",
        bullets: [
          "Mercator haritada kerteriz ve mesafe ölçüm adımlarını uygula.",
          "Harita ölçeğine göre mesafe dönüşümlerini kontrol et.",
          "Rota üstü kritik noktalar için emniyetli mesafe tanımla.",
        ],
        imageAlt: "Rota ölçüm adımlarını gösteren çalışma şeması",
        motionCue: "Harita üzerinde ölçüm adımlarını sırayla vurgulayan mikro animasyon kullan.",
      },
      {
        title: "3. Uygulama ve Kontroller",
        summary: "Rota hesapları, seyir öncesi ve seyir sırasında düzenli kontrol ister.",
        bullets: [
          "Rota güncellemelerini yayın ve uyarılarla eşleştir.",
          "Rota üstü hız/ETA kontrol noktaları oluştur.",
          "Köprüüstü ekibiyle rota teyit prosedürü uygula.",
        ],
        imageAlt: "Rota teyit kontrol noktaları",
        motionCue: "Kontrol noktalarını ışık darbesiyle sırayla işaretle.",
      },
      {
        title: "4. Hata Kaynakları",
        summary: "Ölçek, yayın güncelliği ve insan hatası rota hesaplarını etkiler.",
        bullets: [
          "Harita güncelliği ve yayın doğrulama adımlarını atlama.",
          "Rota çizgilerinde deviasyon ve gyro hatalarını hesaba kat.",
          "Tek bir kaynağa bağlı kalmadan çapraz kontrol yap.",
        ],
        imageAlt: "Rota hatası kaynakları kontrol listesi",
        motionCue: "Hata kartlarını hafif salınım animasyonuyla sırayla göster.",
      },
    ]),
    calculationLinks: [
      { title: "Seyir Hesaplamaları", href: "/navigation" },
      { title: "Seyir Formülleri", href: "/navigation/formulas" },
    ],
  },
  {
    id: "seyir-temelleri",
    title: "Seyir Temelleri",
    pages: buildPages("seyir-temelleri", [
      {
        title: "1. Seyre Hazırlık",
        summary: "Seyre hazırlık; emniyet, yayın, ekipman ve plan kontrolünün bütünüdür.",
        bullets: [
          "Köprüüstü cihazlarının çalışma durumunu doğrula.",
          "Seyir planını ve riskleri ekip ile paylaş.",
          "Seyir izinleri ve liman prosedürlerini gözden geçir.",
        ],
        imageAlt: "Seyre hazırlık kontrol akışı",
        motionCue: "Kontrol akışını adım adım ilerleyen çizgi animasyonuyla göster.",
      },
      {
        title: "2. Planlama-İcra-İzleme",
        summary: "Seyir döngüsü; planlama, uygulama ve sürekli izlemeyi içerir.",
        bullets: [
          "Planlanan rota ve gerçek seyri düzenli karşılaştır.",
          "Hız, akıntı ve hava koşullarına göre planı güncelle.",
          "Seyir raporlarını ve kayıtlarını güncel tut.",
        ],
        imageAlt: "Planlama-icra-izleme döngüsü",
        motionCue: "Döngü oklarını 120ms aralıkla döndürerek hareket hissi ver.",
      },
      {
        title: "3. Temel Seyir Hesapları",
        summary: "D/T/V ilişkisi, ETA ve kalan mesafe hesaplarının temelidir.",
        bullets: [
          "Hız değişimlerinin ETA etkisini düzenli değerlendir.",
          "Rotada kalan mesafeyi güncel tut.",
          "Durum değişikliklerini rapora yansıt.",
        ],
        imageAlt: "D-T-V ilişkisini gösteren basit şema",
        motionCue: "D-T-V üçgeninde değerleri sırayla parlat.",
      },
      {
        title: "4. Emniyetli Seyir İlkeleri",
        summary: "Emniyetli seyir, öngörü ve disiplinli izlemeyi gerektirir.",
        bullets: [
          "Emniyetli hız ilkesini ortam koşullarına göre uygula.",
          "Gözcülük ve vardiya düzenini aksatma.",
          "Riskli bölgelerde ek kontrol listeleri kullan.",
        ],
        imageAlt: "Emniyetli seyir ilkeleri özeti",
        motionCue: "Özet kartlarını dikey slide-in animasyonuyla sırala.",
      },
    ]),
    calculationLinks: [{ title: "Seyir Hesaplamaları", href: "/navigation" }],
  },
  {
    id: "mercator-loxodromik-seyir",
    title: "Mercator & Loxodromik Seyir",
    pages: buildPages("mercator-loxodromik-seyir", [
      {
        title: "1. Mercator Harita Mantığı",
        summary: "Mercator projeksiyonu, sabit kerterizli rotaları düz çizgi gösterir.",
        bullets: [
          "Paraleller arası mesafe enleme göre değişir.",
          "Sabit rota (loxodrom) çizimi kolaylaşır.",
          "Yüksek enlemlerde distorsiyon artar.",
        ],
        imageAlt: "Mercator projeksiyonunda distorsiyon şeması",
        motionCue: "Distorsiyon alanlarını dalga etkisiyle belirginleştir.",
      },
      {
        title: "2. Loxodromik Rota",
        summary: "Loxodromik rota, sabit kerterizle seyir sağlar.",
        bullets: [
          "Sabit pusula ile seyir için uygundur.",
          "Uzun mesafelerde büyük daireye göre daha uzundur.",
          "Kısa mesafe ve kıyı seyrinde yaygındır.",
        ],
        imageAlt: "Loxodromik rota çizimi",
        motionCue: "Rota çizgisini soldan sağa çizim animasyonuyla göster.",
      },
      {
        title: "3. Hesaplama Adımları",
        summary: "Loxodromik rota hesaplarında temel parametreleri netleştir.",
        bullets: [
          "Enlem/boylam farklarını hesapla.",
          "Ortalama enlemi kullanarak mesafe çıkar.",
          "Rota üzeri kerteriz değişimlerini kontrol et.",
        ],
        imageAlt: "Loxodromik hesap akışı",
        motionCue: "Akış kutularını sırayla aydınlatan geçiş animasyonu kullan.",
      },
      {
        title: "4. Uygulama Notları",
        summary: "Harita, pusula ve elektronik sistemler arasında doğrulama yapılır.",
        bullets: [
          "Gyro ve manyetik pusula farkını hesaba kat.",
          "ECDIS ve kağıt harita çapraz kontrol uygula.",
          "Yüksek enlemde düzeltme hassasiyetini artır.",
        ],
        imageAlt: "Mercator-ECIDS karşılaştırma kontrolü",
        motionCue: "Karşılaştırma kartlarını çapraz fade ile göster.",
      },
    ]),
    calculationLinks: [{ title: "Seyir Formülleri", href: "/navigation/formulas" }],
  },
  {
    id: "buyuk-daire-seyri",
    title: "Büyük Daire Seyri",
    pages: buildPages("buyuk-daire-seyri", [
      {
        title: "1. Temel Tanım",
        summary: "Büyük daire rotası, küre üzerinde en kısa mesafeyi sağlar.",
        bullets: [
          "Küresel mesafelerde yakıt ve zaman avantajı sağlar.",
          "Haritada kıvrımlı görünür; WP’lerle uygulanır.",
          "Yüksek enlemlere yaklaşırken dikkat gerektirir.",
        ],
        imageAlt: "Büyük daire ve loxodromik rota kıyaslaması",
        motionCue: "İki rotayı sırayla vurgulayan renk geçiş animasyonu uygula.",
      },
      {
        title: "2. Rota Planlama",
        summary: "Büyük daire rotası, dönüm noktalarıyla pratik hale getirilir.",
        bullets: [
          "WP’ler arasındaki rota doğrultularını belirle.",
          "Enlem kısıtları ve güvenli mesafeleri uygula.",
          "Hava/deniz durumuna göre alternatif plan hazırla.",
        ],
        imageAlt: "Büyük daire WP planı",
        motionCue: "WP noktalarını ping animasyonuyla öne çıkar.",
      },
      {
        title: "3. Hesaplama ve İzleme",
        summary: "Rota boyunca kerteriz değişimi düzenli takip edilir.",
        bullets: [
          "Kerteriz değişimini seyir kayıtlarına işle.",
          "GPS/ECDIS üzerinden rota uyumunu izle.",
          "Sapan durumlarda düzeltme prosedürü uygula.",
        ],
        imageAlt: "Büyük daire izleme şeması",
        motionCue: "Rota üzerindeki mevcut konumu küçük bir parıltıyla ilerlet.",
      },
      {
        title: "4. Riskler ve Sınırlar",
        summary: "Büyük daire rotası çevresel kısıtlar nedeniyle sınırlandırılabilir.",
        bullets: [
          "Buzlu bölgeler ve kısıtlı sular için limit belirle.",
          "Yayın uyarılarını rota revizyonuna dahil et.",
          "Pilotaj gerektiren alanlarda loxodromik tercih edilebilir.",
        ],
        imageAlt: "Büyük daire risk bölgeleri",
        motionCue: "Risk bölgelerini kırmızı dalga animasyonuyla vurgula.",
      },
    ]),
    calculationLinks: [{ title: "Seyir Formülleri", href: "/navigation/formulas" }],
  },
  {
    id: "astronomik-navigasyon",
    title: "Astronomik Navigasyon",
    pages: buildPages("astronomik-navigasyon", [
      {
        title: "1. Temel İlkeler",
        summary: "Göksel seyir, gök cisimleriyle mevki belirleme yöntemidir.",
        bullets: [
          "Sextant ölçümü ve zaman doğruluğu kritiktir.",
          "Gözlemler hata düzeltmeleriyle kullanılır.",
          "Bulutluluk ve ufuk görünürlüğü gözlem kalitesini etkiler.",
        ],
        imageAlt: "Sextant gözlem süreci",
        motionCue: "Sextant açı ölçümünü hafif dönme animasyonuyla göster.",
      },
      {
        title: "2. Ölçüm ve Düzeltmeler",
        summary: "Gözlemler; index, dip ve atmosfer düzeltmeleriyle işlenir.",
        bullets: [
          "Index hatasını düzenli kontrol et.",
          "Dip düzeltmesini gözlem yüksekliğine göre uygula.",
          "Almanak verilerini güncel kullan.",
        ],
        imageAlt: "Astronomik düzeltme adımları",
        motionCue: "Düzeltme adımlarını sırayla highlight et.",
      },
      {
        title: "3. Mevki Bulma",
        summary: "Line of position (LOP) kesişimiyle mevki belirlenir.",
        bullets: [
          "En az iki LOP ile güvenli mevki tespiti yap.",
          "Dead reckoning konumunu referans al.",
          "Zaman hatasını minimize etmek için kronometre kullan.",
        ],
        imageAlt: "LOP kesişimi şeması",
        motionCue: "LOP çizgilerini üst üste bindiren fade animasyonu kullan.",
      },
      {
        title: "4. Operasyonel Kullanım",
        summary: "Göksel seyir, elektronik sistem arızalarında yedek yöntemdir.",
        bullets: [
          "GNSS arızasında göksel mevki prosedürü hazırla.",
          "Eğitim ve pratik gözlem rutinleri oluştur.",
          "Sonuçları harita ve ECDIS ile karşılaştır.",
        ],
        imageAlt: "Göksel seyir yedek kullanım akışı",
        motionCue: "Yedek yöntem akışını sağdan sola geçişle vurgula.",
      },
    ]),
    calculationLinks: [{ title: "Seyir Formülleri", href: "/navigation/formulas" }],
  },
  {
    id: "gelgit-hesaplari",
    title: "Gelgit Hesapları",
    pages: buildPages("gelgit-hesaplari", [
      {
        title: "1. Gelgit Temelleri",
        summary: "Gelgit; güneş ve ayın çekim etkileriyle oluşan su seviyesi değişimidir.",
        bullets: [
          "Spring ve neap dönemlerini ayırt et.",
          "Referans liman kavramını kullan.",
          "Yerel şartların gecikme yaratabileceğini unutma.",
        ],
        imageAlt: "Gelgit döngüsü şeması",
        motionCue: "Gelgit eğrisini dalgalanan çizgi animasyonuyla göster.",
      },
      {
        title: "2. Tablo Okuma",
        summary: "Gelgit tabloları, belirli liman için yükselme/alçalma saatlerini verir.",
        bullets: [
          "HW/LW saatlerini doğru yorumla.",
          "Zaman dilimi ve yaz saati düzeltmelerini kontrol et.",
          "Günlük sapma faktörlerini uygula.",
        ],
        imageAlt: "Gelgit tablosu okuma örneği",
        motionCue: "Tablodaki satırları sırayla vurgu rengiyle göster.",
      },
      {
        title: "3. Ara Yükseklik",
        summary: "Ara saatlerde su yüksekliği interpolasyonla hesaplanır.",
        bullets: [
          "Rule of Twelfths gibi yöntemleri uygula.",
          "Akıntı etkisini ayrıca değerlendir.",
          "Seyir planına geçiş saatlerini işle.",
        ],
        imageAlt: "Ara yükseklik hesap şeması",
        motionCue: "Ara noktaları ölçen çizgi animasyonu kullan.",
      },
      {
        title: "4. Operasyonel Etki",
        summary: "Gelgit, draft, UKC ve liman giriş zamanlamasını etkiler.",
        bullets: [
          "Emniyetli draft limitlerini gelgit ile değerlendir.",
          "Gelgit akıntısını rota planına dahil et.",
          "Gelgit hatalarına karşı emniyet payı bırak.",
        ],
        imageAlt: "Gelgitin operasyonlara etkisi",
        motionCue: "Operasyon simgelerini dalga hareketiyle hafifçe titreştir.",
      },
    ]),
    calculationLinks: [{ title: "Seyir Hesaplamaları", href: "/navigation" }],
  },
  {
    id: "akinti-ruzgar-duzeltmeleri",
    title: "Akıntı & Rüzgâr Düzeltmeleri",
    pages: buildPages("akinti-ruzgar-duzeltmeleri", [
      {
        title: "1. Set ve Drift",
        summary: "Akıntı etkisi, set (yön) ve drift (hız) olarak ifade edilir.",
        bullets: [
          "Gerçek rota ile planlanan rota arasındaki farkı izle.",
          "Akıntı verilerini güncel yayınlardan takip et.",
          "Set/drift verisini seyir defterine kaydet.",
        ],
        imageAlt: "Set ve drift vektör şeması",
        motionCue: "Vektör oklarını sırayla büyütüp küçülterek vurgula.",
      },
      {
        title: "2. Rüzgâr Düzeltmesi",
        summary: "Leeway, rüzgârın gemiyi yanal sürüklemesidir.",
        bullets: [
          "Leeway açılarını gemi tipi ve rüzgâr şiddetine göre değerlendir.",
          "Kısa aralıklarla rota düzeltmesi yap.",
          "Rüzgâr etkisini radar ve GPS ile doğrula.",
        ],
        imageAlt: "Leeway etkisini gösteren rota çizimi",
        motionCue: "Leeway sapmasını küçük dalga animasyonuyla göster.",
      },
      {
        title: "3. Hesaplama ve Uygulama",
        summary: "Akıntı ve rüzgâr düzeltmeleri, gerçek rotayı hedef rotaya çeker.",
        bullets: [
          "Set/drift vektörlerini hız vektörüyle birleştir.",
          "Düzeltme sonrası yeni kerterizi uygula.",
          "Günlük meteoroloji raporlarıyla güncelle.",
        ],
        imageAlt: "Düzeltme vektör diyagramı",
        motionCue: "Vektör toplamını birleşme animasyonuyla sun.",
      },
      {
        title: "4. Hata Yönetimi",
        summary: "Akıntı değişkenliği, büyük rota sapmalarına yol açabilir.",
        bullets: [
          "Akıntı değişimini erken tespit için referans noktaları kullan.",
          "Rota sapma limitleri belirle ve alarm oluştur.",
          "Kıyı yakınında daha sık düzeltme uygula.",
        ],
        imageAlt: "Akıntı hatası kontrol listesi",
        motionCue: "Kontrol maddelerini sırayla onay animasyonuyla göster.",
      },
    ]),
    calculationLinks: [{ title: "Seyir Hesaplamaları", href: "/navigation" }],
  },
  {
    id: "gelgit-derinlik-emniyeti",
    title: "Gelgit & Derinlik Emniyeti",
    pages: buildPages("gelgit-derinlik-emniyeti", [
      {
        title: "1. UKC Kavramı",
        summary: "Under Keel Clearance (UKC), emniyetli seyir için kritik bir değerdir.",
        bullets: [
          "UKC limitlerini şirket prosedürüne göre belirle.",
          "Güncel draft ve gelgit değerlerini kullan.",
          "Manevra sırasında UKC düşebilir.",
        ],
        imageAlt: "UKC kavramını gösteren şema",
        motionCue: "UKC mesafesini yukarı-aşağı dalga animasyonuyla vurgula.",
      },
      {
        title: "2. Squat ve Sığ Su Etkisi",
        summary: "Squat, geminin sığ sularda batmasını artıran etkidir.",
        bullets: [
          "Hız arttıkça squat artar.",
          "Dar kanalda squat etkisi daha büyüktür.",
          "Sığ su alarm limitleri belirle.",
        ],
        imageAlt: "Squat etkisi diyagramı",
        motionCue: "Gemi gövdesini aşağı çekilen animasyonla göster.",
      },
      {
        title: "3. Gelgit Planlama",
        summary: "Gelgit yüksekliği, derinlik emniyetini destekler.",
        bullets: [
          "Geçiş zamanını uygun gelgit saatine planla.",
          "Ara yükseklik hesaplarını rota planına ekle.",
          "Derinlik verilerini güncel yayınlarla doğrula.",
        ],
        imageAlt: "Gelgit ile derinlik planı",
        motionCue: "Gelgit çizgisini saat yönünde akıcı animasyonla göster.",
      },
      {
        title: "4. Uygulama Kontrolleri",
        summary: "Kısıtlı sularda sürekli derinlik izleme yapılmalıdır.",
        bullets: [
          "Echo sounder verilerini düzenli kontrol et.",
          "Kıyı mesafelerini emniyet limitleriyle karşılaştır.",
          "Pilot ve köprüüstü ekip koordinasyonunu güçlendir.",
        ],
        imageAlt: "Derinlik emniyeti kontrol listesi",
        motionCue: "Kontrol kutularını sırayla highlight et.",
      },
    ]),
    calculationLinks: [{ title: "Seyir Hesaplamaları", href: "/navigation" }],
  },
  {
    id: "radar-navigasyonu",
    title: "Radar Navigasyonu",
    pages: buildPages("radar-navigasyonu", [
      {
        title: "1. Radar Temelleri",
        summary: "Radar, çevre hedeflerini tespit ederek seyir emniyetini artırır.",
        bullets: [
          "Gain, sea clutter ve rain clutter ayarlarını bil.",
          "Radar kör noktalarını fark et.",
          "Doğru menzil ölçeğini seç.",
        ],
        imageAlt: "Radar ayarları ve hedef tespiti",
        motionCue: "Radar sweep efektini dairesel hafif animasyonla göster.",
      },
      {
        title: "2. ARPA Fonksiyonları",
        summary: "ARPA, hedeflerin hareketini otomatik takip eder.",
        bullets: [
          "CPA/TCPA bilgilerini düzenli kontrol et.",
          "Hedef bilgilerini görsel gözlemle doğrula.",
          "ARPA güncelleme gecikmesini hesaba kat.",
        ],
        imageAlt: "ARPA takip örneği",
        motionCue: "Hedef izlerini kısa aralıklarla yanıp sönen iz efektiyle göster.",
      },
      {
        title: "3. Radar Plotting",
        summary: "Manuel plotting, radar kullanımında temel yetkinliktir.",
        bullets: [
          "Plotting kâğıdında hedef hareketini izle.",
          "Relatif ve gerçek hareketi ayırt et.",
          "Plotting hatalarını azaltmak için sabit aralık kullan.",
        ],
        imageAlt: "Radar plotting şeması",
        motionCue: "Plotting noktalarını adım adım birleştir.",
      },
      {
        title: "4. Emniyetli Kullanım",
        summary: "Radar tek başına yeterli değildir; diğer kaynaklarla desteklenmelidir.",
        bullets: [
          "Görsel gözcülüğü kesintisiz sürdür.",
          "Radar ve AIS verilerini çapraz kontrol et.",
          "Kısıtlı görüşte COLREG kurallarını uygula.",
        ],
        imageAlt: "Radar emniyet kullanım kontrolü",
        motionCue: "Kontrol listesi başlıklarını kısa fade ile sırala.",
      },
    ]),
    calculationLinks: [{ title: "Seyir Hesaplamaları", href: "/navigation" }],
  },
  {
    id: "ecdis",
    title: "ECDIS",
    pages: buildPages("ecdis", [
      {
        title: "1. ECDIS Rolü",
        summary: "ECDIS, elektronik seyir haritası ve bilgi sistemidir.",
        bullets: [
          "ENC veri kalitesini ve güncelliğini kontrol et.",
          "Görsel katmanları amaçla uyumlu aç/kapat.",
          "Alarmların doğruluğunu test et.",
        ],
        imageAlt: "ECDIS katman yönetimi",
        motionCue: "Katmanları sırayla aç/kapat animasyonu ile göster.",
      },
      {
        title: "2. Rota Yönetimi",
        summary: "ECDIS rota planlama ve izleme için merkezi araçtır.",
        bullets: [
          "Rota planını WP doğrulamasıyla kaydet.",
          "Cross track limitlerini belirle.",
          "Güvenli derinlik ve safety contour ayarlarını yap.",
        ],
        imageAlt: "ECDIS rota planı",
        motionCue: "Rota çizgisini çizim animasyonuyla sun.",
      },
      {
        title: "3. Alarm ve Uyarılar",
        summary: "ECDIS alarmları, güvenlik sınırları aşıldığında devreye girer.",
        bullets: [
          "Alarmları operasyonel gereksinime göre yapılandır.",
          "Alarmları göz ardı etme; sebebini doğrula.",
          "Alarm testlerini sefer öncesi yap.",
        ],
        imageAlt: "ECDIS alarm örnekleri",
        motionCue: "Alarm ikonlarını yumuşak pulse animasyonuyla vurgula.",
      },
      {
        title: "4. Operasyonel Hatalar",
        summary: "Yanlış ayarlar, ECDIS kullanımında büyük risk yaratır.",
        bullets: [
          "Güvenli derinlik ayarını yanlış girmeden kaçın.",
          "ENC güncellemesini düzenli uygula.",
          "Harita ölçek değişimlerini dikkatle yönet.",
        ],
        imageAlt: "ECDIS hata önleme kontrol listesi",
        motionCue: "Hata kartlarını yatay kaydırma animasyonuyla sırala.",
      },
    ]),
    calculationLinks: [{ title: "Seyir Hesaplamaları", href: "/navigation" }],
  },
  {
    id: "gps-gnss",
    title: "GPS ve GNSS",
    pages: buildPages("gps-gnss", [
      {
        title: "1. GNSS Temelleri",
        summary: "GNSS, uydu tabanlı konumlama sistemlerinin genel adıdır.",
        bullets: [
          "GPS, GLONASS, Galileo gibi sistemleri ayırt et.",
          "DOP değerleri konum doğruluğunu etkiler.",
          "Anten konumu ölçüm hassasiyetini etkiler.",
        ],
        imageAlt: "GNSS sistemleri şeması",
        motionCue: "Uydu ikonlarını dairesel yörüngede hareket ettir.",
      },
      {
        title: "2. Hata Kaynakları",
        summary: "GNSS sinyalleri atmosferik ve teknik etkilere açıktır.",
        bullets: [
          "Multipath etkisini azaltacak anten konumu seç.",
          "Uydu görünürlüğünü düzenli takip et.",
          "Farklı sensörlerle çapraz kontrol yap.",
        ],
        imageAlt: "GNSS hata kaynakları",
        motionCue: "Hata kaynaklarını sırayla kırmızı vurguyla göster.",
      },
      {
        title: "3. Operasyonel Kullanım",
        summary: "GNSS, ECDIS ve radar ile birlikte kullanılmalıdır.",
        bullets: [
          "GNSS verisini gyro/log ile doğrula.",
          "Konum sapmalarını erken tespit et.",
          "Günlük GNSS kontrol kayıtları oluştur.",
        ],
        imageAlt: "GNSS operasyonel kullanım akışı",
        motionCue: "Akış oklarını ileri yönlü animasyonla hareket ettir.",
      },
      {
        title: "4. Yedekleme",
        summary: "GNSS arızasında alternatif mevki yöntemleri hazır olmalıdır.",
        bullets: [
          "Kıyı seyri için görsel mevki yöntemlerini bil.",
          "Göksel seyir gibi yedek metotları destekle.",
          "GNSS alarm limitlerini düzenli test et.",
        ],
        imageAlt: "GNSS yedekleme planı",
        motionCue: "Yedek sistem kartını sağdan içeri kaydır.",
      },
    ]),
    calculationLinks: [{ title: "Seyir Hesaplamaları", href: "/navigation" }],
  },
  {
    id: "seyir-emniyeti",
    title: "Seyir Emniyeti",
    pages: buildPages("seyir-emniyeti", [
      {
        title: "1. Risk Değerlendirme",
        summary: "Seyir öncesi risk analizi, güvenliği artırır.",
        bullets: [
          "Riskleri rota, hava ve trafik yoğunluğuna göre sınıflandır.",
          "Risk matrisi ile önlem seviyesini belirle.",
          "Risk kontrol önlemlerini planla.",
        ],
        imageAlt: "Seyir risk matrisi",
        motionCue: "Risk matrisi hücrelerini sırayla parlat.",
      },
      {
        title: "2. Emniyetli Hız",
        summary: "Emniyetli hız, COLREG gereği şarttır.",
        bullets: [
          "Görüş, trafik ve manevra kabiliyetine göre hız belirle.",
          "Kısıtlı görüşte hız düşürme prosedürü uygula.",
          "Makine durumunu ve durdurma mesafesini dikkate al.",
        ],
        imageAlt: "Emniyetli hız değerlendirme",
        motionCue: "Hız barını yumuşak yükselen animasyonla göster.",
      },
      {
        title: "3. Emniyetli Mesafe",
        summary: "Emniyetli mesafe, kıyı ve tehlikelere yaklaşımı sınırlar.",
        bullets: [
          "Kıyıdan emniyetli mesafe limitlerini belirle.",
          "Trafik yoğun bölgelerde CPA limitlerini yükselt.",
          "Emniyetli mesafeyi ECDIS alarmıyla destekle.",
        ],
        imageAlt: "Emniyetli mesafe kontrolü",
        motionCue: "Mesafe halkalarını genişleyip daralan animasyonla sun.",
      },
      {
        title: "4. Kriz Yönetimi",
        summary: "Kriz yönetimi, hızlı karar ve koordinasyon gerektirir.",
        bullets: [
          "Bridge team iletişimini net tut.",
          "Acil durum görev paylaşımını önceden belirle.",
          "Olay raporlamasını eksiksiz yap.",
        ],
        imageAlt: "Seyir kriz yönetimi",
        motionCue: "Acil durum kartlarını kısa titreşim animasyonuyla vurgula.",
      },
    ]),
    calculationLinks: [{ title: "COLREG Kuralları", href: "/navigation/rules" }],
  },
  {
    id: "insan-faktoru",
    title: "İnsan Faktörü",
    pages: buildPages("insan-faktoru", [
      {
        title: "1. BRM Temelleri",
        summary: "Bridge Resource Management, ekip koordinasyonunu iyileştirir.",
        bullets: [
          "Rolleri ve sorumlulukları netleştir.",
          "Karar sürecinde açık iletişim kur.",
          "Hiyerarşi kaynaklı iletişim engellerini azalt.",
        ],
        imageAlt: "BRM iletişim şeması",
        motionCue: "İletişim oklarını sırayla parlatan animasyon kullan.",
      },
      {
        title: "2. Yorgunluk Yönetimi",
        summary: "Yorgunluk, navigasyon hatalarının başlıca nedenidir.",
        bullets: [
          "Vardiya düzenini dinlenme ihtiyacına göre planla.",
          "Uzun seyirlerde görev paylaşımını artır.",
          "Yorgunluk belirtilerini erken tanı.",
        ],
        imageAlt: "Yorgunluk belirtileri listesi",
        motionCue: "Uyarı ikonlarını sırayla görünür yap.",
      },
      {
        title: "3. Durumsal Farkındalık",
        summary: "Durumsal farkındalık, çevresel ve operasyonel bilgiyi kapsar.",
        bullets: [
          "Radar, AIS, görsel gözlem verilerini birleştir.",
          "Rota, hız ve trafik değişimlerini sürekli izle.",
          "Yanlış varsayımlardan kaçın.",
        ],
        imageAlt: "Durumsal farkındalık döngüsü",
        motionCue: "Döngü oklarını yumuşak dönüş animasyonuyla canlandır.",
      },
      {
        title: "4. Hata Yönetimi",
        summary: "Hata yönetimi, tekrar eden riskleri azaltır.",
        bullets: [
          "Near-miss kayıtlarını düzenli analiz et.",
          "Standart prosedürlere uyumu takip et.",
          "Kök neden analizi ile önlem geliştir.",
        ],
        imageAlt: "Hata yönetimi kontrol listesi",
        motionCue: "Kontrol maddelerini sırayla parlat.",
      },
    ]),
    calculationLinks: [{ title: "COLREG Kuralları", href: "/navigation/rules" }],
  },
  {
    id: "kisitli-sularda-seyir",
    title: "Kısıtlı Sularda Seyir",
    pages: buildPages("kisitli-sularda-seyir", [
      {
        title: "1. Kısıtlı Su Tanımı",
        summary: "Dar kanal, boğaz ve liman girişleri kısıtlı su kabul edilir.",
        bullets: [
          "Trafik yoğunluğu ve manevra alanını değerlendir.",
          "Sığ su ve bank effect riskini dikkate al.",
          "Pilot gerekliliğini planla.",
        ],
        imageAlt: "Kısıtlı su risk haritası",
        motionCue: "Risk bölgelerini yumuşak pulse animasyonuyla vurgula.",
      },
      {
        title: "2. Bank Effect",
        summary: "Bank effect, geminin kıyıya yaklaşmasıyla oluşan çekme-itme etkisidir.",
        bullets: [
          "Kıyıya yaklaşma açısını kontrollü tut.",
          "Hız arttıkça bank effect artar.",
          "Kıçın kıyıya çekilme etkisini hesaba kat.",
        ],
        imageAlt: "Bank effect diyagramı",
        motionCue: "Gemi kıçının yanlama etkisini dalga animasyonuyla göster.",
      },
      {
        title: "3. Trafik Yönetimi",
        summary: "Kısıtlı sularda trafik disiplinine uyum kritik önemdedir.",
        bullets: [
          "VTS talimatlarına uy.",
          "İletişim kanallarını açık tut.",
          "Öncelik kurallarını doğru uygula.",
        ],
        imageAlt: "Kısıtlı sularda trafik akışı",
        motionCue: "Trafik oklarını ardışık olarak hareket ettir.",
      },
      {
        title: "4. Emniyet Uygulamaları",
        summary: "Ek personel ve sık kontrol, riskleri azaltır.",
        bullets: [
          "Ek gözcü görevlendir.",
          "Sürat limitlerine uy.",
          "Acil manevra planını hazır tut.",
        ],
        imageAlt: "Kısıtlı sularda emniyet kontrolü",
        motionCue: "Kontrol listesi öğelerini sırayla onay animasyonuyla göster.",
      },
    ]),
    calculationLinks: [{ title: "Seyir Hesaplamaları", href: "/navigation" }],
  },
  {
    id: "kiyi-seyri",
    title: "Kıyı Seyri",
    pages: buildPages("kiyi-seyri", [
      {
        title: "1. Kıyı Referansları",
        summary: "Kıyı seyri, görsel referanslara dayanır.",
        bullets: [
          "Belirgin landmark ve deniz fenerlerini kullan.",
          "Rota üstü transit hatları belirle.",
          "Görüş düşerse alternatif yöntemlere geç.",
        ],
        imageAlt: "Kıyı referans noktaları",
        motionCue: "Landmark işaretlerini kısa parıltı animasyonuyla vurgula.",
      },
      {
        title: "2. Paralel İndeks",
        summary: "Paralel indeks, radar üzerinde kıyı mesafesini korumaya yarar.",
        bullets: [
          "Paralel indeks hatlarını doğru belirle.",
          "Rota sapmasını erken tespit et.",
          "Kritik geçişlerde kullan.",
        ],
        imageAlt: "Paralel indeks örneği",
        motionCue: "Paralel indeks çizgilerini soldan sağa kaydır.",
      },
      {
        title: "3. Geçiş Noktaları",
        summary: "Kıyı seyrinde dönüş noktaları net olmalıdır.",
        bullets: [
          "Dönüş noktalarını net işaretle.",
          "Kıyı mesafe limitlerini belirle.",
          "Görsel teyit prosedürü uygula.",
        ],
        imageAlt: "Kıyı seyrinde dönüş noktaları",
        motionCue: "Dönüş noktalarını ping animasyonuyla öne çıkar.",
      },
      {
        title: "4. Hata Önleme",
        summary: "Görsel hatalar ve yanlış tanımlamalar risk yaratır.",
        bullets: [
          "Landmark doğrulamasını çift kontrol et.",
          "Görüş koşullarını sürekli takip et.",
          "Radar ve ECDIS verisini destek olarak kullan.",
        ],
        imageAlt: "Kıyı seyri hata önleme",
        motionCue: "Hata kartlarını yumuşak shake animasyonuyla göster.",
      },
    ]),
    calculationLinks: [{ title: "Seyir Hesaplamaları", href: "/navigation" }],
  },
  {
    id: "harita-isaretleri",
    title: "Harita İşaretleri",
    pages: buildPages("harita-isaretleri", [
      {
        title: "1. IALA Sistemi",
        summary: "IALA şamandıra sistemi, denizcilik işaretlerinin temelidir.",
        bullets: [
          "IALA A ve B bölgelerini ayırt et.",
          "Yan şamandıraların renk ve şekil anlamlarını öğren.",
          "Giriş/çıkış yönüne göre yorumla.",
        ],
        imageAlt: "IALA şamandıra sistemi",
        motionCue: "Şamandıra ikonlarını yavaşça sallayan animasyon kullan.",
      },
      {
        title: "2. Tehlike İşaretleri",
        summary: "İzole tehlike, emniyetli su ve özel işaretler ayırt edilmelidir.",
        bullets: [
          "İzole tehlike şamandırasını doğru tanı.",
          "Emniyetli su işaretini giriş/rota için kullan.",
          "Özel işaretlerin yerel anlamlarını kontrol et.",
        ],
        imageAlt: "Tehlike ve özel işaretler",
        motionCue: "Tehlike işaretlerini kırmızı puls efektiyle göster.",
      },
      {
        title: "3. ENC Sembolleri",
        summary: "ENC sembolleri, elektronik harita üzerinde kritik bilgi sağlar.",
        bullets: [
          "Sığlık ve batık sembollerini doğru yorumla.",
          "Sembol açıklamalarını ECDIS üzerinden incele.",
          "Sembol filtrasyonu risk yaratabilir.",
        ],
        imageAlt: "ENC sembolleri örneği",
        motionCue: "Sembol kartlarını sırayla soluklaşan geçişle göster.",
      },
      {
        title: "4. Uygulama Notları",
        summary: "Harita işaretlerinin yanlış okunması kaza riski yaratır.",
        bullets: [
          "Görsel işaretleri radar ve ECDIS ile doğrula.",
          "Gece ve gündüz işaret farklarını bil.",
          "Şamandıra sürüklenmesi olasılığına dikkat et.",
        ],
        imageAlt: "Harita işaretleri uygulama notları",
        motionCue: "Not kartlarını yukarıdan aşağıya akışla sırala.",
      },
    ]),
    calculationLinks: [{ title: "Seyir Formülleri", href: "/navigation/formulas" }],
  },
  {
    id: "pilotaj",
    title: "Pilotaj",
    pages: buildPages("pilotaj", [
      {
        title: "1. Pilotaj Hazırlığı",
        summary: "Pilotaj, kısıtlı sularda emniyetli geçiş için kritik destek sağlar.",
        bullets: [
          "Pilot istasyon bilgilerini önceden hazırla.",
          "Pilot brifingini standart forma göre yap.",
          "Pilot alma/indirme risklerini değerlendir.",
        ],
        imageAlt: "Pilotaj hazırlık akışı",
        motionCue: "Hazırlık adımlarını sırayla vurgula.",
      },
      {
        title: "2. Pilot-Brifing",
        summary: "Pilot ve köprüüstü ekip iletişimi net olmalıdır.",
        bullets: [
          "Gemi manevra kabiliyetlerini açıkça paylaş.",
          "Planlanan rota ve hızları doğrula.",
          "Acil durum senaryolarını gözden geçir.",
        ],
        imageAlt: "Pilot brifing kontrol listesi",
        motionCue: "Brifing kartlarını kısa fade ile sırala.",
      },
      {
        title: "3. Liman Giriş-Çıkış",
        summary: "Liman manevraları, hız ve mesafe kontrolü gerektirir.",
        bullets: [
          "Tug gerekliliklerini planla.",
          "Römorkör manevra planını teyit et.",
          "Hız limitlerine uy.",
        ],
        imageAlt: "Liman giriş-çıkış planı",
        motionCue: "Giriş-çıkış oklarını animasyonla hareket ettir.",
      },
      {
        title: "4. İş Birliği",
        summary: "Pilot, kaptan ve köprüüstü ekip birlikte karar alır.",
        bullets: [
          "Pilot önerilerini doğrulayıcı kontrolle uygula.",
          "Kritik manevralarda açık iletişim sürdür.",
          "Pilotaj sonrası kayıtları tamamla.",
        ],
        imageAlt: "Pilotaj iş birliği şeması",
        motionCue: "İletişim bağlantılarını parıltı animasyonuyla göster.",
      },
    ]),
    calculationLinks: [{ title: "Seyir Hesaplamaları", href: "/navigation" }],
  },
  {
    id: "seyir-plani-denetimi",
    title: "Seyir Planı Denetimi",
    pages: buildPages("seyir-plani-denetimi", [
      {
        title: "1. Denetim Kapsamı",
        summary: "Passage plan denetimi, planın eksiksiz ve güncel olduğunu doğrular.",
        bullets: [
          "Rota, yayın ve risk belgelerini kontrol et.",
          "WP doğruluğunu ve koordinatları teyit et.",
          "Güvenlik ayarlarını gözden geçir.",
        ],
        imageAlt: "Seyir planı denetim kapsamı",
        motionCue: "Denetim kutularını sırayla vurgula.",
      },
      {
        title: "2. PSC/Flag Beklentileri",
        summary: "Denetimlerde genellikle dokümantasyon ve plan bütünlüğü aranır.",
        bullets: [
          "Rota planının imzalı ve onaylı olmasını sağla.",
          "Risk değerlendirme kayıtlarını sakla.",
          "Önceki sefer notlarını ekle.",
        ],
        imageAlt: "PSC denetim kontrol listesi",
        motionCue: "Denetim maddelerini adım adım parlat.",
      },
      {
        title: "3. Operasyonel Uyum",
        summary: "Plan ile fiili seyir uyumu düzenli kontrol edilir.",
        bullets: [
          "Plan dışı sapmaları gerekçelendir.",
          "Kritik noktaların geçiş zamanlarını kaydet.",
          "Plan güncellemelerini kayıt altına al.",
        ],
        imageAlt: "Plan-fiili uyum şeması",
        motionCue: "Plan ve fiili çizgilerini üst üste bindirerek göster.",
      },
      {
        title: "4. Eksiklerin Önlenmesi",
        summary: "Standart check-list kullanımı hataları azaltır.",
        bullets: [
          "Önceden hazırlanmış kontrol listelerini uygula.",
          "Plan değişikliklerini ekip ile paylaş.",
          "Denetim sonrası aksiyonları takip et.",
        ],
        imageAlt: "Plan denetimi hata önleme",
        motionCue: "Hata önleme ikonlarını pulse animasyonla vurgula.",
      },
    ]),
    calculationLinks: [{ title: "Seyir Hesaplamaları", href: "/navigation" }],
  },
  {
    id: "agir-hava-seyri",
    title: "Ağır Hava Seyri",
    pages: buildPages("agir-hava-seyri", [
      {
        title: "1. Hava Analizi",
        summary: "Ağır havada rota ve hız kararı meteoroloji verilerine dayanır.",
        bullets: [
          "Synoptik harita ve forecast raporlarını incele.",
          "Dalga yönü ve periyodunu değerlendir.",
          "Fırtına merkezine olan mesafeyi hesapla.",
        ],
        imageAlt: "Ağır hava analiz şeması",
        motionCue: "Fırtına ikonlarını dalga animasyonuyla canlandır.",
      },
      {
        title: "2. Rota ve Hız Ayarı",
        summary: "Hız düşürme ve rota değişimi yük ve emniyet için kritiktir.",
        bullets: [
          "Dalga yönüne göre rota optimizasyonu yap.",
          "Yük güvenliği için hız sınırlarını uygula.",
          "Manevra kabiliyetini koru.",
        ],
        imageAlt: "Ağır havada rota ayarı",
        motionCue: "Rota çizgisini dalga etkisiyle hafif hareket ettir.",
      },
      {
        title: "3. Gemi Güvenliği",
        summary: "Gemi üzerindeki ekipman ve yüklerin emniyeti önceliklidir.",
        bullets: [
          "Lashing kontrolünü sıklaştır.",
          "Açık güverte ekipmanlarını güvene al.",
          "Gemi içi su alma riskini yönet.",
        ],
        imageAlt: "Ağır hava güvenlik kontrolü",
        motionCue: "Güvenlik kartlarını sırayla parlat.",
      },
      {
        title: "4. Vardiya ve İzleme",
        summary: "Ağır havada vardiya yoğunluğu ve izleme sıklığı artmalıdır.",
        bullets: [
          "Ek gözcü görevlendir.",
          "Kritik parametreleri kısa aralıklarla ölç.",
          "Acil durum hazırlıklarını güncelle.",
        ],
        imageAlt: "Ağır hava vardiya planı",
        motionCue: "Vardiya bloklarını yukarıdan aşağıya kaydır.",
      },
    ]),
    calculationLinks: [{ title: "Seyir Hesaplamaları", href: "/navigation" }],
  },
  {
    id: "buzlu-sularda-seyir",
    title: "Buzlu Sularda Seyir",
    pages: buildPages("buzlu-sularda-seyir", [
      {
        title: "1. Buz Sınıfları",
        summary: "Ice class, geminin buzlu sulardaki operasyon yeteneğini belirler.",
        bullets: [
          "Ice class sertifikasını kontrol et.",
          "Buz sınıfına uygun hız limitlerini uygula.",
          "Yapısal riskleri göz önünde bulundur.",
        ],
        imageAlt: "Buz sınıfı özet tablosu",
        motionCue: "Ice class satırlarını sırayla highlight et.",
      },
      {
        title: "2. Rota Seçimi",
        summary: "Buz yoğunluğu ve akıntı, rota seçiminde belirleyicidir.",
        bullets: [
          "Ice chart ve uydu görüntülerini kullan.",
          "Buz kıran desteğini planla.",
          "Buz yoğun bölgelerden kaçın.",
        ],
        imageAlt: "Buzlu sularda rota planı",
        motionCue: "Buz yoğunluğu bölgelerini yumuşak pulse ile göster.",
      },
      {
        title: "3. Seyir Teknikleri",
        summary: "Buzlu sularda hız ve manevra kontrollü olmalıdır.",
        bullets: [
          "Gemi başını buz yönüne göre ayarla.",
          "Ani manevralardan kaçın.",
          "Makine durumunu sürekli izle.",
        ],
        imageAlt: "Buzlu sularda manevra şeması",
        motionCue: "Manevra oklarını yavaşça hareket ettir.",
      },
      {
        title: "4. Emniyet Önlemleri",
        summary: "Soğuk hava, donma ve ekipman arızaları risk yaratır.",
        bullets: [
          "Güverte ekipmanlarını buzdan temizle.",
          "Arama kurtarma hazırlıklarını artır.",
          "İletişim ve acil durum planlarını güncelle.",
        ],
        imageAlt: "Buzlu sularda emniyet önlemleri",
        motionCue: "Emniyet ikonlarını sıralı parıltı ile vurgula.",
      },
    ]),
    calculationLinks: [{ title: "Seyir Hesaplamaları", href: "/navigation" }],
  },
  {
    id: "manevra-karakteristikleri",
    title: "Manevra Karakteristikleri",
    pages: buildPages("manevra-karakteristikleri", [
      {
        title: "1. Dönüş Parametreleri",
        summary: "Turning circle, advance ve transfer değerleri manevra analizinin temelidir.",
        bullets: [
          "Advance ve transfer ölçümlerini bil.",
          "Dönüş çapını gemi hızına göre değerlendir.",
          "Manevra test kayıtlarını incele.",
        ],
        imageAlt: "Turning circle şeması",
        motionCue: "Dönüş çizgisini yarım daire animasyonuyla çiz.",
      },
      {
        title: "2. Durdurma Mesafesi",
        summary: "Stopping distance, acil durumlarda kritik bir parametredir.",
        bullets: [
          "Full astern ve crash stop değerlerini bil.",
          "Yük durumuna göre durdurma mesafesi değişir.",
          "Makine gücünü ve pervane tipini dikkate al.",
        ],
        imageAlt: "Stopping distance grafiği",
        motionCue: "Durdurma grafiğini soldan sağa animasyonla çiz.",
      },
      {
        title: "3. Rüzgâr ve Akıntı Etkisi",
        summary: "Manevra karakteristikleri çevresel koşullardan etkilenir.",
        bullets: [
          "Rüzgâr yönü ve şiddetini manevrada hesaba kat.",
          "Akıntı sapmasını önceden öngör.",
          "Tug desteği gerekliliğini değerlendirin.",
        ],
        imageAlt: "Manevra sırasında rüzgâr etkisi",
        motionCue: "Rüzgâr oklarını hafif dalga animasyonuyla hareket ettir.",
      },
      {
        title: "4. Uygulama ve Eğitim",
        summary: "Manevra performansı simülasyon ve eğitimle geliştirilir.",
        bullets: [
          "Simülatör eğitimlerini düzenli yap.",
          "Manevra limitlerini ekiple paylaş.",
          "Manevra sonrası performans değerlendirmesi yap.",
        ],
        imageAlt: "Manevra eğitimi planı",
        motionCue: "Eğitim adımlarını sırayla parlat.",
      },
    ]),
    calculationLinks: [{ title: "Seyir Hesaplamaları", href: "/navigation" }],
  },
  {
    id: "ekonomik-seyir",
    title: "Ekonomik Seyir",
    pages: buildPages("ekonomik-seyir", [
      {
        title: "1. Ekonomik Hız",
        summary: "Ekonomik hız, yakıt tüketimi ve zaman dengesiyle belirlenir.",
        bullets: [
          "Tüketim eğrilerini analiz et.",
          "Şirket politikalarını dikkate al.",
          "Rota ve hava koşullarına göre hız ayarla.",
        ],
        imageAlt: "Yakıt tüketim eğrisi",
        motionCue: "Eğriyi soldan sağa çizim animasyonu ile göster.",
      },
      {
        title: "2. Yakıt Yönetimi",
        summary: "Yakıt planlaması, sefer maliyetini doğrudan etkiler.",
        bullets: [
          "Bunker planını rota ve limanlara göre yap.",
          "Yakıt kalite kontrollerini uygula.",
          "Tüketim raporlarını düzenli kaydet.",
        ],
        imageAlt: "Yakıt yönetimi kontrol listesi",
        motionCue: "Kontrol maddelerini sırayla highlight et.",
      },
      {
        title: "3. Rota Optimizasyonu",
        summary: "Hava ve akıntı verileri rota optimizasyonunda kullanılır.",
        bullets: [
          "Weather routing tavsiyelerini değerlendir.",
          "Akıntı avantajını rota planına dahil et.",
          "Alternatif rotaları maliyet bazında karşılaştır.",
        ],
        imageAlt: "Rota optimizasyonu şeması",
        motionCue: "Alternatif rotaları sırayla vurgula.",
      },
      {
        title: "4. Performans İzleme",
        summary: "Performans izleme, ekonomik seyir hedeflerini doğrular.",
        bullets: [
          "KPI’ları (hız, tüketim, ETA) takip et.",
          "Sapmaları raporla ve düzeltme uygula.",
          "Enerji verimliliği raporlarını güncelle.",
        ],
        imageAlt: "Performans izleme paneli",
        motionCue: "KPI kartlarını yumuşak pulse animasyonuyla göster.",
      },
    ]),
    calculationLinks: [{ title: "Seyir Hesaplamaları", href: "/navigation" }],
  },
  {
    id: "ais-kullanimi",
    title: "AIS Kullanımı",
    pages: buildPages("ais-kullanimi", [
      {
        title: "1. AIS Temelleri",
        summary: "AIS, gemi kimlik ve seyir bilgilerini paylaşır.",
        bullets: [
          "AIS sınıflarını (A/B) ayırt et.",
          "Statik ve dinamik verileri bil.",
          "AIS veri güncellemelerini kontrol et.",
        ],
        imageAlt: "AIS veri akışı",
        motionCue: "Veri akışını noktalı çizgi animasyonuyla göster.",
      },
      {
        title: "2. Kullanım Sınırlamaları",
        summary: "AIS verisi her zaman doğru ve güncel olmayabilir.",
        bullets: [
          "Yanlış MMSI ve rota bilgilerine dikkat et.",
          "AIS sinyal kesintisi riskini göz önünde bulundur.",
          "Görsel ve radar doğrulaması yap.",
        ],
        imageAlt: "AIS sınırlamaları",
        motionCue: "Uyarı ikonlarını sırayla kırmızı vurguyla göster.",
      },
      {
        title: "3. Operasyonel Entegrasyon",
        summary: "AIS, radar ve ECDIS ile birlikte kullanılmalıdır.",
        bullets: [
          "AIS hedeflerini radar hedefiyle eşleştir.",
          "AIS mesajlarını trafik resmi için kullan.",
          "Çarpışma önleme kararlarında tek kaynak olarak kullanma.",
        ],
        imageAlt: "AIS entegrasyon şeması",
        motionCue: "Entegrasyon bağlantılarını yumuşak parıltı ile canlandır.",
      },
      {
        title: "4. Veri Yönetimi",
        summary: "AIS kayıtları, olay incelemelerinde kritik bilgi sağlar.",
        bullets: [
          "AIS log kayıtlarını düzenli sakla.",
          "Şüpheli hedefleri not et.",
          "VTS talimatlarıyla uyumu kaydet.",
        ],
        imageAlt: "AIS veri yönetimi",
        motionCue: "Log kayıt kartlarını sırayla parlat.",
      },
    ]),
    calculationLinks: [{ title: "Seyir Hesaplamaları", href: "/navigation" }],
  },
  {
    id: "colreg-pratikleri",
    title: "COLREG Pratikleri",
    pages: buildPages("colreg-pratikleri", [
      {
        title: "1. Karşılaşma Durumları",
        summary: "COLREG kuralları karşılaşma tiplerine göre uygulanır.",
        bullets: [
          "Kafa kafaya, çapraz ve geçiş durumlarını ayırt et.",
          "Give-way ve stand-on rollerini netleştir.",
          "Manevra zamanlamasını doğru belirle.",
        ],
        imageAlt: "COLREG karşılaşma şemaları",
        motionCue: "Gemi ikonlarını karşılaşma yönünde hareket ettir.",
      },
      {
        title: "2. Işıklar ve Şekiller",
        summary: "Gemi ışıkları ve şekilleri, geminin durumunu bildirir.",
        bullets: [
          "Seyir fenerlerini ve ışık karakterlerini bil.",
          "Kısıtlı manevra ve özel durum işaretlerini ayırt et.",
          "Gece-gündüz işaret farklarını uygula.",
        ],
        imageAlt: "COLREG ışık karakterleri",
        motionCue: "Işık ikonlarını sıralı yanıp sönme ile göster.",
      },
      {
        title: "3. Kısıtlı Görüş",
        summary: "Kısıtlı görüşte emniyetli hız ve ses sinyalleri önemlidir.",
        bullets: [
          "Emniyetli hızı düşür ve radarı yoğun kullan.",
          "Ses sinyallerini doğru uygula.",
          "Trafik resmi ile karar ver.",
        ],
        imageAlt: "Kısıtlı görüş COLREG uygulaması",
        motionCue: "Görüş kısıtını sis geçiş animasyonuyla vurgula.",
      },
      {
        title: "4. Uygulama Hataları",
        summary: "Yanlış yorum, gecikmiş manevra ve iletişimsizlik risk yaratır.",
        bullets: [
          "Kararı net ve erken uygula.",
          "Karşı tarafı gözlemlemeden manevra yapma.",
          "VHF iletişiminde yanlış anlaşılmaları önle.",
        ],
        imageAlt: "COLREG hata önleme",
        motionCue: "Hata kartlarını kısa shake animasyonuyla göster.",
      },
    ]),
    calculationLinks: [{ title: "COLREG Kuralları", href: "/navigation/rules" }],
  },
  {
    id: "kaza-ornekleri",
    title: "Kaza Örnekleri",
    pages: buildPages("kaza-ornekleri", [
      {
        title: "1. Örnek Vaka Analizi",
        summary: "Vaka analizleri, hataların tekrarlanmasını önler.",
        bullets: [
          "Kaza öncesi koşulları ve kararları incele.",
          "COLREG uygulamasındaki hataları belirle.",
          "Teknik ve insan faktörlerini ayır.",
        ],
        imageAlt: "Kaza analizi süreci",
        motionCue: "Zaman çizgisini soldan sağa ilerlet.",
      },
      {
        title: "2. Near-Miss Dersleri",
        summary: "Near-miss olayları, erken uyarı niteliğindedir.",
        bullets: [
          "Near-miss raporlarını paylaş.",
          "Riskli davranışları belirle.",
          "Düzeltici aksiyonları planla.",
        ],
        imageAlt: "Near-miss raporlama akışı",
        motionCue: "Akış oklarını sırayla parlat.",
      },
      {
        title: "3. Öğrenilen Dersler",
        summary: "Öğrenilen dersler prosedürlerin geliştirilmesine katkı sağlar.",
        bullets: [
          "Standart iş talimatlarını güncelle.",
          "Ekip eğitimlerini vaka örnekleriyle güçlendir.",
          "Risk iletişimini artır.",
        ],
        imageAlt: "Öğrenilen dersler listesi",
        motionCue: "Liste öğelerini sırayla highlight et.",
      },
      {
        title: "4. Önleyici Yaklaşım",
        summary: "Önleyici yaklaşım, riskleri oluşmadan azaltır.",
        bullets: [
          "Davranış odaklı emniyet uygulamaları oluştur.",
          "Denetim ve kontrol sıklığını artır.",
          "Sürekli iyileştirme kültürü oluştur.",
        ],
        imageAlt: "Önleyici yaklaşım döngüsü",
        motionCue: "Döngü ikonlarını yumuşak dönüş animasyonuyla canlandır.",
      },
    ]),
    calculationLinks: [{ title: "COLREG Kuralları", href: "/navigation/rules" }],
  },
  {
    id: "simulator-modulleri",
    title: "Simülatör Modülleri",
    pages: buildPages("simulator-modulleri", [
      {
        title: "1. Eğitim Amaçları",
        summary: "Simülatör, gerçek risk olmadan pratik yapma imkânı sunar.",
        bullets: [
          "Senaryo hedeflerini netleştir.",
          "Kritik karar noktalarını tanımla.",
          "Eğitim sonuçlarını ölç.",
        ],
        imageAlt: "Simülatör eğitim hedefleri",
        motionCue: "Hedef kartlarını sırayla parlat.",
      },
      {
        title: "2. Radar/ARPA Senaryoları",
        summary: "Radar ve ARPA senaryoları, hedef takibi ve çarpışma önlemeyi öğretir.",
        bullets: [
          "CPA/TCPA yorumlama pratiği yap.",
          "Kısıtlı görüş senaryoları uygula.",
          "Karar hızını artır.",
        ],
        imageAlt: "Radar simülasyon senaryosu",
        motionCue: "Radar ekranında sweep animasyonu kullan.",
      },
      {
        title: "3. Köprüüstü İletişimi",
        summary: "Simülasyon, ekip içi iletişimi test etmeye uygundur.",
        bullets: [
          "BRM iletişim prosedürlerini uygula.",
          "VHF konuşma disiplini oluştur.",
          "Koordinasyon eksiklerini tespit et.",
        ],
        imageAlt: "Köprüüstü iletişim senaryosu",
        motionCue: "İletişim balonlarını kısa fade ile sırala.",
      },
      {
        title: "4. Değerlendirme",
        summary: "Eğitim sonrası değerlendirme, performans gelişimini sağlar.",
        bullets: [
          "Hata noktalarını kayıt altına al.",
          "Gelişim hedeflerini belirle.",
          "Tekrar senaryolarıyla pekiştir.",
        ],
        imageAlt: "Simülatör değerlendirme raporu",
        motionCue: "Değerlendirme kartını aşağıdan yukarıya kaydır.",
      },
    ]),
    calculationLinks: [{ title: "Seyir Hesaplamaları", href: "/navigation" }],
  },
  {
    id: "seyir-belgeleri",
    title: "Seyir Belgeleri",
    pages: buildPages("seyir-belgeleri", [
      {
        title: "1. Kayıt Türleri",
        summary: "Seyir kayıtları, operasyonel ve yasal gereklilikleri karşılar.",
        bullets: [
          "Köprüüstü logbook ve seyir jurnali ayır.",
          "Radar/AIS kayıtlarını sakla.",
          "Elektronik kayıtların yedeklerini al.",
        ],
        imageAlt: "Seyir kayıt türleri",
        motionCue: "Belge kartlarını sırayla ortaya çıkar.",
      },
      {
        title: "2. Düzenli Kayıt",
        summary: "Düzenli kayıt, denetim ve kaza incelemelerinde kritik önemdedir.",
        bullets: [
          "Saatlik mevki ve hız kayıtlarını tut.",
          "Olay ve değişimleri açık yaz.",
          "İmza ve onay süreçlerini takip et.",
        ],
        imageAlt: "Kayıt düzeni şeması",
        motionCue: "Kayıt çizgisini soldan sağa çiz.",
      },
      {
        title: "3. GMDSS ve Emniyet",
        summary: "GMDSS kayıtları ve emniyet mesajları resmi belgeler arasındadır.",
        bullets: [
          "GMDSS test ve mesaj kayıtlarını sakla.",
          "MSI ve NAVTEX mesajlarını arşivle.",
          "Arıza kayıtlarını detaylandır.",
        ],
        imageAlt: "GMDSS kayıt akışı",
        motionCue: "GMDSS ikonlarını yumuşak pulse ile vurgula.",
      },
      {
        title: "4. Denetim Hazırlığı",
        summary: "Denetimlerde eksiksiz kayıt sunumu gerekir.",
        bullets: [
          "Kayıtların güncel ve erişilebilir olmasını sağla.",
          "Kayıp veya eksik kayıtları raporla.",
          "Denetim öncesi hızlı kontrol listesi uygula.",
        ],
        imageAlt: "Denetim hazırlık kontrol listesi",
        motionCue: "Kontrol maddelerini sırayla onay animasyonuyla göster.",
      },
    ]),
    calculationLinks: [{ title: "Seyir Hesaplamaları", href: "/navigation" }],
  },
  {
    id: "vardiya-yonetimi",
    title: "Vardiya Yönetimi",
    pages: buildPages("vardiya-yonetimi", [
      {
        title: "1. Vardiya Devri",
        summary: "Vardiya devri, kritik bilgilerin aktarımını sağlar.",
        bullets: [
          "Rota ve trafik durumunu devreden personele aktar.",
          "Cihaz ayarlarını ve alarmları bildir.",
          "Öncelikli riskleri vurgula.",
        ],
        imageAlt: "Vardiya devri kontrol listesi",
        motionCue: "Devri gösteren okları sırayla parlat.",
      },
      {
        title: "2. Gözcülük",
        summary: "Gözcülük, emniyetli seyir için vazgeçilmezdir.",
        bullets: [
          "Görsel ve işitsel gözcülüğü sürdür.",
          "Kısıtlı görüşte gözcülük yoğunluğunu artır.",
          "Gözcülük raporlarını kaydet.",
        ],
        imageAlt: "Gözcülük görevleri",
        motionCue: "Gözcü ikonlarını yavaş pulse animasyonuyla göster.",
      },
      {
        title: "3. Vardiya Disiplini",
        summary: "Disiplinli vardiya, hataları ve gecikmeleri azaltır.",
        bullets: [
          "Vardiya saatlerine tam uy.",
          "Kritik işlemler sırasında dikkati bölme.",
          "Vardiya içinde görev dağılımını netleştir.",
        ],
        imageAlt: "Vardiya disiplini şeması",
        motionCue: "Disiplin adımlarını sırayla vurgula.",
      },
      {
        title: "4. Performans Takibi",
        summary: "Vardiya performansı, rapor ve geri bildirimle geliştirilir.",
        bullets: [
          "Vardiya sonrası kısa değerlendirme yap.",
          "Eksik veya hatalı uygulamaları raporla.",
          "Eğitim ihtiyaçlarını belirle.",
        ],
        imageAlt: "Vardiya performans takibi",
        motionCue: "Performans kartlarını sırayla parlat.",
      },
    ]),
    calculationLinks: [{ title: "Seyir Hesaplamaları", href: "/navigation" }],
  },
];
