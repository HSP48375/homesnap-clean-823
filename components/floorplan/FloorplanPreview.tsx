import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Image, Layers, Ruler } from 'lucide-react';

// Simple 3D floorplan preview component
const FloorplanModel: React.FC = () => {
  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      
      {/* Walls */}
      {/* Living Room */}
      <mesh position={[-2, 0.5, 0]} castShadow>
        <boxGeometry args={[0.1, 1, 6]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[2, 0.5, 0]} castShadow>
        <boxGeometry args={[0.1, 1, 6]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[0, 0.5, 3]} castShadow>
        <boxGeometry args={[4, 1, 0.1]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[0, 0.5, -3]} castShadow>
        <boxGeometry args={[4, 1, 0.1]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      
      {/* Kitchen */}
      <mesh position={[4, 0.5, 0]} castShadow>
        <boxGeometry args={[0.1, 1, 4]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[3, 0.5, 2]} castShadow>
        <boxGeometry args={[2, 1, 0.1]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      
      {/* Bedroom */}
      <mesh position={[-4, 0.5, 0]} castShadow>
        <boxGeometry args={[0.1, 1, 4]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[-3, 0.5, 2]} castShadow>
        <boxGeometry args={[2, 1, 0.1]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      
      {/* Furniture */}
      {/* Living Room Sofa */}
      <mesh position={[0, 0.3, -2]} castShadow>
        <boxGeometry args={[3, 0.6, 1]} />
        <meshStandardMaterial color="#8a9db5" />
      </mesh>
      
      {/* Coffee Table */}
      <mesh position={[0, 0.2, -0.5]} castShadow>
        <boxGeometry args={[1.5, 0.4, 0.8]} />
        <meshStandardMaterial color="#a67c52" />
      </mesh>
      
      {/* Kitchen Counter */}
      <mesh position={[3, 0.4, 0]} castShadow>
        <boxGeometry args={[1.8, 0.8, 1.5]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      
      {/* Bedroom Bed */}
      <mesh position={[-3, 0.3, 0]} castShadow>
        <boxGeometry args={[1.8, 0.6, 2.2]} />
        <meshStandardMaterial color="#d4c1a1" />
      </mesh>
    </>
  );
};

// Room labels component
const RoomLabels: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-xs bg-white/80 px-2 py-1 rounded text-gray-800">
          Living Room
          <div className="text-xs font-light">15' x 12'</div>
        </div>
      </div>
      
      <div className="absolute top-1/3 right-1/4 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-xs bg-white/80 px-2 py-1 rounded text-gray-800">
          Kitchen
          <div className="text-xs font-light">10' x 8'</div>
        </div>
      </div>
      
      <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-xs bg-white/80 px-2 py-1 rounded text-gray-800">
          Bedroom
          <div className="text-xs font-light">12' x 10'</div>
        </div>
      </div>
    </div>
  );
};

interface FloorplanPreviewProps {
  is3D?: boolean;
  showLabels?: boolean;
}

const FloorplanPreview: React.FC<FloorplanPreviewProps> = ({ 
  is3D = true,
  showLabels = true
}) => {
  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-4">Floorplan Preview</h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {is3D ? (
              <Layers className="h-5 w-5 text-primary mr-2" />
            ) : (
              <Image className="h-5 w-5 text-primary mr-2" />
            )}
            <h3 className="font-medium">{is3D ? '3D Preview' : '2D Preview'}</h3>
          </div>
          
          <div className="flex items-center text-sm text-white/70">
            <Ruler className="h-4 w-4 mr-1" />
            <span>Imperial (ft)</span>
          </div>
        </div>
        
        <div className="relative aspect-video bg-dark-light rounded-lg overflow-hidden">
          {is3D ? (
            <Canvas shadows>
              <ambientLight intensity={0.5} />
              <directionalLight
                position={[10, 10, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />
              <PerspectiveCamera makeDefault position={[10, 10, 10]} />
              <OrbitControls 
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2}
              />
              <FloorplanModel />
            </Canvas>
          ) : (
            <div className="w-full h-full bg-white">
              <img 
                src="https://images.unsplash.com/photo-1580237072617-771c3ecc4a24?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80" 
                alt="2D Floorplan" 
                className="w-full h-full object-contain"
              />
            </div>
          )}
          
          {showLabels && !is3D && <RoomLabels />}
        </div>
      </div>
      
      <div className="text-center text-white/50 text-xs italic">
        <p>
          Measurements are auto-generated and deemed highly accurate but are not guaranteed. 
          Users should verify all dimensions independently.
        </p>
        <p className="mt-2">
          Total Area: 1,250 sq ft
        </p>
      </div>
      
      <div className="mt-6 flex justify-between items-center">
        <div className="text-white/70 text-sm">
          <p>Sample preview only. Your actual floorplan will be generated from your video scan.</p>
        </div>
        
        <div className="flex space-x-3">
          <button className="btn btn-outline btn-sm">
            <Image className="h-4 w-4 mr-2" />
            2D View
          </button>
          <button className="btn btn-primary btn-sm">
            <Layers className="h-4 w-4 mr-2" />
            3D View
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloorplanPreview;