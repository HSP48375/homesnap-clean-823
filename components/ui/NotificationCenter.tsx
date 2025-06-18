import React, { useState, useEffect, useRef } from 'react';
import { useNotificationStore, Notification } from '../../stores/notificationStore';
import { Bell, Check, Trash2, X, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { 
    notifications, 
    unreadCount, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead,
    deleteNotification
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
    
    // Set up polling to check for new notifications
    const interval = setInterval(() => {
      fetchNotifications();
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = (notification: Notification, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead(notification.id);
  };

  const handleDeleteNotification = (notification: Notification, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(notification.id);
  };

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAllAsRead();
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

  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={handleToggleDropdown}
        className="relative p-2 rounded-full hover:bg-dark-light transition-colors"
      >
        <Bell className="h-6 w-6 text-white/70" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 glassmorphism rounded-lg shadow-lg py-2 z-50 max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-medium">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-white/70 hover:text-white flex items-center"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Mark all as read
                </button>
              )}
              <Link to="/profile/notifications" className="text-white/70 hover:text-white">
                <Settings className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-6 text-center text-white/50">
              <Bell className="h-8 w-8 mx-auto mb-2 text-white/30" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-white/5 hover:bg-dark-light transition-colors ${
                    notification.status === 'unread' ? 'bg-dark-lighter' : ''
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
                          {notification.status === 'unread' && (
                            <button
                              onClick={(e) => handleMarkAsRead(notification, e)}
                              className="text-white/50 hover:text-white p-1"
                              title="Mark as read"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDeleteNotification(notification, e)}
                            className="text-white/50 hover:text-white p-1"
                            title="Delete notification"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <p className={`text-sm ${notification.status === 'unread' ? 'text-white/80' : 'text-white/60'}`}>
                        {notification.message}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-white/50">
                          {formatNotificationTime(notification.created_at)}
                        </span>
                        {notification.deep_link && (
                          <Link
                            to={notification.deep_link}
                            className="text-xs text-primary hover:underline"
                            onClick={() => {
                              if (notification.status === 'unread') {
                                markAsRead(notification.id);
                              }
                              setIsOpen(false);
                            }}
                          >
                            View details
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {notifications.length > 0 && (
                <div className="px-4 py-2 text-center">
                  <Link
                    to="/profile/notifications"
                    className="text-xs text-primary hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    View all notifications
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;