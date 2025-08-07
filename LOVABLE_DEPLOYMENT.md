# 🚀 Lovable Deployment Status

## 📋 Son Güncellemeler
- **Tarih:** 2025-08-07
- **Sürüm:** v2.3.0
- **Durum:** ✅ Aktif - Gelişmiş Hidrostatik/Stabilite hesapları eklendi

## 🔧 Son Yapılan Değişiklikler

### 🚀 Gelişmiş Hidrostatik ve Stabilite Hesaplamaları (2025-08-07)
- **Yeni Fonksiyonlar:**
  - GZ eğrisi üretimi: `generateGZCurve(0–90°, adım)`
  - KN yaklaşık değeri: `calculateKNApprox(φ)`
  - Doğrultucu moment: `calculateRightingMoment(Δ, GZ)` (kN·m)
  - Hacim/Su hattı alanından draft: `calculateDraftFromVolumeAndWPA`
  - Ağırlık kaymasıyla list açısı: `calculateListAngleFromShift`
  - Loll açısı: `calculateAngleOfLoll`
  - Rüzgar momenti: `calculateWindMoment(P|v, A, h)` (N·m)
  - Rüzgar yatma açısı: `calculateWindHeelAngle`
  - Rüzgar doğrultucu kolu: `calculateWindHeelingArm`
  - Gelişmiş Serbest Yüzey Düzeltmesi (FSC): `calculateFreeSurfaceCorrectionsAdvanced` (Δ tabanlı)
- **Mevcut Modüllere Etki:**
  - `performStabilityAnalysis` artık gelişmiş FSC’yi kullanır
  - Dinamik stabilite ve GZ ile ilgili değerlendirmelerde daha detaylı çıktı desteği
- **Performans/Derleme:**
  - Prod build yeşil (Vite)

### 🧾 Notlar
- UI tarafında mevcut Stabilite modülleri (rüzgar ve hava kriterleri, list/loll, GZ vs.) yeni yardımcılarla uyumludur.
- Gerekli görülen yerlerde servis katmanı genişletildi; tip güvenliği korunmuştur.

---

**🎯 Lovable otomatik olarak güncelleniyor! Bu değişiklikler ana dala işlendiğinde Lovable ve bağlı dağıtımlar senkronize olur.**