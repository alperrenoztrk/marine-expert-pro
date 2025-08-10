# 🚀 Lovable Deployment Status

## 📋 Son Güncellemeler
- **Tarih:** 2025-08-10
- **Sürüm:** v2.4.7
- **Durum:** ✅ Aktif - Reklam scriptleri varsayılan kapalı; sadece env ile aktif

## 🔧 Son Yapılan Değişiklikler

### 🧭 Kargo Modülü İyileştirmeleri (2025-08-10)
- Sekme tetikleri eklendi: Konteyner, Güçlendirme, Tahıl, Survey artık erişilebilir
- IMDG kontrolü genişletildi: yaygın sınıf çiftleri için ayrım uyarıları
- Lashing hesabı: sürtünme ve her iki bordaya dağılımı içeren gelişmiş hesap
- Stowage kontrolleri: basit tier ağırlık limit uyarıları

### 🌐 Dil Yönetimi ve Stabilite (2025-08-10)
- `window.location.reload()` kullanan akışlar kaldırıldı; yerinde çeviri uygulanıyor
- Manuel dil seçimi yapıldığında sistem diline otomatik geçiş kapatıldı; periyodik kontrol kaldırıldı
- AutoLanguageSelector: manuel seçim olduğunda prompt gösterilmiyor; seans başına en fazla bir kez öneriliyor

### 📢 Reklam Güvenliği (2025-08-10)
- AdSense loader sadece `VITE_ADS_ENABLED=true` ve geçerli `VITE_ADSENSE_CLIENT` olduğunda çalışır
- Reklam bileşenleri env kapalıysa render edilmez (gecikmeli script etkisi yok)

---

## Önceki Kayıtlar
- 2025-08-10 — v2.4.6: Auto-detect prompt session/manuel kısıtları
- 2025-08-10 — v2.4.5: Dil auto-switch manual iken devre dışı, interval kaldırıldı
- 2025-08-10 — v2.4.4: Rastgele reload engellendi (reload kaldırıldı)
- 2025-08-10 — v2.4.3: Kargo sekmeleri görünür, IMDG/lashing güçlendirildi
- 2025-08-07 — v2.3.9: Build rozeti
- 2025-08-07 — v2.3.8: Kargo optimizasyonu & stowage geliştirmeleri
- 2025-08-07 — v2.3.7: Kargo/Yükleme modülü genişletmesi (Dağılım, Konteyner, DG, Maliyet)
- 2025-08-07 — v2.3.6: Hydrostatics & Stability butonu geri eklendi
- 2025-08-07 — v2.3.5: Ana sayfada buton temizliği
- 2025-08-07 — v2.3.4: İleri Analiz Özeti UI
- 2025-08-07 — v2.3.3: Kapsamlı hidrostatik/stabilite seti, dil kalıcılığı
- 2025-08-07 — v2.3.2: Global dil değişimi, preview fix
- 2025-08-07 — v2.3.1: KN/Bonjean, gelişmiş FSC, GZ yardımcıları
- 2025-08-07 — v2.3.0: Gelişmiş hidrostatik/stabilite fonksiyonları

**🎯 Lovable otomatik olarak güncelleniyor! Değişiklikler ana dala işlendi ve yeni sürüm etiketi ile senkronize edildi.**