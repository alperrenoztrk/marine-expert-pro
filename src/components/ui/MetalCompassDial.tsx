import React from 'react';

interface MetalCompassDialProps {
  /** Heading in degrees, 0..360. If null/undefined, needle points to North (0). */
  headingDeg?: number | null;
  /** Optional extra classes for sizing (e.g., h-44 w-44). SVG is responsive. */
  className?: string;
}

/**
 * MetalCompassDial renders a brushed-metal style compass dial
 * with tick marks, numeric degree labels and a rotatable needle.
 * It scales to its container; set size via parent classes.
 */
const MetalCompassDial: React.FC<MetalCompassDialProps> = ({ headingDeg = 0, className = '' }) => {
  const clampedHeading = Number.isFinite(headingDeg as number)
    ? (((headingDeg as number) % 360) + 360) % 360
    : 0;

  const ticks = Array.from({ length: 360 / 5 }, (_, index) => index * 5);

  const getTickProps = (angleDeg: number) => {
    const isCardinal = angleDeg % 90 === 0;
    const isMajor = angleDeg % 30 === 0;
    const isMinor = !isCardinal && !isMajor;
    const outerRadius = 94;
    const innerRadius = isCardinal ? 70 : isMajor ? 78 : 84;
    const strokeWidth = isCardinal ? 2.4 : isMajor ? 1.6 : 1.1;
    const opacity = isMinor ? 0.6 : 0.9;
    return { innerRadius, outerRadius, strokeWidth, opacity };
  };

  return (
    <div className={className} style={{ position: 'relative' }}>
      <svg
        viewBox="0 0 200 200"
        role="img"
        aria-label="Metal compass dial"
        style={{ display: 'block', width: '100%', height: '100%' }}
        textRendering="geometricPrecision"
      >
        <defs>
          {/* Needle gradients */}
          <linearGradient id="needleRed" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="100%" stopColor="#c62828" />
          </linearGradient>
          <linearGradient id="needleWhite" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d9d9d9" />
          </linearGradient>

          {/* Glass dome effect */}
          <radialGradient id="glassDome" cx="50%" cy="40%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="35%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="70%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>

          {/* Glass edge shine */}
          <radialGradient id="glassEdge" cx="50%" cy="50%">
            <stop offset="85%" stopColor="rgba(255,255,255,0)" />
            <stop offset="95%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        {/* Outer ring with black face */}
        <g>
          <circle cx="100" cy="100" r="98" fill="#1a1a1a" />
          {/* Rim */}
          <circle cx="100" cy="100" r="98" fill="none" stroke="#4a4a4a" strokeWidth="2" />
          <circle cx="100" cy="100" r="95" fill="none" stroke="#6a6a6a" strokeWidth="1" />
        </g>

        {/* Tick marks */}
        <g stroke="white" strokeLinecap="round">
          {ticks.map((angle) => {
            const { innerRadius, outerRadius, strokeWidth, opacity } = getTickProps(angle);
            return (
              <line
                key={`tick-${angle}`}
                x1={100}
                y1={100 - outerRadius}
                x2={100}
                y2={100 - innerRadius}
                strokeWidth={strokeWidth}
                opacity={opacity}
                transform={`rotate(${angle} 100 100)`}
              />
            );
          })}
        </g>

        {/* Cardinal direction labels (N, E, S, W) - large and prominent */}
        <g
          fill="white"
          fontFamily="ui-sans-serif, system-ui, -apple-system"
          fontSize="22"
          fontWeight={900}
        >
          <text x={100} y={24} textAnchor="middle" dominantBaseline="central">N</text>
          <text x={176} y={100} textAnchor="middle" dominantBaseline="central">E</text>
          <text x={100} y={176} textAnchor="middle" dominantBaseline="central">S</text>
          <text x={24} y={100} textAnchor="middle" dominantBaseline="central">W</text>
        </g>

        {/* Main degree numbers (30° intervals) */}
        <g
          fill="white"
          fontFamily="ui-sans-serif, system-ui, -apple-system"
          fontSize="13"
          fontWeight={700}
        >
          {[30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
            const radius = 58;
            const rad = (Math.PI / 180) * angle;
            const x = 100 + radius * Math.sin(rad);
            const y = 100 - radius * Math.cos(rad);
            return (
              <text key={`deg-${angle}`} x={x} y={y} textAnchor="middle" dominantBaseline="central">
                {angle}
              </text>
            );
          })}
        </g>

        {/* Needle */}
        <g transform={`rotate(${clampedHeading} 100 100)`}>
          {/* North (red) pointer */}
          <path d="M100 20 L95 88 L100 84 L105 88 Z" fill="url(#needleRed)" stroke="#7f1d1d" strokeWidth="0.6" />
          {/* South (white) tail */}
          <path d="M100 180 L95 112 L100 116 L105 112 Z" fill="url(#needleWhite)" stroke="#6b7280" strokeWidth="0.6" />
          {/* Center cap shadow */}
          <circle cx="100" cy="100" r="6.5" fill="#9ca3af" />
          {/* Center cap */}
          <circle cx="100" cy="100" r="5" fill="#fdfdfd" stroke="#a3a3a3" strokeWidth="0.8" />
        </g>

        {/* Glass dome overlay */}
        <g>
          {/* Main glass dome */}
          <circle cx="100" cy="100" r="98" fill="url(#glassDome)" />
          {/* Glass edge shine */}
          <circle cx="100" cy="100" r="98" fill="url(#glassEdge)" />
        </g>
      </svg>
    </div>
  );
};

export default MetalCompassDial;
