import { Anchor, Waves, Wind, Shield, AlertTriangle, Activity, Ship, Ruler, Calculator, Container, Move, Scale, Gauge, BarChart3, Box, Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";

export const StabilityCalculations = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: "A. STABİLİTE",
      items: [
        { id: "draft-trim", label: "Draft & Trim Hesaplayıcı", icon: Ruler, path: "/stability/draft-trim", description: "Deplasman, trim, ağırlık değişimi hesapları" },
        { id: "hydrostatics", label: "Hidrostatik Değerler", icon: Gauge, path: "/stability/hydrostatics", description: "TPC, MCT, KB, KM, BM, LCB, LCF" },
        { id: "intact-stability", label: "Intact Stability", icon: Activity, path: "/stability/intact-stability", description: "GM₀, KG düzeltme, GZ eğrisi, IMO kriterleri" },
        { id: "free-surface", label: "Serbest Yüzey Etkisi (FSE)", icon: Waves, path: "/stability/free-surface", description: "Tank FSM, GG₁ düzeltmesi, Corrected GM" },
        { id: "heel-list", label: "Heel & List Hesaplayıcı", icon: Move, path: "/stability/heel-list", description: "Transverse shift, TCG değişimi, heel angle" },
        { id: "grain-stability", label: "Tahıl Stabilitesi", icon: Box, path: "/stability/grain-calculation", description: "Grain heeling moment, IMO Grain Code kontrolü" },
        { id: "wind-criterion", label: "Wind & Weather Criterion", icon: Wind, path: "/stability/wind-weather", description: "Rüzgar basıncı, heeling moment, PASS/FAIL" },
        { id: "damage-stability", label: "Damage Stability", icon: AlertTriangle, path: "/stability/damage", description: "Compartment flooding, hasarlı GZ eğrisi" },
      ]
    },
    {
      title: "B. BOYUNA MUKAVEMET",
      items: [
        { id: "shear-bending", label: "Kesme Kuvveti & Eğilme Momenti", icon: BarChart3, path: "/stability/shearing-bending", description: "SF & BM diyagramları, Sagging/Hogging kontrolü" },
      ]
    },
    {
      title: "C. OPERASYONLAR",
      items: [
        { id: "ballast", label: "Balast Hesaplayıcı", icon: Anchor, path: "/stability/ballast", description: "Balast transferi, tank FSM etkisi, optimum plan" },
        { id: "cargo-shift", label: "Kargo Kayması Hesaplayıcı", icon: Container, path: "/stability/cargo-shift", description: "Bulk/container kayması, heel angle hesabı" },
        { id: "container-gm", label: "Container GM Limit", icon: Scale, path: "/stability/container-gm", description: "GM limit curves, stack weight uyumu" },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {categories.map((category, catIndex) => (
        <div key={category.title} className="space-y-4">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent px-2">
            {category.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.items.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20 hover:bg-white cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${(catIndex * 100) + (index * 50)}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-indigo-500/0 to-blue-600/0 group-hover:from-blue-500/5 group-hover:via-indigo-500/5 group-hover:to-blue-600/5 transition-all duration-500" />
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all duration-500" />
                  
                  <div className="relative flex items-start gap-4">
                    <div className="flex-shrink-0 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-all duration-500" />
                      <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300">
                        {item.label}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex-shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 self-center">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
