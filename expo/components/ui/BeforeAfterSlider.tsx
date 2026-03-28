import React from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  height?: number;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ 
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  height = 250
}) => {
  return (
    <div className="relative" style={{ height: `${height}px` }}>
      <ReactCompareSlider
        itemOne={
          <ReactCompareSliderImage
            src={beforeImage}
            alt={beforeLabel}
            style={{ objectFit: 'contain', height: `${height}px`, width: '100%' }}
            onError={() => console.log('Failed to load before image:', beforeImage)}
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={afterImage}
            alt={afterLabel}
            style={{ objectFit: 'contain', height: `${height}px`, width: '100%' }}
            onError={() => console.log('Failed to load after image:', afterImage)}
          />
        }
        position={50}
        style={{
          height: `${height}px`,
          width: '100%',
          borderRadius: '0.75rem',
          backgroundColor: '#0a0a14',
        }}
      />
      <div className="absolute top-4 left-4 compare-slider-label">{beforeLabel}</div>
      <div className="absolute top-4 right-4 compare-slider-label">{afterLabel}</div>
    </div>
  );
};

export default BeforeAfterSlider;