import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const glowStyle = {
    opacity: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 1],
    }),
    transform: [{
      scale: glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.15],
      }),
    }],
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/bg_wave.png')} style={styles.wave} resizeMode='cover' />
      <Animated.Image
        source={require('../assets/lens_glow.png')}
        style={[styles.logo, glowStyle]}
      />
      <Text style={styles.appName}>HomeSnap Pro</Text>
      <Text style={styles.tagline}>Shoot like a pro. Sell like a boss.</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.outlineButton}>
        <Animated.Text style={[styles.outlineText, glowStyle]}>Get Started</Animated.Text>
      </TouchableOpacity>
      <Image source={require('../assets/house_outline.png')} style={styles.house} resizeMode='contain' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  wave: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.25,
    zIndex: -2,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 20,
  },
  appName: {
    fontSize: 34,
    fontFamily: 'Poppins_700Bold',
    color: 'white',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 50,
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: '#00FFFF',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  outlineText: {
    color: '#00FFFF',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    textShadowColor: '#00FFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  house: {
    width: width * 0.9,
    height: 120,
    position: 'absolute',
    bottom: 0,
    opacity: 0.35,
  },
});
