import React, { useEffect, useId, useRef, useState } from "react";

interface SplashCompassDialProps {
  headingDeg?: number | null;
  className?: string;
}

const SplashCompassDial: React.FC<SplashCompassDialProps> = ({ headingDeg = 0, className = "" }) => {
  const clampedHeading = Number.isFinite(headingDeg as number)
    ? (((headingDeg as number) % 360) + 360) % 360
    : 0;

  const safeUid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [displayHeading, setDisplayHeading] = useState(clampedHeading);
  const displayHeadingRef = useRef(displayHeading);
  const rafRef = useRef<number | null>(null);

  useEffect(() => { displayHeadingRef.current = displayHeading; }, [displayHeading]);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const target = clampedHeading;
    const step = () => {
      const current = displayHeadingRef.current;
      const delta = ((target - current + 540) % 360) - 180;
      if (Math.abs(delta) < 0.05) {
        displayHeadingRef.current = target;
        setDisplayHeading(target);
        return;
      }
      const next = ((current + delta * 0.18) % 360 + 360) % 360;
      displayHeadingRef.current = next;
      setDisplayHeading(next);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [clampedHeading]);

  const degreeNumbers = [30, 120, 180, 210, 270, 300, 330];

  return (
    <div className={className} style={{ position: "relative" }}>
      <svg viewBox="0 0 300 300" style={{ display: "block", width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id={`chrome-${safeUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0f5f8" />
            <stop offset="30%" stopColor="#c8d8e4" />
            <stop offset="70%" stopColor="#98b0c0" />
            <stop offset="100%" stopColor="#d8e4ec" />
          </linearGradient>
          <radialGradient id={`face-${safeUid}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor="#1a5070" />
            <stop offset="100%" stopColor="#0a2540" />
          </radialGradient>
          <linearGradient id={`teal-${safeUid}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#5ee8e0" />
            <stop offset="100%" stopColor="#0aa8b0" />
          </linearGradient>
          <linearGradient id={`silver-${safeUid}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#b8c8d4" />
          </linearGradient>
        </defs>

        {/* Chrome rim */}
        <circle cx="150" cy="150" r="145" fill={`url(#chrome-${safeUid})`} />
        <circle cx="150" cy="150" r="130" fill="#1a1a1a" />
        
        {/* Degree ticks */}
        {Array.from({ length: 72 }, (_, i) => {
          const angle = i * 5;
          const isMajor = angle % 30 === 0;
          const rad = (angle - 90) * Math.PI / 180;
          const outer = 130, inner = isMajor ? 112 : 122;
          return (
            <line key={angle}
              x1={150 + Math.cos(rad) * outer} y1={150 + Math.sin(rad) * outer}
              x2={150 + Math.cos(rad) * inner} y2={150 + Math.sin(rad) * inner}
              stroke={isMajor ? "#fff" : "rgba(255,255,255,0.5)"} strokeWidth={isMajor ? 2 : 1}
            />
          );
        })}

        {/* Degree numbers */}
        {degreeNumbers.map((deg) => {
          const rad = (deg - 90) * Math.PI / 180;
          return (
            <text key={deg} x={150 + Math.cos(rad) * 100} y={150 + Math.sin(rad) * 100}
              fill="#fff" fontSize="13" fontFamily="Arial" fontWeight="600" textAnchor="middle" dominantBaseline="central">
              {deg}
            </text>
          );
        })}

        {/* N marker */}
        <text x="150" y="60" fill="#fff" fontSize="16" fontFamily="Arial" fontWeight="700" textAnchor="middle">N</text>

        {/* Blue face */}
        <circle cx="150" cy="150" r="88" fill={`url(#face-${safeUid})`} />

        {/* Compass rose */}
        <g transform={`rotate(${-displayHeading} 150 150)`}>
          {/* Cardinal points - teal */}
          <polygon points="150,62 142,150 150,138 158,150" fill={`url(#teal-${safeUid})`} />
          <polygon points="150,238 142,150 150,162 158,150" fill={`url(#teal-${safeUid})`} />
          {/* Intercardinal - silver */}
          <polygon points="238,150 150,142 162,150 150,158" fill={`url(#silver-${safeUid})`} />
          <polygon points="62,150 150,142 138,150 150,158" fill={`url(#silver-${safeUid})`} />
          {/* Diagonals */}
          <polygon points="212,88 150,142 156,150 158,142" fill={`url(#teal-${safeUid})`} opacity="0.85" />
          <polygon points="88,88 150,142 144,150 142,142" fill={`url(#silver-${safeUid})`} opacity="0.8" />
          <polygon points="212,212 158,150 150,156 150,158" fill={`url(#silver-${safeUid})`} opacity="0.8" />
          <polygon points="88,212 142,150 150,156 150,158" fill={`url(#teal-${safeUid})`} opacity="0.85" />
          {/* Inner diamond */}
          <polygon points="150,110 132,150 150,190 168,150" fill={`url(#teal-${safeUid})`} opacity="0.6" />
        </g>

        {/* Center pin */}
        <circle cx="150" cy="150" r="10" fill="#d8e4ec" />
        <circle cx="150" cy="150" r="5" fill="#fff" />
      </svg>
    </div>
  );
};

export default SplashCompassDial;
