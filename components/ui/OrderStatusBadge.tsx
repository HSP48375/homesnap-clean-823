import React from 'react';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: 'processing' | 'completed' | 'failed';
  size?: 'sm' | 'md' | 'lg';
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Clock className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />;
      case 'completed':
        return <CheckCircle className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />;
      case 'failed':
        return <AlertTriangle className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />;
      default:
        return null;
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case 'processing':
        return 'bg-secondary/20 text-secondary';
      case 'completed':
        return 'bg-neon-green/20 text-neon-green';
      case 'failed':
        return 'bg-red-500/20 text-red-500';
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

  return (
    <span className={`inline-flex items-center rounded-full ${getStatusClass()} ${getSizeClass()}`}>
      {getStatusIcon()}
      <span className={`ml-1 ${size === 'sm' ? '' : 'font-medium'} capitalize`}>{status}</span>
    </span>
  );
};

export default OrderStatusBadge;