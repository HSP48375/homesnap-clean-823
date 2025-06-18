
import React, { useState, useEffect } from 'react';
import { Bell, Calendar, X } from 'lucide-react';

// Sample notifications
const sampleNotifications = [
  {
    id: 1,
    message: 'Your 1234 Oceanview Dr photos are being professionally edited',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
    type: 'processing'
  },
  {
    id: 2,
    message: 'Your Beach House photos are ready to view!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    type: 'complete'
  },
  {
    id: 3,
    message: 'Your professional edits for Mountain Retreat are complete',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    type: 'complete'
  },
  {
    id: 4,
    message: 'Your listing description for LA Luxury Condo is complete',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    type: 'complete'
  }
];

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };
  
  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const getNotificationTypeIcon = (type) => {
    switch(type) {
      case 'processing':
        return (
          <div className="bg-yellow-500/20 text-yellow-500 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        );
      case 'complete':
        return (
          <div className="bg-green-500/20 text-green-500 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-blue-500/20 text-blue-500 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
            <Bell size={20} />
          </div>
        );
    }
  };
  
  return (
    <div className="relative">
      <button 
        className="relative p-2"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell size={24} className="text-gray-300" />
        {unreadCount > 0 && (
          <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-xs">
            {unreadCount}
          </div>
        )}
      </button>
      
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-dark-lighter rounded-xl shadow-lg z-50">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                className="text-primary text-sm"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No notifications
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`p-4 border-b border-gray-700 flex ${notification.read ? 'opacity-70' : ''}`}
                >
                  {getNotificationTypeIcon(notification.type)}
                  
                  <div className="ml-3 flex-grow">
                    <p className={notification.read ? 'text-gray-400' : 'text-white'}>
                      {notification.message}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-500 text-xs">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                      
                      {!notification.read && (
                        <button 
                          className="text-primary text-xs"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-3 border-t border-gray-700">
            <button className="w-full text-center py-2 text-primary text-sm flex items-center justify-center">
              <Calendar className="w-4 h-4 mr-2" />
              View in Calendar
            </button>
          </div>
        </div>
      )}
      
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        ></div>
      )}
    </div>
  );
};

export default NotificationSystem;
