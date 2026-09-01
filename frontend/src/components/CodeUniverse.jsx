import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Represents commits over time or contributors as nodes
function Nodes({ viewType, count = 500 }) {
  const meshRef = useRef();

  // Generate random positions depending on the view
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const colorOptions = [new THREE.Color('#0ea5e9'), new THREE.Color('#38bdf8'), new THREE.Color('#818cf8'), new THREE.Color('#2dd4bf')];

    for (let i = 0; i < count; i++) {
      if (viewType === 'time-galaxy') {
        // Spiral galaxy shape for time
        const radius = Math.random() * 20;
        const theta = radius * 2 + Math.random() * Math.PI * 2;
        positions[i * 3] = Math.cos(theta) * radius;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
        positions[i * 3 + 2] = Math.sin(theta) * radius;
      } else {
        // Constellation / Network shape for contributors
        positions[i * 3] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      }

      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors };
  }, [viewType, count]);

  // Subtle rotation animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={colors} count={colors.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.15} vertexColors transparent opacity={0.8} sizeAttenuation={true} />
    </points>
  );
}

export default function CodeUniverse({ data }) {
  const [viewType, setViewType] = useState('time-galaxy'); // 'time-galaxy' or 'constellation'

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, background: '#020617' }}>
        <Canvas camera={{ position: [0, 10, 30], fov: 60 }}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.5} />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <Nodes key={viewType} viewType={viewType} count={800} />
        <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
      </div>
      
      {/* Toggle View Overlay */}
      <div style={{ position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setViewType('time-galaxy')}
          style={{
            background: viewType === 'time-galaxy' ? 'rgba(14, 165, 233, 0.3)' : 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(14, 165, 233, 0.5)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}
        >
          Time Galaxy
        </button>
        <button 
          onClick={() => setViewType('constellation')}
          style={{
            background: viewType === 'constellation' ? 'rgba(14, 165, 233, 0.3)' : 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(14, 165, 233, 0.5)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}
        >
          Contributor Constellation
        </button>
      </div>
    </>
  );
}
