# Köprüüstü Aygıtları

Bu belge, modern bir gemide köprüüstünde bulunan temel cihazların her birini ayrıntılı biçimde açıklar. Her bölümde cihazın temel amacı, çalışma prensibi, sağladığı veriler, kullanım senaryoları, kalibrasyon/bakım gereklilikleri ve olası arıza durumlarında köprüüstü ekibinin uygulayabileceği önlemler yer alır. Ayrıca manuel formatında eklenen “Başlıca özellikler” ve “Operasyon adımları” kısımları, sahada hızlı referans için detaylı kontrol listeleri sunar.

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
- **Arıza/önlemler:** Kart donması veya kabarcık oluşumu halinde pusula ışığı ısısı ile yavaşça giderme; manyetik etkileyiciler (telgraf, hoparlör vb.) uzaklaştırma; sapma eğrisi aşırı değişiyorsa çevresel ferromanyetik ekipman kontrolü.

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
- **Arıza/önlemler:** Güç kaybında serbest jiroskop durur; manyetik pusula ve manuel dümenleme devreye alınır, dağıtım kutularındaki alarm lambaları kontrol edilir; drift artıyorsa latitude/hız hatalarını gözden geçirme.

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
- **Arıza/önlemler:** Uydu kaybında DR (dead reckoning) moduna geçiş; Loran, radar paralaksı veya görsel kerterizlerle konum teyidi; anten buzlanma veya gökyüzü görüş engelleri kontrol edilir.

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
- **Arıza/önlemler:** Çift ECDIS konfigürasyonunda diğer üniteye geçiş; kâğıt harita veya raster yedeklerin hazırlanması; radar ve GPS üzerinden rotanın manuel izlenmesi; sensör kaybında ilgili katmanın (AIS/radar) kapatılması.

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
- **Arıza/önlemler:** Magnetron bitiş uyarısında yedek banda geçiş; heading girişi kesilirse relatif modda çalışma; ağır yağmurda darbe tekrarlama (pulse length) ayarlarının optimize edilmesi; anten dönüş alarmında sürücü motoru ve emniyet switch’leri kontrol edilir.

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
- **Arıza/önlemler:** GPS kaybında SOG/COG tutarsızlıkları; manuel raporlama moduna geçiş; VHF anten ayrımını kontrol; Class B hedeflerin düşük güncelleme hızını hesaba katma.

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
- **Arıza/önlemler:** Sapma büyükse gain ayarlarını düşürme; servo alarmında manuel FU/NFU moduna geçiş; jiroskop hatasında manyetik pusula ile çalıştırma; elektriksel arıza durumunda dümen makine lokal kontrolüne geçiş.

## 8. Dümen Göstergesi ve ROTA/Dümen Kayıt Sistemi
- **Amaç:** Anlık dümen açısını ve komut-hareket uyumunu gösterir; bazı sistemlerde rotalama kaydı (course recorder) bulunur.
- **Başlıca özellikler:**
  - Çift yönlü gösterge (port/starboard) ve bridge wing repeater’ları.
  - Kurs kayıt cihazı ile gyro heading ve dümen açısının sürekli kağıt/elektronik kaydı.
  - Fail-safe kontakları ile otopilot/steering failure alarmı.
- **Kullanım:** Pilotajda hassas manevralar, dümen makinesi testi, VDR beslemesi; seyrüsefer incelemesinde kayıtlı trendler üzerinden otopilot performans değerlendirmesi.
- **Bakım:** Potansiyometre ve transmitter hizasının kontrolü, mekanik sürtünme ve kablo bağlantılarının incelenmesi.
- **Operasyon adımları:** Sefer öncesi merkezleme testi, köprü kanadı göstergelerinin ana gösterge ile eşleşmesinin doğrulanması, VDR kayıt durumunun kontrolü.
- **Arıza/önlemler:** Gösterge bozulduğunda köprüüstü ve güverte arası telefon/dış anonsla dümen geri beslemesi sağlanır; farklı kanaldan (ECR lokal göstergesi) teyit alınır.

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
- **Arıza/önlemler:** Kabarcık perdesi veya kirlenme halinde değersiz okuma; SOG (GPS) ile çapraz kontrol; alternatif sensör olarak dönme sayacı veya motor devri takibi.

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
- **Arıza/önlemler:** Çok sığ sularda çoklu yansıma hataları; manuel menzil değiştirme; kağıt chart soundings ile kıyaslama; transdüser hava kabarcığı veya fouling durumunda limanda temizlik planlama.

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
- **Arıza/önlemler:** Parazit veya çoklu kopya mesajlarda filtreleme; DSC alarm testleri; Inmarsat terminalini yeniden başlatma; anten tuzaklarında oksitlenme kontrolü.

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
- **Arıza/önlemler:** Gürültüde squelch ayarı; anten veya koaksiyel arızasında yedek portable VHF kullanımı; acil durumda EPIRB/SART ile yedekleme; DSC distress verilemezse sesli mayday prosedürüne geçiş.

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
- **Arıza/önlemler:** Buzlanmada ısıtıcıları çalıştırma; veri kaybında manuel el anemometresi ve barometre kullanma; kablo ekranlamasında oksit kontrolü.

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
- **Arıza/önlemler:** Yanlış alarm durumunda sensör yerleşimi gözden geçirme; sistem arızasında manuel nöbet protokolüne geçiş; köprüüstü kamera/harici gözcü ile takviye.

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
- **Arıza/önlemler:** Alarmda kayıt sayacını ve kapsül bağlantısını kontrol; veri alınamıyorsa köprüüstü ses kayıtlarını manuel tutma; arıza uzun sürerse kaptan ve şirket IT birimine haber verme.

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
- **Arıza/önlemler:** Yanlış alarmda ilgili devreyi izole edip manuel gözetim artırma; sistem arızasında kritik alarmları lokal panelden takip; UPS arızasında makine kontrol odası ve güverteyle alternatif haberleşme sağlama.

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
- **Arıza/önlemler:** Veri akışı yoksa pin bağlantılarını ve seçili sensör çıkışlarını kontrol; gerekirse Bluetooth/4G PPU iç GPS kullanımı; dağıtım panelinde sigorta kontrolü.

---
Bu liste, gemi tipine bağlı olarak ek cihazlar (DP konsolu, buz radarı, su yoğunluğu sensörü, yük seviye göstergesi vb.) ile genişletilebilir. Ancak yukarıdaki aygıtlar, tipik bir ticaret gemisi köprüüstü operasyonlarının çekirdek ekipmanını temsil eder.
