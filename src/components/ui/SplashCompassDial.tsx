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
  const [velocity, setVelocity] = useState(0);
  const displayHeadingRef = useRef(displayHeading);
  const velocityRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => { displayHeadingRef.current = displayHeading; }, [displayHeading]);

  // Dampened spring physics for realistic needle movement
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const target = clampedHeading;
    const springStiffness = 0.08;
    const damping = 0.85;
    
    const step = () => {
      const current = displayHeadingRef.current;
      let delta = ((target - current + 540) % 360) - 180;
      
      // Apply spring physics
      const force = delta * springStiffness;
      velocityRef.current = (velocityRef.current + force) * damping;
      
      if (Math.abs(delta) < 0.01 && Math.abs(velocityRef.current) < 0.01) {
        displayHeadingRef.current = target;
        setDisplayHeading(target);
        velocityRef.current = 0;
        return;
      }
      
      const next = ((current + velocityRef.current) % 360 + 360) % 360;
      displayHeadingRef.current = next;
      setDisplayHeading(next);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [clampedHeading]);

  // Generate compass rose points
  const generateCompassRose = () => {
    const points = [];
    // 8 main directions (N, NE, E, SE, S, SW, W, NW)
    for (let i = 0; i < 8; i++) {
      const angle = i * 45;
      const isPrimary = i % 2 === 0; // N, E, S, W
      const length = isPrimary ? 55 : 40;
      const width = isPrimary ? 12 : 8;
      points.push({ angle, length, width, isPrimary });
    }
    return points;
  };

  const rosePoints = generateCompassRose();

  return (
    <div className={`${className} relative`}>
      {/* Ambient glow effect */}
      <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      
      <svg viewBox="0 0 400 400" className="block w-full h-full drop-shadow-2xl">
        <defs>
          {/* Antique Bronze Frame Gradient */}
          <linearGradient id={`bronze-frame-${safeUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4a574" />
            <stop offset="15%" stopColor="#c9956a" />
            <stop offset="30%" stopColor="#b8834f" />
            <stop offset="50%" stopColor="#9c6b3d" />
            <stop offset="70%" stopColor="#b8834f" />
            <stop offset="85%" stopColor="#d4a574" />
            <stop offset="100%" stopColor="#e8c49a" />
          </linearGradient>
          
          {/* Inner Bronze Ring */}
          <linearGradient id={`bronze-inner-${safeUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b6914" />
            <stop offset="25%" stopColor="#b8860b" />
            <stop offset="50%" stopColor="#daa520" />
            <stop offset="75%" stopColor="#b8860b" />
            <stop offset="100%" stopColor="#8b6914" />
          </linearGradient>
          
          {/* Deep Navy Enamel Face */}
          <radialGradient id={`navy-face-${safeUid}`} cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#1a3a5c" />
            <stop offset="40%" stopColor="#0f2744" />
            <stop offset="70%" stopColor="#091a2e" />
            <stop offset="100%" stopColor="#050d16" />
          </radialGradient>
          
          {/* Gold Gradient for Rose */}
          <linearGradient id={`gold-${safeUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="30%" stopColor="#f4c430" />
            <stop offset="50%" stopColor="#daa520" />
            <stop offset="70%" stopColor="#f4c430" />
            <stop offset="100%" stopColor="#ffd700" />
          </linearGradient>
          
          {/* Red North Needle */}
          <linearGradient id={`red-needle-${safeUid}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ff4444" />
            <stop offset="30%" stopColor="#cc0000" />
            <stop offset="70%" stopColor="#990000" />
            <stop offset="100%" stopColor="#660000" />
          </linearGradient>
          
          {/* Gold Needle Outline */}
          <linearGradient id={`gold-needle-${safeUid}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="50%" stopColor="#b8860b" />
            <stop offset="100%" stopColor="#8b6914" />
          </linearGradient>
          
          {/* Silver South Needle */}
          <linearGradient id={`silver-needle-${safeUid}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#e8e8e8" />
            <stop offset="70%" stopColor="#c0c0c0" />
            <stop offset="100%" stopColor="#808080" />
          </linearGradient>
          
          {/* Center Pin Gold */}
          <radialGradient id={`center-pin-${safeUid}`} cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="50%" stopColor="#daa520" />
            <stop offset="100%" stopColor="#8b6914" />
          </radialGradient>
          
          {/* Glass Dome Effect */}
          <radialGradient id={`glass-dome-${safeUid}`} cx="35%" cy="25%" r="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="30%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          
          {/* Glass Highlight */}
          <linearGradient id={`glass-highlight-${safeUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
          </linearGradient>
          
          {/* Emboss Filter */}
          <filter id={`emboss-${safeUid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
            <feSpecularLighting in="blur" surfaceScale="4" specularConstant="0.8" specularExponent="20" result="spec">
              <fePointLight x="100" y="100" z="200" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="specOut" />
            <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
          </filter>
          
          {/* Drop Shadow */}
          <filter id={`drop-shadow-${safeUid}`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.5" />
          </filter>
          
          {/* Inner Shadow */}
          <filter id={`inner-shadow-${safeUid}`} x="-10%" y="-10%" width="120%" height="120%">
            <feComponentTransfer in="SourceAlpha">
              <feFuncA type="table" tableValues="1 0" />
            </feComponentTransfer>
            <feGaussianBlur stdDeviation="6" />
            <feOffset dx="0" dy="4" result="offsetblur" />
            <feFlood floodColor="#000" floodOpacity="0.4" result="color" />
            <feComposite in2="offsetblur" operator="in" />
            <feComposite in2="SourceAlpha" operator="in" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode />
            </feMerge>
          </filter>
          
          {/* Glow Filter */}
          <filter id={`glow-${safeUid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer decorative frame with ornamental pattern */}
        <circle cx="200" cy="200" r="195" fill={`url(#bronze-frame-${safeUid})`} filter={`url(#drop-shadow-${safeUid})`} />
        
        {/* Frame emboss rings */}
        <circle cx="200" cy="200" r="192" fill="none" stroke="#e8c49a" strokeWidth="1" opacity="0.6" />
        <circle cx="200" cy="200" r="188" fill="none" stroke="#8b6914" strokeWidth="2" />
        
        {/* Decorative frame pattern - ornamental dots */}
        {Array.from({ length: 32 }, (_, i) => {
          const angle = (i * 11.25 - 90) * Math.PI / 180;
          const x = 200 + Math.cos(angle) * 183;
          const y = 200 + Math.sin(angle) * 183;
          return <circle key={`dot-${i}`} cx={x} cy={y} r="2" fill="#daa520" opacity="0.8" />;
        })}
        
        {/* Inner gold ring */}
        <circle cx="200" cy="200" r="175" fill={`url(#bronze-inner-${safeUid})`} />
        <circle cx="200" cy="200" r="170" fill="none" stroke="#ffd700" strokeWidth="1.5" opacity="0.5" />
        
        {/* Degree ring background */}
        <circle cx="200" cy="200" r="168" fill="#0a0a0a" />
        
        {/* Degree ticks and numbers */}
        {Array.from({ length: 72 }, (_, i) => {
          const angle = i * 5;
          const isMajor = angle % 30 === 0;
          const isMid = angle % 10 === 0 && !isMajor;
          const rad = (angle - 90) * Math.PI / 180;
          const outer = 166;
          const inner = isMajor ? 148 : isMid ? 155 : 160;
          const strokeWidth = isMajor ? 2.5 : isMid ? 1.5 : 0.8;
          const strokeColor = isMajor ? "#daa520" : isMid ? "#b8860b" : "rgba(184,134,11,0.5)";
          
          return (
            <g key={`tick-${angle}`}>
              <line
                x1={200 + Math.cos(rad) * outer}
                y1={200 + Math.sin(rad) * outer}
                x2={200 + Math.cos(rad) * inner}
                y2={200 + Math.sin(rad) * inner}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
              />
              {/* Degree numbers for major ticks */}
              {isMajor && angle !== 0 && angle !== 90 && angle !== 180 && angle !== 270 && (
                <text
                  x={200 + Math.cos(rad) * 138}
                  y={200 + Math.sin(rad) * 138}
                  fill="#b8860b"
                  fontSize="11"
                  fontFamily="Georgia, serif"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {angle}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Navy enamel face */}
        <circle cx="200" cy="200" r="146" fill={`url(#navy-face-${safeUid})`} filter={`url(#inner-shadow-${safeUid})`} />
        
        {/* Compass Rose - decorative rays */}
        <g transform="translate(200, 200)">
          {/* 16 secondary rays */}
          {Array.from({ length: 16 }, (_, i) => {
            const angle = i * 22.5;
            const rad = (angle - 90) * Math.PI / 180;
            const length = i % 2 === 0 ? 125 : 95;
            const width = i % 2 === 0 ? 3 : 1.5;
            return (
              <line
                key={`ray-${i}`}
                x1="0" y1="0"
                x2={Math.cos(rad) * length}
                y2={Math.sin(rad) * length}
                stroke="rgba(218,165,32,0.15)"
                strokeWidth={width}
              />
            );
          })}
          
          {/* Main compass rose points */}
          {rosePoints.map(({ angle, length, width, isPrimary }, i) => {
            const rad = (angle - 90) * Math.PI / 180;
            const tipX = Math.cos(rad) * length;
            const tipY = Math.sin(rad) * length;
            const perpRad = rad + Math.PI / 2;
            const baseWidth = width;
            
            return (
              <polygon
                key={`rose-${i}`}
                points={`
                  ${tipX},${tipY}
                  ${Math.cos(perpRad) * baseWidth},${Math.sin(perpRad) * baseWidth}
                  0,0
                  ${-Math.cos(perpRad) * baseWidth},${-Math.sin(perpRad) * baseWidth}
                `}
                fill={isPrimary ? `url(#gold-${safeUid})` : "rgba(218,165,32,0.6)"}
                stroke={isPrimary ? "#8b6914" : "none"}
                strokeWidth="0.5"
                opacity={isPrimary ? 1 : 0.7}
              />
            );
          })}
          
          {/* Fleur-de-lis at North */}
          <g transform="translate(0, -70)">
            <path
              d="M0,-18 C-3,-15 -6,-10 -4,-5 C-6,-8 -10,-8 -12,-4 C-14,0 -10,6 -4,4 C-6,8 -4,12 0,15 C4,12 6,8 4,4 C10,6 14,0 12,-4 C10,-8 6,-8 4,-5 C6,-10 3,-15 0,-18 Z"
              fill={`url(#gold-${safeUid})`}
              stroke="#8b6914"
              strokeWidth="0.5"
              filter={`url(#glow-${safeUid})`}
            />
          </g>
        </g>
        
        {/* Cardinal direction letters */}
        <text x="200" y="95" fill="#ffd700" fontSize="24" fontFamily="Georgia, serif" fontWeight="bold" textAnchor="middle" filter={`url(#glow-${safeUid})`}>N</text>
        <text x="200" y="318" fill="#c0c0c0" fontSize="20" fontFamily="Georgia, serif" fontWeight="bold" textAnchor="middle">S</text>
        <text x="88" y="206" fill="#c0c0c0" fontSize="20" fontFamily="Georgia, serif" fontWeight="bold" textAnchor="middle">W</text>
        <text x="312" y="206" fill="#c0c0c0" fontSize="20" fontFamily="Georgia, serif" fontWeight="bold" textAnchor="middle">E</text>
        
        {/* Intercardinal direction letters */}
        <text x="270" y="135" fill="rgba(192,192,192,0.7)" fontSize="13" fontFamily="Georgia, serif" fontWeight="bold" textAnchor="middle">NE</text>
        <text x="270" y="278" fill="rgba(192,192,192,0.7)" fontSize="13" fontFamily="Georgia, serif" fontWeight="bold" textAnchor="middle">SE</text>
        <text x="130" y="278" fill="rgba(192,192,192,0.7)" fontSize="13" fontFamily="Georgia, serif" fontWeight="bold" textAnchor="middle">SW</text>
        <text x="130" y="135" fill="rgba(192,192,192,0.7)" fontSize="13" fontFamily="Georgia, serif" fontWeight="bold" textAnchor="middle">NW</text>

        {/* Animated Needle Group */}
        <g transform={`rotate(${-displayHeading} 200 200)`} style={{ transition: 'none' }}>
          {/* Needle shadow */}
          <g transform="translate(3, 3)" opacity="0.3">
            <polygon points="200,75 188,200 200,180 212,200" fill="#000" />
            <polygon points="200,325 188,200 200,220 212,200" fill="#000" />
          </g>
          
          {/* North needle - Red with gold trim */}
          <polygon
            points="200,80 186,200 200,175 214,200"
            fill={`url(#red-needle-${safeUid})`}
            stroke={`url(#gold-needle-${safeUid})`}
            strokeWidth="2"
            filter={`url(#glow-${safeUid})`}
          />
          {/* North needle highlight */}
          <polygon
            points="200,85 194,180 200,170"
            fill="rgba(255,255,255,0.3)"
          />
          
          {/* South needle - Silver */}
          <polygon
            points="200,320 186,200 200,225 214,200"
            fill={`url(#silver-needle-${safeUid})`}
            stroke="rgba(128,128,128,0.5)"
            strokeWidth="1"
          />
          {/* South needle highlight */}
          <polygon
            points="200,315 194,220 200,230"
            fill="rgba(255,255,255,0.2)"
          />
        </g>
        
        {/* Center pin assembly */}
        <circle cx="200" cy="200" r="18" fill={`url(#center-pin-${safeUid})`} filter={`url(#emboss-${safeUid})`} />
        <circle cx="200" cy="200" r="14" fill="#daa520" />
        <circle cx="200" cy="200" r="10" fill={`url(#center-pin-${safeUid})`} />
        <circle cx="200" cy="200" r="6" fill="#ffd700" />
        {/* Center pin highlight */}
        <circle cx="197" cy="197" r="3" fill="rgba(255,255,255,0.6)" />
        
        {/* Glass dome overlay */}
        <circle cx="200" cy="200" r="146" fill={`url(#glass-dome-${safeUid})`} />
        
        {/* Glass dome edge highlight */}
        <ellipse cx="160" cy="140" rx="60" ry="30" fill={`url(#glass-highlight-${safeUid})`} opacity="0.3" transform="rotate(-20, 160, 140)" />
        
        {/* Subtle glass reflection line */}
        <path
          d="M100,180 Q150,120 200,100 Q250,80 280,100"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      
      {/* CSS for breathing animation */}
      <style>{`
        @keyframes compass-breathe {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(218, 165, 32, 0.3)); }
          50% { filter: drop-shadow(0 0 30px rgba(218, 165, 32, 0.5)); }
        }
      `}</style>
    </div>
  );
};

export default SplashCompassDial;
