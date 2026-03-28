import React, { useEffect, useState } from 'react';
import { useOrderStore, Order } from '../../stores/orderStore';
import OrderSummary from './OrderSummary';
import { FileBox, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderHistory: React.FC = () => {
  const { orders, loading, fetchOrders } = useOrderStore();
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredOrders(orders);
    } else if (filter === 'pending-payment') {
      setFilteredOrders(orders.filter(order => 
        order.payment_status !== 'succeeded' && order.status === 'pending'
      ));
    } else {
      setFilteredOrders(orders.filter(order => order.status === filter));
    }
  }, [orders, filter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-white/70">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <FileBox className="h-16 w-16 text-white/30 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
        <p className="text-white/70 mb-6 max-w-md mx-auto">
          You haven't placed any orders yet. Start by uploading your photos for professional editing.
        </p>
        <Link to="/upload" className="btn btn-primary">
          Upload Photos
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex mb-6 overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md mr-2 ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-dark-light text-white/70 hover:text-white'
          }`}
        >
          All Orders
        </button>
        <button
          onClick={() => setFilter('pending-payment')}
          className={`px-4 py-2 rounded-md mr-2 ${
            filter === 'pending-payment'
              ? 'bg-neon-purple text-white'
              : 'bg-dark-light text-white/70 hover:text-white'
          }`}
        >
          Awaiting Payment
        </button>
        <button
          onClick={() => setFilter('processing')}
          className={`px-4 py-2 rounded-md mr-2 ${
            filter === 'processing'
              ? 'bg-secondary text-dark'
              : 'bg-dark-light text-white/70 hover:text-white'
          }`}
        >
          Processing
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-md mr-2 ${
            filter === 'completed'
              ? 'bg-neon-green text-dark'
              : 'bg-dark-light text-white/70 hover:text-white'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('failed')}
          className={`px-4 py-2 rounded-md ${
            filter === 'failed'
              ? 'bg-red-500 text-white'
              : 'bg-dark-light text-white/70 hover:text-white'
          }`}
        >
          Failed
        </button>
      </div>

      <div className="space-y-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderSummary key={order.id} order={order} />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-white/70">No orders match the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;