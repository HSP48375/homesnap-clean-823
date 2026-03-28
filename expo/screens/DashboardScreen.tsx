import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';
import { useAuthStore } from '../stores/authStore';
import { format } from 'date-fns';
import { hasActiveSubscription, getRemainingCredits } from '../lib/subscriptionService';

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuthStore();
  const [hasSubscription, setHasSubscription] = useState(false);
  const [subscriptionCredits, setSubscriptionCredits] = useState(null);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    // Check if user has active subscription
    hasActiveSubscription()
      .then(result => {
        setHasSubscription(result);
        if (result) {
          // If they have a subscription, get their remaining credits
          return getRemainingCredits();
        }
        return null;
      })
      .then(credits => {
        if (credits) {
          setSubscriptionCredits(credits);
        }
      })
      .catch(error => {
        console.error('Failed to load subscription data:', error);
      });

    // Get order count for non-subscribers to determine if they're high-volume users
    // This would come from your orders API
    // For now, just setting a mock value for demonstration
    setOrderCount(25);
  }, []);

  const stats = {
    totalOrders: 12,
    completedOrders: 8,
    processingOrders: 4,
    totalSpent: 249.99,
  };

  const recentOrders = [
    {
      id: '1',
      status: 'completed',
      photos: 5,
      date: new Date(),
      total: 44.95,
    },
    {
      id: '2',
      status: 'processing',
      photos: 3,
      date: new Date(),
      total: 26.97,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.neonGreen;
      case 'processing':
        return colors.secondary;
      case 'failed':
        return '#FF4444';
      default:
        return colors.text;
    }
  };

  const formatDate = (date: Date) => {
    return format(date, 'MMM d, yyyy');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Welcome Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.user_metadata?.full_name || 'User'}</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => {/* Handle notifications */}}
          >
            <Icon name="bell" size={24} color={colors.text} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>2</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Subscription promotion for high-volume users */}
        {!hasSubscription && orderCount >= 20 && (
          <TouchableOpacity 
            style={styles.subscriptionPromoBanner}
            onPress={() => navigation.navigate('SubscriptionPlans')}
          >
            <View style={styles.promoIconContainer}>
              <Icon name="star" size={20} color="#FFF" />
            </View>
            <View style={styles.promoTextContainer}>
              <Text style={styles.promoTitle}>You're a power user!</Text>
              <Text style={styles.promoText}>
                Save up to 56% with our subscription plans
              </Text>
            </View>
            <Icon name="chevron-right" size={20} color="#00EEFF" />
          </TouchableOpacity>
        )}

        {/* Subscription credits display for subscribers */}
        {hasSubscription && subscriptionCredits && (
          <View style={styles.creditsContainer}>
            <View style={styles.creditsHeader}>
              <Text style={styles.creditsTitle}>Your Subscription Credits</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ProfileSubscriptions')}>
                <Text style={styles.manageText}>Manage</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.creditsGrid}>
              <View style={styles.creditItem}>
                <Text style={styles.creditValue}>{subscriptionCredits.photoEdits}</Text>
                <Text style={styles.creditLabel}>Photo Edits</Text>
              </View>

              {subscriptionCredits.twilightConversions !== undefined && (
                <View style={styles.creditItem}>
                  <Text style={styles.creditValue}>
                    {subscriptionCredits.twilightConversions === 'Unlimited' ? '∞' : subscriptionCredits.twilightConversions}
                  </Text>
                  <Text style={styles.creditLabel}>Twilight</Text>
                </View>
              )}

              {subscriptionCredits.virtualStaging !== undefined && subscriptionCredits.virtualStaging > 0 && (
                <View style={styles.creditItem}>
                  <Text style={styles.creditValue}>{subscriptionCredits.virtualStaging}</Text>
                  <Text style={styles.creditLabel}>Staging</Text>
                </View>
              )}

              {subscriptionCredits.floorplans !== undefined && subscriptionCredits.floorplans > 0 && (
                <View style={styles.creditItem}>
                  <Text style={styles.creditValue}>{subscriptionCredits.floorplans}</Text>
                  <Text style={styles.creditLabel}>Floorplans</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.primary + '20' }]}>
            <Icon name="file-text" size={24} color={colors.primary} />
            <Text style={styles.statValue}>{stats.totalOrders}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.neonGreen + '20' }]}>
            <Icon name="check-circle" size={24} color={colors.neonGreen} />
            <Text style={styles.statValue}>{stats.completedOrders}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.secondary + '20' }]}>
            <Icon name="clock" size={24} color={colors.secondary} />
            <Text style={styles.statValue}>{stats.processingOrders}</Text>
            <Text style={styles.statLabel}>Processing</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.neonPurple + '20' }]}>
            <Icon name="dollar-sign" size={24} color={colors.neonPurple} />
            <Text style={styles.statValue}>${stats.totalSpent}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Upload')}
            >
              <Icon name="upload" size={24} color={colors.primary} />
              <Text style={styles.actionText}>Upload Photos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Orders')}
            >
              <Icon name="file-text" size={24} color={colors.primary} />
              <Text style={styles.actionText}>View Orders</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentOrders.map(order => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => {/* Navigate to order details */}}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{order.id}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(order.status) + '20' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(order.status) }
                  ]}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.orderDetails}>
                <View style={styles.orderInfo}>
                  <Icon name="image" size={16} color={colors.text} />
                  <Text style={styles.orderInfoText}>{order.photos} photos</Text>
                </View>
                <View style={styles.orderInfo}>
                  <Icon name="calendar" size={16} color={colors.text} />
                  <Text style={styles.orderInfoText}>{formatDate(order.date)}</Text>
                </View>
                <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photography Tips</Text>
          <TouchableOpacity
            style={styles.tipCard}
            onPress={() => {/* Navigate to tutorials */}}
          >
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c' }}
              style={styles.tipImage}
            />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Mastering Natural Light</Text>
              <Text style={styles.tipDescription}>
                Learn how to use natural light to enhance your property photos
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.8,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: colors.dark,
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statCard: {
    width: '48%',
    margin: '1%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.8,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  seeAllText: {
    color: colors.primary,
    fontSize: 14,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.darkLight,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  actionText: {
    color: colors.text,
    marginTop: 8,
    fontSize: 14,
  },
  orderCard: {
    backgroundColor: colors.darkLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderInfoText: {
    color: colors.text,
    opacity: 0.8,
    marginLeft: 6,
    fontSize: 14,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  tipCard: {
    backgroundColor: colors.darkLight,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tipImage: {
    width: '100%',
    height: 150,
  },
  tipContent: {
    padding: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.8,
  },
  subscriptionPromoBanner: {
    backgroundColor: 'rgba(0, 238, 255, 0.1)',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  promoTextContainer: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  promoText: {
    fontSize: 14,
    color: '#CCC',
  },
  creditsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
  },
  creditsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  creditsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  manageText: {
    fontSize: 14,
    color: '#00EEFF',
    fontWeight: '600',
  },
  creditsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  creditItem: {
    width: '22%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  creditValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00EEFF',
    marginBottom: 4,
  },
  creditLabel: {
    fontSize: 12,
    color: '#CCC',
    textAlign: 'center',
  },
});

export default DashboardScreen;