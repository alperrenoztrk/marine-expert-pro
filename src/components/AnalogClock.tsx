import React, { useEffect, useMemo, useRef } from "react";

type AnalogClockProps = {
  size?: number;
  showSecondHand?: boolean;
  className?: string;
};

/**
 * AnalogClock renders a classic wall clock with numbers 1-12 placed accurately.
 * - Numbers are typeset upright and positioned at correct angles using polar coords
 * - Hands animate using CSS transitions; seconds hand updates every 1s
 */
const AnalogClock: React.FC<AnalogClockProps> = ({
  size = 300,
  showSecondHand = true,
  className = "",
}) => {
  const secondRef = useRef<HTMLDivElement | null>(null);
  const minuteRef = useRef<HTMLDivElement | null>(null);
  const hourRef = useRef<HTMLDivElement | null>(null);

  const radius = useMemo(() => size / 2, [size]);
  const numeralRadius = useMemo(() => radius * 0.78, [radius]);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours();

      const secondsDeg = seconds * 6; // 360 / 60
      const minutesDeg = minutes * 6 + seconds * 0.1; // 6 per minute + 0.1 per sec
      const hoursDeg = ((hours % 12) + minutes / 60) * 30; // 30 per hour

      if (secondRef.current) secondRef.current.style.transform = `rotate(${secondsDeg}deg)`;
      if (minuteRef.current) minuteRef.current.style.transform = `rotate(${minutesDeg}deg)`;
      if (hourRef.current) hourRef.current.style.transform = `rotate(${hoursDeg}deg)`;
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const numerals = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  return (
    <div
      className={`relative select-none rounded-full bg-white shadow-xl border border-neutral-300 ${className}`}
      style={{ width: size, height: size }}
      aria-label="Analog clock"
      role="img"
    >
      {/* Outer bezel */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: "inset 0 0 0 10px #1112, inset 0 0 0 2px #9999" }}
      />

      {/* Tick marks */}
      {Array.from({ length: 60 }).map((_, i) => {
        const isHour = i % 5 === 0;
        const width = isHour ? 4 : 2;
        const length = isHour ? radius * 0.12 : radius * 0.06;
        const angle = i * 6;
        return (
          <div
            key={`tick-${i}`}
            className="absolute origin-bottom left-1/2"
            style={{
              height: length,
              width,
              background: isHour ? "#111" : "#777",
              transform: `translateX(-50%) rotate(${angle}deg)` as React.CSSProperties["transform"],
              top: radius * 0.04,
            }}
          />
        );
      })}

      {/* Numerals 1-12 placed correctly */}
      {numerals.map((n) => {
        const angleDeg = n * 30 - 90; // start at top (12 at -90)
        const angleRad = (angleDeg * Math.PI) / 180;
        const x = radius + numeralRadius * Math.cos(angleRad);
        const y = radius + numeralRadius * Math.sin(angleRad);
        return (
          <div
            key={`num-${n}`}
            className="absolute flex items-center justify-center font-semibold text-neutral-900"
            style={{
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
              fontSize: Math.max(14, Math.round(size * 0.085)),
            }}
          >
            {n}
          </div>
        );
      })}

      {/* Center pin */}
      <div
        className="absolute rounded-full bg-neutral-900"
        style={{
          width: radius * 0.06,
          height: radius * 0.06,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 20,
        }}
      />

      {/* Hour hand */}
      <div
        ref={hourRef}
        className="absolute left-1/2 top-1/2 origin-bottom"
        style={{
          width: 6,
          height: radius * 0.45,
          background: "#111",
          transform: "translateX(-50%) translateY(-100%)",
          borderRadius: 6,
          zIndex: 10,
          transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
        }}
      />

      {/* Minute hand */}
      <div
        ref={minuteRef}
        className="absolute left-1/2 top-1/2 origin-bottom"
        style={{
          width: 4,
          height: radius * 0.62,
          background: "#222",
          transform: "translateX(-50%) translateY(-100%)",
          borderRadius: 4,
          zIndex: 12,
          transition: "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />

      {/* Second hand */}
      {showSecondHand && (
        <div
          ref={secondRef}
          className="absolute left-1/2 top-1/2 origin-bottom"
          style={{
            width: 2,
            height: radius * 0.7,
            background: "#d33",
            transform: "translateX(-50%) translateY(-100%)",
            zIndex: 14,
            transition: "transform 0.08s linear",
          }}
        />
      )}
    </div>
  );
};

export default AnalogClock;

