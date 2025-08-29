# Gemi Stabilite Hesaplamaları ve Formülleri

## 1. Metasentrik Yükseklik (GM) Hesabı

Geminin küçük açılardaki denge durumunu gösterir.

### Ana Formül:
```
GM = KM - KG
```

**Açıklama:**
- **KM** = Keel'den Metacenter'a mesafe
- **KG** = Keel'den ağırlık merkezi G'ye mesafe

### Alternatif Formül:
```
GM = (I/∇) - KG
```

**Açıklama:**
- **I** = Su hattı alanının enine atalet momenti
- **∇ (Nabla)** = Su altı hacmi (deplasman hacmi)

---

## 2. Doğrultucu Kol (GZ) Hesabı

Geminin yana yatma açısında (heel angle, φ) doğrultucu momenti yaratan kol uzunluğu.

### Küçük Açılar İçin:
```
GZ ≈ GM · sin(φ)
```

### Büyük Açılar İçin:
Hidrostatik eğrilerden bulunur.

---

## 3. Doğrultucu Moment (RM)

Geminin rüzgâr, dalga vb. kuvvetlere karşı koyma momentidir.

```
RM = Δ · GZ
```

**Açıklama:**
- **Δ (Delta)** = Deplasman (ton veya kN cinsinden)

---

## 4. Metasentrik Yarıçap (BM)

Su hattı şekline bağlıdır.

```
BM = I/∇
```

---

## 5. KG Hesabı (Dikey Ağırlık Merkezi)

Yüklerin gemi üzerindeki konumuna göre hesaplanır:

```
KG = Σ(wᵢ · KGᵢ) / Σwᵢ
```

**Açıklama:**
- **wᵢ** = yükün ağırlığı
- **KGᵢ** = yükün KG mesafesi

---

## 6. Doğrultucu Kol Eğrisi (GZ Curve)

Çeşitli yatma açılarında GZ değerleri hesaplanır ve eğri çizilir.

Geminin stabilite kriterleri (IMO kriterleri) bu eğriye göre değerlendirilir.

### Değerlendirilen Kriterler:
- Maksimum GZ açısı ve büyüklüğü
- GZ eğrisinin altında kalan alan (enerji rezervi)

---

## 7. Serbest Yüzey Düzeltmesi (Free Surface Effect)

Tanklardaki serbest sıvı, GM'yi düşürür.

```
GM_düzeltilmiş = GM - Σ(I_f)/∇
```

**Açıklama:**
- **I_f** = Tanktaki sıvının serbest yüzey atalet momenti

---

## 8. Stabilite Açısı (Angle of Vanishing Stability, AVS)

Geminin doğrultucu momentini kaybettiği ve alabora olduğu açı.

**Not:** GZ eğrisinden alınır → GZ = 0 olduğu açı.

---

## Önemli Notlar

- Bu hesaplamalar gemi güvenliği için kritik öneme sahiptir
- IMO (Uluslararası Denizcilik Örgütü) kriterlerine uygun olmalıdır
- Hesaplamalar sürekli güncellenmelidir (yük değişiklikleri, yakıt tüketimi vb.)
- Serbest yüzey etkisi özellikle kısmi dolulu tanklarda dikkate alınmalıdır

## Uygulama Alanları

- Gemi tasarımı
- Yük planlaması
- Deniz güvenliği
- Gemi operasyonları
- Klasifikasyon kuruluşları