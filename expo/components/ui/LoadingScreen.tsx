import React, { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      {/* Background patterns */}
      <div className="fixed inset-0 bg-hex-grid opacity-20 pointer-events-none"></div>
      <div className="fixed inset-0 bg-cyber-dots opacity-10 pointer-events-none"></div>
      
      {/* Animated floating orbs */}
      <div 
        className="floating-orb floating-orb-blue w-96 h-96"
        style={{
          top: '10%',
          left: '20%',
          transform: `translate(${(mousePosition.x - window.innerWidth / 2) / -30}px, ${(mousePosition.y - window.innerHeight / 2) / -30}px)`,
          animation: 'float 8s ease-in-out infinite'
        }}
      ></div>
      <div 
        className="floating-orb floating-orb-pink w-80 h-80"
        style={{
          bottom: '15%',
          right: '15%',
          transform: `translate(${(mousePosition.x - window.innerWidth / 2) / -40}px, ${(mousePosition.y - window.innerHeight / 2) / -40}px)`,
          animation: 'float 10s ease-in-out infinite 1s'
        }}
      ></div>
      
      <div 
        className="flex items-center justify-center mb-8 relative"
        style={{
          transform: `translateY(${Math.sin(Date.now() / 1000) * 5}px)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-white/5 to-transparent blur-xl opacity-30"></div>
        <Camera className="h-16 w-16 text-white animate-pulse relative z-10" />
        <span className="ml-3 text-3xl font-bold gradient-text relative z-10">HomeSnap Pro</span>
      </div>
      
      <div className="relative w-64 h-2 bg-black/50 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary via-neon-purple to-secondary animate-loading"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer"></div>
      </div>
      
      <div className="mt-8 text-white/50 text-sm animate-pulse">
        Loading the future of real estate photography...
      </div>
      
      {/* Cyber circles */}
      <div className="absolute bottom-10 left-10 w-40 h-40 border border-white/5 rounded-full"></div>
      <div className="absolute bottom-10 left-10 w-60 h-60 border border-white/3 rounded-full"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 border border-white/2 rounded-full"></div>
      
      <div className="absolute top-10 right-10 w-40 h-40 border border-white/5 rounded-full"></div>
      <div className="absolute top-10 right-10 w-60 h-60 border border-white/3 rounded-full"></div>
      <div className="absolute top-10 right-10 w-80 h-80 border border-white/2 rounded-full"></div>
    </div>
  );
};

export default LoadingScreen;