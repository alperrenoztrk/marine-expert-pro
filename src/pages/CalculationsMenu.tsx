import React from 'react';
import { Link } from 'react-router-dom';
import { Anchor, Ship, Waves, Compass, DollarSign, LifeBuoy, Database } from 'lucide-react';

const categories = [
  {
    title: 'Stabilite',
    icon: Ship,
    items: [
      'Kargo (Yük hesaplamaları)',
      'Stabilite (Dengelilik analizi)',
      'Stabilite Asistanı',
      'Stabilite Kuralları'
    ],
    links: ['/cargo', '/stability', '/stability/assistant', '/stability/rules']
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
    links: ['/safety', '/structural']
  },
  {
    title: 'Operasyonel',
    icon: Database,
    items: [
      'Tank (Tank hesaplamaları)',
      'Balast (Balast suyu yönetimi)'
    ],
    links: ['/tank', '/ballast']
  }
];

export default function CalculationsMenu() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f2137' }}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Title */}
        <div className="flex items-center gap-4 text-white mb-10">
          <Anchor className="w-10 h-10" />
          <h1 className="text-4xl font-bold">Denizcilik Hesaplamaları</h1>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/40 p-6 bg-transparent"
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