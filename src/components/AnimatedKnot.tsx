import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KnotStep {
  id: string;
  description: string;
  paths: string[];
  duration: number; // milliseconds
}

interface AnimatedKnotProps {
  knotName: string;
  steps: KnotStep[];
  className?: string;
}

export default function AnimatedKnot({ knotName, steps, className = "" }: AnimatedKnotProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visiblePaths, setVisiblePaths] = useState<string[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);

  // Animation effect
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsPlaying(false);
        setShowCompletion(true);
        setTimeout(() => setShowCompletion(false), 2000);
      }
    }, steps[currentStep]?.duration || 1000);

    return () => clearTimeout(timer);
  }, [currentStep, isPlaying, steps]);

  // Update visible paths when step changes
  useEffect(() => {
    const newVisiblePaths: string[] = [];
    for (let i = 0; i <= currentStep; i++) {
      newVisiblePaths.push(...steps[i]?.paths || []);
    }
    setVisiblePaths(newVisiblePaths);
  }, [currentStep, steps]);

  const handlePlay = () => {
    if (currentStep === steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setShowCompletion(false);
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setIsPlaying(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Animation Controls */}
      <div className="flex items-center justify-center gap-2 p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg backdrop-blur-sm">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="gap-1"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        
        {isPlaying ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handlePause}
            className="gap-1"
          >
            <Pause className="h-4 w-4" />
            Pause
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handlePlay}
            className="gap-1"
          >
            <Play className="h-4 w-4" />
            Play
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentStep >= steps.length - 1}
          className="gap-1"
        >
          <SkipForward className="h-4 w-4" />
          Next
        </Button>
      </div>

      {/* Step Progress */}
      <div className="flex justify-center gap-2 mb-2">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => handleStepClick(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index <= currentStep
                ? 'bg-blue-600 dark:bg-blue-400 shadow-lg'
                : 'bg-gray-300 dark:bg-gray-600'
            } ${
              index === currentStep
                ? 'ring-2 ring-blue-400 dark:ring-blue-300 scale-110'
                : ''
            } hover:scale-105`}
            title={`Step ${index + 1}: ${steps[index]?.description}`}
          />
        ))}
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
        <div 
          className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Current Step Description */}
      <div className="text-center">
        {showCompletion ? (
          <div className="animate-bounce">
            <p className="text-lg text-green-600 dark:text-green-400 font-bold">
              🎉 Düğüm Tamamlandı! 🎉
            </p>
          </div>
        ) : (
          <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]?.description}
          </p>
        )}
      </div>

      {/* Animated SVG */}
      <div className="flex justify-center">
        <div className="relative">
          <svg 
            viewBox="0 0 400 300" 
            className="w-full max-w-md h-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <style>
                {`
                  .rope { 
                    fill: none; 
                    stroke: #8B4513; 
                    stroke-width: 8; 
                    stroke-linecap: round;
                    opacity: 0;
                    transition: opacity 0.8s ease-in-out;
                    filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
                  }
                  .rope.visible { 
                    opacity: 1; 
                    animation: ropeAppear 0.8s ease-in-out;
                  }
                  @keyframes ropeAppear {
                    0% { opacity: 0; transform: scale(0.8); }
                    50% { opacity: 0.7; transform: scale(1.1); }
                    100% { opacity: 1; transform: scale(1); }
                  }
                  .rope-end { 
                    fill: #8B4513; 
                    opacity: 0;
                    transition: opacity 0.5s ease-in-out;
                  }
                  .rope-end.visible { 
                    opacity: 1; 
                  }
                  .background { 
                    fill: #F5F5DC; 
                  }
                  .step-label {
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                    fill: #333;
                    opacity: 0;
                    transition: opacity 0.5s ease-in-out;
                  }
                  .step-label.visible {
                    opacity: 1;
                  }
                `}
              </style>
            </defs>
            
            {/* Background */}
            <rect width="400" height="300" className="background"/>
            
            {/* Dynamic rope paths based on current step */}
            {steps.slice(0, currentStep + 1).map((step, stepIndex) => 
              step.paths.map((path, pathIndex) => (
                <path
                  key={`${stepIndex}-${pathIndex}`}
                  d={path}
                  className={`rope ${visiblePaths.includes(path) ? 'visible' : ''}`}
                />
              ))
            )}
            
            {/* Title */}
            <text 
              x="200" 
              y="30" 
              fontFamily="Arial" 
              fontSize="16" 
              fontWeight="bold" 
              textAnchor="middle" 
              fill="#333"
            >
              {knotName}
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}