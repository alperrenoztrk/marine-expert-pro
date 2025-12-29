import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, PerspectiveCamera, RoundedBox } from "@react-three/drei";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import * as THREE from "three";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const WaterSurface = ({ color = "#4f8cc9" }: { color?: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.PlaneGeometry(16, 10, 64, 32), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const positions = geometry.attributes.position as THREE.BufferAttribute;
    const time = clock.getElapsedTime();

    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const wave = Math.sin(time * 1.2 + x * 0.6) * 0.06 + Math.cos(time * 1.5 + y * 0.8) * 0.04;
      positions.setZ(i, wave);
    }

    positions.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} geometry={geometry}>
      <meshStandardMaterial color={color} transparent opacity={0.75} roughness={0.4} metalness={0.1} />
    </mesh>
  );
};

const ShipHull = ({ draftOffset = 0 }: { draftOffset?: number }) => {
  return (
    <group position={[0, -0.1 - draftOffset, 0]}>
      <RoundedBox args={[5.2, 0.8, 1.5]} radius={0.15} smoothness={6} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#1f2a36" roughness={0.5} metalness={0.2} />
      </RoundedBox>
      <mesh position={[0.4, 0.65, 0]}>
        <boxGeometry args={[1.4, 0.6, 0.9]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
      </mesh>
      <mesh position={[-1.2, 0.5, 0]}>
        <boxGeometry args={[1.1, 0.4, 0.9]} />
        <meshStandardMaterial color="#cbd5f5" roughness={0.6} />
      </mesh>
      <mesh position={[1.8, 0.85, 0]}>
        <boxGeometry args={[0.35, 0.6, 0.35]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.5} />
      </mesh>
    </group>
  );
};

const StabilityScene = ({
  targetHeel,
  draftOffset,
  onHeelUpdate,
}: {
  targetHeel: number;
  draftOffset: number;
  onHeelUpdate: (heel: number) => void;
}) => {
  const shipGroup = useRef<THREE.Group>(null);
  const heelRef = useRef(0);
  const lastUpdate = useRef(0);

  useFrame(({ clock }, delta) => {
    heelRef.current = THREE.MathUtils.damp(heelRef.current, targetHeel, 3.2, delta);
    if (shipGroup.current) {
      shipGroup.current.rotation.z = heelRef.current;
    }

    if (clock.elapsedTime - lastUpdate.current > 0.1) {
      onHeelUpdate(heelRef.current);
      lastUpdate.current = clock.elapsedTime;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 12, 6]} intensity={1.1} castShadow />
      <pointLight position={[-6, 6, -4]} intensity={0.6} />

      <group ref={shipGroup}>
        <ShipHull draftOffset={draftOffset} />
      </group>

      <WaterSurface />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
        <circleGeometry args={[9, 64]} />
        <meshStandardMaterial color="#0f172a" opacity={0.2} transparent />
      </mesh>
    </group>
  );
};

export const Stability3DSim = () => {
  const [gm, setGm] = useState(0.9);
  const [kg, setKg] = useState(6.2);
  const [draft, setDraft] = useState(6.5);
  const [heelAngle, setHeelAngle] = useState(0);

  const km = useMemo(() => gm + kg, [gm, kg]);
  const displacement = useMemo(() => 14000 * (draft / 6.5), [draft]);
  const heelingMoment = useMemo(() => 2200 * (1 + (kg - 6.2) * 0.12), [kg]);

  const targetHeel = useMemo(() => {
    const gmSafe = clamp(gm, 0.15, 3);
    const ratio = heelingMoment / (displacement * gmSafe);
    const angle = Math.atan(ratio);
    return clamp(angle, -0.6, 0.6);
  }, [displacement, gm, heelingMoment]);

  const draftOffset = useMemo(() => clamp((draft - 6.5) * 0.08, -0.2, 0.3), [draft]);
  const gz = useMemo(() => gm * Math.sin(heelAngle), [gm, heelAngle]);
  const heelDeg = useMemo(() => THREE.MathUtils.radToDeg(heelAngle), [heelAngle]);

  return (
    <Card className="border-primary/20 shadow-sm">
      <CardHeader>
        <CardTitle>3B Stabilite Simülasyonu (GM/KG Etkisi)</CardTitle>
        <CardDescription>
          GM yükseldikçe gemi daha sert davranır; KG arttıkça GM azalır ve yatma eğilimi artar. Draft değişimi, gövde batmasını ve stabiliteyi
          etkileyen deplasmanı temsil eder.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative h-[360px] overflow-hidden rounded-xl border border-border bg-slate-950">
          <Canvas shadows dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[6, 4.6, 6]} fov={45} />
            <Environment preset="city" />
            <StabilityScene targetHeel={targetHeel} draftOffset={draftOffset} onHeelUpdate={setHeelAngle} />
          </Canvas>

          <div className="absolute left-3 top-3 rounded-md bg-background/80 px-3 py-2 text-[11px] text-foreground shadow-sm backdrop-blur">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">GM</span>
              <span className="font-mono font-semibold">{gm.toFixed(2)} m</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">GZ</span>
              <span className="font-mono font-semibold">{gz.toFixed(2)} m</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Meyil</span>
              <span className="font-mono font-semibold">{heelDeg.toFixed(1)}°</span>
            </div>
          </div>

          <div className="absolute bottom-3 right-3 rounded-md bg-background/80 px-3 py-2 text-[11px] text-muted-foreground shadow-sm backdrop-blur">
            <div>KM: {km.toFixed(2)} m</div>
            <div>Δ: {Math.round(displacement)} t</div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label className="text-xs flex items-center justify-between">
              <span>GM (m)</span>
              <span className="font-mono">{gm.toFixed(2)}</span>
            </Label>
            <Slider value={[gm]} min={0.2} max={2.5} step={0.05} onValueChange={(v) => setGm(v[0])} />
            <p className="text-[11px] text-muted-foreground">Düşük GM → daha yumuşak, yüksek GM → daha sert yalpa.</p>
          </div>
          <div className="space-y-2">
            <Label className="text-xs flex items-center justify-between">
              <span>KG (m)</span>
              <span className="font-mono">{kg.toFixed(2)}</span>
            </Label>
            <Slider value={[kg]} min={4.5} max={8.5} step={0.05} onValueChange={(v) => setKg(v[0])} />
            <p className="text-[11px] text-muted-foreground">KG yükseldikçe GM düşer ve meyil artışı hızlanır.</p>
          </div>
          <div className="space-y-2">
            <Label className="text-xs flex items-center justify-between">
              <span>Draft (m)</span>
              <span className="font-mono">{draft.toFixed(2)}</span>
            </Label>
            <Slider value={[draft]} min={4.5} max={8.5} step={0.05} onValueChange={(v) => setDraft(v[0])} />
            <p className="text-[11px] text-muted-foreground">Draft arttıkça deplasman yükselir, yatma tepkisi değişir.</p>
          </div>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
          <div className="font-mono text-primary">GM = KM − KG ·· GZ ≈ GM · sinφ</div>
          <p className="mt-1">GM yükseldikçe doğrultucu kol büyür; gemi dış etkilere karşı daha hızlı toparlar.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Stability3DSim;
