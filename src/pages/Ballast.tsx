import React from 'react';
import { Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BallastCalculations } from '@/components/calculations/BallastCalculations';

const Ballast = () => {
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 cyberpunk:from-black cyberpunk:to-gray-900 neon:from-slate-900 neon:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Droplets className="h-12 w-12 text-blue-600 dark:text-blue-400 nature-icon" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent nature-title">
              Balast Hesaplamaları
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Balast tankları, ağırlık dağılımı ve stabilite hesaplamalarınızı yapın
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <BallastCalculations />
        </div>
      </div>
    </div>
  );
};

export default Ballast;