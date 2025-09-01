# Göksel AR Overlay Özellikleri

## 🌟 Yeni Eklenen Özellikler

### 1. AR Gök Cismi Overlay
Kamera görüntüsü üzerinde gerçek zamanlı gök cisimlerinin konumlarını gösterir.

#### Desteklenen Gök Cisimleri:
- **Güneş** ☀️ - Altın sarısı, pulse animasyonu
- **Ay** 🌙 - Gümüş rengi, faz bilgisi ile
- **Gezegenler** 🪐 - Venüs, Mars, Jüpiter, Satürn (renkli)
- **Seyir Yıldızları** ⭐ - 15 ana seyir yıldızı (parlaklığa göre boyutlandırılmış)

#### Görsel Özellikler:
- Her gök cismi için özel renk ve animasyon
- Parlaklığa göre boyutlandırma (magnitude)
- Glow effect ve drop shadow
- Parlak yıldızlar ve gezegenler için pulse ring

### 2. Kontrol Paneli
- **AR Overlay Açma/Kapama**: Ana overlay kontrolü
- **İsim Etiketleri**: Gök cisimlerinin isimlerini göster/gizle
- **Sadece Seyir Yıldızları**: Sadece navigasyon yıldızlarını göster
- **Minimum Parlaklık**: Görünür yıldızların minimum magnitude değeri (0-6)

### 3. Gelişmiş Crosshair
- 30° aralıklarla derece işaretleri
- Merkezi kırmızı nokta
- Horizon ve vertical reference çizgileri
- Hassas hedefleme için optimize edilmiş

### 4. Gerçek Zamanlı Bilgiler
- **Pitch**: Cihazın ön-arka eğimi
- **Azimuth**: Pusula yönü (kuzeyden derece)
- **Roll**: Cihazın yan eğimi
- **Refraksiyon Düzeltmesi**: Otomatik atmosferik refraksiyon hesabı

### 5. Pusula Gülü
- Sağ alt köşede mini pusula
- Kardinal yönler (K-D-G-B)
- Kuzey göstergesi (kırmızı ok)
- Cihaz oryantasyonuna göre döner

### 6. Horizon Çizgisi
- Cihazın roll açısına göre dönen yeşil çizgi
- Gerçek horizon referansı
- Stabilizasyon için görsel yardım

### 7. Altitude Skalası
- Sol tarafta 0°-90° arası işaretler
- 10° aralıklarla bölümlenmiş
- Yükseklik ölçümü için referans

### 8. Gök Cismi Seçici
- Görünür tüm gök cisimlerinin listesi
- Tip, yükseklik ve azimuth bilgileri
- Magnitude değerleri (yıldızlar için)
- Seçili cisim için detaylı bilgiler

### 9. Nautical Twilight Uyarısı
- Yıldız gözlemi için ideal zaman tespiti
- Güneş -6° ile -12° arasında iken aktif
- Mavi renkli pulse animasyonlu uyarı

## 🎯 Kullanım Senaryoları

### Gündüz Kullanımı:
- Güneş pozisyonu takibi
- Gezegen gözlemi (Venüs, Mars vb.)
- Compass bearing kontrolü

### Alacakaranlık:
- En ideal yıldız gözlemi zamanı
- Hem güneş hem yıldızlar görünür
- Nautical twilight uyarısı aktif

### Gece Kullanımı:
- Ay pozisyonu takibi
- Seyir yıldızları gözlemi
- Gezegen pozisyonları

## 🔧 Teknik Özellikler

### Sensör Entegrasyonu:
- **DeviceOrientationEvent**: Alpha (azimuth), Beta (pitch), Gamma (roll)
- **Compass Integration**: Magnetic declination düzeltmesi
- **Real-time Updates**: 60 FPS güncelleme

### Hesaplama Algoritmaları:
- **Celestial Mechanics**: Hassas gök cismi pozisyon hesaplamaları
- **Coordinate Transformation**: Equatorial → Horizontal koordinat dönüşümü
- **Refraction Correction**: Atmosferik refraksiyon düzeltmesi
- **Sidereal Time**: Greenwich ve Local Sidereal Time hesaplamaları

### Performans Optimizasyonları:
- **useMemo**: Ağır hesaplamaların cache'lenmesi
- **useCallback**: Event handler optimizasyonu
- **Conditional Rendering**: Sadece gerekli elementlerin render edilmesi

## 📱 Mobil Uyumluluk

### iOS Desteği:
- DeviceOrientationEvent permission handling
- Safari uyumluluğu
- Touch-friendly interface

### Android Desteği:
- Chrome/WebView uyumluluğu
- Sensor API entegrasyonu
- Responsive design

## 🎨 Görsel Tasarım

### Renk Kodlaması:
- **Güneş**: Altın sarısı (#FFD700)
- **Ay**: Gümüş (#C0C0C0)
- **Venüs**: Sarı-turuncu (#FFC649)
- **Mars**: Kızıl (#CD5C5C)
- **Jüpiter**: Kahverengi-turuncu (#D2691E)
- **Satürn**: Bej (#FAD5A5)
- **Yıldızlar**: Spektral sınıfına göre renkli

### Animasyonlar:
- **Pulse**: Gök cisimleri için nefes alma efekti
- **Twinkle**: Yıldızlar için titreşim efekti
- **Ping**: Parlak cisimler için dalga efekti

## 🚀 Gelecek Geliştirmeler

### Planlanmış Özellikler:
1. **AI Horizon Detection**: Otomatik horizon tespiti
2. **Star Chart Integration**: Interaktif yıldız haritası
3. **Multi-body Sights**: Çoklu gök cismi ölçümü
4. **Cloud Integration**: Online almanac verileri
5. **Measurement History**: Ölçüm geçmişi ve analiz

Bu AR overlay özelliği, geleneksel sextant kullanımını modern teknoloji ile birleştirerek, denizcilik navigasyonunda devrim niteliğinde bir gelişme sağlamaktadır.