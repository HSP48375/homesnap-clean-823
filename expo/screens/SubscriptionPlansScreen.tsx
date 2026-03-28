
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { subscribeToplan } from '../lib/subscriptionService';

const SubscriptionPlansScreen = () => {
  const navigation = useNavigation();
  const [viewMode, setViewMode] = useState<'pay-per-use' | 'subscription'>('subscription');
  
  const plans = [
    {
      id: 'starter',
      name: 'Starter Package',
      price: 49,
      photoEdits: 40,
      photoPrice: 1.22,
      savings: '19%',
      virtualStaging: 1,
      turnaround: '24-hour',
      rollover: 20,
      color: '#4B9CD3',
    },
    {
      id: 'realtor-pro',
      name: 'Realtor Pro',
      price: 99,
      photoEdits: 100,
      photoPrice: 0.99,
      savings: '34%',
      twilightConversions: 2,
      listingDescriptions: 1,
      turnaround: '16-hour',
      rollover: 50,
      color: '#6C5CE7',
      popular: true,
    },
    {
      id: 'team-basic',
      name: 'Team Basic',
      price: 249,
      photoEdits: 250,
      photoPrice: 0.99,
      savings: '34%',
      twilightConversions: 5,
      virtualStaging: 3,
      listingDescriptions: 3,
      floorplans: 3,
      turnaround: 'under 16-hour',
      teamMembers: 3,
      color: '#00B894',
    },
    {
      id: 'agency-premium',
      name: 'Agency Premium',
      price: 499,
      photoEdits: 600,
      photoPrice: 0.83,
      savings: '45%',
      twilightConversions: 10,
      virtualStaging: 8,
      listingDescriptions: 6,
      floorplans: 5,
      turnaround: '12-hour',
      teamMembers: 7,
      color: '#F39C12',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 999,
      photoEdits: 1500,
      photoPrice: 0.66,
      savings: '56%',
      twilightConversions: 'Unlimited',
      virtualStaging: 20,
      listingDescriptions: 15,
      floorplans: 10,
      turnaround: '8-10 hour',
      teamMembers: 'Unlimited',
      whiteLabel: true,
      vipManager: true,
      color: '#E74C3C',
    },
  ];

  const handleSelectPlan = (planId: string) => {
    // Call subscription service to initiate subscription
    subscribeToplan(planId)
      .then(() => {
        // Navigate to subscription confirmation or dashboard
        navigation.navigate('SubscriptionConfirmation', { planId });
      })
      .catch(error => {
        console.error('Failed to subscribe:', error);
        // Show error toast or message
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription Plans</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Choose what works for you</Text>
          <Text style={styles.introText}>
            Pay-per-use with no commitment, or save up to 56% with our monthly subscription plans.
            Switch anytime without penalty.
          </Text>
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'pay-per-use' ? styles.toggleActive : {}]}
            onPress={() => setViewMode('pay-per-use')}
          >
            <Text style={[styles.toggleText, viewMode === 'pay-per-use' ? styles.toggleTextActive : {}]}>
              Pay-Per-Use
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'subscription' ? styles.toggleActive : {}]}
            onPress={() => setViewMode('subscription')}
          >
            <Text style={[styles.toggleText, viewMode === 'subscription' ? styles.toggleTextActive : {}]}>
              Subscription Plans
            </Text>
          </TouchableOpacity>
        </View>

        {viewMode === 'pay-per-use' ? (
          <View style={styles.payPerUseContainer}>
            <Text style={styles.payPerUseTitle}>No Commitment, Pay Only When You Need</Text>
            <View style={styles.payPerUseItem}>
              <Icon name="check" size={20} color="#00EEFF" style={styles.checkIcon} />
              <Text style={styles.payPerUseText}>$1.50 per photo edit</Text>
            </View>
            <View style={styles.payPerUseItem}>
              <Icon name="check" size={20} color="#00EEFF" style={styles.checkIcon} />
              <Text style={styles.payPerUseText}>$15 per twilight conversion</Text>
            </View>
            <View style={styles.payPerUseItem}>
              <Icon name="check" size={20} color="#00EEFF" style={styles.checkIcon} />
              <Text style={styles.payPerUseText}>$25 per virtual staging</Text>
            </View>
            <View style={styles.payPerUseItem}>
              <Icon name="check" size={20} color="#00EEFF" style={styles.checkIcon} />
              <Text style={styles.payPerUseText}>$15 per listing description</Text>
            </View>
            <View style={styles.payPerUseItem}>
              <Icon name="check" size={20} color="#00EEFF" style={styles.checkIcon} />
              <Text style={styles.payPerUseText}>$99 per floorplan</Text>
            </View>
            <View style={styles.payPerUseItem}>
              <Icon name="check" size={20} color="#00EEFF" style={styles.checkIcon} />
              <Text style={styles.payPerUseText}>72-hour standard turnaround</Text>
            </View>
            <TouchableOpacity style={styles.continueButton} onPress={() => navigation.goBack()}>
              <Text style={styles.continueButtonText}>Continue with Pay-Per-Use</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.subscriptionPlansContainer}>
            {plans.map((plan) => (
              <View 
                key={plan.id} 
                style={[
                  styles.planCard, 
                  { borderColor: plan.color },
                  plan.popular ? styles.popularPlan : {}
                ]}
              >
                {plan.popular && (
                  <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
                    <Text style={styles.popularBadgeText}>Most Popular</Text>
                  </View>
                )}
                <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.dollarSign}>$</Text>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.monthLabel}>/month</Text>
                </View>
                
                <View style={styles.savingsContainer}>
                  <Text style={styles.savingsText}>
                    ${plan.photoPrice}/photo ({plan.savings} savings)
                  </Text>
                </View>
                
                <View style={styles.featuresContainer}>
                  <View style={styles.featureItem}>
                    <Icon name="check-circle" size={18} color={plan.color} style={styles.featureIcon} />
                    <Text style={styles.featureText}>{plan.photoEdits} photo edits per month</Text>
                  </View>
                  
                  {plan.twilightConversions && (
                    <View style={styles.featureItem}>
                      <Icon name="check-circle" size={18} color={plan.color} style={styles.featureIcon} />
                      <Text style={styles.featureText}>
                        {plan.twilightConversions} {typeof plan.twilightConversions === 'number' ? 'free' : ''} twilight conversions
                      </Text>
                    </View>
                  )}
                  
                  {plan.virtualStaging && (
                    <View style={styles.featureItem}>
                      <Icon name="check-circle" size={18} color={plan.color} style={styles.featureIcon} />
                      <Text style={styles.featureText}>{plan.virtualStaging} free virtual staging</Text>
                    </View>
                  )}
                  
                  {plan.listingDescriptions && (
                    <View style={styles.featureItem}>
                      <Icon name="check-circle" size={18} color={plan.color} style={styles.featureIcon} />
                      <Text style={styles.featureText}>{plan.listingDescriptions} free listing descriptions</Text>
                    </View>
                  )}
                  
                  {plan.floorplans && (
                    <View style={styles.featureItem}>
                      <Icon name="check-circle" size={18} color={plan.color} style={styles.featureIcon} />
                      <Text style={styles.featureText}>{plan.floorplans} free floorplans per month</Text>
                    </View>
                  )}
                  
                  <View style={styles.featureItem}>
                    <Icon name="check-circle" size={18} color={plan.color} style={styles.featureIcon} />
                    <Text style={styles.featureText}>{plan.turnaround} turnaround</Text>
                  </View>
                  
                  {plan.rollover && (
                    <View style={styles.featureItem}>
                      <Icon name="check-circle" size={18} color={plan.color} style={styles.featureIcon} />
                      <Text style={styles.featureText}>Unused edits roll over (max {plan.rollover})</Text>
                    </View>
                  )}
                  
                  {plan.teamMembers && (
                    <View style={styles.featureItem}>
                      <Icon name="check-circle" size={18} color={plan.color} style={styles.featureIcon} />
                      <Text style={styles.featureText}>
                        Shared across {plan.teamMembers} {typeof plan.teamMembers === 'number' ? 'team members' : ' team members'}
                      </Text>
                    </View>
                  )}
                  
                  {plan.whiteLabel && (
                    <View style={styles.featureItem}>
                      <Icon name="check-circle" size={18} color={plan.color} style={styles.featureIcon} />
                      <Text style={styles.featureText}>White-label branding options available</Text>
                    </View>
                  )}
                  
                  {plan.vipManager && (
                    <View style={styles.featureItem}>
                      <Icon name="check-circle" size={18} color={plan.color} style={styles.featureIcon} />
                      <Text style={styles.featureText}>VIP account manager access</Text>
                    </View>
                  )}
                </View>
                
                <TouchableOpacity
                  style={[styles.selectPlanButton, { backgroundColor: plan.color }]}
                  onPress={() => handleSelectPlan(plan.id)}
                >
                  <Text style={styles.selectPlanButtonText}>Select Plan</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.noteSection}>
          <Text style={styles.noteText}>
            All plans can be canceled anytime. Any unused credits on your account will remain available until used or expired.
          </Text>
        </View>
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
  introSection: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  introText: {
    fontSize: 16,
    color: '#CCC',
    lineHeight: 22,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleActive: {
    backgroundColor: '#00EEFF',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  toggleTextActive: {
    color: '#0A0A14',
  },
  payPerUseContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  payPerUseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
  },
  payPerUseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkIcon: {
    marginRight: 10,
  },
  payPerUseText: {
    fontSize: 16,
    color: '#FFF',
  },
  continueButton: {
    backgroundColor: '#00EEFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A0A14',
  },
  subscriptionPlansContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  planCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 20,
    padding: 20,
    borderWidth: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  popularPlan: {
    borderWidth: 2,
    paddingTop: 35,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 6,
    alignItems: 'center',
  },
  popularBadgeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  dollarSign: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
  },
  monthLabel: {
    fontSize: 16,
    color: '#CCC',
    marginBottom: 6,
    marginLeft: 2,
  },
  savingsContainer: {
    backgroundColor: 'rgba(0, 238, 255, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  savingsText: {
    color: '#00EEFF',
    fontWeight: '600',
    fontSize: 14,
  },
  featuresContainer: {
    marginTop: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 10,
  },
  featureText: {
    fontSize: 15,
    color: '#FFF',
    flex: 1,
  },
  selectPlanButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  selectPlanButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  noteSection: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 30,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#CCC',
    textAlign: 'center',
  },
});

export default SubscriptionPlansScreen;
