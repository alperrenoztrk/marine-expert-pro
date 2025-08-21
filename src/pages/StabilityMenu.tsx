import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Waves, Ship, BarChart3, AlertTriangle, ArrowLeft, Brain, BookOpen, Activity, Package, Droplets, Building, Route, Calculator } from "lucide-react";
import { Link } from "react-router-dom";

export default function StabilityMenu() {
  const groups = [
    // Kapsamlı Hesaplayıcı (Yeni)
    {
      title: 'Kapsamlı Stabilite Analizi',
      items: [
        { to: "/stability/calculator", icon: <Calculator className="h-4 w-4" />, label: "Tam Stabilite Hesaplayıcısı", featured: true }
      ]
    },
    // Hidrostatik (korunuyor)
    {
      title: 'Hidrostatik',
      items: [
        { to: "/stability/hydrostatic", icon: <Waves className="h-4 w-4" />, label: "Hidrostatik" }
      ]
    },
    // Enine Stabilite (Transverse)
    {
      title: 'Enine Stabilite (Transverse)',
      items: [
        { to: "/stability/stability", icon: <Shield className="h-4 w-4" />, label: "Genel Stabilite" }
      ]
    },
    // Boyuna Stabilite (Trim / Longitudinal)
    {
      title: 'Boyuna Stabilite (Trim / Longitudinal)',
      items: [
        { to: "/stability/trimlist", icon: <Ship className="h-4 w-4" />, label: "Trim & List" }
      ]
    },
    // Sağlam (Intact) Stabilite
    {
      title: 'Sağlam (Intact) Stabilite',
      items: [
        { to: "/stability/analysis", icon: <BarChart3 className="h-4 w-4" />, label: "Analiz" }
      ]
    },
    // Zarar Görmüş (Damage) Stabilite
    {
      title: 'Zarar Görmüş (Damage) Stabilite',
      items: [
        { to: "/stability/damage", icon: <AlertTriangle className="h-4 w-4" />, label: "Hasar Stabilitesi" }
      ]
    },
    // Dinamik Stabilite
    {
      title: 'Dinamik Stabilite',
      items: [
        { to: "/stability/analysis", icon: <Activity className="h-4 w-4" />, label: "GZ Eğrisi & Alanlar" }
      ]
    },
    // Yükleme & Denge (Cargo / Loading)
    {
      title: 'Yükleme & Denge (Cargo / Loading)',
      items: [
        { to: "/cargo", icon: <Package className="h-4 w-4" />, label: "Kargo" },
        { to: "/ballast", icon: <Droplets className="h-4 w-4" />, label: "Balast" }
      ]
    },
    // Boyuna Dayanım (Longitudinal Strength)
    {
      title: 'Boyuna Dayanım (Longitudinal Strength)',
      items: [
        { to: "/structural", icon: <Building className="h-4 w-4" />, label: "Yapısal Hesaplar" }
      ]
    },
    // Hat Başlıkları / Sefer Uygunluğu (Draft–Freeboard–Load Line)
    {
      title: 'Hat Başlıkları / Sefer Uygunluğu (Draft–Freeboard–Load Line)',
      items: [
        { to: "/stability/draft", icon: <Route className="h-4 w-4" />, label: "Draft Survey" },
        { to: "/stability/rules", icon: <BookOpen className="h-4 w-4" />, label: "Kurallar" }
      ]
    },
    // Doğrulama & Kalibrasyon
    {
      title: 'Doğrulama & Kalibrasyon',
      items: [
        { to: "/stability/assistant", icon: <Brain className="h-4 w-4" />, label: "Asistan" },
        { to: "/stability/rules-basic", icon: <BookOpen className="h-4 w-4" />, label: "Kurallar (Temel)" }
      ]
    }
  ];
  const items = groups.flatMap((g)=> g.items);
  return (
    <div key="stability-menu-v2" className="container mx-auto p-6 space-y-6" data-no-translate>
      <div className="flex items-center justify-between">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Ana Sayfa
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle data-no-translate>Stabilite Hesaplamaları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Featured Calculator */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border-2 border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">🚀 Yeni: Kapsamlı Stabilite Hesaplayıcısı</h3>
              <p className="text-sm text-blue-600 mb-3">
                Gemi verisi, yükleme durumu, IMO kriterleri ve GZ eğrisi analizi - tek platformda!
              </p>
              <Link to="/stability/calculator">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Calculator className="h-4 w-4 mr-2" />
                  Başlat
                </Button>
              </Link>
            </div>
            
            {/* All Items */}
            <div className="flex flex-wrap gap-2 py-1">
              {items.map((it)=> (
                <Link key={it.to} to={it.to}>
                  <Button variant="outline" className="justify-start gap-2 whitespace-nowrap" data-no-translate>
                    {it.icon}
                    {it.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}