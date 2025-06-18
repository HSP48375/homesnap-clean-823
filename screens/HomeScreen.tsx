import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Icons } from '../utils/icons';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section with Gradient */}
        <LinearGradient
          colors={['#0A0A14', '#1a1a2e', '#16213e']}
          style={styles.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroEmoji}>🏡</Text>
            <Text style={styles.heroTitle}>Transform Your{'\n'}Real Estate Photos</Text>
            <Text style={styles.heroSubtitle}>
              AI-powered editing that sells homes faster
            </Text>
            
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation?.navigate('Upload')}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#00EEFF', '#00D4FF', '#00BBFF']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonIcon}>{Icons.camera}</Text>
                <Text style={styles.buttonText}>Start Taking Photos</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>50K+</Text>
                <Text style={styles.statLabel}>Photos Edited</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>24hr</Text>
                <Text style={styles.statLabel}>Turnaround</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>4.9⭐</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Services Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <Text style={styles.sectionSubtitle}>Professional editing that makes properties shine</Text>
          
          <View style={styles.servicesGrid}>
            {services.map((service, index) => (
              <TouchableOpacity
                key={index}
                style={styles.serviceCard}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={service.gradient}
                  style={styles.serviceGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.serviceIcon}>{service.icon}</Text>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.servicePrice}>${service.price}</Text>
                  <Text style={styles.serviceUnit}>per photo</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Features Section */}
        <LinearGradient
          colors={['#1a1a2e', '#0A0A14']}
          style={styles.featuresSection}
        >
          <Text style={styles.sectionTitle}>Why Top Realtors Choose Us</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
              <View style={styles.featureArrow}>
                <Text style={styles.arrowText}>→</Text>
              </View>
            </View>
          ))}
        </LinearGradient>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <LinearGradient
            colors={['#ff6b6b', '#ee5a6f', '#c44569']}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaTitle}>Ready to Sell Homes Faster?</Text>
            <Text style={styles.ctaSubtitle}>Join thousands of successful realtors</Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation?.navigate('Upload')}
            >
              <Text style={styles.ctaButtonText}>Get Started Free</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
};

const services = [
  {
    title: 'Standard Edit',
    price: '1.50',
    icon: '🎨',
    gradient: ['#667eea', '#764ba2'],
  },
  {
    title: 'Virtual Stage',
    price: '10.00',
    icon: '🛋️',
    gradient: ['#f093fb', '#f5576c'],
  },
  {
    title: 'Twilight Sky',
    price: '3.99',
    icon: '🌅',
    gradient: ['#4facfe', '#00f2fe'],
  },
  {
    title: 'Declutter',
    price: '2.99',
    icon: '✨',
    gradient: ['#43e97b', '#38f9d7'],
  },
];

const features = [
  {
    title: '24-Hour Lightning Delivery',
    description: 'Get professionally edited photos back in just one day',
    icon: '⚡',
  },
  {
    title: 'Expert Real Estate Editors',
    description: 'Specialists who know what buyers want to see',
    icon: '👨‍💼',
  },
  {
    title: 'Unlimited Revisions',
    description: 'We perfect every photo until you\'re 100% satisfied',
    icon: '♾️',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A14',
  },
  hero: {
    minHeight: 600,
    paddingTop: 80,
    paddingBottom: 40,
  },
  heroContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '300',
  },
  primaryButton: {
    marginBottom: 40,
    shadowColor: '#00EEFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 30,
  },
  buttonIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#00EEFF',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 24,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  serviceCard: {
    width: '50%',
    padding: 8,
  },
  serviceGradient: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'center',
  },
  serviceIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  serviceUnit: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  featuresSection: {
    padding: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 238, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  featureArrow: {
    marginLeft: 12,
  },
  arrowText: {
    fontSize: 20,
    color: '#00EEFF',
  },
  ctaSection: {
    padding: 24,
  },
  ctaGradient: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#c44569',
  },
});

export default HomeScreen;
