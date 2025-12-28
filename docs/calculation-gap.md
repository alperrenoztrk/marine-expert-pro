# Hesaplama Kapsam Haritası ve Eksik Analizi

## 1) Mevcut modüller (README + uygulama ekranları)

### README'de listelenen hesaplar
- GM / KM / KB / BM ilişkileri
- Yük operasyonları (yeni KG, GM değişimi)
- Meyil hesapları (GZ, meyil momenti)
- Kren/bumba operasyonları (kaldırma ile GM)
- Serbest yüzey etkisi (FSM, GM düzeltmesi)
- GZ eğrisi ve dinamik stabilite alanı
- SOLAS/IMO kriter kontrolleri
- Havuzda kritik GM / dock reaksiyonu
- Yaralı stabilite (duba örneği)

### Uygulamada hesaplama ekranları (özet)
- Stabilite: GM, GZ, GZ eğrisi, FSM, tahıl stabilitesi, IMO kriterleri, wind/weather, trim & list, loll, roll period, shear & bending
- Hidrostatik: TPC, MCT, draft survey, bonjean, hydrostatic coefficients
- Draft survey: loading, discharge, density, comparative, standard vb. alt modüller
- Navigation / Meteorology / Emission / Cargo / Tank / Machine: menü bazlı hesaplama sayfaları

> Not: Bu belge, hesaplama ekranlarının **modül düzeyi** kapsamasını özetler; her modülün alt hesap setleri ayrıca kontrol edilmelidir.

---

## 2) Denizcilik eğitim müfredatı gereksinimleri (Mevcut/Eksik)

| Hesaplama Grubu | Alt Başlık | Durum | Not |
| --- | --- | --- | --- |
| Enine stabilite | GM, KM, KG, KB/BM | **Mevcut** | Stabilite modülleri ve hidrostatikler içinde |
| Enine stabilite | GZ eğrisi, max GZ, vanishing angle | **Mevcut** | GZ eğrisi ekranı + analizler |
| Enine stabilite | KN cross-curves ve GZ dönüşümü | **Kısmi** | CSV ile KN entegrasyonu var, kapsam genişletilmeli |
| Enine stabilite | IMO/IS Code alan kriterleri | **Mevcut** | IMO kriter ekranında |
| Enine stabilite | Grain (tahıl) stabilitesi | **Mevcut** | Grain hesap modülü |
| Enine stabilite | Weather Criterion (rüzgar kriteri) | **Kısmi** | Basitleştirilmiş yaklaşım |
| Serbest yüzey | FSM ve ΔKG düzeltmeleri | **Mevcut** | FSM ekranı + FSC hesapları |
| Loll/heel | Angle of loll, heeling moment | **Mevcut** | Loll/Heel modülleri |
| Trim & list | MCT, trim değişimi, list | **Mevcut** | Trim/List modülleri |
| Draft survey | Mean draft, density correction | **Mevcut** | Draft survey alt modülleri |
| Hidrostatikler | TPC, WPA, displacement | **Mevcut** | Hydrostatic ekranı |
| Uzunlamasına stabilite | Bending/Shear, longitudinal moments | **Mevcut** | Shear/Bending modülü + longitudinal sayfa |
| Yaralı stabilite | Damage stability, permeabilities | **Eksik** | Probabilistic/compartment bazlı hesaplar yok |
| Yük dağılımı | Loading computer senaryoları | **Eksik** | LCG/VCG/TCG optimizasyonu yok |
| Stabilite deneyleri | Inclining experiment | **Kısmi** | Ekran var, ileri hesaplar eksik |
| Seakeeping | Rolling period (ileri) / damping | **Kısmi** | Basit yalpa periyodu var |
| Gemi geometrisi | Bonjean tablosu / cross-curves üretimi | **Kısmi** | Bonjean var, üretim/kalibrasyon sınırlı |
| Regülasyonlar | Load line, damage survival factor | **Eksik** | Load line & probabilistic survival hesapları yok |

---

## 3) Öncelik tablosu (Etki × Zorluk)

Etki (1–5): Eğitimde kritik olma, kullanıcı ihtiyacı, emniyet
Zorluk (1–5): Teknik karmaşıklık, veri ihtiyacı, doğrulama

| Eksik/Kısmi Modül | Etki | Zorluk | Öncelik | Gerekçe |
| --- | --- | --- | --- | --- |
| Probabilistic damage stability (compartment flooding) | 5 | 5 | **Yüksek** | SOLAS/IMO kritik, karmaşık fakat en yüksek emniyet etkisi |
| Load line & freeboard hesapları | 4 | 3 | **Yüksek** | Müfredatın temel parçası, veri ihtiyacı yönetilebilir |
| Loading computer / LCG-VCG-optim. | 4 | 4 | **Yüksek** | Operasyonel kullanım, etkisi yüksek |
| Weather criterion ileri versiyon | 3 | 3 | **Orta** | Mevcut basit model geliştirilmeli |
| Inclining experiment ileri raporlama | 3 | 3 | **Orta** | Eğitimde sık kullanılan deney |
| Seakeeping (damping/roll decay) | 3 | 4 | **Orta** | Formüller ve veri doğrulaması gerekir |
| Cross-curves üretimi (tam) | 3 | 4 | **Orta** | Veri yoğun, doğrulama gerektirir |
| Gemi bölme permeabiliteleri | 2 | 3 | **Düşük** | Damage stability için altyapı |

---

## 4) Önerilen sonraki adımlar

1. Damage stability modülü için veri şeması (compartment, permeability, flooding angle) oluştur.
2. Load line/freeboard için temel tablo ve kural setini yerel veri olarak paketle.
3. Loading computer senaryoları için LCG/VCG/TCG girdileri ve optimizasyon akışı tasarla.
4. Weather criterion hesaplarını IMO uyumlu adımlara genişlet.
5. Inclining experiment raporlama ekranına deney hata payı ve düzeltme katsayıları ekle.

Bu doküman, doğruluk ve eğitim odağına göre hazırlanmıştır; eksik modüller için formül ve kaynak doğrulaması ayrı süreçte yapılmalıdır.
