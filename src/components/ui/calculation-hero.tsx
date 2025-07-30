import React from "react";
import { cn } from "@/lib/utils";

interface CalculationHeroProps {
  title: string;
  description?: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

export function CalculationHero({ 
  title, 
  description, 
  imageSrc, 
  imageAlt,
  className 
}: CalculationHeroProps) {
  return (
    <div className={cn("relative w-full h-48 sm:h-64 rounded-xl overflow-hidden shadow-lg mb-6", className)}>
      <img 
        src={imageSrc} 
        alt={imageAlt}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h1>
        {description && (
          <p className="text-sm sm:text-base opacity-90">{description}</p>
        )}
      </div>
    </div>
  );
}