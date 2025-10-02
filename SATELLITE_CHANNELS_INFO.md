# Meteorolojik Uydu Kanalları Bilgilendirme

Bu belge, meteoroloji görüntüleyicisine eklenen uydu kanal bilgilerini açıklamaktadır.

## 🛰️ Uydu Spektral Kanalları

Meteorolojik uydu görüntülemede kullanılan spektral kanallar (CH kodları), farklı dalga boylarında atmosferi gözlemler ve bulut tiplerinin tespitini sağlar.

### Kanal Listesi ve Kullanım Alanları

| Kanal | Dalga Boyu | Kullanım Alanı |
|-------|-----------|----------------|
| **Ch1 (VIS0.6)** | 0.56 – 0.71 μm | Görünür ışık - Yer yüzeyi, bulutlar, rüzgar alanları |
| **Ch2 (VIS0.8)** | 0.74 – 0.88 μm | Görünür ışık - Bulutlar ve rüzgar alanları |
| **Ch3 (NIR1.6)** | 1.50 – 1.78 μm | Yakın kızılötesi - Bulut fazı tespiti (buz/su) |
| **Ch4 (IR3.9)** | 3.48 – 4.36 μm | Kızılötesi - Fırtına tepeleri, gece görüntüleme |
| **Ch5 (WV6.2)** | 5.35 – 7.15 μm | Su buharı - Yüksek bulutlar, atmosferik kararsızlık |
| **Ch6 (WV7.3)** | 6.85 – 7.85 μm | Su buharı - Atmosferik kararsızlık |
| **Ch7 (IR8.7)** | 8.30 – 9.10 μm | Kızılötesi - Orta seviye bulutlar |
| **Ch8 (IR9.7)** | 9.38 – 9.94 μm | Kızılötesi - Ozon tespiti |
| **Ch9 (IR10.8)** | 9.80 – 11.80 μm | Kızılötesi - Bulut sıcaklıkları, genel görüntüleme |
| **Ch10 (IR12.0)** | 11.00 – 13.00 μm | Kızılötesi - Kalın yağış bulutları |
| **Ch11 (IR13.4)** | 12.40 – 14.40 μm | Kızılötesi - Cirrus yüksekliği |
| **Ch12 (HRV)** | 0.5 – 0.9 μm | Yüksek çözünürlüklü görünür - Detaylı bulut yapıları |

## 📊 Bulut Tiplerine Göre Kanal Kullanımı

### Alçak Bulutlar (0-2 km)
- **Stratus (CL 6)**: Ch1, Ch9, Ch12
- **Stratocumulus (CL 5)**: Ch1, Ch2, Ch12
- **Cumulus (CL 1-2)**: Ch1, Ch2, Ch12

### Orta Bulutlar (2-7 km)
- **Altostratus (CM 1)**: Ch7, Ch9, Ch5
- **Altocumulus (CM 3-9)**: Ch1, Ch7, Ch9

### Yüksek Bulutlar (5-13 km)
- **Cirrus (CH 1-4)**: Ch5, Ch6, Ch11
- **Cirrocumulus (CH 5-9)**: Ch1, Ch11, Ch12
- **Cirrostratus (CH)**: Ch5, Ch11, Ch3

### Dikey Gelişimli/Fırtına Bulutları
- **Cumulonimbus (CL 3,9)**: Ch4, Ch9, Ch10
- **Mammatus**: Ch4, Ch9, Ch12
- **Tuba**: Ch4, Ch9, Ch12
- **Arcus**: Ch1, Ch4, Ch12

## 🎯 Önerilen Kullanım Senaryoları

### Gündüz Görüntüleme
- **Ch1 (VIS0.6)** veya **Ch12 (HRV)**: Bulut yapılarının net görsel tespiti
- **Ch2 (VIS0.8)**: Kümülüs bulutlarının gölgeleme analizi

### Gece Görüntüleme
- **Ch4 (IR3.9)**: Fırtına tepeleri ve bulut sıcaklıkları
- **Ch9 (IR10.8)**: Genel bulut dağılımı
- **Ch10 (IR12.0)**: Yağış bulutları

### Bulut Fazı Analizi
- **Ch3 (NIR1.6)**: Buz/su fazı ayrımı (Cirrus gibi yüksek bulutlar için)

### Atmosferik Nem ve Kararsızlık
- **Ch5 (WV6.2)** ve **Ch6 (WV7.3)**: Su buharı dağılımı, jet akımları

### Fırtına İzleme
- **Ch4 (IR3.9)**: Konvektif bulut tepeleri
- **Ch9 (IR10.8)**: Bulut sıcaklık farkları
- **Ch11 (IR13.4)**: Yüksek seviye sirrus örtüsü

## 📱 Kullanıcı Arayüzü

Meteoroloji görüntüleyicisinde her bulut kartında artık şu bilgiler görüntülenmektedir:

1. **Bulut Görseli**: Gerçek bulut fotoğrafı
2. **MGM Kodu**: Türkiye Meteoroloji Genel Müdürlüğü bulut kodu (CL, CM, CH)
3. **Uydu Görüntüleme Kanalları**: Bu bulut tipini tespit etmek için kullanılabilecek spektral kanallar
4. **En İyi Kanal**: Optimal tespit için önerilen birincil kanal

## 🔍 Teknik Detaylar

Uydu kanalları, EUMETSAT MSG (Meteosat Second Generation) uydu sisteminin spektral bantlarına dayalıdır. Bu bantlar:

- **Görünür (VIS)**: Gündüz görüntüleme, yansıyan güneş ışığı
- **Yakın Kızılötesi (NIR)**: Bulut fazı ayrımı
- **Kızılötesi (IR)**: Gece/gündüz sıcaklık tespiti
- **Su Buharı (WV)**: Atmosferik nem dağılımı

## 📚 Kaynaklar

- Türkiye Meteoroloji Genel Müdürlüğü - Meteorolojik Uydular
- EUMETSAT - MSG Channels and Applications
- WMO International Cloud Atlas

---

**Not**: Bu bilgiler denizcilik seyir güvenliği için eğitim amaçlıdır. Gerçek zamanlı meteorolojik kararlar için resmi kaynaklara başvurunuz.
