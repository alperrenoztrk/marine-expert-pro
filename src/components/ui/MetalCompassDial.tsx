import React, { useEffect, useId, useRef, useState } from 'react';

interface MetalCompassDialProps {
  /** Heading in degrees, 0..360. If null/undefined, needle points to North (0). */
  headingDeg?: number | null;
  /** Optional extra classes for sizing (e.g., h-44 w-44). SVG is responsive. */
  className?: string;
}

/**
 * Enhanced Maritime Compass with brass/gold styling and decorative elements
 */
const MetalCompassDial: React.FC<MetalCompassDialProps> = ({ headingDeg = 0, className = '' }) => {
  const clampedHeading = Number.isFinite(headingDeg as number)
    ? (((headingDeg as number) % 360) + 360) % 360
    : 0;

  // Avoid SVG <defs> id collisions if multiple compasses render on same screen.
  // React's useId may include ":" which is fine in HTML, but can be finicky in SVG url(#...),
  // so we sanitize to a conservative character set.
  const safeUid = useId().replace(/[^a-zA-Z0-9_-]/g, '');

  // Smooth the needle so heading updates look premium (and less jittery).
  const [displayHeading, setDisplayHeading] = useState(clampedHeading);
  const displayHeadingRef = useRef(displayHeading);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    displayHeadingRef.current = displayHeading;
  }, [displayHeading]);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const target = clampedHeading;

    const step = () => {
      const current = displayHeadingRef.current;
      // shortest-path delta in [-180, 180)
      const delta = ((target - current + 540) % 360) - 180;
      const next = current + delta * 0.18;

      if (Math.abs(delta) < 0.05) {
        displayHeadingRef.current = target;
        setDisplayHeading(target);
        rafRef.current = null;
        return;
      }

      const normalized = ((next % 360) + 360) % 360;
      displayHeadingRef.current = normalized;
      setDisplayHeading(normalized);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [clampedHeading]);

  const ticks = Array.from({ length: 360 / 5 }, (_, index) => index * 5);

  const getTickProps = (angleDeg: number) => {
    const isCardinal = angleDeg % 90 === 0;
    const isMajor = angleDeg % 30 === 0;
    const isMinor = !isCardinal && !isMajor;
    const outerRadius = 94;
    const innerRadius = isCardinal ? 68 : isMajor ? 76 : 84;
    const strokeWidth = isCardinal ? 3 : isMajor ? 2 : 1.2;
    const opacity = isMinor ? 0.7 : 1;
    return { innerRadius, outerRadius, strokeWidth, opacity };
  };

  return (
    <div className={className} style={{ position: 'relative' }}>
      <svg
        viewBox="0 0 200 200"
        role="img"
        aria-label={`Maritime compass${headingDeg !== null && headingDeg !== undefined ? `, heading ${Math.round(clampedHeading)} degrees` : ''}`}
        style={{ display: 'block', width: '100%', height: '100%' }}
        textRendering="geometricPrecision"
      >
        <defs>
          {/* Brass/Gold gradients for maritime look */}
          <radialGradient id={`brassRim-${safeUid}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="50%" stopColor="#b8960f" />
            <stop offset="100%" stopColor="#8b7506" />
          </radialGradient>
          
          <radialGradient id={`compassFace-${safeUid}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#0f1f3a" />
          </radialGradient>

          {/* Needle gradients */}
          <linearGradient id={`needleRed-${safeUid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff4444" />
            <stop offset="50%" stopColor="#dd1111" />
            <stop offset="100%" stopColor="#aa0000" />
          </linearGradient>
          
          <linearGradient id={`needleWhite-${safeUid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#e8e8e8" />
            <stop offset="100%" stopColor="#c0c0c0" />
          </linearGradient>

          {/* Glass dome effect */}
          <radialGradient id={`glassDome-${safeUid}`} cx="40%" cy="30%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
            <stop offset="30%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>

          {/* Glass edge shine */}
          <radialGradient id={`glassEdge-${safeUid}`} cx="50%" cy="50%">
            <stop offset="80%" stopColor="rgba(255,255,255,0)" />
            <stop offset="92%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>

          {/* Drop shadow for depth */}
          <filter id={`dropShadow-${safeUid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer brass rim */}
        <g>
          <circle cx="100" cy="100" r="99" fill={`url(#brassRim-${safeUid})`} />
          <circle cx="100" cy="100" r="98" fill="none" stroke="#f4e5a4" strokeWidth="1" opacity="0.6" />
          <circle cx="100" cy="100" r="96" fill="none" stroke="#8b7506" strokeWidth="1.5" />
        </g>

        {/* Deep blue compass face */}
        <circle cx="100" cy="100" r="94" fill={`url(#compassFace-${safeUid})`} />

        {/* Inner decorative circle */}
        <circle cx="100" cy="100" r="90" fill="none" stroke="#d4af37" strokeWidth="0.5" opacity="0.4" />

        {/* Compass rose - decorative lines radiating from center */}
        <g stroke="#d4af37" strokeWidth="0.3" opacity="0.2">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={`rose-${angle}`}
              x1="100"
              y1="100"
              x2="100"
              y2="35"
              transform={`rotate(${angle} 100 100)`}
            />
          ))}
        </g>

        {/* Tick marks with golden color for cardinals */}
        <g strokeLinecap="round">
          {ticks.map((angle) => {
            const { innerRadius, outerRadius, strokeWidth, opacity } = getTickProps(angle);
            const isCardinal = angle % 90 === 0;
            const isMajor = angle % 30 === 0;
            return (
              <line
                key={`tick-${angle}`}
                x1={100}
                y1={100 - outerRadius}
                x2={100}
                y2={100 - innerRadius}
                strokeWidth={strokeWidth}
                opacity={opacity}
                stroke={isCardinal ? "#fbbf24" : isMajor ? "#e8daa4" : "#ffffff"}
                transform={`rotate(${angle} 100 100)`}
                filter={isCardinal ? `url(#dropShadow-${safeUid})` : undefined}
              />
            );
          })}
        </g>

        {/* Cardinal direction labels with golden glow */}
        <g
          fill="#fbbf24"
          fontFamily="Georgia, serif"
          fontSize="28"
          fontWeight={900}
          filter={`url(#dropShadow-${safeUid})`}
        >
          <text x={100} y={18} textAnchor="middle" dominantBaseline="central" stroke="#d4af37" strokeWidth="0.5">N</text>
          <text x={182} y={100} textAnchor="middle" dominantBaseline="central" stroke="#d4af37" strokeWidth="0.5">E</text>
          <text x={100} y={182} textAnchor="middle" dominantBaseline="central" stroke="#d4af37" strokeWidth="0.5">S</text>
          <text x={18} y={100} textAnchor="middle" dominantBaseline="central" stroke="#d4af37" strokeWidth="0.5">W</text>
        </g>

        {/* Fixed North index marker on rim */}
        <g filter={`url(#dropShadow-${safeUid})`}>
          <path
            d="M100 3 L94 14 L106 14 Z"
            fill="#fbbf24"
            stroke="#8b7506"
            strokeWidth="0.8"
            opacity="0.95"
          />
        </g>

        {/* Main degree numbers */}
        <g
          fill="#e8daa4"
          fontFamily="Georgia, serif"
          fontSize="14"
          fontWeight={700}
        >
          {[30, 60, 120, 150, 210, 240, 300, 330].map((angle) => {
            const radius = 56;
            const rad = (Math.PI / 180) * angle;
            const x = 100 + radius * Math.sin(rad);
            const y = 100 - radius * Math.cos(rad);
            return (
              <text 
                key={`deg-${angle}`} 
                x={x} 
                y={y} 
                textAnchor="middle" 
                dominantBaseline="central"
                stroke="#d4af37" 
                strokeWidth="0.3"
              >
                {angle}
              </text>
            );
          })}
        </g>

        {/* Needle with enhanced 3D effect */}
        <g transform={`rotate(${-displayHeading} 100 100)`} filter={`url(#dropShadow-${safeUid})`}>
          {/* North (red) pointer - longer and more prominent */}
          <path 
            d="M100 12 L94 86 L100 82 L106 86 Z" 
            fill={`url(#needleRed-${safeUid})`} 
            stroke="#660000" 
            strokeWidth="0.8" 
          />
          <path 
            d="M100 12 L97 86 L100 82 Z" 
            fill="rgba(255,255,255,0.3)" 
            strokeWidth="0" 
          />
          
          {/* South (white) tail */}
          <path 
            d="M100 188 L94 114 L100 118 L106 114 Z" 
            fill={`url(#needleWhite-${safeUid})`} 
            stroke="#666666" 
            strokeWidth="0.8" 
          />
          
          {/* Center cap with 3D effect */}
          <circle cx="100" cy="100" r="8" fill="#4a4a4a" opacity="0.5" />
          <circle cx="100" cy="99" r="7" fill={`url(#brassRim-${safeUid})`} />
          <circle cx="100" cy="99" r="6" fill="#e8daa4" />
          <circle cx="99" cy="98" r="2.5" fill="rgba(255,255,255,0.6)" />
        </g>

        {/* Glass dome overlay with enhanced realism */}
        <g>
          <circle cx="100" cy="100" r="94" fill={`url(#glassDome-${safeUid})`} />
          <circle cx="100" cy="100" r="94" fill={`url(#glassEdge-${safeUid})`} />
          {/* Highlight reflection */}
          <ellipse cx="85" cy="75" rx="25" ry="30" fill="rgba(255,255,255,0.15)" />
        </g>
      </svg>
    </div>
  );
};

export default MetalCompassDial;
