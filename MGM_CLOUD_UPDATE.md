# MGM (Meteoroloji Genel Müdürlüğü) Bulut Güncelleme Dokümantasyonu

## 🌤️ Genel Bakış

Maritime Calculator'daki bulut görselleri ve sınıflandırması, Türkiye Meteoroloji Genel Müdürlüğü'nün (MGM) resmi standartlarına göre güncellenmiştir.

## 📋 Yapılan Güncellemeler

### 1. Yeni Cloud Types Veri Yapısı (`cloud-types.ts`)

- **MGM Kodları**: Her bulut tipine MGM kod sistemi eklendi (Ci, Cu, Cb, vb.)
- **Türkçe İsimler**: Bulutların Türkçe karşılıkları eklendi
- **Detaylı Bilgiler**:
  - Yükseklik aralıkları (altitude)
  - Oluşum mekanizmaları (formation)
  - Denizcilik açısından önemi
  - Görüş mesafesi etkileri
  - Rüzgar ve yağış durumları

### 2. CloudImage Component Güncellemeleri

- **MGM Kodu Gösterimi**: Her bulut görselinde MGM kodu görüntüleniyor
- **Yükseklik Bilgisi**: Sol üst köşede yükseklik aralığı badge'i
- **Türkçe İsim**: Alt kısımda bulutun Türkçe adı
- **Gelişmiş Görsel Tasarım**: Hover efektleri ve gradient overlay'ler

### 3. Bulut Sınıflandırması (MGM Standartlarına Göre)

#### Alçak Bulutlar (0-2000m)
- **Stratus (St)** - CL 6 - Stratus
- **Cumulus (Cu)** - CL 1 - Kümülüs  
- **Stratocumulus (Sc)** - CL 5 - Stratokümülüs
- **Cumulonimbus (Cb)** - CL 9 - Kümülonimbüs

#### Orta Seviye Bulutlar (2000-6000m)
- **Altocumulus (Ac)** - CM 1 - Altokümülüs
- **Altostratus (As)** - CM 2 - Altostratus
- **Nimbostratus (Ns)** - CM 3 - Nimbostratus

#### Yüksek Bulutlar (6000-12000m)
- **Cirrus (Ci)** - CH 1 - Sirüs
- **Cirrocumulus (Cc)** - CH 2 - Sirokümülüs
- **Cirrostratus (Cs)** - CH 3 - Sirostratus

### 4. Denizcilik İçin Önem Seviyeleri

- **Default (Yeşil)**: Normal koşullar, güvenli seyir
- **Warning (Sarı)**: Dikkat edilmesi gereken koşullar
- **Danger (Kırmızı)**: Tehlikeli koşullar, acil önlem gerekli

### 5. Teknik İyileştirmeler

- Modüler component yapısı
- Tip güvenli TypeScript interface'leri
- Responsive tasarım
- Görsel yükleme ve hata yönetimi
- MGM kodlarına göre hızlı erişim fonksiyonları

## 🔗 Kaynaklar

- [MGM Bulutlar PDF](https://www.mgm.gov.tr/FILES/genel/kitaplar/bulutlar.pdf)
- WMO International Cloud Atlas standartları
- ICAO bulut kodlama sistemi

## 📊 Kullanım Örneği

```typescript
import { cloudTypes, cloudTypeByMGMCode } from '@/components/calculations/cloud-types';

// MGM koduna göre bulut tipini getir
const cumulusCloud = cloudTypeByMGMCode['Cu'];

// Tehlike seviyesine göre sıralı bulutlar
import { cloudTypesByDanger } from '@/components/calculations/cloud-types';
```

## 🚢 Denizcilik Açısından Kritik Bulutlar

1. **Cumulonimbus (Cb)**: En tehlikeli - fırtına, dolu, su hortumu riski
2. **Nimbostratus (Ns)**: Sürekli yağış, kötü görüş
3. **Stratus (St)**: Sis riski, çok düşük görüş
4. **Cirrostratus (Cs)**: 12-24 saat içinde hava bozulması

## 🎯 Gelecek Güncellemeler

- [ ] MGM'nin diğer meteorolojik sembollerinin entegrasyonu
- [ ] Bulut atlas görsellerinin yüksek çözünürlüklü versiyonları
- [ ] Animasyonlu bulut geçişleri
- [ ] AR (Artırılmış Gerçeklik) bulut tanıma özelliği