import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Color4, StandardMaterial, Curve3, Mesh, LinesMesh, GlowLayer, PBRMaterial, ScenePerformancePriority } from '@babylonjs/core';

// Minimal Babylon.js viewer that mirrors Knot3DViewer API
interface KnotBabylonViewerProps {
  title: string;
  knot: 'bowline' | 'figure-eight' | 'clove-hitch';
  defaultSpeed?: number; // 0.25 - 2.0
}

export default function KnotBabylonViewer({ title, knot, defaultSpeed = 1 }: KnotBabylonViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const cameraRef = useRef<ArcRotateCamera | null>(null);
  const ropeMeshRef = useRef<Mesh | null>(null);
  const postMeshRef = useRef<Mesh | null>(null);
  const progressRef = useRef(0);
  const glowRef = useRef<GlowLayer | null>(null);
  const ropeMatRef = useRef<PBRMaterial | StandardMaterial | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(defaultSpeed);
  const [key, setKey] = useState(0);
  const [bloom, setBloom] = useState(true);
  const [quality, setQuality] = useState<'auto' | 'low' | 'high'>('auto');

  const ropeRadius = 0.22;

  // Build simple parametric points similar to the Three.js component (XZ over/under via Y)
  const bowlinePoints = useMemo(() => {
    const pts: Vector3[] = [];
    for (let x = -6; x <= -2; x += 0.4) pts.push(new Vector3(x, -0.1 + 0.06 * Math.sin((x + 6) * 0.5), 0));
    for (let t = 0; t <= Math.PI * 1.1; t += Math.PI / 22) {
      const r = 2.7; const cx = -1.8; const cy = 1.9;
      const px = cx + r * Math.cos(t);
      const py = cy + r * Math.sin(t);
      const pz = t < Math.PI * 0.55 ? 0.18 : -0.18;
      pts.push(new Vector3(px, py, pz));
    }
    for (let s = 0; s <= 1; s += 1 / 18) {
      const x = -2 + s * 2.0;
      const y = 0.1 + s * 2.2;
      const z = s < 0.5 ? -0.2 : 0.2;
      pts.push(new Vector3(x, y, z));
    }
    for (let t = -Math.PI * 0.1; t <= Math.PI * 1.1; t += Math.PI / 24) {
      const r = 2.9; const cx = 0.1; const cy = 1.3;
      const px = cx + r * Math.cos(t);
      const py = cy + r * Math.sin(t) * 0.9;
      const pz = t < Math.PI * 0.6 ? 0.2 : -0.2;
      pts.push(new Vector3(px, py, pz));
    }
    for (let s = 0; s <= 1; s += 1 / 16) {
      const x = 0.8 + s * 2.6;
      const y = 0.5 - s * 1.0;
      const z = s < 0.5 ? -0.18 : 0.18;
      pts.push(new Vector3(x, y, z));
    }
    for (let x = 3.4; x <= 7.0; x += 0.35) pts.push(new Vector3(x, -0.4, 0));
    return pts;
  }, []);

  const figureEightPoints = useMemo(() => {
    const pts: Vector3[] = [];
    const lcx = -2, lcy = 0, lr = 2.4;
    for (let t = Math.PI * 0.1; t <= Math.PI * 2.1; t += Math.PI / 28) {
      const x = lcx + lr * Math.cos(t);
      const y = lcy + lr * Math.sin(t) * 0.8;
      const z = t < Math.PI ? 0.14 : -0.14;
      pts.push(new Vector3(x, y, z));
    }
    for (let s = 0; s <= 1; s += 0.1) {
      const x = -0.5 + s * 1.0;
      const y = 0.2 - s * 0.4;
      const z = s < 0.5 ? -0.16 : 0.16;
      pts.push(new Vector3(x, y, z));
    }
    const rcx = 2, rcy = 0, rr = 2.4;
    for (let t = Math.PI * 1.1; t <= Math.PI * 3.1; t += Math.PI / 28) {
      const x = rcx + rr * Math.cos(t);
      const y = rcy + rr * Math.sin(t) * 0.8;
      const z = t < Math.PI * 2 ? 0.14 : -0.14;
      pts.push(new Vector3(x, y, z));
    }
    for (let x = 4; x <= 8; x += 0.4) pts.push(new Vector3(x, -0.2, 0));
    return pts;
  }, []);

  const cloveHitchPoints = useMemo(() => {
    const pts: Vector3[] = [];
    const R = 2.0;
    for (let x = R + 3.2; x >= R + 0.08; x -= 0.08) pts.push(new Vector3(x, -1.4, 0));
    const upH = 1.7; const steps1 = 100;
    for (let i = 0; i <= steps1; i++) {
      const t = (i / steps1) * (Math.PI * 2);
      const y = -1.4 + (upH * i) / steps1;
      const x = Math.cos(t) * (R + 0.02);
      const z = Math.sin(t) * (R + 0.02);
      const zOff = i < steps1 * 0.35 ? 0.14 : -0.14;
      pts.push(new Vector3(x, y, z + zOff));
    }
    const downH = 1.5; const steps2 = 100;
    for (let i = 0; i <= steps2; i++) {
      const t = (i / steps2) * (Math.PI * 2) + Math.PI * 0.9;
      const y = 0.3 - (downH * i) / steps2;
      const x = Math.cos(t) * (R + 0.02);
      const z = Math.sin(t) * (R + 0.02);
      const zOff = i < steps2 * 0.45 ? -0.16 : 0.16;
      pts.push(new Vector3(x, y, z + zOff));
    }
    for (let x = R + 0.08; x <= R + 3.8; x += 0.08) pts.push(new Vector3(x, -1.15, 0));
    return pts;
  }, []);

  const getCurvePoints = useMemo(() => {
    return (k: typeof knot) => {
      switch (k) {
        case 'bowline':
          return bowlinePoints;
        case 'figure-eight':
          return figureEightPoints;
        case 'clove-hitch':
          return cloveHitchPoints;
      }
    };
  }, [bowlinePoints, figureEightPoints, cloveHitchPoints, knot]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvasRef.current = canvas;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, antialias: true });
    engineRef.current = engine;
    const scene = new Scene(engine);
    scene.performancePriority = ScenePerformancePriority.Aggressive;
    sceneRef.current = scene;
    scene.clearColor = new Color4(0.043, 0.071, 0.125, 1); // #0b1220

    const camera = new ArcRotateCamera('cam', Math.PI * 0.9, Math.PI * 0.45, 18, new Vector3(0, 0.5, 0), scene);
    cameraRef.current = camera;
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 6;
    camera.upperRadiusLimit = 40;
    camera.wheelPrecision = 40;

    new HemisphericLight('hemi', new Vector3(0, 1, 0), scene);

    if (knot === 'clove-hitch') {
      const post = MeshBuilder.CreateCylinder('post', { diameter: 4.0, height: 6.0, tessellation: 64 }, scene);
      post.position = new Vector3(0, -0.2, 0);
      const postMat = new StandardMaterial('postMat', scene);
      postMat.diffuseColor.set(0.439, 0.502, 0.565);
      postMat.specularColor.set(0.05, 0.05, 0.05);
      post.material = postMat;
      postMeshRef.current = post;
    }

    const ropeMat = new PBRMaterial('ropePbr', scene);
    ropeMat.albedoColor.set(0.722, 0.451, 0.2);
    ropeMat.metallic = 0.0;
    ropeMat.roughness = 0.85;
    ropeMat.sheen.isEnabled = true;
    ropeMat.sheen.intensity = 0.5;
    ropeMat.sheen.roughness = 0.7;
    ropeMat.subSurface.isRefractionEnabled = false;
    ropeMat.environmentIntensity = 0.35;
    ropeMatRef.current = ropeMat;

    // Seed with a tiny line; we will rebuild as the curve grows
    const curve = Curve3.CreateCatmullRomSpline([new Vector3(-6, 0, 0), new Vector3(-6.01, 0, 0)], 64);
    const tube = MeshBuilder.CreateTube('rope', { path: curve.getPoints(), radius: ropeRadius, tesselation: 22, cap: Mesh.CAP_FLAT }, scene);
    tube.material = ropeMat;
    ropeMeshRef.current = tube;

    // Glow/bloom layer
    const glow = new GlowLayer('glow', scene, { blurKernelSize: 32 });
    glow.intensity = 0.35;
    glow.enabled = bloom;
    glowRef.current = glow;

    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener('resize', handleResize);

    const renderLoop = () => {
      scene.render();
    };
    engine.runRenderLoop(renderLoop);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.stopRenderLoop(renderLoop);
      engine.dispose();
      if (container && canvas) container.removeChild(canvas);
      ropeMeshRef.current = null;
      postMeshRef.current = null;
      if (glowRef.current) {
        glowRef.current.dispose();
        glowRef.current = null;
      }
    };
  }, [key, knot]);

  useEffect(() => {
    // Update geometry each frame based on progress
    let raf: number | null = null;
    let lastTime = performance.now();

    const tick = () => {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        const target = Math.min(1, progressRef.current + 0.25 * speed * dt);
        progressRef.current = gsap.utils.interpolate(progressRef.current, target, 0.25);
      }

      const scene = sceneRef.current;
      const rope = ropeMeshRef.current;
      const allPoints = getCurvePoints(knot);

      if (scene && rope && allPoints.length > 2) {
        const drawCount = Math.max(3, Math.floor(allPoints.length * progressRef.current));
        const partial = allPoints.slice(0, drawCount);
        const scale = quality === 'high' ? 3.0 : quality === 'low' ? 1.5 : 2.2;
        const curve = Curve3.CreateCatmullRomSpline(partial, Math.max(48, Math.floor(drawCount * scale)));
        const path = curve.getPoints();
        // Rebuild tube path by disposing and recreating geometry via Update
        try {
          // Babylon does not expose direct path update for TubeBuilder; recreate mesh
          const sceneRefLocal = sceneRef.current!;
          const mat = rope.material;
          rope.dispose(false, true);
          const radial = quality === 'high' ? 28 : quality === 'low' ? 14 : 22;
          const tube = MeshBuilder.CreateTube('rope', { path, radius: ropeRadius, tesselation: radial, cap: Mesh.CAP_FLAT }, sceneRefLocal);
          tube.material = mat ?? undefined;
          ropeMeshRef.current = tube;
        } catch {
          // no-op
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [isPlaying, speed, knot]);

  const handleRestart = () => {
    gsap.to(progressRef, { current: 0, duration: 0.4, ease: 'power2.out', onComplete: () => {
      progressRef.current = 0;
      setIsPlaying(true);
      setKey((v) => v + 1);
    } });
  };

  return (
    <div className="rounded-xl border bg-white/5 p-4 shadow" aria-label={title}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">{title} — Babylon 3D (Beta)</h3>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded border hover:bg-white/10"
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? 'Durdur' : 'Oynat'}
          >
            {isPlaying ? 'Durdur' : 'Oynat'}
          </button>
          <button className="px-3 py-1 rounded border hover:bg-white/10" onClick={handleRestart} aria-label="Baştan oynat">Baştan</button>
          <label className="ml-2 text-sm">Hız</label>
          <input type="range" min={0.25} max={2} step={0.25} value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="w-32" aria-label="Hız" />
          <span className="w-10 text-right text-sm">{speed.toFixed(2)}x</span>
          <label className="ml-2 text-sm">Bloom</label>
          <input type="checkbox" checked={bloom} onChange={(e) => {
            setBloom(e.target.checked);
            if (glowRef.current) glowRef.current.enabled = e.target.checked;
          }} aria-label="Bloom/glow" />
          <label className="ml-2 text-sm">Kalite</label>
          <select value={quality} onChange={(e) => setQuality(e.target.value as any)} className="px-2 py-1 rounded border bg-black/20 text-sm" aria-label="Görüntü kalitesi">
            <option value="auto">Otomatik</option>
            <option value="low">Düşük</option>
            <option value="high">Yüksek</option>
          </select>
        </div>
      </div>
      <div ref={containerRef} className="w-full h-[360px] rounded-lg overflow-hidden bg-background" />
    </div>
  );
}
