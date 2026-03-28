
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Suggestion, suggestionService } from '../lib/suggestionService';
import { colors } from '../theme/colors';

interface SmartSuggestionsProps {
  imageUrls: string[];
  propertyType?: string;
  compact?: boolean;
  onSuggestionSelected?: (suggestion: Suggestion) => void;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  imageUrls,
  propertyType,
  compact = false,
  onSuggestionSelected
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  
  useEffect(() => {
    if (imageUrls.length > 0) {
      fetchSuggestions();
    }
  }, [imageUrls, propertyType]);
  
  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const results = await suggestionService.getSuggestionsForImages(imageUrls, propertyType);
      setSuggestions(results);
      
      // Track that suggestions were viewed
      results.forEach(suggestion => {
        suggestionService.trackSuggestionInteraction(suggestion.id, 'view');
      });
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSuggestionPress = (suggestion: Suggestion) => {
    // Track the click
    suggestionService.trackSuggestionInteraction(suggestion.id, 'click');
    
    // Handle the CTA action
    if (onSuggestionSelected) {
      onSuggestionSelected(suggestion);
    } else {
      // Default handling based on action type
      switch (suggestion.ctaAction) {
        case 'navigate':
          navigation.navigate(suggestion.ctaPayload.screen, suggestion.ctaPayload.params);
          break;
        case 'add_service':
          // This would be handled by the parent component
          break;
        case 'apply_discount':
          // This would be handled by the parent component
          break;
        default:
          console.log('Unhandled suggestion action:', suggestion.ctaAction);
      }
    }
  };
  
  const handleDismiss = (suggestionId: string) => {
    setDismissed(prev => ({ ...prev, [suggestionId]: true }));
    suggestionService.trackSuggestionInteraction(suggestionId, 'dismiss');
  };
  
  // Filter out dismissed suggestions
  const activeSuggestions = suggestions.filter(s => !dismissed[s.id]);
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Analyzing your photos...</Text>
      </View>
    );
  }
  
  if (activeSuggestions.length === 0) {
    return null;
  }
  
  // Compact view (for inline suggestions)
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        {activeSuggestions.map((suggestion) => (
          <View key={suggestion.id} style={styles.compactCard}>
            <View style={styles.compactContent}>
              <Icon name="zap" size={16} color={colors.primary} style={styles.compactIcon} />
              <Text style={styles.compactTitle}>{suggestion.title}</Text>
            </View>
            <TouchableOpacity
              style={styles.compactButton}
              onPress={() => handleSuggestionPress(suggestion)}
            >
              <Text style={styles.compactButtonText}>{suggestion.ctaText}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  }
  
  // Full view with carousel
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="lightbulb" size={18} color={colors.primary} />
        <Text style={styles.headerText}>Smart Suggestions</Text>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={screenWidth - 60} // Card width + margins
        decelerationRate="fast"
      >
        {activeSuggestions.map((suggestion) => (
          <View key={suggestion.id} style={styles.card}>
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={() => handleDismiss(suggestion.id)}
            >
              <Icon name="x" size={18} color="#fff" />
            </TouchableOpacity>
            
            {suggestion.imageUrl && (
              <Image
                source={{ uri: suggestion.imageUrl }}
                style={styles.image}
                resizeMode="cover"
              />
            )}
            
            <View style={styles.cardContent}>
              <Text style={styles.title}>{suggestion.title}</Text>
              <Text style={styles.description}>{suggestion.description}</Text>
              
              {suggestion.discountCode && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    {suggestion.discountAmount}% OFF
                  </Text>
                  <Text style={styles.discountCode}>
                    Code: {suggestion.discountCode}
                  </Text>
                </View>
              )}
              
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <Text style={styles.buttonText}>{suggestion.ctaText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    opacity: 0.7,
  },
  card: {
    width: Dimensions.get('window').width - 60,
    marginHorizontal: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  dismissButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 120,
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
    lineHeight: 20,
  },
  discountBadge: {
    backgroundColor: 'rgba(0, 238, 255, 0.15)',
    borderRadius: 6,
    padding: 8,
    marginBottom: 16,
  },
  discountText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  discountCode: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A0A14',
  },
  
  // Compact styles
  compactContainer: {
    marginVertical: 8,
  },
  compactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 238, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  compactIcon: {
    marginRight: 8,
  },
  compactTitle: {
    fontSize: 14,
    color: '#fff',
    flex: 1,
  },
  compactButton: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  compactButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0A0A14',
  },
});

export default SmartSuggestions;
