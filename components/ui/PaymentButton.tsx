import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createCheckoutSession } from '../../lib/stripe';
import { useAuthStore } from '../../stores/authStore';

interface PaymentButtonProps {
  orderId: string;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ 
  orderId, 
  amount, 
  onSuccess, 
  onError 
}) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!user?.email) {
      toast.error('User email is required for payment');
      onError?.('User email is required for payment');
      return;
    }

    setLoading(true);

    try {
      // Create a checkout session
      const sessionId = await createCheckoutSession(orderId, amount, user.email);
      
      if (!sessionId) {
        throw new Error('Failed to create checkout session');
      }
      
      // In a real app, you would redirect to Stripe Checkout
      // window.location.href = sessionUrl;
      
      // For this demo, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Payment processed successfully');
      onSuccess?.();
      
      // Redirect to success page
      navigate(`/payment-success?session_id=${sessionId}`);
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment processing failed');
      onError?.(error.message || 'Payment processing failed');
      
      // Redirect to failure page
      navigate('/payment-failure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="btn btn-primary w-full flex items-center justify-center"
    >
      {loading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing Payment...
        </span>
      ) : (
        <span className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Pay ${amount.toFixed(2)}
        </span>
      )}
    </button>
  );
};

export default PaymentButton;