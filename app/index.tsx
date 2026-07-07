import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { getMerchantSession } from '../adminPanel/auth/session';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const merchant = getMerchantSession();

  useEffect(() => {
    if (merchant) {
      if (merchant.type === 'shop') {
        router.replace('/adminPanel/shop');
      } else {
        router.replace('/adminPanel/restaurant');
      }
    }
  }, [merchant]);
  // Animated values using React Native standard Animated API for 100% reliability
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const descOpacity = useRef(new Animated.Value(0)).current;
  const descTranslateY = useRef(new Animated.Value(20)).current;
  const buttonScale = useRef(new Animated.Value(0.9)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Run fluid staggered entrance animations
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(logoRotate, {
        toValue: 1,
        friction: 9,
        tension: 30,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(300),
        Animated.parallel([
          Animated.timing(titleOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(titleTranslateY, {
            toValue: 0,
            friction: 7,
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.sequence([
        Animated.delay(500),
        Animated.parallel([
          Animated.timing(descOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(descTranslateY, {
            toValue: 0,
            friction: 7,
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.sequence([
        Animated.delay(700),
        Animated.parallel([
          Animated.timing(buttonOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(buttonScale, {
            toValue: 1,
            friction: 7,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, [
    logoScale,
    logoRotate,
    titleOpacity,
    titleTranslateY,
    descOpacity,
    descTranslateY,
    buttonOpacity,
    buttonScale,
  ]);

  const spin = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const logoStyle = {
    transform: [
      { scale: logoScale },
      { rotate: spin },
    ],
  };

  const titleStyle = {
    opacity: titleOpacity,
    transform: [{ translateY: titleTranslateY }],
  };

  const descStyle = {
    opacity: descOpacity,
    transform: [{ translateY: descTranslateY }],
  };

  const buttonStyle = {
    opacity: buttonOpacity,
    transform: [{ scale: buttonScale }],
  };

  const handleGetStarted = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0B0C" />

      {/* Aesthetic ambient glows */}
      <View style={[styles.glowBall, styles.glowRed]} />
      <View style={[styles.glowBall, styles.glowOrange]} />

      <View style={styles.contentWrap}>
        {/* Animated Brand Logo Container */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Image source={require('../assets/images/icon.png')} style={styles.logoImage} />
        </Animated.View>

        {/* Text Area */}
        <View style={styles.textContainer}>
          <Animated.Text style={[styles.title, titleStyle]}>
            HaiderPay
          </Animated.Text>
          <Animated.Text style={[styles.tagline, descStyle]}>
            Experience the next generation of seamless digital payments and ultra-fast deliveries.
          </Animated.Text>
        </View>

        {/* Action Button Container */}
        <Animated.View style={[styles.buttonContainer, buttonStyle]}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGetStarted}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Learn More</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Footer Branding */}
      <Text style={styles.footerBranding}>Powered by HaiderPay Inc.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrap: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    zIndex: 10,
  },
  // Ambient glows
  glowBall: {
    position: 'absolute',
    borderRadius: 999,
    width: width * 0.75,
    height: width * 0.75,
    opacity: 0.15,
  },
  glowRed: {
    backgroundColor: '#FF4010', // Brand Primary Red from theme.md
    top: height * 0.1,
    left: -width * 0.2,
  },
  glowOrange: {
    backgroundColor: '#FF6A00', // Orange Accent from theme.md
    bottom: height * 0.15,
    right: -width * 0.2,
  },
  // Logo Styles
  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 36,
    shadowColor: '#FF4010',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  logoImage: {
    width: 110,
    height: 110,
    borderRadius: 30,
  },
  logoBadge: {
    position: 'absolute',
    bottom: -8,
    backgroundColor: '#FF4010',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderWidth: 1,
    borderColor: '#0B0B0C',
  },
  logoBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  // Typography
  textContainer: {
    alignItems: 'center',
    marginBottom: 44,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    fontStyle: 'italic', // Italic style as requested
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(255, 255, 255, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  tagline: {
    fontSize: 15,
    color: '#9E9EA4',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  // Buttons
  buttonContainer: {
    width: '100%',
    gap: 16,
    paddingHorizontal: 20,
  },
  primaryButton: {
    height: 58,
    borderRadius: 4, // square-ish borderRadius 4 from theme.md
    backgroundColor: '#FF4010', // Brand Primary Red from theme.md
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4010',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    height: 58,
    borderRadius: 4, // square-ish borderRadius 4 from theme.md
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1.5,
    borderColor: '#FF4010', // Brand Primary Red border from theme.md
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF4010', // Brand Primary Red text from theme.md
  },
  // Footer
  footerBranding: {
    position: 'absolute',
    bottom: 24,
    fontSize: 11,
    color: '#52525B',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
