import React from 'react';
import { useFloorplanStore, FloorplanPackage } from '../../stores/floorplanStore';
import { Check, CheckCircle, Clock, Image, Layers, Zap } from 'lucide-react';

const PackageSelector: React.FC = () => {
  const { packages, currentOrder, selectPackage } = useFloorplanStore();
  
  const standardPackage = packages.find(pkg => pkg.id === 'standard');
  const proPackage = packages.find(pkg => pkg.id === 'pro');
  const priorityPackage = packages.find(pkg => pkg.id === 'priority');
  
  const isStandardSelected = currentOrder?.packageId === 'standard';
  const isProSelected = currentOrder?.packageId === 'pro';
  const isPrioritySelected = currentOrder?.packageId.includes('priority');
  
  const handleSelectPackage = (packageId: string) => {
    selectPackage(packageId);
  };
  
  const handleTogglePriority = () => {
    if (!currentOrder) return;
    
    if (isPrioritySelected) {
      // Remove priority
      selectPackage(currentOrder.packageId.replace('-priority', ''));
    } else {
      // Add priority
      selectPackage('priority');
    }
  };
  
  if (!standardPackage || !proPackage || !priorityPackage) {
    return <div>Loading packages...</div>;
  }
  
  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-6">Select Your Floorplan Package</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Standard Package */}
        <div 
          className={`card p-6 border-2 transition-all ${
            isStandardSelected 
              ? 'border-primary neon-border' 
              : 'border-white/10 hover:border-white/30'
          } cursor-pointer`}
          onClick={() => handleSelectPackage('standard')}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{standardPackage.name}</h3>
              <p className="text-white/70">{standardPackage.description}</p>
            </div>
            {isStandardSelected && (
              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <ul className="space-y-2">
              {standardPackage.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
            <div className="flex items-center">
              <Image className="h-5 w-5 text-white/70 mr-2" />
              <span className="text-white/70">2D Only</span>
            </div>
            <span className="text-xl font-bold">${standardPackage.price}</span>
          </div>
        </div>
        
        {/* Pro Package */}
        <div 
          className={`card p-6 border-2 transition-all ${
            isProSelected 
              ? 'border-primary neon-border' 
              : 'border-white/10 hover:border-white/30'
          } cursor-pointer`}
          onClick={() => handleSelectPackage('pro')}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center mb-1">
                <h3 className="text-lg font-semibold">{proPackage.name}</h3>
                <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                  RECOMMENDED
                </span>
              </div>
              <p className="text-white/70">{proPackage.description}</p>
            </div>
            {isProSelected && (
              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <ul className="space-y-2">
              {proPackage.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
            <div className="flex items-center">
              <Layers className="h-5 w-5 text-white/70 mr-2" />
              <span className="text-white/70">2D & 3D</span>
            </div>
            <span className="text-xl font-bold">${proPackage.price}</span>
          </div>
        </div>
      </div>
      
      {/* Priority Add-on */}
      <div className="mb-8">
        <div 
          className={`card p-4 border transition-all ${
            isPrioritySelected 
              ? 'border-neon-purple bg-neon-purple/10' 
              : 'border-white/10 hover:border-white/30'
          } cursor-pointer flex items-center`}
          onClick={handleTogglePriority}
        >
          <div className={`h-6 w-6 rounded mr-4 flex items-center justify-center ${
            isPrioritySelected ? 'bg-neon-purple' : 'border border-white/30'
          }`}>
            {isPrioritySelected && <Check className="h-4 w-4 text-white" />}
          </div>
          
          <div className="flex-grow">
            <div className="flex items-center">
              <h3 className="font-semibold">{priorityPackage.name}</h3>
              <span className="ml-2 px-2 py-0.5 bg-neon-purple/20 text-neon-purple text-xs rounded-full">
                FASTER DELIVERY
              </span>
            </div>
            <p className="text-white/70 text-sm">{priorityPackage.description}</p>
          </div>
          
          <div className="flex items-center ml-4">
            <Zap className="h-5 w-5 text-neon-purple mr-2" />
            <span className="font-bold">+${priorityPackage.price}</span>
          </div>
        </div>
      </div>
      
      {/* Measurement Units */}
      <div className="mb-8">
        <h3 className="font-semibold mb-3">Measurement Units</h3>
        <div className="flex space-x-4">
          <label className="flex items-center cursor-pointer">
            <input 
              type="radio" 
              name="units" 
              className="h-4 w-4 text-primary"
              defaultChecked
            />
            <span className="ml-2">Imperial (ft/in)</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input 
              type="radio" 
              name="units" 
              className="h-4 w-4 text-primary"
            />
            <span className="ml-2">Metric (m/cm)</span>
          </label>
        </div>
      </div>
      
      {/* Delivery Time */}
      <div className="card bg-dark-lighter p-4 mb-8">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-white/70 mr-3" />
          <div>
            <h3 className="font-medium">Estimated Delivery Time</h3>
            <p className="text-white/70">
              {isPrioritySelected ? '6-8 hours' : '12-16 hours'} after video submission
            </p>
          </div>
        </div>
      </div>
      
      {/* Total */}
      <div className="flex justify-between items-center p-4 border-t border-white/10">
        <span className="text-lg">Total:</span>
        <span className="text-2xl font-bold">
          ${currentOrder ? (
            isProSelected 
              ? (isPrioritySelected ? proPackage.price + priorityPackage.price : proPackage.price)
              : (isPrioritySelected ? standardPackage.price + priorityPackage.price : standardPackage.price)
          ) : 0}
        </span>
      </div>
    </div>
  );
};

export default PackageSelector;