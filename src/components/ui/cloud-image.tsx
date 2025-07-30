import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface CloudImageProps {
  src: string;
  alt: string;
  cloudType: string;
  cloudCode: string;
  emoji: string;
  variant?: 'default' | 'warning' | 'danger';
  description?: string;
  className?: string;
}

export const CloudImage: React.FC<CloudImageProps> = ({
  src,
  alt,
  cloudType,
  cloudCode,
  emoji,
  variant = 'default',
  description,
  className
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const variantStyles = {
    default: {
      border: 'border-blue-200',
      badge: 'bg-black/70',
      gradient: 'from-sky-50 via-blue-100 to-blue-200',
      textColor: 'text-blue-900',
      subtextColor: 'text-blue-700',
      shadow: 'shadow-md hover:shadow-lg'
    },
    warning: {
      border: 'border-yellow-300',
      badge: 'bg-yellow-600/90',
      gradient: 'from-yellow-50 via-yellow-100 to-yellow-200',
      textColor: 'text-yellow-900',
      subtextColor: 'text-yellow-700',
      shadow: 'shadow-md hover:shadow-lg'
    },
    danger: {
      border: 'border-red-300',
      badge: 'bg-red-500/90',
      gradient: 'from-gray-600 via-gray-800 to-gray-900',
      textColor: 'text-white',
      subtextColor: 'text-yellow-200',
      shadow: 'shadow-lg hover:shadow-xl'
    }
  };

  const styles = variantStyles[variant];

  return (
    <div className={cn(
      "relative w-full h-32 rounded-lg overflow-hidden transition-all duration-300 group",
      styles.border,
      styles.shadow,
      className
    )}>
      {/* Loading State */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {/* Image Container with Better Optimization */}
      <div className="relative w-full h-full overflow-hidden">
        {!hasError && (
          <img 
            src={src}
            alt={alt}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              isLoading ? "opacity-0 scale-105" : "opacity-100 scale-100",
              "group-hover:scale-110 transform"
            )}
            style={{
              imageRendering: 'crisp-edges',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
        )}

        {/* Overlay Gradient for Better Text Visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Fallback Content */}
      {hasError && (
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br flex items-center justify-center text-center p-3",
          styles.gradient
        )}>
          <div className="transform transition-transform duration-300 group-hover:scale-105">
            <div className="text-4xl mb-1 filter drop-shadow-sm animate-pulse">{emoji}</div>
            <div className={cn("text-sm font-bold mb-1", styles.textColor)}>
              {cloudType.toUpperCase()}
            </div>
            {description && (
              <div className={cn("text-xs leading-tight", styles.subtextColor)}>
                {description.split('|').map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    {idx < description.split('|').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cloud Code Badge */}
      <div className={cn(
        "absolute top-1 right-1 px-2 py-1 rounded text-xs font-medium text-white transition-all duration-300",
        styles.badge,
        "backdrop-blur-sm group-hover:scale-105"
      )}>
        {cloudCode}
      </div>

      {/* Cloud Type Label */}
      <div className={cn(
        "absolute bottom-1 left-1 px-2 py-1 rounded text-xs font-bold text-white transition-all duration-300",
        styles.badge,
        "backdrop-blur-sm group-hover:scale-105"
      )}>
        {cloudType.toUpperCase()}
        {variant === 'danger' && ' ⚠️'}
      </div>
    </div>
  );
};