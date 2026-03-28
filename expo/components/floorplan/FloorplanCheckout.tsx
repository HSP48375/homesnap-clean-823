import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFloorplanStore } from '../../stores/floorplanStore';
import { Camera, CheckCircle, Clock, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';

const FloorplanCheckout: React.FC = () => {
  const { currentOrder, calculatePrice, submitOrder } = useFloorplanStore();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmitOrder = async () => {
    if (!currentOrder) {
      toast.error('Please select a package first');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { success, orderId, error } = await submitOrder();
      
      if (success) {
        toast.success('Floorplan order submitted successfully!');
        // In a real app, this would navigate to a success page or order details
        navigate('/dashboard');
      } else {
        toast.error(error || 'Failed to submit order');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (!currentOrder) {
    return (
      <div className="card p-6 text-center">
        <Camera className="h-12 w-12 text-white/30 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No Package Selected</h3>
        <p className="text-white/70 mb-4">
          Please select a floorplan package to continue.
        </p>
      </div>
    );
  }
  
  const isProPackage = currentOrder.packageId === 'pro';
  const hasPriority = currentOrder.packageId.includes('priority');
  
  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-white/70">Package</span>
          <span className="font-medium">
            {isProPackage ? 'Pro Floorplan' : 'Standard Floorplan'}
          </span>
        </div>
        
        {hasPriority && (
          <div className="flex justify-between text-neon-purple">
            <span>Priority Processing</span>
            <span>Included</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-white/70">Measurement Units</span>
          <span>{currentOrder.measurementUnit === 'metric' ? 'Metric (m/cm)' : 'Imperial (ft/in)'}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-white/70">Delivery Time</span>
          <span>{hasPriority ? '6-8 hours' : '12-16 hours'}</span>
        </div>
        
        {isProPackage && currentOrder.branding && (
          <div className="flex justify-between">
            <span className="text-white/70">Custom Branding</span>
            <span>{currentOrder.branding.companyName || 'Included'}</span>
          </div>
        )}
        
        <div className="border-t border-white/10 pt-4 mt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${calculatePrice().toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Delivery Time */}
      <div className="card bg-dark-lighter p-4 mb-6">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-white/70 mr-3" />
          <div>
            <h3 className="font-medium">Estimated Delivery</h3>
            <p className="text-white/70">
              Your floorplan will be ready within {hasPriority ? '6-8 hours' : '12-16 hours'} after submission.
            </p>
          </div>
        </div>
      </div>
      
      {/* Payment Button */}
      <button
        onClick={handleSubmitOrder}
        disabled={submitting}
        className="btn btn-primary w-full flex items-center justify-center"
      >
        {submitting ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          <span className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Pay ${calculatePrice().toFixed(2)} and Submit Order
          </span>
        )}
      </button>
      
      <p className="text-white/50 text-xs text-center mt-4">
        By submitting your order, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
};

export default FloorplanCheckout;