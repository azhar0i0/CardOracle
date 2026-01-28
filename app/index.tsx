import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import {
    ImageBackground,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const bgImage = require('../assets/images/magic_bg.png');

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={bgImage}
        style={styles.background}
        resizeMode="cover"
        blurRadius={Platform.OS === 'web' ? 2 : 8}
      >
        {/* Dark gradient overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.2)', 'rgba(10,5,30,0.95)']}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              { textShadowColor: '#D946EF', textShadowRadius: 20 },
            ]}
          >
            Mystic Cards
          </Text>

          <Text style={styles.subtitle}>
            Enter the realm of shadows and light.
          </Text>

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
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: '#0f172a',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 32,
    paddingBottom: 64,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#d1d5db', // text-gray-300
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '500',
  },
  buttons: {
    width: '100%',
    gap: 16,
    alignItems: 'center',
  },
  getStartedButton: {
    backgroundColor: '#fff',
    height: 56,
    width: '100%',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 10,
  },
  getStartedText: {
    color: '#4c1d95', // purple-900
    fontSize: 18,
    fontWeight: '700',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signInText: {
    color: '#9ca3af', // gray-400
    fontSize: 16,
  },
  signInLink: {
    color: '#D946EF',
    fontWeight: '700',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
