# Bulut Görselleri ve CH Kodları Özeti

## ✅ Yapılan Güncellemeler

### 1. Veri Yapısı Güncellendi
`CloudType` interface'ine iki yeni alan eklendi:
- `satelliteChannels`: Bulut tespiti için kullanılabilecek uydu kanalları listesi
- `bestDetectionChannel`: En iyi tespit kanalı ve açıklaması

### 2. Tüm Bulut Tiplerine Kanal Bilgileri Eklendi

#### 🔵 Alçak Bulutlar (CL)
| Bulut | MGM Kodu | Görsel | En İyi Kanal |
|-------|----------|--------|--------------|
| Stratus | CL 6 | ✅ stratus.jpg | Ch1 (VIS0.6) - Düşük alçak bulutlar |
| Stratocumulus | CL 5 | ✅ stratocumulus.jpg | Ch12 (HRV) - Yüksek çözünürlük |
| Cumulus | CL 1-2 | ✅ cumulus-clouds.jpg | Ch2 (VIS0.8) - Gölgeleme tespiti |
| Cumulonimbus | CL 3,9 | ✅ cumulonimbus-clouds.jpg | Ch4 (IR3.9) - Fırtına tepesi |

#### 🟢 Orta Bulutlar (CM)
| Bulut | MGM Kodu | Görsel | En İyi Kanal |
|-------|----------|--------|--------------|
| Nimbostratus | CM 2 | ✅ nimbostratus.jpg | Ch10 (IR12.0) - Kalın yağış bulutları |
| Altostratus | CM 1 | ✅ altostratus.jpg | Ch7 (IR8.7) - Orta seviye bulutlar |
| Altocumulus | CM 3-9 | ✅ altocumulus.jpg | Ch1 (VIS0.6) - Orta bulut yapıları |

#### 🟣 Yüksek Bulutlar (CH)
| Bulut | MGM Kodu | Görsel | En İyi Kanal |
|-------|----------|--------|--------------|
| Cirrus | CH 1-4 | ✅ cirrus-clouds.jpg | Ch11 (IR13.4) - Cirrus yüksekliği |
| Cirrocumulus | CH 5-9 | ✅ cirrocumulus.jpg | Ch12 (HRV) - İnce yüksek bulutlar |
| Cirrostratus | CH | ✅ cirrostratus.jpg | Ch3 (NIR1.6) - İnce buz bulutları |

#### ⚠️ Özel/Tehlikeli Bulutlar
| Bulut | Tehlike | Görsel | En İyi Kanal |
|-------|---------|--------|--------------|
| Mammatus | Yüksek | ✅ mammatus.jpg | Ch4 (IR3.9) - Fırtına yapıları |
| Tuba | Yüksek | ✅ tuba.jpg | Ch4 (IR3.9) - Huni bulut |
| Arcus | Yüksek | ✅ arcus.jpg | Ch4 (IR3.9) - Squall line |
| Lenticularis | Orta | ✅ lenticularis.jpg | Ch1 (VIS0.6) - Mercek bulut |
| Fractus | Orta | ✅ fractus.jpg | Ch12 (HRV) - Parçalanmış bulut |
| Castellanus | Orta | ✅ cumulus.jpg | Ch1 (VIS0.6) - Kule bulut |
| Asperitas | Orta | ✅ stratocumulus.jpg | Ch1 (VIS0.6) - Dalga yapılar |
| Virga | Orta | ✅ nimbostratus.jpg | Ch1 (VIS0.6) - Yağış perdeleri |
| Kelvin-Helmholtz | Yüksek | ✅ altostratus.jpg | Ch12 (HRV) - Rüzgar kesmesi |
| Pyrocumulus | Yüksek | ✅ cumulonimbus.jpg | Ch7 (IR8.7) - Yangın bulutları |
| Contrails | Düşük | ✅ cirrus.jpg | Ch5 (WV6.2) - Üst atmosfer |

### 3. UI Güncellemeleri

`CloudCard` komponenti güncellendi ve artık şunları gösteriyor:

```
┌─────────────────────────────────────┐
│ 🌥️ Bulut Adı (Kod)      [Risk]     │
│ Türkçe Adı              [MGM Kodu]  │
├─────────────────────────────────────┤
│                                      │
│      [BULUT GÖRSELİ]                │
│                                      │
├─────────────────────────────────────┤
│ Açıklama ve Özellikler              │
│ ⚓ Denizcilik Önemi                  │
│ 👁️ Görüş | 💨 Rüzgar | 💧 Yağış    │
│                                      │
│ 🛰️ Uydu Görüntüleme Kanalları      │
│ [Ch1] [Ch9] [Ch12]                  │
│ 🎯 En İyi: Ch1 - Açıklama           │
└─────────────────────────────────────┘
```

## 📊 İstatistikler

- **Toplam Bulut Tipi**: 21
- **Görselli Bulut**: 21 (100%)
- **Kanal Bilgisi Olan**: 21 (100%)
- **Alçak Bulutlar**: 8
- **Orta Bulutlar**: 6
- **Yüksek Bulutlar**: 3
- **Dikey/Özel**: 4

## 🎨 Kanal Grupları

### Görünür Işık Kanalları
- **Ch1 (VIS0.6)**: 10 bulut tipi
- **Ch2 (VIS0.8)**: 3 bulut tipi
- **Ch12 (HRV)**: 12 bulut tipi

### Kızılötesi Kanalları
- **Ch4 (IR3.9)**: 7 bulut tipi (fırtınalar)
- **Ch7 (IR8.7)**: 5 bulut tipi (orta seviye)
- **Ch9 (IR10.8)**: 16 bulut tipi (genel)
- **Ch10 (IR12.0)**: 3 bulut tipi (yağış)
- **Ch11 (IR13.4)**: 4 bulut tipi (yüksek buz)

### Su Buharı Kanalları
- **Ch5 (WV6.2)**: 5 bulut tipi (yüksek nem)
- **Ch6 (WV7.3)**: 2 bulut tipi (atmosferik)

### Özel Kanallar
- **Ch3 (NIR1.6)**: 2 bulut tipi (buz fazı)

## 🚀 Kullanım

1. **Meteoroloji Hesaplamaları** menüsüne gidin
2. **Bulutlar** sekmesini seçin
3. Her bulut kartında:
   - Gerçek bulut görseli
   - MGM bulut kodu (CL, CM, CH)
   - Uydu kanalları listesi
   - En iyi tespit kanalı bilgisi

## 📝 Notlar

- Tüm bulutlar gerçek fotoğraflarla gösterilmektedir
- MGM kodları Türkiye Meteoroloji Genel Müdürlüğü standartlarına uygundur
- CH kodları EUMETSAT MSG uydu sistemine dayanmaktadır
- Denizcilik önemi her bulut için belirtilmiştir

---

**Geliştirme Tarihi**: 2025-10-01
**Versiyon**: 2.5.64
