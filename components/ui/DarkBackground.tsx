
import React from 'react';

interface DarkBackgroundProps {
  children: React.ReactNode;
}

export const DarkBackground: React.FC<DarkBackgroundProps> = ({ children }) => {
  return (
    <div className="relative z-10">
      {children}
    </div>
  );
};
