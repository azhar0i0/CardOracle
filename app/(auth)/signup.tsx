import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
  Image, // Added Image
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MagicalButton, MagicalCard, MagicalInput } from '../../components/MagicalUI';
import { supabase } from '../../lib/supabase';

const { width } = Dimensions.get('window');
const ICON_SOURCE = require('@/assets/images/icon.png');

// --- 1. Fixed Magical Toast Component ---
const MagicalToast = ({ visible, message, onClose }: { visible: boolean; message: string; onClose: () => void }) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-150)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: insets.top + 10,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        handleClose();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -150,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toastContainer, { transform: [{ translateY }], opacity }]}>
      <View style={styles.toastContent}>
        <View style={styles.iconContainer}>
          <Ionicons name="mail-unread-outline" size={24} color="#D946EF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.toastTitle}>Check your Grimoire!</Text>
          <Text style={styles.toastMessage}>{message}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

// --- 2. Main Sign Up Screen ---
export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  // --- Icon Animation Logic ---
  const floatingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: -12,
          duration: 2500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();
  }, []);

  async function signUpWithEmail() {
    if (!email || !password) {
      setErrorMsg('Email and password are required');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (
        error.message.toLowerCase().includes('already registered') || 
        error.message.toLowerCase().includes('unique constraint')
      ) {
        setErrorMsg('This email is already in use. Please Sign In instead.');
      } else {
        setErrorMsg(error.message);
      }
    } else {
      setShowToast(true);
      setEmail('');
      setPassword('');
    }

    setLoading(false);
  }

  return (
    <View className="flex-1">
      <MagicalToast 
        visible={showToast} 
        message="A verification spell has been sent to your email. Please verify to activate your account." 
        onClose={() => setShowToast(false)}
      />

      <LinearGradient
        colors={['rgb(26, 15, 46)', 'rgb(45, 27, 78)', 'rgb(74, 44, 109)']}
        className="flex-1 justify-center px-6"
      >
        <View className="absolute inset-0 bg-black/60" />

        <View className="items-center mb-6">
          {/* --- Centered Floating Icon --- */}
          <View style={styles.iconWrapper}>
            <View style={styles.iconGlow} />
            <Animated.View style={{ transform: [{ translateY: floatingAnim }] }}>
              <Image 
                source={ICON_SOURCE} 
                style={styles.mainIcon} 
                resizeMode="contain" 
              />
            </Animated.View>
          </View>

          <Text className="text-4xl font-bold text-white mb-2">Join the Realm</Text>
          <Text className="text-gray-300">Create your legend</Text>
        </View>

        <MagicalCard>
          {errorMsg ? (
            <View className="bg-red-500/20 p-3 rounded-lg border border-red-500 mb-4 flex-row items-center">
              <Ionicons name="alert-circle" size={20} color="#fca5a5" />
              <Text className="text-red-200 text-xs flex-1 ml-2 font-medium">{errorMsg}</Text>
            </View>
          ) : null}

          <MagicalInput
            iconName="mail-outline"
            placeholder="Email"
            value={email}
            onChangeText={(t: string) => { setEmail(t); setErrorMsg(''); }}
          />
          <MagicalInput
            iconName="lock-closed-outline"
            placeholder="Password"
            value={password}
            onChangeText={(t: string) => { setPassword(t); setErrorMsg(''); }}
            secureTextEntry
          />

          <View className="mt-4">
            <MagicalButton title="CREATE ACCOUNT" onPress={signUpWithEmail} isLoading={loading} />
          </View>
        </MagicalCard>

        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-400">Already initiated? </Text>
          <Link href="/signin">
            <Text className="text-[#D946EF] font-bold">Sign In</Text>
          </Link>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  // Icon Styles
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.2,
    shadowColor: '#D946EF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
  },
  mainIcon: {
    width: 90,
    height: 90,
  },
  // Toast Styles
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,      
    elevation: 100,    
  },
  toastContent: {
    width: width * 0.9,
    backgroundColor: 'rgba(24, 24, 27, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(217, 70, 239, 0.3)',    
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#D946EF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  iconContainer: {
    backgroundColor: 'rgba(217, 70, 239, 0.1)',
    padding: 8,
    borderRadius: 50,
    marginRight: 12,
  },
  toastTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 2,
  },
  toastMessage: {
    color: '#d1d5db',
    fontSize: 12,
    lineHeight: 16,
  },
});