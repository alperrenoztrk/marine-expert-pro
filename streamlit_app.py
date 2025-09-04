"""
Gemi Enine Stabilite Hesaplama Uygulaması
Streamlit kullanıcı arayüzü
"""

import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import numpy as np
from stability_calculator import (
    EnineStabiliteHesaplama, YukBilgisi, TankBilgisi, 
    StabiliteRapor, meyil_momenti_hesapla
)


# Sayfa yapılandırması
st.set_page_config(
    page_title="Gemi Enine Stabilite Hesaplayıcı",
    page_icon="🚢",
    layout="wide"
)

# Başlık ve açıklama
st.title("🚢 Gemi Enine Stabilite Hesaplama Sistemi")
st.markdown("""
Bu uygulama, gemi enine stabilitesi ile ilgili tüm hesaplamaları yapmanızı sağlar.
SOLAS kriterlerine uygunluk kontrolü ve detaylı raporlama özellikleri içerir.
""")

# Sidebar - Temel gemi bilgileri
st.sidebar.header("📊 Temel Gemi Bilgileri")
deplasman = st.sidebar.number_input("Deplasman (Δ) [ton]", 
                                    min_value=0.0, value=10000.0, step=100.0)
km = st.sidebar.number_input("Metasantr Yüksekliği (KM) [m]", 
                             min_value=0.0, value=8.5, step=0.1)
kg = st.sidebar.number_input("Ağırlık Merkezi Yüksekliği (KG) [m]", 
                            min_value=0.0, value=6.5, step=0.1)

# Hesaplama nesnesi oluştur
hesaplama = EnineStabiliteHesaplama(deplasman, km, kg)

# Ana sekmeler
tab1, tab2, tab3, tab4, tab5, tab6, tab7 = st.tabs([
    "📈 Temel Hesaplamalar",
    "📦 Yük Operasyonları", 
    "🏗️ Kren/Bumba İşlemleri",
    "💧 Serbest Yüzey Etkisi",
    "📐 Meyil Hesaplamaları",
    "📊 GZ Eğrisi ve SOLAS",
    "📋 Rapor"
])

# Tab 1: Temel Hesaplamalar
with tab1:
    st.header("Temel Stabilite Parametreleri")
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("GM (Metasantr Yüksekliği)", f"{hesaplama.gm:.3f} m")
        if hesaplama.gm > 0:
            st.success("✓ Gemi STABIL")
        else:
            st.error("✗ Gemi UNSTABIL")
    
    with col2:
        kb = st.number_input("KB (Yüzdürme Merkezi Yüksekliği) [m]", 
                            min_value=0.0, value=3.5, step=0.1)
        bm = hesaplama.hesapla_kb_bm(kb)
        st.metric("BM (Metasantr Yarıçapı)", f"{bm:.3f} m")
    
    with col3:
        st.metric("KM", f"{km:.3f} m")
        st.metric("KG", f"{kg:.3f} m")
    
    # SOLAS kriterleri kontrolü
    st.subheader("SOLAS Kriterleri Kontrolü")
    col1, col2 = st.columns(2)
    with col1:
        if hesaplama.gm >= 0.15:
            st.success("✓ Genel gemiler için minimum GM kriteri sağlanıyor (GM ≥ 0.15 m)")
        else:
            st.error("✗ Genel gemiler için minimum GM kriteri SAĞLANMIYOR (GM < 0.15 m)")
    
    with col2:
        if hesaplama.gm >= 0.30:
            st.success("✓ Dökme tahıl gemileri için minimum GM kriteri sağlanıyor (GM ≥ 0.30 m)")
        else:
            st.warning("⚠️ Dökme tahıl gemileri için minimum GM kriteri sağlanmıyor (GM < 0.30 m)")

# Tab 2: Yük Operasyonları
with tab2:
    st.header("Yük Operasyonları")
    
    st.subheader("Yük Ekleme/Çıkarma")
    
    # Yük tablosu
    num_yukler = st.number_input("Yük sayısı", min_value=1, max_value=10, value=1)
    
    yukler = []
    for i in range(num_yukler):
        col1, col2, col3 = st.columns(3)
        with col1:
            agirlik = st.number_input(f"Yük {i+1} - Ağırlık [ton]", 
                                     min_value=-1000.0, max_value=1000.0, value=50.0,
                                     help="Negatif değer = yük tahliyesi")
        with col2:
            yuk_kg = st.number_input(f"Yük {i+1} - KG [m]", 
                                    min_value=0.0, value=10.0, step=0.1)
        with col3:
            yatay_mesafe = st.number_input(f"Yük {i+1} - Yatay mesafe [m]", 
                                          min_value=-50.0, max_value=50.0, value=0.0,
                                          help="Merkez hattından uzaklık")
        
        yukler.append(YukBilgisi(agirlik, yuk_kg, yatay_mesafe))
    
    if st.button("Yük Operasyonunu Hesapla"):
        # Yeni KG hesapla
        yeni_kg = hesaplama.yeni_kg_hesapla(yukler)
        yeni_deplasman = deplasman + sum(yuk.agirlik for yuk in yukler)
        yeni_hesaplama = EnineStabiliteHesaplama(yeni_deplasman, km, yeni_kg)
        
        # Sonuçları göster
        col1, col2 = st.columns(2)
        with col1:
            st.subheader("Mevcut Durum")
            st.write(f"Deplasman: {deplasman:.2f} ton")
            st.write(f"KG: {kg:.3f} m")
            st.write(f"GM: {hesaplama.gm:.3f} m")
        
        with col2:
            st.subheader("Yeni Durum")
            st.write(f"Deplasman: {yeni_deplasman:.2f} ton")
            st.write(f"KG: {yeni_kg:.3f} m")
            st.write(f"GM: {yeni_hesaplama.gm:.3f} m")
        
        # GM değişimi
        gm_degisimi = yeni_hesaplama.gm - hesaplama.gm
        if gm_degisimi > 0:
            st.success(f"✓ GM {abs(gm_degisimi):.3f} m artmıştır")
        else:
            st.error(f"✗ GM {abs(gm_degisimi):.3f} m azalmıştır")

# Tab 3: Kren/Bumba İşlemleri
with tab3:
    st.header("Kren/Bumba Operasyonları")
    
    col1, col2 = st.columns(2)
    with col1:
        yuk_agirlik = st.number_input("Kaldırılacak yük ağırlığı [ton]", 
                                     min_value=0.0, value=20.0)
        h_yuk = st.number_input("Yükün başlangıç yüksekliği [m]", 
                               min_value=0.0, value=2.0)
        h_cunda = st.number_input("Cunda yüksekliği [m]", 
                                 min_value=0.0, value=25.0)
    
    with col2:
        if st.button("Kren Operasyonunu Hesapla"):
            gg1 = hesaplama.bumba_kren_gm_degisimi(yuk_agirlik, h_cunda, h_yuk)
            yeni_gm = hesaplama.gm - gg1
            
            st.metric("GG₁ (Ağırlık merkezi kayması)", f"{gg1:.3f} m")
            st.metric("Yeni GM", f"{yeni_gm:.3f} m")
            
            if yeni_gm > 0:
                st.success("✓ Kren operasyonu güvenli")
            else:
                st.error("✗ DİKKAT! Kren operasyonu geminin stabilitesini tehlikeye atabilir!")

# Tab 4: Serbest Yüzey Etkisi
with tab4:
    st.header("Serbest Yüzey Etkisi (FSM)")
    
    st.subheader("Tank Bilgileri")
    num_tanks = st.number_input("Tank sayısı", min_value=1, max_value=10, value=2)
    
    tanklar = []
    toplam_fsm = 0
    
    for i in range(num_tanks):
        st.write(f"**Tank {i+1}**")
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            tank_boy = st.number_input(f"Boy [m]", min_value=0.0, value=20.0, key=f"boy_{i}")
        with col2:
            tank_en = st.number_input(f"En [m]", min_value=0.0, value=10.0, key=f"en_{i}")
        with col3:
            tank_yukseklik = st.number_input(f"Yükseklik [m]", min_value=0.0, value=5.0, key=f"yuk_{i}")
        with col4:
            doluluk = st.slider(f"Doluluk [%]", 0, 100, 50, key=f"dol_{i}") / 100
        
        tank = TankBilgisi(tank_boy, tank_en, tank_yukseklik, doluluk)
        tanklar.append(tank)
    
    if st.button("FSM Hesapla"):
        fsm = hesaplama.serbest_yuzey_etkisi(tanklar)
        gg1_fsm = hesaplama.gm_kuculmesi_fsm(fsm)
        yeni_gm_fsm = hesaplama.gm - gg1_fsm
        
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Toplam FSM", f"{fsm:.2f} ton.m")
        with col2:
            st.metric("GM Azalması", f"{gg1_fsm:.3f} m")
        with col3:
            st.metric("Düzeltilmiş GM", f"{yeni_gm_fsm:.3f} m")
        
        # Tank detayları tablosu
        tank_data = []
        for i, tank in enumerate(tanklar):
            if 0 < tank.doluluk_orani < 1:
                tank_fsm = (tank.boy * tank.en**3 * tank.sivi_yogunlugu) / 12
                tank_data.append({
                    "Tank": f"Tank {i+1}",
                    "Boy (m)": tank.boy,
                    "En (m)": tank.en,
                    "Doluluk (%)": f"{tank.doluluk_orani*100:.0f}",
                    "FSM (ton.m)": f"{tank_fsm:.2f}"
                })
        
        if tank_data:
            st.subheader("Tank Detayları")
            st.dataframe(pd.DataFrame(tank_data))

# Tab 5: Meyil Hesaplamaları
with tab5:
    st.header("Meyil Açısı Hesaplamaları")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Yük Hareketi ile Meyil")
        w_yatay = st.number_input("Hareket eden yük [ton]", min_value=0.0, value=50.0)
        d_yatay = st.number_input("Yatay hareket mesafesi [m]", min_value=0.0, value=5.0)
        
        if st.button("Meyil Hesapla", key="meyil1"):
            gz = hesaplama.gz_hesapla(w_yatay, d_yatay)
            meyil_acisi = hesaplama.meyil_acisi_hesapla(gz)
            
            st.metric("GZ (Doğrultucu Kol)", f"{gz:.3f} m")
            st.metric("Meyil Açısı", f"{meyil_acisi:.2f}°")
            
            # Meyil momenti
            meyil_mom = meyil_momenti_hesapla(w_yatay, d_yatay)
            st.metric("Meyil Momenti", f"{meyil_mom:.2f} ton.m")
    
    with col2:
        st.subheader("Sarkaç ile Meyil Ölçümü")
        sarkac_boyu = st.number_input("Sarkaç boyu [m]", min_value=0.1, value=10.0)
        sapma = st.number_input("Sapma miktarı [m]", min_value=0.0, value=0.5)
        
        if st.button("Sarkaç Hesapla", key="sarkac"):
            sarkac_acisi = hesaplama.sarkac_ile_meyil_acisi(sapma, sarkac_boyu)
            st.metric("Ölçülen Meyil Açısı", f"{sarkac_acisi:.2f}°")
            
            # GM hesabı (ters hesaplama)
            if sarkac_acisi > 0:
                gz_ters = hesaplama.gm * np.tan(np.radians(sarkac_acisi))
                st.info(f"Bu açıya karşılık gelen GZ: {gz_ters:.3f} m")
    
    # Yalpa periyodu
    st.subheader("Yalpa Periyodu")
    col1, col2 = st.columns(2)
    with col1:
        c_katsayi = st.number_input("C katsayısı", min_value=0.5, max_value=1.0, value=0.8,
                                    help="Gemi tipine bağlı katsayı (0.7-0.9 arası)")
        gemi_genislik = st.number_input("Gemi genişliği (B) [m]", min_value=1.0, value=20.0)
    
    with col2:
        yalpa_periyodu = hesaplama.yalpa_periyodu(c_katsayi, gemi_genislik)
        st.metric("Yalpa Periyodu", f"{yalpa_periyodu:.2f} saniye")
        
        if yalpa_periyodu < 10:
            st.warning("⚠️ Kısa yalpa periyodu - sert yalpa hareketi")
        elif yalpa_periyodu > 20:
            st.warning("⚠️ Uzun yalpa periyodu - düşük stabilite")
        else:
            st.success("✓ Normal yalpa periyodu")

# Tab 6: GZ Eğrisi ve SOLAS
with tab6:
    st.header("GZ Eğrisi ve SOLAS Kriterleri")
    
    # GZ eğrisi oluşturma
    st.subheader("GZ Eğrisi Parametreleri")
    
    col1, col2 = st.columns(2)
    with col1:
        max_aci = st.number_input("Maksimum meyil açısı [°]", 
                                 min_value=10, max_value=90, value=60)
        aci_adimi = st.number_input("Açı adımı [°]", 
                                   min_value=5, max_value=15, value=10)
    
    with col2:
        # KN değerleri girişi
        st.write("KN değerleri (örnek)")
        kn_values = {
            0: 0.0,
            10: 1.5,
            20: 3.0,
            30: 4.3,
            40: 5.2,
            50: 5.8,
            60: 6.0
        }
    
    # GZ hesaplama
    acilar = list(range(0, max_aci + 1, aci_adimi))
    gz_degerleri = []
    gz_egri = []
    
    for aci in acilar:
        # Basit KN interpolasyonu
        kn = np.interp(aci, list(kn_values.keys()), list(kn_values.values()))
        gz = hesaplama.kn_den_gz_hesapla(kn, aci)
        gz_degerleri.append(gz)
        gz_egri.append((aci, gz))
    
    # GZ eğrisi grafiği
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=acilar,
        y=gz_degerleri,
        mode='lines+markers',
        name='GZ Eğrisi',
        line=dict(color='blue', width=2)
    ))
    
    # Kritik değerleri işaretle
    fig.add_hline(y=0.20, line_dash="dash", line_color="red", 
                  annotation_text="Min GZ = 0.20 m")
    fig.add_vline(x=25, line_dash="dash", line_color="green", 
                  annotation_text="Min açı = 25°")
    
    fig.update_layout(
        title="GZ Eğrisi",
        xaxis_title="Meyil Açısı (°)",
        yaxis_title="GZ (m)",
        height=500
    )
    
    st.plotly_chart(fig, use_container_width=True)
    
    # SOLAS kriterleri kontrolü
    st.subheader("SOLAS Kriterleri Kontrolü")
    kriterler = hesaplama.solas_kriterleri_kontrol(gz_egri)
    
    col1, col2 = st.columns(2)
    with col1:
        for kriter, durum in list(kriterler.items())[:4]:
            if durum:
                st.success(f"✓ {kriter}")
            else:
                st.error(f"✗ {kriter}")
    
    with col2:
        for kriter, durum in list(kriterler.items())[4:]:
            if durum:
                st.success(f"✓ {kriter}")
            else:
                st.error(f"✗ {kriter}")
    
    # Alan hesaplamaları
    if len(gz_degerleri) >= 5:
        st.subheader("Dinamik Stabilite Alanları")
        alan = hesaplama.dinamik_stabilite_alani_simpson(gz_degerleri[:5], aci_adimi)
        st.metric("GZ eğrisi altındaki alan (Simpson)", f"{alan:.3f} m.rad")

# Tab 7: Rapor
with tab7:
    st.header("Stabilite Raporu")
    
    # Ek bilgiler topla
    ek_bilgiler = {
        "Gemi Adı": st.text_input("Gemi Adı", value="M/V EXAMPLE"),
        "IMO No": st.text_input("IMO No", value="1234567"),
        "Yükleme Durumu": st.selectbox("Yükleme Durumu", 
                                      ["Ballast", "Tam Yüklü", "Kısmi Yüklü"]),
        "Tarih": st.date_input("Tarih")
    }
    
    if st.button("Rapor Oluştur"):
        rapor = StabiliteRapor.olustur(hesaplama, ek_bilgiler)
        
        st.text_area("Stabilite Raporu", value=rapor, height=400)
        
        # Raporu indirme
        st.download_button(
            label="Raporu İndir (TXT)",
            data=rapor,
            file_name=f"stabilite_raporu_{ek_bilgiler['Gemi Adı'].replace(' ', '_')}.txt",
            mime="text/plain"
        )

# Footer
st.markdown("---")
st.markdown("""
<div style='text-align: center'>
    <p>Gemi Enine Stabilite Hesaplama Sistemi v1.0</p>
    <p>SOLAS ve IMO kriterlerine uygun hesaplamalar</p>
</div>
""", unsafe_allow_html=True)