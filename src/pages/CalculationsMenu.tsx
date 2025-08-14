import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Anchor, Ship, Waves, Compass, DollarSign, Shield, Database } from 'lucide-react';

const categories = [
  {
    title: 'Stabilite',
    icon: Ship,
    items: [
      'Kargo (Yük hesaplamaları)',
      'Stabilite (Dengelilik analizi)'
    ],
    links: ['/cargo', '/stability']
  },
  {
    title: 'Kargo',
    icon: Waves,
    items: [
      'Hidrodinamik (Su direnci analizi)',
      'Makine (Motor performansı)'
    ],
    links: ['/hydrodynamics', '/engine']
  },
  {
    title: 'Seyir',
    icon: Compass,
    items: [
      'Seyir (Navigasyon hesaplamaları)'
    ],
    links: ['/navigation']
  },
  {
    title: 'Mali',
    icon: DollarSign,
    items: [
      'Ekonomi (Maliyet analizi)',
      'Regülasyonlar (Mevzuat takibi)'
    ],
    links: ['/economics', '/regulations']
  },
  {
    title: 'Emniyet',
    icon: Shield,
    items: [
      'Emniyet (Güvenlik hesaplamaları)',
      'Yapısal (Yapısal analiz)'
    ],
    links: ['/safety-calculations', '/structural-calculations']
  },
  {
    title: 'Operasyonel',
    icon: Database,
    items: [
      'Tank (Tank hesaplamaları)',
      'Balast (Balast suyu yönetimi)'
    ],
    links: ['/tank-calculations', '/ballast']
  }
];

export default function CalculationsMenu() {
  return (
    <div className="min-h-screen bg-slate-900 px-4 py-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ana Sayfa
            </Button>
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Anchor className="w-8 h-8" />
            Denizcilik Hesaplamaları
          </h1>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-4xl mx-auto space-y-4">
        {categories.map((category, index) => (
          <div 
            key={index}
            className="bg-slate-800 border border-slate-600 rounded-lg p-6 hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <category.icon className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-3">{category.title}</h2>
                <ul className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></span>
                      {category.links[itemIndex] ? (
                        <Link 
                          to={category.links[itemIndex]} 
                          className="text-white hover:text-blue-300 transition-colors"
                        >
                          {item}
                        </Link>
                      ) : (
                        <span className="text-white">{item}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}