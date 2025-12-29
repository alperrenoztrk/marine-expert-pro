# Hesaplama Boşlukları / Yaklaşımlar Listesi

Aşağıdaki liste, mevcut modüllerde kullanılan **basitleştirme/varsayımlar** ve **local-plane yaklaşımı** içeren hesapları özetler. Öncelik, **doğruluk riski** ve **kullanıcı etkisi** kriterlerine göre değerlendirilmiştir.

| Modül | Formül / Varsayım | Eksik / Doğruluk riski | Öncelik (Doğruluk riski / Kullanıcı etkisi) |
| --- | --- | --- | --- |
| `src/services/hydrostaticCalculations.ts` | **GZ (wall-sided, simplified)**: `GZ = (KM - KG)·sinφ - 0.5·B·sin²φ` | Gerçek gövde kesitleri, cross-curves ve büyük açı davranışı yok; yüksek açı stabilitesinde hata | **Yüksek** (Doğruluk: yüksek / Etki: yüksek) |
| `src/services/hydrostaticCalculations.ts` | **KN proxy (simplified)**: `KN ≈ KM·sinφ` | KN eğrileri yerine kaba yaklaşım; özellikle büyük açılarda ve farklı gövde formlarında hata | **Yüksek** (Doğruluk: yüksek / Etki: yüksek) |
| `src/services/hydrostaticCalculations.ts` | **Wind heeling moment (simplified)**: `M = 0.5·ρ_air·V²·A·h` (veya `M = P·A·h`) | Cd, rüzgâr profili/gust, üstyapı formu yok; rüzgâr momenti hafife/ağırlaşabilir | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/services/hydrostaticCalculations.ts` | **Downflooding angle (simplified)**: sabit `20°` | Gerçek açıklıklar, serbest borda, trim yok; kritik emniyet hesabında büyük sapma | **Yüksek** (Doğruluk: yüksek / Etki: yüksek) |
| `src/services/hydrostaticCalculations.ts` | **Equalized angle (simplified)**: sabit `30°` | Dolma/su alma geometrisi yok; eşitlenme açısı hatalı olabilir | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/services/hydrostaticCalculations.ts` | **Large-angle GZ (wall-sided approximation)**: `calculateLargeAngleGZ → calculateGZ` | Wall-sided yaklaşımın sınırları; büyük açılarda yanlış GZ | **Yüksek** (Doğruluk: yüksek / Etki: yüksek) |
| `src/services/hydrostaticCalculations.ts` | **Pendulum heel (approximation)**: `tanφ ≈ sinφ = deviation/length` | Küçük açı varsayımı; büyük açılarda hata artar | **Düşük** (Doğruluk: düşük / Etki: düşük) |
| `src/services/hydrostaticCalculations.ts` | **Pressed-up approximation (FSC)**: `fill ≥ 0.98` veya `≤ 0.02` → `fseFactor = 0.05` | Gerçek serbest yüzey eğrisi ve tank geometrisi yok; FSC hafife alınabilir | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/HydrostaticsStabilityCalculations.tsx` | **Drydock critical GM approximation**: `P = (MCT·Trim_cm)/LBP`, `ΔGM = (P·KM)/Δ` | Gerçek dock reaksiyon dağılımı yok; trim/geometri hassasiyeti yüksek | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/HydrostaticsStabilityCalculations.tsx` | **KB approximation**: `KB = T·(0.53 + 0.085·Cb)` | Gövde formuna özgü KB yok; farklı form/trimde sapma | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/HydrostaticsStabilityCalculations.tsx` | **I_T approximation**: `I_T = (L·B³·Cw)/12` | Su hattı şekli/flare etkileri yok; BM_T ve KM_T sapabilir | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/HydrodynamicsCalculations.tsx` | **Sabit çevresel değerler**: `g=9.81`, `ρ=1025`, `ν=1.19e-6`, `knots→m/s=0.514` | Gerçek çevre/akışkan koşulları değişken; direnç ve güç tahmini sapabilir | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/HydrodynamicsCalculations.tsx` | **Wake/Thrust deduction (simplified)**: `w = 0.25·Cb + 0.15`, `t = 0.15·Cb + 0.1` | Gemi/tekne formuna özel t-w ilişkisi yok | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/HydrodynamicsCalculations.tsx` | **Relative rotative efficiency**: sabit `%98` | Gerçek pervane/şaft etkileşimi yok | **Düşük** (Doğruluk: düşük / Etki: düşük) |
| `src/components/calculations/HydrodynamicsCalculations.tsx` | **Propeller KT/KQ approx**: `Kt=0.2+0.3J-0.1J²`, `Kq=0.025+0.015J` | Gerçek pervane serileri/çap/pitch bağımlılığı yok | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/HydrodynamicsCalculations.tsx` | **Heave response**: `heave = 0.7·H_s` | Gemi/denge/hız etkileri yok | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/HydrodynamicsCalculations.tsx` | **Pitch period**: `T_pitch = 0.8·T_wave` | Doğal frekans/rijitlik yok | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/HydrodynamicsCalculations.tsx` | **Slamming probability**: `min(100, slammingParam·50)`, eşik `>5` | Ochi modeli kaba; giriş parametreleri sınırlı | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/HydrodynamicsCalculations.tsx` | **Added resistance coeff**: `8·(kH)²·B²/L²·sin(β)` | Dalga yönü/RAO/yoğunluk etkileri yok | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/HydrodynamicsCalculations.tsx` | **Structural load factors**: `bending ∝ 0.1`, `torsion ∝ 0.05` | Gerçek yük dağılımı/klas kuralları yok | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/WeatherCalculations.tsx` | **Wind area (simplified)**: `A = L·freeboard` | Üstyapı geometrisi/şekil katsayısı yok | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/WeatherCalculations.tsx` | **Drag coefficient**: `C_d = 0.8` | Gemi tipi ve üstyapıya bağlı değişir | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/WeatherCalculations.tsx` | **Wind moment lever arm**: `h = freeboard/2` | Etki merkezi gerçek yüksekliği yok | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/WeatherCalculations.tsx` | **Leeway formula (simplified)**: `(wind/20)·sin(Δβ)·(leewayAngle/5)` | Rüzgâr alanı, sualtı alanı, hız/trim etkileri yok | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/WeatherCalculations.tsx` | **Current force components**: `currentSpeed·1000` (N ölçekleme varsayımı) | Birim/direnç katsayıları yok; kuvvet büyüklüğü belirsiz | **Yüksek** (Doğruluk: yüksek / Etki: orta) |
| `src/components/calculations/WeatherCalculations.tsx` | **Stability index**: `100 - 8·Beaufort - 10·Douglas` | Empirik/öğretici skor; gerçek stabilite ile sınırlı ilişki | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/WeatherCalculations.tsx` | **Wave slamming**: `H_s > L/20` ve `V > 8 kn` | Gemi tipi/baş bodoslama/deniz durumu etkileri yok | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/WeatherCalculations.tsx` | **Green water risk**: `H_s > 0.8·freeboard` | Güverte formu/baş yüksekliği yok | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/WeatherCalculations.tsx` | **Wind heel angle (simplified)**: `M / (Δ·g·(B/2))` | GM ve gerçek stabilite eğrisi yok; kaba tahmin | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/WeatherCalculations.tsx` | **Recommended speed/heading**: `V*(1-0.05·Beaufort)`, `±5°` | Operasyonel/denizcilik kuralları ve gemi türü yok | **Düşük** (Doğruluk: düşük / Etki: düşük) |
| `src/components/calculations/navigationMath.ts` | **Local-plane conversion**: `x = Δlon·60·cos(meanLat)`, `y = Δlat·60` | Küresel geometri yok; uzun mesafede ve yüksek enlemlerde hata artar | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/navigationMath.ts` | **Two-bearing fix (local-plane)** | Büyük mesafe, yüksek enlem, meridyen yakınında hata; kıyısal/ kısa mesafe için uygun | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/navigationMath.ts` | **Running fix (local-plane)** | Uzun run/okyanus aşırı; düzlem yaklaşımı sapma üretir | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/navigationMath.ts` | **Three-bearing least-squares fix (local-plane)** | Uzun mesafe/ yüksek enlemde hata büyür; LOP paralelliğinde kararsız | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/navigationMath.ts` | **Two-distance fix (circle intersection, local-plane)** | Küresel daire yerine düzlem daire; geniş mesafede hatalı kesişim | **Orta** (Doğruluk: orta / Etki: orta) |
| `src/components/calculations/navigationMath.ts` | **Cross-track distance (local-plane)** | Uzun leglerde büyük sapma; yüksek enlemde cos(lat) hassas | **Orta** (Doğruluk: orta / Etki: orta) |

