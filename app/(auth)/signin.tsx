import { Link, router } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Platform, 
  Text, 
  View, 
  Pressable, 
  Animated, 
  Easing, 
  Image, 
  StyleSheet 
} from 'react-native';
import { MagicalButton, MagicalCard, MagicalInput } from '../../components/MagicalUI';
import { supabase } from '../../lib/supabase';

const ICON_SOURCE = require('../../assets/images/icon.png');

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  const signInWithEmail = async () => {
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    }

    setLoading(false);
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={[
          'rgb(26, 15, 46)',
          'rgb(45, 27, 78)',
          'rgb(74, 44, 109)',
          'rgb(45, 27, 78)',
          'rgb(26, 15, 46)',
        ]}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        className="flex-1 justify-center"
      >
        <View className="absolute inset-0 bg-black/60" />

        <View className="px-6">
          {/* Header */}
          <View className="items-center mb-8">
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

            <Text className="text-5xl font-extrabold text-white text-center">
              Welcome Back
            </Text>
            <Text className="text-base text-gray-400 text-center">
              Resume your journey
            </Text>
          </View>

          {/* Form */}
          <MagicalCard>
            {errorMsg ? (
              <View className="mb-4 rounded-lg border border-red-500 bg-red-500/20 px-3 py-2">
                <Text className="text-center text-sm text-red-200">
                  {errorMsg}
                </Text>
              </View>
            ) : null}

            <View className="space-y-4">
              <MagicalInput
                iconName="mail-outline"
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <MagicalInput
                iconName="lock-closed-outline"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            
            {/* Forgot Password Link */}
            <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
                <Pressable onPress={() => router.push('/forget-password')}>
                  <Text style={{ color: '#E879F9', fontSize: 12, fontWeight: '600' }}>
                    Forgot Password?
                  </Text>
                </Pressable>
            </View>

            <View className="mt-5">
              <MagicalButton
                title="Sign In"
                onPress={signInWithEmail}
                isLoading={loading}
                disabled={loading}
              />
            </View>
          </MagicalCard>

          {/* Footer */}
          <View className="mt-8 flex-row justify-center">
            <Text className="text-base text-gray-400">
              First time here?
            </Text>
            <Link href="/signup">
              <Text className="text-base font-semibold text-fuchsia-500">
                {' '}Create account
              </Text>
            </Link>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconGlow: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
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
});