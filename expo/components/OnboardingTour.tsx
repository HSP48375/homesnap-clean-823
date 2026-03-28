
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

type TourStep = {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  hasAction?: boolean;
  actionText?: string;
  onAction?: () => void;
};

interface OnboardingTourProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ isVisible, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [target, setTarget] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const spotlightAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  // Define all tour steps
  const tourSteps: TourStep[] = [
    {
      id: 'dashboard',
      title: 'Welcome to HomeSnap Pro!',
      description: 'Let\'s take a quick tour of your dashboard. This is where you can see your recent orders and access all features.',
      target: 'dashboard-overview',
      position: 'center',
    },
    {
      id: 'camera-tools',
      title: 'Professional Camera Tools',
      description: 'Our app includes advanced camera features like AEB (Auto Exposure Bracketing), wide-angle correction, and leveling tools.',
      target: 'camera-button',
      position: 'bottom',
      hasAction: true,
      actionText: 'Try Camera',
      onAction: () => navigation.navigate('Upload'),
    },
    {
      id: 'pip-assistant',
      title: 'Meet Your AI Assistant',
      description: 'Your personal assistant is always ready to help. Ask questions or get suggestions while you work.',
      target: 'chat-interface',
      position: 'top',
    },
    {
      id: 'job-submission',
      title: 'Easy Job Submission',
      description: 'Create job folders and upload photos with just a few taps. Your photos will be organized for easy access.',
      target: 'upload-button',
      position: 'bottom',
    },
    {
      id: 'smart-suggestions',
      title: 'Smart Suggestions',
      description: 'Our AI analyzes your photos and suggests the perfect edits based on your property type and lighting conditions.',
      target: 'suggestions-area',
      position: 'left',
    },
    {
      id: 'tutorials',
      title: 'Learn As You Go',
      description: 'Access tutorials anytime to improve your photography skills or learn more about our editing options.',
      target: 'tutorials-link',
      position: 'right',
    },
    {
      id: 'checkout',
      title: 'Simple Checkout Process',
      description: 'Easily pay for your edits and apply discount codes for special offers.',
      target: 'checkout-area',
      position: 'bottom',
    }
  ];

  useEffect(() => {
    if (isVisible) {
      loadCompletedSteps();
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && target) {
      Animated.sequence([
        Animated.timing(spotlightAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false
        }),
        Animated.timing(spotlightAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false
        })
      ]).start();
    }
  }, [currentStep, target, isVisible]);

  const loadCompletedSteps = async () => {
    try {
      const savedSteps = await AsyncStorage.getItem('completedTourSteps');
      if (savedSteps) {
        const parsed = JSON.parse(savedSteps);
        setCompletedSteps(parsed);
        
        // Find the first uncompleted step
        const allStepIds = tourSteps.map(step => step.id);
        const firstUncompletedIndex = allStepIds.findIndex(id => !parsed.includes(id));
        
        if (firstUncompletedIndex !== -1) {
          setCurrentStep(firstUncompletedIndex);
        }
      }
    } catch (error) {
      console.error('Error loading completed tour steps:', error);
    }
  };

  const saveCompletedStep = async (stepId: string) => {
    try {
      if (!completedSteps.includes(stepId)) {
        const updatedSteps = [...completedSteps, stepId];
        setCompletedSteps(updatedSteps);
        await AsyncStorage.setItem('completedTourSteps', JSON.stringify(updatedSteps));
      }
    } catch (error) {
      console.error('Error saving completed tour step:', error);
    }
  };

  const findTargetElement = () => {
    const currentTargetId = tourSteps[currentStep]?.target;
    if (!currentTargetId) return;

    setTimeout(() => {
      if (Platform.OS === 'web') {
        const element = document.getElementById(currentTargetId);
        if (element) {
          const rect = element.getBoundingClientRect();
          setTarget({
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height
          });
        } else {
          // If element not found, use center position
          setTarget({
            x: width / 2 - 150,
            y: height / 2 - 100,
            width: 300,
            height: 200
          });
        }
      } else {
        // For native, you would use findNodeHandle and measure
        // For this example, we'll just use a default position
        setTarget({
          x: width / 2 - 150,
          y: height / 2 - 100,
          width: 300,
          height: 200
        });
      }
    }, 100);
  };

  useEffect(() => {
    if (isVisible) {
      findTargetElement();
    }
  }, [currentStep, isVisible]);

  const handleNext = () => {
    const currentStepId = tourSteps[currentStep]?.id;
    if (currentStepId) {
      saveCompletedStep(currentStepId);
    }
    
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prevStep => prevStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  const handleAction = () => {
    const step = tourSteps[currentStep];
    if (step?.hasAction && step.onAction) {
      step.onAction();
    }
  };

  if (!isVisible || !target) return null;

  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  // Calculate tooltip position based on target and specified position
  const getTooltipPosition = () => {
    const margin = 20;
    const tooltipWidth = 300;
    const tooltipHeight = 200;
    
    switch (step.position) {
      case 'top':
        return {
          top: target.y - tooltipHeight - margin,
          left: target.x + (target.width / 2) - (tooltipWidth / 2)
        };
      case 'bottom':
        return {
          top: target.y + target.height + margin,
          left: target.x + (target.width / 2) - (tooltipWidth / 2)
        };
      case 'left':
        return {
          top: target.y + (target.height / 2) - (tooltipHeight / 2),
          left: target.x - tooltipWidth - margin
        };
      case 'right':
        return {
          top: target.y + (target.height / 2) - (tooltipHeight / 2),
          left: target.x + target.width + margin
        };
      case 'center':
      default:
        return {
          top: height / 2 - tooltipHeight / 2,
          left: width / 2 - tooltipWidth / 2
        };
    }
  };

  const tooltipPosition = getTooltipPosition();

  return (
    <Animated.View style={[styles.container, { opacity: opacityAnim }]}>
      {/* Blurred background with spotlight effect */}
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.spotlight,
            {
              top: target.y,
              left: target.x,
              width: target.width,
              height: target.height,
              borderRadius: spotlightAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 10]
              }),
              opacity: spotlightAnim
            }
          ]}
        />
      </View>

      {/* Tooltip */}
      <View style={[styles.tooltip, tooltipPosition]}>
        <Text style={styles.tooltipTitle}>{step.title}</Text>
        <Text style={styles.tooltipDescription}>{step.description}</Text>
        
        {step.hasAction && (
          <TouchableOpacity style={styles.actionButton} onPress={handleAction}>
            <Text style={styles.actionButtonText}>{step.actionText}</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.tooltipFooter}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip Tour</Text>
          </TouchableOpacity>
          
          <View style={styles.progressContainer}>
            {tourSteps.map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.progressDot,
                  index === currentStep ? styles.progressDotActive : null
                ]}
              />
            ))}
          </View>
          
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentStep < tourSteps.length - 1 ? 'Next' : 'Finish'}
            </Text>
            <Icon name="arrow-right" size={16} color="#FFFFFF" style={styles.nextButtonIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  spotlight: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#00EEFF',
    shadowColor: '#00EEFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  tooltip: {
    position: 'absolute',
    width: 300,
    backgroundColor: 'rgba(20, 20, 30, 0.95)',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tooltipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  tooltipDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: 'rgba(0, 238, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 238, 255, 0.5)',
  },
  actionButtonText: {
    color: '#00EEFF',
    fontSize: 14,
    fontWeight: '500',
  },
  tooltipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 3,
  },
  progressDotActive: {
    backgroundColor: '#00EEFF',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  skipButton: {
    padding: 5,
  },
  skipButtonText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 238, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 238, 255, 0.5)',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 5,
  },
  nextButtonIcon: {
    marginLeft: 4,
  }
});

export default OnboardingTour;
