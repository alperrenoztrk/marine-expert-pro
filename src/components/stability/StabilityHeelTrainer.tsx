import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import type { Group } from "three";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ShipModel({ targetHeelDeg }: { targetHeelDeg: number }) {
  const groupRef = useRef<Group>(null);
  const targetRad = useMemo(() => (targetHeelDeg * Math.PI) / 180, [targetHeelDeg]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z += (targetRad - groupRef.current.rotation.z) * 0.1;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[3.4, 0.6, 1.2]} />
        <meshStandardMaterial color="#1f6feb" />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.2, 0.4, 0.8]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
    </group>
  );
}

export function StabilityHeelTrainer() {
  const [gm, setGm] = useState("2.5");
  const [kg, setKg] = useState("5.0");

  const gmValue = Math.max(0.1, Number(gm) || 0.1);
  const kgValue = Number(kg) || 0;
  const heelDeg = Math.min(20, Math.max(-20, ((kgValue - 5) / gmValue) * 4));

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>GM/KG Etkisi - Eğitsel 3B Görselleştirme</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>GM (m)</Label>
            <Input type="number" step="0.1" value={gm} onChange={(e) => setGm(e.target.value)} />
          </div>
          <div>
            <Label>KG (m)</Label>
            <Input type="number" step="0.1" value={kg} onChange={(e) => setKg(e.target.value)} />
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Görsel eğim, GM küçüldükçe ve KG yükseldikçe artacak şekilde eğitim amaçlı ölçeklenmiştir. Maksimum gösterim ±20° ile sınırlandırılır.
        </div>

        <div className="h-[280px] w-full overflow-hidden rounded-xl border border-slate-200/60 bg-slate-950/5">
          <Canvas camera={{ position: [0, 2.2, 5], fov: 50 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[4, 6, 3]} intensity={0.9} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
              <planeGeometry args={[10, 10]} />
              <meshStandardMaterial color="#0f172a" transparent opacity={0.25} />
            </mesh>
            <ShipModel targetHeelDeg={heelDeg} />
            <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2.1} minPolarAngle={Math.PI / 3} />
          </Canvas>
        </div>
      </CardContent>
    </Card>
  );
}
