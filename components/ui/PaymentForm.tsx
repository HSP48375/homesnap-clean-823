import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PaymentFormProps {
  amount: number;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  amount, 
  onPaymentSuccess, 
  onPaymentError 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setLoading(true);
    setCardError(null);

    try {
      // In a real application, you would create a payment intent on your server
      // and then confirm it here with the card element
      
      // For this demo, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a fake payment ID
      const paymentId = `pi_${Math.random().toString(36).substring(2, 15)}`;
      
      onPaymentSuccess(paymentId);
      toast.success('Payment successful!');
    } catch (error: any) {
      setCardError(error.message || 'An error occurred during payment processing');
      onPaymentError(error.message || 'Payment failed');
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardChange = (event: any) => {
    setCardError(event.error ? event.error.message : null);
  };

  const cardElementOptions = {
    style: {
      base: {
        color: '#fff',
        fontFamily: '"Poppins", sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: 'rgba(255, 255, 255, 0.5)',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="card-element" className="block text-sm font-medium text-white mb-2">
          Card Details
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CreditCard className="h-5 w-5 text-white/50" />
          </div>
          <div className="input pl-10 w-full min-h-[42px] flex items-center">
            <CardElement 
              id="card-element" 
              options={cardElementOptions} 
              onChange={handleCardChange}
            />
          </div>
        </div>
        {cardError && (
          <p className="mt-2 text-sm text-red-500">{cardError}</p>
        )}
      </div>

      <div className="border-t border-white/10 pt-6 mt-6">
        <button
          type="submit"
          disabled={!stripe || loading}
          className="btn btn-primary w-full"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </button>
        <p className="text-white/50 text-sm text-center mt-4">
          Your payment information is secure and encrypted.
        </p>
      </div>
    </form>
  );
};

export default PaymentForm;