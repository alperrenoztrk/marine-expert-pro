import React from 'react';
import { Link } from 'react-router-dom';
import { Anchor, Ship, Waves, Compass, DollarSign, LifeBuoy, Database } from 'lucide-react';

const categories = [
  { title: 'Stabilite', icon: Ship, link: '/stability' },
  { title: 'Kargo', icon: Waves, link: '/cargo' },
  { title: 'Seyir', icon: Compass, link: '/navigation-menu' },
  { title: 'Mali', icon: DollarSign, link: '/economics' },
  { title: 'Emniyet', icon: LifeBuoy, link: '/safety-menu' },
  { title: 'Operasyonel', icon: Database, link: '/tank-menu' },
];

export default function CalculationsMenu() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f2137' }}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Title */}
        <div className="flex items-center gap-4 text-white mb-10">
          <Anchor className="w-10 h-10" />
          <h1 className="text-4xl font-bold" data-no-translate>Denizcilik Hesaplamaları</h1>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/40 p-6 bg-transparent"
            >
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  <category.icon className="w-16 h-16 text-white" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <Link to={category.link} className="text-2xl font-bold text-white hover:text-blue-300 transition-colors" data-no-translate>
                    {category.title}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}