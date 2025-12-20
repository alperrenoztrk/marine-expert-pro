# Siyah Tema Uyumsuzlukları

Siyah/cyberpunk teması açıkken hâlâ aydınlık yüzeyler bırakan bölümler aşağıda tek tek listelenmiştir. Her madde, ilgili dosya ve satır numaralarıyla birlikte sorunun türünü açıklıyor.

- **Açılış sayfası (Index)**: Arka plan sabit olarak mavi-yeşil degrade ile geliyor ve CTA butonu da parlak turkuaz/beyaz kenarlıkla çiziliyor; siyah tema için alternatif tanımlı değil. `src/pages/Index.tsx` satır 136-213.
- **Makine Hesaplama kartı**: Kart kabuğu `bg-white/90 border-white/60` ile zorunlu açık panel üretiyor, dark varyantı yok. `src/pages/MachineCalculationsPage.tsx` satır 16-26.
- **Emisyon Hesaplamaları**: Ana kart, sekme listesi ve alt kartların tamamı `bg-white` varyantlarıyla geliyor; siyah temada geniş beyaz paneller bırakıyor. `src/pages/EmissionCalculationsPage.tsx` satır 118-135.
- **Tank Hesaplamaları**: Üst kart `bg-white/90 border-white/60` ve içerideki form bölümleri de açık tonlarla geliyor; siyah temada sayfanın büyük kısmı açık kalıyor. `src/pages/TankCalculations.tsx` satır 63-110.
- **COLREG PDF görüntüleyici**: PDF kapsayıcısı `bg-white` ile tanımlı, dark uyarlaması olmadığından ekranda geniş beyaz blok olarak görünüyor. `src/pages/COLREGPresentation.tsx` satır 71-94.
- **Stabilite Asistanı sohbet balonu**: Asistanın yanıt balonları `bg-white` olarak bırakılmış; koyu temada beyaz konuşma balonu parlıyor. `src/components/StabilityAssistantPopup.tsx` satır 181-184.

Bu alanların her biri için siyah temaya özel koyu arka planlar ve daha düşük parlaklıkta vurgu renkleri eklenerek tutarlı bir görünüm sağlanabilir.
