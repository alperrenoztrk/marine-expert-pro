# Hidrostatik ve Stabilite Hesaplamaları

Bu dokümantasyon, kapsamlı gemi hidrostatik ve stabilite hesaplama sistemini açıklamaktadır.

## Genel Bakış

Sistem aşağıdaki ana hesaplama kategorilerini içerir:

### 1. Hidrostatik Temeller

#### Gemi Geometrisi ve Form Hesaplamaları
- **Uzunluk (LBP)**: Perpendicularlar arası uzunluk
- **Genişlik (B)**: Maksimum genişlik
- **Derinlik (D)**: Yan yükseklik
- **Draft (T)**: Su altı derinliği
- **Form Katsayıları**: Blok, su hattı, orta kesit, prizmatik katsayıları

#### Deplasman ve Draft Hesaplamaları
- **Deplasman (Δ)**: Toplam ağırlık (tonne)
- **Hacim Deplasmanı (∇)**: Su altı hacim (m³)
- **Su Hattı Alanı (WPA)**: Su seviyesindeki alan (m²)
- **Batık Hacim**: Su altında kalan hacim (m³)

#### Merkez Noktaları
- **LCB**: Boyuna yüzdürme merkezi
- **VCB**: Dikey yüzdürme merkezi
- **LCF**: Boyuna yüzme merkezi
- **VCF**: Dikey yüzme merkezi
- **KB**: Yüzdürme merkezi (keel'den yükseklik)
- **KM**: Metasentrik yükseklik
- **BM**: Metasentrik yarıçap
- **KG**: Ağırlık merkezi (keel'den yükseklik)
- **GM**: Metasentrik yükseklik

#### Hidrostatik Katsayılar
- **TPC**: Santimetre başına ton
- **MCT 1cm (veya MTC 1cm)**: 1 cm trim değiştiren moment
- **LCF**: Boyuna yüzme merkezi
- **WPA**: Su hattı alanı
- **KB**: Yüzdürme merkezi
- **KM**: Metasentrik yükseklik
- **BM**: Metasentrik yarıçap

#### Bonjean Eğrileri ve Kesit Alanları
- Her istasyonda kesit alanı hesaplaması
- Draft'a göre değişen alan eğrileri
- Moment hesaplamaları

#### Draft Survey Hesaplamaları
- Ön, orta, arka draft okumaları
- Ortalama draft hesaplaması
- Trim ve list düzeltmeleri
- Deplasman hesaplaması

### 2. Stabilite Analizi

#### Dinamik Stabilite Hesaplamaları
- **Yalpa Periyodu**: Doğal yalpa periyodu
- **Doğal Periyot**: Sistem doğal frekansı
- **Yatmaya Enerji**: Stabilite enerjisi
- **Stabilite İndeksi**: Stabilite kalite göstergesi
- **Güvenlik Marjı**: Stabilite güvenlik aralığı
- **Rezonans Kontrolü**: Rezonans risk analizi
- **Stabilite Aralığı**: Stabilite açı aralığı
- **Stabilite Kalitesi**: Stabilite kalite değerlendirmesi
- **GM Standartları**: GM uygunluk kontrolü

#### GZ Eğrisi Analizi
- **GZ Değerleri**: 0-90° arası GZ hesaplamaları
- **Dikleştirme Momenti**: Sağaltma momenti
- **Küçük Açılar Analizi**: φ < 15° stabilite
- **Büyük Açılar Analizi**: φ > 15° stabilite
- **Güverte Kenar Batması**: Güverte kenar açısı
- **Alan Hesaplaması**: GZ eğrisi altındaki alan
- **Dinamik Stabilite Analizi**: Enerji analizi
- **Dikleştirme Momenti Eğrisi**: Moment analizi
- **Stabilite Eğrisi Analizi**: Genel stabilite değerlendirmesi

### 3. Trim ve List Hesaplamaları

#### Trim Hesaplamaları
- **Trim Açısı**: Boyuna eğim açısı
- **Trim Değişimi**: Draft değişimi
- **MCT**: Trim değiştirme momenti
- **Trim Düzeltmeleri**: Draft okuma düzeltmeleri

#### List Hesaplamaları
- **List Açısı**: Enine eğim açısı
- **List Momenti**: Enine moment
- **List Düzeltmeleri**: Enine düzeltmeler

#### Draft Okuma Düzeltmeleri
- **Trim Düzeltmesi**: Boyuna düzeltme
- **List Düzeltmesi**: Enine düzeltme
- **Toplam Düzeltme**: Birleşik düzeltme

### 4. IMO Stabilite Kriterleri

#### Alan Hesaplamaları
- **0-30° Alan**: GZ eğrisi altındaki alan
- **0-40° Alan**: Genişletilmiş alan
- **30-40° Alan**: Fark alanı

#### Kriter Kontrolleri
- **Maksimum GZ**: En yüksek GZ değeri
- **Başlangıç GM**: İlk GM değeri
- **Alan Gereksinimi**: Minimum alan
- **IMO Uygunluk Kontrolü**: Kriter uygunluğu
- **Hava Kriteri**: Hava koşulları analizi
- **Stabilite Kriteri Analizi**: Genel değerlendirme

### 5. Kritik Açılar

#### Açı Hesaplamaları
- **List Açısı**: Enine eğim açısı
- **Loll Açısı**: Kararsız denge açısı
- **Kaybolma Açısı**: GZ sıfır olduğu açı
- **Güverte Kenar Açısı**: Güverte batma açısı
- **Su Alma Açısı**: Su alma başlangıç açısı
- **Eşitlenme Açısı**: Denge açısı
- **Kritik Açı Analizi**: Genel kritik açı değerlendirmesi

### 6. Hasar Stabilitesi

#### Su Alma Hesaplamaları
- **Su Alma Hacmi**: Hasar bölmesi hacmi
- **Yeni KG**: Hasar sonrası KG
- **Kalan GM**: Hasar sonrası GM
- **Çapraz Su Alma Süresi**: Su alma süresi
- **Su Alma Açısı**: Hasar su alma açısı
- **Eşitlenme Açısı**: Hasar denge açısı
- **Hayatta Kalma Faktörü**: Güvenlik faktörü
- **Hasar Stabilite Analizi**: Genel hasar analizi
- **Su Alma Hesaplamaları**: Detaylı su alma analizi
- **Bölme Analizi**: Hasar bölmesi değerlendirmesi

### 7. Tahıl Stabilitesi (SOLAS Ch. VI)

#### Tahıl Hesaplamaları
- **Tahıl Kayma Momenti**: Tahıl hareket momenti
- **Tahıl Yatma Açısı**: Tahıl eğim açısı
- **Tahıl Güvenlik Faktörü**: Güvenlik değerlendirmesi
- **Tahıl İzin Verilen Yatma**: Maksimum yatma
- **Tahıl Stabilite Kriteri**: Stabilite değerlendirmesi
- **Tahıl Uygunluk Kontrolü**: SOLAS uygunluğu
- **Tahıl Stabilite Analizi**: Genel tahıl analizi

### 8. Dinamik Stabilite

#### Dinamik Analiz
- **Yalpa Periyodu**: Doğal yalpa süresi
- **Doğal Periyot**: Sistem frekansı
- **Yatmaya Enerji**: Stabilite enerjisi
- **Stabilite İndeksi**: Kalite göstergesi
- **Güvenlik Marjı**: Güvenlik aralığı
- **Rezonans Kontrolü**: Frekans analizi
- **Stabilite Aralığı**: Açı aralığı
- **Stabilite Kalitesi**: Kalite değerlendirmesi
- **GM Standartları**: Standart uygunluk
- **GZ Eğrisi Analizi**: Eğri değerlendirmesi
- **GZ Eğrisi Üretimi**: Eğri oluşturma
- **Küçük Açılar Analizi**: φ < 15° analizi
- **Büyük Açılar Analizi**: φ > 15° analizi
- **Güverte Kenar Batması**: Kenar analizi
- **Alan Hesaplaması**: Eğri altı alan
- **Dinamik Stabilite Analizi**: Genel dinamik analiz
- **Dikleştirme Momenti Eğrisi**: Moment analizi
- **Stabilite Eğrisi Analizi**: Genel stabilite analizi

## Kullanım

### Temel Hesaplamalar

```typescript
import { HydrostaticCalculations } from './services/hydrostaticCalculations';

// Gemi geometrisi tanımlama
const geometry: ShipGeometry = {
  length: 100,        // m
  breadth: 20,        // m
  depth: 10,          // m
  draft: 6,           // m
  blockCoefficient: 0.7,
  waterplaneCoefficient: 0.8,
  midshipCoefficient: 0.9,
  prismaticCoefficient: 0.65,
  verticalPrismaticCoefficient: 0.75
};

// Deplasman hesaplama
const displacement = HydrostaticCalculations.calculateDisplacement(geometry);

// Merkez noktaları hesaplama
const centers = HydrostaticCalculations.calculateCenterPoints(geometry, kg);

// Stabilite analizi
const stability = HydrostaticCalculations.calculateStabilityData(geometry, kg);
```

### Kapsamlı Analiz

```typescript
// Tam stabilite analizi
const analysis = HydrostaticCalculations.performStabilityAnalysis(
  geometry,
  kg,
  weightDistribution,
  tanks,
  floodedCompartments,
  grainShiftMoment,
  grainHeelAngle
);
```

## Formüller

### Temel Hidrostatik Formüller

1. **Deplasman**: Δ = ∇ × ρ
2. **Hacim Deplasmanı**: ∇ = L × B × T × Cb
3. **Su Hattı Alanı**: WPA = L × B × Cw
4. **TPC**: TPC = WPA × ρ / 100
5. **MCT 1cm**: MCT₁cm ≈ (Δ × GML) / (100 × LBP)  *(yaklaşım; onaylı hidrostatik/stabilite kitapçığı esas alınır)*
6. **BM**: BM = Iyy / ∇
7. **KM**: KM = KB + BM
8. **GM**: GM = KM - KG

### Stabilite Formülleri

1. **GZ (Küçük Açılar)**: GZ = GM × sin(φ)
2. **GZ (Büyük Açılar)**: GZ(φ) = KN(φ) − KG · sin(φ)  *(KN: çapraz eğriler / hidrostatik tablolardan)*
3. **Dikleştirme Momenti**: RM = Δ × GZ  *(Δ ton ise ton·m; kN·m istenirse g ve birim dönüşümü açıkça tanımlanmalı)*
4. **Yalpa Periyodu**: T = 2π × k / √(GM × g)
5. **Doğal Periyot**: Tn = 2π × √(D / g)

### IMO Kriterleri

1. **0-30° Alan**: ≥ 0.055 m-rad
2. **0-40° Alan**: ≥ 0.090 m-rad
3. **30-40° Alan**: ≥ 0.030 m-rad
4. **Maksimum GZ**: ≥ 0.20 m
5. **Başlangıç GM**: ≥ 0.15 m

## Validasyon

Sistem aşağıdaki validasyon kontrollerini içerir:

### Gemi Geometrisi Validasyonu
- Pozitif değerler
- Mantıklı oranlar
- Katsayı sınırları (0-1)

### Ağırlık Dağılımı Validasyonu
- Pozitif ağırlıklar
- Geçerli merkez koordinatları
- Toplam ağırlık kontrolü

### Tank Verisi Validasyonu
- Kapasite sınırları
- Pozitif hacimler
- Geçerli yoğunluklar

## Hata Yönetimi

Sistem aşağıdaki hata durumlarını yönetir:

1. **Geçersiz Giriş Verileri**: Validasyon hataları
2. **Hesaplama Hataları**: Matematiksel hatalar
3. **Sınır Değer Hataları**: Fiziksel sınırlar
4. **Veri Eksikliği**: Gerekli verilerin eksikliği

## Performans

Sistem aşağıdaki performans özelliklerine sahiptir:

- **Hızlı Hesaplama**: Optimize edilmiş algoritmalar
- **Gerçek Zamanlı Güncelleme**: Anlık sonuçlar
- **Bellek Optimizasyonu**: Verimli veri yapıları
- **Ölçeklenebilirlik**: Büyük veri setleri için uygun

## Gelecek Geliştirmeler

1. **3D Görselleştirme**: Gemi modeli görselleştirme
2. **Gelişmiş Analiz**: CFD entegrasyonu
3. **Veritabanı Entegrasyonu**: Gemi verileri saklama
4. **Raporlama**: Detaylı rapor üretimi
5. **API Entegrasyonu**: Dış sistem entegrasyonu

## Lisans

Bu sistem açık kaynak lisansı altında geliştirilmiştir.

## İletişim

Teknik destek ve sorular için lütfen iletişime geçin.