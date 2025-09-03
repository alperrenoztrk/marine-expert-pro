"""
Enine Stabilite Hesaplama Test ve Örnek Dosyası
"""

from stability_calculator import (
    EnineStabiliteHesaplama, YukBilgisi, TankBilgisi,
    StabiliteRapor, meyil_momenti_hesapla
)
import math


def baslik(metin):
    """Test bölümü başlığı yazdırır"""
    print("\n" + "="*60)
    print(f" {metin} ")
    print("="*60)


def test_temel_hesaplamalar():
    """Temel stabilite hesaplamalarını test eder"""
    baslik("TEMEL STABİLİTE HESAPLAMALARI")
    
    # Test verileri
    deplasman = 10000  # ton
    km = 8.5  # m
    kg = 6.5  # m
    
    # Hesaplama nesnesi oluştur
    hesaplama = EnineStabiliteHesaplama(deplasman, km, kg)
    
    print(f"Deplasman (Δ): {deplasman} ton")
    print(f"KM: {km} m")
    print(f"KG: {kg} m")
    print(f"GM = KM - KG = {km} - {kg} = {hesaplama.gm} m")
    
    # Stabilite durumu
    if hesaplama.gm > 0:
        print(f"\n✓ Gemi STABİL (GM = {hesaplama.gm} m > 0)")
    else:
        print(f"\n✗ Gemi UNSTABIL (GM = {hesaplama.gm} m < 0)")
    
    # KB ve BM hesabı
    kb = 3.5  # m
    bm = hesaplama.hesapla_kb_bm(kb)
    print(f"\nKB = {kb} m olduğunda:")
    print(f"BM = KM - KB = {km} - {kb} = {bm} m")


def test_yuk_operasyonlari():
    """Yük operasyonları testleri"""
    baslik("YÜK OPERASYONLARI")
    
    deplasman = 10000
    km = 8.5
    kg = 6.5
    hesaplama = EnineStabiliteHesaplama(deplasman, km, kg)
    
    # Yük ekleme örneği
    yukler = [
        YukBilgisi(agirlik=200, kg=12.0),  # Güverte yükü
        YukBilgisi(agirlik=150, kg=2.0),   # Ambar yükü
        YukBilgisi(agirlik=-50, kg=5.0)    # Tahliye
    ]
    
    print("Yük Operasyonları:")
    toplam_yuk = 0
    for i, yuk in enumerate(yukler):
        if yuk.agirlik > 0:
            print(f"  {i+1}. Yükleme: {yuk.agirlik} ton, KG = {yuk.kg} m")
        else:
            print(f"  {i+1}. Tahliye: {abs(yuk.agirlik)} ton, KG = {yuk.kg} m")
        toplam_yuk += yuk.agirlik
    
    # Yeni KG hesapla
    yeni_kg = hesaplama.yeni_kg_hesapla(yukler)
    yeni_deplasman = deplasman + toplam_yuk
    yeni_hesaplama = EnineStabiliteHesaplama(yeni_deplasman, km, yeni_kg)
    
    print(f"\nÖnceki durum:")
    print(f"  Δ = {deplasman} ton, KG = {kg} m, GM = {hesaplama.gm} m")
    
    print(f"\nSonraki durum:")
    print(f"  Δ = {yeni_deplasman} ton, KG = {yeni_kg:.3f} m, GM = {yeni_hesaplama.gm:.3f} m")
    
    print(f"\nDeğişimler:")
    print(f"  ΔΔ = {toplam_yuk} ton")
    print(f"  ΔKG = {yeni_kg - kg:.3f} m")
    print(f"  ΔGM = {yeni_hesaplama.gm - hesaplama.gm:.3f} m")


def test_meyil_hesaplamalari():
    """Meyil açısı hesaplamaları"""
    baslik("MEYİL AÇISI HESAPLAMALARI")
    
    deplasman = 10000
    km = 8.5
    kg = 6.5
    hesaplama = EnineStabiliteHesaplama(deplasman, km, kg)
    
    # Yük hareketi ile meyil
    print("1. Yük Hareketi ile Meyil:")
    w = 100  # ton
    d = 10   # m (yatay mesafe)
    
    gz = hesaplama.gz_hesapla(w, d)
    meyil_acisi = hesaplama.meyil_acisi_hesapla(gz)
    meyil_momenti = meyil_momenti_hesapla(w, d)
    
    print(f"  Yük: {w} ton")
    print(f"  Yatay mesafe: {d} m")
    print(f"  Meyil momenti: {meyil_momenti} ton.m")
    print(f"  GZ = (w × d) / Δ = ({w} × {d}) / {deplasman} = {gz:.4f} m")
    print(f"  tan φ = GZ / GM = {gz:.4f} / {hesaplama.gm} = {gz/hesaplama.gm:.4f}")
    print(f"  φ = {meyil_acisi:.2f}°")
    
    # Sarkaç ile meyil ölçümü
    print("\n2. Sarkaç ile Meyil Ölçümü:")
    sarkac_boyu = 10  # m
    sapma = 0.5       # m
    
    sarkac_acisi = hesaplama.sarkac_ile_meyil_acisi(sapma, sarkac_boyu)
    print(f"  Sarkaç boyu: {sarkac_boyu} m")
    print(f"  Sapma: {sapma} m")
    print(f"  sin φ ≈ sapma / boy = {sapma} / {sarkac_boyu} = {sapma/sarkac_boyu}")
    print(f"  φ = {sarkac_acisi:.2f}°")


def test_bumba_kren():
    """Bumba/Kren operasyonları testi"""
    baslik("BUMBA/KREN OPERASYONLARI")
    
    deplasman = 10000
    km = 8.5
    kg = 6.5
    hesaplama = EnineStabiliteHesaplama(deplasman, km, kg)
    
    # Kren ile yük kaldırma
    w = 50        # ton
    h_yuk = 2     # m (yükün başlangıç yüksekliği)
    h_cunda = 25  # m (cunda yüksekliği)
    
    print(f"Kren Operasyonu:")
    print(f"  Yük ağırlığı: {w} ton")
    print(f"  Yük yüksekliği: {h_yuk} m")
    print(f"  Cunda yüksekliği: {h_cunda} m")
    
    gg1 = hesaplama.bumba_kren_gm_degisimi(w, h_cunda, h_yuk)
    yeni_gm = hesaplama.gm - gg1
    
    print(f"\nHesaplamalar:")
    print(f"  GG₁ = w × (h_cunda - h_yük) / Δ")
    print(f"  GG₁ = {w} × ({h_cunda} - {h_yuk}) / {deplasman}")
    print(f"  GG₁ = {gg1:.4f} m")
    print(f"  Yeni GM = {hesaplama.gm} - {gg1:.4f} = {yeni_gm:.4f} m")
    
    if yeni_gm > 0:
        print(f"\n✓ Operasyon güvenli (GM = {yeni_gm:.4f} m > 0)")
    else:
        print(f"\n✗ DİKKAT! Operasyon tehlikeli (GM = {yeni_gm:.4f} m < 0)")


def test_serbest_yuzey():
    """Serbest yüzey etkisi testi"""
    baslik("SERBEST YÜZEY ETKİSİ (FSM)")
    
    deplasman = 10000
    km = 8.5
    kg = 6.5
    hesaplama = EnineStabiliteHesaplama(deplasman, km, kg)
    
    # Tank bilgileri
    tanklar = [
        TankBilgisi(boy=20, en=10, yukseklik=5, doluluk_orani=0.5),  # %50 dolu
        TankBilgisi(boy=15, en=8, yukseklik=4, doluluk_orani=0.7),   # %70 dolu
        TankBilgisi(boy=10, en=6, yukseklik=3, doluluk_orani=1.0),   # %100 dolu (FSM yok)
        TankBilgisi(boy=12, en=7, yukseklik=3.5, doluluk_orani=0.0), # Boş (FSM yok)
    ]
    
    print("Tank Bilgileri:")
    toplam_fsm = 0
    for i, tank in enumerate(tanklar):
        print(f"\nTank {i+1}:")
        print(f"  Boyutlar: {tank.boy}m × {tank.en}m × {tank.yukseklik}m")
        print(f"  Doluluk: %{tank.doluluk_orani * 100:.0f}")
        
        if 0 < tank.doluluk_orani < 1:
            tank_fsm = (tank.boy * tank.en**3 * tank.sivi_yogunlugu) / 12
            print(f"  FSM = L × B³ × ρ / 12 = {tank.boy} × {tank.en}³ × {tank.sivi_yogunlugu} / 12")
            print(f"  FSM = {tank_fsm:.2f} ton.m")
            toplam_fsm += tank_fsm
        else:
            print(f"  FSM = 0 (tank {'tam dolu' if tank.doluluk_orani == 1 else 'boş'})")
    
    # GM azalması
    gg1_fsm = hesaplama.gm_kuculmesi_fsm(toplam_fsm)
    yeni_gm = hesaplama.gm - gg1_fsm
    
    print(f"\nToplam FSM: {toplam_fsm:.2f} ton.m")
    print(f"GG₁ = FSM / Δ = {toplam_fsm:.2f} / {deplasman} = {gg1_fsm:.4f} m")
    print(f"Düzeltilmiş GM = {hesaplama.gm} - {gg1_fsm:.4f} = {yeni_gm:.4f} m")


def test_yalpa_periyodu():
    """Yalpa periyodu hesaplaması"""
    baslik("YALPA PERİYODU HESAPLAMASI")
    
    deplasman = 10000
    km = 8.5
    kg = 6.5
    hesaplama = EnineStabiliteHesaplama(deplasman, km, kg)
    
    # Farklı gemi tipleri için C katsayıları
    gemi_tipleri = [
        ("Yolcu gemisi", 0.7, 25),
        ("Kuru yük gemisi", 0.8, 20),
        ("Tanker", 0.85, 30),
        ("Konteyner gemisi", 0.75, 28)
    ]
    
    print(f"GM = {hesaplama.gm} m")
    print("\nFarklı gemi tipleri için yalpa periyotları:")
    
    for tip, c, b in gemi_tipleri:
        T = hesaplama.yalpa_periyodu(c, b)
        print(f"\n{tip}:")
        print(f"  C = {c}, B = {b} m")
        print(f"  T = C × B / √GM = {c} × {b} / √{hesaplama.gm}")
        print(f"  T = {T:.2f} saniye")
        
        if T < 10:
            print(f"  → Sert yalpa (kısa periyot)")
        elif T > 20:
            print(f"  → Yumuşak yalpa (uzun periyot)")
        else:
            print(f"  → Normal yalpa karakteristiği")


def test_gz_egri_solas():
    """GZ eğrisi ve SOLAS kriterleri testi"""
    baslik("GZ EĞRİSİ VE SOLAS KRİTERLERİ")
    
    deplasman = 10000
    km = 8.5
    kg = 6.5
    hesaplama = EnineStabiliteHesaplama(deplasman, km, kg)
    
    # Örnek KN değerleri ve GZ hesaplaması
    kn_degerleri = {
        0: 0.0,
        10: 1.50,
        20: 3.00,
        30: 4.30,
        40: 5.20,
        50: 5.80,
        60: 6.00
    }
    
    print("GZ Eğrisi Hesaplaması:")
    print("φ (°) | KN (m) | KG×sin φ | GZ (m)")
    print("-" * 40)
    
    gz_egri = []
    for aci, kn in kn_degerleri.items():
        gz = hesaplama.kn_den_gz_hesapla(kn, aci)
        gz_egri.append((aci, gz))
        kg_sin = kg * math.sin(math.radians(aci))
        print(f"{aci:5} | {kn:6.2f} | {kg_sin:8.3f} | {gz:6.3f}")
    
    # SOLAS kriterleri kontrolü
    print("\nSOLAS Kriterleri Kontrolü:")
    kriterler = hesaplama.solas_kriterleri_kontrol(gz_egri)
    
    for kriter, durum in kriterler.items():
        sembol = "✓" if durum else "✗"
        print(f"  {sembol} {kriter}")
    
    # Alan hesabı örneği (0-30°)
    gz_0_30 = [gz for aci, gz in gz_egri if aci <= 30]
    if len(gz_0_30) >= 3:
        alan = hesaplama.dinamik_stabilite_alani_simpson(gz_0_30[:3], 10)
        print(f"\n0-30° arası alan (Simpson): {alan:.3f} m.rad")


def test_kritik_gm_havuz():
    """Havuzda kritik GM hesabı"""
    baslik("HAVUZDA KRİTİK GM HESABI")
    
    deplasman = 10000
    km = 8.5
    kg = 6.5
    hesaplama = EnineStabiliteHesaplama(deplasman, km, kg)
    
    # Havuz parametreleri
    mct_1cm = 150  # ton.m
    trim_cm = 50   # cm
    t = 80         # m (kıç topuk - F noktası mesafesi)
    
    print(f"Havuz Parametreleri:")
    print(f"  MCT (1cm): {mct_1cm} ton.m")
    print(f"  Trim: {trim_cm} cm")
    print(f"  t (mesafe): {t} m")
    
    # P kuvveti hesabı
    P = (mct_1cm * trim_cm) / t
    print(f"\nP kuvveti (Takarya tepkisi):")
    print(f"  P = MCT₁cm × Trim / t")
    print(f"  P = {mct_1cm} × {trim_cm} / {t}")
    print(f"  P = {P:.2f} ton")
    
    # Kritik GM
    gm_kritik = hesaplama.havuzda_kritik_gm(mct_1cm, trim_cm, t)
    print(f"\nKritik GM:")
    print(f"  GM_kritik = P × KM / Δ")
    print(f"  GM_kritik = {P:.2f} × {km} / {deplasman}")
    print(f"  GM_kritik = {gm_kritik:.3f} m")
    
    if hesaplama.gm < gm_kritik:
        print(f"\n✗ DİKKAT! Mevcut GM ({hesaplama.gm} m) < Kritik GM ({gm_kritik:.3f} m)")
        print("  Havuza alınma işlemi tehlikeli!")
    else:
        print(f"\n✓ Mevcut GM ({hesaplama.gm} m) > Kritik GM ({gm_kritik:.3f} m)")
        print("  Havuza alınma işlemi güvenli.")


def test_rapor_olusturma():
    """Stabilite raporu oluşturma"""
    baslik("STABİLİTE RAPORU")
    
    deplasman = 10000
    km = 8.5
    kg = 6.5
    hesaplama = EnineStabiliteHesaplama(deplasman, km, kg)
    
    ek_bilgiler = {
        "Gemi Adı": "M/V TEST VESSEL",
        "IMO No": "1234567",
        "Yükleme Durumu": "Kısmi Yüklü",
        "Tarih": "2024-01-15",
        "Liman": "İstanbul",
        "Kaptan": "John Doe"
    }
    
    rapor = StabiliteRapor.olustur(hesaplama, ek_bilgiler)
    print(rapor)


def test_gelismis_hesaplamalar():
    """Gelişmiş stabilite hesaplamalarını test eder"""
    baslik("GELİŞMİŞ STABİLİTE HESAPLAMALARİ")
    
    deplasman = 10000
    km = 8.5
    kg = 6.5
    hesaplama = EnineStabiliteHesaplama(deplasman, km, kg)
    
    # Parametrik yalpa analizi
    print("1. Parametrik Yalpa Analizi:")
    parametrik = hesaplama.parametrik_yalpa_analizi(
        dalga_boyu=100,  # m
        dalga_yuksekligi=3,  # m
        gemi_hizi=5  # m/s
    )
    
    print(f"  Dalga boyu: 100 m")
    print(f"  Dalga yüksekliği: 3 m")
    print(f"  Yalpa periyodu: {parametrik['yalpa_periyodu']:.2f} s")
    print(f"  Dalga periyodu: {parametrik['dalga_periyodu']:.2f} s")
    print(f"  Rezonans oranı: {parametrik['rezonans_orani']:.3f}")
    
    if parametrik['risk_var']:
        print("  ⚠️ PARAMETRİK YALPA RİSKİ VAR!")
    else:
        print("  ✓ Parametrik yalpa riski düşük")
    
    # Rüzgar kriteri analizi
    print("\n2. Rüzgar Kriteri Analizi:")
    ruzgar = hesaplama.ruzgar_kriteri_analizi(
        ruzgar_hizi=25,  # m/s
        yanal_alan=500,  # m²
        ruzgar_kolu=15   # m
    )
    
    print(f"  Rüzgar hızı: 25 m/s")
    print(f"  Rüzgar basıncı: {ruzgar['ruzgar_basinc']:.1f} N/m²")
    print(f"  Rüzgar kuvveti: {ruzgar['ruzgar_kuvveti']:.1f} kN")
    print(f"  Rüzgar yatırma açısı: {ruzgar['ruzgar_acisi']:.2f}°")
    print(f"  Güvenlik marjı: {ruzgar['guvenlik_marji']:.3f} m")
    
    if ruzgar['guvenli']:
        print("  ✓ Rüzgar koşullarında güvenli")
    else:
        print("  ⚠️ Rüzgar koşullarında riskli")
    
    # Tahıl stabilite analizi
    print("\n3. Tahıl Stabilite Analizi (SOLAS VI):")
    tahil = hesaplama.tahil_stabilite_analizi(
        tahil_kayma_momenti=500  # ton.m
    )
    
    print(f"  Minimum GM gereksinimi: {tahil['minimum_gm_gereksinimi']:.2f} m")
    print(f"  Mevcut GM: {tahil['mevcut_gm']:.2f} m")
    print(f"  Tahıl yatma açısı: {tahil['tahil_yatma_acisi']:.2f}°")
    print(f"  Güvenlik faktörü: {tahil['guvenlik_faktoru']:.2f}")
    
    if tahil['solas_uygun']:
        print("  ✓ SOLAS Bölüm VI gereksinimlerini karşılıyor")
    else:
        print("  ✗ SOLAS Bölüm VI gereksinimlerini karşılamıyor")


def test_hasar_ve_optimizasyon():
    """Hasar stabilitesi ve optimizasyon testleri"""
    baslik("HASAR STABİLİTESİ VE OPTİMİZASYON")
    
    deplasman = 10000
    km = 8.5
    kg = 6.5
    hesaplama = EnineStabiliteHesaplama(deplasman, km, kg)
    
    # Hasar stabilite analizi
    print("1. Hasar Stabilite Analizi:")
    hasar = hesaplama.hasar_stabilite_analizi(
        hasar_hacmi=200,  # m³
        hasar_kg=3.0,     # m
        gecirgenlik=0.95
    )
    
    print(f"  Hasar hacmi: 200 m³")
    print(f"  Giren su ağırlığı: {hasar['giren_su_agirligi']:.1f} ton")
    print(f"  Yeni deplasman: {hasar['yeni_deplasman']:.1f} ton")
    print(f"  Yeni KG: {hasar['yeni_kg']:.3f} m")
    print(f"  Kalan GM: {hasar['kalan_gm']:.3f} m")
    print(f"  Çapraz su alma süresi: {hasar['capraz_su_alma_suresi']:.1f} dakika")
    print(f"  Hayatta kalma faktörü: {hasar['hayatta_kalma_faktoru']:.3f}")
    
    if hasar['guvenli']:
        print("  ✓ Hasar sonrası gemi stabil kalıyor")
    else:
        print("  ⚠️ Hasar sonrası stabilite kritik!")
    
    # Optimum trim hesabı
    print("\n2. Optimum Trim Hesabı:")
    trim_opt = hesaplama.optimum_trim_hesapla(
        gemi_hizi=7.5,   # m/s (yaklaşık 15 knot)
        gemi_boyu=150    # m
    )
    
    print(f"  Gemi hızı: 7.5 m/s (≈15 knot)")
    print(f"  Froude sayısı: {trim_opt['froude_sayisi']:.3f}")
    print(f"  Optimum trim: {trim_opt['optimum_trim']:.2f} m")
    print(f"  Trim tipi: {trim_opt['trim_tipi']}")
    print(f"  Önerilen ön draft: {trim_opt['onerilen_on_draft']:.2f} m")
    print(f"  Önerilen arka draft: {trim_opt['onerilen_arka_draft']:.2f} m")
    print(f"  Direnç azalması: %{trim_opt['direnc_azalmasi_yuzde']:.1f}")


def main():
    """Ana test fonksiyonu"""
    print("ENİNE STABİLİTE HESAPLAMA TESTLERİ")
    print("=" * 60)
    
    # Tüm testleri çalıştır
    test_temel_hesaplamalar()
    test_yuk_operasyonlari()
    test_meyil_hesaplamalari()
    test_bumba_kren()
    test_serbest_yuzey()
    test_yalpa_periyodu()
    test_gz_egri_solas()
    test_kritik_gm_havuz()
    test_gelismis_hesaplamalar()
    test_hasar_ve_optimizasyon()
    test_rapor_olusturma()
    
    print("\n" + "="*60)
    print("TÜM TESTLER TAMAMLANDI")
    print("="*60)


if __name__ == "__main__":
    main()