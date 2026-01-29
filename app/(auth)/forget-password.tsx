import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MagicalButton, MagicalCard, MagicalInput } from '../../components/MagicalUI';
import { supabase } from '../../lib/supabase';

const { width } = Dimensions.get('window');

// --- Reusable Magical Toast ---
const MagicalToast = ({ visible, message, type = 'success', onClose }: any) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-150)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: insets.top + 10,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }).start();
      const timer = setTimeout(() => {
        Animated.timing(translateY, { toValue: -150, duration: 300, useNativeDriver: true }).start(onClose);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const isError = type === 'error';
  return (
    <Animated.View style={[styles.toastContainer, { transform: [{ translateY }] }]}>
      <View style={[styles.toastContent, isError && styles.toastErrorBorder]}>
        <View style={[styles.iconContainer, isError && styles.iconErrorBg]}>
          <Ionicons name={isError ? "alert-circle" : "mail-open-outline"} size={24} color={isError ? "#f87171" : "#D946EF"} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.toastTitle}>{isError ? "Magical Fizzle" : "Spell Cast!"}</Text>
          <Text style={styles.toastMessage}>{message}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const handleResetRequest = async () => {
    if (!email) {
      setToast({ visible: true, message: "Please enter your owl address (email).", type: 'error' });
      return;
    }

    setLoading(true);
    
    // In Mobile, we usually want to redirect back to the app via Deep Link
    // Ensure you have configured your Scheme in app.json (e.g., "scheme": "my-magic-app")
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'my-magic-app://reset-password', // Change this to your actual app scheme
    });

    setLoading(false);

    if (error) {
       // Handle explicit errors (like rate limits)
      setToast({ visible: true, message: error.message, type: 'error' });
    } else {
      // Professional Feedback
      setToast({ 
        visible: true, 
        message: "If this email exists in our grimoire, a recovery link has been sent.", 
        type: 'success' 
      });
      
      // Optional: Navigate back after delay
      setTimeout(() => router.back(), 4500);
    }
  };

  return (
    <View className="flex-1">
      <MagicalToast 
        visible={toast.visible} 
        message={toast.message} 
        type={toast.type}
        onClose={() => setToast({ ...toast, visible: false })} 
      />

      <LinearGradient
        colors={['rgb(26, 15, 46)', 'rgb(45, 27, 78)', 'rgb(74, 44, 109)']}
        className="flex-1 justify-center px-6"
      >
        <View className="absolute inset-0 bg-black/60" />

        <View className="items-center mb-8">
            <View className="w-16 h-16 bg-fuchsia-500/20 rounded-full items-center justify-center mb-4 border border-fuchsia-500/50">
                <Ionicons name="key-outline" size={32} color="#e879f9" />
            </View>
          <Text className="text-3xl font-bold text-white mb-2 text-center">Forgot Password?</Text>
          <Text className="text-gray-300 text-center px-4">
            Enter your email and we'll conjure a link to reset your password.
          </Text>
        </View>

        <MagicalCard>
          <MagicalInput
            iconName="mail-outline"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <View className="mt-4">
            <MagicalButton 
              title="SEND RESET LINK" 
              onPress={handleResetRequest} 
              isLoading={loading} 
            />
          </View>
        </MagicalCard>

        <Pressable onPress={() => router.back()} className="mt-8 items-center">
            <Text className="text-gray-400 font-medium">Back to Sign In</Text>
        </Pressable>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center', zIndex: 9999, elevation: 100,
  },
  toastContent: {
    width: width * 0.9, backgroundColor: 'rgba(24, 24, 27, 0.95)', borderWidth: 1, borderColor: 'rgba(74, 222, 128, 0.5)',
    borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  toastErrorBorder: { borderColor: 'rgba(248, 113, 113, 0.5)' },
  iconContainer: { backgroundColor: 'rgba(74, 222, 128, 0.2)', padding: 8, borderRadius: 50, marginRight: 12 },
  iconErrorBg: { backgroundColor: 'rgba(248, 113, 113, 0.2)' },
  toastTitle: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 2 },
  toastMessage: { color: '#d1d5db', fontSize: 12, lineHeight: 16 },
});