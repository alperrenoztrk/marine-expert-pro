import React from 'react';
import { HydrostaticCalculator } from '../components/HydrostaticCalculator';

export const HydrostaticPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HydrostaticCalculator />
    </div>
  );
};