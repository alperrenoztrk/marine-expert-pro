"""
Gemi Enine Stabilite Hesaplamaları Modülü
Bu modül, gemi stabilitesi ile ilgili tüm hesaplamaları içerir.
"""

import math
from dataclasses import dataclass
from typing import List, Tuple, Optional


@dataclass
class YukBilgisi:
    """Yük bilgilerini tutan sınıf"""
    agirlik: float  # ton
    kg: float  # metre
    yatay_mesafe: float = 0  # metre (yatay hareket için)
    dikey_mesafe: float = 0  # metre (dikey hareket için)


@dataclass
class TankBilgisi:
    """Tank bilgilerini tutan sınıf"""
    boy: float  # metre
    en: float  # metre
    yukseklik: float  # metre
    doluluk_orani: float  # 0-1 arası
    sivi_yogunlugu: float = 1.025  # ton/m³ (deniz suyu için)


@dataclass
class HasarKompartman:
    """Hasarlı durum analizinde kullanılan kompartman bilgisi"""

    boy: float  # metre
    en: float  # metre
    yukseklik: float  # metre
    kg: float  # metre (kompartman hacim merkezinin KG değeri)
    doluluk_orani: float = 1.0  # 0-1 arası doluluk
    permeabilite: float = 0.95  # deniz suyu için tipik değer
    sivi_yogunlugu: float = 1.025  # ton/m³

    def hacim(self) -> float:
        """Hasarlı kompartmanın etkin su hacmini hesaplar"""

        return self.boy * self.en * self.yukseklik * self.doluluk_orani * self.permeabilite

    def agirlik(self) -> float:
        """Kompartmana dolan suyun ağırlığını hesaplar"""

        return self.hacim() * self.sivi_yogunlugu

    def fsm(self) -> float:
        """Kompartmandaki serbest yüzey momentini basitçe tahmin eder"""

        if not (0 < self.doluluk_orani < 1):
            return 0.0
        return (self.boy * (self.en ** 3) * self.sivi_yogunlugu * self.doluluk_orani) / 12


class EnineStabiliteHesaplama:
    """Enine stabilite hesaplamaları için ana sınıf"""
    
    def __init__(self, deplasman: float, km: float, kg: float):
        """
        Args:
            deplasman: Geminin deplasmanı (ton)
            km: Metasantr yüksekliği (metre)
            kg: Ağırlık merkezi yüksekliği (metre)
        """
        self.deplasman = deplasman
        self.km = km
        self.kg = kg
        self.gm = self.hesapla_gm()
    
    def hesapla_gm(self) -> float:
        """GM (Metasantr Yüksekliği) hesaplar"""
        return self.km - self.kg
    
    def hesapla_kb_bm(self, kb: float) -> float:
        """KM = KB + BM formülünden BM hesaplar"""
        return self.km - kb
    
    def yeni_kg_hesapla(self, yukler: List[YukBilgisi]) -> float:
        """
        Yükleme/tahliye sonrası yeni KG hesaplar
        
        Args:
            yukler: YukBilgisi listesi
            
        Returns:
            Yeni KG değeri (metre)
        """
        toplam_moment = self.deplasman * self.kg
        toplam_agirlik = self.deplasman
        
        for yuk in yukler:
            toplam_moment += yuk.agirlik * yuk.kg
            toplam_agirlik += yuk.agirlik
        
        return toplam_moment / toplam_agirlik
    
    def gm_degisimi_yuk_hareketi(self, w: float, d: float) -> float:
        """
        Yük hareketi veya yüklenmesi/tahliyesi sonucu GM değişimi
        
        Args:
            w: Yük miktarı (ton)
            d: Dikey veya yatay mesafe (metre)
            
        Returns:
            GG1 değeri (metre)
        """
        return (w * d) / self.deplasman
    
    def meyil_acisi_hesapla(self, gz: float) -> float:
        """
        Meyil açısını hesaplar
        
        Args:
            gz: Doğrultucu kol (metre)
            
        Returns:
            Meyil açısı (derece)
        """
        if self.gm == 0:
            return 0
        tan_phi = gz / self.gm
        return math.degrees(math.atan(tan_phi))
    
    def gz_hesapla(self, w: float, d: float) -> float:
        """
        GZ (Doğrultucu Kol) hesaplar
        
        Args:
            w: Yük miktarı (ton)
            d: Yatay mesafe (metre)
            
        Returns:
            GZ değeri (metre)
        """
        return (w * d) / self.deplasman
    
    def gz_kucuk_acilar(self, aci_derece: float, gm: Optional[float] = None) -> float:
        """
        Küçük açılar için GZ ≈ GM · sin(φ) bağıntısı
        
        Args:
            aci_derece: Meyil açısı (derece)
            gm: Opsiyonel GM değeri, verilmezse mevcut hesap kullanılır
            
        Returns:
            GZ değeri (metre)
        """
        gm_degeri = gm if gm is not None else self.gm
        if gm_degeri == 0:
            return 0.0
        phi_rad = math.radians(aci_derece)
        return gm_degeri * math.sin(phi_rad)
    
    def dogrultucu_moment(self, gz: float) -> float:
        """
        RM = Δ · GZ bağıntısıyla doğrultucu momenti hesaplar
        
        Args:
            gz: Doğrultucu kol (metre)
            
        Returns:
            Doğrultucu moment (ton.m)
        """
        return self.deplasman * gz
    
    def sarkac_ile_meyil_acisi(self, sapma: float, sarkac_boyu: float) -> float:
        """
        Sarkaç ile meyil açısı hesaplar
        
        Args:
            sapma: Sapma miktarı (metre)
            sarkac_boyu: Sarkaç boyu (metre)
            
        Returns:
            Meyil açısı (derece)
        """
        sin_phi = sapma / sarkac_boyu
        return math.degrees(math.asin(sin_phi))
    
    def bumba_kren_gm_degisimi(self, w: float, h_cunda: float, h_yuk: float) -> float:
        """
        Bumba/Kren operasyonlarında GM değişimi
        
        Args:
            w: Yük ağırlığı (ton)
            h_cunda: Cunda yüksekliği (metre)
            h_yuk: Yük yüksekliği (metre)
            
        Returns:
            GG1 değeri (metre)
        """
        return (w * (h_cunda - h_yuk)) / self.deplasman
    
    def havuzda_kritik_gm(self, mct_1cm: float, trim_cm: float, t: float) -> float:
        """
        Havuzda kritik GM hesabı
        
        Args:
            mct_1cm: 1 cm trim için moment (ton.m)
            trim_cm: Trim değeri (cm)
            t: Kıç topuk - F noktası mesafesi (metre)
            
        Returns:
            Kritik GM değeri (metre)
        """
        p = (mct_1cm * trim_cm) / t
        return (p * self.km) / self.deplasman
    
    def serbest_yuzey_etkisi(self, tanklar: List[TankBilgisi]) -> float:
        """
        Serbest yüzey etkisini hesaplar
        
        Args:
            tanklar: Tank bilgileri listesi
            
        Returns:
            Toplam FSM değeri (ton.m)
        """
        toplam_fsm = 0
        for tank in tanklar:
            if 0 < tank.doluluk_orani < 1:  # Kısmi dolu tanklar
                fsm = (tank.boy * tank.en**3 * tank.sivi_yogunlugu) / 12
                toplam_fsm += fsm
        return toplam_fsm

    def hasarli_durum_gm(self, kompartmanlar: List[HasarKompartman]) -> dict:
        """
        Hasarlı stabilite (damage stability) için GM ve KG güncellemelerini hesaplar.

        Basit yaklaşım: kompartmana giren suyun ağırlığı ve momenti eklenir, serbest
        yüzey etkisi için her kısmi dolu kompartman FSM olarak hesaba katılır.

        Args:
            kompartmanlar: Hasar gören kompartman bilgileri listesi

        Returns:
            dict: Yeni deplasman, KG, düzeltilmiş GM ve serbest yüzey düzeltmeleri
        """

        toplam_moment = self.deplasman * self.kg
        toplam_agirlik = self.deplasman
        toplam_fsm = 0.0

        for kompartman in kompartmanlar:
            w = kompartman.agirlik()
            toplam_moment += w * kompartman.kg
            toplam_agirlik += w
            toplam_fsm += kompartman.fsm()

        if toplam_agirlik == 0:
            yeni_kg = 0.0
            gm_duzeltilmis = 0.0
        else:
            yeni_kg = toplam_moment / toplam_agirlik
            gm_duzeltilmis = self.km - yeni_kg

        gg1_fsm = toplam_fsm / toplam_agirlik if toplam_agirlik else 0.0
        gm_damage = gm_duzeltilmis - gg1_fsm

        return {
            "yeni_deplasman": toplam_agirlik,
            "yeni_kg": yeni_kg,
            "gm_intact": gm_duzeltilmis,
            "toplam_fsm": toplam_fsm,
            "gg1_fsm": gg1_fsm,
            "gm_damage": gm_damage,
        }
    
    def gm_kuculmesi_fsm(self, fsm: float) -> float:
        """
        Serbest yüzey etkisi nedeniyle GM küçülmesi
        
        Args:
            fsm: Free Surface Moment (ton.m)
            
        Returns:
            GG1 değeri (metre)
        """
        return fsm / self.deplasman
    
    def yalpa_periyodu(self, c: float, b: float) -> float:
        """
        Yalpa periyodu hesaplar
        
        Args:
            c: Geminin blok katsayısına bağlı sabit
            b: Gemi genişliği (metre)
            
        Returns:
            Yalpa periyodu (saniye)
        """
        if self.gm <= 0:
            return float('inf')
        return c * b / math.sqrt(self.gm)
    
    def kn_den_gz_hesapla(self, kn: float, phi_derece: float) -> float:
        """
        KN değerinden GZ hesaplar
        
        Args:
            kn: KN değeri (metre)
            phi_derece: Meyil açısı (derece)
            
        Returns:
            GZ değeri (metre)
        """
        phi_rad = math.radians(phi_derece)
        return kn - self.kg * math.sin(phi_rad)
    
    def dinamik_stabilite_alani_simpson(self, gz_degerleri: List[float], 
                                       aci_araligi: float) -> float:
        """
        Simpson kuralı ile dinamik stabilite alanı hesaplar
        
        Args:
            gz_degerleri: GZ değerleri listesi
            aci_araligi: Açı aralığı (derece)
            
        Returns:
            Alan (m.rad)
        """
        if len(gz_degerleri) < 3 or len(gz_degerleri) % 2 == 0:
            raise ValueError("Simpson kuralı için tek sayıda (en az 3) değer gerekli")
        
        h = math.radians(aci_araligi)
        alan = gz_degerleri[0] + gz_degerleri[-1]
        
        for i in range(1, len(gz_degerleri) - 1):
            if i % 2 == 1:
                alan += 4 * gz_degerleri[i]
            else:
                alan += 2 * gz_degerleri[i]
        
        return (h / 3) * alan
    
    def yarali_stabilite_draft_degisimi(self, w: float, boy: float, en: float, 
                                       yarali_alan: float) -> float:
        """
        Yaralı stabilite durumunda draft değişimi (Duba örneği)
        
        Args:
            w: Su girişi ağırlığı (ton)
            boy: Gemi/duba boyu (metre)
            en: Gemi/duba eni (metre)
            yarali_alan: Yaralı bölge alanı (m²)
            
        Returns:
            Draft değişimi (metre)
        """
        net_alan = (boy * en) - yarali_alan
        if net_alan <= 0:
            return float('inf')
        return w / net_alan
    
    def solas_kriterleri_kontrol(self, gz_egri: List[Tuple[float, float]]) -> dict:
        """
        SOLAS stabilite kriterlerini kontrol eder
        
        Args:
            gz_egri: (açı, GZ) değerleri listesi
            
        Returns:
            Kriterlerin sağlanıp sağlanmadığı bilgisi
        """
        kriterler = {
            "GM >= 0.15m": self.gm >= 0.15,
            "GM >= 0.30m (dökme tahıl)": self.gm >= 0.30,
            "Alan 0-30°": False,
            "Alan 0-40°": False,
            "Alan 30-40°": False,
            "Max GZ >= 0.20m": False,
            "Max GZ açısı >= 25°": False
        }
        
        # GZ eğrisi analizi
        if gz_egri:
            max_gz = max(gz_egri, key=lambda x: x[1])
            kriterler["Max GZ >= 0.20m"] = max_gz[1] >= 0.20
            kriterler["Max GZ açısı >= 25°"] = max_gz[0] >= 25
            
            # Alan hesaplamaları (basitleştirilmiş)
            alan_0_30 = self._alan_hesapla(gz_egri, 0, 30)
            alan_0_40 = self._alan_hesapla(gz_egri, 0, 40)
            alan_30_40 = self._alan_hesapla(gz_egri, 30, 40)
            
            kriterler["Alan 0-30°"] = alan_0_30 >= 0.055
            kriterler["Alan 0-40°"] = alan_0_40 >= 0.090
            kriterler["Alan 30-40°"] = alan_30_40 >= 0.030
        
        return kriterler
    
    def gz_egri_olustur(self, acilar: List[float], 
                        kn_degerleri: Optional[List[float]] = None,
                        gm: Optional[float] = None) -> List[Tuple[float, float]]:
        """
        Verilen açılar için GZ eğrisi oluşturur
        
        Args:
            acilar: Derece cinsinden açı listesi
            kn_degerleri: Opsiyonel KN değerleri listesi (GM yerine kullanılır)
            gm: Opsiyonel GM değeri, verilmezse mevcut hesap kullanılır
            
        Returns:
            (açı, GZ) çiftleri listesi
        """
        if kn_degerleri is not None and len(acilar) != len(kn_degerleri):
            raise ValueError("Açı ve KN listeleri aynı uzunlukta olmalıdır")
        
        sirali_acilar = sorted(acilar)
        gz_listesi: List[Tuple[float, float]] = []
        
        if kn_degerleri:
            for aci, kn in sorted(zip(acilar, kn_degerleri), key=lambda x: x[0]):
                phi_rad = math.radians(aci)
                gz = kn - self.kg * math.sin(phi_rad)
                gz_listesi.append((aci, gz))
            return gz_listesi
        
        gm_degeri = gm if gm is not None else self.gm
        for aci in sirali_acilar:
            gz_listesi.append((aci, gm_degeri * math.sin(math.radians(aci))))
        return gz_listesi
    
    def gz_egri_analiz(self, gz_egri: List[Tuple[float, float]]) -> dict:
        """
        GZ eğrisi için maksimum değer ve alan analizleri üretir
        """
        if not gz_egri:
            return {
                "max_gz": 0.0,
                "max_gz_acisi": 0.0,
                "toplam_alan": 0.0,
                "alan_0_30": 0.0,
                "alan_0_40": 0.0,
                "alan_30_40": 0.0
            }
        
        sirali = sorted(gz_egri, key=lambda x: x[0])
        max_gz_acisi, max_gz = max(sirali, key=lambda x: x[1])
        
        toplam_alan = 0.0
        for (aci1, gz1), (aci2, gz2) in zip(sirali, sirali[1:]):
            toplam_alan += 0.5 * (gz1 + gz2) * math.radians(aci2 - aci1)
        
        return {
            "max_gz": max_gz,
            "max_gz_acisi": max_gz_acisi,
            "toplam_alan": toplam_alan,
            "alan_0_30": self._alan_hesapla(sirali, 0, 30),
            "alan_0_40": self._alan_hesapla(sirali, 0, 40),
            "alan_30_40": self._alan_hesapla(sirali, 30, 40)
        }
    
    def avs_hesapla(self, gz_egri: List[Tuple[float, float]]) -> Optional[float]:
        """
        GZ = 0 olduğu açıyı (Angle of Vanishing Stability) döner
        """
        if not gz_egri:
            return None
        
        sirali = sorted(gz_egri, key=lambda x: x[0])
        onceki_aci, onceki_gz = sirali[0]
        
        if onceki_gz == 0:
            return onceki_aci
        
        for aci, gz in sirali[1:]:
            if gz == 0:
                return aci
            if onceki_gz > 0 and gz < 0:
                oran = onceki_gz / (onceki_gz - gz)
                return onceki_aci + oran * (aci - onceki_aci)
            onceki_aci, onceki_gz = aci, gz
        
        return None
    
    def _alan_hesapla(self, gz_egri: List[Tuple[float, float]], 
                      baslangic: float, bitis: float) -> float:
        """
        GZ eğrisi altındaki alanı hesaplar (yamuk yöntemi)
        
        Args:
            gz_egri: (açı, GZ) değerleri listesi
            baslangic: Başlangıç açısı (derece)
            bitis: Bitiş açısı (derece)
            
        Returns:
            Alan (m.rad)
        """
        filtreli = [(aci, gz) for aci, gz in gz_egri if baslangic <= aci <= bitis]
        if len(filtreli) < 2:
            return 0
        
        alan = 0
        for i in range(len(filtreli) - 1):
            aci1, gz1 = filtreli[i]
            aci2, gz2 = filtreli[i + 1]
            # Yamuk alan formülü
            alan += 0.5 * (gz1 + gz2) * math.radians(aci2 - aci1)
        
        return alan


class StabiliteRapor:
    """Stabilite hesaplama sonuçlarını raporlayan sınıf"""
    
    @staticmethod
    def olustur(hesaplama: EnineStabiliteHesaplama, 
                ek_bilgiler: Optional[dict] = None) -> str:
        """
        Stabilite raporu oluşturur
        
        Args:
            hesaplama: EnineStabiliteHesaplama nesnesi
            ek_bilgiler: Ek bilgiler sözlüğü
            
        Returns:
            Rapor metni
        """
        rapor = f"""
====================================
GEMİ ENİNE STABİLİTE RAPORU
====================================

TEMEL BİLGİLER:
--------------
Deplasman (Δ): {hesaplama.deplasman:.2f} ton
KM: {hesaplama.km:.3f} m
KG: {hesaplama.kg:.3f} m
GM: {hesaplama.gm:.3f} m

STABİLİTE DURUMU:
----------------
"""
        
        if hesaplama.gm > 0:
            rapor += f"✓ Gemi STABİL (Pozitif GM = {hesaplama.gm:.3f} m)\n"
        else:
            rapor += f"✗ Gemi UNSTABLE (Negatif GM = {hesaplama.gm:.3f} m)\n"
        
        if hesaplama.gm >= 0.15:
            rapor += "✓ SOLAS minimum GM kriteri sağlanıyor (GM ≥ 0.15 m)\n"
        else:
            rapor += "✗ SOLAS minimum GM kriteri SAĞLANMIYOR (GM < 0.15 m)\n"
        
        if ek_bilgiler:
            rapor += "\nEK BİLGİLER:\n"
            rapor += "-----------\n"
            for anahtar, deger in ek_bilgiler.items():
                rapor += f"{anahtar}: {deger}\n"
        
        return rapor


# Yardımcı fonksiyonlar
def derece_radyan(derece: float) -> float:
    """Dereceyi radyana çevirir"""
    return math.radians(derece)


def radyan_derece(radyan: float) -> float:
    """Radyanı dereceye çevirir"""
    return math.degrees(radyan)


def meyil_momenti_hesapla(w: float, d: float) -> float:
    """
    Meyil momentini hesaplar
    
    Args:
        w: Yük ağırlığı (ton)
        d: Yatay mesafe (metre)
        
    Returns:
        Meyil momenti (ton.m)
    """
    return w * d


# 1) GİRİŞ – Trim/Hogging/Sagging ve ortalama draft
def ortalama_draft_sonlar(d_f: float, d_a: float) -> float:
    """Sonlardan ortalama draft dM = (dF + dA)/2 (metre)."""
    return (d_f + d_a) / 2.0


def hogging_sagging_tespit(d_f: float, d_m: float, d_a: float) -> str:
    """(dF + dA)/2 ile ölçülen dM karşılaştırması ile Hogging/Sagging tespiti.

    Returns: "Hogging" | "Sagging" | "Düz"
    """
    ort = (d_f + d_a) / 2.0
    if ort > d_m:
        return "Hogging"
    if ort < d_m:
        return "Sagging"
    return "Düz"


# 2) ENİNE – Temel bağıntılar zaten sınıf içinde mevcut (GM=KM-KG, KM=KB+BM)
# Ek yardımcılar
def gm_from_km_kg(km: float, kg: float) -> float:
    return km - kg


def bm_from_inertia(inertia_m4: float, displaced_volume_m3: float) -> float:
    """BM = I / ∇ bağıntısı (metre)."""
    if displaced_volume_m3 == 0:
        return 0.0
    return inertia_m4 / displaced_volume_m3


def gm_from_inertia(inertia_m4: float, displaced_volume_m3: float, kg_m: float) -> float:
    """GM = (I / ∇) − KG alternatif bağıntısı (metre)."""
    return bm_from_inertia(inertia_m4, displaced_volume_m3) - kg_m


def bm_from_km_kb(km: float, kb: float) -> float:
    return km - kb


def moment_from_weight_and_kg(weight_t: float, kg_m: float) -> float:
    """Moment = Ağırlık × KG mesafesi (t·m)."""
    return weight_t * kg_m


def delta_gm_shift(w: float, d: float, deplasman: float) -> float:
    """ΔGM = w × d / Δ (metre)."""
    if deplasman == 0:
        return 0.0
    return (w * d) / deplasman


def gz_from_shift(w: float, y: float, deplasman: float) -> float:
    """GZ = w × y / Δ (metre)."""
    if deplasman == 0:
        return 0.0
    return (w * y) / deplasman


# 3) BOYUNA DENGE HESAPLARI
def delta_trim(total_moment_t_m: float, mct: float) -> float:
    """ΔTrim = Toplam Moment / MCT. Birimler MCT ile tutarlı döner."""
    if mct == 0:
        return 0.0
    return total_moment_t_m / mct


def paralel_batma_cm(w_ton: float, tpc_ton_per_cm: float) -> float:
    """Paralel batma/çıkma (cm) = w / TPC."""
    if tpc_ton_per_cm == 0:
        return 0.0
    return w_ton / tpc_ton_per_cm


def lcg_from_moment(total_moment_t_m: float, total_displacement_t: float) -> float:
    """LCG = Toplam Moment / Toplam Deplasman (metre)."""
    if total_displacement_t == 0:
        return 0.0
    return total_moment_t_m / total_displacement_t


def trim_from_bg(displacement_t: float, bg_m: float, mct: float) -> float:
    """Trim = Δ × BG / MCT. Birimler MCT ile tutarlı döner."""
    if mct == 0:
        return 0.0
    return (displacement_t * bg_m) / mct


def draft_degisimleri_lcf(delta_trim_val: float) -> Tuple[float, float]:
    """LCF mastoride varsayımıyla ΔdF = -ΔTrim/2, ΔdA = +ΔTrim/2 döner."""
    return (-delta_trim_val / 2.0, +delta_trim_val / 2.0)


def draft_duzeltmesi(mesafe_m: float, trim_m: float, lbd_m: float) -> float:
    """Düzeltme = (Mesafe × Trim) / LBD (metre)."""
    if lbd_m == 0:
        return 0.0
    return (mesafe_m * trim_m) / lbd_m


# 4) DRAFT SURVEY
def mmm_draft(d_f: float, d_m: float, d_a: float) -> float:
    """MMM = (dF + dA + 6·dM)/8 (metre)."""
    return (d_f + d_a + 6.0 * d_m) / 8.0


def draft_survey_trim_duzeltmesi1(trim_m: float, lcf_m: float, tpc_ton_per_cm: float, lbp_m: float) -> float:
    """Δ₁ = Trim × LCF × TPC × 100 / LBP (ton)."""
    if lbp_m == 0:
        return 0.0
    return (trim_m * lcf_m * tpc_ton_per_cm * 100.0) / lbp_m


def draft_survey_trim_duzeltmesi2(trim_m: float, delta_mct_t_m_per_cm: float, lbp_m: float) -> float:
    """Δ₂ = Trim² × ΔMCT × 50 / LBP (ton)."""
    if lbp_m == 0:
        return 0.0
    return ((trim_m ** 2) * delta_mct_t_m_per_cm * 50.0) / lbp_m


def yogunluk_duzeltmesi(rho_t_per_m3: float, displacement_t: float, rho_deniz: float = 1.025) -> float:
    """Δρ = ((ρ/ρ_deniz) − 1) × Δ (ton)."""
    return ((rho_t_per_m3 / rho_deniz) - 1.0) * displacement_t


# 5) DİĞER HESAPLAR
def dikdortgen_hacim(l_m: float, b_m: float, h_m: float) -> float:
    return l_m * b_m * h_m


def kuttleden_kutle(hacim_m3: float, rho_t_per_m3: float) -> float:
    return hacim_m3 * rho_t_per_m3


def blok_katsayisi(nabla_m3: float, l_m: float, b_m: float, t_m: float) -> float:
    if l_m * b_m * t_m == 0:
        return 0.0
    return nabla_m3 / (l_m * b_m * t_m)


def fwa_cm(displacement_t: float, tpc_ton_per_cm: float) -> float:
    """FWA = Δ / (4 × TPC) (cm)."""
    if tpc_ton_per_cm == 0:
        return 0.0
    return displacement_t / (4.0 * tpc_ton_per_cm)


def draft_degisim_yogunluk(fwa_cm_val: float, rho_kg_per_m3: float, rho_deniz_kg_per_m3: float = 1025.0) -> float:
    """ΔT (cm) = FWA × (1025 − ρ) / 25."""
    return fwa_cm_val * (rho_deniz_kg_per_m3 - rho_kg_per_m3) / 25.0


def deplasman_yogunluk_farki(delta1_t: float, rho1: float, rho2: float) -> float:
    """Δ₂ = Δ₁ × (ρ₂/ρ₁)."""
    if rho1 == 0:
        return 0.0
    return delta1_t * (rho2 / rho1)


# 6) SOLAS STABİLİTE KRİTERLERİ
def kumelenme_acisi_derece(ghm_t_m: float, displacement_t: float, gm_m: float) -> float:
    """θ(°) = 57.2958 × GHM / (Δ × GM)."""
    if displacement_t * gm_m == 0:
        return 0.0
    return 57.2957795131 * (ghm_t_m / (displacement_t * gm_m))


def ghm_hesapla(vhm_t_m: float, sf: float) -> float:
    if sf == 0:
        return 0.0
    return vhm_t_m / sf


def simpson_bir_uc_kural(h: float, y: List[float]) -> float:
    """Bileşik Simpson 1/3: y uzunluğu tek ve ≥3 olmalı."""
    n = len(y) - 1
    if n < 2 or n % 2 == 1:
        raise ValueError("1/3 kuralı için çift sayıda bölme (tek sayıda nokta) gerekir")
    toplam = y[0] + y[-1]
    for i in range(1, len(y) - 1):
        toplam += (4 if i % 2 == 1 else 2) * y[i]
    return (h / 3.0) * toplam


def simpson_uc_sekiz_kural(h: float, y0: float, y1: float, y2: float, y3: float) -> float:
    """Simpson 3/8: A = 3h/8 (y0 + 3y1 + 3y2 + y3)."""
    return (3.0 * h / 8.0) * (y0 + 3.0 * y1 + 3.0 * y2 + y3)


def gg1_serbest_yuzey(L: float, B: float, V: float, rho_sivi: float = 1.025, rho_deniz: float = 1.025, n: int = 1) -> float:
    """GG1 = (L·B^3)/(12·V) · (ρ_sıvı/ρ_deniz) · (1/n^2)."""
    if V <= 0 or n <= 0 or rho_deniz == 0:
        return 0.0
    return ((L * (B ** 3)) / (12.0 * V)) * (rho_sivi / rho_deniz) * (1.0 / (n ** 2))


def yalpa_periyodu_cb(cb: float, B: float, GM: float) -> float:
    if GM <= 0:
        return float('inf')
    return cb * B / math.sqrt(GM)


def yarali_stabilite_delta_T(w_ton: float, L: float, B: float, L_yarali: float) -> float:
    alan = (L * B) - (L_yarali * B)
    if alan <= 0:
        return float('inf')
    return w_ton / alan


# 7) YÜK HESAPLARI
def max_yuk_miktari(V_ambar_m3: float, SF_m3_per_t: float) -> float:
    """w_max = V_ambar / SF (ton)."""
    if SF_m3_per_t == 0:
        return 0.0
    return V_ambar_m3 / SF_m3_per_t


def max_yuk_yuksekligi(SF: float, PL: float) -> float:
    """h_max = SF × PL (birimler girdiğe bağlı)."""
    return SF * PL


def sicaklikla_yogunluk(rho1: float, T1: float, T2: float, k: float) -> float:
    """ρ₂ = ρ₁ − [(T₂ − T₁) × k]."""
    return rho1 - ((T2 - T1) * k)


# 8) PRATİK HESAPLAR
def draft_okuma_metrik(rakam_m: float, konum: str) -> float:
    """'alt', 'orta', 'ustu' için metrik draft değeri (m)."""
    konum_lc = konum.lower()
    if konum_lc == 'alt':
        return rakam_m
    if konum_lc == 'orta':
        return rakam_m + 0.05
    if konum_lc == 'ustu':
        return rakam_m + 0.10
    return rakam_m


def draft_okuma_kraliyet(rakam_inch: float, konum: str) -> float:
    """'alt', 'orta', 'ustu' için Kraliyet sistemi artışı (inç)."""
    konum_lc = konum.lower()
    if konum_lc == 'alt':
        return rakam_inch
    if konum_lc == 'orta':
        return rakam_inch + 3.0
    if konum_lc == 'ustu':
        return rakam_inch + 6.0
    return rakam_inch


def ortalama_draftlar(
    dF_sancak: float, dF_iskele: float,
    dM_sancak: float, dM_iskele: float,
    dA_sancak: float, dA_iskele: float,
) -> Tuple[float, float, float]:
    """İki yandaki okumaların ortalamasıyla dF, dM, dA (metre)."""
    dF = (dF_sancak + dF_iskele) / 2.0
    dM = (dM_sancak + dM_iskele) / 2.0
    dA = (dA_sancak + dA_iskele) / 2.0
    return dF, dM, dA
