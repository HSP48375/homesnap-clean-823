import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';
import { Bell } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createTestNotification } from '../../lib/notifications';

const TestNotification: React.FC = () => {
  const { user } = useAuthStore();
  const { fetchNotifications } = useNotificationStore();
  const [loading, setLoading] = useState(false);

  const handleCreateTestNotification = async () => {
    if (!user) {
      toast.error('You must be logged in to create a test notification');
      return;
    }

    setLoading(true);
    try {
      const success = await createTestNotification(user.id);
      if (success) {
        // Refresh notifications to show the new one
        await fetchNotifications();
      }
    } catch (error: any) {
      console.error('Error creating test notification:', error);
      toast.error(error.message || 'Failed to create test notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-4">Test Notifications</h2>
      <p className="text-white/70 mb-6">
        Click the button below to create a test notification. Then check the notification bell in the navbar.
      </p>
      
      <button
        onClick={handleCreateTestNotification}
        disabled={loading}
        className="btn btn-primary w-full flex items-center justify-center"
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating...
          </span>
        ) : (
          <span className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Create Test Notification
          </span>
        )}
      </button>
      
      <div className="mt-6 p-4 bg-dark-lighter rounded-lg">
        <h3 className="font-medium mb-2">How It Works</h3>
        <p className="text-white/70 text-sm">
          The test notification creates an entry in the database that appears in the notification center.
          This helps you verify that the notification system is working correctly.
        </p>
      </div>
    </div>
  );
};

export default TestNotification;