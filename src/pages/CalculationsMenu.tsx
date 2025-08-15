import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Anchor, Ship, Waves, Compass, DollarSign, LifeBuoy, Database } from 'lucide-react';

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
    icon: LifeBuoy,
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
    <div className="min-h-screen" style={{ backgroundColor: '#1e293b' }}>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ana Sayfa
            </Button>
          </Link>
        </div>
        
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-4">
            <Anchor className="w-10 h-10" />
            Denizcilik Hesaplamaları
          </h1>
        </div>

        {/* Categories */}
        <div className="max-w-4xl mx-auto space-y-6">
          {categories.map((category, index) => (
            <div 
              key={index}
              className="border-2 border-white/20 rounded-2xl p-6 bg-transparent"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <category.icon className="w-16 h-16 text-white" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-4">{category.title}</h2>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0 mt-2"></span>
                        {category.links[itemIndex] ? (
                          <Link 
                            to={category.links[itemIndex]} 
                            className="text-white text-lg hover:text-blue-300 transition-colors"
                          >
                            {item}
                          </Link>
                        ) : (
                          <span className="text-white text-lg">{item}</span>
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
    </div>
  );
}