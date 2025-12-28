import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Float, PerspectiveCamera } from "@react-three/drei";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Ship, RotateCcw, Move3d } from "lucide-react";
import * as THREE from "three";

interface ShipModelProps {
  heelAngle: number;
  trimAngle: number;
}

const ShipModel = ({ heelAngle, trimAngle }: ShipModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      // Smooth interpolation to target angles
      const targetRotationX = THREE.MathUtils.degToRad(-heelAngle);
      const targetRotationZ = THREE.MathUtils.degToRad(trimAngle);
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotationX,
        0.1
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        targetRotationZ,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Hull - Main body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 0.8, 1.2]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.3} roughness={0.7} />
      </mesh>
      
      {/* Hull bottom (curved) */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[3.6, 0.4, 1]} />
        <meshStandardMaterial color="#c0392b" metalness={0.2} roughness={0.8} />
      </mesh>
      
      {/* Bow (front) */}
      <mesh position={[2.2, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.6, 0.6, 1]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.3} roughness={0.7} />
      </mesh>
      
      {/* Stern (back) */}
      <mesh position={[-2, 0.2, 0]}>
        <boxGeometry args={[0.4, 1, 1]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.3} roughness={0.7} />
      </mesh>
      
      {/* Superstructure */}
      <mesh position={[-0.5, 0.8, 0]}>
        <boxGeometry args={[1.5, 0.8, 0.9]} />
        <meshStandardMaterial color="#ecf0f1" metalness={0.1} roughness={0.6} />
      </mesh>
      
      {/* Bridge */}
      <mesh position={[-0.5, 1.4, 0]}>
        <boxGeometry args={[0.8, 0.4, 0.7]} />
        <meshStandardMaterial color="#3498db" metalness={0.4} roughness={0.4} />
      </mesh>
      
      {/* Funnel */}
      <mesh position={[-1, 1.2, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.6, 8]} />
        <meshStandardMaterial color="#7f8c8d" metalness={0.5} roughness={0.5} />
      </mesh>
      
      {/* Mast */}
      <mesh position={[0.5, 1.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.2, 8]} />
        <meshStandardMaterial color="#34495e" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* G Point (Gravity Center) */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#e74c3c" emissive="#e74c3c" emissiveIntensity={0.3} />
      </mesh>
      
      {/* B Point (Buoyancy Center) */}
      <mesh position={[0, -0.3, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#3498db" emissive="#3498db" emissiveIntensity={0.3} />
      </mesh>
      
      {/* M Point (Metacenter) */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#2ecc71" emissive="#2ecc71" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Vertical reference line */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
        <meshStandardMaterial color="#f39c12" transparent opacity={0.6} />
      </mesh>
    </group>
  );
};

const WaterSurface = () => {
  const waterRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (waterRef.current) {
      waterRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.05 - 0.3;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0} floatIntensity={0.2}>
      <mesh ref={waterRef} position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12, 32, 32]} />
        <meshStandardMaterial 
          color="#1a5276" 
          transparent 
          opacity={0.7}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
};

const Scene = ({ heelAngle, trimAngle }: ShipModelProps) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={45} />
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
        autoRotate={false}
      />
      
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} />
      
      <ShipModel heelAngle={heelAngle} trimAngle={trimAngle} />
      <WaterSurface />
      
      {/* Grid helper for reference */}
      <gridHelper args={[10, 10, "#444", "#222"]} position={[0, -1, 0]} />
      
      <Environment preset="sunset" />
    </>
  );
};

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
      <p className="text-xs text-muted-foreground">3D Model Yükleniyor...</p>
    </div>
  </div>
);

export const Ship3DVisualization = () => {
  const [heelAngle, setHeelAngle] = useState<number>(0);
  const [trimAngle, setTrimAngle] = useState<number>(0);

  const handleReset = () => {
    setHeelAngle(0);
    setTrimAngle(0);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Move3d className="h-5 w-5 text-primary" />
          3D Gemi Simülasyonu
        </CardTitle>
        <CardDescription className="text-xs">
          Mouse ile döndür, kaydır ve yakınlaştır. Slider ile meyil ve trim ayarla.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative w-full h-[300px] bg-gradient-to-b from-sky-900/50 to-blue-950/50 rounded-lg overflow-hidden border border-border/40">
          <Suspense fallback={<LoadingFallback />}>
            <Canvas shadows>
              <Scene heelAngle={heelAngle} trimAngle={trimAngle} />
            </Canvas>
          </Suspense>
          
          {/* Legend overlay */}
          <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm rounded px-2 py-1 text-[10px] space-y-0.5">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>G - Ağırlık Merkezi</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>B - Kaldırma Merkezi</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>M - Metasantr</span>
            </div>
          </div>
          
          {/* Angle display */}
          <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded px-2 py-1 text-[10px] font-mono">
            <div>Meyil: {heelAngle}°</div>
            <div>Trim: {trimAngle}°</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs flex justify-between">
              <span>Meyil (Heel)</span>
              <span className="font-mono">{heelAngle}°</span>
            </Label>
            <Slider
              value={[heelAngle]}
              onValueChange={(v) => setHeelAngle(v[0])}
              min={-45}
              max={45}
              step={1}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>İskele -45°</span>
              <span>Sancak +45°</span>
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-xs flex justify-between">
              <span>Trim</span>
              <span className="font-mono">{trimAngle}°</span>
            </Label>
            <Slider
              value={[trimAngle]}
              onValueChange={(v) => setTrimAngle(v[0])}
              min={-10}
              max={10}
              step={0.5}
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Kıç Trim -10°</span>
              <span>Baş Trim +10°</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleReset}
            className="flex-1 h-8 text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Sıfırla
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className={`p-2 rounded ${Math.abs(heelAngle) > 15 ? 'bg-red-500/10 border border-red-500/30' : Math.abs(heelAngle) > 5 ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-green-500/10 border border-green-500/30'}`}>
            <p className="font-semibold">Meyil Durumu</p>
            <p className="text-muted-foreground">
              {Math.abs(heelAngle) <= 5 ? '✓ Normal' : 
               Math.abs(heelAngle) <= 15 ? '⚠ Dikkat' : '⚠ Tehlikeli!'}
            </p>
          </div>
          <div className={`p-2 rounded ${Math.abs(trimAngle) > 5 ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-green-500/10 border border-green-500/30'}`}>
            <p className="font-semibold">Trim Durumu</p>
            <p className="text-muted-foreground">
              {trimAngle > 2 ? 'Baş Trim' : trimAngle < -2 ? 'Kıç Trim' : '✓ Düz Omurga'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Ship3DVisualization;
