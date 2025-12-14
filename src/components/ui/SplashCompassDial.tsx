import React from "react";

interface SplashCompassDialProps {
  /** Heading in degrees, 0..360. If null/undefined, needle points to North (0). */
  headingDeg?: number | null;
  /** Optional extra classes for sizing (e.g., h-44 w-44). SVG is responsive. */
  className?: string;
}

/**
 * Splash/landing compass dial styled to match the "Marine Expert" homepage artwork:
 * - Silver rim
 * - Deep blue face
 * - Teal/white compass rose
 */
const SplashCompassDial: React.FC<SplashCompassDialProps> = ({ headingDeg = 0, className = "" }) => {
  const clampedHeading = Number.isFinite(headingDeg as number)
    ? (((headingDeg as number) % 360) + 360) % 360
    : 0;

  return (
    <div className={className} style={{ position: "relative" }}>
      <svg
        viewBox="0 0 240 240"
        role="img"
        aria-label="Compass"
        style={{ display: "block", width: "100%", height: "100%" }}
      >
        <defs>
          <radialGradient id="rimSilver" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#f6fbff" />
            <stop offset="22%" stopColor="#d9e6ee" />
            <stop offset="55%" stopColor="#a9becb" />
            <stop offset="78%" stopColor="#e8f2f7" />
            <stop offset="100%" stopColor="#7c97a7" />
          </radialGradient>

          <radialGradient id="rimInner" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#eaf3f8" />
            <stop offset="55%" stopColor="#b9ceda" />
            <stop offset="100%" stopColor="#6e8ea0" />
          </radialGradient>

          <radialGradient id="faceBlue" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#1b6aa2" />
            <stop offset="45%" stopColor="#0f4d86" />
            <stop offset="100%" stopColor="#0a2f5a" />
          </radialGradient>

          <radialGradient id="faceGlow" cx="40%" cy="30%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>

          <linearGradient id="roseTeal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#66f0e8" />
            <stop offset="50%" stopColor="#20cfd2" />
            <stop offset="100%" stopColor="#0796b6" />
          </linearGradient>

          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="4" result="off" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.35" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Rim */}
        <g filter="url(#softShadow)">
          <circle cx="120" cy="120" r="112" fill="url(#rimSilver)" />
          <circle cx="120" cy="120" r="104" fill="url(#rimInner)" opacity="0.85" />
          <circle cx="120" cy="120" r="100" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" />
          <circle cx="120" cy="120" r="96" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="2" />
        </g>

        {/* Face */}
        <circle cx="120" cy="120" r="90" fill="url(#faceBlue)" />
        <circle cx="120" cy="120" r="86" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />

        {/* Subtle ticks */}
        <g opacity="0.35" strokeLinecap="round">
          {Array.from({ length: 72 }, (_, i) => i * 5).map((angle) => {
            const major = angle % 30 === 0;
            const cardinal = angle % 90 === 0;
            const outer = 86;
            const inner = cardinal ? 62 : major ? 70 : 76;
            const sw = cardinal ? 2.2 : major ? 1.6 : 1.0;
            return (
              <line
                key={`t-${angle}`}
                x1={120}
                y1={120 - outer}
                x2={120}
                y2={120 - inner}
                stroke={cardinal ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.55)"}
                strokeWidth={sw}
                transform={`rotate(${angle} 120 120)`}
              />
            );
          })}
        </g>

        {/* Compass letters */}
        <g
          fill="#ffffff"
          fontFamily="Georgia, serif"
          fontWeight={800}
          fontSize="28"
          opacity="0.95"
          style={{ letterSpacing: "0.5px" }}
        >
          <text x={120} y={38} textAnchor="middle" dominantBaseline="central">
            N
          </text>
          <text x={202} y={120} textAnchor="middle" dominantBaseline="central">
            E
          </text>
          <text x={120} y={202} textAnchor="middle" dominantBaseline="central">
            S
          </text>
          <text x={38} y={120} textAnchor="middle" dominantBaseline="central">
            W
          </text>
        </g>

        {/* Rose */}
        <g>
          {/* 8-point base */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <path
              key={`r-${a}`}
              d="M120 58 L112 120 L120 112 L128 120 Z"
              transform={`rotate(${a} 120 120)`}
              fill={a % 90 === 0 ? "url(#roseTeal)" : "rgba(255,255,255,0.95)"}
              opacity={a % 90 === 0 ? 1 : 0.78}
            />
          ))}

          {/* Inner teal diamond */}
          <path d="M120 86 L106 120 L120 134 L134 120 Z" fill="url(#roseTeal)" opacity="0.95" />
        </g>

        {/* Needle rotates opposite heading to mimic dial */}
        <g transform={`rotate(${-clampedHeading} 120 120)`} filter="url(#softShadow)">
          <path d="M120 46 L112 116 L120 110 L128 116 Z" fill="#f2f6fb" opacity="0.98" />
          <path d="M120 194 L112 124 L120 130 L128 124 Z" fill="#0fb7c8" opacity="0.95" />
          <circle cx="120" cy="120" r="10" fill="rgba(255,255,255,0.25)" />
          <circle cx="120" cy="120" r="8" fill="rgba(235,245,252,0.9)" />
          <circle cx="118" cy="118" r="3" fill="rgba(255,255,255,0.7)" />
        </g>

        {/* Face gloss */}
        <circle cx="120" cy="120" r="90" fill="url(#faceGlow)" />
      </svg>
    </div>
  );
};

export default SplashCompassDial;

