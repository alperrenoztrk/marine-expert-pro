## Stabilite (Kararlılık) – Kapsamlı Notlar

Bu doküman, kontrol ve sinyal sistemlerinde kararlılık (stabilite) konusunu bütüncül olarak ele alır. Sürekli-zaman ve ayrık-zaman LTI (Doğrusal Zamanla Değişmeyen) sistemler, doğrusal olmayan sistemler, Lyapunov yaklaşımları, frekans-bölgesi kriterleri, dayanıklı (robust) kararlılık ve uygulama odaklı ölçütler özetlenir.

### 1) Temel Kavramlar ve Tanımlar

- **İçsel (internal) kararlılık**: Durum uzayı modelinde `ẋ = f(x,u)` (veya ayrık-zaman `x[k+1] = f(x[k], u[k])`) için, `u = 0` alındığında denge noktasına yakın başlayan tüm trajektoryaların zamanda sınırlı kalması ve (asemptotik kararlılıkta) dengeye yaklaşması.
- **BIBO kararlılık (Bounded-Input Bounded-Output)**: Her sınırlı giriş için çıkışın sınırlı kalması. LTI sistemlerde dürtü yanıtının `L1` normu ile ilişkilidir.
- **Yerel vs. küresel kararlılık**: Kararlılığın sadece dengeye yakın bir bölgede mi (yerel) yoksa tüm uzayda mı (küresel) geçerli olduğu.
- **Marjinal/yarı kararlılık**: Trajektoryalar sınırlı kalır ancak dengeye yaklaşmayabilir (örn. sürekli-zamanda saf integratör). Ayrık-zamanda birim çember üzerindeki kutuplar (basit tekillik şartıyla) marjinal kararlılığa yol açar.
- **İçsel vs BIBO ilişkisi**: Minimal, gerçek-rasyonel, uygun LTI sistemlerde içsel kararlılık ile BIBO kararlılığı çoğunlukla eşdeğerdir. Kutuplan sıfırlanan iptaller (pole-zero cancellation) ve minimal olmama hâlleri bu eşdeğerliliği bozabilir.

### 2) Sürekli-Zaman LTI Sistemlerde Kararlılık

- **Kutup temelli koşul**: Transfer fonksiyonu `G(s) = N(s)/D(s)` için kararlılık, kapalı çevrimdeki (veya açık çevrim içsel kararlılıkta `A` matrisi) kutupların tamamının sol yarı düzlemde olmasıyla sağlanır: \(\Re\{p_i\} < 0\).
- **BIBO kararlılık**: Dürtü yanıtı `h(t)` `L1`-integrallenebilir ise (\(\int_0^\infty |h(t)| dt < \infty\)), BIBO kararlıdır.
- **Routh–Hurwitz testi**: Karakteristik polinom \(a_n s^n + \dots + a_0\) katsayılarından, sağ yarı düzlemde kutup olup olmadığını sayısal tabloyla belirler. Tüm `a_i > 0` gerek ama yeter değil; Routh tablosu satır başı elemanlarının işaretleri belirleyicidir.
- **Kök-yer eğrisi (root locus)**: Kazanç `K` değiştikçe kapalı çevrim kutuplarının düzlemdeki hareketini gösterir; kararlılık aralığı ve yedek kararlılık (relative stability) analizine yarar.

### 3) Ayrık-Zaman LTI Sistemlerde Kararlılık

- **Kutup temelli koşul**: Kararlılık için tüm kutuplar birim çemberin içinde olmalıdır: \(|z_i| < 1\).
- **BIBO kararlılık**: Dürtü yanıtı `h[k]` mutlak toplamlı ise (\(\sum_{k=0}^{\infty} |h[k]| < \infty\)), BIBO kararlıdır.
- **Jury testi / Schur kriteri**: Karakteristik polinomun birim çember içindeki köklerinin varlığını tablolarla/inegalitelerle test eder.
- **s-z ilişkisi**: \(z = e^{sT}\). Sol yarı düzlem, birim çember içine eşlenir. Bilinear (Tustin) dönüşümü Bode/Nyquist benzetimlerinde kullanılır.

### 4) Frekans-Bölgesi Kararlılık Kriterleri

- **Nyquist Kriteri (SISO)**: Açık çevrim \(L(s) = G(s)K(s)\) için Nyquist eğrisi, \(-1\) noktasının çevrelenme sayısı ile kutup sayıları arasındaki ilişki üzerinden kapalı çevrim kararlılığını belirler: \(N = Z - P\). Burada `P`, \(L(s)\) in sağ yarı düzlem kutup sayısı; `Z`, kapalı çevrim kutuplarının sağ yarı düzlemdeki sayısıdır.
- **Bode faz/genlik payları**: Faz payı ve genlik payı, yedek kararlılığı (robusta yakınlık) sezgisel olarak değerlendirir. Daha büyük paylar genelde daha sağlam kararlılık ve daha düşük aşım sağlar.
- **Nichols diyagramı**: Kapalı çevrim konturlarına göre kararlılık ve performans sınırlarını görselleştirir.

### 5) Lyapunov Yaklaşımları

- **Doğrudan yöntem**: Bir Lyapunov fonksiyonu \(V(x)\) seçilir. \(V(x)\) pozitif tanımlı ve türevi \(\dot V(x)\) negatif tanımlı ise (küresel) asemptotik kararlılık sağlanır. \(\dot V \le 0\) ve LaSalle Değişmezlik Teoremi ile de sonuç güçlendirilebilir.
- **LTI için LMI koşulları**:
  - Sürekli-zaman: \(A^\top P + P A \prec 0\), \(P \succ 0\) bulunursa asemptotik kararlı.
  - Ayrık-zaman: \(P - A^\top P A \succ 0\), \(P \succ 0\).
- **Barbalat Lemması**: \(\dot V\) süreklilik ve integrallenebilirlik koşullarında \(\dot V \to 0\) sonucunu sağlar; adaptif/izleme denetimlerinde sıklıkla kullanılır.
- **ISS (Input-to-State Stability)**: \(\dot V \le -\alpha(|x|) + \gamma(|u|)\) türünde bir eşitsizlikle girişin duruma etkisinin sınırlı kaldığı ve `u=0` iken asemptotik kararlılığın sağlandığı sınıf.

### 6) Doğrusal Olmayan Sistemlerde Kararlılık

- **Lineerleştirme ile yerel kararlılık**: \(ẋ = f(x)\) için denge noktasında \(A = \partial f/\partial x|_{x^*}\). `A` nın özdeğerleri sol yarı düzlemde ise denge yerel olarak asemptotik kararlı; sağ yarı düzlemde özdeğer varsa dengesizdir. Sıfır-gerçek kısım özdeğerlerde daha ileri analiz (merkez manifold) gerekir.
- **Lur’e tip sistemler ve tanımlayıcı fonksiyon (describing function)**: Bazı doğrusal olmayanlarda yaklaşık kararlılık/limit çevrim analizi için kullanılır.
- **Pasiflik**: Pasif sistemler negatif geri beslemede kararlılığı korur; pasiflik teoremleri ve uzlaşım (passivity index) kavramları güçlü araçlardır.

### 7) Dayanıklı (Robust) Kararlılık

- **Belirsizlik modelleri**:
  - Toplamsal/multiplikatif modellendirme hataları (\(G_\Delta(s) = G(s)(1+W_M(s)\Delta(s))\), \(|\Delta| \le 1\)).
  - Parametrik belirsizlik (katsayı aralıkları). Kharitonov polinomları SISO polinom belirsizliklerinde asgari test seti sağlar.
  - Yapısal belirsizlikler (blok diyagonali \(\Delta\)).
- **Küçük kazanç teoremi**: \(\|M\|_\infty \cdot \|\Delta\|_\infty < 1\) ise kapalı çevrim kararlıdır.
- **Yapısal tekil değer (µ-analizi)**: \(M\)–\(\Delta\) yapısında kararlılığı ölçmek için `µ` hesaplanır; `D-K` iterasyonu ile µ-sentezi denetleyici tasarımı yapılır.
- **Marjlar**: Kazanç, faz ve gecikme marjları; SISO için disk marjı (eşzamanlı kazanç+faz değişimine karşı).

### 8) Performans ve Göreli Kararlılık

- **İkinci dereceden yaklaşım**: \(\zeta\) (sönüm oranı) ve \(\omega_n\) (doğal frekans) ile aşım, yerleşme süresi, yükselme süresi tahmini:
  - Maksimum aşım \(M_p \approx e^{-\pi \zeta/\sqrt{1-\zeta^2}}\).
  - Yerleşme süresi (2%): \(T_s \approx 4/(\zeta \omega_n)\).
- **Kutup yerleşimi**: Geri besleme ile kutupları sol yarı düzlemde istenen bölgeye (örn. \(\Re\{s\} < -\sigma_0\) veya \(\zeta > \zeta_0\)) taşıma.

### 9) Pratik Test ve Adım Adım Yol Haritası

1. Model türünü belirleyin: Sürekli/ayrık, LTI/doğrusal olmayan, SISO/MIMO.
2. LTI ise kutupları bulun: Sürekli-zaman için \(\Re\{p_i\} < 0\), ayrık-zaman için \(|z_i| < 1\).
3. Giriş-çıkış modeli varsa BIBO için \(h(t) \in L1\) veya \(\sum |h[k]| < \infty\) kontrol edin.
4. Analitik testler: Routh–Hurwitz (sürekli), Jury/Schur (ayrık).
5. Geri besleme varsa Nyquist/Bode ile kararlılık ve marjları inceleyin.
6. Doğrusal olmayan ise lineerleştirip yerel kararlılığı değerlendirin; ardından Lyapunov/LaSalle ile küresel sonuçlar arayın.
7. Belirsizlik varsa küçük kazanç, Kharitonov, µ-analizi gibi robust yöntemleri uygulayın.

### 10) Örnekler

- **Sürekli-zaman ikinci dereceden sistem**: \(G(s) = \omega_n^2/(s^2 + 2\zeta\omega_n s + \omega_n^2)\). \(\zeta > 0\) ise kararlı; \(\zeta\) azaldıkça aşım artar.
- **Ayrık-zaman kutup örneği**: \(G(z) = z/(z - 0.6)(z - 0.8)\) kararlıdır, çünkü kutuplar 0.6 ve 0.8 birim çember içindedir.
- **Lineer olmayan**: \(ẋ = -x^3\) için \(V=\tfrac{1}{2}x^2\), \(\dot V = -x^4 \le 0\). LaSalle ile orijin küresel asemptotik kararlıdır.

### 11) Sık Karşılaşılan Hatalar

- Açık çevrim kararlılığını kapalı çevrim kararlılığı ile karıştırmak.
- Kutuplar sıfırlarla iptal edildiğinde içsel kararlılığı yanlış yorumlamak.
- Ayrık-zaman sistemlerde birim çember üzerindeki çoklu kutuplarda marjinal kararlılığı göz ardı etmek.
- Frekans-bölgesi marjlarını tek başına yeter koşul sanmak (performans ve kararlılık birlikte ele alınmalı).

### 12) Kaynaklar ve Anahtar Terimler

- Ogata, Dorf & Bishop, Khalil (Nonlinear Systems), Zhou–Doyle–Glover (Robust and Optimal Control).
- Anahtar terimler: Internal/BIBO, Routh–Hurwitz, Jury/Schur, Nyquist, Bode, Faz/Genlik Payı, Lyapunov, LaSalle, ISS, Pasiflik, Küçük Kazanç, Kharitonov, µ-analizi.

### 13) Kısa Özet

- LTI sürekli-zaman: \(\Re\{p_i\}<0\); ayrık-zaman: \(|z_i|<1\).
- BIBO: \(h(t)\in L1\) veya \(\sum |h[k]|<\infty\).
- Routh–Hurwitz/Jury testleri: hızlı kararlılık değerlendirmesi.
- Nyquist/Bode: geri besleme kararlılığı ve marjlar.
- Lyapunov/LaSalle: doğrusal olmayanlarda güçlü genel çerçeve.
- Robust: küçük kazanç, Kharitonov, µ-analizi ile belirsizlik altında güvence.

