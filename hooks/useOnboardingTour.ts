
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useOnboardingTour = () => {
  const [isFirstVisit, setIsFirstVisit] = useState<boolean | null>(null);
  const [isTourVisible, setIsTourVisible] = useState(false);

  useEffect(() => {
    checkFirstVisit();
  }, []);

  const checkFirstVisit = async () => {
    try {
      const hasVisited = await AsyncStorage.getItem('hasVisitedBefore');
      
      if (hasVisited === null) {
        // First time user
        setIsFirstVisit(true);
        setIsTourVisible(true);
        await AsyncStorage.setItem('hasVisitedBefore', 'true');
      } else {
        setIsFirstVisit(false);
      }
    } catch (error) {
      console.error('Error checking first visit:', error);
      setIsFirstVisit(false);
    }
  };

  const startTour = () => {
    setIsTourVisible(true);
  };

  const endTour = () => {
    setIsTourVisible(false);
  };

  const resetTour = async () => {
    try {
      await AsyncStorage.removeItem('completedTourSteps');
      setIsTourVisible(true);
    } catch (error) {
      console.error('Error resetting tour:', error);
    }
  };

  return {
    isFirstVisit,
    isTourVisible,
    startTour,
    endTour,
    resetTour
  };
};
