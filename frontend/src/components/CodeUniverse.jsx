import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';

// Represents commits over time or contributors as nodes
function Nodes({ viewType, commits = [] }) {
  const meshRef = useRef();
  const [hoveredNode, setHoveredNode] = useState(null);

  const count = commits.length > 0 ? commits.length : 100; // fallback count

  // Map languages to colors
  const langColors = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Java': '#b07219',
    'Python': '#3572A5',
    'CSS': '#563d7c',
    'HTML': '#e34c26',
    'Unknown': '#888888'
  };

  const defaultColorOptions = [new THREE.Color('#0ea5e9'), new THREE.Color('#38bdf8'), new THREE.Color('#818cf8'), new THREE.Color('#2dd4bf')];

  // Generate positions, colors, and sizes based on real data or fallback
  const { positions, colors, sizes, nodeData } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const nodeData = [];

    for (let i = 0; i < count; i++) {
      const commit = commits[i];
      
      // Position calculation
      if (viewType === 'time-galaxy') {
        const radius = Math.random() * 20;
        const theta = radius * 2 + Math.random() * Math.PI * 2;
        positions[i * 3] = Math.cos(theta) * radius;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
        positions[i * 3 + 2] = Math.sin(theta) * radius;
      } else {
        positions[i * 3] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      }

      // Color calculation
      let color;
      if (commit && commit.language) {
        const hex = langColors[commit.language] || langColors['Unknown'];
        color = new THREE.Color(hex);
      } else {
        color = defaultColorOptions[Math.floor(Math.random() * defaultColorOptions.length)];
      }
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Size calculation (scale size based on commit size, fallback to 1)
      let size = 1.0;
      if (commit && commit.size) {
        // Logarithmic scale so large commits don't eclipse everything
        size = Math.max(0.5, Math.log10(commit.size + 1));
      }
      sizes[i] = size * 0.15; // base multiplier
      
      nodeData.push({
        id: i,
        commit: commit || null,
        position: [positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]]
      });
    }
    
    return { positions, colors, sizes, nodeData };
  }, [viewType, count, commits]);

  // Subtle rotation animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  // Handle intersection for tooltips
  const handlePointerMove = (e) => {
    e.stopPropagation();
    if (e.index !== undefined) {
      const node = nodeData[e.index];
      if (node && node.commit) {
        setHoveredNode(node);
      }
    }
  };

  const handlePointerOut = (e) => {
    setHoveredNode(null);
  };

  return (
    <group>
      <points 
        ref={meshRef}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
      >
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
          <bufferAttribute attach="attributes-color" array={colors} count={colors.length / 3} itemSize={3} />
          {/* Note: WebGLPoints doesn't support per-vertex sizing easily without custom shaders in standard material, 
              but we can apply it if we use a custom shader. For simplicity, we just use a global size or map it if supported. 
              Standard PointsMaterial only supports a uniform size. To keep it simple and react-three-fiber native, 
              we'll just use the uniform size for now or we could use InstancedMesh for true per-node sizing. */}
        </bufferGeometry>
        <pointsMaterial size={0.3} vertexColors transparent opacity={0.8} sizeAttenuation={true} />
      </points>

      {hoveredNode && hoveredNode.commit && (
        <Html position={hoveredNode.position} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(56, 189, 248, 0.5)',
            color: 'white',
            padding: '10px',
            borderRadius: '8px',
            width: '200px',
            backdropFilter: 'blur(4px)',
            transform: 'translate3d(15px, -15px, 0)',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            zIndex: 1000
          }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
              {hoveredNode.commit.sha.substring(0, 7)} by {hoveredNode.commit.author}
            </div>
            <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
              {hoveredNode.commit.message.split('\n')[0]}
            </div>
            <div style={{ fontSize: '11px', display: 'flex', gap: '8px' }}>
              <span style={{ color: '#38bdf8' }}>Size: {hoveredNode.commit.size}</span>
              <span style={{ color: '#f1e05a' }}>{hoveredNode.commit.language}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function CodeUniverse({ data }) {
  const [viewType, setViewType] = useState('time-galaxy');
  const [commits, setCommits] = useState([]);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCommits(e.detail);
      }
    };
    window.addEventListener('updateCommits', handleUpdate);
    return () => window.removeEventListener('updateCommits', handleUpdate);
  }, []);

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, background: '#020617' }}>
        <Canvas camera={{ position: [0, 10, 30], fov: 60 }}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.5} />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        
        <Nodes key={viewType} viewType={viewType} commits={commits} />
        
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
