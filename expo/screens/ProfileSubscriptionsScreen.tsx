
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { getCurrentSubscription, cancelSubscription, getRemainingCredits } from '../lib/subscriptionService';

const ProfileSubscriptionsScreen = () => {
  const navigation = useNavigation();
  const [subscription, setSubscription] = useState<any>(null);
  const [credits, setCredits] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    Promise.all([
      getCurrentSubscription(),
      getRemainingCredits()
    ])
      .then(([subData, creditsData]) => {
        setSubscription(subData);
        setCredits(creditsData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load subscription data:', error);
        setLoading(false);
      });
  }, []);
  
  const handleCancelSubscription = () => {
    Alert.alert(
      "Cancel Subscription",
      "Are you sure you want to cancel your subscription? You'll still have access to your plan until the end of the current billing period.",
      [
        {
          text: "No, Keep It",
          style: "cancel"
        },
        { 
          text: "Yes, Cancel", 
          style: "destructive",
          onPress: () => {
            setLoading(true);
            cancelSubscription()
              .then(() => {
                setSubscription(null);
                setLoading(false);
                Alert.alert(
                  "Subscription Cancelled",
                  "Your subscription has been cancelled. You can still use your remaining credits until the end of the billing period."
                );
              })
              .catch(error => {
                console.error('Failed to cancel subscription:', error);
                setLoading(false);
                Alert.alert(
                  "Error",
                  "Failed to cancel subscription. Please try again or contact support."
                );
              });
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Subscription</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading subscription details...</Text>
          </View>
        ) : !subscription ? (
          <View style={styles.noSubscriptionContainer}>
            <Icon name="package" size={60} color="#AAA" />
            <Text style={styles.noSubscriptionTitle}>No Active Subscription</Text>
            <Text style={styles.noSubscriptionText}>
              You're currently using our pay-per-use system. Subscribe to a plan to save on your regular photo editing needs.
            </Text>
            <TouchableOpacity
              style={styles.viewPlansButton}
              onPress={() => navigation.navigate('SubscriptionPlans')}
            >
              <Text style={styles.viewPlansButtonText}>View Subscription Plans</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.subscriptionCard}>
              <View style={styles.subscriptionHeader}>
                <View>
                  <Text style={styles.planName}>{subscription.name}</Text>
                  <Text style={styles.planPrice}>${subscription.price}/month</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: '#4BB543' }]}>
                  <Text style={styles.statusText}>Active</Text>
                </View>
              </View>
              
              <View style={styles.billingInfo}>
                <Text style={styles.billingLabel}>Next billing date:</Text>
                <Text style={styles.billingValue}>{subscription.nextBillingDate}</Text>
              </View>
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelSubscription}
              >
                <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.creditsSection}>
              <Text style={styles.sectionTitle}>Remaining Credits</Text>
              
              <View style={styles.creditsGrid}>
                <View style={styles.creditItem}>
                  <View style={styles.creditCircle}>
                    <Text style={styles.creditNumber}>{credits.photoEdits}</Text>
                  </View>
                  <Text style={styles.creditLabel}>Photo Edits</Text>
                </View>
                
                {credits.twilightConversions !== undefined && (
                  <View style={styles.creditItem}>
                    <View style={styles.creditCircle}>
                      <Text style={styles.creditNumber}>
                        {typeof credits.twilightConversions === 'number' 
                          ? credits.twilightConversions 
                          : '∞'}
                      </Text>
                    </View>
                    <Text style={styles.creditLabel}>Twilight</Text>
                  </View>
                )}
                
                {credits.virtualStaging !== undefined && (
                  <View style={styles.creditItem}>
                    <View style={styles.creditCircle}>
                      <Text style={styles.creditNumber}>{credits.virtualStaging}</Text>
                    </View>
                    <Text style={styles.creditLabel}>Staging</Text>
                  </View>
                )}
                
                {credits.listingDescriptions !== undefined && (
                  <View style={styles.creditItem}>
                    <View style={styles.creditCircle}>
                      <Text style={styles.creditNumber}>{credits.listingDescriptions}</Text>
                    </View>
                    <Text style={styles.creditLabel}>Descriptions</Text>
                  </View>
                )}
                
                {credits.floorplans !== undefined && (
                  <View style={styles.creditItem}>
                    <View style={styles.creditCircle}>
                      <Text style={styles.creditNumber}>{credits.floorplans}</Text>
                    </View>
                    <Text style={styles.creditLabel}>Floorplans</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.refreshNote}>
                Credits refresh on your billing date: {subscription.nextBillingDate}
              </Text>
            </View>
            
            {subscription.teamMembers && (
              <View style={styles.teamSection}>
                <Text style={styles.sectionTitle}>Team Management</Text>
                <Text style={styles.teamDescription}>
                  Your plan allows you to share credits with up to {subscription.teamMembers} team members.
                </Text>
                <TouchableOpacity
                  style={styles.manageTeamButton}
                  onPress={() => navigation.navigate('TeamManagement')}
                >
                  <Text style={styles.manageTeamButtonText}>Manage Team Members</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <View style={styles.changePlanSection}>
              <Text style={styles.sectionTitle}>Looking for a Different Plan?</Text>
              <TouchableOpacity
                style={styles.changePlanButton}
                onPress={() => navigation.navigate('SubscriptionPlans')}
              >
                <Text style={styles.changePlanButtonText}>View All Plans</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.paymentHistorySection}>
              <Text style={styles.sectionTitle}>Payment History</Text>
              {subscription.paymentHistory?.map((payment, index) => (
                <View key={index} style={styles.paymentItem}>
                  <View>
                    <Text style={styles.paymentDate}>{payment.date}</Text>
                    <Text style={styles.paymentDesc}>{payment.description}</Text>
                  </View>
                  <Text style={styles.paymentAmount}>${payment.amount}</Text>
                </View>
              ))}
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => navigation.navigate('PaymentHistory')}
              >
                <Text style={styles.viewAllButtonText}>View All Payments</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#CCC',
    fontSize: 16,
  },
  noSubscriptionContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noSubscriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 16,
    marginBottom: 8,
  },
  noSubscriptionText: {
    fontSize: 16,
    color: '#CCC',
    textAlign: 'center',
    marginBottom: 24,
  },
  viewPlansButton: {
    backgroundColor: '#00EEFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  viewPlansButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A0A14',
  },
  subscriptionCard: {
    margin: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 16,
    color: '#CCC',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  billingInfo: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  billingLabel: {
    fontSize: 16,
    color: '#AAA',
    marginRight: 8,
  },
  billingValue: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  creditsSection: {
    margin: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
  },
  creditsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  creditItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  creditCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0, 238, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  creditNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00EEFF',
  },
  creditLabel: {
    fontSize: 14,
    color: '#CCC',
    textAlign: 'center',
  },
  refreshNote: {
    fontSize: 14,
    color: '#AAA',
    textAlign: 'center',
    marginTop: 8,
  },
  teamSection: {
    margin: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
  },
  teamDescription: {
    fontSize: 16,
    color: '#CCC',
    marginBottom: 16,
  },
  manageTeamButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  manageTeamButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  changePlanSection: {
    margin: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
  },
  changePlanButton: {
    backgroundColor: '#00EEFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  changePlanButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A0A14',
  },
  paymentHistorySection: {
    margin: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  paymentDate: {
    fontSize: 14,
    color: '#AAA',
    marginBottom: 2,
  },
  paymentDesc: {
    fontSize: 16,
    color: '#FFF',
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  viewAllButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  viewAllButtonText: {
    fontSize: 16,
    color: '#00EEFF',
    fontWeight: '600',
  },
});

export default ProfileSubscriptionsScreen;
