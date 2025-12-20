# Uygulamadaki sayfa geçişi ve geri butonları

Aşağıdaki liste, uygulamada başka bir sayfayı açan veya geri dönüş sağlayan butonları ve bağlantıları özetler. Her madde butonun göründüğü bileşeni, görünen etiketi ve yönlendirdiği hedef sayfayı içerir.

## Ana sayfa ve widget gezgini
- **Ana Sayfa (`Index.tsx`)**: Üst kısımdaki ayarlar butonu kullanıcıyı `/settings` sayfasına götürür; ekranın soluna/sağına tıklama veya kaydırma hareketleriyle `/maritime-news` ve `/widgets` sayfalarına geçiş yapılır.【F:src/pages/Index.tsx†L80-L135】
- **Widget Sayfası (`WidgetPage.tsx`)**: Sağ üstteki ayarlar butonu `/settings` sayfasını açar. En soldaki sekmeden sola kaydırmak veya ekranın sol 35% alanına tıklamak ana sayfaya (`/`) geri döner.【F:src/pages/WidgetPage.tsx†L78-L128】

## Seyir (Navigation) akışı
- **Seyir hesaplama listesi (`NavigationCalculationsPage.tsx`)**: Üstteki “Seyir” geri butonu `/navigation` sayfasına döndürür.【F:src/pages/NavigationCalculationsPage.tsx†L17-L23】
- **Tekil seyir hesaplaması (`NavigationCalculation.tsx`)**: Alt kısımdaki “Listeye Dön” butonu `/navigation` sayfasına geri döner.【F:src/pages/NavigationCalculation.tsx†L1094-L1101】

## Stabilite akışı
- **Pratik stabilite menüsü (`StabilityPractical.tsx`)**: Üstteki “Stabilite” geri butonu `/stability` sayfasına döner; menüdeki üç büyük buton sırasıyla `/stability/practical/tank`, `/stability/practical/fwa` ve `/stability/practical/ghm` sayfalarını açar.【F:src/pages/StabilityPractical.tsx†L10-L30】
- **FWA pratik sayfası (`StabilityPracticalFWA.tsx`)**: Üstteki “Pratik Hesaplamalar” geri butonu `/stability/practical` sayfasına döndürür.【F:src/pages/StabilityPracticalFWA.tsx†L10-L19】
- **Duba/Tank pratik sayfası (`StabilityPracticalTank.tsx`)**: Üstteki “Pratik Hesaplamalar” geri butonu `/stability/practical` sayfasına döndürür.【F:src/pages/StabilityPracticalTank.tsx†L10-L19】
- **Stabilite formülleri (`StabilityFormulas.tsx`)**: Sayfanın başındaki geri butonu `/stability` sayfasına döner; içerik listesindeki butonlar farklı formül sayfalarını (ör. `/stability/formulas/giris`, `/stability/formulas/moment-kg` vb.) açar.【F:src/pages/StabilityFormulas.tsx†L13-L104】

## Makine ve emisyon akışı
- **Makine formülleri (`MachineFormulas.tsx`)**: Başlıktaki “Hesaplama Merkezi” geri butonu `/calculations` sayfasına döndürür.【F:src/pages/MachineFormulas.tsx†L12-L20】
- **Emisyon hesaplamaları (`EmissionCalculationsPage.tsx`)**: Üstteki “Geri” butonu kullanıcıyı `/calculations` sayfasına geri taşır.【F:src/pages/EmissionCalculationsPage.tsx†L18-L28】
- **Emisyon formülleri (`EmissionFormulas.tsx`)**: “Geri” butonu `/calculations` sayfasına döner.【F:src/pages/EmissionFormulas.tsx†L135-L142】

## Diğer öne çıkan bağlantılar
- **Ekonomi kartı (`EconomicCalculationsCard.tsx`)**: Kart üzerindeki buton `/economics` sayfasını açar.【F:src/components/EconomicCalculationsCard.tsx†L44-L49】
- **Çeşitli modül kartları (`module-card.tsx`)**: Kartların altındaki “Keşfet” veya “Modüle Git” bağlantıları kartta belirtilen rota için yeni sayfa açar; `showExternal` özelliği etkinse harici bağlantı simgesi görüntülenir.【F:src/components/ui/module-card.tsx†L137-L151】
- **Çekirdek hesaplama merkezindeki bölüm kartları (`CalculationsMenu.tsx`)**: Her bir hesaplama kategorisi için butonlar ilgili rota (örn. `/navigation/formulas`, `/navigation/calc/{id}`) veya bölüm sayfasını açar.【F:src/pages/CalculationsMenu.tsx†L24-L68】
