
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

interface Photo {
  id: string;
  url: string;
  originalUrl: string;
  selected: boolean;
  feedback: string;
}

interface RouteParams {
  orderId: string;
  orderDetails: {
    id: string;
    price_per_photo: number;
    photos: any[];
  };
}

const RevisionRequestScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId, orderDetails } = route.params as RouteParams;
  const { user } = useAuthStore();
  
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCount, setSelectedCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrderPhotos = async () => {
      try {
        setIsLoading(true);
        
        if (orderDetails?.photos) {
          // Transform photos data
          const formattedPhotos = orderDetails.photos.map(photo => ({
            id: photo.id,
            url: photo.edited_storage_path,
            originalUrl: photo.storage_path,
            selected: false,
            feedback: ''
          }));
          
          setPhotos(formattedPhotos);
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
        Alert.alert('Error', 'Unable to load photos. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderPhotos();
  }, [orderId, orderDetails]);

  useEffect(() => {
    // Calculate price (50% of original per photo)
    const pricePerPhoto = orderDetails?.price_per_photo || 10;
    const discountedPrice = pricePerPhoto * 0.5;
    const original = selectedCount * pricePerPhoto;
    const discounted = selectedCount * discountedPrice;
    
    setOriginalPrice(original);
    setTotalPrice(discounted);
  }, [selectedCount, orderDetails]);

  const togglePhotoSelection = (photoId: string) => {
    const updatedPhotos = photos.map(photo => {
      if (photo.id === photoId) {
        const newSelected = !photo.selected;
        return { ...photo, selected: newSelected };
      }
      return photo;
    });
    
    setPhotos(updatedPhotos);
    const newSelectedCount = updatedPhotos.filter(p => p.selected).length;
    setSelectedCount(newSelectedCount);
  };
  
  const updatePhotoFeedback = (photoId: string, feedback: string) => {
    setPhotos(photos.map(photo => {
      if (photo.id === photoId) {
        return { ...photo, feedback };
      }
      return photo;
    }));
  };
  
  const handleSubmitRevisionRequest = async () => {
    const selectedPhotos = photos.filter(photo => photo.selected);
    
    if (selectedPhotos.length === 0) {
      Alert.alert('Error', 'Please select at least one photo for revision');
      return;
    }
    
    const photosMissingFeedback = selectedPhotos.filter(photo => !photo.feedback.trim());
    if (photosMissingFeedback.length > 0) {
      Alert.alert('Error', 'Please provide feedback for all selected photos');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a revision request in the database
      const { data, error } = await supabase
        .from('revision_requests')
        .insert({
          original_order_id: orderId,
          user_id: user?.id,
          photos: selectedPhotos.map(photo => ({
            photo_id: photo.id,
            feedback: photo.feedback
          })),
          total_price: totalPrice,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      Alert.alert(
        'Revision Request Submitted',
        'Your revision request has been submitted successfully. You can track its progress in the Orders tab.',
        [
          { text: 'OK', onPress: () => navigation.navigate('Orders' as never) }
        ]
      );
    } catch (error) {
      console.error('Error submitting revision request:', error);
      Alert.alert('Error', 'Failed to submit revision request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Revisions</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Icon name="info" size={20} color="#00EEFF" style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Select photos that need revisions and provide specific instructions. 
            Revisions are billed at 50% of the original photo price.
          </Text>
        </View>
        
        <Text style={styles.sectionTitle}>Select Photos for Revision</Text>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading photos...</Text>
          </View>
        ) : (
          <>
            {photos.map((photo) => (
              <View key={photo.id} style={styles.photoItem}>
                <View style={styles.photoContainer}>
                  <Checkbox
                    status={photo.selected ? 'checked' : 'unchecked'}
                    onPress={() => togglePhotoSelection(photo.id)}
                    color="#00EEFF"
                  />
                  <Image 
                    source={{ uri: photo.url }} 
                    style={styles.photoImage} 
                    resizeMode="cover"
                  />
                </View>
                
                {photo.selected && (
                  <View style={styles.feedbackContainer}>
                    <Text style={styles.feedbackLabel}>Revision Instructions:</Text>
                    <TextInput
                      style={styles.feedbackInput}
                      placeholder="Describe what needs to be revised..."
                      placeholderTextColor="#8F9BB3"
                      multiline
                      value={photo.feedback}
                      onChangeText={(text) => updatePhotoFeedback(photo.id, text)}
                    />
                  </View>
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total:</Text>
          <View>
            <Text style={styles.originalPrice}>${originalPrice.toFixed(2)}</Text>
            <Text style={styles.discountedPrice}>${totalPrice.toFixed(2)}</Text>
          </View>
        </View>
        
        <Text style={styles.selectedCount}>
          {selectedCount} photo{selectedCount !== 1 ? 's' : ''} selected
        </Text>
        
        <TouchableOpacity 
          style={[
            styles.submitButton, 
            (selectedCount === 0 || isSubmitting) && styles.disabledButton
          ]}
          disabled={selectedCount === 0 || isSubmitting}
          onPress={handleSubmitRevisionRequest}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Submit Revision Request'}
          </Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: 'rgba(0, 238, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 238, 255, 0.3)',
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    color: '#FFF',
    flex: 1,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFF',
  },
  photoItem: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  photoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  photoImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    marginLeft: 12,
  },
  feedbackContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  feedbackLabel: {
    color: '#FFF',
    marginBottom: 8,
    fontWeight: '500',
  },
  feedbackInput: {
    backgroundColor: '#1A1A2E',
    borderRadius: 8,
    padding: 12,
    color: '#FFF',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  originalPrice: {
    fontSize: 16,
    color: '#8F9BB3',
    textDecorationLine: 'line-through',
    textAlign: 'right',
  },
  discountedPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00EEFF',
    textAlign: 'right',
  },
  selectedCount: {
    color: '#8F9BB3',
    textAlign: 'center',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#00EEFF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(0, 238, 255, 0.3)',
  },
  submitButtonText: {
    color: '#0A0A14',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RevisionRequestScreen;
