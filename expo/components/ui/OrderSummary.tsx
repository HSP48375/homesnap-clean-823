import React from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../../stores/orderStore';
import { Download, Eye, CreditCard } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';
import PaymentStatus from './PaymentStatus';
import PaymentButton from './PaymentButton';

interface OrderSummaryProps {
  order: Order;
  showActions?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order, showActions = true }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isPaid = order.payment_status === 'succeeded';
  const isPending = order.status === 'pending';
  const needsPayment = isPending && !isPaid;

  return (
    <div className="card p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            {order.tracking_number || `Order #${order.id.substring(0, 8)}`}
          </h3>
          <p className="text-white/70 text-sm">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>
        <div className="flex items-center mt-2 md:mt-0 space-x-3">
          <OrderStatusBadge status={order.status} />
          <PaymentStatus status={order.payment_status || 'pending'} />
        </div>
      </div>
      
      <div className="border-t border-white/10 pt-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm font-medium text-white/70 mb-1">Photos</h4>
            <p>{order.photo_count} photos</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-white/70 mb-1">Services</h4>
            <div className="space-y-1">
              {order.services.standardEditing && <p>Standard Editing</p>}
              {order.services.virtualStaging && <p>Virtual Staging</p>}
              {order.services.twilightConversion && <p>Twilight Conversion</p>}
              {order.services.decluttering && <p>Decluttering</p>}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-white/70 mb-1">Total</h4>
            <p className="text-lg font-semibold">${order.total_price.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      {showActions && (
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          {needsPayment && (
            <PaymentButton 
              orderId={order.id} 
              amount={order.total_price}
            />
          )}
          
          <Link
            to={`/orders/${order.id}`}
            className="btn btn-outline flex items-center justify-center"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Link>
          
          {order.status === 'completed' && (
            <button className="btn btn-primary flex items-center justify-center">
              <Download className="h-4 w-4 mr-2" />
              Download Photos
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderSummary;