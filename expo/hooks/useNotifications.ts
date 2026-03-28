
import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { notificationStore } from '../stores/notificationStore';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationHookOptions {
  onNotificationReceived?: (notification: Notifications.Notification) => void;
  onNotificationResponse?: (response: Notifications.NotificationResponse) => void;
}

export function useNotifications(options?: NotificationHookOptions) {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const appState = useRef(AppState.currentState);
  const navigation = useNavigation();
  const soundRef = useRef<Audio.Sound | null>(null);
  
  // Get notification preferences
  const { preferences, fetchPreferences, registerForPushNotifications } = notificationStore(state => ({
    preferences: state.preferences,
    fetchPreferences: state.fetchPreferences,
    registerForPushNotifications: state.registerForPushNotifications,
  }));
  
  // Register for push notifications when the component mounts
  useEffect(() => {
    registerForToken();
    
    // Load notification preferences
    fetchPreferences();
    
    return () => {
      cleanupListeners();
    };
  }, []);
  
  // Set up notification listeners
  useEffect(() => {
    // Handle received notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      
      if (options?.onNotificationReceived) {
        options.onNotificationReceived(notification);
      }
      
      // Play custom notification sound if configured
      playNotificationSound();
    });
    
    // Handle notification responses
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const { notification } = response;
      
      if (options?.onNotificationResponse) {
        options.onNotificationResponse(response);
      } else {
        // Default handling: navigate to the deep link if available
        const data = notification.request.content.data;
        
        if (data?.deep_link) {
          navigation.navigate(data.deep_link);
        }
      }
    });
    
    // Listen for app state changes to update badge counts
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      cleanupListeners();
      subscription.remove();
    };
  }, [preferences]);
  
  // Handle app state changes
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    // When app comes to foreground, reset badge count and fetch updated notifications
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      Notifications.setBadgeCountAsync(0);
      notificationStore.getState().fetchNotifications();
    }
    
    appState.current = nextAppState;
  };
  
  // Register for push notifications
  const registerForToken = async () => {
    const token = await registerForPushNotifications();
    setExpoPushToken(token);
  };
  
  // Clean up notification listeners
  const cleanupListeners = () => {
    if (notificationListener.current) {
      Notifications.removeNotificationSubscription(notificationListener.current);
    }
    
    if (responseListener.current) {
      Notifications.removeNotificationSubscription(responseListener.current);
    }
    
    if (soundRef.current) {
      soundRef.current.unloadAsync();
    }
  };
  
  // Play custom notification sound
  const playNotificationSound = async () => {
    try {
      // Only play sound if not in silent mode
      if (preferences?.silent_mode) {
        const now = new Date();
        const start = new Date(preferences.silent_start);
        const end = new Date(preferences.silent_end);
        
        // Check if current time is within silent hours
        if (now >= start && now <= end) {
          return;
        }
      }
      
      // Select sound based on preferences
      let soundFile;
      
      switch (preferences?.custom_sound) {
        case 'chime':
          soundFile = require('../assets/sounds/chime.mp3');
          break;
        case 'bell':
          soundFile = require('../assets/sounds/bell.mp3');
          break;
        case 'digital':
          soundFile = require('../assets/sounds/digital.mp3');
          break;
        case 'subtle':
          soundFile = require('../assets/sounds/subtle.mp3');
          break;
        case 'none':
          return;
        case 'default':
        default:
          soundFile = require('../assets/sounds/default.mp3');
      }
      
      // Unload previous sound if exists
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      
      // Load and play the sound
      const { sound } = await Audio.Sound.createAsync(soundFile);
      soundRef.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };
  
  // Send a local notification
  const sendLocalNotification = async (
    title: string,
    body: string,
    data: Record<string, any> = {}
  ) => {
    // Check if this type of notification should be shown
    if (data.type && !notificationStore.getState().shouldShowNotification(data.type)) {
      return;
    }
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
      },
      trigger: null,
    });
  };
  
  return {
    expoPushToken,
    notification,
    sendLocalNotification,
  };
}
