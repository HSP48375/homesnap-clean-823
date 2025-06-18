import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image } from 'lucide-react';
import { useFloorplanStore } from '../../stores/floorplanStore';
import { toast } from 'react-hot-toast';

const BrandingForm: React.FC = () => {
  const { currentOrder, setBranding } = useFloorplanStore();
  const [companyName, setCompanyName] = useState(currentOrder?.branding?.companyName || '');
  const [primaryColor, setPrimaryColor] = useState(currentOrder?.branding?.primaryColor || '#000000');
  const [secondaryColor, setSecondaryColor] = useState(currentOrder?.branding?.secondaryColor || '#666666');
  const [customDisclaimer, setCustomDisclaimer] = useState(currentOrder?.branding?.customDisclaimer || '');
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo file is too large. Maximum size is 2MB.');
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, etc.)');
      return;
    }
    
    setBranding({
      ...currentOrder?.branding,
      logo: file
    });
    
    toast.success('Logo uploaded successfully');
  }, [currentOrder, setBranding]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 2 * 1024 * 1024, // 2MB
    maxFiles: 1
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setBranding({
      ...currentOrder?.branding,
      companyName,
      primaryColor,
      secondaryColor,
      customDisclaimer
    });
    
    toast.success('Branding information saved');
  };
  
  const handleRemoveLogo = () => {
    setBranding({
      ...currentOrder?.branding,
      logo: undefined,
      logoUrl: undefined
    });
  };
  
  // Only show this form for Pro package
  if (!currentOrder || currentOrder.packageId !== 'pro') {
    return null;
  }
  
  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-6">Customize Your Floorplan Branding</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Company Logo
          </label>
          
          {currentOrder.branding?.logoUrl ? (
            <div className="relative w-full h-32 bg-dark-light rounded-lg overflow-hidden mb-2">
              <img 
                src={currentOrder.branding.logoUrl} 
                alt="Company Logo" 
                className="w-full h-full object-contain p-4"
              />
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="absolute top-2 right-2 p-1 bg-dark/80 rounded-full"
              >
                <X className="h-4 w-4 text-white/70" />
              </button>
            </div>
          ) : (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-white/20 hover:border-white/40'
              }`}
            >
              <input {...getInputProps()} />
              <Image className="h-10 w-10 mx-auto mb-4 text-white/50" />
              <p className="text-white/70 mb-2">
                {isDragActive ? 'Drop your logo here' : 'Drag & drop your logo here'}
              </p>
              <p className="text-white/50 text-sm">
                or <span className="text-primary">browse files</span>
              </p>
              <p className="text-white/50 text-xs mt-2">
                PNG or JPG, max 2MB
              </p>
            </div>
          )}
        </div>
        
        {/* Company Name */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-white mb-2">
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="input w-full"
            placeholder="Your Company Name"
          />
        </div>
        
        {/* Brand Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="primaryColor" className="block text-sm font-medium text-white mb-2">
              Primary Color
            </label>
            <div className="flex">
              <input
                type="color"
                id="primaryColor"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-10 w-10 rounded border border-white/20 mr-2"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="input flex-grow"
                placeholder="#000000"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="secondaryColor" className="block text-sm font-medium text-white mb-2">
              Secondary Color
            </label>
            <div className="flex">
              <input
                type="color"
                id="secondaryColor"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="h-10 w-10 rounded border border-white/20 mr-2"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="input flex-grow"
                placeholder="#666666"
              />
            </div>
          </div>
        </div>
        
        {/* Custom Disclaimer */}
        <div>
          <label htmlFor="customDisclaimer" className="block text-sm font-medium text-white mb-2">
            Custom Disclaimer (Optional)
          </label>
          <textarea
            id="customDisclaimer"
            value={customDisclaimer}
            onChange={(e) => setCustomDisclaimer(e.target.value)}
            className="input w-full"
            rows={3}
            placeholder="Add your custom disclaimer text here..."
          ></textarea>
          <p className="text-white/50 text-xs mt-1">
            This will appear in addition to the standard disclaimer.
          </p>
        </div>
        
        <div className="pt-4 border-t border-white/10">
          <button type="submit" className="btn btn-primary w-full">
            Save Branding Information
          </button>
        </div>
      </form>
    </div>
  );
};

export default BrandingForm;