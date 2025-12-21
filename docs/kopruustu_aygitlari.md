# Köprüüstü Aygıtları

Bu belge, modern bir gemide köprüüstünde bulunan temel cihazların her birini ayrıntılı biçimde açıklar. Her bölümde cihazın temel amacı, çalışma prensibi, sağladığı veriler, kullanım senaryoları, kalibrasyon/bakım gereklilikleri ve olası arıza durumlarında köprüüstü ekibinin uygulayabileceği önlemler yer alır.

## 1. Manyetik Pusula
- **Amaç ve prensip:** Dünyanın manyetik alanı ile hizalanarak gerçek yönü gösterir; sürekli güç gereksinimi yoktur.
- **Sağladığı veri:** Manyetik kerteriz, manyetik rota; manyetik sapma ve deviasyonla düzeltilir.
- **Kullanım:** Elektronik seyir sistemleri arızalandığında yedek yön referansı; pusula kerteriz alıcıyla görsel hedef takip.
- **Kalibrasyon/bakım:** Düzenli deviasyon seyri ile sapmaların grafiğe işlenmesi, sıvı seviyesinin ve kart okunuşunun kontrolü, kartın titreşim ve kabarcıklara karşı izlenmesi.
- **Arıza/önlemler:** Kart donması veya kabarcık oluşumu halinde pusula ışığı ısısı ile yavaşça giderme; manyetik etkileyiciler (telgraf, hoparlör vb.) uzaklaştırma.

## 2. Jiroskopik Pusula
- **Amaç ve prensip:** Dönen jiroskop diski ve Dünya’nın dönme etkisiyle gerçek kuzeye hizalanır; manyetik alanlardan etkilenmez.
- **Sağladığı veri:** Gerçek kerteriz ve rota, jiroskobik hız dönüştürmesi üzerinden kurs bilgisi; otopilot, radar ve ECDIS'e dağıtılır.
- **Kullanım:** Otomatik dümen kontrolü, radar yerleşimi, paralel yol izleme ve rotanın sabitlenmesi.
- **Kalibrasyon/bakım:** Günlük hata kontrolü (azimut düzeltmesi), jiroskop yağ seviyesi ve güç beslemesinin izlenmesi, üretici periyotlarında overhaul.
- **Arıza/önlemler:** Güç kaybında serbest jiroskop durur; manyetik pusula ve manuel dümenleme devreye alınır, dağıtım kutularındaki alarm lambaları kontrol edilir.

## 3. GPS Alıcısı
- **Amaç ve prensip:** GNSS uydularından alınan zaman/konum sinyalleriyle enlem, boylam, hız ve zaman bilgisi üretir.
- **Sağladığı veri:** WGS-84 konumu, COG (course over ground), SOG (speed over ground), UTC zamanı; ECDIS ve VDR’ye besleme.
- **Kullanım:** Seyir planı izleme, pozisyon fiksleri, hız kontrolü, otomatik günlük kayıtları, alarm eşikleri (anchor watch vb.).
- **Kalibrasyon/bakım:** Anten görüş alanının ve kablo bütünlüğünün kontrolü, saat sapmasının gözlenmesi, diferansiyel (DGPS/RTK) kaynaklarının doğrulanması.
- **Arıza/önlemler:** Uydu kaybında DR (dead reckoning) moduna geçiş; Loran, radar paralaksı veya görsel kerterizlerle konum teyidi.

## 4. ECDIS (Electronic Chart Display and Information System)
- **Amaç ve prensip:** Resmi ENC (Electronic Navigational Chart) verilerini sensör girdileriyle birleştirerek dinamik seyir gösterimi sağlar.
- **Sağladığı veri:** Gerçek zamanlı konum, rota hattı, güvenli derinlik/clearance alarmları, AIS hedefleri, radar overlay, yükseklik/draft tabanlı güvenli izler.
- **Kullanım:** Rota planlama ve izleme, çakışma önleme için çakışma alanlarının görselleştirilmesi, otomatik günlük, pilot plug entegrasyonu.
- **Kalibrasyon/bakım:** Haftalık/aylık ENC güncellemeleri, T&P (Temporary & Preliminary) ilanlarının uygulanması, sensör veri eşlemesinin (gyro/GPS/log) doğrulanması, UPS testi.
- **Arıza/önlemler:** Çift ECDIS konfigürasyonunda diğer üniteye geçiş; kâğıt harita veya raster yedeklerin hazırlanması; radar ve GPS üzerinden rotanın manuel izlenmesi.

## 5. Radar ve ARPA
- **Amaç ve prensip:** Mikrodalga pulslarının yansımasıyla mesafe ve kerteriz belirler; ARPA hedeflerin hareketini vektörel olarak hesaplar.
- **Sağladığı veri:** Menzil halkaları, değişen mesafe ölçümü, hedef CPA/TCPA, yağmur/deniz karartma ayarları, S-band ve X-band seçenekleri.
- **Kullanım:** Çarpışma önleme manevraları (COLREGS), dar kanal seyri, fener/şamandıra tanıma, kör alan tespiti, parallel indexing.
- **Kalibrasyon/bakım:** Heading line ayarı, range/VRM kalibrasyonu, GYRO/GPS girişi doğrulaması, magnetron çalışma saatlerinin takibi, anten/radar dom temizliği.
- **Arıza/önlemler:** Magnetron bitiş uyarısında yedek banda geçiş; heading girişi kesilirse relatif modda çalışma; ağır yağmurda darbe tekrarlama (pulse length) ayarlarının optimize edilmesi.

## 6. Otomatik Tanımlama Sistemi (AIS)
- **Amaç ve prensip:** VHF veri bağlantısıyla gemi kimlik ve seyir bilgilerini yayınlar ve alır; GPS ve gyro girişlerine dayanır.
- **Sağladığı veri:** MMSI, gemi adı, tip, boyut, rota/hız, konum, ETA, draught; diğer hedeflerin CPA/TCPA tahmini ECDIS/radar overlay ile birleştirilir.
- **Kullanım:** Trafik resmi oluşturma, VTS ile bilgi paylaşımı, gemi çağrı numarası doğrulaması, acil durum mesajlaşması (safety-related messaging).
- **Kalibrasyon/bakım:** Transceiver güç çıkışı kontrolü, anten SWR ölçümü, statik veri (IMO no, çağrı işareti, boyutlar) doğrulaması, Class A/B arayüz testleri.
- **Arıza/önlemler:** GPS kaybında SOG/COG tutarsızlıkları; manuel raporlama moduna geçiş; VHF anten ayrımını kontrol.

## 7. Otomatik Pilot (Otopilot)
- **Amaç ve prensip:** Gyro veya manyetik pusuladan aldığı rota verisine göre dümen servo motorlarını otomatik kumanda eder.
- **Sağladığı veri:** Tutulan rota, dümen açısı, sapma, darbe/sensör alarmı; çoğu sistemde adaptif veya ekonomi modu.
- **Kullanım:** Uzun süreli rotalarda sabit rota tutma, yakıt tasarrufu için kontrollü dümen hareketleri, track control ile ECDIS entegrasyonu.
- **Kalibrasyon/bakım:** Rudder limit ve counter-rudder ayarları, kontrol modlarının (NFU, FU, AUTO, TRACK) test edilmesi, servo yağı ve pompa gürültüsünün izlenmesi.
- **Arıza/önlemler:** Sapma büyükse gain ayarlarını düşürme; servo alarmında manuel FU/NFU moduna geçiş; jiroskop hatasında manyetik pusula ile çalıştırma.

## 8. Dümen Göstergesi ve ROTA/Dümen Kayıt Sistemi
- **Amaç:** Anlık dümen açısını ve komut-hareket uyumunu gösterir; bazı sistemlerde rotalama kaydı (course recorder) bulunur.
- **Kullanım:** Pilotajda hassas manevralar, dümen makinesi testi, VDR beslemesi.
- **Bakım:** Potansiyometre ve transmitter hizasının kontrolü, mekanik sürtünme ve kablo bağlantılarının incelenmesi.
- **Arıza/önlemler:** Gösterge bozulduğunda köprüüstü ve güverte arası telefon/dış anonsla dümen geri beslemesi sağlanır.

## 9. Hız Logu (Doppler veya Elektromanyetik)
- **Amaç ve prensip:** Sualtına gönderilen sinyallerin Doppler kayması veya elektromanyetik indüksiyonla gemi hızını ölçer.
- **Sağladığı veri:** STW (speed through water), bazı modellerde ileri/geri hız, su sıcaklığı; ECDIS ve otomatik pilot girişidir.
- **Kullanım:** Kısıtlı sularda hız kontrolü, pilot manevrası, yakıt optimizasyonu.
- **Kalibrasyon/bakım:** Transdüser temizliği, sıfır ayarı, kalibrasyon faktörü (k) doğrulaması; kuru havuzdan sonra yeniden kalibrasyon.
- **Arıza/önlemler:** Kabarcık perdesi veya kirlenme halinde değersiz okuma; SOG (GPS) ile çapraz kontrol; alternatif sensör olarak dönme sayacı veya motor devri takibi.

## 10. Echo Sounder (Sığlık Ölçer)
- **Amaç ve prensip:** Ses dalgalarının dipten yansıma süresiyle derinlik ölçer.
- **Sağladığı veri:** Anlık derinlik, dip yapısı hakkında ipuçları, yüksek/alçak alarm eşikleri.
- **Kullanım:** Kısıtlı sularda derinlik takibi, demirleme sahasında uygun bölge seçimi, kanal geçişi; VDR kaydı.
- **Kalibrasyon/bakım:** Draft ofseti ve ses hızının (tuzluluk/sıcaklık) kontrolü, transdüser temizliği.
- **Arıza/önlemler:** Çok sığ sularda çoklu yansıma hataları; manuel menzil değiştirme; kağıt chart soundings ile kıyaslama.

## 11. NAVTEX ve GMDSS Alıcıları
- **Amaç:** Denizcilik emniyet mesajlarının otomatik alımı (NAVTEX) ve küresel deniz haberleşmesi (GMDSS - VHF/MF/HF, Inmarsat). 
- **Sağladığı veri:** MSI, meteoroloji, seyrüsefer uyarıları, SAR yayınları; DSC alarmı; EGC SafetyNET mesajları.
- **Kullanım:** Seyir planında güncel seyir uyarılarını uygulama, acil durum alarmı, denizcilik bültenlerinin köprüüstüne yönlendirilmesi.
- **Kalibrasyon/bakım:** Alıcı frekans doğrulaması, anten ve topraklama kontrolleri, NAVTEX istasyon/servis kodu ayarlarının güncel tutulması.
- **Arıza/önlemler:** Parazit veya çoklu kopya mesajlarda filtreleme; DSC alarm testleri; Inmarsat terminalini yeniden başlatma.

## 12. VHF/DSC Telsiz ve İnterkom
- **Amaç:** Köprüüstü ile diğer gemiler, VTS ve iç haberleşme arasında iki yönlü ses/veri iletişimi sağlar.
- **Sağladığı veri:** Kanal seçimi, DSC distress/safety çağrıları, ATIS/duplex ayarları; bazı modellerde kaydedilmiş ses.
- **Kullanım:** Manevra koordinasyonu, çarpışma önleme iletişimi, iç anons ve telefon sistemleriyle bütünleşme.
- **Kalibrasyon/bakım:** Kanal gücü ve devresi testi, anten SWR ölçümü, batarya/UPS kontrolü, DSC test çağrıları.
- **Arıza/önlemler:** Gürültüde squelch ayarı; anten veya koaksiyel arızasında yedek portable VHF kullanımı; acil durumda EPIRB/SART ile yedekleme.

## 13. Anemometre ve Barometre
- **Amaç:** Rüzgar hızı/yönü ve atmosfer basıncını ölçer, meteorolojik durumun ve manevra etkilerinin izlenmesini sağlar.
- **Sağladığı veri:** Gerçek ve göreli rüzgar yönü/hızı, barometrik basınç trendi; ECDIS ve DP sistemlerine veri çıkışı.
- **Kullanım:** Pilotajda rüzgar etkisinin hesaplanması, yanaşma/ayrılma kararları, hava durumu tahmini, trim/derinlik değerlendirmesi.
- **Kalibrasyon/bakım:** Döner kap veya ultrasonik sensör temizliği, barometre doğrulaması, su geçirmezlik ve ısıtma elemanlarının kontrolü.
- **Arıza/önlemler:** Buzlanmada ısıtıcıları çalıştırma; veri kaybında manuel el anemometresi ve barometre kullanma.

## 14. BNWAS (Bridge Navigational Watch Alarm System)
- **Amaç:** Köprüüstü vardiyasının uyanıklığını denetler, belirli aralıklarla onay ister; cevap gelmezse alarmlar makine dairesi ve kamaralara yayılır.
- **Sağladığı veri:** Vardiya onay zaman çizelgesi, alarm logları, hareket sensörü tetikleri.
- **Kullanım:** Tek vardiya memurunun güvenliğini artırma, SOLAS gerekliliklerini karşılaması.
- **Kalibrasyon/bakım:** Zaman aralıklarının doğrulanması, buton ve pedalların işlev testi, VDR beslemesinin kontrolü.
- **Arıza/önlemler:** Yanlış alarm durumunda sensör yerleşimi gözden geçirme; sistem arızasında manuel nöbet protokolüne geçiş.

## 15. Seyir Veri Kaydedici (VDR/S-VDR)
- **Amaç:** Seyir, ses ve görüntü verilerini kazadan sonraki inceleme için kaydeder; kara kutu görevi görür.
- **Sağladığı veri:** Ses kayıtları, radar/ECDIS ekran görüntüleri, sensör verileri (GPS, gyro, hız logu, echo sounder), VHF iletişimleri.
- **Kullanım:** Kaza sonrası analiz, performans değerlendirme; bazı sistemler canlı veri erişimi sağlar.
- **Kalibrasyon/bakım:** Kazanım ve sensör giriş kontrolü, kapsül durum/akü testi, mikrofon ve cam temizliği, yıllık performans test raporu (APT).
- **Arıza/önlemler:** Alarmda kayıt sayacını ve kapsül bağlantısını kontrol; veri alınamıyorsa köprüüstü ses kayıtlarını manuel tutma.

## 16. Alarm ve Gözcü Paneli
- **Amaç:** Makine, yangın, seviye, kargo ve seyir sensör alarmlarını köprüüstünde birleştirir.
- **Sağladığı veri:** Alarm kodu, zaman damgası, bölge; bazı sistemlerde trend ve silme/hazırlama fonksiyonu.
- **Kullanım:** Kritik durumların erken tespiti, güvenli seyir; alarm onay protokolleri SOLAS’a göre uygulanır.
- **Kalibrasyon/bakım:** Alarm testleri, lamba/ses cihazı kontrolü, sensör döngülerinin belirli aralıklarla simülasyonu.
- **Arıza/önlemler:** Yanlış alarmda ilgili devreyi izole edip manuel gözetim artırma; sistem arızasında kritik alarmları lokal panelden takip.

## 17. Sökülebilir Pilot Plug
- **Amaç:** Pilotların kendi PPU (Portable Pilot Unit) cihazlarını gemi sensörlerine bağlamasına izin verir.
- **Sağladığı veri:** NMEA veri akışı (GPS, gyro, log, AIS), gerçek zamanlı rota ve manevra bilgisi.
- **Kullanım:** Pilotlar için hassas manevra desteği, ECDIS'e paralel gösterim, manevra sonrası analiz.
- **Kalibrasyon/bakım:** Konnektör pin temizliği, NMEA baud rate doğrulaması, galvanik izolasyon kontrolleri.
- **Arıza/önlemler:** Veri akışı yoksa pin bağlantılarını ve seçili sensör çıkışlarını kontrol; gerekirse Bluetooth/4G PPU iç GPS kullanımı.

---
Bu liste, gemi tipine bağlı olarak ek cihazlar (DP konsolu, buz radarı, su yoğunluğu sensörü, yük seviye göstergesi vb.) ile genişletilebilir. Ancak yukarıdaki aygıtlar, tipik bir ticaret gemisi köprüüstü operasyonlarının çekirdek ekipmanını temsil eder.
