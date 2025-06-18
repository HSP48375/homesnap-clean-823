import React from 'react';
import { Camera } from 'lucide-react';

interface PhoneMockupProps {
  image: string;
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({ image }) => {
  return (
    <div className="phone-mockup">
      <div className="phone-notch"></div>
      <div className="phone-screen">
        {/* Camera Interface */}
        <div className="relative h-full">
          {/* Camera Preview */}
          <div className="absolute inset-0">
            <img 
              src={image} 
              alt="Camera preview" 
              className="w-full h-full object-cover"
            />
            
            {/* Camera Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
              {Array.from({ length: 4 }).map((_, i) => (
                <React.Fragment key={i}>
                  <div className="border-l border-white/30"></div>
                  <div className="border-t border-white/30"></div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/50 to-transparent flex items-center justify-between px-4">
            <div className="flex items-center">
              <Camera className="h-5 w-5 text-white" />
              <span className="ml-2 text-white font-medium">HomeSnap Pro</span>
            </div>
          </div>

          {/* Bottom Bar with Apple Gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-center">
            {/* Shutter Button */}
            <button className="w-16 h-16 rounded-full border-4 border-white bg-white/20 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneMockup;