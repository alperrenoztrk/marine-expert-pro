import React from 'react';
import { Link } from 'react-router-dom';
import { Anchor, Ship, Waves, Compass, DollarSign, LifeBuoy, Database } from 'lucide-react';

const categories = [
  { title: 'Stabilite', icon: Ship, link: '/stability' },
  { title: 'Seyir', icon: Compass, link: '/navigation' },
  { title: 'Mali', icon: DollarSign, link: '/economics-menu' },
  { title: 'Emniyet', icon: LifeBuoy, link: '/safety-menu' },
  { title: 'Operasyonel', icon: Database, link: '/tank-menu' },
];

export default function CalculationsMenu() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Deep maritime background matching homepage */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-dark via-primary to-primary-light"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        {/* Title */}
        <div className="flex items-center gap-4 mb-10">
          <Anchor className="w-10 h-10 text-blue-600 drop-shadow-lg" />
          <h1 className="text-4xl font-bold text-blue-600 drop-shadow-lg" data-no-translate>Denizcilik Hesaplamaları</h1>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="block rounded-2xl border border-white/30 p-6 bg-white/10 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  <category.icon className="w-16 h-16 text-blue-700 drop-shadow-lg" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <span className="text-2xl font-bold text-blue-700 drop-shadow-sm" data-no-translate>
                    {category.title}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}