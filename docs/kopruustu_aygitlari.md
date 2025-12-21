# Köprüüstü Aygıtları

Bu belge, modern bir gemide köprüüstünde bulunan temel cihazların her birini ayrıntılı biçimde açıklar. Her bölümde cihazın temel amacı, çalışma prensibi, sağladığı veriler, kullanım senaryoları, kalibrasyon/bakım gereklilikleri ve olası arıza durumlarında köprüüstü ekibinin uygulayabileceği önlemler yer alır. Ayrıca manual formatında eklenen “Başlıca özellikler”, “Operasyon adımları”, “Vardiya öncesi kontrol listesi” ve “Acil durumda hızlı adımlar” kısımları, sahada hızlı referans için detaylı kontrol listeleri sunar.

## 1. Manyetik Pusula
- **Amaç ve prensip:** Dünyanın manyetik alanı ile hizalanarak gerçek yönü gösterir; sürekli güç gereksinimi yoktur.
- **Sağladığı veri:** Manyetik kerteriz, manyetik rota; manyetik sapma ve deviasyonla düzeltilir.
- **Başlıca özellikler:**
  - Binnacle ve alkol/su karışımlı kapsül, optik okuma penceresi ve aydınlatma.
  - Tutarlılık için kart amortisörlü yapıda, sönümleme kanatçıkları ile titreşime karşı dayanıklıdır.
  - Pelorus çanağı ve azimuth circle ile hedef kerterizi alma imkânı.
- **Kullanım:** Elektronik seyir sistemleri arızalandığında yedek yön referansı; pusula kerteriz alıcıyla görsel hedef takip; BRM içinde bağımsız doğrulama.
- **Kalibrasyon/bakım:** Düzenli deviasyon seyri ile sapmaların grafiğe işlenmesi, sıvı seviyesinin ve kart okunuşunun kontrolü, kartın titreşim ve kabarcıklara karşı izlenmesi.
- **Operasyon adımları:** Sefer öncesi deviasyon kartının köprüüstüne asılması, değişken yük/trim durumlarında sapmanın yeniden değerlendirilmesi, gece vardiyasında aydınlatma seviyesinin göz uyumunu bozmayacak şekilde ayarlanması.
- **Vardiya öncesi kontrol listesi:** Kartın serbestçe döndüğünü teyit et; pusula ışığını ve dimmer’ı test et; deviasyon tablosunun güncel ve görünür olduğundan emin ol.
- **Acil durumda hızlı adımlar:** Manyetik etkileyicileri uzaklaştır; kerterizleri pelorus ile tekrar alarak deviasyonu tahmin et; alternatif yön referansı olarak jiroskopik pusulayı veya görsel fenerleri kullan.

## 2. Jiroskopik Pusula
- **Amaç ve prensip:** Dönen jiroskop diski ve Dünya’nın dönme etkisiyle gerçek kuzeye hizalanır; manyetik alanlardan etkilenmez.
- **Sağladığı veri:** Gerçek kerteriz ve rota, jiroskobik hız dönüştürmesi üzerinden kurs bilgisi; otopilot, radar ve ECDIS'e dağıtılır.
- **Başlıca özellikler:**
  - Tekne hareketlerine karşı sönümleme sağlayan cardan süspansiyonlu çanak.
  - Dağıtım ünitesi üzerinden heading repeater’lara, otopilota ve radar/ECDIS’e çoklu çıkış.
  - Bazı modellerde dahili hız girdisi (speed log) ile latitude/velocity error düzeltmesi.
- **Kullanım:** Otomatik dümen kontrolü, radar yerleşimi, paralel yol izleme ve rotanın sabitlenmesi; pilot plug ve DP sistemlerine yüksek doğrulukta yön referansı sağlama.
- **Kalibrasyon/bakım:** Günlük hata kontrolü (azimut düzeltmesi), jiroskop yağ seviyesi ve güç beslemesinin izlenmesi, üretici periyotlarında overhaul.
- **Operasyon adımları:** Seyir öncesi warm-up süresinin tamamlanmasının beklenmesi, latitude girişinin güncel tutulması, heading repeater’ların jiroskop master değeri ile karşılaştırılması.
- **Vardiya öncesi kontrol listesi:** Master ve repeater değerlerini kıyasla; power/alarm lambalarını kontrol et; DGPS/log girdilerinin seçili olduğunu doğrula.
- **Acil durumda hızlı adımlar:** Heading sapması görülürse latitude/hız girişlerini yeniden gir; dağıtım kutusundan yedek repeater çıkışına geç; jiroskop durduysa manyetik pusulayı ve manuel dümenlemeyi devreye al.

## 3. GPS Alıcısı
- **Amaç ve prensip:** GNSS uydularından alınan zaman/konum sinyalleriyle enlem, boylam, hız ve zaman bilgisi üretir.
- **Sağladığı veri:** WGS-84 konumu, COG (course over ground), SOG (speed over ground), UTC zamanı; ECDIS ve VDR’ye besleme.
- **Başlıca özellikler:**
  - Çoklu uydu takımyıldızı desteği (GPS, GLONASS, Galileo, BeiDou) ile daha yüksek PDOP doğruluğu.
  - Diferansiyel düzeltme (SBAS/DGPS/RTK) girişleri ve alarmları.
  - Anchor watch, cross track error ve varış alarmı için kullanıcı tanımlı limitler.
- **Kullanım:** Seyir planı izleme, pozisyon fiksleri, hız kontrolü, otomatik günlük kayıtları, alarm eşikleri (anchor watch vb.); otomatik zaman senkronizasyonu ve GMDSS saatleri için referans.
- **Kalibrasyon/bakım:** Anten görüş alanının ve kablo bütünlüğünün kontrolü, saat sapmasının gözlenmesi, diferansiyel (DGPS/RTK) kaynaklarının doğrulanması.
- **Operasyon adımları:** Sefer başlangıcında konum çözümünün 3D fix ve PDOP değerleri doğrulanır, DGPS modu aktifse düzeltme istasyonu seçilir; SOG/COG değerleri hız logu ve gyro ile çapraz kontrol edilir.
- **Vardiya öncesi kontrol listesi:** Anten buzlanma/gölgeleme olmadığını gözle kontrol et; PDOP ve uydu sayısını not et; alarm limitlerinin (anchor watch, XTE) sefere uygun olduğunu doğrula.
- **Acil durumda hızlı adımlar:** Uydu kaybında DR moduna geç; radar, kerteriz ve log ile manuel pozisyon güncelle; anten kablosu veya güç beslemesi için köprüüstü sigortalarını kontrol et.

## 4. ECDIS (Electronic Chart Display and Information System)
- **Amaç ve prensip:** Resmi ENC (Electronic Navigational Chart) verilerini sensör girdileriyle birleştirerek dinamik seyir gösterimi sağlar.
- **Sağladığı veri:** Gerçek zamanlı konum, rota hattı, güvenli derinlik/clearance alarmları, AIS hedefleri, radar overlay, yükseklik/draft tabanlı güvenli izler.
- **Başlıca özellikler:**
  - Çift ECDIS senkronizasyonu, RCDS modu ve katman bazlı gösterim (tides, currents, T&P, ENC updates).
  - Passage plan modülü, XTD (cross track distance) ve wheel-over noktası hesaplayıcı, check list ve safety contour uyarıları.
  - USB/NTM/ENC otomasyonuyla güncelleme günlükleri, VDR ve printer çıkışları.
- **Kullanım:** Rota planlama ve izleme, çakışma önleme için çakışma alanlarının görselleştirilmesi, otomatik günlük, pilot plug entegrasyonu; pilotajda radar overlay ve AIS filtreleri ile durumsal farkındalık.
- **Kalibrasyon/bakım:** Haftalık/aylık ENC güncellemeleri, T&P (Temporary & Preliminary) ilanlarının uygulanması, sensör veri eşlemesinin (gyro/GPS/log) doğrulanması, UPS testi.
- **Operasyon adımları:** Safety depth/contour/height değerlerinin gemi draftı ve squat göz önüne alınarak ayarlanması, alarm listelerinin vardiya zabiti tarafından devreye alınması, check route fonksiyonunun tüm waypoint’ler için çalıştırılması.
- **Vardiya öncesi kontrol listesi:** ENC lisans ve güncelleme tarihlerini kontrol et; sensör giriş durumlarını (gyro, log, GPS, AIS, radar overlay) doğrula; safety contour ve XTD değerlerini sefer planına göre gözden geçir.
- **Acil durumda hızlı adımlar:** Bir ECDIS arızalanırsa diğer ünitede aynı rota dosyasını yükle; sensör kaybında ilgili katmanı devre dışı bırakıp manuel pozisyonlama kullan; kağıt harita veya raster yedeklere dön.

## 5. Radar ve ARPA
- **Amaç ve prensip:** Mikrodalga pulslarının yansımasıyla mesafe ve kerteriz belirler; ARPA hedeflerin hareketini vektörel olarak hesaplar.
- **Sağladığı veri:** Menzil halkaları, değişen mesafe ölçümü, hedef CPA/TCPA, yağmur/deniz karartma ayarları, S-band ve X-band seçenekleri.
- **Başlıca özellikler:**
  - ARPA otomatik target acquisition, guard zone ve AIS/radar association fonksiyonları.
  - Range cell migration ve sea/rain clutter filtreleri; true/relative vectors, trial manevra simülasyonu.
  - Overlay çıktıları (ECDIS, conning display) ve VRM/EBL kayıtları.
- **Kullanım:** Çarpışma önleme manevraları (COLREGS), dar kanal seyri, fener/şamandıra tanıma, kör alan tespiti, parallel indexing; pilotajda S-band kabarma filtreleri ile daha net hedef ayrımı.
- **Kalibrasyon/bakım:** Heading line ayarı, range/VRM kalibrasyonu, GYRO/GPS girişi doğrulaması, magnetron çalışma saatlerinin takibi, anten/radar dom temizliği.
- **Operasyon adımları:** Uygun pulse length ve PRF seçimi, gain ve anti-clutter ayarlarının hedefe göre optimize edilmesi, ARPA acquisition limitlerinin COLREGS’e uygun olarak sınırlandırılması, test target kullanarak range/hizalama kontrolü.
- **Vardiya öncesi kontrol listesi:** Anten dönüş uyarısı ve sıcaklık alarmlarını kontrol et; heading ve speed girişlerini ECDIS/GPS ile kıyasla; guard zone ve CPA limitlerinin çevresel duruma uygun olduğundan emin ol.
- **Acil durumda hızlı adımlar:** Magnetron alarmında diğer banda geç; heading verisi kaybolursa relatif moda al ve kendi hareketini dikkate alarak vektörleri yorumla; ağır yağmurda yağmur karartmayı manuel optimize ederek hedefleri yakınlaştır.

## 6. Otomatik Tanımlama Sistemi (AIS)
- **Amaç ve prensip:** VHF veri bağlantısıyla gemi kimlik ve seyir bilgilerini yayınlar ve alır; GPS ve gyro girişlerine dayanır.
- **Sağladığı veri:** MMSI, gemi adı, tip, boyut, rota/hız, konum, ETA, draught; diğer hedeflerin CPA/TCPA tahmini ECDIS/radar overlay ile birleştirilir.
- **Başlıca özellikler:**
  - Class A 12.5W verici, mesaj 1/2/3 slot planlama ve güvenlik mesajı (ASM) desteği.
  - Pilot plug, Inland AIS ve sorumluluk alanlarına göre rapor özelleştirme; statik seyir planı raporları.
  - Silence mode, blue sign/blue flag fonksiyonları (iç su yolu konfigürasyonlarında).
- **Kullanım:** Trafik resmi oluşturma, VTS ile bilgi paylaşımı, gemi çağrı numarası doğrulaması, acil durum mesajlaşması (safety-related messaging); arama-kurtarma koordinasyonu ve hedef filtreleme.
- **Kalibrasyon/bakım:** Transceiver güç çıkışı kontrolü, anten SWR ölçümü, statik veri (IMO no, çağrı işareti, boyutlar) doğrulaması, Class A/B arayüz testleri.
- **Operasyon adımları:** Limandan kalkışta statik/dinamik verilerin (voyage related) güncellenmesi, VHF anten ayırma mesafesinin kontrolü, silence mode’un sadece VTS talebiyle kullanılması, pilot boarding öncesi pilot plug çıkışının doğrulanması.
- **Vardiya öncesi kontrol listesi:** MMSI, çağrı işareti ve voyage data alanlarını doğrula; anten bağlantılarını gözle kontrol et; AIS hedef filtrelerini (dış liman, balıkçı vb.) operasyon bölgesine göre ayarla.
- **Acil durumda hızlı adımlar:** GPS kaybında manuel/alternatif pozisyon girişi yap; collision risk arttığında Class B hedefleri daha sık yenilemek için filtreleri aç; transceiver resetinden önce veritabanı yedeğini alıp tekrar başlat.

## 7. Otomatik Pilot (Otopilot)
- **Amaç ve prensip:** Gyro veya manyetik pusuladan aldığı rota verisine göre dümen servo motorlarını otomatik kumanda eder.
- **Sağladığı veri:** Tutulan rota, dümen açısı, sapma, darbe/sensör alarmı; çoğu sistemde adaptif veya ekonomi modu.
- **Başlıca özellikler:**
  - NFU, FU, AUTO, TRACK ve ECONOMY modları; çift pompa kontrolü ve redundancy.
  - Yaw damping, weather adaptif ayarları, wander limit ve turn rate sınırlayıcıları.
  - Bridge wing veya ECR’de tekrarlayıcı kontrol panelleri.
- **Kullanım:** Uzun süreli rotalarda sabit rota tutma, yakıt tasarrufu için kontrollü dümen hareketleri, track control ile ECDIS entegrasyonu; kötü havada yaw damping ile daha yumuşak seyir.
- **Kalibrasyon/bakım:** Rudder limit ve counter-rudder ayarları, kontrol modlarının (NFU, FU, AUTO, TRACK) test edilmesi, servo yağı ve pompa gürültüsünün izlenmesi.
- **Operasyon adımları:** Gidiş öncesi gain, rudder ve counter-rudder değerlerinin draft/hız durumuna göre optimize edilmesi; track control devreye alınmadan önce ECDIS XTD değerlerinin doğrulanması; manuel override butonlarının fonksiyon testleri.
- **Vardiya öncesi kontrol listesi:** NFU/FU panellerini ve dümen merkezleme göstergelerini test et; seçili heading kaynağının (gyro/manyetik) doğru olduğunu doğrula; çift pompa sistemlerinde aktif pompayı ve standby durumunu kayda al.
- **Acil durumda hızlı adımlar:** Sapma büyürse gain’i düşürüp counter-rudder’ı artır; servo alarmında NFU veya manuel güverte kontrolüne geç; gyro kaybında manyetik pusula ile AUTO modunu sürdür veya TRACK modunu devreden çıkar.

## 8. Dümen Göstergesi ve ROTA/Dümen Kayıt Sistemi
- **Amaç:** Anlık dümen açısını ve komut-hareket uyumunu gösterir; bazı sistemlerde rotalama kaydı (course recorder) bulunur.
- **Başlıca özellikler:**
  - Çift yönlü gösterge (port/starboard) ve bridge wing repeater’ları.
  - Kurs kayıt cihazı ile gyro heading ve dümen açısının sürekli kağıt/elektronik kaydı.
  - Fail-safe kontakları ile otopilot/steering failure alarmı.
- **Kullanım:** Pilotajda hassas manevralar, dümen makinesi testi, VDR beslemesi; seyrüsefer incelemesinde kayıtlı trendler üzerinden otopilot performans değerlendirmesi.
- **Bakım:** Potansiyometre ve transmitter hizasının kontrolü, mekanik sürtünme ve kablo bağlantılarının incelenmesi.
- **Operasyon adımları:** Sefer öncesi merkezleme testi, köprü kanadı göstergelerinin ana gösterge ile eşleşmesinin doğrulanması, VDR kayıt durumunun kontrolü.
- **Vardiya öncesi kontrol listesi:** Gösterge sapmasını gyro referansı ile kıyasla; köprü kanadı repeater’larının ışık ve dimmer’ını test et; kayıt kağıdının (varsa) yeterli olduğunu kontrol et.
- **Acil durumda hızlı adımlar:** Gösterge kaybında güverte/gemi telefonu üzerinden dümen makine geri beslemesi al; lokal göstergeden veri topla; otopilot/steering alarmını kayda alıp manuel dümenlemeye geç.

## 9. Hız Logu (Doppler veya Elektromanyetik)
- **Amaç ve prensip:** Sualtına gönderilen sinyallerin Doppler kayması veya elektromanyetik indüksiyonla gemi hızını ölçer.
- **Sağladığı veri:** STW (speed through water), bazı modellerde ileri/geri hız, su sıcaklığı; ECDIS ve otomatik pilot girişidir.
- **Başlıca özellikler:**
  - Çift eksenli transdüser ile hem enine hem boyuna hız bileşenleri (athwartship speed).
  - Ground speed modu için GPS entegrasyonu; harbor/sea aralıklarında farklı filter setleri.
  - VDR, ECDIS ve DP sistemlerine NMEA/serial çıkış.
- **Kullanım:** Kısıtlı sularda hız kontrolü, pilot manevrası, yakıt optimizasyonu; kıç/baş pervane etkilerinin değerlendirilmesi.
- **Kalibrasyon/bakım:** Transdüser temizliği, sıfır ayarı, kalibrasyon faktörü (k) doğrulaması; kuru havuzdan sonra yeniden kalibrasyon.
- **Operasyon adımları:** Shallow/Deep modlarının seyir bölgesine göre seçilmesi, harbor modunda yumuşak filtrelerin aktif edilmesi, ilerleme/geri harekette sensör polaritesinin doğru olduğunun test edilmesi.
- **Vardiya öncesi kontrol listesi:** Harbor/sea modu doğru mu kontrol et; STW ile SOG’u kıyaslayıp makul farkı teyit et; transdüser well kapağının kapalı/temiz olduğunu makineyle doğrula.
- **Acil durumda hızlı adımlar:** Kabarcık perdesi şüphesinde hız verisini SOG ile değiştirerek otopilota besle; log alarmında transdüseri çekmeden önce limanda temizlik planla; track control’de hız kaybı varsa manuel throttle ve rota takibi ile XTE’yi kontrol et.

## 10. Echo Sounder (Sığlık Ölçer)
- **Amaç ve prensip:** Ses dalgalarının dipten yansıma süresiyle derinlik ölçer.
- **Sağladığı veri:** Anlık derinlik, dip yapısı hakkında ipuçları, yüksek/alçak alarm eşikleri.
- **Başlıca özellikler:**
  - Tek veya çift frekanslı çalışma (50/200 kHz) ile yumuşak ve sert dip ayrımı.
  - Sürekli kağıt kayıt veya dijital log, alarmlı shallow/deep limitleri.
  - Tidal offset ve draft offset ayarları, VDR ve ECDIS’e veri çıkışı.
- **Kullanım:** Kısıtlı sularda derinlik takibi, demirleme sahasında uygun bölge seçimi, kanal geçişi; VDR kaydı; buzlu sularda dip sertliğini anlamak için çift frekans analizi.
- **Kalibrasyon/bakım:** Draft ofseti ve ses hızının (tuzluluk/sıcaklık) kontrolü, transdüser temizliği.
- **Operasyon adımları:** Sefer öncesi offset değerlerinin draft ve squat’a göre ayarlanması, shallow/deep alarm limitlerinin sefer planına göre girilmesi, kaydedici kağıdının/termal bandın yeterli olduğunun kontrolü.
- **Vardiya öncesi kontrol listesi:** Draft offset’ini güncel trimle kıyasla; shallow/deep alarm limitlerini seyir bölgesine göre güncelle; kayıt kağıdı ve yazıcı kafasının temizliğini kontrol et.
- **Acil durumda hızlı adımlar:** Çok sığ okuma veya gürültüde frekansı değiştir; radar paralaksı ve kağıt chart soundings ile derinliği doğrula; transdüser kabarcığı şüphesinde hız/log ayarlarını gözden geçir.

## 11. NAVTEX ve GMDSS Alıcıları
- **Amaç:** Denizcilik emniyet mesajlarının otomatik alımı (NAVTEX) ve küresel deniz haberleşmesi (GMDSS - VHF/MF/HF, Inmarsat).
- **Sağladığı veri:** MSI, meteoroloji, seyrüsefer uyarıları, SAR yayınları; DSC alarmı; EGC SafetyNET mesajları.
- **Başlıca özellikler:**
  - NAVTEX için 518/490/4209.5 kHz bantları ve B1/B2 kod filtreleme; GMDSS için VHF-DSC, MF/HF-DSC ve Inmarsat-C terminalleri.
  - EGC printer veya ekran log’u, acil durum mesajı yüksek öncelikli ses/ışık alarmı.
  - Test çağrısı ve Self Test menüleri; otomatik mute ve watch receiver fonksiyonu.
- **Kullanım:** Seyir planında güncel seyir uyarılarını uygulama, acil durum alarmı, denizcilik bültenlerinin köprüüstüne yönlendirilmesi; SOLAS gerekliliklerine uygun MSI arşivleme.
- **Kalibrasyon/bakım:** Alıcı frekans doğrulaması, anten ve topraklama kontrolleri, NAVTEX istasyon/servis kodu ayarlarının güncel tutulması.
- **Operasyon adımları:** Sefer bölgesine uygun B1 istasyon seçimleri yapılır, gereksiz kategori (B2) mesajları filtrelenir, GMDSS ekipmanında günlük/haftalık DSC testleri ve printer kâğıdı kontrolü uygulanır.
- **Vardiya öncesi kontrol listesi:** NAVTEX B1/B2 seçimini rotaya göre güncelle; printer kâğıdı ve mürekkebini kontrol et; DSC test çağrısının son tarihini kayda geçir.
- **Acil durumda hızlı adımlar:** MSI mesajı alamazsan frekans ve anten bağlantısını değiştirerek yeniden tarat; DSC alarmını manual mayday çağrısıyla yedekle; Inmarsat terminalini yeniden başlat ve GPS girişini doğrula.

## 12. VHF/DSC Telsiz ve İnterkom
- **Amaç:** Köprüüstü ile diğer gemiler, VTS ve iç haberleşme arasında iki yönlü ses/veri iletişimi sağlar.
- **Sağladığı veri:** Kanal seçimi, DSC distress/safety çağrıları, ATIS/duplex ayarları; bazı modellerde kaydedilmiş ses.
- **Başlıca özellikler:**
  - Class A DSC modülü, dual/tri-watch, ATIS/US kanal setleri; pilot plug veya interkom entegrasyonu.
  - Loudhailer/PA çıkışı, talk-back ve köprü kanadı kontrol; mikrofonsuz kullanım için hands-free opsiyonları.
  - Otomatik log, position polling, distress alert and acknowledgement fonksiyonları.
- **Kullanım:** Manevra koordinasyonu, çarpışma önleme iletişimi, iç anons ve telefon sistemleriyle bütünleşme; VTS raporları ve kanal 16 nöbeti.
- **Kalibrasyon/bakım:** Kanal gücü ve devresi testi, anten SWR ölçümü, batarya/UPS kontrolü, DSC test çağrıları.
- **Operasyon adımları:** Kanal 16/13 nöbeti için dual watch etkinleştirme, distress cover’ın mühür kontrolü, köprü kanat setlerinin ses seviyelerinin eşitlenmesi, PA hoparlör yönünün güverte personelini rahatsız etmeyecek şekilde ayarlanması.
- **Vardiya öncesi kontrol listesi:** Kanal 16 nöbetini doğrula; distress kapağı ve DSC butonlarının sağlamlığını kontrol et; interkom ve PA hoparlör testini kısa bir anonsla yap.
- **Acil durumda hızlı adımlar:** Squelch/gain’i parazit seviyesine göre ayarla; DSC alarmı gönderilemiyorsa sesli mayday prosedürüne geç; anten arızasında yedek portable VHF veya MF/HF cihazına yönel.

## 13. Anemometre ve Barometre
- **Amaç:** Rüzgar hızı/yönü ve atmosfer basıncını ölçer, meteorolojik durumun ve manevra etkilerinin izlenmesini sağlar.
- **Sağladığı veri:** Gerçek ve göreli rüzgar yönü/hızı, barometrik basınç trendi; ECDIS ve DP sistemlerine veri çıkışı.
- **Başlıca özellikler:**
  - Ultrasonik veya fin-cup tip anemometre, buz önleyici ısıtıcılar ve hız/yön ayrı sensör modülleri.
  - Trend grafikleri, maksimum/gust kayıtları ve alarm limitleri.
  - Barometrede QNH/QFE okuma, yükselen/alçalan trend ok göstergesi, dijital/analog çıkış.
- **Kullanım:** Pilotajda rüzgar etkisinin hesaplanması, yanaşma/ayrılma kararları, hava durumu tahmini, trim/derinlik değerlendirmesi; güverte operasyonlarında vinç/kapak emniyeti için limit kontrolü.
- **Kalibrasyon/bakım:** Döner kap veya ultrasonik sensör temizliği, barometre doğrulaması, su geçirmezlik ve ısıtma elemanlarının kontrolü.
- **Operasyon adımları:** Ölçüm modu (true/apparent) seçiminin kontrolü, gust alarm limitlerinin iskele/sancak yanaşma operasyonuna göre ayarlanması, barometre okunmasının günlük seyir defterine kaydı.
- **Vardiya öncesi kontrol listesi:** Sensör buzlanmasını ve bağlantı kablolarını gözle kontrol et; true/apparent seçimini seyir moduna göre ayarla; barometre değerini günlük kayıtla karşılaştır.
- **Acil durumda hızlı adımlar:** Veri kaybında manuel el anemometresi ve barometreyi kullan; buzlanma şüphesinde ısıtıcıları devreye al; rüzgar yönü tutarsızsa sensör kablosu ekranlamasını ve topraklamayı incele.

## 14. BNWAS (Bridge Navigational Watch Alarm System)
- **Amaç:** Köprüüstü vardiyasının uyanıklığını denetler, belirli aralıklarla onay ister; cevap gelmezse alarmlar makine dairesi ve kamaralara yayılır.
- **Sağladığı veri:** Vardiya onay zaman çizelgesi, alarm logları, hareket sensörü tetikleri.
- **Başlıca özellikler:**
  - Aşamalı alarm seviyeleri (köprüüstü iç alarmı, kaptan kamara alarmı, gemi genel alarmı).
  - Hareket sensörü, reset butonları ve pedal sensörleri ile çoklu tetik girişi.
  - VDR bağlantısı ve self-test fonksiyonu.
- **Kullanım:** Tek vardiya memurunun güvenliğini artırma, SOLAS gerekliliklerini karşılaması; gece vardiyasında bridge resource management prosedürlerini destekleme.
- **Kalibrasyon/bakım:** Zaman aralıklarının doğrulanması, buton ve pedalların işlev testi, VDR beslemesinin kontrolü.
- **Operasyon adımları:** Sefer öncesi delay süresinin (3-12 dk) seçilmesi, sensörlerin görüş alanını kesmeyecek şekilde monte edilmesi, vardiya başlangıcında BNWAS’ın aktif olduğunun kontrolü.
- **Vardiya öncesi kontrol listesi:** Zamanlayıcı ayarını vardiya süresine göre belirle; reset butonlarını ve pedalı test et; alarm çıkışlarının (kaptan kamara ve genel alarm) sessiz testini yap.
- **Acil durumda hızlı adımlar:** Yanlış alarmda sensör görüş alanını kontrol edip gerekirse inhibit kaydı aç; sistem arızasında manuel nöbet protokolüne geç ve köprüüstü kamera/harici gözcü ile takviye et; VDR bağlantısını kontrol ederek kayıtların tutulduğundan emin ol.

## 15. Seyir Veri Kaydedici (VDR/S-VDR)
- **Amaç:** Seyir, ses ve görüntü verilerini kazadan sonraki inceleme için kaydeder; kara kutu görevi görür.
- **Sağladığı veri:** Ses kayıtları, radar/ECDIS ekran görüntüleri, sensör verileri (GPS, gyro, hız logu, echo sounder), VHF iletişimleri.
- **Başlıca özellikler:**
  - Deniz suyu/yangına dayanıklı kızıl kapsül veya float-free kapsül; fixed capsule + float-free opsiyonu.
  - 12-48 saatlik loop kayıt, bridge audio/microphone array, wing video/bridge CCTV entegrasyonu.
  - Remote download ve tamper-evident loglar; UPS destekli güç girişi.
- **Kullanım:** Kaza sonrası analiz, performans değerlendirme; bazı sistemler canlı veri erişimi sağlar; eğitim amaçlı playback ile köprüüstü senaryolarının incelenmesi.
- **Kalibrasyon/bakım:** Kazanım ve sensör giriş kontrolü, kapsül durum/akü testi, mikrofon ve cam temizliği, yıllık performans test raporu (APT).
- **Operasyon adımları:** Vardiya başlangıcında kapsül ve bridge audio ışıklarının kontrolü, ECDIS/radar video input sinyallerinin VDR menüsünden doğrulanması, haftalık self-test çıktılarını kayıt altına alma.
- **Vardiya öncesi kontrol listesi:** Kapsül durum ışığını ve UPS beslemesini kontrol et; mikrofonların önünün açık olduğundan emin ol; self-test log’unun son tarihini seyir defterine yaz.
- **Acil durumda hızlı adımlar:** Alarmda kayıt sayacını doğrula ve kapsül bağlantısını kontrol et; veri alınamıyorsa köprüüstü ses kayıtlarını manuel olarak tut; uzun süreli arızada kaptan ve şirket IT birimine bilgi verip APT planını güncelle.

## 16. Alarm ve Gözcü Paneli
- **Amaç:** Makine, yangın, seviye, kargo ve seyir sensör alarmlarını köprüüstünde birleştirir.
- **Sağladığı veri:** Alarm kodu, zaman damgası, bölge; bazı sistemlerde trend ve silme/hazırlama fonksiyonu.
- **Başlıca özellikler:**
  - Silence/acknowledge ve inhibit seçenekleri, genel alarm/PA entegrasyonu.
  - Yangın zonları, kapı/kapak güvenliği, makina parametreleri ve kargo tank seviye sensörlerinin tek panelden izlenmesi.
  - Log yazdırma veya veri aktarımı, UPS destekli güç.
- **Kullanım:** Kritik durumların erken tespiti, güvenli seyir; alarm onay protokolleri SOLAS’a göre uygulanır; makine dairesi insansız modda (UMS) zorunlu alarm köprüsü transferi.
- **Kalibrasyon/bakım:** Alarm testleri, lamba/ses cihazı kontrolü, sensör döngülerinin belirli aralıklarla simülasyonu.
- **Operasyon adımları:** Sefer öncesi tüm alarm gruplarının test edilmesi, inhibit moduna alınan devrelerin kayıt altına alınması, vardiya sırasında yeni alarm çıktılarının loglanıp ilgili departmana bildirilmesi.
- **Vardiya öncesi kontrol listesi:** Genel alarm ve sesli uyarıları sessiz test et; inhibit edilen devrelerin listesini güncelle; UPS durum ışıklarını ve besleme kablolarını gözden geçir.
- **Acil durumda hızlı adımlar:** Yanlış alarmda ilgili devreyi izole edip manuel gözetimi artır; panel arızasında kritik alarmları lokal panellerden takip et; UPS arızasında makine kontrol odası ve güverteyle alternatif haberleşme kur.

## 17. Sökülebilir Pilot Plug
- **Amaç:** Pilotların kendi PPU (Portable Pilot Unit) cihazlarını gemi sensörlerine bağlamasına izin verir.
- **Sağladığı veri:** NMEA veri akışı (GPS, gyro, log, AIS), gerçek zamanlı rota ve manevra bilgisi.
- **Başlıca özellikler:**
  - IEC 61162-2 veya -450 uyumlu NMEA çıkışı, galvanik izolasyon ve surge koruması.
  - 9-pin D-sub veya özel konnektör üzerinden hızlı bağlantı; bazı gemilerde çift çıkış.
  - Sensör seçimi için dağıtım paneli, pilotun hangi GPS/gyro kaynağını aldığına dair işaretleme.
- **Kullanım:** Pilotlar için hassas manevra desteği, ECDIS'e paralel gösterim, manevra sonrası analiz; manevrada hız/rotanın gerçek zamanlı paylaşımı.
- **Kalibrasyon/bakım:** Konnektör pin temizliği, NMEA baud rate doğrulaması, galvanik izolasyon kontrolleri.
- **Operasyon adımları:** Pilot gelmeden önce port pilot plug kablosunun erişilebilirliği sağlanır, NMEA talker seçimi işaretlenir, loop test ile veri akışı doğrulanır.
- **Vardiya öncesi kontrol listesi:** Konnektör pinlerini gözle kontrol et ve toz kapaklarını temizle; NMEA kaynağı etiketini mevcut sensör seçimiyle eşleştir; yedek kablonun çalıştığını kısa bir loop test ile doğrula.
- **Acil durumda hızlı adımlar:** Veri akışı yoksa pin bağlantılarını ve seçili sensör çıkışlarını kontrol et; Bluetooth/4G PPU iç GPS’ine geçici olarak izin ver; dağıtım panelindeki sigortayı ve topraklamayı incele.

---
Bu liste, gemi tipine bağlı olarak ek cihazlar (DP konsolu, buz radarı, su yoğunluğu sensörü, yük seviye göstergesi vb.) ile genişletilebilir. Ancak yukarıdaki aygıtlar, tipik bir ticaret gemisi köprüüstü operasyonlarının çekirdek ekipmanını temsil eder.
