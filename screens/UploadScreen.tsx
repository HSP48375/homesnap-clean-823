import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { Icons } from '../utils/icons';

const UploadScreen = ({ navigation }) => {
  const [photos, setPhotos] = useState([]);
  const [selectedServices, setSelectedServices] = useState({
    standardEditing: true,
    virtualStaging: false,
    twilightConversion: false,
    decluttering: false,
  });

  const handleMockPhotoAdd = () => {
    // Mock photo addition for demo
    const newPhoto = {
      id: Date.now().toString(),
      name: `Photo ${photos.length + 1}`,
    };
    setPhotos([...photos, newPhoto]);
  };

  const handleRemovePhoto = (id) => {
    setPhotos(photos.filter(photo => photo.id !== id));
  };

  const toggleService = (service) => {
    if (service === 'standardEditing') return;
    setSelectedServices({
      ...selectedServices,
      [service]: !selectedServices[service],
    });
  };

  const calculateTotal = () => {
    const basePrice = 1.50 * photos.length;
    let total = basePrice;

    if (selectedServices.virtualStaging) {
      total += 10.00 * photos.length;
    }
    if (selectedServices.twilightConversion) {
      total += 3.99 * photos.length;
    }
    if (selectedServices.decluttering) {
      total += 2.99 * photos.length;
    }

    if (photos.length >= 20) {
      total *= 0.85;
    } else if (photos.length >= 10) {
      total *= 0.9;
    }

    return total.toFixed(2);
  };

  const handleContinue = () => {
    if (photos.length === 0) {
      Alert.alert('No Photos', 'Please add at least one photo to continue.');
      return;
    }
    Alert.alert('Success', 'Order placed successfully!');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView>
        {/* Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Photos</Text>
          <Text style={styles.sectionSubtitle}>
            Add photos to get started
          </Text>

          <View style={styles.uploadButtons}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleMockPhotoAdd}
            >
              <Text style={styles.uploadIcon}>{Icons.camera}</Text>
              <Text style={styles.uploadButtonText}>Add Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Photo List */}
          {photos.length > 0 && (
            <View style={styles.photoList}>
              {photos.map(photo => (
                <View key={photo.id} style={styles.photoItem}>
                  <Text style={styles.photoIcon}>{Icons.image}</Text>
                  <Text style={styles.photoName}>{photo.name}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemovePhoto(photo.id)}
                  >
                    <Text style={styles.removeIcon}>{Icons.x}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Services Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Services</Text>
          {Object.entries(services).map(([key, service]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.serviceItem,
                selectedServices[key] && styles.serviceItemSelected,
                key === 'standardEditing' && styles.serviceItemDisabled,
              ]}
              onPress={() => toggleService(key)}
              disabled={key === 'standardEditing'}
            >
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.servicePrice}>${service.price}/photo</Text>
              </View>
              <Text style={styles.checkIcon}>
                {selectedServices[key] ? Icons.checkCircle : Icons.circle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Summary */}
        {photos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Photos</Text>
              <Text style={styles.summaryValue}>{photos.length}</Text>
            </View>
            {photos.length >= 10 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountIcon}>{Icons.tag}</Text>
                <Text style={styles.discountText}>
                  {photos.length >= 20 ? '15% Volume Discount' : '10% Volume Discount'}
                </Text>
              </View>
            )}
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>${calculateTotal()}</Text>
            </View>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Continue to Checkout</Text>
              <Text style={styles.arrowIcon}>{Icons.arrowRight}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const services = {
  standardEditing: { title: 'Standard Editing', price: '1.50' },
  virtualStaging: { title: 'Virtual Staging', price: '10.00' },
  twilightConversion: { title: 'Twilight Conversion', price: '3.99' },
  decluttering: { title: 'Decluttering', price: '2.99' },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  uploadButtons: {
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#1A1A28',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  photoList: {
    marginTop: 20,
  },
  photoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A28',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  photoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  photoName: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  removeIcon: {
    fontSize: 20,
    color: '#ff4444',
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A28',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  serviceItemSelected: {
    backgroundColor: '#00EEFF20',
    borderColor: '#00EEFF',
    borderWidth: 1,
  },
  serviceItemDisabled: {
    opacity: 0.8,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  checkIcon: {
    fontSize: 24,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  summaryValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00FF8820',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  discountIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  discountText: {
    color: '#00FF88',
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  totalLabel: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 24,
    color: '#00EEFF',
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#00EEFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  continueButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  arrowIcon: {
    fontSize: 20,
  },
});

export default UploadScreen;
