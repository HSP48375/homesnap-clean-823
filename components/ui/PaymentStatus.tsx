import React from 'react';
import { CheckCircle, Clock, AlertTriangle, CreditCard } from 'lucide-react';

interface PaymentStatusProps {
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  size?: 'sm' | 'md' | 'lg';
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ status, size = 'md' }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />;
      case 'processing':
        return <Clock className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />;
      case 'failed':
        return <AlertTriangle className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />;
      case 'pending':
      default:
        return <CreditCard className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />;
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case 'succeeded':
        return 'bg-neon-green/20 text-neon-green';
      case 'processing':
        return 'bg-secondary/20 text-secondary';
      case 'failed':
        return 'bg-red-500/20 text-red-500';
      case 'pending':
      default:
        return 'bg-white/10 text-white/70';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1';
      case 'lg':
        return 'text-sm px-3 py-2';
      default:
        return 'text-xs px-2.5 py-1.5';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'succeeded':
        return 'Paid';
      case 'processing':
        return 'Processing';
      case 'failed':
        return 'Failed';
      case 'pending':
      default:
        return 'Pending';
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full ${getStatusClass()} ${getSizeClass()}`}>
      {getStatusIcon()}
      <span className={`ml-1 ${size === 'sm' ? '' : 'font-medium'}`}>{getStatusText()}</span>
    </span>
  );
};

export default PaymentStatus;