import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, Shield, Waves, Compass, Cog, Cloud, LifeBuoy, Wrench, Factory, DollarSign, Droplets, Ruler, BarChart3, Anchor, Ship } from "lucide-react";

export default function CalculationsMenu() {
  const groups = [
    {
      title: 'Kargo ve Stabilite',
      description: 'Yük ve dengelilik hesaplamaları',
      color: 'from-blue-500 to-blue-700',
      bgPattern: 'bg-gradient-to-br from-blue-50 to-blue-100',
      items: [
        { to: "/cargo", icon: <Package className="h-5 w-5" />, label: "Kargo", desc: "Yük hesaplamaları" },
        { to: "/stability", icon: <Shield className="h-5 w-5" />, label: "Stabilite", desc: "Dengelilik analizi" },
      ]
    },
    {
      title: 'Gemi Performansı',
      description: 'Performans ve verimlilik analizi',
      color: 'from-emerald-500 to-emerald-700',
      bgPattern: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      items: [
        { to: "/hydrodynamics", icon: <Waves className="h-5 w-5" />, label: "Hidrodinamik", desc: "Su direnci analizi" },
        { to: "/engine", icon: <Cog className="h-5 w-5" />, label: "Makine", desc: "Motor performansı" },
        { to: "/navigation", icon: <Compass className="h-5 w-5" />, label: "Seyir", desc: "Navigasyon hesaplamaları" },
      ]
    },
    {
      title: 'Operasyonel',
      description: 'Günlük operasyon hesaplamaları',
      color: 'from-orange-500 to-orange-700',
      bgPattern: 'bg-gradient-to-br from-orange-50 to-orange-100',
      items: [
        { to: "/tank", icon: <Ruler className="h-5 w-5" />, label: "Tank", desc: "Tank hesaplamaları" },
        { to: "/ballast", icon: <Droplets className="h-5 w-5" />, label: "Balast", desc: "Balast suyu yönetimi" },
        { to: "/trim", icon: <Ruler className="h-5 w-5" />, label: "Trim & List", desc: "Trim ve yan yatma" },
      ]
    },
    {
      title: 'Çevre ve Güvenlik',
      description: 'Güvenlik ve çevre koruma',
      color: 'from-red-500 to-red-700',
      bgPattern: 'bg-gradient-to-br from-red-50 to-red-100',
      items: [
        { to: "/weather", icon: <Cloud className="h-5 w-5" />, label: "Hava", desc: "Meteoroloji analizi" },
        { to: "/safety", icon: <LifeBuoy className="h-5 w-5" />, label: "Emniyet", desc: "Güvenlik hesaplamaları" },
        { to: "/structural", icon: <Wrench className="h-5 w-5" />, label: "Yapısal", desc: "Yapısal analiz" },
        { to: "/emissions", icon: <Factory className="h-5 w-5" />, label: "Emisyon", desc: "Emisyon kontrolü" },
      ]
    },
    {
      title: 'Ekonomi',
      description: 'Finansal ve yasal hesaplamalar',
      color: 'from-purple-500 to-purple-700',
      bgPattern: 'bg-gradient-to-br from-purple-50 to-purple-100',
      items: [
        { to: "/economics", icon: <DollarSign className="h-5 w-5" />, label: "Ekonomi", desc: "Maliyet analizi" },
        { to: "/regulations", icon: <BarChart3 className="h-5 w-5" />, label: "Regülasyonlar", desc: "Mevzuat takibi" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Maritime Header */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-8">
        <div className="absolute inset-0 bg-[url('/maritime-pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4" />
                Ana Sayfa
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-blue-200">
              <Ship className="h-5 w-5" />
              <span className="text-sm">Maritime Calculator</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Anchor className="h-8 w-8 text-blue-300" />
              <h1 className="text-4xl font-bold">HESAPLAMALAR</h1>
              <Anchor className="h-8 w-8 text-blue-300 scale-x-[-1]" />
            </div>
            <p className="text-blue-200 text-lg">Denizcilik hesaplamaları ve analizleri</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6 -mt-8 relative z-20">
        <div className="grid gap-8 lg:gap-10">
          {groups.map((group, index) => (
            <Card key={group.title} className="overflow-hidden shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader className={`${group.bgPattern} border-b`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${group.color} flex items-center justify-center shadow-lg`}>
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">{group.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.items.map((item) => (
                    <Link key={item.to} to={item.to} className="block group">
                      <div className="relative overflow-hidden rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white">
                        <div className={`absolute inset-0 bg-gradient-to-br ${group.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                        <div className="p-4 relative z-10">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${group.color} text-white shadow-sm group-hover:shadow-md transition-shadow duration-300`}>
                              {item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                                {item.label}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1 group-hover:text-gray-600 transition-colors">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 bg-gradient-to-r from-slate-800 to-slate-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Ship className="h-5 w-5 text-blue-400" />
            <span className="text-sm text-gray-300">Maritime Engineering Calculator Suite</span>
          </div>
          <p className="text-xs text-gray-400">Profesyonel denizcilik hesaplamaları</p>
        </div>
      </div>
    </div>
  );
}