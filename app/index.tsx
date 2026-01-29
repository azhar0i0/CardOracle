import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Image,
    Animated,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
    Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const ICON_SOURCE = require('@/assets/images/icon.png');

export default function WelcomeScreen() {
  // Animation for the floating effect
  const floatingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Smooth infinite floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: -15,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
        <LinearGradient
            colors={[
                'rgb(26, 15, 46)',
                'rgb(45, 27, 78)',
                'rgb(74, 44, 109)',
                'rgb(45, 27, 78)',
                'rgb(26, 15, 46)',
            ]}
            style={StyleSheet.absoluteFill}
        >
            {/* Dark Overlay for depth */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />

            <View style={styles.content}>
                
                {/* --- CENTERED ICON SECTION --- */}
                <View style={styles.iconWrapper}>
                    {/* The Glow Effect behind the icon */}
                    <View style={styles.iconGlow} />
                    
                    <Animated.View style={{ transform: [{ translateY: floatingAnim }] }}>
                        <Image 
                            source={ICON_SOURCE} 
                            style={styles.mainIcon}
                            resizeMode="contain"
                        />
                    </Animated.View>
                </View>

                {/* --- TEXT SECTION --- */}
                <View style={styles.textContainer}>
                    <Text
                        style={[
                            styles.title,
                            { textShadowColor: 'rgba(217, 70, 239, 0.8)', textShadowRadius: 25 },
                        ]}
                    >
                        Mystic Cards
                    </Text>

                    <Text style={styles.subtitle}>
                        Enter the realm of shadows and light.
                    </Text>
                </View>

                {/* --- BUTTON SECTION --- */}
                <View style={styles.buttons}>
                    <Link href="/signup" asChild>
                        <Pressable style={styles.getStartedButton}>
                            <Text style={styles.getStartedText}>Get Started</Text>
                        </Pressable>
                    </Link>

                    <View style={styles.signInContainer}>
                        <Text style={styles.signInText}>Already a traveler? </Text>
                        <Link href="/signin">
                            <Text style={styles.signInLink}>Sign In</Text>
                        </Link>
                    </View>
                </View>
            </View>
        </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingBottom: 64,
    paddingTop: 80, // Space for top
    justifyContent: 'space-between', // Spreads icon, text, and buttons
    alignItems: 'center',
  },
  iconWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  iconGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    backgroundColor: '#D946EF',
    borderRadius: 100,
    opacity: 0.15,
    // Note: 'blur' is hard in RN without libraries, so we use shadow + opacity
    shadowColor: '#D946EF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 60,
  },
  mainIcon: {
    width: width * 0.45,
    height: width * 0.45,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: '#9ca3af', 
    textAlign: 'center',
    fontWeight: '400',
    opacity: 0.8,
  },
  buttons: {
    width: '100%',
    alignItems: 'center',
  },
  getStartedButton: {
    backgroundColor: '#fff',
    height: 60,
    width: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
        ios: {
            shadowColor: '#D946EF',
            shadowOpacity: 0.4,
            shadowOffset: { width: 0, height: 10 },
            shadowRadius: 15,
        },
        android: {
            elevation: 12,
        }
    })
  },
  getStartedText: {
    color: '#4c1d95',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signInText: {
    color: '#9ca3af',
    fontSize: 16,
  },
  signInLink: {
    color: '#D946EF',
    fontWeight: '700',
    fontSize: 16,
  },
});