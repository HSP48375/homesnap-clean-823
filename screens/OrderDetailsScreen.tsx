import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';
import { useOrderStore } from '../stores/orderStore';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';

const OrderDetailsScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchOrderDetails } = useOrderStore();

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      const orderData = await fetchOrderDetails(orderId);
      if (orderData) {
        setOrder(orderData);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Order not found',
        });
        navigation.goBack();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load order details',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
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

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  const handleDownload = () => {
    // Implement download functionality
    Alert.alert('Download', 'Photos will be downloaded to your device');
  };

  if (loading || !order) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Icon name="loader" size={32} color={colors.text} />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <View>
            <Text style={styles.orderId}>
              Order #{order.tracking_number || order.id.substring(0, 8)}
            </Text>
            <Text style={styles.orderDate}>{formatDate(order.created_at)}</Text>
          </View>
        </View>

        {/* Status Card */}
        <View style={styles.card}>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(order.status) + '20' }
            ]}>
              <Icon
                name={
                  order.status === 'completed'
                    ? 'check-circle'
                    : order.status === 'processing'
                    ? 'clock'
                    : 'alert-circle'
                }
                size={24}
                color={getStatusColor(order.status)}
              />
              <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Text>
            </View>
            {order.status === 'processing' && order.estimated_completion_time && (
              <Text style={styles.estimatedTime}>
                Estimated completion: {formatDate(order.estimated_completion_time)}
              </Text>
            )}
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Photos</Text>
            <Text style={styles.detailValue}>{order.photo_count}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Services</Text>
            <View style={styles.servicesList}>
              {order.services.standardEditing && (
                <View style={styles.serviceTag}>
                  <Text style={styles.serviceText}>Standard Editing</Text>
                </View>
              )}
              {order.services.virtualStaging && (
                <View style={styles.serviceTag}>
                  <Text style={styles.serviceText}>Virtual Staging</Text>
                </View>
              )}
              {order.services.twilightConversion && (
                <View style={styles.serviceTag}>
                  <Text style={styles.serviceText}>Twilight Conversion</Text>
                </View>
              )}
              {order.services.decluttering && (
                <View style={styles.serviceTag}>
                  <Text style={styles.serviceText}>Decluttering</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total</Text>
            <Text style={styles.totalPrice}>${order.total_price.toFixed(2)}</Text>
          </View>
        </View>

        {/* Photos */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Photos</Text>
          <View style={styles.photoGrid}>
            {order.photos?.map((photo) => (
              <View key={photo.id} style={styles.photoContainer}>
                <Image
                  source={{ uri: photo.storage_path }}
                  style={styles.photo}
                />
                <View style={[
                  styles.photoStatus,
                  { backgroundColor: getStatusColor(photo.status) + '20' }
                ]}>
                  <Text style={[
                    styles.photoStatusText,
                    { color: getStatusColor(photo.status) }
                  ]}>
                    {photo.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Download Button */}
        {order.status === 'completed' && (
          <>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={handleDownload}
            >
              <Icon name="download" size={20} color={colors.dark} />
              <Text style={styles.downloadButtonText}>Download Photos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.revisionButton]}
              onPress={() => navigation.navigate('revision-request', {
                orderId: order.id,
                orderDetails: order
              })}
            >
              <Icon name="edit-2" size={20} color="#FFF" style={styles.buttonIcon} />
              <Text style={styles.revisionButtonText}>Request Additional Edits</Text>
            </TouchableOpacity>
          </>
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
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: 16,
  },
  orderId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  orderDate: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.darkLight,
    borderRadius: 12,
    margin: 12,
    padding: 16,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  estimatedTime: {
    color: colors.text,
    opacity: 0.7,
    fontSize: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: 'bold',
  },
  servicesList: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  serviceTag: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
    marginBottom: 4,
  },
  serviceText: {
    color: colors.primary,
    fontSize: 12,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -6,
  },
  photoContainer: {
    width: '50%',
    padding: 6,
    position: 'relative',
  },
  photo: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: colors.dark,
  },
  photoStatus: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  photoStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    margin: 12,
    padding: 16,
    borderRadius: 12,
  },
  downloadButtonText: {
    color: colors.dark,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  revisionButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00EEFF',
    marginTop: 12,
  },
  revisionButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  }
});

export default OrderDetailsScreen;