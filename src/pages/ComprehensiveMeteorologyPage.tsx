import React from 'react';
import { ComprehensiveMeteorology } from '@/components/calculations/ComprehensiveMeteorology';

const ComprehensiveMeteorologyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <ComprehensiveMeteorology />
    </div>
  );
};

export default ComprehensiveMeteorologyPage;