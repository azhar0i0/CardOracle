import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, Platform, Text, View } from 'react-native';
import { MagicalButton, MagicalCard, MagicalInput } from '../../components/MagicalUI';
import { supabase } from '../../lib/supabase';

const bgImage = require('../../assets/images/magic_bg.png');

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const signInWithEmail = async () => {
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.replace('/home');
    }

    setLoading(false);
  };

  return (
    <View className="flex-1 bg-slate-900">
      <ImageBackground
        source={bgImage}
        blurRadius={Platform.OS === 'web' ? 2 : 5}
        className="flex-1 justify-center"
      >
        {/* Overlay */}
        <View className="absolute inset-0 bg-black/60" />

        <View className="px-6">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-5xl font-extrabold text-white mb-2 text-center">
              Welcome Back
            </Text>
            <Text className="text-base text-gray-300 text-center">
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
      </ImageBackground>
    </View>
  );
}
