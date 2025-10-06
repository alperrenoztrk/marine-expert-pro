import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
  const animationRef = useRef<number | null>(null);
  const curvePointsRef = useRef<THREE.Vector3[]>([]);
  const progressRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(defaultSpeed);
  const [key, setKey] = useState(0); // restart trigger

  const ropeRadius = 0.22;

  const bowlinePoints = useMemo(() => {
    // Approximate a bowline in near-planar XY with slight Z offsets at crossings
    const pts: THREE.Vector3[] = [];
    // Standing part
    for (let x = -6; x <= -2; x += 0.5) pts.push(new THREE.Vector3(x, 0, 0));
    // Upwards to create the loop
    for (let t = 0; t <= Math.PI; t += Math.PI / 16) {
      const r = 3.0;
      const cx = -2; const cy = 2.5;
      const px = cx + r * Math.cos(t);
      const py = cy + r * Math.sin(t);
      const pz = t < Math.PI * 0.5 ? 0.15 : -0.15; // over/under
      pts.push(new THREE.Vector3(px, py, pz));
    }
    // Working end passing through the loop and around
    for (let t = 0; t <= Math.PI * 0.8; t += Math.PI / 24) {
      const r = 3.2;
      const cx = 0.2; const cy = 1.5;
      const px = cx + r * Math.cos(t);
      const py = cy - r * Math.sin(t) * 0.8;
      const pz = t < Math.PI * 0.4 ? -0.18 : 0.18;
      pts.push(new THREE.Vector3(px, py, pz));
    }
    // Exit tail
    for (let x = 2.2; x <= 7.5; x += 0.4) pts.push(new THREE.Vector3(x, -0.5, 0));
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
    // Wrap path around a post (cylinder) with two turns and a crossing
    const pts: THREE.Vector3[] = [];
    const R = 2.0; // post radius
    // Approach from +x side
    for (let x = R + 0.5; x >= R + 0.05; x -= 0.05) pts.push(new THREE.Vector3(x, -1.5, 0));
    // First wrap upward (helical)
    const turns1 = 1.0, h1 = 1.6;
    const steps1 = 120;
    for (let i = 0; i <= steps1; i++) {
      const t = (i / steps1) * (Math.PI * 2 * turns1);
      const y = -1.5 + (h1 * i) / steps1;
      const x = Math.cos(t) * (R + 0.02);
      const z = Math.sin(t) * (R + 0.02);
      pts.push(new THREE.Vector3(x, y, z));
    }
    // Cross over and second wrap downward
    const turns2 = 1.0, h2 = 1.4;
    const steps2 = 120;
    for (let i = 0; i <= steps2; i++) {
      const t = (i / steps2) * (Math.PI * 2 * turns2) + Math.PI * 0.8; // phase shift for crossing
      const y = 0.1 - (h2 * i) / steps2;
      const x = Math.cos(t) * (R + 0.02);
      const z = Math.sin(t) * (R + 0.02);
      const zOff = i < steps2 * 0.4 ? 0.16 : -0.16; // over/under near crossing
      pts.push(new THREE.Vector3(x, y, z + zOff));
    }
    // Exit tail
    for (let x = R + 0.05; x <= R + 3.5; x += 0.05) pts.push(new THREE.Vector3(x, -1.2, 0));
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
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 10, 7);
    scene.add(dir);

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

    // Rope material
    const ropeMaterial = new THREE.MeshStandardMaterial({ color: 0xb87333, roughness: 0.7, metalness: 0.05 });

    // Initial rope geometry (tiny)
    const baseCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(-6, 0, 0), new THREE.Vector3(-6.01, 0, 0)]);
    const baseGeom = new THREE.TubeGeometry(baseCurve, 64, ropeRadius, 16, false);
    const ropeMesh = new THREE.Mesh(baseGeom, ropeMaterial);
    ropeMesh.castShadow = false;
    ropeMesh.receiveShadow = false;
    scene.add(ropeMesh);
    ropeMeshRef.current = ropeMesh;

    const onResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = container.clientWidth / container.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(container.clientWidth, container.clientHeight);
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
      if (postMeshRef.current) {
        postMeshRef.current.geometry.dispose();
        (postMeshRef.current.material as THREE.Material).dispose();
        postMeshRef.current = null;
      }
    };
  }, [key, knot]);

  useEffect(() => {
    // Prepare curve points for the selected knot
    const points = getCurvePoints(knot);
    curvePointsRef.current = points;
    progressRef.current = 0;
  }, [getCurvePoints, knot, key]);

  useEffect(() => {
    let lastTime = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = (now - lastTime) / 1000; // seconds
      lastTime = now;

      if (isPlaying) {
        const incrementPerSecond = 0.25 * speed; // full draw in ~4s at 1x
        progressRef.current = Math.min(1, progressRef.current + incrementPerSecond * dt);
      }

      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      const controls = controlsRef.current;
      const ropeMesh = ropeMeshRef.current;
      const allPoints = curvePointsRef.current;

      if (scene && camera && renderer && controls && ropeMesh && allPoints.length > 2) {
        const drawCount = Math.max(3, Math.floor(allPoints.length * progressRef.current));
        const partialPoints = allPoints.slice(0, drawCount);
        const curve = new THREE.CatmullRomCurve3(partialPoints, false, 'catmullrom', 0.1);
        const tubularSegments = Math.max(64, drawCount * 3);
        const newGeom = new THREE.TubeGeometry(curve, tubularSegments, ropeRadius, 24, false);
        ropeMesh.geometry.dispose();
        ropeMesh.geometry = newGeom;

        controls.update();
        renderer.render(scene, camera);
      }

      animationRef.current = requestAnimationFrame(tick);
    };
    animationRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    };
  }, [isPlaying, speed, key]);

  const handleRestart = () => {
    progressRef.current = 0;
    setIsPlaying(true);
    setKey((v) => v + 1);
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
      <div ref={containerRef} className="w-full h-[360px] rounded-lg overflow-hidden bg-background" />
      <p className="text-xs text-muted-foreground mt-2">
        Dokun/Mouse: döndür, kaydır, yakınlaştır. Hız ve baştan oynatma ile adımları yakalayın.
      </p>
    </div>
  );
}
