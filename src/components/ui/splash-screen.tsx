import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Anchor, Waves, Ship, Compass } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export const SplashScreen = ({ onComplete, duration = 3000 }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const steps = [
      { delay: 500, step: 1 },   // Logo appears
      { delay: 1000, step: 2 },  // Waves animation
      { delay: 1500, step: 3 },  // Ship animation
      { delay: 2000, step: 4 },  // Text appears
      { delay: duration, step: 5 } // Complete
    ];

    const timeouts = steps.map(({ delay, step }) => 
      setTimeout(() => {
        if (step === 5) {
          setIsVisible(false);
          setTimeout(onComplete, 500); // Wait for exit animation
        } else {
          setCurrentStep(step);
        }
      }, delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete, duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-500"
        >
          {/* Background Wave Pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                repeatType: "loop",
                ease: "linear" 
              }}
              className="absolute top-0 left-0 w-[200%] h-full opacity-10"
            >
              <svg viewBox="0 0 1200 120" className="w-full h-full">
                <path
                  d="M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,120 L0,120 Z"
                  fill="rgba(255,255,255,0.1)"
                />
                <path
                  d="M0,80 C300,140 600,20 900,80 C1050,110 1150,50 1200,80 L1200,120 L0,120 Z"
                  fill="rgba(255,255,255,0.05)"
                />
              </svg>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="relative flex flex-col items-center justify-center text-white">
            
            {/* Logo Container */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={currentStep >= 1 ? { scale: 1, rotate: 0 } : {}}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15,
                duration: 0.8 
              }}
              className="relative mb-8"
            >
              {/* Main Logo Circle */}
              <div className="relative w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full border-4 border-white/30 flex items-center justify-center">
                
                {/* Rotating Compass Ring */}
                <motion.div
                  animate={currentStep >= 1 ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="absolute inset-2 border-2 border-dashed border-white/40 rounded-full"
                />
                
                {/* Center Anchor */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={currentStep >= 1 ? { scale: 1 } : {}}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <Anchor className="w-12 h-12 text-white" />
                </motion.div>
                
                {/* Floating Elements */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={currentStep >= 2 ? { 
                    opacity: 1, 
                    y: [10, -5, 10],
                  } : {}}
                  transition={{ 
                    delay: 0.5,
                    y: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  className="absolute -top-6 -right-6"
                >
                  <Ship className="w-8 h-8 text-cyan-200" />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={currentStep >= 2 ? { 
                    opacity: 1, 
                    x: [-10, 5, -10],
                  } : {}}
                  transition={{ 
                    delay: 0.7,
                    x: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  className="absolute -bottom-6 -left-6"
                >
                  <Waves className="w-8 h-8 text-blue-200" />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={currentStep >= 2 ? { 
                    opacity: 1, 
                    rotate: [0, 15, -15, 0],
                  } : {}}
                  transition={{ 
                    delay: 0.9,
                    rotate: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  className="absolute -top-6 -left-6"
                >
                  <Compass className="w-6 h-6 text-yellow-200" />
                </motion.div>
              </div>
            </motion.div>

            {/* App Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={currentStep >= 4 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                Maritime Calculator
              </h1>
              <p className="text-lg text-white/80 font-light">
                Profesyonel Denizcilik Hesaplamaları
              </p>
            </motion.div>

            {/* Loading Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={currentStep >= 3 ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-col items-center"
            >
              {/* Progress Bar */}
              <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={currentStep >= 3 ? { width: "100%" } : {}}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-white rounded-full"
                />
              </div>
              
              {/* Loading Dots */}
              <div className="flex space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.5, opacity: 0.3 }}
                    animate={currentStep >= 3 ? {
                      scale: [0.5, 1, 0.5],
                      opacity: [0.3, 1, 0.3],
                    } : {}}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                    className="w-3 h-3 bg-white rounded-full"
                  />
                ))}
              </div>
              
              {/* Loading Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={currentStep >= 3 ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
                className="mt-4 text-white/70 text-sm"
              >
                Denizcilik modülleri yükleniyor...
              </motion.p>
            </motion.div>
          </div>

          {/* Particle Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 12 }, (_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0,
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 50,
                }}
                animate={currentStep >= 2 ? {
                  opacity: [0, 0.6, 0],
                  y: -50,
                } : {}}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: Math.random() * 100 + "%",
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};