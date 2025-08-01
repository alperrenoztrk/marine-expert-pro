import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BallastCalculations } from '@/components/calculations/BallastCalculations';

const Ballast = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 cyberpunk:from-black cyberpunk:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Ana Sayfa
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Balast Hesaplamaları
          </h1>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <BallastCalculations />
        </div>
      </div>
    </div>
  );
};

export default Ballast;