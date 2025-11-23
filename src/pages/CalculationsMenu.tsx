import React from 'react';
import { Link } from 'react-router-dom';
import { Anchor, Ship, Waves, Compass, DollarSign, LifeBuoy, Database, Shield } from 'lucide-react';

const categories = [
  { title: 'Stabilite', icon: Ship, link: '/stability' },
  { title: 'Seyir', icon: Compass, link: '/navigation-menu' },
  { title: 'Gemicilik', icon: Anchor, link: '/seamanship-menu' },
  { title: 'Mali', icon: DollarSign, link: '/economics-menu' },
  { title: 'Emniyet', icon: LifeBuoy, link: '/safety-menu' },
  { title: 'Operasyonel', icon: Database, link: '/tank-menu' },
  { title: 'SOLAS', icon: Shield, link: '/solas' },
];

export default function CalculationsMenu() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">

        {/* Categories */}
        <div className="space-y-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="block rounded-2xl border border-blue-200 p-6 bg-white transition-all duration-300 shadow-lg"
            >
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  <category.icon className="w-16 h-16 text-blue-600" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <span className="text-2xl font-bold text-blue-600" data-no-translate>
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