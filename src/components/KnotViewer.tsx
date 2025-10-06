import React, { useEffect, useMemo, useRef, useState } from 'react';

interface KnotViewerProps {
  title: string;
  svgHtml: string; // raw inline SVG markup with CSS animations
  defaultSpeed?: number; // 0.25 - 2.0
}

// Controls CSS animations in an inline SVG by setting animation-play-state and a speed multiplier
export default function KnotViewer({ title, svgHtml, defaultSpeed = 1 }: KnotViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(defaultSpeed);
  const [key, setKey] = useState(0); // force remount to restart
  const [realistic, setRealistic] = useState(true);

  // Sanitize and memoize the HTML we inject
  const safeHtml = useMemo(() => svgHtml, [svgHtml, key]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    // Update animation play state
    const animated = root.querySelectorAll<HTMLElement>('[class*="step"], .fade-in, [style*="animation"], svg *');
    animated.forEach((el) => {
      (el.style as any).animationPlayState = isPlaying ? 'running' : 'paused';
    });
  }, [isPlaying, key]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    // Apply a smoother, more realistic easing similar to Knots 3D
    const easing = realistic ? 'cubic-bezier(0.22, 1, 0.36, 1)' : '';
    const animated = root.querySelectorAll<HTMLElement>('[class*="step"], .fade-in, [style*="animation"], svg *');
    animated.forEach((el) => {
      (el.style as any).animationTimingFunction = easing;
    });
  }, [realistic, key]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const animated = root.querySelectorAll<HTMLElement>('[class*="step"], .fade-in, [style*="animation"], svg *');
    animated.forEach((el) => {
      const computed = getComputedStyle(el);
      const durations = computed.animationDuration.split(',').map((d) => d.trim());
      // initialize original durations once
      if (!(el as any).dataset.knotOrigDurations) {
        (el as any).dataset.knotOrigDurations = JSON.stringify(durations);
      }
      const orig: string[] = JSON.parse((el as any).dataset.knotOrigDurations || '[]');
      const scaled = (orig.length ? orig : durations).map((d) => {
        if (!d.endsWith('s')) return d; // unexpected unit
        const seconds = parseFloat(d.replace('s', '')) || 0;
        if (seconds === 0) return d;
        const newSeconds = seconds / (speed || 1);
        return `${newSeconds}s`;
      });
      el.style.animationDuration = scaled.join(', ');
    });
  }, [speed, key]);

  const handleRestart = () => {
    // force full re-render of the injected SVG to reset keyframes
    setKey((k) => k + 1);
    setIsPlaying(true);
  };

  return (
    <div className="rounded-xl border bg-white/5 p-4 shadow" aria-label={title}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">{title}</h3>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded border hover:bg-white/10"
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? 'Durdur' : 'Oynat'}
          >
            {isPlaying ? 'Durdur' : 'Oynat'}
          </button>
          <button
            className="px-3 py-1 rounded border hover:bg-white/10"
            onClick={handleRestart}
            aria-label="Baştan oynat"
          >
            Baştan
          </button>
          <label className="ml-2 text-sm">Gerçekçilik</label>
          <input
            type="checkbox"
            checked={realistic}
            onChange={(e) => setRealistic(e.target.checked)}
            aria-label="Gerçekçi hız/easing"
          />
          <label className="ml-2 text-sm">Hız</label>
          <input
            type="range"
            min={0.25}
            max={2}
            step={0.25}
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-32"
            aria-label="Hız"
          />
          <span className="w-10 text-right text-sm">{speed.toFixed(2)}x</span>
        </div>
      </div>
      <div
        key={key}
        ref={containerRef}
        className="w-full overflow-hidden rounded-lg bg-background/60"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    </div>
  );
}
