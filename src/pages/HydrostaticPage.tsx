import React from 'react';
import { HydrostaticCalculator } from '../components/HydrostaticCalculator';

export const HydrostaticPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HydrostaticCalculator />
    </div>
  );
};