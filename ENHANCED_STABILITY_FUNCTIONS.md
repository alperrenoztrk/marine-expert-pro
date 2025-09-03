# Enhanced Stability Calculation Functions

Bu dokümantasyon, stabilite hesaplama motoruna eklenen yeni işlevselliği açıklamaktadır.

## Eklenen Yeni Fonksiyonlar

### 1. Gelişmiş Hidrostatik Hesaplamalar

#### Güverte Kenarı Açısı Hesabı
```python
def calculateDeckEdgeAngle(geometry: ShipGeometry): number
```
- **Önceki**: Basit geometrik hesap
- **Yeni**: Freeboard ve gemi genişliğine dayalı fiziksel hesap
- **Formül**: `tan(φ_de) = (D - T) / (B/2)`

#### Sel Açısı Hesabı
```python
def calculateDownfloodingAngle(geometry: ShipGeometry): number
```
- **Önceki**: Sabit değer (20°)
- **Yeni**: Freeboard oranına dayalı dinamik hesap
- **Formül**: Freeboard/derinlik oranına göre 15-40° arası

#### Dengeleme Açısı Hesabı
```python
def calculateEqualizedAngle(geometry: ShipGeometry): number
```
- **Önceki**: Sabit değer (30°)
- **Yeni**: Gemi formu ve Cb katsayısına dayalı hesap

### 2. Hasar Stabilitesi Hesaplamaları

#### Yeni KG Hesabı
```python
def calculateNewKG(originalKG, floodedCompartments): number
```
- **Önceki**: Basit ortalama
- **Yeni**: Moment dengesi kullanarak doğru hesap
- **Formül**: `Σ(W × KG) / ΣW`

#### Kalan GM Hesabı
```python
def calculateResidualGM(geometry, newKG, floodedVolume): number
```
- **Önceki**: Basit KM - KG
- **Yeni**: Su girişi, draft artışı ve BM kaybı etkilerini içeren hesap

#### Çapraz Su Alma Süresi
```python
def calculateCrossFloodingTime(floodedCompartments): number
```
- **Önceki**: Sabit değer (20 dakika)
- **Yeni**: Torricelli yasası kullanarak fiziksel hesap
- **Formül**: `t = V / (A × √(2gh))`

### 3. Tahıl Stabilitesi (SOLAS VI)

#### Güvenlik Faktörü
```python
def calculateGrainSafetyFactor(grainShiftMoment, grainHeelAngle): number
```
- **Yeni**: SOLAS VI gereksinimlerine uygun hesap
- **Minimum**: 1.4 güvenlik faktörü

#### İzin Verilen Yatma Açısı
```python
def calculateGrainAllowableHeel(geometry): number
```
- **Yeni**: Güverte kenarı açısı ve SOLAS limitleri karşılaştırması
- **Limit**: 12° veya güverte kenarı açısı (hangisi küçükse)

#### SOLAS VI Uygunluk Kontrolü
```python
def checkGrainCompliance(criterion, safetyFactor): boolean
```
- **Yeni**: Kapsamlı SOLAS VI gereksinim kontrolü

### 4. Dinamik Stabilite Hesaplamaları

#### Yatmaya Enerji
```python
def calculateEnergyToHeel(stabilityData): number
```
- **Önceki**: Basit toplama
- **Yeni**: GZ eğrisi altındaki alan hesabı (yamuk yöntemi)
- **Formül**: `∫ GZ dφ`

### 5. Gelişmiş GZ Eğrisi Hesaplamaları

#### Güverte Kenarı Düzeltmesi
```python
def calculateDeckEdgeReduction(geometry, angle, deckEdgeAngle): number
```
- **Yeni**: Güverte kenarı batması sonrası GZ azalması
- **Etki**: Su hattı alanı kaybına dayalı düzeltme

#### Form Düzeltmeleri
- **Yeni**: Büyük açılar için sonlu genişlik etkisi
- **Formül**: `0.5 × B × sin²(φ) / T`

### 6. Serbest Yüzey Etkisi Hesaplamaları

#### Gelişmiş FSM Hesabı
```python
def calculateFreeSurfaceCorrections(tanks): FreeSurfaceCorrection[]
```
- **Önceki**: Basit hacim × TCG²
- **Yeni**: Gerçek tank geometrisi kullanarak `L × B³ / 12`
- **Sadece kısmi dolu tanklar için etki**

### 7. Yeni Analiz Fonksiyonları

#### Parametrik Yalpa Analizi
```python
def parametrik_yalpa_analizi(dalga_boyu, dalga_yuksekligi, gemi_hizi): dict
```
- **Yeni**: Parametrik yalpa riski değerlendirmesi
- **Kontroller**: Dalga boyu/gemi boyu oranı, periyot uyumu, dalga yüksekliği

#### Rüzgar Kriteri Analizi
```python
def ruzgar_kriteri_analizi(ruzgar_hizi, yanal_alan, ruzgar_kolu): dict
```
- **Yeni**: IMO rüzgar kriteri hesabı
- **Formül**: `P = 0.5 × ρ × v²`, `M = P × A × h`

#### Hasar Stabilite Analizi
```python
def hasar_stabilite_analizi(hasar_hacmi, hasar_kg, gecirgenlik): dict
```
- **Yeni**: Kapsamlı hasar stabilitesi değerlendirmesi
- **İçerik**: Su girişi, yeni KG, kalan GM, su alma süresi

#### Optimum Trim Hesabı
```python
def optimum_trim_hesapla(gemi_hizi, gemi_boyu): dict
```
- **Yeni**: Minimum direnç için optimum trim
- **Froude sayısına dayalı**: Fn < 0.15: %0.3, Fn > 0.2: %0.8

### 8. Streamlit UI Geliştirmeleri

#### Yeni Sekmeler
- **🌪️ Gelişmiş Analizler**: Parametrik yalpa, rüzgar kriteri, tahıl stabilite
- **🛡️ Hasar Stabilitesi**: Bölme hasarı, optimum trim

#### İnteraktif Hesaplamalar
- Gerçek zamanlı sonuç gösterimi
- Grafik visualizasyonlar
- Detaylı uyarı ve öneriler

### 9. TypeScript Enhancements

#### Yeni Servis Fonksiyonları
- `calculateParametricRolling()`: Parametrik yalpa riski
- `calculateOptimumTrim()`: Optimum trim hesabı
- `calculateCargoStability()`: Yükleme operasyonları stabilitesi
- `checkWeatherCriterion()`: Gelişmiş hava kriteri

#### Gelişmiş Fizik Modelleri
- Doğru moment dengesi hesaplamaları
- Gerçekçi çevresel kuvvet modelleri
- SOLAS/IMO standartlarına uygun kontroller

## Kullanım Örnekleri

### Python API Kullanımı

```python
from stability_calculator import EnineStabiliteHesaplama

# Temel stabilite hesabı
hesaplama = EnineStabiliteHesaplama(deplasman=10000, km=8.5, kg=6.5)

# Parametrik yalpa analizi
parametrik = hesaplama.parametrik_yalpa_analizi(
    dalga_boyu=100,
    dalga_yuksekligi=3,
    gemi_hizi=7.5
)

# Hasar stabilite analizi
hasar = hesaplama.hasar_stabilite_analizi(
    hasar_hacmi=200,
    hasar_kg=3.0,
    gecirgenlik=0.95
)

# Rüzgar kriteri
ruzgar = hesaplama.ruzgar_kriteri_analizi(
    ruzgar_hizi=25,
    yanal_alan=500,
    ruzgar_kolu=15
)
```

### TypeScript API Kullanımı

```typescript
import { HydrostaticCalculations } from './services/hydrostaticCalculations';

// Parametrik yalpa riski
const parametricRisk = HydrostaticCalculations.calculateParametricRolling(
  geometry,
  stabilityData,
  waveLength,
  waveHeight
);

// Optimum trim
const optimumTrim = HydrostaticCalculations.calculateOptimumTrim(
  geometry,
  speed,
  displacement
);

// Yükleme operasyonları stabilitesi
const cargoStability = HydrostaticCalculations.calculateCargoOperationStability(
  geometry,
  initialKG,
  cargoOperations
);
```

## Doğrulama ve Test

Tüm yeni fonksiyonlar aşağıdaki testlerden geçmiştir:

1. **Fiziksel Doğruluk**: Bilinen formüllerle karşılaştırma
2. **Sınır Değer Testleri**: Ekstrem değerlerde davranış
3. **SOLAS/IMO Uygunluk**: Uluslararası standartlarla uyum
4. **Entegrasyon Testleri**: Mevcut sistemle uyumluluk

## Performans İyileştirmeleri

- **Hızlı Hesaplama**: Optimize edilmiş algoritmalar
- **Bellek Verimliliği**: Gereksiz hesaplamaların önlenmesi
- **Hata Yönetimi**: Kapsamlı validasyon ve hata kontrolü
- **Kullanıcı Dostu**: Anlaşılır sonuç formatları

## Gelecek Geliştirmeler

1. **3D Görselleştirme**: GZ eğrisi ve stabilite analizi
2. **CFD Entegrasyonu**: Daha doğru hidrodinamik hesaplar
3. **Makine Öğrenmesi**: Optimizasyon önerileri
4. **Real-time Monitoring**: Canlı stabilite izleme

## Teknik Detaylar

### Hata Yönetimi
- Sıfıra bölme kontrolü
- Fiziksel sınır kontrolleri
- Geçersiz giriş validasyonu

### Performans
- O(n) karmaşıklığında hesaplamalar
- Bellek kullanımı optimize edilmiş
- Paralel hesaplama desteği

### Doğruluk
- ±0.1% doğruluk hedefi
- Bilinen test vakaları ile doğrulanmış
- Uluslararası standartlara uygun

Bu geliştirmelerle stabilite hesaplama sistemi artık endüstri standardında kapsamlı ve doğru hesaplamalar yapabilmektedir.