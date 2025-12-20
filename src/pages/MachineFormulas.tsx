import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Fuel, Thermometer, Gauge, Zap, Droplets } from "lucide-react";

const formulaCategories = [
  {
    title: "Güç Hesaplamaları",
    icon: Zap,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    formulas: [
      {
        name: "İndike Güç (IHP)",
        formula: "IHP = (Pm × L × A × n × k) / 60000",
        variables: "Pm: ortalama efektif basınç (bar), L: strok (m), A: piston alanı (m²), n: devir (rpm), k: silindir sayısı",
      },
      {
        name: "Fren Gücü (BHP)",
        formula: "BHP = IHP × ηmech",
        variables: "ηmech: mekanik verim (0.85-0.92)",
      },
      {
        name: "Şaft Gücü (SHP)",
        formula: "SHP = BHP × ηtrans",
        variables: "ηtrans: transmisyon verimi (0.97-0.99)",
      },
      {
        name: "Efektif Güç (EHP)",
        formula: "EHP = R × V",
        variables: "R: toplam direnç (N), V: gemi hızı (m/s)",
      },
      {
        name: "Pervane Gücü",
        formula: "DHP = SHP × ηprop",
        variables: "ηprop: pervane verimi (0.55-0.70)",
      },
      {
        name: "Tork",
        formula: "T = (P × 60) / (2π × n)",
        variables: "P: güç (W), n: devir (rpm)",
      },
    ],
  },
  {
    title: "Yakıt Hesaplamaları",
    icon: Fuel,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
    formulas: [
      {
        name: "Spesifik Yakıt Tüketimi (SFOC)",
        formula: "SFOC = FC / P",
        variables: "FC: yakıt tüketimi (g/h), P: güç (kW) — Birim: g/kWh",
      },
      {
        name: "Günlük Yakıt Tüketimi",
        formula: "Daily FC = P × SFOC × 24 / 1000000",
        variables: "Sonuç: ton/gün",
      },
      {
        name: "Sefer Yakıt Tüketimi",
        formula: "Voyage FC = Daily FC × Sefer Süresi",
        variables: "Sefer Süresi: gün",
      },
      {
        name: "Yakıt Isıtma Sıcaklığı",
        formula: "T = 50 + (V50 - 10) × 2",
        variables: "V50: 50°C'deki viskozite (cSt)",
      },
      {
        name: "Yakıt Hacmi Düzeltmesi",
        formula: "V15 = Vt × [1 - 0.00064 × (T - 15)]",
        variables: "V15: 15°C hacim, Vt: ölçülen hacim, T: sıcaklık (°C)",
      },
    ],
  },
  {
    title: "Soğutma Sistemi",
    icon: Thermometer,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    formulas: [
      {
        name: "Isı Yükü",
        formula: "Q = m × cp × ΔT",
        variables: "m: kütle debisi (kg/s), cp: özgül ısı (kJ/kg·K), ΔT: sıcaklık farkı (K)",
      },
      {
        name: "LMTD",
        formula: "LMTD = (ΔT₁ - ΔT₂) / ln(ΔT₁/ΔT₂)",
        variables: "ΔT₁, ΔT₂: giriş ve çıkış sıcaklık farkları",
      },
      {
        name: "Isı Değiştirici Alanı",
        formula: "A = Q / (U × LMTD)",
        variables: "U: toplam ısı transfer katsayısı (W/m²·K)",
      },
      {
        name: "Soğutma Suyu Debisi",
        formula: "m = Q / (cp × ΔT)",
        variables: "Q: ısı yükü (kW)",
      },
      {
        name: "NTU (Transfer Birimi)",
        formula: "NTU = U × A / (m × cp)",
        variables: "Isı değiştirici etkinliği için",
      },
    ],
  },
  {
    title: "Yağlama Sistemi",
    icon: Droplets,
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900/20",
    formulas: [
      {
        name: "Silindir Yağ Tüketimi",
        formula: "CLO = BHP × Feed Rate / 1000",
        variables: "Feed Rate: g/kWh (tipik: 0.7-1.2)",
      },
      {
        name: "Sistem Yağ Tüketimi",
        formula: "SLO = 0.05 × BHP / 1000",
        variables: "Yaklaşık kg/gün",
      },
      {
        name: "Yağ Filtre ΔP",
        formula: "ΔP = (8 × μ × Q × L) / (π × r⁴)",
        variables: "μ: viskozite, Q: debi, L: uzunluk, r: yarıçap",
      },
      {
        name: "BN Tüketimi",
        formula: "BN loss = Fuel S% × Neutralization Factor",
        variables: "Neutralization Factor ≈ 28-32",
      },
    ],
  },
  {
    title: "Basınçlı Hava",
    icon: Gauge,
    color: "text-cyan-600",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/20",
    formulas: [
      {
        name: "Kompresör Gücü",
        formula: "P = (p₂/p₁)^((k-1)/(n×k)) - 1) × (n×k)/(k-1) × p₁×V₁",
        variables: "n: kademe sayısı, k: özgül ısı oranı",
      },
      {
        name: "Hava Şişe Kapasitesi",
        formula: "V = (N × Vswept × p_start) / p_bottle",
        variables: "N: başlatma sayısı, Vswept: süpürülen hacim",
      },
      {
        name: "İdeal Gaz Denklemi",
        formula: "p × V = m × R × T",
        variables: "R: gaz sabiti (287 J/kg·K hava için)",
      },
      {
        name: "Şarj Süresi",
        formula: "t = (V × (p₂ - p₁)) / (Q × p_atm)",
        variables: "Q: kompresör kapasitesi (m³/min)",
      },
    ],
  },
  {
    title: "Verimlilik",
    icon: Calculator,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    formulas: [
      {
        name: "Termal Verimlilik",
        formula: "ηth = P / (FC × LCV)",
        variables: "LCV: alt ısıl değer (kJ/kg)",
      },
      {
        name: "Mekanik Verimlilik",
        formula: "ηmech = BHP / IHP",
        variables: "Tipik değer: 0.85-0.92",
      },
      {
        name: "Pervane Verimi",
        formula: "ηprop = EHP / DHP",
        variables: "Tipik değer: 0.55-0.70",
      },
      {
        name: "Genel Verimlilik",
        formula: "ηtotal = EHP / (FC × LCV)",
        variables: "Tüm kayıplar dahil",
      },
      {
        name: "EEOI",
        formula: "EEOI = CO₂ / (Cargo × Distance)",
        variables: "g CO₂ / ton-mil",
      },
    ],
  },
];

export default function MachineFormulas() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-[hsl(220,50%,6%)] dark:via-[hsl(220,50%,8%)] dark:to-[hsl(220,50%,10%)]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-slate-600 via-zinc-600 to-slate-800 bg-clip-text text-transparent mb-3">
            Makine Formülleri
          </h1>
          <p className="text-muted-foreground">
            Güç, yakıt, soğutma ve verimlilik hesapları için temel formüller
          </p>
        </div>

        <div className="space-y-8">
          {formulaCategories.map((category) => (
            <Card key={category.title} className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 ${category.bgColor} rounded-lg`}>
                    <category.icon className={`h-5 w-5 ${category.color}`} />
                  </div>
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {category.formulas.map((formula, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                        {formula.name}
                      </h4>
                      <code className="block bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded text-sm font-mono text-slate-700 dark:text-slate-300 mb-2">
                        {formula.formula}
                      </code>
                      <p className="text-xs text-muted-foreground">{formula.variables}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
