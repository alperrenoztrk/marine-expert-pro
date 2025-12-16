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
      <svg viewBox="0 0 320 320" style={{ display: "block", width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id={`chrome-${safeUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8f0f4" />
            <stop offset="20%" stopColor="#d0dce4" />
            <stop offset="50%" stopColor="#a8bcc8" />
            <stop offset="80%" stopColor="#c8d8e4" />
            <stop offset="100%" stopColor="#e0ecf2" />
          </linearGradient>
          <linearGradient id={`chrome-inner-${safeUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c0d0dc" />
            <stop offset="50%" stopColor="#8ca0b0" />
            <stop offset="100%" stopColor="#b8c8d4" />
          </linearGradient>
          <radialGradient id={`face-${safeUid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e5a7a" />
            <stop offset="60%" stopColor="#0f3854" />
            <stop offset="100%" stopColor="#081e30" />
          </radialGradient>
          <radialGradient id={`degree-ring-${safeUid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </radialGradient>
          <linearGradient id={`teal-${safeUid}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#5ee8e0" />
            <stop offset="100%" stopColor="#0aa8b0" />
          </linearGradient>
          <linearGradient id={`silver-${safeUid}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#b8c8d4" />
          </linearGradient>
          <filter id={`shadow-${safeUid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.4" />
          </filter>
          <filter id={`inner-shadow-${safeUid}`} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Outer chrome rim with shadow */}
        <circle cx="160" cy="160" r="158" fill={`url(#chrome-${safeUid})`} filter={`url(#shadow-${safeUid})`} />
        <circle cx="160" cy="160" r="152" fill={`url(#chrome-inner-${safeUid})`} />
        
        {/* Dark degree ring background */}
        <circle cx="160" cy="160" r="145" fill={`url(#degree-ring-${safeUid})`} />
        
        {/* Degree ticks - more prominent */}
        {Array.from({ length: 72 }, (_, i) => {
          const angle = i * 5;
          const isMajor = angle % 30 === 0;
          const isMid = angle % 10 === 0 && !isMajor;
          const rad = (angle - 90) * Math.PI / 180;
          const outer = 143;
          const inner = isMajor ? 118 : isMid ? 128 : 135;
          const strokeWidth = isMajor ? 2.5 : isMid ? 1.5 : 1;
          const strokeColor = isMajor ? "#ffffff" : isMid ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)";
          return (
            <line key={angle}
              x1={160 + Math.cos(rad) * outer} y1={160 + Math.sin(rad) * outer}
              x2={160 + Math.cos(rad) * inner} y2={160 + Math.sin(rad) * inner}
              stroke={strokeColor} strokeWidth={strokeWidth}
            />
          );
        })}

        {/* Degree numbers - larger and bolder */}
        {degreeNumbers.map((deg) => {
          const rad = (deg - 90) * Math.PI / 180;
          return (
            <text key={deg} x={160 + Math.cos(rad) * 108} y={160 + Math.sin(rad) * 108}
              fill="#fff" fontSize="14" fontFamily="Arial, sans-serif" fontWeight="700" textAnchor="middle" dominantBaseline="central">
              {deg}
            </text>
          );
        })}

        {/* N marker - larger */}
        <text x="160" y="68" fill="#fff" fontSize="18" fontFamily="Arial, sans-serif" fontWeight="800" textAnchor="middle">N</text>

        {/* Blue face with texture effect */}
        <circle cx="160" cy="160" r="92" fill={`url(#face-${safeUid})`} filter={`url(#inner-shadow-${safeUid})`} />
        
        {/* Subtle inner ring for depth */}
        <circle cx="160" cy="160" r="90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

        {/* Compass rose */}
        <g transform={`rotate(${-displayHeading} 160 160)`}>
          {/* Cardinal points - teal */}
          <polygon points="160,70 151,160 160,146 169,160" fill={`url(#teal-${safeUid})`} />
          <polygon points="160,250 151,160 160,174 169,160" fill={`url(#teal-${safeUid})`} />
          {/* Intercardinal - silver */}
          <polygon points="250,160 160,151 174,160 160,169" fill={`url(#silver-${safeUid})`} />
          <polygon points="70,160 160,151 146,160 160,169" fill={`url(#silver-${safeUid})`} />
          {/* Diagonals */}
          <polygon points="224,96 160,151 167,160 169,151" fill={`url(#teal-${safeUid})`} opacity="0.85" />
          <polygon points="96,96 160,151 153,160 151,151" fill={`url(#silver-${safeUid})`} opacity="0.8" />
          <polygon points="224,224 169,160 160,167 160,169" fill={`url(#silver-${safeUid})`} opacity="0.8" />
          <polygon points="96,224 151,160 160,167 160,169" fill={`url(#teal-${safeUid})`} opacity="0.85" />
          {/* Inner diamond */}
          <polygon points="160,118 140,160 160,202 180,160" fill={`url(#teal-${safeUid})`} opacity="0.6" />
        </g>

        {/* Center pin with metallic effect */}
        <circle cx="160" cy="160" r="12" fill="#c8d8e4" />
        <circle cx="160" cy="160" r="8" fill="#e8f0f4" />
        <circle cx="160" cy="160" r="4" fill="#fff" />
      </svg>
    </div>
  );
};

export default SplashCompassDial;
