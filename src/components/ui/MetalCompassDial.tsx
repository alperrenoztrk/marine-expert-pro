import React from 'react';

interface MetalCompassDialProps {
  /** Heading in degrees, 0..360. If null/undefined, needle points to North (0). */
  headingDeg?: number | null;
  /** Optional extra classes for sizing (e.g., h-44 w-44). SVG is responsive. */
  className?: string;
}

/**
 * MetalCompassDial renders a brushed-metal style compass dial with cardinal labels
 * and a rotatable needle. It scales to its container; set size via parent classes.
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

  const cardinalLabels = [
    { text: 'K', angle: 0 },   // Kuzey (North)
    { text: 'D', angle: 90 },  // Doğu (East)
    { text: 'G', angle: 180 }, // Güney (South)
    { text: 'B', angle: 270 }  // Batı (West)
  ];

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
          {/* Soft radial metal gradient */}
          <radialGradient id="metalRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f7f7f7" />
            <stop offset="45%" stopColor="#ededed" />
            <stop offset="75%" stopColor="#dcdcdc" />
            <stop offset="100%" stopColor="#bfbfbf" />
          </radialGradient>

          {/* Edge shadow for depth */}
          <radialGradient id="edgeShadow" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
          </radialGradient>

          {/* Subtle brushed overlay using noise */}
          <filter id="brushed" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="1" seed="3" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0.08" />
            </feComponentTransfer>
            <feGaussianBlur stdDeviation="0.4" />
          </filter>

          {/* Gloss arc */}
          <linearGradient id="gloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.65)" />
            <stop offset="25%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

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

          {/* Glass highlight */}
          <radialGradient id="glassHighlight" cx="35%" cy="25%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="25%" stopColor="rgba(255,255,255,0.2)" />
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
          <circle cx="100" cy="100" r="98" fill="#000000" />
          {/* Rim */}
          <circle cx="100" cy="100" r="98" fill="none" stroke="#9aa0a6" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="95" fill="none" stroke="#c7c7c7" strokeWidth="1" />
        </g>

        {/* Tick marks */}
        <g stroke="#2b2b2b" strokeLinecap="round">
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

        {/* Numeric labels every 30° - brighter green */}
        <g
          fill="#34d399"
          stroke="#064e3b"
          strokeWidth="0.4"
          paintOrder="stroke"
          fontFamily="ui-sans-serif, system-ui, -apple-system"
          fontSize="11"
          fontWeight={800}
        >
          {Array.from({ length: 12 }, (_, i) => i * 30).map((angle) => {
            const label = angle === 0 ? '0' : String(angle);
            const radius = 62;
            const rad = (Math.PI / 180) * angle;
            const x = 100 + radius * Math.sin(rad);
            const y = 100 - radius * Math.cos(rad);
            return (
              <text key={`deg-${angle}`} x={x} y={y} textAnchor="middle" dominantBaseline="central" opacity={1}>
                {label}
              </text>
            );
          })}
        </g>

        {/* Cardinal labels (K, D, G, B) - brighter green */}
        <g
          fill="#22c55e"
          stroke="#064e3b"
          strokeWidth="0.6"
          paintOrder="stroke"
          fontFamily="ui-sans-serif, system-ui, -apple-system"
          fontSize="16"
          fontWeight={900}
        >
          {cardinalLabels.map(({ text, angle }) => {
            const radius = 76;
            const rad = (Math.PI / 180) * angle;
            const x = 100 + radius * Math.sin(rad);
            const y = 100 - radius * Math.cos(rad);
            return (
              <text key={`card-${angle}`} x={x} y={y} textAnchor="middle" dominantBaseline="central">
                {text}
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
          {/* Glass highlight spot */}
          <ellipse cx="75" cy="65" rx="35" ry="28" fill="url(#glassHighlight)" opacity="0.8" />
          {/* Glass edge shine */}
          <circle cx="100" cy="100" r="98" fill="url(#glassEdge)" />
          {/* Subtle reflection lines */}
          <ellipse cx="65" cy="50" rx="18" ry="8" fill="rgba(255,255,255,0.3)" transform="rotate(-25 65 50)" />
          <ellipse cx="75" cy="70" rx="12" ry="5" fill="rgba(255,255,255,0.2)" transform="rotate(-30 75 70)" />
        </g>
      </svg>
    </div>
  );
};

export default MetalCompassDial;

