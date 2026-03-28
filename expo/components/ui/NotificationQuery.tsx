import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Bell, Clock, CheckCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface NotificationData {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  status: 'read' | 'unread';
  deep_link?: string;
  created_at: string;
  read_at?: string;
}

const NotificationQuery: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      setNotifications(data || []);
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_update':
        return <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center"><Bell className="h-4 w-4 text-secondary" /></div>;
      case 'payment_update':
        return <div className="h-8 w-8 rounded-full bg-neon-green/20 flex items-center justify-center"><Bell className="h-4 w-4 text-neon-green" /></div>;
      case 'editor_assignment':
        return <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center"><Bell className="h-4 w-4 text-primary" /></div>;
      case 'floorplan_update':
        return <div className="h-8 w-8 rounded-full bg-neon-blue/20 flex items-center justify-center"><Bell className="h-4 w-4 text-neon-blue" /></div>;
      case 'test':
        return <div className="h-8 w-8 rounded-full bg-neon-purple/20 flex items-center justify-center"><Bell className="h-4 w-4 text-neon-purple" /></div>;
      default:
        return <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center"><Bell className="h-4 w-4 text-white" /></div>;
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Last 5 Notifications</h2>
        <button 
          onClick={fetchNotifications}
          className="btn btn-outline btn-sm flex items-center"
          disabled={loading}
        >
          <Clock className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-white/70">Loading notifications...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-500/20 border border-red-500/50 rounded-md p-4 text-center">
          <p className="text-white">{error}</p>
          <button 
            onClick={fetchNotifications}
            className="btn btn-sm btn-outline mt-4"
          >
            Try Again
          </button>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-8">
          <Bell className="h-12 w-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/70">No notifications found in the database.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 rounded-lg border ${
                notification.status === 'unread' 
                  ? 'bg-dark-lighter border-white/10' 
                  : 'bg-dark-light border-transparent'
              }`}
            >
              <div className="flex">
                <div className="mr-3 flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className={`font-medium text-sm ${notification.status === 'unread' ? 'text-white' : 'text-white/80'}`}>
                      {notification.title}
                    </h4>
                    <div className="flex items-center space-x-1 ml-2">
                      {notification.status === 'unread' ? (
                        <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                          Unread
                        </span>
                      ) : (
                        <span className="flex items-center text-white/50 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Read
                        </span>
                      )}
                    </div>
                  </div>
                  <p className={`text-sm ${notification.status === 'unread' ? 'text-white/80' : 'text-white/60'}`}>
                    {notification.message}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-white/50">
                      {formatDate(notification.created_at)}
                    </span>
                    <span className="text-xs text-white/50">
                      User ID: {notification.user_id.substring(0, 8)}...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-white/10">
        <h3 className="font-medium mb-2">Database Information</h3>
        <p className="text-white/70 text-sm">
          These notifications are queried directly from the Supabase <code className="bg-dark-lighter px-1 py-0.5 rounded">notifications</code> table.
          They represent the actual data stored in the database, regardless of which user is currently logged in.
        </p>
      </div>
    </div>
  );
};

export default NotificationQuery;