import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RopeSimulation, pointOnPolylineAt } from '@/utils/ropeSimulation';
import gsap from 'gsap';

interface Knot3DViewerProps {
  title: string;
  knot: 'bowline' | 'figure-eight' | 'clove-hitch';
  defaultSpeed?: number; // 0.25 - 2.0
}

export default function Knot3DViewer({ title, knot, defaultSpeed = 1 }: Knot3DViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const ropeMeshRef = useRef<THREE.Mesh | null>(null);
  const postMeshRef = useRef<THREE.Mesh | null>(null);
  const ropeMaterialRef = useRef<THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial | null>(null);
  const animationRef = useRef<number | null>(null);
  const curvePointsRef = useRef<THREE.Vector3[]>([]);
  const progressRef = useRef(0);
  const simRef = useRef<RopeSimulation | null>(null);
  const accumulatorRef = useRef(0);
  const composerRef = useRef<EffectComposer | null>(null);
  const bloomPassRef = useRef<UnrealBloomPass | null>(null);
  const envRTRef = useRef<THREE.WebGLRenderTarget | null>(null);
  const guidelineRef = useRef<THREE.Line | null>(null);
  const milestonesRef = useRef<number[]>([0.15, 0.5, 0.85]);
  const milestonesFiredRef = useRef<boolean[]>([false, false, false]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(defaultSpeed);
  const [key, setKey] = useState(0); // restart trigger
  const [realistic, setRealistic] = useState(true);
  const [showGuide, setShowGuide] = useState(true);
  const [bloomEnabled, setBloomEnabled] = useState(true);
  const [quality, setQuality] = useState<'auto' | 'low' | 'high'>('auto');

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const ropeRadius = 0.22;

  const bowlinePoints = useMemo(() => {
    // Refined bowline tying path: approach, form loop, around standing part, back through
    const pts: THREE.Vector3[] = [];
    // Standing part, slight sag
    for (let x = -6; x <= -2; x += 0.4) pts.push(new THREE.Vector3(x, -0.1 + 0.06 * Math.sin((x + 6) * 0.5), 0));
    // Form the small loop (the "rabbit hole")
    for (let t = 0; t <= Math.PI * 1.1; t += Math.PI / 22) {
      const r = 2.7;
      const cx = -1.8; const cy = 1.9;
      const px = cx + r * Math.cos(t);
      const py = cy + r * Math.sin(t);
      const pz = t < Math.PI * 0.55 ? 0.18 : -0.18; // over then under
      pts.push(new THREE.Vector3(px, py, pz));
    }
    // Working end comes up through the loop
    for (let s = 0; s <= 1; s += 1 / 18) {
      const x = -2 + s * 2.0;
      const y = 0.1 + s * 2.2;
      const z = s < 0.5 ? -0.2 : 0.2;
      pts.push(new THREE.Vector3(x, y, z));
    }
    // Circle around the standing part
    for (let t = -Math.PI * 0.1; t <= Math.PI * 1.1; t += Math.PI / 24) {
      const r = 2.9;
      const cx = 0.1; const cy = 1.3;
      const px = cx + r * Math.cos(t);
      const py = cy + r * Math.sin(t) * 0.9;
      const pz = t < Math.PI * 0.6 ? 0.2 : -0.2; // over then under the crossing
      pts.push(new THREE.Vector3(px, py, pz));
    }
    // Back down through the loop and exit as tail
    for (let s = 0; s <= 1; s += 1 / 16) {
      const x = 0.8 + s * 2.6;
      const y = 0.5 - s * 1.0;
      const z = s < 0.5 ? -0.18 : 0.18;
      pts.push(new THREE.Vector3(x, y, z));
    }
    for (let x = 3.4; x <= 7.0; x += 0.35) pts.push(new THREE.Vector3(x, -0.4, 0));
    return pts;
  }, []);

  const figureEightPoints = useMemo(() => {
    // Approximate a figure-eight shape (two loops) with slight over/under Z
    const pts: THREE.Vector3[] = [];
    // Left loop centered at (-2, 0)
    const lcx = -2, lcy = 0, lr = 2.4;
    for (let t = Math.PI * 0.1; t <= Math.PI * 2.1; t += Math.PI / 28) {
      const x = lcx + lr * Math.cos(t);
      const y = lcy + lr * Math.sin(t) * 0.8;
      const z = t < Math.PI ? 0.14 : -0.14;
      pts.push(new THREE.Vector3(x, y, z));
    }
    // Transition across the center
    for (let s = 0; s <= 1; s += 0.1) {
      const x = -0.5 + s * 1.0;
      const y = 0.2 - s * 0.4;
      const z = s < 0.5 ? -0.16 : 0.16; // cross over/under
      pts.push(new THREE.Vector3(x, y, z));
    }
    // Right loop centered at (2, 0)
    const rcx = 2, rcy = 0, rr = 2.4;
    for (let t = Math.PI * 1.1; t <= Math.PI * 3.1; t += Math.PI / 28) {
      const x = rcx + rr * Math.cos(t);
      const y = rcy + rr * Math.sin(t) * 0.8;
      const z = t < Math.PI * 2 ? 0.14 : -0.14;
      pts.push(new THREE.Vector3(x, y, z));
    }
    // Tail out
    for (let x = 4; x <= 8; x += 0.4) pts.push(new THREE.Vector3(x, -0.2, 0));
    return pts;
  }, []);

  const cloveHitchPoints = useMemo(() => {
    // Clove hitch tying sequence: two half-hitches opposing on a post
    const pts: THREE.Vector3[] = [];
    const R = 2.0; // post radius
    // Approach
    for (let x = R + 3.2; x >= R + 0.08; x -= 0.08) pts.push(new THREE.Vector3(x, -1.4, 0));
    // First wrap upward, then crossing
    const upH = 1.7; const steps1 = 100;
    for (let i = 0; i <= steps1; i++) {
      const t = (i / steps1) * (Math.PI * 2);
      const y = -1.4 + (upH * i) / steps1;
      const x = Math.cos(t) * (R + 0.02);
      const z = Math.sin(t) * (R + 0.02);
      const zOff = i < steps1 * 0.35 ? 0.14 : -0.14; // over then under near crossing
      pts.push(new THREE.Vector3(x, y, z + zOff));
    }
    // Second wrap downward with phase shift to intersect properly
    const downH = 1.5; const steps2 = 100;
    for (let i = 0; i <= steps2; i++) {
      const t = (i / steps2) * (Math.PI * 2) + Math.PI * 0.9;
      const y = 0.3 - (downH * i) / steps2;
      const x = Math.cos(t) * (R + 0.02);
      const z = Math.sin(t) * (R + 0.02);
      const zOff = i < steps2 * 0.45 ? -0.16 : 0.16;
      pts.push(new THREE.Vector3(x, y, z + zOff));
    }
    // Tail exit
    for (let x = R + 0.08; x <= R + 3.8; x += 0.08) pts.push(new THREE.Vector3(x, -1.15, 0));
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

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0b1220');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(8, 8, 12);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 0.5, 0);
    controlsRef.current = controls;

    // Lights
    const hemi = new THREE.HemisphereLight(0xffffff, 0x222233, 0.9);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(5, 10, 7);
    scene.add(dir);

    // Environment for better PBR lighting
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    envRTRef.current = envRT;
    pmrem.dispose();

    // Ground grid (subtle)
    const grid = new THREE.GridHelper(40, 40, 0x335577, 0x224466);
    (grid.material as THREE.Material).opacity = 0.2;
    (grid.material as THREE.Material).transparent = true;
    scene.add(grid);

    // Optional post for clove hitch
    if (knot === 'clove-hitch') {
      const postGeom = new THREE.CylinderGeometry(2.0, 2.0, 6.0, 64);
      const postMat = new THREE.MeshStandardMaterial({ color: 0x708090, roughness: 0.9, metalness: 0.05 });
      const post = new THREE.Mesh(postGeom, postMat);
      post.position.set(0, -0.2, 0);
      scene.add(post);
      postMeshRef.current = post;
    }

    // Rope material (cloth-like with sheen)
    const ropeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xb87333,
      roughness: 0.9,
      metalness: 0.0,
      clearcoat: 0.05,
      sheen: 1.0,
      sheenRoughness: 0.7,
      sheenColor: new THREE.Color(0xffe0c0),
      envMapIntensity: 0.35,
      emissive: new THREE.Color(0x331a00),
      emissiveIntensity: 0.0,
    });
    ropeMaterialRef.current = ropeMaterial;

    // Initial rope geometry (tiny)
    const baseCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(-6, 0, 0), new THREE.Vector3(-6.01, 0, 0)]);
    const baseGeom = new THREE.TubeGeometry(baseCurve, 64, ropeRadius, 20, false);
    const ropeMesh = new THREE.Mesh(baseGeom, ropeMaterial);
    ropeMesh.castShadow = false;
    ropeMesh.receiveShadow = false;
    scene.add(ropeMesh);
    ropeMeshRef.current = ropeMesh;

    // Post-processing composer
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      0.35, // strength
      0.6,  // radius
      0.95  // threshold
    );
    bloomPass.enabled = bloomEnabled;
    composer.addPass(bloomPass);
    composerRef.current = composer;
    bloomPassRef.current = bloomPass;

    const onResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = container.clientWidth / container.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      const w = container.clientWidth;
      const h = container.clientHeight;
      rendererRef.current.setSize(w, h);
      if (composerRef.current) composerRef.current.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      controls.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
      scene.clear();
      ropeMesh.geometry.dispose();
      (ropeMaterial as THREE.Material).dispose();
      if (composerRef.current) {
        composerRef.current.passes.length = 0;
        composerRef.current = null;
      }
      if (envRTRef.current) {
        envRTRef.current.dispose();
        envRTRef.current = null;
      }
      if (postMeshRef.current) {
        postMeshRef.current.geometry.dispose();
        (postMeshRef.current.material as THREE.Material).dispose();
        postMeshRef.current = null;
      }
      simRef.current = null;
    };
  }, [key, knot]);

  useEffect(() => {
    // Prepare curve points and initialize rope simulation (if realistic)
    const points = getCurvePoints(knot);
    curvePointsRef.current = points;
    progressRef.current = 0;
    accumulatorRef.current = 0;
    milestonesFiredRef.current = milestonesRef.current.map(() => false);

    if (realistic) {
      const segmentCount = Math.max(80, Math.min(220, Math.floor(points.length * 1.6)));
      // Initial value, will be updated by initializeFromPolyline
      const approxSegLen = 0.12;
      const sim = new RopeSimulation({
        segmentCount,
        segmentLength: approxSegLen,
        ropeRadius,
        gravity: new THREE.Vector3(0, -4.5, 0),
        damping: 0.995,
        constraintIterations: 8,
        bendingStiffness: 0.2,
        cylinderCollider:
          knot === 'clove-hitch'
            ? {
                center: new THREE.Vector3(0, -0.2, 0),
                radius: 2.0,
                halfHeight: 3.0,
              }
            : null,
        friction: 0.35,
      });
      sim.setPinnedRange(0, Math.min(10, segmentCount - 2));
      sim.initializeFromPolyline(points, 1.08);
      sim.setHeadFollowStrength(0.85);
      simRef.current = sim;
    } else {
      simRef.current = null;
    }
  }, [getCurvePoints, knot, key, realistic]);

  // Build or remove guideline based on toggle/points
  useEffect(() => {
    const scene = sceneRef.current;
    const points = curvePointsRef.current;
    if (!scene) return;

    // Clean existing
    if (guidelineRef.current) {
      scene.remove(guidelineRef.current);
      (guidelineRef.current.geometry as THREE.BufferGeometry).dispose();
      (guidelineRef.current.material as THREE.Material).dispose();
      guidelineRef.current = null;
    }

    if (showGuide && points.length > 1) {
      const guideGeom = new THREE.BufferGeometry().setFromPoints(points);
      const guideMat = new THREE.LineDashedMaterial({
        color: 0x66aaff,
        dashSize: 0.6,
        gapSize: 0.3,
        transparent: true,
        opacity: 0.35,
      });
      const line = new THREE.Line(guideGeom, guideMat);
      line.computeLineDistances();
      scene.add(line);
      guidelineRef.current = line;
    }
  }, [showGuide, knot, getCurvePoints, key]);

  useEffect(() => {
    let lastTime = performance.now();
    // Lower on mobile/low FPS to save CPU
    const isMobile = typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);
    const fixedDt = isMobile ? 1 / 90 : 1 / 120; // target physics step

    const tick = () => {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      const composer = composerRef.current;
      const controls = controlsRef.current;
      const ropeMesh = ropeMeshRef.current;
      const allPoints = curvePointsRef.current;
      const sim = simRef.current;

      if (isPlaying) {
        const incrementPerSecond = realistic ? 0.22 : 0.25;
        const speedFactor = prefersReducedMotion ? 0.6 : 1.0;
        const targetProgress = Math.min(1, progressRef.current + incrementPerSecond * speed * speedFactor * dt);
        // GSAP smooth interpolation for fluid animation
        const lerpAlpha = prefersReducedMotion ? 0.18 : 0.25;
        progressRef.current = gsap.utils.interpolate(progressRef.current, targetProgress, lerpAlpha);
      }

      if (scene && camera && renderer && controls && ropeMesh && allPoints.length > 2) {
        // Camera gently follows the rope head
        const headTarget = pointOnPolylineAt(allPoints, progressRef.current);
        controls.target.lerp(headTarget, 0.08);

        if (realistic && sim) {
          // Guide the working end along the tying path
          sim.setHeadTarget(headTarget);

          // Accumulate time and step physics at fixed dt
          accumulatorRef.current += dt;
          const maxSteps = 12; // avoid spiral of death
          let steps = 0;
          while (accumulatorRef.current >= fixedDt && steps < maxSteps) {
            sim.step(fixedDt);
            accumulatorRef.current -= fixedDt;
            steps++;
          }

          const positions = sim.getPositions();
          const curve = new THREE.CatmullRomCurve3(positions as THREE.Vector3[], false, 'catmullrom', 0.1);
          const qualityScale = quality === 'high' ? 2.5 : quality === 'low' ? 1.2 : (isMobile ? 1.5 : 2.0);
          const tubularSegments = Math.max(isMobile ? 60 : 80, Math.floor(positions.length * qualityScale));
          const radialSegments = quality === 'high' ? 28 : quality === 'low' ? 14 : 22;
          const newGeom = new THREE.TubeGeometry(curve, tubularSegments, ropeRadius, radialSegments, false);
          ropeMesh.geometry.dispose();
          ropeMesh.geometry = newGeom;
        } else {
          // Legacy reveal along predefined points
          const drawCount = Math.max(3, Math.floor(allPoints.length * progressRef.current));
          const partialPoints = allPoints.slice(0, drawCount);
          const curve = new THREE.CatmullRomCurve3(partialPoints, false, 'catmullrom', 0.1);
          const qualityScale = quality === 'high' ? 3.0 : quality === 'low' ? 1.5 : 2.2;
          const tubularSegments = Math.max(48, Math.floor(drawCount * qualityScale));
          const radialSegments = quality === 'high' ? 28 : quality === 'low' ? 14 : 22;
          const newGeom = new THREE.TubeGeometry(curve, tubularSegments, ropeRadius, radialSegments, false);
          ropeMesh.geometry.dispose();
          ropeMesh.geometry = newGeom;
        }

        // Pulse highlights at key tying moments
        const mat = ropeMaterialRef.current as THREE.MeshPhysicalMaterial | null;
        if (mat) {
          for (let i = 0; i < milestonesRef.current.length; i++) {
            const m = milestonesRef.current[i];
            if (!milestonesFiredRef.current[i] && progressRef.current >= m) {
              milestonesFiredRef.current[i] = true;
              gsap.to(mat, { emissiveIntensity: prefersReducedMotion ? 0.25 : 0.5, duration: 0.18, yoyo: true, repeat: 1, ease: 'sine.out' });
            }
          }
        }

        controls.update();
        if (composer && bloomPassRef.current) {
          bloomPassRef.current.enabled = bloomEnabled;
          composer.render();
        } else {
          renderer.render(scene, camera);
        }
      }

      animationRef.current = requestAnimationFrame(tick);
    };
    animationRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    };
  }, [isPlaying, speed, key, realistic]);

  const handleRestart = () => {
    // Smooth restart animation with GSAP
    gsap.to(progressRef, {
      current: 0,
      duration: 0.4,
      ease: "power2.out",
      onComplete: () => {
        progressRef.current = 0;
        setIsPlaying(true);
        setKey((v) => v + 1);
      }
    });
  };

  return (
    <div className="rounded-xl border bg-white/5 p-4 shadow" aria-label={title}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">{title} — 3D (Beta)</h3>
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
            aria-label="Gerçekçi fizik"
          />
          <label className="ml-2 text-sm">Kılavuz</label>
          <input
            type="checkbox"
            checked={showGuide}
            onChange={(e) => setShowGuide(e.target.checked)}
            aria-label="Kılavuz çizgisi"
          />
          <label className="ml-2 text-sm">Bloom</label>
          <input
            type="checkbox"
            checked={bloomEnabled}
            onChange={(e) => setBloomEnabled(e.target.checked)}
            aria-label="Bloom efekti"
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
          <label className="ml-2 text-sm">Kalite</label>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value as any)}
            className="px-2 py-1 rounded border bg-black/20 text-sm"
            aria-label="Görüntü kalitesi"
          >
            <option value="auto">Otomatik</option>
            <option value="low">Düşük</option>
            <option value="high">Yüksek</option>
          </select>
        </div>
      </div>
      <div ref={containerRef} className="w-full h-[360px] rounded-lg overflow-hidden bg-background" />
      <p className="text-xs text-muted-foreground mt-2">
        Dokun/Mouse: döndür, kaydır, yakınlaştır. Hız ve baştan oynatma ile adımları yakalayın.
        {prefersReducedMotion && ' (Sistem düşük hareket tercih ediyor; animasyonlar yumuşatıldı.)'}
      </p>
    </div>
  );
}
