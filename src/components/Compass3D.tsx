import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Compass3DProps {
  headingDeg?: number | null;
  pitchDeg?: number | null; // device beta
  rollDeg?: number | null;  // device gamma
  className?: string;
}

/**
 * Compass3D renders a lightweight 3D compass using Three.js.
 * - Needle points to North; rotates CW with headingDeg
 * - Whole instrument subtly tilts with pitch/roll for realism
 */
const Compass3D: React.FC<Compass3DProps> = ({ headingDeg = 0, pitchDeg = 0, rollDeg = 0, className = '' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const needleGroupRef = useRef<THREE.Group | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const lastSizeRef = useRef<{ w: number; h: number } | null>(null);

  const degToRad = THREE.MathUtils.degToRad;

  // Update transforms from props without re-creating scene
  useEffect(() => {
    const root = rootGroupRef.current;
    const needle = needleGroupRef.current;
    if (!root || !needle) return;

    // Soften tilt to avoid extreme rotations
    const pitch = (pitchDeg || 0) * 0.4;
    const roll = (rollDeg || 0) * 0.4;

    // Root tilt: pitch around X, roll around Z
    root.rotation.x = degToRad(pitch);
    root.rotation.y = 0; // keep yaw fixed for a stable presentation
    root.rotation.z = degToRad(roll);

    // Needle rotation: CW from North around Z axis; base needle points +Y
    const heading = ((headingDeg ?? 0) % 360 + 360) % 360;
    needle.rotation.z = -degToRad(heading);
  }, [headingDeg, pitchDeg, rollDeg]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Scene and camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 6.5);
    cameraRef.current = camera;

    // Lighting
    const hemi = new THREE.HemisphereLight(0xffffff, 0x223344, 0.7);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 0.85);
    dir.position.set(3, 5, 4);
    dir.castShadow = false;
    scene.add(dir);

    // Root group that receives device tilt
    const rootGroup = new THREE.Group();
    rootGroupRef.current = rootGroup;
    scene.add(rootGroup);

    // Decorative chrome bezel removed per design request

    // Base: torus ring + black face disk
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.0, 0.12, 32, 128),
      new THREE.MeshStandardMaterial({ color: 0x9aa0a6, metalness: 0.6, roughness: 0.35 })
    );
    rootGroup.add(ring);

    const face = new THREE.Mesh(
      new THREE.CircleGeometry(1.92, 96),
      new THREE.MeshStandardMaterial({ color: 0x0b0b0b, metalness: 0.1, roughness: 0.9 })
    );
    face.rotation.x = -Math.PI; // face forward
    rootGroup.add(face);

    // Ticks (every 15°)
    const ticks = new THREE.Group();
    for (let deg = 0; deg < 360; deg += 15) {
      const isCardinal = deg % 90 === 0;
      const isMajor = deg % 30 === 0;
      const inner = isCardinal ? 1.45 : isMajor ? 1.55 : 1.65;
      const outer = 1.85;
      const theta = degToRad(deg);
      const x1 = inner * Math.sin(theta);
      const y1 = inner * Math.cos(theta);
      const x2 = outer * Math.sin(theta);
      const y2 = outer * Math.cos(theta);
      const geom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x1, y1, 0.01),
        new THREE.Vector3(x2, y2, 0.01),
      ]);
      const mat = new THREE.LineBasicMaterial({ color: 0x2b2b2b });
      const line = new THREE.Line(geom, mat);
      ticks.add(line);
    }
    rootGroup.add(ticks);

    // Cardinal triangles (K, D, G, B) as small arrows instead of text
    const cardinal = new THREE.Group();
    const triGeom = new THREE.ConeGeometry(0.07, 0.24, 12);
    const triMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, metalness: 0.2, roughness: 0.6 });
    const positions: Array<[number, number]> = [
      [0, 1.35], // K (North)
      [1.35, 0], // D (East)
      [0, -1.35], // G (South)
      [-1.35, 0], // B (West)
    ];
    positions.forEach(([x, y]) => {
      const tri = new THREE.Mesh(triGeom, triMat);
      tri.position.set(x, y, 0.02);
      tri.rotation.x = Math.PI; // face camera
      if (Math.abs(x) > Math.abs(y)) {
        tri.rotation.z = x > 0 ? -Math.PI / 2 : Math.PI / 2;
      } else if (y < 0) {
        tri.rotation.z = Math.PI;
      }
      cardinal.add(tri);
    });
    rootGroup.add(cardinal);

    // Needle: two cones back-to-back (red north, white south)
    const needleGroup = new THREE.Group();
    needleGroupRef.current = needleGroup;

    const northCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 1.1, 24),
      new THREE.MeshStandardMaterial({ color: 0xc62828, metalness: 0.1, roughness: 0.6, emissive: new THREE.Color(0x220000) })
    );
    northCone.position.set(0, 0.55, 0.05);
    northCone.rotation.x = Math.PI; // tip toward +Y while facing camera

    const southCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 1.1, 24),
      new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.1, roughness: 0.6 })
    );
    southCone.position.set(0, -0.55, 0.05);

    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.1, 24),
      new THREE.MeshStandardMaterial({ color: 0xfdfdfd, metalness: 0.3, roughness: 0.4 })
    );
    cap.rotation.x = Math.PI / 2;
    cap.position.set(0, 0, 0.06);

    needleGroup.add(northCone);
    needleGroup.add(southCone);
    needleGroup.add(cap);

    rootGroup.add(needleGroup);

    // Resize handler
    const resize = () => {
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 300;
      if (!lastSizeRef.current || lastSizeRef.current.w !== w || lastSizeRef.current.h !== h) {
        lastSizeRef.current = { w, h };
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
    };
    resize();

    const resizeObs = new ResizeObserver(() => resize());
    resizeObs.observe(container);

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      // Render every RAF; on 120Hz displays this will run at ~120fps.
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      resizeObs.disconnect();
      // Cleanup scene
      scene.traverse((obj) => {
        if ((obj as any).geometry) (obj as any).geometry.dispose?.();
        if ((obj as any).material) {
          const mat = (obj as any).material as THREE.Material | THREE.Material[];
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose?.());
          else mat.dispose?.();
        }
      });
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      rootGroupRef.current = null;
      needleGroupRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className={className} style={{ width: '100%', height: '100%' }} />;
};

export default Compass3D;
