import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';
import { format } from 'date-fns';
import { useOrderStore } from '../stores/orderStore';
import Toast from 'react-native-toast-message';

const OrdersScreen = ({ navigation }) => {
  const [filter, setFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);
  const { orders, loading, fetchOrders } = useOrderStore();
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredOrders(orders);
    } else if (filter === 'pending-payment') {
      setFilteredOrders(orders.filter(order => 
        order.payment_status !== 'succeeded' && order.status === 'pending'
      ));
    } else {
      setFilteredOrders(orders.filter(order => order.status === filter));
    }
  }, [orders, filter]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchOrders();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to refresh orders',
      });
    } finally {
      setRefreshing(false);
    }
  };

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

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const renderFilterButton = (filterName: string, label: string, icon: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === filterName && { backgroundColor: colors.primary },
      ]}
      onPress={() => setFilter(filterName)}
    >
      <Icon
        name={icon}
        size={16}
        color={filter === filterName ? colors.dark : colors.text}
      />
      <Text
        style={[
          styles.filterButtonText,
          filter === filterName && { color: colors.dark },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading && orders.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Icon name="loader" size={32} color={colors.text} />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => navigation.navigate('Upload')}
        >
          <Icon name="upload" size={20} color={colors.dark} />
          <Text style={styles.uploadButtonText}>New Order</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filters}
      >
        {renderFilterButton('all', 'All Orders', 'grid')}
        {renderFilterButton('pending-payment', 'Pending Payment', 'dollar-sign')}
        {renderFilterButton('processing', 'Processing', 'clock')}
        {renderFilterButton('completed', 'Completed', 'check-circle')}
        {renderFilterButton('failed', 'Failed', 'alert-circle')}
      </ScrollView>

      {/* Orders List */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredOrders.length > 0 ? (
          <View style={styles.ordersList}>
            {filteredOrders.map((order) => (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
              >
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderId}>
                      Order #{order.tracking_number || order.id.substring(0, 8)}
                    </Text>
                    <Text style={styles.orderDate}>
                      {formatDate(order.created_at)}
                    </Text>
                  </View>
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
                  <View style={styles.photoCount}>
                    <Icon name="image" size={16} color={colors.text} />
                    <Text style={styles.photoCountText}>
                      {order.photo_count} photos
                    </Text>
                  </View>

                  <View style={styles.services}>
                    {order.services.standardEditing && (
                      <View style={styles.serviceTag}>
                        <Text style={styles.serviceText}>Standard</Text>
                      </View>
                    )}
                    {order.services.virtualStaging && (
                      <View style={styles.serviceTag}>
                        <Text style={styles.serviceText}>Virtual Staging</Text>
                      </View>
                    )}
                    {order.services.twilightConversion && (
                      <View style={styles.serviceTag}>
                        <Text style={styles.serviceText}>Twilight</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.orderFooter}>
                    <Text style={styles.totalPrice}>
                      ${order.total_price.toFixed(2)}
                    </Text>
                    <Icon name="chevron-right" size={20} color={colors.text} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Icon name="file-text" size={48} color={colors.text} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No Orders Found</Text>
            <Text style={styles.emptyDescription}>
              {filter === 'all'
                ? "You haven't placed any orders yet."
                : `No ${filter} orders found.`}
            </Text>
            {filter === 'all' && (
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('Upload')}
              >
                <Icon name="upload" size={20} color={colors.dark} />
                <Text style={styles.emptyButtonText}>Upload Photos</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text,
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: colors.dark,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  filtersContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filters: {
    padding: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  filterButtonText: {
    color: colors.text,
    marginLeft: 6,
    fontSize: 14,
  },
  ordersList: {
    padding: 12,
  },
  orderCard: {
    backgroundColor: colors.darkLight,
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
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
  orderDate: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginTop: 2,
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
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  photoCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  photoCountText: {
    color: colors.text,
    marginLeft: 8,
    fontSize: 14,
  },
  services: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  serviceTag: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  serviceText: {
    color: colors.primary,
    fontSize: 12,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: colors.dark,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default OrdersScreen;