import { useMemo, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, PerspectiveCamera, RoundedBox, ContactShadows } from "@react-three/drei";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Ship, RotateCcw, Move3d } from "lucide-react";
import * as THREE from "three";

interface ShipModelProps {
  heelAngle: number;
  trimAngle: number;
  shipType: ShipType;
  showTanks?: boolean;
  tankLevels?: number[];
}

interface TankProps {
  position: [number, number, number];
  size: [number, number, number];
  fillLevel: number;
  color: string;
  label: string;
}

const CargoTank = ({ position, size, fillLevel, color, label }: TankProps) => {
  const fillHeight = size[1] * (fillLevel / 100);
  const fillY = position[1] - size[1] / 2 + fillHeight / 2;
  
  return (
    <group>
      {/* Tank walls (wireframe) */}
      <mesh position={position}>
        <boxGeometry args={size} />
        <meshStandardMaterial 
          color="#95a5a6" 
          transparent 
          opacity={0.3}
          wireframe
        />
      </mesh>
      
      {/* Tank frame edges */}
      <lineSegments position={position}>
        <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
        <lineBasicMaterial color="#7f8c8d" />
      </lineSegments>
      
      {/* Liquid fill */}
      {fillLevel > 0 && (
        <mesh position={[position[0], fillY, position[2]]}>
          <boxGeometry args={[size[0] * 0.95, fillHeight, size[2] * 0.95]} />
          <meshStandardMaterial 
            color={color} 
            transparent 
            opacity={0.7}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
      )}
    </group>
  );
};

const Flag = ({ position }: { position: [number, number, number] }) => {
  const flagRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.PlaneGeometry(0.7, 0.4, 16, 8), []);

  useFrame(({ clock }) => {
    if (!flagRef.current) return;
    const time = clock.getElapsedTime();
    const positions = geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const wave = Math.sin(time * 3 + x * 6) * 0.05 + Math.cos(time * 2 + y * 4) * 0.03;
      positions.setZ(i, wave + x * 0.02);
    }

    positions.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh ref={flagRef} geometry={geometry} position={position} rotation={[0, Math.PI / 2, 0]}>
      <meshStandardMaterial color="#e63946" roughness={0.6} metalness={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
};

type ShipType = "container" | "tanker" | "bulk" | "roro" | "passenger";

const shipTypeOptions: { value: ShipType; label: string; description: string }[] = [
  { value: "container", label: "Konteyner", description: "Yüksek konteyner istifli, kıç üstü güverteli." },
  { value: "tanker", label: "Tanker", description: "Alçak güverte, boru hatları ve manifoldlar." },
  { value: "bulk", label: "Dökme", description: "Geniş ambar açıklıkları ve iri hatch cover'lar." },
  { value: "roro", label: "Ro-Ro", description: "Araç güvertesi ve kıç rampa düzeni." },
  { value: "passenger", label: "Yolcu", description: "Çok katlı üst yapı ve yaşam alanları." },
];

const shipConfigs: Record<
  ShipType,
  {
    hullColor: string;
    deckColor: string;
    superstructureColor: string;
    superstructurePos: [number, number, number];
    superstructureSize: [number, number, number];
    bridgePos: [number, number, number];
    showCranes: boolean;
    showContainers: boolean;
    showHatches: boolean;
    showTankerPiping: boolean;
    showRoRoRamp: boolean;
    showPassengerDecks: boolean;
    extraLifeboats: number;
    funnelPos: [number, number, number];
  }
> = {
  container: {
    hullColor: "#1f2a36",
    deckColor: "#2b3a4a",
    superstructureColor: "#e5e7eb",
    superstructurePos: [-2.2, 0.85, 0],
    superstructureSize: [1.6, 0.9, 1.0],
    bridgePos: [-2.25, 1.45, 0],
    showCranes: true,
    showContainers: true,
    showHatches: false,
    showTankerPiping: false,
    showRoRoRamp: false,
    showPassengerDecks: false,
    extraLifeboats: 1,
    funnelPos: [-2.8, 1.25, 0],
  },
  tanker: {
    hullColor: "#2c3e50",
    deckColor: "#334155",
    superstructureColor: "#f1f5f9",
    superstructurePos: [-2.6, 0.9, 0],
    superstructureSize: [1.3, 0.95, 1.0],
    bridgePos: [-2.6, 1.55, 0],
    showCranes: false,
    showContainers: false,
    showHatches: false,
    showTankerPiping: true,
    showRoRoRamp: false,
    showPassengerDecks: false,
    extraLifeboats: 2,
    funnelPos: [-2.95, 1.4, 0],
  },
  bulk: {
    hullColor: "#243647",
    deckColor: "#374151",
    superstructureColor: "#e2e8f0",
    superstructurePos: [-2.0, 0.85, 0],
    superstructureSize: [1.5, 0.9, 1.0],
    bridgePos: [-2.05, 1.45, 0],
    showCranes: true,
    showContainers: false,
    showHatches: true,
    showTankerPiping: false,
    showRoRoRamp: false,
    showPassengerDecks: false,
    extraLifeboats: 1,
    funnelPos: [-2.6, 1.25, 0],
  },
  roro: {
    hullColor: "#1f2937",
    deckColor: "#1f2937",
    superstructureColor: "#f8fafc",
    superstructurePos: [-1.0, 0.95, 0],
    superstructureSize: [2.2, 1.1, 1.1],
    bridgePos: [-0.9, 1.65, 0],
    showCranes: false,
    showContainers: false,
    showHatches: false,
    showTankerPiping: false,
    showRoRoRamp: true,
    showPassengerDecks: false,
    extraLifeboats: 2,
    funnelPos: [-1.1, 1.5, 0],
  },
  passenger: {
    hullColor: "#2f3f52",
    deckColor: "#1f2937",
    superstructureColor: "#f8fafc",
    superstructurePos: [-0.4, 1.0, 0],
    superstructureSize: [3.2, 1.3, 1.2],
    bridgePos: [0.4, 2.0, 0],
    showCranes: false,
    showContainers: false,
    showHatches: false,
    showTankerPiping: false,
    showRoRoRamp: false,
    showPassengerDecks: true,
    extraLifeboats: 4,
    funnelPos: [0.2, 2.1, 0],
  },
};

const getTankLayout = (shipType: ShipType) => {
  if (shipType === "tanker") {
    return [
      { position: [2.2, -0.1, 0.35] as [number, number, number], size: [0.7, 0.5, 0.35] as [number, number, number], label: "Cargo 1P", color: "#f97316" },
      { position: [2.2, -0.1, -0.35] as [number, number, number], size: [0.7, 0.5, 0.35] as [number, number, number], label: "Cargo 1S", color: "#f97316" },
      { position: [1.2, -0.1, 0.35] as [number, number, number], size: [0.8, 0.5, 0.35] as [number, number, number], label: "Cargo 2P", color: "#fb923c" },
      { position: [1.2, -0.1, -0.35] as [number, number, number], size: [0.8, 0.5, 0.35] as [number, number, number], label: "Cargo 2S", color: "#fb923c" },
      { position: [0.1, -0.1, 0.35] as [number, number, number], size: [0.9, 0.5, 0.35] as [number, number, number], label: "Cargo 3P", color: "#fdba74" },
      { position: [0.1, -0.1, -0.35] as [number, number, number], size: [0.9, 0.5, 0.35] as [number, number, number], label: "Cargo 3S", color: "#fdba74" },
      { position: [-1.1, -0.1, 0.35] as [number, number, number], size: [0.8, 0.5, 0.35] as [number, number, number], label: "Slop P", color: "#f59e0b" },
      { position: [-1.1, -0.1, -0.35] as [number, number, number], size: [0.8, 0.5, 0.35] as [number, number, number], label: "Slop S", color: "#f59e0b" },
    ];
  }

  if (shipType === "roro") {
    return [
      { position: [1.8, -0.1, 0] as [number, number, number], size: [1.3, 0.5, 0.9] as [number, number, number], label: "Vehicle Deck", color: "#60a5fa" },
      { position: [-0.2, -0.1, 0] as [number, number, number], size: [1.5, 0.5, 0.9] as [number, number, number], label: "Vehicle Deck", color: "#93c5fd" },
      { position: [-2.0, -0.1, 0] as [number, number, number], size: [0.9, 0.5, 0.9] as [number, number, number], label: "Machinery", color: "#f59e0b" },
    ];
  }

  if (shipType === "passenger") {
    return [
      { position: [1.5, -0.1, 0] as [number, number, number], size: [1.3, 0.45, 0.8] as [number, number, number], label: "Service Deck", color: "#38bdf8" },
      { position: [-0.4, -0.1, 0] as [number, number, number], size: [1.4, 0.45, 0.8] as [number, number, number], label: "Service Deck", color: "#7dd3fc" },
      { position: [-2.2, -0.1, 0] as [number, number, number], size: [0.9, 0.45, 0.8] as [number, number, number], label: "Machinery", color: "#f59e0b" },
    ];
  }

  if (shipType === "bulk") {
    return [
      { position: [1.9, -0.1, 0] as [number, number, number], size: [1.2, 0.6, 0.8] as [number, number, number], label: "Hold 1", color: "#22c55e" },
      { position: [0.4, -0.1, 0] as [number, number, number], size: [1.4, 0.6, 0.8] as [number, number, number], label: "Hold 2", color: "#4ade80" },
      { position: [-1.2, -0.1, 0] as [number, number, number], size: [1.3, 0.6, 0.8] as [number, number, number], label: "Hold 3", color: "#16a34a" },
    ];
  }

  return [
    { position: [2.1, -0.1, 0.38] as [number, number, number], size: [0.8, 0.45, 0.4] as [number, number, number], label: "FP Tank", color: "#3498db" },
    { position: [2.1, -0.1, -0.38] as [number, number, number], size: [0.8, 0.45, 0.4] as [number, number, number], label: "FP Tank", color: "#3498db" },
    { position: [0.9, -0.1, 0.38] as [number, number, number], size: [1.2, 0.55, 0.45] as [number, number, number], label: "Cargo 1P", color: "#2ecc71" },
    { position: [0.9, -0.1, -0.38] as [number, number, number], size: [1.2, 0.55, 0.45] as [number, number, number], label: "Cargo 1S", color: "#2ecc71" },
    { position: [-2.2, -0.1, 0.38] as [number, number, number], size: [0.8, 0.45, 0.4] as [number, number, number], label: "Fuel P", color: "#e67e22" },
    { position: [-2.2, -0.1, -0.38] as [number, number, number], size: [0.8, 0.45, 0.4] as [number, number, number], label: "Fuel S", color: "#e67e22" },
  ];
};

const ShipModel = ({ heelAngle, trimAngle, shipType, showTanks = true, tankLevels = [75, 50, 85, 60, 40, 90] }: ShipModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const shipConfig = shipConfigs[shipType];
  
  useFrame(() => {
    if (groupRef.current) {
      // Smooth interpolation to target angles
      const targetRotationX = THREE.MathUtils.degToRad(heelAngle);
      const targetRotationZ = THREE.MathUtils.degToRad(-trimAngle);
      
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

  const hullColor = shipConfig.hullColor;
  const hullMaterialProps = {
    color: hullColor,
    metalness: 0.25,
    roughness: showTanks ? 0.45 : 0.35,
    clearcoat: 0.6,
    clearcoatRoughness: 0.15,
    envMapIntensity: 1.1,
    transparent: showTanks,
    opacity: showTanks ? 0.7 : 1,
  };

  const portholePositions = Array.from({ length: 10 }, (_, index) => ({
    x: 2.55 - index * 0.55,
    y: 0.05 + (index % 2 === 0 ? 0.05 : -0.02),
    z: 0.7,
  }));

  const navigationLights = [
    { position: [2.6, 0.5, 0.72], color: "#00ff3b" }, // starboard
    { position: [2.6, 0.5, -0.72], color: "#ff3030" }, // port
    { position: [-3.35, 0.55, 0], color: "#f8fafc" }, // stern
    { position: [-2.0, 1.8, 0], color: "#f8fafc" }, // masthead
  ];

  // Tank definitions
  const tanks = getTankLayout(shipType);

  return (
    <group ref={groupRef}>
      {/* Hull - Main body (transparent to show tanks) */}
      <RoundedBox position={[0, 0, 0]} args={[6.2, 0.85, 1.35]} radius={0.08} smoothness={4}>
        <meshPhysicalMaterial {...hullMaterialProps} />
      </RoundedBox>

      {/* Upper hull taper */}
      <RoundedBox position={[0, 0.35, 0]} args={[5.9, 0.35, 1.15]} radius={0.06} smoothness={4}>
        <meshPhysicalMaterial {...hullMaterialProps} opacity={showTanks ? 0.55 : 0.95} />
      </RoundedBox>
      
      {/* Hull bottom (curved) */}
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[5.8, 0.45, 1.05]} />
        <meshPhysicalMaterial color="#b03a2e" metalness={0.25} roughness={0.8} clearcoat={0.3} clearcoatRoughness={0.35} />
      </mesh>

      {/* Keel line */}
      <mesh position={[0, -0.8, 0]}>
        <boxGeometry args={[5.5, 0.05, 0.2]} />
        <meshPhysicalMaterial color="#8e2f25" metalness={0.2} roughness={0.75} clearcoat={0.25} clearcoatRoughness={0.4} />
      </mesh>

      {/* Waterline stripe */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[6.15, 0.05, 1.36]} />
        <meshPhysicalMaterial color="#f1c40f" metalness={0.1} roughness={0.4} clearcoat={0.5} clearcoatRoughness={0.2} />
      </mesh>
      
      {/* Bow (tapered) */}
      <mesh position={[3.3, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.7, 1.3, 10]} />
        <meshPhysicalMaterial {...hullMaterialProps} opacity={showTanks ? 0.7 : 1} />
      </mesh>

      {/* Bulbous bow */}
      <mesh position={[3.45, -0.55, 0]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshPhysicalMaterial color="#b03a2e" metalness={0.3} roughness={0.7} clearcoat={0.3} clearcoatRoughness={0.3} />
      </mesh>

      {/* Forecastle deck */}
      <mesh position={[2.7, 0.45, 0]}>
        <boxGeometry args={[0.9, 0.25, 1.2]} />
        <meshPhysicalMaterial color="#2c3e50" metalness={0.2} roughness={0.65} clearcoat={0.25} clearcoatRoughness={0.4} />
      </mesh>
      
      {/* Stern (blocky) */}
      <mesh position={[-3.0, 0.2, 0]}>
        <boxGeometry args={[0.6, 1.1, 1.1]} />
        <meshPhysicalMaterial {...hullMaterialProps} opacity={showTanks ? 0.7 : 1} />
      </mesh>

      {/* Stern rounded cap */}
      <mesh position={[-3.4, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.5, 0.55, 0.4, 14]} />
        <meshPhysicalMaterial {...hullMaterialProps} opacity={showTanks ? 0.7 : 1} />
      </mesh>

      {/* Deck */}
      <RoundedBox position={[0, 0.45, 0]} args={[6.0, 0.1, 1.25]} radius={0.04} smoothness={4}>
        <meshPhysicalMaterial color={shipConfig.deckColor} metalness={0.15} roughness={0.85} clearcoat={0.2} clearcoatRoughness={0.5} />
      </RoundedBox>

      {/* Hatch covers (bulk carriers) */}
      {shipConfig.showHatches &&
        [
          { x: 1.9, size: 1.1 },
          { x: 0.4, size: 1.35 },
          { x: -1.2, size: 1.2 },
        ].map((hatch, index) => (
          <mesh key={`hatch-${index}`} position={[hatch.x, 0.58, 0]}>
            <boxGeometry args={[hatch.size, 0.12, 1.08]} />
            <meshStandardMaterial color="#4b5563" metalness={0.2} roughness={0.65} />
          </mesh>
        ))}

      {/* Coamings */}
      {shipConfig.showHatches &&
        [
          { x: 1.9, size: 1.1 },
          { x: 0.4, size: 1.35 },
          { x: -1.2, size: 1.2 },
        ].map((hatch, index) => (
          <mesh key={`coaming-${index}`} position={[hatch.x, 0.52, 0]}>
            <boxGeometry args={[hatch.size + 0.1, 0.08, 1.15]} />
            <meshStandardMaterial color="#374151" metalness={0.2} roughness={0.7} />
          </mesh>
        ))}

      {/* Guard rails */}
      <mesh position={[0, 0.75, 0.62]}>
        <boxGeometry args={[5.6, 0.04, 0.04]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.75, -0.62]}>
        <boxGeometry args={[5.6, 0.04, 0.04]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Anchor pockets */}
      {[0.45, -0.45].map((zPos) => (
        <mesh key={`anchor-${zPos}`} position={[2.95, 0.1, zPos]}>
          <boxGeometry args={[0.18, 0.18, 0.08]} />
          <meshStandardMaterial color="#111827" metalness={0.4} roughness={0.6} />
        </mesh>
      ))}

      {/* Portholes */}
      {portholePositions.map((hole, index) => (
        <mesh key={`porthole-${index}`} position={[hole.x, hole.y, hole.z]}>
          <circleGeometry args={[0.05, 18]} />
          <meshStandardMaterial color="#dbeafe" emissive="#2563eb" emissiveIntensity={0.15} />
        </mesh>
      ))}
      {portholePositions.map((hole, index) => (
        <mesh key={`porthole-port-${index}`} position={[hole.x, hole.y, -hole.z]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.05, 18]} />
          <meshStandardMaterial color="#dbeafe" emissive="#2563eb" emissiveIntensity={0.15} />
        </mesh>
      ))}

      {/* Cargo Tanks */}
      {showTanks && tanks.map((tank, index) => (
        <CargoTank
          key={index}
          position={tank.position}
          size={tank.size}
          fillLevel={tankLevels[index] || 50}
          color={tank.color}
          label={tank.label}
        />
      ))}

      {/* Bulkheads (watertight compartment dividers) */}
      {showTanks && (
        <>
          {/* Forward bulkhead */}
          <mesh position={[2.6, 0, 0]}>
            <boxGeometry args={[0.05, 0.7, 1.2]} />
            <meshStandardMaterial color="#7f8c8d" metalness={0.5} roughness={0.5} />
          </mesh>
          {/* Mid-forward bulkhead */}
          <mesh position={[1.4, 0, 0]}>
            <boxGeometry args={[0.05, 0.7, 1.2]} />
            <meshStandardMaterial color="#7f8c8d" metalness={0.5} roughness={0.5} />
          </mesh>
          {/* Center bulkhead */}
          <mesh position={[0.2, 0, 0]}>
            <boxGeometry args={[0.05, 0.7, 1.2]} />
            <meshStandardMaterial color="#7f8c8d" metalness={0.5} roughness={0.5} />
          </mesh>
          {/* Engine room bulkhead */}
          <mesh position={[-1.8, 0, 0]}>
            <boxGeometry args={[0.05, 0.7, 1.2]} />
            <meshStandardMaterial color="#7f8c8d" metalness={0.5} roughness={0.5} />
          </mesh>
          {/* Centerline division */}
          <mesh position={[0.2, -0.1, 0]}>
            <boxGeometry args={[4.4, 0.5, 0.03]} />
            <meshStandardMaterial color="#7f8c8d" metalness={0.5} roughness={0.5} />
          </mesh>
        </>
      )}
      
      {/* Superstructure */}
      <RoundedBox position={shipConfig.superstructurePos} args={shipConfig.superstructureSize} radius={0.06} smoothness={4}>
        <meshPhysicalMaterial color={shipConfig.superstructureColor} metalness={0.15} roughness={0.4} clearcoat={0.3} clearcoatRoughness={0.25} />
      </RoundedBox>
      
      {/* Bridge */}
      <RoundedBox position={shipConfig.bridgePos} args={[0.9, 0.45, 0.8]} radius={0.05} smoothness={4}>
        <meshPhysicalMaterial color="#60a5fa" metalness={0.3} roughness={0.25} clearcoat={0.4} clearcoatRoughness={0.2} />
      </RoundedBox>

      {/* Bridge windows */}
      {[-0.25, 0, 0.25].map((xPos, index) => (
        <mesh
          key={`window-${index}`}
          position={[shipConfig.bridgePos[0] + xPos, shipConfig.bridgePos[1], shipConfig.bridgePos[2] + 0.42]}
        >
          <boxGeometry args={[0.18, 0.15, 0.04]} />
          <meshPhysicalMaterial
            color="#1f2937"
            metalness={0.1}
            roughness={0.15}
            transparent
            opacity={0.55}
            transmission={0.3}
          />
        </mesh>
      ))}
      
      {/* Funnel */}
      <mesh position={shipConfig.funnelPos}>
        <cylinderGeometry args={[0.16, 0.22, 0.6, 8]} />
        <meshStandardMaterial color="#6b7280" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Funnel cap */}
      <mesh position={[shipConfig.funnelPos[0], shipConfig.funnelPos[1] + 0.31, shipConfig.funnelPos[2]]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.18, 0.18, 10]} />
        <meshStandardMaterial color="#4b5563" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Aft mast */}
      <mesh position={[shipConfig.bridgePos[0] + 0.6, shipConfig.bridgePos[1] - 0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.2, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Flag pole */}
      <mesh position={[shipConfig.bridgePos[0] + 0.6, shipConfig.bridgePos[1] + 0.45, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
      </mesh>
      <Flag position={[shipConfig.bridgePos[0] + 0.6, shipConfig.bridgePos[1] + 0.7, 0.25]} />

      {/* Cargo cranes */}
      {shipConfig.showCranes &&
        [1.4, 0.1, -1.2].map((xPos, index) => (
          <group key={`crane-${index}`} position={[xPos, 0.7, 0.55]}>
            <mesh rotation={[0, 0, Math.PI / 6]}>
              <cylinderGeometry args={[0.03, 0.03, 1.4, 8]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.3} roughness={0.6} />
            </mesh>
            <mesh position={[0.25, 0.3, -0.4]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.3} roughness={0.6} />
            </mesh>
          </group>
        ))}

      {/* Container stacks */}
      {shipConfig.showContainers &&
        [1.8, 0.8, -0.2].map((xPos) => (
          <group key={`container-stack-${xPos}`} position={[xPos, 0.7, 0]}>
            {[0, 0.18, 0.36].map((yPos, idx) => (
              <mesh key={`container-${idx}`} position={[0, yPos, 0]}>
                <boxGeometry args={[0.9, 0.16, 0.9]} />
                <meshStandardMaterial color={idx % 2 === 0 ? "#ef4444" : "#38bdf8"} metalness={0.2} roughness={0.6} />
              </mesh>
            ))}
          </group>
        ))}

      {/* Tanker piping */}
      {shipConfig.showTankerPiping && (
        <>
          {[1.9, 0.7, -0.6].map((xPos) => (
            <mesh key={`pipe-${xPos}`} position={[xPos, 0.65, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 1.1, 12]} />
              <meshStandardMaterial color="#f97316" metalness={0.5} roughness={0.4} />
            </mesh>
          ))}
          <mesh position={[0.6, 0.62, 0.35]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 3.2, 12]} />
            <meshStandardMaterial color="#fb923c" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[0.6, 0.62, -0.35]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 3.2, 12]} />
            <meshStandardMaterial color="#fb923c" metalness={0.5} roughness={0.4} />
          </mesh>
        </>
      )}

      {/* Ro-Ro ramp */}
      {shipConfig.showRoRoRamp && (
        <group position={[-3.2, 0.2, 0]}>
          <mesh rotation={[0, 0, Math.PI / 10]}>
            <boxGeometry args={[0.8, 0.05, 0.9]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.2} roughness={0.6} />
          </mesh>
          <mesh position={[0.2, -0.12, 0]}>
            <boxGeometry args={[0.4, 0.04, 0.9]} />
            <meshStandardMaterial color="#cbd5f5" metalness={0.2} roughness={0.6} />
          </mesh>
        </group>
      )}

      {/* Passenger decks */}
      {shipConfig.showPassengerDecks &&
        [0, 0.45, 0.9].map((yOffset, index) => (
          <mesh key={`passenger-deck-${index}`} position={[0.2, 1.2 + yOffset, 0]}>
            <boxGeometry args={[3.4, 0.35, 1.15]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.1} roughness={0.5} />
          </mesh>
        ))}

      {/* Propeller */}
      <group position={[-3.45, -0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <torusGeometry args={[0.12, 0.02, 8, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.7} roughness={0.3} />
        </mesh>
        {[0, Math.PI / 2, Math.PI].map((rotation, index) => (
          <mesh key={`prop-blade-${index}`} rotation={[0, rotation, 0]}>
            <boxGeometry args={[0.04, 0.22, 0.08]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Rudder */}
      <mesh position={[-3.25, -0.55, 0]}>
        <boxGeometry args={[0.08, 0.35, 0.28]} />
        <meshStandardMaterial color="#6b7280" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Lifeboats */}
      {Array.from({ length: shipConfig.extraLifeboats }).map((_, index) => (
        <mesh
          key={`lifeboat-${index}`}
          position={[
            shipConfig.superstructurePos[0] - 0.4 + index * 0.35,
            shipConfig.superstructurePos[1] + 0.1,
            -0.65,
          ]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <capsuleGeometry args={[0.12, 0.5, 6, 12]} />
          <meshStandardMaterial color="#f97316" metalness={0.2} roughness={0.5} />
        </mesh>
      ))}

      {/* Winches */}
      {[1.9, 0.7, -0.5].map((xPos, index) => (
        <group key={`winch-${index}`} position={[xPos, 0.62, -0.55]}>
          <mesh>
            <cylinderGeometry args={[0.09, 0.09, 0.18, 12]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.4} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.16, 12]} />
            <meshStandardMaterial color="#6b7280" metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Radar array */}
      <group position={[-2.0, 1.8, 0.2]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0.25, 0, 0]}>
          <boxGeometry args={[0.5, 0.08, 0.08]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* Navigation lights */}
      {navigationLights.map((light, index) => (
        <group key={`nav-light-${index}`}>
          <mesh position={light.position as [number, number, number]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial color={light.color} emissive={light.color} emissiveIntensity={1.8} />
          </mesh>
          <pointLight position={light.position as [number, number, number]} intensity={1} distance={2} color={light.color} />
        </group>
      ))}

      {/* Mooring ropes */}
      {[
        { start: [2.7, 0.5, 0.65], end: [3.5, -0.2, 1.2] },
        { start: [2.7, 0.5, -0.65], end: [3.5, -0.2, -1.2] },
      ].map((rope, index) => {
        const start = new THREE.Vector3(...rope.start);
        const end = new THREE.Vector3(...rope.end);
        const mid = start.clone().add(end).multiplyScalar(0.5);
        const direction = end.clone().sub(start).normalize();
        const length = start.distanceTo(end);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

        return (
          <mesh key={`rope-${index}`} position={[mid.x, mid.y, mid.z]} quaternion={quaternion}>
            <cylinderGeometry args={[0.01, 0.01, length, 8]} />
            <meshStandardMaterial color="#6b4f2a" roughness={0.9} metalness={0.1} />
          </mesh>
        );
      })}
      
      {/* G Point (Gravity Center) */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#e74c3c" emissive="#e74c3c" emissiveIntensity={0.3} />
      </mesh>
      
      {/* B Point (Buoyancy Center) */}
      <mesh position={[0, -0.35, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#3498db" emissive="#3498db" emissiveIntensity={0.3} />
      </mesh>
      
      {/* M Point (Metacenter) */}
      <mesh position={[0, 1.55, 0]}>
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
  const geometryRef = useRef<THREE.PlaneGeometry>(null);
  const waterNormalMap = useMemo(() => {
    const size = 64;
    const data = new Uint8Array(size * size * 3);
    for (let i = 0; i < size * size; i++) {
      data[i * 3] = 128 + Math.random() * 40;
      data[i * 3 + 1] = 128 + Math.random() * 40;
      data[i * 3 + 2] = 255;
    }
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    texture.needsUpdate = true;
    return texture;
  }, []);
  
  useFrame(({ clock }) => {
    if (geometryRef.current) {
      const time = clock.getElapsedTime();
      const positions = geometryRef.current.attributes.position;
      
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        
        // Create wave pattern using multiple sine waves
        const wave1 = Math.sin(x * 0.5 + time * 1.5) * 0.15;
        const wave2 = Math.sin(y * 0.3 + time * 1.2) * 0.1;
        const wave3 = Math.sin((x + y) * 0.4 + time * 0.8) * 0.08;
        const wave4 = Math.cos(x * 0.8 - time * 1.0) * 0.05;
        
        positions.setZ(i, wave1 + wave2 + wave3 + wave4);
      }
      
      positions.needsUpdate = true;
      geometryRef.current.computeVertexNormals();
    }
    
    if (waterRef.current) {
      // Gentle overall bobbing
      waterRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.02 - 0.3;
    }
  });

  return (
    <mesh ref={waterRef} position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry ref={geometryRef} args={[22, 22, 72, 72]} />
      <meshPhysicalMaterial 
        color="#0077be"
        transparent 
        opacity={0.9}
        metalness={0.7}
        roughness={0.15}
        clearcoat={0.85}
        clearcoatRoughness={0.08}
        envMapIntensity={1.1}
        normalMap={waterNormalMap}
        normalScale={new THREE.Vector2(0.6, 0.6)}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Foam/spray particles around the ship
const WaterFoam = () => {
  const foamRef = useRef<THREE.Points>(null);
  const particleCount = 100;
  
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 1] = -0.2 + Math.random() * 0.3;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
  }
  
  useFrame(({ clock }) => {
    if (foamRef.current) {
      const positions = foamRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const time = clock.getElapsedTime();
      
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        // Gentle floating motion
        positions.array[idx + 1] = -0.15 + Math.sin(time * 2 + i) * 0.1;
        // Drift slowly
        positions.array[idx] += Math.sin(time * 0.5 + i * 0.1) * 0.002;
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <points ref={foamRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

interface SceneProps extends ShipModelProps {
  showTanks: boolean;
  tankLevels: number[];
}

const Scene = ({ heelAngle, trimAngle, shipType, showTanks, tankLevels }: SceneProps) => {
  return (
    <>
      <fog attach="fog" args={["#0b1f3a", 7, 22]} />
      <PerspectiveCamera makeDefault position={[7, 3.5, 6]} fov={42} />
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={4}
        maxDistance={18}
        autoRotate={false}
      />
      
      <ambientLight intensity={0.25} />
      <hemisphereLight args={["#c7d2fe", "#0b1220", 0.5]} />
      <directionalLight position={[6, 10, 6]} intensity={1.3} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <directionalLight position={[-6, 5, -5]} intensity={0.55} />
      
      <ShipModel heelAngle={heelAngle} trimAngle={trimAngle} shipType={shipType} showTanks={showTanks} tankLevels={tankLevels} />
      <WaterSurface />
      <WaterFoam />

      <ContactShadows position={[0, -0.85, 0]} opacity={0.35} scale={12} blur={2.5} far={4} />

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
  const [shipType, setShipType] = useState<ShipType>("container");
  const showTanks = true;
  const tankLevels = useMemo(() => {
    if (shipType === "tanker") return [90, 85, 80, 75, 60, 55, 40, 35];
    if (shipType === "bulk") return [65, 75, 55];
    if (shipType === "roro") return [45, 50, 35];
    if (shipType === "passenger") return [40, 35, 30];
    return [75, 50, 85, 60, 40, 90];
  }, [shipType]);
  const activeShipType = shipTypeOptions.find((option) => option.value === shipType);

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
          Mouse ile döndür, kaydır ve yakınlaştır. Geminin tipini seçerek farklı üst yapı ve güverte düzenlerini inceleyin.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 rounded-lg border border-border/40 bg-muted/40 p-3 text-xs">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Label className="text-xs font-semibold">Gemi Tipi</Label>
            <Select value={shipType} onValueChange={(value) => setShipType(value as ShipType)}>
              <SelectTrigger className="h-8 w-full sm:w-48 text-xs">
                <SelectValue placeholder="Gemi tipi seç" />
              </SelectTrigger>
              <SelectContent>
                {shipTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-muted-foreground">{activeShipType?.description}</p>
        </div>
        <div className="relative w-full h-[300px] bg-gradient-to-b from-sky-900/50 to-blue-950/50 rounded-lg overflow-hidden border border-border/40">
          <Suspense fallback={<LoadingFallback />}>
            <Canvas
              shadows
              gl={{ antialias: true }}
              onCreated={({ gl }) => {
                gl.shadowMap.type = THREE.PCFSoftShadowMap;
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 1.1;
                gl.outputColorSpace = THREE.SRGBColorSpace;
              }}
            >
              <Scene heelAngle={heelAngle} trimAngle={trimAngle} shipType={shipType} showTanks={showTanks} tankLevels={tankLevels} />
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
        
        {/* Controls */}
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
            Açıları Sıfırla
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
