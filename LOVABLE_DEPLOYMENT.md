# 🚀 Lovable Deployment Status

## 📋 Son Güncellemeler
- **Tarih:** 2025-08-07
- **Sürüm:** v2.3.2
- **Durum:** ✅ Aktif - Global dil değişimi ve Preview hatası düzeltildi

## 🔧 Son Yapılan Değişiklikler

### 🌐 Global Dil Değişimi (2025-08-07)
- Tüm uygulama genelinde dil değişimi etkin
- `LanguageContext`:
  - `changeLanguage` çağrısında sayfa genelinde metin ve placeholder çevirisi uygulanır
  - `[data-translatable]` yoksa yaygın etiketlerde (h1–h6, p, button, a, label, span, div) sınırlı fallback çeviri yapılır
  - `applyTranslations()` dışarı açıldı (manuel tetikleme için)
- `Settings` sayfası tüm API destekli dilleri listeler

### 🧪 Preview Açılış Hatası Düzeltmesi (2025-08-07)
- Dil başlatmadaki ağır otomatik çeviri çağrıları yumuşatıldı
- Gereksiz reload fallback’i kaldırıldı; preview’de runtime hata riski azaltıldı

---

## Önceki Kayıtlar

- 2025-08-07 — v2.3.1: Yüksek doğruluk hidrostatik (KN, Bonjean), gelişmiş FSC, GZ yardımcıları
- 2025-08-07 — v2.3.0: Gelişmiş hidrostatik/stabilite fonksiyonları

**🎯 Lovable otomatik olarak güncelleniyor! Bu değişiklikler ana dala işlendiğinde Lovable ve bağlı dağıtımlar senkronize olur.**