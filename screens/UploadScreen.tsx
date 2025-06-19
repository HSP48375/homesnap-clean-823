import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Icons } from '../utils/icons';

interface Photo {
  id: string;
  name: string;
  uri: string;
  size: number;
  type: string;
  storagePathOriginal?: string;
  publicUrl?: string;
}

interface SelectedServices {
  standardEditing: boolean;
  virtualStaging: boolean;
  twilightConversion: boolean;
  decluttering: boolean;
}

const UploadScreen = ({ navigation }) => {
  const { user } = useAuthStore();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [selectedServices, setSelectedServices] = useState<SelectedServices>({
    standardEditing: true,
    virtualStaging: false,
    twilightConversion: false,
    decluttering: false,
  });

  // Generate unique order ID
  const generateOrderId = () => {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Request permissions and pick images
  const pickImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        exif: false,
      });

      if (!result.canceled && result.assets) {
        const newPhotos: Photo[] = result.assets.map((asset, index) => ({
          id: `${Date.now()}_${index}`,
          name: asset.fileName || `photo_${index + 1}.jpg`,
          uri: asset.uri,
          size: asset.fileSize || 0,
          type: asset.type || 'image/jpeg',
        }));

        setPhotos(prev => [...prev, ...newPhotos]);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images. Please try again.');
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your camera.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        exif: false,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        const newPhoto: Photo = {
          id: `${Date.now()}`,
          name: asset.fileName || `photo_${Date.now()}.jpg`,
          uri: asset.uri,
          size: asset.fileSize || 0,
          type: asset.type || 'image/jpeg',
        };

        setPhotos(prev => [...prev, newPhoto]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  // Remove photo from list
  const handleRemovePhoto = (id: string) => {
    setPhotos(photos.filter(photo => photo.id !== id));
  };

  // Toggle service selection
  const toggleService = (service: keyof SelectedServices) => {
    if (service === 'standardEditing') return; // Always required
    setSelectedServices({
      ...selectedServices,
      [service]: !selectedServices[service],
    });
  };

  // Upload photo to Supabase Storage
  const uploadPhotoToStorage = async (photo: Photo, orderId: string): Promise<{ storagePathOriginal: string; publicUrl: string }> => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    // Create file path: photos/user_[userId]/order_[orderId]/original/
    const fileName = `${photo.id}_${photo.name}`;
    const filePath = `photos/user_${user.id}/order_${orderId}/original/${fileName}`;

    // Convert URI to blob for upload
    const response = await fetch(photo.uri);
    const blob = await response.blob();

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('photos')
      .upload(filePath, blob, {
        contentType: photo.type,
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('photos')
      .getPublicUrl(filePath);

    return {
      storagePathOriginal: filePath,
      publicUrl: publicUrlData.publicUrl,
    };
  };

  // Submit order after uploading all photos
  const submitOrder = async (orderData: any) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) {
        throw new Error(`Order submission failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error submitting order:', error);
      throw error;
    }
  };

  // Calculate total price
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

    // Volume discounts
    if (photos.length >= 20) {
      total *= 0.85;
    } else if (photos.length >= 10) {
      total *= 0.9;
    }

    return total.toFixed(2);
  };

  // Main upload and order submission flow
  const handleContinue = async () => {
    if (photos.length === 0) {
      Alert.alert('No Photos', 'Please add at least one photo to continue.');
      return;
    }

    if (!user?.id) {
      Alert.alert('Authentication Error', 'Please log in to continue.');
      return;
    }

    setUploading(true);
    const orderId = generateOrderId();

    try {
      // Upload all photos to Supabase Storage
      const uploadedPhotos = [];
      
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        setUploadProgress(prev => ({ ...prev, [photo.id]: 0 }));
        
        try {
          const { storagePathOriginal, publicUrl } = await uploadPhotoToStorage(photo, orderId);
          
          uploadedPhotos.push({
            id: photo.id,
            name: photo.name,
            size: photo.size,
            storagePathOriginal,
            publicUrl,
            status: 'uploaded',
          });
          
          setUploadProgress(prev => ({ ...prev, [photo.id]: 100 }));
        } catch (error) {
          console.error(`Failed to upload photo ${photo.name}:`, error);
          uploadedPhotos.push({
            id: photo.id,
            name: photo.name,
            size: photo.size,
            status: 'failed',
            error: error.message,
          });
        }
      }

      // Check if any uploads failed
      const failedUploads = uploadedPhotos.filter(photo => photo.status === 'failed');
      if (failedUploads.length > 0) {
        Alert.alert(
          'Upload Error', 
          `${failedUploads.length} photo(s) failed to upload. Please try again.`
        );
        setUploading(false);
        return;
      }

      // Construct order JSON
      const orderData = {
        id: orderId,
        user_id: user.id,
        photo_count: photos.length,
        photos: uploadedPhotos,
        services: selectedServices,
        total_price: parseFloat(calculateTotal()),
        status: 'pending',
        payment_status: 'pending',
        created_at: new Date().toISOString(),
        metadata: {
          platform: 'mobile',
          app_version: '1.0.0',
        },
      };

      // Submit order to database
      const submittedOrder = await submitOrder(orderData);
      
      Alert.alert(
        'Success', 
        'Your order has been submitted successfully!', 
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setPhotos([]);
              setUploadProgress({});
              // Navigate to orders or dashboard
              navigation.navigate('Orders');
            },
          },
        ]
      );

    } catch (error) {
      console.error('Error processing order:', error);
      Alert.alert('Error', 'Failed to process your order. Please try again.');
    } finally {
      setUploading(false);
    }
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
              onPress={pickImages}
              disabled={uploading}
            >
              <Text style={styles.uploadIcon}>{Icons.image}</Text>
              <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.uploadButton, styles.uploadButtonSecondary]}
              onPress={takePhoto}
              disabled={uploading}
            >
              <Text style={styles.uploadIcon}>{Icons.camera}</Text>
              <Text style={styles.uploadButtonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Photo List */}
          {photos.length > 0 && (
            <View style={styles.photoList}>
              {photos.map(photo => (
                <View key={photo.id} style={styles.photoItem}>
                  <Image source={{ uri: photo.uri }} style={styles.photoPreview} />
                  <View style={styles.photoInfo}>
                    <Text style={styles.photoName}>{photo.name}</Text>
                    <Text style={styles.photoSize}>
                      {(photo.size / (1024 * 1024)).toFixed(2)} MB
                    </Text>
                    {uploadProgress[photo.id] !== undefined && (
                      <View style={styles.progressContainer}>
                        <View 
                          style={[styles.progressBar, { width: `${uploadProgress[photo.id]}%` }]}
                        />
                      </View>
                    )}
                  </View>
                  {!uploading && (
                    <TouchableOpacity
                      onPress={() => handleRemovePhoto(photo.id)}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeIcon}>{Icons.x}</Text>
                    </TouchableOpacity>
                  )}
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
                selectedServices[key as keyof SelectedServices] && styles.serviceItemSelected,
                key === 'standardEditing' && styles.serviceItemDisabled,
              ]}
              onPress={() => toggleService(key as keyof SelectedServices)}
              disabled={key === 'standardEditing' || uploading}
            >
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.servicePrice}>${service.price}/photo</Text>
              </View>
              <Text style={styles.checkIcon}>
                {selectedServices[key as keyof SelectedServices] ? Icons.checkCircle : Icons.circle}
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
              style={[styles.continueButton, uploading && styles.continueButtonDisabled]}
              onPress={handleContinue}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color="#000" style={{ marginRight: 8 }} />
              ) : null}
              <Text style={styles.continueButtonText}>
                {uploading ? 'Processing...' : 'Continue to Checkout'}
              </Text>
              {!uploading && <Text style={styles.arrowIcon}>{Icons.arrowRight}</Text>}
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
    gap: 12,
  },
  uploadButton: {
    backgroundColor: '#1A1A28',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  uploadButtonSecondary: {
    backgroundColor: '#2A2A38',
  },
  uploadIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  photoPreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  photoInfo: {
    flex: 1,
  },
  photoName: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  photoSize: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00EEFF',
  },
  removeButton: {
    padding: 8,
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
  continueButtonDisabled: {
    opacity: 0.7,
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