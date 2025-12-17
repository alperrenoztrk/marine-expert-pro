import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface CompassNeedleProps {
  headingDeg: number;
}

const CompassNeedle: React.FC<CompassNeedleProps> = ({ headingDeg }) => {
  const needleRef = useRef<THREE.Group>(null);
  const targetRotation = useRef(-headingDeg * (Math.PI / 180));

  useFrame(() => {
    if (needleRef.current) {
      targetRotation.current = -headingDeg * (Math.PI / 180);
      needleRef.current.rotation.y += (targetRotation.current - needleRef.current.rotation.y) * 0.1;
    }
  });

  return (
    <group ref={needleRef}>
      {/* North needle (teal/cyan) */}
      <mesh position={[0, 0.08, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.12, 1, 4]} />
        <meshStandardMaterial color="#20c5c5" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* South needle (silver) */}
      <mesh position={[0, 0.08, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.1, 0.8, 4]} />
        <meshStandardMaterial color="#c8d8e4" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Center pivot */}
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#e8f0f4" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

interface CompassBaseProps {
  headingDeg: number;
}

const CompassBase: React.FC<CompassBaseProps> = ({ headingDeg }) => {
  const cardinalDirections = [
    { label: 'N', angle: 0, color: '#ff4444' },
    { label: 'E', angle: 90, color: '#ffffff' },
    { label: 'S', angle: 180, color: '#ffffff' },
    { label: 'W', angle: 270, color: '#ffffff' },
  ];

  return (
    <group>
      {/* Outer chrome rim */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.6, 1.6, 0.15, 64]} />
        <meshStandardMaterial color="#c8d8e4" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Inner dark ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.45, 1.45, 0.12, 64]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Compass face - transparent/glass effect */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.35, 1.35, 0.05, 64]} />
        <meshStandardMaterial 
          color="#2a4a5e" 
          metalness={0.1} 
          roughness={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Tick marks */}
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = (i * 10) * (Math.PI / 180);
        const isMajor = i % 9 === 0;
        const length = isMajor ? 0.2 : 0.1;
        const innerR = 1.2 - length;
        const outerR = 1.2;
        const midR = (innerR + outerR) / 2;
        
        return (
          <mesh
            key={i}
            position={[Math.sin(angle) * midR, 0.08, Math.cos(angle) * midR]}
            rotation={[-Math.PI / 2, 0, -angle]}
          >
            <boxGeometry args={[0.02, length, 0.02]} />
            <meshStandardMaterial color={isMajor ? "#ffffff" : "#888888"} />
          </mesh>
        );
      })}

      {/* Cardinal direction labels */}
      {cardinalDirections.map(({ label, angle, color }) => {
        const rad = angle * (Math.PI / 180);
        const r = 1.0;
        return (
          <Text
            key={label}
            position={[Math.sin(rad) * r, 0.1, Math.cos(rad) * r]}
            rotation={[-Math.PI / 2, 0, -rad]}
            fontSize={0.2}
            color={color}
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter-bold.woff"
          >
            {label}
          </Text>
        );
      })}

      {/* Glass dome */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[1.4, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.1} 
          roughness={0.05}
          transparent
          opacity={0.15}
        />
      </mesh>

      <CompassNeedle headingDeg={headingDeg} />
    </group>
  );
};

interface Compass3DViewProps {
  headingDeg: number;
  className?: string;
}

const Compass3DView: React.FC<Compass3DViewProps> = ({ headingDeg, className = '' }) => {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 2.5, 2.5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} />
        <pointLight position={[0, 3, 0]} intensity={0.5} />
        
        <CompassBase headingDeg={headingDeg} />
      </Canvas>
    </div>
  );
};

export default Compass3DView;
