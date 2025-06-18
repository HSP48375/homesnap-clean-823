
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getPlanDetails } from '../lib/subscriptionService';

const SubscriptionConfirmationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { planId } = route.params as { planId: string };
  
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<any>(null);
  
  useEffect(() => {
    // Fetch plan details
    getPlanDetails(planId)
      .then(planData => {
        setPlan(planData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load plan details:', error);
        setLoading(false);
      });
  }, [planId]);
  
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00EEFF" />
          <Text style={styles.loadingText}>Finalizing your subscription...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (!plan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={60} color="#FF4A4A" />
          <Text style={styles.errorText}>Something went wrong</Text>
          <TouchableOpacity 
            style={styles.tryAgainButton}
            onPress={() => navigation.navigate('SubscriptionPlans')}
          >
            <Text style={styles.tryAgainButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs')} style={styles.closeButton}>
          <Icon name="x" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.successIcon}>
          <Icon name="check-circle" size={80} color="#00EEFF" />
        </View>
        
        <Text style={styles.successTitle}>Subscription Activated!</Text>
        <Text style={styles.successMessage}>
          Your {plan.name} plan is now active. Your billing cycle starts today.
        </Text>
        
        <View style={styles.planSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Plan:</Text>
            <Text style={styles.summaryValue}>{plan.name}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Monthly Fee:</Text>
            <Text style={styles.summaryValue}>${plan.price}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Photo Credits:</Text>
            <Text style={styles.summaryValue}>{plan.photoEdits} edits</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Next Billing Date:</Text>
            <Text style={styles.summaryValue}>
              {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </Text>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('MainTabs')}
          >
            <Text style={styles.primaryButtonText}>Go to Dashboard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('ProfileSubscriptions')}
          >
            <Text style={styles.secondaryButtonText}>Manage Subscription</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A14',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  tryAgainButton: {
    backgroundColor: '#00EEFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  tryAgainButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A0A14',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#CCC',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  planSummary: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#AAA',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  actionsContainer: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#00EEFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A0A14',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default SubscriptionConfirmationScreen;
